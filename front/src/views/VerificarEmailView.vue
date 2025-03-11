<template>
  <div class="verificar-container">
    <div class="verificar-card">
      <h1>Verificación de Email</h1>
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Verificando tu dirección de correo electrónico...</p>
      </div>
      <div v-else-if="error" class="alert alert-danger">
        <p>{{ error }}</p>
        <div class="actions">
          <router-link to="/login" class="btn btn-primary">Volver al login</router-link>
        </div>
      </div>
      <div v-else-if="verificado" class="success">
        <div class="success-icon">✓</div>
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
  background-image: linear-gradient(to bottom right, #f5f5f5, #e0e9f5);
}

.verificar-card {
  width: 100%;
  max-width: 450px;
  padding: 2.5rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 70, 152, 0.1);
  text-align: center;
  transition: transform 0.3s ease;
}

.verificar-card:hover {
  transform: translateY(-5px);
}

h1 {
  margin-bottom: 1.5rem;
  color: #004698;
  font-weight: 700;
}

.loading, .success, .alert {
  margin: 2rem 0;
}

.loading p {
  margin-top: 1.5rem;
  color: #333;
  font-weight: 500;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #e0e9f5;
  border-radius: 50%;
  border-top: 5px solid #004698;
  margin: 0 auto;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.success {
  color: #004698;
  font-weight: 500;
}

.success-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 70px;
  height: 70px;
  margin: 0 auto 1.5rem;
  background-color: #004698;
  color: white;
  font-size: 2rem;
  border-radius: 50%;
  box-shadow: 0 4px 10px rgba(0, 70, 152, 0.2);
}

.alert {
  padding: 1rem;
  border-radius: 8px;
  color: #721c24;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
}

.actions {
  margin-top: 2rem;
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
  text-decoration: none;
}

.btn-primary {
  background-color: #004698;
  color: white;
}

.btn-primary:hover {
  background-color: #003a7e;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 70, 152, 0.2);
}

.btn-primary:active {
  transform: translateY(0);
}

/* Responsive adjustments */
@media screen and (max-width: 576px) {
  .verificar-card {
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
  
  .success-icon {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
  }
}
</style>