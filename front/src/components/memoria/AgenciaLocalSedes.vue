<template>
  <div class="form-step">
    <h3>Dónde Estamos</h3>
    
    <div class="form-group">
      <label>Sedes</label>
      <div class="recursos-humanos">
        <div v-for="(recurso, index) in datos.recursosHumanos" :key="index" class="recurso-item">
          <div class="recurso-header">
            <h4>Sede {{ index + 1 }}</h4>
            <button 
              @click="eliminarSede(index)" 
              class="btn btn-danger"
              type="button"
              v-if="datos.recursosHumanos.length > 1"
            >
              Eliminar
            </button>
          </div>
          
          <div class="form-group">
            <label>Nombre</label>
            <input 
              type="text" 
              v-model="recurso.nombre" 
              class="form-control"
              placeholder="Nombre de la sede"
            >
          </div>
          
          <div class="form-group">
            <label>Dirección</label>
            <input 
              type="text" 
              v-model="recurso.direccion" 
              class="form-control"
              placeholder="Dirección de la sede"
            >
          </div>
        </div>
        
        <button 
          @click="agregarSede" 
          class="btn btn-secondary"
          type="button"
        >
          Agregar Sede
        </button>
      </div>
    </div>

    <div class="form-group">
      <label>Red de territorios</label>
      <div class="recursos-materiales">
        <div v-for="(recurso, index) in datos.recursosMateriales" :key="index" class="recurso-item">
          <div class="recurso-header">
            <h4>Territorio {{ index + 1 }}</h4>
            <button 
              @click="eliminarTerritorio(index)" 
              class="btn btn-danger"
              type="button"
              v-if="datos.recursosMateriales.length > 1"
            >
              Eliminar
            </button>
          </div>
          
          <div class="form-group">
            <label>Nombre</label>
            <input 
              type="text" 
              v-model="recurso.nombre" 
              class="form-control"
              placeholder="Nombre del territorio"
            >
          </div>
        
          <div class="form-group">
            <label>Dirección</label>
            <input 
              type="text" 
              v-model="recurso.direccion" 
              class="form-control"
              placeholder="Dirección del territorio"
            >
          </div>

        </div>
        
        <button 
          @click="agregarTerritorio" 
          class="btn btn-secondary"
          type="button"
        >
          Agregar Territorio
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
        @click="guardarYFinalizar" 
        class="btn btn-primary"
        :disabled="!esValido"
      >
        Guardar y Finalizar
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

const emit = defineEmits(['update:modelValue', 'siguiente', 'anterior', 'guardar']);

const datos = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// Inicializar datos si no existen
if (!datos.value.recursosHumanos) {
  datos.value.recursosHumanos = [{
    nombre: '',
    direccion: ''
  }];
}

if (!datos.value.recursosMateriales) {
  datos.value.recursosMateriales = [{
    nombre: '',
    direccion: ''
  }];
}

if (!datos.value.recursosFinancieros) {
  datos.value.recursosFinancieros = {
    presupuestoTotal: 0,
    fuentes: [{
      nombre: '',
      importe: 0,
      descripcion: ''
    }]
  };
}

const agregarSede = () => {
  datos.value.recursosHumanos.push({
    nombre: '',
    direccion: ''
  });
};

const eliminarSede = (index) => {
  if (datos.value.recursosHumanos.length > 1) {
    datos.value.recursosHumanos.splice(index, 1);
  }
};

const agregarTerritorio = () => {
  datos.value.recursosMateriales.push({
    nombre: '',
    direccion: ''
  });
};

const eliminarTerritorio = (index) => {
  if (datos.value.recursosMateriales.length > 1) {
    datos.value.recursosMateriales.splice(index, 1);
  }
};

const agregarFuente = () => {
  datos.value.recursosFinancieros.fuentes.push({
    nombre: '',
    importe: 0,
    descripcion: ''
  });
};

const eliminarFuente = (index) => {
  if (datos.value.recursosFinancieros.fuentes.length > 1) {
    datos.value.recursosFinancieros.fuentes.splice(index, 1);
  }
};

const esValido = computed(() => {
  return datos.value.recursosHumanos.every(sede => 
    sede.nombre && sede.direccion
  ) &&
  datos.value.recursosMateriales.every(territorio => 
    territorio.nombre && territorio.direccion
  );
});

const guardarYFinalizar = () => {
  // Guardar los datos
  emit('guardar', datos.value);
  
  // Si todo está completo, cerrar el formulario
  if (esValido.value) {
    emit('siguiente');
  }
};
</script>

<style scoped>
.form-step {
  max-width: 800px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1.5rem;
}

.recurso-item,
.fuente-item {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.recurso-header,
.fuente-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.recurso-header h4,
.fuente-header h4 {
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