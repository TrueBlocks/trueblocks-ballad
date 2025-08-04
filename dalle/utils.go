package dalle

import "strings"

// validFilename returns a valid filename from the input string.
func validFilename(in string) string {
	invalidChars := []string{"/", "\\", ":", "*", "?", "\"", "<", ">", "|"}
	for _, char := range invalidChars {
		in = strings.ReplaceAll(in, char, "_")
	}
	in = strings.TrimSpace(in)
	in = strings.ReplaceAll(in, "__", "_")
	return in
}

// reverse returns the reverse of the input string.
func reverse(s string) string {
	runes := []rune(s)
	n := len(runes)
	for i := 0; i < n/2; i++ {
		runes[i], runes[n-1-i] = runes[n-1-i], runes[i]
	}
	return string(runes)
}
