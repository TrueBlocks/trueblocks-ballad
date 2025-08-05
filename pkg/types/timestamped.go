package types

// Timestamped represents an item that has a timestamp for summary aggregation
type Timestamped interface {
	GetTimestamp() int64
}
