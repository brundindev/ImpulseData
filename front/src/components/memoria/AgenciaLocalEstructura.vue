<template>
  <div class="form-step">
    <h3>Estructura Organizativa</h3>
    
    <div class="form-group">
      <label>Órganos de Gobierno</label>
      <div class="organos-gobierno">
        <div v-for="(organo, index) in datos.organosGobierno" :key="index" class="organo-item">
          <div class="organo-header">
            <input 
              type="text" 
              v-model="organo.nombre" 
              class="form-control"
              placeholder="Nombre del órgano"
            >
            <button 
              @click="eliminarOrgano(index)" 
              class="btn btn-danger"
              type="button"
            >
              Eliminar
            </button>
          </div>
          <textarea 
            v-model="organo.descripcion" 
            class="form-control"
            rows="3"
            placeholder="Descripción de funciones y responsabilidades"
          ></textarea>
        </div>
        <button 
          @click="agregarOrgano" 
          class="btn btn-secondary"
          type="button"
        >
          Agregar Órgano
        </button>
      </div>
    </div>

    <div class="form-group">
      <label>Equipo Directivo</label>
      <div class="equipo-directivo">
        <div v-for="(miembro, index) in datos.equipoDirectivo" :key="index" class="miembro-item">
          <div class="miembro-header">
            <input 
              type="text" 
              v-model="miembro.nombre" 
              class="form-control"
              placeholder="Nombre del miembro"
            >
            <input 
              type="text" 
              v-model="miembro.cargo" 
              class="form-control"
              placeholder="Cargo"
            >
            <button 
              @click="eliminarMiembro(index)" 
              class="btn btn-danger"
              type="button"
            >
              Eliminar
            </button>
          </div>
        </div>
        <button 
          @click="agregarMiembro" 
          class="btn btn-secondary"
          type="button"
        >
          Agregar Miembro
        </button>
      </div>
    </div>

    <div class="form-group">
      <label for="organigrama">Organigrama</label>
      <div class="organigrama-upload">
        <input 
          type="file" 
          id="organigrama" 
          @change="handleOrganigramaUpload" 
          accept="image/*"
          class="form-control"
        >
        <p class="help-text">Formato recomendado: PNG o JPG, máximo 5MB</p>
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
  datos.value.organosGobierno = [];
}
if (!datos.value.equipoDirectivo) {
  datos.value.equipoDirectivo = [];
}

const agregarOrgano = () => {
  datos.value.organosGobierno.push({
    nombre: '',
    descripcion: ''
  });
};

const eliminarOrgano = (index) => {
  datos.value.organosGobierno.splice(index, 1);
};

const agregarMiembro = () => {
  datos.value.equipoDirectivo.push({
    nombre: '',
    cargo: ''
  });
};

const eliminarMiembro = (index) => {
  datos.value.equipoDirectivo.splice(index, 1);
};

const handleOrganigramaUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    // Aquí iría la lógica para procesar y guardar el archivo
    console.log('Archivo seleccionado:', file);
  }
};

const esValido = computed(() => {
  return datos.value.organosGobierno.length > 0 && 
         datos.value.equipoDirectivo.length > 0;
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

.organo-item, .miembro-item {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.organo-header, .miembro-header {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.organo-header .form-control,
.miembro-header .form-control {
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

.help-text {
  font-size: 0.875rem;
  color: #666;
  margin-top: 0.25rem;
}

.organigrama-upload {
  border: 2px dashed #ddd;
  padding: 1rem;
  border-radius: 4px;
  text-align: center;
}

.organigrama-upload:hover {
  border-color: #004698;
}
</style> 