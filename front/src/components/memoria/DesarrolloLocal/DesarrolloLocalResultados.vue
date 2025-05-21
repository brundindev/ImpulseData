<template>
  <div class="form-step">
    <h3>Resultados e Indicadores</h3>
    
    <div class="form-group">
      <label>Indicadores de Impacto</label>
      <div class="indicadores">
        <div v-for="(indicador, index) in datos.indicadores" :key="index" class="indicador-item">
          <div class="indicador-header">
            <h4>Indicador {{ index + 1 }}</h4>
            <button 
              @click="eliminarIndicador(index)" 
              class="btn btn-danger"
              type="button"
              v-if="datos.indicadores.length > 1"
            >
              Eliminar
            </button>
          </div>
          
          <div class="form-group">
            <label>Nombre del Indicador</label>
            <input 
              type="text" 
              v-model="indicador.nombre" 
              class="form-control"
              placeholder="Nombre del indicador"
            >
          </div>
          
          <div class="form-group">
            <label>Descripción</label>
            <textarea 
              v-model="indicador.descripcion" 
              class="form-control"
              rows="2"
              placeholder="Describa el indicador"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label>Valor Inicial</label>
            <input 
              type="number" 
              v-model="indicador.valorInicial" 
              class="form-control"
              min="0"
              placeholder="Valor inicial"
            >
          </div>
          
          <div class="form-group">
            <label>Valor Final</label>
            <input 
              type="number" 
              v-model="indicador.valorFinal" 
              class="form-control"
              min="0"
              placeholder="Valor final"
            >
          </div>
          
          <div class="form-group">
            <label>Unidad de Medida</label>
            <input 
              type="text" 
              v-model="indicador.unidad" 
              class="form-control"
              placeholder="Unidad de medida"
            >
          </div>
          
          <div class="form-group">
            <label>Análisis</label>
            <textarea 
              v-model="indicador.analisis" 
              class="form-control"
              rows="3"
              placeholder="Describa el análisis del indicador"
            ></textarea>
          </div>
        </div>
        
        <button 
          @click="agregarIndicador" 
          class="btn btn-secondary"
          type="button"
        >
          Agregar Indicador
        </button>
      </div>
    </div>

    <div class="form-group">
      <label>Resultados Generales</label>
      <div class="resultados">
        <div class="form-group">
          <label>Logros Alcanzados</label>
          <textarea 
            v-model="datos.logrosAlcanzados" 
            class="form-control"
            rows="4"
            placeholder="Describa los logros alcanzados"
          ></textarea>
        </div>
        
        <div class="form-group">
          <label>Dificultades Encontradas</label>
          <textarea 
            v-model="datos.dificultades" 
            class="form-control"
            rows="3"
            placeholder="Describa las dificultades encontradas"
          ></textarea>
        </div>
        
        <div class="form-group">
          <label>Lecciones Aprendidas</label>
          <textarea 
            v-model="datos.leccionesAprendidas" 
            class="form-control"
            rows="3"
            placeholder="Describa las lecciones aprendidas"
          ></textarea>
        </div>
      </div>
    </div>

    <div class="form-group">
      <label>Evaluación de Impacto</label>
      <div class="evaluacion">
        <div class="form-group">
          <label>Impacto Social</label>
          <textarea 
            v-model="datos.impactoSocial" 
            class="form-control"
            rows="3"
            placeholder="Describa el impacto social"
          ></textarea>
        </div>
        
        <div class="form-group">
          <label>Impacto Económico</label>
          <textarea 
            v-model="datos.impactoEconomico" 
            class="form-control"
            rows="3"
            placeholder="Describa el impacto económico"
          ></textarea>
        </div>
        
        <div class="form-group">
          <label>Impacto Ambiental</label>
          <textarea 
            v-model="datos.impactoAmbiental" 
            class="form-control"
            rows="3"
            placeholder="Describa el impacto ambiental"
          ></textarea>
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
if (!datos.value.indicadores) {
  datos.value.indicadores = [{
    nombre: '',
    descripcion: '',
    valorInicial: 0,
    valorFinal: 0,
    unidad: '',
    analisis: ''
  }];
}

if (!datos.value.logrosAlcanzados) datos.value.logrosAlcanzados = '';
if (!datos.value.dificultades) datos.value.dificultades = '';
if (!datos.value.leccionesAprendidas) datos.value.leccionesAprendidas = '';
if (!datos.value.impactoSocial) datos.value.impactoSocial = '';
if (!datos.value.impactoEconomico) datos.value.impactoEconomico = '';
if (!datos.value.impactoAmbiental) datos.value.impactoAmbiental = '';

const agregarIndicador = () => {
  datos.value.indicadores.push({
    nombre: '',
    descripcion: '',
    valorInicial: 0,
    valorFinal: 0,
    unidad: '',
    analisis: ''
  });
};

const eliminarIndicador = (index) => {
  if (datos.value.indicadores.length > 1) {
    datos.value.indicadores.splice(index, 1);
  }
};

const esValido = computed(() => {
  return datos.value.indicadores.every(indicador => 
    indicador.nombre && 
    indicador.descripcion && 
    indicador.valorInicial >= 0 && 
    indicador.valorFinal >= 0 && 
    indicador.unidad
  ) &&
  datos.value.logrosAlcanzados &&
  datos.value.dificultades &&
  datos.value.leccionesAprendidas &&
  datos.value.impactoSocial &&
  datos.value.impactoEconomico &&
  datos.value.impactoAmbiental;
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

.indicador-item {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.indicador-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.indicador-header h4 {
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