<template>
  <div class="form-step">
    <h3>Eventos de Emprendimiento</h3>

    <div class="eventos-list">
      <div v-for="(evento, index) in datos.eventos" :key="index" class="evento-item form-section">
        <div class="evento-header">
          <h4>Evento {{ index + 1 }}</h4>
          <button
            @click="eliminarEvento(index)"
            class="btn btn-danger btn-sm"
            type="button"
            v-if="datos.eventos.length > 1"
          >
            Eliminar Evento
          </button>
        </div>

        <div class="form-group">
          <label>Nombre del Evento</label>
          <input
            type="text"
            v-model="evento.nombre"
            class="form-control"
            placeholder="Nombre del evento"
          >
        </div>

        <div class="form-group">
          <label>Descripción</label>
          <textarea
            v-model="evento.descripcion"
            class="form-control"
            rows="2"
            placeholder="Descripción del evento"
          ></textarea>
        </div>

        <!-- Imagen del Evento (Opcional) -->
        <div class="form-group center-image-upload">
          <label>Foto del Evento (Opcional)</label>
           <img
            :src="evento.imageUrl || '/placeholder-image.png'"
            alt="Imagen del evento"
            class="image-placeholder clickable-image"
            @click="openCloudinaryModal(index)"
            style="width: 100%; max-height: 200px; object-fit: cover; cursor: pointer; border: 1px dashed #ccc; border-radius: 8px;"
          />
          <p class="image-upload-hint">Haz clic en la imagen para subir o cambiar la foto.</p>
           <button
            v-if="evento.imageUrl"
            @click="removeImage(index)"
            class="btn btn-sm btn-danger mt-2"
            type="button"
          >
            Eliminar Foto
          </button>
        </div>

      </div>
    </div>

    <button
      @click="agregarEvento"
      class="btn btn-secondary mt-3"
      type="button"
    >
      Agregar Evento
    </button>

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
        title="Seleccionar imagen del Evento"
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
const currentEventoIndex = ref(null);

// Inicializar datos con un array de eventos, con un evento por defecto si no hay ninguno
if (!datos.value.eventos || !Array.isArray(datos.value.eventos) || datos.value.eventos.length === 0) {
  datos.value.eventos = [{
    nombre: '',
    descripcion: '',
    imageUrl: '',
  }];
}

// Método para agregar un nuevo evento
const agregarEvento = () => {
  datos.value.eventos.push({
    nombre: '',
    descripcion: '',
    imageUrl: '',
  });
};

// Método para eliminar un evento
const eliminarEvento = (index) => {
  if (datos.value.eventos.length > 1) {
    datos.value.eventos.splice(index, 1);
  }
};

// Método para eliminar la foto de un evento
const removeImage = (eventoIndex) => {
  datos.value.eventos[eventoIndex].imageUrl = '';
};

// Método para abrir el modal de imágenes
const openCloudinaryModal = (index) => {
  currentEventoIndex.value = index;
  showImageModal.value = true;
};

// Método para cerrar el modal
const closeImageModal = () => {
  showImageModal.value = false;
  currentEventoIndex.value = null;
};

// Método para manejar la selección de una imagen
const handleImageSelect = (selectedImage) => {
  if (currentEventoIndex.value !== null) {
    datos.value.eventos[currentEventoIndex.value].imageUrl = selectedImage.url;
  }
  closeImageModal();
};

// Método para manejar la subida de una nueva imagen
const handleImageUpload = async () => {
  try {
    // Aquí implementar la lógica de subida de imágenes
    console.log('Lógica de subida de imagen pendiente');
    // Una vez subida, obtener la URL y asignarla a datos.value.eventos[currentEventoIndex.value].imageUrl
    // Ejemplo: datos.value.eventos[currentEventoIndex.value].imageUrl = 'nueva_url_de_imagen';
    closeImageModal();
  } catch (error) {
    console.error('Error al subir la imagen:', error);
  }
};

const esValido = computed(() => {
  return datos.value.eventos.every(evento => evento.nombre && evento.descripcion);
});

// Asegurarse de que haya al menos un evento al cargar el componente si no hay datos iniciales
if (!datos.value.eventos || !Array.isArray(datos.value.eventos) || datos.value.eventos.length === 0) {
  agregarEvento();
}
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

.eventos-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1rem;
}

.evento-item {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
}

.evento-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.evento-header h4 {
  margin: 0;
  color: #004698;
  font-size: 1.1rem;
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
  min-height: 100px;
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

@media (max-width: 768px) {
  .evento-header {
     flex-direction: column;
     align-items: flex-start;
  }

  .evento-header h4 {
     margin-bottom: 0.5rem;
  }
}
</style>
