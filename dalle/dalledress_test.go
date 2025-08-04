package dalle

import (
	"strings"
	"testing"
	"text/template"
)

func TestDalleDress_String(t *testing.T) {
	d := &DalleDress{Original: "foo", Filename: "bar", Seed: "baz"}
	json := d.String()
	if !strings.Contains(json, "foo") || !strings.Contains(json, "bar") || !strings.Contains(json, "baz") {
		t.Errorf("String() did not include expected fields: %s", json)
	}
}

func TestDalleDress_ExecuteTemplate(t *testing.T) {
	tmpl := template.Must(template.New("x").Parse("{{.Original}}-{{.Filename}}"))
	d := &DalleDress{Original: "foo", Filename: "bar"}
	out, err := d.ExecuteTemplate(tmpl, nil)
	if err != nil {
		t.Fatalf("ExecuteTemplate failed: %v", err)
	}
	if out != "foo-bar" {
		t.Errorf("ExecuteTemplate output wrong: %s", out)
	}
	// With post-processing
	out2, err2 := d.ExecuteTemplate(tmpl, strings.ToUpper)
	if err2 != nil || out2 != "FOO-BAR" {
		t.Errorf("ExecuteTemplate post-processing failed: %s", out2)
	}
}

func TestDalleDress_Adverb(t *testing.T) {
	d := &DalleDress{AttribMap: map[string]Attribute{"adverb": {Value: "quickly,fast"}}}
	if d.Adverb(true) != "quickly" {
		t.Error("Adverb(true) wrong")
	}
	if !strings.Contains(d.Adverb(false), "quickly") {
		t.Error("Adverb(false) wrong")
	}
}

func TestDalleDress_HasLitStyle(t *testing.T) {
	d := &DalleDress{AttribMap: map[string]Attribute{"litStyle": {Value: "none"}}}
	if d.HasLitStyle() {
		t.Error("HasLitStyle should be false for 'none'")
	}
	d.AttribMap["litStyle"] = Attribute{Value: "foo,bar"}
	if !d.HasLitStyle() {
		t.Error("HasLitStyle should be true for non-none")
	}
}

func TestDalleDress_Color(t *testing.T) {
	d := &DalleDress{AttribMap: map[string]Attribute{"color1": {Value: "red,#ff0000"}}}
	if d.Color(true, 1) != "#ff0000" {
		t.Error("Color(true, 1) wrong")
	}
	if !strings.Contains(d.Color(false, 1), "#ff0000") {
		t.Error("Color(false, 1) wrong")
	}
}
