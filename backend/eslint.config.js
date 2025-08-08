import eslint from '@eslint/js';
import tseslint from "typescript-eslint";

export default [
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  {
    ignores: [
      '**/coverage/**',
      '**/dist/**',
      '**/migrations/**',
      '**/*.config.js',
      '**/*.config.ts',
      'tsconfig.json',
      "**/patch/**",
    ],
  },
]
