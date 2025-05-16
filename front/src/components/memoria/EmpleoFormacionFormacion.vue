<template>
  <div class="form-step">
    <h3>Formación</h3>
    
    <div class="form-group">
      <label>Cursos de Formación</label>
      <div class="cursos">
        <div v-for="(curso, index) in datos.cursos" :key="index" class="curso-item">
          <div class="curso-header">
            <h4>Curso {{ index + 1 }}</h4>
            <button 
              @click="eliminarCurso(index)" 
              class="btn btn-danger"
              type="button"
              v-if="datos.cursos.length > 1"
            >
              Eliminar
            </button>
          </div>
          
          <div class="form-group">
            <label>Nombre del Curso</label>
            <input 
              type="text" 
              v-model="curso.nombre" 
              class="form-control"
              placeholder="Nombre del curso"
            >
          </div>
          
          <div class="form-group">
            <label>Área de Formación</label>
            <select v-model="curso.area" class="form-control">
              <option value="">Seleccione un área</option>
              <option value="tecnologia">Tecnología</option>
              <option value="administracion">Administración</option>
              <option value="idiomas">Idiomas</option>
              <option value="habilidades">Habilidades Blandas</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Modalidad</label>
            <select v-model="curso.modalidad" class="form-control">
              <option value="">Seleccione una modalidad</option>
              <option value="presencial">Presencial</option>
              <option value="online">Online</option>
              <option value="hibrido">Híbrido</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Duración (horas)</label>
            <input 
              type="number" 
              v-model="curso.duracion" 
              class="form-control"
              min="0"
              placeholder="Duración en horas"
            >
          </div>
          
          <div class="form-group">
            <label>Fecha de Inicio</label>
            <input 
              type="date" 
              v-model="curso.fechaInicio" 
              class="form-control"
            >
          </div>
          
          <div class="form-group">
            <label>Fecha de Fin</label>
            <input 
              type="date" 
              v-model="curso.fechaFin" 
              class="form-control"
            >
          </div>
          
          <div class="form-group">
            <label>Número de Plazas</label>
            <input 
              type="number" 
              v-model="curso.plazas" 
              class="form-control"
              min="0"
              placeholder="Número total de plazas"
            >
          </div>
          
          <div class="form-group">
            <label>Plazas Ocupadas</label>
            <input 
              type="number" 
              v-model="curso.plazasOcupadas" 
              class="form-control"
              min="0"
              placeholder="Número de plazas ocupadas"
            >
          </div>
          
          <div class="form-group">
            <label>Descripción</label>
            <textarea 
              v-model="curso.descripcion" 
              class="form-control"
              rows="3"
              placeholder="Describa el contenido y objetivos del curso"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label>Resultados</label>
            <textarea 
              v-model="curso.resultados" 
              class="form-control"
              rows="3"
              placeholder="Describa los resultados obtenidos"
            ></textarea>
          </div>
        </div>
        
        <button 
          @click="agregarCurso" 
          class="btn btn-secondary"
          type="button"
        >
          Agregar Curso
        </button>
      </div>
    </div>

    <div class="form-group">
      <label>Talleres y Seminarios</label>
      <div class="talleres">
        <div v-for="(taller, index) in datos.talleres" :key="index" class="taller-item">
          <div class="taller-header">
            <h4>Taller {{ index + 1 }}</h4>
            <button 
              @click="eliminarTaller(index)" 
              class="btn btn-danger"
              type="button"
              v-if="datos.talleres.length > 1"
            >
              Eliminar
            </button>
          </div>
          
          <div class="form-group">
            <label>Nombre del Taller</label>
            <input 
              type="text" 
              v-model="taller.nombre" 
              class="form-control"
              placeholder="Nombre del taller o seminario"
            >
          </div>
          
          <div class="form-group">
            <label>Tipo</label>
            <select v-model="taller.tipo" class="form-control">
              <option value="">Seleccione un tipo</option>
              <option value="taller">Taller</option>
              <option value="seminario">Seminario</option>
              <option value="workshop">Workshop</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Fecha</label>
            <input 
              type="date" 
              v-model="taller.fecha" 
              class="form-control"
            >
          </div>
          
          <div class="form-group">
            <label>Duración (horas)</label>
            <input 
              type="number" 
              v-model="taller.duracion" 
              class="form-control"
              min="0"
              placeholder="Duración en horas"
            >
          </div>
          
          <div class="form-group">
            <label>Participantes</label>
            <input 
              type="number" 
              v-model="taller.participantes" 
              class="form-control"
              min="0"
              placeholder="Número de participantes"
            >
          </div>
          
          <div class="form-group">
            <label>Descripción</label>
            <textarea 
              v-model="taller.descripcion" 
              class="form-control"
              rows="3"
              placeholder="Describa el contenido y objetivos del taller"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label>Resultados</label>
            <textarea 
              v-model="taller.resultados" 
              class="form-control"
              rows="3"
              placeholder="Describa los resultados obtenidos"
            ></textarea>
          </div>
        </div>
        
        <button 
          @click="agregarTaller" 
          class="btn btn-secondary"
          type="button"
        >
          Agregar Taller
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
if (!datos.value.cursos) {
  datos.value.cursos = [{
    nombre: '',
    area: '',
    modalidad: '',
    duracion: 0,
    fechaInicio: '',
    fechaFin: '',
    plazas: 0,
    plazasOcupadas: 0,
    descripcion: '',
    resultados: ''
  }];
}

if (!datos.value.talleres) {
  datos.value.talleres = [{
    nombre: '',
    tipo: '',
    fecha: '',
    duracion: 0,
    participantes: 0,
    descripcion: '',
    resultados: ''
  }];
}

const agregarCurso = () => {
  datos.value.cursos.push({
    nombre: '',
    area: '',
    modalidad: '',
    duracion: 0,
    fechaInicio: '',
    fechaFin: '',
    plazas: 0,
    plazasOcupadas: 0,
    descripcion: '',
    resultados: ''
  });
};

const eliminarCurso = (index) => {
  if (datos.value.cursos.length > 1) {
    datos.value.cursos.splice(index, 1);
  }
};

const agregarTaller = () => {
  datos.value.talleres.push({
    nombre: '',
    tipo: '',
    fecha: '',
    duracion: 0,
    participantes: 0,
    descripcion: '',
    resultados: ''
  });
};

const eliminarTaller = (index) => {
  if (datos.value.talleres.length > 1) {
    datos.value.talleres.splice(index, 1);
  }
};

const esValido = computed(() => {
  return datos.value.cursos.every(curso => 
    curso.nombre && curso.area && curso.modalidad && 
    curso.duracion > 0 && curso.fechaInicio && curso.fechaFin &&
    curso.plazas >= 0 && curso.plazasOcupadas >= 0
  ) &&
  datos.value.talleres.every(taller => 
    taller.nombre && taller.tipo && taller.fecha && 
    taller.duracion > 0 && taller.participantes >= 0
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

.curso-item,
.taller-item {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.curso-header,
.taller-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.curso-header h4,
.taller-header h4 {
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