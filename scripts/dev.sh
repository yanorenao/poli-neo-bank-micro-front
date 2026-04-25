#!/bin/bash
# scripts/dev.sh
# Levanta los 3 microfrontends en paralelo.
# Uso: pnpm dev:all  (o bash scripts/dev.sh)
#
# @originjs/vite-plugin-federation requiere build previo para los remotes;
# vite preview no puede servir sin dist/. El shell sí usa vite dev.

set -e

echo "Iniciando microfrontends NeoBank..."
echo "   Shell      → http://localhost:5173"
echo "   Transfer   → http://localhost:5174"
echo "   Onboarding → http://localhost:5175"
echo ""

# Matar todos los procesos hijos al salir
trap 'echo ""; echo "Deteniendo servidores..."; kill $(jobs -p) 2>/dev/null; exit 0' EXIT INT TERM

# 1. Compilar shared-types (dependencia de todos los packages)
echo "[1/3] Compilando @poli/shared-types..."
pnpm --filter @poli/shared-types build

# 2. Compilar remotes (vite preview requiere dist/)
echo "[2/3] Compilando remotes..."
pnpm --filter @poli/remote-onboarding build
pnpm --filter @poli/remote-transfer build

# 3. Iniciar servidores en background
echo "[3/3] Iniciando servidores..."
pnpm --filter @poli/remote-onboarding preview &
pnpm --filter @poli/remote-transfer preview &
pnpm --filter @poli/shell dev &

echo ""
echo "Presiona Ctrl+C para detener todos los servidores."
echo ""

# Esperar a que todos los procesos terminen
wait
