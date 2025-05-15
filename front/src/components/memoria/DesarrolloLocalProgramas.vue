<template>
  <div class="form-step">
    <h3>Programas y Actividades</h3>
    
    <div class="form-group">
      <label>Programas Desarrollados</label>
      <div class="programas">
        <div v-for="(programa, index) in datos.programas" :key="index" class="programa-item">
          <div class="programa-header">
            <h4>Programa {{ index + 1 }}</h4>
            <button 
              @click="eliminarPrograma(index)" 
              class="btn btn-danger"
              type="button"
              v-if="datos.programas.length > 1"
            >
              Eliminar
            </button>
          </div>
          
          <div class="form-group">
            <label>Nombre del Programa</label>
            <input 
              type="text" 
              v-model="programa.nombre" 
              class="form-control"
              placeholder="Nombre del programa"
            >
          </div>
          
          <div class="form-group">
            <label>Descripción</label>
            <textarea 
              v-model="programa.descripcion" 
              class="form-control"
              rows="3"
              placeholder="Describa el programa"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label>Objetivos</label>
            <textarea 
              v-model="programa.objetivos" 
              class="form-control"
              rows="2"
              placeholder="Describa los objetivos del programa"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label>Población Objetivo</label>
            <textarea 
              v-model="programa.poblacionObjetivo" 
              class="form-control"
              rows="2"
              placeholder="Describa la población objetivo"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label>Presupuesto</label>
            <input 
              type="number" 
              v-model="programa.presupuesto" 
              class="form-control"
              min="0"
              placeholder="Presupuesto en euros"
            >
          </div>
          
          <div class="form-group">
            <label>Resultados</label>
            <textarea 
              v-model="programa.resultados" 
              class="form-control"
              rows="3"
              placeholder="Describa los resultados obtenidos"
            ></textarea>
          </div>
        </div>
        
        <button 
          @click="agregarPrograma" 
          class="btn btn-secondary"
          type="button"
        >
          Agregar Programa
        </button>
      </div>
    </div>

    <div class="form-group">
      <label>Actividades Realizadas</label>
      <div class="actividades">
        <div v-for="(actividad, index) in datos.actividades" :key="index" class="actividad-item">
          <div class="actividad-header">
            <h4>Actividad {{ index + 1 }}</h4>
            <button 
              @click="eliminarActividad(index)" 
              class="btn btn-danger"
              type="button"
              v-if="datos.actividades.length > 1"
            >
              Eliminar
            </button>
          </div>
          
          <div class="form-group">
            <label>Nombre de la Actividad</label>
            <input 
              type="text" 
              v-model="actividad.nombre" 
              class="form-control"
              placeholder="Nombre de la actividad"
            >
          </div>
          
          <div class="form-group">
            <label>Descripción</label>
            <textarea 
              v-model="actividad.descripcion" 
              class="form-control"
              rows="3"
              placeholder="Describa la actividad"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label>Fecha de Realización</label>
            <input 
              type="date" 
              v-model="actividad.fecha" 
              class="form-control"
            >
          </div>
          
          <div class="form-group">
            <label>Lugar</label>
            <input 
              type="text" 
              v-model="actividad.lugar" 
              class="form-control"
              placeholder="Lugar de realización"
            >
          </div>
          
          <div class="form-group">
            <label>Participantes</label>
            <input 
              type="number" 
              v-model="actividad.participantes" 
              class="form-control"
              min="0"
              placeholder="Número de participantes"
            >
          </div>
          
          <div class="form-group">
            <label>Resultados</label>
            <textarea 
              v-model="actividad.resultados" 
              class="form-control"
              rows="2"
              placeholder="Describa los resultados obtenidos"
            ></textarea>
          </div>
        </div>
        
        <button 
          @click="agregarActividad" 
          class="btn btn-secondary"
          type="button"
        >
          Agregar Actividad
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
if (!datos.value.programas) {
  datos.value.programas = [{
    nombre: '',
    descripcion: '',
    objetivos: '',
    poblacionObjetivo: '',
    presupuesto: 0,
    resultados: ''
  }];
}

if (!datos.value.actividades) {
  datos.value.actividades = [{
    nombre: '',
    descripcion: '',
    fecha: '',
    lugar: '',
    participantes: 0,
    resultados: ''
  }];
}

const agregarPrograma = () => {
  datos.value.programas.push({
    nombre: '',
    descripcion: '',
    objetivos: '',
    poblacionObjetivo: '',
    presupuesto: 0,
    resultados: ''
  });
};

const eliminarPrograma = (index) => {
  if (datos.value.programas.length > 1) {
    datos.value.programas.splice(index, 1);
  }
};

const agregarActividad = () => {
  datos.value.actividades.push({
    nombre: '',
    descripcion: '',
    fecha: '',
    lugar: '',
    participantes: 0,
    resultados: ''
  });
};

const eliminarActividad = (index) => {
  if (datos.value.actividades.length > 1) {
    datos.value.actividades.splice(index, 1);
  }
};

const esValido = computed(() => {
  return datos.value.programas.every(programa => 
    programa.nombre && 
    programa.descripcion && 
    programa.objetivos && 
    programa.poblacionObjetivo && 
    programa.presupuesto >= 0
  ) &&
  datos.value.actividades.every(actividad => 
    actividad.nombre && 
    actividad.descripcion && 
    actividad.fecha && 
    actividad.lugar && 
    actividad.participantes >= 0
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

.programa-item,
.actividad-item {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.programa-header,
.actividad-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.programa-header h4,
.actividad-header h4 {
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