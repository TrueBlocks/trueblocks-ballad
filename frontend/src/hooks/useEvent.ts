import { useEffect } from 'react';

import { EventsOff, EventsOn } from '@runtime';

export const useEvent = function <T = unknown>(
  eventType: string,
  callback: (message: string, payload?: T) => void,
) {
  useEffect(() => {
    // Wrapper to handle Wails event arguments properly
    const wrappedCallback = (...args: unknown[]) => {
      const message = (args[0] as string) || '';
      const payload = args[1] as T | undefined;
      callback(message, payload);
    };

    EventsOn(eventType, wrappedCallback);
    return () => {
      EventsOff(eventType);
    };
  }, [eventType, callback]);
};
