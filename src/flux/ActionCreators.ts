/**
 * Flux Action Creators - Functions that create and dispatch actions
 * All state changes flow through these action creators → dispatcher → stores
 */

import { AppDispatcher } from './Dispatcher';
import * as ActionTypes from './ActionTypes';
import { getBalance, getContacts, postTransfer, type TransferRequest } from '../mocks/api';

/**
 * Balance Action Creators
 */
export const BalanceActions = {
  /**
   * Fetch user balance from server
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
 * Contacts Action Creators
 */
export const ContactsActions = {
  /**
   * Fetch contacts list from server
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
 * Transfer Action Creators
 */
export const TransferActions = {
  /**
   * Execute a money transfer
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
   * Reset transfer state (errors, success flags, etc)
   */
  resetTransfer: () => {
    AppDispatcher.dispatch({
      type: ActionTypes.TRANSFER_RESET,
    });
  },
};
