import 'urlpattern-polyfill';
import funstackStatic from '@funstack/static';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

const MINITYPE_BROWSER_BUN_SHIM_ID = '\0minitype-browser-bun-shim';

export default defineConfig(() => {
  return {
    plugins: [
      {
        name: 'rsc-client-bare-import-fix',
        enforce: 'pre',
        async resolveId(source, importer, options) {
          if (source === '#rsc-client') {
            return this.resolve('@funstack/static/entries/rsc-client', importer, {
              skipSelf: true,
              ...options,
            });
          }
        },
      },
      {
        name: 'html-accept-normalizer',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            const url = req.url || '';
            const pathname = url.split('?')[0];
            const hasFileExtension = /\.[a-zA-Z0-9]+$/.test(pathname);
            if (!hasFileExtension || pathname.endsWith('.html')) {
              if (!req.headers.accept || req.headers.accept === '*/*') {
                req.headers.accept = 'text/html,*/*';
              }
            }
            next();
          });
        },
      },
      {
        name: 'minitype-browser-bun-shim',
        enforce: 'pre',
        resolveId(source, importer) {
          if (
            source === './shims/better-sqlite3.bun.js' &&
            importer?.includes('@minitype/minitype/dist/index.browser.js')
          ) {
            return MINITYPE_BROWSER_BUN_SHIM_ID;
          }
        },
        load(id) {
          if (id !== MINITYPE_BROWSER_BUN_SHIM_ID) return;

          // minitype 0.1.6 ships this browser shim as type declarations only,
          // while its browser bundle still contains a dynamic Bun import.
          return `
            class Statement {
              all() { return []; }
              run() { return { changes: 0, lastInsertRowid: 0 }; }
              get() { return undefined; }
            }
            export default class Database {
              constructor() {}
              prepare() { return new Statement(); }
              exec() {}
              pragma() {}
              transaction(fn) { return fn; }
              close() {}
            }
          `;
        },
      },
      funstackStatic({
        ssr: true,
        build: './src/build.ts',
        fsRoutes: {
          dir: './src/pages',
          root: './src/Root.tsx',
          adapter: '@funstack/static/fs-routes/next-adapter',
        },
      }),
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
