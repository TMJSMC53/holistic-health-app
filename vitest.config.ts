import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text-summary', 'html'],
      reportOnFailure: true,
    },
    setupFiles: './tests/setupTests.ts',
  },
});
