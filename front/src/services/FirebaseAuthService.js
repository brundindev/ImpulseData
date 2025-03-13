import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendEmailVerification,
  signOut
} from 'firebase/auth';
import { auth } from '../firebase';

class FirebaseAuthService {
  /**
   * Registrar un nuevo usuario con Firebase
   * @param {string} email - Correo electrónico
   * @param {string} password - Contraseña
   * @returns {Promise} - Datos del usuario
   */
  async register(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Enviar correo de verificación
      await sendEmailVerification(userCredential.user);
      return userCredential.user;
    } catch (error) {
      console.error('Error al registrar con Firebase:', error);
      throw error;
    }
  }

  /**
   * Iniciar sesión con Firebase
   * @param {string} email - Correo electrónico
   * @param {string} password - Contraseña
   * @returns {Promise} - Datos del usuario
   */
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Error al iniciar sesión con Firebase:', error);
      throw error;
    }
  }

  /**
   * Enviar correo de verificación
   * @param {Object} user - Usuario de Firebase
   * @returns {Promise} - void
   */
  async sendVerificationEmail(user) {
    try {
      await sendEmailVerification(user);
      return true;
    } catch (error) {
      console.error('Error al enviar correo de verificación:', error);
      throw error;
    }
  }

  /**
   * Cerrar sesión
   * @returns {Promise} - void
   */
  async logout() {
    try {
      await signOut(auth);
      return true;
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  }

  /**
   * Verificar si el usuario está autenticado
   * @returns {boolean}
   */
  isAuthenticated() {
    return auth.currentUser !== null;
  }

  /**
   * Obtener el usuario actual
   * @returns {Object|null}
   */
  getCurrentUser() {
    return auth.currentUser;
  }

  /**
   * Intenta recuperar una sesión de Firebase existente o reautenticar silenciosamente
   * sin interacción del usuario
   * @returns {Promise<Object|null>} - Usuario recuperado o null
   */
  async reautenticar() {
    try {
      // Si ya hay usuario, solo lo devolvemos
      if (auth.currentUser) {
        console.log("Ya existe un usuario autenticado en Firebase:", auth.currentUser.email);
        return auth.currentUser;
      }
      
      console.log("Intentando recuperar sesión de Firebase...");
      
      // Podríamos intentar restaurar la sesión desde localStorage si guardamos el email
      const userData = localStorage.getItem('userData');
      if (!userData) {
        console.log("No hay datos de usuario para intentar reautenticar");
        return null;
      }
      
      const userObj = JSON.parse(userData);
      const email = userObj.email;
      
      if (!email) {
        console.log("No hay email guardado para reautenticar");
        return null;
      }
      
      // Para una reautenticación completa necesitaríamos la contraseña
      // Pero no la guardamos por seguridad
      
      console.log("No se pudo recuperar la sesión automáticamente. Se requiere inicio de sesión manual.");
      return null;
    } catch (error) {
      console.error("Error al intentar reautenticar:", error);
      return null;
    }
  }
}

export default new FirebaseAuthService(); 