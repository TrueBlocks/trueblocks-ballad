import { DashboardCard, StatusIndicator } from '@components';
import { useActiveProject, useEvent, useIconSets } from '@hooks';
import { Badge, Button, Group, Stack, Text } from '@mantine/core';
import { msgs } from '@models';
import { Log } from '@utils';

interface ProjectsPanelProps {
  onViewAll?: () => void;
  onNewProject?: () => void;
}

export const ProjectsPanel = ({
  onViewAll,
  onNewProject,
}: ProjectsPanelProps) => {
  const { projects } = useActiveProject();
  const { File } = useIconSets();

  useEvent(msgs.EventType.MANAGER, () => {
    Log('Projects updated via manager event');
  });

  // Show only the 3 most recent projects
  const sortedProjects = projects
    .sort(
      (a, b) =>
        new Date(b.lastOpened).getTime() - new Date(a.lastOpened).getTime(),
    )
    .slice(0, 3);

  const activeProject = sortedProjects.find((p) => p.isActive);
  const recentProjects = sortedProjects.filter((p) => !p.isActive);

  return (
    <DashboardCard
      title="Projects"
      subtitle={`${sortedProjects.length} recent`}
      icon={<File size={20} />}
      onClick={onViewAll}
    >
      <Stack gap="sm">
        <div>
          <StatusIndicator
            status={
              activeProject
                ? 'healthy'
                : projects.length > 0
                  ? 'warning'
                  : 'inactive'
            }
            label={activeProject ? 'Active Project' : 'Project Status'}
            size="xs"
          />
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          <Badge size="sm" variant="light" color="blue">
            Total: {projects.length}
          </Badge>
          <Badge size="sm" variant="light" color="green">
            Active: {activeProject ? 1 : 0}
          </Badge>
          <Badge size="sm" variant="light" color="orange">
            Recent: {recentProjects.length}
          </Badge>
        </div>

        <div>
          {activeProject ? (
            <Text size="xs" c="dimmed">
              Active: {activeProject.name}
            </Text>
          ) : recentProjects.length > 0 ? (
            <Text size="xs" c="dimmed">
              Most recent: {recentProjects[0]?.name}
            </Text>
          ) : (
            <Text size="xs" c="dimmed">
              Manage TrueBlocks configuration projects
            </Text>
          )}
        </div>

        <Group gap="xs" mt="auto">
          <Button size="xs" variant="light" onClick={onNewProject}>
            New Project
          </Button>
          {projects.length > 0 && (
            <Button size="xs" variant="outline" onClick={onViewAll}>
              View All
            </Button>
          )}
        </Group>
      </Stack>
    </DashboardCard>
  );
};
