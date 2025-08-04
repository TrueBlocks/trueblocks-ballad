package dalle

import "encoding/json"

// message represents a message for the OpenAI API request.
type message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

// dalleRequest represents a request payload for the OpenAI API.
type dalleRequest struct {
	Input     string    `json:"input,omitempty"`
	Prompt    string    `json:"prompt,omitempty"`
	N         int       `json:"n,omitempty"`
	Quality   string    `json:"quality,omitempty"`
	Model     string    `json:"model,omitempty"`
	Style     string    `json:"style,omitempty"`
	Size      string    `json:"size,omitempty"`
	Seed      int       `json:"seed,omitempty"`
	Tempature float64   `json:"temperature,omitempty"`
	Messages  []message `json:"messages,omitempty"`
}

// String returns the JSON representation of the dalleRequest.
func (req *dalleRequest) String() string {
	bytes, _ := json.MarshalIndent(req, "", "  ")
	return string(bytes)
}

type dalleResponse1 struct {
	Data []struct {
		Url string `json:"url"`
	} `json:"data"`
}
