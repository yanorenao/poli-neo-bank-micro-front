/**
 * Flux Action Creators - Funciones que crean y despachan acciones.
 * Lógica: Orquestan llamadas asíncronas a la API y notifican al Dispatcher los cambios de estado.
 */

import { AppDispatcher } from './Dispatcher';
import * as ActionTypes from './ActionTypes';
import { getBalance, getContacts, postTransfer, type TransferRequest } from '../mocks/api';

/**
 * Creadores de acciones para el Saldo (Balance).
 */
export const BalanceActions = {
  /**
   * Obtiene el saldo del usuario desde el servidor.
   * Input: Ninguno.
   * Output: Despacha FETCH_BALANCE_SUCCESS con el saldo o FETCH_BALANCE_ERROR.
   */
  fetchBalance: async () => {
    AppDispatcher.dispatch({
      type: ActionTypes.FETCH_BALANCE_REQUEST,
    });

    try {
      const response = await getBalance();
      AppDispatcher.dispatch({
        type: ActionTypes.FETCH_BALANCE_SUCCESS,
        payload: response.balance,
      });
    } catch (error) {
      AppDispatcher.dispatch({
        type: ActionTypes.FETCH_BALANCE_ERROR,
        payload: error instanceof Error ? error.message : 'Error al cargar el saldo',
      });
    }
  },
};

/**
 * Creadores de acciones para Contactos.
 */
export const ContactsActions = {
  /**
   * Obtiene la lista de contactos desde el servidor.
   * Input: Ninguno.
   * Output: Despacha FETCH_CONTACTS_SUCCESS con la lista o FETCH_CONTACTS_ERROR.
   */
  fetchContacts: async () => {
    AppDispatcher.dispatch({
      type: ActionTypes.FETCH_CONTACTS_REQUEST,
    });

    try {
      const contacts = await getContacts();
      AppDispatcher.dispatch({
        type: ActionTypes.FETCH_CONTACTS_SUCCESS,
        payload: contacts,
      });
    } catch (error) {
      AppDispatcher.dispatch({
        type: ActionTypes.FETCH_CONTACTS_ERROR,
        payload: error instanceof Error ? error.message : 'Error al cargar contactos',
      });
    }
  },
};

/**
 * Creadores de acciones para Transferencias.
 */
export const TransferActions = {
  /**
   * Ejecuta una transferencia de dinero.
   * Input: request (TransferRequest), currentBalance (number).
   * Output: Despacha TRANSFER_SUCCESS con el nuevo saldo o TRANSFER_ERROR.
   */
  executeTransfer: async (request: TransferRequest, currentBalance: number) => {
    AppDispatcher.dispatch({
      type: ActionTypes.TRANSFER_REQUEST,
    });

    try {
      const response = await postTransfer(request, currentBalance);
      AppDispatcher.dispatch({
        type: ActionTypes.TRANSFER_SUCCESS,
        payload: {
          transactionId: response.transactionId,
          newBalance: response.newBalance,
        },
      });
    } catch (error) {
      AppDispatcher.dispatch({
        type: ActionTypes.TRANSFER_ERROR,
        payload: error instanceof Error ? error.message : 'Error en la transferencia',
      });
    }
  },

  /**
   * Reinicia el estado de la transferencia.
   * Input: Ninguno.
   * Output: Despacha TRANSFER_RESET.
   */
  resetTransfer: () => {
    AppDispatcher.dispatch({
      type: ActionTypes.TRANSFER_RESET,
    });
  },
};
