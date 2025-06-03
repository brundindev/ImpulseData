<template>
  <div class="form-step">
    <h3>SERVICIOS PARA EL EMPLEO</h3>

    <!-- ORIENTACIÓN E INTERMEDIACIÓN LABORAL -->
    <div class="form-section">
      <h4>ORIENTACIÓN E INTERMEDIACIÓN LABORAL</h4>
      
      <!-- Imagen -->
      <div class="form-group center-image-upload">
        <label>Foto</label>
        <img
          :src="datos.orientacion.imageUrl || '/placeholder-image.png'"
          alt="Imagen de orientación laboral"
          class="image-placeholder clickable-image"
          @click="openCloudinaryModal('orientacion')"
          style="width: 100%; max-height: 250px; object-fit: cover; cursor: pointer; border: 1px dashed #ccc; border-radius: 8px;"
        />
        <p class="image-upload-hint">Haz clic en la imagen para subir o cambiar la foto.</p>
      </div>

      <!-- Campos numéricos -->
      <div class="form-group">
        <label>Demandantes de empleo registrados</label>
        <input 
          type="number" 
          v-model="datos.orientacion.demandantesRegistrados" 
          class="form-control"
          min="0"
          placeholder="Número de demandantes registrados"
        >
      </div>

      <div class="form-group">
        <label>Personas atendidas</label>
        <input 
          type="number" 
          v-model="datos.orientacion.personasAtendidas" 
          class="form-control"
          min="0"
          placeholder="Número de personas atendidas"
        >
      </div>

      <div class="form-group">
        <label>Perceptoras de prestaciones por desempleo</label>
        <input 
          type="number" 
          v-model="datos.orientacion.perceptorasPrestaciones" 
          class="form-control"
          min="0"
          placeholder="Número de perceptoras de prestaciones"
        >
      </div>

      <div class="form-group">
        <label>Pertencientes a colectivos vulnerables</label>
        <input 
          type="number" 
          v-model="datos.orientacion.colectivosVulnerables" 
          class="form-control"
          min="0"
          placeholder="Número de personas de colectivos vulnerables"
        >
      </div>

      <div class="form-group">
        <label>Ofertas de empleo</label>
        <input 
          type="number" 
          v-model="datos.orientacion.ofertasEmpleo" 
          class="form-control"
          min="0"
          placeholder="Número de ofertas de empleo"
        >
      </div>

      <div class="form-group">
        <label>Inscripciones y derivaciones a ofertas</label>
        <input 
          type="number" 
          v-model="datos.orientacion.inscripcionesDerivaciones" 
          class="form-control"
          min="0"
          placeholder="Número de inscripciones y derivaciones"
        >
      </div>

      <!-- Perfil de demandantes -->
      <div class="form-group">
        <h5>PERFIL DEMANDANTES ESTE AÑO</h5>
        <div class="form-group">
          <label>Perfil de demandante promedio</label>
          <textarea
            v-model="datos.orientacion.perfilDemandante"
            class="form-control"
            rows="3"
            placeholder="Describa el perfil promedio de los demandantes"
          ></textarea>
        </div>

        <div class="form-group">
          <label>Total de nuevos demandantes</label>
          <input 
            type="number" 
            v-model="datos.orientacion.nuevosDemandantes" 
            class="form-control"
            min="0"
            placeholder="Número total de nuevos demandantes"
          >
        </div>
      </div>
    </div>

    <!-- ASESORAMIENTO EMPRESARIAL Y AL AUTOEMPLEO -->
    <div class="form-section">
      <h4>ASESORAMIENTO EMPRESARIAL Y AL AUTOEMPLEO</h4>
      
      <div class="form-group">
        <label>Sesiones de asesoramiento</label>
        <input 
          type="number" 
          v-model="datos.asesoramiento.personasAtendidas" 
          class="form-control"
          min="0"
          placeholder="Número de sesiones de asesoramiento"
        >
      </div>

      <div class="form-group">
        <label>Nuevas empresas y altas de autónomos</label>
        <input 
          type="number" 
          v-model="datos.asesoramiento.empresasCreadas" 
          class="form-control"
          min="0"
          placeholder="Número de nuevas empresas y altas de autónomos"
        >
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

const emit = defineEmits(['update:modelValue', 'siguiente', 'anterior']);

const datos = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// Estado del modal de imágenes
const showImageModal = ref(false);
const modalTitle = ref('Seleccionar imagen');
const currentImageSection = ref(null);

// Inicializar datos si no existen
if (!datos.value.orientacion) {
  datos.value.orientacion = {
    imageUrl: '',
    demandantesRegistrados: 0,
    personasAtendidas: 0,
    perceptorasPrestaciones: 0,
    colectivosVulnerables: 0,
    ofertasEmpleo: 0,
    inscripcionesDerivaciones: 0,
    perfilDemandante: '',
    nuevosDemandantes: 0
  };
}

if (!datos.value.asesoramiento) {
  datos.value.asesoramiento = {
    personasAtendidas: 0,
    empresasCreadas: 0
  };
}

// Método para abrir el modal de imágenes
const openCloudinaryModal = (section) => {
  currentImageSection.value = section;
  modalTitle.value = `Seleccionar imagen para ${section === 'orientacion' ? 'orientación laboral' : 'asesoramiento'}`;
  showImageModal.value = true;
};

// Método para cerrar el modal
const closeImageModal = () => {
  showImageModal.value = false;
  currentImageSection.value = null;
};

// Método para manejar la selección de una imagen
const handleImageSelect = (selectedImage) => {
  if (currentImageSection.value === 'orientacion') {
    datos.value.orientacion.imageUrl = selectedImage.url;
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
  // Validar que todos los campos numéricos sean >= 0
  const orientacionValido = 
    datos.value.orientacion.demandantesRegistrados >= 0 &&
    datos.value.orientacion.personasAtendidas >= 0 &&
    datos.value.orientacion.perceptorasPrestaciones >= 0 &&
    datos.value.orientacion.colectivosVulnerables >= 0 &&
    datos.value.orientacion.ofertasEmpleo >= 0 &&
    datos.value.orientacion.inscripcionesDerivaciones >= 0 &&
    datos.value.orientacion.nuevosDemandantes >= 0;

  const asesoramientoValido = 
    datos.value.asesoramiento.personasAtendidas >= 0 &&
    datos.value.asesoramiento.empresasCreadas >= 0;

  return orientacionValido && asesoramientoValido;
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

.form-section h4 {
  margin-top: 0;
  color: #004698;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
}

.form-section h5 {
  color: #004698;
  margin: 1.5rem 0 1rem;
  font-size: 1.1rem;
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
</style> 