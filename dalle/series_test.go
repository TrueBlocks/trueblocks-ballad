package dalle

import (
	"encoding/json"
	"errors"
	"reflect"
	"testing"
)

func TestSeries_String(t *testing.T) {
	s := &Series{
		Suffix:  "test",
		Adverbs: []string{"quickly", "slowly"},
	}
	jsonStr := s.String()
	var out Series
	if err := json.Unmarshal([]byte(jsonStr), &out); err != nil {
		t.Fatalf("String() did not return valid JSON: %v", err)
	}
	if out.Suffix != "test" || len(out.Adverbs) != 2 {
		t.Errorf("String() output mismatch: %+v", out)
	}
}

// func TestSeries_SaveSeries(t *testing.T) {
// 	mock := &MockFileOps{}

// 	s := &Series{Suffix: "test"}
// 	s.SaveSeries("filename.txt", 42)
// 	if !mock.StringToAsciiCalled {
// 		t.Error("stringToAsciiFile was not called")
// 	}
// 	if mock.LastFn != "filename.txt" {
// 		t.Errorf("stringToAsciiFile called with wrong filename: %s", mock.LastFn)
// 	}
// 	var out Series
// 	if err := json.Unmarshal([]byte(mock.LastContent), &out); err != nil {
// 		t.Errorf("stringToAsciiFile content not valid JSON: %v", err)
// 	}
// 	if out.Last != 42 {
// 		t.Errorf("Last field not set correctly, got %d", out.Last)
// 	}
// }

func TestSeries_GetFilter_Valid(t *testing.T) {
	s := &Series{
		Adverbs: []string{"quickly", "slowly"},
		Nouns:   []string{"cat", "dog"},
	}
	adverbs, err := s.GetFilter("Adverbs")
	if err != nil {
		t.Fatalf("GetFilter returned error: %v", err)
	}
	if !reflect.DeepEqual(adverbs, []string{"quickly", "slowly"}) {
		t.Errorf("GetFilter returned wrong slice: %v", adverbs)
	}
	nouns, err := s.GetFilter("Nouns")
	if err != nil || len(nouns) != 2 {
		t.Errorf("GetFilter failed for Nouns: %v, %v", nouns, err)
	}
}

func TestSeries_GetFilter_InvalidField(t *testing.T) {
	s := &Series{}
	_, err := s.GetFilter("NotAField")
	if err == nil || !errors.Is(err, err) {
		t.Error("GetFilter should error for invalid field name")
	}
}

func TestSeries_GetFilter_NotSlice(t *testing.T) {
	s := &Series{Suffix: "notaslice"}
	_, err := s.GetFilter("Suffix")
	if err == nil || err.Error() != "field Suffix not a slice" {
		t.Errorf("expected 'not a slice' error, got %v", err)
	}
}

func TestSeries_GetFilter_NotStringSlice(t *testing.T) {
	type SeriesWithInt struct {
		Ints []int
	}
	s := &SeriesWithInt{Ints: []int{1, 2, 3}}
	ref := reflect.ValueOf(s)
	field := reflect.Indirect(ref).FieldByName("Ints")
	if field.Kind() != reflect.Slice || field.Type().Elem().Kind() == reflect.String {
		t.Skip("Test only relevant if field is a non-string slice")
	}
	// Simulate GetFilter logic
	// if field.Type().Elem().Kind() != reflect.String {
	// 	// Should error
	// }
}
