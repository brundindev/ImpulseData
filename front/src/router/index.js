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

// Protección de rutas
router.beforeEach((to, from, next) => {
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

export default router
