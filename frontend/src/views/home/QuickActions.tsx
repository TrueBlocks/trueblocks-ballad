import { Button, Group, Kbd, Stack, Text, Title } from '@mantine/core';

interface QuickActionsProps {
  onGenerateImage?: () => void;
  onUploadAddresses?: () => void;
  onViewGallery?: () => void;
  loading?: boolean;
}

export const QuickActions = ({
  onGenerateImage,
  onUploadAddresses,
  onViewGallery,
  loading = false,
}: QuickActionsProps) => {
  return (
    <Stack gap="md">
      <Title order={4}>Quick Actions</Title>
      <Text size="sm" c="dimmed">
        Common operations and shortcuts. Use <Kbd>⌘</Kbd>+<Kbd>1-8</Kbd> to
        navigate.
      </Text>

      <Group gap="sm">
        <Button
          variant="filled"
          onClick={onGenerateImage}
          loading={loading}
          disabled={!onGenerateImage}
        >
          Generate New Image{' '}
          <Text span size="xs" c="dimmed">
            ⌘3
          </Text>
        </Button>

        <Button
          variant="outline"
          onClick={onUploadAddresses}
          disabled={!onUploadAddresses || loading}
        >
          Upload Address List
        </Button>

        <Button
          variant="light"
          onClick={onViewGallery}
          disabled={!onViewGallery || loading}
        >
          View Gallery
        </Button>
      </Group>
    </Stack>
  );
};
