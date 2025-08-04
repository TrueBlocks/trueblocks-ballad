package dalle

import (
	"bytes"
	"encoding/json"
	"fmt"
	"strings"
	"text/template"
)

// DalleDress represents a generated prompt and its associated attributes.
type DalleDress struct {
	Original       string               `json:"original"`
	Filename       string               `json:"fileName"`
	Seed           string               `json:"seed"`
	Prompt         string               `json:"prompt,omitempty"`
	DataPrompt     string               `json:"dataPrompt,omitempty"`
	TitlePrompt    string               `json:"titlePrompt,omitempty"`
	TersePrompt    string               `json:"tersePrompt,omitempty"`
	EnhancedPrompt string               `json:"enhancedPrompt,omitempty"`
	Attribs        []Attribute          `json:"attributes"`
	AttribMap      map[string]Attribute `json:"-"`
}

// String returns the JSON representation of the DalleDress.
func (d *DalleDress) String() string {
	jsonData, _ := json.MarshalIndent(d, "", "  ")
	return string(jsonData)
}

// ExecuteTemplate executes a template with DalleDress data and an optional post-processing function.
func (dd *DalleDress) ExecuteTemplate(t *template.Template, f func(s string) string) (string, error) {
	var buffer bytes.Buffer
	if err := t.Execute(&buffer, dd); err != nil {
		return "", err
	}
	if f == nil {
		return buffer.String(), nil
	}
	return f(buffer.String()), nil
}

// Adverb returns the adverb attribute, optionally in short form.
func (dd *DalleDress) Adverb(short bool) string {
	val := dd.AttribMap["adverb"].Value
	parts := strings.Split(val, ",")
	if short {
		return parts[0]
	}
	return parts[0] + " (" + parts[1] + ")"
}

// Adjective returns the adjective attribute, optionally in short form.
func (dd *DalleDress) Adjective(short bool) string {
	val := dd.AttribMap["adjective"].Value
	parts := strings.Split(val, ",")
	if short {
		return parts[0]
	}
	return parts[0] + " (" + parts[1] + ")"
}

// Noun returns the noun attribute, optionally in short form.
func (dd *DalleDress) Noun(short bool) string {
	val := dd.AttribMap["noun"].Value
	parts := strings.Split(val, ",")
	if short {
		return parts[0]
	}
	return parts[0] + " (" + parts[1] + ", " + parts[2] + ")"
}

// Emotion returns the emotion attribute, optionally in short form.
func (dd *DalleDress) Emotion(short bool) string {
	val := dd.AttribMap["emotion"].Value
	parts := strings.Split(val, ",")
	if short {
		return parts[0]
	}
	return parts[0] + " (" + parts[1] + ", " + parts[4] + ")"
}

// Occupation returns the occupation attribute, optionally in short form.
func (dd *DalleDress) Occupation(short bool) string {
	val := dd.AttribMap["occupation"].Value
	if val == "none" {
		return ""
	}
	parts := strings.Split(val, ",")
	if short {
		return parts[0]
	}
	return " who works as a " + parts[0] + " (" + parts[1] + ")"
}

// Action returns the action attribute, optionally in short form.
func (dd *DalleDress) Action(short bool) string {
	val := dd.AttribMap["action"].Value
	parts := strings.Split(val, ",")
	if short {
		return parts[0]
	}
	return parts[0] + " (" + parts[1] + ")"
}

// ArtStyle returns the art style attribute, optionally in short form.
func (dd *DalleDress) ArtStyle(short bool, which int) string {
	val := dd.AttribMap["artStyle"+fmt.Sprintf("%d", which)].Value
	parts := strings.Split(val, ",")
	if short {
		return parts[0]
	}
	if strings.HasPrefix(parts[2], parts[0]+" ") {
		parts[2] = strings.Replace(parts[2], (parts[0] + " "), "", 1)
	}
	return parts[0] + " (" + parts[2] + ")"
}

// HasLitStyle checks if the lit style attribute is present and not "none".
func (dd *DalleDress) HasLitStyle() bool {
	ret := dd.AttribMap["litStyle"].Value
	return ret != "none" && ret != ""
}

// LitStyle returns the lit style attribute, optionally in short form.
func (dd *DalleDress) LitStyle(short bool) string {
	val := dd.AttribMap["litStyle"].Value
	if val == "none" {
		return ""
	}
	parts := strings.Split(val, ",")
	if short {
		return parts[0]
	}
	if strings.HasPrefix(parts[1], parts[0]+" ") {
		parts[1] = strings.Replace(parts[1], (parts[0] + " "), "", 1)
	}
	return parts[0] + " (" + parts[1] + ")"
}

// LitStyleDescr returns the description of the lit style attribute.
func (dd *DalleDress) LitStyleDescr() string {
	val := dd.AttribMap["litStyle"].Value
	if val == "none" {
		return ""
	}
	parts := strings.Split(val, ",")
	if strings.HasPrefix(parts[1], parts[0]+" ") {
		parts[1] = strings.Replace(parts[1], (parts[0] + " "), "", 1)
	}
	return parts[1]
}

// Color returns the color attribute, optionally in short form.
func (dd *DalleDress) Color(short bool, which int) string {
	val := dd.AttribMap["color"+fmt.Sprintf("%d", which)].Value
	parts := strings.Split(val, ",")
	if short {
		return parts[1]
	}
	return parts[1] + " (" + parts[0] + ")"
}

// Orientation returns the orientation attribute, optionally in short form.
func (dd *DalleDress) Orientation(short bool) string {
	val := dd.AttribMap["orientation"].Value
	if short {
		parts := strings.Split(val, ",")
		return parts[0]
	}
	ret := `Orient the scene [{ORI}] and make sure the [{NOUN}] is facing [{GAZE}]`
	ret = strings.ReplaceAll(ret, "[{ORI}]", strings.ReplaceAll(val, ",", " and "))
	ret = strings.ReplaceAll(ret, "[{NOUN}]", dd.Noun(true))
	ret = strings.ReplaceAll(ret, "[{GAZE}]", dd.Gaze(true))
	return ret
}

// Gaze returns the gaze attribute, optionally in short form.
func (dd *DalleDress) Gaze(short bool) string {
	val := dd.AttribMap["gaze"].Value
	if short {
		parts := strings.Split(val, ",")
		return parts[0]
	}
	return strings.ReplaceAll(val, ",", ", ")
}

// BackStyle returns the back style attribute, optionally in short form.
func (dd *DalleDress) BackStyle(short bool) string {
	val := dd.AttribMap["backStyle"].Value
	val = strings.ReplaceAll(val, "[{Color3}]", dd.Color(true, 3))
	val = strings.ReplaceAll(val, "[{ArtStyle2}]", dd.ArtStyle(false, 2))
	return val
}

// LitPrompt generates a literary prompt based on the lit style attribute.
func (dd *DalleDress) LitPrompt(short bool) string {
	val := dd.AttribMap["litStyle"].Value
	if val == "none" {
		return ""
	}
	text := `Please give me a detailed rewrite of the following
	prompt in the literary style ` + dd.LitStyle(short) + `. 
	Be imaginative, creative, and complete.
`
	return text
}
