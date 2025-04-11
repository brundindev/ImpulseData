#!/bin/bash
# Script personalizado para la construcción en Vercel sin usar pnpm

echo "Verificando la versión de node y npm..."
node -v
npm -v

echo "Instalando dependencias con npm..."
cd front
npm install

echo "Construyendo la aplicación..."
npm run build

# Verificar que el directorio dist existe
if [ -d "dist" ]; then
  echo "Build completada con éxito. Directorio dist creado."
  ls -la dist
else
  echo "Error: No se creó el directorio dist."
  exit 1
fi 