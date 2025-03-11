<template>
  <div class="home-container">
    <div class="welcome-card">
      <h1>Bienvenido</h1>
      <div class="user-info" v-if="usuario">
        <p class="username">{{ usuario.nombre }}</p>
      </div>
      <div class="actions">
        <button @click="logout" class="btn btn-logout">Cerrar sesión</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AuthService from '../services/AuthService';

const router = useRouter();
const usuario = ref(null);

onMounted(() => {
  // Obtener información del usuario desde localStorage
  usuario.value = AuthService.getCurrentUser();
  
  // Si no hay usuario, redirigir al login
  if (!usuario.value) {
    router.push('/login');
  }
});

const logout = () => {
  AuthService.logout();
  router.push('/login');
};
</script>

<style scoped>
.home-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #ffffff;
}

.welcome-card {
  width: 100%;
  max-width: 600px;
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

.user-info {
  margin: 2rem 0;
}

.username {
  font-size: 2rem;
  font-weight: 700;
  color: #4CAF50;
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
}

.btn-logout {
  background-color: #f44336;
  color: white;
}

.btn-logout:hover {
  background-color: #d32f2f;
}
</style>
