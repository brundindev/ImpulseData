import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './assets/main.css'

// Configurar manejador global para ocultar errores de autenticación en consola
const originalConsoleError = console.error;
console.error = function(...args) {
  // Si el mensaje de error contiene información relacionada con error 401 o login,
  // no lo mostramos en la consola de usuarios
  const errorString = args.join(' ');
  if (errorString.includes('401') || 
      errorString.includes('Unauthorized') || 
      errorString.includes('login') ||
      errorString.includes('axios')) {
    // En desarrollo, se puede mostrar un mensaje personalizado
    if (process.env.NODE_ENV === 'development') {
      console.log('[Depuración] Error de autenticación suprimido');
      // Opcionalmente descomentar para ver el error original en desarrollo
      // originalConsoleError.apply(console, args);
    }
    return;
  }
  
  // Para todos los demás errores, usar el comportamiento normal
  originalConsoleError.apply(console, args);
};

// Interceptar errores no capturados
window.addEventListener('unhandledrejection', function(event) {
  // Si el error está relacionado con credenciales incorrectas, lo suprimimos
  if (event.reason && (
    event.reason.toString().includes('401') ||
    event.reason.toString().includes('Unauthorized') ||
    event.reason.toString().includes('login') ||
    event.reason.toString().includes('axios')
  )) {
    // Prevenir que aparezca en la consola
    event.preventDefault();
    
    // En modo desarrollo, podemos mostrar un mensaje personalizado
    if (process.env.NODE_ENV === 'development') {
      console.log('[Depuración] Promesa rechazada suprimida (error de autenticación)');
    }
  }
});

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
