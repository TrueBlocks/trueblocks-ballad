import { ChevronButton, getBarWidth } from '@components';
import { useIconSets, usePreferences } from '@hooks';
import { AppShell, Button, Stack } from '@mantine/core';
import { MenuItem, MenuItems } from 'src/Menu';
import { useLocation } from 'wouter';

interface MenuBarProps {
  disabled?: boolean;
}

export const MenuBar = ({ disabled = false }: MenuBarProps) => {
  const [currentLocation, navigate] = useLocation();
  const { menuCollapsed, setMenuCollapsed } = usePreferences();

  const topMenuItems = MenuItems.filter((item) => item.position === 'top');
  const botMenuItems = MenuItems.filter((item) => item.position === 'bottom');
  const icons = useIconSets();

  const renderMenuItem = ({ label, path }: MenuItem) => {
    const Icon = icons[label as keyof typeof icons] || icons.Missing;

    return (
      <Button
        key={path}
        variant={currentLocation === path ? 'filled' : 'subtle'}
        fullWidth
        h={36}
        w={menuCollapsed ? 36 : '100%'}
        leftSection={<Icon style={{ marginLeft: menuCollapsed ? 9 : 0 }} />}
        justify={menuCollapsed ? 'center' : 'flex-start'}
        px={menuCollapsed ? 0 : 'md'}
        style={{
          marginLeft: menuCollapsed ? -9 : 0,
        }}
        disabled={disabled}
        onClick={() => {
          if (!disabled) navigate(path);
        }}
      >
        {!menuCollapsed && label}
      </Button>
    );
  };

  return (
    <AppShell.Navbar
      p="md"
      style={{
        paddingTop: 0,
        paddingBottom: 0,
        height: 'calc(100vh - 30px)',
        width: getBarWidth(menuCollapsed, 1),
        transition: 'width 0.2s ease',
      }}
    >
      <Stack h="100%" justify="space-between" gap="sm">
        <Stack gap="sm">
          <ChevronButton
            collapsed={menuCollapsed}
            onToggle={() => setMenuCollapsed(!menuCollapsed)}
            direction="left"
          />
          {topMenuItems.map(renderMenuItem)}
        </Stack>
        <Stack gap="sm" pb="md">
          {botMenuItems.map(renderMenuItem)}
        </Stack>
      </Stack>
    </AppShell.Navbar>
  );
};
