import axios from 'axios';

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
  login(credentials) {
    return axios.post(`${API_URL}/login`, credentials)
      .then(response => {
        if (response.data) {
          // Guardar el token
          localStorage.setItem('authToken', response.data);
          
          // Decodificar el token JWT para extraer información del usuario
          // En una implementación real, es mejor hacer una petición separada para obtener los datos completos
          this.storeUserDataFromToken(response.data);
        }
        return response.data;
      });
  }

  /**
   * Registrar un nuevo usuario
   * @param {object} user - Datos del usuario (nombre, email, password)
   * @returns {Promise} - Token JWT
   */
  register(user) {
    return axios.post(`${API_URL}/registro`, user)
      .then(response => {
        if (response.data) {
          // Guardar el token
          localStorage.setItem('authToken', response.data);
          
          // Decodificar el token JWT para extraer información del usuario
          this.storeUserDataFromToken(response.data);
        }
        return response.data;
      });
  }

  /**
   * Cerrar sesión
   */
  logout() {
    // Eliminar todos los datos de autenticación
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    
    // Limpiar cualquier otra información de sesión que pueda existir
    localStorage.clear();
    
    // Limpiar cookies de sesión si existieran
    document.cookie.split(";").forEach(function(c) {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    
    // También podríamos realizar una llamada al backend para invalidar el token JWT en el servidor
    // axios.post(`${API_URL}/logout`).catch(err => console.error('Error al cerrar sesión en servidor:', err));
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