import fs from 'node:fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// All project files live in the repo root, so the icons are copied into the build here.
const rootAssets = ['icon.svg', 'pwa-192.png', 'pwa-512.png'];
const copyRootAssets = () => ({
  name: 'copy-root-assets',
  generateBundle() {
    for (const f of rootAssets) {
      this.emitFile({ type: 'asset', fileName: f, source: fs.readFileSync(f) });
    }
  },
});

// base './' works for GitHub Pages sub-paths and for the Capacitor Android app.
export default defineConfig({
  base: './',
  plugins: [
    react(),
    copyRootAssets(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'PyStep: Learn Python in 3D',
        short_name: 'PyStep',
        description: 'Learn Python from basic to advanced in a 3D world.',
        theme_color: '#0B1020',
        background_color: '#0B1020',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '.',
        scope: '.',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,webmanifest}'],
        // Python (Pyodide) loads from a CDN; cache it so lessons work offline after the first run.
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/pyodide\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'pyodide-cache',
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
});
