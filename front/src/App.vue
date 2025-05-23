<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import AuthService from './services/AuthService';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import FirebaseAuthService from './services/FirebaseAuthService';
import ChatbotAssistant from './components/ChatbotAssistant.vue';
import CookieConsent from '@/components/CookieConsent.vue';
import FirestoreService from './services/FirestoreService';
import { ensureGlobalCompanyForAllUsers } from './utils/globalStorage';

const router = useRouter();
const auth = getAuth();
const usuario = ref(null);
const showDropdown= ref(false);
const userPhoto = ref('');
const userEmail = ref('');
const isScrolled = ref(false);
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

// Verificar si estamos en la página de bienvenida
const estaEnWelcome = computed(() => {
  return router.currentRoute.value.path === '/';
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
    userEmail.value = currentUser.email || userData.email || '';
    console.log("Sesión activa y sincronizada correctamente");
  } else {
    usuario.value = null;
    userEmail.value = '';
    
    // Verificar si estamos en una ruta protegida
    const requiresAuth = router.currentRoute.value.meta.requiresAuth;
    if (requiresAuth) {
      router.push('/');
    }
  }
};

// Función para detectar scroll
const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

// Configurar listener para cambios de autenticación
onMounted(async () => {
  // Configurar observer para eventos de autenticación de Firebase
  auth.onAuthStateChanged(async (user) => {
    console.log(user ? "Firebase: Usuario autenticado" : "Firebase: No hay usuario autenticado");
    await actualizarEstadoUsuario();
    
    // Si hay usuario autenticado, verificar y crear empresa global compartida
    if (user) {
      try {
        console.log("Verificando empresa global compartida para todos los usuarios...");
        
        // Usar sistema unificado para garantizar empresa global
        const isGlobalCompanyAvailable = await ensureGlobalCompanyForAllUsers();
        
        if (isGlobalCompanyAvailable) {
          console.log("🌍 Empresa global disponible y compartida para todos los usuarios");
        } else {
          console.warn("⚠️ Problemas con la empresa global, intentando métodos alternativos...");
          
          // Plan B: Método tradicional
          const empresaId = await FirestoreService.crearEmpresaPorDefecto();
          
          if (empresaId) {
            console.log("✅ Empresa global disponible con ID:", empresaId);
          } else {
            console.error("❌ No se pudo verificar/crear la empresa global con método estándar");
            
            // Plan C: Método directo
            console.log("Intentando crear empresa global directamente...");
            const empresaIdDirecto = await FirestoreService.crearEmpresaPorDefectoGlobal();
            
            if (empresaIdDirecto) {
              console.log("✅ Empresa global creada directamente con ID:", empresaIdDirecto);
            } else {
              console.error("⚠️ No se pudo crear la empresa global por ningún método");
            }
          }
        }
      } catch (error) {
        console.error("Error al verificar empresa global:", error);
      }
    }
  });
  
  // Escuchar eventos personalizados para cambios en la autenticación
  window.addEventListener('auth-state-changed', async () => {
    console.log("Evento personalizado de cambio de estado de autenticación detectado");
    await actualizarEstadoUsuario();
  });
  
  // Inicializar estado del usuario
  await actualizarEstadoUsuario();

  // Agregar event listener para cerrar el dropdown
  document.addEventListener('click', closeDropdown);
  
  // Agregar event listener para detectar scroll
  window.addEventListener('scroll', handleScroll);
  
  // Ejecutar inicialmente para establecer el estado correcto
  handleScroll();
});

onUnmounted(() => {
  // Limpiar event listener cuando el componente se desmonta
  document.removeEventListener('click', closeDropdown);
  window.removeEventListener('auth-state-changed', actualizarEstadoUsuario);
  window.removeEventListener('scroll', handleScroll);
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
  <header class="app-header navbar-container" :class="{ 'navbar-scrolled': isScrolled }" v-if="!estaEnWelcome">
    <div class="header-container">
      <div class="logo-container">
        <img src="@/assets/img/logo_impulsedata.jpg" alt="Impulsa Alicante" class="impulsa-logo" />
        <RouterLink to="/" class="app-logo">IMPULSEDATA</RouterLink>
      </div>
      <nav class="main-nav">
        <template v-if="usuario">
          <RouterLink to="/home" class="nav-link">Inicio</RouterLink>
          <RouterLink to="/descargar-app" class="nav-link">Descargar App</RouterLink>
          <div class="user-dropdown" @mouseenter="showDropdown = true" @mouseleave="showDropdown = false">
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
            <div class="dropdown-menu" v-show="showDropdown">
              <router-link to="/perfil" class="dropdown-item">
                <i class="fas fa-user dropdown-icon"></i> Mi Perfil
              </router-link>
              <router-link to="/panel-control" class="dropdown-item">
                <i class="fas fa-tachometer-alt dropdown-icon"></i> Panel de Control
              </router-link>
              <router-link to="/soporte" class="dropdown-item">
                <i class="fas fa-question-circle dropdown-icon"></i> Soporte Técnico
              </router-link>
              <router-link v-if="userEmail === 'brundindev@gmail.com' || userEmail === 'adrianreynauclaramunt2@gmail.com'" to="/admin/soporte" class="dropdown-item">
                <i class="fas fa-headset dropdown-icon"></i> Panel de Soporte
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
          <RouterLink to="/descargar-app" class="nav-link">Descargar App</RouterLink>
          <RouterLink to="/login" class="nav-link">Iniciar Sesión</RouterLink>
          <a href="#" @click.prevent="reloadRegistro" class="button2" :class="{ 'button2-active': estaEnRegistro }">Regístrate</a>
        </template>
      </nav>
    </div>
  </header>

  <main class="main-content" :class="{ 'fullscreen-welcome': estaEnWelcome }">
    <RouterView />
    <ChatbotAssistant v-if="mostrarChatbot" />
    <CookieConsent />
  </main>
</template>

<style src="./assets/App.css">
</style>

<style>
:root {
  --primary-color: #9c27b0;
  --accent-color: #e91e63;
  --warning-color: #ffc107;
  --danger-color: #f44336;
  --success-color: #8e24aa;
  --text-color: #212121;
  --text-secondary: #757575;
  --background-color: transparent;
  --card-background: #ffffff;
  --border-color: #e0e0e0;
  --box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Sistema de scrollbar invisible pero funcional */
html {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

html::-webkit-scrollbar {
  width: 0;
  display: none;
}

body::-webkit-scrollbar {
  width: 0;
  display: none;
}

* {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

*::-webkit-scrollbar {
  width: 0;
  display: none;
}

/* Resto de estilos globales */
.main-content {
  flex: 1;
  width: 100%;
  min-height: calc(100vh - 60px);
  position: relative;
  z-index: 1;
  background: transparent !important;
}

body, html {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto !important;
}

/* Aplicar overflow:hidden solo a la página de bienvenida y no afectar el resto */
.welcome-page {
  overflow: hidden !important;
  min-height: 100vh;
  background: transparent !important;
}

/* Remover la regla global que causaba el problema */
body.welcome-open {
  overflow: hidden !important;
  position: fixed;
  width: 100%;
  height: 100%;
}

/* El resto de las páginas debe tener scroll normal */
body:not(.welcome-open) {
  overflow-y: auto !important;
  height: auto !important;
  position: static !important;
}

#app {
  min-height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  background: transparent !important;
}

main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: transparent !important;
}

/* Asegurarse de que el contenido ocupe todo el espacio disponible */
.container-fluid {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: transparent !important;
}

/* Estilos para el fondo del dashboard */
.dashboard-background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #2a1b3d 0%, #44318d 100%);
  z-index: -1;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  width: 200px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.12);
  padding: 8px 0;
  z-index: 100;
  margin-top: 5px;
  border: 1px solid #eaeaea;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
}

.user-dropdown:hover .dropdown-menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.fullscreen-welcome {
  padding: 0 !important;
  margin: 0 !important;
  height: 100vh !important;
  width: 100vw !important;
  min-height: 100vh !important;
  max-height: 100vh !important;
  overflow: hidden !important;
}

.user-name {
  color: #000000 !important;
  font-weight: 600;
}

.user-name:hover {
  color: #000000 !important;
}

.transparent-header .user-name,
.app-header .user-name,
.user-profile-container .user-name,
.dropdown-toggle .user-name {
  color: #000000 !important;
}

.transparent-header .user-name:hover,
.app-header .user-name:hover,
.user-profile-container .user-name:hover,
.dropdown-toggle .user-name:hover {
  color: #000000 !important;
}
</style>