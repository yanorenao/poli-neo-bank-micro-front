/**
 * Flux BankStore - Fuente única de verdad para todo el estado de la aplicación.
 * Lógica: Escucha al Dispatcher, actualiza el estado interno y emite eventos de cambio a las vistas.
 */

import { AppDispatcher, type Action } from './Dispatcher';
import * as ActionTypes from './ActionTypes';
import type { Contact } from '../mocks/api';

const CHANGE_EVENT = 'change';

/**
 * Implementación simple de EventEmitter para el navegador.
 * Lógica: Gestiona suscripciones y emisiones de eventos personalizados.
 */
class EventEmitter {
  private events: Map<string, Set<Function>> = new Map();

  /**
   * Registra un callback para un evento específico.
   * Input: event (string), callback (Function).
   * Output: void.
   */
  on(event: string, callback: Function): void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event)!.add(callback);
  }

  /**
   * Elimina un callback registrado para un evento.
   * Input: event (string), callback (Function).
   * Output: void.
   */
  removeListener(event: string, callback: Function): void {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.delete(callback);
    }
  }

  /**
   * Dispara un evento notificando a todos los suscriptores.
   * Input: event (string), ...args (any[]).
   * Output: void.
   */
  emit(event: string, ...args: any[]): void {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => callback(...args));
    }
  }
}

/**
 * Interfaz del estado de la aplicación (BankStoreState).
 */
interface BankStoreState {
  // Balance state
  balance: number | null;
  balanceLoading: boolean;
  balanceError: string | null;

  // Contacts state
  contacts: Contact[];
  contactsLoading: boolean;
  contactsError: string | null;

  // Transfer state
  transferLoading: boolean;
  transferError: string | null;
  transferSuccess: boolean;
  transactionId: string | null;
}

/**
 * BankStore - Store principal de la aplicación.
 * Lógica: Procesa acciones del Dispatcher para mutar el estado y notificar a los componentes.
 */
class BankStore extends EventEmitter {
  private state: BankStoreState = {
    balance: null,
    balanceLoading: false,
    balanceError: null,
    contacts: [],
    contactsLoading: false,
    contactsError: null,
    transferLoading: false,
    transferError: null,
    transferSuccess: false,
    transactionId: null,
  };

  constructor() {
    super();
    // Se registra en el dispatcher: todas las acciones fluyen por aquí.
    AppDispatcher.register(this.handleAction.bind(this));
  }

  /**
   * Manejador principal de acciones enviado por el Dispatcher.
   * Lógica: Evalúa el tipo de acción y actualiza el estado según corresponda.
   * Input: action (Action).
   * Output: void.
   */
  private handleAction(action: Action): void {
    switch (action.type) {
      // Balance Actions
      case ActionTypes.FETCH_BALANCE_REQUEST:
        this.state.balanceLoading = true;
        this.state.balanceError = null;
        this.emitChange();
        break;

      case ActionTypes.FETCH_BALANCE_SUCCESS:
        this.state.balance = action.payload;
        this.state.balanceLoading = false;
        this.state.balanceError = null;
        this.emitChange();
        break;

      case ActionTypes.FETCH_BALANCE_ERROR:
        this.state.balanceLoading = false;
        this.state.balanceError = action.payload;
        this.emitChange();
        break;

      // Contacts Actions
      case ActionTypes.FETCH_CONTACTS_REQUEST:
        this.state.contactsLoading = true;
        this.state.contactsError = null;
        this.emitChange();
        break;

      case ActionTypes.FETCH_CONTACTS_SUCCESS:
        this.state.contacts = action.payload;
        this.state.contactsLoading = false;
        this.state.contactsError = null;
        this.emitChange();
        break;

      case ActionTypes.FETCH_CONTACTS_ERROR:
        this.state.contactsLoading = false;
        this.state.contactsError = action.payload;
        this.emitChange();
        break;

      // Transfer Actions
      case ActionTypes.TRANSFER_REQUEST:
        this.state.transferLoading = true;
        this.state.transferError = null;
        this.state.transferSuccess = false;
        this.emitChange();
        break;

      case ActionTypes.TRANSFER_SUCCESS:
        this.state.transferLoading = false;
        this.state.transferSuccess = true;
        this.state.transactionId = action.payload.transactionId;
        // Actualiza el balance con el nuevo valor.
        this.state.balance = action.payload.newBalance;
        this.state.transferError = null;
        this.emitChange();
        break;

      case ActionTypes.TRANSFER_ERROR:
        this.state.transferLoading = false;
        this.state.transferError = action.payload;
        this.state.transferSuccess = false;
        this.emitChange();
        break;

      case ActionTypes.TRANSFER_RESET:
        this.state.transferLoading = false;
        this.state.transferError = null;
        this.state.transferSuccess = false;
        this.state.transactionId = null;
        this.emitChange();
        break;

      default:
        break;
    }
  }

  /**
   * Emite un evento de cambio para notificar a las vistas.
   * Input: Ninguno.
   * Output: void.
   */
  private emitChange(): void {
    this.emit(CHANGE_EVENT);
  }

  /**
   * Suscribe un callback a los cambios del store.
   * Input: callback (() => void).
   * Output: void.
   */
  addChangeListener(callback: () => void): void {
    this.on(CHANGE_EVENT, callback);
  }

  /**
   * Elimina la suscripción de un callback.
   * Input: callback (() => void).
   * Output: void.
   */
  removeChangeListener(callback: () => void): void {
    this.removeListener(CHANGE_EVENT, callback);
  }

  /**
   * Getters públicos para el estado (acceso de solo lectura).
   */

  getBalance(): number | null {
    return this.state.balance;
  }

  isBalanceLoading(): boolean {
    return this.state.balanceLoading;
  }

  getBalanceError(): string | null {
    return this.state.balanceError;
  }

  getContacts(): Contact[] {
    return this.state.contacts;
  }

  isContactsLoading(): boolean {
    return this.state.contactsLoading;
  }

  getContactsError(): string | null {
    return this.state.contactsError;
  }

  isTransferLoading(): boolean {
    return this.state.transferLoading;
  }

  getTransferError(): string | null {
    return this.state.transferError;
  }

  isTransferSuccess(): boolean {
    return this.state.transferSuccess;
  }

  getTransactionId(): string | null {
    return this.state.transactionId;
  }

  /**
   * Obtiene una instantánea completa del estado.
   * Input: Ninguno.
   * Output: Readonly<BankStoreState>.
   */
  getState(): Readonly<BankStoreState> {
    return { ...this.state };
  }
}

// Instancia Singleton: única fuente de verdad.
export default new BankStore();
