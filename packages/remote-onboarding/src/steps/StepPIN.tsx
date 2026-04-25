import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { SecurityPIN } from '@poli/shared-types';

const schema = z
  .object({
    pin: z.string().regex(/^\d{4}$/, 'El PIN debe tener exactamente 4 dígitos numéricos'),
    pinConfirmation: z.string().regex(/^\d{4}$/, 'La confirmación debe tener 4 dígitos'),
  })
  .refine((data) => data.pin === data.pinConfirmation, {
    message: 'Los PINs no coinciden',
    path: ['pinConfirmation'],
  });

interface Props {
  onNext: (data: SecurityPIN) => void;
  onBack: () => void;
}

/**
 * Paso 3 del Onboarding — Creación del PIN de 4 dígitos.
 * Lógica: Zod valida exactamente 4 dígitos + confirmación coincidente.
 */
export const StepPIN: React.FC<Props> = ({ onNext, onBack }) => {
  const pinRef = useRef<HTMLInputElement | null>(null);
  const confirmRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SecurityPIN>({ resolver: zodResolver(schema) });

  const { ref: pinRegRef, ...pinRest } = register('pin');
  const { ref: confirmRegRef, ...confirmRest } = register('pinConfirmation');

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Crea tu PIN de seguridad</h2>
        <p className="text-sm text-gray-500 mt-1">4 dígitos que solo tú conocerás</p>
      </div>

      <form onSubmit={handleSubmit(onNext)} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">PIN (4 dígitos)</label>
          <input
            {...pinRest}
            ref={(el) => {
              pinRegRef(el);
              pinRef.current = el;
            }}
            type="password"
            inputMode="numeric"
            maxLength={4}
            placeholder="····"
            className="w-full px-4 py-3 text-center text-2xl tracking-widest border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
          />
          {errors.pin && (
            <p className="mt-1 text-sm text-red-600">{errors.pin.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar PIN</label>
          <input
            {...confirmRest}
            ref={(el) => {
              confirmRegRef(el);
              confirmRef.current = el;
            }}
            type="password"
            inputMode="numeric"
            maxLength={4}
            placeholder="····"
            className="w-full px-4 py-3 text-center text-2xl tracking-widest border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
          />
          {errors.pinConfirmation && (
            <p className="mt-1 text-sm text-red-600">{errors.pinConfirmation.message}</p>
          )}
        </div>

        <div className="flex gap-3 mt-2">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            ← Atrás
          </button>
          <button
            type="submit"
            className="flex-1 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-colors"
          >
            Activar cuenta →
          </button>
        </div>
      </form>
    </div>
  );
};
