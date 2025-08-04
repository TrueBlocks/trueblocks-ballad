package types

// Period represents different time aggregation levels
type Period int

const (
	PeriodBlockly Period = iota // Default - no aggregation, raw data
	PeriodHourly
	PeriodDaily
	PeriodWeekly
	PeriodMonthly
	PeriodQuarterly
	PeriodAnnual
)

type Payload struct {
	Collection string    `json:"collection"`
	DataFacet  DataFacet `json:"dataFacet"`
	Chain      string    `json:"chain,omitempty"`
	Address    string    `json:"address,omitempty"`
	Period     Period    `json:"period,omitempty"`
}

type DataLoadedPayload struct {
	Payload
	CurrentCount  int       `json:"currentCount"`
	ExpectedTotal int       `json:"expectedTotal"`
	State         LoadState `json:"state"`
	Summary       Summary   `json:"summary"`
	Error         string    `json:"error,omitempty"`
	Timestamp     int64     `json:"timestamp"`
	EventPhase    string    `json:"eventPhase"`
}

type ProjectPayload struct {
	HasProject    bool                 `json:"hasProject"`
	ActiveChain   string               `json:"activeChain"`
	ActiveAddress string               `json:"activeAddress"`
	LastView      string               `json:"lastView"`
	LastFacetMap  map[string]DataFacet `json:"lastFacetMap"`
}
