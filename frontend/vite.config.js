import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    allowedHosts: ['lvh.me'],
    proxy: {
      '/api': {
        target: 'https://d6d198421cffb3fe-91-222-39-212.serveousercontent.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
