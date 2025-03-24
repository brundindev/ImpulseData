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
      <div v-else-if="error" class="alert alert-danger">
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
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            class="form-control"
            required
            placeholder="Introduce tu email"
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
        <div class="actions">
          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
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
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth'; // Importar el store de autenticación de Pinia
import AuthService from '../services/AuthService';
import axios from 'axios';
import FirebaseAuthService from '../services/FirebaseAuthService';
import { getAuth } from 'firebase/auth'; // Importar getAuth para obtener la instancia de auth

// Obtener la instancia de auth
const auth = getAuth();

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
const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);
const emailNoVerificado = computed(() => {
  return error.value && error.value.toLowerCase().includes('verifica') && email.value;
});
const credencialesIncorrectas = computed(() => {
  return error.value && error.value.toLowerCase().includes('credenciales incorrectas');
});

// Estado para controlar la visibilidad de la contraseña
const showPassword = ref(false);

const login = async () => {
  // Validar formulario
  if (!email.value || !password.value) {
    error.value = 'Por favor, completa todos los campos.';
    return;
  }
  
  loading.value = true;
  error.value = '';
  
  try {
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
    
    // Intentar inicio de sesión
    await AuthService.login({
      email: email.value,
      password: password.value
    });
    
    // Emitir un evento personalizado para notificar que el estado de autenticación ha cambiado
    window.dispatchEvent(new CustomEvent('auth-state-changed'));
    
    // Redirigir a la página de inicio
    router.push('/');
  } catch (err) {
    // No registrar errores 401 en la consola
    // Este bloque maneja silenciosamente los errores
    
    // Manejar diferentes tipos de errores
    if (err.response) {
      // El servidor respondió con un estado diferente de 2xx
      if (err.response.status === 401) {
        error.value = 'Credenciales incorrectas. Por favor, verifica tu email y contraseña.';
      } else if (err.response.data && err.response.data.message) {
        error.value = err.response.data.message;
      } else {
        error.value = 'Error al iniciar sesión. Por favor, inténtalo de nuevo.';
      }
    } else if (err.request) {
      // La solicitud se realizó pero no se recibió respuesta
      error.value = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
    } else if (err.message) {
      // Si es un error con mensaje personalizado (como los de Firebase)
      error.value = err.message;
    } else {
      // Ocurrió un error al configurar la solicitud
      error.value = 'Error al procesar la solicitud. Por favor, inténtalo de nuevo.';
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
            `http://localhost:8080/api/auth/forzar-verificacion?email=${encodeURIComponent(user.email)}`
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
        console.warn("No se pudo forzar la verificación:", verificationError);
        // No bloqueamos el flujo si esto falla
      }
    } else {
      console.log("Usuario Google ya está verificado:", user.emailVerified);
    }
    
    // Datos para inicio de sesión
    const loginData = {
      email: user.email,
      password: `google-auth-${user.uid}` // Contraseña que nunca será usada directamente
    };
    
    try {
      console.log("Intentando iniciar sesión con cuenta de Google...");
      
      // Almacenar el uid antes de cualquier operación de login
      sessionStorage.setItem('firebaseUid', user.uid);
      
      // Intentar iniciar sesión directamente
      await AuthService.login(loginData);
      
      console.log("Login con Google exitoso");
      
      // Emitir el cambio de estado de autenticación usando Pinia
      authStore.setAuth(true);
      
      // Verificar explícitamente que ambos sistemas estén sincronizados
      const currentUser = auth.currentUser;
      const jwtToken = localStorage.getItem('authToken');
      
      if (!currentUser && jwtToken) {
        console.log("Detectado JWT sin usuario Firebase. Restableciendo estado...");
        // Restaurar la sesión en Firebase 
        try {
          // No cerrar la sesión, solo recargar la página para forzar la sincronización
          window.location.reload();
          return;
        } catch (reAuthError) {
          console.error("No se pudo restablecer la sesión de Firebase:", reAuthError);
        }
      }
      
      // Redirigir a la página principal
      router.push('/');
    } catch (loginError) {
      console.log("Error en login con Google, verificando si necesitamos registrar al usuario...", loginError);
      
      // Si el login falla, es posible que el usuario no exista en el backend
      // Intentamos registrarlo primero
      try {
        const registerData = {
          ...loginData,
          nombre: user.displayName || user.email.split('@')[0]
        };
        
        console.log("Intentando registrar al usuario de Google...");
        
        // Intentar forzar verificación primero
        try {
          console.log("Intentando forzar verificación del email primero...");
          const verificationResponse = await axios.get(
            `http://localhost:8080/api/auth/forzar-verificacion?email=${encodeURIComponent(user.email)}`
          );
          console.log("Respuesta de forzar verificación:", verificationResponse.data);
        } catch (verificationError) {
          console.log("Error al forzar verificación (podría ser que el usuario no exista):", verificationError);
        }
        
        // Comprobar si el usuario ya está autenticado después de la verificación
        try {
          // Intentar iniciar sesión nuevamente antes de registrar
          await AuthService.login(loginData);
                    
          // Emitir el cambio de estado de autenticación usando Pinia
          authStore.setAuth(true);
          
          // Redirigir a la página principal
          router.push('/');
          return;
        } catch (retryLoginError) {
          console.log("No se pudo iniciar sesión, procediendo con el registro...");
        }
        
        // Continuar con el registro solo si el login sigue fallando
        console.log("Procediendo con el registro normal...");
        await AuthService.register(registerData);
        
        console.log("Registro exitoso, esperando sincronización...");
        
        // Pequeña pausa para asegurar que la sincronización se complete
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        try {
          // Después del registro, intentamos iniciar sesión nuevamente
          console.log("Intentando iniciar sesión después del registro...");
          await AuthService.login(loginData);
          
          console.log("Login post-registro exitoso");
          
          // Emitir el cambio de estado de autenticación usando Pinia
          authStore.setAuth(true);
          
          // Redirigir a la página principal
          router.push('/');
        } catch (postRegisterLoginError) {
          console.error("Error en login post-registro:", postRegisterLoginError);
          
          // Intento alternativo: si falla el login después del registro,
          // intentar forzar login guardando el token manualmente
          try {
            console.log("Intentando login alternativo...");
            // Obtener token usando Firebase directamente
            const idToken = await user.getIdToken();
            localStorage.setItem('authToken', idToken);
            
            // También guardaremos información básica del usuario
            localStorage.setItem('userData', JSON.stringify({
              nombre: user.displayName || user.email.split('@')[0],
              email: user.email
            }));
            
            console.log("Login alternativo exitoso");
            
            // Emitir el cambio de estado de autenticación usando Pinia
            authStore.setAuth(true);
            // Redirigir a la página principal
            router.push('/');
          } catch (tokenError) {
            console.error("Error en login alternativo:", tokenError);
            error.value = 'Error al iniciar sesión después del registro. Por favor, inténtalo de nuevo más tarde.';
          }
        }
      } catch (registerError) {
        console.error("Error al registrar usuario de Google:", registerError);
        
        // Analizar el mensaje de error
        if (registerError.response && registerError.response.data) {
          const errorMsg = typeof registerError.response.data === 'string' 
            ? registerError.response.data 
            : JSON.stringify(registerError.response.data);
          
          if (errorMsg.includes("ya está registrado")) {
            // Si el usuario ya está registrado pero no pudimos iniciar sesión,
            // posiblemente hay un problema con la contraseña o con la verificación
            console.log("El usuario ya está registrado, pero hubo problemas al iniciar sesión");
            error.value = 'No pudimos iniciar sesión con tu cuenta de Google. Por favor, intenta restablecer tu contraseña.';
          } else {
            error.value = 'No se pudo completar el inicio de sesión con Google: ' + errorMsg;
          }
        } else {
          error.value = 'No se pudo completar el inicio de sesión con Google.';
        }
      }
    } 
  } catch (err) {
    console.error('Error al iniciar sesión con Google:', err);
    
    // Manejar errores específicos de Firebase Auth
    if (err.code === 'auth/popup-closed-by-user') {
      error.value = 'El proceso de inicio de sesión fue cancelado.';
    } else if (err.code === 'auth/cancelled-popup-request') {
      // Este es un error común cuando se hace clic varias veces, no mostramos error
      error.value = '';
    } else {
      error.value = 'Error al iniciar sesión con Google. Por favor, inténtalo de nuevo.';
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
      const user = await FirebaseAuthService.login(email.value, password.value);
      
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
        `http://localhost:8080/api/auth/enviar-verificacion?email=${encodeURIComponent(email.value)}`
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
</script>

<style src="../assets/Login.css"></style>