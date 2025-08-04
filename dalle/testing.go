// testing.go
// Centralized test helpers and mocks for trueblocks-dalle
package dalle

import (
	"errors"
	"io"
	"net/http"
	"os"
)

// --- HTTP and template mocks (from prompt_test.go) ---
type mockRoundTripper struct {
	Resp *http.Response
	Err  error
}

func (m *mockRoundTripper) RoundTrip(req *http.Request) (*http.Response, error) {
	return m.Resp, m.Err
}

type badReader struct{}

func (badReader) Read([]byte) (int, error) { return 0, errors.New("read error") }
func (badReader) Close() error             { return nil }

var (
	openFile     = os.OpenFile
	annotateFunc = annotate
	httpGet      = http.Get
	ioCopy       = io.Copy
)

var openaiAPIURL = "https://api.openai.com/v1/images/generations"
