/**
 * Hook unificado que expone el estado bancario desde React Query.
 * Lógica: Mantiene la misma API de retorno para compatibilidad con StepRecipient y StepAmount.
 * El estado de transferencia (transferLoading, transferSuccess, etc.) fue movido a StepConfirm.
 */

import { useBalanceQuery, useContactsQuery } from '../queries/bankQueries';

export function useBankStore() {
  const balanceQuery = useBalanceQuery();
  const contactsQuery = useContactsQuery();

  return {
    balance: balanceQuery.data?.balance ?? null,
    balanceLoading: balanceQuery.isPending,
    balanceError: balanceQuery.error ? String(balanceQuery.error) : null,
    contacts: contactsQuery.data ?? [],
    contactsLoading: contactsQuery.isPending,
    contactsError: contactsQuery.error ? String(contactsQuery.error) : null,
  };
}
