import { Card, Group, Skeleton, Stack } from '@mantine/core';

interface PanelSkeletonProps {
  title?: string;
  hasIcon?: boolean;
  hasSubtitle?: boolean;
  contentRows?: number;
}

export const PanelSkeleton = ({
  title = 'Loading',
  hasIcon = true,
  hasSubtitle = true,
  contentRows = 3,
}: PanelSkeletonProps) => {
  return (
    <Card
      shadow="sm"
      p="lg"
      radius="md"
      withBorder
      style={{ height: '100%' }}
      aria-label={`Loading ${title} panel`}
    >
      {/* Header with icon and title */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        {hasIcon && (
          <div style={{ marginRight: 12 }}>
            <Skeleton height={20} width={20} radius="sm" />
          </div>
        )}
        <div style={{ flex: 1 }}>
          <Skeleton height={16} width="40%" mb={hasSubtitle ? 4 : 0} />
          {hasSubtitle && <Skeleton height={12} width="60%" />}
        </div>
      </div>

      {/* Content skeleton */}
      <Stack gap="sm">
        {Array.from({ length: contentRows }, (_, index) => (
          <Group key={index} justify="space-between" align="center">
            <Skeleton height={12} width={`${60 + Math.random() * 30}%`} />
            <Skeleton height={12} width="20%" />
          </Group>
        ))}
      </Stack>
    </Card>
  );
};
