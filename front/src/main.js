import { createApp } from 'vue'
import { createPinia } from 'pinia'
import store from './store'

import App from './App.vue'
import router from './router'

import './assets/main.css'
import '@fortawesome/fontawesome-free/css/all.css';

// Configurar manejador global para ocultar errores de autenticación en consola
const originalConsoleError = console.error;
console.error = function(...args) {
  // Si el mensaje de error contiene información relacionada con error 401 o login,
  // no lo mostramos en la consola de usuarios
  const errorString = args.join(' ');
  if (errorString.includes('401') || 
      errorString.includes('Unauthorized') || 
      errorString.includes('login') ||
      errorString.includes('axios') ||
      // Nuevos errores a suprimir:
      errorString.includes('ERR_BLOCKED_BY_CLIENT') ||
      errorString.includes('Cross-Origin-Opener-Policy') ||
      errorString.includes('Firestore.Listen') ||
      errorString.includes('window.close') ||
      // Errores específicos de Firebase Auth:
      errorString.includes('auth/invalid-credential') ||
      errorString.includes('Error al iniciar sesión con Firebase') ||
      errorString.includes('No se pudo reautenticar con credenciales')) {
    // En desarrollo, se puede mostrar un mensaje personalizado
    if (process.env.NODE_ENV === 'development') {
      console.log('[Depuración] Error suprimido:', errorString.substring(0, 50) + '...');
      // Opcionalmente descomentar para ver el error original en desarrollo
      // originalConsoleError.apply(console, args);
    }
    return;
  }
  
  // Para todos los demás errores, usar el comportamiento normal
  originalConsoleError.apply(console, args);
};

// También capturar errores no manejados en promesas
window.addEventListener('unhandledrejection', function(event) {
  const errorMsg = event.reason?.message || String(event.reason);
  
  // Si es un error que queremos suprimir, prevenir su propagación
  if (errorMsg.includes('ERR_BLOCKED_BY_CLIENT') || 
      errorMsg.includes('Cross-Origin-Opener-Policy') ||
      errorMsg.includes('Firestore.Listen') ||
      errorMsg.includes('window.close')) {
    // Evitar que el error aparezca en la consola
    event.preventDefault();
    event.stopPropagation();
    
    if (process.env.NODE_ENV === 'development') {
      console.log('[Depuración] Promesa rechazada suprimida:', errorMsg.substring(0, 50) + '...');
    }
  }
});

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(store)

app.mount('#app')
