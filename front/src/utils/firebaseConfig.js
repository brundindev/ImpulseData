// Configuración de Firebase para el almacenamiento compartido de Impulsalicante
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Configuración de Firebase - IMPORTANTE: Usar la misma configuración que en firebase.js
const firebaseConfig = {
  apiKey: "AIzaSyDNvESa9Lo6L9kBOcmN0-v2MTWJPwgOGEY",
  authDomain: "impulsedata-alicantefutura.firebaseapp.com",
  databaseURL: "https://impulsedata-alicantefutura-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "impulsedata-alicantefutura",
  storageBucket: "impulsedata-alicantefutura.firebasestorage.app",
  messagingSenderId: "232303775538",
  appId: "1:232303775538:web:ba4ea496e5d07f10a3512b"
};

// Inicializar Firebase solo si aún no existe una instancia
let app;
if (getApps().length === 0) {
  // No hay apps inicializadas, crear una nueva
  app = initializeApp(firebaseConfig);
  console.log("Firebase inicializado por primera vez en firebaseConfig.js");
} else {
  // Usar la app existente
  app = getApp();
  console.log("Usando instancia de Firebase existente en firebaseConfig.js");
}

const db = getFirestore(app);
const storage = getStorage(app);

export { app, db, storage }; 