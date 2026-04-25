import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { IShellProps, OnboardingFormData, SecurityPIN } from '@poli/shared-types';
import { StepLanding } from './steps/StepLanding';
import { StepIdentidad } from './steps/StepIdentidad';
import { StepPIN } from './steps/StepPIN';
import { StepConfirmacion } from './steps/StepConfirmacion';

/**
 * OnboardingFlow — Componente expuesto via Module Federation.
 * Lógica: Flujo de 4 pasos con estado local React (no necesita store global).
 * Recibe onTransactionSubmit del Shell para notificar el saldo de bienvenida.
 */
const OnboardingFlow: React.FC<IShellProps> = ({ onTransactionSubmit }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [formData, setFormData] = useState<OnboardingFormData | null>(null);

  const handleIdentidadNext = (data: OnboardingFormData) => {
    setFormData(data);
    setStep(3);
  };

  const handlePINNext = (_pin: SecurityPIN) => {
    setStep(4);
  };

  const handleNavigateToTransfer = () => {
    navigate('/transfer');
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-6 sm:p-8">
      {/* Indicador de progreso */}
      <div className="flex items-center justify-between mb-8">
        {(['Bienvenida', 'Identidad', 'PIN', 'Cuenta'] as const).map((label, index) => {
          const stepNum = (index + 1) as 1 | 2 | 3 | 4;
          return (
            <React.Fragment key={label}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                    step > stepNum
                      ? 'bg-teal-500 text-white'
                      : step === stepNum
                      ? 'bg-teal-600 text-white ring-4 ring-teal-200'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step > stepNum ? '✓' : stepNum}
                </div>
                <span className="hidden sm:block text-[10px] mt-1 text-gray-500">{label}</span>
              </div>
              {index < 3 && (
                <div
                  className={`flex-1 h-1 mx-1 rounded-full transition-all ${
                    step > stepNum ? 'bg-teal-400' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Renderizado condicional por paso */}
      {step === 1 && <StepLanding onNext={() => setStep(2)} />}
      {step === 2 && (
        <StepIdentidad onNext={handleIdentidadNext} onBack={() => setStep(1)} />
      )}
      {step === 3 && (
        <StepPIN onNext={handlePINNext} onBack={() => setStep(2)} />
      )}
      {step === 4 && formData && (
        <StepConfirmacion
          formData={formData}
          onTransactionSubmit={onTransactionSubmit}
          onNavigateToTransfer={handleNavigateToTransfer}
        />
      )}
    </div>
  );
};

export default OnboardingFlow;
