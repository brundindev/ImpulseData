<template>
  <div class="form-step">
    <h3>VIVEROS EMPRESARIALES</h3>

    <div class="form-group">
      <label>Descripción general</label>
      <textarea
        v-model="datos.descripcion"
        class="form-control"
        rows="2"
        placeholder="Ej: La Agencia cuenta con dos viveros que forman parte de la red de Territorios Futura"
      ></textarea>
    </div>

    <div class="viveros-list">
      <div v-for="(vivero, index) in datos.viveros" :key="index" class="vivero-item form-section">
        <div class="vivero-header">
          <h4>Vivero {{ index + 1 }}</h4>
          <button
            @click="eliminarVivero(index)"
            class="btn btn-danger"
            type="button"
            v-if="datos.viveros.length > 1"
          >
            Eliminar Vivero
          </button>
        </div>

        <div class="form-group">
          <label>Nombre del Vivero</label>
          <input
            type="text"
            v-model="vivero.nombre"
            class="form-control"
            placeholder="Ej: ALICANTE EMPRENDE, PRÍNCIPE FELIPE"
          >
        </div>

        <div class="form-group">
          <label>Subtítulo/Descripción (opcional)</label>
          <input
            type="text"
            v-model="vivero.subtitulo"
            class="form-control"
            placeholder="Ej: (Reformado en 2023), (Naves de 250 y 500 m²)"
          >
        </div>

        <!-- Imagen del Vivero (Opcional) -->
        <div class="form-group center-image-upload">
          <label>Foto del Vivero (Opcional)</label>
          <img
            :src="vivero.imageUrl || '/placeholder-image.png'"
            alt="Imagen del vivero"
            class="image-placeholder clickable-image"
            @click="openCloudinaryModal(index)"
            style="width: 100%; max-height: 250px; object-fit: cover; cursor: pointer; border: 1px dashed #ccc; border-radius: 8px;"
          />
          <p class="image-upload-hint">Haz clic en la imagen para subir o cambiar la foto.</p>
          <button
            v-if="vivero.imageUrl"
            @click="removeImage(index)"
            class="btn btn-sm btn-danger mt-2"
            type="button"
          >
            Eliminar Foto
          </button>
        </div>

        <!-- Campos Adicionales del Vivero -->
        <div class="additional-fields">
          <h5>Información Específica</h5>
          <div v-for="(campo, campoIndex) in vivero.camposAdicionales" :key="campoIndex" class="form-group additional-field-item">
            <div class="field-inputs">
              <input
                type="text"
                v-model="campo.nombre"
                class="form-control field-name-input"
                placeholder="Nombre del campo"
              >
              <input
                type="text"
                v-model="campo.valor"
                class="form-control field-value-input"
                placeholder="Valor del campo"
              >
            </div>
            <button
              @click="eliminarCampoAdicional(index, campoIndex)"
              class="btn btn-danger btn-sm"
              type="button"
            >
              Eliminar Campo
            </button>
          </div>
          <button
            @click="agregarCampoAdicional(index)"
            class="btn btn-secondary btn-sm"
            type="button"
          >
            Agregar Campo de Información
          </button>
        </div>

      </div>
    </div>

    <button
      @click="agregarVivero"
      class="btn btn-secondary mt-3"
      type="button"
    >
      Agregar Vivero
    </button>

    <!-- Anexo -->
    <div class="form-group">
      <label>Anexo</label>
      <input
        type="text"
        v-model="datos.anexo"
        class="form-control"
        placeholder="Ej: Anexo 31: Empresas instaladas en los viveros 2023."
      >
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

    <!-- Modal de selección de imágenes -->
    <teleport to="body">
      <ModalImagenesCloudinary
        :is-visible="showImageModal"
        title="Seleccionar imagen del Vivero"
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

const emit = defineEmits(['update:modelValue', 'siguiente', 'anterior']);

const datos = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// Estado del modal de imágenes
const showImageModal = ref(false);
const currentViveroIndex = ref(null);

// Inicializar datos con un array de viveros, con un vivero por defecto si no hay ninguno
if (!datos.value.viveros || !Array.isArray(datos.value.viveros) || datos.value.viveros.length === 0) {
  datos.value.viveros = [{
    nombre: '',
    subtitulo: '',
    imageUrl: '',
    camposAdicionales: []
  }];
}

if (!datos.value.descripcion) datos.value.descripcion = '';
if (!datos.value.anexo) datos.value.anexo = '';

// Método para agregar un nuevo vivero
const agregarVivero = () => {
  datos.value.viveros.push({
    nombre: '',
    subtitulo: '',
    imageUrl: '',
    camposAdicionales: []
  });
};

// Método para eliminar un vivero
const eliminarVivero = (index) => {
  if (datos.value.viveros.length > 1) {
    datos.value.viveros.splice(index, 1);
  }
};

// Métodos para campos adicionales de los viveros
const agregarCampoAdicional = (viveroIndex) => {
  datos.value.viveros[viveroIndex].camposAdicionales.push({
    nombre: '',
    valor: '',
  });
};

const eliminarCampoAdicional = (viveroIndex, campoIndex) => {
  datos.value.viveros[viveroIndex].camposAdicionales.splice(campoIndex, 1);
};

// Método para eliminar la foto de un vivero
const removeImage = (viveroIndex) => {
  datos.value.viveros[viveroIndex].imageUrl = '';
};

// Método para abrir el modal de imágenes
const openCloudinaryModal = (index) => {
  currentViveroIndex.value = index;
  showImageModal.value = true;
};

// Método para cerrar el modal
const closeImageModal = () => {
  showImageModal.value = false;
  currentViveroIndex.value = null;
};

// Método para manejar la selección de una imagen
const handleImageSelect = (selectedImage) => {
  if (currentViveroIndex.value !== null) {
    datos.value.viveros[currentViveroIndex.value].imageUrl = selectedImage.url;
  }
  closeImageModal();
};

// Método para manejar la subida de una nueva imagen
const handleImageUpload = async () => {
  try {
    // Aquí implementaremos la lógica de subida de imágenes
    // Por ahora, cerramos el modal
    closeImageModal();
  } catch (error) {
    console.error('Error al subir la imagen:', error);
  }
};

const esValido = computed(() => {
  return datos.value.viveros.every(vivero => vivero.nombre);
});

// Asegurarse de que haya al menos un vivero al cargar el componente si no hay datos iniciales
if (!datos.value.viveros || !Array.isArray(datos.value.viveros) || datos.value.viveros.length === 0) {
  agregarVivero();
}
</script>

<style scoped>
.form-step {
  max-width: 1000px;
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

/* Estilos para la lista de viveros */
.viveros-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 1.5rem;
}

.vivero-item {
  background: #fff3e0;
  border-left: 5px solid #f0803b;
  padding: 1.5rem;
  border-radius: 8px;
}

.vivero-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #fcd7b0;
  padding-bottom: 0.5rem;
}

.vivero-header h4 {
  color: #f0803b;
  margin: 0;
}

.vivero-subtitle {
  font-size: 0.9rem;
  color: #666;
  margin-top: -1rem;
  margin-bottom: 1.5rem;
}

.vivero-data {
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}

.vivero-data h5 {
  color: #004698;
  margin-bottom: 1rem;
}

.data-item {
  display: flex;
  align-items: center;
  background-color: #f8f9fa;
  padding: 0.8rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.data-item .icon svg {
  width: 20px;
  height: 20px;
  fill: #f0803b;
  margin-right: 0.8rem;
  flex-shrink: 0;
}

.data-item label {
  flex-grow: 1;
  margin-bottom: 0;
  color: #333;
}

.data-item .form-control.data-number {
  width: auto;
  max-width: 100px;
  font-size: 1.2rem;
  font-weight: bold;
  color: #f0803b;
  background: none;
  border: none;
  padding: 0;
  text-align: right;
}

.data-item .form-control.data-number:focus {
   box-shadow: none;
}

.percentage-item .form-control.data-number {
   max-width: 80px;
}

/* Estilos para campos adicionales */
.additional-fields {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
}

.additional-fields h5 {
  color: #004698;
  margin-bottom: 1rem;
}

.additional-field-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.additional-field-item .field-inputs {
  flex-grow: 1;
  display: flex;
  gap: 0.5rem;
}

.additional-field-item .field-name-input {
  flex: 1;
}

.additional-field-item .field-value-input {
  flex: 2;
}

/* Ajustes responsivos */
@media (max-width: 768px) {
  .viveros-list {
    gap: 1.5rem;
  }

  .vivero-item {
     padding: 1rem;
  }

  .vivero-header {
     flex-direction: column;
     align-items: flex-start;
     margin-bottom: 1rem;
  }

  .vivero-header h4 {
     margin-bottom: 0.5rem;
  }

  .vivero-subtitle {
     margin-top: 0;
  }

  .data-item {
     flex-direction: column;
     align-items: flex-start;
  }

  .data-item label,
  .data-item .form-control.data-number {
     width: 100%;
     text-align: left;
     margin-bottom: 0.5rem;
  }

  .data-item .icon svg {
     margin-bottom: 0.5rem;
     margin-right: 0;
  }

  .percentage-item .form-control.data-number {
     max-width: 100%;
  }

  .additional-field-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .additional-field-item .field-inputs {
    flex-direction: column;
    width: 100%;
  }

  .additional-field-item .field-name-input,
  .additional-field-item .field-value-input {
    flex: none;
    width: 100%;
  }

  .additional-field-item .btn-danger.btn-sm {
    margin-top: 0.5rem;
  }
}
</style> 