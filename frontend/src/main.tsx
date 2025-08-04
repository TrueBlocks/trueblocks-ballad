import { StrictMode } from 'react';

import '@mantine/core/styles.css';
import { createRoot } from 'react-dom/client';

import { App } from './App';
import { ThemeProvider } from './components/ThemeProvider';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
);
