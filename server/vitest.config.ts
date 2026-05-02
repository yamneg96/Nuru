import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    hookTimeout: 60000,  // 60s — allow DB connection time
    testTimeout: 30000,  // 30s per test
    sequence: {
      concurrent: false, // Run test files sequentially to avoid DB race conditions
    },
  },
});
