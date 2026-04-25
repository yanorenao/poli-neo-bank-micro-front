import React from 'react';
import type { FallbackProps } from '@poli/shared-types';

/**
 * Fallback UI que se renderiza cuando un microfrontend remoto falla al cargar.
 * Lógica: Muestra error descriptivo + botón "Reintentar" para que el ErrorBoundary reintente.
 */
export const RemoteFallback: React.FC<FallbackProps> = ({
  error,
  resetErrorBoundary,
  remoteName = 'microfrontend',
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 bg-red-50 rounded-lg border-2 border-red-200">
      <div className="text-red-500 text-6xl mb-4">⚠️</div>

      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Error al Cargar {remoteName}
      </h2>

      <p className="text-gray-600 text-center mb-6 max-w-md">
        Hubo un problema al cargar este módulo. Por favor, intenta nuevamente.
      </p>

      <details className="mb-6 max-w-md w-full">
        <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 select-none">
          Detalles técnicos
        </summary>
        <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto text-red-700">
          {error.message}
        </pre>
      </details>

      <button
        onClick={resetErrorBoundary}
        className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
      >
        🔄 Reintentar
      </button>
    </div>
  );
};
