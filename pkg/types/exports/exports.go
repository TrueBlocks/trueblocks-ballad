// Copyright 2016, 2026 The TrueBlocks Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */

package exports

import (
	"fmt"
	"sync"
	"time"

	// EXISTING_CODE
	// EXISTING_CODE
	"github.com/TrueBlocks/trueblocks-ballad/pkg/facets"
	"github.com/TrueBlocks/trueblocks-ballad/pkg/logging"
	"github.com/TrueBlocks/trueblocks-ballad/pkg/types"
)

const (
	ExportsStatements types.DataFacet = "statements"
	ExportsBalances   types.DataFacet = "balances"
	ExportsAssets     types.DataFacet = "assets"
)

func init() {
	types.RegisterDataFacet(ExportsStatements)
	types.RegisterDataFacet(ExportsBalances)
	types.RegisterDataFacet(ExportsAssets)
}

type ExportsCollection struct {
	statementsFacet *facets.Facet[Statement]
	balancesFacet   *facets.Facet[Balance]
	namesFacet      *facets.Facet[Name]
	assetsFacet     *facets.Facet[Asset]
	summary         types.Summary
	summaryMutex    sync.RWMutex
}

func NewExportsCollection(payload *types.Payload) *ExportsCollection {
	c := &ExportsCollection{}
	c.ResetSummary()
	c.initializeFacets(payload)
	return c
}

func (c *ExportsCollection) initializeFacets(payload *types.Payload) {
	c.statementsFacet = facets.NewFacet(
		ExportsStatements,
		isStatement,
		isDupStatement(),
		c.getStatementsStore(payload, ExportsStatements),
		"exports",
		c,
	)

	c.balancesFacet = facets.NewFacet(
		ExportsBalances,
		isBalance,
		isDupBalance(),
		c.getBalancesStore(payload, ExportsBalances),
		"exports",
		c,
	)

	c.namesFacet = facets.NewFacet(
		ExportsAssets, // Use ExportsAssets facet for names
		isName,
		isDupName(),
		c.getNamesStore(payload, ExportsAssets),
		"exports",
		c,
	)

	c.assetsFacet = facets.NewFacet(
		ExportsAssets,
		isAsset,
		isDupAsset(),
		c.getAssetsStore(payload, ExportsAssets),
		"exports",
		c,
	)
}

func isStatement(item *Statement) bool {
	// EXISTING_CODE
	return true
	// EXISTING_CODE
}

func isBalance(item *Balance) bool {
	// EXISTING_CODE
	return true
	// EXISTING_CODE
}

func isName(item *Name) bool {
	// EXISTING_CODE
	return true
	// EXISTING_CODE
}

func isAsset(item *Asset) bool {
	// EXISTING_CODE
	return true
	// EXISTING_CODE
}

func isDupAsset() func(existing []*Asset, newItem *Asset) bool {
	// EXISTING_CODE
	return nil
	// EXISTING_CODE
}

func isDupBalance() func(existing []*Balance, newItem *Balance) bool {
	// EXISTING_CODE
	return nil
	// EXISTING_CODE
}

func isDupName() func(existing []*Name, newItem *Name) bool {
	// EXISTING_CODE
	return nil
	// EXISTING_CODE
}

func isDupStatement() func(existing []*Statement, newItem *Statement) bool {
	// EXISTING_CODE
	return nil
	// EXISTING_CODE
}

func (c *ExportsCollection) LoadData(dataFacet types.DataFacet) {
	if !c.NeedsUpdate(dataFacet) {
		return
	}

	go func() {
		switch dataFacet {
		case ExportsStatements:
			if err := c.statementsFacet.Load(); err != nil {
				logging.LogError(fmt.Sprintf("LoadData.%s from store: %%v", dataFacet), err, facets.ErrAlreadyLoading)
			}
		case ExportsBalances:
			// Load statements first (balances observer will populate balance store)
			if err := c.statementsFacet.Load(); err != nil {
				logging.LogError(fmt.Sprintf("LoadData.statements from store: %%v"), err, facets.ErrAlreadyLoading)
			}
			// Load names for balance enrichment
			if err := c.namesFacet.Load(); err != nil {
				logging.LogError(fmt.Sprintf("LoadData.names from store: %%v"), err, facets.ErrAlreadyLoading)
			}
			// The balance store doesn't need explicit loading - it gets populated by the observer
		case ExportsAssets:
			if err := c.assetsFacet.Load(); err != nil {
				logging.LogError(fmt.Sprintf("LoadData.%s from store: %%v", dataFacet), err, facets.ErrAlreadyLoading)
			}
			// Also load names for asset enrichment
			if err := c.namesFacet.Load(); err != nil {
				logging.LogError(fmt.Sprintf("LoadData.names from store: %%v"), err, facets.ErrAlreadyLoading)
			}
		default:
			logging.LogError("LoadData: unexpected dataFacet: %v", fmt.Errorf("invalid dataFacet: %s", dataFacet), nil)
			return
		}
	}()
}

func (c *ExportsCollection) Reset(dataFacet types.DataFacet) {
	switch dataFacet {
	case ExportsStatements:
		c.statementsFacet.GetStore().Reset()
		// Also reset balances since they depend on statements
		c.balancesFacet.GetStore().Reset()
	case ExportsBalances:
		c.balancesFacet.GetStore().Reset()
	case ExportsAssets:
		c.assetsFacet.GetStore().Reset()
		// Also reset names when assets are reset
		c.namesFacet.GetStore().Reset()
	default:
		return
	}
}

func (c *ExportsCollection) NeedsUpdate(dataFacet types.DataFacet) bool {
	switch dataFacet {
	case ExportsStatements:
		return c.statementsFacet.NeedsUpdate()
	case ExportsBalances:
		// Balances depend on statements, so we need update if either needs update
		return c.balancesFacet.NeedsUpdate() || c.statementsFacet.NeedsUpdate()
	case ExportsAssets:
		return c.assetsFacet.NeedsUpdate()
	default:
		return false
	}
}

func (c *ExportsCollection) GetSupportedFacets() []types.DataFacet {
	return []types.DataFacet{
		ExportsStatements,
		ExportsBalances,
		ExportsAssets,
	}
}

func (c *ExportsCollection) AccumulateItem(item interface{}, summary *types.Summary) {
	// EXISTING_CODE
	c.summaryMutex.Lock()
	defer c.summaryMutex.Unlock()

	if summary == nil {
		logging.LogError("AccumulateItem called with nil summary", nil, nil)
		return
	}

	if summary.FacetCounts == nil {
		summary.FacetCounts = make(map[types.DataFacet]int)
	}

	switch item.(type) {
	case *Statement:
		summary.TotalCount++
		summary.FacetCounts[ExportsStatements]++
		if summary.CustomData == nil {
			summary.CustomData = make(map[string]interface{})
		}

		stmtCount, _ := summary.CustomData["statementsCount"].(int)
		stmtCount++
		summary.CustomData["statementsCount"] = stmtCount

	case *Balance:
		summary.TotalCount++
		summary.FacetCounts[ExportsBalances]++
		if summary.CustomData == nil {
			summary.CustomData = make(map[string]interface{})
		}

		balanceCount, _ := summary.CustomData["balancesCount"].(int)
		balanceCount++
		summary.CustomData["balancesCount"] = balanceCount

	case *Asset:
		summary.TotalCount++
		summary.FacetCounts[ExportsAssets]++
		if summary.CustomData == nil {
			summary.CustomData = make(map[string]interface{})
		}

		assetCount, _ := summary.CustomData["assetsCount"].(int)
		assetCount++
		summary.CustomData["assetsCount"] = assetCount

	}
	// EXISTING_CODE
}

func (c *ExportsCollection) GetSummary() types.Summary {
	c.summaryMutex.RLock()
	defer c.summaryMutex.RUnlock()

	summary := c.summary
	summary.FacetCounts = make(map[types.DataFacet]int)
	for k, v := range c.summary.FacetCounts {
		summary.FacetCounts[k] = v
	}

	if c.summary.CustomData != nil {
		summary.CustomData = make(map[string]interface{})
		for k, v := range c.summary.CustomData {
			summary.CustomData[k] = v
		}
	}

	return summary
}

func (c *ExportsCollection) ResetSummary() {
	c.summaryMutex.Lock()
	defer c.summaryMutex.Unlock()
	c.summary = types.Summary{
		TotalCount:  0,
		FacetCounts: make(map[types.DataFacet]int),
		CustomData:  make(map[string]interface{}),
		LastUpdated: time.Now().Unix(),
	}
}

// EXISTING_CODE
// EXISTING_CODE
