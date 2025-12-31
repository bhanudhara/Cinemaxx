import '@testing-library/jest-dom';

// Mock import.meta for tests
Object.defineProperty(global, 'import', {
  value: {
    meta: {
      env: {
        VITE_TMDB_BEARER_TOKEN: 'test-token',
        VITE_TMDB_API_KEY: 'test-key',
      },
    },
  },
});