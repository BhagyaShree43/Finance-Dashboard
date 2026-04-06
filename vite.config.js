// ============================================================
// vite.config.js — Vite 6 Build Configuration
// ============================================================
// Vite 6 works with React 19's new compiler-ready transform.
// @vitejs/plugin-react v4.3+ supports React 19 out of the box.
// ============================================================

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      // React 19 no longer needs the classic JSX runtime.
      // 'automatic' means we do NOT need to import React in every file.
      jsxRuntime: 'automatic',
    }),
  ],
  server: {
    port: 5173,
    open: true, // auto-opens browser on npm run dev
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
