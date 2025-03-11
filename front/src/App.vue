<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref, onMounted } from 'vue';
import AuthService from './services/AuthService';

const usuario = ref(null);

onMounted(() => {
  // Verificar si hay un usuario autenticado
  usuario.value = AuthService.getCurrentUser();
});

const logout = () => {
  AuthService.logout();
  window.location.href = '/login';
};
</script>

<template>
  <header class="app-header">
    <div class="header-container">
      <div class="logo-container">
        <span class="app-logo">IMPULSEDATA</span>
      </div>
      <nav class="main-nav">
        <RouterLink to="/" class="nav-link">Inicio</RouterLink>
        <template v-if="usuario">
          <button @click="logout" class="nav-button nav-button-logout">Cerrar sesión</button>
        </template>
        <template v-else>
          <RouterLink to="/login" class="nav-link">Iniciar Sesión</RouterLink>
          <RouterLink to="/registro" class="nav-link nav-button">Regístrate</RouterLink>
        </template>
      </nav>
    </div>
  </header>

  <main class="main-content">
    <RouterView />
  </main>
</template>

<style scoped>
.app-header {
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 0.75rem 0;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-container {
  display: flex;
  align-items: center;
}

.app-logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: #004698;
}

.main-nav {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-link {
  color: #333;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition: color 0.3s;
  padding: 0.5rem 0;
  position: relative;
}

.nav-link:hover {
  color: #004698;
}

.nav-link::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: 0;
  left: 0;
  background-color: #004698;
  transition: width 0.3s;
}

.nav-link:hover::after {
  width: 100%;
}

.nav-link.router-link-active {
  color: #004698;
}

.nav-link.router-link-active::after {
  width: 100%;
}

.nav-button {
  background-color: #004698;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  transition: all 0.3s;
  text-decoration: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.nav-button:hover {
  background-color: #003a7e;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 70, 152, 0.2);
}

.nav-button:active {
  transform: translateY(0);
}

.nav-button-logout {
  background-color: transparent;
  color: #f44336;
  border: 1px solid #f44336;
}

.nav-button-logout:hover {
  background-color: #f8d7da;
  box-shadow: 0 4px 8px rgba(244, 67, 54, 0.2);
}

.main-content {
  min-height: calc(100vh - 70px);
}

/* Responsive styles */
@media (max-width: 768px) {
  .header-container {
    padding: 0 1rem;
  }
  
  .main-nav {
    gap: 1rem;
  }
  
  .nav-link, .nav-button {
    font-size: 0.9rem;
  }
  
  .app-logo {
    font-size: 1.3rem;
  }
}

@media (max-width: 576px) {
  .header-container {
    flex-direction: column;
    gap: 1rem;
    padding: 0.5rem 1rem;
  }
  
  .main-nav {
    width: 100%;
    justify-content: center;
  }
}
</style>