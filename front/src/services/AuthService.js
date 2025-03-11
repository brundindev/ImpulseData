import axios from 'axios';

// Configuración de base URL para todas las peticiones
const API_URL = '/api/auth';

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
    if (error.response && error.response.status === 401) {
      // Si recibimos un 401 Unauthorized, cerramos la sesión
      localStorage.removeItem('authToken');
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
    // Simulación de respuesta para desarrollo - En producción, usar el comentado
    // return axios.post(`${API_URL}/login`, credentials)
    //   .then(response => {
    //     if (response.data) {
    //       localStorage.setItem('authToken', response.data);
    //     }
    //     return response.data;
    //   });
    
    // SIMULACIÓN - QUITAR EN PRODUCCIÓN
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockToken = 'mock-jwt-token-' + Math.random().toString(36).substring(2);
        localStorage.setItem('authToken', mockToken);
        localStorage.setItem('userData', JSON.stringify({
          nombre: credentials.email.split('@')[0],
          email: credentials.email
        }));
        resolve(mockToken);
      }, 500);
    });
  }

  /**
   * Registrar un nuevo usuario
   * @param {object} user - Datos del usuario (nombre, email, password)
   * @returns {Promise} - Token JWT
   */
  register(user) {
    // Simulación de respuesta para desarrollo - En producción, usar el comentado
    // return axios.post(`${API_URL}/registro`, user)
    //   .then(response => {
    //     if (response.data) {
    //       localStorage.setItem('authToken', response.data);
    //     }
    //     return response.data;
    //   });
    
    // SIMULACIÓN - QUITAR EN PRODUCCIÓN
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockToken = 'mock-jwt-token-' + Math.random().toString(36).substring(2);
        localStorage.setItem('authToken', mockToken);
        localStorage.setItem('userData', JSON.stringify({
          nombre: user.nombre,
          email: user.email
        }));
        resolve(mockToken);
      }, 500);
    });
  }

  /**
   * Cerrar sesión
   */
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
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
}

export default new AuthService(); 