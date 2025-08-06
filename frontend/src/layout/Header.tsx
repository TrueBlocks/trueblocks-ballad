import { useEffect, useState } from 'react';

import { GetAppId } from '@app';
import { Action, ProjectContextBar, WalletConnectButton } from '@components';
import { usePreferences } from '@hooks';
import { AppShell, Group, Text, useMantineColorScheme } from '@mantine/core';

export const Header = () => {
  const [appName, setAppName] = useState('AppName');
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const { toggleTheme, isDarkMode, setDebugCollapsed, debugCollapsed } =
    usePreferences();

  useEffect(() => {
    GetAppId().then((id) => {
      setAppName(id.appName);
    });
  }, []);

  useEffect(() => {
    setColorScheme(isDarkMode ? 'dark' : 'light');
  }, [isDarkMode, setColorScheme]);

  const handleToggleTheme = async () => {
    await toggleTheme();
  };

  return (
    <AppShell.Header>
      <Group justify="space-between" p="md" h="100%">
        <Text size="xl" fw={700}>
          {appName}
        </Text>
        <ProjectContextBar />
        <Group justify="flex-end" align="center" gap="xs">
          <Action
            icon="DebugOn"
            iconOff="DebugOff"
            isOn={!debugCollapsed}
            onClick={() => setDebugCollapsed(!debugCollapsed)}
            title={
              debugCollapsed
                ? 'Debug mode OFF - Click to enable'
                : 'Debug mode ON - Click to disable'
            }
            variant="default"
            color={debugCollapsed ? 'gray' : 'red'}
          />
          <Action
            icon="Light"
            iconOff="Dark"
            isOn={colorScheme === 'light'}
            onClick={handleToggleTheme}
            title="Toggle color scheme"
            variant="default"
            color={colorScheme === 'dark' ? 'yellow' : 'blue'}
          />
          <WalletConnectButton />
        </Group>
      </Group>
    </AppShell.Header>
  );
};
