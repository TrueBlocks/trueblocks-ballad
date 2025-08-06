import { useEffect } from 'react';

import { MantineProvider } from '@mantine/core';
import { setupWailsMocks } from '@mocks';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { Wizard } from '../Wizard';

setupWailsMocks();

const mockNavigate = vi.fn();
const mockCompleteWizard = vi.fn().mockResolvedValue(undefined);

// Mock wouter for navigation
vi.mock('wouter', () => ({
  useLocation: () => ['/wizard', mockNavigate],
}));

// We need to make the step navigation actually work in our test
let activeStep = 0;
const mockUpdateUI = vi.fn().mockImplementation((data) => {
  if (data && typeof data.activeStep === 'number') {
    activeStep = data.activeStep;
  }
});

// Mock for hooks with better state handling - include ALL required exports
vi.mock('../hooks', () => ({
  useWizardState: () => ({
    state: {
      data: {
        name: '',
        email: '',
        isFirstTimeSetup: true,
      },
      ui: { activeStep },
      validation: {},
    },
    updateData: vi.fn(),
    updateValidation: vi.fn(),
    updateUI: mockUpdateUI,
    submitUserInfo: vi.fn().mockImplementation(() => {
      // This simulates moving to step 1 when user info is submitted
      mockUpdateUI({ activeStep: 1 });
      return Promise.resolve();
    }),
    submitChainInfo: vi.fn().mockImplementation(() => {
      // This simulates moving to step 2 when RPC is submitted
      mockUpdateUI({ activeStep: 2 });
      return Promise.resolve();
    }),
    completeWizard: mockCompleteWizard,
  }),
  useWizardNavigation: () => ({}),
  useWizardValidation: () => ({
    validateName: vi.fn().mockReturnValue(true),
    validateEmail: vi.fn().mockReturnValue(true),
    validateRpc: vi.fn().mockReturnValue(true),
    validateUserInfo: vi.fn().mockReturnValue(true),
  }),
}));

// Mock for useFormHotkeys to handle ESC key
vi.mock('@hooks', () => ({
  useFormHotkeys: ({ onCancel }: { onCancel?: () => void }) => {
    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onCancel?.();
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, [onCancel]);
  },
  useIconSets: () => ({
    Abis: () => null,
    Chuncks: () => null,
    Export: () => null,
    Monitors: () => null,
    Names: () => null,

    Home: () => null,
    Khedra: () => null,
    DalleDress: () => null,
    Settings: () => null,
    Wizard: () => null,
    Switch: () => null,
    File: () => null,
    Twitter: () => null,
    Github: () => null,
    Website: () => null,
    Email: () => null,
    Add: () => null,
    Edit: () => null,
    Delete: () => null,
    Undelete: () => null,
    Remove: () => null,
    ChevronLeft: () => null,
    ChevronRight: () => null,
    ChevronUp: () => null,
    ChevronDown: () => null,
    Light: () => null,
    Dark: () => null,
  }),
  useActiveProject: () => ({
    // State values that come from focused hooks
    lastTheme: 'light',
    lastLanguage: 'en',
    lastView: 'home',
    menuCollapsed: false,
    helpCollapsed: false,
    lastFacetMap: {},
    loading: false,
    activeAddress: '0x123',
    activeChain: 'mainnet',
    activeContract: '0x52df6e4d9989e7cf4739d687c765e75323a1b14c',
    effectiveAddress: '0x123',
    effectiveChain: 'mainnet',
    lastProject: 'test-project',
    // Actions
    setActiveAddress: vi.fn(),
    setActiveChain: vi.fn(),
    setActiveContract: vi.fn(),
    switchProject: vi.fn(),
    toggleTheme: vi.fn(),
    changeLanguage: vi.fn(),
    setMenuCollapsed: vi.fn(),
    setHelpCollapsed: vi.fn(),
    setLastFacet: vi.fn(),
    setLastView: vi.fn(),
    setViewAndFacet: vi.fn(),
    // Computed values
    isDarkMode: false,
    hasActiveProject: true,
    canExport: true,
  }),
}));

describe('Wizard', () => {
  beforeEach(() => {
    // Reset active step before each test
    activeStep = 0;
    vi.clearAllMocks();
  });

  test('renders first step with user info form', async () => {
    render(
      <MantineProvider>
        <Wizard />
      </MantineProvider>,
    );

    // Wait for initial step to be visible and inputs to appear
    await waitFor(() => {
      expect(
        screen.getByText('User Information', {
          selector: 'span.mantine-Stepper-stepLabel',
        }),
      ).toBeInTheDocument();
    });

    expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
  });

  test('can navigate to next step when fields are filled', async () => {
    render(
      <MantineProvider>
        <Wizard />
      </MantineProvider>,
    );

    // Fill in required fields using more robust selectors
    const nameInput = screen.getByPlaceholderText('Enter your name');
    const emailInput = screen.getByPlaceholderText('Enter your email');

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    // Click Next button using getByRole instead of direct node access
    const nextButton = screen.getByRole('button', { name: /Next/i });
    fireEvent.click(nextButton);

    // Verify navigation to Chain Configuration step
    await waitFor(() => {
      expect(
        screen.getByText('Chain Configuration', {
          selector: 'span.mantine-Stepper-stepLabel',
        }),
      ).toBeInTheDocument();
    });
  });
});
