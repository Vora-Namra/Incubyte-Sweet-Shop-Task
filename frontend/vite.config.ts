import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // production build works from root
  server: {
    proxy: {} // configure if you want to proxy API in dev
  },
  build: {
    outDir: 'dist',   // default is dist, fine for Vercel
    sourcemap: true   // optional, useful for debugging prod issues
  }
});
