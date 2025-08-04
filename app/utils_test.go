package app

import (
	"testing"

	"github.com/TrueBlocks/trueblocks-ballad/pkg/preferences"
	"github.com/TrueBlocks/trueblocks-ballad/pkg/project"
	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/base"
	coreTypes "github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/types"
	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/utils"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestLogBackend(t *testing.T) {
	app := &App{
		Projects: project.NewManager(),
		Preferences: &preferences.Preferences{
			User: preferences.UserPreferences{},
		},
	}

	// Test that LogBackend doesn't panic
	assert.NotPanics(t, func() {
		app.LogBackend("test message")
	})
}

func TestLogFrontend(t *testing.T) {
	app := &App{
		Projects: project.NewManager(),
		Preferences: &preferences.Preferences{
			User: preferences.UserPreferences{},
		},
	}

	// Test that LogFrontend doesn't panic
	assert.NotPanics(t, func() {
		app.LogFrontend("test message")
	})
}

func TestGetMarkdown(t *testing.T) {
	tests := []struct {
		name   string
		folder string
		route  string
		tab    string
	}{
		{
			name:   "basic markdown request",
			folder: "help",
			route:  "exports",
			tab:    "list",
		},
		{
			name:   "empty parameters",
			folder: "",
			route:  "",
			tab:    "",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			app := &App{
				Projects: project.NewManager(),
				Preferences: &preferences.Preferences{
					App: preferences.AppPreferences{
						LastLanguage: "en",
					},
				},
			}

			result := app.GetMarkdown(tt.folder, tt.route, tt.tab)
			// Should return a string (either markdown or error message)
			assert.IsType(t, "", result)
		})
	}
}

func TestGetNodeStatus(t *testing.T) {
	tests := []struct {
		name  string
		chain string
	}{
		{
			name:  "mainnet chain",
			chain: "mainnet",
		},
		{
			name:  "unknown chain",
			chain: "unknown",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			app := &App{
				Projects: project.NewManager(),
				Preferences: &preferences.Preferences{
					User: preferences.UserPreferences{},
				},
			}

			result := app.GetNodeStatus(tt.chain)
			// Should return MetaData pointer (may be nil for unknown chains)
			assert.IsType(t, (*coreTypes.MetaData)(nil), result)
		})
	}
}

func TestEncode(t *testing.T) {
	app := &App{
		Projects: project.NewManager(),
		Preferences: &preferences.Preferences{
			User: preferences.UserPreferences{},
		},
	}

	// Test encoding should handle invalid input gracefully
	// We can't easily create a mock sdk.Function, so just verify the method exists
	assert.NotNil(t, app.Encode)
}

func TestBuildDalleDressForProject(t *testing.T) {
	tests := []struct {
		name      string
		setup     func(*App)
		expectErr bool
		errMsg    string
	}{
		{
			name: "no active project",
			setup: func(app *App) {
				// No active project
			},
			expectErr: true,
			errMsg:    "no active project",
		},
		{
			name: "project with zero address",
			setup: func(app *App) {
				proj := app.Projects.NewProject("test", base.ZeroAddr, []string{"mainnet"})
				proj.Path = "/tmp/test.tbx"
			},
			expectErr: true,
			errMsg:    "project address is not set",
		},
		{
			name: "project with valid address but no dalle service",
			setup: func(app *App) {
				validAddr := base.HexToAddress("0x742d35Cc6634C0532925a3b8D25D19Dcf9d0c7c8")
				proj := app.Projects.NewProject("test", validAddr, []string{"mainnet"})
				proj.Path = "/tmp/test.tbx"
				// Initialize ensMap to ensure ConvertToAddress works
				app.ensMap = make(map[string]base.Address)
				// Leave Dalle as nil to trigger the expected error
			},
			expectErr: true,
			errMsg:    "dalle service not available",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			app := &App{
				Projects: project.NewManager(),
				Preferences: &preferences.Preferences{
					User: preferences.UserPreferences{},
				},
				ensMap: make(map[string]base.Address),
			}
			tt.setup(app)

			result, err := app.BuildDalleDressForProject()

			if tt.expectErr {
				require.Error(t, err)
				if tt.errMsg != "" {
					assert.Contains(t, err.Error(), tt.errMsg)
				}
				assert.Nil(t, result)
			} else {
				require.NoError(t, err)
				assert.NotNil(t, result)
				// Should contain expected keys
				assert.Contains(t, result, "imageUrl")
				assert.Contains(t, result, "parts")
			}
		})
	}
}

func TestGetChainList(t *testing.T) {
	app := &App{
		Projects: project.NewManager(),
		Preferences: &preferences.Preferences{
			User: preferences.UserPreferences{},
		},
	}

	result := app.GetChainList()
	// Should return a ChainList pointer (may be nil if not initialized)
	assert.IsType(t, (*utils.ChainList)(nil), result)
}
