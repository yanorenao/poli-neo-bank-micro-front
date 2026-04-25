// src/mocks/api.ts
import type { Contact } from '@poli/shared-types';

export interface BalanceResponse {
  balance: number;
}

export interface TransferRequest {
  destination: string;
  amount: number;
}

export interface TransferResponse {
  success: boolean;
  message: string;
  transactionId: string;
  newBalance: number;
}

// Simulate latency
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getBalance = async (): Promise<BalanceResponse> => {
  await delay(800);
  return { balance: 1540000 }; // Example initial balance in COP
};

export const postTransfer = async (req: TransferRequest, currentBalance: number): Promise<TransferResponse> => {
  await delay(1200);

  // Validate destination account format
  if (!req.destination || !/^\d{9}$/.test(req.destination)) {
    throw new Error('Cuenta destino inválida. Debe tener 9 dígitos.');
  }

  if (req.amount <= 0) {
    throw new Error('El monto debe ser mayor a 0');
  }

  if (req.amount > currentBalance) {
    throw new Error('Fondos insuficientes');
  }

  // Calculate new balance with proper precision
  const newBalance = Math.round((currentBalance - req.amount) * 100) / 100;

  return {
    success: true,
    message: 'Transferencia exitosa',
    transactionId: `TX-${crypto.randomUUID().split('-')[0].toUpperCase()}`,
    newBalance,
  };
};



export const getContacts = async (): Promise<Contact[]> => {
  await delay(500);
  return [
    { id: '1', name: 'Alvaro García', account: '123456789', isFavorite: true },
    { id: '2', name: 'Laura Martínez', account: '987654321', isFavorite: true },
    { id: '3', name: 'Carlos Díaz', account: '456123789', isFavorite: false },
    { id: '4', name: 'María Gómez', account: '789123456', isFavorite: false },
  ];
};
