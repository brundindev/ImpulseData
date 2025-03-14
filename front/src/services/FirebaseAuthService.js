import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendEmailVerification,
  signOut,
  GoogleAuthProvider,
  signInWithPopup
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
   * Iniciar sesión con Google
   * @returns {Promise} - Datos del usuario
   */
  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      // Solicitar acceso al perfil de Google para tener más datos
      provider.addScope('profile');
      provider.addScope('email');
      
      // Configurar para seleccionar la cuenta (no usar la última seleccionada automáticamente)
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      
      
      // Forzar el estado de verificación para usuarios de Google
      // ya que los emails de Google ya están verificados
      if (!user.emailVerified) {
        console.log("Usuario de Google no está marcado como verificado, forzando actualización...");
        
        try {
          // Forzar actualización del perfil para incluir que está verificado
          await user.updateProfile({
            displayName: user.displayName || user.email.split('@')[0]
          });
          
          // Actualizar metadatos - no se puede hacer directamente, sólo a través del backend
          try {
            // Intentar marcar como verificado a través del backend
            const verificationResponse = await fetch(
              `http://localhost:8080/api/auth/forzar-verificacion?email=${encodeURIComponent(user.email)}`,
              { method: 'GET' }
            );
            
            if (verificationResponse.ok) {
              console.log("Verificación forzada exitosamente a través del backend");
            } else {
              console.warn("Error al forzar verificación a través del backend:", await verificationResponse.text());
            }
          } catch (backendError) {
            console.warn("Error al comunicarse con el backend para verificación:", backendError);
          }
          
          // Forzar renovación del token
          await user.getIdToken(true);
          
          // Recargar el usuario para obtener el estado actualizado
          await user.reload();
          
          console.log("Usuario recargado, estado actualizado:", {
            emailVerified: user.emailVerified,
            displayName: user.displayName
          });
        } catch (error) {
          console.warn("Error al actualizar usuario de Google:", error);
          // No bloqueamos el flujo
        }
      }
      
      return user;
    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error);
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
      
      // Primero intentamos restaurar la sesión mediante el uid almacenado
      const storedUid = sessionStorage.getItem('firebaseUid');
      if (storedUid) {
        console.log("Encontrado UID guardado en sesión:", storedUid);
        
        // Podríamos intentar usar signInWithCredential si tuviéramos un token de ID
        // Pero como no lo tenemos, intentamos con el email/password de Google
        
        // Obtener el email desde userData
        const userData = localStorage.getItem('userData');
        if (userData) {
          const userObj = JSON.parse(userData);
          const email = userObj.email;
          
          if (email) {
            console.log("Intentando reautenticar con email:", email);
            try {
              // Intentar iniciar sesión con la contraseña basada en UID
              const password = `google-auth-${storedUid}`;
              const userCredential = await this.login(email, password);
              console.log("Reautenticación exitosa:", userCredential.email);
              return userCredential;
            } catch (loginError) {
              console.warn("No se pudo reautenticar con credenciales:", loginError);
            }
          }
        }
      }
      
      // Si no pudimos recuperar con uid, intentamos el método tradicional
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