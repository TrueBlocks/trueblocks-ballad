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
	"strings"

	"github.com/TrueBlocks/trueblocks-ballad/pkg/types"
	sdk "github.com/TrueBlocks/trueblocks-sdk/v5"
	// EXISTING_CODE
	// EXISTING_CODE
)

// TODO: The slices should be slices to pointers
type ExportsPage struct {
	Facet         types.DataFacet `json:"facet"`
	Assets        []Asset         `json:"assets"`
	Balances      []sdk.Balance   `json:"balances"`
	Statements    []Statement     `json:"statements"`
	TotalItems    int             `json:"totalItems"`
	ExpectedTotal int             `json:"expectedTotal"`
	IsFetching    bool            `json:"isFetching"`
	State         types.LoadState `json:"state"`
}

func (p *ExportsPage) GetFacet() types.DataFacet {
	return p.Facet
}

func (p *ExportsPage) GetTotalItems() int {
	return p.TotalItems
}

func (p *ExportsPage) GetExpectedTotal() int {
	return p.ExpectedTotal
}

func (p *ExportsPage) GetIsFetching() bool {
	return p.IsFetching
}

func (p *ExportsPage) GetState() types.LoadState {
	return p.State
}

func (c *ExportsCollection) GetPage(
	payload *types.Payload,
	first, pageSize int,
	sortSpec sdk.SortSpec,
	filter string,
) (types.Page, error) {
	dataFacet := payload.DataFacet

	page := &ExportsPage{
		Facet: dataFacet,
	}
	filter = strings.ToLower(filter)

	switch dataFacet {
	case ExportsStatements:
		facet := c.statementsFacet
		var filterFunc func(*Statement) bool
		if filter != "" {
			filterFunc = func(item *Statement) bool {
				return c.matchesStatementFilter(item, filter)
			}
		}
		sortFunc := func(items []Statement, sort sdk.SortSpec) error {
			return sdk.SortStatements(items, sort)
		}
		if result, err := facet.GetPage(first, pageSize, filterFunc, sortSpec, sortFunc); err != nil {
			return nil, types.NewStoreError("exports", dataFacet, "GetPage", err)
		} else {

			page.Statements, page.TotalItems, page.State = result.Items, result.TotalItems, result.State
		}
		page.IsFetching = facet.IsFetching()
		page.ExpectedTotal = facet.ExpectedCount()
	case ExportsBalances:
		facet := c.balancesFacet
		var filterFunc func(*Balance) bool
		if filter != "" {
			filterFunc = func(item *Balance) bool {
				return c.matchesBalanceFilter(item, filter)
			}
		}
		sortFunc := func(items []Balance, sort sdk.SortSpec) error {
			return sdk.SortBalances(items, sort)
		}
		if result, err := facet.GetPage(first, pageSize, filterFunc, sortSpec, sortFunc); err != nil {
			return nil, types.NewStoreError("exports", dataFacet, "GetPage", err)
		} else {
			page.Balances, page.TotalItems, page.State = result.Items, result.TotalItems, result.State
		}
		page.IsFetching = facet.IsFetching()
		page.ExpectedTotal = facet.ExpectedCount()
	case ExportsAssets:
		facet := c.assetsFacet
		var filterFunc func(*Asset) bool
		if filter != "" {
			filterFunc = func(item *Asset) bool {
				return c.matchesAssetFilter(item, filter)
			}
		}
		sortFunc := func(items []Asset, sort sdk.SortSpec) error {
			return sdk.SortAssets(items, sort)
		}
		if result, err := facet.GetPage(first, pageSize, filterFunc, sortSpec, sortFunc); err != nil {
			return nil, types.NewStoreError("exports", dataFacet, "GetPage", err)
		} else {

			page.Assets, page.TotalItems, page.State = result.Items, result.TotalItems, result.State
		}
		page.IsFetching = facet.IsFetching()
		page.ExpectedTotal = facet.ExpectedCount()
	default:
		return nil, types.NewValidationError("exports", dataFacet, "GetPage",
			fmt.Errorf("unsupported dataFacet: %v", dataFacet))
	}

	return page, nil
}

// EXISTING_CODE
func (c *ExportsCollection) matchesStatementFilter(item *Statement, filter string) bool {
	return strings.Contains(strings.ToLower(item.AccountedFor.Hex()), filter) || strings.Contains(strings.ToLower(item.Asset.Hex()), filter)
}

func (c *ExportsCollection) matchesBalanceFilter(item *Balance, filter string) bool {
	return strings.Contains(strings.ToLower(item.Address.Hex()), filter) || strings.Contains(strings.ToLower(item.Holder.Hex()), filter)
}

func (c *ExportsCollection) matchesAssetFilter(item *Asset, filter string) bool {
	_ = item    // delint
	_ = filter  // delint
	return true //strings.Contains(strings.ToLower(item.Address.Hex()), filter) ||
	// strings.Contains(strings.ToLower(item.Name), filter) ||
	// strings.Contains(strings.ToLower(item.Symbol), filter)
}

// EXISTING_CODE
