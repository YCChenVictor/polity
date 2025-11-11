import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettierPlugin from "eslint-plugin-prettier";

export default [
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  {
    ignores: [
      "tsconfig.json",
      "dist/",
      "src/generated.ts",
      ".vercel/",
      "node_modules/",
    ],
  },
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": "error",
      // "no-console": ["error"],
    },
  },
  // {
  //   files: [""],
  //   rules: {
  //     "no-console": "off",
  //   },
  // },
];
