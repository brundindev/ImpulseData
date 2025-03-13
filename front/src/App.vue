<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref, onMounted, watch, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import AuthService from './services/AuthService';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const router = useRouter();
const auth = getAuth();
const usuario = ref(null);

// Función para actualizar el estado del usuario
const actualizarEstadoUsuario = () => {
  usuario.value = AuthService.getCurrentUser();
  console.log("Estado de usuario actualizado:", usuario.value);
};

onMounted(() => {
  // Verificar si hay un usuario autenticado
  actualizarEstadoUsuario();
  
  // Escuchar cambios en la autenticación de Firebase
  onAuthStateChanged(auth, (user) => {
    console.log("Cambio de autenticación detectado:", user ? "Usuario autenticado" : "No hay usuario");
    actualizarEstadoUsuario();
  });
  
  // Escuchar el evento personalizado de cambio de estado de autenticación
  window.addEventListener('auth-state-changed', () => {
    console.log("Evento auth-state-changed recibido");
    actualizarEstadoUsuario();
  });
});

// Limpiar los oyentes cuando el componente se desmonta
onUnmounted(() => {
  window.removeEventListener('auth-state-changed', actualizarEstadoUsuario);
});

const logout = () => {
  console.log("Cerrando sesión desde App.vue");
  AuthService.logout();
  
  // Limpiar el estado local
  usuario.value = null;
  
  // Redirigir al login
  router.push('/login');
};
</script>

<template>
  <header class="app-header">
    <div class="header-container">
      <div class="logo-container">
        <span class="app-logo">IMPULSEDATA</span>
      </div>
      <nav class="main-nav">
        <template v-if="usuario">
          <RouterLink to="/" class="nav-link">Inicio</RouterLink>
          <button @click="logout" class="nav-button nav-button-logout">Cerrar sesión</button>
        </template>
        <template v-else>
          <RouterLink to="/login" class="nav-link">Iniciar Sesión</RouterLink>
          <RouterLink to="/registro" class="nav-button">Regístrate</RouterLink>
        </template>
      </nav>
    </div>
  </header>

  <main class="main-content">
    <RouterView />
  </main>
</template>

<style src="src/assets/App.css"></style>