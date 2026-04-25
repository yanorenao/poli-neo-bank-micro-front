/**
 * Flux Dispatcher - Hub central para todas las acciones.
 * Lógica: Gestiona el flujo unidireccional de datos distribuyendo acciones a los stores registrados.
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
   * Registra un callback para ser invocado con cada acción despachada.
   * Lógica: Almacena la función de escucha y retorna un token único.
   * Input: callback (Callback).
   * Output: token (string).
   */
  register(callback: Callback): string {
    const token = `ID_${Math.random().toString(36).substring(2, 9)}`;
    this.callbacks.set(token, callback);
    return token;
  }

  /**
   * Elimina un callback usando el token retornado por register().
   * Lógica: Remueve el registro del mapa de callbacks.
   * Input: token (string).
   * Output: void.
   */
  unregister(token: string): void {
    this.callbacks.delete(token);
  }

  /**
   * Despacha una acción a todos los callbacks registrados.
   * Lógica: Punto central donde fluyen todas las acciones hacia los interesados.
   * Input: action (Action).
   * Output: void.
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
   * Verifica si el dispatcher está actualmente procesando una acción.
   * Input: Ninguno.
   * Output: boolean.
   */
  isDispatchingAction(): boolean {
    return this.isDispatching;
  }
}

// Instancia Singleton - solo debe existir un dispatcher en la aplicación.
export const AppDispatcher = new Dispatcher();
