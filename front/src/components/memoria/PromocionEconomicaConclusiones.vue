<template>
  <div class="form-step">
    <h3>Conclusiones</h3>
    
    <div class="form-group">
      <label>Resumen Ejecutivo</label>
      <textarea 
        v-model="datos.resumenEjecutivo" 
        class="form-control"
        rows="4"
        placeholder="Describa un resumen ejecutivo de las actividades y resultados del departamento"
      ></textarea>
    </div>

    <div class="form-group">
      <label>Logros Principales</label>
      <div class="logros">
        <div v-for="(logro, index) in datos.logros" :key="index" class="logro-item">
          <div class="logro-header">
            <h4>Logro {{ index + 1 }}</h4>
            <button 
              @click="eliminarLogro(index)" 
              class="btn btn-danger"
              type="button"
              v-if="datos.logros.length > 1"
            >
              Eliminar
            </button>
          </div>
          
          <div class="form-group">
            <label>Descripción del Logro</label>
            <textarea 
              v-model="logro.descripcion" 
              class="form-control"
              rows="3"
              placeholder="Describa el logro alcanzado"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label>Impacto</label>
            <textarea 
              v-model="logro.impacto" 
              class="form-control"
              rows="2"
              placeholder="Describa el impacto del logro"
            ></textarea>
          </div>
        </div>
        
        <button 
          @click="agregarLogro" 
          class="btn btn-secondary"
          type="button"
        >
          Agregar Logro
        </button>
      </div>
    </div>

    <div class="form-group">
      <label>Desafíos y Dificultades</label>
      <div class="desafios">
        <div v-for="(desafio, index) in datos.desafios" :key="index" class="desafio-item">
          <div class="desafio-header">
            <h4>Desafío {{ index + 1 }}</h4>
            <button 
              @click="eliminarDesafio(index)" 
              class="btn btn-danger"
              type="button"
              v-if="datos.desafios.length > 1"
            >
              Eliminar
            </button>
          </div>
          
          <div class="form-group">
            <label>Descripción del Desafío</label>
            <textarea 
              v-model="desafio.descripcion" 
              class="form-control"
              rows="3"
              placeholder="Describa el desafío o dificultad encontrada"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label>Medidas Tomadas</label>
            <textarea 
              v-model="desafio.medidas" 
              class="form-control"
              rows="2"
              placeholder="Describa las medidas tomadas para enfrentar el desafío"
            ></textarea>
          </div>
        </div>
        
        <button 
          @click="agregarDesafio" 
          class="btn btn-secondary"
          type="button"
        >
          Agregar Desafío
        </button>
      </div>
    </div>

    <div class="form-group">
      <label>Recomendaciones</label>
      <div class="recomendaciones">
        <div v-for="(recomendacion, index) in datos.recomendaciones" :key="index" class="recomendacion-item">
          <div class="recomendacion-header">
            <h4>Recomendación {{ index + 1 }}</h4>
            <button 
              @click="eliminarRecomendacion(index)" 
              class="btn btn-danger"
              type="button"
              v-if="datos.recomendaciones.length > 1"
            >
              Eliminar
            </button>
          </div>
          
          <div class="form-group">
            <label>Descripción de la Recomendación</label>
            <textarea 
              v-model="recomendacion.descripcion" 
              class="form-control"
              rows="3"
              placeholder="Describa la recomendación"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label>Justificación</label>
            <textarea 
              v-model="recomendacion.justificacion" 
              class="form-control"
              rows="2"
              placeholder="Justifique la recomendación"
            ></textarea>
          </div>
        </div>
        
        <button 
          @click="agregarRecomendacion" 
          class="btn btn-secondary"
          type="button"
        >
          Agregar Recomendación
        </button>
      </div>
    </div>

    <div class="form-group">
      <label>Perspectivas Futuras</label>
      <textarea 
        v-model="datos.perspectivas" 
        class="form-control"
        rows="4"
        placeholder="Describa las perspectivas futuras del departamento"
      ></textarea>
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

const emit = defineEmits(['update:modelValue', 'siguiente', 'anterior']);

const datos = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// Inicializar datos si no existen
if (!datos.value.resumenEjecutivo) datos.value.resumenEjecutivo = '';

if (!datos.value.logros) {
  datos.value.logros = [{
    descripcion: '',
    impacto: ''
  }];
}

if (!datos.value.desafios) {
  datos.value.desafios = [{
    descripcion: '',
    medidas: ''
  }];
}

if (!datos.value.recomendaciones) {
  datos.value.recomendaciones = [{
    descripcion: '',
    justificacion: ''
  }];
}

if (!datos.value.perspectivas) datos.value.perspectivas = '';

const agregarLogro = () => {
  datos.value.logros.push({
    descripcion: '',
    impacto: ''
  });
};

const eliminarLogro = (index) => {
  if (datos.value.logros.length > 1) {
    datos.value.logros.splice(index, 1);
  }
};

const agregarDesafio = () => {
  datos.value.desafios.push({
    descripcion: '',
    medidas: ''
  });
};

const eliminarDesafio = (index) => {
  if (datos.value.desafios.length > 1) {
    datos.value.desafios.splice(index, 1);
  }
};

const agregarRecomendacion = () => {
  datos.value.recomendaciones.push({
    descripcion: '',
    justificacion: ''
  });
};

const eliminarRecomendacion = (index) => {
  if (datos.value.recomendaciones.length > 1) {
    datos.value.recomendaciones.splice(index, 1);
  }
};

const esValido = computed(() => {
  return datos.value.resumenEjecutivo &&
         datos.value.logros.every(logro => 
           logro.descripcion && 
           logro.impacto
         ) &&
         datos.value.desafios.every(desafio => 
           desafio.descripcion && 
           desafio.medidas
         ) &&
         datos.value.recomendaciones.every(recomendacion => 
           recomendacion.descripcion && 
           recomendacion.justificacion
         ) &&
         datos.value.perspectivas;
});
</script>

<style scoped>
.form-step {
  max-width: 800px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1.5rem;
}

.logro-item,
.desafio-item,
.recomendacion-item {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.logro-header,
.desafio-header,
.recomendacion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.logro-header h4,
.desafio-header h4,
.recomendacion-header h4 {
  margin: 0;
  color: #004698;
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
  border-color: #004698;
  box-shadow: 0 0 0 2px rgba(0, 70, 152, 0.1);
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