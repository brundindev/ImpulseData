import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyA1234567890abcdefghijklmnopqrstuv",
  authDomain: "impulsalicante-app.firebaseapp.com",
  projectId: "impulsalicante-app",
  storageBucket: "impulsalicante-app.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456ghi789jkl"
};

// Inicializar Firebase solo si aún no existe una instancia
let app;
if (getApps().length === 0) {
  // No hay apps inicializadas, crear una nueva
  app = initializeApp(firebaseConfig);
  console.log("Firebase inicializado por primera vez");
} else {
  // Usar la app existente
  app = getApp();
  console.log("Usando instancia de Firebase existente");
}

const db = getFirestore(app);
const storage = getStorage(app);

export { app, db, storage }; 