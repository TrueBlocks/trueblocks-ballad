import { useEffect, useState } from 'react';

import { GetFilename, GetOrgPreferences } from '@app';
import { Socials, getBarWidth } from '@components';
import { useEvent, usePreferences } from '@hooks';
import { AppShell, Flex, Text } from '@mantine/core';
import { msgs, preferences, project } from '@models';

export const Footer = () => {
  var [org, setOrg] = useState<preferences.OrgPreferences>({});
  const { menuCollapsed } = usePreferences();

  useEffect(() => {
    const fetchOrgName = async () => {
      GetOrgPreferences().then((data) => {
        setOrg(data);
      });
    };
    fetchOrgName();
  }, []);

  return (
    <AppShell.Footer ml={getBarWidth(menuCollapsed, 1) - 1}>
      <Flex h="100%" px="md" align="center" justify="space-between">
        <FilePanel />
        <Text size="sm">{org.developerName} © 2025</Text>
        <Socials />
      </Flex>
    </AppShell.Footer>
  );
};

export const FilePanel = () => {
  const [status, setStatus] = useState<project.Project | null>(null);

  useEffect(() => {
    const fetchFilename = async () => {
      setStatus(await GetFilename());
    };
    fetchFilename();
  }, []);

  useEvent(msgs.EventType.MANAGER, async (_message?: string) => {
    setStatus(await GetFilename());
  });

  return (
    <>{status ? <Text>{status.name}</Text> : <Text>No Open Project</Text>}</>
  );
};
