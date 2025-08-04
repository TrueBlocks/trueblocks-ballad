import { Stack, Text, Title, UnstyledButton } from '@mantine/core';

interface ActivityItem {
  id: string;
  type: 'image' | 'monitor' | 'export' | 'name' | 'general';
  message: string;
  timestamp: Date;
  onClick?: () => void;
}

interface RecentActivityProps {
  activities: ActivityItem[];
  maxItems?: number;
}

export const RecentActivity = ({
  activities,
  maxItems = 5,
}: RecentActivityProps) => {
  const displayedActivities = activities.slice(0, maxItems);

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <Stack gap="md">
      <Title order={4}>Recent Activity</Title>

      {displayedActivities.length === 0 ? (
        <Text size="sm" c="dimmed">
          No recent activity
        </Text>
      ) : (
        <Stack gap="xs">
          {displayedActivities.map((activity) => (
            <UnstyledButton
              key={activity.id}
              onClick={activity.onClick}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid var(--mantine-color-gray-3)',
                backgroundColor: 'var(--mantine-color-gray-0)',
                cursor: activity.onClick ? 'pointer' : 'default',
                transition: 'background-color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (activity.onClick) {
                  e.currentTarget.style.backgroundColor =
                    'var(--mantine-color-gray-1)';
                }
              }}
              onMouseLeave={(e) => {
                if (activity.onClick) {
                  e.currentTarget.style.backgroundColor =
                    'var(--mantine-color-gray-0)';
                }
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text size="sm" style={{ flex: 1 }}>
                  {activity.message}
                </Text>
                <Text size="xs" c="dimmed">
                  {formatTime(activity.timestamp)}
                </Text>
              </div>
            </UnstyledButton>
          ))}
        </Stack>
      )}
    </Stack>
  );
};
