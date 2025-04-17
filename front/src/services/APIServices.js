import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://impulsedata.onrender.com';
// URL con proxy para evitar problemas de CORS
const PROXY_URL = 'https://corsproxy.io/?';
const API_URL_WITH_PROXY = `${PROXY_URL}${encodeURIComponent(API_URL)}`;

const api = axios.create({
  baseURL: API_URL_WITH_PROXY,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  withCredentials: false // Cambiar a false para evitar problemas de CORS
});

// Interceptor para añadir el token de autenticación
api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores de red y CORS
api.interceptors.response.use(
  response => response,
  error => {
    if (error.message === 'Network Error' || error.response?.status === 0) {
      console.error('Error de conexión o CORS. Verificando configuración:', error);
    }
    return Promise.reject(error);
  }
);

export const loginUser = (userData) => {
  return api.post('/api/auth/login', userData);
};

export default api;
