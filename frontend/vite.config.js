import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    allowedHosts: ['lvh.me'],
    proxy: {
      '/api': {
        target: 'https://amir-hyaloid-nonpessimistically.ngrok-free.dev',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});