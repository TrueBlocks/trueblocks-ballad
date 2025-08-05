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

	// EXISTING_CODE
	// EXISTING_CODE
	"github.com/TrueBlocks/trueblocks-ballad/pkg/logging"
	"github.com/TrueBlocks/trueblocks-ballad/pkg/store"
	"github.com/TrueBlocks/trueblocks-ballad/pkg/types"
	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/output"
	sdk "github.com/TrueBlocks/trueblocks-sdk/v5"
)

// EXISTING_CODE
// EXISTING_CODE

type Asset = sdk.Asset
type Name = sdk.Name
type Statement = sdk.Statement
type Balance = sdk.Balance

var (
	assetsStore   = make(map[string]*store.Store[Asset])
	assetsStoreMu sync.Mutex

	balancesStore   = make(map[string]*store.Store[Balance])
	balancesStoreMu sync.Mutex

	namesStore   = make(map[string]*store.Store[Name])
	namesStoreMu sync.Mutex

	statementsStore   = make(map[string]*store.Store[Statement])
	statementsStoreMu sync.Mutex
)

func (c *ExportsCollection) getAssetsStore(payload *types.Payload, facet types.DataFacet) *store.Store[Asset] {
	assetsStoreMu.Lock()
	defer assetsStoreMu.Unlock()

	chain := payload.Chain
	address := payload.Address
	storeKey := getStoreKey(chain, address)
	theStore := assetsStore[storeKey]
	if theStore == nil {
		queryFunc := func(ctx *output.RenderCtx) error {
			// EXISTING_CODE
			exportOpts := sdk.ExportOptions{
				Globals:   sdk.Globals{Cache: true, Verbose: true, Chain: chain},
				RenderCtx: ctx,
				Addrs:     []string{address},
			}
			if _, _, err := exportOpts.ExportAssets(); err != nil {
				wrappedErr := types.NewSDKError("exports", ExportsAssets, "fetch", err)
				logging.LogBackend(fmt.Sprintf("Exports assets SDK query error: %v", wrappedErr))
				return wrappedErr
			}
			// EXISTING_CODE
			return nil
		}

		processFunc := func(item interface{}) *Asset {
			if it, ok := item.(*Asset); ok {
				return it
			}
			return nil
		}

		mappingFunc := func(item *Asset) (key interface{}, includeInMap bool) {
			// EXISTING_CODE
			// EXISTING_CODE
			return nil, false
		}

		storeName := c.GetStoreName(facet, chain, address)
		theStore = store.NewStore(storeName, queryFunc, processFunc, mappingFunc)
		assetsStore[storeKey] = theStore
	}

	return theStore
}

func (c *ExportsCollection) getBalancesStore(payload *types.Payload, facet types.DataFacet) *store.Store[Balance] {
	balancesStoreMu.Lock()
	defer balancesStoreMu.Unlock()

	chain := payload.Chain
	address := payload.Address
	storeKey := getStoreKey(chain, address)
	theStore := balancesStore[storeKey]
	if theStore == nil {
		// Create a store that doesn't query external data - it gets fed from statements
		queryFunc := func(ctx *output.RenderCtx) error {
			// This store doesn't fetch external data - it gets populated by the statement observer
			return nil
		}

		processFunc := func(item interface{}) *Balance {
			if it, ok := item.(*Balance); ok {
				return it
			}
			return nil
		}

		mappingFunc := func(item *Balance) (key interface{}, includeInMap bool) {
			// Each balance is its own record, no need for mapping/grouping
			return nil, false
		}

		storeName := c.GetStoreName(facet, chain, address)
		theStore = store.NewStore(storeName, queryFunc, processFunc, mappingFunc)

		// Set up the observer to watch the statements store
		statementsStore := c.getStatementsStore(payload, ExportsStatements)
		balanceObserver := &BalanceObserver{
			balanceStore: theStore,
			namesStore:   c.getNamesStore(payload, ExportsAssets),
			collection:   c,
		}
		statementsStore.RegisterObserver(balanceObserver)

		balancesStore[storeKey] = theStore
	}

	return theStore
}

func (c *ExportsCollection) getNamesStore(payload *types.Payload, facet types.DataFacet) *store.Store[Name] {
	namesStoreMu.Lock()
	defer namesStoreMu.Unlock()

	chain := payload.Chain
	address := payload.Address
	storeKey := getStoreKey(chain, address)
	theStore := namesStore[storeKey]
	if theStore == nil {
		queryFunc := func(ctx *output.RenderCtx) error {
			// EXISTING_CODE
			namesOpts := sdk.NamesOptions{
				Globals:   sdk.Globals{Cache: true, Verbose: true, Chain: chain},
				RenderCtx: ctx,
				Terms:     []string{address},
			}
			if _, _, err := namesOpts.Names(); err != nil {
				wrappedErr := types.NewSDKError("exports", ExportsAssets, "fetch", err)
				logging.LogBackend(fmt.Sprintf("Exports names SDK query error: %v", wrappedErr))
				return wrappedErr
			}
			// EXISTING_CODE
			return nil
		}

		processFunc := func(item interface{}) *Name {
			if it, ok := item.(*Name); ok {
				return it
			}
			return nil
		}

		mappingFunc := func(item *Name) (key interface{}, includeInMap bool) {
			// EXISTING_CODE
			// Use address as key for quick lookups
			return item.Address.Hex(), true
			// EXISTING_CODE
		}

		storeName := c.GetStoreName(facet, chain, address)
		theStore = store.NewStore(storeName, queryFunc, processFunc, mappingFunc)
		namesStore[storeKey] = theStore
	}

	return theStore
}

func (c *ExportsCollection) getStatementsStore(payload *types.Payload, facet types.DataFacet) *store.Store[Statement] {
	statementsStoreMu.Lock()
	defer statementsStoreMu.Unlock()

	chain := payload.Chain
	address := payload.Address
	storeKey := getStoreKey(chain, address)
	theStore := statementsStore[storeKey]
	if theStore == nil {
		queryFunc := func(ctx *output.RenderCtx) error {
			// EXISTING_CODE
			exportOpts := sdk.ExportOptions{
				Globals:    sdk.Globals{Cache: true, Verbose: true, Chain: chain},
				RenderCtx:  ctx,
				Addrs:      []string{address},
				Accounting: true, // Enable accounting for statements
			}
			if _, _, err := exportOpts.ExportStatements(); err != nil {
				wrappedErr := types.NewSDKError("exports", ExportsStatements, "fetch", err)
				logging.LogBackend(fmt.Sprintf("Exports statements SDK query error: %v", wrappedErr))
				return wrappedErr
			}
			// EXISTING_CODE
			return nil
		}

		processFunc := func(item interface{}) *Statement {
			if it, ok := item.(*Statement); ok {
				return it
			}
			return nil
		}

		mappingFunc := func(item *Statement) (key interface{}, includeInMap bool) {
			// EXISTING_CODE
			// EXISTING_CODE
			return nil, false
		}

		storeName := c.GetStoreName(facet, chain, address)
		theStore = store.NewStore(storeName, queryFunc, processFunc, mappingFunc)
		statementsStore[storeKey] = theStore
	}

	return theStore
}

func (c *ExportsCollection) GetStoreName(dataFacet types.DataFacet, chain, address string) string {
	name := ""
	switch dataFacet {
	case ExportsStatements:
		name = "exports-statements"
	case ExportsBalances:
		name = "exports-balances" // Generated from statements
	case ExportsAssets:
		name = "exports-assets"
	default:
		return ""
	}
	name = fmt.Sprintf("%s-%s-%s", name, chain, address)
	return name
}

// TODO: THIS SHOULD BE PER STORE - SEE EXPORT COMMENTS
func GetExportsCount(payload *types.Payload) (int, error) {
	chain := payload.Chain
	address := payload.Address
	countOpts := sdk.ExportOptions{
		Globals: sdk.Globals{Cache: true, Chain: chain},
		Addrs:   []string{address},
	}
	if countResult, _, err := countOpts.ExportCount(); err != nil {
		return 0, fmt.Errorf("ExportCount query error: %v", err)
	} else if len(countResult) > 0 {
		return int(countResult[0].Count), nil
	}
	return 0, nil
}

var (
	collections   = make(map[store.CollectionKey]*ExportsCollection)
	collectionsMu sync.Mutex
)

func GetExportsCollection(payload *types.Payload) *ExportsCollection {
	collectionsMu.Lock()
	defer collectionsMu.Unlock()

	pl := *payload

	key := store.GetCollectionKey(&pl)
	if collection, exists := collections[key]; exists {
		return collection
	}

	collection := NewExportsCollection(payload)
	collections[key] = collection
	return collection
}

// EXISTING_CODE
func GetExportsCount2(dataFacet string, payload *types.Payload) (int, error) {
	switch types.DataFacet(dataFacet) {
	case ExportsStatements:
		return getExportsStatementsCount(payload)
	case ExportsBalances:
		return getExportsBalancesCount(payload)
	case ExportsAssets:
		return getExportsAssetsCount(payload)
	default:
		return 0, fmt.Errorf("unknown dataFacet: %s", dataFacet)
	}
}

func getExportsTransactionsCount(payload *types.Payload) (int, error) {
	listOpts := sdk.ListOptions{
		Globals: sdk.Globals{Cache: true, Chain: payload.Chain},
		Addrs:   []string{payload.Address},
	}

	// Use ExportCount for optimized counting
	if results, _, err := listOpts.ListCount(); err != nil {
		return 0, fmt.Errorf("failed to get exports transactions count: %w", err)
	} else {
		return int(results[0].Count), nil
	}
}

func getExportsStatementsCount(payload *types.Payload) (int, error) {
	return getExportsTransactionsCount(payload)
}

func getExportsBalancesCount(payload *types.Payload) (int, error) {
	return getExportsTransactionsCount(payload)
}

func getExportsAssetsCount(payload *types.Payload) (int, error) {
	return getExportsTransactionsCount(payload)
}

// ResetExportsStore resets a specific store for a given chain, address, and dataFacet
func ResetExportsStore(payload *types.Payload, dataFacet types.DataFacet) {
	storeKey := getStoreKey(payload.Chain, payload.Address)

	switch dataFacet {
	case ExportsStatements:
		statementsStoreMu.Lock()
		if store, exists := statementsStore[storeKey]; exists {
			store.Reset()
		}
		statementsStoreMu.Unlock()
		// Also reset balances since they depend on statements
		balancesStoreMu.Lock()
		if store, exists := balancesStore[storeKey]; exists {
			store.Reset()
		}
		balancesStoreMu.Unlock()
	case ExportsBalances:
		balancesStoreMu.Lock()
		if store, exists := balancesStore[storeKey]; exists {
			store.Reset()
		}
		balancesStoreMu.Unlock()
	case ExportsAssets:
		assetsStoreMu.Lock()
		if store, exists := assetsStore[storeKey]; exists {
			store.Reset()
		}
		assetsStoreMu.Unlock()
		// Also reset names store when assets are reset
		namesStoreMu.Lock()
		if store, exists := namesStore[storeKey]; exists {
			store.Reset()
		}
		namesStoreMu.Unlock()
	}
}

// ClearExportsStores clears all cached stores for a given chain and address
func ClearExportsStores(payload *types.Payload) {
	chain := payload.Chain
	address := payload.Address
	storeKey := getStoreKey(chain, address)

	statementsStoreMu.Lock()
	delete(statementsStore, storeKey)
	statementsStoreMu.Unlock()

	balancesStoreMu.Lock()
	delete(balancesStore, storeKey)
	balancesStoreMu.Unlock()

	namesStoreMu.Lock()
	delete(namesStore, storeKey)
	namesStoreMu.Unlock()

	assetsStoreMu.Lock()
	delete(assetsStore, storeKey)
	assetsStoreMu.Unlock()
}

// ClearAllExportsStores clears all cached stores (useful for global reset)
func ClearAllExportsStores() {
	statementsStoreMu.Lock()
	statementsStore = make(map[string]*store.Store[Statement])
	statementsStoreMu.Unlock()

	balancesStoreMu.Lock()
	balancesStore = make(map[string]*store.Store[Balance])
	balancesStoreMu.Unlock()

	namesStoreMu.Lock()
	namesStore = make(map[string]*store.Store[Name])
	namesStoreMu.Unlock()

	assetsStoreMu.Lock()
	assetsStore = make(map[string]*store.Store[Asset])
	assetsStoreMu.Unlock()
}

func getStoreKey(chain, address string) string {
	return fmt.Sprintf("%s_%s", chain, address)
}

// BalanceObserver watches statements and generates/updates balances
type BalanceObserver struct {
	balanceStore *store.Store[Balance]
	namesStore   *store.Store[Name]
	collection   *ExportsCollection
}

// OnNewItem is called when a new statement arrives - creates one balance record per statement
func (bo *BalanceObserver) OnNewItem(statement *Statement, index int) {
	// Create a new balance record for this statement (1:1 mapping)
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

	// Try to enrich with name data
	bo.enrichBalanceWithName(balance)

	// Add this balance record to the store using balance-specific summarization
	// AddBalance will keep only the most recent balance per period
	bo.balanceStore.AddBalance(balance, index)
}

// OnStateChanged is called when the statements store state changes
func (bo *BalanceObserver) OnStateChanged(state store.StoreState, reason string) {
	// Nothing special needed - balance store will be reset by the store system
}

// enrichBalanceWithName adds name information to a balance if available
func (bo *BalanceObserver) enrichBalanceWithName(balance *Balance) {
	if bo.namesStore == nil {
		return
	}

	// Try to get name information from the names store
	if nameItem, exists := bo.namesStore.GetItemFromMap(balance.Address.Hex()); exists && nameItem != nil {
		balance.Name = nameItem.Name
		if nameItem.Symbol != "" {
			balance.Symbol = nameItem.Symbol
		}
		if nameItem.Decimals > 0 {
			balance.Decimals = nameItem.Decimals
		}
	}
}

// EXISTING_CODE
