package store

import (
	"sync"
	"time"
)

// Period defines aggregation periods for summary data
type Period string

const (
	PeriodBlockly   Period = "blockly"   // No aggregation (default - returns raw data)
	PeriodHourly    Period = "hourly"    // Aggregate by hour
	PeriodDaily     Period = "daily"     // Aggregate by day
	PeriodWeekly    Period = "weekly"    // Aggregate by week
	PeriodMonthly   Period = "monthly"   // Aggregate by month
	PeriodQuarterly Period = "quarterly" // Aggregate by quarter
	PeriodAnnual    Period = "annual"    // Aggregate by year
)

// SummaryKey uniquely identifies a summary record by timestamp and period
type SummaryKey struct {
	Timestamp int64  // Unix timestamp for the period boundary
	Period    Period // Aggregation period
}

// SummaryManager manages aggregated summary data for a store
type SummaryManager[T any] struct {
	summaries map[SummaryKey]*T // Map of summary records by time period
	mutex     sync.RWMutex      // Protects concurrent access
}

// NewSummaryManager creates a new summary manager for type T
func NewSummaryManager[T any]() *SummaryManager[T] {
	return &SummaryManager[T]{
		summaries: make(map[SummaryKey]*T),
	}
}

// AddOrUpdateSummary adds or updates a summary record for the given period
func (sm *SummaryManager[T]) AddOrUpdateSummary(timestamp int64, period Period, item *T) {
	sm.mutex.Lock()
	defer sm.mutex.Unlock()
	
	// Normalize timestamp to period boundary
	normalizedTimestamp := sm.normalizeToPeriod(timestamp, period)
	
	key := SummaryKey{
		Timestamp: normalizedTimestamp,
		Period:    period,
	}
	
	sm.summaries[key] = item
}

// GetSummaries returns all summary records for the given period
func (sm *SummaryManager[T]) GetSummaries(period Period) []*T {
	sm.mutex.RLock()
	defer sm.mutex.RUnlock()
	
	var results []*T
	for key, item := range sm.summaries {
		if key.Period == period {
			results = append(results, item)
		}
	}
	
	return results
}

// GetSummary returns a specific summary record for timestamp and period
func (sm *SummaryManager[T]) GetSummary(timestamp int64, period Period) *T {
	sm.mutex.RLock()
	defer sm.mutex.RUnlock()
	
	normalizedTimestamp := sm.normalizeToPeriod(timestamp, period)
	key := SummaryKey{
		Timestamp: normalizedTimestamp,
		Period:    period,
	}
	
	return sm.summaries[key]
}

// Reset clears all summary data
func (sm *SummaryManager[T]) Reset() {
	sm.mutex.Lock()
	defer sm.mutex.Unlock()
	
	sm.summaries = make(map[SummaryKey]*T)
}

// normalizeToPeriod converts a timestamp to the period boundary
func (sm *SummaryManager[T]) normalizeToPeriod(timestamp int64, period Period) int64 {
	t := time.Unix(timestamp, 0).UTC()
	
	switch period {
	case PeriodBlockly:
		// No aggregation - return original timestamp
		return timestamp
	case PeriodHourly:
		// Round down to hour boundary
		return time.Date(t.Year(), t.Month(), t.Day(), t.Hour(), 0, 0, 0, t.Location()).Unix()
	case PeriodDaily:
		// Round down to day boundary
		return time.Date(t.Year(), t.Month(), t.Day(), 0, 0, 0, 0, t.Location()).Unix()
	case PeriodWeekly:
		// Round down to week boundary (Monday)
		weekday := int(t.Weekday())
		if weekday == 0 { // Sunday = 0, but we want Monday = 0
			weekday = 7
		}
		daysBack := weekday - 1
		weekStart := t.AddDate(0, 0, -daysBack)
		return time.Date(weekStart.Year(), weekStart.Month(), weekStart.Day(), 0, 0, 0, 0, t.Location()).Unix()
	case PeriodMonthly:
		// Round down to month boundary
		return time.Date(t.Year(), t.Month(), 1, 0, 0, 0, 0, t.Location()).Unix()
	case PeriodQuarterly:
		// Round down to quarter boundary
		quarter := ((int(t.Month()) - 1) / 3) * 3 + 1
		return time.Date(t.Year(), time.Month(quarter), 1, 0, 0, 0, 0, t.Location()).Unix()
	case PeriodAnnual:
		// Round down to year boundary
		return time.Date(t.Year(), 1, 1, 0, 0, 0, 0, t.Location()).Unix()
	default:
		return timestamp
	}
}
