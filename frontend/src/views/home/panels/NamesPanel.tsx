import { useEffect, useState } from 'react';

import { GetNamesSummary } from '@app';
import { DashboardCard, StatusIndicator } from '@components';
import { useEvent, useIconSets } from '@hooks';
import { Badge, Button, Group, Stack, Text } from '@mantine/core';
import { msgs, types } from '@models';
import { Log } from '@utils';

interface NamesPanelProps {
  onViewAll?: () => void;
  onAddName?: () => void;
}

export const NamesPanel = ({ onViewAll, onAddName }: NamesPanelProps) => {
  const [summary, setSummary] = useState<types.Summary>({
    totalCount: 0,
    facetCounts: {},
    customData: {
      customCount: 0,
      prefundCount: 0,
      regularCount: 0,
      baddressCount: 0,
    },
    lastUpdated: Date.now(),
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { Names } = useIconSets();

  const fetchNamesSummary = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);

      // Use the new GetNamesSummary API that returns pre-computed summaries
      const summaryData = await GetNamesSummary(types.Payload.createFrom({}));

      if (summaryData) {
        setSummary(summaryData);
      }
      setError(null);
    } catch (err) {
      Log(`Error fetching names summary: ${err}`);
      setError('Failed to load names');
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchNamesSummary();
  }, []);

  // Listen for the new consolidated collection state changes
  useEvent(
    msgs.EventType.DATA_LOADED,
    (_message: string, payload?: Record<string, unknown>) => {
      // Update when names collection data changes
      if (payload?.collection === 'names') {
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
      title="Names"
      subtitle={`${summary.totalCount} addresses`}
      icon={<Names size={20} />}
      loading={loading}
      error={error}
      onClick={onViewAll}
    >
      <Stack gap="sm">
        <div>
          <StatusIndicator
            status={summary.totalCount > 0 ? 'healthy' : 'inactive'}
            label="Name Database"
            count={summary.totalCount}
            size="xs"
          />
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          <Badge size="sm" variant="light" color="blue">
            Custom: {(summary.customData?.customCount as number) || 0}
          </Badge>
          <Badge size="sm" variant="light" color="green">
            Regular: {(summary.customData?.regularCount as number) || 0}
          </Badge>
          <Badge size="sm" variant="light" color="orange">
            Prefund: {(summary.customData?.prefundCount as number) || 0}
          </Badge>
          <Badge size="sm" variant="light" color="red">
            Bad: {(summary.customData?.baddressCount as number) || 0}
          </Badge>
        </div>

        <Text size="xs" c="dimmed">
          Named Ethereum addresses and contract labels
        </Text>

        <Group gap="xs" mt="auto">
          <Button size="xs" variant="light" onClick={onAddName}>
            Add Name
          </Button>
          <Button size="xs" variant="outline" onClick={onViewAll}>
            View All
          </Button>
        </Group>
      </Stack>
    </DashboardCard>
  );
};
