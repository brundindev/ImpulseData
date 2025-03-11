import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api', // Ajusta esto según tu configuración de Spring Boot
    headers: {
        'Content-Type': 'application/json',
    }
});

// Interceptor para manejar errores
api.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);

export default api; 