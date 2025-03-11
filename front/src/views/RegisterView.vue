<template>
  <div class="register-container">
    <div class="register-card">
      <h1>Regístrate</h1>
      <div v-if="error" class="alert alert-danger">{{ error }}</div>
      <div v-if="registroExitoso" class="alert alert-success">
        <p>¡Registro exitoso! Hemos enviado un correo de verificación a tu dirección de email.</p>
        <p>Por favor, verifica tu email antes de iniciar sesión.</p>
        <div v-if="!verificacionEnviada" class="actions">
          <p class="small-text">¿No has recibido el correo de verificación?</p>
          <button @click="enviarVerificacion" class="btn btn-secondary" :disabled="enviandoVerificacion">
            {{ enviandoVerificacion ? 'Enviando...' : 'Enviar de nuevo' }}
          </button>
        </div>
        <div v-if="verificacionEnviada" class="verification-message">
          <p>{{ verificacionMensaje }}</p>
        </div>
        <div class="actions mt-3">
          <router-link to="/login" class="btn btn-link">Ir al login</router-link>
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
          />
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
    
    await AuthService.register({
      nombre: nombre.value,
      email: email.value,
      password: password.value
    });
    
    // Guardar el email para posible reenvío de verificación
    emailRegistrado.value = email.value;
    
    // Mostrar mensaje de éxito y pedir verificación
    registroExitoso.value = true;
    
    // No redirigimos automáticamente al usuario, debe verificar su email primero
  } catch (err) {
    console.error('Error de registro:', err);
    
    // Manejar mensajes de error específicos
    if (err.response?.data && typeof err.response.data === 'string') {
      // Si el mensaje contiene información sobre demasiados intentos
      if (err.response.data.includes('demasiados intentos')) {
        error.value = 'Se han realizado demasiados intentos de registro. Por favor, espera unos minutos antes de intentarlo nuevamente.';
      } else {
        error.value = err.response.data;
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
    
    // Usar el email que se registró
    const emailToUse = emailRegistrado.value || email.value;
    
    const response = await axios.get(
      `http://localhost:8080/api/auth/enviar-verificacion?email=${encodeURIComponent(emailToUse)}`
    );
    
    verificacionEnviada.value = true;
    verificacionMensaje.value = response.data || 'Se ha enviado un nuevo correo de verificación.';
  } catch (err) {
    console.error('Error al enviar verificación:', err);
    error.value = err.response?.data || 'No se pudo enviar el correo de verificación.';
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
}

.register-card {
  width: 100%;
  max-width: 450px;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h1 {
  margin-bottom: 1.5rem;
  color: #2c3e50;
  text-align: center;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 600;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
}

.form-control.is-invalid {
  border-color: #dc3545;
}

.btn {
  display: inline-block;
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-primary {
  background-color: #4CAF50;
  color: white;
}

.btn-primary:hover:not([disabled]) {
  background-color: #3e8e41;
}

.btn-primary[disabled] {
  opacity: 0.7;
  cursor: not-allowed;
}

.alert {
  padding: 0.75rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  color: #721c24;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
}

.login-link {
  margin-top: 1rem;
  text-align: center;
}

.actions {
  margin-top: 1.5rem;
}

.alert-success {
  color: #155724;
  background-color: #d4edda;
  border-color: #c3e6cb;
}

.btn-link {
  color: #4CAF50;
  text-decoration: underline;
  background-color: transparent;
  border: none;
  padding: 0;
  margin-top: 1rem;
  display: inline-block;
}

.mt-3 {
  margin-top: 1rem;
}

.small-text {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
  width: auto;
  margin: 0 auto;
  display: block;
}

.btn-secondary:hover:not([disabled]) {
  background-color: #5a6268;
}

.verification-message {
  margin-top: 1rem;
  color: #155724;
  font-weight: 500;
}
</style> 