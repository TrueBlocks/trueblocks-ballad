package dalle

import (
	"image"
	"image/color"
	"image/draw"
	"testing"
)

func TestParseHexColor_Valid(t *testing.T) {
	c, err := parseHexColor("#FF00FF")
	if err != nil {
		t.Fatalf("parseHexColor failed: %v", err)
	}
	rgba, ok := c.(color.RGBA)
	if !ok || rgba.R != 255 || rgba.G != 0 || rgba.B != 255 || rgba.A != 255 {
		t.Errorf("parseHexColor returned wrong color: %+v", c)
	}
}

func TestParseHexColor_Invalid(t *testing.T) {
	_, err := parseHexColor("not-a-color")
	if err == nil {
		t.Error("expected error for invalid hex color")
	}
}

func TestDarkenColor(t *testing.T) {
	c := color.RGBA{R: 100, G: 150, B: 200, A: 255}
	out := darkenColor(c).(color.RGBA)
	if out.R >= 100 || out.G >= 150 || out.B >= 200 {
		t.Errorf("darkenColor did not darken: %+v", out)
	}
}

func TestContrastColor(t *testing.T) {
	c := color.RGBA{R: 255, G: 255, B: 255, A: 255}
	contrast, _ := contrastColor(c)
	if _, ok := contrast.(color.RGBA); !ok {
		t.Error("contrastColor did not return color.RGBA")
	}
}

func TestFindAverageDominantColor(t *testing.T) {
	img := image.NewRGBA(image.Rect(0, 0, 2, 2))
	draw.Draw(img, img.Bounds(), &image.Uniform{color.RGBA{R: 10, G: 20, B: 30, A: 255}}, image.Point{}, draw.Src)
	hex, err := findAverageDominantColor(img)
	if err != nil {
		t.Fatalf("findAverageDominantColor failed: %v", err)
	}
	if len(hex) == 0 || hex[0] != '#' {
		t.Errorf("findAverageDominantColor returned invalid hex: %s", hex)
	}
}

// Note: Full integration test for annotate() would require file and font mocking, which is non-trivial and OS-dependent.
// The above tests cover the core logic and helpers.
