<template>
  <div class="register-container">
    <div class="register-card">
      <h1>Regístrate</h1>
      <div v-if="error" class="alert alert-danger">{{ error }}</div>
      <div v-if="registroExitoso" class="alert alert-success">
        <div class="success-icon">
          <i class="checkmark">✓</i>
        </div>
        <h2>¡Registro exitoso!</h2>
        <p>Hemos enviado un correo de verificación a tu dirección de email.</p>
        <p><strong>{{ emailRegistrado }}</strong></p>
        <p>Por favor, verifica tu email antes de iniciar sesión.</p>
        <div v-if="!verificacionEnviada" class="verification-section">
          <p class="small-text">¿No has recibido el correo de verificación?</p>
          <button @click="enviarVerificacion" class="btn btn-secondary" :disabled="enviandoVerificacion">
            {{ enviandoVerificacion ? 'Enviando...' : 'Enviar de nuevo' }}
          </button>
        </div>
        <div v-if="verificacionEnviada" class="verification-message">
          <p>{{ verificacionMensaje }}</p>
        </div>
        <div class="actions mt-3">
          <router-link to="/login" class="btn btn-primary">Ir al login</router-link>
        </div>
      </div>
      <form v-if="!registroExitoso" @submit.prevent="register">
        <div class="form-group">
          <label for="nombre">Nombre</label>
          <input
            type="text"
            id="nombre"
            v-model="nombre"
            class="form-control"
            required
            placeholder="Tu nombre"
            :disabled="loading"
          />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            class="form-control"
            required
            placeholder="Tu email"
            :disabled="loading"
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
              placeholder="Contraseña (mínimo 6 caracteres)"
              minlength="6"
              :disabled="loading"
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
          <label for="confirmPassword">Confirmar Contraseña</label>
          <div class="password-field-container">
            <input
              :type="showConfirmPassword ? 'text' : 'password'"
              id="confirmPassword"
              v-model="confirmPassword"
              class="form-control"
              required
              placeholder="Repite tu contraseña"
              minlength="6"
              :disabled="loading"
            />
            <button 
              type="button"
              class="password-toggle-btn"
              @click="showConfirmPassword = !showConfirmPassword"
              tabindex="-1"
            >
              <i v-if="showConfirmPassword">👁️</i>
              <i v-else>👁️‍🗨️</i>
            </button>
          </div>
        </div>
        <div v-if="loading" class="loading-state">
          <div v-if="guardandoEnFirebase" class="loading-message">
            <div class="spinner-small"></div>
            <span>Registrando en Firebase...</span>
          </div>
          <div v-else-if="guardandoEnBackend" class="loading-message">
            <div class="spinner-small"></div>
            <span>Guardando tus datos...</span>
          </div>
          <div v-else class="loading-message">
            <div class="spinner-small"></div>
            <span>Procesando...</span>
          </div>
        </div>
        <div class="actions">
          <button type="submit" class="btn btn-primary" :disabled="loading || !passwordsMatch">
            {{ loading ? 'Registrando...' : 'Crear Cuenta' }}
          </button>
        </div>
        
        <!-- Separador -->
        <div class="separator">
          <span>o</span>
        </div>
        
        <!-- Botón de Google -->
        <div class="social-login">
          <button type="button" class="btn-google" @click="registerWithGoogle" :disabled="loading">
            <img src="@/assets/img/google_logo.png" alt="Google Logo" class="google-icon">
            Regístrate con Google
          </button>
        </div>
        
        <div class="login-link">
          ¿Ya tienes cuenta? <router-link to="/login">Inicia sesión</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import AuthService from '../services/AuthService';
import axios from 'axios';
import FirebaseAuthService from '../services/FirebaseAuthService';
import { getAuth } from 'firebase/auth';

const router = useRouter();
const authStore = useAuthStore();
const nombre = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const error = ref('');
const loading = ref(false);
const registroExitoso = ref(false);
const enviandoVerificacion = ref(false);
const verificacionEnviada = ref(false);
const verificacionMensaje = ref('');
const emailRegistrado = ref('');
const guardandoEnBackend = ref(false);
const guardandoEnFirebase = ref(false);

// Estados para controlar la visibilidad de las contraseñas
const showPassword = ref(false);
const showConfirmPassword = ref(false);

// Obtener la instancia de auth
const auth = getAuth();

const passwordsMatch = computed(() => {
  return password.value === confirmPassword.value || confirmPassword.value === '';
});

const register = async () => {
  if (!passwordsMatch.value) {
    error.value = 'Las contraseñas no coinciden';
    return;
  }
  
  try {
    loading.value = true;
    error.value = '';
    
    // 1. Crear usuario en Firebase
    try {
      guardandoEnFirebase.value = true;
      // Primero intentamos registrar al usuario con Firebase
      await FirebaseAuthService.register(email.value, password.value);
      guardandoEnFirebase.value = false;
      
      // 2. Crear usuario en el backend
      guardandoEnBackend.value = true;
      try {
      await AuthService.register({
        nombre: nombre.value,
        email: email.value,
        password: password.value
      });
        
      guardandoEnBackend.value = false;
      
      // Guardar el email para posible reenvío de verificación
      emailRegistrado.value = email.value;
      
      // Mostrar mensaje de éxito y pedir verificación
      registroExitoso.value = true;
      } catch (backendError) {
        guardandoEnBackend.value = false;
        console.error("Error en registro de backend:", backendError);
        throw backendError; // Relanzar para que sea capturado por el catch externo
      }
    } catch (firebaseError) {
      console.error('Error al registrar con Firebase:', firebaseError);
      guardandoEnFirebase.value = false;
      
      // Si el email ya existe, mostramos un error específico
      if (firebaseError.code === 'auth/email-already-in-use') {
        error.value = 'Este correo electrónico ya está registrado. Si es tuyo, intenta iniciar sesión.';
        loading.value = false;
        return;
      }
      
      // Si es otro error de Firebase pero no es de email existente, intentamos con el backend
      guardandoEnBackend.value = true;
      try {
        await AuthService.register({
          nombre: nombre.value,
          email: email.value,
          password: password.value
        });
        
        guardandoEnBackend.value = false;
        emailRegistrado.value = email.value;
        
        registroExitoso.value = true;
      } catch (backendError) {
        guardandoEnBackend.value = false;
        console.error('Error al registrar con backend:', backendError);
        
        // Manejamos errores específicos del backend
        if (backendError.response?.data && typeof backendError.response.data === 'string') {
          if (backendError.response.data.includes('ya está registrado')) {
            error.value = 'Este correo electrónico ya está registrado. Por favor, inicia sesión o usa otro email.';
          } else if (backendError.response.data.includes('demasiados intentos')) {
            error.value = 'Se han realizado demasiados intentos. Por favor, espera unos minutos e inténtalo de nuevo.';
          } else {
            error.value = backendError.response.data;
          }
        } else {
          error.value = 'Error al crear la cuenta. Por favor, inténtalo de nuevo más tarde.';
        }
      }
    }
  } catch (err) {
    console.error('Error general de registro:', err);
    guardandoEnFirebase.value = false;
    guardandoEnBackend.value = false;
    
    // Manejar mensajes de error específicos
    if (err.response?.data && typeof err.response.data === 'string') {
      // Si el mensaje contiene información sobre demasiados intentos
      if (err.response.data.includes('demasiados intentos')) {
        error.value = 'Se han realizado demasiados intentos de registro. Por favor, espera unos minutos antes de intentarlo nuevamente.';
      } else if (err.response.data.includes('ya está registrado')) {
        error.value = 'Este correo electrónico ya está registrado. Intenta iniciar sesión o usar otro email.';
      } else {
        error.value = err.response.data;
      }
    } else if (err.code) {
      // Errores específicos de Firebase
      switch (err.code) {
        case 'auth/email-already-in-use':
          error.value = 'Este correo electrónico ya está en uso.';
          break;
        case 'auth/invalid-email':
          error.value = 'El formato del correo electrónico no es válido.';
          break;
        case 'auth/weak-password':
          error.value = 'La contraseña es demasiado débil. Utiliza al menos 6 caracteres.';
          break;
        case 'auth/too-many-requests':
          error.value = 'Se han realizado demasiados intentos. Por favor, espera unos minutos antes de intentarlo nuevamente.';
          break;
        default:
          error.value = 'Error al crear la cuenta. Inténtalo de nuevo más tarde.';
      }
    } else {
      error.value = 'Error al crear la cuenta. Inténtalo de nuevo más tarde.';
    }
  } finally {
    loading.value = false;
  }
};

const enviarVerificacion = async () => {
  try {
    enviandoVerificacion.value = true;
    error.value = '';
    
    // Usar el email que se registró
    const emailToUse = emailRegistrado.value || email.value;
    
    if (!emailToUse) {
      error.value = 'No hay un email válido para enviar la verificación.';
      return;
    }
    
    // Primero intentamos usar Firebase directamente
    try {
      // Iniciar sesión con Firebase para obtener el usuario
      const user = await FirebaseAuthService.login(emailToUse, password.value);
      
      // Enviar email de verificación
      await FirebaseAuthService.sendVerificationEmail(user);
      
      verificacionEnviada.value = true;
      verificacionMensaje.value = 'Se ha enviado un correo de verificación. Por favor, revisa tu bandeja de entrada.';
      
    } catch (firebaseError) {
      console.error('Error al usar Firebase directamente:', firebaseError);
      
      if (firebaseError.code === 'auth/wrong-password') {
        error.value = 'La contraseña es incorrecta para este email.';
        return;
      }
      
      // Si falla Firebase, caemos al método del backend
      try {
        const response = await axios.get(
          `http://localhost:8080/api/auth/enviar-verificacion?email=${encodeURIComponent(emailToUse)}`
        );
        
        verificacionEnviada.value = true;
        verificacionMensaje.value = response.data || 'Se ha enviado un nuevo correo de verificación.';
      } catch (backendError) {
        console.error('Error con backend:', backendError);
        
        // Si también falla el backend, mostramos un mensaje de error claro
        if (backendError.response?.data && typeof backendError.response.data === 'string') {
          if (backendError.response.data.includes('demasiados intentos')) {
            error.value = 'Se han realizado demasiados intentos de envío. Por favor, espera unos minutos e inténtalo de nuevo.';
          } else if (backendError.response.data.includes('no se encontró')) {
            error.value = 'No se encontró ningún usuario con este email en nuestro sistema.';
          } else {
            error.value = backendError.response.data;
          }
        } else {
          error.value = 'No se pudo enviar el correo de verificación. Por favor, inténtalo más tarde.';
        }
      }
    }
  } catch (err) {
    console.error('Error al enviar verificación:', err);
    
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
          error.value = 'No se pudo enviar el correo de verificación.';
      }
    } else {
      error.value = err.response?.data || 'No se pudo enviar el correo de verificación.';
    }
  } finally {
    enviandoVerificacion.value = false;
  }
};

// Registrarse con Google
const registerWithGoogle = async () => {
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
        } catch (updateError) {
          console.warn("No se pudo actualizar/recargar usuario:", updateError);
        }
        
        // Si sigue sin estar verificado, forzar en el backend
        if (!user.emailVerified) {
          // Forzar marcado como verificado en el backend
          const verificationResponse = await axios.get(
            `http://localhost:8080/api/auth/forzar-verificacion?email=${encodeURIComponent(user.email)}`
          );
          
          // Intentar marcar al usuario como verificado también en Firebase
          try {
            await user.getIdToken(true); // Forzar renovación del token
            await user.reload(); // Recargar datos del usuario
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
    
    guardandoEnBackend.value = true;
    
    // Guardar el UID para posibles recuperaciones de sesión
    sessionStorage.setItem('firebaseUid', user.uid);
    
    // Datos para registro/login con Google
    const googleData = {
      email: user.email,
      password: `google-auth-${user.uid}`, // Contraseña que nunca será usada directamente
      nombre: user.displayName || user.email.split('@')[0]
    };
    
    // Intentar iniciar sesión primero (por si el usuario ya existe)
    try {
      const loginResponse = await AuthService.login(googleData);
            
      // Login exitoso, el usuario ya existía
      emailRegistrado.value = user.email;
      guardandoEnBackend.value = false;
      
      // Verificar explícitamente que ambos sistemas estén sincronizados
      const currentUser = auth.currentUser;
      const jwtToken = localStorage.getItem('authToken');
      
      if (!currentUser && jwtToken) {
        // Restaurar la sesión en Firebase 
        try {
          window.location.reload();
          return;
        } catch (reAuthError) {
          console.error("No se pudo restablecer la sesión de Firebase:", reAuthError);
        }
      }
      
      // Redirigir directamente al dashboard ya que el usuario ya existe y está autenticado
      setTimeout(() => {
        router.push('/');
      }, 1000);
      
      return;
    } catch (loginError) {
      // Si falla el login, el usuario no existe y continuamos con el registro
      console.log("Usuario no encontrado, procediendo a registrarlo");
    }
    
    try {
      // Registrar nuevo usuario
      await AuthService.register(googleData);      
      
      // Pequeña pausa para asegurar que la sincronización se complete
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      try {
        // Después del registro exitoso, intentamos iniciar sesión
        console.log("Intentando login después del registro...");
        await AuthService.login(googleData);
        
        console.log("Login después de registro exitoso");
        
        guardandoEnBackend.value = false;
        
        // Mostrar mensaje de éxito
        emailRegistrado.value = user.email;
        registroExitoso.value = true;
        
        // Como los usuarios de Google ya están verificados, redirigimos al dashboard
        setTimeout(() => {
          router.push('/');
        }, 2000);
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
          
          guardandoEnBackend.value = false;
          emailRegistrado.value = user.email;
          registroExitoso.value = true;
          
          // Redirigir al dashboard
          setTimeout(() => {
            router.push('/');
          }, 2000);
        } catch (tokenError) {
          console.error("Error en login alternativo:", tokenError);
          guardandoEnBackend.value = false;
          error.value = 'Error al iniciar sesión después del registro. Por favor, intenta iniciar sesión normalmente.';
        }
      }
    } catch (registerError) {
      guardandoEnBackend.value = false;
      console.error('Error al registrar usuario de Google en el backend:', registerError);
      
      if (registerError.response && registerError.response.data) {
        // Analizar el mensaje de error para dar retroalimentación específica
        const errorMsg = typeof registerError.response.data === 'string' 
          ? registerError.response.data 
          : JSON.stringify(registerError.response.data);
        
        if (errorMsg.includes("ya está registrado")) {
          console.log("Usuario ya registrado, intentando login final...");
          
          try {
            // Si ya está registrado, intentamos login una vez más
            await new Promise(resolve => setTimeout(resolve, 1000));
            await AuthService.login(googleData);
            
            console.log("Login final exitoso");
            emailRegistrado.value = user.email;
            
            // Redirigir a la página de inicio de sesión después de un breve retraso
            setTimeout(() => {
              router.push('/');
            }, 2000);
            
            return;
          } catch (finalLoginError) {
            console.error("Error en login final:", finalLoginError);
            error.value = 'Este email ya está registrado, pero no pudimos iniciar sesión automáticamente. Por favor, inicia sesión manualmente.';
            
            setTimeout(() => {
              router.push('/login');
            }, 3000);
          }
        } else {
          error.value = 'No se pudo completar el registro con Google: ' + errorMsg;
        }
      } else {
        error.value = 'No se pudo completar el registro con Google.';
      }
    }
  } catch (err) {
    console.error('Error al iniciar sesión con Google:', err);
    
    if (err.code === 'auth/popup-closed-by-user') {
      error.value = 'El proceso de registro fue cancelado.';
    } else if (err.code === 'auth/cancelled-popup-request') {
      // Este es un error común cuando se hace clic varias veces, no mostramos error
      error.value = '';
    } else {
      error.value = 'Error al registrarse con Google. Por favor, inténtalo de nuevo.';
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style src="../assets/Register.css"></style>
