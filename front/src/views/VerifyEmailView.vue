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

<style src="../assets/Verify.css"></style>