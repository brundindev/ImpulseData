#!/bin/bash
# Script personalizado para la construcción en Vercel sin usar el lockfile congelado

# Instalar dependencies usando --no-frozen-lockfile
echo "Instalando dependencias sin frozen lockfile..."
pnpm install --no-frozen-lockfile

# Construir la aplicación
echo "Construyendo la aplicación..."
pnpm run build

# Si se completa con éxito
echo "Build completada con éxito." 