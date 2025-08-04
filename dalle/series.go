package dalle

import (
	"encoding/json"
	"fmt"
	"reflect"

	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/file"
)

// Series represents a collection of prompt attributes and their values.
type Series struct {
	Last         int      `json:"last,omitempty"`
	Suffix       string   `json:"suffix"`
	Adverbs      []string `json:"adverbs"`
	Adjectives   []string `json:"adjectives"`
	Nouns        []string `json:"nouns"`
	Emotions     []string `json:"emotions"`
	Occupations  []string `json:"occupations"`
	Actions      []string `json:"actions"`
	Artstyles    []string `json:"artstyles"`
	Litstyles    []string `json:"litstyles"`
	Colors       []string `json:"colors"`
	Orientations []string `json:"orientations"`
	Gazes        []string `json:"gazes"`
	Backstyles   []string `json:"backstyles"`
}

// String returns the JSON representation of the Series.
func (s *Series) String() string {
	bytes, _ := json.MarshalIndent(s, "", "  ")
	return string(bytes)
}

// SaveSeries saves the Series to a file with the given filename and last index.
func (s *Series) SaveSeries(fn string, last int) {
	ss := s
	ss.Last = last
	_ = file.EstablishFolder("output/series")
	_ = file.StringToAsciiFile(fn, ss.String())
}

// GetFilter returns a string slice for the given field name in the Series.
func (s *Series) GetFilter(fieldName string) ([]string, error) {
	reflectedT := reflect.ValueOf(s)
	field := reflect.Indirect(reflectedT).FieldByName(fieldName)
	if !field.IsValid() {
		return nil, fmt.Errorf("field %s not valid", fieldName)
	}
	if field.Kind() != reflect.Slice {
		return nil, fmt.Errorf("field %s not a slice", fieldName)
	}
	if field.Type().Elem().Kind() != reflect.String {
		return nil, fmt.Errorf("field %s not a string slice", fieldName)
	}
	return field.Interface().([]string), nil
}

// func (a *App) GetSeries(baseFolder string) []utils.Series {
// 	folder := filepath.Join(baseFolder)
// 	if list, err := utils.Listing(folder); err != nil {
// 		return []utils.Series{utils.Series(err.Error())}
// 	} else {
// 		return list
// 	}
// }
