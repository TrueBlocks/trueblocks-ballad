import { useActiveProject, useIconSets } from '@hooks';
import { ActionIcon, Group, Loader, Select, Text } from '@mantine/core';
import { getDisplayAddress } from '@utils';
import { useLocation } from 'wouter';

interface ProjectContextBarProps {
  compact?: boolean;
}

export const ProjectContextBar = ({
  compact = false,
}: ProjectContextBarProps) => {
  const { Settings } = useIconSets();
  const [, navigate] = useLocation();

  const {
    projects,
    activeAddress,
    activeChain,
    activeContract,
    setActiveAddress,
    setActiveChain,
    setActiveContract,
    switchProject,
    loading,
  } = useActiveProject();

  const currentProject = projects.find((p) => p.isActive);

  const projectOptions = projects.map((project) => ({
    value: project.id,
    label: `${project.name}`,
  }));

  const addressOptions =
    currentProject?.addresses?.map((address) => ({
      value: address,
      label: getDisplayAddress(address),
    })) || [];

  const chainOptions =
    currentProject?.chains?.map((chain) => ({
      value: chain,
      label: chain,
    })) || [];

  const contractOptions = [{ value: '', label: 'No Contract' }];

  const handleProjectChange = async (projectId: string | null) => {
    if (projectId && projectId !== currentProject?.id) {
      await switchProject(projectId);
    }
  };

  const handleAddressChange = async (address: string | null) => {
    if (address && address !== activeAddress) {
      await setActiveAddress(address);
    }
  };

  const handleChainChange = async (chain: string | null) => {
    if (chain && chain !== activeChain) {
      await setActiveChain(chain);
    }
  };

  const handleContractChange = async (contract: string | null) => {
    const contractValue = contract || '';
    if (contractValue !== activeContract) {
      await setActiveContract(contractValue);
    }
  };

  const handleManageProjects = () => {
    navigate('/projects');
  };

  if (loading) {
    return (
      <Group justify="center" p="md">
        <Loader size="sm" />
        <Text size="sm">Loading project context...</Text>
      </Group>
    );
  }

  if (compact) {
    return (
      <Group gap="xs">
        <Select
          size="xs"
          placeholder="Project"
          value={currentProject?.id || ''}
          data={projectOptions}
          onChange={handleProjectChange}
          w={120}
        />
        <Select
          size="xs"
          placeholder="Address"
          value={activeAddress}
          data={addressOptions}
          onChange={handleAddressChange}
          w={140}
        />
        <Select
          size="xs"
          placeholder="Chain"
          value={activeChain}
          data={chainOptions}
          onChange={handleChainChange}
          w={100}
        />
        <Select
          size="xs"
          placeholder="Contract"
          value={activeContract}
          data={contractOptions}
          onChange={handleContractChange}
          w={140}
        />
      </Group>
    );
  }

  return (
    <Group gap="md">
      <Group gap="xs">
        <Text size="sm" fw={500}>
          Project:
        </Text>
        <Select
          size="sm"
          placeholder="Select project"
          value={currentProject?.id || ''}
          data={projectOptions}
          onChange={handleProjectChange}
          w={200}
        />
        <ActionIcon
          size="sm"
          variant="light"
          onClick={handleManageProjects}
          title="Manage Projects"
        >
          <Settings />
        </ActionIcon>
      </Group>

      <Group gap="xs">
        <Text size="sm" fw={500}>
          Address:
        </Text>
        <Select
          size="sm"
          placeholder="Select address"
          value={activeAddress}
          data={addressOptions}
          onChange={handleAddressChange}
          w={200}
        />
      </Group>

      <Group gap="xs">
        <Text size="sm" fw={500}>
          Chain:
        </Text>
        <Select
          size="sm"
          placeholder="Select chain"
          value={activeChain}
          data={chainOptions}
          onChange={handleChainChange}
          w={150}
        />
      </Group>

      <Group gap="xs">
        <Text size="sm" fw={500}>
          Contract:
        </Text>
        <Select
          size="sm"
          placeholder="Select contract"
          value={activeContract}
          data={contractOptions}
          onChange={handleContractChange}
          w={200}
        />
      </Group>
    </Group>
  );
};
