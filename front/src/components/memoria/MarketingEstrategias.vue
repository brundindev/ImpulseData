<template>
  <div class="form-step">
    <h3>Estrategias de Marketing</h3>
    
    <div class="form-group">
      <label>Estrategias Digitales</label>
      <div v-for="(estrategia, index) in datos.estrategiasDigitales" :key="index" class="item">
        <div class="item-header">
          <h4>Estrategia {{ index + 1 }}</h4>
          <button 
            @click="eliminarEstrategiaDigital(index)" 
            class="btn btn-danger btn-sm"
            type="button"
            v-if="datos.estrategiasDigitales.length > 1"
          >
            <span class="btn-icon">✕</span>
          </button>
        </div>
        
        <div class="form-group">
          <label>Plataforma</label>
          <input 
            type="text" 
            v-model="estrategia.plataforma" 
            class="form-control"
            placeholder="Plataforma digital"
          >
        </div>
        
        <div class="form-group">
          <label>Descripción</label>
          <textarea 
            v-model="estrategia.descripcion" 
            class="form-control"
            rows="2"
            placeholder="Descripción de la estrategia"
          ></textarea>
        </div>
        
        <div class="form-group">
          <label>Resultados Esperados</label>
          <textarea 
            v-model="estrategia.resultadosEsperados" 
            class="form-control"
            rows="2"
            placeholder="Resultados esperados de la estrategia"
          ></textarea>
        </div>
      </div>
      
      <button 
        @click="agregarEstrategiaDigital" 
        class="btn btn-secondary"
        type="button"
      >
        Agregar Estrategia Digital
      </button>
    </div>

    <div class="form-group">
      <label>Estrategias Tradicionales</label>
      <div v-for="(estrategia, index) in datos.estrategiasTradicionales" :key="index" class="item">
        <div class="item-header">
          <h4>Estrategia {{ index + 1 }}</h4>
          <button 
            @click="eliminarEstrategiaTradicional(index)" 
            class="btn btn-danger btn-sm"
            type="button"
            v-if="datos.estrategiasTradicionales.length > 1"
          >
            <span class="btn-icon">✕</span>
          </button>
        </div>
        
        <div class="form-group">
          <label>Medio</label>
          <input 
            type="text" 
            v-model="estrategia.medio" 
            class="form-control"
            placeholder="Medio de comunicación"
          >
        </div>
        
        <div class="form-group">
          <label>Descripción</label>
          <textarea 
            v-model="estrategia.descripcion" 
            class="form-control"
            rows="2"
            placeholder="Descripción de la estrategia"
          ></textarea>
        </div>
        
        <div class="form-group">
          <label>Resultados Esperados</label>
          <textarea 
            v-model="estrategia.resultadosEsperados" 
            class="form-control"
            rows="2"
            placeholder="Resultados esperados de la estrategia"
          ></textarea>
        </div>
      </div>
      
      <button 
        @click="agregarEstrategiaTradicional" 
        class="btn btn-secondary"
        type="button"
      >
        Agregar Estrategia Tradicional
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
if (!datos.value.estrategiasDigitales) {
  datos.value.estrategiasDigitales = [{
    plataforma: '',
    descripcion: '',
    resultadosEsperados: ''
  }];
}
if (!datos.value.estrategiasTradicionales) {
  datos.value.estrategiasTradicionales = [{
    medio: '',
    descripcion: '',
    resultadosEsperados: ''
  }];
}

const agregarEstrategiaDigital = () => {
  datos.value.estrategiasDigitales.push({
    plataforma: '',
    descripcion: '',
    resultadosEsperados: ''
  });
};

const eliminarEstrategiaDigital = (index) => {
  if (datos.value.estrategiasDigitales.length > 1) {
    datos.value.estrategiasDigitales.splice(index, 1);
  }
};

const agregarEstrategiaTradicional = () => {
  datos.value.estrategiasTradicionales.push({
    medio: '',
    descripcion: '',
    resultadosEsperados: ''
  });
};

const eliminarEstrategiaTradicional = (index) => {
  if (datos.value.estrategiasTradicionales.length > 1) {
    datos.value.estrategiasTradicionales.splice(index, 1);
  }
};

const esValido = computed(() => {
  return datos.value.estrategiasDigitales.every(estrategia => 
    estrategia.plataforma && estrategia.descripcion && estrategia.resultadosEsperados
  ) &&
  datos.value.estrategiasTradicionales.every(estrategia => 
    estrategia.medio && estrategia.descripcion && estrategia.resultadosEsperados
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