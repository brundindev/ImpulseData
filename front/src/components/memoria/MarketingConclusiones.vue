<template>
  <div class="form-step">
    <h3>Conclusiones de Marketing</h3>
    
    <div class="form-group">
      <label>Logros Principales</label>
      <div v-for="(logro, index) in datos.logros" :key="index" class="item">
        <div class="item-header">
          <h4>Logro {{ index + 1 }}</h4>
          <button 
            @click="eliminarLogro(index)" 
            class="btn btn-danger btn-sm"
            type="button"
            v-if="datos.logros.length > 1"
          >
            <span class="btn-icon">✕</span>
          </button>
        </div>
        
        <div class="form-group">
          <label>Descripción</label>
          <textarea 
            v-model="logro.descripcion" 
            class="form-control"
            rows="2"
            placeholder="Descripción del logro"
          ></textarea>
        </div>
        
        <div class="form-group">
          <label>Impacto</label>
          <textarea 
            v-model="logro.impacto" 
            class="form-control"
            rows="2"
            placeholder="Impacto del logro"
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

    <div class="form-group">
      <label>Desafíos y Oportunidades</label>
      <div v-for="(desafio, index) in datos.desafios" :key="index" class="item">
        <div class="item-header">
          <h4>Desafío {{ index + 1 }}</h4>
          <button 
            @click="eliminarDesafio(index)" 
            class="btn btn-danger btn-sm"
            type="button"
            v-if="datos.desafios.length > 1"
          >
            <span class="btn-icon">✕</span>
          </button>
        </div>
        
        <div class="form-group">
          <label>Descripción</label>
          <textarea 
            v-model="desafio.descripcion" 
            class="form-control"
            rows="2"
            placeholder="Descripción del desafío"
          ></textarea>
        </div>
        
        <div class="form-group">
          <label>Plan de Acción</label>
          <textarea 
            v-model="desafio.planAccion" 
            class="form-control"
            rows="2"
            placeholder="Plan de acción para abordar el desafío"
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

    <div class="form-group">
      <label>Recomendaciones</label>
      <textarea 
        v-model="datos.recomendaciones" 
        class="form-control"
        rows="4"
        placeholder="Recomendaciones generales para mejorar el área de marketing"
      ></textarea>
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
if (!datos.value.logros) {
  datos.value.logros = [{
    descripcion: '',
    impacto: ''
  }];
}
if (!datos.value.desafios) {
  datos.value.desafios = [{
    descripcion: '',
    planAccion: ''
  }];
}
if (!datos.value.recomendaciones) {
  datos.value.recomendaciones = '';
}

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
    planAccion: ''
  });
};

const eliminarDesafio = (index) => {
  if (datos.value.desafios.length > 1) {
    datos.value.desafios.splice(index, 1);
  }
};

const esValido = computed(() => {
  return datos.value.logros.every(logro => 
    logro.descripcion && logro.impacto
  ) &&
  datos.value.desafios.every(desafio => 
    desafio.descripcion && desafio.planAccion
  ) &&
  datos.value.recomendaciones;
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