<template>
  <div class="verificar-container">
    <div class="verificar-card">
      <h1>Verificación de Email</h1>
      <div v-if="loading" class="loading">
        <p>Verificando tu dirección de correo electrónico...</p>
      </div>
      <div v-else-if="error" class="alert alert-danger">
        <p>{{ error }}</p>
        <div class="actions">
          <router-link to="/login" class="btn btn-primary">Volver al login</router-link>
        </div>
      </div>
      <div v-else-if="verificado" class="success">
        <p>¡Tu email ha sido verificado correctamente!</p>
        <p>Ya puedes iniciar sesión en tu cuenta.</p>
        <div class="actions">
          <router-link to="/login" class="btn btn-primary">Ir al login</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const loading = ref(true);
const error = ref('');
const verificado = ref(false);

onMounted(async () => {
  try {
    const uid = route.query.uid;
    
    if (!uid) {
      error.value = 'Link de verificación inválido. Por favor, solicita un nuevo correo de verificación.';
      loading.value = false;
      return;
    }
    
    // Llamar al backend para verificar el email
    const response = await axios.get(`http://localhost:8080/api/auth/verificar-email?uid=${uid}`);
    
    verificado.value = true;
    loading.value = false;
  } catch (err) {
    console.error('Error al verificar email:', err);
    error.value = err.response?.data || 'No se pudo verificar tu email. Intenta de nuevo más tarde.';
    loading.value = false;
  }
});
</script>

<style scoped>
.verificar-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.verificar-card {
  width: 100%;
  max-width: 450px;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h1 {
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.loading, .success, .alert {
  margin: 2rem 0;
}

.success {
  color: #4CAF50;
  font-weight: 500;
}

.alert {
  padding: 0.75rem;
  border-radius: 4px;
  color: #721c24;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
}

.actions {
  margin-top: 2rem;
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  text-decoration: none;
}

.btn-primary {
  background-color: #4CAF50;
  color: white;
}

.btn-primary:hover {
  background-color: #3e8e41;
}
</style> 