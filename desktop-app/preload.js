// Este archivo puede usarse para exponer funcionalidades específicas al proceso de renderizado
// mientras mantiene la seguridad por aislamiento del contexto.

const { contextBridge } = require('electron');

// Define las APIs que se expondrán al proceso de renderizado
contextBridge.exposeInMainWorld('app', {
  // Puedes agregar funciones aquí que interactúen con el sistema o con Electron
  // Por ejemplo:
  getVersion: () => process.env.npm_package_version,
  getPlatform: () => process.platform
});

console.log('Preload script cargado'); 