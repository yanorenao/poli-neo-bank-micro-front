import React from 'react';
import type { Contact } from '../mocks/api';
import { CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import type { UseMutationResult } from '@tanstack/react-query';

interface TransferResult {
  success: boolean;
  message: string;
  transactionId: string;
  newBalance: number;
}

interface Props {
  recipient: Contact;
  amount: number;
  balance: number;
  transferMutation: UseMutationResult<
    TransferResult,
    Error,
    { destination: string; amount: number }
  >;
  onBack: () => void;
  onFinish: () => void;
}

/**
 * Paso 3 del wizard — Confirmación y ejecución de la transferencia.
 * Lógica: Recibe la mutación desde TransferWidget para evitar estado duplicado.
 */
export const StepConfirm: React.FC<Props> = ({
  recipient,
  amount,
  balance,
  transferMutation,
  onBack,
  onFinish,
}) => {
  const transferLoading = transferMutation.isPending;
  const transferError = transferMutation.error ? String(transferMutation.error) : null;
  const transferSuccess = transferMutation.isSuccess;
  const transactionId = transferMutation.data?.transactionId ?? null;

  const handleConfirm = () => {
    if (balance === null || balance === undefined) return;
    transferMutation.mutate({ destination: recipient.account, amount });
  };

  const handleDone = () => {
    transferMutation.reset();
    onFinish();
  };

  if (transferSuccess) {
    return (
      <div className="flex flex-col items-center gap-4 sm:gap-6 py-6 sm:py-8 animate-in zoom-in">
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-green-100 to-emerald-200 text-emerald-600 rounded-full flex items-center justify-center mb-2 shadow-lg">
          <CheckCircle size={48} />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">¡Transferencia Exitosa! 🎉</h2>
        <p className="text-base sm:text-lg text-gray-600 text-center">
          Has enviado{' '}
          <span className="font-bold text-green-600">${amount.toLocaleString('es-CO')}</span>{' '}
          a <span className="font-semibold">{recipient.name}</span>
        </p>
        {transactionId && (
          <div className="bg-gray-50 p-4 rounded-xl w-full mt-2 text-center border-2 border-gray-200">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">📄 Comprobante (Tx ID)</p>
            <p className="font-mono text-sm text-gray-800 font-bold break-all">{transactionId}</p>
          </div>
        )}
        <button
          onClick={handleDone}
          className="w-full mt-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          aria-label="Volver al inicio"
        >
          ✓ Volver al Inicio
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6 animate-in fade-in slide-in-from-right-2">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Confirma tu transferencia</h2>
        <p className="text-sm text-gray-500 mt-1">Revisa que todos los datos sean correctos antes de continuar</p>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 rounded-xl border-2 border-blue-200 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pb-4 border-b-2 border-blue-200 gap-2">
          <span className="text-sm font-medium text-gray-600">Monto a enviar</span>
          <span className="text-3xl sm:text-4xl font-bold text-blue-900">${amount.toLocaleString('es-CO')}</span>
        </div>
        <div className="flex items-center gap-3 pt-2">
          <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
            {recipient.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Destinatario</p>
            <p className="font-bold text-gray-900 truncate">{recipient.name}</p>
            <p className="text-sm text-gray-600">Cuenta: {recipient.account}</p>
          </div>
        </div>
      </div>

      {transferError && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border-2 border-red-300 rounded-lg text-red-700 animate-in fade-in">
          <AlertCircle size={24} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm mb-1">Error en la transferencia</p>
            <p className="text-sm">{transferError}</p>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
        <button
          onClick={onBack}
          disabled={transferLoading}
          className="w-full sm:flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Volver a editar el monto"
        >
          ← Editar
        </button>
        <button
          onClick={handleConfirm}
          disabled={transferLoading}
          className="w-full sm:flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait"
          aria-label="Confirmar y ejecutar transferencia"
        >
          {transferLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Procesando...</span>
            </>
          ) : (
            <>
              <span>💸 Transferir</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
