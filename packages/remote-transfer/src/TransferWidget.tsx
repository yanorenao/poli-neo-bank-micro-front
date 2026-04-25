import React, { useState } from 'react';
import type { IShellProps } from '@poli/shared-types';
import { useMutation } from '@tanstack/react-query';
import { postTransfer } from './mocks/api';
import { StepRecipient } from './components/StepRecipient';
import { StepAmount } from './components/StepAmount';
import { StepConfirm } from './components/StepConfirm';
import type { Contact } from '@poli/shared-types';
import { Check } from 'lucide-react';

/**
 * Indicador de progreso del wizard de transferencia.
 */
const StepIndicator: React.FC<{ currentStep: number }> = ({ currentStep }) => {
  const steps = [
    { number: 1, label: 'Destinatario' },
    { number: 2, label: 'Monto' },
    { number: 3, label: 'Confirmar' },
  ];

  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-semibold text-sm sm:text-base transition-all duration-300 ${currentStep > step.number
                    ? 'bg-green-500 text-white shadow-md'
                    : currentStep === step.number
                      ? 'bg-blue-600 text-white shadow-lg ring-4 ring-blue-200'
                      : 'bg-gray-200 text-gray-500'
                  }`}
              >
                {currentStep > step.number ? <Check size={20} /> : step.number}
              </div>
              <p
                className={`mt-2 text-xs sm:text-sm font-medium transition-colors duration-300 ${currentStep >= step.number ? 'text-gray-900' : 'text-gray-400'
                  } hidden sm:block`}
              >
                {step.label}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-2 rounded-full transition-all duration-300 ${currentStep > step.number ? 'bg-green-500' : 'bg-gray-200'
                  }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

/**
 * TransferWidget — Componente expuesto via Module Federation.
 * Lógica: Recibe balance y onTransactionSubmit del Shell via props drilling (IShellProps).
 * El QueryClient es el singleton del Shell (compartido via Module Federation shared deps).
 */
const TransferWidget: React.FC<IShellProps> = ({ balance, onTransactionSubmit }) => {
  const [step, setStep] = useState<number>(1);
  const [recipient, setRecipient] = useState<Contact | null>(null);
  const [amount, setAmount] = useState<number>(0);

  const transferMutation = useMutation({
    mutationFn: ({ destination, amount: amt }: { destination: string; amount: number }) =>
      postTransfer({ destination, amount: amt }, balance),
    onSuccess: async (_data) => {
      try {
        await onTransactionSubmit({
          amount,
          recipient: {
            id: recipient?.id ?? '',
            name: recipient?.name ?? '',
            account: recipient?.account ?? '',
            isFavorite: recipient?.isFavorite ?? false,
          },
          status: 'completed',
        });
      } catch (err) {
        console.error('[TransferWidget] onTransactionSubmit falló:', err);
      }
    },
  });

  const handleRecipientSelect = (contact: Contact) => {
    setRecipient(contact);
    setStep(2);
  };

  const handleAmountNext = (val: number) => {
    setAmount(val);
    setStep(3);
  };

  const handleFinish = () => {
    transferMutation.reset();
    setStep(1);
    setRecipient(null);
    setAmount(0);
  };

  if (step === 2 && !recipient) { setStep(1); return null; }
  if (step === 3 && (!recipient || amount <= 0)) { setStep(1); return null; }

  return (
    <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-6 sm:p-8">
      <StepIndicator currentStep={step} />
      {step === 1 && <StepRecipient onSelect={handleRecipientSelect} />}
      {step === 2 && recipient && (
        <StepAmount
          recipient={recipient}
          balance={balance}
          onNext={handleAmountNext}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && recipient && (
        <StepConfirm
          recipient={recipient}
          amount={amount}
          balance={balance}
          transferMutation={transferMutation}
          onBack={() => setStep(2)}
          onFinish={handleFinish}
        />
      )}
    </div>
  );
};

export default TransferWidget;
