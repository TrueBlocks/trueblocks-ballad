import React, { useEffect, useRef } from 'react';

import { StatusBar } from '@layout';
import { AppShell } from '@mantine/core';
import { MenuItem, MenuItems } from 'src/Menu';
import { Route, useLocation } from 'wouter';

import './MainView.css';

function isComponentMenuItem(
  item: MenuItem,
): item is MenuItem & { component: React.ComponentType } {
  return !!item.component;
}

export const MainView = () => {
  const [currentLocation] = useLocation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [currentLocation]);

  return (
    <AppShell.Main
      style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div
        ref={scrollContainerRef}
        style={{
          width: '100%',
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          position: 'relative',
        }}
      >
        {MenuItems.filter(isComponentMenuItem).map((item) => (
          <Route key={item.path} path={item.path}>
            {React.createElement(item.component)}
          </Route>
        ))}
      </div>

      <div
        style={{
          width: '100%',
        }}
      >
        <StatusBar />
      </div>
    </AppShell.Main>
  );
};
