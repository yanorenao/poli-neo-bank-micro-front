/**
 * Flux Dispatcher - Central hub for all actions
 * All data flows through the dispatcher to stores
 */

export interface Action<T = any> {
  type: string;
  payload?: T;
}

type Callback = (action: Action) => void;

class Dispatcher {
  private callbacks: Map<string, Callback> = new Map();
  private isDispatching = false;

  /**
   * Register a callback to be invoked with every dispatched action
   * Returns a token that can be used to unregister the callback
   */
  register(callback: Callback): string {
    const token = `ID_${Math.random().toString(36).substring(2, 9)}`;
    this.callbacks.set(token, callback);
    return token;
  }

  /**
   * Unregister a callback using the token returned from register()
   */
  unregister(token: string): void {
    this.callbacks.delete(token);
  }

  /**
   * Dispatch an action to all registered callbacks
   * This is the central point where all actions flow through
   */
  dispatch(action: Action): void {
    if (this.isDispatching) {
      throw new Error('Cannot dispatch in the middle of a dispatch');
    }

    this.isDispatching = true;

    try {
      this.callbacks.forEach((callback) => {
        callback(action);
      });
    } finally {
      this.isDispatching = false;
    }
  }

  /**
   * Check if dispatcher is currently dispatching
   */
  isDispatchingAction(): boolean {
    return this.isDispatching;
  }
}

// Singleton instance - there should only be one dispatcher in the app
export const AppDispatcher = new Dispatcher();
