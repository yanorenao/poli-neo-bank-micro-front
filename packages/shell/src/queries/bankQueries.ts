import { useQuery } from '@tanstack/react-query';
import { getBalance } from '../mocks/api';

/**
 * Hook para obtener el saldo desde el servidor.
 * Lógica: El QueryClient es singleton compartido, se integra el mock de latencia real.
 * Input: Ninguno.
 * Output: Objeto conteniendo el query data (balance) y metadata.
 */
export function useBalanceQuery() {
  return useQuery({
    queryKey: ['balance'],
    queryFn: getBalance,
    staleTime: 30_000,
  });
}
