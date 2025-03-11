<template>
  <div class="login-container">
    <div class="login-card">
      <h1>Iniciar Sesión</h1>
      <div v-if="error" class="alert alert-danger">
        <p>{{ error }}</p>
        <div v-if="emailNoVerificado" class="email-verification">
          <p>Por favor, verifica tu dirección de correo electrónico antes de iniciar sesión.</p>
          <button @click="reenviarVerificacion" class="btn-link">
            Reenviar correo de verificación
          </button>
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

const router = useRouter();
const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);
const emailNoVerificado = computed(() => {
  return error.value && error.value.toLowerCase().includes('verifica') && email.value;
});

const login = async () => {
  try {
    loading.value = true;
    error.value = '';
    
    await AuthService.login({
      email: email.value,
      password: password.value
    });
    
    // Redirigir al usuario a la página principal
    router.push('/');
  } catch (err) {
    console.error('Error de inicio de sesión:', err);
    error.value = err.response?.data || 'Error al iniciar sesión';
  } finally {
    loading.value = false;
  }
};

const reenviarVerificacion = async () => {
  try {
    loading.value = true;
    
    // Llamar al backend para reenviar el correo de verificación
    await axios.post(`http://localhost:8080/api/auth/reenviar-verificacion?email=${encodeURIComponent(email.value)}`);
    
    error.value = 'Se ha enviado un nuevo correo de verificación a tu dirección de email.';
  } catch (err) {
    console.error('Error al reenviar verificación:', err);
    error.value = err.response?.data || 'No se pudo reenviar el correo de verificación.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  background-image: linear-gradient(to bottom right, #f5f5f5, #e0e9f5);
}

.login-card {
  width: 100%;
  max-width: 450px;
  padding: 2.5rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 70, 152, 0.1);
  transition: transform 0.3s ease;
}

.login-card:hover {
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
  color: #721c24;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
}

.register-link {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.95rem;
}

.register-link a {
  color: #004698;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.3s;
}

.register-link a:hover {
  color: #749BD0;
  text-decoration: underline;
}

.actions {
  margin-top: 1.5rem;
}

.email-verification {
  margin-top: 0.75rem;
  font-size: 0.9rem;
}

.btn-link {
  color: #004698;
  text-decoration: underline;
  background-color: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  font-size: 0.9rem;
  transition: color 0.3s;
}

.btn-link:hover {
  color: #749BD0;
}

/* Responsive adjustments */
@media screen and (max-width: 576px) {
  .login-card {
    max-width: 90%;
    padding: 1.5rem;
  }
  
  h1 {
    font-size: 1.5rem;
  }
  
  .btn {
    padding: 0.75rem;
  }
}
</style>