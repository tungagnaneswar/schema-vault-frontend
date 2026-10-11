import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

/**
 * Clears the query cache completely to prevent cross-account data leakage.
 * Must be called on logout, session expiration, login, and registration.
 */
export const clearQueryCache = () => {
  queryClient.clear();
};
