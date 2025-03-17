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
import { ref, onMounted, reactive, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import AuthService from '../services/AuthService';
import FirestoreService from '../services/FirestoreService';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import FirebaseAuthService from '../services/FirebaseAuthService';
import axios from 'axios';
// Importar el logo e imágenes
import logoUrl from '../assets/img/impulsedata_logo.png';
import impulsaAlicanteLogo from '../assets/img/impulsaalicante.png';
import ayuntamientoLogo from '../assets/img/ayuntamiento-alicante.jpg';

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
    
    // Establecer fondo blanco (por defecto)
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');
    
    // Dibujar elementos decorativos en la portada
    doc.setFillColor(0, 70, 152); // Color azul corporativo #004698
    
    // Cuadrado grande en la esquina superior derecha
    doc.rect(doc.internal.pageSize.width - 60, 0, 60, 60, 'F');
    
    // Cuadrado mediano en la esquina inferior izquierda
    doc.rect(0, doc.internal.pageSize.height - 40, 40, 40, 'F');
    
    // Elementos decorativos adicionales
    doc.setFillColor(230, 240, 255); // Azul claro
    doc.rect(doc.internal.pageSize.width - 80, 20, 15, 15, 'F');
    doc.rect(20, doc.internal.pageSize.height - 55, 15, 15, 'F');
    
    // Líneas decorativas
    doc.setDrawColor(0, 70, 152);
    doc.setLineWidth(0.5);
    doc.line(0, 80, 30, 80);
    doc.line(doc.internal.pageSize.width - 30, 80, doc.internal.pageSize.width, 80);
    
    // Cargar y añadir las imágenes
    const imgWidth = 60;
    const imgHeight = 30;
    const startY = 30;
    
    // Añadir las imágenes una al lado de la otra
    doc.addImage(impulsaAlicanteLogo, 'PNG', 20, startY, imgWidth, imgHeight);
    doc.addImage(ayuntamientoLogo, 'JPG', doc.internal.pageSize.width - imgWidth - 20, startY, imgWidth, imgHeight);
    
    // Texto en azul corporativo para la portada con sombra
    // Efecto sombra (texto ligeramente desplazado en gris)
    doc.setTextColor(220, 220, 220);
    doc.setFontSize(40);
    doc.text('MEMORIA', 106, 121, { align: 'center' });
    doc.text('DE ACTIVIDAD', 106, 141, { align: 'center' });
    
    // Texto principal
    doc.setTextColor(0, 70, 152);
    doc.text('MEMORIA', 105, 120, { align: 'center' });
    doc.text('DE ACTIVIDAD', 105, 140, { align: 'center' });
    
    // Añadir el año con diseño moderno
    doc.setFillColor(0, 70, 152);
    doc.rect(85, 160, 40, 40, 'F');
    
    // Añadir bordes decorativos al cuadro del año
    doc.setDrawColor(230, 240, 255);
    doc.setLineWidth(0.5);
    doc.rect(83, 158, 44, 44, 'S');
    
    doc.setFontSize(30);
    // Efecto sombra para los números
    doc.setTextColor(0, 40, 100);
    doc.text('20', 106, 181, { align: 'center' });
    doc.text('25', 106, 196, { align: 'center' });
    // Números principales
    doc.setTextColor(255, 255, 255);
    doc.text('20', 105, 180, { align: 'center' });
    doc.text('25', 105, 195, { align: 'center' });

    // Diseño de la cabecera de las páginas interiores
    const diseñarCabecera = () => {
        // Fondo de cabecera con degradado
        doc.setFillColor(0, 70, 152);
        doc.rect(0, 0, doc.internal.pageSize.width, 25, 'F');
        
        // Línea decorativa
        doc.setDrawColor(230, 240, 255);
        doc.setLineWidth(0.5);
        doc.line(14, 26, doc.internal.pageSize.width - 14, 26);
        
        // Añadir logo
        doc.addImage(impulsaAlicanteLogo, 'PNG', 14, 5, 20, 15);
        
        // Nombre del proyecto
        doc.setFontSize(16);
        doc.setTextColor(255, 255, 255);
        doc.text('ImpulseData', 38, 16);
        
        // Información de contacto con diseño mejorado
      doc.setFontSize(8);
        doc.setTextColor(230, 240, 255);
        doc.text([
            'Información de contacto:',
            'Email: info@impulsedata.es',
            'Teléfono: +34 900 123 456',
            'Web: www.impulsedata.es'
        ], doc.internal.pageSize.width - 70, 8, { align: 'left' });
    };

    // Crear array para almacenar las entradas del índice y sus páginas
    const indiceEntradas = [];
    let paginaActual = 3; // Comenzamos en página 3 (después de portada e índice)

    // Función para agregar entradas al índice
    const agregarEntradaIndice = (titulo, nivel = 0) => {
        const y = 60 + (indiceEntradas.length * 12);
        
        // Fondo decorativo para cada entrada
        if (nivel === 0) {
            doc.setFillColor(230, 240, 255);
            doc.rect(10, y - 6, doc.internal.pageSize.width - 20, 10, 'F');
        }

        // Línea de puntos decorativa
        doc.setDrawColor(0, 70, 152);
        doc.setLineWidth(0.1);
        for (let i = 0; i < 50; i++) {
            doc.line(
                nivel === 0 ? 20 : 30 + (nivel * 10),
                y + 2,
                doc.internal.pageSize.width - 30,
                y + 2
            );
        }

        // Texto de la entrada
        doc.setFontSize(nivel === 0 ? 12 : 10);
        doc.setTextColor(0, 70, 152);
        doc.text(
            titulo,
            nivel === 0 ? 20 : 30 + (nivel * 10),
            y
        );

        // Número de página
        doc.text(
            paginaActual.toString(),
            doc.internal.pageSize.width - 20,
            y,
            { align: 'right' }
        );

        indiceEntradas.push({ titulo, pagina: paginaActual });
        if (nivel === 0) paginaActual++;
    };

    // Añadir página para el índice después de la portada
    doc.addPage();
    diseñarCabecera();

    // Título del índice con efectos visuales
    doc.setFillColor(0, 70, 152);
    doc.rect(0, 35, doc.internal.pageSize.width, 15, 'F');
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text('ÍNDICE', 14, 45);

    // Agregar entradas al índice
    agregarEntradaIndice('Información de la empresa');
    agregarEntradaIndice('Departamentos');
    agregarEntradaIndice('Centros');
    agregarEntradaIndice('Análisis de Formaciones');
    agregarEntradaIndice('Distribución por tipo de formación', 1);
    agregarEntradaIndice('Detalle por tipo de formación', 1);
    agregarEntradaIndice('Horas totales por tipo de formación', 1);
    agregarEntradaIndice('Formaciones ordenadas por duración', 1);

    // Añadir elementos decorativos al índice
    // Cuadrado decorativo en la esquina superior derecha
    doc.setFillColor(0, 70, 152);
    doc.rect(doc.internal.pageSize.width - 40, 0, 40, 40, 'F');

    // Línea decorativa inferior
    doc.setDrawColor(0, 70, 152);
    doc.setLineWidth(0.5);
    doc.line(10, doc.internal.pageSize.height - 30, doc.internal.pageSize.width - 10, doc.internal.pageSize.height - 30);

    // Continuar con el contenido principal
    doc.addPage();
    diseñarCabecera();

    // Estilo mejorado para el título principal
    doc.setFillColor(230, 240, 255);
    doc.rect(0, 35, doc.internal.pageSize.width, 15, 'F');
    doc.setFontSize(18);
    doc.setTextColor(0, 70, 152);
    doc.text(title, 14, 45);
    
    // Información básica con estilo mejorado
    doc.setFontSize(12);
    doc.setTextColor(0, 70, 152);
    doc.text('Información de la empresa', 14, 70);
    
    const infoEmpresa = [
      ['Nombre', empresaActual.nombre],
      ['Fecha de creación', formatDate(empresaActual.fechaCreacion)],
      ['Ciudad', empresaActual.ciudad || 'No especificada'],
      ['Descripción', empresaActual.descripcion || 'Sin descripción']
    ];
    
    // Estilo mejorado para las tablas
    const estiloTabla = {
      headStyles: { 
        fillColor: [0, 70, 152],
        textColor: 255,
        fontSize: 11,
        fontStyle: 'bold',
        halign: 'center'
      },
      bodyStyles: {
        fontSize: 10,
        lineColor: [230, 240, 255],
        lineWidth: 0.1
      },
      alternateRowStyles: {
        fillColor: [248, 250, 255]
      },
      columnStyles: {
        0: { 
          cellWidth: 40,
          fillColor: [230, 240, 255],
          textColor: [0, 70, 152],
          fontStyle: 'bold'
        }
      },
      margin: { top: 5 }
    };
    
    // Usar autoTable con el nuevo estilo
    autoTable(doc, {
      startY: 75,
      head: [['Campo', 'Valor']],
      body: infoEmpresa,
      ...estiloTabla
    });
    
    // Función para crear encabezados de sección con estilo
    const crearEncabezadoSeccion = (texto, y) => {
      // Fondo decorativo
      doc.setFillColor(230, 240, 255);
      doc.rect(10, y - 6, doc.internal.pageSize.width - 20, 10, 'F');
      
      // Líneas decorativas
      doc.setDrawColor(0, 70, 152);
      doc.setLineWidth(0.5);
      doc.line(14, y - 6, 14, y + 4);
      
      // Texto
    doc.setFontSize(12);
      doc.setTextColor(0, 70, 152);
      doc.text(texto, 20, y);
      
      return y + 15;
    };
    
    // Aplicar el nuevo estilo a todas las tablas y secciones
    let currentY = doc.lastAutoTable.finalY + 20;
    
    // Departamentos
    currentY = crearEncabezadoSeccion('Departamentos', currentY);
    
    if (empresaActual.departamentos.length > 0) {
      const departamentosData = empresaActual.departamentos.map((dep, index) => [
        `Departamento ${index + 1}`, dep.nombre
      ]);
      
      autoTable(doc, {
        startY: currentY,
        head: [['#', 'Nombre']],
        body: departamentosData,
        ...estiloTabla
      });
      
      currentY = doc.lastAutoTable.finalY + 20;
    } else {
      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128);
      doc.text('No hay departamentos registrados.', 14, currentY);
      currentY += 20;
    }
    
    // Verificar si necesitamos una nueva página
    if (currentY > doc.internal.pageSize.height - 60) {
      doc.addPage();
      diseñarCabecera();
      currentY = 40;
    }
    
    // Centros
    currentY = crearEncabezadoSeccion('Centros', currentY);
    
    if (empresaActual.centros.length > 0) {
      const centrosData = empresaActual.centros.map((centro, index) => [
        `Centro ${index + 1}`, centro.nombre, centro.direccion || 'No especificada'
      ]);
      
      autoTable(doc, {
        startY: currentY,
        head: [['#', 'Nombre', 'Dirección']],
        body: centrosData,
        ...estiloTabla
      });
      
      currentY = doc.lastAutoTable.finalY + 20;
    } else {
      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128);
      doc.text('No hay centros registrados.', 14, currentY);
      currentY += 20;
    }
    
    // Nueva página para formaciones y gráficos
      doc.addPage();
    diseñarCabecera();
    currentY = 40;
    
    // Título de la sección de formaciones con estilo
    doc.setFillColor(230, 240, 255);
    doc.rect(0, 35, doc.internal.pageSize.width, 15, 'F');
    doc.setFontSize(18);
    doc.setTextColor(0, 70, 152);
    doc.text('Análisis de Formaciones', 14, 45);
    
    // Si hay formaciones, generar visualizaciones
    if (empresaActual.formaciones.length > 0) {
      // Establecer posición inicial para la sección de distribución
      let posY = 55;
      
      // 1. Distribución por tipo de formación - GRÁFICO CIRCULAR
      currentY = crearEncabezadoSeccion('Distribución por tipo de formación', posY);
      posY += 15;
      
      // Contar formaciones por tipo
      const tiposCounts = {
        presencial: 0,
        virtual: 0,
        hibrida: 0
      };
      
      empresaActual.formaciones.forEach(formacion => {
        if (tiposCounts[formacion.tipo] !== undefined) {
          tiposCounts[formacion.tipo]++;
        }
      });
      
      // Configuración para representación visual mejorada
      const colors = {
        presencial: [0, 70, 152],     // azul corporativo
        virtual: [41, 128, 185],      // azul más claro
        hibrida: [230, 240, 255]      // azul muy claro
      };
      
      // Calcular total para porcentajes
      const total = Object.values(tiposCounts).reduce((sum, count) => sum + count, 0);
      
      if (total > 0) {
        // Configuración del gráfico circular mejorado
        const centerX = 105;
        const centerY = posY + 50;
        const radius = 40;
        
        // Añadir sombra al gráfico
        doc.setDrawColor(200, 200, 200);
        doc.setFillColor(240, 240, 240);
        doc.circle(centerX + 2, centerY + 2, radius, 'F');
        
        // Variables para el tracking del ángulo
        let startAngle = 0;
        let endAngle = 0;
        
        // Crear una leyenda mejorada
        doc.setFillColor(230, 240, 255);
        doc.rect(150, posY - 5, 50, 70, 'F');
        doc.setDrawColor(0, 70, 152);
        doc.setLineWidth(0.1);
        doc.rect(150, posY - 5, 50, 70, 'S');
        
        doc.setFontSize(10);
        doc.setTextColor(0, 70, 152);
        doc.text('Leyenda:', 155, posY + 5);
        
        let legendY = posY + 20;
        
        // Dibujar el gráfico circular mejorado
        Object.entries(tiposCounts).forEach(([tipo, count], index) => {
          if (count > 0) {
            const porcentaje = count / total;
            startAngle = endAngle;
            endAngle = startAngle + (porcentaje * 2 * Math.PI);
            
            // Dibujar sector con efecto 3D
            doc.setFillColor(...colors[tipo]);
            doc.setDrawColor(255, 255, 255);
            doc.setLineWidth(0.5);
            
            const steps = Math.max(20, Math.floor(porcentaje * 100));
            
            // Dibujar sector principal
            doc.moveTo(centerX, centerY);
            for (let i = 0; i <= steps; i++) {
              const angle = startAngle + (i * (endAngle - startAngle) / steps);
              const xPos = centerX + Math.cos(angle) * radius;
              const yPos = centerY + Math.sin(angle) * radius;
              
              if (i === 0) {
                doc.moveTo(centerX, centerY);
                doc.lineTo(xPos, yPos);
              } else {
                doc.lineTo(xPos, yPos);
              }
            }
            doc.lineTo(centerX, centerY);
            doc.fill();
            
            // Añadir borde blanco para efecto 3D
            doc.setDrawColor(255, 255, 255);
            doc.setLineWidth(0.5);
            doc.moveTo(centerX, centerY);
            for (let i = 0; i <= steps; i++) {
              const angle = startAngle + (i * (endAngle - startAngle) / steps);
              const xPos = centerX + Math.cos(angle) * radius;
              const yPos = centerY + Math.sin(angle) * radius;
              
              if (i === 0) {
                doc.moveTo(centerX, centerY);
                doc.lineTo(xPos, yPos);
              } else {
                doc.lineTo(xPos, yPos);
              }
            }
            doc.stroke();
            
            // Etiqueta de porcentaje mejorada
            if (porcentaje > 0.08) {
              const labelAngle = startAngle + ((endAngle - startAngle) / 2);
              const labelRadius = radius * 0.7;
              const labelX = centerX + Math.cos(labelAngle) * labelRadius;
              const labelY = centerY + Math.sin(labelAngle) * labelRadius;
              
              // Fondo blanco para mejor legibilidad
              doc.setFillColor(255, 255, 255);
              doc.circle(labelX, labelY, 8, 'F');
              
              doc.setFontSize(9);
              doc.setTextColor(0, 70, 152);
              doc.text(`${Math.round(porcentaje * 100)}%`, labelX, labelY, {
                align: 'center'
              });
            }
            
            // Leyenda mejorada
            doc.setFillColor(...colors[tipo]);
            doc.roundedRect(155, legendY - 4, 8, 8, 1, 1, 'F');
            
            doc.setTextColor(0, 70, 152);
            doc.setFontSize(8);
            const tipoLabel = formatTipoFormacion(tipo);
            const cantidadLabel = `${count} (${Math.round(porcentaje * 100)}%)`;
            doc.text(`${tipoLabel}: ${cantidadLabel}`, 168, legendY);
            
            legendY += 15;
          }
        });
        
        // Actualizar posición para la siguiente sección
        posY = centerY + radius + 25;
      }
      
      // 2. Tabla detallada con información sobre los tipos de formación
      currentY = crearEncabezadoSeccion('Detalle por tipo de formación', posY + 10);
      
      // Crear tabla de datos con estilo mejorado
      const detalleData = Object.entries(tiposCounts).map(([tipo, count]) => {
        const porcentaje = total > 0 ? Math.round((count / total) * 100) + '%' : '0%';
        return [
          formatTipoFormacion(tipo),
          count.toString(),
          porcentaje
        ];
      });
      
      // Añadir fila de total
      detalleData.push(['Total', total.toString(), '100%']);
      
      // Generar tabla con el detalle
      autoTable(doc, {
        startY: currentY + 5,
        head: [['Tipo', 'Cantidad', 'Porcentaje']],
        body: detalleData,
        ...estiloTabla,
        footStyles: { 
          fillColor: [230, 240, 255], 
          textColor: [0, 70, 152], 
          fontStyle: 'bold'
        }
      });
      
      // 3. Horas de formación por tipo
      currentY = doc.lastAutoTable.finalY + 20;
      currentY = crearEncabezadoSeccion('Horas totales por tipo de formación', currentY);
      
      // Calcular horas por tipo
      const horasPorTipo = {
        presencial: 0,
        virtual: 0,
        hibrida: 0
      };
      
      empresaActual.formaciones.forEach(formacion => {
        if (horasPorTipo[formacion.tipo] !== undefined) {
          horasPorTipo[formacion.tipo] += parseInt(formacion.duracion) || 0;
        }
      });
      
      // Total de horas
      const totalHoras = Object.values(horasPorTipo).reduce((sum, curr) => sum + curr, 0);
      
      // Tabla con horas y porcentajes
      const horasData = Object.entries(horasPorTipo).map(([tipo, horas]) => [
        formatTipoFormacion(tipo),
        `${horas} horas`,
        totalHoras > 0 ? `${Math.round((horas / totalHoras) * 100)}%` : '0%'
      ]);
      
      // Añadir fila de total
      horasData.push(['Total', `${totalHoras} horas`, '100%']);
      
      // Generar tabla con estilo mejorado
      autoTable(doc, {
        startY: currentY + 5,
        head: [['Tipo', 'Horas', 'Porcentaje']],
        body: horasData,
        ...estiloTabla,
        footStyles: { 
          fillColor: [230, 240, 255], 
          textColor: [0, 70, 152], 
          fontStyle: 'bold'
        }
      });
      
      // 4. Lista de formaciones por duración
      currentY = doc.lastAutoTable.finalY + 20;
      currentY = crearEncabezadoSeccion('Formaciones ordenadas por duración', currentY);
      
      // Ordenar formaciones por duración
      const formacionesOrdenadas = [...empresaActual.formaciones].sort((a, b) => 
        (parseInt(b.duracion) || 0) - (parseInt(a.duracion) || 0)
      );
      
      // Datos para la tabla
      const formacionesData = formacionesOrdenadas.map((formacion, index) => [
        index + 1,
        formacion.nombre,
        formatTipoFormacion(formacion.tipo),
        `${formacion.duracion} horas`
      ]);
      
      // Generar tabla con estilo mejorado
      autoTable(doc, {
        startY: currentY + 5,
        head: [['#', 'Nombre', 'Tipo', 'Duración']],
        body: formacionesData,
        ...estiloTabla
      });
      
    } else {
      // Mensaje cuando no hay formaciones
      doc.setFontSize(12);
      doc.setTextColor(128, 128, 128);
      doc.text('No hay datos de formaciones disponibles para generar gráficos.', 14, 60);
    }
    
    // Añadir fecha y hora de generación con estilo mejorado
    const now = new Date();
    const fechaGeneracion = `Documento generado el ${now.toLocaleDateString('es-ES')} a las ${now.toLocaleTimeString('es-ES')}`;
    const pageCount = doc.internal.getNumberOfPages();
    
    // Añadir pie de página mejorado en todas las páginas
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      
      // Fondo del pie de página
      doc.setFillColor(248, 250, 255);
      doc.rect(0, doc.internal.pageSize.height - 20, doc.internal.pageSize.width, 20, 'F');
      
      // Línea decorativa
      doc.setDrawColor(0, 70, 152);
      doc.setLineWidth(0.1);
      doc.line(10, doc.internal.pageSize.height - 15, doc.internal.pageSize.width - 10, doc.internal.pageSize.height - 15);
      
      // Texto del pie de página
      doc.setFontSize(8);
      doc.setTextColor(0, 70, 152);
      doc.text(fechaGeneracion, 14, doc.internal.pageSize.height - 8);
      doc.text(`Página ${i} de ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 8);
    }
    
    // Guardar el PDF
    doc.save(`empresa_${empresaActual.nombre.replace(/\s+/g, '_')}.pdf`);
    
  } catch (error) {
    console.error("Error al completar el PDF:", error);
    alert("Error al generar el PDF. Por favor, inténtelo de nuevo.");
  }
};
</script>

<style src="../assets/Home.css"></style>