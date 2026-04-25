import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TransferWizard } from './components/TransferWizard';
import { useBalanceQuery } from './queries/bankQueries';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: { retry: 1 },
        mutations: { retry: 0 },
    },
});

/**
 * Header con display del saldo del usuario.
 * Lógica: Usa React Query para mostrar balance con skeleton mientras carga.
 */
function AppHeader() {
    const { data, isPending, isError, refetch } = useBalanceQuery();
    const balance = data?.balance ?? null;

    return (
        <header className="bg-teal-700 text-white shadow-md">
            <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold tracking-tight">NeoBank</h1>
                <div className="flex flex-col items-end">
                    <span className="text-teal-100 text-sm">Saldo Total</span>
                    {isPending ? (
                        <div className="w-24 h-6 bg-teal-600 rounded animate-pulse mt-1"></div>
                    ) : isError ? (
                        <button
                            onClick={() => refetch()}
                            className="text-sm text-teal-100 hover:text-white underline"
                        >
                            Error al cargar. Reintentar
                        </button>
                    ) : balance !== null ? (
                        <span className="text-2xl font-bold text-teal-50">${balance.toLocaleString('es-CO')}</span>
                    ) : (
                        <div className="w-24 h-6 bg-teal-600 rounded animate-pulse mt-1"></div>
                    )}
                </div>
            </div>
        </header>
    );
}

function AppContent() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <AppHeader />
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex justify-center items-start w-full">
                <TransferWizard />
            </main>
        </div>
    );
}

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AppContent />
        </QueryClientProvider>
    );
}

export default App;
