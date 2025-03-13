import axios from 'axios';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import FirebaseAuthService from './FirebaseAuthService';

// Configuración de base URL para todas las peticiones
// Si el backend está en un puerto distinto al frontend, hay que especificar la URL completa
const API_URL = 'http://localhost:8080/api/auth';

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

// Interceptor para manejar errores de respuesta
axios.interceptors.response.use(
  response => response,
  error => {
    console.error('Error en respuesta HTTP:', error);
    if (error.response && error.response.status === 401) {
      // Si recibimos un 401 Unauthorized, cerramos la sesión
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      window.location.href = '/login';
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
      
      // Primero autenticamos con el backend para obtener el JWT
      const response = await axios.post(`${API_URL}/login`, credentials);
      
      if (!response.data) {
        throw new Error('No se recibió token JWT del servidor');
      }
      
      // Guardar el token JWT y los datos de usuario
      localStorage.setItem('authToken', response.data);
      this.storeUserDataFromToken(response.data);
      
      // Ahora autenticamos con Firebase (o verificamos si ya está autenticado)
      if (!auth.currentUser) {
        console.log("Iniciando sesión en Firebase");
        const firebaseUser = await FirebaseAuthService.login(credentials.email, credentials.password);
        console.log("Usuario autenticado en Firebase:", firebaseUser.email);
      } else {
        console.log("Ya existe sesión en Firebase:", auth.currentUser.email);
      }
      
      console.log("Login completado exitosamente en ambos sistemas");
      
      // Disparar evento para actualizar la interfaz
      window.dispatchEvent(new CustomEvent('auth-state-changed'));
      
      return response.data;
    } catch (error) {
      console.error("Error durante el proceso de login:", error);
      
      // Limpiar cualquier estado parcial
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      
      // Si hay error específico de Firebase, manejarlo
      if (error.code) {
        switch (error.code) {
          case 'auth/user-not-found':
            throw new Error('No se encontró ningún usuario con este correo electrónico');
          case 'auth/wrong-password':
            throw new Error('La contraseña es incorrecta');
          case 'auth/too-many-requests':
            throw new Error('Se han realizado demasiados intentos. Por favor, espera unos minutos');
          case 'auth/user-disabled':
            throw new Error('Esta cuenta ha sido deshabilitada');
          default:
            throw error;
        }
      }
      
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
      
      // Primero registramos en Firebase (esto ya debería estar manejado en RegisterView)
      // Y luego registramos en el backend
      const response = await axios.post(`${API_URL}/registro`, user);
      
      if (response.data) {
        // Guardar el token
        localStorage.setItem('authToken', response.data);
        
        // Decodificar el token JWT para extraer información del usuario
        this.storeUserDataFromToken(response.data);
        
        console.log("Registro completado exitosamente");
      }
      return response.data;
    } catch (error) {
      console.error("Error durante el proceso de registro:", error);
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