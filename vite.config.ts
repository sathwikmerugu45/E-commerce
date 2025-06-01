import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': process.env
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  base: './', // Important for Vercel
  build: {
    outDir: 'dist' // Default, but explicit for clarity
  }
});
