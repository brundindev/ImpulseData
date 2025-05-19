<template>
  <div class="form-step">
    <h3>Organigrama Municipal</h3>
    
    <div class="form-group">
      <label>Presidencia</label>
      <input 
        type="text" 
        v-model="datos.presidencia" 
        class="form-control"
        placeholder="Concejala de Empleo y Fomento"
      >
    </div>

    <div class="form-group">
      <label>Jefatura de Servicio</label>
      <input 
        type="text" 
        v-model="datos.jefaturaServicio" 
        class="form-control"
        placeholder="Nombre del/la Jefe/a de Servicio"
      >
    </div>

    <div class="form-group">
      <label>Departamentos</label>
      <div class="departamentos">
        <div v-for="(departamento, index) in datos.departamentos" :key="index" class="departamento-item">
          <div class="departamento-header">
            <h4>Departamento {{ index + 1 }}</h4>
            <button 
              @click="eliminarDepartamento(index)" 
              class="btn btn-danger"
              type="button"
              v-if="datos.departamentos.length > 1"
            >
              Eliminar
            </button>
          </div>
          
          <div class="form-group">
            <label>Nombre del Departamento</label>
            <select 
              v-model="departamento.tipo" 
              class="form-control"
              @change="actualizarDepartamento(index)"
            >
              <option value="marketing">Marketing/Observatorio</option>
              <option value="economico">Económico</option>
              <option value="proyectos">Proyectos Estratégicos</option>
              <option value="empleoFormacion">Empleo y Formación</option>
              <option value="promocionEconomica">Promoción Económica</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Responsable</label>
            <input 
              type="text" 
              v-model="departamento.responsable" 
              class="form-control"
              placeholder="Nombre del responsable del departamento"
            >
          </div>

          <!-- Subdepartamentos para Empleo y Formación -->
          <div v-if="departamento.tipo === 'empleoFormacion'" class="subdepartamentos">
            <h5>Subdepartamentos de Empleo y Formación</h5>
            <div v-for="(subdepto, subIndex) in departamento.subdepartamentos" :key="subIndex" class="subdepartamento-item">
              <div class="subdepartamento-header">
                <h6>Subdepartamento {{ subIndex + 1 }}</h6>
                <button 
                  @click="eliminarSubdepartamento(index, subIndex)" 
                  class="btn btn-outline-danger btn-sm"
                  type="button"
                  v-if="departamento.subdepartamentos.length > 1"
                >
                  Eliminar
                </button>
              </div>
              
              <div class="form-group">
                <label>Nombre</label>
                <input 
                  type="text" 
                  v-model="subdepto.nombre" 
                  class="form-control"
                  placeholder="Nombre del subdepartamento"
                >
              </div>
              
              <div class="form-group">
                <label>Responsable</label>
                <input 
                  type="text" 
                  v-model="subdepto.responsable" 
                  class="form-control"
                  placeholder="Responsable"
                >
              </div>
            </div>
            
            <button 
              @click="agregarSubdepartamento(index)" 
              class="btn btn-outline-secondary btn-sm"
              type="button"
            >
              Agregar Subdepartamento
            </button>
          </div>
          
          <!-- Subdepartamentos para Promoción Económica -->
          <div v-if="departamento.tipo === 'promocionEconomica'" class="subdepartamentos">
            <h5>Subdepartamentos de Promoción Económica</h5>
            <div v-for="(subdepto, subIndex) in departamento.subdepartamentos" :key="subIndex" class="subdepartamento-item">
              <div class="subdepartamento-header">
                <h6>Subdepartamento {{ subIndex + 1 }}</h6>
                <button 
                  @click="eliminarSubdepartamento(index, subIndex)" 
                  class="btn btn-outline-danger btn-sm"
                  type="button"
                  v-if="departamento.subdepartamentos.length > 1"
                >
                  Eliminar
                </button>
              </div>
              
              <div class="form-group">
                <label>Nombre</label>
                <input 
                  type="text" 
                  v-model="subdepto.nombre" 
                  class="form-control"
                  placeholder="Nombre del subdepartamento"
                >
              </div>
              
              <div class="form-group">
                <label>Responsable</label>
                <input 
                  type="text" 
                  v-model="subdepto.responsable" 
                  class="form-control"
                  placeholder="Responsable"
                >
              </div>
            </div>
            
            <button 
              @click="agregarSubdepartamento(index)" 
              class="btn btn-outline-secondary btn-sm"
              type="button"
            >
              Agregar Subdepartamento
            </button>
          </div>
        </div>
        
        <button 
          @click="agregarDepartamento" 
          class="btn btn-secondary"
          type="button"
        >
          Agregar Departamento
        </button>
      </div>
    </div>

    <div class="form-group">
      <label>Vista Previa del Organigrama</label>
      <div class="organigrama-preview" v-if="hayDatosSuficientes">
        <!-- Nivel 1: Presidencia -->
        <div class="org-box org-presidencia">
          Presidencia
          <div class="org-subbox">{{ datos.presidencia }}</div>
        </div>
        <div class="org-line"></div>
        
        <!-- Nivel 2: Jefatura de Servicio -->
        <div class="org-box org-jefatura">
          Jefatura de Servicio
          <div class="org-subbox">{{ datos.jefaturaServicio }}</div>
        </div>
        <div class="org-line"></div>
        
        <!-- Nivel 3: Departamentos -->
        <div class="org-level">
          <div v-for="(dept, index) in datos.departamentos" :key="index" class="org-dept-container">
            <div class="org-box org-dept">
              {{ getNombreDepartamento(dept.tipo) }}
              <div class="org-subbox">{{ dept.responsable }}</div>
            </div>
            
            <!-- Nivel 4: Subdepartamentos -->
            <div v-if="dept.subdepartamentos && dept.subdepartamentos.length > 0" class="org-subdepts">
              <div class="org-line-vertical"></div>
              <div class="org-sublevel">
                <div v-for="(subDept, subIndex) in dept.subdepartamentos" :key="subIndex" class="org-box org-subdept">
                  {{ subDept.nombre }}
                  <div class="org-subbox">{{ subDept.responsable }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="empty-preview" v-else>
        Complete los campos principales para visualizar el organigrama
      </div>
    </div>

    <div class="form-actions">
      <button 
        @click="guardarOrganigrama" 
        class="btn btn-primary"
        :disabled="!esValido"
        type="button"
      >
        Guardar Organigrama
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update:modelValue', 'guardar']);

const datos = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// Inicializar datos si no existen
if (!datos.value.presidencia) {
  datos.value.presidencia = '';
}

if (!datos.value.jefaturaServicio) {
  datos.value.jefaturaServicio = '';
}

if (!datos.value.departamentos) {
  datos.value.departamentos = [{
    tipo: 'marketing',
    responsable: '',
    subdepartamentos: []
  }];
}

const getNombreDepartamento = (tipo) => {
  const nombres = {
    'marketing': 'Marketing/Observatorio',
    'economico': 'Económico',
    'proyectos': 'Proyectos Estratégicos',
    'empleoFormacion': 'Empleo y Formación',
    'promocionEconomica': 'Promoción Económica'
  };
  return nombres[tipo] || 'Departamento';
};

const actualizarDepartamento = (index) => {
  const tipo = datos.value.departamentos[index].tipo;
  if (tipo === 'empleoFormacion' || tipo === 'promocionEconomica') {
    if (!datos.value.departamentos[index].subdepartamentos || 
        datos.value.departamentos[index].subdepartamentos.length === 0) {
      datos.value.departamentos[index].subdepartamentos = [{
        nombre: '',
        responsable: ''
      }];
    }
  } else {
    datos.value.departamentos[index].subdepartamentos = [];
  }
};

const agregarDepartamento = () => {
  datos.value.departamentos.push({
    tipo: 'marketing',
    responsable: '',
    subdepartamentos: []
  });
};

const eliminarDepartamento = (index) => {
  if (datos.value.departamentos.length > 1) {
    datos.value.departamentos.splice(index, 1);
  }
};

const agregarSubdepartamento = (deptoIndex) => {
  datos.value.departamentos[deptoIndex].subdepartamentos.push({
    nombre: '',
    responsable: ''
  });
};

const eliminarSubdepartamento = (deptoIndex, subIndex) => {
  if (datos.value.departamentos[deptoIndex].subdepartamentos.length > 1) {
    datos.value.departamentos[deptoIndex].subdepartamentos.splice(subIndex, 1);
  }
};

const guardarOrganigrama = () => {
  emit('guardar', datos.value);
};

const esValido = computed(() => {
  // Verificar campos principales
  if (!datos.value.presidencia || !datos.value.jefaturaServicio) {
    return false;
  }
  
  // Verificar departamentos
  for (const depto of datos.value.departamentos) {
    if (!depto.responsable) {
      return false;
    }
    
    // Verificar subdepartamentos si existen
    if (depto.tipo === 'empleoFormacion' || depto.tipo === 'promocionEconomica') {
      for (const subdepto of depto.subdepartamentos) {
        if (!subdepto.nombre || !subdepto.responsable) {
          return false;
        }
      }
    }
  }
  
  return true;
});

const hayDatosSuficientes = computed(() => {
  return datos.value.presidencia && 
         datos.value.jefaturaServicio && 
         datos.value.departamentos.some(dept => dept.responsable);
});
</script>

<style scoped>
.form-step {
  max-width: 900px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1.5rem;
}

.departamento-item {
  background: #f8f9fa;
  padding: 1.25rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  border-left: 4px solid #004698;
}

.subdepartamento-item {
  background: #ffffff;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  border-left: 3px solid #4a90e2;
}

.departamento-header,
.subdepartamento-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.departamento-header h4 {
  margin: 0;
  color: #004698;
  font-size: 1.1rem;
}

.subdepartamento-header h6 {
  margin: 0;
  color: #4a90e2;
  font-size: 0.95rem;
}

.subdepartamentos {
  margin-top: 1.5rem;
  padding-top: 0.5rem;
  border-top: 1px dashed #ccc;
}

.subdepartamentos h5 {
  color: #555;
  font-size: 1rem;
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-control:focus {
  outline: none;
  border-color: #004698;
  box-shadow: 0 0 0 2px rgba(0, 70, 152, 0.1);
}

select.form-control {
  appearance: auto;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24'%3E%3Cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 6l10 10 10-10'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 16px 12px;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-sm {
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
}

.btn-primary {
  background: #004698;
  color: white;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-outline-secondary {
  background: transparent;
  border: 1px solid #6c757d;
  color: #6c757d;
}

.btn-outline-secondary:hover {
  background: #6c757d;
  color: white;
}

.btn-outline-danger {
  background: transparent;
  border: 1px solid #dc3545;
  color: #dc3545;
}

.btn-outline-danger:hover {
  background: #dc3545;
  color: white;
}

.btn:hover {
  opacity: 0.9;
}

.btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.form-actions {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
}

/* Estilos para la vista previa del organigrama */
.organigrama-preview {
  margin-top: 1rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f9f9f9;
  border-radius: 8px;
  overflow-x: auto;
  width: 100%;
}

.empty-preview {
  padding: 2rem;
  text-align: center;
  background: #f8f9fa;
  border-radius: 8px;
  color: #6c757d;
}

.org-box {
  padding: 0.75rem;
  border-radius: 6px;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  min-width: 150px;
}

.org-presidencia {
  background: #e6f0ff;
  border: 2px solid #004698;
  font-weight: bold;
  width: 200px;
}

.org-jefatura {
  background: #e6f0ff;
  border: 1px solid #004698;
  font-weight: 500;
  width: 180px;
}

.org-dept {
  background: #f0f8ff;
  border: 1px solid #4a90e2;
  width: 160px;
}

.org-subdept {
  background: #f8f8ff;
  border: 1px solid #6c757d;
  width: 140px;
  font-size: 0.9rem;
}

.org-subbox {
  font-size: 0.85rem;
  color: #555;
  margin-top: 0.25rem;
  font-style: italic;
}

.org-line {
  width: 2px;
  height: 25px;
  background: #004698;
  margin: 0.5rem 0;
}

.org-line-vertical {
  width: 2px;
  height: 20px;
  background: #6c757d;
  margin: 0.25rem auto 0.5rem;
}

.org-level {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
}

.org-sublevel {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.org-dept-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.org-subdepts {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>