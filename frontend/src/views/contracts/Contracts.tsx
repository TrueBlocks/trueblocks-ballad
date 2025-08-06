// Copyright 2016, 2026 The TrueBlocks Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */
// === SECTION 1: Imports & Dependencies ===
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { GetContractsPage, Reload } from '@app';
import { BaseTab, usePagination } from '@components';
import { useFiltering, useSorting } from '@contexts';
import {
  DataFacetConfig,
  toPageDataProp,
  useActiveFacet,
  useActiveProject,
  useColumns,
  useEvent,
  usePayload,
} from '@hooks';
import { TabView } from '@layout';
import {
  Alert,
  Container,
  Loader,
  Select,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import { contracts } from '@models';
import { msgs, project, types } from '@models';
import {
  Debugger,
  addressToHex,
  getDisplayAddress,
  useErrorHandler,
} from '@utils';

import { getColumns } from './columns';
import { ContractDashboard, ContractExecute } from './components';
import { contractsFacets } from './facets';

// Tiny component for consistent facet titles
interface FacetTitleProps {
  facet: types.DataFacet;
  contractName?: string;
  contractAddress?: string;
  onContractChange?: (address: string) => void;
  availableContracts?: Array<{
    value: string;
    label: string;
    name: string;
    address: string;
  }>;
}

const FacetTitle: React.FC<FacetTitleProps> = ({
  facet,
  contractName,
  contractAddress,
  onContractChange,
  availableContracts = [],
}) => {
  const getTitleForFacet = (facet: types.DataFacet): string => {
    switch (facet) {
      case types.DataFacet.DASHBOARD:
        return 'Contract Dashboard';
      case types.DataFacet.EXECUTE:
        return 'Contract Interactions';
      case types.DataFacet.EVENTS:
        return 'Contract Events';
      default:
        return 'Contract';
    }
  };

  return (
    <div>
      <Title order={3}>{getTitleForFacet(facet)}</Title>
      {onContractChange ? (
        <Select
          data={availableContracts}
          value={contractAddress}
          onChange={(value) => {
            if (value && onContractChange) {
              onContractChange(value);
            }
          }}
          variant="unstyled"
          styles={{
            input: {
              fontSize: '14px',
              color: 'var(--mantine-color-dimmed)',
              padding: 0,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
            },
            dropdown: {
              fontSize: '14px',
            },
          }}
          comboboxProps={{
            position: 'bottom-start',
            middlewares: { flip: false, shift: false },
          }}
        />
      ) : (
        <Text size="sm" c="dimmed">
          {contractName || 'Unknown Contract'} {'·'} {contractAddress}
        </Text>
      )}
    </div>
  );
};

export const ROUTE = 'contracts' as const;
export const Contracts = () => {
  // === SECTION 2: Contract Detail Detection ===
  const { activeContract, setActiveContract } = useActiveProject();

  // === SECTION 3: Contract Detail State ===
  const [contractAbi, setContractAbi] = useState<types.Contract | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  // === SECTION 2: Hook Initialization ===
  const renderCnt = useRef(0);
  const createPayload = usePayload();
  const activeFacetHook = useActiveFacet({
    facets: contractsFacets,
    viewRoute: ROUTE,
  });
  const { availableFacets, getCurrentDataFacet } = activeFacetHook;
  const isForm = getCurrentDataFacet() !== types.DataFacet.EVENTS;

  const [pageData, setPageData] = useState<contracts.ContractsPage | null>(
    null,
  );
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
    try {
      const payload = createPayload(getCurrentDataFacet());
      if (isForm && activeContract) {
        payload.address = activeContract;
      }

      const result = await GetContractsPage(
        payload,
        pagination.currentPage * pagination.pageSize,
        pagination.pageSize,
        sort,
        filter,
      );

      setPageData(result);
      setTotalItems(result.totalItems || 0);
    } catch (err: unknown) {
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
    isForm,
    activeContract,
  ]);

  const currentData = useMemo(() => {
    if (!pageData) return [];
    const facet = getCurrentDataFacet();
    switch (facet) {
      case types.DataFacet.DASHBOARD:
        return pageData.contracts || [];
      case types.DataFacet.EXECUTE:
        return pageData.contracts || [];
      case types.DataFacet.EVENTS:
        if (pageData.logs && Array.isArray(pageData.logs)) {
          const processedLogs = pageData.logs.map((event) => ({
            ...event,
            // Add contract info if available
            compressedLog: (() => {
              const anyEvent = event as unknown as Record<string, unknown>;
              if (
                anyEvent.articulatedLog &&
                typeof anyEvent.articulatedLog === 'object'
              ) {
                const artLog = anyEvent.articulatedLog as Record<
                  string,
                  unknown
                >;
                return artLog.name ? `${artLog.name}()` : '';
              }
              return '';
            })(),
          }));
          return processedLogs;
        }
        return [];
      default:
        return [];
    }
  }, [pageData, getCurrentDataFacet]);

  // Generate dynamic contract list from backend data
  const availableContracts = useMemo(() => {
    if (!pageData?.contracts) return [];

    return pageData.contracts.map((contract: types.Contract) => ({
      value: addressToHex(contract.address),
      label: `${contract.name || 'Unknown'} · ${getDisplayAddress(contract.address)}`,
      name: contract.name || 'Unknown',
      address: addressToHex(contract.address),
    }));
  }, [pageData?.contracts]);

  // === SECTION 4: Event Handling ===
  useEvent(
    msgs.EventType.DATA_LOADED,
    (_message: string, payload?: Record<string, unknown>) => {
      if (payload?.collection === 'contracts') {
        const eventDataFacet = payload.dataFacet;
        if (eventDataFacet === getCurrentDataFacet()) {
          fetchData();
        }
      }
    },
  );

  useEvent(msgs.EventType.MANAGER, (message: string) => {
    if (
      message === 'active_address_changed' ||
      message === 'active_chain_changed'
    ) {
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
    const currentFacet = getCurrentDataFacet();
    if (activeContract) {
      return (
        <div style={{ padding: '20px' }}>
          <Stack gap="md">
            <FacetTitle facet={currentFacet} contractAddress={activeContract} />
            <BaseTab<Record<string, unknown>>
              data={currentData as unknown as Record<string, unknown>[]}
              columns={currentColumns}
              loading={!!pageData?.isFetching}
              error={error}
              viewStateKey={viewStateKey}
              headerActions={[]}
            />
          </Stack>
        </div>
      );
    }

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
  }, [
    currentData,
    currentColumns,
    pageData?.isFetching,
    error,
    viewStateKey,
    getCurrentDataFacet,
    activeContract,
  ]);

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

  // === SECTION 6.5: Contract Detail Loading Effect ===
  useEffect(() => {
    const loadContractDetail = async () => {
      if (!isForm || !activeContract) {
        return;
      }

      try {
        setDetailLoading(true);
        setDetailError(null);

        if (pageData?.isFetching) {
          return;
        }

        let contractData = pageData?.contracts?.find(
          (contract: types.Contract) =>
            addressToHex(contract.address)?.toLowerCase() ===
            activeContract.toLowerCase(),
        );

        // If the activeContract is not found, fall back to the first available contract
        if (
          !contractData &&
          pageData?.contracts &&
          pageData.contracts.length > 0
        ) {
          contractData = pageData.contracts[0];
          if (contractData) {
            const newAddress = addressToHex(contractData.address);

            // Update the active contract in the system
            await setActiveContract(newAddress);

            setDetailLoading(false);
            return; // Exit early, the component will re-render with the new activeContract
          }
        }

        if (contractData) {
          setContractAbi(contractData);
          setDetailLoading(false);
        } else {
          setDetailLoading(false);
        }
      } catch (err) {
        setDetailError(
          err instanceof Error
            ? err.message
            : 'Failed to load contract details',
        );
        setDetailLoading(false);
      }
    };

    loadContractDetail();
  }, [isForm, activeContract, pageData, setActiveContract]);

  // === SECTION 6.6: Early Return for Detail View ===
  if (isForm) {
    if (detailLoading || !contractAbi || pageData?.isFetching) {
      return (
        <Container size="lg" py="xl">
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '200px',
            }}
          >
            <Loader size="lg" />
            <Text ml="md">Loading contract details...</Text>
          </div>
        </Container>
      );
    }

    if (detailError) {
      return (
        <Container size="lg" py="xl">
          <Alert color="red" title="Error loading contract">
            {detailError}
          </Alert>
        </Container>
      );
    }

    if (!contractAbi.abi) {
      return (
        <Container size="lg" py="xl">
          <Alert color="yellow" title="No ABI found">
            No ABI found for contract address: {activeContract}
          </Alert>
        </Container>
      );
    }

    // Generate facets from the ABI
    return (
      <div className="mainView">
        <TabView
          tabs={contractsFacets.map((facetConfig: DataFacetConfig) => ({
            key: facetConfig.id,
            label: facetConfig.label,
            value: facetConfig.id,
            content: (
              <div style={{ padding: '20px' }}>
                <Stack gap="md">
                  <FacetTitle
                    facet={facetConfig.id}
                    contractName={contractAbi.name}
                    contractAddress={addressToHex(contractAbi.address)}
                    availableContracts={availableContracts}
                    onContractChange={async (address: string) => {
                      await setActiveContract(address);
                    }}
                  />
                  {facetConfig.id === types.DataFacet.DASHBOARD ? (
                    <ContractDashboard
                      contractState={contractAbi}
                      onRefresh={() => {
                        // TODO: Implement refresh logic for contract state
                      }}
                    />
                  ) : facetConfig.id === types.DataFacet.EXECUTE ? (
                    <ContractExecute
                      contractState={contractAbi}
                      functionName="all" // Pass a special value to indicate all functions
                      onTransaction={(_txData) => {
                        // TODO: Implement transaction handling
                      }}
                    />
                  ) : (
                    <Alert
                      color="blue"
                      title={`Contract: ${contractAbi.name || 'Unknown'}`}
                    >
                      Address: {activeContract}
                      <br />
                      Facet: {facetConfig.label} (ID: {facetConfig.id})
                      <br />
                      ABI Functions: {contractAbi.abi?.functions?.length || 0}
                    </Alert>
                  )}
                </Stack>
              </div>
            ),
          }))}
          route={ROUTE}
        />
        <Debugger
          rowActions={[]}
          headerActions={[]}
          count={++renderCnt.current}
        />
      </div>
    );
  }

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
// EXISTING_CODE
