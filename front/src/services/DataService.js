// front/src/services/DataService.js

import { ref } from 'vue';
import { getAuth } from 'firebase/auth';
import AuthService from './AuthService';
import FirestoreService from './FirestoreService';
import FirebaseAuthService from './FirebaseAuthService';
import router from '../../router';  // Ajusta la ruta si tu router está en otro lugar

// Estados reactivos exportados
export const cargando = ref(false);
export const error = ref(null);
export const empresas = ref([]);
export const empresasCount = ref(0);
export const departamentosCount = ref(0);
export const centrosCount = ref(0);
export const formacionesCount = ref(0);

const auth = getAuth();

/**
 * Cargar datos desde Firestore
 */
export async function cargarDatos() {
  try {
    cargando.value = true;
    error.value = null;
    
    // Limpiar datos previos para evitar mostrar datos de otro usuario
    empresas.value = [];
    
    // Verificar doble autenticación (Firebase y JWT)
    const user = auth.currentUser;
    const jwtToken = localStorage.getItem('authToken');
    const userData = AuthService.getCurrentUser();
    
    console.log("Estado de autenticación:", {
      "Firebase auth": user ? "Activo" : "Inactivo",
      "JWT": jwtToken ? "Presente" : "Ausente", 
      "userData": userData
    });
    
    // Si hay JWT pero no hay usuario Firebase, intentar iniciar sesión con Firebase
    if (!user && jwtToken && userData) {
      console.warn("HomeView - Hay JWT pero no hay sesión en Firebase. Intentando recuperar sesión...");
      try {
        await FirebaseAuthService.reautenticar();
        const userAfterReauth = auth.currentUser;
        if (userAfterReauth) {
          setTimeout(() => cargarDatos(), 500);
          return;
        }
      } catch (err) {
        console.error("Error al recuperar sesión Firebase:", err);
      }
    }
    
    // Si no hay usuario Firebase pero sí hay JWT, continuar con JWT
    if (!user && jwtToken) {
      console.log("Continuando con JWT sin autenticación de Firebase");
      try {
        // Obtener contadores
        const contadores = await FirestoreService.obtenerContadores();
        empresasCount.value      = parseInt(contadores.empresasCount)     || 0;
        departamentosCount.value = parseInt(contadores.departamentosCount) || 0;
        centrosCount.value       = parseInt(contadores.centrosCount)       || 0;
        formacionesCount.value   = parseInt(contadores.formacionesCount)   || 0;
        
        // Obtener empresas usando solo el JWT
        const empresasRecibidas = await FirestoreService.obtenerEmpresas();
        empresas.value = empresasRecibidas;
        
        cargando.value = false;
        return;
      } catch (err) {
        console.error("Error al cargar datos con solo JWT:", err);
      }
    }
    
    // Si no hay token JWT, redirigir al login
    if (!jwtToken) {
      console.error("HomeView - No hay JWT");
      error.value = 'No se pudo verificar tu autenticación. Por favor, inicia sesión de nuevo.';
      cargando.value = false;
      setTimeout(() => {
        router.push('/login');
      }, 2000);
      return;
    }
    
    // Flujo normal: obtención de contadores y empresas
    const contadores = await FirestoreService.obtenerContadores();
    empresasCount.value      = parseInt(contadores.empresasCount)     || 0;
    departamentosCount.value = parseInt(contadores.departamentosCount) || 0;
    centrosCount.value       = parseInt(contadores.centrosCount)       || 0;
    formacionesCount.value   = parseInt(contadores.formacionesCount)   || 0;
    
    // Obtener empresas
    const empresasRecibidas = await FirestoreService.obtenerEmpresas();
    if (user) {
      empresas.value = empresasRecibidas.filter(empresa => {
        const pertenece = empresa.creadoPor === user.uid;
        if (!pertenece) {
          console.warn(`⚠️ Empresa ajena detectada: ${empresa.nombre}`);
        }
        return pertenece;
      });
    } else {
      // Sin usuario Firebase, confiar en filtrado backend
      empresas.value = empresasRecibidas;
    }
    
  } catch (err) {
    console.error("Error al cargar datos en DataService:", err);
    error.value = 'No se pudieron cargar los datos. Por favor, inténtalo de nuevo.';
  } finally {
    cargando.value = false;
  }
}
