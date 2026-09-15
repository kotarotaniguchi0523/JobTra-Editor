import 'urlpattern-polyfill';
import funstackStatic from '@funstack/static';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

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
