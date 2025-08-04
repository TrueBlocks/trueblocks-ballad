package dalle

import (
	"sync"
	"testing"
	"text/template"
)

// --- Test helpers ---
func minimalContext(t *testing.T) *Context {
	tmpl := template.Must(template.New("x").Parse("ok"))
	tmpDir := t.TempDir()
	return &Context{
		promptTemplate: tmpl,
		dataTemplate:   tmpl,
		titleTemplate:  tmpl,
		terseTemplate:  tmpl,
		authorTemplate: tmpl,
		Series:         Series{Suffix: "test"},
		Databases: map[string][]string{
			"adverbs":      {"quickly,quick,fast"},
			"adjectives":   {"red,red,red"},
			"nouns":        {"cat,cat,cat"},
			"emotions":     {"happy,happy,happy,happy,happy"},
			"occupations":  {"none,none"},
			"actions":      {"run,run"},
			"artstyles":    {"modern,modern,modern"},
			"litstyles":    {"none,none"},
			"colors":       {"blue,blue"},
			"orientations": {"left,left"},
			"gazes":        {"forward,forward"},
			"backstyles":   {"plain,plain"},
		},
		DalleCache: make(map[string]*DalleDress),
		CacheMutex: sync.Mutex{},
		OutputPath: tmpDir,
	}
}

// --- Tests ---
func TestMakeDalleDress_ValidAndCache(t *testing.T) {
	ctx := minimalContext(t)
	addr := "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"

	dress, err := ctx.MakeDalleDress(addr)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if dress == nil {
		t.Fatal("expected non-nil DalleDress")
	}

	dress2, err2 := ctx.MakeDalleDress(addr)
	if err2 != nil || dress2 != dress {
		t.Error("expected cached DalleDress to be returned")
	}
}

func TestMakeDalleDress_InvalidAddress(t *testing.T) {
	ctx := minimalContext(t)
	addr := "short"
	_, err := ctx.MakeDalleDress(addr)
	if err == nil || err.Error() != "seed length is less than 66" {
		t.Errorf("expected seed length error, got %v", err)
	}
}

func TestGetPromptAndEnhanced(t *testing.T) {
	ctx := minimalContext(t)

	addr := "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
	_, _ = ctx.MakeDalleDress(addr) // populate cache
	if got := ctx.GetPrompt(addr); got == "" {
		t.Errorf("GetPrompt = %q, want non-empty", got)
	}
	if got := ctx.GetEnhanced(addr); got != "" {
		t.Errorf("GetEnhanced = %q, want empty (no enhanced prompt)", got)
	}
}

func TestSave(t *testing.T) {
	ctx := minimalContext(t)

	addr := "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
	_, _ = ctx.MakeDalleDress(addr)
	if !ctx.Save(addr) {
		t.Error("Save should return true on success")
	}
	if ctx.Save("short") {
		t.Error("Save should return false on error")
	}
}

// Additional tests for GenerateEnhanced and GenerateImage would require more extensive mocking and are omitted for brevity.
