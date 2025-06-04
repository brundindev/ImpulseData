<template>
  <div class="form-step">
    <!-- Navegación por pestañas -->
    <div class="tabs-container">
      <div class="tabs-nav">
        <button 
          class="tab-button"
          :class="{ active: activeTab === 'configuracion' }"
          @click="activeTab = 'configuracion'"
          type="button"
        >
          <span class="tab-icon">⚙️</span>
          Configuración
        </button>
        <button 
          class="tab-button"
          :class="{ active: activeTab === 'vista-previa' }"
          @click="activeTab = 'vista-previa'"
          type="button"
        >
          <span class="tab-icon">👁️</span>
          Vista Previa
        </button>
      </div>
    </div>

    <!-- Contenido de la pestaña de Configuración -->
    <div v-if="activeTab === 'configuracion'" class="tab-content">
      <h3>Organigrama Jerárquico - Configuración</h3>
      
      <!-- Sección 1: Presidencia -->
      <div class="section-card">
        <div class="section-header">
          <h4><span class="level-number">1</span> Presidencia</h4>
        </div>
        <div class="section-content">
          <div class="input-group">
            <label>Concejala de Empleo y Fomento</label>
            <input 
              type="text" 
              v-model="datos.presidencia" 
              class="form-input"
              placeholder="Nombre de la Concejala"
            >
          </div>
        </div>
      </div>

      <!-- Sección 2: Jefatura de Servicio -->
      <div class="section-card">
        <div class="section-header">
          <h4><span class="level-number">2</span> Jefatura de Servicio</h4>
        </div>
        <div class="section-content">
          <div class="input-group">
            <label>Jefatura de Servicio</label>
            <input 
              type="text" 
              v-model="datos.jefaturaServicio" 
              class="form-input disabled"
              placeholder="Título de la Jefatura de Servicio"
              disabled
            >
          </div>
        </div>
      </div>

      <!-- Sección 3: Departamentos -->
      <div class="section-card">
        <div class="section-header">
          <h4><span class="level-number">3</span> Departamentos</h4>
          <button 
            @click="agregarDepartamento" 
            class="btn-add"
            type="button"
          >
            <span class="btn-icon-departamentos">+</span> Agregar
          </button>
        </div>
        <div class="section-content">
          <div class="departments-grid">
            <div v-for="(departamento, index) in departamentosNormales" :key="index" class="department-card">
              <div class="department-header">
                <select 
                  v-model="departamento.tipo" 
                  class="department-select"
                  @change="actualizarDepartamento(getDepartamentoIndex(departamento))"
                >
                  <option value="marketing">Marketing y Comunicación</option>
                  <option value="observatorio">Observatorio Pacto Territorial por el Empleo</option>
                  <option value="juridico">Jurídico-Administrativo</option>
                  <option value="economico">Económico-Financiero</option>
                  <option value="empleoFormacion">Empleo y Formación</option>
                  <option value="promocionEconomica">Promoción Económica</option>
                </select>
                <button 
                  @click="eliminarDepartamento(getDepartamentoIndex(departamento))" 
                  class="btn-remove"
                  type="button"
                  v-if="departamentosNormales.length > 1"
                >
                  ✕
                </button>
              </div>

              <!-- Áreas internas -->
              <div v-if="tieneAreaInternas(departamento.tipo)" class="internal-areas">
                <div class="internal-areas-header">
                  <span class="areas-title">Áreas internas</span>
                  <button 
                    @click="agregarAreaInterna(getDepartamentoIndex(departamento))" 
                    class="btn-add-small"
                    type="button"
                  >
                    + Añadir
                  </button>
                </div>
                <div class="areas-list">
                  <div v-for="(area, areaIndex) in departamento.areasInternas" :key="areaIndex" class="area-item">
                    <input 
                      type="text" 
                      v-model="area.nombre" 
                      class="area-input"
                      placeholder="Nombre del área"
                    >
                    <button 
                      @click="eliminarAreaInterna(getDepartamentoIndex(departamento), areaIndex)" 
                      class="btn-remove-small"
                      type="button"
                      v-if="departamento.areasInternas.length > 1"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Sección 4: Proyectos Estratégicos -->
      <div class="section-card proyectos-card">
        <div class="section-header">
          <h4><span class="level-number">4</span> Proyectos Estratégicos</h4>
          <button 
            @click="agregarProyecto" 
            class="btn-add-proyecto"
            type="button"
          >
            <span class="btn-icon-proyectos">+</span> Agregar
          </button>
        </div>
        <div class="section-content">
          <div class="projects-grid">
            <div v-for="(proyecto, index) in datos.proyectosEstrategicos" :key="index" class="project-item">
              <input 
                type="text" 
                v-model="proyecto.nombre" 
                class="project-input"
                placeholder="Nombre del proyecto"
              >
              <button 
                @click="eliminarProyecto(index)" 
                class="btn-remove"
                type="button"
                v-if="datos.proyectosEstrategicos.length > 1"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenido de la pestaña de Vista Previa -->
    <div v-if="activeTab === 'vista-previa'" class="tab-content">
      <h3>Vista Previa del Organigrama</h3>
      
      <div class="organigrama-container" v-if="hayDatosSuficientes">
        <!-- Header del organigrama -->
        <div class="org-header">
          <div class="org-version">1.3</div>
          <div class="org-title">CÓMO ESTAMOS<br>ORGANIZADOS</div>
        </div>

        <!-- Nivel 1: Presidencia -->
        <div class="org-level-1">
          <div class="org-box presidencia">
            <div class="box-title">Presidencia</div>
            <div class="box-subtitle">Concejalía de Empleo<br>y Fomento</div>
          </div>
        </div>

        <!-- Línea de conexión -->
        <div class="connection-line vertical"></div>

        <!-- Nivel 2: Jefatura de Servicio -->
        <div class="org-level-2">
          <div class="org-box jefatura">
            <div class="box-content">Jefatura de servicio</div>
          </div>
        </div>

        <!-- Líneas de ramificación -->
        <div class="connection-line vertical short"></div>
        <div class="connection-branches">
          <div class="branch-line" v-for="n in departamentosNormales.length" :key="n"></div>
        </div>

        <!-- Nivel 3: Departamentos -->
        <div class="org-level-3">
          <div v-for="(dept, index) in departamentosNormales" :key="index" class="department-column">
            <div class="org-box departamento">
              <div class="box-content">{{ getNombreDepartamento(dept.tipo) }}</div>
            </div>
            
            <!-- Áreas internas si existen -->
            <div v-if="dept.areasInternas && dept.areasInternas.length > 0" class="areas-container">
              <div class="connection-line vertical mini"></div>
              <div class="org-box area-interna">
                <div v-for="(area, areaIndex) in dept.areasInternas" :key="areaIndex" class="area-content">
                  {{ area.nombre }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Proyectos Estratégicos -->
        <div class="proyectos-section">
          <div class="proyectos-header">
            <div class="proyectos-title">Proyectos Estratégicos:</div>
            <div class="proyectos-subtitle">- Alicante Futura<br>- ALIA</div>
          </div>
        </div>
      </div>

      <div class="empty-state" v-else>
        <div class="empty-icon">📋</div>
        <div class="empty-text">Complete los campos en la pestaña de Configuración para visualizar el organigrama</div>
      </div>
    </div>

    <button 
        @click="$emit('anterior')" 
        class="btn btn-secondary"
        type="button"
      >
      Anterior
    </button>
    
    <!-- Botones de navegación -->
    <div class="form-actions">
      <button 
        @click="$emit('siguiente')" 
        class="btn-primary"
        :disabled="!esValido"
      >
        Continuar <span class="btn-arrow">→</span>
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

// Estado de pestañas
const activeTab = ref('configuracion');

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
    'marketing': 'Marketing y\nComunicación',
    'observatorio': 'Observatorio Pacto\nTerritorial por el Empleo',
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
  max-width: 1000px;
  margin: 0 auto;
  padding: 1rem;
}

/* Estilos de pestañas */
.tabs-container {
  margin-bottom: 2rem;
}

.tabs-nav {
  display: flex;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 4px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.tab-button {
  flex: 1;
  padding: 1rem 1.5rem;
  border: none;
  background: transparent;
  color: #6c757d;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.tab-button.active {
  background: #004698;
  color: white;
  box-shadow: 0 2px 8px rgba(0,70,152,0.3);
}

.tab-button:hover:not(.active) {
  background: #e9ecef;
  color: #495057;
}

.tab-icon {
  font-size: 1.1rem;
}

.tab-content {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Estilos de secciones */
.section-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  margin-bottom: 1.5rem;
  overflow: hidden;
  border: 1px solid #e9ecef;
}

.section-header {
  background: linear-gradient(135deg, #004698 0%, #0062cc 100%);
  color: white;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-header h4 {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 600;
  color:white;
}

.level-number {
  background: rgba(255,255,255,0.2);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.section-content {
  padding: 1.5rem;
}

.proyectos-card .section-header {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
}

/* Estilos de formularios */
.input-group {
  margin-bottom: 1rem;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #495057;
  font-weight: 500;
  font-size: 0.9rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: #004698;
  box-shadow: 0 0 0 3px rgba(0,70,152,0.1);
}

.form-input.disabled {
  background: #f8f9fa;
  color: #6c757d;
  cursor: not-allowed;
}

/* Estilos de departamentos */
.departments-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.department-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid #e9ecef;
}

.department-header {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 1rem;
}

.department-select {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 6px;
  background: white;
}

.internal-areas {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #dee2e6;
}

.internal-areas-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.areas-title {
  font-weight: 500;
  color: #495057;
  font-size: 0.9rem;
}

.areas-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.area-item {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.area-input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 6px;
  font-size: 0.9rem;
}

/* Estilos de proyectos */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.project-item {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.project-input {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
}

/* Estilos de botones */
.btn-icon-departmentos{
    padding: .5rem .75rem;
    font-size: .8rem;
    border-radius: 4px;
    font-weight: 600;
    cursor: pointer;
    transition: all .2s ease;
    background-color: blue;
    color: white;
}
.btn-icon-proyectos{
  padding: .5rem .75rem;
    font-size: .8rem;
    border-radius: 4px;
    font-weight: 600;
    cursor: pointer;
    transition: all .2s ease;
    background-color: green;
    color: white;
}


.btn-add, .btn-primary {
  background: #004698;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.btn-add-proyecto{
  background: #1aad3f;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-add:hover, .btn-primary:hover {
  background: #0056b3;
  transform: translateY(-1px);
}

.btn-add-small {
  background: #6c757d;
  color: white;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
}

.btn-remove, .btn-remove-small {
  background: #dc3545;
  color: white;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.btn-remove:hover, .btn-remove-small:hover {
  background: #c82333;
  transform: scale(1.05);
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

.form-actions {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
}

.btn-arrow {
  font-size: 1.2rem;
}

/* Estilos del organigrama */
.organigrama-container {
  background: #0154A6;
  padding: 2rem;
  color: white;
  min-height: 600px;
  position: relative;
}

.org-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  justify-content: center;
  margin-top: 1em;
}

.org-version {
  background: #5d89bb;
  color: white;
  padding: 0.5rem 1rem;
  font-weight: bold;
  font-size: 1.5rem;
  align-self:stretch;
}

.org-title {
  font-size: 1.5rem;
  font-weight: bold;
  line-height: 1.2;
}

.org-level-1, .org-level-2 {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.org-level-3 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.department-column {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.org-box {
  background: white;
  color: #333;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  min-width: 160px;
}

.org-box.presidencia {
  min-width: 200px;
  background: white;
  border: 2px solid #004698;
}

.org-box.jefatura {
  min-width: 180px;
  background: white;
}

.org-box.departamento {
  background: white;
  font-size: 0.9rem;
}

.org-box.area-interna {
  background: #f0f8ff;
  font-size: 0.8rem;
  margin-top: 0.5rem;
  min-width: 140px;
}

.box-title {
  font-weight: bold;
  color: #004698;
  margin-bottom: 0.25rem;
}

.box-subtitle {
  font-size: 0.9rem;
  color: black;
  line-height: 1.3;
  font-weight: bolder;
}

.box-content {
  font-weight: 500;
  white-space: pre-line;
  line-height: 1.3;
}

.area-content {
  padding: 0.25rem 0;
  border-bottom: 1px solid #e9ecef;
}

.area-content:last-child {
  border-bottom: none;
}

.connection-line {
  background: white;
  margin: 0 auto;
}

.connection-line.vertical {
  width: 3px;
  height: 30px;
}

.connection-line.vertical.short {
  height: 20px;
}

.connection-line.vertical.mini {
  height: 15px;
  margin-top:10px;
}

.connection-branches {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.branch-line {
  width: 120px;
  height: 3px;
  background: white;
  margin: 0 10px;
}

.areas-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.proyectos-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 3px solid white;
}

.proyectos-title {
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.proyectos-subtitle {
  font-size: 0.9rem;
  line-height: 1.4;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #6c757d;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-text {
  font-size: 1.1rem;
  max-width: 400px;
  margin: 0 auto;
  line-height: 1.5;
}

/* Responsividad */
@media (max-width: 768px) {
  .tabs-nav {
    flex-direction: column;
  }
  
  .departments-grid {
    grid-template-columns: 1fr;
  }
  
  .org-level-3 {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
  
  .organigrama-container {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .org-level-3 {
    grid-template-columns: 1fr;
  }
}
</style>