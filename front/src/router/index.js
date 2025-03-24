import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import VerifyEmailView from '../views/VerifyEmailView.vue'
import CambiarPasswordView from '../views/CambiarPasswordView.vue'
import PanelControlView from '../views/PanelControlView.vue'
import WelcomeView from '../views/WelcomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: WelcomeView,
      meta: { requiresAuth: false }
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresAuth: false }
    },
    {
      path: '/registro',
      name: 'registro',
      component: RegisterView,
      meta: { requiresAuth: false }
    },
    {
      path: '/verify-email',
      name: 'verify-email',
      component: VerifyEmailView,
      meta: { requiresAuth: false }
    },
    {
      path: '/perfil',
      name: 'perfil',
      component: CambiarPasswordView,
      meta: { requiresAuth: true }
    },
    {
      path: '/panel-control',
      name: 'panel-control',
      component: PanelControlView,
      meta: { requiresAuth: true }
    }
  ],
})

// Variables para el manejo del loader
let loader = null;
let loaderStylesheet = null;

// Función para mostrar el loader
const showLoader = () => {
  // Eliminar el loader existente si hay alguno
  hideLoader(true);
  
  // Crear el elemento del loader
  loader = document.createElement('div');
  loader.style.position = 'fixed';
  loader.style.top = '0';
  loader.style.left = '0';
  loader.style.width = '100%';
  loader.style.height = '100%';
  loader.style.backgroundColor = 'white';
  loader.style.display = 'flex';
  loader.style.justifyContent = 'center';
  loader.style.alignItems = 'center';
  loader.style.zIndex = '9999';
  loader.style.transition = 'opacity 0.3s ease';
  
  // Agregar el HTML del loader exactamente como se proporcionó
  loader.innerHTML = `
    <div class="spinnerContainer">
      <div class="spinner"></div>
      <div class="loader">
        <p>cargando</p>
        <div class="words">
          <span class="word">usuarios</span>
          <span class="word">ImpulseData</span>
          <span class="word">estadísticas</span>
          <span class="word">datos</span>
          <span class="word">usuarios</span>
        </div>
      </div>
    </div>
  `;
  
  // Crear y añadir los estilos exactamente como se proporcionaron
  loaderStylesheet = document.createElement('style');
  loaderStylesheet.textContent = `
    .spinnerContainer {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .spinner {
      width: 56px;
      height: 56px;
      display: grid;
      border: 4px solid #0000;
      border-radius: 50%;
      border-right-color: #299fff;
      animation: tri-spinner 1s infinite linear;
    }
    
    .spinner::before,
    .spinner::after {
      content: "";
      grid-area: 1/1;
      margin: 2px;
      border: inherit;
      border-radius: 50%;
      animation: tri-spinner 2s infinite;
    }
    
    .spinner::after {
      margin: 8px;
      animation-duration: 3s;
    }
    
    @keyframes tri-spinner {
      100% {
        transform: rotate(1turn);
      }
    }
    
    .loader {
      color: #4a4a4a;
      font-family: "Poppins",sans-serif;
      font-weight: 500;
      font-size: 25px;
      -webkit-box-sizing: content-box;
      box-sizing: content-box;
      height: 40px;
      padding: 10px 10px;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      border-radius: 8px;
    }
    
    .words {
      overflow: hidden;
    }
    
    .word {
      display: block;
      height: 100%;
      padding-left: 6px;
      color: #299fff;
      animation: cycle-words 5s infinite;
    }
    
    @keyframes cycle-words {
      10% {
        -webkit-transform: translateY(-105%);
        transform: translateY(-105%);
      }
    
      25% {
        -webkit-transform: translateY(-100%);
        transform: translateY(-100%);
      }
    
      35% {
        -webkit-transform: translateY(-205%);
        transform: translateY(-205%);
      }
    
      50% {
        -webkit-transform: translateY(-200%);
        transform: translateY(-200%);
      }
    
      60% {
        -webkit-transform: translateY(-305%);
        transform: translateY(-305%);
      }
    
      75% {
        -webkit-transform: translateY(-300%);
        transform: translateY(-300%);
      }
    
      85% {
        -webkit-transform: translateY(-405%);
        transform: translateY(-405%);
      }
    
      100% {
        -webkit-transform: translateY(-400%);
        transform: translateY(-400%);
      }
    }
  `;
  
  // Añadir los elementos al DOM
  document.head.appendChild(loaderStylesheet);
  document.body.appendChild(loader);
};

// Función para ocultar el loader
const hideLoader = (immediate = false) => {
  // Buscar y eliminar cualquier loader existente
  const existingLoader = document.querySelector('div[style*="position: fixed"][style*="width: 100%"][style*="height: 100%"]');
  if (existingLoader) {
    if (immediate) {
      // Eliminar inmediatamente
      existingLoader.remove();
    } else {
      // Ocultar con animación
      existingLoader.style.opacity = '0';
      
      // Eliminar después de la transición
      setTimeout(() => {
        if (existingLoader.parentNode) {
          existingLoader.remove();
        }
      }, 200);
    }
  }
  
  // Eliminar también cualquier hoja de estilo del loader
  const existingStyles = document.querySelectorAll('style');
  existingStyles.forEach(style => {
    if (style.textContent.includes('spinnerContainer') || 
        style.textContent.includes('cycle-words') || 
        style.textContent.includes('tri-spinner')) {
      style.remove();
    }
  });
  
  // Limpiar las referencias
  loader = null;
  loaderStylesheet = null;
};

// Protección de rutas y mostrar loader
router.beforeEach((to, from, next) => {
  // Mostrar el loader para todas las transiciones
  showLoader();
  
  // Lógica de protección de rutas original
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = localStorage.getItem('authToken');
  
  // Si el usuario va a la ruta principal
  if (to.path === '/') {
    if (isAuthenticated) {
      next('/home');  // Si está autenticado, redirige a home
    } else {
      next();  // Si no está autenticado, muestra WelcomeView
    }
    return;
  }
  // Si estamos yendo a la página de registro o verificación, permitir siempre
  if (to.path === '/registro' || to.path === '/verify-email') {
    next();
    return;
  }
  
  // Para las otras rutas, aplicar las reglas normales
  if (requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (to.path === '/login' && isAuthenticated) {
    next('/');
  } else {
    next();
  }
});

// Ocultar loader después de la navegación
router.afterEach((to, from) => {
  // Tiempo de espera para ocultar el loader 
  // 1 segundo por defecto, 2 segundos desde login a home
  let waitTime = 500;
  
  // Si navegamos desde el login al home, aumentamos el tiempo a 2 segundos
  if (from.path === '/login' && to.path === '/home') {
    waitTime = 1000;
  }
  
  // Ocultar el loader después del tiempo especificado
  setTimeout(() => {
    hideLoader();
  }, waitTime);
});

export default router
