<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import AuthService from './services/AuthService';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

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
    console.log("Inconsistencia: Usuario Firebase presente pero no hay JWT");
    // Si estamos en la página de registro, no hacer nada para evitar interrumpir
    // el flujo de verificación de email
    if (router.currentRoute.value.path === '/registro') {
      console.log("En página de registro, no redirigir");
      return;
    }
    
    console.warn("Inconsistencia: Usuario Firebase presente pero no hay JWT");
  }
  
  // Verificar si hay token JWT y usuario de Firebase
  const userData = AuthService.getCurrentUser();
  
  console.log("Verificando estado de autenticación:");
  console.log("- Firebase User:", currentUser ? currentUser.email : "No");
  console.log("- JWT Token:", jwtToken ? "Presente" : "No");
  console.log("- User Data:", userData);
  
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
    console.log("No hay usuario autenticado o autenticación incompleta");
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
    console.log("Cambio en estado de autenticación detectado");
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