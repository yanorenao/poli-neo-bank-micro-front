#!/bin/bash
# scripts/dev.sh
# Levanta los 3 microfrontends en paralelo.
# Uso: pnpm dev:all  (o bash scripts/dev.sh)

set -e

echo "🚀 Iniciando microfrontends NeoBank..."
echo "   Shell     → http://localhost:5173"
echo "   Transfer  → http://localhost:5174"
echo "   Onboarding → http://localhost:5175"
echo ""
echo "Presiona Ctrl+C para detener todos los servidores."
echo ""

# Matar todos los procesos hijos al salir
trap 'echo ""; echo "Deteniendo servidores..."; kill $(jobs -p) 2>/dev/null; exit 0' EXIT INT TERM

# Compilar shared-types primero (dependencia de todos los remotes)
pnpm --filter @poli/shared-types build

# Iniciar servidores en background
pnpm --filter @poli/remote-onboarding preview &
pnpm --filter @poli/remote-transfer preview &
pnpm --filter @poli/shell dev &

# Esperar a que todos los procesos terminen
wait
