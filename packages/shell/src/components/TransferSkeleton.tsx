/**
 * Skeleton loader para el TransferWizard durante lazy load.
 * Lógica: Mantiene contexto visual bancario mientras el remote carga.
 */
export const TransferSkeleton = () => (
  <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-6 sm:p-8 animate-pulse">
    <div className="flex items-center justify-between mb-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex flex-col items-center flex-1">
          <div className="w-10 h-10 rounded-full bg-gray-200" />
          <div className="mt-2 w-16 h-3 bg-gray-200 rounded hidden sm:block" />
        </div>
      ))}
    </div>
    <div className="h-6 bg-gray-200 rounded w-48 mb-4" />
    <div className="space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-14 bg-gray-100 rounded-lg" />
      ))}
    </div>
  </div>
);
