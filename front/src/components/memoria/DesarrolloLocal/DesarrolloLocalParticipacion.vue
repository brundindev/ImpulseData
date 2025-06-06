<template>
  <div class="form-step eventos-form">
    <h3 class="eventos-header-title">JORNADAS, FERIAS Y CONGRESOS</h3>

    <div class="form-group">
      <label>Listado de Eventos</label>
      <div class="eventos-list">
        <div v-for="(evento, index) in datos.eventos" :key="index" class="evento-item form-section">
          <div class="evento-header">
            <h4>Evento {{ index + 1 }}</h4>
            <button
              @click="eliminarEvento(index)"
              class="btn btn-danger"
              type="button"
              v-if="datos.eventos.length > 1"
            >
              Eliminar
            </button>
          </div>

          <div class="form-group">
            <label>Título del Evento</label>
            <input
              type="text"
              v-model="evento.titulo"
              class="form-control"
              placeholder="Título del evento"
            >
          </div>

          <div class="form-group">
            <label>Descripción</label>
            <textarea
              v-model="evento.descripcion"
              class="form-control"
              rows="3"
              placeholder="Descripción del evento"
            ></textarea>
          </div>

          <!-- Imagen del Evento -->
          <div class="form-group center-image-upload">
            <label>Imagen del Evento</label>
             <div
                class="image-preview"
                @click="openCloudinaryModalEvento(index)"
              >
                <img
                  v-if="evento.imageUrl"
                  :src="evento.imageUrl"
                  alt="Imagen del evento"
                >
                <div v-else class="image-preview-placeholder">
                  <i class="fas fa-image"></i>
                  <p>Haz clic para seleccionar una imagen</p>
                </div>
              </div>
          </div>

          <!-- Campos Adicionales para el Evento -->
          <div class="additional-fields">
            <h5>Campos Adicionales</h5>
            <div v-for="(campo, campoIndex) in evento.camposAdicionales" :key="campoIndex" class="form-group additional-field-item">
              <div class="field-inputs">
                <input
                  type="text"
                  v-model="campo.nombre"
                  class="form-control field-name-input" maxlength="50"
                  placeholder="Nombre del campo"
                >
                 <select v-model="campo.tipo" class="form-control field-type-select">
                  <option value="text">Texto Corto</option>
                  <option value="textarea">Texto Largo</option>
                  <option value="number">Numérico</option>
                  <option value="image">Imagen</option>
                 </select>
                <input
                  v-if="campo.tipo === 'text'"
                  type="text"
                  v-model="campo.valor"
                  class="form-control field-value-input"
                  placeholder="Valor del campo"
                >
                <textarea
                  v-else-if="campo.tipo === 'textarea'"
                  v-model="campo.valor"
                  class="form-control field-value-input" rows="2"
                  placeholder="Valor del campo"
                ></textarea>
                <input
                  v-else-if="campo.tipo === 'number'"
                  type="number"
                  v-model.number="campo.valor"
                  class="form-control field-value-input"
                  placeholder="0"
                  min="0"
                >
                <div
                  v-else-if="campo.tipo === 'image'"
                  class="image-preview-small"
                  @click="openCloudinaryModalCampoAdicional(index, campoIndex)"
                >
                  <img
                    v-if="campo.valor"
                    :src="campo.valor"
                    alt="Vista previa del campo de imagen"
                  >
                  <div v-else class="image-preview-placeholder-small">
                    <i class="fas fa-image"></i>
                    <p>Seleccionar imagen</p>
                  </div>
                </div>
              </div>
              <button
                @click="eliminarCampoAdicionalEvento(index, campoIndex)"
                class="btn btn-danger btn-sm"
                type="button"
              >
                Eliminar Campo
              </button>
            </div>
            <button
              @click="agregarCampoAdicionalEvento(index)"
              class="btn btn-secondary btn-sm"
              type="button"
            >
              Agregar Campo Adicional
            </button>
          </div>

        </div>

        <button
          @click="agregarEvento"
          class="btn btn-secondary"
          type="button"
        >
          Agregar Evento
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
      <!-- Este es el último paso, el botón debe guardar -->
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

// Emitimos 'guardar' en el último paso
const emit = defineEmits(['update:modelValue', 'guardar', 'anterior']);

const datos = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// Estado del modal de imágenes
const showImageModal = ref(false);
const modalTitle = ref('Seleccionar imagen del evento');
const currentEventoIndex = ref(null);
const currentCampoAdicionalIndex = ref(null);

// Inicializar datos con un array de eventos
if (!datos.value.eventos || !Array.isArray(datos.value.eventos) || datos.value.eventos.length === 0) {
  datos.value.eventos = [{
    titulo: '',
    descripcion: '',
    imageUrl: null,
    camposAdicionales: []
  }];
}

// Método para agregar un nuevo evento
const agregarEvento = () => {
  datos.value.eventos.push({
    titulo: '',
    descripcion: '',
    imageUrl: null,
    camposAdicionales: []
  });
};

// Método para eliminar un evento
const eliminarEvento = (index) => {
  if (datos.value.eventos.length > 1) {
    datos.value.eventos.splice(index, 1);
  }
};

// Métodos para el modal de imágenes
const openCloudinaryModalEvento = (index) => {
  currentEventoIndex.value = index;
  currentCampoAdicionalIndex.value = null;
  modalTitle.value = 'Seleccionar imagen del evento';
  showImageModal.value = true;
};

const closeImageModal = () => {
  showImageModal.value = false;
  currentEventoIndex.value = null;
  currentCampoAdicionalIndex.value = null;
};

const handleImageSelect = (selectedImage) => {
  if (currentEventoIndex.value !== null) {
    if (currentCampoAdicionalIndex.value !== null) {
      // Es un campo adicional de imagen
      datos.value.eventos[currentEventoIndex.value].camposAdicionales[currentCampoAdicionalIndex.value].valor = selectedImage.url;
    } else {
      // Es la imagen principal del evento
      datos.value.eventos[currentEventoIndex.value].imageUrl = selectedImage.url;
    }
  }
  closeImageModal();
};

const handleImageUpload = async () => {
  // Lógica de subida de imágenes si es necesario implementarla aquí
  // Por ahora, solo cerramos el modal
   closeImageModal();
};

// Métodos para campos adicionales de los eventos
const agregarCampoAdicionalEvento = (eventoIndex) => {
  datos.value.eventos[eventoIndex].camposAdicionales.push({
    nombre: '',
    tipo: 'text', // Tipo de campo por defecto
    valor: '',
  });
};

const eliminarCampoAdicionalEvento = (eventoIndex, campoIndex) => {
  datos.value.eventos[eventoIndex].camposAdicionales.splice(campoIndex, 1);
};

// Nuevo estado y métodos para el modal de imágenes de campos adicionales
const openCloudinaryModalCampoAdicional = (eventoIndex, campoIndex) => {
  currentEventoIndex.value = eventoIndex;
  currentCampoAdicionalIndex.value = campoIndex; // Guardar índice del campo adicional
  modalTitle.value = 'Seleccionar imagen para campo adicional';
  showImageModal.value = true;
};

// Validación del formulario
const esValido = computed(() => {
  return datos.value.eventos.every(evento =>
    evento.titulo &&
    evento.descripcion &&
    // imageUrl no es estrictamente obligatorio
    evento.camposAdicionales.every(campo =>
      campo.nombre && // El nombre del campo adicional es obligatorio
      (campo.tipo === 'number' ? !isNaN(parseFloat(campo.valor)) && isFinite(campo.valor) && campo.valor >= 0 : 
       campo.tipo === 'image' ? campo.valor !== '' : 
       campo.valor !== '') // Validar valor según tipo
    )
  );
});
</script>

<style scoped>
/* Reutilizar estilos generales del form-step */
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

/* Estilos específicos para este formulario */
.eventos-form h3.eventos-header-title {
    color: #dc3545; /* Color similar al de la imagen */
    border-bottom: 3px solid #dc3545; /* Línea debajo del título */
    padding-bottom: 10px;
    margin-bottom: 20px;
    display: inline-block; /* Para que la línea solo abarque el texto */
}

.eventos-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem; /* Espacio entre ítems */
    margin-top: 1rem;
}

.evento-item {
   background: #f8f9fa; /* Fondo ligero */
   border-left: 5px solid #dc3545; /* Borde color granate */
   padding: 1.5rem;
   border-radius: 8px;
}

.evento-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
}

.evento-header h4 {
  margin: 0;
  color: #dc3545; /* Título color granate */
  font-size: 1.2rem;
}

/* Estilos de imagen y placeholder (reutilizados) */
.center-image-upload {
  text-align: center;
  margin-bottom: 1.5rem;
}

.image-preview {
  width: 100%;
  height: 180px; /* Ajustar altura similar a la imagen */
  border: 1px dashed #ccc;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  background-color: #e9ecef; /* Fondo placeholder */
  transition: all 0.3s ease;
}

.image-preview:hover {
  border-color: #004698;
  box-shadow: 0 0 10px rgba(0, 70, 152, 0.2); /* Usar sombra azul para hover */
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

/* Ajustes responsivos */
@media (max-width: 768px) {
  .evento-item {
     padding: 1rem;
  }
  .evento-header {
     flex-direction: column;
     align-items: flex-start;
     margin-bottom: 1rem;
  }
  .evento-header h4 {
     margin-bottom: 0.5rem;
  }
  .image-preview {
    height: 150px; /* Ajustar altura en pantallas pequeñas */
  }
}

/* Estilos de campos adicionales (reutilizados de EmpleoFormacionSubvenciones.vue) */
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
  background-color: #f8f9fa; /* Fondo ligero para cada campo adicional */
  padding: 0.8rem;
  border-radius: 4px;
}

.additional-field-item .field-inputs {
  flex-grow: 1;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap; /* Permitir que los inputs se envuelvan en pantallas pequeñas */
}

.additional-field-item .field-name-input {
  flex: 1; /* Nombre del campo ocupa espacio */
  min-width: 120px; /* Ancho mínimo para el nombre */
}

.additional-field-item .field-type-select {
    flex: 0 0 auto; /* El select no crece ni se encoge */
    width: 120px; /* Ancho fijo para el select */
}

.additional-field-item .field-value-input {
  flex: 2; /* El valor del campo ocupa más espacio */
  min-width: 150px; /* Ancho mínimo para el valor */
}

/* Estilos para la vista previa de imagen pequeña en campos adicionales */
.image-preview-small {
  width: 100%;
  height: 80px; /* Altura más pequeña */
  border: 1px dashed #ccc;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  background-color: #e9ecef;
  transition: all 0.3s ease;
  flex: 2; /* Ocupa el mismo espacio que el input de valor */
  min-width: 150px; /* Ancho mínimo */
}

.image-preview-small:hover {
  border-color: #004698;
  box-shadow: 0 0 10px rgba(0, 70, 152, 0.2);
}

.image-preview-small img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-preview-placeholder-small {
  color: #6c757d;
  font-style: italic;
  text-align: center;
  font-size: 0.8rem; /* Texto más pequeño */
}

.image-preview-placeholder-small i {
  font-size: 1.5rem; /* Ícono más pequeño */
  margin-bottom: 0.2rem;
  display: block;
}

/* Ajustes responsivos para campos adicionales */
@media (max-width: 768px) {
  .additional-field-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .additional-field-item .field-inputs {
    flex-direction: column; /* Apilar inputs en pantallas pequeñas */
    width: 100%;
    gap: 0.8rem; /* Aumentar espacio entre inputs apilados */
  }

  .additional-field-item .field-name-input,
  .additional-field-item .field-type-select,
  .additional-field-item .field-value-input,
  .image-preview-small {
    flex: none; /* Desactivar flex-grow */
    width: 100%; /* Ancho completo */
    min-width: 0; /* Eliminar ancho mínimo */
  }

  .additional-field-item .btn-danger.btn-sm {
    margin-top: 0.5rem;
  }
}

</style> 