<template>
  <div class="form-step">
    <h3>Gestión de Recursos</h3>
    
    <div class="form-group">
      <label>Recursos Humanos</label>
      <div class="recursos-humanos">
        <div v-for="(recurso, index) in datos.recursosHumanos" :key="index" class="recurso-item">
          <div class="recurso-header">
            <input 
              type="text" 
              v-model="recurso.categoria" 
              class="form-control"
              placeholder="Categoría (ej: Personal Técnico, Administrativo)"
            >
            <input 
              type="number" 
              v-model="recurso.cantidad" 
              class="form-control"
              placeholder="Cantidad"
              min="0"
            >
            <button 
              @click="eliminarRecurso(index)" 
              class="btn btn-danger"
              type="button"
            >
              Eliminar
            </button>
          </div>
          <textarea 
            v-model="recurso.descripcion" 
            class="form-control"
            rows="2"
            placeholder="Descripción de funciones y responsabilidades"
          ></textarea>
        </div>
        <button 
          @click="agregarRecurso" 
          class="btn btn-secondary"
          type="button"
        >
          Agregar Recurso
        </button>
      </div>
    </div>

    <div class="form-group">
      <label>Recursos Materiales</label>
      <div class="recursos-materiales">
        <div v-for="(material, index) in datos.recursosMateriales" :key="index" class="material-item">
          <div class="material-header">
            <input 
              type="text" 
              v-model="material.nombre" 
              class="form-control"
              placeholder="Nombre del recurso"
            >
            <input 
              type="text" 
              v-model="material.cantidad" 
              class="form-control"
              placeholder="Cantidad/Estado"
            >
            <button 
              @click="eliminarMaterial(index)" 
              class="btn btn-danger"
              type="button"
            >
              Eliminar
            </button>
          </div>
          <textarea 
            v-model="material.descripcion" 
            class="form-control"
            rows="2"
            placeholder="Descripción del recurso y su uso"
          ></textarea>
        </div>
        <button 
          @click="agregarMaterial" 
          class="btn btn-secondary"
          type="button"
        >
          Agregar Material
        </button>
      </div>
    </div>

    <div class="form-group">
      <label>Presupuesto</label>
      <div class="presupuesto">
        <div class="presupuesto-item">
          <label>Presupuesto Total</label>
          <div class="input-group">
            <span class="input-group-text">€</span>
            <input 
              type="number" 
              v-model="datos.presupuesto.total" 
              class="form-control"
              placeholder="0.00"
              min="0"
              step="0.01"
            >
          </div>
        </div>
        
        <div class="presupuesto-item">
          <label>Gastos Operativos</label>
          <div class="input-group">
            <span class="input-group-text">€</span>
            <input 
              type="number" 
              v-model="datos.presupuesto.gastosOperativos" 
              class="form-control"
              placeholder="0.00"
              min="0"
              step="0.01"
            >
          </div>
        </div>
        
        <div class="presupuesto-item">
          <label>Inversiones</label>
          <div class="input-group">
            <span class="input-group-text">€</span>
            <input 
              type="number" 
              v-model="datos.presupuesto.inversiones" 
              class="form-control"
              placeholder="0.00"
              min="0"
              step="0.01"
            >
          </div>
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
        @click="$emit('guardar')" 
        class="btn btn-primary"
        :disabled="!esValido"
      >
        Guardar
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

const emit = defineEmits(['update:modelValue', 'anterior', 'guardar']);

const datos = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// Inicializar datos si no existen
if (!datos.value.recursosHumanos) {
  datos.value.recursosHumanos = [];
}
if (!datos.value.recursosMateriales) {
  datos.value.recursosMateriales = [];
}
if (!datos.value.presupuesto) {
  datos.value.presupuesto = {
    total: 0,
    gastosOperativos: 0,
    inversiones: 0
  };
}

const agregarRecurso = () => {
  datos.value.recursosHumanos.push({
    categoria: '',
    cantidad: 0,
    descripcion: ''
  });
};

const eliminarRecurso = (index) => {
  datos.value.recursosHumanos.splice(index, 1);
};

const agregarMaterial = () => {
  datos.value.recursosMateriales.push({
    nombre: '',
    cantidad: '',
    descripcion: ''
  });
};

const eliminarMaterial = (index) => {
  datos.value.recursosMateriales.splice(index, 1);
};

const esValido = computed(() => {
  return datos.value.recursosHumanos.length > 0 && 
         datos.value.recursosMateriales.length > 0 &&
         datos.value.presupuesto.total > 0;
});
</script>

<style scoped>
.form-step {
  max-width: 800px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 2rem;
}

label {
  display: block;
  margin-bottom: 1rem;
  color: #333;
  font-weight: 500;
  font-size: 1.1rem;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.recurso-item, .material-item {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.recurso-header, .material-header {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.recurso-header .form-control,
.material-header .form-control {
  flex: 1;
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

.presupuesto {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 4px;
}

.presupuesto-item {
  margin-bottom: 1rem;
}

.presupuesto-item:last-child {
  margin-bottom: 0;
}

.input-group {
  display: flex;
  align-items: center;
}

.input-group-text {
  background: #e9ecef;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-right: none;
  border-radius: 4px 0 0 4px;
  color: #666;
}

.input-group .form-control {
  border-radius: 0 4px 4px 0;
  margin-bottom: 0;
}
</style> 