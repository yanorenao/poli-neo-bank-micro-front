import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

/**
 * Configuración del Shell como Host de Module Federation.
 * Lógica: Consume los remotes de Onboarding (5175) y Transfer (5174) en runtime.
 */
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'shell',
      remotes: {
        remoteTransfer: 'http://localhost:5174/assets/remoteEntry.js',
        remoteOnboarding: 'http://localhost:5175/assets/remoteEntry.js',
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: '^18.2.0',
        },
        'react-dom': {
          singleton: true,
          requiredVersion: '^18.2.0',
        },
        '@tanstack/react-query': {
          singleton: true,
          requiredVersion: '^5.28.0',
        },
        'react-router-dom': {
          singleton: true,
          requiredVersion: '^6.22.3',
        },
      },
    }),
  ],
  build: {
    target: 'esnext',
    minify: false,
  },
  server: {
    port: 5173,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
  },
});
