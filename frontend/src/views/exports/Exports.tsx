// Copyright 2016, 2026 The TrueBlocks Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */
// === SECTION 1: Imports & Dependencies ===
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { GetExportsPage, Reload } from '@app';
import { BaseTab, usePagination } from '@components';
import { useFiltering, useSorting } from '@contexts';
import {
  DataFacetConfig,
  toPageDataProp,
  useActiveFacet,
  useColumns,
  useEvent,
  usePayload,
} from '@hooks';
import { TabView } from '@layout';
import { useHotkeys } from '@mantine/hooks';
import { exports } from '@models';
import { msgs, project, types } from '@models';
import { Debugger, Log, useErrorHandler } from '@utils';

import { getColumns } from './columns';
import { exportsFacets } from './facets';

export const ROUTE = 'exports' as const;
export const Exports = () => {
  // === SECTION 2: Hook Initialization ===
  const renderCnt = useRef(0);
  const createPayload = usePayload();
  const activeFacetHook = useActiveFacet({
    facets: exportsFacets,
    viewRoute: ROUTE,
  });
  const { availableFacets, getCurrentDataFacet } = activeFacetHook;

  const [pageData, setPageData] = useState<exports.ExportsPage | null>(null);
  const viewStateKey = useMemo(
    (): project.ViewStateKey => ({
      viewName: ROUTE,
      facetName: getCurrentDataFacet(),
    }),
    [getCurrentDataFacet],
  );

  const { error, handleError, clearError } = useErrorHandler();
  const { pagination, setTotalItems } = usePagination(viewStateKey);
  const { sort } = useSorting(viewStateKey);
  const { filter } = useFiltering(viewStateKey);

  // === SECTION 3: Data Fetching ===
  const fetchData = useCallback(async () => {
    clearError();

    const facet = getCurrentDataFacet();
    const payload = createPayload(facet);
    const currentPage = pagination.currentPage * pagination.pageSize;
    const pageSize = pagination.pageSize;

    Log(
      `🟦 Exports fetchData START: facet=${facet}, period=${payload.period}, page=${pagination.currentPage}, pageSize=${pageSize}, filter='${filter}'`,
    );

    try {
      Log(
        `🟦 Exports fetchData: Calling GetExportsPage with first=${currentPage}, pageSize=${pageSize}`,
      );
      const result = await GetExportsPage(
        payload,
        currentPage,
        pageSize,
        sort,
        filter,
      );

      Log(
        `🟦 Exports fetchData SUCCESS: facet=${facet}, period=${payload.period}, totalItems=${result.totalItems}, statementsCount=${result.statements?.length || 0}, balancesCount=${result.balances?.length || 0}, assetsCount=${result.assets?.length || 0}, isFetching=${result.isFetching}`,
      );

      setPageData(result);
      setTotalItems(result.totalItems || 0);
    } catch (err: unknown) {
      Log(`🔴 Exports fetchData ERROR: ${err}`);
      handleError(err, `Failed to fetch ${getCurrentDataFacet()}`);
    }
  }, [
    clearError,
    createPayload,
    getCurrentDataFacet,
    pagination.currentPage,
    pagination.pageSize,
    sort,
    filter,
    setTotalItems,
    handleError,
  ]);

  const currentData = useMemo(() => {
    if (!pageData) {
      Log(`🟦 Exports currentData: No pageData available`);
      return [];
    }
    const facet = getCurrentDataFacet();
    Log(
      `🟦 Exports currentData: Processing facet=${facet}, pageData.facet=${pageData.facet}`,
    );

    switch (facet) {
      case types.DataFacet.STATEMENTS:
        Log(
          `🟦 Exports currentData: STATEMENTS - count=${pageData.statements?.length || 0}`,
        );
        return pageData.statements || [];
      case types.DataFacet.BALANCES:
        Log(
          `🟦 Exports currentData: BALANCES - count=${pageData.balances?.length || 0}`,
        );
        return pageData.balances || [];
      case types.DataFacet.ASSETS:
        Log(
          `🟦 Exports currentData: ASSETS - count=${pageData.assets?.length || 0}`,
        );
        return pageData.assets || [];
      default:
        Log(
          `🟦 Exports currentData: Unknown facet=${facet}, returning empty array`,
        );
        return [];
    }
  }, [pageData, getCurrentDataFacet]);

  // === SECTION 4: Event Handling ===
  useEvent(
    msgs.EventType.DATA_LOADED,
    (_message: string, payload?: Record<string, unknown>) => {
      if (payload?.collection === 'exports') {
        const eventDataFacet = payload.dataFacet;
        if (eventDataFacet === getCurrentDataFacet()) {
          fetchData();
        }
      }
    },
  );

  // Listen for active address changes to refresh data
  useEvent(msgs.EventType.MANAGER, (message: string) => {
    if (
      message === 'active_address_changed' ||
      message === 'active_chain_changed'
    ) {
      Log(`🟦 Exports: Received ${message}, refreshing data`);
      fetchData();
    }
  });

  // Listen for active period changes to refresh data
  useEvent(msgs.EventType.MANAGER, (message: string) => {
    if (message === 'active_period_changed') {
      Log(`🟦 Exports: Received active_period_changed, refreshing data`);
      fetchData();
    }
  });

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleReload = useCallback(async () => {
    clearError();
    try {
      Reload(createPayload(getCurrentDataFacet())).then(() => {
        // The data will reload when the DataLoaded event is fired.
      });
    } catch (err: unknown) {
      handleError(err, `Failed to reload ${getCurrentDataFacet()}`);
    }
  }, [clearError, getCurrentDataFacet, createPayload, handleError]);

  useHotkeys([['mod+r', handleReload]]);

  // === SECTION 6: UI Configuration ===
  const currentColumns = useColumns(
    getColumns(getCurrentDataFacet()),
    {
      showActions: false,
      actions: [],
      getCanRemove: useCallback((_row: unknown) => false, []),
    },
    {},
    toPageDataProp(pageData),
    { rowActions: [] },
  );

  const perTabContent = useMemo(() => {
    return (
      <BaseTab<Record<string, unknown>>
        data={currentData as unknown as Record<string, unknown>[]}
        columns={currentColumns}
        loading={!!pageData?.isFetching}
        error={error}
        viewStateKey={viewStateKey}
        headerActions={[]}
      />
    );
  }, [currentData, currentColumns, pageData?.isFetching, error, viewStateKey]);

  const tabs = useMemo(
    () =>
      availableFacets.map((facetConfig: DataFacetConfig) => ({
        key: facetConfig.id,
        label: facetConfig.label,
        value: facetConfig.id,
        content: perTabContent,
        dividerBefore: facetConfig.dividerBefore,
      })),
    [availableFacets, perTabContent],
  );

  // === SECTION 7: Render ===
  return (
    <div className="mainView">
      <TabView tabs={tabs} route={ROUTE} />
      {error && (
        <div>
          <h3>{`Error fetching ${getCurrentDataFacet()}`}</h3>
          <p>{error.message}</p>
        </div>
      )}
      <Debugger
        rowActions={[]}
        headerActions={[]}
        count={++renderCnt.current}
      />
    </div>
  );
};

// EXISTING_CODE
