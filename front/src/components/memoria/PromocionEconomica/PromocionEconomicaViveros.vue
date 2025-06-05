<template>
  <div class="form-step">
    <h3>PROGRAMAS DE FOMENTO DE EMPRENDIMIENTO</h3>

    <div class="programas-list">
      <div v-for="(programa, index) in datos.programas" :key="index" class="programa-item form-section">
        <div class="program-header">
          <h4>Programa {{ index + 1 }}</h4>
          <button
            @click="eliminarPrograma(index)"
            class="btn btn-danger"
            type="button"
            v-if="datos.programas.length > 1"
          >
            Eliminar Programa
          </button>
        </div>

        <div class="form-group">
          <label>Nombre del Programa</label>
          <input
            type="text"
            v-model="programa.nombre"
            class="form-control"
            placeholder="Nombre del programa"
          >
        </div>

        <!-- Imagen del Programa -->
        <div class="form-group center-image-upload">
          <label>Foto del Programa</label>
          <img
            :src="programa.imageUrl || '/placeholder-image.png'"
            alt="Imagen del programa"
            class="image-placeholder clickable-image"
            @click="openCloudinaryModal(index)"
            style="width: 100%; max-height: 250px; object-fit: cover; cursor: pointer; border: 1px dashed #ccc; border-radius: 8px;"
          />
          <p class="image-upload-hint">Haz clic en la imagen para subir o cambiar la foto.</p>
        </div>

        <!-- Campos Adicionales del Programa -->
        <div class="additional-fields">
          <h5>Información Adicional</h5>
          <div v-for="(campo, campoIndex) in programa.campos" :key="campoIndex" class="form-group additional-field-item">
            <div class="field-inputs">
              <input
                type="text"
                v-model="campo.nombre"
                class="form-control field-name-input"
                placeholder="Nombre del campo (Ej: Empleos creados)"
              >
              <input
                type="text"
                v-model="campo.valor"
                class="form-control field-value-input"
                placeholder="Valor del campo (Ej: 50)"
              >
            </div>
            <button
              @click="eliminarCampo(index, campoIndex)"
              class="btn btn-danger btn-sm"
              type="button"
            >
              Eliminar Campo
            </button>
          </div>
          <button
            @click="agregarCampo(index)"
            class="btn btn-secondary btn-sm"
            type="button"
          >
            Agregar Campo Adicional
          </button>
        </div>

      </div>
    </div>

    <button
      @click="agregarPrograma"
      class="btn btn-secondary mt-3"
      type="button"
    >
      Agregar Programa
    </button>

    <div class="form-actions">
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
        title="Seleccionar imagen para el programa"
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

const emit = defineEmits(['update:modelValue', 'siguiente']);

const datos = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// Estado del modal de imágenes
const showImageModal = ref(false);
const currentProgramIndex = ref(null);

// Inicializar datos con un array de programas, con un programa por defecto
if (!datos.value.programas || datos.value.programas.length === 0) {
  datos.value.programas = [{
    nombre: '',
    imageUrl: '',
    campos: []
  }];
}

// Método para agregar un nuevo programa
const agregarPrograma = () => {
  datos.value.programas.push({
    nombre: '',
    imageUrl: '',
    campos: []
  });
};

// Método para eliminar un programa
const eliminarPrograma = (index) => {
  if (datos.value.programas.length > 1) {
    datos.value.programas.splice(index, 1);
  }
};

// Método para agregar un campo adicional a un programa específico
const agregarCampo = (programaIndex) => {
  datos.value.programas[programaIndex].campos.push({
    nombre: '',
    valor: '',
  });
};

// Método para eliminar un campo adicional de un programa específico
const eliminarCampo = (programaIndex, campoIndex) => {
  datos.value.programas[programaIndex].campos.splice(campoIndex, 1);
};

// Método para abrir el modal de imágenes
const openCloudinaryModal = (index) => {
  currentProgramIndex.value = index;
  showImageModal.value = true;
};

// Método para cerrar el modal
const closeImageModal = () => {
  showImageModal.value = false;
  currentProgramIndex.value = null;
};

// Método para manejar la selección de una imagen
const handleImageSelect = (selectedImage) => {
  if (currentProgramIndex.value !== null) {
    datos.value.programas[currentProgramIndex.value].imageUrl = selectedImage.url;
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
  // Validar que cada programa tenga nombre y foto
  return datos.value.programas.every(programa =>
    programa.nombre &&
    programa.imageUrl &&
    // Opcional: validar campos adicionales si es necesario
    programa.campos.every(campo => campo.nombre && campo.valor)
  );
});
</script>

<style scoped>
.form-step {
  max-width: 800px;
  margin: 0 auto;
}

.form-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 5px solid #004698;
}

.program-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.program-header h4 {
  margin: 0;
  color: #004698;
  font-size: 1.2rem;
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
  justify-content: flex-end;
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

.additional-field-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
</style> 