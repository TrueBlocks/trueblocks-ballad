import { useEffect, useState } from 'react';

import { GetImageURL } from '@app';
import { useEvent, useIconSets } from '@hooks';
import { ActionIcon, Group, Image, Stack, Text, Title } from '@mantine/core';
import { msgs } from '@models';
import { Log } from '@utils';

interface SampleImageSectionProps {
  onViewGallery?: () => void;
  onGenerateNew?: () => void;
}

export const SampleImageSection = ({
  onViewGallery,
  onGenerateNew,
}: SampleImageSectionProps) => {
  const [sampleImageUrl, setSampleImageUrl] = useState<string>('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { Edit, DalleDress, Add } = useIconSets();

  const loadSampleImage = async () => {
    try {
      setLoading(true);
      setError(null);
      const cacheBuster = new Date().getTime();
      const url = await GetImageURL(`samples/sample1.png?v=${cacheBuster}`);
      setSampleImageUrl(url || '');
    } catch (err) {
      Log(`Error loading sample image: ${err}`);
      setError('Failed to load image');
      setSampleImageUrl('');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSampleImage();
  }, [refreshKey]);

  useEvent(msgs.EventType.IMAGES_CHANGED, (_message?: string) => {
    setRefreshKey((prev) => prev + 1);
  });

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <Title order={4}>Sample Image</Title>
        <Group gap="xs">
          <ActionIcon
            variant="light"
            onClick={handleRefresh}
            loading={loading}
            title="Refresh image"
            disabled={loading}
          >
            <Edit size={16} />
          </ActionIcon>
          {onViewGallery && (
            <ActionIcon
              variant="light"
              onClick={onViewGallery}
              title="View gallery"
              disabled={loading}
            >
              <DalleDress size={16} />
            </ActionIcon>
          )}
          {onGenerateNew && (
            <ActionIcon
              variant="filled"
              onClick={onGenerateNew}
              title="Generate new image"
              disabled={loading}
            >
              <Add size={16} />
            </ActionIcon>
          )}
        </Group>
      </Group>

      {error ? (
        <Text c="red" size="sm">
          {error}
        </Text>
      ) : loading && !sampleImageUrl ? (
        <Text c="dimmed" size="sm">
          Loading sample image...
        </Text>
      ) : sampleImageUrl ? (
        <div style={{ position: 'relative' }}>
          <Image
            src={sampleImageUrl}
            alt="Sample AI-generated image"
            maw={300}
            key={refreshKey}
            radius="md"
            fit="contain"
            fallbackSrc="https://placehold.co/300x200?text=No+Image"
            loading="lazy"
            style={{
              objectFit: 'contain',
              cursor: onViewGallery ? 'pointer' : 'default',
            }}
            onClick={onViewGallery}
          />
          {loading && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
              }}
            >
              <Text size="sm">Refreshing...</Text>
            </div>
          )}
        </div>
      ) : (
        <Text c="dimmed" size="sm">
          No sample image available
        </Text>
      )}

      <Text size="xs" c="dimmed">
        AI-generated images from blockchain data. Click to view gallery or
        generate new images.
      </Text>
    </Stack>
  );
};
