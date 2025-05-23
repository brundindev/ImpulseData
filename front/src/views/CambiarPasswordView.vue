<template>
  <div class="perfil-page">
    <!-- Nuevos efectos visuales -->
    <AnimatedBackground />
    
    <div class="profile-container">
      <div class="profile-card">
        <h1>Mi Perfil</h1>

        <!-- Foto de perfil -->
        <div class="profile-photo-section">
          <div class="profile-photo-container">
            <img v-if="photoURL" :src="photoURL" alt="Foto de perfil" class="profile-photo" />
            <div v-else class="profile-photo-placeholder">
              {{ userInitials }}
            </div>
            <div class="photo-overlay">
              <label for="photo-upload" class="change-photo-btn">
                Cambiar foto
                <input id="photo-upload" type="file" accept="image/*" @change="handlePhotoUpload" />
              </label>
            </div>
          </div>
        </div>

        <!-- Información de usuario -->
        <div class="user-info-section">
          <div class="form-group">
            <label for="displayName">Nombre de usuario</label>
            <input
              type="text"
              id="displayName"
              v-model="displayName"
              class="form-control"
              placeholder="Tu nombre de usuario"
            />
          </div>
          
          <div class="form-group">
            <label for="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              v-model="email"
              class="form-control"
              disabled
              readonly
            />
          </div>
          
          <div v-if="profileSuccess" class="alert alert-success success-box">
            <div class="success-icon">✓</div>
            <div class="success-content">
              <div class="success-title">¡Perfil actualizado!</div>
              <p>Tu nombre de usuario ha sido actualizado correctamente.</p>
            </div>
          </div>
          
          <!-- <div v-if="profileError" class="alert alert-danger error-box">
            <div class="error-icon">✖</div>
            <div class="error-content">
              <div class="error-title">Error</div>
              <p>{{ profileError }}</p>
            </div>
          </div> -->
          
          <div class="actions">
            <button type="button" class="btn btn-primary" @click="actualizarPerfil" :disabled="loadingProfile">
              {{ loadingProfile ? 'Actualizando...' : 'Actualizar Perfil' }}
            </button>
          </div>
        </div>

        <hr class="section-divider" />
        
        <!-- Mensajes de éxito y error -->
        <div v-if="photoSuccess" class="alert alert-success success-box">
          <div class="success-icon">✓</div>
          <div class="success-content">
            <div class="success-title">¡Foto actualizada!</div>
            <p>Tu foto de perfil ha sido actualizada correctamente.</p>
          </div>
        </div>
        
        <div v-if="photoError" class="alert alert-danger error-box">
          <div class="error-icon">✖</div>
          <div class="error-content">
            <div class="error-title">Error</div>
            <p>{{ photoError }}</p>
          </div>
        </div>

        <!-- Mensaje de éxito de contraseña -->
        <div v-if="exito" class="alert alert-success success-box">
          <div class="success-icon">✓</div>
          <div class="success-content">
            <div class="success-title">¡Contraseña actualizada!</div>
            <p>Tu contraseña ha sido cambiada correctamente.</p>
          </div>
        </div>

        <!-- Mensaje de error de contraseña -->
        <div v-if="error" class="alert alert-danger error-box">
          <div class="error-icon">✖</div>
          <div class="error-content">
            <div class="error-title">Error</div>
            <p>{{ error }}</p>
          </div>
        </div>

        <h2>Cambiar Contraseña</h2>
        <form @submit.prevent="cambiarPassword">
          <div class="form-group">
            <label for="currentPassword">Contraseña actual</label>
            <div class="password-field-container">
              <input
                :type="showCurrentPassword ? 'text' : 'password'"
                id="currentPassword"
                v-model="currentPassword"
                class="form-control"
                required
                placeholder="Introduce tu contraseña actual"
                :disabled="loading"
              />
              <button 
                type="button"
                class="password-toggle-btn"
                @click="showCurrentPassword = !showCurrentPassword"
                tabindex="-1"
              >
                <i v-if="showCurrentPassword">👁️</i>
                <i v-else>👁️‍🗨️</i>
              </button>
            </div>
          </div>

          <div class="form-group">
            <label for="newPassword">Nueva contraseña</label>
            <div class="password-field-container">
              <input
                :type="showNewPassword ? 'text' : 'password'"
                id="newPassword"
                v-model="newPassword"
                class="form-control"
                required
                placeholder="Introduce tu nueva contraseña"
                :disabled="loading"
                @input="validarPassword"
              />
              <button 
                type="button"
                class="password-toggle-btn"
                @click="showNewPassword = !showNewPassword"
                tabindex="-1"
              >
                <i v-if="showNewPassword">👁️</i>
                <i v-else>👁️‍🗨️</i>
              </button>
            </div>
            <div class="password-requirements" :class="{ active: newPassword }">
              <p>La contraseña debe contener:</p>
              <ul>
                <li :class="{ valid: tieneMinimo8 }">Mínimo 8 caracteres</li>
                <li :class="{ valid: tieneMayuscula }">Al menos una mayúscula</li>
                <li :class="{ valid: tieneMinuscula }">Al menos una minúscula</li>
                <li :class="{ valid: tieneNumero }">Al menos un número</li>
              </ul>
            </div>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirmar nueva contraseña</label>
            <div class="password-field-container">
              <input
                :type="showConfirmPassword ? 'text' : 'password'"
                id="confirmPassword"
                v-model="confirmPassword"
                class="form-control"
                required
                placeholder="Confirma tu nueva contraseña"
                :disabled="loading"
              />
              <button 
                type="button"
                class="password-toggle-btn"
                @click="showConfirmPassword = !showConfirmPassword"
                tabindex="-1"
              >
                <i v-if="showConfirmPassword">👁️</i>
                <i v-else>👁️‍🗨️</i>
              </button>
            </div>
            <div v-if="!passwordsMatch && confirmPassword" class="password-mismatch">
              Las contraseñas no coinciden
            </div>
          </div>

          <div class="actions">
            <button type="submit" class="btn btn-primary" :disabled="!isFormValid || loading">
              {{ loading ? 'Cambiando contraseña...' : 'Cambiar Contraseña' }}
            </button>
          </div>
        </form>
        
        <div class="back-link">
          <router-link to="/">Volver al Dashboard</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider, updateProfile } from 'firebase/auth';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import FirebaseAuthService from '../services/FirebaseAuthService';
import AuthService from '../services/AuthService';
import { waitForAuthInit } from '../firebase';
import AnimatedBackground from '../components/AnimatedBackground.vue';
const router = useRouter();
const auth = getAuth();
const storage = getStorage();

// Estados para el formulario de cambio de contraseña
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const error = ref('');
const exito = ref(false);
const loading = ref(false);

// Estados para controlar la visibilidad de las contraseñas
const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

// Estados para información de perfil
const displayName = ref('');
const email = ref('');
const photoURL = ref('');
const photoSuccess = ref(false);
const photoError = ref('');
const photoLoading = ref(false);
const profileSuccess = ref(false);
const profileError = ref('');
const loadingProfile = ref(false);

// Inicializar datos de perfil
onMounted(async () => {
  console.log('Iniciando componente de perfil');
  try {
    // Esperar a que Firebase Auth esté inicializado
    console.log('Esperando inicialización de Firebase Auth...');
    await waitForAuthInit();
    console.log('Firebase Auth inicializado, cargando perfil...');
    
    // Ahora podemos cargar el perfil con seguridad
    await cargarPerfilUsuario();
  } catch (error) {
    console.error('Error durante la inicialización:', error);
  }
});

// Función para cargar el perfil del usuario
const cargarPerfilUsuario = async () => {
  try {
    // Primero intentamos con el usuario actual en auth
    let user = auth.currentUser;
    
    // Si no hay usuario, intentamos un reintento con espera
    if (!user) {
      console.log('Usuario no disponible inmediatamente, esperando...');
      
      // Esperar un poco para que Firebase Auth se inicialice
      await new Promise(resolve => setTimeout(resolve, 1000));
      user = auth.currentUser;
      
      // Si todavía no hay usuario, intentar un refresco del token si existe
      if (!user) {
        console.log('Intentando obtener token del localStorage...');
        const token = localStorage.getItem('authToken');
        if (token) {
          console.log('Token encontrado, intentando verificar autenticación...');
          try {
            // Esperar un poco más y comprobar de nuevo
            await new Promise(resolve => setTimeout(resolve, 1000));
            user = auth.currentUser;
          } catch (refreshError) {
            console.warn('Error al refrescar autenticación:', refreshError);
          }
        }
      }
    }
    
    // Si se encontró un usuario, cargar sus datos
    if (user) {
      console.log('Usuario autenticado cargado:', user.email);
      console.log('Datos del usuario firebase:', user.displayName, user.email);
      
      // Si existe displayName en Firebase, usamos ese
      if (user.displayName) {
        displayName.value = user.displayName;
      } else {
        // Si no hay displayName en Firebase, buscamos en localStorage
        try {
          const localUser = JSON.parse(localStorage.getItem('user') || '{}');
          if (localUser.displayName) {
            displayName.value = localUser.displayName;
          } else if (localUser.nombre) {
            displayName.value = localUser.nombre;
          } else {
            // Último recurso: intentar usar el prefijo del email
            displayName.value = user.email.split('@')[0];
          }
          console.log('Nombre recuperado:', displayName.value);
        } catch (e) {
          console.error('Error al recuperar datos del usuario:', e);
          displayName.value = user.email.split('@')[0]; // Usar email como último recurso
        }
      }
      
      email.value = user.email || '';
      photoURL.value = user.photoURL || '';
    } else {
      console.log('No se pudo obtener el usuario, recuperando datos del localStorage');
      // Como alternativa, intentamos recuperar datos del usuario desde localStorage
      try {
        const localUser = JSON.parse(localStorage.getItem('user') || '{}');
        console.log('Datos del localStorage:', localUser);
        
        email.value = localUser.email || '';
        
        // Buscar el nombre en diferentes propiedades posibles
        if (localUser.displayName) {
          displayName.value = localUser.displayName;
        } else if (localUser.nombre) {
          displayName.value = localUser.nombre;
        } else if (localUser.name) {
          displayName.value = localUser.name;
        } else if (email.value) {
          // Usar el prefijo del email como último recurso
          displayName.value = email.value.split('@')[0];
        } else {
          displayName.value = 'Usuario';
        }
        
        console.log('Nombre recuperado del localStorage:', displayName.value);
      } catch (e) {
        console.error('Error al recuperar datos del usuario:', e);
        displayName.value = 'Usuario';
      }
    }
  } catch (error) {
    console.error('Error al cargar perfil de usuario:', error);
  }
};

// Iniciales del usuario para el placeholder de la foto
const userInitials = computed(() => {
  if (!displayName.value) return '?';
  return displayName.value
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
});

// Función para manejar la subida de fotos
const handlePhotoUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  // Validar que sea una imagen
  if (!file.type.startsWith('image/')) {
    photoError.value = 'Por favor, selecciona un archivo de imagen válido';
    return;
  }
  
  // Validar tamaño (máximo 2MB)
  if (file.size > 2 * 1024 * 1024) {
    photoError.value = 'La imagen no debe superar los 2MB';
    return;
  }
  
  try {
    photoLoading.value = true;
    photoError.value = '';
    photoSuccess.value = false;
    
    const user = auth.currentUser;
    if (!user) throw new Error('No hay usuario autenticado');
    
    // Subir la imagen a Firebase Storage
    const fileRef = storageRef(storage, `profilePhotos/${user.uid}`);
    await uploadBytes(fileRef, file);
    
    // Obtener URL de la imagen
    const downloadURL = await getDownloadURL(fileRef);
    
    // Actualizar perfil del usuario
    await updateProfile(user, {
      photoURL: downloadURL
    });
    
    // Actualizar estado local
    photoURL.value = downloadURL;
    photoSuccess.value = true;
    
    // Actualizar el token en localStorage
    const newToken = await user.getIdToken(true);
    localStorage.setItem('authToken', newToken);
    
  } catch (error) {
    console.error('Error al subir la foto:', error);
    photoError.value = 'Error al actualizar la foto de perfil. Por favor, inténtalo de nuevo.';
  } finally {
    photoLoading.value = false;
  }
};

// Validaciones de contraseña
const tieneMinimo8 = computed(() => newPassword.value.length >= 8);
const tieneMayuscula = computed(() => /[A-Z]/.test(newPassword.value));
const tieneMinuscula = computed(() => /[a-z]/.test(newPassword.value));
const tieneNumero = computed(() => /[0-9]/.test(newPassword.value));
const passwordsMatch = computed(() => newPassword.value === confirmPassword.value);

const isPasswordValid = computed(() => 
  tieneMinimo8.value && 
  tieneMayuscula.value && 
  tieneMinuscula.value && 
  tieneNumero.value
);

const isFormValid = computed(() => 
  currentPassword.value && 
  isPasswordValid.value && 
  passwordsMatch.value
);

const validarPassword = () => {
  if (confirmPassword.value) {
    confirmPassword.value = '';
  }
};

const cambiarPassword = async () => {
  if (!isFormValid.value) return;

  try {
    loading.value = true;
    error.value = '';
    exito.value = false;

    const user = auth.currentUser;
    if (!user) {
      throw new Error('No hay usuario autenticado');
    }

    // Actualizar contraseña en Firebase
    try {
      console.log('Intentando cambiar contraseña en Firebase...');
      // Autenticar al usuario nuevamente con su contraseña actual
      const credential = EmailAuthProvider.credential(user.email, currentPassword.value);
      await reauthenticateWithCredential(user, credential);
      
      // Cambiar la contraseña
      await updatePassword(user, newPassword.value);
      console.log('Contraseña actualizada en Firebase correctamente');
      
      // También actualizar en el backend para mantener la sincronización
      await actualizarPasswordEnBackend(user.email);
      
      // Mostrar mensaje de éxito
      exito.value = true;
      
      // Limpiar formulario
      currentPassword.value = '';
      newPassword.value = '';
      confirmPassword.value = '';
      
      // Cerrar sesión después de 2 segundos y redirigir al login
      setTimeout(async () => {
        try {
          console.log('Preparando cierre de sesión...');
          
          // Marcar que estamos cerrando sesión para evitar intentos de reautenticación
          sessionStorage.setItem('cerrando_sesion', 'true');
          
          // Eliminar todos los datos de sesión y localStorage
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          localStorage.removeItem('userData');
          localStorage.removeItem('userProfile');
          sessionStorage.removeItem('firebaseUid');
          sessionStorage.removeItem('reautenticacionFallida');
          sessionStorage.removeItem('ultimoIntentoReautenticacion');
          
          // Limpiar todo el sessionStorage excepto cerrando_sesion
          for (let key of Object.keys(sessionStorage)) {
            if (key !== 'cerrando_sesion') {
              sessionStorage.removeItem(key);
            }
          }
          
          console.log('LocalStorage y SessionStorage limpiados');
          
          // Cerrar sesión en Firebase
          console.log('Cerrando sesión de Firebase...');
          await FirebaseAuthService.logout();
          console.log('Sesión de Firebase cerrada');
          
          // Esperar un breve momento para asegurar que la sesión se cierre completamente
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // Limpiar la marca de cierre de sesión al final
          sessionStorage.removeItem('cerrando_sesion');
          
          // Navegar al login
          console.log('Redirigiendo a la página de login...');
          router.push('/login');
          
          // Forzar un refresco completo de la página después de un momento
          // para reiniciar toda la aplicación y evitar problemas de estado
          setTimeout(() => {
            console.log('Recargando la aplicación...');
            window.location.href = '/login';
          }, 200);
        } catch (logoutError) {
          console.error('Error al cerrar sesión:', logoutError);
          // Limpiar la marca de cierre de sesión en caso de error
          sessionStorage.removeItem('cerrando_sesion');
          // En caso de error, igualmente forzar el refresco
          window.location.href = '/login';
        }
      }, 2000);
    } catch (error) {
      console.error('Error al cambiar contraseña en Firebase:', error);
      error.value = error.message || 'Error al cambiar la contraseña';
    }
  } catch (err) {
    console.error('Error al cambiar contraseña:', err);
    
    if (err.code === 'auth/wrong-password') {
      error.value = 'La contraseña actual es incorrecta';
    } else if (err.code === 'auth/requires-recent-login') {
      error.value = 'Por seguridad, necesitas volver a iniciar sesión antes de cambiar tu contraseña';
      // Cerrar sesión y redirigir al login
      await FirebaseAuthService.logout();
      router.push('/login');
    } else {
      error.value = 'Error al cambiar la contraseña. Por favor, inténtalo de nuevo.';
    }
  } finally {
    loading.value = false;
  }
};

// Función separada para actualizar la contraseña en el backend
const actualizarPasswordEnBackend = async (email) => {
  // Actualizar contraseña en el backend
  try {
    console.log('Intentando actualizar contraseña en el backend...');
    
    // Utilizar el token JWT almacenado en localStorage
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('No se encontró token de autenticación en localStorage');
      throw new Error('No hay token de autenticación disponible');
    }
    
    console.log('Usando token JWT almacenado para autenticación');

    const response = await fetch('http://https://impulsedata.onrender.com/api/auth/actualizar-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        email: email,
        oldPassword: currentPassword.value,
        newPassword: newPassword.value
      })
    });

    let responseData;
    try {
      responseData = await response.json();
      console.log('Respuesta del backend:', responseData);
    } catch (e) {
      console.error('Error al procesar respuesta:', e);
      responseData = { message: 'Error al procesar la respuesta del servidor' };
    }

    if (!response.ok) {
      console.warn('El backend no pudo actualizar la contraseña, pero Firebase sí lo hizo');
      console.warn('Respuesta del backend:', responseData);
      // No lanzamos error ya que la contraseña ya se actualizó en Firebase
    }
  } catch (backendError) {
    console.error('Error en la sincronización con el backend:', backendError);
    // No propagamos este error ya que la contraseña ya se actualizó en Firebase
  }
}

const actualizarPerfil = async () => {
  try {
    loadingProfile.value = true;
    profileError.value = '';
    profileSuccess.value = false;
    
    // Verificar autenticación actual
    const currentUser = auth.currentUser;
    
    // Si no hay usuario en Firebase Auth, verificar si tenemos token JWT
    if (!currentUser) {
      console.log('No se detectó usuario en Firebase, verificando JWT...');
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        profileError.value = 'No hay sesión activa. Por favor, vuelve a iniciar sesión.';
        loadingProfile.value = false;
        return;
      }
      
      // Si hay token pero no usuario Firebase, intentar reautenticar
      try {
        console.log('Intentando recuperar sesión de Firebase...');
        await FirebaseAuthService.reautenticar();
        
        // Verificar si ahora tenemos usuario
        if (!auth.currentUser) {
          // Si aún no hay usuario Firebase pero tenemos JWT, continuamos con la actualización
          // solo en el backend y localStorage (sin Firebase)
          console.log('Continuando sin usuario Firebase, solo con JWT');
        }
      } catch (error) {
        console.warn('No se pudo recuperar sesión de Firebase:', error);
        // Continuamos con JWT solamente
      }
    }
    
    // Validar datos del perfil
    if (!displayName.value || displayName.value.trim() === '') {
      profileError.value = 'El nombre de usuario no puede estar vacío';
      loadingProfile.value = false;
      return;
    }
    
    // Actualizar en Firebase si hay usuario
    if (auth.currentUser) {
      try {
        await FirebaseAuthService.updateDisplayName(displayName.value);
        console.log('Nombre actualizado en Firebase correctamente');
      } catch (firebaseError) {
        console.error('Error al actualizar en Firebase:', firebaseError);
        // No bloqueamos la actualización en el backend si falla Firebase
      }
    } else {
      console.log('Omitiendo actualización en Firebase (no hay usuario autenticado)');
    }
    
    // Actualizar datos en el backend para asegurar sincronización
    console.log('Actualizando perfil en el backend...');
    const response = await fetch('http://https://impulsedata.onrender.com/api/usuarios/actualizar-nombre', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({
        email: email.value,
        nombreUsuario: displayName.value
      })
    });
    
    if (response.ok) {
      try {
        const responseData = await response.text();
        console.log('Respuesta del backend:', responseData);
        
        // Actualizar manualmente localStorage en caso de que no tengamos Firebase
        try {
          if (localStorage.getItem('user')) {
            let userObj = JSON.parse(localStorage.getItem('user'));
            userObj.displayName = displayName.value;
            userObj.nombre = displayName.value;
            localStorage.setItem('user', JSON.stringify(userObj));
          }
          
          if (localStorage.getItem('userData')) {
            let userData = JSON.parse(localStorage.getItem('userData'));
            userData.displayName = displayName.value;
            userData.nombre = displayName.value;
            localStorage.setItem('userData', JSON.stringify(userData));
          }
        } catch (storageError) {
          console.error('Error al actualizar localStorage:', storageError);
        }
        
        // Disparar evento de cambio de autenticación para que App.vue se actualice
        window.dispatchEvent(new CustomEvent('auth-state-changed'));
        
        // Mostrar mensaje de éxito
        profileSuccess.value = true;
        profileError.value = '';
        
        // Retrasar la ocultación del mensaje de éxito
        setTimeout(() => {
          profileSuccess.value = false;
        }, 3000);
      } catch (parseError) {
        console.error('Error al procesar la respuesta:', parseError);
        throw new Error('Error al procesar la respuesta del servidor');
      }
    } else {
      let errorMessage = 'Error en la respuesta del servidor';
      try {
        const errorData = await response.json();
        errorMessage = errorData.mensaje || errorMessage;
      } catch (e) {
        console.error('Error al procesar respuesta de error:', e);
      }
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    profileError.value = error.message || 'Error al actualizar el perfil';
  } finally {
    loadingProfile.value = false;
  }
};
</script>

<style src="../assets/CambiarPassword.css"></style>