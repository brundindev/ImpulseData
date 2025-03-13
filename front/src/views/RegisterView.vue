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
          <input
            type="password"
            id="password"
            v-model="password"
            class="form-control"
            required
            placeholder="Contraseña (mínimo 6 caracteres)"
            minlength="6"
            :disabled="loading"
          />
        </div>
        <div class="form-group">
          <label for="confirmPassword">Confirmar Contraseña</label>
          <input
            type="password"
            id="confirmPassword"
            v-model="confirmPassword"
            class="form-control"
            required
            placeholder="Repite tu contraseña"
            minlength="6"
            :disabled="loading"
          />
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
import AuthService from '../services/AuthService';
import axios from 'axios';
import FirebaseAuthService from '../services/FirebaseAuthService';

const router = useRouter();
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
      console.log("Registrando en Firebase:", email.value);
      // Primero intentamos registrar al usuario con Firebase
      await FirebaseAuthService.register(email.value, password.value);
      guardandoEnFirebase.value = false;
      
      // 2. Crear usuario en el backend
      guardandoEnBackend.value = true;
      console.log("Registrando en backend...");
      try {
        await AuthService.register({
          nombre: nombre.value,
          email: email.value,
          password: password.value
        });
        
        guardandoEnBackend.value = false;
        
        // Guardar el email para posible reenvío de verificación
        emailRegistrado.value = email.value;
        
        console.log("Registro exitoso completo, mostrando pantalla de confirmación");
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
      console.log("Intentando registro solo con backend...");
      try {
        await AuthService.register({
          nombre: nombre.value,
          email: email.value,
          password: password.value
        });
        
        guardandoEnBackend.value = false;
        emailRegistrado.value = email.value;
        
        console.log("Registro con backend exitoso, mostrando pantalla de confirmación");
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
      console.log("Intentando enviar verificación con Firebase para:", emailToUse);
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
        console.log("Intentando enviar verificación con backend para:", emailToUse);
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
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  background-image: linear-gradient(to bottom right, #f5f5f5, #e0e9f5);
}

.register-card {
  width: 100%;
  max-width: 500px;
  padding: 2.5rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 70, 152, 0.1);
  transition: transform 0.3s ease;
  margin: 2rem 1rem;
}

.register-card:hover {
  transform: translateY(-5px);
}

h1 {
  margin-bottom: 1.5rem;
  color: #004698;
  text-align: center;
  font-weight: 700;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 600;
  font-size: 0.95rem;
}

.form-control {
  width: 100%;
  padding: 0.85rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.form-control:focus {
  border-color: #749BD0;
  outline: none;
  box-shadow: 0 0 0 3px rgba(116, 155, 208, 0.25);
}

.form-control.is-invalid {
  border-color: #dc3545;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23dc3545' viewBox='0 0 12 12'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right calc(0.375em + 0.1875rem) center;
  background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
}

.btn {
  display: inline-block;
  width: 100%;
  padding: 0.85rem 1rem;
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #004698;
  color: white;
}

.btn-primary:hover:not([disabled]) {
  background-color: #003a7e;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 70, 152, 0.2);
}

.btn-primary:active:not([disabled]) {
  transform: translateY(0);
}

.btn-primary[disabled] {
  opacity: 0.7;
  cursor: not-allowed;
}

.alert {
  padding: 1rem;
  margin-bottom: 1.5rem;
  border-radius: 8px;
}

.alert-danger {
  color: #721c24;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
}

.login-link {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.95rem;
}

.login-link a {
  color: #004698;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.3s;
}

.login-link a:hover {
  color: #749BD0;
  text-decoration: underline;
}

.actions {
  margin-top: 1.5rem;
}

.alert-success {
  color: #0f5132;
  background-color: #d1e7dd;
  border-color: #badbcc;
}

.btn-link {
  color: #004698;
  text-decoration: underline;
  background-color: transparent;
  border: none;
  padding: 0.75rem 1.5rem;
  margin-top: 1rem;
  display: inline-block;
  width: auto;
  transition: color 0.3s;
}

.btn-link:hover {
  color: #749BD0;
}

.mt-3 {
  margin-top: 1rem;
}

.small-text {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.btn-secondary {
  background-color: #749BD0;
  color: white;
  width: auto;
  margin: 0 auto;
  display: block;
  padding: 0.6rem 1.2rem;
}

.btn-secondary:hover:not([disabled]) {
  background-color: #5a87c5;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(116, 155, 208, 0.3);
}

.btn-secondary:active:not([disabled]) {
  transform: translateY(0);
}

.verification-message {
  margin-top: 1rem;
  color: #0f5132;
  font-weight: 500;
}

.success-icon {
  text-align: center;
  margin: 0 auto 20px;
}

.checkmark {
  display: inline-block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #57bd84;
  color: white;
  font-size: 25px;
  line-height: 40px;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.alert-success h2 {
  color: #0f5132;
  text-align: center;
  margin-bottom: 15px;
  font-size: 1.5rem;
}

.verification-section {
  background-color: rgba(255,255,255,0.5);
  padding: 15px;
  border-radius: 8px;
  margin-top: 15px;
  text-align: center;
  border: 1px dashed #badbcc;
}

.btn-secondary {
  margin-top: 10px;
}

.verification-message {
  margin-top: 15px;
  padding: 10px;
  border-radius: 8px;
  background-color: rgba(255,255,255,0.7);
  font-weight: 500;
}

/* Responsive adjustments */
@media screen and (max-width: 576px) {
  .register-card {
    max-width: 90%;
    padding: 1.5rem;
    margin: 1rem;
  }
  
  h1 {
    font-size: 1.5rem;
  }
  
  .btn {
    padding: 0.75rem;
  }
}

.loading-state {
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  padding: 12px;
  margin: 15px 0;
  text-align: center;
  border: 1px solid #e0e0e0;
}

.loading-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #555;
  font-size: 0.9rem;
}

.spinner-small {
  width: 20px;
  height: 20px;
  border: 3px solid #e0e9f5;
  border-top: 3px solid #004698;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>