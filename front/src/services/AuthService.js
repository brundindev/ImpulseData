import axios from 'axios';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import FirebaseAuthService from './FirebaseAuthService';
import FirestoreService from './FirestoreService';

// Configuración de base URL para todas las peticiones
// Si el backend está en un puerto distinto al frontend, hay que especificar la URL completa
const API_URL = 'https://impulsedata.onrender.com/api/auth';

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
  
  // Actualizar la configuración de baseURL en authAxios
  authAxios.defaults.baseURL = API_URL_WITH_PROXY;
  
  return API_URL_WITH_PROXY;
};

// Crear una instancia personalizada de axios para el servicio de autenticación
// para no afectar a otras partes de la aplicación
const authAxios = axios.create({
  baseURL: API_URL_WITH_PROXY,
  timeout: 15000, // 15 segundos de timeout
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  withCredentials: false // Los proxies CORS no soportan credentials
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

// Agregar un interceptor para manejar errores de CORS específicamente
authAxios.interceptors.response.use(
  response => response,
  async error => {
    // Verificar si es un error de CORS o preflight
    if (error.message === 'Network Error' || 
        (error.response && (error.response.status === 0 || error.response.status === 403))) {
      console.error('Error de CORS detectado:', error.message);
      
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
        return authAxios(error.config);
      } else {
        console.error('Se han agotado todos los intentos con diferentes proxies CORS');
        
        // Como último recurso, intentar directamente sin proxy
        if (!error.config._directAttempt) {
          error.config._directAttempt = true;
          console.log('Intentando comunicación directa sin proxy como último recurso');
          
          // Intentar comunicación directa con el backend
          try {
            // Crear una instancia temporal directa
            const directAxios = axios.create({
              baseURL: API_URL.replace('/api/auth', ''),
              timeout: 15000,
              headers: { 'Content-Type': 'application/json' }
            });
            
            // Intentar la solicitud
            return directAxios({
              ...error.config,
              baseURL: API_URL
            });
          } catch (directError) {
            console.error('Falló el intento directo:', directError.message);
            return Promise.reject(directError);
          }
        }
      }
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
      console.log("Iniciando proceso de login con credenciales:", credentials.email || credentials.identificador);
      
      // Verificar si tenemos credenciales válidas
      const identifier = credentials.email || credentials.identificador;
      if (!identifier) {
        throw new Error('No se proporcionó un email o identificador de usuario válido');
      }
      
      if (!credentials.password) {
        throw new Error('No se proporcionó una contraseña');
      }
      
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
      
      let firebaseUser = null;
      let token = null;
      let backendLoginSuccessful = false;
      
      // ---- PASO 1: AUTENTICAR CON FIREBASE ----
      try {
        // Primero autenticamos con Firebase
        if (isGoogleAuth) {
          // Para usuarios Google, ya deberían estar autenticados en Firebase
          firebaseUser = auth.currentUser;
          if (!firebaseUser) {
            console.warn("Usuario Google no está autenticado en Firebase");
          }
        } else if (identifier.includes('@')) {
          // Solo intentar login Firebase con email
          try {
            firebaseUser = await FirebaseAuthService.login(identifier, credentials.password);
            console.log("Usuario autenticado en Firebase:", firebaseUser.email);
          } catch (firebaseLoginError) {
            console.warn("Error en login con Firebase:", firebaseLoginError);
            // No interrumpir el flujo si Firebase falla
          }
        }
      } catch (firebaseError) {
        console.warn("Error al autenticar con Firebase:", firebaseError);
        // Continuar con backend aunque Firebase falle
      }
      
      // ---- PASO 2: INTENTAR AUTENTICACIÓN EN BACKEND ----
      try {
        // Intentar con proxy
        console.log("Enviando solicitud de login al backend a través de proxy:", `${API_URL_WITH_PROXY}/login`);
        
        // Configuración específica para esta solicitud
        const loginConfig = {
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
        };
        
        const response = await authAxios.post('/login', {
          identificador: identifier,
          password: credentials.password
        }, loginConfig);
        
        if (response && response.data) {
          // Verificar que la respuesta es un token JWT válido
          if (typeof response.data === 'string' && response.data.includes('.')) {
            console.log("Backend devolvió un token JWT válido");
            token = response.data;
            backendLoginSuccessful = true;
          } else {
            console.warn("Respuesta del backend no es un token JWT válido:", response.data);
          }
        }
      } catch (backendError) {
        console.warn("Error al autenticar con backend:", backendError.message);
        // Si backend falla, continuamos con Firebase
      }
      
      // ---- PASO 3: USAR FIREBASE COMO ALTERNATIVA SI BACKEND FALLA ----
      if (!backendLoginSuccessful) {
        console.log("Login backend falló, usando Firebase como alternativa");
        
        // Si no tenemos usuario Firebase y no es login de Google, reintentamos login Firebase
        if (!firebaseUser && !isGoogleAuth && identifier.includes('@')) {
          try {
            console.log("Reintentando autenticación con Firebase");
            firebaseUser = await FirebaseAuthService.login(identifier, credentials.password);
          } catch (fbRetryError) {
            console.error("Error en reintento con Firebase:", fbRetryError);
            throw new Error('Credenciales incorrectas. Por favor, verifica tu usuario y contraseña.');
          }
        }
        
        // Si tenemos usuario Firebase, generamos un token local
        if (firebaseUser) {
          // Generar un token local para mantener la sesión aunque el backend falle
          const userToken = await firebaseUser.getIdToken();
          token = userToken;
          
          // Crear un objeto con los datos del usuario
          const userData = {
            id: firebaseUser.uid,
            email: firebaseUser.email,
            nombre: firebaseUser.displayName || firebaseUser.email.split('@')[0],
            emailVerificado: firebaseUser.emailVerified
          };
          
          // Almacenar datos de usuario
          localStorage.setItem('userData', JSON.stringify(userData));
          console.log("Usando Firebase como alternativa, datos de usuario guardados:", userData);
        } else if (isGoogleAuth) {
          // Para usuarios Google, podemos intentar recuperar los datos
          const userData = JSON.parse(localStorage.getItem('userData') || '{}');
          if (userData && userData.email) {
            console.log("Usando datos de Google almacenados:", userData);
          } else {
            throw new Error('No se pudo autenticar con Google. Por favor, inténtalo nuevamente.');
          }
        } else {
          throw new Error('No se pudo autenticar. Verifica tus credenciales o inténtalo más tarde.');
        }
      }
      
      // Guardar el token, ya sea del backend o de Firebase
      if (token) {
        localStorage.setItem('authToken', token);
        console.log("Token guardado correctamente");
        
        // Si fue token del backend, extraer datos del usuario
        if (backendLoginSuccessful) {
          this.storeUserDataFromToken(token);
        }
        
        // Para usuarios de Google, verificar si ya están autenticados con Firebase
        const currentUser = auth.currentUser;
        
        if (isGoogleAuth) {
          if (currentUser) {
            console.log("Ya existe sesión en Firebase con Google:", currentUser.email);
          } else {
            console.log("No hay sesión activa en Firebase para el usuario de Google");
          }
        }
        
        // Crear la empresa por defecto si no existe (solo si tenemos usuario Firebase)
        if (firebaseUser || currentUser) {
          try {
            console.log("🏢 Verificando/creando empresa por defecto después del login...");
            await FirestoreService.crearEmpresaPorDefecto();
          } catch (empresaError) {
            console.error("Error al intentar crear empresa por defecto:", empresaError);
            // No interrumpimos el flujo principal
          }
        }
        
        // Disparar evento para actualizar la interfaz
        window.dispatchEvent(new CustomEvent('auth-state-changed'));
        
        return token;
      } else {
        throw new Error('No se pudo obtener un token de autenticación válido');
      }
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
      
      console.log("Enviando solicitud de registro al backend a través de proxy:", `${API_URL_WITH_PROXY}/registro`);
      
      // Primero registramos en Firebase (esto ya debería estar manejado en RegisterView)
      // Y luego registramos en el backend
      const response = await authAxios.post('/registro', user);
      
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
      // Marcar que estamos cerrando sesión para evitar intentos de reautenticación
      sessionStorage.setItem('cerrando_sesion', 'true');
      
      // Limpiar datos de sesión
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      localStorage.removeItem('user');
      localStorage.removeItem('userProfile');
      
      // Limpiar sessionStorage, manteniendo solo la marca de cierre
      const cerrando = sessionStorage.getItem('cerrando_sesion');
      sessionStorage.clear();
      if (cerrando) {
        sessionStorage.setItem('cerrando_sesion', cerrando);
      }
      
      // Cerrar sesión en Firebase
      try {
        await signOut(auth);
        console.log("Sesión Firebase cerrada correctamente");
      } catch (firebaseError) {
        console.error("Error al cerrar sesión en Firebase:", firebaseError);
        // No interrumpimos el flujo si Firebase falla
      }
      
      // Limpiar caché de autenticación
      this.currentUser = null;
      
      console.log("Sesión cerrada correctamente y datos de usuario eliminados");
      return true;
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      // Asegurarse de que la marca de cierre se elimine en caso de error
      sessionStorage.removeItem('cerrando_sesion');
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
   * @returns {object}
   */
  getCurrentUser() {
    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        return JSON.parse(userData);
      }
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
    }
    
    // Si no hay datos en localStorage o hay un error, devolver un objeto por defecto
    return { nombre: 'Usuario', email: 'usuario@example.com' };
  }

  /**
   * Almacena los datos del usuario extrayéndolos del token JWT
   * @param {string} token - Token JWT
   */
  storeUserDataFromToken(token) {
    try {
      // Verificar que el token es válido antes de procesarlo
      if (!token || typeof token !== 'string') {
        console.error('Token inválido o no es una cadena de texto');
        return this.storeDefaultUserData();
      }
      
      // Verificar que el token tiene el formato esperado (xxx.yyy.zzz)
      if (!token.includes('.')) {
        console.error('Formato de token JWT inválido, no contiene separadores "."');
        return this.storeDefaultUserData();
      }

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
      console.log("Payload de token JWT:", payload);
      
      // Obtener un nombre válido a partir del payload
      let nombreUsuario = 'Usuario';
      let emailUsuario = '';
      
      // Intentar extraer el email
      if (payload.sub) {
        emailUsuario = payload.sub;
      } else if (payload.email) {
        emailUsuario = payload.email;
      }
      
      // Intentar extraer el nombre en orden de prioridad
      if (payload.nombreUsuario) {
        nombreUsuario = payload.nombreUsuario;
      } else if (payload.nombreCompleto) {
        nombreUsuario = payload.nombreCompleto;
      } else if (payload.nombre) {
        nombreUsuario = payload.nombre;
      } else if (payload.name) {
        nombreUsuario = payload.name;
      } else if (payload.displayName) {
        nombreUsuario = payload.displayName;
      } else if (emailUsuario && emailUsuario.includes('@')) {
        // Si tenemos email pero no nombre, usar parte antes del @
        nombreUsuario = emailUsuario.split('@')[0];
      }
      
      // Incluir todos los campos posibles para evitar problemas
      const userData = {
        id: payload.id || payload.userId || '',
        nombre: nombreUsuario,
        email: emailUsuario,
        nombreUsuario: nombreUsuario,
        displayName: nombreUsuario,
        uid: payload.uid || payload.id || '',
        emailVerificado: payload.emailVerificado || true,
        rol: payload.rol || 'USER'
      };
      
      // Almacenar la información del usuario
      localStorage.setItem('userData', JSON.stringify(userData));
      
      console.log('Datos de usuario almacenados:', userData);
      
      return userData;
    } catch (error) {
      console.error('Error al decodificar el token JWT', error);
      return this.storeDefaultUserData();
    }
  }

  /**
   * Almacena datos de usuario por defecto en caso de error
   * @returns {object} Datos de usuario por defecto
   */
  storeDefaultUserData() {
    const defaultUserData = {
      nombre: 'Usuario',
      email: 'usuario@example.com',
      displayName: 'Usuario'
    };
    localStorage.setItem('userData', JSON.stringify(defaultUserData));
    return defaultUserData;
  }
}

export default new AuthService(); 