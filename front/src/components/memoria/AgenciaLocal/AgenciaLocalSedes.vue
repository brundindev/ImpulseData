<template>
  <div class="form-step">
    <h3>Dónde Estamos</h3>
    
    <div class="form-group">
      <label>Sedes</label>
      <div class="recursos-humanos">
        <div v-for="(recurso, index) in datos.recursosHumanos" :key="index" class="recurso-item">
          <div class="recurso-header">
            <h4>Sede {{ index + 1 }}</h4>
            <button 
              @click="eliminarSede(index)" 
              class="btn btn-danger"
              type="button"
              v-if="datos.recursosHumanos.length > 1"
            >
              Eliminar
            </button>
          </div>
          
          <div class="form-group">

            <div class="form-group center-image-upload">
              <label>Imagen de la sede</label>
              <img
                :src="recurso.imageUrl || '/placeholder-image.png'"
                :alt="'Imagen de ' + (recurso.nombre || 'Sede')"
                class="image-placeholder clickable-image"
                :data-image-id="'centro-image-' + index"
                @click="openCloudinaryModal('sede', index, recurso.imageUrl)"
                style="width: 100%; max-height: 250px; object-fit: cover; cursor: pointer; border: 1px dashed #ccc; border-radius: 8px;"
              />
              <p class="image-upload-hint">Haz clic en la imagen para subir o cambiar la foto del centro.</p>
            </div>
            <label>Nombre</label>
            <input 
              type="text" 
              v-model="recurso.nombre" 
              class="form-control"
              placeholder="Nombre de la sede"
            >
          </div>
          
          <div class="form-group">
            <label>Dirección</label>
            <input 
              type="text" 
              v-model="recurso.direccion" 
              class="form-control"
              placeholder="Dirección de la sede"
            >
          </div>
        </div>
        
        <button 
          @click="agregarSede" 
          class="btn btn-secondary"
          type="button"
        >
          Agregar Sede
        </button>
      </div>
    </div>

    <div class="form-group">
      <label>Red de territorios</label>
      <div class="recursos-materiales">
        <div v-for="(recurso, index) in datos.recursosMateriales" :key="index" class="recurso-item">
          <div class="recurso-header">
            <h4>Territorio {{ index + 1 }}</h4>
            <button 
              @click="eliminarTerritorio(index)" 
              class="btn btn-danger"
              type="button"
              v-if="datos.recursosMateriales.length > 1"
            >
              Eliminar
            </button>
          </div>
          
          <div class="form-group">
            <label>Imagen del territorio</label>
            <div class="form-group center-image-upload">
              <img
                :src="recurso.imageUrl || '/placeholder-image.png'"
                :alt="'Imagen de ' + (recurso.nombre || 'Territorio')"
                class="image-placeholder clickable-image"
                :data-image-id="'territorio-image-' + index"
                @click="openCloudinaryModal('territorio', index, recurso.imageUrl)"
                style="width: 100%; max-height: 250px; object-fit: cover; cursor: pointer; border: 1px dashed #ccc; border-radius: 8px;"
              />
              <p class="image-upload-hint">Haz clic en la imagen para subir o cambiar la foto del territorio.</p>
            </div>
            <label>Nombre</label>
            <input 
              type="text" 
              v-model="recurso.nombre" 
              class="form-control"
              placeholder="Nombre del territorio"
            >
          </div>
        
          <div class="form-group">
            <label>Dirección</label>
            <input 
              type="text" 
              v-model="recurso.direccion" 
              class="form-control"
              placeholder="Dirección del territorio"
            >
          </div>

        </div>
        
        <button 
          @click="agregarTerritorio" 
          class="btn btn-secondary"
          type="button"
        >
          Agregar Territorio
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
        @click="guardarYFinalizar" 
        class="btn btn-primary"
        :disabled="!esValido"
      >
        Guardar y Finalizar
      </button>
    </div>

    <!-- Modal de selección de imágenes -->
    <teleport to="body">
      <ModalImagenesCloudinary
        :is-visible="showImageModal"
        :title="modalTitle"
        @close="closeImageModal"
        @select="handleImageSelect"
        @upload="handleImageUpload"
      />
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import ModalImagenesCloudinary from '../../ModalImagenesCloudinary.vue';

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update:modelValue', 'siguiente', 'anterior', 'guardar']);

const datos = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// Estado del modal de imágenes
const showImageModal = ref(false);
const modalTitle = ref('Seleccionar imagen');
const currentImageId = ref(null);
const currentIndex = ref(null);
const currentType = ref(null); // 'sede' o 'territorio'

// Inicializar datos si no existen
if (!datos.value.recursosHumanos) {
  datos.value.recursosHumanos = [{
    nombre: '',
    direccion: '',
    imageUrl: ''
  }];
}

if (!datos.value.recursosMateriales) {
  datos.value.recursosMateriales = [{
    nombre: '',
    direccion: '',
    imageUrl: ''
  }];
}

if (!datos.value.recursosFinancieros) {
  datos.value.recursosFinancieros = {
    presupuestoTotal: 0,
    fuentes: [{
      nombre: '',
      importe: 0,
      descripcion: ''
    }]
  };
}

// Método para abrir el modal de imágenes
const openCloudinaryModal = (type, index, currentImageUrl) => {
  currentType.value = type;
  currentIndex.value = index;
  modalTitle.value = `Seleccionar imagen para ${type === 'sede' ? 'Sede' : 'Territorio'} ${index + 1}`;
  showImageModal.value = true;
};

// Método para cerrar el modal
const closeImageModal = () => {
  showImageModal.value = false;
  currentImageId.value = null;
  currentIndex.value = null;
  currentType.value = null;
};

// Método para manejar la selección de una imagen
const handleImageSelect = (selectedImage) => {
  if (currentIndex.value !== null) {
    if (currentType.value === 'sede') {
      datos.value.recursosHumanos[currentIndex.value].imageUrl = selectedImage.url;
    } else {
      datos.value.recursosMateriales[currentIndex.value].imageUrl = selectedImage.url;
    }
  }
  closeImageModal();
};

// Método para manejar la subida de una nueva imagen
const handleImageUpload = async () => {
  try {
    // Aquí implementaremos la lógica de subida de imágenes
    closeImageModal();
  } catch (error) {
    console.error('Error al subir la imagen:', error);
  }
};

const agregarSede = () => {
  datos.value.recursosHumanos.push({
    nombre: '',
    direccion: '',
    imageUrl: ''
  });
};

const eliminarSede = (index) => {
  if (datos.value.recursosHumanos.length > 1) {
    datos.value.recursosHumanos.splice(index, 1);
  }
};

const agregarTerritorio = () => {
  datos.value.recursosMateriales.push({
    nombre: '',
    direccion: '',
    imageUrl: ''
  });
};

const eliminarTerritorio = (index) => {
  if (datos.value.recursosMateriales.length > 1) {
    datos.value.recursosMateriales.splice(index, 1);
  }
};

const agregarFuente = () => {
  datos.value.recursosFinancieros.fuentes.push({
    nombre: '',
    importe: 0,
    descripcion: ''
  });
};

const eliminarFuente = (index) => {
  if (datos.value.recursosFinancieros.fuentes.length > 1) {
    datos.value.recursosFinancieros.fuentes.splice(index, 1);
  }
};

const esValido = computed(() => {
  return datos.value.recursosHumanos.every(sede => 
    sede.nombre && sede.direccion
  ) &&
  datos.value.recursosMateriales.every(territorio => 
    territorio.nombre && territorio.direccion
  );
});

const guardarYFinalizar = () => {
  // Guardar los datos
  emit('guardar', datos.value);
  
  // Si todo está completo, cerrar el formulario
  if (esValido.value) {
    emit('siguiente');
  }
};
</script>

<style scoped>
.form-step {
  max-width: 800px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1.5rem;
}

.recurso-item,
.fuente-item {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.recurso-header,
.fuente-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.recurso-header h4,
.fuente-header h4 {
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

.center-image-upload {
    text-align: center;
    margin-bottom: 1.5rem;
}

.image-placeholder {
    display: block;
    margin: 0.5rem auto 0.8rem auto;
    max-width: 100%;
    height: auto;
}

.image-placeholder[src$="/placeholder-image.png"] {
    background-color: #e9ecef;
    color: #6c757d;
    display: flex;
    align-items: center;
    justify-content: center;
    font-style: italic;
    min-height: 150px;
    object-fit: contain;
}

.image-upload-hint {
    font-size: 0.875rem;
    color: #6c757d;
    margin-top: 0.5rem;
}

.clickable-image {
    cursor: pointer;
    transition: all 0.3s ease;
}

.clickable-image:hover {
    border-color: #004698;
    box-shadow: 0 0 10px rgba(0, 70, 152, 0.2);
    transform: scale(1.02);
}

:deep(.image-selector-overlay) {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    background-color: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(5px);
}

:deep(.image-selector-dialog) {
    position: relative;
    margin: auto;
    max-height: 90vh;
    overflow-y: auto;
    transform: translateY(0);
    animation: modalFadeIn 0.3s ease;
}

@keyframes modalFadeIn {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style> 