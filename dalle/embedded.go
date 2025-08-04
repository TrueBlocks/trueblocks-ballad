package dalle

import (
	"archive/tar"
	"bytes"
	"compress/gzip"
	_ "embed"
	"errors"
	"io"
	"path/filepath"
	"strings"
)

//go:embed databases.tar.gz
var embeddedDbs []byte

// readDatabaseCSV extracts the named CSV file from the embedded .tar.gz and returns its lines.
func readDatabaseCSV(name string) ([]string, error) {
	gzr, err := gzip.NewReader(bytes.NewReader(embeddedDbs))
	if err != nil {
		return nil, err
	}
	defer gzr.Close()

	tr := tar.NewReader(gzr)
	for {
		hdr, err := tr.Next()
		if err == io.EOF {
			break // End of archive
		}
		if err != nil {
			return nil, err
		}
		needle := filepath.Join("databases", name)
		if hdr.Name == needle {
			var buf bytes.Buffer
			if _, err := io.Copy(&buf, tr); err != nil {
				return nil, err
			}
			lines := strings.Split(strings.ReplaceAll(buf.String(), "\r\n", "\n"), "\n")
			if len(lines) > 0 && lines[len(lines)-1] == "" {
				lines = lines[:len(lines)-1]
			}
			return lines, nil
		}
	}
	return nil, errors.New("file not found in archive: " + name)
}
