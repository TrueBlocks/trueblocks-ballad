// Copyright 2016, 2026 The TrueBlocks Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */

package app

// EXISTING_CODE
import (
	"github.com/TrueBlocks/trueblocks-ballad/pkg/types"
)

// EXISTING_CODE

// Reload dispatches reload requests to the appropriate view-specific reload function
func (a *App) Reload(payload *types.Payload) error {
	switch a.GetLastView() {
	case "exports":
		return a.ReloadExports(payload)
	case "names":
		return a.ReloadNames(payload)
	case "contracts":
		return a.ReloadContracts(payload)
	default:
		panic("unknown view in Reload" + a.GetLastView())
	}
}

// GetRegisteredViews returns all registered view names
func (a *App) GetRegisteredViews() []string {
	return []string{
		"exports",
		"names",
		"contracts",
	}
}

// EXISTING_CODE
// EXISTING_CODE
