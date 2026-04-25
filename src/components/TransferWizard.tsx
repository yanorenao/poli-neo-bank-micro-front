import React, { useState } from 'react';
import { StepRecipient } from './StepRecipient';
import { StepAmount } from './StepAmount';
import { StepConfirm } from './StepConfirm';
import { wizardContainer, wizardInnerPadding } from '../styles/tailwindClasses';
import type { Contact } from '../mocks/api';
import { Check } from 'lucide-react';

/**
 * StepIndicator - Componente que muestra el progreso visual del proceso.
 * Lógica: Renderiza una línea de tiempo con pasos completados, actuales y pendientes.
 */
interface StepIndicatorProps {
    currentStep: number;
    totalSteps: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
    const steps = [
        { number: 1, label: 'Destinatario' },
        { number: 2, label: 'Monto' },
        { number: 3, label: 'Confirmar' }
    ];

    return (
        <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                    <React.Fragment key={step.number}>
                        <div className="flex flex-col items-center flex-1">
                            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-semibold text-sm sm:text-base transition-all duration-300 ${
                                currentStep > step.number
                                    ? 'bg-green-500 text-white shadow-md'
                                    : currentStep === step.number
                                    ? 'bg-blue-600 text-white shadow-lg ring-4 ring-blue-200'
                                    : 'bg-gray-200 text-gray-500'
                            }`}>
                                {currentStep > step.number ? (
                                    <Check size={20} className="animate-in zoom-in" />
                                ) : (
                                    step.number
                                )}
                            </div>
                            <p className={`mt-2 text-xs sm:text-sm font-medium transition-colors duration-300 ${
                                currentStep >= step.number ? 'text-gray-900' : 'text-gray-400'
                            } hidden sm:block`}>
                                {step.label}
                            </p>
                            <p className={`mt-1 text-[10px] font-medium transition-colors duration-300 ${
                                currentStep >= step.number ? 'text-gray-900' : 'text-gray-400'
                            } sm:hidden`}>
                                {step.number}
                            </p>
                        </div>
                        {index < steps.length - 1 && (
                            <div className={`flex-1 h-1 mx-2 rounded-full transition-all duration-300 ${
                                currentStep > step.number ? 'bg-green-500' : 'bg-gray-200'
                            }`} />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

/**
 * TransferWizard - Componente principal que orquesta el flujo de transferencia.
 * Lógica: Gestiona el estado de los pasos y los datos temporales del destinatario y monto.
 */
export const TransferWizard: React.FC = () => {
    const [step, setStep] = useState<number>(1);
    const [recipient, setRecipient] = useState<Contact | null>(null);
    const [amount, setAmount] = useState<number>(0);

    /**
     * Selecciona un contacto y avanza al siguiente paso.
     * Input: contact (Contact).
     * Output: void.
     */
    const handleRecipientSelect = (contact: Contact) => {
        setRecipient(contact);
        setStep(2);
    };

    /**
     * Define el monto y avanza a la confirmación.
     * Input: val (number).
     * Output: void.
     */
    const handleAmountNext = (val: number) => {
        setAmount(val);
        setStep(3);
    };

    /**
     * Reinicia el asistente a su estado inicial.
     * Input: Ninguno.
     * Output: void.
     */
    const handleFinish = () => {
        setStep(1);
        setRecipient(null);
        setAmount(0);
    };

    // Consistency guards
    if (step === 2 && !recipient) {
        setStep(1);
        return null;
    }
    if (step === 3 && (!recipient || amount <= 0)) {
        setStep(1);
        return null;
    }

    return (
        <div className={wizardContainer}>
            <div className={wizardInnerPadding}>
                <StepIndicator currentStep={step} totalSteps={3} />
                {step === 1 && (
                    <StepRecipient onSelect={handleRecipientSelect} />
                )}
                {step === 2 && recipient && (
                    <StepAmount
                        recipient={recipient}
                        onNext={handleAmountNext}
                        onBack={() => setStep(1)}
                    />
                )}
                {step === 3 && recipient && (
                    <StepConfirm
                        recipient={recipient}
                        amount={amount}
                        onBack={() => setStep(2)}
                        onFinish={handleFinish}
                    />
                )}
            </div>
        </div>
    );
};
