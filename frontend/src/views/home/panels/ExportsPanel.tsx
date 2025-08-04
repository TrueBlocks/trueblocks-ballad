import { useEffect, useState } from 'react';

import { DashboardCard, StatusIndicator } from '@components';
import { useEvent, useIconSets } from '@hooks';
import { Badge, Button, Group, Stack, Text } from '@mantine/core';
import { msgs, types } from '@models';
import { Log } from '@utils';

interface ExportsPanelProps {
  onViewAll?: () => void;
  onNewExport?: () => void;
}

export const ExportsPanel = ({ onViewAll, onNewExport }: ExportsPanelProps) => {
  const [summary, setSummary] = useState<types.Summary>({
    totalCount: 0,
    facetCounts: {},
    customData: {
      statementsCount: 0,
      transfersCount: 0,
      balancesCount: 0,
      transactionsCount: 0,
      withdrawalsCount: 0,
    },
    lastUpdated: Date.now(),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { Exports } = useIconSets();

  useEffect(() => {
    const fetchExportsSummary = async () => {
      try {
        setLoading(true);
        setSummary({
          totalCount: 0,
          facetCounts: {},
          customData: {
            statementsCount: 0,
            transfersCount: 0,
            balancesCount: 0,
            transactionsCount: 0,
            withdrawalsCount: 0,
          },
          lastUpdated: Date.now(),
        });
        setError(null);
      } catch (err) {
        Log(`Error fetching exports summary: ${err}`);
        setError('Failed to load exports');
      } finally {
        setLoading(false);
      }
    };

    fetchExportsSummary();
  }, []);

  // Listen for the new consolidated collection state changes
  useEvent(
    msgs.EventType.DATA_LOADED,
    (_message: string, payload?: Record<string, unknown>) => {
      // Update when exports collection data changes
      if (payload?.collection === 'exports') {
        // Extract summary directly from the event payload - no API call needed!
        const summary = payload.summary as types.Summary | undefined;
        if (summary) {
          setSummary(summary);
        }

        // Update loading state based on collection state
        const state = payload.state as types.LoadState | undefined;
        setLoading(state === types.LoadState.FETCHING);

        // Handle errors
        const error = payload.error as string | undefined;
        if (error) {
          setError(error);
        } else {
          setError(null);
        }
      }
    },
  );

  return (
    <DashboardCard
      title="Exports"
      subtitle={`history of current account`}
      icon={<Exports size={20} />}
      loading={loading}
      error={error}
      onClick={onViewAll}
    >
      <Stack gap="sm">
        <div>
          <StatusIndicator status="healthy" label="Export System" size="xs" />
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '4px',
          }}
        >
          <Badge size="xs" variant="light" color="green">
            Stmts: {(summary.customData?.statementsCount as number) || 0}
          </Badge>
          <Badge size="xs" variant="light" color="purple">
            Xfers: {(summary.customData?.transfersCount as number) || 0}
          </Badge>
          <Badge size="xs" variant="light" color="orange">
            Bals: {(summary.customData?.balancesCount as number) || 0}
          </Badge>
          <Badge size="xs" variant="light" color="blue">
            Txns: {(summary.customData?.transactionsCount as number) || 0}
          </Badge>
          <Badge size="xs" variant="light" color="blue">
            With: {(summary.customData?.withdrawalsCount as number) || 0}
          </Badge>
        </div>

        <Text size="xs" c="dimmed">
          Export blockchain data in various formats
        </Text>

        <Group gap="xs" mt="auto">
          <Button size="xs" variant="light" onClick={onNewExport}>
            New Export
          </Button>
          <Button size="xs" variant="outline" onClick={onViewAll}>
            View All
          </Button>
        </Group>
      </Stack>
    </DashboardCard>
  );
};
