import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://impulsedata.onrender.com';

// Configurar varios proxies CORS para intentar con diferentes alternativas
const CORS_PROXIES = [
  'https://cors-anywhere.herokuapp.com/',
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?'
];

// Comenzar con el primer proxy
let currentProxyIndex = 0;
let API_URL_WITH_PROXY = `${CORS_PROXIES[currentProxyIndex]}${encodeURIComponent(API_URL)}`;

// Función para cambiar al siguiente proxy disponible
const switchToNextProxy = () => {
  currentProxyIndex = (currentProxyIndex + 1) % CORS_PROXIES.length;
  API_URL_WITH_PROXY = `${CORS_PROXIES[currentProxyIndex]}${encodeURIComponent(API_URL)}`;
  console.log(`Cambiando a proxy alternativo: ${CORS_PROXIES[currentProxyIndex]}`);
  
  // Actualizar la configuración de baseURL en api
  api.defaults.baseURL = API_URL_WITH_PROXY;
  
  return API_URL_WITH_PROXY;
};

const api = axios.create({
  baseURL: API_URL_WITH_PROXY,
  timeout: 15000, // 15 segundos de timeout
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  withCredentials: false // El proxy CORS no soporta credentials
});

// Interceptor para añadir el token de autenticación
api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores de red, CORS y otros problemas
api.interceptors.response.use(
  response => response,
  async error => {
    // Verificar si es un error de CORS, network o preflight
    if (error.message === 'Network Error' || error.response?.status === 0 || error.response?.status === 403) {
      console.error('Error de CORS o conexión:', error.message);
      
      // Intentar con el siguiente proxy si hemos intentado menos de 3 veces
      const maxRetries = 3;
      const retryCount = error.config._retryCount || 0;
      
      if (retryCount < maxRetries) {
        // Incrementar contador de reintentos
        error.config._retryCount = retryCount + 1;
        
        // Cambiar al siguiente proxy
        switchToNextProxy();
        
        console.log(`Reintentando solicitud con proxy alternativo (intento ${retryCount + 1}/${maxRetries})`);
        
        // Esperar un poco antes de reintentar para evitar saturación
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Actualizar la URL en la configuración de la solicitud
        error.config.baseURL = API_URL_WITH_PROXY;
        
        // Eliminar cualquier encabezado Origin que pudiera estar causando problemas
        if (error.config.headers && error.config.headers.Origin) {
          delete error.config.headers.Origin;
        }
        
        // Reintento con la nueva configuración
        return api(error.config);
      } else {
        console.error('Se han agotado todos los intentos con diferentes proxies CORS');
        
        // Intentar con comunicación directa como último recurso
        if (!error.config._directAttempt) {
          error.config._directAttempt = true;
          console.log('Intentando comunicación directa como último recurso');
          
          // Cambiar a URL directa
          error.config.baseURL = API_URL;
          
          // Esperar un poco antes de reintentar
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Crear una instancia específica para este intento
          const directApi = axios.create({
            timeout: 15000,
            headers: {
              'Content-Type': 'application/json'
            }
          });
          
          return directApi(error.config);
        }
      }
    }
    return Promise.reject(error);
  }
);

export const loginUser = (userData) => {
  return api.post('/api/auth/login', userData);
};

export default api;
