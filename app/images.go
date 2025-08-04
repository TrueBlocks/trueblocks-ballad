package app

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/TrueBlocks/trueblocks-ballad/pkg/fileserver"
	"github.com/fsnotify/fsnotify"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// GetImageURL returns a URL for serving an image file, creating sample files if needed
func (a *App) GetImageURL(relativePath string) string {
	if a.fileServer == nil {
		return ""
	}

	basePath := ""
	if path, err := filepath.Abs(a.fileServer.GetBasePath()); err == nil {
		basePath = path
	}

	if basePath == "" {
		return ""
	}

	cleanPath := filepath.Clean(relativePath)
	cleanPath = strings.TrimPrefix(cleanPath, "/")

	pathWithoutQuery := cleanPath
	if idx := strings.Index(cleanPath, "?"); idx > 0 {
		pathWithoutQuery = cleanPath[:idx]
	}

	fullPath := filepath.Join(basePath, pathWithoutQuery)
	if _, err := os.Stat(fullPath); os.IsNotExist(err) {
		if strings.HasPrefix(pathWithoutQuery, "samples/") {
			// Only create samples if we have a valid base path to avoid polluting current directory
			if basePath == "" {
				log.Printf("GetImageURL: Cannot create samples without a valid base path")
				return ""
			}
			sampleDir := filepath.Join(basePath, "samples")
			if err := os.MkdirAll(sampleDir, 0755); err != nil {
				log.Printf("GetImageURL: Failed to create samples directory: %v", err)
			}
			if err := fileserver.CreateSampleFiles(basePath); err != nil {
				log.Printf("GetImageURL: Failed to recreate sample files: %v", err)
			}
			// Wait up to 200ms for the file to appear
			for i := 0; i < 4; i++ {
				if _, err := os.Stat(fullPath); err == nil {
					url := a.fileServer.GetURL(cleanPath)
					return url
				}
				time.Sleep(50 * time.Millisecond)
			}
		}
		return ""
	}

	url := a.fileServer.GetURL(cleanPath)
	return url
}

// ChangeImageStorageLocation updates the base path for the file server
func (a *App) ChangeImageStorageLocation(newPath string) error {
	if a.fileServer == nil {
		return fmt.Errorf("file server not initialized")
	}
	return a.fileServer.UpdateBasePath(newPath)
}

// watchImagesDir monitors the images directory for changes and emits events
func (a *App) watchImagesDir() {
	basePath := a.fileServer.GetBasePath()
	imagesDir := filepath.Join(basePath, "samples")
	watcher, err := fsnotify.NewWatcher()
	if err != nil {
		log.Printf("Failed to create fsnotify watcher: %v", err)
		return
	}
	defer watcher.Close()

	_ = watcher.Add(imagesDir)

	debounce := make(chan struct{}, 1)
	go func() {
		for range debounce {
			time.Sleep(300 * time.Millisecond)
			// TDOO: Technically, this should be an event
			runtime.EventsEmit(a.ctx, "images:changed", "Images directory changed")
		}
	}()

	for {
		select {
		case event, ok := <-watcher.Events:
			if !ok {
				return
			}
			if event.Op&(fsnotify.Create|fsnotify.Remove|fsnotify.Rename) != 0 {
				select {
				case debounce <- struct{}{}:
				default:
				}
			}
		case err, ok := <-watcher.Errors:
			if !ok {
				return
			}
			log.Printf("fsnotify error: %v", err)
		}
	}
}
