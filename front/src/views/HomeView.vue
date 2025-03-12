<template>
  <div class="dashboard-container">
    <!-- Encabezado del dashboard -->
    <div class="dashboard-header">
      <div class="welcome-section">
        <h1 class="welcome-title">Dashboard</h1>
        <p class="welcome-subtitle" v-if="usuario">Bienvenido, <span class="user-name">{{ usuario.nombre }}</span></p>
      </div>
      <div class="action-buttons">
        <button class="btn btn-primary btn-create" @click="showFormModal = true; modoEdicion = false;">
          <span class="icon">+</span> Crear nueva empresa
        </button>
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
            <div class="form-info">
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
              <button class="btn btn-icon btn-edit" @click="editarEmpresa(empresa)">Editar</button>
              <button class="btn btn-icon btn-view">Ver</button>
              <button class="btn btn-icon btn-delete" @click="confirmarEliminar(empresa)">Eliminar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
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
              <button type="button" class="btn btn-cancel" @click="showFormModal = false">Cancelar</button>
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
            <button type="button" class="btn btn-cancel" @click="mostrarConfirmacion = false">Cancelar</button>
            <button type="button" class="btn btn-danger" @click="eliminarEmpresa" :disabled="eliminando">
              {{ eliminando ? 'Eliminando...' : 'Eliminar' }}
            </button>
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

const router = useRouter();
const auth = getAuth();
const usuario = ref(null);
const showFormModal = ref(false);
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
    console.log("====== INICIO cargarDatos en HomeView ======");
    cargando.value = true;
    error.value = null;
    
    console.log("Obteniendo usuario actual:", auth.currentUser?.uid);
    
    // Obtener contadores
    console.log("Solicitando contadores...");
    const contadores = await FirestoreService.obtenerContadores();
    console.log("Contadores recibidos:", contadores);
    empresasCount.value = contadores.empresasCount;
    departamentosCount.value = contadores.departamentosCount;
    centrosCount.value = contadores.centrosCount;
    formacionesCount.value = contadores.formacionesCount;
    
    // Obtener empresas
    console.log("Solicitando lista de empresas...");
    const empresasRecibidas = await FirestoreService.obtenerEmpresas();
    console.log(`Recibidas ${empresasRecibidas.length} empresas:`, empresasRecibidas);
    empresas.value = empresasRecibidas;
    
    console.log("====== FIN cargarDatos en HomeView ======");
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
    
    console.log(`Actualizando empresa ${empresaEditandoId.value} con datos:`, empresaData);
    
    // Actualizar empresa principal
    await FirestoreService.actualizarEmpresa(empresaEditandoId.value, empresaData);
    
    // Actualizar subcolecciones
    console.log("Actualizando subcolecciones...");
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

const logout = () => {
  AuthService.logout();
  router.push('/login');
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
}

.form-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
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
  border: none;
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

.btn-cancel {
  background-color: #f1f1f1;
  color: var(--text-color);
}

.btn-cancel:hover {
  background-color: #e0e0e0;
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
</style>