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
}

export default new FirebaseAuthService(); 