import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { OnboardingFormData } from '@poli/shared-types';

const schema = z.object({
  fullName: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  cedula: z
    .string()
    .regex(/^\d{6,10}$/, 'La cédula debe tener entre 6 y 10 dígitos numéricos'),
  phoneNumber: z
    .string()
    .regex(/^(\+57)?3\d{9}$/, 'Ingresa un número de celular colombiano válido (+57 3XX XXX XXXX)'),
});

interface Props {
  onNext: (data: OnboardingFormData) => void;
  onBack: () => void;
}

/**
 * Paso 2 del Onboarding — Validación de identidad del usuario.
 * Lógica: RHF + Zod validan formato de cédula colombiana y número celular (+57).
 */
export const StepIdentidad: React.FC<Props> = ({ onNext, onBack }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OnboardingFormData>({ resolver: zodResolver(schema) });

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Valida tu identidad</h2>
        <p className="text-sm text-gray-500 mt-1">Necesitamos algunos datos para crear tu cuenta</p>
      </div>

      <form onSubmit={handleSubmit(onNext)} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
          <input
            {...register('fullName')}
            placeholder="Ej: María García López"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cédula de ciudadanía</label>
          <input
            {...register('cedula')}
            placeholder="Ej: 1234567890"
            inputMode="numeric"
            maxLength={10}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
          />
          {errors.cedula && (
            <p className="mt-1 text-sm text-red-600">{errors.cedula.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Número de celular</label>
          <input
            {...register('phoneNumber')}
            placeholder="Ej: +57 300 123 4567"
            inputMode="tel"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
          />
          {errors.phoneNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
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
            Continuar →
          </button>
        </div>
      </form>
    </div>
  );
};
