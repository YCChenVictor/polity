// vitest.config.ts
import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ".env.test");

  Object.assign(process.env, env);

  return {
    test: {
      include: ["tests/**/*.test.ts"],
      coverage: {
        provider: "v8",
        include: ["src/**/*.ts", "lib/**/*.ts", "api/**/*.ts", "services/**/*.ts"],
        exclude: ["dist/**", "node_modules/**", "test/**", "generated.ts"],
        reporter: ["text", "html"],
      },
      setupFiles: ["tests/setup.ts"],
    },
    ssr: {
      noExternal: ["@wagmi/core"],
    },
  };
});
