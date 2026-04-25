/**
 * @poli/shared-types — Contratos TypeScript compartidos entre microfrontends.
 * Lógica: Define las interfaces de comunicación entre Shell y Remotes via props drilling.
 */

import type React from 'react';

// ============================================================
// DOMAIN MODELS
// ============================================================

/**
 * Contacto bancario (destinatario de transferencia).
 */
export interface Contact {
  id: string;
  name: string;
  account: string;
  isFavorite: boolean;
}

/**
 * Transacción bancaria ejecutada.
 */
export interface Transaction {
  id: string;
  amount: number;
  recipient: Contact;
  timestamp: Date;
  status: 'pending' | 'completed' | 'failed';
}

// ============================================================
// SHELL → REMOTE CONTRACTS (Props Drilling)
// ============================================================

/**
 * Props que el Shell pasa a todos los microfrontends remotos.
 * Lógica: Contrato base para comunicación explícita Shell → Remote.
 */
export interface IShellProps {
  /** Balance actual de la cuenta en COP */
  balance: number;
  /** Historial de transacciones del usuario */
  transactions: Transaction[];
  /** Callback para notificar una nueva transacción al Shell */
  onTransactionSubmit: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => Promise<void>;
}

// ============================================================
// ONBOARDING DOMAIN (Remote Onboarding)
// ============================================================

/**
 * Datos del formulario de validación de identidad (Paso 2 Onboarding).
 */
export interface OnboardingFormData {
  fullName: string;
  /** Cédula de ciudadanía: 6-10 dígitos numéricos */
  cedula: string;
  /** Número de celular Colombia (+57) */
  phoneNumber: string;
}

/**
 * PIN de seguridad (Paso 3 Onboarding).
 */
export interface SecurityPIN {
  /** PIN de exactamente 4 dígitos numéricos */
  pin: string;
  pinConfirmation: string;
}

/**
 * Estado acumulado del flujo de Onboarding a través de los 4 pasos.
 */
export interface OnboardingState {
  step: 1 | 2 | 3 | 4;
  formData?: OnboardingFormData;
  securityPIN?: SecurityPIN;
  accountCreated: boolean;
}

// ============================================================
// ERROR BOUNDARY CONTRACTS
// ============================================================

/**
 * Props para el componente de fallback de un Error Boundary.
 */
export interface FallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
  /** Nombre del remote que falló (para mensajes al usuario) */
  remoteName?: string;
}

/**
 * Configuración de un Error Boundary en el Shell.
 */
export interface ErrorBoundaryConfig {
  FallbackComponent: React.ComponentType<FallbackProps>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  resetKeys?: Array<string | undefined>;
}

// ============================================================
// REACT QUERY CONTRACTS
// ============================================================

/**
 * Query keys estándar — garantiza invalidación consistente entre Shell y Remotes.
 */
export const QueryKeys = {
  balance: ['balance'] as const,
  transactions: ['transactions'] as const,
  transactionById: (id: string) => ['transaction', id] as const,
  contacts: ['contacts'] as const,
} as const;

/**
 * Response del endpoint de balance.
 */
export interface BalanceResponse {
  balance: number;
  currency: 'COP';
  lastUpdated: string;
}

/**
 * Response del endpoint de transacciones.
 */
export interface TransactionsResponse {
  transactions: Transaction[];
  total: number;
  page: number;
  pageSize: number;
}
