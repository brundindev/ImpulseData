<template>
  <div class="form-step">
    <h3>ACTIVIDADES DE FORMACIÓN</h3>

    <!-- CURSOS LABORA -->
    <div class="form-section">
      <h4>CURSOS LABORA</h4>
      <div class="form-group">
        <label>Descripción</label>
        <textarea 
          v-model="datos.cursosLabora.descripcion" 
          class="form-control"
          rows="3"
          placeholder="Describa los cursos LABORA"
        ></textarea>
      </div>

      <div class="form-group">
        <label>Cursos</label>
        <div v-for="(curso, index) in datos.cursosLabora.cursos" :key="index" class="curso-item">
          <div class="curso-header">
            <h5>Curso {{ index + 1 }}</h5>
            <button 
              @click="eliminarCurso('labora', index)" 
              class="btn btn-danger"
              type="button"
              v-if="datos.cursosLabora.cursos.length > 1"
            >
              Eliminar
            </button>
          </div>
          <input 
            type="text" 
            v-model="curso.nombre" 
            class="form-control"
            placeholder="Nombre del curso"
          >
        </div>
        <button 
          @click="agregarCurso('labora')" 
          class="btn btn-secondary"
          type="button"
        >
          Agregar Curso
        </button>
      </div>
    </div>

    <!-- CURSOS PROPIOS CON CERTIFICACIÓN -->
    <div class="form-section">
      <h4>CURSOS PROPIOS CON CERTIFICACIÓN</h4>
      <div class="form-group">
        <label>Descripción</label>
        <textarea 
          v-model="datos.cursosPropiosCertificados.descripcion" 
          class="form-control"
          rows="3"
          placeholder="Describa los cursos propios con certificación"
        ></textarea>
      </div>

      <div class="form-group">
        <label>Cursos</label>
        <div v-for="(curso, index) in datos.cursosPropiosCertificados.cursos" :key="index" class="curso-item">
          <div class="curso-header">
            <h5>Curso {{ index + 1 }}</h5>
            <button 
              @click="eliminarCurso('propiosCertificados', index)" 
              class="btn btn-danger"
              type="button"
              v-if="datos.cursosPropiosCertificados.cursos.length > 1"
            >
              Eliminar
            </button>
          </div>
          <input 
            type="text" 
            v-model="curso.nombre" 
            class="form-control"
            placeholder="Nombre del curso"
          >
        </div>
        <button 
          @click="agregarCurso('propiosCertificados')" 
          class="btn btn-secondary"
          type="button"
        >
          Agregar Curso
        </button>
      </div>
    </div>

    <!-- CURSOS PROPIOS SIN CERTIFICACIÓN -->
    <div class="form-section">
      <h4>CURSOS PROPIOS SIN CERTIFICACIÓN</h4>
      <div class="form-group">
        <label>Descripción</label>
        <textarea 
          v-model="datos.cursosPropiosNoCertificados.descripcion" 
          class="form-control"
          rows="3"
          placeholder="Describa los cursos propios sin certificación"
        ></textarea>
      </div>

      <div class="form-group">
        <label>Cursos</label>
        <div v-for="(curso, index) in datos.cursosPropiosNoCertificados.cursos" :key="index" class="curso-item">
          <div class="curso-header">
            <h5>Curso {{ index + 1 }}</h5>
            <button 
              @click="eliminarCurso('propiosNoCertificados', index)" 
              class="btn btn-danger"
              type="button"
              v-if="datos.cursosPropiosNoCertificados.cursos.length > 1"
            >
              Eliminar
            </button>
          </div>
          <input 
            type="text" 
            v-model="curso.nombre" 
            class="form-control"
            placeholder="Nombre del curso"
          >
        </div>
        <button 
          @click="agregarCurso('propiosNoCertificados')" 
          class="btn btn-secondary"
          type="button"
        >
          Agregar Curso
        </button>
      </div>
    </div>

    <!-- PÍLDORAS FORMATIVAS -->
    <div class="form-section">
      <h4>PÍLDORAS FORMATIVAS</h4>
      <div class="form-group">
        <label>Descripción</label>
        <textarea 
          v-model="datos.pildorasFormativas.descripcion" 
          class="form-control"
          rows="3"
          placeholder="Describa las píldoras formativas"
        ></textarea>
      </div>

      <div class="form-group">
        <label>Actividades Formativas</label>
        <div v-for="(actividad, index) in datos.pildorasFormativas.actividades" :key="index" class="actividad-item">
          <div class="actividad-header">
            <h5>Actividad {{ index + 1 }}</h5>
            <button 
              @click="eliminarActividad(index)" 
              class="btn btn-danger"
              type="button"
              v-if="datos.pildorasFormativas.actividades.length > 1"
            >
              Eliminar
            </button>
          </div>
          <input 
            type="text" 
            v-model="actividad.nombre" 
            class="form-control"
            placeholder="Nombre de la actividad"
          >
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

    <!-- TABLA DE CENTROS -->
    <div class="form-section">
      <h4>TABLA DE CENTROS</h4>
      <div class="table-controls">
        <button 
          @click="agregarCentro" 
          class="btn btn-secondary"
          type="button"
        >
          Agregar Centro
        </button>
      </div>
      
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>Centros</th>
              <th v-for="(centro, index) in datos.centros" :key="index">
                {{ centro.nombre }}
                <button 
                  @click="eliminarCentro(index)" 
                  class="btn btn-danger btn-sm"
                  type="button"
                  v-if="datos.centros.length > 1"
                >
                  ×
                </button>
              </th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Píldoras</td>
              <td v-for="(centro, index) in datos.centros" :key="index">
                <input 
                  type="number" 
                  v-model="centro.pildoras" 
                  class="form-control"
                  min="0"
                >
              </td>
              <td>{{ totalPildoras }}</td>
            </tr>
            <tr>
              <td>Asistentes</td>
              <td v-for="(centro, index) in datos.centros" :key="index">
                <input 
                  type="number" 
                  v-model="centro.asistentes" 
                  class="form-control"
                  min="0"
                >
              </td>
              <td>{{ totalAsistentes }}</td>
            </tr>
            <tr>
              <td>Horas</td>
              <td v-for="(centro, index) in datos.centros" :key="index">
                <input 
                  type="number" 
                  v-model="centro.horas" 
                  class="form-control"
                  min="0"
                >
              </td>
              <td>{{ totalHoras }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- RESUMEN ACTIVIDADES DE FORMACIÓN POR MODALIDAD -->
    <div class="form-section">
      <h4>RESUMEN ACTIVIDADES DE FORMACIÓN POR MODALIDAD</h4>
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>Modalidad</th>
              <th>Nº de Cursos</th>
              <th>Horas</th>
              <th>Participantes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Cursos Programación LABORA</td>
              <td><input type="number" :value="numCursosLaboraResumen" class="form-control" min="0" readonly></td>
              <td><input type="number" v-model="datos.resumenFormacion.cursosLabora.horas" class="form-control" min="0"></td>
              <td><input type="number" v-model="datos.resumenFormacion.cursosLabora.participantes" class="form-control" min="0"></td>
            </tr>
            <tr>
              <td>Cursos propios con certificación</td>
              <td><input type="number" :value="numCursosPropiosCertificadosResumen" class="form-control" min="0" readonly></td>
              <td><input type="number" v-model="datos.resumenFormacion.propiosCertificados.horas" class="form-control" min="0"></td>
              <td><input type="number" v-model="datos.resumenFormacion.propiosCertificados.participantes" class="form-control" min="0"></td>
            </tr>
            <tr>
              <td>Cursos propios sin certificación</td>
              <td><input type="number" :value="numCursosPropiosNoCertificadosResumen" class="form-control" min="0" readonly></td>
              <td><input type="number" v-model="datos.resumenFormacion.propiosNoCertificados.horas" class="form-control" min="0"></td>
              <td><input type="number" v-model="datos.resumenFormacion.propiosNoCertificados.participantes" class="form-control" min="0"></td>
            </tr>
            <tr>
              <td>Convenios de formación</td>
              <td><input type="number" v-model="datos.resumenFormacion.convenios.numCursos" class="form-control" min="0"></td>
              <td><input type="number" v-model="datos.resumenFormacion.convenios.horas" class="form-control" min="0"></td>
              <td><input type="number" v-model="datos.resumenFormacion.convenios.participantes" class="form-control" min="0"></td>
            </tr>
            <tr class="total-row">
              <td><strong>Total</strong></td>
              <td><strong>{{ totalCursosResumen }}</strong></td>
              <td><strong>{{ totalHorasResumen }}</strong></td>
              <td><strong>{{ totalParticipantesResumen }}</strong></td>
            </tr>
          </tbody>
        </table>
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
if (!datos.value.cursosLabora) {
  datos.value.cursosLabora = {
    descripcion: '',
    cursos: [{ nombre: '' }]
  };
}

if (!datos.value.cursosPropiosCertificados) {
  datos.value.cursosPropiosCertificados = {
    descripcion: '',
    cursos: [{ nombre: '' }]
  };
}

if (!datos.value.cursosPropiosNoCertificados) {
  datos.value.cursosPropiosNoCertificados = {
    descripcion: '',
    cursos: [{ nombre: '' }]
  };
}

if (!datos.value.pildorasFormativas) {
  datos.value.pildorasFormativas = {
    descripcion: '',
    actividades: [{ nombre: '' }]
  };
}

if (!datos.value.centros) {
  datos.value.centros = [{
    nombre: 'Centro 1',
    pildoras: 0,
    asistentes: 0,
    horas: 0
  }];
}

// Inicializar datos para la nueva tabla de resumen
if (!datos.value.resumenFormacion) {
  datos.value.resumenFormacion = {
    cursosLabora: { numCursos: 0, horas: 0, participantes: 0 },
    propiosCertificados: { numCursos: 0, horas: 0, participantes: 0 },
    propiosNoCertificados: { numCursos: 0, horas: 0, participantes: 0 },
    convenios: { numCursos: 0, horas: 0, participantes: 0 }
  };
}

// Métodos para cursos LABORA
const agregarCurso = (tipo) => {
  const nuevoCurso = { nombre: '' };
  switch(tipo) {
    case 'labora':
      datos.value.cursosLabora.cursos.push(nuevoCurso);
      break;
    case 'propiosCertificados':
      datos.value.cursosPropiosCertificados.cursos.push(nuevoCurso);
      break;
    case 'propiosNoCertificados':
      datos.value.cursosPropiosNoCertificados.cursos.push(nuevoCurso);
      break;
  }
};

const eliminarCurso = (tipo, index) => {
  switch(tipo) {
    case 'labora':
      if (datos.value.cursosLabora.cursos.length > 1) {
        datos.value.cursosLabora.cursos.splice(index, 1);
      }
      break;
    case 'propiosCertificados':
      if (datos.value.cursosPropiosCertificados.cursos.length > 1) {
        datos.value.cursosPropiosCertificados.cursos.splice(index, 1);
      }
      break;
    case 'propiosNoCertificados':
      if (datos.value.cursosPropiosNoCertificados.cursos.length > 1) {
        datos.value.cursosPropiosNoCertificados.cursos.splice(index, 1);
      }
      break;
  }
};

// Métodos para píldoras formativas
const agregarActividad = () => {
  datos.value.pildorasFormativas.actividades.push({ nombre: '' });
};

const eliminarActividad = (index) => {
  if (datos.value.pildorasFormativas.actividades.length > 1) {
    datos.value.pildorasFormativas.actividades.splice(index, 1);
  }
};

// Métodos para centros
const agregarCentro = () => {
  datos.value.centros.push({
    nombre: `Centro ${datos.value.centros.length + 1}`,
    pildoras: 0,
    asistentes: 0,
    horas: 0
  });
};

const eliminarCentro = (index) => {
  if (datos.value.centros.length > 1) {
    datos.value.centros.splice(index, 1);
  }
};

// Totales calculados
const totalPildoras = computed(() => {
  return datos.value.centros.reduce((total, centro) => total + (centro.pildoras || 0), 0);
});

const totalAsistentes = computed(() => {
  return datos.value.centros.reduce((total, centro) => total + (centro.asistentes || 0), 0);
});

const totalHoras = computed(() => {
  return datos.value.centros.reduce((total, centro) => total + (centro.horas || 0), 0);
});

// Totales calculados para la nueva tabla de resumen
const totalCursosResumen = computed(() => {
  const resumen = datos.value.resumenFormacion;
  return (datos.value.cursosLabora.cursos.length || 0) +
         (datos.value.cursosPropiosCertificados.cursos.length || 0) +
         (datos.value.cursosPropiosNoCertificados.cursos.length || 0) +
         (resumen.convenios.numCursos || 0);
});

const totalHorasResumen = computed(() => {
  const resumen = datos.value.resumenFormacion;
  return (resumen.cursosLabora.horas || 0) +
         (resumen.propiosCertificados.horas || 0) +
         (resumen.propiosNoCertificados.horas || 0) +
         (resumen.convenios.horas || 0);
});

const totalParticipantesResumen = computed(() => {
  const resumen = datos.value.resumenFormacion;
  return (resumen.cursosLabora.participantes || 0) +
         (resumen.propiosCertificados.participantes || 0) +
         (resumen.propiosNoCertificados.participantes || 0) +
         (resumen.convenios.participantes || 0);
});

// Añadir computed properties para los counts automáticos en la tabla de resumen
const numCursosLaboraResumen = computed(() => datos.value.cursosLabora.cursos.length || 0);
const numCursosPropiosCertificadosResumen = computed(() => datos.value.cursosPropiosCertificados.cursos.length || 0);
const numCursosPropiosNoCertificadosResumen = computed(() => datos.value.cursosPropiosNoCertificados.cursos.length || 0);

// Validación
const esValido = computed(() => {
  // Puedes añadir validación aquí si es necesario
  return true; 
});
</script>

<style scoped>
.form-step {
  max-width: 1200px;
  margin: 0 auto;
}

.form-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 5px solid #004698;
}

.form-section h4 {
  margin-top: 0;
  color: #004698;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
}

.curso-item,
.actividad-item {
  background: white;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
}

.curso-header,
.actividad-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.curso-header h5,
.actividad-header h5 {
  margin: 0;
  color: #004698;
}

.table-responsive {
  overflow-x: auto;
  margin-top: 1rem;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

.table th,
.table td {
  padding: 0.75rem;
  border: 1px solid #ddd;
  text-align: center;
  color: #000;
}

.table th {
  background: #f8f9fa;
  font-weight: 500;
  color: #000;
}

.table th:first-child,
.table td:first-child {
  text-align: left;
  font-weight: 500;
  color: #000;
}

.table input {
  color: #000;
  background-color: #fff;
}

.table input::placeholder {
  color: #666;
}

.table-controls {
  margin-bottom: 1rem;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
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

.total-row {
  background-color: #e9ecef;
  font-weight: bold;
}

.total-row td {
  font-weight: bold;
}
</style> 