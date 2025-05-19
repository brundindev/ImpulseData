<template>
  <div class="form-step">
    <h3>Resultados de Marketing</h3>
    
    <div class="form-group">
      <label>Resultados Digitales</label>
      <div v-for="(resultado, index) in datos.resultadosDigitales" :key="index" class="item">
        <div class="item-header">
          <h4>Resultado {{ index + 1 }}</h4>
          <button 
            @click="eliminarResultadoDigital(index)" 
            class="btn btn-danger btn-sm"
            type="button"
            v-if="datos.resultadosDigitales.length > 1"
          >
            <span class="btn-icon">✕</span>
          </button>
        </div>
        
        <div class="form-group">
          <label>Plataforma</label>
          <input 
            type="text" 
            v-model="resultado.plataforma" 
            class="form-control"
            placeholder="Plataforma digital"
          >
        </div>
        
        <div class="form-group">
          <label>Métricas</label>
          <div v-for="(metrica, mIndex) in resultado.metricas" :key="mIndex" class="metrica-item">
            <div class="metrica-header">
              <h5>Métrica {{ mIndex + 1 }}</h5>
              <button 
                @click="eliminarMetrica(index, mIndex)" 
                class="btn btn-danger btn-sm"
                type="button"
                v-if="resultado.metricas.length > 1"
              >
                <span class="btn-icon">✕</span>
              </button>
            </div>
            
            <div class="form-group">
              <label>Nombre</label>
              <input 
                type="text" 
                v-model="metrica.nombre" 
                class="form-control"
                placeholder="Nombre de la métrica"
              >
            </div>
            
            <div class="form-group">
              <label>Valor</label>
              <input 
                type="text" 
                v-model="metrica.valor" 
                class="form-control"
                placeholder="Valor de la métrica"
              >
            </div>
          </div>
          
          <button 
            @click="agregarMetrica(index)" 
            class="btn btn-secondary"
            type="button"
          >
            Agregar Métrica
          </button>
        </div>
        
        <div class="form-group">
          <label>Análisis</label>
          <textarea 
            v-model="resultado.analisis" 
            class="form-control"
            rows="3"
            placeholder="Análisis de los resultados"
          ></textarea>
        </div>
      </div>
      
      <button 
        @click="agregarResultadoDigital" 
        class="btn btn-secondary"
        type="button"
      >
        Agregar Resultado Digital
      </button>
    </div>

    <div class="form-group">
      <label>Resultados Tradicionales</label>
      <div v-for="(resultado, index) in datos.resultadosTradicionales" :key="index" class="item">
        <div class="item-header">
          <h4>Resultado {{ index + 1 }}</h4>
          <button 
            @click="eliminarResultadoTradicional(index)" 
            class="btn btn-danger btn-sm"
            type="button"
            v-if="datos.resultadosTradicionales.length > 1"
          >
            <span class="btn-icon">✕</span>
          </button>
        </div>
        
        <div class="form-group">
          <label>Medio</label>
          <input 
            type="text" 
            v-model="resultado.medio" 
            class="form-control"
            placeholder="Medio de comunicación"
          >
        </div>
        
        <div class="form-group">
          <label>Alcance</label>
          <input 
            type="text" 
            v-model="resultado.alcance" 
            class="form-control"
            placeholder="Alcance de la campaña"
          >
        </div>
        
        <div class="form-group">
          <label>Análisis</label>
          <textarea 
            v-model="resultado.analisis" 
            class="form-control"
            rows="3"
            placeholder="Análisis de los resultados"
          ></textarea>
        </div>
      </div>
      
      <button 
        @click="agregarResultadoTradicional" 
        class="btn btn-secondary"
        type="button"
      >
        Agregar Resultado Tradicional
      </button>
    </div>

    <div class="form-actions">
      <button 
        @click="$emit('anterior')" 
        class="btn btn-secondary"
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
if (!datos.value.resultadosDigitales) {
  datos.value.resultadosDigitales = [{
    plataforma: '',
    metricas: [{
      nombre: '',
      valor: ''
    }],
    analisis: ''
  }];
}
if (!datos.value.resultadosTradicionales) {
  datos.value.resultadosTradicionales = [{
    medio: '',
    alcance: '',
    analisis: ''
  }];
}

const agregarResultadoDigital = () => {
  datos.value.resultadosDigitales.push({
    plataforma: '',
    metricas: [{
      nombre: '',
      valor: ''
    }],
    analisis: ''
  });
};

const eliminarResultadoDigital = (index) => {
  if (datos.value.resultadosDigitales.length > 1) {
    datos.value.resultadosDigitales.splice(index, 1);
  }
};

const agregarMetrica = (resultadoIndex) => {
  datos.value.resultadosDigitales[resultadoIndex].metricas.push({
    nombre: '',
    valor: ''
  });
};

const eliminarMetrica = (resultadoIndex, metricaIndex) => {
  if (datos.value.resultadosDigitales[resultadoIndex].metricas.length > 1) {
    datos.value.resultadosDigitales[resultadoIndex].metricas.splice(metricaIndex, 1);
  }
};

const agregarResultadoTradicional = () => {
  datos.value.resultadosTradicionales.push({
    medio: '',
    alcance: '',
    analisis: ''
  });
};

const eliminarResultadoTradicional = (index) => {
  if (datos.value.resultadosTradicionales.length > 1) {
    datos.value.resultadosTradicionales.splice(index, 1);
  }
};

const esValido = computed(() => {
  return datos.value.resultadosDigitales.every(resultado => 
    resultado.plataforma && 
    resultado.analisis &&
    resultado.metricas.every(metrica => metrica.nombre && metrica.valor)
  ) &&
  datos.value.resultadosTradicionales.every(resultado => 
    resultado.medio && resultado.alcance && resultado.analisis
  );
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

.item {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.item-header h4 {
  margin: 0;
  color: #004698;
  font-size: 1.2rem;
}

.metrica-item {
  background: white;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.metrica-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.metrica-header h5 {
  margin: 0;
  color: #004698;
  font-size: 1rem;
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