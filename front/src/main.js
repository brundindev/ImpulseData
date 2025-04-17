import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { waitForAuthInit } from './firebase'
import VueApexCharts from 'vue-apexcharts'
import './styles.css'

Vue.config.productionTip = false

// Registrar ApexCharts
Vue.use(VueApexCharts)
Vue.component('apexchart', VueApexCharts)

// Variables para control de errores CORS
let firestoreCorsErrors = 0;
const MAX_CORS_ERRORS = 5;
const originalFetch = window.fetch;
const originalConsoleError = console.error;

// Interceptar errores de consola para suprimir mensajes específicos de CORS y autenticación
console.error = (...args) => {
  const errorMessage = args.length > 0 ? String(args[0]) : '';
  
  // Suprimir errores conocidos de CORS y Firebase
  if (
    errorMessage.includes('Failed to fetch') || 
    errorMessage.includes('NetworkError') ||
    errorMessage.includes('CORS policy') || 
    errorMessage.includes('Cross-Origin Request Blocked') ||
    errorMessage.includes('access control checks') ||
    errorMessage.includes('Error: Quota exceeded') ||
    errorMessage.includes('FirebaseError') ||
    errorMessage.includes('Access to fetch has been blocked') ||
    errorMessage.includes('Error: aborted due to')
  ) {
    // Incrementar contador para errores relacionados con Firestore
    if (
      errorMessage.includes('firestore.googleapis.com') || 
      errorMessage.includes('Listen/channel') ||
      errorMessage.includes('google.firestore')
    ) {
      firestoreCorsErrors++;
      console.warn(`[Suprimido] Error CORS de Firestore (${firestoreCorsErrors}/${MAX_CORS_ERRORS}): ${errorMessage.substring(0, 100)}...`);
    } else {
      console.warn(`[Suprimido] Error similar a CORS: ${errorMessage.substring(0, 100)}...`);
    }
    return;
  }
  
  // Pasar al manejador original para otros errores
  originalConsoleError.apply(console, args);
};

// Sobrescribir el método fetch para capturar errores CORS específicos de Firestore
window.fetch = async function(...args) {
  // Verificar si es una solicitud a Firestore
  const isFirestoreRequest = args.length > 0 && 
    typeof args[0] === 'string' && 
    (args[0].includes('firestore.googleapis.com') || args[0].includes('google.firestore'));

  try {
    // Intentar la solicitud original
    return await originalFetch.apply(this, args);
  } catch (error) {
    // Si es un error de Firestore y hemos alcanzado el umbral, simular respuesta exitosa
    if (isFirestoreRequest && firestoreCorsErrors >= MAX_CORS_ERRORS) {
      console.warn(`[Recuperación] Simulando respuesta exitosa para solicitud Firestore debido a errores CORS recurrentes`);
      
      // Simular una respuesta vacía exitosa para evitar que la UI se rompa
      return new Response(JSON.stringify({ documents: [] }), { 
        status: 200, 
        headers: new Headers({ 'Content-Type': 'application/json' })
      });
    }
    
    // De lo contrario, propagar el error
    throw error;
  }
};

// Esperar a que Firebase Auth esté inicializado antes de montar la aplicación
waitForAuthInit().then(() => {
  new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
  }).$mount('#app');
}).catch(error => {
  console.error('Error al inicializar Firebase Auth:', error);
  // Iniciar la aplicación de todos modos si hay un error
  new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
  }).$mount('#app');
});
