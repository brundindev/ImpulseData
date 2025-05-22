<template>
  <div class="form-step">
    <h3 class="program-title">4.2 OBSERVATORIO DE ESTRATEGIAS DEL PACTO TERRITORIAL POR EL EMPLEO DE LA CIUDAD DE ALICANTE</h3>
    
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
      <label>Descripción adicional del Observatorio</label>
      <textarea 
        v-model="datos.descripcionObservatorio" 
        class="form-control" 
        rows="3" 
        placeholder="El Observatorio, financiado por un programa de LABORA para pactos territoriales..."
      ></textarea>
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

    <div class="form-group">
      <label>Anexos generados</label>
      <div class="anexos-container">
        <div v-for="(anexo, index) in datos.anexos" :key="index" class="anexo-item">
          <div class="anexo-header">
            <h4>Anexo {{ index + 1 }}</h4>
            <button 
              @click="eliminarAnexo(index)" 
              class="btn btn-danger btn-sm"
              type="button"
              v-if="datos.anexos.length > 1"
            >
              Eliminar
            </button>
          </div>
          
          <div class="form-group">
            <label>Número del Anexo</label>
            <input 
              type="text" 
              v-model="anexo.numero" 
              class="form-control"
              placeholder="Ej: Anexo 39"
            >
          </div>
          
          <div class="form-group">
            <label>Título del Anexo</label>
            <input 
              type="text" 
              v-model="anexo.titulo" 
              class="form-control"
              placeholder="Ej: Informe EPA 4º trimestre de 2023"
            >
          </div>
        </div>
        
        <button 
          @click="agregarAnexo" 
          class="btn btn-secondary"
          type="button"
        >
          Agregar Anexo
        </button>
      </div>
    </div>

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

if (!datos.value.anexos) {
  datos.value.anexos = [
    { numero: 'Anexo 39', titulo: '', descripcion: '' },
    { numero: 'Anexo 40', titulo: '', descripcion: '' }
  ];
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

const agregarAnexo = () => {
  datos.value.anexos.push({ numero: '', titulo: '', descripcion: '' });
};

const eliminarAnexo = (index) => {
  if (datos.value.anexos.length > 1) {
    datos.value.anexos.splice(index, 1);
  }
};
</script>

<style scoped>
.form-step {
  max-width: 800px;
  margin: 0 auto;
}

.program-title {
  background-color: #ac3b61;
  color: white;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 20px;
  font-size: 1.5rem;
  font-weight: bold;
}

.section-title {
  color: #ac3b61;
  border-bottom: 2px solid #ac3b61;
  padding-bottom: 8px;
  margin-top: 30px;
  margin-bottom: 20px;
  font-size: 1.2rem;
  font-weight: bold;
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
.actuacion-item,
.anexo-item {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  border-left: 4px solid #ac3b61;
}

.objetivo-header,
.actuacion-header,
.anexo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.objetivo-header h4,
.actuacion-header h4,
.anexo-header h4 {
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
</style>