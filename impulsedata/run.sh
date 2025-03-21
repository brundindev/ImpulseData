#!/bin/bash

echo "Deteniendo contenedores actuales..."
docker compose down

echo "Reconstruyendo contenedores sin cache..."
docker compose build --no-cache

echo "Iniciando contenedores en modo desarrollo..."
docker compose up 