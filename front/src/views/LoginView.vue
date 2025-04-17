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
    await AuthService.login({
      identificador: identificador.value,
      password: password.value
    });
    
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
      
      // Manejar error específico de auth/missing-email
      if (err.code === 'auth/missing-email') {
        error.value = 'Por favor, introduce un email válido para iniciar sesión.';
      }
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
            `http://https://impulsedata.onrender.com/api/auth/forzar-verificacion?email=${encodeURIComponent(user.email)}`
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
        `http://https://impulsedata.onrender.com/api/auth/enviar-verificacion?email=${encodeURIComponent(identificador.value)}`
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