import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

/**
 * Configuración del Remote de Onboarding.
 * Lógica: Expone OnboardingFlow como microfrontend en puerto 5175.
 */
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'remoteOnboarding',
      filename: 'remoteEntry.js',
      exposes: {
        './OnboardingFlow': './src/OnboardingFlow.tsx',
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
      },
    }),
  ],
  build: {
    target: 'esnext',
    minify: false,
  },
  server: {
    port: 5175,
    cors: true,
  },
  preview: {
    port: 5175,
    cors: true,
  },
});
