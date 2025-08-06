import { useActiveProject, useIconSets } from '@hooks';
import { ActionIcon, Group, Loader, Select, Text } from '@mantine/core';
import { PeriodOptions, getDisplayAddress } from '@utils';
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
    activePeriod,
    setActiveAddress,
    setActiveChain,
    setActivePeriod,
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

  const handleManageProjects = () => {
    navigate('/projects');
  };

  const handlePeriodChange = (period: string | null) => {
    if (period !== null) {
      setActivePeriod(period);
    }
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
          placeholder="Period"
          value={activePeriod}
          data={PeriodOptions}
          onChange={handlePeriodChange}
          w={110}
        />
      </Group>
    );
  }

  return (
    <>
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
            Period:
          </Text>
          <Select
            size="sm"
            placeholder="Select period"
            value={activePeriod}
            data={PeriodOptions}
            onChange={handlePeriodChange}
            w={150}
          />
        </Group>
      </Group>
    </>
  );
};
