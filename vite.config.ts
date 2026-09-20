import 'urlpattern-polyfill';
import funstackStatic from '@funstack/static';
import tailwindcss from '@tailwindcss/vite';
import babel from '@rolldown/plugin-babel';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

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
        build: './src/app/build.ts',
        fsRoutes: {
          dir: './src/pages',
          root: './src/app/Root.tsx',
          adapter: '@funstack/static/fs-routes/next-adapter',
        },
      }),
      react(),
      // Compile client React components at build time. The compiler owns
      // memoization, so components do not need manual memo/useMemo/useCallback.
      babel({ presets: [reactCompilerPreset()] }),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@app': path.resolve(import.meta.dirname, 'src/app'),
        '@entities': path.resolve(import.meta.dirname, 'src/entities'),
        '@features': path.resolve(import.meta.dirname, 'src/features'),
        '@pages': path.resolve(import.meta.dirname, 'src/pages'),
        '@shared': path.resolve(import.meta.dirname, 'src/shared'),
        '@widgets': path.resolve(import.meta.dirname, 'src/widgets'),
      },
    },
    server: {
      // HMR can be disabled via DISABLE_HMR when the workspace edits files externally.
      // File watching is disabled in the same mode to prevent unnecessary rebuilds.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      // The browser minitype/PDF engine is intentionally loaded only by the
      // export island; its generated lazy chunk is large by design.
      chunkSizeWarningLimit: 10_000,
    },
  };
});
