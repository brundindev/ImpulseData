<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import AuthService from './services/AuthService';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
// Mantenemos el componente por si se necesita en otras partes
import AlicanteBanner from './components/AlicanteBanner.vue';

const router = useRouter();
const auth = getAuth();
const usuario = ref(null);

// Verificar si estamos en la ruta de registro
const estaEnRegistro = computed(() => {
  return router.currentRoute.value.path === '/registro';
});

// Función para actualizar el estado del usuario
const actualizarEstadoUsuario = async () => {
  const jwtToken = localStorage.getItem('authToken');
  const currentUser = auth.currentUser;
  
  // Si hay usuario de Firebase pero no token JWT, es posible que sea un nuevo registro
  // o un problema de sincronización
  if (currentUser && !jwtToken) {
    // Si estamos en la página de registro, no hacer nada para evitar interrumpir
    // el flujo de verificación de email
    if (router.currentRoute.value.path === '/registro') {
      return;
    }
    
    console.warn("Inconsistencia: Usuario Firebase presente pero no hay JWT");
  }
  
  // Verificar si hay token JWT y usuario de Firebase
  const userData = AuthService.getCurrentUser();
  
  // Si hay inconsistencia entre Firebase y JWT, intentar resolver
  if (!currentUser && jwtToken && userData) {
    console.warn("Inconsistencia: JWT presente pero no hay usuario Firebase - Manteniendo sesión con JWT");
    // En este caso mantenemos la sesión basada en el JWT
    usuario.value = userData;
    
    // Si estamos en una ruta que necesita firebase, redirigir a login
    const requiresFirebase = router.currentRoute.value.path === '/';
    if (requiresFirebase) {
      console.log("Esta ruta requiere Firebase. Redirigiendo a login...");
      router.push('/login');
    }
    return;
  }
  
  if (currentUser && !jwtToken) {
    console.warn("Inconsistencia: Usuario Firebase presente pero no hay JWT");
    
    try {
      console.log("Cerrando sesión para sincronizar...");
      await AuthService.logout();
      usuario.value = null;
      router.push('/login');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
    return;
  }
  
  // Actualizar estado según lo que tengamos
  if (currentUser && jwtToken && userData) {
    console.log("Usuario completamente autenticado:", userData.nombre);
    usuario.value = userData;
  } else {
    usuario.value = null;
    
    // Verificar si estamos en una ruta protegida
    const requiresAuth = router.currentRoute.value.meta.requiresAuth;
    if (requiresAuth) {
      console.log("Redirigiendo a login desde ruta protegida");
      router.push('/login');
    }
  }
};

// Configurar listener para cambios de autenticación
onMounted(() => {
  // Verificar estado inicial
  actualizarEstadoUsuario();
  
  // Configurar listener para cambios de autenticación de Firebase
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    actualizarEstadoUsuario();
  });
  
  // Escuchar evento personalizado de cambio de autenticación
  window.addEventListener('auth-state-changed', actualizarEstadoUsuario);
  
  // Limpiar listener cuando el componente se desmonte
  onUnmounted(() => {
    unsubscribe();
    window.removeEventListener('auth-state-changed', actualizarEstadoUsuario);
  });
});

// Logout function
const logout = async () => {
  try {
    console.log("Cerrando sesión...");
    // Limpiar datos locales
    usuario.value = null;
    
    // Cerrar sesión en Firebase y backend
    await AuthService.logout();
    
    // Disparar evento para actualizar toda la aplicación
    window.dispatchEvent(new CustomEvent('auth-state-changed'));
    
    // Redirigir al login
    router.push('/login');
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
};

// Función para recargar la página de registro o navegar a ella
const reloadRegistro = () => {
  if (router.currentRoute.value.path === '/registro') {
    console.log("Recargando página de registro");
    window.location.reload();
  } else {
    console.log("Navegando a página de registro");
    router.push('/registro');
  }
};
</script>

<template>
  <header class="app-header">
    <div class="header-container">
      <div class="logo-container">
        <img src="@/assets/img/impulsaalicante.png" alt="Impulsa Alicante" class="impulsa-logo" />
        <span class="app-logo">IMPULSEDATA</span>
      </div>
      <nav class="main-nav">
        <template v-if="usuario">
          <RouterLink to="/" class="nav-link">Inicio</RouterLink>
          <button @click="logout" class="Btn">
            <div class="sign">
              <svg viewBox="0 0 512 512">
                <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
              </svg>
            </div>
            <div class="text">Logout</div>
          </button>
        </template>
        <template v-else>
          <RouterLink to="/login" class="nav-link">Iniciar Sesión</RouterLink>
          <a href="#" @click.prevent="reloadRegistro" class="button2" :class="{ 'button2-active': estaEnRegistro }">Regístrate</a>
        </template>
      </nav>
    </div>
  </header>

  <main class="main-content">
    <RouterView />
  </main>
</template>

<style src="./assets/App.css"></style>
  