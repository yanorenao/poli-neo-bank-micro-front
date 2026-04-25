import React, { useEffect, useRef } from 'react';
import type { IShellProps, OnboardingFormData } from '@poli/shared-types';

interface Props {
  formData: OnboardingFormData;
  onTransactionSubmit: IShellProps['onTransactionSubmit'];
  onNavigateToTransfer: () => void;
}

const SALDO_BIENVENIDA = 1_000_000; // 1 millón COP

/**
 * Paso 4 del Onboarding — Confirmación y activación de la cuenta.
 * Lógica: Dispatch del saldo de bienvenida al Shell via onTransactionSubmit,
 * luego navega a /transfer para que el usuario vea su cuenta activa.
 */
export const StepConfirmacion: React.FC<Props> = ({
  formData,
  onTransactionSubmit,
  onNavigateToTransfer,
}) => {
  // Guard para evitar doble dispatch en React StrictMode (double-invoke en dev)
  const hasFiredRef = useRef(false);

  useEffect(() => {
    if (hasFiredRef.current) return;
    hasFiredRef.current = true;

    onTransactionSubmit({
      amount: SALDO_BIENVENIDA,
      recipient: {
        id: 'welcome',
        name: formData.fullName,
        account: '000000000',
        isFavorite: false,
      },
      status: 'completed',
    }).catch(console.error);
  // Ejecutar solo una vez al montar el paso
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-center text-center gap-6 py-8">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-5xl shadow-lg">
        🎉
      </div>
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">¡Cuenta Activada!</h2>
        <p className="text-gray-500 text-base">
          Bienvenido a NeoBank, <span className="font-semibold text-teal-700">{formData.fullName}</span>
        </p>
      </div>

      <div className="bg-teal-50 border-2 border-teal-200 rounded-xl p-5 w-full max-w-xs">
        <p className="text-xs text-teal-600 uppercase tracking-wider font-semibold mb-1">
          Saldo de bienvenida
        </p>
        <p className="text-4xl font-bold text-teal-800">
          ${SALDO_BIENVENIDA.toLocaleString('es-CO')}
        </p>
        <p className="text-xs text-teal-500 mt-1">COP · disponible ahora</p>
      </div>

      <button
        onClick={onNavigateToTransfer}
        className="w-full max-w-xs py-3 bg-teal-600 text-white rounded-xl font-semibold text-base hover:bg-teal-700 transition-colors"
      >
        Ir a Transferencias →
      </button>
    </div>
  );
};
