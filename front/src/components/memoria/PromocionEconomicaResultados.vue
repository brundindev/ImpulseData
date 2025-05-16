<template>
  <div class="form-step">
    <h3>Resultados</h3>
    
    <div class="form-group">
      <label>Indicadores Económicos</label>
      <div class="indicadores">
        <div class="form-group">
          <label>Número de Empresas Atendidas</label>
          <input 
            type="number" 
            v-model="datos.numeroEmpresas" 
            class="form-control"
            min="0"
            placeholder="Número total de empresas atendidas"
          >
        </div>
        
        <div class="form-group">
          <label>Número de Emprendedores Atendidos</label>
          <input 
            type="number" 
            v-model="datos.numeroEmprendedores" 
            class="form-control"
            min="0"
            placeholder="Número total de emprendedores atendidos"
          >
        </div>
        
        <div class="form-group">
          <label>Inversión Total Atraída</label>
          <input 
            type="number" 
            v-model="datos.inversionTotal" 
            class="form-control"
            min="0"
            placeholder="Inversión total atraída en euros"
          >
        </div>
        
        <div class="form-group">
          <label>Empleos Creados</label>
          <input 
            type="number" 
            v-model="datos.empleosCreados" 
            class="form-control"
            min="0"
            placeholder="Número de empleos creados"
          >
        </div>
      </div>
    </div>

    <div class="form-group">
      <label>Resultados por Sector</label>
      <div class="sectores">
        <div v-for="(sector, index) in datos.sectores" :key="index" class="sector-item">
          <div class="sector-header">
            <h4>Sector {{ index + 1 }}</h4>
            <button 
              @click="eliminarSector(index)" 
              class="btn btn-danger"
              type="button"
              v-if="datos.sectores.length > 1"
            >
              Eliminar
            </button>
          </div>
          
          <div class="form-group">
            <label>Nombre del Sector</label>
            <input 
              type="text" 
              v-model="sector.nombre" 
              class="form-control"
              placeholder="Nombre del sector"
            >
          </div>
          
          <div class="form-group">
            <label>Número de Empresas</label>
            <input 
              type="number" 
              v-model="sector.numeroEmpresas" 
              class="form-control"
              min="0"
              placeholder="Número de empresas en el sector"
            >
          </div>
          
          <div class="form-group">
            <label>Inversión</label>
            <input 
              type="number" 
              v-model="sector.inversion" 
              class="form-control"
              min="0"
              placeholder="Inversión en euros"
            >
          </div>
          
          <div class="form-group">
            <label>Empleos</label>
            <input 
              type="number" 
              v-model="sector.empleos" 
              class="form-control"
              min="0"
              placeholder="Número de empleos"
            >
          </div>
          
          <div class="form-group">
            <label>Descripción de Resultados</label>
            <textarea 
              v-model="sector.descripcion" 
              class="form-control"
              rows="3"
              placeholder="Describa los resultados específicos del sector"
            ></textarea>
          </div>
        </div>
        
        <button 
          @click="agregarSector" 
          class="btn btn-secondary"
          type="button"
        >
          Agregar Sector
        </button>
      </div>
    </div>

    <div class="form-group">
      <label>Análisis de Resultados</label>
      <div class="analisis">
        <div class="form-group">
          <label>Logros Principales</label>
          <textarea 
            v-model="datos.logros" 
            class="form-control"
            rows="4"
            placeholder="Describa los principales logros alcanzados"
          ></textarea>
        </div>
        
        <div class="form-group">
          <label>Dificultades Encontradas</label>
          <textarea 
            v-model="datos.dificultades" 
            class="form-control"
            rows="4"
            placeholder="Describa las principales dificultades encontradas"
          ></textarea>
        </div>
        
        <div class="form-group">
          <label>Lecciones Aprendidas</label>
          <textarea 
            v-model="datos.lecciones" 
            class="form-control"
            rows="4"
            placeholder="Describa las principales lecciones aprendidas"
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
if (!datos.value.numeroEmpresas) datos.value.numeroEmpresas = 0;
if (!datos.value.numeroEmprendedores) datos.value.numeroEmprendedores = 0;
if (!datos.value.inversionTotal) datos.value.inversionTotal = 0;
if (!datos.value.empleosCreados) datos.value.empleosCreados = 0;

if (!datos.value.sectores) {
  datos.value.sectores = [{
    nombre: '',
    numeroEmpresas: 0,
    inversion: 0,
    empleos: 0,
    descripcion: ''
  }];
}

if (!datos.value.logros) datos.value.logros = '';
if (!datos.value.dificultades) datos.value.dificultades = '';
if (!datos.value.lecciones) datos.value.lecciones = '';

const agregarSector = () => {
  datos.value.sectores.push({
    nombre: '',
    numeroEmpresas: 0,
    inversion: 0,
    empleos: 0,
    descripcion: ''
  });
};

const eliminarSector = (index) => {
  if (datos.value.sectores.length > 1) {
    datos.value.sectores.splice(index, 1);
  }
};

const esValido = computed(() => {
  return datos.value.numeroEmpresas >= 0 &&
         datos.value.numeroEmprendedores >= 0 &&
         datos.value.inversionTotal >= 0 &&
         datos.value.empleosCreados >= 0 &&
         datos.value.sectores.every(sector => 
           sector.nombre && 
           sector.numeroEmpresas >= 0 && 
           sector.inversion >= 0 && 
           sector.empleos >= 0 && 
           sector.descripcion
         ) &&
         datos.value.logros &&
         datos.value.dificultades &&
         datos.value.lecciones;
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

.sector-item {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.sector-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.sector-header h4 {
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