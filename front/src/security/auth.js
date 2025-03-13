export async function login(username, password) {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (!response.ok) {
        throw new Error('Error en el login');
      }
      const data = await response.json();
      const token = data.token;
      localStorage.setItem('token', token);
      return true;
    } catch (error) {
      console.error('Error al hacer login:', error);
      return false;
    }
  }
  
  export function getToken() {
    return localStorage.getItem('token');
  }
  
  export function logout() {
    localStorage.removeItem('token');
  }
  
  export function isAuthenticated() {
    return !!getToken();
  }
  