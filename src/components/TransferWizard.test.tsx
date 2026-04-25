// src/components/TransferWizard.test.tsx
/**
 * Suite de pruebas de integración para TransferWizard con React Query.
 * Valida comportamiento asíncrono, gestión de errores y mutaciones de estado.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TransferWizard } from './TransferWizard';
import * as api from '../mocks/api';

// Mock del módulo de API
vi.mock('../mocks/api', () => ({
  getBalance: vi.fn(),
  getContacts: vi.fn(),
  postTransfer: vi.fn(),
}));

const INITIAL_BALANCE = 100000; // 100 mil COP para permitir transferencias de prueba

// Datos de prueba
const mockContacts: api.Contact[] = [
  { id: '1', name: 'Alvaro García', account: '123456789', isFavorite: true },
  { id: '2', name: 'Laura Martínez', account: '987654321', isFavorite: true },
];

/**
 * Crea un QueryClient fresco por cada test para evitar contaminación de caché.
 */
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return { queryClient, Wrapper };
}

describe('TransferWizard - Suite de Pruebas de Integración', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(api.getBalance).mockResolvedValue({ balance: INITIAL_BALANCE });
    vi.mocked(api.getContacts).mockResolvedValue(mockContacts);

    vi.mocked(api.postTransfer).mockImplementation(
      () => new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: 'Transferencia exitosa',
            transactionId: 'TX-TEST123',
            newBalance: INITIAL_BALANCE - 25000,
          });
        }, 100);
      })
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  /**
   * TC-01: Ejecución Exitosa (Happy Path)
   * Verifica el flujo completo de transferencia desde la selección
   * del destinatario hasta la confirmación exitosa.
   */
  it('TC-01: Debe completar transferencia exitosamente', async () => {
    const user = userEvent.setup();
    const { Wrapper } = createWrapper();
    render(<TransferWizard />, { wrapper: Wrapper });

    // Esperar a que carguen los contactos
    await waitFor(() => {
      expect(screen.getByText('Seleccionar Destinatario')).toBeInTheDocument();
    });

    // PASO 1: Seleccionar destinatario
    const recipientButtons = await screen.findAllByText('Alvaro García');
    await user.click(recipientButtons[0]);

    // PASO 2: Ingresar monto válido (25000)
    await waitFor(() => {
      expect(screen.getByText('¿Cuánto deseas enviar?')).toBeInTheDocument();
    });

    const amountInput = screen.getByPlaceholderText('0');
    await user.type(amountInput, '25000');

    const continueButton = screen.getByRole('button', { name: /continuar/i });
    await user.click(continueButton);

    // PASO 3: Confirmar transferencia
    await waitFor(() => {
      expect(screen.getByText('Confirma tu transferencia')).toBeInTheDocument();
    });

    const confirmButton = screen.getByRole('button', { name: /confirmar y ejecutar transferencia/i });
    await user.click(confirmButton);

    // Verificar estado de carga
    await waitFor(() => {
      expect(screen.getByText(/procesando/i)).toBeInTheDocument();
    });

    // Verificar pantalla de éxito
    await waitFor(() => {
      expect(screen.getByText(/transferencia exitosa/i)).toBeInTheDocument();
    }, { timeout: 3000 });

    expect(screen.getByText(/has enviado/i)).toBeInTheDocument();
    expect(screen.getByText('TX-TEST123')).toBeInTheDocument();

    // Verificar que el API fue llamado con los parámetros correctos
    expect(vi.mocked(api.postTransfer)).toHaveBeenCalledWith(
      { destination: '123456789', amount: 25000 },
      INITIAL_BALANCE
    );
  });

  /**
   * TC-02: Prevención de Doble Mutación (Debounce/Lock)
   * Verifica que múltiples clics rápidos no generen múltiples peticiones.
   */
  it('TC-02: Debe prevenir dobles clics y llamar al API solo una vez', async () => {
    const user = userEvent.setup();

    vi.mocked(api.postTransfer).mockImplementation(
      () => new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: 'Transferencia exitosa',
            transactionId: 'TX-DELAYED',
            newBalance: 75000,
          });
        }, 500);
      })
    );

    const { Wrapper } = createWrapper();
    render(<TransferWizard />, { wrapper: Wrapper });

    const recipientButtons = await screen.findAllByText('Alvaro García');
    await user.click(recipientButtons[0]);

    await waitFor(() => screen.getByPlaceholderText('0'));
    await user.type(screen.getByPlaceholderText('0'), '25000');
    await user.click(screen.getByRole('button', { name: /continuar/i }));

    await waitFor(() => screen.getByText('Confirma tu transferencia'));

    const confirmButton = screen.getByRole('button', { name: /confirmar y ejecutar transferencia/i });

    // Triple clic rápido
    await user.click(confirmButton);
    await user.click(confirmButton);
    await user.click(confirmButton);

    // El botón debe deshabilitarse tras el primer clic
    await waitFor(() => {
      expect(confirmButton).toBeDisabled();
    });

    // La API debe haberse llamado exactamente una vez
    expect(vi.mocked(api.postTransfer)).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(screen.getByText(/transferencia exitosa/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  /**
   * TC-03: Rechazo por Lógica de Negocio (Saldo Insuficiente)
   * Verifica que la UI bloquee transferencias que excedan el saldo disponible.
   */
  it('TC-03: Debe mostrar error y bloquear transferencia con saldo insuficiente', async () => {
    const user = userEvent.setup();
    const { Wrapper } = createWrapper();
    render(<TransferWizard />, { wrapper: Wrapper });

    const recipientButtons = await screen.findAllByText('Alvaro García');
    await user.click(recipientButtons[0]);

    // Monto que excede el saldo (150000 > 100000)
    await waitFor(() => screen.getByPlaceholderText('0'));
    const amountInput = screen.getByPlaceholderText('0');
    await user.type(amountInput, '150000');

    const continueButton = screen.getByRole('button', { name: /continuar/i });
    await user.click(continueButton);

    // Verificar mensaje de error en el paso 2 (validación de UI)
    await waitFor(() => {
      expect(screen.getByText(/fondos insuficientes/i)).toBeInTheDocument();
    });

    // Verificar que seguimos en el paso 2
    expect(screen.getByText('¿Cuánto deseas enviar?')).toBeInTheDocument();
    expect(screen.queryByText('Confirma tu transferencia')).not.toBeInTheDocument();

    // La API de transferencia no debe haberse llamado
    expect(vi.mocked(api.postTransfer)).not.toHaveBeenCalled();
  });

  /**
   * TC-04: Manejo de Caída del Servidor (Unhandled Rejection)
   * Verifica que la aplicación maneje correctamente errores del servidor.
   */
  it('TC-04: Debe manejar errores del servidor sin romper la aplicación', async () => {
    const user = userEvent.setup();
    vi.mocked(api.postTransfer).mockRejectedValue(new Error('Server Error'));

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { Wrapper } = createWrapper();
    render(<TransferWizard />, { wrapper: Wrapper });

    const recipientButtons = await screen.findAllByText('Alvaro García');
    await user.click(recipientButtons[0]);

    await waitFor(() => screen.getByPlaceholderText('0'));
    await user.type(screen.getByPlaceholderText('0'), '30000');
    await user.click(screen.getByRole('button', { name: /continuar/i }));

    await waitFor(() => screen.getByText('Confirma tu transferencia'));

    const confirmButton = screen.getByRole('button', { name: /confirmar y ejecutar transferencia/i });
    await user.click(confirmButton);

    // Verificar mensaje de error en la UI
    await waitFor(() => {
      expect(screen.getByText(/server error/i)).toBeInTheDocument();
    }, { timeout: 2000 });

    // Verificar que seguimos en el paso 3 (con opción de reintentar)
    expect(screen.getByText('Confirma tu transferencia')).toBeInTheDocument();

    // No debe mostrarse pantalla de éxito
    expect(screen.queryByText(/transferencia exitosa/i)).not.toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });

  /**
   * TC-05: Conservación del Estado Local (Navegación)
   * Verifica que los valores ingresados se mantengan al navegar atrás y adelante.
   */
  it('TC-05: Debe conservar el monto al navegar atrás y adelante', async () => {
    const user = userEvent.setup();
    const { Wrapper } = createWrapper();
    render(<TransferWizard />, { wrapper: Wrapper });

    // Seleccionar destinatario
    const recipientButtons = await screen.findAllByText('Alvaro García');
    await user.click(recipientButtons[0]);

    // Ingresar monto válido
    await waitFor(() => screen.getByPlaceholderText('0'));
    const amountInput = screen.getByPlaceholderText('0');
    await user.type(amountInput, '30000');

    expect(amountInput).toHaveValue('30.000');

    // Avanzar al paso 3
    await user.click(screen.getByRole('button', { name: /continuar/i }));
    await waitFor(() => screen.getByText('Confirma tu transferencia'));

    // Verificar que el monto se muestra correctamente en confirmación
    expect(screen.getByText((_, element) => {
      return element?.textContent === '$30.000';
    })).toBeInTheDocument();

    // Volver al paso 2
    const backButton = screen.getByRole('button', { name: /editar/i });
    await user.click(backButton);

    await waitFor(() => {
      expect(screen.getByText('¿Cuánto deseas enviar?')).toBeInTheDocument();
    });

    // Re-ingresar el valor y verificar que se puede continuar
    const amountInputAgain = screen.getByPlaceholderText('0');
    await user.clear(amountInputAgain);
    await user.type(amountInputAgain, '30000');
    expect(amountInputAgain).toHaveValue('30.000');

    await user.click(screen.getByRole('button', { name: /continuar/i }));
    await waitFor(() => {
      expect(screen.getByText('Confirma tu transferencia')).toBeInTheDocument();
    });

    expect(screen.getByText((_, element) => {
      return element?.textContent === '$30.000';
    })).toBeInTheDocument();
  });

  /**
   * TC-06: Validación de Monto Mínimo
   * Verifica que se bloquee la transferencia cuando el monto es menor a $10.000
   */
  it('TC-06: Debe mostrar error cuando el monto es menor al mínimo ($10.000)', async () => {
    const user = userEvent.setup();
    const { Wrapper } = createWrapper();
    render(<TransferWizard />, { wrapper: Wrapper });

    const recipientButtons = await screen.findAllByText('Alvaro García');
    await user.click(recipientButtons[0]);

    await waitFor(() => screen.getByPlaceholderText('0'));
    const amountInput = screen.getByPlaceholderText('0');
    await user.type(amountInput, '5000');

    expect(amountInput).toHaveValue('5.000');

    const continueButton = screen.getByRole('button', { name: /continuar/i });
    await user.click(continueButton);

    await waitFor(() => {
      expect(screen.getByText(/el monto mínimo por transferencia es \$10\.000/i)).toBeInTheDocument();
    });

    expect(screen.getByText('¿Cuánto deseas enviar?')).toBeInTheDocument();
    expect(screen.queryByText('Confirma tu transferencia')).not.toBeInTheDocument();
    expect(vi.mocked(api.postTransfer)).not.toHaveBeenCalled();
  });

  /**
   * TC-07: Separador de Miles en Input
   * Verifica que el input muestre correctamente el formato con separador de miles
   */
  it('TC-07: Debe formatear el monto con separador de miles', async () => {
    const user = userEvent.setup();
    const { Wrapper } = createWrapper();
    render(<TransferWizard />, { wrapper: Wrapper });

    const recipientButtons = await screen.findAllByText('Alvaro García');
    await user.click(recipientButtons[0]);

    await waitFor(() => screen.getByPlaceholderText('0'));
    const amountInput = screen.getByPlaceholderText('0');

    await user.type(amountInput, '50000');
    expect(amountInput).toHaveValue('50.000');

    await user.clear(amountInput);
    await user.type(amountInput, '1500000');
    expect(amountInput).toHaveValue('1.500.000');

    await user.clear(amountInput);
    await user.type(amountInput, '250');
    expect(amountInput).toHaveValue('250');

    await user.clear(amountInput);
    await user.type(amountInput, 'abc123xyz');
    expect(amountInput).toHaveValue('123');
  });
});
