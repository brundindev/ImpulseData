<template>
  <div class="form-step">
    <h3 class="program-title">Observatorio de Estrategias del Pacto Territorial por el Empleo de la ciudad de Alicante</h3>
    
    <div class="form-group">
      <label>Subvención programa (€)</label>
      <input 
        type="text" 
        v-model="datos.subvencionPrograma" 
        class="form-control" 
        placeholder="Ej: 184.814,59"
      >
    </div>

    <div class="form-group">
      <label>Descripción General</label>
      <textarea 
        v-model="datos.descripcion" 
        class="form-control" 
        rows="4" 
        placeholder="Durante el año se ha puesto en marcha el Observatorio de Estrategias del Pacto Territorial por el Empleo de la ciudad de Alicante..."
      ></textarea>
    </div>

    <div class="form-group">
      <label>Nº personas contratadas</label>
      <input 
        type="text" 
        v-model="datos.contratados" 
        class="form-control" 
        placeholder="Ej: 3"
      >
    </div>

    <div class="form-group">
      <label>Objetivos</label>
      <div class="objetivos-container">
        <div v-for="(objetivo, index) in datos.objetivos" :key="index" class="objetivo-item">
          <div class="objetivo-header">
            <h4>Objetivo {{ index + 1 }}</h4>
            <button 
              @click="eliminarObjetivo(index)" 
              class="btn btn-danger btn-sm"
              type="button"
              v-if="datos.objetivos.length > 1"
            >
              Eliminar
            </button>
          </div>
          
          <div class="form-group">
            <label>Título del Objetivo</label>
            <input 
              type="text" 
              v-model="objetivo.titulo" 
              class="form-control"
              placeholder="Ej: Gestión del Pacto Territorial"
            >
          </div>
        </div>
        
        <button 
          @click="agregarObjetivo" 
          class="btn btn-secondary"
          type="button"
        >
          Agregar Objetivo
        </button>
      </div>
    </div>

    <h4 class="section-title">4.2.1 Laboratorio de Nuevas Estrategias de Futuro</h4>

    <div class="form-group">
      <label>Descripción del Laboratorio</label>
      <textarea 
        v-model="datos.descripcionLaboratorio" 
        class="form-control" 
        rows="4" 
        placeholder="El Laboratorio de Nuevas Estrategias de Futuro es un espacio colaborativo para la actualización continua de las estrategias del Pacto Territorial..."
      ></textarea>
    </div>

    <div class="form-group">
      <label>Actuaciones realizadas en el año</label>
      <div class="actuaciones-container">
        <div v-for="(actuacion, index) in datos.actuaciones" :key="index" class="actuacion-item">
          <div class="actuacion-header">
            <h4>Actuación {{ index + 1 }}</h4>
            <button 
              @click="eliminarActuacion(index)" 
              class="btn btn-danger btn-sm"
              type="button"
              v-if="datos.actuaciones.length > 1"
            >
              Eliminar
            </button>
          </div>
          
          <div class="form-group">
            <label>Nombre de la Actuación</label>
            <input 
              type="text" 
              v-model="actuacion.nombre" 
              class="form-control"
              placeholder="Ej: Presentación del Observatorio a la Red de Entidades por el Empleo de la ciudad de Alicante"
            >
          </div>
          
            
          <div class="form-group">
            <label>Fecha de realización</label>
            <input 
              type="text" 
              v-model="actuacion.fecha" 
              class="form-control"
              placeholder="Ej: 20 de septiembre de 2023"
            >
          </div>
        </div>
        
        <button 
          @click="agregarActuacion" 
          class="btn btn-secondary"
          type="button"
        >
          Agregar Actuación
        </button>
      </div>
    </div>

    <h4 class="section-title">4.2.2 Análisis socioeconómico de la ciudad de Alicante</h4>

    <div class="analisis-container">
      <div class="form-group">
        <label>Nº informes de la Encuesta de Población Activa (EPA)</label>
        <input 
          type="text" 
          v-model="datos.informesEPA" 
          class="form-control" 
          placeholder="Ej: 4"
        >
      </div>
      
      <div class="form-group">
        <label>Nº informes mensuales de empleo y paro registrado</label>
        <input 
          type="text" 
          v-model="datos.informesEmpleoParo" 
          class="form-control" 
          placeholder="Ej: 12"
        >
      </div>
    </div>
    <section class="bloque vista-previa">
    <h4>Vista Previa del Programa</h4>
    <div class="preview-container">
      <div class="preview-header">
        <div class="preview-number">4.2</div>
        <div class="preview-title-section">
          <h2 class="preview-main-title">OBSERVATORIO DE ESTRATEGIAS DEL</h2>
          <h2 class="preview-subtitle">PACTO TERRITORIAL POR EL EMPLEO DE LA CIUDAD DE ALICANTE</h2>
        </div>
      </div>
      
      <div class="preview-funding">
        <div class="funding-amount">{{ datos.subvencionPrograma || '184.814,59' }} €</div>
        <div class="funding-label">Subvención programa</div>
      </div>

      <div class="preview-content">
        <div class="preview-stats-description">
          <div class="preview-stats">
            <div class="stat-circle">
              <div class="stat-number">{{ datos.contratados || '3' }}</div>
              <div class="stat-label">Personas contratadas</div>
            </div>
          </div>
          
          <div class="preview-description">
            {{ datos.descripcion || 'Durante el año 2023 se ha puesto en marcha el Observatorio de Estrategias del Pacto Territorial por el Empleo de la ciudad de Alicante, el cual se constituye como secretaría técnica del Pacto Territorial.' }}
          </div>
        </div>
        
        <div class="preview-objectives">
          <h3 class="objectives-title">Objetivos</h3>
          <div class="objectives-list">
            <div v-for="(objetivo, index) in datos.objetivos" :key="index" class="objective-item">
              {{ objetivo.titulo || `Objetivo ${index + 1}` }}
            </div>
          </div>
        </div>
      </div>
      
      <!-- Subsección 4.2.1 -->
      <div class="preview-subsection">
        <div class="subsection-header">
          <span class="subsection-number">4.2.1</span>
          <span class="subsection-title">Laboratorio de Nuevas Estrategias de Futuro</span>
        </div>
        
        <div class="subsection-description">
          {{ datos.descripcionLaboratorio || 'El Laboratorio de Nuevas Estrategias de Futuro es un espacio colaborativo para la actualización continuada de las estrategias del Pacto Territorial.' }}
        </div>
        
        <div class="actuaciones-preview">
          <h4>Actuaciones 2023:</h4>
          <div class="actuaciones-grid">
            <div v-for="(actuacion, index) in datos.actuaciones" :key="index" class="actuacion-card">
              <div class="actuacion-name">{{ actuacion.nombre || `Actuación ${index + 1}` }}</div>
              <div class="actuacion-date">{{ actuacion.fecha || 'Fecha por definir' }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Subsección 4.2.2 -->
      <div class="preview-subsection">
        <div class="subsection-header">
          <span class="subsection-number">4.2.2</span>
          <span class="subsection-title">Análisis socioeconómico de la ciudad de Alicante</span>
        </div>
        
        <div class="analysis-stats">
          <div class="analysis-item">
            <div class="analysis-icon">📊</div>
            <div class="analysis-number">{{ datos.informesEPA || '4' }}</div>
            <div class="analysis-label">informes de la Encuesta de Población Activa (EPA)</div>
          </div>
          <div class="analysis-item">
            <div class="analysis-icon">📈</div>
            <div class="analysis-number">{{ datos.informesEmpleoParo || '12' }}</div>
            <div class="analysis-label">informes mensuales de empleo y paro registrado</div>
          </div>
        </div>
      </div>
    </div>
  </section>

    <div class="form-actions">
      <button 
        @click="$emit('anterior')" 
        class="btn btn-secondary"
        type="button"
      >
        Anterior
      </button>
      <button 
        @click="$emit('siguiente')" 
        class="btn btn-primary"
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

const emit = defineEmits(['update:modelValue', 'siguiente', 'anterior']);

const datos = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// Inicializar estructura vacía solo si no existe
if (!datos.value.objetivos) {
  datos.value.objetivos = [
    { titulo: 'Gestión del Pacto Territorial', descripcion: '' },
    { titulo: 'Laboratorio de Nuevas Estrategias de Futuro', descripcion: '' },
    { titulo: 'Evaluación y seguimiento de las acciones del Pacto', descripcion: '' },
    { titulo: 'Relaciones con otros Pactos y Avalem Territori', descripcion: '' }
  ];
}

if (!datos.value.actuaciones) {
  datos.value.actuaciones = [{}];
}

const agregarObjetivo = () => {
  datos.value.objetivos.push({ titulo: '', descripcion: '' });
};

const eliminarObjetivo = (index) => {
  if (datos.value.objetivos.length > 1) {
    datos.value.objetivos.splice(index, 1);
  }
};

const agregarActuacion = () => {
  datos.value.actuaciones.push({});
};

const eliminarActuacion = (index) => {
  if (datos.value.actuaciones.length > 1) {
    datos.value.actuaciones.splice(index, 1);
  }
};
</script>

<style scoped>
.bloque {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;

}

.bloque h4 {
  color: #ac3b61;
  margin-bottom: 1rem;
}

.vista-previa {
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 1.5rem;
  background: #f8f9fa;
  margin-top: 3rem;
}

.form-step {
  max-width: 1000px;
  margin: 0 auto;
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px #0001;
}

.program-title {
  color:#b71c50;
  font-weight: bolder;
}

.section-title {
  color: #b71c50 !important;
  border-bottom: 2px solid #ac3b61;
  padding-bottom: 8px;
  margin-top: 30px;
  margin-bottom: 20px;
  font-size: 1.2rem;
  font-weight: bolder;
  text-shadow: 0 0 white;
}

.form-group {
  margin-bottom: 1.5rem;
}

.analisis-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 1.5rem;
}

.objetivo-item,
.actuacion-item{
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  border-left: 4px solid #ac3b61;
}

.objetivo-header,
.actuacion-header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.objetivo-header h4,
.actuacion-header h4{
  margin: 0;
  color: #ac3b61;
  font-size: 1.2rem;
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
  border-color: #ac3b61;
  box-shadow: 0 0 0 2px rgba(172, 59, 97, 0.1);
}

textarea.form-control {
  resize: vertical;
  min-height: 100px;
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
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.btn-primary {
  background: #ac3b61;
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
  justify-content: space-between;
}
/* NUEVOS ESTILOS PARA LA VISTA PREVIA */
.preview-container {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.preview-header {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  gap: 1rem;
}

.preview-number {
  background: #b71c50;
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  padding: 1rem 0.8rem;
  text-align: center;
}

.preview-title-section {
  flex: 1;
}

.preview-main-title, .preview-subtitle {
  margin: 0;
  color: #b71c50;
  font-weight: bold;
  line-height: 1.2;
}

.preview-main-title {
  font-size: 1.2rem;
  color:black;
}

.preview-subtitle {
  font-size: 1.2rem;
  margin-top: 0.25rem;
  border-bottom: 2px solid #ac3b61;
}

.preview-funding {
  background: #b71c50;
  color: white;
  text-align: center;
  margin-bottom: 2rem;
}

.funding-amount {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.funding-label {
  font-size: 1.2rem;
  opacity: 0.9;
}

.preview-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.preview-stats-description {
  display: flex;
  gap: 1px;
  align-items: center;
}

.preview-stats {
  display: flex;
  margin-bottom: 0;
  margin-right: 1px;
  flex: 0 0 auto;
}

.stat-circle {
  background: #b71c50;
  border: 3px solid #b71c50;
  width: 60%;
  height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  line-height: 1;
}

.stat-label {
  font-size: 0.9rem;
  margin-top: 0.25rem;
}

.preview-description {
  background: white;
  margin-left: -50px;
  color: #333;
  flex: 1;
}

.preview-objectives {
  background: #edc7cd;
  padding: 1.5rem;
}

.objectives-title {
  color: #b71c50;
  font-size: 1.3rem;
  font-weight: bold;
  margin: 0 0 1rem 0;
}

.objectives-list {
  display: grid;
  gap: 0.75rem;
}

.objective-item {
  color:black;
  font-size: 0.9rem;
  font-weight: 500;
}

.preview-subsection {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 2rem;
  border: 1px solid #e9ecef;
}

.subsection-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #b71c50;
}

.subsection-number {
  background: #495057;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: bold;
  font-size: 1.1rem;
}

.subsection-title {
  color: #b71c50;
  font-size: 1.4rem;
  font-weight: bold;
}

.subsection-description {
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  line-height: 1.6;
  color: black;
}

.actuaciones-preview h4 {
  color: #495057;
  margin-bottom: 1rem;
  text-align: center;
}

.actuaciones-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.actuacion-card {
  background: linear-gradient(135deg, #f1c0d0 0%, #e8a4c0 100%);
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  border: 1px solid #d6a2b8;
}

.actuacion-name {
  font-weight: bold;
  color: #495057;
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.actuacion-date {
  color: #b71c43e3;
  font-size: 0.9rem;
}

.analysis-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 1.5rem;
}

.analysis-item {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  border: 2px solid #b71c50;
}

.analysis-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.analysis-number {
  font-size: 3rem;
  font-weight: bold;
  color: #b71c50;
  margin-bottom: 0.5rem;
}

.analysis-label {
  color: #495057;
  font-weight: 500;
  line-height: 1.4;
}

/* ESTILOS ORIGINALES */
.program-title {
  color:#b71c50;
  font-weight: bolder;
}

.section-title {
  color: #b71c50;
  border-bottom: 2px solid #ac3b61;
  padding-bottom: 8px;
  margin-top: 30px;
  margin-bottom: 20px;
  font-size: 1.2rem;
  font-weight: bolder;
}

.form-group {
  margin-bottom: 1.5rem;
}

.analisis-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 1.5rem;
}

.objetivo-item,
.actuacion-item{
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  border-left: 4px solid #ac3b61;
}

.objetivo-header,
.actuacion-header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.objetivo-header h4,
.actuacion-header h4{
  margin: 0;
  color: #ac3b61;
  font-size: 1.2rem;
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
  border-color: #ac3b61;
  box-shadow: 0 0 0 2px rgba(172, 59, 97, 0.1);
}

textarea.form-control {
  resize: vertical;
  min-height: 100px;
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
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.btn-primary {
  background: #ac3b61;
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
  justify-content: space-between;
}

@media (max-width: 768px) {
  .preview-header {
    flex-direction: column;
    text-align: center;
  }
  
  .preview-main-title, .preview-subtitle {
    font-size: 1.4rem;
  }
  
  .analysis-stats {
    grid-template-columns: 1fr;
  }
  
  .actuaciones-grid {
    grid-template-columns: 1fr;
  }
}
</style>