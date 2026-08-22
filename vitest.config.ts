import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
    globals: true,
    globalSetup: ["./tests/global-setup.ts"],
    setupFiles: ["./tests/setup.ts"],
    testTimeout: 20000,
    hookTimeout: 30000,
    // All test files share one in-memory MongoDB instance and each test's
    // afterEach wipes every collection — running files in parallel would let
    // one file's cleanup race another file's still-running test.
    fileParallelism: false,
  },
});
