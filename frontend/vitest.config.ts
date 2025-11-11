import { defineConfig } from "vitest/config";
export default defineConfig({
  envDir: ".",
  test: { setupFiles: "./test/setup.ts" },
});
