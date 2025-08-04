import { useEffect, useState } from 'react';

import {
  BuildDalleDressForProject,
  ConvertToAddress,
  GetProjectAddress,
  SetProjectAddress,
} from '@app';
import { TabView } from '@layout';
import {
  Box,
  Button,
  Group,
  Image,
  Loader,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { base } from '@models';
import { addressToHex } from '@utils';

// Address Entry Component
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function AddressEntry({ address, setAddress, onSubmit, loading, error }: any) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <Group align="end" mb="md">
        <TextInput
          label="Address or ENS Name"
          placeholder="0x... or vitalik.eth"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          error={error}
        />
        <Button type="submit" loading={loading}>
          Build Image
        </Button>
      </Group>
    </form>
  );
}

// DalleDress Builder Component
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function DalleDressBuilder({ address }: any) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [parts, setParts] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBuild = async () => {
    setLoading(true);
    setError(null);
    setImageUrl(null);
    setParts(null);
    try {
      const result = await BuildDalleDressForProject();
      if (result && result.imageUrl) {
        setImageUrl(result.imageUrl);
        setParts(result.parts);
      } else {
        setError('No image or parts returned');
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(e?.message || 'Failed to build DalleDress');
    }
    setLoading(false);
  };

  return (
    <Box>
      <Button
        onClick={handleBuild}
        loading={loading}
        mb="md"
        disabled={!address}
      >
        Generate DalleDress Image
      </Button>
      {loading && <Loader />}
      {error && (
        <Box c="red" mb="md">
          {error}
        </Box>
      )}
      {imageUrl && <Image src={imageUrl} alt="DalleDress" mt="md" />}
      {parts && (
        <Box mt="md">
          <Title order={5}>Parts</Title>
          <pre
            style={{
              textAlign: 'left',
              background: '#222',
              color: '#fff',
              padding: '1em',
              borderRadius: 8,
            }}
          >
            {JSON.stringify(parts, null, 2)}
          </pre>
        </Box>
      )}
    </Box>
  );
}

export const DalleDress = () => {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // On mount, fetch the current project address
  useEffect(() => {
    GetProjectAddress().then((addr: base.Address) => {
      if (addr && addr.address && addr.address.length > 0) {
        setAddress(addressToHex(addr));
      }
    });
  }, []);

  const handleAddressSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await ConvertToAddress(address);
      if (result && (result as base.Address).address) {
        await SetProjectAddress(result as base.Address);
        setError(null);
      } else {
        setError('Invalid address or ENS name');
      }
    } catch (e) {
      setError('Failed to resolve address ' + e);
    }
    setLoading(false);
  };

  const tabs = [
    {
      label: 'Template1',
      value: 'template1',
      content: (
        <Stack>
          <AddressEntry
            address={address}
            setAddress={setAddress}
            onSubmit={handleAddressSubmit}
            loading={loading}
            error={error}
          />
          <DalleDressBuilder address={address} />
        </Stack>
      ),
    },
    // { label: 'Template2', value: 'template2', content: <div>Template 2 content</div> },
    // ...add more templates as needed
  ];

  return <TabView tabs={tabs} route="ballad" />;
};
