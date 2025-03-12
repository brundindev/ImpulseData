import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import VerificarEmailView from '../views/VerificarEmailView.vue'
import VerifyEmailView from '../views/VerifyEmailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: false } //para que no pida iniciar sesion (por mientras)
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
      path: '/verificar-email',
      name: 'verificar-email',
      component: VerificarEmailView,
      meta: { requiresAuth: false }
    },
    {
      path: '/verify-email',
      name: 'verify-email',
      component: VerifyEmailView,
      meta: { requiresAuth: false }
    }
  ],
})

// Protección de rutas
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = localStorage.getItem('authToken');
  
  if (requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (to.path === '/login' && isAuthenticated) {
    next('/');
  } else {
    next();
  }
});

export default router
