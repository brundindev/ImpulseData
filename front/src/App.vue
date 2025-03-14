<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import AuthService from './services/AuthService';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
// Mantenemos el componente por si se necesita en otras partes
import AlicanteBanner from './components/AlicanteBanner.vue';

const router = useRouter();
const auth = getAuth();
const usuario = ref(null);

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
          <a href="#" @click.prevent="reloadRegistro" class="nav-button">Regístrate</a>
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
  gap: 15px;
}

.impulsa-logo {
  height: 40px;
  width: auto;
  object-fit: contain;
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
  
  .impulsa-logo {
    height: 32px;
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

/* Estilos para el botón de logout */
.Btn {
  --black: #ff0000;
  --ch-black: #ff0000;
  --eer-black: #ff0000;
  --night-rider: #ff0000;
  --white: #ffffff;
  --af-white: #f3f3f3;
  --ch-white: #e1e1e1;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 45px;
  height: 45px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition-duration: .3s;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.199);
  background-color: var(--night-rider);
  margin-left: 10px;
}

/* plus sign */
.sign {
  width: 100%;
  transition-duration: .3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sign svg {
  width: 17px;
}

.sign svg path {
  fill: var(--af-white);
}
/* text */
.text {
  position: absolute;
  right: 0%;
  width: 0%;
  opacity: 0;
  color: var(--af-white);
  font-size: 1.2em;
  font-weight: 600;
  transition-duration: .3s;
}
/* hover effect on button width */
.Btn:hover {
  width: 125px;
  border-radius: 5px;
  transition-duration: .3s;
}

.Btn:hover .sign {
  width: 30%;
  transition-duration: .3s;
  padding-left: 20px;
}
/* hover effect button's text */
.Btn:hover .text {
  opacity: 1;
  width: 70%;
  transition-duration: .3s;
  padding-right: 10px;
}
/* button click effect*/
.Btn:active {
  transform: translate(2px ,2px);
}
</style>