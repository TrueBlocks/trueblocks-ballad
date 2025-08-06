import { useState } from 'react';

import {
  Button,
  FileInput,
  Group,
  Modal,
  Stack,
  Text,
  Textarea,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Log } from '@utils';

interface UploadAddressesDialogProps {
  opened: boolean;
  onClose: () => void;
  onUpload: (addresses: string[]) => void;
}

export const UploadAddressesDialog = ({
  opened,
  onClose,
  onUpload,
}: UploadAddressesDialogProps) => {
  const [textAddresses, setTextAddresses] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const parseAddresses = (text: string): string[] => {
    return text
      .split(/[\n,;]/)
      .map((addr) => addr.trim())
      .filter((addr) => addr.length > 0 && addr.startsWith('0x'));
  };

  const handleFileUpload = async (uploadedFile: File | null) => {
    if (!uploadedFile) {
      setFile(null);
      return;
    }

    setFile(uploadedFile);

    try {
      const text = await uploadedFile.text();
      const addresses = parseAddresses(text);
      setTextAddresses(addresses.join('\n'));
    } catch (error) {
      Log('ERROR: Error reading file:', JSON.stringify(error));
    }
  };

  const handleSubmit = async () => {
    const addresses = parseAddresses(textAddresses);

    if (addresses.length === 0) {
      return;
    }

    setLoading(true);
    try {
      await onUpload(addresses);
      setTextAddresses('');
      setFile(null);
      onClose();
    } catch (error) {
      Log('ERROR: Error uploading addresses:', JSON.stringify(error));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setTextAddresses('');
    setFile(null);
    onClose();
  };

  const addressCount = parseAddresses(textAddresses).length;

  return (
    <Modal
      opened={opened}
      onClose={handleCancel}
      title={<Title order={3}>Upload Address List</Title>}
      size="md"
    >
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          Upload a list of Ethereum addresses to add as monitors. You can either
          paste addresses directly or upload a file containing addresses.
        </Text>

        <FileInput
          label="Upload file (CSV, TXT)"
          placeholder="Choose file..."
          value={file}
          onChange={handleFileUpload}
          accept=".csv,.txt,.json"
          clearable
        />

        <Text size="sm" c="dimmed" ta="center">
          — or —
        </Text>

        <Textarea
          label="Paste addresses"
          placeholder="0x1234567890123456789012345678901234567890
0xabcdefabcdefabcdefabcdefabcdefabcdefabcd
..."
          value={textAddresses}
          onChange={(e) => setTextAddresses(e.target.value)}
          rows={6}
          description="Enter one address per line, or separate with commas"
        />

        {addressCount > 0 && (
          <Text size="sm" c="blue">
            {addressCount} valid address{addressCount === 1 ? '' : 'es'} found
          </Text>
        )}

        <Group justify="flex-end" gap="sm">
          <Button variant="subtle" onClick={handleCancel} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            loading={loading}
            disabled={addressCount === 0}
          >
            Add {addressCount} Monitor{addressCount === 1 ? '' : 's'}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export const useUploadAddressesDialog = () => {
  const [opened, { open, close }] = useDisclosure(false);

  return {
    opened,
    open,
    close,
    Dialog: UploadAddressesDialog,
  };
};
