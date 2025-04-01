import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendEmailVerification,
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth, waitForAuthInit } from '../firebase';

class FirebaseAuthService {
  /**
   * Registrar un nuevo usuario con Firebase
   * @param {string} email - Correo electrónico
   * @param {string} password - Contraseña
   * @returns {Promise} - Datos del usuario
   */
  async register(email, password) {
    try {
      // Esperar a que Firebase Auth esté inicializado
      await waitForAuthInit();
      
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
      // Esperar a que Firebase Auth esté inicializado
      await waitForAuthInit();
      
      // Validar email antes de intentar login
      if (!email || typeof email !== 'string' || !email.includes('@')) {
        console.error('Error: El email es inválido o está vacío:', email);
        throw {
          code: 'auth/invalid-email',
          message: 'El correo electrónico es inválido o está vacío'
        };
      }
      
      // Validar contraseña antes de intentar login
      if (!password || typeof password !== 'string' || password.length < 6) {
        console.error('Error: La contraseña es inválida o está vacía');
        throw {
          code: 'auth/weak-password',
          message: 'La contraseña es inválida o está vacía'
        };
      }
      
      console.log('Intentando iniciar sesión en Firebase con email:', email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Verificar si el usuario tiene todos los datos necesarios
      const user = userCredential.user;
      console.log('Sesión iniciada en Firebase:', user.email, 'displayName:', user.displayName);
      
      // Forzar la actualización de datos locales
      try {
        // Almacenar datos básicos en localStorage para asegurar consistencia
        const userData = {
          email: user.email,
          displayName: user.displayName || user.email.split('@')[0],
          nombre: user.displayName || user.email.split('@')[0],
          uid: user.uid,
          emailVerified: user.emailVerified
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('userData', JSON.stringify(userData));
        
        // Almacenar el UID en sessionStorage para posibles recuperaciones
        sessionStorage.setItem('firebaseUid', user.uid);
        
        console.log('Datos de usuario almacenados localmente durante login');
      } catch (storageError) {
        console.error('Error al almacenar datos de usuario:', storageError);
        // No bloqueamos el flujo por este error
      }
      
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
    // Esperar a que Firebase Auth esté inicializado
    await waitForAuthInit();
    
    // Suprimir advertencias específicas de COOP en la consola
    const originalConsoleError = console.error;
    console.error = function(...args) {
      const errorText = args.join(' ');
      if (errorText.includes('Cross-Origin-Opener-Policy') || 
          errorText.includes('window.close')) {
        // No mostrar estas advertencias en la consola
        return;
      }
      originalConsoleError.apply(console, args);
    };
    
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
      // Restaurar console.error original
      console.error = originalConsoleError;
      
      console.error('Error al iniciar sesión con Google:', error);
      throw error;
    } finally {
      // Asegurarse de restaurar console.error incluso si hay excepciones
      console.error = originalConsoleError;
    }
  }

  /**
   * Enviar correo de verificación
   * @param {Object} user - Usuario de Firebase
   * @returns {Promise} - void
   */
  async sendVerificationEmail(user) {
    try {
      // Esperar a que Firebase Auth esté inicializado
      await waitForAuthInit();
      
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
      // Esperar a que Firebase Auth esté inicializado
      await waitForAuthInit();
      
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
  async isAuthenticated() {
    // Esperar a que Firebase Auth esté inicializado
    await waitForAuthInit();
    
    return auth.currentUser !== null;
  }

  /**
   * Obtener el usuario actual
   * @returns {Object|null}
   */
  async getCurrentUser() {
    // Esperar a que Firebase Auth esté inicializado
    await waitForAuthInit();
    
    return auth.currentUser;
  }

  /**
   * Intenta recuperar una sesión de Firebase existente o reautenticar silenciosamente
   * sin interacción del usuario
   * @returns {Promise<Object|null>} - Usuario recuperado o null
   */
  async reautenticar() {
    try {
      // Verificar si estamos en proceso de cierre de sesión
      const cerrando = sessionStorage.getItem('cerrando_sesion');
      if (cerrando === 'true') {
        console.log("No se intenta reautenticar durante el cierre de sesión");
        return null;
      }
      
      // Si ya hay usuario, solo lo devolvemos
      if (auth.currentUser) {
        console.log("Ya existe un usuario autenticado en Firebase:", auth.currentUser.email);
        return auth.currentUser;
      }
      
      // Verificar si ya hemos intentado reautenticar recientemente
      const ultimoIntento = sessionStorage.getItem('ultimoIntentoReautenticacion');
      const ahora = Date.now();
      // Si hemos intentado reautenticar en los últimos 5 minutos, no lo intentamos de nuevo
      if (ultimoIntento && (ahora - parseInt(ultimoIntento)) < 300000) { // 5 minutos
        console.log("Se ha intentado reautenticar recientemente, omitiendo intento");
        return null;
      }
      
      console.log("Intentando recuperar sesión de Firebase...");
      
      // Marcar este intento
      sessionStorage.setItem('ultimoIntentoReautenticacion', ahora.toString());
      
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
              // No mostrar el error completo en consola, solo un mensaje informativo
              console.log("No se pudo reautenticar usuario", email);
              
              // Registrar el intento fallido para no repetirlo constantemente
              sessionStorage.setItem('reautenticacionFallida', 'true');
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
      
      // Si ya intentamos y falló, no volvemos a intentar
      if (sessionStorage.getItem('reautenticacionFallida') === 'true') {
        console.log("La reautenticación ha fallado previamente, se mantiene sesión con JWT");
        return null;
      }
      
      // Para una reautenticación completa necesitaríamos la contraseña
      // Pero no la guardamos por seguridad
      
      console.log("No se pudo recuperar la sesión automáticamente. Se mantiene la sesión con JWT.");
      return null;
    } catch (error) {
      // No mostrar el error completo, solo un mensaje informativo
      console.log("Error controlado durante la reautenticación");
      
      // Marcar que ha habido un fallo para no volver a intentarlo
      sessionStorage.setItem('reautenticacionFallida', 'true');
      
      return null;
    }
  }

  /**
   * Actualiza el nombre de usuario en Firebase
   * @param {string} newDisplayName - Nuevo nombre de usuario
   * @returns {Promise<boolean>} - true si se actualizó correctamente
   */
  async updateDisplayName(newDisplayName) {
    try {
      // Esperar a que Firebase Auth esté inicializado
      await waitForAuthInit();
      
      const user = auth.currentUser;
      if (!user) {
        console.error('No hay usuario autenticado para actualizar nombre');
        throw new Error('No hay usuario autenticado');
      }
      
      // Actualizar el perfil en Firebase
      await user.updateProfile({
        displayName: newDisplayName
      });
      
      // Recargar usuario para obtener datos actualizados
      await user.reload();
      
      // Actualizar datos en localStorage para consistencia inmediata
      try {
        if (localStorage.getItem('user')) {
          const userObj = JSON.parse(localStorage.getItem('user'));
          userObj.displayName = newDisplayName;
          userObj.nombre = newDisplayName;
          localStorage.setItem('user', JSON.stringify(userObj));
        }
        
        if (localStorage.getItem('userData')) {
          const userData = JSON.parse(localStorage.getItem('userData'));
          userData.displayName = newDisplayName;
          userData.nombre = newDisplayName;
          localStorage.setItem('userData', JSON.stringify(userData));
        }
      } catch (storageError) {
        console.error('Error al actualizar datos locales:', storageError);
        // No bloqueamos el flujo por este error
      }
      
      // Disparar evento personalizado para notificar cambio
      const event = new CustomEvent('auth-state-changed', {
        detail: { type: 'displayName', newValue: newDisplayName }
      });
      window.dispatchEvent(event);
      
      console.log('Nombre de usuario actualizado correctamente en Firebase:', newDisplayName);
      return true;
    } catch (error) {
      console.error('Error al actualizar nombre de usuario:', error);
      throw error;
    }
  }
}

export default new FirebaseAuthService(); 