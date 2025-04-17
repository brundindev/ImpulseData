import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://impulsedata.onrender.com';

// Ya no necesitamos proxies CORS porque hemos configurado correctamente CORS en el backend
const API_URL_WITH_PROXY = API_URL;

const api = axios.create({
  baseURL: API_URL_WITH_PROXY,
  timeout: 15000, // 15 segundos de timeout
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  withCredentials: true // Ahora podemos usar credentials ya que no usamos proxies
});

// Interceptor para añadir el token de autenticación
api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores
api.interceptors.response.use(
  response => response,
  async error => {
    console.error('Error en la solicitud API:', error.message || 'Error desconocido');
    return Promise.reject(error);
  }
);

export const loginUser = (userData) => {
  return api.post('/api/auth/login', userData);
};

export default api;
