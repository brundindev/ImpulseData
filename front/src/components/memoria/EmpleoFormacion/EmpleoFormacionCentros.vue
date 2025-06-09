<template>
  <div class="form-step">
    <h3>Nuestros Centros</h3>

    <!-- Pestañas -->
    <div class="tabs-container">
      <button
        @click="activeTab = 'edit'"
        :class="['tab-button', { active: activeTab === 'edit' }]"
        type="button"
      >
        Editar
      </button>
      <button
        @click="activeTab = 'preview'"
        :class="['tab-button', { active: activeTab === 'preview' }]"
        type="button"
      >
        Vista Previa
      </button>
    </div>

    <!-- Contenido de Edición -->
    <div v-show="activeTab === 'edit'" class="tab-content">
      <!-- Descripción General -->
      <div class="form-section">
        <h4>Descripción General del Departamento</h4>
        <div class="form-group">
          <label for="descripcionGeneral">Descripción</label>
          <textarea
            id="descripcionGeneral"
            v-model="datos.descripcionGeneral"
            class="form-control"
            rows="4"
            placeholder="Breve descripción del departamento de empleo y formación y sus centros."
          ></textarea>
        </div>
      </div>

      <!-- Lista de Centros -->
      <div class="centros-list">
        <div v-for="(centro, centroIndex) in datos.centros" :key="centroIndex" class="centro-item form-section">
          <div class="centro-header">
            <h4>Centro {{ centroIndex + 1 }}: {{ centro.nombre || 'Nuevo Centro' }}</h4>
            <button
              @click="eliminarCentro(centroIndex)"
              class="btn btn-danger btn-sm"
              type="button"
              v-if="datos.centros.length > 1"
            >
              Eliminar Centro
            </button>
          </div>

          <!-- Imagen del Centro -->
          <div class="form-group center-image-upload">
              <label>Imagen del Centro</label>
              <img
                  :src="centro.imageUrl || '/placeholder-image.png'"
                  :alt="'Imagen de ' + (centro.nombre || 'Centro')"
                  class="image-placeholder clickable-image"
                  :data-image-id="'centro-image-' + centroIndex"
                  @click="openCloudinaryModal('centro-image-' + centroIndex, centro.imageUrl)"
                  style="width: 100%; max-height: 250px; object-fit: cover; cursor: pointer; border: 1px dashed #ccc; border-radius: 8px;"
              />
              <p class="image-upload-hint">Haz clic en la imagen para subir o cambiar la foto del centro.</p>
          </div>

          <div class="form-group">
            <label :for="'nombreCentro-' + centroIndex">Nombre del Centro</label>
            <input
              type="text"
              :id="'nombreCentro-' + centroIndex"
              v-model="centro.nombre"
              class="form-control"
              placeholder="Ej: Sede Central 'Puerta Ferrisa'"
            >
          </div>

          <!-- Servicios del Centro -->
          <div class="form-group">
            <label>Servicios</label>
            <div v-for="(servicio, servicioIndex) in centro.servicios" :key="servicioIndex" class="input-group mb-2">
              <input
                type="text"
                v-model="centro.servicios[servicioIndex]"
                class="form-control"
                placeholder="Ej: Orientación laboral"
              >
              <button
                @click="eliminarServicio(centroIndex, servicioIndex)"
                class="btn btn-outline-danger btn-sm"
                type="button"
                v-if="centro.servicios.length > 1"
              >
                -
              </button>
            </div>
            <button
              @click="agregarServicio(centroIndex)"
              class="btn btn-outline-secondary btn-sm"
              type="button"
            >
              + Agregar Servicio
            </button>
          </div>

          <!-- Indicadores Numéricos del Centro -->
          <div class="form-group">
            <label>Indicadores Numéricos</label>
            <div v-for="(indicador, indicadorIndex) in centro.indicadores" :key="indicadorIndex" class="indicator-group mb-2">
              <input
                type="text"
                v-model="indicador.label"
                class="form-control indicator-label"
                placeholder="Etiqueta (Ej: Personas atendidas)"
              >
              <input
                type="number"
                v-model.number="indicador.value"
                class="form-control indicator-value"
                min="0"
                placeholder="Valor numérico"
              >
              <button
                @click="eliminarIndicador(centroIndex, indicadorIndex)"
                class="btn btn-outline-danger btn-sm"
                type="button"
                v-if="centro.indicadores.length > 1"
              >
                -
              </button>
            </div>
            <button
              @click="agregarIndicador(centroIndex)"
              class="btn btn-outline-secondary btn-sm"
              type="button"
            >
              + Agregar Indicador
            </button>
          </div>
        </div>
      </div>

      <!-- Botón para añadir Centro -->
      <button
        @click="agregarCentro"
        class="btn btn-secondary mt-3"
        type="button"
      >
        Agregar Otro Centro
      </button>
    </div>

    <!-- Contenido de Vista Previa -->
    <div v-show="activeTab === 'preview'" class="tab-content">
      <div class="preview-section">
        <div class="preview-header">
          <div class="preview-number">2.2</div>
          <div class="preview-title">NUESTROS CENTROS</div>
        </div>

        <div class="preview-description" v-if="datos.descripcionGeneral">
          {{ datos.descripcionGeneral }}
        </div>

        <div 
          v-for="(centro, index) in datos.centros.filter(c => c.nombre)" 
          :key="index" 
          class="preview-center"
        >
          <div class="preview-center-header">
            <div class="center-number">2.2.{{ index + 1 }}</div>
            <div class="center-title">{{ centro.nombre }}</div>
          </div>

          <div class="preview-center-content">
            <div class="services-section">
              <h4>Servicios</h4>
              <ul v-if="centro.servicios.filter(s => s.trim()).length">
                <li v-for="servicio in centro.servicios.filter(s => s.trim())" :key="servicio">
                  • {{ servicio }}
                </li>
              </ul>
            </div>

            <div class="indicators-grid">
              <div 
                v-for="(indicador, idx) in centro.indicadores.filter(i => i.label && i.value >= 0)" 
                :key="idx"
                class="indicator-card"
                :class="{ 'small-indicator': idx >= 2 }"
              >
                <div class="indicator-label">{{ indicador.label }}:</div>
                <div class="indicator-value">{{ indicador.value.toLocaleString() }}</div>
              </div>
            </div>

            <div class="center-image" v-if="centro.imageUrl">
              <img :src="centro.imageUrl" :alt="centro.nombre" />
            </div>
          </div>
        </div>

        <div v-if="!datos.centros.filter(c => c.nombre).length" class="preview-empty">
          <p>No hay centros configurados para mostrar en la vista previa.</p>
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
import SimpleCloudinaryService from '../../../services/SimpleCloudinaryService';

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

// Estado de las pestañas
const activeTab = ref('edit');

// Estado del modal de imágenes
const showImageModal = ref(false);
const modalTitle = ref('Seleccionar imagen del centro');
const currentImageId = ref(null);
const currentCentroIndex = ref(null);

// Inicializar datos si no existen con la nueva estructura
if (!datos.value.descripcionGeneral) {
    datos.value.descripcionGeneral = '';
}

if (!datos.value.centros || datos.value.centros.length === 0) {
  datos.value.centros = [{
    nombre: '',
    imageUrl: '', // Campo para la URL de la imagen
    servicios: [''],
    indicadores: [
        { label: 'Nuevas altas de demandantes', value: 0 },
        { label: 'Citas de orientación', value: 0 },
        { label: 'Píldoras formativas', value: 0 },
    ],
  }];
} else {
    // Asegurarse de que los centros existentes tengan la nueva estructura
    datos.value.centros.forEach(centro => {
        if (!('imageUrl' in centro)) centro.imageUrl = ''; // Inicializar campo de imagen si no existe
        if (!centro.servicios) centro.servicios = [''];
        if (!centro.indicadores) centro.indicadores = [];
    });
}

// Método para abrir el modal de imágenes
const openCloudinaryModal = (imageId, currentImageUrl) => {
  currentImageId.value = imageId;
  currentCentroIndex.value = parseInt(imageId.split('-')[2]);
  modalTitle.value = `Seleccionar imagen para ${datos.value.centros[currentCentroIndex.value].nombre || 'Centro ' + (currentCentroIndex.value + 1)}`;
  showImageModal.value = true;
};

// Método para cerrar el modal
const closeImageModal = () => {
  showImageModal.value = false;
  currentImageId.value = null;
  currentCentroIndex.value = null;
};

// Método para manejar la selección de una imagen
const handleImageSelect = (selectedImage) => {
  if (currentCentroIndex.value !== null) {
    datos.value.centros[currentCentroIndex.value].imageUrl = selectedImage.url;
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
    // Aquí podríamos mostrar un mensaje de error al usuario
  }
};

const agregarCentro = () => {
  datos.value.centros.push({
    nombre: '',
    imageUrl: '', // Campo para la URL de la imagen
    servicios: [''],
     indicadores: [
        { label: '', value: 0 },
    ],
  });
};

const eliminarCentro = (index) => {
  if (datos.value.centros.length > 1) {
    datos.value.centros.splice(index, 1);
  }
};

const agregarServicio = (centroIndex) => {
  datos.value.centros[centroIndex].servicios.push('');
};

const eliminarServicio = (centroIndex, servicioIndex) => {
  if (datos.value.centros[centroIndex].servicios.length > 1) {
    datos.value.centros[centroIndex].servicios.splice(servicioIndex, 1);
  }
};

const agregarIndicador = (centroIndex) => {
  datos.value.centros[centroIndex].indicadores.push({ label: '', value: 0 });
};

const eliminarIndicador = (centroIndex, indicadorIndex) => {
  if (datos.value.centros[centroIndex].indicadores.length > 1) {
    datos.value.centros[centroIndex].indicadores.splice(indicadorIndex, 1);
  }
};

const esValido = computed(() => {
  // La descripción general es opcional.
  // Validar que haya al menos un centro
  if (!datos.value.centros || datos.value.centros.length === 0) {
    return false;
  }

  // Validar cada centro
  const centrosValidos = datos.value.centros.every(centro => {
    // Validar que el nombre del centro no esté vacío
    if (!centro.nombre) {
      return false;
    }
    // La imagen es opcional, no se valida su existencia.

    // Validar que haya al menos un servicio y que ninguno esté vacío
    if (!centro.servicios || centro.servicios.length === 0 || centro.servicios.some(servicio => !servicio || servicio.trim() === '')) {
        return false;
    }
     // Validar que si hay indicadores, cada uno tenga etiqueta y un valor numérico >= 0
    if (centro.indicadores && centro.indicadores.some(indicador => !indicador.label || indicador.label.trim() === '' || indicador.value < 0 || typeof indicador.value !== 'number')) {
         return false;
     }
    return true; // El centro es válido
  });

  return centrosValidos;
});
</script>

<style scoped>
.form-step {
  max-width: 800px;
  margin: 0 auto;
}

/* Estilos de las pestañas */
.tabs-container {
  display: flex;
  border-bottom: 2px solid #e9ecef;
  margin-bottom: 2rem;
}

.tab-button {
  background: none;
  border: none;
  padding: 1rem 2rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  color: #6c757d;
  border-bottom: 3px solid transparent;
  transition: all 0.3s ease;
}

.tab-button:hover {
  color: #004698;
  background-color: #f8f9fa;
}

.tab-button.active {
  color: #004698;
  border-bottom-color: #004698;
  background-color: #f8f9fa;
}

.tab-content {
  animation: fadeIn 0.3s ease;
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 8px;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.form-section {
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: #f8f9fa;
    border-radius: 8px;
    border-left: 5px solid #004698; /* Indicative border */
}

.form-section h4 {
    margin-top: 0;
    color: #004698;
    margin-bottom: 1.5rem;
    border-bottom: 1px solid #eee;
    padding-bottom: 0.5rem;
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

.btn-sm {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
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

/* Estilos específicos para los campos de indicadores */
.indicator-group {
    display: flex;
    gap: 10px; /* Espacio entre etiqueta, valor y botón */
    align-items: center;
    margin-bottom: 0.5rem;
}

.indicator-group .form-control {
    flex-grow: 1; /* Permite que los inputs crezcan */
}

.indicator-label {
    flex-basis: 60%; /* La etiqueta ocupa más espacio */
}

.indicator-value {
    flex-basis: 30%; /* El valor ocupa menos espacio */
}

.indicator-group .btn-outline-danger {
    flex-grow: 0; /* El botón no crece */
}

.input-group {
    display: flex;
    align-items: center;
}
.input-group .form-control {
    flex-grow: 1;
    margin-bottom: 0; /* Elimina el margen inferior del form-control dentro del grupo */
}
.input-group .btn {
    margin-left: 5px; /* Espacio entre el input y el botón */
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
    /* Estilos para el placeholder visual cuando no hay imagen */
    background-color: #e9ecef;
    color: #6c757d;
    display: flex;
    align-items: center;
    justify-content: center;
    font-style: italic;
    min-height: 150px; /* Altura mínima para el placeholder */
    object-fit: contain; /* Para que el placeholder no se distorsione */
}

.image-upload-hint {
    font-size: 0.875rem;
    color: #6c757d;
    margin-top: 0.5rem;
}

.clickable-image {
    cursor: pointer;
}

/* Estilos adicionales para el modal de imágenes */
.image-placeholder {
    transition: all 0.3s ease;
}

.image-placeholder:hover {
    border-color: #004698;
    box-shadow: 0 0 10px rgba(0, 70, 152, 0.2);
}

.image-upload-hint {
    font-size: 0.875rem;
    color: #666;
    margin-top: 0.5rem;
    text-align: center;
}

.clickable-image {
    cursor: pointer;
    transition: transform 0.3s ease;
}

.clickable-image:hover {
    transform: scale(1.02);
}

/* Asegurar que el modal esté siempre en el centro de la pantalla */
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

/* Estilos para la Vista Previa */
.preview-section {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  font-family: 'Arial', sans-serif;
}

.preview-header {
  color: white;
  padding: 2rem;
  display: flex;
  align-items: flex-end;
  gap: 1rem;
}

.preview-number {
  background: #86D4C8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color:white;
  padding: 0.5rem;
}

.preview-title {
  font-size: 1.8rem;
  font-weight: bold;
  letter-spacing: 1px;
  color: #00b4a6
}

.preview-description {
  padding: 1.5rem 2rem;
  color: #333;
  line-height: 1.6;
  border-bottom: 1px solid #e9ecef;
}

.preview-center {
  border-bottom: 1px solid #e9ecef;
  background: white;
}

.preview-center:last-child {
  border-bottom: none;
}

.preview-center-header {
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.center-number {
  background: black;
  color: white;
  padding: 0.5rem 0.7rem;
  font-weight: bold;
  font-size: 1.1rem;
  min-width: 60px;
  text-align: center;
}

.center-title {
  font-size: 1.3rem;
  font-weight: bold;
  color: #00b4a6;
  flex-grow: 1;
  border-bottom: 1.5px solid black;
}

.preview-center-content {
  padding: 2rem;
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  align-items: start;
}

.services-section {
  background: #00b4a61a;
  padding: 1.5rem;
}

.services-section h4 {
  color: #1e8981;
  margin: 0 0 1rem;
  font-size: 1.5rem;
  font-weight: 700;
}

.services-section ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.services-section li {
  color: #333;
  font-size: 0.95rem;
}

.indicators-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.indicator-card {
  background: #00b4a6;
    color: #fff;
    padding: 0.5rem;
  text-align: center;
  display: flex;
  flex-direction: column;
}

.indicator-card.small-indicator {
  background: #20c997;
    padding: 1rem;
    display: flex;
    align-items: center;
}

.indicator-label {
  font-size: 1.1rem;
    opacity: .9;
    line-height: 1.2;
}

.indicator-value {
  font-size: 2rem;
    font-weight: 700;
    padding: 0.5rem;
    line-height: 1;
}

.small-indicator .indicator-value {
  font-size: 1.5rem;
}

.center-image {
  grid-column: 1 / -1;
  margin-top: 2rem;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.center-image img {
  width: 100%;
  height: 300px;
  object-fit: cover;
  display: block;
}

.preview-empty {
  text-align: center;
  padding: 3rem;
  color: #6c757d;
  font-style: italic;
}

/* Responsive design */
@media (max-width: 768px) {
  .preview-center-content {
    grid-template-columns: 1fr;
  }
  
  .indicators-grid {
    grid-template-columns: 1fr;
  }
  
  .preview-header {
    padding: 1rem;
    flex-direction: column;
    text-align: center;
  }
  
  .preview-number {
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
  }
  
  .preview-title {
    font-size: 1.4rem;
  }
  
  .center-number {
    min-width: 50px;
    font-size: 1rem;
  }
  
  .center-title {
    font-size: 1.1rem;
  }
}
</style>