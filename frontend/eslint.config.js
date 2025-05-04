import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettierPlugin from "eslint-plugin-prettier";
import jsonPlugin from "eslint-plugin-json";
import jestPlugin from "eslint-plugin-jest";

export default [
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  {
    ignores: ["tsconfig.json", "dist/"],
  },
  {
    plugins: {
      prettier: prettierPlugin,
      jest: jestPlugin,
    },
    rules: {
      "prettier/prettier": "error",
      "no-console": ["error"],
      "jest/no-focused-tests": "error",
    },
  },
  {
    files: ["**/*.json"],
    ...jsonPlugin.configs.recommended,
  },
  {
    files: ["src/node.ts"],
    rules: {
      "no-console": "off",
    },
  },
];
