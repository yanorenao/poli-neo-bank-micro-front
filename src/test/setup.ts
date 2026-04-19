// src/test/setup.ts
// Configuración global de pruebas para Vitest
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Limpiar después de cada prueba
afterEach(() => {
  cleanup();
});
