<template>
  <div class="navbar-container">
    <div class="navbar">
      <div class="navbar-left">
        <div class="logo">
          <router-link to="/">
            <div class="logo-img">
              <img src="../assets/img/impulsedata_logo.png" alt="Logo" />
            </div>
            <span class="brand-name">ImpulseData</span>
          </router-link>
        </div>
        <nav class="nav-links">
          <router-link to="/home" class="nav-link" :class="{ 'active': $route.path === '/home' }">
            <i class="fas fa-home"></i> Inicio
          </router-link>
          <a href="#" class="nav-link" @click.prevent="scrollToSection('#about')">
            <i class="fas fa-info-circle"></i> Acerca de
          </a>
          <a href="#" class="nav-link" @click.prevent="scrollToSection('#services')">
            <i class="fas fa-cogs"></i> Servicios
          </a>
          <a href="#" class="nav-link" @click.prevent="scrollToSection('#contact')">
            <i class="fas fa-envelope"></i> Contacto
          </a>
        </nav>
      </div>
      <div class="navbar-right">
        <div class="auth-buttons" v-if="!isAuthenticated">
          <router-link to="/login" class="button button2">Iniciar Sesión</router-link>
          <router-link to="/register" class="button button2">Registrarse</router-link>
        </div>
        <div class="user-dropdown" v-else>
          <div class="dropdown-toggle" @click="toggleMenu" ref="dropdownToggle">
            <i class="fas fa-user-circle"></i>
            <span v-if="usuario">{{ usuario?.nombre || 'Usuario' }}</span>
            <i class="fas fa-caret-down"></i>
          </div>
          <div class="dropdown-menu" v-if="showMenu" ref="dropdownMenu">
            <router-link to="/perfil" class="dropdown-item">
              <i class="fas fa-user dropdown-icon"></i>
              <span>Mi Perfil</span>
            </router-link>
            <router-link to="/panel-control" class="dropdown-item">
              <i class="fas fa-tachometer-alt dropdown-icon"></i>
              <span>Panel de Control</span>
            </router-link>
            <a class="dropdown-item logout-item" @click="logout" href="#">
              <i class="fas fa-sign-out-alt dropdown-icon"></i>
              <span>Cerrar Sesión</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default {
  name: 'NavBar',
  setup() {
    const store = useStore();
    const router = useRouter();
    const showMenu = ref(false);
    const dropdownToggle = ref(null);
    const dropdownMenu = ref(null);
    const closeTimeout = ref(null);

    const isAuthenticated = () => {
      return store.getters.isAuthenticated;
    };

    const usuario = () => {
      return store.state.auth.usuario;
    };

    const toggleMenu = () => {
      showMenu.value = !showMenu.value;
    };

    const handleClickOutside = (event) => {
      if (dropdownToggle.value && !dropdownToggle.value.contains(event.target) &&
          dropdownMenu.value && !dropdownMenu.value.contains(event.target)) {
        showMenu.value = false;
      }
    };

    const handleMouseEnter = () => {
      if (closeTimeout.value) {
        clearTimeout(closeTimeout.value);
        closeTimeout.value = null;
      }
    };

    const handleMouseLeave = () => {
      closeTimeout.value = setTimeout(() => {
        showMenu.value = false;
      }, 500); // 500ms delay before closing the dropdown
    };

    const logout = async () => {
      try {
        await store.dispatch('logout');
        router.push('/login');
      } catch (error) {
        console.error('Error during logout:', error);
      }
    };

    const scrollToSection = (sectionId) => {
      const element = document.querySelector(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        router.push('/' + `?section=${sectionId.substring(1)}`);
      }
    };

    onMounted(() => {
      document.addEventListener('click', handleClickOutside);
    });

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside);
      if (closeTimeout.value) {
        clearTimeout(closeTimeout.value);
      }
    });

    watch(dropdownMenu, (newVal) => {
      if (newVal) {
        dropdownMenu.value.addEventListener('mouseenter', handleMouseEnter);
        dropdownMenu.value.addEventListener('mouseleave', handleMouseLeave);
      }
    }, { immediate: true });

    watch(dropdownToggle, (newVal) => {
      if (newVal) {
        dropdownToggle.value.addEventListener('mouseenter', handleMouseEnter);
        dropdownToggle.value.addEventListener('mouseleave', handleMouseLeave);
      }
    }, { immediate: true });

    return {
      showMenu,
      isAuthenticated,
      usuario,
      toggleMenu,
      logout,
      scrollToSection,
      dropdownToggle,
      dropdownMenu
    };
  }
};
</script>

<style>
/* Estilos del Navbar aquí */
.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  padding: 0.5rem 0;
  min-width: 200px;
  z-index: 1000;
  transition: opacity 0.3s, transform 0.3s;
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 0.7rem 1rem;
  color: #333;
  text-decoration: none;
  transition: background-color 0.3s;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
}
</style> 