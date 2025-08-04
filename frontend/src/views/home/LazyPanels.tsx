import { lazy } from 'react';

// Lazy load panel components
export const LazyProjectsPanel = lazy(() =>
  import('./panels/ProjectsPanel').then((module) => ({
    default: module.ProjectsPanel,
  })),
);

export const LazyExportsPanel = lazy(() =>
  import('./panels/ExportsPanel').then((module) => ({
    default: module.ExportsPanel,
  })),
);
