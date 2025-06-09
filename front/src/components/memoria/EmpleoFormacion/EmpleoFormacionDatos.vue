<template>
  <div class="vista-previa-container">
    <!-- Tabs de navegación -->
    <div class="tabs-container">
      <button 
        :class="['tab-button', { active: activeTab === 'formulario' }]"
        @click="activeTab = 'formulario'"
      >
        Formulario
      </button>
      <button 
        :class="['tab-button', { active: activeTab === 'preview' }]"
        @click="activeTab = 'preview'"
      >
        Vista Previa
      </button>
    </div>

    <!-- Contenido del formulario -->
    <div v-if="activeTab === 'formulario'" class="form-step">
      <h3>Datos Totales del Departamento de Empleo y Formación</h3>

      <!-- ORIENTACIÓN E INTERMEDIACIÓN LABORAL -->
      <div class="form-section">
        <h4>ORIENTACIÓN E INTERMEDIACIÓN LABORAL</h4>
        <div class="form-group">
          <label for="personasAtendidasOrientacion">Personas atendidas</label>
          <input
            type="number"
            id="personasAtendidasOrientacion"
            v-model="datos.orientacion.personasAtendidas"
            class="form-control"
            min="0"
            placeholder="Número de personas atendidas"
          >
        </div>
        <div class="form-group">
          <label for="nuevasAltasDemandantes">Nuevas altas de demandantes</label>
          <input
            type="number"
            id="nuevasAltasDemandantes"
            v-model="datos.orientacion.nuevasAltasDemandantes"
            class="form-control"
            min="0"
            placeholder="Número de nuevas altas"
          >
        </div>
        <div class="form-group">
          <label for="accionesOrientacion">Acciones de orientación</label>
          <input
            type="number"
            id="accionesOrientacion"
            v-model="datos.orientacion.accionesOrientacion"
            class="form-control"
            min="0"
            placeholder="Número de acciones de orientación"
          >
        </div>
        <div class="form-group">
          <label for="ofertasTrabajo">Ofertas de trabajo</label>
          <input
            type="number"
            id="ofertasTrabajo"
            v-model="datos.orientacion.ofertasTrabajo"
            class="form-control"
            min="0"
            placeholder="Número de ofertas de trabajo"
          >
        </div>
      </div>

      <!-- FORMACIÓN -->
      <div class="form-section">
        <h4>FORMACIÓN</h4>
        <div class="form-group">
          <label for="actividadesFormacion">Actividades</label>
          <input
            type="number"
            id="actividadesFormacion"
            v-model="datos.formacion.actividades"
            class="form-control"
            min="0"
            placeholder="Número de actividades"
          >
        </div>
        <div class="form-group">
          <label for="cursosFormacion">Cursos</label>
          <input
            type="number"
            id="cursosFormacion"
            v-model="datos.formacion.cursos"
            class="form-control"
            min="0"
            placeholder="Número de cursos"
          >
        </div>
        <div class="form-group">
          <label for="pildorasFormativas">Píldoras formativas</label>
          <input
            type="number"
            id="pildorasFormativas"
            v-model="datos.formacion.pildorasFormativas"
            class="form-control"
            min="0"
            placeholder="Número de píldoras formativas"
          >
        </div>
        <div class="form-group">
          <label for="participantesFormacion">Participantes</label>
          <input
            type="number"
            id="participantesFormacion"
            v-model="datos.formacion.participantes"
            class="form-control"
            min="0"
            placeholder="Número de participantes"
          >
        </div>
        <div class="form-group">
          <label for="horasFormacion">Horas</label>
          <input
            type="number"
            id="horasFormacion"
            v-model="datos.formacion.horas"
            class="form-control"
            min="0"
            placeholder="Número de horas"
          >
        </div>
      </div>

      <!-- ASESORAMIENTO EMPRESARIAL Y AL AUTOEMPLEO -->
      <div class="form-section">
        <h4>ASESORAMIENTO EMPRESARIAL Y AL AUTOEMPLEO</h4>
        <div class="form-group">
          <label for="personasAtendidasAutoempleo">Personas atendidas en autoempleo</label>
          <input
            type="number"
            id="personasAtendidasAutoempleo"
            v-model="datos.asesoramiento.personasAtendidas"
            class="form-control"
            min="0"
            placeholder="Número de personas atendidas"
          >
        </div>
        <div class="form-group">
          <label for="empresasCreadas">Empresas creadas</label>
          <input
            type="number"
            id="empresasCreadas"
            v-model="datos.asesoramiento.empresasCreadas"
            class="form-control"
            min="0"
            placeholder="Número de empresas creadas"
          >
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

    <!-- Vista Previa -->
    <div v-if="activeTab === 'preview'" class="preview-container">
      <!-- Header con número de versión -->
      <div class="preview-header">
        <div class="version-badge">2.1</div>
        <h2 class="preview-title">DATOS<br>TOTALES</h2>
      </div>

      <!-- Sección ORIENTACIÓN E INTERMEDIACIÓN LABORAL -->
      <div class="preview-section">
        <h3 class="section-title">ORIENTACIÓN E INTERMEDIACIÓN LABORAL</h3>
        
        <div class="stats-container">
          <!-- Bloque principal con personas atendidas y nuevas altas -->
          <div class="main-stats-block">
            <div class="main-stat">
              <div class="stat-label">Personas<br>atendidas:</div>
              <div class="stat-number">{{ formatNumber(datos.orientacion.personasAtendidas) }}</div>
            </div>
            <div class="divider"></div>
            <div class="main-stat">
              <div class="stat-label">Nuevas altas de<br>demandantes:</div>
              <div class="stat-number">{{ formatNumber(datos.orientacion.nuevasAltasDemandantes) }}</div>
            </div>
          </div>

          <!-- Stats laterales -->
          <div class="side-stats">
            <div class="side-stat">
              <div class="stat-icon orientation-icon"></div>
              <div class="stat-info">
                <div class="stat-side-label">Acciones de<br>orientación:</div>
                <div class="stat-side-number">{{ formatNumber(datos.orientacion.accionesOrientacion) }}</div>
              </div>
            </div>
            <div class="side-stat">
              <div class="stat-icon job-icon"></div>
              <div class="stat-info">
                <div class="stat-side-label">Ofertas de<br>trabajo:</div>
                <div class="stat-side-number">{{ formatNumber(datos.orientacion.ofertasTrabajo) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sección FORMACIÓN -->
      <div class="preview-section">
        <h3 class="section-title">FORMACIÓN</h3>
        
        <div class="stats-container">
          <!-- Bloque principal con actividades y cursos -->
          <div class="main-stats-block">
            <div class="main-stat">
              <div class="stat-label">Actividades:</div>
              <div class="stat-number">{{ formatNumber(datos.formacion.actividades) }}</div>
            </div>
            <div class="divider"></div>
            <div class="main-stat">
              <div class="stat-label">Cursos:</div>
              <div class="stat-number">{{ formatNumber(datos.formacion.cursos) }}</div>
            </div>
          </div>

          <!-- Stats laterales -->
          <div class="side-stats">
            <div class="side-stat">
              <div class="stat-icon pills-icon"></div>
              <div class="stat-info">
                <div class="stat-side-label">Píldoras<br>formativas:</div>
                <div class="stat-side-number">{{ formatNumber(datos.formacion.pildorasFormativas) }}</div>
              </div>
            </div>
            <div class="side-stat">
              <div class="stat-icon participants-icon"></div>
              <div class="stat-info">
                <div class="stat-side-label">Participantes:</div>
                <div class="stat-side-number">{{ formatNumber(datos.formacion.participantes) }}</div>
              </div>
            </div>
            <div class="side-stat">
              <div class="stat-icon hours-icon"></div>
              <div class="stat-info">
                <div class="stat-side-label">Horas:</div>
                <div class="stat-side-number">{{ formatNumber(datos.formacion.horas) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sección ASESORAMIENTO EMPRESARIAL Y AL AUTOEMPLEO -->
      <div class="preview-section">
        <h3 class="section-title">ASESORAMIENTO EMPRESARIAL Y AL AUTOEMPLEO</h3>
        
        <div class="stats-container centered">
          <div class="main-stats-block single-row">
            <div class="main-stat">
              <div class="stat-label">Personas atendidas<br>en autoempleo:</div>
              <div class="stat-number">{{ formatNumber(datos.asesoramiento.personasAtendidas) }}</div>
            </div>
            <div class="divider"></div>
            <div class="main-stat">
              <div class="stat-label">Empresas<br>creadas:</div>
              <div class="stat-number">{{ formatNumber(datos.asesoramiento.empresasCreadas) }}</div>
            </div>
          </div>
        </div>
      </div>
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

// Estado para las pestañas
const activeTab = ref('formulario');

const datos = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// Inicializar datos si no existen con la nueva estructura
if (!datos.value.orientacion) {
  datos.value.orientacion = {
    personasAtendidas: 0,
    nuevasAltasDemandantes: 0,
    accionesOrientacion: 0,
    ofertasTrabajo: 0,
  };
}

if (!datos.value.formacion) {
  datos.value.formacion = {
    actividades: 0,
    cursos: 0,
    pildorasFormativas: 0,
    participantes: 0,
    horas: 0,
  };
}

if (!datos.value.asesoramiento) {
  datos.value.asesoramiento = {
    personasAtendidas: 0,
    empresasCreadas: 0,
  };
}

// Función para formatear números con puntos de miles
const formatNumber = (num) => {
  if (!num && num !== 0) return '0';
  return Number(num).toLocaleString('es-ES');
};

// La validación ahora solo verifica que los números no sean negativos
const esValido = computed(() => {
  const orientacionValido = datos.value.orientacion &&
    datos.value.orientacion.personasAtendidas >= 0 &&
    datos.value.orientacion.nuevasAltasDemandantes >= 0 &&
    datos.value.orientacion.accionesOrientacion >= 0 &&
    datos.value.orientacion.ofertasTrabajo >= 0;

  const formacionValido = datos.value.formacion &&
    datos.value.formacion.actividades >= 0 &&
    datos.value.formacion.cursos >= 0 &&
    datos.value.formacion.pildorasFormativas >= 0 &&
    datos.value.formacion.participantes >= 0 &&
    datos.value.formacion.horas >= 0;

  const asesoramientoValido = datos.value.asesoramiento &&
    datos.value.asesoramiento.personasAtendidas >= 0 &&
    datos.value.asesoramiento.empresasCreadas >= 0;

  return orientacionValido && formacionValido && asesoramientoValido;
});
</script>

<style scoped>
.vista-previa-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Estilos para las pestañas */
.tabs-container {
  display: flex;
  border-bottom: 2px solid #e9ecef;
  margin-bottom: 2rem;
}

.tab-button {
  padding: 1rem 2rem;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  color: #6c757d;
  border-bottom: 3px solid transparent;
  transition: all 0.3s ease;
}

.tab-button:hover {
  color: #004698;
  background-color: #f8f9fa;
}

.tab-button.active {
  color: #004698;
  border-bottom-color: #004698;
  background-color: #f8f9fa;
}

/* Estilos del formulario (mantener los originales) */
.form-step {
  max-width: 800px;
  margin: 0 auto;
}

.form-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 5px solid #004698;
}

.form-section h4 {
  margin-top: 0;
  color: #004698;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
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

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #004698;
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
  justify-content: flex-end;
}

/* Estilos para la vista previa */
.preview-container {
  background: #f8f9fa;
  min-height: 100vh;
  padding: 2rem;
}

.preview-header {
  display: flex;
  gap: 2rem;
}

.version-badge {
  background: #52c4b2b0;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  align-self: center;
  padding: 0.5rem;
}

.preview-title {
  font-weight: bold;
  color: #52c4b2;
  margin: 0;
  line-height: 1.1;
  text-transform: uppercase;
}

.preview-section {
  margin-bottom: 4rem;
}

.section-title {
  font-size: 1.5rem;
  color: #333 !important;
  text-transform: uppercase;
  text-shadow: none;
  border-bottom: none;
}

.stats-container {
  display: flex;
  gap: 2rem;
  justify-content: space-evenly;
}

.stats-container.centered {
  justify-content: center;
}

.main-stats-block {
  background: #52c4b2;
  border-radius: 8px;
  padding: 2rem;
  display: flex;
  align-items: center;
  min-width: 350px;
}

.main-stats-block.single-row {
  min-width: 400px;
}

.main-stat {
  flex: 1;
  text-align: center;
  color: white;
}

.stat-label {
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.3;
  margin-bottom: 1rem;
}

.stat-number {
  font-size: 2.2rem;
  font-weight: bold;
  line-height: 1;
}

.divider {
  width: 2px;
  height: 80px;
  background: rgba(255, 255, 255, 0.3);
  margin: 0 2rem;
}

.side-stats {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  justify-content: center;
}

.side-stat {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: white;
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-width: 200px;
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
}

.orientation-icon {
  background: #e8f4fd;
}

.job-icon {
  background: #e8f4fd;
}

.pills-icon {
  background: #e8f4fd;
}

.participants-icon {
  background: #e8f4fd;
}

.hours-icon {
  background: #e8f4fd;
}

.stat-icon::after {
  content: '';
  width: 20px;
  height: 20px;
  background: #52c4b2;
  border-radius: 2px;
}

.orientation-icon::after {
  content: '⟲';
  background: none;
  color: #52c4b2;
  font-size: 20px;
  font-weight: bold;
}

.job-icon::after {
  content: '💼';
  background: none;
  font-size: 16px;
}

.pills-icon::after {
  content: '📋';
  background: none;
  font-size: 16px;
}

.participants-icon::after {
  content: '👥';
  background: none;
  font-size: 16px;
}

.hours-icon::after {
  content: '🕐';
  background: none;
  font-size: 16px;
}

.stat-info {
  flex: 1;
  display: flex;
    gap: 1rem;
    align-items: center;
    justify-content: space-between;
}

.stat-side-label {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.2;
}

.stat-side-number {
  font-size: 1.8rem;
  font-weight: bold;
  color: #52c4b2;
  background: #52c4b2;
  color: white;
  padding: 0.2rem 0.8rem;
  border-radius: 4px;
  display: inline-block;
}

/* Responsive */
@media (max-width: 1024px) {
  .stats-container {
    flex-direction: column;
    align-items: center;
  }
  
  .side-stats {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .preview-header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .preview-title {
    font-size: 2rem;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .main-stats-block {
    min-width: 300px;
    padding: 1.5rem;
  }
  
  .stat-number {
    font-size: 2.5rem;
  }
  
  .side-stats {
    flex-direction: column;
  }
  
  .side-stat {
    min-width: 250px;
  }
  
  .tabs-container {
    flex-direction: column;
  }
  
  .tab-button {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #e9ecef;
  }
  
  .tab-button.active {
    border-bottom: 1px solid #004698;
  }
}

@media (max-width: 480px) {
  .preview-container {
    padding: 1rem;
  }
  
  .main-stats-block {
    min-width: 280px;
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
  }
  
  .divider {
    width: 80px;
    height: 2px;
    margin: 0;
  }
  
  .side-stat {
    min-width: 200px;
    padding: 0.75rem 1rem;
  }
  
  .stat-side-number {
    font-size: 1.5rem;
  }
}
</style>