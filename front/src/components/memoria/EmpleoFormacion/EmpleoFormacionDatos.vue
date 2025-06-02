<template>
  <div class="form-step">
    <h3>Datos Totales del Departamento de Empleo y Formación</h3>

    <!-- ORIENTACIÓN E INTERMEDIACIÓN LABORAL -->
    <div class="form-section">
      <h4>ORIENTACIÓN E INTERMEDIACIÓN LABORAL</h4>
      <div class="form-group">
        <label for="personasAtendidasOrientacion">Personas atendidas</label>
        <input
          type="number"
          id="personasAtendidasOrientacion"
          v-model="datos.orientacion.personasAtendidas"
          class="form-control"
          min="0"
          placeholder="Número de personas atendidas"
        >
      </div>
      <div class="form-group">
        <label for="nuevasAltasDemandantes">Nuevas altas de demandantes</label>
        <input
          type="number"
          id="nuevasAltasDemandantes"
          v-model="datos.orientacion.nuevasAltasDemandantes"
          class="form-control"
          min="0"
          placeholder="Número de nuevas altas"
        >
      </div>
      <div class="form-group">
        <label for="accionesOrientacion">Acciones de orientación</label>
        <input
          type="number"
          id="accionesOrientacion"
          v-model="datos.orientacion.accionesOrientacion"
          class="form-control"
          min="0"
          placeholder="Número de acciones de orientación"
        >
      </div>
      <div class="form-group">
        <label for="ofertasTrabajo">Ofertas de trabajo</label>
        <input
          type="number"
          id="ofertasTrabajo"
          v-model="datos.orientacion.ofertasTrabajo"
          class="form-control"
          min="0"
          placeholder="Número de ofertas de trabajo"
        >
      </div>
    </div>

    <!-- FORMACIÓN -->
    <div class="form-section">
      <h4>FORMACIÓN</h4>
      <div class="form-group">
        <label for="actividadesFormacion">Actividades</label>
        <input
          type="number"
          id="actividadesFormacion"
          v-model="datos.formacion.actividades"
          class="form-control"
          min="0"
          placeholder="Número de actividades"
        >
      </div>
      <div class="form-group">
        <label for="cursosFormacion">Cursos</label>
        <input
          type="number"
          id="cursosFormacion"
          v-model="datos.formacion.cursos"
          class="form-control"
          min="0"
          placeholder="Número de cursos"
        >
      </div>
      <div class="form-group">
        <label for="pildorasFormativas">Píldoras formativas</label>
        <input
          type="number"
          id="pildorasFormativas"
          v-model="datos.formacion.pildorasFormativas"
          class="form-control"
          min="0"
          placeholder="Número de píldoras formativas"
        >
      </div>
      <div class="form-group">
        <label for="participantesFormacion">Participantes</label>
        <input
          type="number"
          id="participantesFormacion"
          v-model="datos.formacion.participantes"
          class="form-control"
          min="0"
          placeholder="Número de participantes"
        >
      </div>
      <div class="form-group">
        <label for="horasFormacion">Horas</label>
        <input
          type="number"
          id="horasFormacion"
          v-model="datos.formacion.horas"
          class="form-control"
          min="0"
          placeholder="Número de horas"
        >
      </div>
    </div>

    <!-- ASESORAMIENTO EMPRESARIAL Y AL AUTOEMPLEO -->
    <div class="form-section">
      <h4>ASESORAMIENTO EMPRESARIAL Y AL AUTOEMPLEO</h4>
      <div class="form-group">
        <label for="personasAtendidasAutoempleo">Personas atendidas en autoempleo</label>
        <input
          type="number"
          id="personasAtendidasAutoempleo"
          v-model="datos.asesoramiento.personasAtendidas"
          class="form-control"
          min="0"
          placeholder="Número de personas atendidas"
        >
      </div>
      <div class="form-group">
        <label for="empresasCreadas">Empresas creadas</label>
        <input
          type="number"
          id="empresasCreadas"
          v-model="datos.asesoramiento.empresasCreadas"
          class="form-control"
          min="0"
          placeholder="Número de empresas creadas"
        >
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

// Inicializar datos si no existen con la nueva estructura
if (!datos.value.orientacion) {
  datos.value.orientacion = {
    personasAtendidas: 0,
    nuevasAltasDemandantes: 0,
    accionesOrientacion: 0,
    ofertasTrabajo: 0,
  };
}

if (!datos.value.formacion) {
  datos.value.formacion = {
    actividades: 0,
    cursos: 0,
    pildorasFormativas: 0,
    participantes: 0,
    horas: 0,
  };
}

if (!datos.value.asesoramiento) {
  datos.value.asesoramiento = {
    personasAtendidas: 0,
    empresasCreadas: 0,
  };
}

// La validación ahora solo verifica que los números no sean negativos (aunque los inputs ya lo hacen con min="0")
// y que los objetos de datos existan.
const esValido = computed(() => {
  const orientacionValido = datos.value.orientacion &&
    datos.value.orientacion.personasAtendidas >= 0 &&
    datos.value.orientacion.nuevasAltasDemandantes >= 0 &&
    datos.value.orientacion.accionesOrientacion >= 0 &&
    datos.value.orientacion.ofertasTrabajo >= 0;

  const formacionValido = datos.value.formacion &&
    datos.value.formacion.actividades >= 0 &&
    datos.value.formacion.cursos >= 0 &&
    datos.value.formacion.pildorasFormativas >= 0 &&
    datos.value.formacion.participantes >= 0 &&
    datos.value.formacion.horas >= 0;

  const asesoramientoValido = datos.value.asesoramiento &&
    datos.value.asesoramiento.personasAtendidas >= 0 &&
    datos.value.asesoramiento.empresasCreadas >= 0;

  return orientacionValido && formacionValido && asesoramientoValido;
});
</script>

<style scoped>
.form-step {
  max-width: 800px;
  margin: 0 auto;
}

.form-section {
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: #f8f9fa;
    border-radius: 8px;
    border-left: 5px solid #004698; /* Indicative border */
}

.form-section h4 {
    margin-top: 0;
    color: #004698;
    margin-bottom: 1.5rem;
    border-bottom: 1px solid #eee;
    padding-bottom: 0.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

/* Removed .programa-item, .colaboracion-item, etc. styles */

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