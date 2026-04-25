import React from 'react';

interface Props {
  onNext: () => void;
}

/**
 * Paso 1 del Onboarding — Landing con propuesta de valor NeoBank.
 * Lógica: CTA único "Comenzar registro" avanza al paso de identidad.
 */
export const StepLanding: React.FC<Props> = ({ onNext }) => (
  <div className="flex flex-col items-center text-center gap-6 py-8">
    <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center text-4xl">
      🏦
    </div>
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Bienvenido a NeoBank</h1>
      <p className="text-gray-500 text-base max-w-sm">
        Tu cuenta digital sin comisiones. Transfiere dinero al instante y controla tus finanzas desde cualquier lugar.
      </p>
    </div>
    <ul className="text-left space-y-2 w-full max-w-xs">
      {[
        '✅ Cuenta gratis, sin costos ocultos',
        '✅ Transferencias instantáneas',
        '✅ Seguridad bancaria nivel enterprise',
      ].map((item) => (
        <li key={item} className="text-sm text-gray-700">{item}</li>
      ))}
    </ul>
    <button
      onClick={onNext}
      className="w-full max-w-xs py-3 bg-teal-600 text-white rounded-xl font-semibold text-base hover:bg-teal-700 transition-colors mt-2"
    >
      Comenzar registro →
    </button>
  </div>
);
