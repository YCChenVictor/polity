import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts", "lib/**/*.ts", "api/**/*.ts", "services/**/*.ts"],
      exclude: ["dist/**", "node_modules/**", "test/**", "generated.ts"],
      reporter: ["text", "html"],
    },
  },
});
