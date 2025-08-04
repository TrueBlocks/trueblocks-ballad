import { ReactNode, useEffect, useRef, useState } from 'react';

import { PanelSkeleton } from './PanelSkeleton';

interface LazyPanelProps {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
  threshold?: number;
  priority?: 'high' | 'normal' | 'low';
}

export const LazyPanel = ({
  children,
  fallback,
  rootMargin = '50px',
  threshold = 0.1,
  priority = 'normal',
}: LazyPanelProps) => {
  const [isVisible, setIsVisible] = useState(priority === 'high');
  const [hasLoaded, setHasLoaded] = useState(priority === 'high');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // High priority panels load immediately
    if (priority === 'high') {
      setIsVisible(true);
      setHasLoaded(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting && !hasLoaded) {
          setIsVisible(true);
          setHasLoaded(true);
          // Once loaded, we can disconnect the observer
          observer.disconnect();
        }
      },
      {
        rootMargin,
        threshold,
      },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasLoaded, priority, rootMargin, threshold]);

  const defaultFallback = <PanelSkeleton />;

  return (
    <div ref={ref}>{isVisible ? children : fallback || defaultFallback}</div>
  );
};
