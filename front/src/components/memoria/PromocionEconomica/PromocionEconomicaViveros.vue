<template>
  <div class="form-step">
    <!-- Pestañas -->
    <div class="tabs-container">
      <button 
        @click="activeTab = 'form'"
        :class="['tab-button', { active: activeTab === 'form' }]"
      >
        Formulario
      </button>
      <button 
        @click="activeTab = 'preview'"
        :class="['tab-button', { active: activeTab === 'preview' }]"
      >
        Vista Previa
      </button>
    </div>

    <!-- Contenido del Formulario -->
    <div v-if="activeTab === 'form'" class="tab-content">
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
    </div>

    <!-- Vista Previa -->
    <div v-if="activeTab === 'preview'" class="tab-content preview-content">
      <h3 class="preview-title">PROGRAMAS DE FOMENTO DE EMPRENDIMIENTO</h3>
      
      <div v-for="(programa, index) in datos.programas" :key="index" class="preview-programa">
        <!-- Header del programa -->
        <div class="preview-header">
          <div class="program-number">3.{{ index + 1 }}</div>
          <h2 class="program-title">{{ programa.nombre || 'Nombre del Programa' }}</h2>
        </div>

        <!-- Estadísticas principales -->
        <div class="stats-container">
          <div class="main-stat">
            <div class="stat-label">Número de empresas</div>
            <div class="stat-value">{{ getFieldValue(programa, 'empresas') || '95' }}</div>
          </div>

          <!-- Sectores de actividad -->
          <div class="sectors-info">
            <div class="sectors-title">Sectores de actividad de las empresas creadas:</div>
            <div class="sectors-grid">
              <div class="sector-item">
                <div class="sector-icon">🏢</div>
                <div class="sector-text">Servicios a empresas:</div>
                <div class="sector-number">{{ getFieldValue(programa, 'servicios') || '44' }}</div>
              </div>
              <div class="sector-item">
                <div class="sector-icon">🏨</div>
                <div class="sector-text">Hostelería:</div>
                <div class="sector-number">{{ getFieldValue(programa, 'hosteleria') || '8' }}</div>
              </div>
              <div class="sector-item">
                <div class="sector-icon">🏪</div>
                <div class="sector-text">Comercio:</div>
                <div class="sector-number">{{ getFieldValue(programa, 'comercio') || '23' }}</div>
              </div>
              <div class="sector-item">
                <div class="sector-icon">🏗️</div>
                <div class="sector-text">Construcción e instalaciones técnicas:</div>
                <div class="sector-number">{{ getFieldValue(programa, 'construccion') || '7' }}</div>
              </div>
              <div class="sector-item">
                <div class="sector-icon">🏠</div>
                <div class="sector-text">Inmobiliario:</div>
                <div class="sector-number">{{ getFieldValue(programa, 'inmobiliario') || '9' }}</div>
              </div>
              <div class="sector-item">
                <div class="sector-icon">🎓</div>
                <div class="sector-text">Formación:</div>
                <div class="sector-number">{{ getFieldValue(programa, 'formacion') || '4' }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Emprendimiento por sexo -->
        <div class="gender-stats">
          <h4>EMPRENDIMIENTO POR SEXO:</h4>
          <div class="gender-container">
            <div class="total-box">
              <div class="total-label">Total:</div>
              <div class="total-value">{{ getFieldValue(programa, 'total') || '85' }}</div>
            </div>
            <div class="gender-bars">
              <div class="gender-bar male">
                <span class="gender-number">{{ getFieldValue(programa, 'hombres') || '50' }}</span>
                <span class="gender-label">Hombres</span>
              </div>
              <div class="gender-bar female">
                <span class="gender-number">{{ getFieldValue(programa, 'mujeres') || '35' }}</span>
                <span class="gender-label">Mujeres</span>
              </div>
            </div>
            <div class="pie-chart">
              <div class="pie-slice male-slice" :style="{ '--percentage': getMalePercentage(programa) }"></div>
              <div class="pie-slice female-slice" :style="{ '--percentage': getFemalePercentage(programa) }"></div>
              <div class="pie-labels">
                <div class="pie-label male-label">{{ getMalePercentage(programa) }}%</div>
                <div class="pie-label female-label">{{ getFemalePercentage(programa) }}%</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Imagen del programa -->
        <div class="image-section">
          <img 
            :src="programa.imageUrl || '/placeholder-image.png'" 
            :alt="programa.nombre"
            class="program-image"
          />
        </div>
      </div>
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

// Estado de las pestañas
const activeTab = ref('form');

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

// Métodos existentes
const agregarPrograma = () => {
  datos.value.programas.push({
    nombre: '',
    imageUrl: '',
    campos: []
  });
};

const eliminarPrograma = (index) => {
  if (datos.value.programas.length > 1) {
    datos.value.programas.splice(index, 1);
  }
};

const agregarCampo = (programaIndex) => {
  datos.value.programas[programaIndex].campos.push({
    nombre: '',
    valor: '',
  });
};

const eliminarCampo = (programaIndex, campoIndex) => {
  datos.value.programas[programaIndex].campos.splice(campoIndex, 1);
};

const openCloudinaryModal = (index) => {
  currentProgramIndex.value = index;
  showImageModal.value = true;
};

const closeImageModal = () => {
  showImageModal.value = false;
  currentProgramIndex.value = null;
};

const handleImageSelect = (selectedImage) => {
  if (currentProgramIndex.value !== null) {
    datos.value.programas[currentProgramIndex.value].imageUrl = selectedImage.url;
  }
  closeImageModal();
};

const handleImageUpload = async () => {
  try {
    closeImageModal();
  } catch (error) {
    console.error('Error al subir la imagen:', error);
  }
};

const esValido = computed(() => {
  return datos.value.programas.every(programa =>
    programa.nombre &&
    programa.imageUrl &&
    programa.campos.every(campo => campo.nombre && campo.valor)
  );
});

// Métodos para la vista previa
const getFieldValue = (programa, fieldName) => {
  const campo = programa.campos.find(c => c.nombre.toLowerCase().includes(fieldName.toLowerCase()));
  return campo ? campo.valor : null;
};

const getMalePercentage = (programa) => {
  const hombres = parseInt(getFieldValue(programa, 'hombres')) || 50;
  const total = parseInt(getFieldValue(programa, 'total')) || 85;
  return Math.round((hombres / total) * 100);
};

const getFemalePercentage = (programa) => {
  const mujeres = parseInt(getFieldValue(programa, 'mujeres')) || 35;
  const total = parseInt(getFieldValue(programa, 'total')) || 85;
  return Math.round((mujeres / total) * 100);
};
</script>

<style scoped>
/* Estilos existentes del formulario */
.form-step {
  max-width: 1000px;
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

/* Estilos para las pestañas */
.tabs-container {
  display: flex;
  margin-bottom: 2rem;
  border-bottom: 2px solid #e9ecef;
}

.tab-button {
  padding: 1rem 2rem;
  background: none;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  color: #6c757d;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.3s ease;
}

.tab-button.active {
  color: #004698;
  border-bottom-color: #004698;
}

.tab-button:hover {
  color: #004698;
}

.tab-content {
  min-height: 400px;
}

/* Estilos para la vista previa */
.preview-content {
  background: white;
  padding: 2rem;
  font-family: Arial, sans-serif;
}

.preview-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
}

.preview-programa {
  margin-bottom: 3rem;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.preview-header {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
}

.program-number {
  background: black;
  color: white;
  padding: 0.5rem 1rem;
  font-size: 1.2rem;
  font-weight: bold;
  margin-right: 1rem;
}

.program-title {
  color: #FF6B35;
  font-size: 1.8rem;
  font-weight: bold;
  margin: 0;
}

.stats-container {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.main-stat {
  background: #FF6B35;
  color: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  display: flex;
    flex-direction: column;
    justify-content: center;
}

.stat-label {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 3rem;
  font-weight: bold;
  opacity: 1;
  -webkit-text-fill-color: white;
}

.sectors-info {
  background: #FFF4F0;
  padding: 1.5rem;
  border-radius: 8px;
}

.sectors-title {
  font-weight: bold;
  margin-bottom: 1rem;
  color: #333;
}

.sectors-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.8rem;
}

.sector-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.sector-icon {
  font-size: 1.2rem;
}

.sector-text {
  flex: 1;
  color: #666;
}

.sector-number {
  font-weight: bold;
  color: #FF6B35;
  font-size: 1.1rem;
}

.gender-stats {
  margin-bottom: 2rem;
}

.gender-stats h4 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.gender-container {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 2rem;
  align-items: center;
}

.total-box {
  background: #FF6B35;
  color: white;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  min-width: 120px;
}

.total-label {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.total-value {
  font-size: 2.5rem;
  font-weight: bold;
}

.gender-bars {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.gender-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  color: white;
  font-weight: bold;
}

.gender-bar.male {
  background: #FF6B35;
}

.gender-bar.female {
  background: #FFB366;
}

.gender-number {
  font-size: 1.5rem;
  min-width: 50px;
}

.gender-label {
  font-size: 1rem;
}

.pie-chart {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: conic-gradient(#FF6B35 0deg calc(var(--male-percentage, 58.82) * 3.6deg), #FFB366 calc(var(--male-percentage, 58.82) * 3.6deg) 360deg);
}

.pie-labels {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-weight: bold;
  color: white;
  font-size: 0.9rem;
}

.image-section {
  margin-top: 2rem;
}

.program-image {
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>