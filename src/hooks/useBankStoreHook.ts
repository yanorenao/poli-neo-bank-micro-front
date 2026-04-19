/**
 * Custom React Hook to connect components to Flux BankStore
 * Provides reactive subscriptions to store changes following Flux pattern
 */

import { useEffect, useState } from 'react';
import BankStore from '../flux/BankStore';

/**
 * Hook to subscribe to BankStore and trigger re-renders on changes
 * This is the "View" layer of Flux that listens to Store changes
 */
export function useBankStore() {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const handleChange = () => {
      forceUpdate({}); // Trigger re-render when store emits change
    };

    // Subscribe to store changes
    BankStore.addChangeListener(handleChange);

    // Cleanup: unsubscribe on unmount
    return () => {
      BankStore.removeChangeListener(handleChange);
    };
  }, []);

  // Return store getters for components to use
  return {
    // Balance
    balance: BankStore.getBalance(),
    balanceLoading: BankStore.isBalanceLoading(),
    balanceError: BankStore.getBalanceError(),

    // Contacts
    contacts: BankStore.getContacts(),
    contactsLoading: BankStore.isContactsLoading(),
    contactsError: BankStore.getContactsError(),

    // Transfer
    transferLoading: BankStore.isTransferLoading(),
    transferError: BankStore.getTransferError(),
    transferSuccess: BankStore.isTransferSuccess(),
    transactionId: BankStore.getTransactionId(),
  };
}
