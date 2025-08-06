// Copyright 2016, 2026 The TrueBlocks Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */

package names

import (
	"fmt"
	"strings"

	"github.com/TrueBlocks/trueblocks-ballad/pkg/types"
	sdk "github.com/TrueBlocks/trueblocks-sdk/v5"
	// EXISTING_CODE
	// EXISTING_CODE
)

type NamesPage struct {
	Facet         types.DataFacet `json:"facet"`
	Names         []*Name         `json:"names"`
	TotalItems    int             `json:"totalItems"`
	ExpectedTotal int             `json:"expectedTotal"`
	IsFetching    bool            `json:"isFetching"`
	State         types.LoadState `json:"state"`
}

func (p *NamesPage) GetFacet() types.DataFacet {
	return p.Facet
}

func (p *NamesPage) GetTotalItems() int {
	return p.TotalItems
}

func (p *NamesPage) GetExpectedTotal() int {
	return p.ExpectedTotal
}

func (p *NamesPage) GetIsFetching() bool {
	return p.IsFetching
}

func (p *NamesPage) GetState() types.LoadState {
	return p.State
}

func (c *NamesCollection) GetPage(
	payload *types.Payload,
	first, pageSize int,
	sortSpec sdk.SortSpec,
	filter string,
) (types.Page, error) {
	dataFacet := payload.DataFacet

	page := &NamesPage{
		Facet: dataFacet,
	}
	filter = strings.ToLower(filter)

	switch dataFacet {
	case NamesAll:
		facet := c.allFacet
		var filterFunc func(*Name) bool
		if filter != "" {
			filterFunc = func(item *Name) bool {
				return c.matchesAllFilter(item, filter)
			}
		}
		sortFunc := func(items []Name, sort sdk.SortSpec) error {
			return sdk.SortNames(items, sort)
		}
		if result, err := facet.GetPage(first, pageSize, filterFunc, sortSpec, sortFunc); err != nil {
			return nil, types.NewStoreError("names", dataFacet, "GetPage", err)
		} else {
			all := make([]*Name, 0, len(result.Items))
			for i := range result.Items {
				all = append(all, &result.Items[i])
			}
			page.Names, page.TotalItems, page.State = all, result.TotalItems, result.State
		}
		page.IsFetching = facet.IsFetching()
		page.ExpectedTotal = facet.ExpectedCount()
	case NamesCustom:
		facet := c.customFacet
		var filterFunc func(*Name) bool
		if filter != "" {
			filterFunc = func(item *Name) bool {
				return c.matchesCustomFilter(item, filter)
			}
		}
		sortFunc := func(items []Name, sort sdk.SortSpec) error {
			return sdk.SortNames(items, sort)
		}
		if result, err := facet.GetPage(first, pageSize, filterFunc, sortSpec, sortFunc); err != nil {
			return nil, types.NewStoreError("names", dataFacet, "GetPage", err)
		} else {
			custom := make([]*Name, 0, len(result.Items))
			for i := range result.Items {
				custom = append(custom, &result.Items[i])
			}
			page.Names, page.TotalItems, page.State = custom, result.TotalItems, result.State
		}
		page.IsFetching = facet.IsFetching()
		page.ExpectedTotal = facet.ExpectedCount()
	case NamesPrefund:
		facet := c.prefundFacet
		var filterFunc func(*Name) bool
		if filter != "" {
			filterFunc = func(item *Name) bool {
				return c.matchesPrefundFilter(item, filter)
			}
		}
		sortFunc := func(items []Name, sort sdk.SortSpec) error {
			return sdk.SortNames(items, sort)
		}
		if result, err := facet.GetPage(first, pageSize, filterFunc, sortSpec, sortFunc); err != nil {
			return nil, types.NewStoreError("names", dataFacet, "GetPage", err)
		} else {
			prefund := make([]*Name, 0, len(result.Items))
			for i := range result.Items {
				prefund = append(prefund, &result.Items[i])
			}
			page.Names, page.TotalItems, page.State = prefund, result.TotalItems, result.State
		}
		page.IsFetching = facet.IsFetching()
		page.ExpectedTotal = facet.ExpectedCount()
	case NamesRegular:
		facet := c.regularFacet
		var filterFunc func(*Name) bool
		if filter != "" {
			filterFunc = func(item *Name) bool {
				return c.matchesRegularFilter(item, filter)
			}
		}
		sortFunc := func(items []Name, sort sdk.SortSpec) error {
			return sdk.SortNames(items, sort)
		}
		if result, err := facet.GetPage(first, pageSize, filterFunc, sortSpec, sortFunc); err != nil {
			return nil, types.NewStoreError("names", dataFacet, "GetPage", err)
		} else {
			regular := make([]*Name, 0, len(result.Items))
			for i := range result.Items {
				regular = append(regular, &result.Items[i])
			}
			page.Names, page.TotalItems, page.State = regular, result.TotalItems, result.State
		}
		page.IsFetching = facet.IsFetching()
		page.ExpectedTotal = facet.ExpectedCount()
	case NamesBaddress:
		facet := c.baddressFacet
		var filterFunc func(*Name) bool
		if filter != "" {
			filterFunc = func(item *Name) bool {
				return c.matchesBaddressFilter(item, filter)
			}
		}
		sortFunc := func(items []Name, sort sdk.SortSpec) error {
			return sdk.SortNames(items, sort)
		}
		if result, err := facet.GetPage(first, pageSize, filterFunc, sortSpec, sortFunc); err != nil {
			return nil, types.NewStoreError("names", dataFacet, "GetPage", err)
		} else {
			baddress := make([]*Name, 0, len(result.Items))
			for i := range result.Items {
				baddress = append(baddress, &result.Items[i])
			}
			page.Names, page.TotalItems, page.State = baddress, result.TotalItems, result.State
		}
		page.IsFetching = facet.IsFetching()
		page.ExpectedTotal = facet.ExpectedCount()
	default:
		return nil, types.NewValidationError("names", dataFacet, "GetPage",
			fmt.Errorf("unsupported dataFacet: %v", dataFacet))
	}

	return page, nil
}

// EXISTING_CODE
// EXISTING_CODE
