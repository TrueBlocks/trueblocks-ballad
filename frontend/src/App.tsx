import { useEffect, useState } from 'react';

import { NodeStatus, ProjectSelectionModal, getBarWidth } from '@components';
import { ViewContextProvider, WalletConnectProvider } from '@contexts';
import {
  useActiveProject,
  useAppHealth,
  useAppHotkeys,
  useAppNavigation,
  useEvent,
  usePreferences,
} from '@hooks';
import { Footer, Header, HelpBar, MainView, MenuBar } from '@layout';
import { AppShell } from '@mantine/core';
import { msgs } from '@models';
import { Log, initializePreferencesDefaults } from '@utils';
import { WalletConnectModalSign } from '@walletconnect/modal-sign-react';
import { Router } from 'wouter';

import { useGlobalEscape } from './hooks/useGlobalEscape';

// Add at the top level, outside the component
function globalNavKeySquelcher(e: KeyboardEvent) {
  const navKeys = [
    'ArrowUp',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'PageUp',
    'PageDown',
    'Home',
    'End',
  ];

  const activeElement = document.activeElement as HTMLElement;
  const isFormElement =
    activeElement &&
    (activeElement.tagName === 'INPUT' ||
      activeElement.tagName === 'TEXTAREA' ||
      activeElement.tagName === 'SELECT' ||
      activeElement.isContentEditable);

  if (navKeys.includes(e.key) && !isFormElement) {
    // Only squelch if not handled by a focused form control
    e.preventDefault();
  }
}

export const App = () => {
  const [showProjectModal, setShowProjectModal] = useState(false);
  const { hasActiveProject } = useActiveProject();

  useEffect(() => {
    // Initialize preferences defaults cache on app startup
    initializePreferencesDefaults().catch((error) => {
      Log(
        'WARNING: Failed to initialize preferences defaults: ' + String(error),
      );
    });

    window.addEventListener('keydown', globalNavKeySquelcher, {
      capture: true,
    });
    return () => {
      window.removeEventListener('keydown', globalNavKeySquelcher, {
        capture: true,
      });
    };
  }, []);

  // Show project modal if we don't have a valid project
  useEffect(() => {
    setShowProjectModal(!hasActiveProject);
  }, [hasActiveProject]);

  // Listen for project events
  useEvent(msgs.EventType.MANAGER, (message: string) => {
    if (message === 'show_project_modal') {
      setShowProjectModal(true);
    }
  });

  useEvent(msgs.EventType.PROJECT_OPENED, () => {
    // Project was opened successfully, modal should close
    setShowProjectModal(false);
  });

  const { ready } = useAppNavigation();
  const { menuCollapsed, helpCollapsed } = usePreferences();

  useAppHotkeys();
  useAppHealth();
  useGlobalEscape();

  const handleProjectModalClose = () => {
    setShowProjectModal(false);
  };

  if (!ready) return <div>Not ready</div>;

  const header = { height: 60 };
  const footer = { height: 40 };
  const navbar = {
    width: getBarWidth(menuCollapsed, 1),
    breakpoint: 'sm',
    collapsed: { mobile: !menuCollapsed },
  };
  const aside = {
    width: getBarWidth(helpCollapsed, 2),
    breakpoint: 'sm',
    collapsed: { mobile: !helpCollapsed },
  };

  return (
    <Router>
      <WalletConnectProvider>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
          }}
        >
          <AppShell
            layout="default"
            header={header}
            footer={footer}
            navbar={navbar}
            aside={aside}
          >
            <Header />
            <MenuBar />
            <ViewContextProvider>
              <MainView />
            </ViewContextProvider>
            <HelpBar />
            <div
              style={{
                position: 'absolute',
                top: '84px',
                right: `${getBarWidth(helpCollapsed, 2) + 0}px`,
                zIndex: 1000,
              }}
            >
              <NodeStatus />
            </div>
            <Footer />
          </AppShell>
          <WalletConnectModalSign
            projectId={
              import.meta.env.VITE_WALLETCONNECT_PROJECT_ID ||
              (() => {
                Log(
                  'ERROR: VITE_WALLETCONNECT_PROJECT_ID not set in environment variables',
                );
                return 'MISSING_PROJECT_ID';
              })()
            }
            metadata={{
              name: 'TrueBlocks Ballad',
              description:
                'A TrueBlocks desktop application for naming addresses',
              url: 'https://trueblocks.io',
              icons: ['https://trueblocks.io/favicon.ico'],
            }}
          />
          <ProjectSelectionModal
            opened={showProjectModal}
            onProjectSelected={handleProjectModalClose}
          />
        </div>
      </WalletConnectProvider>
    </Router>
  );
};
