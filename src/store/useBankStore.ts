// src/store/useBankStore.ts
// Zustand store for LOCAL UI state management (Layer 2: Business Logic)
// Server data is managed by React Query (see hooks/useServerData.ts)
import { create } from 'zustand';

interface BankState {
    // Transfer UI state (local only)
    transferError: string | null;
    transferSuccess: boolean;
    transactionId: string | null;

    // Actions
    setTransferError: (error: string | null) => void;
    setTransferSuccess: (success: boolean, txId: string | null) => void;
    resetTransferState: () => void;
}

export const useBankStore = create<BankState>((set) => ({
    transferError: null,
    transferSuccess: false,
    transactionId: null,

    setTransferError: (error) => {
        set({ transferError: error, transferSuccess: false });
    },

    setTransferSuccess: (success, txId) => {
        set({ transferSuccess: success, transactionId: txId, transferError: null });
    },

    resetTransferState: () => {
        set({
            transferError: null,
            transferSuccess: false,
            transactionId: null,
        });
    }
}));
