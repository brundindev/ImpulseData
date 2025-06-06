<template>
  <div class="form-step oficina-europeos-form">
    <h3 class="oficina-europeos-header-title">OFICINA DE<br>PROYECTOS EUROPEOS</h3>

    <!-- Descripción de las funciones -->
    <div class="form-group">
      <label>Funciones de la Oficina</label>
      <textarea
        v-model="datos.descripcionFunciones"
        class="form-control"
        rows="6"
        placeholder="Describa las funciones de la Oficina de Proyectos Europeos"
      ></textarea>
    </div>

    <!-- Métricas Clave -->
    <div class="form-section oficina-europeos-metrics">
      <h4>Métricas Clave</h4>
      <div class="metrics-list">
        <div class="metric-item">
          <i class="fas fa-file-alt metric-icon"></i>
          <div class="metric-value">
            <input
              type="number"
              v-model.number="datos.metricas.convocatoriasAnalizadas"
              class="form-control form-control-sm text-center"
              min="0"
            >
          </div>
          <div class="metric-label">convocatorias analizadas</div>
        </div>

        <div class="metric-item">
           <i class="fas fa-building metric-icon"></i>
           <div class="metric-value">
            <input
              type="number"
              v-model.number="datos.metricas.empresasAsesoradas"
              class="form-control form-control-sm text-center"
              min="0"
            >
          </div>
          <div class="metric-label">empresas asesoradas</div>
        </div>

        <div class="metric-item">
           <i class="fas fa-chalkboard-teacher metric-icon"></i>
           <div class="metric-value">
            <input
              type="number"
              v-model.number="datos.metricas.jornadasFormativas"
              class="form-control form-control-sm text-center"
              min="0"
            >
          </div>
          <div class="metric-label">jornadas formativas para empresas</div>
        </div>
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
      <!-- Este es el último paso, el botón debe guardar -->
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
// Importar Font Awesome si es necesario, o usar clases preexistentes si ya están configuradas
// import '@fortawesome/fontawesome-free/css/all.css';

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
});

// Emitimos 'guardar' en el último paso (asumiendo que es el final de esta sección)
const emit = defineEmits(['update:modelValue', 'anterior', 'siguiente']);

const datos = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// Inicializar datos si no existen
if (!datos.value.descripcionFunciones) datos.value.descripcionFunciones = '';
if (!datos.value.metricas) {
  datos.value.metricas = {
    convocatoriasAnalizadas: 0,
    empresasAsesoradas: 0,
    jornadasFormativas: 0,
  };
}

// Validación del formulario
const esValido = computed(() => {
  return (
    datos.value.descripcionFunciones !== '' &&
    datos.value.metricas.convocatoriasAnalizadas >= 0 &&
    datos.value.metricas.empresasAsesoradas >= 0 &&
    datos.value.metricas.jornadasFormativas >= 0
  );
});
</script>

<style scoped>
/* Reutilizar estilos generales del form-step */
.form-step {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.form-group {
  margin-bottom: 1.5rem;
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
  color: #333;
  background-color: #fff;
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

/* Estilos específicos para este formulario */
.oficina-europeos-form h3.oficina-europeos-header-title {
    color: #8a2146; /* Color similar al de la imagen */
    border-bottom: 3px solid #8a2146; /* Línea debajo del título */
    padding-bottom: 10px;
    margin-bottom: 20px;
    display: inline-block; /* Para que la línea solo abarque el texto */
}

.oficina-europeos-metrics {
    /* Reutilizar estilos de form-section */
    margin-top: 2rem; /* Espacio superior */
}

.metrics-list {
    display: flex;
    justify-content: space-around; /* Espacio equitativo entre métricas */
    flex-wrap: wrap; /* Permitir que se envuelvan */
    gap: 1.5rem; /* Espacio entre ítems */
    text-align: center; /* Centrar contenido */
}

.metric-item {
    flex: 1; /* Cada ítem ocupa espacio equitativo */
    min-width: 120px; /* Ancho mínimo */
    display: flex;
    flex-direction: column;
    align-items: center;
}

.metric-icon {
    font-size: 2rem; /* Tamaño del icono */
    color: #8a2146; /* Color granate */
    margin-bottom: 0.5rem;
}

.metric-value .form-control {
    width: 80px; /* Ancho fijo para el input del número */
    font-size: 1.2rem;
    font-weight: bold;
    color: white; /* Texto blanco */
    background-color: #8a2146; /* Fondo granate */
    border: none;
    padding: 0.375rem 0.75rem; /* Ajustar padding */
}

.metric-label {
    font-size: 0.9rem;
    color: #333;
    margin-top: 0.5rem;
}

/* Ajustes responsivos */
@media (max-width: 768px) {
  .metrics-list {
    flex-direction: column; /* Apilar métricas en pantallas pequeñas */
    gap: 1rem;
  }

  .metric-item {
    width: 100%; /* Ancho completo */
    min-width: 0;
  }
  
  .metric-value .form-control {
      width: 100px; /* Ajustar ancho del input */
  }
}

</style> 