<template>
  <div>
    <!-- Añadir fondos y efectos visuales -->
    <div class="home-background"></div>
    <div class="wave-background">
      <div class="wave"></div>
      <div class="wave"></div>
      <div class="wave"></div>
    </div>
    <div class="floating-particles floating-particles-profile">
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
    </div>
    
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
              disabled
              readonly
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
            <input
              type="password"
              id="currentPassword"
              v-model="currentPassword"
              class="form-control"
              required
              placeholder="Introduce tu contraseña actual"
              :disabled="loading"
            />
          </div>

          <div class="form-group">
            <label for="newPassword">Nueva contraseña</label>
            <input
              type="password"
              id="newPassword"
              v-model="newPassword"
              class="form-control"
              required
              placeholder="Introduce tu nueva contraseña"
              :disabled="loading"
              @input="validarPassword"
            />
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
            <input
              type="password"
              id="confirmPassword"
              v-model="confirmPassword"
              class="form-control"
              required
              placeholder="Confirma tu nueva contraseña"
              :disabled="loading"
            />
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

// Estados para información de perfil
const displayName = ref('');
const email = ref('');
const photoURL = ref('');
const photoSuccess = ref(false);
const photoError = ref('');
const photoLoading = ref(false);

// Inicializar datos de perfil
onMounted(async () => {
  // Primero intentamos con el usuario actual en auth
  let user = auth.currentUser;
  
  // Si no hay usuario, esperamos un poco y obtenemos el estado de autenticación
  if (!user) {
    console.log('Usuario no disponible inmediatamente, esperando...');
    await new Promise(resolve => setTimeout(resolve, 500));
    user = auth.currentUser;
  }
  
  if (user) {
    console.log('Usuario autenticado:', user.email);
    displayName.value = user.displayName || 'Usuario';
    email.value = user.email || '';
    photoURL.value = user.photoURL || '';
  } else {
    console.log('No se pudo obtener el usuario, intentando recuperar datos del localStorage');
    // Como alternativa, intentamos recuperar el email del usuario desde localStorage
    try {
      const localUser = JSON.parse(localStorage.getItem('user') || '{}');
      email.value = localUser.email || '';
      displayName.value = localUser.displayName || localUser.nombre || 'Usuario';
    } catch (e) {
      console.error('Error al recuperar datos del usuario:', e);
    }
  }
});

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
          // Cerrar sesión en Firebase
          await FirebaseAuthService.logout();
          
          // Limpiar todo el almacenamiento local
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          sessionStorage.clear();
          
          // Asegurar que la sesión se cierre completamente antes de redireccionar
          router.push('/login');
          
          // Forzar un refresco completo de la página para reiniciar toda la aplicación
          setTimeout(() => {
            window.location.href = '/login';
          }, 100);
        } catch (logoutError) {
          console.error('Error al cerrar sesión:', logoutError);
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

    const response = await fetch('http://localhost:8080/api/auth/actualizar-password', {
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
</script>

<style>
.profile-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 20px;
}

.profile-card {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 152, 0.1);
  width: 100%;
  max-width: 600px;
}

.profile-card h1 {
  color: #004698;
  margin-bottom: 1.5rem;
  text-align: center;
}

.profile-card h2 {
  color: #004698;
  margin: 2rem 0 1rem;
  font-size: 1.5rem;
}

.section-divider {
  margin: 1.5rem 0;
  border-top: 1px solid #e9ecef;
}

/* Estilos para la sección de foto de perfil */
.profile-photo-section {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.profile-photo-container {
  position: relative;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.profile-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-photo-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #004698;
  color: white;
  font-size: 2.5rem;
  font-weight: bold;
}

.photo-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  overflow: hidden;
  width: 100%;
  height: 0;
  transition: .5s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-photo-container:hover .photo-overlay {
  height: 50px;
}

.change-photo-btn {
  color: white;
  font-size: 0.9rem;
  cursor: pointer;
  text-align: center;
  background-color: transparent;
  padding: 5px 10px;
  border-radius: 4px;
}

.change-photo-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.change-photo-btn input {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
}

/* Estilos para la información del usuario */
.user-info-section {
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #004698;
  font-weight: 500;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-control:focus {
  border-color: #004698;
  outline: none;
}

.form-control:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
  color: #7e7e7e;
}

.password-requirements {
  margin-top: 0.5rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 5px;
  font-size: 0.9rem;
  display: none;
}

.password-requirements.active {
  display: block;
}

.password-requirements ul {
  list-style: none;
  padding-left: 0;
  margin: 0.5rem 0 0;
}

.password-requirements li {
  color: #dc3545;
  margin: 0.25rem 0;
  padding-left: 1.5rem;
  position: relative;
}

.password-requirements li::before {
  content: "✖";
  position: absolute;
  left: 0;
  color: #dc3545;
}

.password-requirements li.valid {
  color: #198754;
}

.password-requirements li.valid::before {
  content: "✓";
  color: #198754;
}

.password-mismatch {
  color: #dc3545;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.btn-primary {
  background-color: #004698;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s;
}

.btn-primary:hover:not(:disabled) {
  background-color: #003672;
}

.btn-primary:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.back-link {
  text-align: center;
  margin-top: 1rem;
}

.back-link a {
  color: #004698;
  text-decoration: none;
}

.back-link a:hover {
  text-decoration: underline;
}

.success-box, .error-box {
  display: flex;
  align-items: start;
  padding: 1rem;
  margin-bottom: 1.5rem;
  border-radius: 5px;
}

.success-box {
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
}

.error-box {
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
}

.success-icon, .error-icon {
  margin-right: 1rem;
  font-size: 1.2rem;
}

.success-icon {
  color: #198754;
}

.error-icon {
  color: #dc3545;
}

.success-content, .error-content {
  flex: 1;
}

.success-title, .error-title {
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.success-title {
  color: #198754;
}

.error-title {
  color: #dc3545;
}
</style> 