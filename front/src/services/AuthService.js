import axios from 'axios';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import FirebaseAuthService from './FirebaseAuthService';

// Configuración de base URL para todas las peticiones
// Si el backend está en un puerto distinto al frontend, hay que especificar la URL completa
const API_URL = 'http://localhost:8080/api/auth';

// Crear una instancia personalizada de axios para el servicio de autenticación
// para no afectar a otras partes de la aplicación
const authAxios = axios.create({
  baseURL: API_URL
});

// Añadir interceptor para incluir el token en cada solicitud
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Configurar el mismo interceptor para la instancia personalizada
authAxios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta global
axios.interceptors.response.use(
  response => response,
  error => {
    // No mostrar errores 401 en la consola del navegador
    if (!(error.response && error.response.status === 401)) {
      console.error('Error en respuesta HTTP:', error);
    }
    
    if (error.response && error.response.status === 401) {
      // Si recibimos un 401 Unauthorized, cerramos la sesión
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      
      // Solo redirigir si no estamos ya en la página de login
      const currentPath = window.location.pathname;
      if (currentPath !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Interceptor para la instancia personalizada - silencia completamente errores 401
authAxios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Silenciar completamente los errores de credenciales incorrectas
      // No mostrar en consola
      
      // Limpiar datos de autenticación
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      
      // Solo redirigir si no estamos ya en la página de login
      const currentPath = window.location.pathname;
      if (currentPath !== '/login') {
        window.location.href = '/login';
      }
    } else {
      // Para otros errores, mantener el comportamiento normal
      console.error('Error en respuesta HTTP:', error);
    }
    return Promise.reject(error);
  }
);

class AuthService {
  /**
   * Iniciar sesión
   * @param {object} credentials - Credenciales (email, password)
   * @returns {Promise} - Token JWT
   */
  async login(credentials) {
    try {
      console.log("Iniciando proceso de login con credenciales:", credentials.email);
      
      // Detectar si estamos haciendo login con una cuenta de Google
      const isGoogleAuth = credentials.password && credentials.password.startsWith('google-auth-');
      if (isGoogleAuth) {
        console.log("Detectado inicio de sesión para usuario de Google");
        
        // Almacenar el UID para posibles recuperaciones de sesión
        const uid = credentials.password.replace('google-auth-', '');
        if (uid) {
          sessionStorage.setItem('firebaseUid', uid);
          console.log("UID de Google almacenado para recuperación de sesión:", uid);
        }
      }
      
      // Usar la instancia personalizada de axios para el login
      console.log("Enviando solicitud de login al backend:", `${API_URL}/login`);
      const response = await authAxios.post('/login', credentials);
      
      if (!response.data) {
        throw new Error('No se recibió token JWT del servidor');
      }
            
      // Guardar el token JWT y los datos de usuario
      localStorage.setItem('authToken', response.data);
      this.storeUserDataFromToken(response.data);
      
      // Para usuarios de Google, verificar si ya están autenticados con Firebase
      const currentUser = auth.currentUser;
      if (isGoogleAuth) {
        if (currentUser) {
          // Si ya hay sesión de Firebase, verificar si es el mismo usuario
          if (currentUser.email === credentials.email) {
            console.log("Ya existe sesión en Firebase con el mismo usuario:", currentUser.email);
          } else {
            console.log("Existe sesión en Firebase pero con un usuario diferente. Actualizando...");
            // Cerrar sesión primero y luego iniciar con el nuevo usuario
            try {
              await signOut(auth);
              // No iniciamos sesión automáticamente, se manejará en el siguiente paso
            } catch (signOutError) {
              console.warn("Error al cerrar sesión previa:", signOutError);
            }
          }
        } else {
          console.log("No hay sesión activa en Firebase para el usuario de Google");
        }
      } else if (!isGoogleAuth && !currentUser) {
        // Para usuarios normales, si no hay sesión en Firebase, iniciarla
        console.log("Iniciando sesión en Firebase");
        const firebaseUser = await FirebaseAuthService.login(credentials.email, credentials.password);
        console.log("Usuario autenticado en Firebase:", firebaseUser.email);
      } else if (currentUser) {
        console.log("Ya existe sesión en Firebase:", currentUser.email);
      }
            
      // Disparar evento para actualizar la interfaz
      window.dispatchEvent(new CustomEvent('auth-state-changed'));
      
      return response.data;
    } catch (error) {
      console.error("Error en proceso de login:", error);
      
      // Limpiar cualquier dato temporal
      sessionStorage.removeItem('attemptedRecovery');
      
      throw error;
    }
  }

  /**
   * Registrar un nuevo usuario
   * @param {object} user - Datos del usuario (nombre, email, password)
   * @returns {Promise} - Token JWT
   */
  async register(user) {
    try {
      console.log("Iniciando proceso de registro con datos:", user.email);
      
      // Detectar si estamos registrando una cuenta de Google
      const isGoogleAuth = user.password && user.password.startsWith('google-auth-');
      if (isGoogleAuth) {
        console.log("Detectado registro para usuario de Google");
        
        // Almacenar el UID para posibles recuperaciones de sesión
        const uid = user.password.replace('google-auth-', '');
        if (uid) {
          sessionStorage.setItem('firebaseUid', uid);
          console.log("UID de Google almacenado para recuperación de sesión:", uid);
        }
        
        // Para usuarios de Google, primero verificar si ya existe intentando login
        try {
          console.log("Verificando si el usuario de Google ya existe...");
          const loginResponse = await this.login({
            email: user.email,
            password: user.password
          });
          
          return loginResponse; // Retornar el token de login
        } catch (loginError) {
          console.log("Usuario de Google no existe, continuando con registro");
          // Si el login falla, continuamos con el registro
        }
      }
      
      console.log("Enviando solicitud de registro al backend:", `${API_URL}/registro`);
      
      // Primero registramos en Firebase (esto ya debería estar manejado en RegisterView)
      // Y luego registramos en el backend
      const response = await axios.post(`${API_URL}/registro`, user);
      
      console.log("Respuesta del backend:", response.status, response.statusText);
      
      if (response.data) {
        // Para usuarios de Google, guardar el token JWT inmediatamente ya que no necesitan verificación
        if (isGoogleAuth) {
          console.log("Autenticando usuario de Google inmediatamente ya que están verificados");
          localStorage.setItem('authToken', response.data);
          this.storeUserDataFromToken(response.data);
          
          // Disparar evento para actualizar la interfaz
          window.dispatchEvent(new CustomEvent('auth-state-changed'));
        } else {
          // NO guardar el token automáticamente en registro normal
          // Lo guardaremos después de que el usuario verifique su email
          console.log("Token JWT recibido pero no almacenado todavía (pendiente de verificación)");
          
          // Guardar temporalmente para recuperación
          sessionStorage.setItem('tempAuthToken', response.data);
        }
        
        console.log("Registro completado exitosamente");
      }
      return response.data;
    } catch (error) {
      console.error("ERROR COMPLETO DE REGISTRO:", error);
      
      // Manejo especial para usuarios de Google
      if (user.password && user.password.startsWith('google-auth-')) {
        console.error("Error detallado de registro con Google:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message
        });
        
        // Si el error es 401 o contiene mensajes de "ya existe", intentar login
        if (error.response?.status === 401 || 
            (error.response?.data && typeof error.response.data === 'string' && 
             error.response.data.includes('ya existe'))) {
          
          console.log("Usuario parece ya existir, intentando login directo...");
          try {
            const loginResponse = await this.login({
              email: user.email,
              password: user.password
            });
            
            console.log("Login exitoso después de error de registro");
            return loginResponse;
          } catch (loginError) {
            console.error("Login también falló después de error de registro:", loginError);
            throw error; // Relanzar el error original si login también falla
          }
        }
      }
      
      throw error;
    }
  }

  /**
   * Cerrar sesión
   */
  async logout() {
    try {
      // Cerrar sesión en Firebase
      await signOut(auth);
      
      // Limpiar datos de sesión
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      sessionStorage.clear();
      
      // Limpiar caché de autenticación
      this.currentUser = null;
      
      console.log("Sesión cerrada correctamente y datos de usuario eliminados");
      return true;
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      throw error;
    }
  }

  /**
   * Verificar si el usuario está autenticado
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  }

  /**
   * Obtener el token JWT
   * @returns {string|null}
   */
  getToken() {
    return localStorage.getItem('authToken');
  }

  /**
   * Obtener datos del usuario actual
   * @returns {object|null}
   */
  getCurrentUser() {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Almacena los datos del usuario extrayéndolos del token JWT
   * @param {string} token - Token JWT
   */
  storeUserDataFromToken(token) {
    try {
      // Extraer la parte del payload del JWT (segunda parte)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      // Convertir el payload a un objeto JSON
      const payload = JSON.parse(jsonPayload);
      
      // Almacenar la información del usuario
      localStorage.setItem('userData', JSON.stringify({
        nombre: payload.nombre || payload.sub.split('@')[0], // Usar el nombre si está disponible, o extraerlo del email
        email: payload.sub
      }));
    } catch (error) {
      console.error('Error al decodificar el token JWT', error);
    }
  }
}

export default new AuthService(); 