import React, { useState } from 'react';
import type { Contact } from '@poli/shared-types';

interface Props {
  recipient: Contact;
  balance: number;
  onBack: () => void;
  onNext: (amount: number) => void;
}

const MIN_TRANSFER = 10_000;
const MAX_TRANSFER = 5_000_000;

/**
 * Paso 2 del wizard — Ingreso del monto a transferir.
 * Lógica: Recibe balance por props desde TransferWidget (no lee store directamente).
 */
export const StepAmount: React.FC<Props> = ({ recipient, balance, onBack, onNext }) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const formatAmount = (value: string): string => {
    if (!value) return '';
    const number = parseInt(value, 10);
    if (isNaN(number)) return '';
    return number.toLocaleString('es-CO');
  };

  const handleNext = () => {
    const value = parseFloat(amount.replace(/\./g, ''));
    if (isNaN(value) || value <= 0) {
      setError('Por favor, ingresa un monto válido mayor a 0');
      return;
    }
    if (value < MIN_TRANSFER) {
      setError(`El monto mínimo por transferencia es $${MIN_TRANSFER.toLocaleString('es-CO')}`);
      return;
    }
    if (value > MAX_TRANSFER) {
      setError(`El monto máximo por transferencia es $${MAX_TRANSFER.toLocaleString('es-CO')}`);
      return;
    }
    if (value > balance) {
      setError('Fondos insuficientes para esta transferencia');
      return;
    }
    setError('');
    onNext(value);
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-6 animate-in fade-in slide-in-from-right-2">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">¿Cuánto deseas enviar?</h2>
        <p className="text-sm text-gray-500 mt-1">
          Para <span className="font-medium text-gray-700">{recipient.name}</span> · Cta. {recipient.account}
        </p>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <label className="block text-sm font-medium text-gray-700">Monto a transferir (COP)</label>
        <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 border-2 border-blue-200">
          <div className="flex items-center justify-center">
            <span className="text-3xl sm:text-4xl font-bold text-blue-900 mr-2">$</span>
            <input
              type="text"
              inputMode="numeric"
              value={formatAmount(amount)}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, '');
                setAmount(val);
                setError('');
              }}
              placeholder="0"
              className={`bg-transparent text-3xl sm:text-4xl font-bold text-blue-900 outline-none w-full text-center ${error ? 'text-red-700' : ''
                }`}
              aria-label="Monto a transferir"
            />
          </div>
          <div className="mt-3 text-center">
            <p className="text-xs text-gray-600 bg-white/60 inline-block px-3 py-1 rounded-full">
              Mínimo: <span className="font-semibold">$10.000</span>
            </p>
          </div>
        </div>
        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border-2 border-red-200 rounded-lg text-red-700">
            <span>⚠️</span>
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
          <span className="text-sm text-gray-600">Saldo disponible</span>
          <span className="text-sm font-bold text-gray-900">${balance.toLocaleString('es-CO')}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
        <button
          onClick={onBack}
          className="w-full sm:flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          aria-label="Volver al paso anterior"
        >
          ← Atrás
        </button>
        <button
          onClick={handleNext}
          className="w-full sm:flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          aria-label="Continuar al siguiente paso"
        >
          Continuar →
        </button>
      </div>
    </div>
  );
};
