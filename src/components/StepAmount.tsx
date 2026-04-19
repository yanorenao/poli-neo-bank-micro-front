import React, { useState } from 'react';
import type { Contact } from '../mocks/api';
import { useBankStore } from '../hooks/useBankStoreHook';
import { btnPrimary, btnSecondary, amountInput } from '../styles/tailwindClasses';

interface Props {
    recipient: Contact;
    onBack: () => void;
    onNext: (amount: number) => void;
}

export const StepAmount: React.FC<Props> = ({ recipient, onBack, onNext }) => {
    const [amount, setAmount] = useState<string>('');
    const [error, setError] = useState<string>('');

    const { balance } = useBankStore();

    const MIN_TRANSFER_AMOUNT = 10000; // 10 mil COP
    const MAX_TRANSFER_AMOUNT = 5000000; // 5 millones COP

    // Función para formatear el número con separador de miles
    const formatAmount = (value: string): string => {
        if (!value) return '';
        const number = parseInt(value, 10);
        if (isNaN(number)) return '';
        return number.toLocaleString('es-CO');
    };

    const handleNext = () => {
        const value = parseFloat(amount.replace(/\./g, '')); // Remover puntos antes de parsear
        if (isNaN(value) || value <= 0) {
            setError('Por favor, ingresa un monto válido mayor a 0');
            return;
        }
        if (value < MIN_TRANSFER_AMOUNT) {
            setError(`El monto mínimo por transferencia es $${MIN_TRANSFER_AMOUNT.toLocaleString('es-CO')}`);
            return;
        }
        if (balance === null || balance === undefined) {
            setError('No se pudo verificar el saldo. Intenta de nuevo.');
            return;
        }
        if (value > MAX_TRANSFER_AMOUNT) {
            setError(`El monto máximo por transferencia es $${MAX_TRANSFER_AMOUNT.toLocaleString('es-CO')}`);
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
                <p className="text-sm text-gray-500 mt-1">Para <span className="font-medium text-gray-700">{recipient.name}</span> · Cta. {recipient.account}</p>
            </div>

            <div className="space-y-3 sm:space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                    Monto a transferir (COP)
                </label>
                <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 border-2 border-blue-200">
                    <div className="flex items-center justify-center">
                        <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-900 mr-2">$</span>
                        <input
                            type="text"
                            inputMode="numeric"
                            value={formatAmount(amount)}
                            onChange={(e) => {
                                // Remover todo excepto números
                                const val = e.target.value.replace(/[^0-9]/g, '');
                                setAmount(val);
                                setError('');
                            }}
                            placeholder="0"
                            className={`${amountInput} ${error ? 'border-red-500 focus:border-red-600' : 'border-gray-400 focus:border-blue-600'}`}
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
                        <span className="text-lg">⚠️</span>
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}
                {balance !== null && balance !== undefined && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <span className="text-sm text-gray-600">Saldo disponible</span>
                        <span className="text-sm font-bold text-gray-900">${balance.toLocaleString('es-CO')}</span>
                    </div>
                )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
                <button
                    onClick={onBack}
                    className={`w-full sm:w-auto sm:flex-1 ${btnSecondary}`}
                    aria-label="Volver al paso anterior"
                >
                    ← Atrás
                </button>
                <button
                    onClick={handleNext}
                    className={`w-full sm:flex-1 ${btnPrimary}`}
                    aria-label="Continuar al siguiente paso"
                >
                    Continuar →
                </button>
            </div>
        </div>
    );
};
