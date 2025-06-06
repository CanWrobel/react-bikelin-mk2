import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 4200,
    strictPort: true,
    hmr: {
      host: 'canwrobel.de', // Your domain here
      protocol: 'ws',
      port: 4200
    },
    cors: true,
    watch: {
      usePolling: true
    }
  }
});
