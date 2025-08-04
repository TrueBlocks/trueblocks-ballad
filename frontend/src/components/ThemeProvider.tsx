import { ReactNode, useEffect, useState } from 'react';

import { usePreferences } from '@hooks';
import {
  MantineColorScheme,
  MantineProvider,
  createTheme,
} from '@mantine/core';

interface ThemeProviderProps {
  children: ReactNode;
}

const theme = createTheme({
  primaryColor: 'green',
  fontFamily: 'Roman',
});

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const { isDarkMode, loading } = usePreferences();
  const [colorScheme, setColorScheme] = useState<MantineColorScheme>('dark');

  // Update Mantine color scheme when app preferences change
  useEffect(() => {
    setColorScheme(isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Don't render until preferences are loaded to avoid theme flicker
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <MantineProvider theme={theme} defaultColorScheme={colorScheme}>
      {children}
    </MantineProvider>
  );
};
