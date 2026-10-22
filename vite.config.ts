import { createHash } from 'node:crypto';

import react from '@vitejs/plugin-react';
import { checker } from 'vite-plugin-checker';
import sassDts from 'vite-plugin-sass-dts';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vite';

const hash = (input: string): string =>
  createHash('sha256').update(input).digest('hex').slice(0, 5);

/* Stabilisiert CSS-Modulnamen auch bei Windows-Pfaden und CSS-composes. */
const generateScopedName = (name: string, filename: string): string => {
  const parts = filename.split('?')[0].replace(/\\/g, '/').split('/');
  const baseFilename = (parts.pop() ?? '').replace(/(\.module)?\.\w+$/, '');
  const className = `${baseFilename}__${name}`;

  return `${className}_${hash(`${hash(parts.join('/'))}-${className}`)}`;
};

export default defineConfig({
  plugins: [
    checker({
      typescript: { tsconfigPath: 'tsconfig.app.json' },
    }),
    react(),
    sassDts({
      enabledMode: ['development'],
      esmExport: true,
    }),
    tsconfigPaths(),
  ],
  base: '',
  css: {
    modules: { generateScopedName },
  },
  server: {
    open: true,
  },
});
