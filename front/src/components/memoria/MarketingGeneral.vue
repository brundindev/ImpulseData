<template>
  <div class="form-step">
    <h3>Información General del Departamento de Marketing</h3>
    
    <div class="form-group">
      <label>Descripción General</label>
      <textarea 
        v-model="datos.descripcion" 
        class="form-control"
        rows="4"
        placeholder="Describa las funciones y responsabilidades generales del departamento de marketing"
      ></textarea>
    </div>

    <div class="form-group">
      <label>Personal</label>
      <div v-for="(persona, index) in datos.personal" :key="index" class="persona-item">
        <div class="persona-header">
          <h4>Persona {{ index + 1 }}</h4>
          <button 
            @click="eliminarPersona(index)" 
            class="btn btn-danger btn-sm"
            type="button"
            v-if="datos.personal.length > 1"
          >
            <span class="btn-icon">✕</span>
          </button>
        </div>
        
        <div class="form-group">
          <label>Nombre</label>
          <input 
            type="text" 
            v-model="persona.nombre" 
            class="form-control"
            placeholder="Nombre completo"
          >
        </div>
        
        <div class="form-group">
          <label>Cargo</label>
          <input 
            type="text" 
            v-model="persona.cargo" 
            class="form-control"
            placeholder="Cargo en el departamento"
          >
        </div>
        
        <div class="form-group">
          <label>Formación</label>
          <textarea 
            v-model="persona.formacion" 
            class="form-control"
            rows="2"
            placeholder="Formación académica y profesional"
          ></textarea>
        </div>
        
        <div class="form-group">
          <label>Experiencia</label>
          <textarea 
            v-model="persona.experiencia" 
            class="form-control"
            rows="2"
            placeholder="Experiencia profesional"
          ></textarea>
        </div>
      </div>
      
      <button 
        @click="agregarPersona" 
        class="btn btn-secondary"
        type="button"
      >
        Agregar Persona
      </button>
    </div>

    <div class="form-group">
      <label>Recursos Disponibles</label>
      <div class="recursos">
        <div class="form-group">
          <label>Presupuesto Anual</label>
          <input 
            type="number" 
            v-model="datos.presupuestoAnual" 
            class="form-control"
            min="0"
            placeholder="Presupuesto anual en euros"
          >
        </div>
        
        <div class="form-group">
          <label>Herramientas y Sistemas</label>
          <textarea 
            v-model="datos.herramientas" 
            class="form-control"
            rows="2"
            placeholder="Describa las herramientas y sistemas disponibles"
          ></textarea>
        </div>
        
        <div class="form-group">
          <label>Recursos Materiales</label>
          <textarea 
            v-model="datos.recursosMateriales" 
            class="form-control"
            rows="2"
            placeholder="Describa los recursos materiales disponibles"
          ></textarea>
        </div>
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

const datos = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// Inicializar datos si no existen
if (!datos.value.descripcion) datos.value.descripcion = '';
if (!datos.value.personal) {
  datos.value.personal = [{
    nombre: '',
    cargo: '',
    formacion: '',
    experiencia: ''
  }];
}
if (!datos.value.presupuestoAnual) datos.value.presupuestoAnual = 0;
if (!datos.value.herramientas) datos.value.herramientas = '';
if (!datos.value.recursosMateriales) datos.value.recursosMateriales = '';

const agregarPersona = () => {
  datos.value.personal.push({
    nombre: '',
    cargo: '',
    formacion: '',
    experiencia: ''
  });
};

const eliminarPersona = (index) => {
  if (datos.value.personal.length > 1) {
    datos.value.personal.splice(index, 1);
  }
};

const esValido = computed(() => {
  return datos.value.descripcion &&
         datos.value.personal.every(persona => 
           persona.nombre && persona.cargo
         ) &&
         datos.value.presupuestoAnual >= 0;
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

.persona-item {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.persona-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.persona-header h4 {
  margin: 0;
  color: #004698;
  font-size: 1.2rem;
}

.recursos {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
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
  justify-content: flex-end;
}
</style> 