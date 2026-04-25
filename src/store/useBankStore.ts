/**
 * Zustand Store - Gestión de estado local para la interfaz de transferencias.
 * Lógica: Define el estado y las acciones para controlar el feedback visual de las transacciones.
 */
import { create } from 'zustand';

interface BankState {
    // Transfer UI state (local only)
    transferError: string | null;
    transferSuccess: boolean;
    transactionId: string | null;

    // Actions
    /**
     * Establece un mensaje de error en la transferencia.
     * Input: error (string | null).
     * Output: void.
     */
    setTransferError: (error: string | null) => void;

    /**
     * Registra una transferencia exitosa con su ID.
     * Input: success (boolean), txId (string | null).
     * Output: void.
     */
    setTransferSuccess: (success: boolean, txId: string | null) => void;

    /**
     * Reinicia el estado de la transferencia a sus valores iniciales.
     * Input: Ninguno.
     * Output: void.
     */
    resetTransferState: () => void;
}

export const useBankStore = create<BankState>((set) => ({
    transferError: null,
    transferSuccess: false,
    transactionId: null,

    /**
     * Lógica: Actualiza el error y asegura que el estado de éxito sea falso.
     */
    setTransferError: (error) => {
        set({ transferError: error, transferSuccess: false });
    },

    /**
     * Lógica: Marca la operación como exitosa, guarda el ID y limpia errores previos.
     */
    setTransferSuccess: (success, txId) => {
        set({ transferSuccess: success, transactionId: txId, transferError: null });
    },

    /**
     * Lógica: Limpia todas las variables relacionadas con el proceso de transferencia.
     */
    resetTransferState: () => {
        set({
            transferError: null,
            transferSuccess: false,
            transactionId: null,
        });
    }
}));

