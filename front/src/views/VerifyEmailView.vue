<template>
  <div class="verify-container">
    <div class="verify-card">
      <h1>Verificación de Email</h1>
      
      <div v-if="loading" class="loading-container">
        <div class="spinner"></div>
        <p>Verificando tu email...</p>
      </div>
      
      <div v-else-if="error" class="alert alert-danger">
        <p>{{ error }}</p>
        <div class="actions mt-3">
          <button @click="reenviarVerificacion" class="btn btn-secondary" :disabled="enviandoVerificacion">
            {{ enviandoVerificacion ? 'Enviando...' : 'Enviar nuevo email de verificación' }}
          </button>
        </div>
      </div>
      
      <div v-else-if="verificacionExitosa" class="alert alert-success">
        <p>¡Tu email ha sido verificado correctamente!</p>
        <p>Ahora puedes iniciar sesión en la aplicación.</p>
        <div class="actions mt-3">
          <router-link to="/login" class="btn btn-primary">Ir al login</router-link>
        </div>
      </div>
      
      <div v-else class="no-code">
        <p>No se ha proporcionado un código de verificación válido.</p>
        <div class="actions mt-3">
          <router-link to="/login" class="btn btn-link">Volver al login</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getAuth, applyActionCode, sendEmailVerification } from 'firebase/auth';
import FirebaseAuthService from '../services/FirebaseAuthService';

const route = useRoute();
const loading = ref(true);
const error = ref('');
const verificacionExitosa = ref(false);
const enviandoVerificacion = ref(false);

// Verificar el email cuando el componente se monte
onMounted(async () => {
  const actionCode = route.query.oobCode;
  
  if (!actionCode) {
    loading.value = false;
    return;
  }
  
  try {
    // Aplicar el código de acción para verificar el email
    const auth = getAuth();
    await applyActionCode(auth, actionCode);
    
    verificacionExitosa.value = true;
  } catch (err) {
    console.error('Error al verificar el email:', err);
    
    if (err.code === 'auth/invalid-action-code') {
      error.value = 'El código de verificación no es válido o ha expirado.';
    } else if (err.code === 'auth/user-disabled') {
      error.value = 'Esta cuenta de usuario ha sido deshabilitada.';
    } else {
      error.value = 'No se pudo verificar tu email. Por favor, inténtalo de nuevo más tarde.';
    }
  } finally {
    loading.value = false;
  }
});

const reenviarVerificacion = async () => {
  try {
    enviandoVerificacion.value = true;
    
    // Aquí podríamos solicitar el email al usuario, pero para simplificar
    // asumimos que el usuario debe iniciar sesión nuevamente
    error.value = 'Por favor, inicia sesión para enviar un nuevo correo de verificación.';
    
  } catch (err) {
    console.error('Error al reenviar verificación:', err);
    error.value = 'No se pudo enviar un nuevo correo de verificación.';
  } finally {
    enviandoVerificacion.value = false;
  }
};
</script>

<style scoped>
.verify-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  background-image: linear-gradient(to bottom right, #f5f5f5, #e0e9f5);
}

.verify-card {
  width: 100%;
  max-width: 500px;
  padding: 2.5rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 70, 152, 0.1);
  transition: transform 0.3s ease;
  margin: 2rem 1rem;
}

.verify-card:hover {
  transform: translateY(-5px);
}

h1 {
  margin-bottom: 1.5rem;
  color: #004698;
  text-align: center;
  font-weight: 700;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #e0e9f5;
  border-top: 5px solid #004698;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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

.alert-success {
  color: #0f5132;
  background-color: #d1e7dd;
  border-color: #badbcc;
}

.actions {
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
}

.btn {
  display: inline-block;
  padding: 0.85rem 1.5rem;
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
  text-decoration: none;
}

.btn-primary:hover {
  background-color: #003a7e;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 70, 152, 0.2);
}

.btn-secondary {
  background-color: #749BD0;
  color: white;
  min-width: 200px;
}

.btn-secondary:hover:not([disabled]) {
  background-color: #5a87c5;
  transform: translateY(-2px);
}

.btn-link {
  color: #004698;
  text-decoration: underline;
  background-color: transparent;
}

.btn-link:hover {
  color: #749BD0;
}

.mt-3 {
  margin-top: 1rem;
}

.no-code {
  text-align: center;
  padding: 1rem 0;
}

/* Responsive adjustments */
@media screen and (max-width: 576px) {
  .verify-card {
    max-width: 90%;
    padding: 1.5rem;
    margin: 1rem;
  }
  
  h1 {
    font-size: 1.5rem;
  }
  
  .btn {
    padding: 0.75rem 1.25rem;
  }
}
</style> 