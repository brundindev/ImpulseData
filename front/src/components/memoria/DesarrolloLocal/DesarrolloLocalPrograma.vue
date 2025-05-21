<template>
  <div class="form-step">
    <h3>Información General</h3>
    
    <div class="form-group">
      <label>Descripción del Departamento</label>
      <textarea 
        v-model="datos.descripcion" 
        class="form-control"
        rows="4"
        placeholder="Describa las funciones y responsabilidades del departamento"
      ></textarea>
    </div>

    <div class="form-group">
      <label>Personal del Departamento</label>
      <div class="personal">
        <div v-for="(persona, index) in datos.personal" :key="index" class="persona-item">
          <div class="persona-header">
            <h4>Persona {{ index + 1 }}</h4>
            <button 
              @click="eliminarPersona(index)" 
              class="btn btn-danger"
              type="button"
              v-if="datos.personal.length > 1"
            >
              Eliminar
            </button>
          </div>
          
          <div class="form-group">
            <label>Nombre y Apellidos</label>
            <input 
              type="text" 
              v-model="persona.nombre" 
              class="form-control"
              placeholder="Nombre y apellidos"
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
            <input 
              type="text" 
              v-model="persona.formacion" 
              class="form-control"
              placeholder="Formación académica"
            >
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
          <label>Espacios de Trabajo</label>
          <textarea 
            v-model="datos.espaciosTrabajo" 
            class="form-control"
            rows="2"
            placeholder="Describa los espacios de trabajo disponibles"
          ></textarea>
        </div>
        
        <div class="form-group">
          <label>Equipamiento</label>
          <textarea 
            v-model="datos.equipamiento" 
            class="form-control"
            rows="2"
            placeholder="Describa el equipamiento disponible"
          ></textarea>
        </div>
      </div>
    </div>

    <div class="form-group">
      <label>Áreas de Actuación</label>
      <div class="areas">
        <div v-for="(area, index) in datos.areas" :key="index" class="area-item">
          <div class="area-header">
            <h4>Área {{ index + 1 }}</h4>
            <button 
              @click="eliminarArea(index)" 
              class="btn btn-danger"
              type="button"
              v-if="datos.areas.length > 1"
            >
              Eliminar
            </button>
          </div>
          
          <div class="form-group">
            <label>Nombre del Área</label>
            <input 
              type="text" 
              v-model="area.nombre" 
              class="form-control"
              placeholder="Nombre del área de actuación"
            >
          </div>
          
          <div class="form-group">
            <label>Descripción</label>
            <textarea 
              v-model="area.descripcion" 
              class="form-control"
              rows="3"
              placeholder="Describa el área de actuación"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label>Responsable</label>
            <input 
              type="text" 
              v-model="area.responsable" 
              class="form-control"
              placeholder="Nombre del responsable"
            >
          </div>
        </div>
        
        <button 
          @click="agregarArea" 
          class="btn btn-secondary"
          type="button"
        >
          Agregar Área
        </button>
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
if (!datos.value.espaciosTrabajo) datos.value.espaciosTrabajo = '';
if (!datos.value.equipamiento) datos.value.equipamiento = '';

if (!datos.value.areas) {
  datos.value.areas = [{
    nombre: '',
    descripcion: '',
    responsable: ''
  }];
}

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

const agregarArea = () => {
  datos.value.areas.push({
    nombre: '',
    descripcion: '',
    responsable: ''
  });
};

const eliminarArea = (index) => {
  if (datos.value.areas.length > 1) {
    datos.value.areas.splice(index, 1);
  }
};

const esValido = computed(() => {
  return datos.value.descripcion &&
         datos.value.personal.every(persona => 
           persona.nombre && persona.cargo
         ) &&
         datos.value.presupuestoAnual >= 0 &&
         datos.value.areas.every(area => 
           area.nombre && 
           area.descripcion && 
           area.responsable
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

.persona-item,
.area-item {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.persona-header,
.area-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.persona-header h4,
.area-header h4 {
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
  justify-content: flex-end;
}
</style> 