import { useSyncExternalStore } from 'react';

import {
  GetAppPreferences,
  SetAppPreferences,
  SetDebugCollapsed,
  SetHelpCollapsed,
  SetLanguage,
  SetMenuCollapsed,
  SetTheme,
} from '@app';
import { preferences } from '@models';
import { Log, updateAppPreferencesSafely } from '@utils';

export interface UsePreferencesReturn {
  lastTheme: string;
  lastLanguage: string;
  debugCollapsed: boolean;
  menuCollapsed: boolean;
  helpCollapsed: boolean;
  detailCollapsed: boolean;
  loading: boolean;
  toggleTheme: () => Promise<void>;
  changeLanguage: (language: string) => Promise<void>;
  setDebugCollapsed: (collapsed: boolean) => Promise<void>;
  setMenuCollapsed: (collapsed: boolean) => Promise<void>;
  setHelpCollapsed: (collapsed: boolean) => Promise<void>;
  setDetailCollapsed: (enabled: boolean) => Promise<void>;
  isDarkMode: boolean;
}

interface PreferencesState {
  lastTheme: string;
  lastLanguage: string;
  debugCollapsed: boolean;
  menuCollapsed: boolean;
  helpCollapsed: boolean;
  detailCollapsed: boolean;
  loading: boolean;
}

const initialPreferencesState: PreferencesState = {
  lastTheme: 'dark',
  lastLanguage: 'en',
  debugCollapsed: true,
  menuCollapsed: false,
  helpCollapsed: false,
  detailCollapsed: true,
  loading: false,
};

class PreferencesStore {
  private state: PreferencesState = { ...initialPreferencesState };
  private listeners = new Set<() => void>();
  private cachedSnapshot: UsePreferencesReturn | null = null;

  getSnapshot = (): UsePreferencesReturn => {
    if (!this.cachedSnapshot) {
      this.cachedSnapshot = {
        lastTheme: this.state.lastTheme,
        lastLanguage: this.state.lastLanguage,
        debugCollapsed: this.state.debugCollapsed,
        menuCollapsed: this.state.menuCollapsed,
        helpCollapsed: this.state.helpCollapsed,
        detailCollapsed: this.state.detailCollapsed,
        loading: this.state.loading,
        toggleTheme: this.toggleTheme,
        changeLanguage: this.changeLanguage,
        setDebugCollapsed: this.setDebugCollapsed,
        setMenuCollapsed: this.setMenuCollapsed,
        setHelpCollapsed: this.setHelpCollapsed,
        setDetailCollapsed: this.setDetailCollapsed,
        isDarkMode: this.isDarkMode,
      };
    }
    return this.cachedSnapshot;
  };

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  private notify = (): void => {
    this.listeners.forEach((listener) => listener());
  };

  private setState = (updates: Partial<PreferencesState>): void => {
    this.state = { ...this.state, ...updates };
    this.cachedSnapshot = null;
    this.notify();
  };

  private updatePreferences = async (
    updates: Partial<preferences.AppPreferences>,
  ): Promise<void> => {
    try {
      const currentPrefs = await GetAppPreferences();

      if (
        updates.recentProjects !== undefined &&
        !Array.isArray(updates.recentProjects)
      ) {
        Log('ERROR: Invalid recentProjects value, must be an array');
        throw new Error('recentProjects must be an array');
      }

      if (
        updates.silencedDialogs !== undefined &&
        typeof updates.silencedDialogs !== 'object'
      ) {
        Log('ERROR: Invalid silencedDialogs value, must be an object');
        throw new Error('silencedDialogs must be an object');
      }

      if (
        updates.bounds !== undefined &&
        (typeof updates.bounds !== 'object' ||
          typeof updates.bounds.width !== 'number' ||
          typeof updates.bounds.height !== 'number' ||
          updates.bounds.width < 100 ||
          updates.bounds.height < 100)
      ) {
        Log('ERROR: Invalid bounds value, must have valid width/height >= 100');
        throw new Error('bounds must have valid width and height >= 100');
      }

      const updatedPrefs = updateAppPreferencesSafely(currentPrefs, updates);
      await SetAppPreferences(updatedPrefs);
    } catch (error) {
      Log('ERROR: Failed to update preferences: ' + String(error));
      throw error;
    }
  };

  initialize = async (): Promise<void> => {
    try {
      this.setState({ loading: true });

      const prefs = await GetAppPreferences();

      this.setState({
        lastTheme: prefs.lastTheme || 'dark',
        lastLanguage: prefs.lastLanguage || 'en',
        debugCollapsed: prefs.debugCollapsed ?? true,
        menuCollapsed: prefs.menuCollapsed ?? false,
        helpCollapsed: prefs.helpCollapsed ?? false,
        detailCollapsed: prefs.detailCollapsed ?? true,
        loading: false,
      });
    } catch (error) {
      Log('ERROR: Failed to load preferences: ' + String(error));
      this.setState({
        lastTheme: 'dark',
        lastLanguage: 'en',
        debugCollapsed: true,
        menuCollapsed: false,
        helpCollapsed: false,
        detailCollapsed: true,
        loading: false,
      });
    }
  };

  toggleTheme = async (): Promise<void> => {
    const newTheme = this.state.lastTheme === 'dark' ? 'light' : 'dark';
    await SetTheme(newTheme);
    await this.updatePreferences({ lastTheme: newTheme });
    this.setState({ lastTheme: newTheme });
  };

  changeLanguage = async (language: string): Promise<void> => {
    await SetLanguage(language);
    await this.updatePreferences({ lastLanguage: language });
    this.setState({ lastLanguage: language });
  };

  setDebugCollapsed = async (collapsed: boolean): Promise<void> => {
    await SetDebugCollapsed(collapsed);
    await this.updatePreferences({ debugCollapsed: collapsed });
    this.setState({ debugCollapsed: collapsed });
  };

  setMenuCollapsed = async (collapsed: boolean): Promise<void> => {
    await SetMenuCollapsed(collapsed);
    await this.updatePreferences({ menuCollapsed: collapsed });
    this.setState({ menuCollapsed: collapsed });
  };

  setHelpCollapsed = async (collapsed: boolean): Promise<void> => {
    await SetHelpCollapsed(collapsed);
    await this.updatePreferences({ helpCollapsed: collapsed });
    this.setState({ helpCollapsed: collapsed });
  };

  setDetailCollapsed = async (collapsed: boolean): Promise<void> => {
    await this.updatePreferences({ detailCollapsed: collapsed });
    this.setState({ detailCollapsed: collapsed });
  };

  get isDarkMode(): boolean {
    return this.state.lastTheme === 'dark';
  }
}

const preferencesStore = new PreferencesStore();

if (
  typeof window !== 'undefined' &&
  typeof import.meta.env.VITEST === 'undefined'
) {
  setTimeout(() => {
    preferencesStore.initialize();
  }, 0);
}

export const usePreferences = (): UsePreferencesReturn => {
  return useSyncExternalStore(
    preferencesStore.subscribe,
    preferencesStore.getSnapshot,
  );
};
