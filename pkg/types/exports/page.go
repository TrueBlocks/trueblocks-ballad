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
	"time"

	"github.com/TrueBlocks/trueblocks-ballad/pkg/logging"
	"github.com/TrueBlocks/trueblocks-ballad/pkg/types"
	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/base"
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
	period := payload.Period

	logging.LogBackend(fmt.Sprintf("🟩 Collection GetPage START: facet=%s, period='%s', first=%d, pageSize=%d, filter='%s'",
		dataFacet, period, first, pageSize, filter))

	page := &ExportsPage{
		Facet: dataFacet,
	}
	filter = strings.ToLower(filter)

	// Check if this is a summary request (non-blockly period)
	// Assets are not time-dependent, so they ignore period and always use regular pagination
	if period != types.PeriodBlockly && dataFacet != ExportsAssets {
		logging.LogBackend(fmt.Sprintf("🟩 Collection GetPage: Non-blockly period detected ('%s'), calling getSummaryPage", period))
		return c.getSummaryPage(dataFacet, period, first, pageSize, sortSpec, filter)
	} else {
		if dataFacet == ExportsAssets {
			logging.LogBackend("🟩 Collection GetPage: Assets facet ignores period, using regular pagination")
		} else {
			logging.LogBackend(fmt.Sprintf("🟩 Collection GetPage: Blockly period, processing facet=%s", dataFacet))
		}
	}

	switch dataFacet {
	case ExportsStatements:
		logging.LogBackend("🟩 Collection GetPage: Processing STATEMENTS facet")
		facet := c.statementsFacet
		logging.LogBackend(fmt.Sprintf("🟩 Collection GetPage: Statements facet status - IsFetching=%t, ExpectedCount=%d",
			facet.IsFetching(), facet.ExpectedCount()))

		var filterFunc func(*Statement) bool
		if filter != "" {
			filterFunc = func(item *Statement) bool {
				return c.matchesStatementFilter(item, filter)
			}
			logging.LogBackend(fmt.Sprintf("🟩 Collection GetPage: Applied statements filter: '%s'", filter))
		}
		sortFunc := func(items []Statement, sort sdk.SortSpec) error {
			return sdk.SortStatements(items, sort)
		}
		if result, err := facet.GetPage(first, pageSize, filterFunc, sortSpec, sortFunc); err != nil {
			logging.LogBackend(fmt.Sprintf("🔴 Collection GetPage STATEMENTS ERROR: %v", err))
			return nil, types.NewStoreError("exports", dataFacet, "GetPage", err)
		} else {
			logging.LogBackend(fmt.Sprintf("🟩 Collection GetPage: Statements result - Items=%d, TotalItems=%d, State=%s",
				len(result.Items), result.TotalItems, result.State))
			page.Statements, page.TotalItems, page.State = result.Items, result.TotalItems, result.State
		}
		page.IsFetching = facet.IsFetching()
		page.ExpectedTotal = facet.ExpectedCount()
	case ExportsBalances:
		logging.LogBackend("🟩 Collection GetPage: Processing BALANCES facet")
		facet := c.balancesFacet
		logging.LogBackend(fmt.Sprintf("🟩 Collection GetPage: Balances facet status - IsFetching=%t, ExpectedCount=%d",
			facet.IsFetching(), facet.ExpectedCount()))

		var filterFunc func(*Balance) bool
		if filter != "" {
			filterFunc = func(item *Balance) bool {
				return c.matchesBalanceFilter(item, filter)
			}
			logging.LogBackend(fmt.Sprintf("🟩 Collection GetPage: Applied balances filter: '%s'", filter))
		}
		sortFunc := func(items []Balance, sort sdk.SortSpec) error {
			return sdk.SortBalances(items, sort)
		}
		if result, err := facet.GetPage(first, pageSize, filterFunc, sortSpec, sortFunc); err != nil {
			logging.LogBackend(fmt.Sprintf("🔴 Collection GetPage BALANCES ERROR: %v", err))
			return nil, types.NewStoreError("exports", dataFacet, "GetPage", err)
		} else {
			logging.LogBackend(fmt.Sprintf("🟩 Collection GetPage: Balances result - Items=%d, TotalItems=%d, State=%s",
				len(result.Items), result.TotalItems, result.State))
			page.Balances, page.TotalItems, page.State = result.Items, result.TotalItems, result.State
		}
		page.IsFetching = facet.IsFetching()
		page.ExpectedTotal = facet.ExpectedCount()
	case ExportsAssets:
		logging.LogBackend("🟩 Collection GetPage: Processing ASSETS facet")
		facet := c.assetsFacet
		logging.LogBackend(fmt.Sprintf("🟩 Collection GetPage: Assets facet status - IsFetching=%t, ExpectedCount=%d",
			facet.IsFetching(), facet.ExpectedCount()))

		var filterFunc func(*Asset) bool
		if filter != "" {
			filterFunc = func(item *Asset) bool {
				return c.matchesAssetFilter(item, filter)
			}
			logging.LogBackend(fmt.Sprintf("🟩 Collection GetPage: Applied assets filter: '%s'", filter))
		}
		sortFunc := func(items []Asset, sort sdk.SortSpec) error {
			return sdk.SortAssets(items, sort)
		}
		if result, err := facet.GetPage(first, pageSize, filterFunc, sortSpec, sortFunc); err != nil {
			logging.LogBackend(fmt.Sprintf("🔴 Collection GetPage ASSETS ERROR: %v", err))
			return nil, types.NewStoreError("exports", dataFacet, "GetPage", err)
		} else {
			logging.LogBackend(fmt.Sprintf("🟩 Collection GetPage: Assets result - Items=%d, TotalItems=%d, State=%s",
				len(result.Items), result.TotalItems, result.State))
			page.Assets, page.TotalItems, page.State = result.Items, result.TotalItems, result.State
		}
		page.IsFetching = facet.IsFetching()
		page.ExpectedTotal = facet.ExpectedCount()
	default:
		logging.LogBackend(fmt.Sprintf("🔴 Collection GetPage: Unsupported dataFacet: %v", dataFacet))
		return nil, types.NewValidationError("exports", dataFacet, "GetPage",
			fmt.Errorf("unsupported dataFacet: %v", dataFacet))
	}

	logging.LogBackend(fmt.Sprintf("🟩 Collection GetPage END: facet=%s, totalItems=%d, isFetching=%t, state=%s",
		dataFacet, page.TotalItems, page.IsFetching, page.State))
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

// getSummaryPage returns paginated summary data for a given period
func (c *ExportsCollection) getSummaryPage(
	dataFacet types.DataFacet,
	period string,
	first, pageSize int,
	sortSpec sdk.SortSpec,
	filter string,
) (types.Page, error) {
	logging.LogBackend(fmt.Sprintf("🟪 getSummaryPage START: facet=%s, period='%s', first=%d, pageSize=%d, filter='%s'",
		dataFacet, period, first, pageSize, filter))

	// CRITICAL: Ensure underlying raw data is loaded before generating summaries
	// For summary periods, we need the blockly (raw) data to be loaded first
	logging.LogBackend(fmt.Sprintf("🟪 getSummaryPage: Ensuring underlying data is loaded for facet=%s", dataFacet))
	c.LoadData(dataFacet)

	// Generate summaries from the loaded raw data for the requested period
	logging.LogBackend(fmt.Sprintf("🟪 getSummaryPage: Generating summaries for period='%s'", period))
	if err := c.generateSummariesForPeriod(dataFacet, period); err != nil {
		logging.LogBackend(fmt.Sprintf("🔴 getSummaryPage: Failed to generate summaries: %v", err))
		return nil, types.NewStoreError("exports", dataFacet, "getSummaryPage", err)
	}

	page := &ExportsPage{
		Facet: dataFacet,
	}

	switch dataFacet {
	case ExportsStatements:
		logging.LogBackend(fmt.Sprintf("🟪 getSummaryPage: Getting STATEMENTS summaries for period='%s'", period))
		summaries := c.statementsFacet.GetStore().GetSummaries(period)
		logging.LogBackend(fmt.Sprintf("🟪 getSummaryPage: Retrieved %d statement summaries", len(summaries)))

		// Apply filtering if needed
		var filtered []*Statement
		if filter != "" {
			for _, item := range summaries {
				if c.matchesStatementFilter(item, filter) {
					filtered = append(filtered, item)
				}
			}
			logging.LogBackend(fmt.Sprintf("🟪 getSummaryPage: After filter '%s': %d -> %d items",
				filter, len(summaries), len(filtered)))
		} else {
			filtered = summaries
			logging.LogBackend(fmt.Sprintf("🟪 getSummaryPage: No filter applied, using all %d items", len(filtered)))
		}

		// Convert to value slice for sorting
		valueSlice := toValueSlice(filtered)

		// Apply sorting
		if err := sdk.SortStatements(valueSlice, sortSpec); err != nil {
			logging.LogBackend(fmt.Sprintf("🔴 getSummaryPage STATEMENTS SORT ERROR: %v", err))
			return nil, types.NewStoreError("exports", dataFacet, "getSummaryPage", err)
		}

		// Apply pagination
		total := len(valueSlice)
		end := first + pageSize
		if end > total {
			end = total
		}
		if first >= total {
			valueSlice = []Statement{}
		} else {
			valueSlice = valueSlice[first:end]
		}

		logging.LogBackend(fmt.Sprintf("🟪 getSummaryPage: STATEMENTS pagination - total=%d, first=%d, pageSize=%d, returning=%d",
			total, first, pageSize, len(valueSlice)))

		page.Statements = valueSlice
		page.TotalItems = total
		page.State = types.StateLoaded

	case ExportsBalances:
		logging.LogBackend(fmt.Sprintf("🟪 getSummaryPage: Getting BALANCES summaries for period='%s'", period))
		summaries := c.balancesFacet.GetStore().GetSummaries(period)
		logging.LogBackend(fmt.Sprintf("🟪 getSummaryPage: Retrieved %d balance summaries", len(summaries)))

		// Apply filtering if needed
		var filtered []*Balance
		if filter != "" {
			for _, item := range summaries {
				if c.matchesBalanceFilter(item, filter) {
					filtered = append(filtered, item)
				}
			}
			logging.LogBackend(fmt.Sprintf("🟪 getSummaryPage: After filter '%s': %d -> %d items",
				filter, len(summaries), len(filtered)))
		} else {
			filtered = summaries
			logging.LogBackend(fmt.Sprintf("🟪 getSummaryPage: No filter applied, using all %d items", len(filtered)))
		}

		// Convert to sdk.Balance slice for sorting
		valueSlice := make([]sdk.Balance, len(filtered))
		for i, item := range filtered {
			valueSlice[i] = *item
		}

		// Apply sorting
		if err := sdk.SortBalances(valueSlice, sortSpec); err != nil {
			logging.LogBackend(fmt.Sprintf("🔴 getSummaryPage BALANCES SORT ERROR: %v", err))
			return nil, types.NewStoreError("exports", dataFacet, "getSummaryPage", err)
		}

		// Apply pagination
		total := len(valueSlice)
		end := first + pageSize
		if end > total {
			end = total
		}
		if first >= total {
			valueSlice = []sdk.Balance{}
		} else {
			valueSlice = valueSlice[first:end]
		}

		logging.LogBackend(fmt.Sprintf("🟪 getSummaryPage: BALANCES pagination - total=%d, first=%d, pageSize=%d, returning=%d",
			total, first, pageSize, len(valueSlice)))

		page.Balances = valueSlice
		page.TotalItems = total
		page.State = types.StateLoaded

	default:
		logging.LogBackend(fmt.Sprintf("🔴 getSummaryPage: Unsupported dataFacet: %v", dataFacet))
		return nil, types.NewValidationError("exports", dataFacet, "getSummaryPage",
			fmt.Errorf("unsupported dataFacet: %v", dataFacet))
	}

	logging.LogBackend(fmt.Sprintf("🟪 getSummaryPage END: facet=%s, period='%s', totalItems=%d, state=%s",
		dataFacet, period, page.TotalItems, page.State))
	return page, nil
}

// generateSummariesForPeriod ensures summaries are generated for the given period
func (c *ExportsCollection) generateSummariesForPeriod(dataFacet types.DataFacet, period string) error {
	logging.LogBackend(fmt.Sprintf("🟪 generateSummariesForPeriod: Starting for facet=%s, period='%s'", dataFacet, period))

	switch dataFacet {
	case ExportsStatements:
		store := c.statementsFacet.GetStore()
		data := store.GetItems()
		logging.LogBackend(fmt.Sprintf("🟪 generateSummariesForPeriod: Processing %d statements for period='%s'", len(data), period))

		// Clear existing summaries for this period
		store.GetSummaryManager().Reset()

		// For statements, we need to create aggregated summary statements per period
		// Group statements by normalized timestamp and create one summary per period
		periodGroups := make(map[int64][]*Statement)

		for _, statement := range data {
			normalizedTime := normalizeToPeriod(int64(statement.Timestamp), period)
			periodGroups[normalizedTime] = append(periodGroups[normalizedTime], statement)
		}

		logging.LogBackend(fmt.Sprintf("🟪 generateSummariesForPeriod: Grouped into %d periods for period='%s'", len(periodGroups), period))

		// Create one summary statement per period
		for normalizedTime, statements := range periodGroups {
			if len(statements) == 0 {
				continue
			}

			// Create a representative summary statement for this period
			// Use the latest transaction as the base and aggregate key metrics
			latestStatement := statements[len(statements)-1]
			summaryStatement := &Statement{
				AccountedFor:    latestStatement.AccountedFor,
				Asset:           latestStatement.Asset,
				BlockNumber:     latestStatement.BlockNumber,
				Timestamp:       base.Timestamp(normalizedTime), // Use normalized timestamp as base.Timestamp
				Symbol:          latestStatement.Symbol,
				Decimals:        latestStatement.Decimals,
				TransactionHash: latestStatement.TransactionHash,

				// Aggregate counts or amounts if needed
				// For now, just use the latest values
				EndBal:    latestStatement.EndBal,
				AmountIn:  latestStatement.AmountIn,
				AmountOut: latestStatement.AmountOut,
			}

			// Add the summary statement as a single-item group
			store.GetSummaryManager().Add([]*Statement{summaryStatement}, period)
		}

		logging.LogBackend(fmt.Sprintf("🟪 generateSummariesForPeriod: Generated %d statement summaries for period='%s'", len(periodGroups), period))

	case ExportsBalances:
		statementsStore := c.statementsFacet.GetStore()
		balancesStore := c.balancesFacet.GetStore()
		statements := statementsStore.GetItems()
		logging.LogBackend(fmt.Sprintf("🟪 generateSummariesForPeriod: Processing %d statements to generate balance summaries for period='%s'", len(statements), period))

		// Clear existing balance summaries for this period
		balancesStore.GetSummaryManager().Reset()

		// Generate balance summaries using asset-aware logic
		for _, statement := range statements {
			// Create a balance record for this statement (same logic as BalanceObserver)
			balance := &Balance{
				Address:          statement.Asset,
				Holder:           statement.AccountedFor,
				Balance:          statement.EndBal,
				BlockNumber:      statement.BlockNumber,
				Timestamp:        statement.Timestamp,
				TransactionIndex: statement.TransactionIndex,
				Decimals:         uint64(statement.Decimals),
				Symbol:           statement.Symbol,
			}

			// Use AddBalance for asset-aware summarization (keeps latest balance per period per asset)
			balancesStore.GetSummaryManager().AddBalance(balance, period)
		}

		logging.LogBackend(fmt.Sprintf("🟪 generateSummariesForPeriod: Generated balance summaries for period='%s'", period))

	default:
		return fmt.Errorf("unsupported dataFacet for summary generation: %v", dataFacet)
	}

	return nil
}

// Helper function to normalize timestamps to periods
func normalizeToPeriod(timestamp int64, period string) int64 {
	t := time.Unix(timestamp, 0).UTC()

	switch period {
	case types.PeriodHourly:
		return time.Date(t.Year(), t.Month(), t.Day(), t.Hour(), 0, 0, 0, time.UTC).Unix()
	case types.PeriodDaily:
		return time.Date(t.Year(), t.Month(), t.Day(), 0, 0, 0, 0, time.UTC).Unix()
	case types.PeriodWeekly:
		// Start of week (Sunday)
		days := int(t.Weekday())
		return time.Date(t.Year(), t.Month(), t.Day()-days, 0, 0, 0, 0, time.UTC).Unix()
	case types.PeriodMonthly:
		return time.Date(t.Year(), t.Month(), 1, 0, 0, 0, 0, time.UTC).Unix()
	case types.PeriodQuarterly:
		quarter := ((int(t.Month())-1)/3)*3 + 1
		return time.Date(t.Year(), time.Month(quarter), 1, 0, 0, 0, 0, time.UTC).Unix()
	case types.PeriodAnnual:
		return time.Date(t.Year(), 1, 1, 0, 0, 0, 0, time.UTC).Unix()
	default: // PeriodBlockly
		return timestamp // No normalization for block-level data
	}
}

// Helper function to convert pointer slices to value slices for sorting
func toValueSlice[T any](ptrs []*T) []T {
	values := make([]T, len(ptrs))
	for i, ptr := range ptrs {
		values[i] = *ptr
	}
	return values
}

// EXISTING_CODE
