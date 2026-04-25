/**
 * Skeleton loader para el Onboarding durante lazy load.
 * Lógica: Preserva contexto visual de bienvenida mientras el remote carga.
 */
export const OnboardingSkeleton = () => (
  <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-6 sm:p-10 animate-pulse">
    <div className="h-8 bg-teal-100 rounded w-3/4 mb-3" />
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-8" />
    <div className="space-y-4">
      <div className="h-12 bg-gray-100 rounded-xl" />
      <div className="h-12 bg-gray-100 rounded-xl" />
      <div className="h-12 bg-gray-100 rounded-xl" />
    </div>
    <div className="mt-8 h-12 bg-teal-200 rounded-xl" />
  </div>
);
