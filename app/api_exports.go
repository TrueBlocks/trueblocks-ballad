// Copyright 2016, 2026 The TrueBlocks Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */

package app

import (
	"fmt"

	"github.com/TrueBlocks/trueblocks-ballad/pkg/logging"
	"github.com/TrueBlocks/trueblocks-ballad/pkg/types"
	"github.com/TrueBlocks/trueblocks-ballad/pkg/types/exports"
	sdk "github.com/TrueBlocks/trueblocks-sdk/v5"
	// EXISTING_CODE
	// EXISTING_CODE
)

func (a *App) GetExportsPage(
	payload *types.Payload,
	first, pageSize int,
	sort sdk.SortSpec,
	filter string,
) (*exports.ExportsPage, error) {
	logging.LogBackend("")
	logging.LogBackend(fmt.Sprintf("🟦 API GetExportsPage: chain=%s, address=%s, facet=%s, period=%s, first=%d, pageSize=%d, filter='%s'",
		payload.Chain, payload.Address, payload.DataFacet, payload.Period, first, pageSize, filter))

	collection := exports.GetExportsCollection(payload)

	logging.LogBackend("🟦 API GetExportsPage: collection retrieved, calling getCollectionPage")
	result, err := getCollectionPage[*exports.ExportsPage](collection, payload, first, pageSize, sort, filter)

	if err != nil {
		logging.LogBackend(fmt.Sprintf("🔴 API GetExportsPage ERROR: %v", err))
		return nil, err
	}

	if result != nil {
		logging.LogBackend(fmt.Sprintf("🟦 API GetExportsPage SUCCESS: facet=%s, totalItems=%d, statementsCount=%d, balancesCount=%d, assetsCount=%d, isFetching=%t",
			result.Facet, result.TotalItems, len(result.Statements), len(result.Balances), len(result.Assets), result.IsFetching))
	} else {
		logging.LogBackend("🟦 API GetExportsPage: result is nil")
	}

	return result, nil
}

func (a *App) GetExportsSummary(payload *types.Payload) types.Summary {
	logging.LogBackend("")
	collection := exports.GetExportsCollection(payload)
	return collection.GetSummary()
}

func (a *App) ReloadExports(payload *types.Payload) error {
	logging.LogBackend("")
	collection := exports.GetExportsCollection(payload)
	collection.Reset(payload.DataFacet)
	collection.LoadData(payload.DataFacet)
	return nil
}

// EXISTING_CODE
// EXISTING_CODE
