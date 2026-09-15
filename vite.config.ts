import 'urlpattern-polyfill';
import funstackStatic from '@funstack/static';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
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
      {
        name: 'minitype-pdf-export-api',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            const url = req.url || '';
            if (url.startsWith('/api/export/pdf') && req.method === 'POST') {
              try {
                const chunks: Buffer[] = [];
                for await (const chunk of req) {
                  chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
                }
                const rawBody = Buffer.concat(chunks).toString('utf-8');
                const body = JSON.parse(rawBody || '{}');

                const { generateEsPdf } = await import('./src/server/exportPdf.ts');
                const pdfBuffer = await generateEsPdf(body);

                res.writeHead(200, {
                  'Content-Type': 'application/pdf',
                  'Content-Disposition': 'attachment; filename="es-export.pdf"',
                  'Content-Length': pdfBuffer.length,
                });
                res.end(Buffer.from(pdfBuffer));
                return;
              } catch (error) {
                console.error('Error in minitype PDF generation:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: (error as Error).message }));
                return;
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
