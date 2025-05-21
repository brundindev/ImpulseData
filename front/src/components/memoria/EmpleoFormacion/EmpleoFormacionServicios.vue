<template>
  <div class="form-step">
    <h3>Estadísticas</h3>
    
    <div class="form-group">
      <label>Estadísticas Generales</label>
      <div class="estadisticas-generales">
        <div class="form-group">
          <label>Total de Personas Atendidas</label>
          <input 
            type="number" 
            v-model="datos.totalPersonasAtendidas" 
            class="form-control"
            min="0"
            placeholder="Número total de personas atendidas"
          >
        </div>
        
        <div class="form-group">
          <label>Total de Personas Insertadas</label>
          <input 
            type="number" 
            v-model="datos.totalPersonasInsertadas" 
            class="form-control"
            min="0"
            placeholder="Número total de personas insertadas"
          >
        </div>
        
        <div class="form-group">
          <label>Total de Cursos Impartidos</label>
          <input 
            type="number" 
            v-model="datos.totalCursosImpartidos" 
            class="form-control"
            min="0"
            placeholder="Número total de cursos impartidos"
          >
        </div>
        
        <div class="form-group">
          <label>Total de Talleres Impartidos</label>
          <input 
            type="number" 
            v-model="datos.totalTalleresImpartidos" 
            class="form-control"
            min="0"
            placeholder="Número total de talleres impartidos"
          >
        </div>
        
        <div class="form-group">
          <label>Total de Horas de Formación</label>
          <input 
            type="number" 
            v-model="datos.totalHorasFormacion" 
            class="form-control"
            min="0"
            placeholder="Número total de horas de formación"
          >
        </div>
      </div>
    </div>

    <div class="form-group">
      <label>Estadísticas por Género</label>
      <div class="estadisticas-genero">
        <div class="form-group">
          <label>Personas Atendidas (Hombres)</label>
          <input 
            type="number" 
            v-model="datos.personasAtendidasHombres" 
            class="form-control"
            min="0"
            placeholder="Número de hombres atendidos"
          >
        </div>
        
        <div class="form-group">
          <label>Personas Atendidas (Mujeres)</label>
          <input 
            type="number" 
            v-model="datos.personasAtendidasMujeres" 
            class="form-control"
            min="0"
            placeholder="Número de mujeres atendidas"
          >
        </div>
        
        <div class="form-group">
          <label>Personas Insertadas (Hombres)</label>
          <input 
            type="number" 
            v-model="datos.personasInsertadasHombres" 
            class="form-control"
            min="0"
            placeholder="Número de hombres insertados"
          >
        </div>
        
        <div class="form-group">
          <label>Personas Insertadas (Mujeres)</label>
          <input 
            type="number" 
            v-model="datos.personasInsertadasMujeres" 
            class="form-control"
            min="0"
            placeholder="Número de mujeres insertadas"
          >
        </div>
      </div>
    </div>

    <div class="form-group">
      <label>Estadísticas por Edad</label>
      <div class="estadisticas-edad">
        <div class="form-group">
          <label>Menores de 25 años</label>
          <input 
            type="number" 
            v-model="datos.personasMenores25" 
            class="form-control"
            min="0"
            placeholder="Número de personas menores de 25 años"
          >
        </div>
        
        <div class="form-group">
          <label>Entre 25 y 45 años</label>
          <input 
            type="number" 
            v-model="datos.personasEntre25y45" 
            class="form-control"
            min="0"
            placeholder="Número de personas entre 25 y 45 años"
          >
        </div>
        
        <div class="form-group">
          <label>Mayores de 45 años</label>
          <input 
            type="number" 
            v-model="datos.personasMayores45" 
            class="form-control"
            min="0"
            placeholder="Número de personas mayores de 45 años"
          >
        </div>
      </div>
    </div>

    <div class="form-group">
      <label>Estadísticas por Tipo de Contrato</label>
      <div class="estadisticas-contrato">
        <div class="form-group">
          <label>Contratos Indefinidos</label>
          <input 
            type="number" 
            v-model="datos.contratosIndefinidos" 
            class="form-control"
            min="0"
            placeholder="Número de contratos indefinidos"
          >
        </div>
        
        <div class="form-group">
          <label>Contratos Temporales</label>
          <input 
            type="number" 
            v-model="datos.contratosTemporales" 
            class="form-control"
            min="0"
            placeholder="Número de contratos temporales"
          >
        </div>
        
        <div class="form-group">
          <label>Contratos de Formación</label>
          <input 
            type="number" 
            v-model="datos.contratosFormacion" 
            class="form-control"
            min="0"
            placeholder="Número de contratos de formación"
          >
        </div>
        
        <div class="form-group">
          <label>Otros Tipos de Contrato</label>
          <input 
            type="number" 
            v-model="datos.otrosContratos" 
            class="form-control"
            min="0"
            placeholder="Número de otros tipos de contrato"
          >
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
if (!datos.value.totalPersonasAtendidas) datos.value.totalPersonasAtendidas = 0;
if (!datos.value.totalPersonasInsertadas) datos.value.totalPersonasInsertadas = 0;
if (!datos.value.totalCursosImpartidos) datos.value.totalCursosImpartidos = 0;
if (!datos.value.totalTalleresImpartidos) datos.value.totalTalleresImpartidos = 0;
if (!datos.value.totalHorasFormacion) datos.value.totalHorasFormacion = 0;

if (!datos.value.personasAtendidasHombres) datos.value.personasAtendidasHombres = 0;
if (!datos.value.personasAtendidasMujeres) datos.value.personasAtendidasMujeres = 0;
if (!datos.value.personasInsertadasHombres) datos.value.personasInsertadasHombres = 0;
if (!datos.value.personasInsertadasMujeres) datos.value.personasInsertadasMujeres = 0;

if (!datos.value.personasMenores25) datos.value.personasMenores25 = 0;
if (!datos.value.personasEntre25y45) datos.value.personasEntre25y45 = 0;
if (!datos.value.personasMayores45) datos.value.personasMayores45 = 0;

if (!datos.value.contratosIndefinidos) datos.value.contratosIndefinidos = 0;
if (!datos.value.contratosTemporales) datos.value.contratosTemporales = 0;
if (!datos.value.contratosFormacion) datos.value.contratosFormacion = 0;
if (!datos.value.otrosContratos) datos.value.otrosContratos = 0;

const esValido = computed(() => {
  return datos.value.totalPersonasAtendidas >= 0 &&
         datos.value.totalPersonasInsertadas >= 0 &&
         datos.value.totalCursosImpartidos >= 0 &&
         datos.value.totalTalleresImpartidos >= 0 &&
         datos.value.totalHorasFormacion >= 0 &&
         datos.value.personasAtendidasHombres >= 0 &&
         datos.value.personasAtendidasMujeres >= 0 &&
         datos.value.personasInsertadasHombres >= 0 &&
         datos.value.personasInsertadasMujeres >= 0 &&
         datos.value.personasMenores25 >= 0 &&
         datos.value.personasEntre25y45 >= 0 &&
         datos.value.personasMayores45 >= 0 &&
         datos.value.contratosIndefinidos >= 0 &&
         datos.value.contratosTemporales >= 0 &&
         datos.value.contratosFormacion >= 0 &&
         datos.value.otrosContratos >= 0;
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

.estadisticas-generales,
.estadisticas-genero,
.estadisticas-edad,
.estadisticas-contrato {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
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
}

.btn-primary {
  background: #004698;
  color: white;
}

.btn-secondary {
  background: #6c757d;
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