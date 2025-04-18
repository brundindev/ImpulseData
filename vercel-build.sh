#!/bin/bash
# Script de construcción para el despliegue en Vercel

echo "Verificando la versión de node y npm..."
node -v
npm -v

echo "Entrando al directorio front..."
cd front || { echo "Error: No se pudo entrar al directorio front"; exit 1; }

echo "Instalando dependencias con npm..."
npm install || { echo "Error: Fallo al instalar dependencias"; exit 1; }

# Asegurarse de que terser esté instalado
echo "Instalando terser explícitamente..."
npm install terser --save-dev || { echo "Advertencia: No se pudo instalar terser, pero continuamos..."; }

echo "Construyendo la aplicación..."
npm run build || { echo "Error: Fallo en la construcción"; exit 1; }

# Verificar que el directorio dist existe
if [ -d "dist" ]; then
  echo "Build completada con éxito. Directorio dist creado."
  ls -la dist
  
  # Comprobar el index.html
  echo "Contenido de index.html:"
  cat dist/index.html
  
  # Comprobar el directorio de assets
  echo "Archivos en assets:"
  ls -la dist/assets
else
  echo "Error: No se creó el directorio dist."
  exit 1
fi

# Mostramos información sobre los archivos generados
echo "Contenido del directorio dist:"
find dist -type f | sort 