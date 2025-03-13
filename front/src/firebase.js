// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, sendEmailVerification } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDNvESa9Lo6L9kBOcmN0-v2MTWJPwgOGEY",
  authDomain: "impulsedata-alicantefutura.firebaseapp.com",
  databaseURL: "https://impulsedata-alicantefutura-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "impulsedata-alicantefutura",
  storageBucket: "impulsedata-alicantefutura.firebasestorage.app",
  messagingSenderId: "232303775538",
  appId: "1:232303775538:web:ba4ea496e5d07f10a3512b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Exportamos el servicio de autenticación y la función de envío de correo de verificación
export { auth, sendEmailVerification };
export default app; 