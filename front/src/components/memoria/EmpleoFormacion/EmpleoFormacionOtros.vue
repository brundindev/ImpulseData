<template>
  <div class="form-step">
    <h3>OTROS</h3>
    
    <div class="form-group">
      <label>Elementos Adicionales</label>
      <div class="otros-list">
        <div v-for="(item, index) in datos.otros" :key="index" class="otro-item form-section">
          <div class="otro-header">
            <h4>Elemento {{ index + 1 }}</h4>
            <button 
              @click="eliminarOtro(index)" 
              class="btn btn-danger"
              type="button"
              v-if="datos.otros.length > 1"
            >
              Eliminar
            </button>
          </div>
          
          <div class="form-group">
            <label>Título</label>
            <input 
              type="text" 
              v-model="item.titulo" 
              class="form-control"
              placeholder="Título del elemento"
            >
          </div>
          
          <div class="form-group">
            <label>Descripción</label>
            <textarea 
              v-model="item.descripcion" 
              class="form-control"
              rows="3"
              placeholder="Descripción del elemento"
            ></textarea>
          </div>

          <!-- Imagen -->
          <div class="form-group center-image-upload">
            <label>Imagen</label>
             <div
                class="image-preview"
                @click="openCloudinaryModalOtros(index)"
              >
                <img
                  v-if="item.imageUrl"
                  :src="item.imageUrl"
                  alt="Imagen del elemento"
                >
                <div v-else class="image-preview-placeholder">
                  <i class="fas fa-image"></i>
                  <p>Haz clic para seleccionar una imagen</p>
                </div>
              </div>
          </div>
          
        </div>
        
        <button 
          @click="agregarOtro" 
          class="btn btn-secondary"
          type="button"
        >
          Agregar Elemento
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
        @click="$emit('guardar')" 
        class="btn btn-primary"
        :disabled="!esValido"
      >
        Guardar
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

const emit = defineEmits(['update:modelValue', 'guardar', 'anterior']);

const datos = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// Estado del modal de imágenes
const showImageModal = ref(false);
const modalTitle = ref('Seleccionar imagen');
const currentOtroIndex = ref(null);

// Inicializar datos con un array de elementos 'otros'
if (!datos.value.otros || !Array.isArray(datos.value.otros) || datos.value.otros.length === 0) {
  datos.value.otros = [{
    titulo: '',
    descripcion: '',
    imageUrl: null,
  }];
}

// Método para agregar un nuevo elemento 'otro'
const agregarOtro = () => {
  datos.value.otros.push({
    titulo: '',
    descripcion: '',
    imageUrl: null,
  });
};

// Método para eliminar un elemento 'otro'
const eliminarOtro = (index) => {
  if (datos.value.otros.length > 1) {
    datos.value.otros.splice(index, 1);
  }
};

// Métodos para el modal de imágenes
const openCloudinaryModalOtros = (index) => {
  currentOtroIndex.value = index;
  modalTitle.value = 'Seleccionar imagen';
  showImageModal.value = true;
};

const closeImageModal = () => {
  showImageModal.value = false;
  currentOtroIndex.value = null;
};

const handleImageSelect = (selectedImage) => {
  if (currentOtroIndex.value !== null) {
    datos.value.otros[currentOtroIndex.value].imageUrl = selectedImage.url;
  }
  closeImageModal();
};

const handleImageUpload = async () => {
  // Lógica de subida de imágenes si es necesario implementarla aquí
  // Por ahora, solo cerramos el modal
  closeImageModal();
};

// Validación del formulario
const esValido = computed(() => {
  return datos.value.otros.every(item => 
    item.titulo && item.descripcion
    // imageUrl no es estrictamente obligatorio según la solicitud, no se valida aquí
  );
});
</script>

<style scoped>
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

/* Reutilizar algunos estilos existentes y añadir específicos */
.form-section {
  margin-bottom: 1.5rem; /* Ajustar margen para ítems individuales */
  padding: 1.5rem; /* Mantener padding */
  background: #f8f9fa; /* Mantener color de fondo */
  border-left: 5px solid #004698; /* Mantener borde */
  border-radius: 8px; /* Mantener radio */
}

.otros-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem; /* Espacio entre ítems */
    margin-top: 1rem;
}

.otro-item {
   background: #fff3e0; /* Color similar al de programas/convenios */
   border-left-color: #f0803b; /* Color de borde similar */
}

.otro-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem; /* Reducir margen */
  border-bottom: 1px solid #fcd7b0; /* Color de borde similar */
  padding-bottom: 0.5rem;
}

.otro-header h4 {
  margin: 0;
  color: #f0803b; /* Color de título similar */
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

.text-muted {
  color: #6c757d;
  font-size: 0.875rem;
  margin-top: 0.25rem;
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

/* Estilos de imagen y placeholder (reutilizados) */
.center-image-upload {
  text-align: center;
  margin-bottom: 1.5rem;
}

.image-preview {
  width: 100%;
  height: 150px;
  border: 1px dashed #ccc;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  background-color: #f8f9fa;
  transition: all 0.3s ease;
}

.image-preview:hover {
  border-color: #004698;
  box-shadow: 0 0 10px rgba(0, 70, 152, 0.2);
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-preview-placeholder {
  color: #6c757d;
  font-style: italic;
  text-align: center;
  padding: 1rem;
}

.image-preview-placeholder i {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  display: block;
}

/* Ajustes responsivos si son necesarios */
@media (max-width: 768px) {
  .form-section {
     padding: 1rem;
  }
  .otro-header {
     flex-direction: column;
     align-items: flex-start;
     margin-bottom: 1rem;
  }
  .otro-header h4 {
     margin-bottom: 0.5rem;
  }
}

</style> 