import { defineConfig } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';

export default defineConfig([
  {
    ignores: ['**/.next/**', '**/out/**', '**/build/**', '**/next-env.d.ts', 'coverage/**'],
  },
  ...nextVitals,
  {
    rules: {
      '@next/next/no-img-element': 'off',
    },
  },
]);
