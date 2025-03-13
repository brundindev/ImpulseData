<template>
  <div class="login-container">
    <div class="login-card">
      <h1>Iniciar Sesión</h1>
      <div v-if="error" class="alert alert-danger">
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
            placeholder="Introduce tu contraseña"
          />
        </div>
        <div class="actions">
          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
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
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import AuthService from '../services/AuthService';
import axios from 'axios';
import FirebaseAuthService from '../services/FirebaseAuthService';

const router = useRouter();
const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);
const emailNoVerificado = computed(() => {
  return error.value && error.value.toLowerCase().includes('verifica') && email.value;
});

const login = async () => {
  // Validar formulario
  if (!email.value || !password.value) {
    error.value = 'Por favor, completa todos los campos.';
    return;
  }
  
  loading.value = true;
  error.value = '';
  
  try {
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
    console.error('Error de inicio de sesión:', err);
    
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
    } else {
      // Ocurrió un error al configurar la solicitud
      error.value = 'Error al procesar la solicitud. Por favor, inténtalo de nuevo.';
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
      console.error('Error con Firebase:', firebaseError);
      
      // Si falla Firebase, llamamos al backend
      const response = await axios.get(
        `http://localhost:8080/api/auth/enviar-verificacion?email=${encodeURIComponent(email.value)}`
      );
      
      error.value = 'Se ha enviado un nuevo correo de verificación a tu dirección de email.';
    }
  } catch (err) {
    console.error('Error al reenviar verificación:', err);
    
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