// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, connectAuthEmulator, sendEmailVerification } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator, enableIndexedDbPersistence, initializeFirestore, CACHE_SIZE_UNLIMITED, disableNetwork, enableNetwork } from "firebase/firestore";
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyASLdeSFbrKVUZ-5-N1pJtFOVH13J0Vj0c",
  authDomain: "alicante-futura.firebaseapp.com",
  projectId: "alicante-futura",
  storageBucket: "alicante-futura.appspot.com",
  messagingSenderId: "118984054507",
  appId: "1:118984054507:web:d70d57e68dc68ff95e9053",
  measurementId: "G-9VRRWB7ZWZ"
};

// Inicialización de Firebase
console.log("Inicializando Firebase...");
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Inicializar Firestore con configuraciones optimizadas
const db = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
  experimentalForceLongPolling: true, // Usar long polling en lugar de WebSockets para evitar CORS
  experimentalAutoDetectLongPolling: true,
  ignoreUndefinedProperties: true,
});

console.log("Firebase inicializado:", app.name, "Auth:", !!auth, "Firestore:", !!db);

// Habilitar persistencia siempre y sincronización entre pestañas
enableIndexedDbPersistence(db, { synchronizeTabs: true })
  .then(() => {
    console.log('Persistencia de Firestore habilitada con éxito');
  })
  .catch((err) => {
    console.warn('Error al habilitar persistencia de Firestore:', err.code);
    
    // Intentar recuperación según el tipo de error
    if (err.code === 'failed-precondition') {
      // Múltiples pestañas abiertas, no podremos habilitar persistencia
      console.log('Usando modo online debido a múltiples pestañas abiertas');
    } else if (err.code === 'unimplemented') {
      // El navegador no soporta IndexedDB
      console.log('Este navegador no soporta almacenamiento offline');
    }
  });

// Variables para control de red
let networkErrorCounter = 0;
const MAX_NETWORK_ERRORS = 3;
let isOfflineMode = false;

// Función para alternar el modo de red
const toggleNetworkMode = async () => {
  try {
    if (isOfflineMode) {
      await enableNetwork(db);
      console.log('Modo online activado');
    } else {
      await disableNetwork(db);
      console.log('Modo offline activado');
    }
    isOfflineMode = !isOfflineMode;
  } catch (error) {
    console.warn('Error al cambiar modo de red:', error);
  }
};

// Monitorear problemas de red y alternar automáticamente si es necesario
window.addEventListener('online', async () => {
  if (isOfflineMode) {
    try {
      await enableNetwork(db);
      isOfflineMode = false;
      console.log('Conexión a internet restaurada, habilitando red en Firestore');
    } catch (error) {
      console.warn('Error al restablecer conexión Firestore:', error);
    }
  }
});

window.addEventListener('offline', async () => {
  if (!isOfflineMode) {
    try {
      await disableNetwork(db);
      isOfflineMode = true;
      console.log('Conexión a internet perdida, deshabilitando red en Firestore');
    } catch (error) {
      console.warn('Error al deshabilitar red en Firestore:', error);
    }
  }
});

// Exportar elementos de Firebase
const storage = getStorage(app);

// Función para esperar la inicialización de Auth
export function waitForAuthInit() {
  return new Promise((resolve, reject) => {
    // Establecer tiempo límite para no bloquear indefinidamente
    const timeout = setTimeout(() => {
      console.warn('Tiempo de espera excedido para inicialización de Auth');
      resolve(); // Resolver de todos modos para no bloquear la app
    }, 5000);

    // Intentar detectar el estado de autenticación
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        clearTimeout(timeout);
        unsubscribe();
        resolve(user);
      },
      (error) => {
        clearTimeout(timeout);
        unsubscribe();
        console.error('Error en inicialización de Auth:', error);
        reject(error);
      }
    );
  });
}

// Exportar la función para alternar el modo de red
export { toggleNetworkMode };

export { app, auth, db, storage }; 