<template>
  <div class="navbar-container" :class="{ 'navbar-scrolled': isScrolled }">
    <div class="navbar">
      <div class="navbar-left">
        <div class="logo">
          <router-link to="/">
            <div class="logo-img">
              <img src="../assets/img/logo_impulsedata.jpg" alt="Logo" />
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
        <div class="auth-buttons" v-if="!isAuthenticated()">
          <router-link to="/login" class="button button2">Iniciar Sesión</router-link>
          <router-link to="/register" class="button button2">Registrarse</router-link>
        </div>
        <div class="user-dropdown" v-else>
          <div class="dropdown-toggle" @click="toggleMenu" ref="dropdownToggle">
            <i class="fas fa-user-circle"></i>
            <span v-if="usuario()">{{ usuario()?.nombre || 'Usuario' }}</span>
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
            <router-link to="/soporte" class="dropdown-item">
              <i class="fas fa-question-circle dropdown-icon"></i>
              <span>Soporte Técnico</span>
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
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
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
    const isScrolled = ref(false);

    // Funciones para acceder al estado de autenticación y usuario
    const isAuthenticated = () => {
      console.log('Auth state:', store.getters.isAuthenticated);
      return store.getters.isAuthenticated;
    };

    const usuario = () => {
      console.log('User state:', store.state.auth.usuario);
      return store.state.auth.usuario;
    };

    const toggleMenu = () => {
      showMenu.value = !showMenu.value;
      console.log('Menu toggled:', showMenu.value);
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

    // Detectar el scroll para cambiar el estilo del navbar
    const handleScroll = () => {
      isScrolled.value = window.scrollY > 50;
    };

    onMounted(() => {
      document.addEventListener('click', handleClickOutside);
      window.addEventListener('scroll', handleScroll);
      console.log('NavBar mounted, isAuthenticated:', isAuthenticated());
      console.log('Current User:', usuario());
      
      // Ejecutar inicialmente para establecer el estado correcto
      handleScroll();
    });

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
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
      dropdownMenu,
      isScrolled
    };
  }
};
</script>

<style>
/* Estilos del Navbar mejorados */
.navbar-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0);
}

.navbar-scrolled {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(156, 39, 176, 0.15), 0 2px 8px rgba(233, 30, 99, 0.1);
  padding: 0.3rem 1rem;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  height: 60px;
  transition: height 0.3s ease;
}

.navbar-scrolled .navbar {
  height: 50px;
}

.navbar-left {
  display: flex;
  align-items: center;
}

.logo {
  margin-right: 2rem;
}

.logo a {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.logo-img {
  width: 40px;
  height: 40px;
  overflow: hidden;
  border-radius: 50%;
  margin-right: 10px;
  transition: transform 0.3s ease;
}

.navbar-scrolled .logo-img {
  width: 35px;
  height: 35px;
}

.logo-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.brand-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: #9c27b0;
  background: linear-gradient(45deg, #9c27b0, #e91e63);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: font-size 0.3s ease;
}

.navbar-scrolled .brand-name {
  font-size: 1.3rem;
}

.logo:hover .logo-img {
  transform: scale(1.1);
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.nav-link {
  color: #000;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 0;
  position: relative;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-link:hover, .nav-link.active {
  color: #9c27b0;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(45deg, #9c27b0, #e91e63);
  transition: width 0.3s ease;
}

.nav-link:hover::after, .nav-link.active::after {
  width: 100%;
}

.navbar-right {
  display: flex;
  align-items: center;
}

.auth-buttons {
  display: flex;
  gap: 1rem;
}

.button {
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.button2 {
  background: linear-gradient(45deg, #9c27b0, #e91e63);
  color: white;
  border: none;
  box-shadow: 0 4px 10px rgba(156, 39, 176, 0.3);
}

.button2:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(156, 39, 176, 0.4);
}

.user-dropdown {
  position: relative;
}

.dropdown-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50px;
  background: rgba(156, 39, 176, 0.1);
  transition: all 0.3s ease;
}

.dropdown-toggle:hover {
  background: rgba(156, 39, 176, 0.2);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1), 0 3px 8px rgba(156, 39, 176, 0.1);
  padding: 0.5rem 0;
  min-width: 200px;
  z-index: 1000;
  transition: opacity 0.3s, transform 0.3s;
  transform-origin: top right;
  transform: translateY(10px);
  opacity: 0;
  animation: dropdown-fade-in 0.3s forwards;
}

@keyframes dropdown-fade-in {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 0.7rem 1rem;
  color: #333;
  text-decoration: none;
  transition: background-color 0.3s, color 0.3s;
}

.dropdown-icon {
  margin-right: 10px;
  font-size: 0.9rem;
  color: #9c27b0;
}

.dropdown-item:hover {
  background-color: rgba(156, 39, 176, 0.1);
  color: #9c27b0;
}

.logout-item {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  margin-top: 0.5rem;
  padding-top: 0.7rem;
  color: #e91e63;
}

.logout-item:hover {
  background-color: rgba(233, 30, 99, 0.1);
  color: #e91e63;
}

.logout-item .dropdown-icon {
  color: #e91e63;
}

/* Media queries para responsive */
@media (max-width: 768px) {
  .navbar {
    flex-wrap: wrap;
    height: auto;
  }
  
  .navbar-left {
    flex-basis: 100%;
    justify-content: space-between;
  }
  
  .nav-links {
    display: none;
    flex-basis: 100%;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 1rem;
  }
  
  .navbar-right {
    margin-top: 1rem;
    flex-basis: 100%;
    justify-content: center;
  }
}
</style> 