// eslint.config.ts
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettierPlugin from "eslint-plugin-prettier";

export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/*.config.js",
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  {
    plugins: {
      prettier: prettierPlugin,
      vitest,
    },
    rules: {
      "prettier/prettier": "error",
      "no-console": ["error"],
      "vitest/no-focused-tests": "error",
    },
  },
  {
    files: [],
    rules: {
      "no-console": "off"
    }
  },
  {
    files: ['**/*'],
    ignores: [],
    rules: {
      'no-restricted-properties': [
        'error',
        { object: 'logger', property: 'error', message: "Don't use logger.error" },
      ],
    },
  }
];
