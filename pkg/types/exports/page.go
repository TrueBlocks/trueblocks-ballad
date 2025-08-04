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
	Balances      []Balance       `json:"balances"`
	Logs          []Log           `json:"logs"`
	Receipts      []Receipt       `json:"receipts"`
	Statements    []Statement     `json:"statements"`
	Traces        []Trace         `json:"traces"`
	Transactions  []Transaction   `json:"transactions"`
	Transfers     []Transfer      `json:"transfers"`
	Withdrawals   []Withdrawal    `json:"withdrawals"`
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
	case ExportsTransfers:
		facet := c.transfersFacet
		var filterFunc func(*Transfer) bool
		if filter != "" {
			filterFunc = func(item *Transfer) bool {
				return c.matchesTransferFilter(item, filter)
			}
		}
		sortFunc := func(items []Transfer, sort sdk.SortSpec) error {
			return sdk.SortTransfers(items, sort)
		}
		if result, err := facet.GetPage(first, pageSize, filterFunc, sortSpec, sortFunc); err != nil {
			return nil, types.NewStoreError("exports", dataFacet, "GetPage", err)
		} else {

			page.Transfers, page.TotalItems, page.State = result.Items, result.TotalItems, result.State
		}
		page.IsFetching = facet.IsFetching()
		page.ExpectedTotal = facet.ExpectedCount()
	case ExportsTransactions:
		facet := c.transactionsFacet
		var filterFunc func(*Transaction) bool
		if filter != "" {
			filterFunc = func(item *Transaction) bool {
				return c.matchesTransactionFilter(item, filter)
			}
		}
		sortFunc := func(items []Transaction, sort sdk.SortSpec) error {
			return sdk.SortTransactions(items, sort)
		}
		if result, err := facet.GetPage(first, pageSize, filterFunc, sortSpec, sortFunc); err != nil {
			return nil, types.NewStoreError("exports", dataFacet, "GetPage", err)
		} else {

			page.Transactions, page.TotalItems, page.State = result.Items, result.TotalItems, result.State
		}
		page.IsFetching = facet.IsFetching()
		page.ExpectedTotal = facet.ExpectedCount()
	case ExportsWithdrawals:
		facet := c.withdrawalsFacet
		var filterFunc func(*Withdrawal) bool
		if filter != "" {
			filterFunc = func(item *Withdrawal) bool {
				return c.matchesWithdrawalFilter(item, filter)
			}
		}
		sortFunc := func(items []Withdrawal, sort sdk.SortSpec) error {
			return sdk.SortWithdrawals(items, sort)
		}
		if result, err := facet.GetPage(first, pageSize, filterFunc, sortSpec, sortFunc); err != nil {
			return nil, types.NewStoreError("exports", dataFacet, "GetPage", err)
		} else {

			page.Withdrawals, page.TotalItems, page.State = result.Items, result.TotalItems, result.State
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
	case ExportsLogs:
		facet := c.logsFacet
		var filterFunc func(*Log) bool
		if filter != "" {
			filterFunc = func(item *Log) bool {
				return c.matchesLogFilter(item, filter)
			}
		}
		sortFunc := func(items []Log, sort sdk.SortSpec) error {
			return sdk.SortLogs(items, sort)
		}
		if result, err := facet.GetPage(first, pageSize, filterFunc, sortSpec, sortFunc); err != nil {
			return nil, types.NewStoreError("exports", dataFacet, "GetPage", err)
		} else {

			page.Logs, page.TotalItems, page.State = result.Items, result.TotalItems, result.State
		}
		page.IsFetching = facet.IsFetching()
		page.ExpectedTotal = facet.ExpectedCount()
	case ExportsTraces:
		facet := c.tracesFacet
		var filterFunc func(*Trace) bool
		if filter != "" {
			filterFunc = func(item *Trace) bool {
				return c.matchesTraceFilter(item, filter)
			}
		}
		sortFunc := func(items []Trace, sort sdk.SortSpec) error {
			return sdk.SortTraces(items, sort)
		}
		if result, err := facet.GetPage(first, pageSize, filterFunc, sortSpec, sortFunc); err != nil {
			return nil, types.NewStoreError("exports", dataFacet, "GetPage", err)
		} else {

			page.Traces, page.TotalItems, page.State = result.Items, result.TotalItems, result.State
		}
		page.IsFetching = facet.IsFetching()
		page.ExpectedTotal = facet.ExpectedCount()
	case ExportsReceipts:
		facet := c.receiptsFacet
		var filterFunc func(*Receipt) bool
		if filter != "" {
			filterFunc = func(item *Receipt) bool {
				return c.matchesReceiptFilter(item, filter)
			}
		}
		sortFunc := func(items []Receipt, sort sdk.SortSpec) error {
			return sdk.SortReceipts(items, sort)
		}
		if result, err := facet.GetPage(first, pageSize, filterFunc, sortSpec, sortFunc); err != nil {
			return nil, types.NewStoreError("exports", dataFacet, "GetPage", err)
		} else {

			page.Receipts, page.TotalItems, page.State = result.Items, result.TotalItems, result.State
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
	return strings.Contains(strings.ToLower(item.Address.Hex()), filter)
}

func (c *ExportsCollection) matchesTransferFilter(item *Transfer, filter string) bool {
	return strings.Contains(strings.ToLower(item.Asset.Hex()), filter) ||
		strings.Contains(strings.ToLower(item.Sender.Hex()), filter) ||
		strings.Contains(strings.ToLower(item.Recipient.Hex()), filter)
}

func (c *ExportsCollection) matchesTransactionFilter(item *Transaction, filter string) bool {
	return strings.Contains(strings.ToLower(item.Hash.Hex()), filter)
}

func (c *ExportsCollection) matchesWithdrawalFilter(item *Withdrawal, filter string) bool {
	_ = item // delint
	return strings.Contains(strings.ToLower("item.Hash.Hex()"), filter)
}

func (c *ExportsCollection) matchesAssetFilter(item *Asset, filter string) bool {
	_ = item    // delint
	_ = filter  // delint
	return true //strings.Contains(strings.ToLower(item.Address.Hex()), filter) ||
	// strings.Contains(strings.ToLower(item.Name), filter) ||
	// strings.Contains(strings.ToLower(item.Symbol), filter)
}

func (c *ExportsCollection) matchesLogFilter(item *Log, filter string) bool {
	_ = item    // delint
	_ = filter  // delint
	return true // strings.Contains(strings.ToLower(item.Address.Hex()), filter) ||
	// strings.Contains(strings.ToLower(item.Topics[0].Hex()), filter)
}

func (c *ExportsCollection) matchesTraceFilter(item *Trace, filter string) bool {
	_ = item    // delint
	_ = filter  // delint
	return true // strings.Contains(strings.ToLower(item.BlockHash.Hex()), filter)
}

func (c *ExportsCollection) matchesReceiptFilter(item *Receipt, filter string) bool {
	_ = item    // delint
	_ = filter  // delint
	return true // strings.Contains(strings.ToLower(item.TransactionHash.Hex()), filter) ||
	// strings.Contains(strings.ToLower(item.ContractAddress.Hex()), filter)
}

// EXISTING_CODE
