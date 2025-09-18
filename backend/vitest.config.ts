import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,        // allows using test(), expect() without imports
    environment: 'node',  // Node.js environment (good for backend APIs)
    include: ["test/**/*.test.ts"],
    coverage: {
      provider: 'v8',     // built-in coverage tool
      reportsDirectory: './coverage'
    }
  }
});
