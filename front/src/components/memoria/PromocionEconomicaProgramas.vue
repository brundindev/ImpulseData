<template>
  <div class="form-step">
    <h3>Programas y Proyectos</h3>
    
    <div class="form-group">
      <label>Programas de Promoción Económica</label>
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
              placeholder="Describa el programa y sus objetivos"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label>Fecha de Inicio</label>
            <input 
              type="date" 
              v-model="programa.fechaInicio" 
              class="form-control"
            >
          </div>
          
          <div class="form-group">
            <label>Fecha de Fin</label>
            <input 
              type="date" 
              v-model="programa.fechaFin" 
              class="form-control"
            >
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
      <label>Proyectos de Desarrollo Económico</label>
      <div class="proyectos">
        <div v-for="(proyecto, index) in datos.proyectos" :key="index" class="proyecto-item">
          <div class="proyecto-header">
            <h4>Proyecto {{ index + 1 }}</h4>
            <button 
              @click="eliminarProyecto(index)" 
              class="btn btn-danger"
              type="button"
              v-if="datos.proyectos.length > 1"
            >
              Eliminar
            </button>
          </div>
          
          <div class="form-group">
            <label>Nombre del Proyecto</label>
            <input 
              type="text" 
              v-model="proyecto.nombre" 
              class="form-control"
              placeholder="Nombre del proyecto"
            >
          </div>
          
          <div class="form-group">
            <label>Descripción</label>
            <textarea 
              v-model="proyecto.descripcion" 
              class="form-control"
              rows="3"
              placeholder="Describa el proyecto y sus objetivos"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label>Tipo de Proyecto</label>
            <select v-model="proyecto.tipo" class="form-control">
              <option value="">Seleccione un tipo</option>
              <option value="inversion">Inversión</option>
              <option value="desarrollo">Desarrollo</option>
              <option value="innovacion">Innovación</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Fecha de Inicio</label>
            <input 
              type="date" 
              v-model="proyecto.fechaInicio" 
              class="form-control"
            >
          </div>
          
          <div class="form-group">
            <label>Fecha de Fin</label>
            <input 
              type="date" 
              v-model="proyecto.fechaFin" 
              class="form-control"
            >
          </div>
          
          <div class="form-group">
            <label>Presupuesto</label>
            <input 
              type="number" 
              v-model="proyecto.presupuesto" 
              class="form-control"
              min="0"
              placeholder="Presupuesto en euros"
            >
          </div>
          
          <div class="form-group">
            <label>Estado</label>
            <select v-model="proyecto.estado" class="form-control">
              <option value="">Seleccione un estado</option>
              <option value="planificacion">Planificación</option>
              <option value="ejecucion">En Ejecución</option>
              <option value="finalizado">Finalizado</option>
              <option value="suspendido">Suspendido</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Resultados</label>
            <textarea 
              v-model="proyecto.resultados" 
              class="form-control"
              rows="3"
              placeholder="Describa los resultados obtenidos"
            ></textarea>
          </div>
        </div>
        
        <button 
          @click="agregarProyecto" 
          class="btn btn-secondary"
          type="button"
        >
          Agregar Proyecto
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
    fechaInicio: '',
    fechaFin: '',
    presupuesto: 0,
    resultados: ''
  }];
}

if (!datos.value.proyectos) {
  datos.value.proyectos = [{
    nombre: '',
    descripcion: '',
    tipo: '',
    fechaInicio: '',
    fechaFin: '',
    presupuesto: 0,
    estado: '',
    resultados: ''
  }];
}

const agregarPrograma = () => {
  datos.value.programas.push({
    nombre: '',
    descripcion: '',
    fechaInicio: '',
    fechaFin: '',
    presupuesto: 0,
    resultados: ''
  });
};

const eliminarPrograma = (index) => {
  if (datos.value.programas.length > 1) {
    datos.value.programas.splice(index, 1);
  }
};

const agregarProyecto = () => {
  datos.value.proyectos.push({
    nombre: '',
    descripcion: '',
    tipo: '',
    fechaInicio: '',
    fechaFin: '',
    presupuesto: 0,
    estado: '',
    resultados: ''
  });
};

const eliminarProyecto = (index) => {
  if (datos.value.proyectos.length > 1) {
    datos.value.proyectos.splice(index, 1);
  }
};

const esValido = computed(() => {
  return datos.value.programas.every(programa => 
    programa.nombre && 
    programa.descripcion && 
    programa.fechaInicio && 
    programa.fechaFin && 
    programa.presupuesto >= 0
  ) &&
  datos.value.proyectos.every(proyecto => 
    proyecto.nombre && 
    proyecto.descripcion && 
    proyecto.tipo && 
    proyecto.fechaInicio && 
    proyecto.fechaFin && 
    proyecto.presupuesto >= 0 && 
    proyecto.estado
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
.proyecto-item {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.programa-header,
.proyecto-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.programa-header h4,
.proyecto-header h4 {
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