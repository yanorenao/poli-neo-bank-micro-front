import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

/**
 * Configuración del Remote de TransferWizard.
 * Lógica: Expone TransferWidget como microfrontend en puerto 5174.
 */
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'remoteTransfer',
      filename: 'remoteEntry.js',
      exposes: {
        './TransferWidget': './src/TransferWidget.tsx',
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
    port: 5174,
    cors: true,
  },
  preview: {
    port: 5174,
    cors: true,
  },
});
