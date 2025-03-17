<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import AuthService from './services/AuthService';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import FirebaseAuthService from './services/FirebaseAuthService';

const router = useRouter();
const auth = getAuth();
const usuario = ref(null);
const showDropdown= ref(false);

// Verificar si estamos en la ruta de registro
const estaEnRegistro = computed(() => {
  return router.currentRoute.value.path === '/registro';
});

// Función para cerrar el dropdown cuando se hace clic fuera de él
const closeDropdown = (event) => {
  if (!event.target.closest('.user-dropdown')) {
    showDropdown.value = false;
  }
};

// Función para actualizar el estado del usuario
const actualizarEstadoUsuario = async () => {
  const jwtToken = localStorage.getItem('authToken');
  const currentUser = auth.currentUser;
  const cerrando = sessionStorage.getItem('cerrando_sesion');
  
  // Si estamos en proceso de cierre de sesión, no hacer nada
  if (cerrando === 'true') {
    console.log("Detectado cierre de sesión en progreso, ignorando cambios de estado de autenticación");
    return;
  }
  
  // Si hay usuario de Firebase pero no token JWT, es posible que sea un nuevo registro
  // o un problema de sincronización
  if (currentUser && !jwtToken) {
    // Si estamos en la página de registro, no hacer nada para evitar interrumpir
    // el flujo de verificación de email
    if (router.currentRoute.value.path === '/registro') {
      return;
    }
    
    console.log("Detectada inconsistencia: Usuario Firebase presente pero no hay JWT");
    
    // Intentar recuperar la sesión si tenemos datos del usuario
    const storedUid = sessionStorage.getItem('firebaseUid');
    if (storedUid && storedUid === currentUser.uid) {
      // Aquí podríamos intentar hacer login con el backend usando el email y password de Google
      try {
        const loginData = {
          email: currentUser.email,
          password: `google-auth-${currentUser.uid}`
        };
        
        // Intentar iniciar sesión para obtener el JWT
        await AuthService.login(loginData);
        usuario.value = AuthService.getCurrentUser();
        console.log("Sesión recuperada exitosamente");
        return; // Si se logró recuperar la sesión, salimos
      } catch (loginError) {
        console.log("No se pudo recuperar la sesión automáticamente");
      }
    }
  }
  
  // Verificar si hay token JWT y usuario de Firebase
  const userData = AuthService.getCurrentUser();
  
  // Si hay inconsistencia entre Firebase y JWT, intentar resolver
  if (!currentUser && jwtToken && userData) {
    console.log("Sesión activa con JWT pero no con Firebase - Manteniendo sesión con JWT");
    // En este caso mantenemos la sesión basada en el JWT
    usuario.value = userData;
    
    // Intentar recuperar sesión de Firebase si tenemos el email
    // Solo si no se ha intentado recientemente
    if (userData.email && !sessionStorage.getItem('reautenticacionFallida')) {
      try {
        // No forzamos cierre de sesión, solo intentamos recuperar
        await FirebaseAuthService.reautenticar();
      } catch (reAuthError) {
        console.log("No se pudo recuperar sesión de Firebase, se mantiene con JWT");
      }
    }
    
    // Si estamos en una ruta que necesita firebase, recargar la página para intentar sincronizar
    const requiresFirebase = router.currentRoute.value.path === '/';
    if (requiresFirebase) {
      // Solo recargamos si no hemos recargado recientemente (evitamos loop infinito)
      const lastReload = sessionStorage.getItem('lastReload');
      const now = Date.now();
      if (!lastReload || (now - parseInt(lastReload)) > 10000) { // 10 segundos
        sessionStorage.setItem('lastReload', now.toString());
        window.location.reload();
      } else {
        // Si ya hemos recargado recientemente, mantenemos la sesión basada en JWT
        console.log("Se mantiene la sesión basada en JWT");
      }
    }
    return;
  }
  
  // Si el usuario de Firebase existe pero no hay JWT, intentar una vez más 
  // recuperar la sesión antes de cerrar
  if (currentUser && !jwtToken) {
    console.log("Detectada inconsistencia: Usuario Firebase presente pero no hay JWT");
    
    // Intentar una vez más recuperar la sesión
    try {
      const hasTriedRecovery = sessionStorage.getItem('attemptedRecovery');
      if (!hasTriedRecovery) {
        sessionStorage.setItem('attemptedRecovery', 'true');
        const loginData = {
          email: currentUser.email,
          password: `google-auth-${currentUser.uid}`
        };
        
        // Intentar iniciar sesión para obtener el JWT
        await AuthService.login(loginData);
        usuario.value = AuthService.getCurrentUser();
        sessionStorage.removeItem('attemptedRecovery');
        console.log("Sesión JWT recuperada correctamente");
        return;
      }
      
      await AuthService.logout();
      usuario.value = null;
      router.push('/login');
    } catch (error) {
      console.log("Error al recuperar sesión, cerrando sesión");
    }
    return;
  }
  
  // Actualizar estado según lo que tengamos
  if (currentUser && jwtToken && userData) {
    usuario.value = userData;
    console.log("Sesión activa y sincronizada correctamente");
  } else {
    usuario.value = null;
    
    // Verificar si estamos en una ruta protegida
    const requiresAuth = router.currentRoute.value.meta.requiresAuth;
    if (requiresAuth) {
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
    // Indicar que estamos en proceso de cierre de sesión
    sessionStorage.setItem('cerrando_sesion', 'true');
    
    // Limpiar datos locales
    usuario.value = null;
    showDropdown.value= false;
    
    // Asegurarnos de limpiar todos los datos relacionados
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    sessionStorage.removeItem('firebaseUid');
    sessionStorage.removeItem('attemptedRecovery');
    sessionStorage.removeItem('lastReload');
    
    // Cerrar sesión en Firebase y backend
    await AuthService.logout();
    
    console.log("Sesión cerrada correctamente y datos de usuario eliminados");
    
    // Disparar evento para actualizar toda la aplicación
    window.dispatchEvent(new CustomEvent('auth-state-changed'));
    
    // Esperar un momento antes de redirigir
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Quitar la marca de cierre de sesión
    sessionStorage.removeItem('cerrando_sesion');
    
    // Redirigir al login
    router.push('/login');
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    sessionStorage.removeItem('cerrando_sesion');
  }
};

// Función para recargar la página de registro o navegar a ella
const reloadRegistro = () => {
  if (router.currentRoute.value.path === '/registro') {
    window.location.reload();
  } else {
    router.push('/registro');
  }
};

const irAPerfil = () => {
  showDropdown.value = false;
  router.push('/perfil');
};

const irAPanelControl = () => {
  showDropdown.value = false;
  router.push('/panel-control');
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
          <div class="user-dropdown">
            <div class="dropdown-toggle">
              <span class="user-name">{{ usuario.nombre }}</span>
              <span class="dropdown-arrow">▼</span>         
            </div>
            <div class="dropdown-menu">
              <RouterLink to="/perfil" class="dropdown-item">
                <svg class="dropdown-icon" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
                </svg>
                Mi Perfil
              </RouterLink>
              <RouterLink to="/panel-control" class="dropdown-item">
                <svg class="dropdown-icon" viewBox="0 0 24 24">
                  <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"></path>
                </svg>
                Panel de Control
              </RouterLink>
              <div class="dropdown-item logout-item" @click="logout">
                <svg class="dropdown-icon" viewBox="0 0 24 24">
                  <path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"></path>
                </svg>
                Cerrar Sesión
              </div>
            </div>
          </div>
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

<style src="./assets/App.css">
</style>