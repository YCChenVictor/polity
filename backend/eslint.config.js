// eslint.config.ts
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-plugin-prettier";

export default [
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,

  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/*.config.js",
      "**/migrations/**",
    ],
  },

  {
    files: ["**/*.ts"],
    plugins: { prettier },
    rules: {
      "prettier/prettier": "error",
      // "no-console": ["error"],
    },
  },
];
