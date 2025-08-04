// prompt_test.go
package dalle

import (
	"bytes"
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"strings"
	"testing"
)

// Use centralized mocks from testing.go

func TestEnhancePrompt_Success(t *testing.T) {
	mockBody := `{"choices":[{"message":{"content":"Enhanced prompt!"}}]}`
	client := &http.Client{
		Transport: &mockRoundTripper{
			Resp: &http.Response{
				StatusCode: 200,
				Body:       io.NopCloser(bytes.NewBufferString(mockBody)),
				Header:     make(http.Header),
			},
		},
	}
	result, err := enhancePromptWithClient("prompt", "author", client, "test-key", json.Marshal)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if result != "Enhanced prompt!" {
		t.Errorf("expected 'Enhanced prompt!', got '%s'", result)
	}
}

func TestEnhancePrompt_JSONMarshalError(t *testing.T) {
	client := &http.Client{}
	badMarshal := func(v interface{}) ([]byte, error) { return nil, errors.New("marshal error") }
	_, err := enhancePromptWithClient("prompt", "author", client, "key", badMarshal)
	if err == nil || err.Error() != "marshal error" {
		t.Errorf("expected marshal error, got %v", err)
	}
}

func TestEnhancePrompt_HTTPError(t *testing.T) {
	client := &http.Client{
		Transport: &mockRoundTripper{Err: errors.New("network error")},
	}
	_, err := enhancePromptWithClient("prompt", "author", client, "key", json.Marshal)
	if err == nil || !strings.Contains(err.Error(), "network error") {
		t.Errorf("expected error containing 'network error', got %v", err)
	}
}

func TestEnhancePrompt_BodyReadError(t *testing.T) {
	errReadCloser := io.NopCloser(badReader{})
	client := &http.Client{
		Transport: &mockRoundTripper{
			Resp: &http.Response{
				StatusCode: 200,
				Body:       errReadCloser,
				Header:     make(http.Header),
			},
		},
	}
	_, err := enhancePromptWithClient("prompt", "author", client, "key", json.Marshal)
	if err == nil || err.Error() != "read error" {
		t.Errorf("expected read error, got %v", err)
	}
}

func TestEnhancePrompt_UnmarshalError(t *testing.T) {
	client := &http.Client{
		Transport: &mockRoundTripper{
			Resp: &http.Response{
				StatusCode: 200,
				Body:       io.NopCloser(bytes.NewBufferString("not json")),
				Header:     make(http.Header),
			},
		},
	}
	_, err := enhancePromptWithClient("prompt", "author", client, "key", json.Marshal)
	if err == nil {
		t.Errorf("expected unmarshal error, got nil")
	}
}

func TestEnhancePrompt_EmptyAPIKey(t *testing.T) {
	client := &http.Client{
		Transport: &mockRoundTripper{
			Resp: &http.Response{
				StatusCode: 200,
				Body:       io.NopCloser(bytes.NewBufferString(`{"choices":[{"message":{"content":"Enhanced!"}}]}`)),
				Header:     make(http.Header),
			},
		},
	}
	// Should still work, but header will be empty
	result, err := enhancePromptWithClient("prompt", "author", client, "", json.Marshal)
	if err != nil || result != "Enhanced!" {
		t.Errorf("expected success with empty API key, got %v, %s", err, result)
	}
}

// Use centralized MockDress from testing.go

// func TestTemplates_ParseAndRender(t *testing.T) {
// 	templates := []struct {
// 		tmpl *template.Template
// 		name string
// 	}{
// 		{promptTemplate, "promptTemplate"},
// 		{dataTemplate, "dataTemplate"},
// 		{terseTemplate, "terseTemplate"},
// 		{titleTemplate, "titleTemplate"},
// 		{authorTemplate, "authorTemplate"},
// 	}

// 	for _, tc := range templates {
// 		var buf bytes.Buffer
// 		err := tc.tmpl.Execute(&buf, MockDress{})
// 		if err != nil {
// 			t.Errorf("%s failed to render: %v", tc.name, err)
// 		}
// 		if buf.Len() == 0 {
// 			t.Errorf("%s rendered empty output", tc.name)
// 		}
// 	}
// }
