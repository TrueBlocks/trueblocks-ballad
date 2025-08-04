import { render } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import { useGlobalEscape } from '../useGlobalEscape';

vi.mock('react-hotkeys-hook', () => ({
  useHotkeys: vi.fn(),
}));

describe('useGlobalEscape', () => {
  test('should initialize without throwing', () => {
    const TestComponent = () => {
      useGlobalEscape();
      return <div>Test</div>;
    };

    expect(() => render(<TestComponent />)).not.toThrow();
  });

  test('should accept options', () => {
    const TestComponent = () => {
      useGlobalEscape({
        enabled: false,
        onEscape: () => console.log('escaped'),
      });
      return <div>Test</div>;
    };

    expect(() => render(<TestComponent />)).not.toThrow();
  });
});
