// Copyright 2016, 2026 The TrueBlocks Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */
import { DalleDress, Home, Khedra, Projects, Settings } from '@views';
import { Exports } from '@views';

export interface MenuItem {
  label: string;
  path: string;
  position: 'top' | 'bottom' | 'hidden';
  component?: React.ComponentType;
  hotkey?: string;
  altHotkey?: string;
  type?: 'navigation' | 'dev' | 'toggle';
  action?: () => void | Promise<void>;
}

export const MenuItems: MenuItem[] = [
  {
    label: 'Home',
    path: '/',
    position: 'top',
    component: Home,
    hotkey: 'mod+1',
    altHotkey: 'alt+1',
    type: 'navigation',
  },
  {
    label: 'Exports',
    path: '/exports',
    position: 'top',
    component: Exports,
    hotkey: 'mod+2',
    altHotkey: 'alt+2',
    type: 'navigation',
  },
  {
    label: 'DalleDress',
    path: '/dalledress',
    position: 'top',
    component: DalleDress,
    hotkey: 'mod+9',
    altHotkey: 'alt+9',
    type: 'navigation',
  },
  {
    label: 'Khedra',
    path: '/khedra',
    position: 'bottom',
    component: Khedra,
    hotkey: 'mod+0',
    altHotkey: 'alt+0',
    type: 'navigation',
  },
  {
    label: 'Projects',
    path: '/projects',
    position: 'bottom',
    component: Projects,
    hotkey: 'mod+shift+0',
    altHotkey: 'alt+shift+0',
    type: 'navigation',
  },
  {
    label: 'Settings',
    path: '/settings',
    position: 'bottom',
    component: Settings,
    hotkey: 'mod+shift+1',
    altHotkey: 'alt+shift+1',
    type: 'navigation',
  },
];
