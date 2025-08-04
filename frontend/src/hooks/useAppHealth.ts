import { useAppNavigation } from './useAppNavigation';

export const useAppHealth = () => {
  const { ready } = useAppNavigation();

  // Health check hook simplified - no wizard logic needed
  return { ready };
};
