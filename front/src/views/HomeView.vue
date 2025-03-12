<template>
  <div class="dashboard-container">
    <!-- Encabezado del dashboard -->
    <div class="dashboard-header">
      <div class="welcome-section">
        <h1 class="welcome-title">Dashboard</h1>
        <p class="welcome-subtitle" v-if="usuario">Bienvenido, <span class="user-name">{{ usuario.nombre }}</span></p>
      </div>
      <div class="action-buttons">
        <button class="btn btn-primary btn-create" @click="showFormModal = true">
          <span class="icon">+</span> Crear nuevo fromulario
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
      </div>
      
      <!-- Lista de empresas -->
      <div class="forms-section">
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
            </div>
            <div class="form-actions">
              <button class="btn btn-icon btn-edit">Editar</button>
              <button class="btn btn-icon btn-view">Ver</button>
              <button class="btn btn-icon btn-delete">Eliminar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Modal para crear empresa -->
    <div class="modal-overlay" v-if="showFormModal" @click.self="showFormModal = false">
      <div class="modal-container">
        <div class="modal-header">
          <h2>Crear nueva empresa</h2>
          <button class="btn-close" @click="showFormModal = false">×</button>
        </div>
        <div class="modal-body">
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
              <button type="submit" class="btn btn-save">Guardar empresa</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import AuthService from '../services/AuthService';

const router = useRouter();
const usuario = ref(null);
const showFormModal = ref(false);
const empresasCount = ref(0);
const departamentosCount = ref(0);
const centrosCount = ref(0);

// Mock data para empresas
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
  // Obtener información del usuario desde localStorage
  usuario.value = AuthService.getCurrentUser();
  
  // Si no hay usuario, redirigir al login (por mientras COMENTADO)
  //if (!usuario.value) {
  //  router.push('/login');
  //} else {
    // Cargar datos de ejemplo (en una aplicación real, estos datos vendrían del backend)
    cargarDatosEjemplo();
  //}
});

// Función para cargar datos de ejemplo
const cargarDatosEjemplo = () => {
  empresasCount.value = 2;
  departamentosCount.value = 12;
  centrosCount.value = 5;
  
  empresas.value = [
    /*{
      id: 1,
      nombre: 'Tecnología Innovadora S.A.',
      descripcion: 'Empresa dedicada al desarrollo de soluciones tecnológicas para diversos sectores',
      fechaCreacion: new Date(2022, 5, 12),
      ciudad: 'Alicante'
    },
    {
      id: 2,
      nombre: 'Consultores Asociados',
      descripcion: 'Servicios de consultoría empresarial y formación profesional',
      fechaCreacion: new Date(2023, 2, 5),
      ciudad: 'Alicante'
    }*/
  ];
};

// Formatear fecha
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-ES', {
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

const guardarEmpresa = () => {
  // Aquí iría la lógica para guardar la empresa en el backend
  console.log('Guardando empresa:', nuevaEmpresa);
  
  // Crear una copia de la empresa para añadirla a la lista
  const nuevaEmpresaGuardada = {
    id: empresas.value.length + 1,
    nombre: nuevaEmpresa.nombre,
    descripcion: nuevaEmpresa.descripcion,
    fechaCreacion: new Date(nuevaEmpresa.fechaCreacion),
    ciudad: nuevaEmpresa.ciudad
  };
  
  // Añadir la empresa a la lista
  empresas.value.push(nuevaEmpresaGuardada);
  
  // Actualizar contadores
  empresasCount.value++;
  departamentosCount.value += nuevaEmpresa.departamentos.length;
  centrosCount.value += nuevaEmpresa.centros.length;
  
  // Cerrar el modal
  showFormModal.value = false;
  
  // Limpiar el formulario
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

const logout = () => {
  AuthService.logout();
  router.push('/login');
};
</script>

<style scoped>
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
  padding: 4rem 2rem;
  background-color: var(--card-background);
  border-radius: 8px;
  box-shadow: var(--shadow);
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

.btn-save:hover {
  background-color: #3d9a40;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(76, 175, 80, 0.2);
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