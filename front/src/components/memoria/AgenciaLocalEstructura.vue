<template>
  <div class="form-step">
    <h3>Estructura Organizativa</h3>
    
    <div class="form-group">
      <label>Organigrama</label>
      <textarea 
        v-model="datos.organigrama" 
        class="form-control"
        rows="4"
        placeholder="Describa la estructura organizativa de la agencia"
      ></textarea>
    </div>

    <div class="form-group">
      <label>Órganos de Gobierno</label>
      <div class="organos-gobierno">
        <div v-for="(organo, index) in datos.organosGobierno" :key="index" class="organo-item">
          <div class="organo-header">
            <h4>Órgano {{ index + 1 }}</h4>
            <button 
              @click="eliminarOrgano(index)" 
              class="btn btn-danger"
              type="button"
              v-if="datos.organosGobierno.length > 1"
            >
              Eliminar
            </button>
          </div>
          
          <div class="form-group">
            <label>Nombre del Órgano</label>
            <input 
              type="text" 
              v-model="organo.nombre" 
              class="form-control"
              placeholder="Nombre del órgano de gobierno"
            >
          </div>
          
          <div class="form-group">
            <label>Composición</label>
            <textarea 
              v-model="organo.composicion" 
              class="form-control"
              rows="3"
              placeholder="Describa la composición del órgano"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label>Funciones</label>
            <textarea 
              v-model="organo.funciones" 
              class="form-control"
              rows="3"
              placeholder="Describa las funciones principales del órgano"
            ></textarea>
          </div>
        </div>
        
        <button 
          @click="agregarOrgano" 
          class="btn btn-secondary"
          type="button"
        >
          Agregar Órgano de Gobierno
        </button>
      </div>
    </div>

    <div class="form-group">
      <label>Equipo Directivo</label>
      <div class="equipo-directivo">
        <div v-for="(directivo, index) in datos.equipoDirectivo" :key="index" class="directivo-item">
          <div class="directivo-header">
            <h4>Directivo {{ index + 1 }}</h4>
            <button 
              @click="eliminarDirectivo(index)" 
              class="btn btn-danger"
              type="button"
              v-if="datos.equipoDirectivo.length > 1"
            >
              Eliminar
            </button>
          </div>
          
          <div class="form-group">
            <label>Nombre y Apellidos</label>
            <input 
              type="text" 
              v-model="directivo.nombre" 
              class="form-control"
              placeholder="Nombre completo del directivo"
            >
          </div>
          
          <div class="form-group">
            <label>Cargo</label>
            <input 
              type="text" 
              v-model="directivo.cargo" 
              class="form-control"
              placeholder="Cargo que ocupa"
            >
          </div>
          
          <div class="form-group">
            <label>Formación</label>
            <textarea 
              v-model="directivo.formacion" 
              class="form-control"
              rows="2"
              placeholder="Formación académica y profesional"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label>Experiencia</label>
            <textarea 
              v-model="directivo.experiencia" 
              class="form-control"
              rows="2"
              placeholder="Experiencia profesional relevante"
            ></textarea>
          </div>
        </div>
        
        <button 
          @click="agregarDirectivo" 
          class="btn btn-secondary"
          type="button"
        >
          Agregar Directivo
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
if (!datos.value.organosGobierno) {
  datos.value.organosGobierno = [{
    nombre: '',
    composicion: '',
    funciones: ''
  }];
}

if (!datos.value.equipoDirectivo) {
  datos.value.equipoDirectivo = [{
    nombre: '',
    cargo: '',
    formacion: '',
    experiencia: ''
  }];
}

const agregarOrgano = () => {
  datos.value.organosGobierno.push({
    nombre: '',
    composicion: '',
    funciones: ''
  });
};

const eliminarOrgano = (index) => {
  if (datos.value.organosGobierno.length > 1) {
    datos.value.organosGobierno.splice(index, 1);
  }
};

const agregarDirectivo = () => {
  datos.value.equipoDirectivo.push({
    nombre: '',
    cargo: '',
    formacion: '',
    experiencia: ''
  });
};

const eliminarDirectivo = (index) => {
  if (datos.value.equipoDirectivo.length > 1) {
    datos.value.equipoDirectivo.splice(index, 1);
  }
};

const esValido = computed(() => {
  return datos.value.organigrama &&
         datos.value.organosGobierno.every(organo => 
           organo.nombre && organo.composicion && organo.funciones
         ) &&
         datos.value.equipoDirectivo.every(directivo => 
           directivo.nombre && directivo.cargo
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

.organo-item,
.directivo-item {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.organo-header,
.directivo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.organo-header h4,
.directivo-header h4 {
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