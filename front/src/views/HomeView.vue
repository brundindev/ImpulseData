<template>
  <div class="dashboard-container">
    <!-- Encabezado del dashboard -->
    <div class="dashboard-header">
      <div class="welcome-section">
        <h1 class="welcome-title">Dashboard</h1>
        <p class="welcome-subtitle" v-if="usuario">Bienvenido, <span class="user-name">{{ usuario.nombre }}</span></p>
      </div>
      <div class="action-buttons">
        <button class="btn-crear-empresa" @click="showFormModal = true; modoEdicion = false;">
          <span> + Crear nueva empresa</span>
        </button>
      </div>
    </div>
    
    <!-- Banner de Alicante destacado -->
    <div class="alicante-banner-showcase">
      <div class="banner-image-container">
        <img src="@/assets/img/impulsaalicante.png" alt="Impulsa Alicante" class="banner-image" />
      </div>
      <div class="banner-info">
        <h3>Impulsedata - Alicante Futura</h3>
        <p>Plataforma digital de gestión de datos para la innovación y el desarrollo sostenible de Alicante.</p>
      </div>
    </div>
    
    <!-- Contenido principal -->
    <div class="dashboard-content">
      <!-- Panel de estadísticas -->
      <div class="stats-section">
        <div class="stat-card">
          <h3>Empresas</h3>
          <div class="stat-value">{{ empresasCount }}</div>
        </div>
        <div class="stat-card">
          <h3>Departamentos</h3>
          <div class="stat-value">{{ departamentosCount }}</div>
        </div>
        <div class="stat-card">
          <h3>Centros</h3>
          <div class="stat-value">{{ centrosCount }}</div>
        </div>
        <div class="stat-card">
          <h3>Formaciones</h3>
          <div class="stat-value">{{ formacionesCount }}</div>
        </div>
      </div>
      
      <!-- Loader para estados de carga -->
      <div v-if="cargando" class="loading-container">
        <div class="loader"></div>
        <p>Cargando datos...</p>
      </div>
      
      <!-- Mensaje de error si algo falla -->
      <div v-else-if="error" class="error-container">
        <p>{{ error }}</p>
        <button @click="cargarDatos" class="btn btn-primary">Reintentar</button>
      </div>
      
      <!-- Lista de empresas -->
      <div v-else class="forms-section">
        <h2>Mis empresas</h2>
        
        <div v-if="empresas.length === 0" class="empty-state">
          <p>No tienes empresas registradas todavía.</p>
          <button class="btn btn-secondary" @click="showFormModal = true">Crear</button>
        </div>
        
        <div v-else class="forms-list">
          <div v-for="empresa in empresas" :key="empresa.id" class="form-card">
            <div class="form-info" @click="verEmpresa(empresa)">
              <h3>{{ empresa.nombre }}</h3>
              <p>{{ empresa.descripcion }}</p>
              <div class="form-meta">
                <span>Ciudad: {{ empresa.ciudad }}</span>
                <span>Creada: {{ formatDate(empresa.fechaCreacion) }}</span>
              </div>
              <div class="form-stats">
                <span class="stat-pill">{{ empresa.numDepartamentos }} departamentos</span>
                <span class="stat-pill">{{ empresa.numCentros }} centros</span>
                <span class="stat-pill">{{ empresa.numFormaciones }} formaciones</span>
              </div>
            </div>
            <div class="form-actions">
              <button class="button" @click="editarEmpresa(empresa)">Editar</button>
              <button class="button" @click="verEmpresa(empresa)">Ver</button>
              <button class="noselect" @click="confirmarEliminar(empresa)">
                <span class="text">Eliminar</span>
                <span class="icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path>
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Botón flotante para crear nueva empresa -->
    <button class="btn-floating" @click="showFormModal = true; modoEdicion = false;">
      <span class="icon">+</span>
    </button>
    
    <!-- Modal para crear/editar empresa -->
    <div class="modal-overlay" v-if="showFormModal" @click.self="showFormModal = false">
      <div class="modal-container">
        <div class="modal-header">
          <h2>{{ modoEdicion ? 'Editar empresa' : 'Crear nueva empresa' }}</h2>
          <button class="btn-close" @click="showFormModal = false">×</button>
        </div>
        <div class="modal-body">
          <div v-if="guardando" class="saving-overlay">
            <div class="loader"></div>
            <p>Guardando datos...</p>
          </div>
          <form @submit.prevent="guardarEmpresa">
            <div class="form-group">
              <label for="nombreEmpresa">Nombre de la empresa</label>
              <input 
                type="text" 
                id="nombreEmpresa" 
                v-model="nuevaEmpresa.nombre" 
                required 
                placeholder="Ej: Acme Corporation"
              >
            </div>
            
            <div class="form-group">
              <label for="fechaCreacion">Fecha de creación</label>
              <input 
                type="date" 
                id="fechaCreacion" 
                v-model="nuevaEmpresa.fechaCreacion" 
                required
              >
            </div>
            
            <div class="form-group">
              <label for="descripcionEmpresa">Descripción</label>
              <textarea 
                id="descripcionEmpresa" 
                v-model="nuevaEmpresa.descripcion" 
                rows="3" 
                placeholder="Describe brevemente la empresa"
              ></textarea>
            </div>
            
            <div class="form-group">
              <label for="ciudadEmpresa">Ciudad</label>
              <input 
                type="text" 
                id="ciudadEmpresa" 
                v-model="nuevaEmpresa.ciudad" 
                required 
                placeholder="Ej: Alicante"
              >
            </div>
            
            <h3 class="section-title">Departamentos</h3>
            <div class="questions-container">
              <div v-for="(departamento, index) in nuevaEmpresa.departamentos" :key="index" class="question-item">
                <div class="question-header">
                  <h4>Departamento {{ index + 1 }}</h4>
                  <button 
                    type="button" 
                    class="btn-icon btn-delete-small" 
                    @click="eliminarDepartamento(index)"
                    v-if="nuevaEmpresa.departamentos.length > 1"
                  >×</button>
                </div>
                
                <div class="form-group">
                  <label :for="'nombreDep'+index">Nombre del departamento</label>
                  <input 
                    type="text" 
                    :id="'nombreDep'+index" 
                    v-model="departamento.nombre" 
                    required 
                    placeholder="Ej: Empleo y Formación"
                  >
                </div>
              </div>
            </div>
            <button type="button" class="btn btn-secondary" @click="agregarDepartamento">
              + Añadir departamento
            </button>
            
            <h3 class="section-title">Centros</h3>
            <div class="questions-container">
              <div v-for="(centro, index) in nuevaEmpresa.centros" :key="index" class="question-item">
                <div class="question-header">
                  <h4>Centro {{ index + 1 }}</h4>
                  <button 
                    type="button" 
                    class="btn-icon btn-delete-small" 
                    @click="eliminarCentro(index)"
                    v-if="nuevaEmpresa.centros.length > 1"
                  >×</button>
                </div>
                
                <div class="form-group">
                  <label :for="'nombreCentro'+index">Nombre del centro</label>
                  <input 
                    type="text" 
                    :id="'nombreCentro'+index" 
                    v-model="centro.nombre" 
                    required 
                    placeholder="Ej: Sede Principal"
                  >
                </div>
                
                <div class="form-group">
                  <label :for="'direccionCentro'+index">Dirección</label>
                  <input 
                    type="text" 
                    :id="'direccionCentro'+index" 
                    v-model="centro.direccion" 
                    required 
                    placeholder="Ej: Calle Principal 123"
                  >
                </div>
              </div>
            </div>
            <button type="button" class="btn btn-secondary" @click="agregarCentro">
              + Añadir centro
            </button>
            
            <h3 class="section-title">Formaciones</h3>
            <div class="questions-container">
              <div v-for="(formacion, index) in nuevaEmpresa.formaciones" :key="index" class="question-item">
                <div class="question-header">
                  <h4>Formación {{ index + 1 }}</h4>
                  <button 
                    type="button" 
                    class="btn-icon btn-delete-small" 
                    @click="eliminarFormacion(index)"
                    v-if="nuevaEmpresa.formaciones.length > 1"
                  >×</button>
                </div>
                
                <div class="form-group">
                  <label :for="'nombreFormacion'+index">Nombre de la formación</label>
                  <input 
                    type="text" 
                    :id="'nombreFormacion'+index" 
                    v-model="formacion.nombre" 
                    required 
                    placeholder="Ej: LABORA"
                  >
                </div>
                
                <div class="form-group">
                  <label :for="'tipoFormacion'+index">Tipo de formación</label>
                  <select :id="'tipoFormacion'+index" v-model="formacion.tipo" required>
                    <option value="presencial">Presencial</option>
                    <option value="virtual">Virtual</option>
                    <option value="hibrida">Híbrida</option>
                  </select>
                </div>
                
                <div class="form-group">
                  <label :for="'duracionFormacion'+index">Duración (horas)</label>
                  <input 
                    type="number" 
                    :id="'duracionFormacion'+index" 
                    v-model="formacion.duracion" 
                    required 
                    min="1"
                  >
                </div>
              </div>
            </div>
            <button type="button" class="btn btn-secondary" @click="agregarFormacion">
              + Añadir formación
            </button>
            
            <div class="form-actions modal-actions">
              <button type="button" class="button-cancel" @click="showFormModal = false">Cancelar</button>
              <button type="submit" class="btn btn-save" :disabled="guardando">Guardar empresa</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    
    <!-- Modal de confirmación para eliminar -->
    <div class="modal-overlay" v-if="mostrarConfirmacion" @click.self="mostrarConfirmacion = false">
      <div class="modal-container modal-small">
        <div class="modal-header">
          <h2>Confirmar eliminación</h2>
          <button class="btn-close" @click="mostrarConfirmacion = false">×</button>
        </div>
        <div class="modal-body">
          <p>¿Estás seguro de que deseas eliminar la empresa <strong>{{ empresaAEliminar?.nombre }}</strong>?</p>
          <p class="warning-text">Esta acción no se puede deshacer y eliminará todos los departamentos, centros y formaciones asociados.</p>
          
          <div class="form-actions modal-actions">
            <button type="button" class="button-cancel" @click="mostrarConfirmacion = false">Cancelar</button>
            <button type="button" class="noselect" @click="eliminarEmpresa" :disabled="eliminando">
              <span class="text">{{ eliminando ? 'Eliminando...' : 'Eliminar' }}</span>
              <span class="icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path>
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Modal para ver detalles de empresa -->
    <div class="modal-overlay" v-if="showViewModal" @click.self="showViewModal = false">
      <div class="modal-container">
        <div class="modal-header">
          <h2>Detalles de empresa</h2>
          <button class="btn-close" @click="showViewModal = false">×</button>
        </div>
        <div class="modal-body">
          <div v-if="cargando" class="saving-overlay">
            <div class="loader"></div>
            <p>Cargando datos...</p>
          </div>
          <div class="view-content">
            <div class="form-group">
              <label>Nombre de la empresa</label>
              <div class="view-field">{{ empresaActual.nombre }}</div>
            </div>
            
            <div class="form-group">
              <label>Fecha de creación</label>
              <div class="view-field">{{ formatDate(empresaActual.fechaCreacion) }}</div>
            </div>
            
            <div class="form-group">
              <label>Descripción</label>
              <div class="view-field description">{{ empresaActual.descripcion || 'Sin descripción' }}</div>
            </div>
            
            <div class="form-group">
              <label>Ciudad</label>
              <div class="view-field">{{ empresaActual.ciudad || 'No especificada' }}</div>
            </div>
            
            <h3 class="section-title">Departamentos</h3>
            <div class="view-list">
              <div v-if="!empresaActual.departamentos || empresaActual.departamentos.length === 0" class="empty-message">
                No hay departamentos registrados.
              </div>
              <div v-for="(departamento, index) in empresaActual.departamentos" :key="index" class="view-item">
                <div class="view-item-title">Departamento {{ index + 1 }}</div>
                <div class="view-item-content">{{ departamento.nombre }}</div>
              </div>
            </div>
            
            <h3 class="section-title">Centros</h3>
            <div class="view-list">
              <div v-if="!empresaActual.centros || empresaActual.centros.length === 0" class="empty-message">
                No hay centros registrados.
              </div>
              <div v-for="(centro, index) in empresaActual.centros" :key="index" class="view-item">
                <div class="view-item-title">Centro {{ index + 1 }}</div>
                <div class="view-item-content">
                  <div><strong>Nombre:</strong> {{ centro.nombre }}</div>
                  <div><strong>Dirección:</strong> {{ centro.direccion || 'No especificada' }}</div>
                </div>
              </div>
            </div>
            
            <h3 class="section-title">Formaciones</h3>
            <div class="view-list">
              <div v-if="!empresaActual.formaciones || empresaActual.formaciones.length === 0" class="empty-message">
                No hay formaciones registradas.
              </div>
              <div v-for="(formacion, index) in empresaActual.formaciones" :key="index" class="view-item">
                <div class="view-item-title">Formación {{ index + 1 }}</div>
                <div class="view-item-content">
                  <div><strong>Nombre:</strong> {{ formacion.nombre }}</div>
                  <div><strong>Tipo:</strong> {{ formatTipoFormacion(formacion.tipo) }}</div>
                  <div><strong>Duración:</strong> {{ formacion.duracion }} horas</div>
                </div>
              </div>
            </div>
            
            <div class="form-actions modal-actions">
              <button type="button" class="button-cancel" @click="showViewModal = false">Cancelar</button>
              <button type="button" class="button" @click="editarEmpresaDesdeVista()">
                Editar
              </button>
              <button type="button" class="buttonDownload" @click="descargarPDF()">
                Descargar PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import AuthService from '../services/AuthService';
import FirestoreService from '../services/FirestoreService';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import FirebaseAuthService from '../services/FirebaseAuthService';
import AlicanteBanner from '../components/AlicanteBanner.vue';

const router = useRouter();
const auth = getAuth();
const usuario = ref(null);
const showFormModal = ref(false);
const showViewModal = ref(false);
const empresasCount = ref(0);
const departamentosCount = ref(0);
const centrosCount = ref(0);
const formacionesCount = ref(0);
const cargando = ref(true);
const guardando = ref(false);
const error = ref(null);
const mostrarConfirmacion = ref(false);
const empresaAEliminar = ref(null);
const eliminando = ref(false);
const modoEdicion = ref(false);
const empresaEditandoId = ref(null);
const empresaActual = reactive({
  id: '',
  nombre: '',
  fechaCreacion: '',
  descripcion: '',
  ciudad: '',
  departamentos: [],
  centros: [],
  formaciones: []
});

// Lista de empresas
const empresas = ref([]);

// Datos para nueva empresa
const nuevaEmpresa = reactive({
  nombre: '',
  fechaCreacion: '',
  descripcion: '',
  ciudad: '',
  departamentos: [
    {
      nombre: ''
    }
  ],
  centros: [
    {
      nombre: '',
      direccion: ''
    }
  ],
  formaciones: [
    {
      nombre: '',
      tipo: 'presencial',
      duracion: 8
    }
  ]
});

onMounted(() => {
  // Verificar estado de autenticación
  onAuthStateChanged(auth, (user) => {
    if (user) {
      usuario.value = AuthService.getCurrentUser();
      cargarDatos();
    } else {
      // Si no hay usuario, redirigir al login
      router.push('/login');
    }
  });
});

// Cargar datos desde Firestore
const cargarDatos = async () => {
  try {
    cargando.value = true;
    error.value = null;
    
    // Limpiar datos previos para evitar mostrar datos de otro usuario
    empresas.value = [];
    
    // Verificar doble autenticación (Firebase y JWT)
    const user = auth.currentUser;
    const jwtToken = localStorage.getItem('authToken');
    const userData = AuthService.getCurrentUser();
    
    console.log("HomeView - Verificando autenticación:");
    console.log("- Firebase User:", user ? user.email : "No");
    console.log("- JWT Token:", jwtToken ? "Sí" : "No");
    console.log("- User Data:", userData);
    
    // Si hay JWT pero no hay usuario Firebase, intentar iniciar sesión con Firebase
    if (!user && jwtToken && userData) {
      console.warn("HomeView - Hay JWT pero no hay sesión en Firebase. Intentando recuperar sesión...");
      
      try {
        // Intentar iniciar sesión silenciosamente usando credenciales guardadas
        // Esto es solo para sincronizar Firebase, no para mostrar UI
        await FirebaseAuthService.reautenticar();
        
        // Verificar si ahora tenemos usuario Firebase
        const userAfterReauth = auth.currentUser;
        
        if (userAfterReauth) {
          console.log("HomeView - Sesión Firebase recuperada para:", userAfterReauth.email);
          // Intentar cargar datos otra vez
          setTimeout(() => cargarDatos(), 500);
          return;
        }
      } catch (error) {
        console.error("Error al recuperar sesión Firebase:", error);
      }
    }
    
    // Si no hay usuario o token, mostrar error
    if (!user || !jwtToken) {
      console.error("HomeView - Autenticación incompleta:", 
                    "Firebase:", user ? "Sí" : "No", 
                    "JWT:", jwtToken ? "Sí" : "No");
      
      error.value = 'No se pudo verificar tu autenticación. Por favor, inicia sesión de nuevo.';
      cargando.value = false;
      
      // Esperar un momento antes de redirigir
      setTimeout(() => {
        router.push('/login');
      }, 2000);
      
      return;
    }
    
    console.log(`HomeView está cargando datos para: ${user.email} (UID: ${user.uid})`);
    
    // Obtener contadores
    const contadores = await FirestoreService.obtenerContadores();
    empresasCount.value = contadores.empresasCount;
    departamentosCount.value = contadores.departamentosCount;
    centrosCount.value = contadores.centrosCount;
    formacionesCount.value = contadores.formacionesCount;
    
    // Obtener empresas
    const empresasRecibidas = await FirestoreService.obtenerEmpresas();
    
    // Triple verificación: solo mostrar empresas del usuario actual
    empresas.value = empresasRecibidas.filter(empresa => {
      const perteneceAlUsuario = empresa.creadoPor === user.uid;
      if (!perteneceAlUsuario) {
        console.error(`⚠️ ALERTA DE SEGURIDAD: Se detectó empresa que no pertenece al usuario actual: ${empresa.nombre}`);
      }
      return perteneceAlUsuario;
    });
    
    console.log(`HomeView: Mostrando ${empresas.value.length} empresas para ${user.email}`);
    
  } catch (err) {
    console.error("Error al cargar datos en HomeView:", err);
    error.value = 'No se pudieron cargar los datos. Por favor, inténtalo de nuevo.';
  } finally {
    cargando.value = false;
  }
};

// Formatear fecha
const formatDate = (date) => {
  if (!date) return 'N/A';
  
  // Si date es un string ISO, convertirlo a objeto Date
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Funciones para manejar los departamentos
const agregarDepartamento = () => {
  nuevaEmpresa.departamentos.push({
    nombre: ''
  });
};

const eliminarDepartamento = (index) => {
  nuevaEmpresa.departamentos.splice(index, 1);
};

// Funciones para manejar los centros
const agregarCentro = () => {
  nuevaEmpresa.centros.push({
    nombre: '',
    direccion: ''
  });
};

const eliminarCentro = (index) => {
  nuevaEmpresa.centros.splice(index, 1);
};

// Funciones para manejar las formaciones
const agregarFormacion = () => {
  nuevaEmpresa.formaciones.push({
    nombre: '',
    tipo: 'presencial',
    duracion: 8
  });
};

const eliminarFormacion = (index) => {
  nuevaEmpresa.formaciones.splice(index, 1);
};

// Guardar empresa en Firestore
const guardarEmpresa = async () => {
  try {
    guardando.value = true;
    
    if (modoEdicion.value && empresaEditandoId.value) {
      // Actualizar empresa existente
      await actualizarEmpresaExistente();
    } else {
      // Crear nueva empresa
      await FirestoreService.guardarEmpresa(nuevaEmpresa);
    }
    
    // Recargar datos
    await cargarDatos();
    
    // Cerrar el modal y limpiar el formulario
    showFormModal.value = false;
    resetearFormulario();
    
    // Mostrar mensaje de éxito
    // Aquí se podría añadir un toast o notificación
    
  } catch (err) {
    console.error('Error al guardar empresa:', err);
    error.value = modoEdicion.value ? 
      'No se pudo actualizar la empresa. Por favor, inténtalo de nuevo.' : 
      'No se pudo guardar la empresa. Por favor, inténtalo de nuevo.';
  } finally {
    guardando.value = false;
  }
};

// Actualizar empresa existente
const actualizarEmpresaExistente = async () => {
  try {
    // Implementar la lógica para actualizar la empresa
    // Por ahora, una versión simple para actualizar solo los datos principales
    // En una implementación completa, se debería manejar también las subcolecciones
    
    const empresaData = {
      id: empresaEditandoId.value,
      nombre: nuevaEmpresa.nombre,
      descripcion: nuevaEmpresa.descripcion || "",
      fechaCreacion: nuevaEmpresa.fechaCreacion,
      ciudad: nuevaEmpresa.ciudad || "",
      fechaActualizacion: new Date().toISOString()
    };
    
    
    // Actualizar empresa principal
    await FirestoreService.actualizarEmpresa(empresaEditandoId.value, empresaData);
    
    // Actualizar subcolecciones
    await FirestoreService.actualizarSubcolecciones(
      empresaEditandoId.value,
      nuevaEmpresa.departamentos,
      nuevaEmpresa.centros,
      nuevaEmpresa.formaciones
    );
    
    modoEdicion.value = false;
    empresaEditandoId.value = null;
    
    return true;
  } catch (error) {
    console.error("Error al actualizar empresa:", error);
    throw error;
  }
};

// Editar empresa
const editarEmpresa = (empresa) => {
  console.log("Editando empresa:", empresa);
  modoEdicion.value = true;
  empresaEditandoId.value = empresa.id;
  
  // Cargar datos de la empresa en el formulario
  nuevaEmpresa.nombre = empresa.nombre || '';
  nuevaEmpresa.fechaCreacion = empresa.fechaCreacion || '';
  nuevaEmpresa.descripcion = empresa.descripcion || '';
  nuevaEmpresa.ciudad = empresa.ciudad || '';
  
  // Cargar departamentos, centros y formaciones
  cargarSubcolecciones(empresa.id);
  
  // Mostrar el modal
  showFormModal.value = true;
};

// Cargar subcolecciones para edición
const cargarSubcolecciones = async (empresaId) => {
  try {
    // Cargar departamentos
    const departamentos = await FirestoreService.obtenerDepartamentos(empresaId);
    if (departamentos && departamentos.length > 0) {
      nuevaEmpresa.departamentos = departamentos;
    } else {
      nuevaEmpresa.departamentos = [{ nombre: '' }];
    }
    
    // Cargar centros
    const centros = await FirestoreService.obtenerCentros(empresaId);
    if (centros && centros.length > 0) {
      nuevaEmpresa.centros = centros;
    } else {
      nuevaEmpresa.centros = [{ nombre: '', direccion: '' }];
    }
    
    // Cargar formaciones
    const formaciones = await FirestoreService.obtenerFormaciones(empresaId);
    if (formaciones && formaciones.length > 0) {
      nuevaEmpresa.formaciones = formaciones;
    } else {
      nuevaEmpresa.formaciones = [{ nombre: '', tipo: 'presencial', duracion: 8 }];
    }
  } catch (error) {
    console.error("Error al cargar subcolecciones:", error);
    error.value = "No se pudieron cargar los datos para edición. Por favor, inténtalo de nuevo.";
  }
};

// Resetear formulario
const resetearFormulario = () => {
  nuevaEmpresa.nombre = '';
  nuevaEmpresa.fechaCreacion = '';
  nuevaEmpresa.descripcion = '';
  nuevaEmpresa.ciudad = '';
  nuevaEmpresa.departamentos = [{
    nombre: ''
  }];
  nuevaEmpresa.centros = [{
    nombre: '',
    direccion: ''
  }];
  nuevaEmpresa.formaciones = [{
    nombre: '',
    tipo: 'presencial',
    duracion: 8
  }];
};

// Confirmar eliminación
const confirmarEliminar = (empresa) => {
  empresaAEliminar.value = empresa;
  mostrarConfirmacion.value = true;
};

// Eliminar empresa
const eliminarEmpresa = async () => {
  if (!empresaAEliminar.value) return;
  
  try {
    eliminando.value = true;
    
    // Eliminar la empresa y todas sus relaciones
    await FirestoreService.eliminarEmpresa(empresaAEliminar.value.id);
    
    // Recargar datos
    await cargarDatos();
    
    // Cerrar modal de confirmación
    mostrarConfirmacion.value = false;
    empresaAEliminar.value = null;
    
    // Mostrar mensaje de éxito
    // Aquí se podría añadir un toast o notificación
    
  } catch (err) {
    console.error('Error al eliminar empresa:', err);
    error.value = 'No se pudo eliminar la empresa. Por favor, inténtalo de nuevo.';
  } finally {
    eliminando.value = false;
  }
};

// Logout function modificada para limpiar todos los datos
const logout = () => {
  console.log("Cerrando sesión y limpiando datos...");
  
  // Limpiar todos los datos locales
  empresas.value = [];
  empresasCount.value = 0;
  departamentosCount.value = 0;
  centrosCount.value = 0;
  formacionesCount.value = 0;
  
  // Restablecer formularios y estados
  resetearFormulario();
  showFormModal.value = false;
  showViewModal.value = false;
  
  // Llamamos al método logout de AuthService
  AuthService.logout();
  
  // Limpiamos cualquier estado de la aplicación
  usuario.value = null;
  
  // Eliminamos cualquier otro dato de la sesión 
  localStorage.clear();
  sessionStorage.clear();
  
  // Disparar evento para actualizar la navegación
  window.dispatchEvent(new CustomEvent('auth-state-changed'));
  
  // Forzamos la redirección
  router.push('/login');
};

// Ver detalles de empresa
const verEmpresa = async (empresa) => {
  // Limpiar datos previos
  Object.keys(empresaActual).forEach(key => {
    if (Array.isArray(empresaActual[key])) {
      empresaActual[key] = [];
    } else {
      empresaActual[key] = '';
    }
  });
  
  // Cargar datos básicos de la empresa
  empresaActual.id = empresa.id;
  empresaActual.nombre = empresa.nombre || '';
  empresaActual.fechaCreacion = empresa.fechaCreacion || '';
  empresaActual.descripcion = empresa.descripcion || '';
  empresaActual.ciudad = empresa.ciudad || '';
  
  // Mostrar el modal y cargar subcolecciones
  showViewModal.value = true;
  cargando.value = true;
  
  try {
    // Cargar subcolecciones
    await cargarSubcoleccionesParaVista(empresa.id);
  } catch (error) {
    console.error("Error al cargar datos para vista:", error);
  } finally {
    cargando.value = false;
  }
};

// Cargar subcolecciones para la vista de detalles
const cargarSubcoleccionesParaVista = async (empresaId) => {
  try {
    // Cargar departamentos
    const departamentos = await FirestoreService.obtenerDepartamentos(empresaId);
    empresaActual.departamentos = departamentos || [];
    
    // Cargar centros
    const centros = await FirestoreService.obtenerCentros(empresaId);
    empresaActual.centros = centros || [];
    
    // Cargar formaciones
    const formaciones = await FirestoreService.obtenerFormaciones(empresaId);
    empresaActual.formaciones = formaciones || [];
  } catch (error) {
    console.error("Error al cargar subcolecciones para vista:", error);
    throw error;
  }
};

// Editar desde la vista de detalles
const editarEmpresaDesdeVista = () => {
  // Cerrar modal de vista
  showViewModal.value = false;
  
  // Buscar la empresa completa en la lista
  const empresa = empresas.value.find(e => e.id === empresaActual.id);
  if (empresa) {
    // Abrir modal de edición con los datos de la empresa
    editarEmpresa(empresa);
  } else {
    console.error("No se encontró la empresa para editar");
  }
};

// Formatear tipo de formación
const formatTipoFormacion = (tipo) => {
  const tipos = {
    presencial: 'Presencial',
    virtual: 'Virtual',
    hibrida: 'Híbrida'
  };
  return tipos[tipo] || tipo;
};

// Descargar PDF con detalles de la empresa
const descargarPDF = () => {
  try {
    // Crear nuevo documento PDF
    const doc = new jsPDF();
    const title = `Detalles de Empresa: ${empresaActual.nombre}`;
    
    // Configurar estilo del documento
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text(title, 14, 22);
    
    // Información básica
    doc.setFontSize(12);
    doc.text('Información de la empresa', 14, 35);
    
    const infoEmpresa = [
      ['Nombre', empresaActual.nombre],
      ['Fecha de creación', formatDate(empresaActual.fechaCreacion)],
      ['Ciudad', empresaActual.ciudad || 'No especificada'],
      ['Descripción', empresaActual.descripcion || 'Sin descripción']
    ];
    
    // Usar autoTable como plugin
    autoTable(doc, {
      startY: 40,
      head: [['Campo', 'Valor']],
      body: infoEmpresa,
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      styles: { fontSize: 10 },
      columnStyles: { 0: { cellWidth: 40 } }
    });
    
    // Departamentos
    let currentY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(12);
    doc.text('Departamentos', 14, currentY);
    
    if (empresaActual.departamentos.length > 0) {
      const departamentosData = empresaActual.departamentos.map((dep, index) => [
        `Departamento ${index + 1}`, dep.nombre
      ]);
      
      autoTable(doc, {
        startY: currentY + 5,
        head: [['#', 'Nombre']],
        body: departamentosData,
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        styles: { fontSize: 10 }
      });
      
      currentY = doc.lastAutoTable.finalY + 15;
    } else {
      doc.setFontSize(10);
      doc.text('No hay departamentos registrados.', 14, currentY + 10);
      currentY += 20;
    }
    
    // Centros
    doc.setFontSize(12);
    doc.text('Centros', 14, currentY);
    
    if (empresaActual.centros.length > 0) {
      const centrosData = empresaActual.centros.map((centro, index) => [
        `Centro ${index + 1}`, centro.nombre, centro.direccion || 'No especificada'
      ]);
      
      autoTable(doc, {
        startY: currentY + 5,
        head: [['#', 'Nombre', 'Dirección']],
        body: centrosData,
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        styles: { fontSize: 10 }
      });
      
      currentY = doc.lastAutoTable.finalY + 15;
    } else {
      doc.setFontSize(10);
      doc.text('No hay centros registrados.', 14, currentY + 10);
      currentY += 20;
    }
    
    // Formaciones
    // Verificar si necesitamos una nueva página
    if (currentY > 240) {
      doc.addPage();
      currentY = 20;
    }
    
    doc.setFontSize(12);
    doc.text('Formaciones', 14, currentY);
    
    if (empresaActual.formaciones.length > 0) {
      const formacionesData = empresaActual.formaciones.map((formacion, index) => [
        `Formación ${index + 1}`, formacion.nombre, formatTipoFormacion(formacion.tipo), `${formacion.duracion} horas`
      ]);
      
      autoTable(doc, {
        startY: currentY + 5,
        head: [['#', 'Nombre', 'Tipo', 'Duración']],
        body: formacionesData,
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        styles: { fontSize: 10 }
      });
    } else {
      doc.setFontSize(10);
      doc.text('No hay formaciones registradas.', 14, currentY + 10);
    }
    
    // Añadir fecha y hora de generación
    const now = new Date();
    const fechaGeneracion = `Documento generado el ${now.toLocaleDateString('es-ES')} a las ${now.toLocaleTimeString('es-ES')}`;
    const pageCount = doc.internal.getNumberOfPages();
    
    // Añadir pie de página en todas las páginas
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(fechaGeneracion, 14, doc.internal.pageSize.height - 10);
      doc.text(`Página ${i} de ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
    }
    
    // Guardar el PDF
    doc.save(`empresa_${empresaActual.nombre.replace(/\s+/g, '_')}.pdf`);
    
  } catch (error) {
    console.error("Error al generar PDF:", error);
    alert("Error al generar el PDF. Por favor, inténtelo de nuevo.");
  }
};
</script>

<style scoped>
.form-stats {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;
}

.stat-pill {
  background-color: var(--pale-blue);
  color: var(--primary-color);
  border-radius: 12px;
  padding: 0.2rem 0.6rem;
  font-size: 0.8rem;
  font-weight: 500;
}

/* Estilos para la vista de detalles */
.view-field {
  padding: 0.75rem;
  background-color: #f9f9f9;
  border-radius: 4px;
  border: 1px solid var(--border-color);
  min-height: 2.5rem;
  line-height: 1.5;
}

.view-field.description {
  min-height: 5rem;
  white-space: pre-line;
}

.view-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.view-item {
  background-color: #f9f9f9;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.view-item-title {
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
}

.view-item-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.empty-message {
  color: var(--light-text);
  font-style: italic;
  padding: 1rem;
  text-align: center;
  background-color: #f9f9f9;
  border-radius: 8px;
  border: 1px dashed var(--border-color);
}

.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.welcome-title {
  margin-bottom: 0.5rem;
  color: var(--primary-color);
}
.welcome-subtitle {
  color: var(--light-text);
  font-size: 1.1rem;
}

.user-name {
  color: var(--primary-color);
  font-weight: 600;
}

.action-buttons {
  display: flex;
  gap: 1rem;
}

.btn {
  display: inline-block;
  padding: 0.6rem 1.2rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  font-size: 0.95rem;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background-color: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 70, 152, 0.2);
}

.btn-secondary {
  background-color: var(--secondary-color);
  color: white;
}

.btn-secondary:hover {
  background-color: #5f89be;
  transform: translateY(-2px);
}

.btn-danger {
  background-color: var(--danger-color);
  color: white;
}

.btn-danger:hover:not([disabled]) {
  background-color: #d32f2f;
  transform: translateY(-2px);
}

.btn-create {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.icon {
  font-size: 1.2rem;
  font-weight: bold;
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.stat-card {
  background-color: var(--card-background);
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: var(--shadow);
  text-align: center;
}

.stat-card h3 {
  color: var(--light-text);
  margin-bottom: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary-color);
}

.forms-section {
  margin-top: 3rem;
}

.forms-section h2 {
  margin-bottom: 1.5rem;
  color: var(--text-color);
  font-size: 1.5rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  background-color: var(--bg-light);
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.empty-state p {
  margin-bottom: 1.5rem;
  color: var(--light-text);
}

.forms-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.form-card {
  background-color: var(--card-background);
  border-radius: 8px;
  box-shadow: var(--shadow);
  padding: 1.5rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.form-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.form-info {
  cursor: pointer;
  transition: all 0.2s ease;
  flex-grow: 1;
}

.form-info:hover {
  /* Se elimina el cambio de color de fondo */
  border-radius: 8px 8px 0 0;
}

.form-info h3 {
  margin-bottom: 0.5rem;
  color: var(--primary-color);
}

.form-info p {
  color: var(--light-text);
  margin-bottom: 1rem;
  min-height: 3rem;
}

.form-meta {
  display: flex;
  justify-content: space-between;
  color: var(--light-text);
  font-size: 0.85rem;
  margin-bottom: 1rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.btn-icon {
  padding: 0.5rem 0.75rem;
  font-size: 0.8rem;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: #f5f5f5;
  color: var(--text-color);
  border: 1px solid transparent;
}

.btn-edit {
  border-color: var(--secondary-color);
}

.btn-view {
  border-color: var(--primary-color);
}

.btn-delete {
  border-color: var(--danger-color);
}

.btn-edit:hover {
  background-color: var(--secondary-color);
  color: white;
}

.btn-view:hover {
  background-color: var(--primary-color);
  color: white;
}

.btn-delete:hover {
  background-color: var(--danger-color);
  color: white;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal-small {
  max-width: 500px;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 10;
}

.modal-header h2 {
  margin: 0;
  color: var(--primary-color);
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--light-text);
  transition: color 0.2s;
}

.btn-close:hover {
  color: var(--danger-color);
}

.modal-body {
  padding: 1.5rem;
  position: relative;
}

.saving-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 15;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--text-color);
}

.form-group input, 
.form-group textarea, 
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus, 
.form-group textarea:focus, 
.form-group select:focus {
  border-color: var(--primary-color);
  outline: none;
}

.section-title {
  margin: 2rem 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
  color: var(--primary-color);
}

.questions-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.question-item {
  background-color: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.question-header h4 {
  margin: 0;
  color: var(--primary-color);
}

.option-item {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.btn-delete-small {
  background: none;
  border: none;
  color: var(--danger-color);
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0 0.5rem;
}

.btn-small {
  padding: 0.4rem 0.8rem;
  font-size: 0.8rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.button-cancel {
  padding: 0.6em 1.2em;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  letter-spacing: 3px;
  text-transform: uppercase;
  cursor: pointer;
  color: #e62222;
  transition: all 1000ms;
  font-size: 14px;
  position: relative;
  overflow: hidden;
  outline: 2px solid #e62222;
  background-color: transparent;
}

.button-cancel:hover {
  color: #ffffff;
  transform: scale(1.1);
  outline: 2px solid #ff3636;
  box-shadow: 4px 5px 17px -4px #a31515;
}

.button-cancel::before {
  content: "";
  position: absolute;
  left: -50px;
  top: 0;
  width: 0;
  height: 100%;
  background-color: #e62222;
  transform: skewX(45deg);
  z-index: -1;
  transition: width 1000ms;
}

.button-cancel:hover::before {
  width: 250%;
}

.btn-save {
  background-color: var(--success-color);
  color: white;
}

.btn-save:hover:not([disabled]) {
  background-color: #3d9a40;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(76, 175, 80, 0.2);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

.loading-container, 
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
  background-color: white;
  border-radius: 8px;
  box-shadow: var(--shadow);
  margin-top: 2rem;
}

.loader {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 70, 152, 0.2);
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.error-container {
  color: var(--danger-color);
}

.error-container p {
  margin-bottom: 1rem;
}

.warning-text {
  color: var(--danger-color);
  margin-top: 1rem;
  font-size: 0.9rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive styles */
@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .action-buttons {
    width: 100%;
  }
  
  .btn-create {
    width: 100%;
    justify-content: center;
  }
  
  .forms-list {
    grid-template-columns: 1fr;
  }
}

/* Estilos para el botón flotante */
.btn-floating {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 70, 152, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 99;
}

.btn-floating .icon {
  font-size: 2rem;
  line-height: 1;
}

.btn-floating:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 70, 152, 0.4);
  background-color: var(--primary-hover);
}

/* Estilos para el banner de Alicante */
.alicante-banner-showcase {
  margin: 20px 0;
  padding: 20px;
  border-radius: 12px;
  background: linear-gradient(to right, #f5f5f5, #e0e0e0);
  display: flex;
  align-items: center;
  gap: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.banner-image-container {
  flex: 0 0 200px;
  max-width: 200px;
}

.banner-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  transition: transform 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.banner-image:hover {
  transform: scale(1.03);
}

.banner-info {
  flex: 1;
}

.banner-info h3 {
  color: #004698;
  margin-bottom: 10px;
  font-size: 1.3rem;
  font-weight: 600;
}

.banner-info p {
  color: #555;
  font-size: 0.95rem;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .alicante-banner-showcase {
    flex-direction: column;
    text-align: center;
    padding: 15px;
  }
  
  .banner-image-container {
    max-width: 180px;
    margin: 0 auto;
  }
  
  .banner-info h3 {
    font-size: 1.2rem;
    margin-top: 10px;
  }
  
  .banner-info p {
    font-size: 0.9rem;
  }
}

/* Botón animado de descarga */
.buttonDownload {
  display: inline-block;
  position: relative;
  padding: 10px 25px;
  background-color: #4CC713;
  color: white;
  font-family: sans-serif;
  text-decoration: none;
  font-size: 0.9em;
  text-align: center;
  text-indent: 15px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.buttonDownload:hover {
  background-color: #45a21a;
  color: white;
}

.buttonDownload:before, .buttonDownload:after {
  content: ' ';
  display: block;
  position: absolute;
  left: 15px;
  top: 52%;
}

.buttonDownload:before {
  width: 10px;
  height: 2px;
  border-style: solid;
  border-width: 0 2px 2px;
}

.buttonDownload:after {
  width: 0;
  height: 0;
  margin-left: 3px;
  margin-top: -7px;
  border-style: solid;
  border-width: 4px 4px 0 4px;
  border-color: transparent;
  border-top-color: inherit;
  animation: downloadArrow 1s linear infinite;
  animation-play-state: paused;
}

.buttonDownload:hover:before {
  border-color: #cdefbd;
}

.buttonDownload:hover:after {
  border-top-color: #cdefbd;
  animation-play-state: running;
}

@keyframes downloadArrow {
  0% {
    margin-top: -7px;
    opacity: 1;
  }

  0.001% {
    margin-top: -15px;
    opacity: 0.4;
  }

  50% {
    opacity: 1;
  }

  100% {
    margin-top: 0;
    opacity: 0.4;
  }
}

/* Botón con efecto de barrido */
.button {
  padding: 0.6em 1.2em;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  letter-spacing: 3px;
  text-transform: uppercase;
  cursor: pointer;
  color: #004698;
  transition: all 1000ms;
  font-size: 14px;
  position: relative;
  overflow: hidden;
  outline: 2px solid #004698;
  background-color: transparent;
}

.button:hover {
  color: #ffffff;
  transform: scale(1.1);
  outline: 2px solid #0062d6;
  box-shadow: 4px 5px 17px -4px #002d6e;
}

.button::before {
  content: "";
  position: absolute;
  left: -50px;
  top: 0;
  width: 0;
  height: 100%;
  background-color: #004698;
  transform: skewX(45deg);
  z-index: -1;
  transition: width 1000ms;
}

.button:hover::before {
  width: 250%;
}

/* Botón de eliminar con animación */
.noselect {
  width: 130px;
  height: 38px;
  cursor: pointer;
  display: flex;
  align-items: center;
  background: #e62222;
  border: none;
  border-radius: 5px;
  box-shadow: 1px 1px 3px rgba(0,0,0,0.15);
  transition: 200ms;
}

.noselect .text {
  transform: translateX(20px);
  color: white;
  font-weight: bold;
  font-size: 14px;
  transition: 200ms;
}

.noselect .icon {
  position: absolute;
  border-left: 1px solid #c41b1b;
  transform: translateX(90px);
  height: 28px;
  width: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 200ms;
}

.noselect svg {
  width: 15px;
  fill: #eee;
}

.noselect:hover {
  background: #ff3636;
}

.noselect:hover .text {
  color: transparent;
}

.noselect:hover .icon {
  width: 130px;
  border-left: none;
  transform: translateX(0);
}

.noselect:focus {
  outline: none;
}

.noselect:active .icon svg {
  transform: scale(0.8);
}

.noselect:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.noselect:disabled .icon {
  border-left: 1px solid #b1b1b1;
}

/* Botón Crear empresa con diseño especial */
.btn-crear-empresa {
 position: relative;
 height: 50px;
 padding: 0 30px;
 border: 2px solid #000;
 background: #e8e8e8;
 user-select: none;
 white-space: nowrap;
 transition: all .05s linear;
 font-family: inherit;
}

.btn-crear-empresa:before, .btn-crear-empresa:after {
 content: "";
 position: absolute;
 background: #e8e8e8;
 transition: all .2s linear;
}

.btn-crear-empresa:before {
 width: calc(100% + 6px);
 height: calc(100% - 16px);
 top: 8px;
 left: -3px;
}

.btn-crear-empresa:after {
 width: calc(100% - 16px);
 height: calc(100% + 6px);
 top: -3px;
 left: 8px;
}

.btn-crear-empresa:hover {
 cursor: crosshair;
}

.btn-crear-empresa:active {
 transform: scale(0.95);
}

.btn-crear-empresa:hover:before {
 height: calc(100% - 32px);
 top: 16px;
}

.btn-crear-empresa:hover:after {
 width: calc(100% - 32px);
 left: 16px;
}

.btn-crear-empresa span {
 font-size: 15px;
 z-index: 3;
 position: relative;
 font-weight: 600;
}
</style>