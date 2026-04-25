/**
 * Hooks de React Query para el dominio bancario.
 * Lógica: Centraliza las queries y mutaciones de balance, contactos y transferencias.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBalance, getContacts, postTransfer } from '../mocks/api';
import type { TransferRequest } from '../mocks/api';

export const queryKeys = {
  balance: ['balance'] as const,
  contacts: ['contacts'] as const,
};

/**
 * Query del saldo bancario del usuario.
 * Lógica: Obtiene el balance desde el servidor y lo mantiene en caché.
 */
export function useBalanceQuery() {
  return useQuery({
    queryKey: queryKeys.balance,
    queryFn: getBalance,
    staleTime: 30_000,
  });
}

/**
 * Query de la lista de contactos del usuario.
 * Lógica: Obtiene los contactos desde el servidor con caché de 5 minutos.
 */
export function useContactsQuery() {
  return useQuery({
    queryKey: queryKeys.contacts,
    queryFn: getContacts,
    staleTime: 5 * 60_000,
  });
}

/**
 * Mutación para ejecutar una transferencia bancaria.
 * Lógica: Llama a postTransfer y actualiza el balance en caché con el nuevo valor.
 */
export function useTransferMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ request, currentBalance }: { request: TransferRequest; currentBalance: number }) =>
      postTransfer(request, currentBalance),
    onSuccess: (data) => {
      // Actualizar el balance en caché con el valor retornado por el servidor
      queryClient.setQueryData(queryKeys.balance, { balance: data.newBalance });
    },
  });
}
