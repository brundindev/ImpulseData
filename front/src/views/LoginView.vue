<template>
  <div class="login-container">
    <div class="login-card">
      <h1>Iniciar Sesión</h1>
      
      <!-- Mensaje de error personalizado con ícono X -->
      <div v-if="credencialesIncorrectas" class="alert alert-danger error-box">
        <div class="error-icon">✖</div>
        <div class="error-content">
          <div class="error-title">Error de autenticación</div>
          <p>{{ error }}</p>
        </div>
      </div>
      
      <!-- Mensaje de error estándar -->
      <div v-else-if="error" class="alert-danger">
        <p>{{ error }}</p>
        <div v-if="emailNoVerificado" class="email-verification">
          <p>Por favor, verifica tu dirección de correo electrónico antes de iniciar sesión.</p>
          <div class="verification-section">
            <p class="small-text">¿No has recibido el correo de verificación?</p>
            <button @click="reenviarVerificacion" class="btn btn-secondary" :disabled="loading">
              {{ loading ? 'Enviando...' : 'Reenviar correo de verificación' }}
            </button>
          </div>
        </div>
      </div>
      
      <!-- Formulario de login normal -->
      <div v-if="!resetPasswordMode">
        <form @submit.prevent="login">
          <div class="form-group">
            <label for="identificador">Email o nombre de usuario</label>
            <input
              type="text"
              id="identificador"
              v-model="identificador"
              class="form-control"
              required
              placeholder="Introduce tu email o nombre de usuario"
              style="color: #333 !important;"
            />
          </div>
          <div class="form-group">
            <label for="password">Contraseña</label>
            <div class="password-field-container">
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="password"
                class="form-control"
                required
                placeholder="Introduce tu contraseña"
                style="color: #333 !important;"
              />
              <button 
                type="button"
                class="password-toggle-btn"
                @click="showPassword = !showPassword"
                tabindex="-1"
              >
                <i v-if="showPassword">👁️</i>
                <i v-else>👁️‍🗨️</i>
              </button>
            </div>
          </div>
          <div class="form-group">
            <a href="#" @click.prevent="showResetPasswordForm" class="forgot-password">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
          <div class="actions">
            <button type="submit" class="btn btn-primary" :class="{ 'loading': loading }" :disabled="loading">
              <div class="btn-content">
                <span v-if="loading" class="btn-spinner"></span>
                <span>{{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}</span>
              </div>
            </button>
          </div>
          
          <!-- Separador -->
          <div class="separator">
            <span>o</span>
          </div>
          
          <!-- Botón de Google -->
          <div class="social-login">
            <button type="button" class="btn-google" @click="loginWithGoogle" :disabled="loading">
              <img src="@/assets/img/google_logo.png" alt="Google Logo" class="google-icon">
              Iniciar sesión con Google
            </button>
          </div>
          
          <div class="register-link">
            ¿No tienes cuenta? <router-link to="/registro">Regístrate</router-link>
          </div>
        </form>
      </div>
      
      <!-- Formulario de recuperación de contraseña -->
      <div v-else class="reset-password-form">
        <h2>Recuperar Contraseña</h2>
        
        <div v-if="resetPasswordSuccess" class="success-message">
          <p>Hemos enviado un correo electrónico con instrucciones para restablecer tu contraseña.</p>
          <button @click="cancelResetPassword" class="btn-outline">Volver al login</button>
        </div>
        
        <form v-else @submit.prevent="sendResetPasswordEmail">
          <p class="reset-instructions">
            Introduce tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
          </p>
          
          <div class="form-group">
            <label for="reset-email">Correo electrónico</label>
            <input 
              type="email" 
              id="reset-email" 
              v-model="resetPasswordEmail" 
              placeholder="tu@correo.com"
              required
            >
          </div>
          
          <div v-if="resetPasswordError" class="error-message">
            {{ resetPasswordError }}
          </div>
          
          <div class="form-actions">
            <button 
              type="button" 
              @click="cancelResetPassword" 
              class="btn-outline"
              :disabled="loading"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              class="btn-primary" 
              :disabled="loading"
            >
              <span v-if="loading" class="spinner"></span>
              <span v-else>Enviar correo</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth'; // Importar el store de autenticación de Pinia
import AuthService from '../services/AuthService';
import axios from 'axios';
import FirebaseAuthService from '../services/FirebaseAuthService';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'; // Importar getAuth y sendPasswordResetEmail
import { auth } from '../firebase';

// Añadir clase al body cuando se monta el componente
onMounted(() => {
  document.body.classList.add('login-page');
});

// Remover la clase cuando se desmonta el componente
onUnmounted(() => {
  document.body.classList.remove('login-page');
});

// Configurar un manejador global para suprimir errores de red en consola
// Solo para este componente
const originalConsoleError = console.error;
console.error = function(...args) {
  // Suprimir errores específicos relacionados con login
  const errorText = args.join(' ');
  if (errorText.includes('401') || 
      errorText.includes('login') || 
      errorText.includes('Unauthorized') ||
      errorText.includes('axios')) {
    // No mostrar estos errores en consola
    return;
  }
  // Pasar el resto de los errores al console.error original
  originalConsoleError.apply(console, args);
};

// Restablecer console.error al desmontar el componente
onUnmounted(() => {
  console.error = originalConsoleError;
});

const router = useRouter();
const authStore = useAuthStore(); // Usar el store de Pinia
const identificador = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);
const emailNoVerificado = computed(() => {
  return error.value && error.value.toLowerCase().includes('verifica') && identificador.value;
});
const credencialesIncorrectas = computed(() => {
  return error.value && error.value.toLowerCase().includes('credenciales incorrectas');
});

// Estado para controlar la visibilidad de la contraseña
const showPassword = ref(false);
const resetPasswordEmail = ref('');
const resetPasswordMode = ref(false);
const resetPasswordSuccess = ref(false);
const resetPasswordError = ref('');

const login = async () => {
  // Validar formulario
  if (!identificador.value || !password.value) {
    error.value = 'Por favor, completa todos los campos.';
    return;
  }
  
  loading.value = true;
  error.value = '';
  
  try {
    // Limpiar datos de sesión anterior para evitar conflictos
    sessionStorage.removeItem('reautenticacionFallida');
    sessionStorage.removeItem('attemptedRecovery');
    sessionStorage.removeItem('lastReload');
    
    // Capturar errores de red y suprimirlos
    window.addEventListener('unhandledrejection', function suppressLoginErrors(event) {
      if (event.reason && 
          (event.reason.toString().includes('401') || 
           event.reason.toString().includes('login') ||
           event.reason.toString().includes('Unauthorized'))) {
        event.preventDefault();
        window.removeEventListener('unhandledrejection', suppressLoginErrors);
      }
    });
    
    // Verificar si el identificador es un email o nombre de usuario
    const isEmail = identificador.value.includes('@');
    
    try {
      // Primero autenticar en Firebase (solo si es email)
      if (isEmail) {
        console.log('Intentando iniciar sesión en Firebase primero con email:', identificador.value);
        await FirebaseAuthService.login(identificador.value, password.value);
        
        // Añadir un pequeño retraso para permitir que Firebase complete su proceso
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    } catch (firebaseError) {
      console.warn('Error al iniciar sesión en Firebase:', firebaseError);
      // No interrumpimos el flujo si Firebase falla
    }
    
    // Intentar inicio de sesión en el backend
    try {
      console.log(`Iniciando sesión con ${isEmail ? 'email' : 'nombre de usuario'}: ${identificador.value}`);
      const loginData = {
      identificador: identificador.value,
        nombreUsuario: isEmail ? undefined : identificador.value,
        email: isEmail ? identificador.value : undefined,
      password: password.value
      };
      console.log('Datos de login:', loginData);
      
      await AuthService.login(loginData);
      
      // Login exitoso
      console.log('Login exitoso');
    } catch (loginError) {
      console.error('Error específico de login:', loginError);
      throw loginError; // Propagar el error para manejarlo en el catch general
    }
    
    // Emitir un evento personalizado para notificar que el estado de autenticación ha cambiado
    window.dispatchEvent(new CustomEvent('auth-state-changed'));
    
    // Añadir una pequeña pausa para asegurar que el evento se procese
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Mostrar pantalla de carga antes de redirigir
    const event = new CustomEvent('show-global-loader');
    window.dispatchEvent(event);
    
    // Pequeña pausa para asegurar que el loader se muestre
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Redirigir a la página de inicio
    router.push('/home');
  } catch (err) {
    // No registrar errores 401 en la consola
    // Este bloque maneja silenciosamente los errores
    
    // Manejar diferentes tipos de errores
    if (err.response) {
      // El servidor respondió con un estado diferente de 2xx
      if (err.response.status === 401) {
        error.value = 'Credenciales incorrectas. Por favor, verifica tu email y contraseña.';
      } else if (err.response.status === 403) {
        error.value = 'Error de acceso al servidor. El servicio podría estar temporalmente no disponible.';
      } else if (err.response.data && err.response.data.message) {
        error.value = err.response.data.message;
      } else {
        error.value = 'Error al iniciar sesión. Por favor, inténtalo de nuevo.';
      }
    } else if (err.request) {
      // La solicitud se realizó pero no se recibió respuesta
      error.value = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
    } else if (err.message) {
      // Si es un error con mensaje personalizado (como los de Firebase o AuthService)
      if (err.message.includes('CORS') || err.message.includes('conexión con el servidor')) {
        error.value = 'El servidor no está respondiendo correctamente. Por favor, inténtalo más tarde o contacta con soporte técnico.';
      } else if (err.message.includes('Credenciales incorrectas')) {
        error.value = err.message;
      } else if (err.message.includes('token')) {
        error.value = 'Error de autenticación. Por favor, inténtalo más tarde.';
      } else if (err.code === 'auth/missing-email') {
        error.value = 'Por favor, introduce un email válido para iniciar sesión.';
      } else {
        error.value = err.message;
      }
    } else {
      // Ocurrió un error al configurar la solicitud
      error.value = 'Error al procesar la solicitud. Por favor, inténtalo de nuevo.';
    }
    
    // Disparar evento para ocultar loader global si estuviera visible
    const event = new CustomEvent('hide-global-loader');
    window.dispatchEvent(event);
    
    // Añadir una sugerencia si parece un problema técnico
    if (error.value.includes('servidor') || error.value.includes('conexión') || error.value.includes('temporalmente')) {
      console.log('Posible problema técnico detectado. Proporcionando sugerencias al usuario.');
      // Mostrar en consola información para desarrolladores
      console.info('Información para desarrolladores: Posible problema CORS o de configuración del servidor.');
    }
    
    // Garantizar que loading sea false para todos los errores
    loading.value = false;
  } finally {
    if (loading.value) { // Solo desactivar loading si no se ha hecho en el catch
      loading.value = false;
    }
  }
};

// Función para iniciar sesión con Google
const loginWithGoogle = async () => {
  try {
    loading.value = true;
    error.value = '';
    
    // Iniciar sesión con Google usando Firebase
    const user = await FirebaseAuthService.loginWithGoogle();
    
    // Todos los usuarios de Google deberían ser automáticamente verificados
    if (!user.emailVerified) {
      try {
        console.log("Usuario Google no está marcado como verificado, actualizando estado...");
        
        // Primero intentar actualizar localmente
        try {
          await user.updateProfile({
            // No cambiamos nada, solo para forzar una actualización
            displayName: user.displayName
          });
          await user.reload();
          console.log("Usuario recargado, estado de verificación:", user.emailVerified);
        } catch (updateError) {
          console.warn("No se pudo actualizar/recargar usuario:", updateError);
        }
        
        // Si sigue sin estar verificado, forzar en el backend
        if (!user.emailVerified) {
          // Forzar marcado como verificado en el backend
          const verificationResponse = await axios.get(
            `https://impulsedata.onrender.com/api/auth/forzar-verificacion?email=${encodeURIComponent(user.email)}`
          );
          console.log("Verificación de email forzada exitosamente:", verificationResponse.data);
          
          // Intentar marcar al usuario como verificado también en Firebase
          try {
            await user.getIdToken(true); // Forzar renovación del token
            await user.reload(); // Recargar datos del usuario
            console.log("Usuario recargado después de forzar verificación. Estado actual:", user.emailVerified);
          } catch (reloadError) {
            console.warn("No se pudo recargar el usuario:", reloadError);
          }
        }
      } catch (verificationError) {
        console.warn("No se pudo forzar la verificación del usuario:", verificationError);
      }
    }
    
    console.log("Login con Google exitoso");
    
    // Continuar con el flujo normal: hacer login en el backend
    const isNewUser = user.metadata?.creationTime === user.metadata?.lastSignInTime;
    
    try {
      // Preparar datos para el login
      const googleData = {
        email: user.email,
        password: `google-auth-${user.uid}`,
        nombreUsuario: user.displayName || user.email.split('@')[0],
        apellidos: '',
        googleAuth: true
      };
      
      console.log("Intentando login en el backend con credenciales de Google");
      
      try {
        // Intentar hacer login con el backend
        const loginResponse = await AuthService.login(googleData);
        
        // Guardar el UID para futuras sesiones
        sessionStorage.setItem('firebaseUid', user.uid);
        // Limpiar flags de intentos de reautenticación
        sessionStorage.removeItem('reautenticacionFallida');
        sessionStorage.removeItem('attemptedRecovery');
        
        console.log("Login con backend exitoso:", loginResponse);
        
        // Emitir evento de cambio de autenticación
        window.dispatchEvent(new CustomEvent('auth-state-changed'));

        // Ahora que la autenticación fue exitosa, mostrar la pantalla de carga
        // antes de redirigir a la página de inicio
        const event = new CustomEvent('show-global-loader');
        window.dispatchEvent(event);
        
        // Pequeña pausa para asegurar que el loader se muestre
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Redirigir a home con un parámetro especial
        router.push({ path: '/home', query: { googleauth: 'true' } });
        
      } catch (loginError) {
        console.log("Error en login con Google, verificando si necesitamos registrar al usuario...", loginError);
        
        // Si el usuario no existe en el backend, registrarlo
        if (loginError.response && loginError.response.status === 401) {
          try {
            console.log("Intentando registrar usuario de Google en el backend");
            
            // Añadir datos adicionales para el registro
            const registerData = {
              ...googleData,
              confirmPassword: googleData.password,
              tipoEmpresa: 'Particular', // Valor por defecto
              googleAuth: true
            };
            
            // Registrar en el backend
            await AuthService.register(registerData);
            console.log("Registro exitoso, intentando login con las credenciales registradas");
            
            // Ahora intentar hacer login con las credenciales recién registradas
            await AuthService.login(googleData);
            
            // Guardar el UID para futuras sesiones
            sessionStorage.setItem('firebaseUid', user.uid);
            
            // Emitir evento de cambio de autenticación
            window.dispatchEvent(new CustomEvent('auth-state-changed'));

            // Ahora que el registro y login fueron exitosos, mostrar la pantalla de carga
            // antes de redirigir a la página de inicio
            const event = new CustomEvent('show-global-loader');
            window.dispatchEvent(event);
            
            // Pequeña pausa para asegurar que el loader se muestre
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Redirigir a home con un parámetro especial
            router.push({ path: '/home', query: { googleauth: 'true' } });
            
          } catch (registerError) {
            console.error("Error al registrar usuario de Google:", registerError);
            error.value = "No se pudo crear una cuenta con Google. Inténtalo de nuevo o usa otro método.";
          }
        } else {
          console.error("Error inesperado al iniciar sesión con Google:", loginError);
          error.value = "Error al iniciar sesión con Google. Por favor, inténtalo de nuevo.";
        }
      }
    } catch (backendError) {
      console.error("Error al comunicarse con el backend:", backendError);
      error.value = "Error de comunicación con el servidor. Por favor, inténtalo más tarde.";
    }
  } catch (googleError) {
    console.error("Error en la autenticación con Google:", googleError);
    
    // Manejar el error de cancelación de popup de manera especial
    if (googleError.code === 'auth/popup-closed-by-user') {
      error.value = "Inicio de sesión con Google cancelado.";
    } else if (googleError.code === 'auth/network-request-failed') {
      error.value = "Error de red. Verifica tu conexión a internet.";
    } else {
      error.value = "Error al iniciar sesión con Google. " + (googleError.message || "");
    }
  } finally {
    loading.value = false;
  }
};

const reenviarVerificacion = async () => {
  try {
    loading.value = true;
    
    // Primero intentamos con Firebase
    try {
      // Iniciar sesión con Firebase para obtener el usuario
      const user = await FirebaseAuthService.login(identificador.value, password.value);
      
      // Enviar email de verificación
      await FirebaseAuthService.sendVerificationEmail(user);
      
      error.value = 'Se ha enviado un nuevo correo de verificación a tu dirección de email.';
    } catch (firebaseError) {
      // Solo mostrar errores en consola en entorno de desarrollo
      if (process.env.NODE_ENV === 'development') {
        console.error('[DEV-ONLY] Error con Firebase:', firebaseError);
      }
      
      // Si falla Firebase, llamamos al backend
      const response = await axios.get(
        `https://impulsedata.onrender.com/api/auth/enviar-verificacion?email=${encodeURIComponent(identificador.value)}`
      );
      
      error.value = 'Se ha enviado un nuevo correo de verificación a tu dirección de email.';
    }
  } catch (err) {
    // Solo mostrar errores en consola en entorno de desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.error('[DEV-ONLY] Error al reenviar verificación:', err);
    } else {
      // En producción, no mostramos el error en consola
      console.log('Error de verificación manejado correctamente');
    }
    
    if (err.code) {
      // Errores específicos de Firebase
      switch (err.code) {
        case 'auth/user-not-found':
          error.value = 'No se encontró ningún usuario con este correo electrónico.';
          break;
        case 'auth/wrong-password':
          error.value = 'La contraseña es incorrecta.';
          break;
        case 'auth/too-many-requests':
          error.value = 'Se han realizado demasiados intentos. Por favor, espera unos minutos antes de intentarlo nuevamente.';
          break;
        default:
          error.value = 'No se pudo reenviar el correo de verificación.';
      }
    } else {
      error.value = err.response?.data || 'No se pudo reenviar el correo de verificación.';
    }
  } finally {
    loading.value = false;
  }
};

// Función para mostrar el formulario de recuperación de contraseña
const showResetPasswordForm = () => {
  resetPasswordMode.value = true;
  resetPasswordEmail.value = identificador.value; // Pre-rellenar con el email si existe
  error.value = '';
};

// Función para cancelar y volver al login
const cancelResetPassword = () => {
  resetPasswordMode.value = false;
  resetPasswordSuccess.value = false;
  resetPasswordError.value = '';
};

// Función para enviar correo de recuperación de contraseña
const sendResetPasswordEmail = async () => {
  if (!resetPasswordEmail.value) {
    resetPasswordError.value = 'Por favor, introduce tu correo electrónico';
    return;
  }
  
  loading.value = true;
  resetPasswordError.value = '';
  
  try {
    // Usar el método estático de FirebaseAuthService
    const auth = getAuth();
    await sendPasswordResetEmail(auth, resetPasswordEmail.value);
    resetPasswordSuccess.value = true;
  } catch (error) {
    console.error('Error al enviar correo de recuperación:', error);
    if (error.code === 'auth/user-not-found') {
      resetPasswordError.value = 'No existe ninguna cuenta con este correo electrónico.';
    } else if (error.code === 'auth/too-many-requests') {
      resetPasswordError.value = 'Demasiados intentos. Por favor, espera unos minutos antes de intentarlo de nuevo.';
    } else {
      resetPasswordError.value = 'No se pudo enviar el correo de recuperación. Por favor, inténtalo de nuevo más tarde.';
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style src="../assets/Login.css"></style>

<style scoped>
/* Asegurarse de que el fondo sea blanco */
:deep(.login-container) {
  background-color: #ffffff !important;
}

:deep(body),
:deep(html),
:deep(#app) {
  background: #ffffff !important;
}

.reset-password-form {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

.reset-password-form h2 {
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.reset-instructions {
  color: #666;
  margin-bottom: 20px;
  text-align: center;
}

.reset-password-form .form-group {
  margin-bottom: 20px;
}

.reset-password-form label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
}

.reset-password-form input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  color: #333 !important;
  background-color: #fff;
}

.reset-password-form input::placeholder {
  color: #999 !important;
}

.reset-password-form input:focus {
  border-color: #4a90e2;
  outline: none;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 24px;
}

.btn-outline {
  padding: 12px 24px;
  border: 2px solid #4a90e2;
  border-radius: 4px;
  background-color: transparent;
  color: #4a90e2;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-outline:hover {
  background-color: #4a90e2;
  color: #fff;
}

.btn-outline:disabled {
  border-color: #ccc;
  color: #ccc;
  cursor: not-allowed;
}

.btn-primary {
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  background-color: #4a90e2;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-primary:hover {
  background-color: #357abd;
}

.btn-primary:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #fff;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.success-message {
  text-align: center;
  color: #28a745;
  margin-bottom: 20px;
}

.error-message {
  color: #dc3545;
  margin-bottom: 20px;
  text-align: center;
}
</style>