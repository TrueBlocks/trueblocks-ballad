package msgs

type EventType string

const (
	EventStatus        EventType = "statusbar:status"
	EventError         EventType = "statusbar:error"
	EventManager       EventType = "manager:change"
	EventDataLoaded    EventType = "data:loaded"
	EventTabCycle      EventType = "hotkey:tab-cycle"
	EventImagesChanged EventType = "images:changed"
	EventProjectOpened EventType = "project:opened"
)

var AllMessages = []struct {
	Value  EventType `json:"value"`
	TSName string    `json:"tsname"`
}{
	{EventStatus, "STATUS"},
	{EventError, "ERROR"},
	{EventManager, "MANAGER"},
	{EventDataLoaded, "DATA_LOADED"},
	{EventTabCycle, "TAB_CYCLE"},
	{EventImagesChanged, "IMAGES_CHANGED"},
	{EventProjectOpened, "PROJECT_OPENED"},
}
