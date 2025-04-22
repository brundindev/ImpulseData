<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import AuthService from './services/AuthService';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import FirebaseAuthService from './services/FirebaseAuthService';
import ChatbotAssistant from './components/ChatbotAssistant.vue';

const router = useRouter();
const auth = getAuth();
const usuario = ref(null);
const showDropdown= ref(false);
const userPhoto = ref('');
const userInitials = computed(() => {
  if (!usuario.value || !usuario.value.nombre) return '?';
  return usuario.value.nombre
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
});

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
  
  // Actualizar la foto de perfil si el usuario de Firebase existe
  if (currentUser && currentUser.photoURL) {
    userPhoto.value = currentUser.photoURL;
  } else {
    userPhoto.value = '';
  }
  
  // Sincronizar datos de Firebase con localStorage si hay usuario autenticado
  if (currentUser && jwtToken) {
    // Obtener datos actuales del localStorage
    let userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const firebaseName = currentUser.displayName;
    
    // Si el nombre en Firebase es diferente al de localStorage, actualizamos
    if (firebaseName && userData.nombre !== firebaseName) {
      console.log(`Actualizando nombre en localStorage: ${userData.nombre} -> ${firebaseName}`);
      userData.nombre = firebaseName;
      userData.displayName = firebaseName;
      localStorage.setItem('userData', JSON.stringify(userData));
      
      // Actualizar también en 'user' si existe
      try {
        if (localStorage.getItem('user')) {
          let userObj = JSON.parse(localStorage.getItem('user'));
          userObj.nombre = firebaseName;
          userObj.displayName = firebaseName;
          localStorage.setItem('user', JSON.stringify(userObj));
        }
      } catch (e) {
        console.error('Error al actualizar user en localStorage:', e);
      }
    }
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
    
    // Comprobar si estamos en las rutas de login o registro
    const isLoginPage = router.currentRoute.value.path === '/login';
    const isRegisterPage = router.currentRoute.value.path === '/registro';
    
    // No interferir con el proceso de inicio de sesión o registro
    if (isLoginPage || isRegisterPage) {
      // Si estamos en login o registro, no hacer nada y permitir que esas vistas manejen la autenticación
      console.log("En página de autenticación, permitiendo que el flujo continúe normalmente");
      return;
    }
    
    // Intentar una vez más recuperar la sesión
    try {
      const hasTriedRecovery = sessionStorage.getItem('attemptedRecovery');
      if (!hasTriedRecovery) {
        sessionStorage.setItem('attemptedRecovery', 'true');
        const loginData = {
          email: currentUser.email,
          password: `google-auth-${currentUser.uid}`
        };
        
        console.log("Intentando recuperar sesión JWT...");
        // Intentar iniciar sesión para obtener el JWT
        await AuthService.login(loginData);
        usuario.value = AuthService.getCurrentUser();
        sessionStorage.removeItem('attemptedRecovery');
        console.log("Sesión JWT recuperada correctamente");
        return;
      }
      
      console.log("No se pudo recuperar la sesión JWT, cerrando sesión...");
      // Marcar explícitamente que estamos cerrando sesión
      sessionStorage.setItem('cerrando_sesion', 'true');
      await AuthService.logout();
      usuario.value = null;
      
      // Esperar un breve momento antes de continuar
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Quitar la marca de cierre de sesión
      sessionStorage.removeItem('cerrando_sesion');
      
      // Redirigir a la bienvenida
      router.push('/');
    } catch (error) {
      console.log("Error al recuperar sesión, cerrando sesión");
      sessionStorage.removeItem('cerrando_sesion');
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
      router.push('/');
    }
  }
};

// Configurar listener para cambios de autenticación
onMounted(async () => {
  // Configurar observer para eventos de autenticación de Firebase
  auth.onAuthStateChanged(async (user) => {
    console.log(user ? "Firebase: Usuario autenticado" : "Firebase: No hay usuario autenticado");
    await actualizarEstadoUsuario();
  });
  
  // Escuchar eventos personalizados para cambios en la autenticación
  window.addEventListener('auth-state-changed', async () => {
    console.log("Evento personalizado de cambio de estado de autenticación detectado");
    await actualizarEstadoUsuario();
  });
  
  // Inicializar estado del usuario
  await actualizarEstadoUsuario();
});

onUnmounted(() => {
  // Limpiar event listener cuando el componente se desmonta
  window.removeEventListener('auth-state-changed', actualizarEstadoUsuario);
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
    router.push('/');
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

const mostrarChatbot = computed(() => {
  const rutaActual = router.currentRoute.value.path;
  const rutasPublicas = ['/', '/login', '/registro'];
  
  return usuario.value && !rutasPublicas.includes(rutaActual);
});

</script>

<template>
  <header class="app-header navbar-container">
    <div class="header-container">
      <div class="logo-container">
        <img src="@/assets/img/impulsedata_logo.png" alt="Impulsa Alicante" class="impulsa-logo" />
        <RouterLink to="/" class="app-logo">IMPULSEDATA</RouterLink>
      </div>
      <nav class="main-nav">
        <template v-if="usuario">
          <RouterLink to="/home" class="nav-link">Inicio</RouterLink>
          <div class="user-dropdown">
            <div class="dropdown-toggle">
              <div class="user-profile-container">
                <div class="user-avatar">
                  <img v-if="userPhoto" :src="userPhoto" alt="Foto de perfil" class="user-avatar-img" />
                  <div v-else class="user-avatar-placeholder">{{ userInitials }}</div>
                </div>
                <span class="user-name">{{ usuario?.nombre || 'Usuario' }}</span>
              </div>
              <span class="dropdown-arrow">▼</span>         
            </div>
            <div class="dropdown-menu" v-if="showDropdown">
              <router-link to="/perfil" class="dropdown-item">
                <i class="fas fa-user dropdown-icon"></i> Mi Perfil
              </router-link>
              <router-link to="/panel-control" class="dropdown-item">
                <i class="fas fa-tachometer-alt dropdown-icon"></i> Panel de Control
              </router-link>
              <router-link to="/soporte" class="dropdown-item">
                <i class="fas fa-question-circle dropdown-icon"></i> Soporte Técnico
              </router-link>
              <a href="#" class="dropdown-item logout-item" @click.prevent="logout">
                <i class="fas fa-sign-out-alt dropdown-icon"></i> Cerrar Sesión
              </a>
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
    <ChatbotAssistant v-if="mostrarChatbot" />
  </main>
</template>

<style src="./assets/App.css">
</style>

<style>
.main-content {
  overflow-y: auto !important;
  min-height: 100vh;
  position: relative;
  scrollbar-width: thin;
  scrollbar-color: #004698 #f1f1f1;
  padding-bottom: 4rem;
}
body, html {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow-x: hidden; /* Solo oculta overflow horizontal */
  overflow-y: auto; /* Permite scroll vertical */
}

.main-content::-webkit-scrollbar {
  width: 8px;
}

.main-content::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.main-content::-webkit-scrollbar-thumb {
  background: #004698;
  border-radius: 4px;
}

.welcome-page {
  overflow: hidden !important;
  min-height: 100vh;
}

body, html {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden !important;
}
</style>