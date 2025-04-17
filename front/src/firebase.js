// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, connectFirestoreEmulator, enableIndexedDbPersistence, CACHE_SIZE_UNLIMITED, disableNetwork, enableNetwork } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, connectAuthEmulator, onAuthStateChanged } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Improved connection management to avoid CORS errors when refreshing
const handleConnectionState = async () => {
  try {
    // Set up offline persistence with improved cache settings
    await enableIndexedDbPersistence(db, {
      cacheSizeBytes: CACHE_SIZE_UNLIMITED
    }).catch((err) => {
      if (err.code === 'failed-precondition') {
        console.error('Multiple tabs open, persistence can only be enabled in one tab at a time.');
      } else if (err.code === 'unimplemented') {
        console.error('The current browser does not support offline persistence.');
      }
    });

    // Connection state change listeners
    window.addEventListener('online', async () => {
      console.log('Conexión a internet detectada.');
      try {
        await enableNetwork(db);
        console.log('Conexión a Firestore reestablecida.');
      } catch (error) {
        console.error('Error al reconectar a Firestore:', error);
      }
    });

    window.addEventListener('offline', async () => {
      console.log('Desconexión a internet detectada.');
      try {
        await disableNetwork(db);
        console.log('Conexión a Firestore desactivada temporalmente.');
      } catch (error) {
        console.error('Error al desconectar Firestore:', error);
      }
    });

    // Handle unhandled promise rejections (which often include CORS errors)
    window.addEventListener('unhandledrejection', async (event) => {
      if (event.reason && 
          (event.reason.message?.includes('fetch') || 
           event.reason.message?.includes('CORS') || 
           event.reason.message?.includes('network'))) {
        console.log('Detectado posible error de red/CORS:', event.reason);
        try {
          // Temporarily disable network and try to reconnect after 5 seconds
          await disableNetwork(db);
          console.log('Red desactivada temporalmente para evitar errores CORS.');
          
          setTimeout(async () => {
            try {
              await enableNetwork(db);
              console.log('Intento de reconexión a Firestore completado.');
            } catch (reconnectError) {
              console.error('Error al intentar reconectar:', reconnectError);
            }
          }, 5000);
        } catch (error) {
          console.error('Error al gestionar error de red:', error);
        }
      }
    });

    // Initial network connection
    if (!navigator.onLine) {
      console.log('Iniciando sin conexión a internet.');
      await disableNetwork(db);
    }
    
  } catch (error) {
    console.error('Error al configurar la conexión a Firestore:', error);
  }
};

// Call the connection handler function
handleConnectionState();

// Configurar emuladores si estamos en desarrollo local
if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_USE_FIREBASE_EMULATORS === 'true') {
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectAuthEmulator(auth, 'http://localhost:9099');
  console.log("Conectado a los emuladores de Firebase");
}

// Inicializar configuraciones adicionales
console.log("Firebase inicializado:", app.name, "Auth:", !!auth, "Firestore:", !!db);

// Variable para rastrear el estado de inicialización de Firebase Auth
let authInitialized = false;

// Establecer un oyente de estado de autenticación para saber cuándo está listo
onAuthStateChanged(auth, (user) => {
  if (!authInitialized) {
    authInitialized = true;
    console.log("Firebase Auth inicializado correctamente, estado de usuario:", user ? "Autenticado" : "No autenticado");
  }
});

// Función para esperar a que Firebase Auth esté inicializado
const waitForAuthInit = () => {
  return new Promise((resolve) => {
    // Si ya está inicializado, devolver inmediatamente
    if (authInitialized) {
      resolve();
      return;
    }
    
    // Si no está inicializado, configurar un oyente temporal
    const unsubscribe = onAuthStateChanged(auth, () => {
      unsubscribe(); // Eliminar el oyente después de la primera llamada
      authInitialized = true;
      resolve();
    });
    
    // Como respaldo, resolver después de 2 segundos en caso de problemas
    setTimeout(() => {
      if (!authInitialized) {
        authInitialized = true;
        unsubscribe();
        console.warn("Tiempo de espera agotado para la inicialización de Firebase Auth");
        resolve();
      }
    }, 2000);
  });
};

// Exportamos los servicios necesarios
export { auth, db, waitForAuthInit, storage };
export default app; 