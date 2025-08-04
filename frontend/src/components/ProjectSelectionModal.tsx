import { useEffect, useRef, useState } from 'react';

import { SaveProject } from '@app';
import { Action, StatusIndicator } from '@components';
import { useViewContext } from '@contexts';
import { useActiveProject, useIconSets } from '@hooks';
import {
  Badge,
  Button,
  Card,
  Group,
  Modal,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useLocation } from 'wouter';

interface ProjectSelectionModalProps {
  opened: boolean;
  onProjectSelected: () => void;
}

interface NewProjectForm {
  name: string;
  address: string;
}

export const ProjectSelectionModal = ({
  opened,
  onProjectSelected,
}: ProjectSelectionModalProps) => {
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingOpen, setLoadingOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { File, Add } = useIconSets();
  const { restoreProjectFilterStates } = useViewContext();
  const { projects, lastView, newProject, openProjectFile } =
    useActiveProject();
  const [, navigate] = useLocation();
  const isMounted = useRef(true);

  const form = useForm<NewProjectForm>({
    initialValues: {
      name: '',
      address: '',
    },
    validate: {
      name: (value) => (!value ? 'Project name is required' : null),
      address: (value) => {
        if (!value) return 'Primary address is required';
        // Allow .eth names or standard Ethereum addresses
        if (value.endsWith('.eth')) {
          // ENS names ending with .eth are valid - backend will resolve them
          if (value.length < 5) {
            // minimum: "a.eth" = 5 chars
            return 'ENS name too short';
          }
          if (!/^[a-z0-9-]+\.eth$/i.test(value)) {
            return 'Invalid ENS name format';
          }
          return null;
        }
        // Standard Ethereum address validation
        if (!/^0x[a-fA-F0-9]{40}$/.test(value)) {
          return 'Invalid Ethereum address format (use 0x... or .eth name)';
        }
        return null;
      },
    },
  });

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleCreateProject = async (values: NewProjectForm) => {
    if (loadingCreate || loadingOpen) return;
    setLoadingCreate(true);
    setError(null);

    try {
      await newProject(values.name, values.address);

      // Immediately save the project after creation
      await SaveProject();

      await restoreProjectFilterStates();

      const targetView = lastView || '/';
      navigate(targetView);

      onProjectSelected();
    } catch (err) {
      const errorMsg = `Failed to create project: ${err}`;
      setError(errorMsg);
    } finally {
      setLoadingCreate(false);
    }
  };

  const handleOpenProject = async (projectPath: string) => {
    if (loadingCreate || loadingOpen) return;
    setLoadingOpen(true);
    setError(null);

    try {
      await openProjectFile(projectPath);
      await restoreProjectFilterStates();

      const targetView = lastView || '/';
      navigate(targetView);

      onProjectSelected();
    } catch (err) {
      const errorMsg = `Failed to open project: ${err}`;
      setError(errorMsg);
    } finally {
      setLoadingOpen(false);
    }
  };

  const handleOpenFile = async () => {
    if (loadingCreate || loadingOpen) return;
    setLoadingOpen(true);
    setError(null);

    try {
      // This will trigger the native file picker
      await openProjectFile('');
      await restoreProjectFilterStates();

      const targetView = lastView || '/';
      navigate(targetView);

      onProjectSelected();
    } catch (err) {
      const errorMsg = `Failed to open project: ${err}`;
      setError(errorMsg);
    } finally {
      setLoadingOpen(false);
    }
  };

  const isLoading = loadingCreate || loadingOpen;

  return (
    <Modal
      opened={opened}
      onClose={() => {}} // Cannot be closed without selecting a project
      centered
      size="lg"
      withCloseButton={false}
      closeOnClickOutside={false}
      closeOnEscape={false}
      overlayProps={{
        backgroundOpacity: 0.8,
        blur: 3,
      }}
    >
      <Stack gap="xl">
        <div style={{ textAlign: 'center' }}>
          <Title order={2} mb="xs">
            Select or Create a Project
          </Title>
          <Text c="dimmed">
            TrueBlocks requires an active project with at least one address to
            continue
          </Text>
        </div>

        {error && (
          <Text c="red" size="sm" style={{ textAlign: 'center' }}>
            {error}
          </Text>
        )}

        <Group gap="xl" align="flex-start" grow>
          {/* Create New Project */}
          <Paper p="md" withBorder>
            <Stack gap="md">
              <Group gap="xs">
                <Add size={20} />
                <Title order={4}>Create New Project</Title>
              </Group>

              <form onSubmit={form.onSubmit(handleCreateProject)}>
                <Stack gap="md">
                  <TextInput
                    label="Project Name"
                    placeholder="My Analysis Project"
                    required
                    {...form.getInputProps('name')}
                  />
                  <TextInput
                    label="Primary Address"
                    placeholder="0x..."
                    required
                    {...form.getInputProps('address')}
                    description="The main Ethereum address for this project"
                  />
                  <Button
                    type="submit"
                    loading={loadingCreate}
                    disabled={isLoading}
                    leftSection={<Add size={16} />}
                    fullWidth
                  >
                    Create Project
                  </Button>
                </Stack>
              </form>
            </Stack>
          </Paper>

          {/* Open Existing Project */}
          <Paper p="md" withBorder>
            <Stack gap="md">
              <Group gap="xs">
                <File size={20} />
                <Title order={4}>Open Project</Title>
              </Group>

              <Button
                variant="outline"
                leftSection={<File size={16} />}
                onClick={handleOpenFile}
                loading={loadingOpen}
                disabled={isLoading}
                fullWidth
              >
                Browse for Project File
              </Button>

              {projects.length > 0 && (
                <>
                  <Text size="sm" fw={500} mt="md">
                    Recent Projects
                  </Text>
                  <Stack gap="sm">
                    {projects.map((project, index) => {
                      const isRecent =
                        new Date().getTime() -
                          new Date(project.lastOpened).getTime() <
                        24 * 60 * 60 * 1000; // Within 24 hours

                      return (
                        <Card key={index} withBorder padding="sm" radius="md">
                          <Stack gap="xs">
                            {/* Project Header */}
                            <Group justify="space-between" wrap="nowrap">
                              <Group gap="xs" style={{ flex: 1, minWidth: 0 }}>
                                <File size={16} />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <Group gap="xs" wrap="nowrap">
                                    <Text
                                      size="sm"
                                      fw={project.isActive ? 600 : 500}
                                      style={{
                                        textOverflow: 'ellipsis',
                                        overflow: 'hidden',
                                        whiteSpace: 'nowrap',
                                      }}
                                    >
                                      {project.name}
                                    </Text>
                                    {project.isActive && (
                                      <Badge
                                        size="xs"
                                        color="blue"
                                        variant="light"
                                      >
                                        Active
                                      </Badge>
                                    )}
                                    {isRecent && (
                                      <Badge
                                        size="xs"
                                        color="green"
                                        variant="light"
                                      >
                                        Recent
                                      </Badge>
                                    )}
                                  </Group>
                                </div>
                              </Group>
                              <Action
                                icon="Switch"
                                size="sm"
                                variant="light"
                                onClick={() => handleOpenProject(project.path)}
                                disabled={isLoading}
                              />
                            </Group>

                            {/* Project Metadata */}
                            <Group
                              justify="space-between"
                              style={{ fontSize: '11px' }}
                            >
                              <Text size="xs" c="dimmed">
                                {new Date(
                                  project.lastOpened,
                                ).toLocaleDateString()}{' '}
                                at{' '}
                                {new Date(
                                  project.lastOpened,
                                ).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </Text>
                              <StatusIndicator
                                status={
                                  project.isActive ? 'healthy' : 'inactive'
                                }
                                label=""
                                size="xs"
                              />
                            </Group>
                          </Stack>
                        </Card>
                      );
                    })}
                  </Stack>
                </>
              )}
            </Stack>
          </Paper>
        </Group>
      </Stack>
    </Modal>
  );
};
