import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider, useQuery, useQueryClient } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import type { IShellProps, Transaction } from '@poli/shared-types';
import { RemoteFallback } from './components/RemoteErrorBoundary';
import { TransferSkeleton } from './components/TransferSkeleton';
import { OnboardingSkeleton } from './components/OnboardingSkeleton';

/**
 * Carga dinámica de los microfrontends remotos via Module Federation.
 * Lógica: React.lazy + import() — Vite Module Federation resuelve en runtime.
 */
const RemoteTransferWidget = React.lazy(
  () => import('remoteTransfer/TransferWidget')
);
const RemoteOnboardingFlow = React.lazy(
  () => import('remoteOnboarding/OnboardingFlow')
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1 },
    mutations: { retry: 0 },
  },
});

import { useBalanceQuery } from './queries/bankQueries';

/**
 * Header global con display del saldo.
 * Lógica: Muestra skeleton "$—,——" mientras carga para evitar pánico "saldo en cero".
 */
function AppHeader() {
  const { data, isPending, isError, refetch } = useBalanceQuery();
  const balance = data?.balance ?? null;

  return (
    <header className="bg-teal-700 text-white shadow-md">
      <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold tracking-tight hover:text-teal-100 transition-colors">
          NeoBank
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            to="/transfer"
            className="text-teal-100 hover:text-white text-sm font-medium transition-colors"
          >
            Transferencias
          </Link>
          <div className="flex flex-col items-end">
            <span className="text-teal-100 text-xs">Saldo Total</span>
            {isPending ? (
              <span className="text-teal-200 font-mono text-lg font-bold animate-pulse">$—,——</span>
            ) : isError ? (
              <button
                onClick={() => refetch()}
                className="text-xs text-teal-100 hover:text-white underline"
              >
                Error · Reintentar
              </button>
            ) : (
              <span className="text-2xl font-bold text-teal-50">
                ${balance?.toLocaleString('es-CO')}
              </span>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

/**
 * Contenido principal con rutas y ErrorBoundaries por remote.
 * Lógica: Cada route tiene su propio boundary — fallo de un remote no rompe el shell.
 */
function AppContent() {
  const { data } = useBalanceQuery();
  const balance = data?.balance ?? 0;

  const queryClient = useQueryClient();

  /**
   * Callback real para procesar transacciones desde los remotos.
   * Lógica: Actualiza el caché de balance de React Query de forma optimista.
   *   - recipient.id === 'welcome' → crédito de bienvenida (suma al balance)
   *   - cualquier otra tx → débito de transferencia (resta al balance)
   */
  const handleTransactionSubmit = async (tx: Omit<Transaction, 'id' | 'timestamp'>) => {
    queryClient.setQueryData<{ balance: number }>(
      ['balance'],
      (prev) => {
        const current = prev?.balance ?? 0;
        const isCredit = tx.recipient.id === 'welcome';
        const next = isCredit ? current + tx.amount : current - tx.amount;
        return { balance: Math.max(0, Math.round(next)) };
      }
    );
    // DW-02: Garantizar que el balance subyacente se invalida para refrescar desde el mock
    await queryClient.invalidateQueries({ queryKey: ['balance'] });
  };

  const shellProps: IShellProps = {
    balance,
    transactions: [],
    onTransactionSubmit: handleTransactionSubmit,
  };

  const handleRemoteError = (error: Error, info: React.ErrorInfo) => {
    console.error('[Shell] Remote falló:', error, info);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full flex justify-center">
        <Routes>
          <Route
            path="/"
            element={
              <ErrorBoundary
                FallbackComponent={(props) => (
                  <RemoteFallback {...props} remoteName="Onboarding" />
                )}
                onError={handleRemoteError}
                resetKeys={['remoteOnboarding']}
              >
                <Suspense fallback={<OnboardingSkeleton />}>
                  <RemoteOnboardingFlow {...shellProps} />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="/transfer"
            element={
              <ErrorBoundary
                FallbackComponent={(props) => (
                  <RemoteFallback {...props} remoteName="Transferencias" />
                )}
                onError={handleRemoteError}
                resetKeys={['remoteTransfer']}
              >
                <Suspense fallback={<TransferSkeleton />}>
                  <RemoteTransferWidget {...shellProps} />
                </Suspense>
              </ErrorBoundary>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

/**
 * App raíz del Shell — provee QueryClient y Router.
 * Lógica: QueryClient en Shell es el singleton compartido via Module Federation shared deps.
 */
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
