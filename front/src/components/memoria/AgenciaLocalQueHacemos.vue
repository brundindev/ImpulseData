<template>
  <div class="form-step">
    <h3>Qué hacemos</h3>
    
    <div class="lineas-estrategicas">
      <div v-for="(linea, index) in datos.lineasEstrategicas" :key="index" class="linea-item">
        <div class="linea-header">
          <h4>Línea estratégica {{ index + 1 }}</h4>
          <button 
            @click="eliminarLinea(index)" 
            class="btn btn-danger"
            type="button"
            v-if="datos.lineasEstrategicas.length > 1"
          >
            Eliminar
          </button>
        </div>
        
        <div class="form-group">
          <label>Título</label>
          <input 
            type="text" 
            v-model="linea.titulo" 
            class="form-control"
            placeholder="Título de la línea estratégica"
          >
        </div>
        
        <div class="form-group">
          <label>Descripción</label>
          <textarea 
            v-model="linea.descripcion" 
            class="form-control"
            rows="4"
            placeholder="Descripción detallada de la línea estratégica"
          ></textarea>
        </div>
      </div>
      
      <button 
        @click="agregarLinea" 
        class="btn btn-secondary"
        type="button"
        v-if="datos.lineasEstrategicas.length < 4"
      >
        Agregar Línea Estratégica
      </button>
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
if (!datos.value.lineasEstrategicas) {
  datos.value.lineasEstrategicas = [{
    titulo: '',
    descripcion: ''
  }];
}

const agregarLinea = () => {
  if (datos.value.lineasEstrategicas.length < 4) {
    datos.value.lineasEstrategicas.push({
      titulo: '',
      descripcion: ''
    });
  }
};

const eliminarLinea = (index) => {
  if (datos.value.lineasEstrategicas.length > 1) {
    datos.value.lineasEstrategicas.splice(index, 1);
  }
};

const esValido = computed(() => {
  return datos.value.lineasEstrategicas.every(linea => 
    linea.titulo && linea.descripcion
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

.linea-item {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.linea-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.linea-header h4 {
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