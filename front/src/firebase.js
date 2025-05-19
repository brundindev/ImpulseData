// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, onAuthStateChanged, connectAuthEmulator, sendEmailVerification } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDNvESa9Lo6L9kBOcmN0-v2MTWJPwgOGEY",
  authDomain: "impulsedata-alicantefutura.firebaseapp.com",
  databaseURL: "https://impulsedata-alicantefutura-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "impulsedata-alicantefutura",
  storageBucket: "impulsedata-alicantefutura.firebasestorage.app",
  messagingSenderId: "232303775538",
  appId: "1:232303775538:web:ba4ea496e5d07f10a3512b"
};

// Inicialización de Firebase verificando si ya existe una instancia
let app;
console.log("Inicializando Firebase...");

// Verificar si ya hay apps inicializadas
if (getApps().length === 0) {
  // No hay apps inicializadas, crear una nueva
  app = initializeApp(firebaseConfig);
  console.log("Firebase inicializado por primera vez en firebase.js");
} else {
  // Usar la app existente
  app = getApp();
  console.log("Usando instancia de Firebase existente en firebase.js");
}

const auth = getAuth(app);
const db = getFirestore(app);
console.log("Firebase configurado:", app.name, "Auth:", !!auth, "Firestore:", !!db);

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
export { auth, db, waitForAuthInit, sendEmailVerification };
export default app; 