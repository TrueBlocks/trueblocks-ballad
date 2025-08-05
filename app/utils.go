package app

import (
	"encoding/hex"
	"fmt"
	"path/filepath"

	"github.com/TrueBlocks/trueblocks-ballad/pkg/logging"
	"github.com/TrueBlocks/trueblocks-ballad/pkg/markdown"

	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/base"
	coreTypes "github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/types"
	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/utils"
	sdk "github.com/TrueBlocks/trueblocks-sdk/v5"
)

// LogFrontend logs a message to the frontend logger
func (a *App) LogFrontend(msg string) {
	logging.LogFrontend(msg)
}

// GetMarkdown loads markdown content for the specified folder, route, and tab
func (a *App) GetMarkdown(folder, route, tab string) string {
	lang := a.Preferences.App.LastLanguage
	if md, err := markdown.LoadMarkdown(a.Assets, filepath.Join("frontend", "src", "assets", folder), lang, route, tab); err != nil {
		return err.Error()
	} else {
		return md
	}
}

// GetNodeStatus retrieves blockchain node metadata for the specified chain
func (a *App) GetNodeStatus(chain string) *coreTypes.MetaData {
	defer logging.Silence()()
	a.meta, _ = sdk.GetMetaData(chain)
	return a.meta
}

// Encode packs function parameters into hex-encoded calldata
func (a *App) Encode(fn sdk.Function, params []interface{}) (string, error) {
	packed, err := fn.Pack(params)
	if err != nil {
		return "", fmt.Errorf("failed to pack function call: %w", err)
	}
	return "0x" + hex.EncodeToString(packed), nil
}

// BuildDalleDressForProject generates AI art for the active project's address
func (a *App) BuildDalleDressForProject() (map[string]interface{}, error) {
	active := a.GetActiveProject()
	if active == nil {
		return nil, fmt.Errorf("no active project")
	}
	addr := active.GetActiveAddress()
	if addr == base.ZeroAddr {
		return nil, fmt.Errorf("project address is not set")
	}

	// Always resolve ENS/address using ConvertToAddress
	resolved, ok := a.ConvertToAddress(addr.Hex())
	if !ok || resolved == base.ZeroAddr {
		return nil, fmt.Errorf("invalid address or ENS name")
	}

	if a.Dalle == nil {
		return nil, fmt.Errorf("dalle service not available")
	}

	dress, err := a.Dalle.MakeDalleDress(resolved.Hex())
	if err != nil {
		return nil, err
	}

	imagePath := filepath.Join("generated", dress.Filename+".png")
	imageURL := ""
	if a.fileServer != nil {
		imageURL = a.fileServer.GetURL(imagePath)
	}

	return map[string]interface{}{
		"imageUrl": imageURL,
		"parts":    dress,
	}, nil
}

// GetChainList returns the list of supported blockchain chains
func (app *App) GetChainList() *utils.ChainList {
	return app.chainList
}
