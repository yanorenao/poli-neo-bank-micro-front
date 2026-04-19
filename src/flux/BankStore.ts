/**
 * Flux BankStore - Single source of truth for all application state
 * Listens to Dispatcher and emits changes to Views
 * 
 * Architecture: Action → Dispatcher → Store → View
 */

import { AppDispatcher, type Action } from './Dispatcher';
import * as ActionTypes from './ActionTypes';
import type { Contact } from '../mocks/api';

const CHANGE_EVENT = 'change';

/**
 * Simple EventEmitter implementation for browser
 */
class EventEmitter {
  private events: Map<string, Set<Function>> = new Map();

  on(event: string, callback: Function): void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event)!.add(callback);
  }

  removeListener(event: string, callback: Function): void {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.delete(callback);
    }
  }

  emit(event: string, ...args: any[]): void {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => callback(...args));
    }
  }
}

/**
 * Application State Interface
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
 * BankStore - Main application store
 * Extends EventEmitter to notify views of changes
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
    // Register with dispatcher - all actions flow through here
    AppDispatcher.register(this.handleAction.bind(this));
  }

  /**
   * Main action handler - called by Dispatcher for every action
   * This is where Flux unidirectional flow is enforced
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
        // Update balance with new value
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
        // No action taken for unknown action types
        break;
    }
  }

  /**
   * Emit change event to notify views
   */
  private emitChange(): void {
    this.emit(CHANGE_EVENT);
  }

  /**
   * Subscribe to store changes
   */
  addChangeListener(callback: () => void): void {
    this.on(CHANGE_EVENT, callback);
  }

  /**
   * Unsubscribe from store changes
   */
  removeChangeListener(callback: () => void): void {
    this.removeListener(CHANGE_EVENT, callback);
  }

  /**
   * Public getters for state (read-only access)
   * Views should never mutate store state directly
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
   * Get complete state snapshot (useful for debugging)
   */
  getState(): Readonly<BankStoreState> {
    return { ...this.state };
  }
}

// Singleton instance - single source of truth
export default new BankStore();
