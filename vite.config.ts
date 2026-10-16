/// <reference types="vitest/config" />
import fs from 'node:fs';
import path from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import { sitePaths } from './src/app/site-paths';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  if (env.VITE_PWA_URL) {
    const url = new URL(env.VITE_PWA_URL);
    if (
      url.protocol !== 'https:' ||
      url.pathname !== '/' ||
      url.search ||
      url.hash ||
      url.username ||
      url.password
    )
      throw new Error('VITE_PWA_URL must be an HTTPS origin, without a path or credentials');
  }
  return {
    base: env.VITE_BASE_PATH || '/',
    plugins: [
      {
        name: 'pages-entry-files',
        closeBundle() {
          const html = fs.readFileSync('dist/index.html');
          for (const route of sitePaths.filter((route) => route !== '/')) {
            const dir = path.join('dist', route);
            fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(path.join(dir, 'index.html'), html);
          }
          fs.writeFileSync('dist/404.html', html);
          fs.writeFileSync('dist/.nojekyll', '');
        },
      },
    ],
    build: {
      manifest: true,
      // The Three.js renderer (~600 kB raw) is a lazy, map-only chunk by design.
      chunkSizeWarningLimit: 650,
      rolldownOptions: {
        onwarn(warning, warn) {
          // react-router ships "use client" directives that are irrelevant to this SPA.
          if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
          warn(warning);
        },
      },
    },
    test: { include: ['tests/**/*.test.{ts,tsx}'], environment: 'node' },
  };
});
