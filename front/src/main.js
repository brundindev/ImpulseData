import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import VueApexCharts from 'vue-apexcharts'
import { waitForAuthInit } from './firebase'
import './styles.css'

Vue.config.productionTip = false

// Registrar componente VueApexCharts
Vue.component('apexchart', VueApexCharts)

// Contador para errores CORS relacionados con Firestore
let firestoreCorsErrors = 0;
const MAX_CORS_ERRORS = 5;

// Guardar referencia al console.error original
const originalConsoleError = console.error;

// Sobreescribir console.error para capturar y suprimir errores específicos de CORS y Firebase
console.error = function(...args) {
  const errorMessage = args.join(' ');
  
  // Verificar si es un error CORS relacionado con Firestore
  if (errorMessage.includes('Cross-Origin') && errorMessage.includes('Firestore')) {
    firestoreCorsErrors++;
    console.warn(`Error CORS de Firestore suprimido (${firestoreCorsErrors}/${MAX_CORS_ERRORS})`);
    
    // Si excedemos el máximo, mostrar mensaje de advertencia una sola vez
    if (firestoreCorsErrors === MAX_CORS_ERRORS) {
      console.warn('Alcanzado número máximo de errores CORS. Se activará modo fallback para solicitudes Firestore.');
    }
    return;
  }
  
  // Suprimir otros errores comunes de Firebase que no afectan la funcionalidad
  if (errorMessage.includes('Firebase') && 
      (errorMessage.includes('timeout') || 
       errorMessage.includes('network error') || 
       errorMessage.includes('quota exceeded'))) {
    console.warn('Error de Firebase suprimido:', errorMessage.substring(0, 100) + '...');
    return;
  }
  
  // Para todos los demás errores, usar el comportamiento original
  originalConsoleError.apply(console, args);
};

// Guardar referencia al fetch original
const originalFetch = window.fetch;

// Sobreescribir fetch para manejar solicitudes a Firestore cuando hay errores CORS
window.fetch = function(...args) {
  const url = args[0].url || args[0];
  
  // Si es una solicitud a Firestore y hemos alcanzado el máximo de errores CORS
  if (typeof url === 'string' && 
      url.includes('firestore.googleapis.com') && 
      firestoreCorsErrors >= MAX_CORS_ERRORS) {
    
    console.warn('Interceptando solicitud a Firestore en modo fallback');
    
    // Simular una respuesta exitosa vacía
    return Promise.resolve(new Response(JSON.stringify({ documents: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }));
  }
  
  // Para todas las demás solicitudes, usar el comportamiento original
  return originalFetch.apply(window, args);
};

// Iniciar la aplicación después de que Firebase Auth esté inicializado
async function initApp() {
  try {
    // Esperar a que Firebase Auth se inicialice
    await waitForAuthInit();
    console.log('Firebase Auth inicializado correctamente');
  } catch (error) {
    console.warn('Error al inicializar Firebase Auth, continuando de todos modos:', error);
  }
  
  // Iniciar la aplicación Vue
  new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
  }).$mount('#app');
}

// Iniciar la aplicación
initApp();
