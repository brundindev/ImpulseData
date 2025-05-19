<template>
  <div class="form-step">
    <h3>Objetivos de Marketing</h3>
    
    <div class="form-group">
      <label>Objetivos Generales</label>
      <div v-for="(objetivo, index) in datos.objetivosGenerales" :key="index" class="item">
        <div class="item-header">
          <h4>Objetivo {{ index + 1 }}</h4>
          <button 
            @click="eliminarObjetivoGeneral(index)" 
            class="btn btn-danger btn-sm"
            type="button"
            v-if="datos.objetivosGenerales.length > 1"
          >
            <span class="btn-icon">✕</span>
          </button>
        </div>
        
        <div class="form-group">
          <label>Descripción</label>
          <textarea 
            v-model="objetivo.descripcion" 
            class="form-control"
            rows="2"
            placeholder="Descripción del objetivo"
          ></textarea>
        </div>
        
        <div class="form-group">
          <label>Indicadores de Éxito</label>
          <div v-for="(indicador, iIndex) in objetivo.indicadores" :key="iIndex" class="indicador-item">
            <div class="indicador-header">
              <h5>Indicador {{ iIndex + 1 }}</h5>
              <button 
                @click="eliminarIndicador(index, iIndex)" 
                class="btn btn-danger btn-sm"
                type="button"
                v-if="objetivo.indicadores.length > 1"
              >
                <span class="btn-icon">✕</span>
              </button>
            </div>
            
            <div class="form-group">
              <label>Descripción</label>
              <input 
                type="text" 
                v-model="indicador.descripcion" 
                class="form-control"
                placeholder="Descripción del indicador"
              >
            </div>
            
            <div class="form-group">
              <label>Meta</label>
              <input 
                type="text" 
                v-model="indicador.meta" 
                class="form-control"
                placeholder="Meta del indicador"
              >
            </div>
          </div>
          
          <button 
            @click="agregarIndicador(index)" 
            class="btn btn-secondary"
            type="button"
          >
            Agregar Indicador
          </button>
        </div>
      </div>
      
      <button 
        @click="agregarObjetivoGeneral" 
        class="btn btn-secondary"
        type="button"
      >
        Agregar Objetivo General
      </button>
    </div>

    <div class="form-group">
      <label>Objetivos Específicos</label>
      <div v-for="(objetivo, index) in datos.objetivosEspecificos" :key="index" class="item">
        <div class="item-header">
          <h4>Objetivo {{ index + 1 }}</h4>
          <button 
            @click="eliminarObjetivoEspecifico(index)" 
            class="btn btn-danger btn-sm"
            type="button"
            v-if="datos.objetivosEspecificos.length > 1"
          >
            <span class="btn-icon">✕</span>
          </button>
        </div>
        
        <div class="form-group">
          <label>Descripción</label>
          <textarea 
            v-model="objetivo.descripcion" 
            class="form-control"
            rows="2"
            placeholder="Descripción del objetivo"
          ></textarea>
        </div>
        
        <div class="form-group">
          <label>Plazo</label>
          <input 
            type="text" 
            v-model="objetivo.plazo" 
            class="form-control"
            placeholder="Plazo para alcanzar el objetivo"
          >
        </div>
        
        <div class="form-group">
          <label>Recursos Necesarios</label>
          <textarea 
            v-model="objetivo.recursosNecesarios" 
            class="form-control"
            rows="2"
            placeholder="Recursos necesarios para alcanzar el objetivo"
          ></textarea>
        </div>
      </div>
      
      <button 
        @click="agregarObjetivoEspecifico" 
        class="btn btn-secondary"
        type="button"
      >
        Agregar Objetivo Específico
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
if (!datos.value.objetivosGenerales) {
  datos.value.objetivosGenerales = [{
    descripcion: '',
    indicadores: [{
      descripcion: '',
      meta: ''
    }]
  }];
}
if (!datos.value.objetivosEspecificos) {
  datos.value.objetivosEspecificos = [{
    descripcion: '',
    plazo: '',
    recursosNecesarios: ''
  }];
}

const agregarObjetivoGeneral = () => {
  datos.value.objetivosGenerales.push({
    descripcion: '',
    indicadores: [{
      descripcion: '',
      meta: ''
    }]
  });
};

const eliminarObjetivoGeneral = (index) => {
  if (datos.value.objetivosGenerales.length > 1) {
    datos.value.objetivosGenerales.splice(index, 1);
  }
};

const agregarIndicador = (objetivoIndex) => {
  datos.value.objetivosGenerales[objetivoIndex].indicadores.push({
    descripcion: '',
    meta: ''
  });
};

const eliminarIndicador = (objetivoIndex, indicadorIndex) => {
  if (datos.value.objetivosGenerales[objetivoIndex].indicadores.length > 1) {
    datos.value.objetivosGenerales[objetivoIndex].indicadores.splice(indicadorIndex, 1);
  }
};

const agregarObjetivoEspecifico = () => {
  datos.value.objetivosEspecificos.push({
    descripcion: '',
    plazo: '',
    recursosNecesarios: ''
  });
};

const eliminarObjetivoEspecifico = (index) => {
  if (datos.value.objetivosEspecificos.length > 1) {
    datos.value.objetivosEspecificos.splice(index, 1);
  }
};

const esValido = computed(() => {
  return datos.value.objetivosGenerales.every(objetivo => 
    objetivo.descripcion &&
    objetivo.indicadores.every(indicador => indicador.descripcion && indicador.meta)
  ) &&
  datos.value.objetivosEspecificos.every(objetivo => 
    objetivo.descripcion && objetivo.plazo && objetivo.recursosNecesarios
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

.indicador-item {
  background: white;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.indicador-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.indicador-header h5 {
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