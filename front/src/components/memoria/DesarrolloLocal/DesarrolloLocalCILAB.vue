<template>
  <div class="form-step cilab-form">
    <h3 class="cilab-header-title">PROYECTO CILAB ALICANTE FASE II</h3>
    
    <!-- Campos principales/resumen -->
    <div class="cilab-summary-section">
      <div class="cilab-summary-item">
        <h4>Subvención ejecutada</h4>
        <div class="form-group">
          <input 
            type="number" 
            v-model.number="datos.subvencionEjecutada"
            class="form-control cilab-summary-input"
            min="0"
            step="0.01"
            placeholder="Importe en euros"
          >
          <span class="cilab-currency">€</span>
        </div>
      </div>
      
      <div class="cilab-summary-item">
        <h4>Personas contratadas</h4>
        <div class="form-group">
          <input 
            type="number" 
            v-model.number="datos.personasContratadas"
            class="form-control cilab-summary-input"
            min="0"
            placeholder="Número de personas"
          >
        </div>
      </div>
    </div>

    <!-- Descripción del proyecto -->
    <div class="form-group">
      <label>Descripción del Proyecto</label>
      <textarea 
        v-model="datos.descripcionProyecto"
        class="form-control"
        rows="6"
        placeholder="Breve descripción del proyecto CILAB"
      ></textarea>
    </div>

    <!-- Sección de Resultados -->
    <div class="form-section">
      <h4>Resultados</h4>

      <div class="form-group">
        <label>Reto medioambiental:</label>
        <textarea 
          v-model="datos.resultados.retoMedioambiental"
          class="form-control"
          rows="3"
          placeholder="Descripción del reto medioambiental"
        ></textarea>
      </div>

      <div class="form-group">
        <label>Reto social:</label>
        <textarea 
          v-model="datos.resultados.retoSocial"
          class="form-control"
          rows="3"
          placeholder="Descripción del reto social"
        ></textarea>
      </div>

       <!-- Imagen de resultados -->
      <div class="form-group center-image-upload">
        <label>Imagen de Resultados</label>
         <div
            class="image-preview"
            @click="openCloudinaryModal()"
          >
            <img
              v-if="datos.resultados.imageUrl"
              :src="datos.resultados.imageUrl"
              alt="Imagen de resultados CILAB"
            >
            <div v-else class="image-preview-placeholder">
              <i class="fas fa-image"></i>
              <p>Haz clic para seleccionar una imagen</p>
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
      <!-- Este es el último paso de esta sección, por lo tanto, el botón debe guardar -->
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

const emit = defineEmits(['update:modelValue', 'anterior', 'siguiente']);

const datos = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// Estado del modal de imágenes
const showImageModal = ref(false);
const modalTitle = ref('Seleccionar imagen de resultados');

// Inicializar datos si no existen
if (!datos.value.subvencionEjecutada) datos.value.subvencionEjecutada = 0;
if (!datos.value.personasContratadas) datos.value.personasContratadas = 0;
if (!datos.value.descripcionProyecto) datos.value.descripcionProyecto = '';

if (!datos.value.resultados) {
  datos.value.resultados = {
    retoMedioambiental: '',
    retoSocial: '',
    imageUrl: null,
  };
}

// Métodos para el modal de imágenes
const openCloudinaryModal = () => {
  modalTitle.value = 'Seleccionar imagen de resultados';
  showImageModal.value = true;
};

const closeImageModal = () => {
  showImageModal.value = false;
};

const handleImageSelect = (selectedImage) => {
  datos.value.resultados.imageUrl = selectedImage.url;
  closeImageModal();
};

const handleImageUpload = async () => {
  // Lógica de subida de imágenes si es necesario implementarla aquí
  // Por ahora, solo cerramos el modal
   closeImageModal();
};

// Validación del formulario
const esValido = computed(() => {
  return (
    datos.value.subvencionEjecutada >= 0 &&
    datos.value.personasContratadas >= 0 &&
    datos.value.descripcionProyecto !== '' &&
    datos.value.resultados.retoMedioambiental !== '' &&
    datos.value.resultados.retoSocial !== ''
    // imageUrl no es estrictamente obligatorio según la imagen, no se valida aquí
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
.cilab-form h3.cilab-header-title {
    color: #8a2146; /* Color similar al de la imagen */
    border-bottom: 3px solid #8a2146; /* Línea debajo del título */
    padding-bottom: 10px;
    margin-bottom: 20px;
    display: inline-block; /* Para que la línea solo abarque el texto */
}

.cilab-summary-section {
    display: flex;
    background-color: #8a2146; /* Fondo color granate */
    color: white;
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 2rem;
    gap: 2rem; /* Espacio entre los ítems de resumen */
    flex-wrap: wrap; /* Permitir que se envuelvan en pantallas pequeñas */
}

.cilab-summary-item {
    flex: 1; /* Cada ítem ocupa espacio equitativo */
    min-width: 200px; /* Ancho mínimo para evitar que se aplasten demasiado */
}

.cilab-summary-item h4 {
    margin-top: 0;
    color: white; /* Texto blanco */
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
}

.cilab-summary-item .form-group {
    margin-bottom: 0;
}

.cilab-summary-input {
    background-color: rgba(255, 255, 255, 0.2); /* Fondo ligeramente transparente */
    border: 1px solid rgba(255, 255, 255, 0.3); /* Borde transparente */
    color: white; /* Texto blanco */
    font-size: 1.5rem; /* Tamaño de fuente más grande */
    font-weight: bold;
    padding-right: 2.5rem; /* Espacio para el símbolo de euro */
    text-align: center; /* Centrar texto/número */
}

.cilab-summary-input::placeholder {
    color: rgba(255, 255, 255, 0.7); /* Placeholder más claro */
}

.cilab-currency {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: white;
    font-size: 1.5rem;
    font-weight: bold;
}

.form-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8f9fa; /* Fondo ligero */
  border-left: 5px solid #004698; /* Borde azul */
  border-radius: 8px;
}

.form-section h4 {
  margin-top: 0;
  color: #004698; /* Título azul */
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
}

/* Estilos de imagen y placeholder (reutilizados y adaptados) */
.center-image-upload {
  text-align: center;
  margin-top: 1.5rem; /* Espacio arriba de la imagen */
  margin-bottom: 0.5rem; /* Reducir margen abajo */
}

.image-preview {
  width: 100%;
  height: 250px; /* Altura ajustada similar a la imagen */
  border: 1px dashed #ccc;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  background-color: #e9ecef; /* Fondo ligeramente más oscuro para placeholder */
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
  font-size: 3rem; /* Ícono más grande */
  margin-bottom: 0.5rem;
  display: block;
}

/* Ajustes responsivos */
@media (max-width: 768px) {
  .cilab-summary-section {
    flex-direction: column; /* Apilar ítems en pantallas pequeñas */
    gap: 1rem; /* Reducir espacio entre ítems */
  }

  .cilab-summary-item {
    min-width: 100%; /* Ancho completo */
  }

  .image-preview {
    height: 200px; /* Ajustar altura en pantallas pequeñas */
  }
}
</style> 