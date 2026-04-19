// src/hooks/useServerData.ts
// React Query hooks for server data management (Layer 3: Server Data)
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBalance, getContacts, postTransfer } from '../mocks/api';
import type { TransferRequest } from '../mocks/api';

/**
 * Hook for fetching user balance from server
 * Uses React Query for caching and automatic refetch
 */
export function useBalance() {
  return useQuery({
    queryKey: ['balance'],
    queryFn: getBalance,
    select: (data) => data.balance,
  });
}

/**
 * Hook for fetching contacts list from server
 * Uses React Query for caching
 */
export function useContacts() {
  return useQuery({
    queryKey: ['contacts'],
    queryFn: getContacts,
  });
}

/**
 * Hook for executing transfers (mutation)
 * Automatically updates balance cache on success
 */
export function useTransferMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ request, currentBalance }: { request: TransferRequest; currentBalance: number }) => {
      return postTransfer(request, currentBalance);
    },
    onSuccess: (data) => {
      // Update balance cache with new value
      queryClient.setQueryData(['balance'], { balance: data.newBalance });
    },
  });
}
