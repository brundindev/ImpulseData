<template>
  <div class="form-step">
    <h3>Organigrama Jerárquico</h3>
    
    <!-- Nivel 1: Presidencia -->
    <div class="nivel nivel-1">
      <div class="nivel-header">
        <h4>Nivel 1: Presidencia</h4>
      </div>
      <div class="nivel-content">
        <div class="form-group">
          <label>Concejala de Empleo y Fomento</label>
          <input 
            type="text" 
            v-model="datos.presidencia" 
            class="form-control"
            placeholder="Nombre de la Concejala"
          >
        </div>
      </div>
    </div>

    <!-- Nivel 2: Jefatura de Servicio -->
    <div class="nivel nivel-2">
      <div class="nivel-header">
        <h4>Nivel 2: Jefatura de Servicio</h4>
      </div>
      <div class="nivel-content">
        <div class="form-group">
          <label>Jefatura de Servicio</label>
          <input 
            type="text" 
            v-model="datos.jefaturaServicio" 
            class="form-control"
            placeholder="Título de la Jefatura de Servicio"
            disabled
          >
        </div>
      </div>
    </div>

    <!-- Nivel 3: Departamentos -->
    <div class="nivel nivel-3">
      <div class="nivel-header">
        <h4>Nivel 3: Departamentos</h4>
      </div>
      <div class="nivel-content departamentos-container">
        <div v-for="(departamento, index) in departamentosNormales" :key="index" class="departamento-item">
          <div class="departamento-header">
            <div class="departamento-tipo">
              <select 
                v-model="departamento.tipo" 
                class="form-control"
                @change="actualizarDepartamento(getDepartamentoIndex(departamento))"
              >
                <option value="marketing">Marketing y Comunicación</option>
                <option value="observatorio">Observatorio Pacto Territorial por el Empleo</option>
                <option value="juridico">Jurídico-Administrativo</option>
                <option value="economico">Económico-Financiero</option>
                <option value="empleoFormacion">Empleo y Formación</option>
                <option value="promocionEconomica">Promoción Económica</option>
              </select>
            </div>
            <div class="departamento-actions">
              <button 
                @click="eliminarDepartamento(getDepartamentoIndex(departamento))" 
                class="btn btn-danger btn-sm"
                type="button"
                v-if="departamentosNormales.length > 1"
              >
                <span class="btn-icon">✕</span>
              </button>
            </div>
          </div>

          <!-- Nivel 4: Áreas internas (solo para ciertos departamentos) -->
          <div v-if="tieneAreaInternas(departamento.tipo)" class="nivel nivel-4">
            <div class="nivel-header subdepartamento-header">
              <h5>Áreas internas de {{ getNombreDepartamento(departamento.tipo) }}</h5>
              <button 
                @click="agregarAreaInterna(getDepartamentoIndex(departamento))" 
                class="btn btn-outline-secondary btn-sm"
                type="button"
              >
                <span class="btn-icon">+</span> Añadir
              </button>
            </div>
            <div class="nivel-content">
              <div v-for="(area, areaIndex) in departamento.areasInternas" :key="areaIndex" class="subdepartamento-item">
                <div class="subdepartamento-row">
                  <div class="subdepartamento-content">
                    <div class="form-group">
                      <label>Nombre del Área</label>
                      <input 
                        type="text" 
                        v-model="area.nombre" 
                        class="form-control"
                        placeholder="Nombre del área interna"
                      >
                    </div>
                  </div>
                  <div class="subdepartamento-actions">
                    <button 
                      @click="eliminarAreaInterna(getDepartamentoIndex(departamento), areaIndex)" 
                      class="btn btn-outline-danger btn-sm"
                      type="button"
                      v-if="departamento.areasInternas.length > 1"
                    >
                      <span class="btn-icon">✕</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Botón para agregar departamento -->
        <div class="add-departamento">
          <button 
            @click="agregarDepartamento" 
            class="btn btn-secondary"
            type="button"
          >
            <span class="btn-icon">+</span> Agregar Departamento
          </button>
        </div>
      </div>
    </div>
    
    <!-- Proyectos Estratégicos (Transversales) -->
    <div class="nivel nivel-proyectos">
      <div class="nivel-header">
        <h4>Proyectos Estratégicos (Transversales)</h4>
      </div>
      <div class="nivel-content">
        <div class="proyectos-container">
          <div v-for="(proyecto, index) in datos.proyectosEstrategicos" :key="index" class="proyecto-item">
            <div class="proyecto-header">
              <div class="proyecto-content">
                <div class="form-group">
                  <label>Nombre del Proyecto</label>
                  <input 
                    type="text" 
                    v-model="proyecto.nombre" 
                    class="form-control"
                    placeholder="Nombre del proyecto estratégico"
                  >
                </div>
              </div>
              <div class="proyecto-actions">
                <button 
                  @click="eliminarProyecto(index)" 
                  class="btn btn-outline-danger btn-sm"
                  type="button"
                  v-if="datos.proyectosEstrategicos.length > 1"
                >
                  <span class="btn-icon">✕</span>
                </button>
              </div>
            </div>
          </div>
          
          <!-- Botón para agregar proyecto -->
          <div class="add-proyecto">
            <button 
              @click="agregarProyecto" 
              class="btn btn-secondary"
              type="button"
            >
              <span class="btn-icon">+</span> Agregar Proyecto
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Vista Previa del Organigrama -->
    <div class="nivel nivel-vista-previa">
      <div class="nivel-header">
        <h4>Vista Previa del Organigrama</h4>
      </div>
      <div class="nivel-content">
        <div class="organigrama-preview" v-if="hayDatosSuficientes">
          <!-- Nivel 1: Presidencia -->
          <div class="org-box org-presidencia">
            Concejala de Empleo y Fomento
            <div class="org-subbox">{{ datos.presidencia }}</div>
          </div>
          <div class="org-line"></div>
          
          <!-- Nivel 2: Jefatura de Servicio -->
          <div class="org-box org-jefatura">
            Jefatura de Servicio
          </div>
          <div class="org-line"></div>
          <div class="org-branch-line"></div>
          
          <!-- Nivel 3: Departamentos (principales) -->
          <div class="org-level">
            <div v-for="(dept, index) in departamentosNormales" :key="index" class="org-dept-container">
              <div class="org-box org-dept">
                {{ getNombreDepartamento(dept.tipo) }}
              </div>
              
              <!-- Nivel 4: Áreas internas -->
              <div v-if="dept.areasInternas && dept.areasInternas.length > 0" class="org-subdepts">
                <div class="org-line-vertical"></div>
                <div class="org-sublevel">
                  <div class="org-box org-subdept">
                    <div v-for="(area, areaIndex) in dept.areasInternas" :key="areaIndex" class="org-area-item">
                      {{ area.nombre }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Proyectos Estratégicos (al pie) -->
          <div class="org-transversal-line"></div>
          <div class="org-proyectos-header">Proyectos Estratégicos (Transversales)</div>
          <div class="org-proyectos-container">
            <div v-for="(proyecto, index) in datos.proyectosEstrategicos" :key="index" class="org-box org-proyecto">
              {{ proyecto.nombre }}
            </div>
          </div>
        </div>
        <div class="empty-preview" v-else>
          Complete los campos principales para visualizar el organigrama
        </div>
      </div>
    </div>
    
    <div class="form-actions">
      <button 
        @click="$emit('siguiente')" 
        class="btn btn-primary"
        :disabled="!esValido"
      >
        Siguiente
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

const emit = defineEmits(['update:modelValue', 'siguiente']);


const datos = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// Inicializar datos si no existen
if (!datos.value.presidencia) {
  datos.value.presidencia = '';
}

if (!datos.value.jefaturaServicio) {
  datos.value.jefaturaServicio = 'Jefatura de Servicio';
}

if (!datos.value.departamentos) {
  datos.value.departamentos = [
    {
      tipo: 'marketing',
      areasInternas: []
    },
    {
      tipo: 'observatorio',
      areasInternas: []
    },
    {
      tipo: 'juridico',
      areasInternas: []
    },
    {
      tipo: 'economico',
      areasInternas: []
    },
    {
      tipo: 'empleoFormacion',
      areasInternas: [
        { nombre: 'Orientación Laboral' }
      ]
    },
    {
      tipo: 'promocionEconomica',
      areasInternas: [
        { nombre: 'Emprendimiento' }
      ]
    }
  ];
} else {
  // Asegurar que cada departamento tenga areasInternas como array
  datos.value.departamentos.forEach(dept => {
    if (!dept.areasInternas) {
      dept.areasInternas = [];
    }
  });
}

if (!datos.value.proyectosEstrategicos) {
  datos.value.proyectosEstrategicos = [
    { nombre: 'Alicante Futura' },
    { nombre: 'ALIA' }
  ];
}

// Computed para obtener los departamentos normales (excluyendo proyectos estratégicos)
const departamentosNormales = computed(() => {
  return datos.value.departamentos.filter(dept => dept.tipo !== 'proyectos');
});

const getNombreDepartamento = (tipo) => {
  const nombres = {
    'marketing': 'Marketing y Comunicación',
    'observatorio': 'Observatorio Pacto Territorial por el Empleo',
    'juridico': 'Jurídico-Administrativo',
    'economico': 'Económico-Financiero',
    'empleoFormacion': 'Empleo y Formación',
    'promocionEconomica': 'Promoción Económica'
  };
  return nombres[tipo] || 'Departamento';
};

const tieneAreaInternas = (tipo) => {
  return tipo === 'empleoFormacion' || tipo === 'promocionEconomica';
};

const getDepartamentoIndex = (departamento) => {
  return datos.value.departamentos.findIndex(d => d === departamento);
};

const actualizarDepartamento = (index) => {
  const tipo = datos.value.departamentos[index].tipo;
  // Asegurar que areasInternas sea un array
  if (!datos.value.departamentos[index].areasInternas) {
    datos.value.departamentos[index].areasInternas = [];
  }
  
  if (tieneAreaInternas(tipo)) {
    if (datos.value.departamentos[index].areasInternas.length === 0) {
      datos.value.departamentos[index].areasInternas = [{
        nombre: ''
      }];
    }
  } else {
    datos.value.departamentos[index].areasInternas = [];
  }
};

const agregarDepartamento = () => {
  datos.value.departamentos.push({
    tipo: 'marketing',
    areasInternas: []
  });
};

const eliminarDepartamento = (index) => {
  if (datos.value.departamentos.length > 1) {
    datos.value.departamentos.splice(index, 1);
  }
};

const agregarAreaInterna = (deptoIndex) => {
  datos.value.departamentos[deptoIndex].areasInternas.push({
    nombre: ''
  });
};

const eliminarAreaInterna = (deptoIndex, areaIndex) => {
  if (datos.value.departamentos[deptoIndex].areasInternas.length > 1) {
    datos.value.departamentos[deptoIndex].areasInternas.splice(areaIndex, 1);
  }
};

const agregarProyecto = () => {
  datos.value.proyectosEstrategicos.push({
    nombre: ''
  });
};

const eliminarProyecto = (index) => {
  if (datos.value.proyectosEstrategicos.length > 1) {
    datos.value.proyectosEstrategicos.splice(index, 1);
  }
};

const esValido = computed(() => {
  // Verificar campo principal
  if (!datos.value.presidencia) {
    return false;
  }
  
  // Verificar que al menos haya un departamento
  if (datos.value.departamentos.length === 0) {
    return false;
  }
  
  // Verificar áreas internas si existen
  for (const depto of datos.value.departamentos) {
    if (tieneAreaInternas(depto.tipo)) {
      for (const area of depto.areasInternas) {
        if (!area.nombre) {
          return false;
        }
      }
    }
  }
  
  // Verificar proyectos estratégicos
  for (const proyecto of datos.value.proyectosEstrategicos) {
    if (!proyecto.nombre) {
      return false;
    }
  }
  
  return true;
});

const hayDatosSuficientes = computed(() => {
  return datos.value.presidencia && 
         datos.value.departamentos.length > 0 &&
         datos.value.proyectosEstrategicos.length > 0;
});
</script>

<style scoped>
.form-step {
  max-width: 900px;
  margin: 0 auto;
  padding: 1rem;
}

/* Estilos de niveles jerárquicos */
.nivel {
  margin-bottom: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  border: 1px solid #eaeaea;
  background: #fff;
}

.nivel-header {
  padding: 0.75rem 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
  border-bottom: 1px solid #eaeaea;
}

.nivel-header h4, .nivel-header h5 {
  margin: 0;
  color: #004698;
  font-weight: 500;
}

.nivel-content {
  padding: 1.5rem;
  background: #fff;
}

/* Estilos específicos de nivel */
.nivel-1 {
  border-left: 5px solid #004698;
}

.nivel-2 {
  border-left: 5px solid #0062cc;
  margin-left: 1.5rem;
}

.nivel-3 {
  border-left: 5px solid #0069d9;
  margin-left: 3rem;
}

.nivel-4 {
  border-left: 3px solid #4a90e2;
  margin-left: 1rem;
  margin-top: 1rem;
  margin-bottom: 0;
}

.nivel-proyectos {
  border-left: 5px solid #28a745;
  margin-top: 1rem;
}

.nivel-vista-previa {
  border-left: 5px solid #28a745;
  margin-top: 3rem;
}

/* Estilos de departamentos y áreas internas */
.departamentos-container, .proyectos-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.departamento-item, .proyecto-item {
  background: #f8f9fa;
  padding: 1.25rem;
  border-radius: 8px;
  border: 1px solid #eee;
}

.departamento-header, .proyecto-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.departamento-tipo {
  flex-grow: 1;
  margin-right: 1rem;
}

.proyecto-content {
  flex-grow: 1;
  margin-right: 1rem;
}

.subdepartamento-item {
  background: #ffffff;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  border: 1px solid #eee;
}

.subdepartamento-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.subdepartamento-content {
  flex-grow: 1;
}

.subdepartamento-header {
  background: #f0f4f8;
}

.add-departamento, .add-proyecto {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

/* Estilos de formularios */
.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #495057;
  font-weight: 500;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-control:focus {
  outline: none;
  border-color: #004698;
  box-shadow: 0 0 0 2px rgba(0, 70, 152, 0.1);
}

.form-control:disabled {
  background-color: #e9ecef;
  cursor: not-allowed;
}

select.form-control {
  appearance: auto;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24'%3E%3Cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 6l10 10 10-10'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 16px 12px;
}

/* Estilos de botones */
.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-sm {
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
}

.btn-lg {
  padding: 0.75rem 1.5rem;
  font-size: 1.1rem;
}

.btn-icon {
  margin-right: 0.25rem;
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
  min-height: 400px;
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
  width: 160px;
  font-size: 0.9rem;
  padding: 0.5rem;
}

.org-area-item {
  padding: 0.25rem 0;
  border-bottom: 1px solid #e9ecef;
}

.org-area-item:last-child {
  border-bottom: none;
}

.org-sublevel {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.org-proyecto {
  background: #efffee;
  border: 1px solid #28a745;
  width: 160px;
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

.org-branch-line {
  width: 80%;
  height: 2px;
  background: #004698;
  margin-bottom: 0.5rem;
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
  margin-bottom: 2rem;
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

.org-transversal-line {
  width: 80%;
  height: 2px;
  background: #28a745;
  margin: 1rem 0;
}

.org-proyectos-header {
  font-weight: bold;
  color: #28a745;
  margin: 0.75rem 0;
  text-align: center;
}

.org-proyectos-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}
</style>