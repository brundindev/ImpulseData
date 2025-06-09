<template>
  <div class="vista-previa-container">
    <!-- Tabs de navegación -->
    <div class="tabs-container">
      <button 
        :class="['tab-button', { active: activeTab === 'formulario' }]"
        @click="activeTab = 'formulario'"
      >
        Formulario
      </button>
      <button 
        :class="['tab-button', { active: activeTab === 'preview' }]"
        @click="activeTab = 'preview'"
      >
        Vista Previa
      </button>
    </div>

    <!-- Contenido del formulario -->
    <div v-if="activeTab === 'formulario'" class="form-step">
      <h3>Dónde Estamos</h3>
      
      <div class="form-group">
        <label>Sedes</label>
        <div class="recursos-humanos">
          <div v-for="(sede, sedeIndex) in datos.recursosHumanos" :key="sedeIndex" class="recurso-item">
            <div class="recurso-header">
              <h4>Sede {{ sedeIndex + 1 }}</h4>
              <button 
                @click="eliminarSede(sedeIndex)" 
                class="btn btn-danger"
                type="button"
                v-if="datos.recursosHumanos.length > 1"
              >
                Eliminar
              </button>
            </div>
            
            <div class="form-group">
              <label>Imagen de la Sede</label>
              <div class="form-group center-image-upload">
                <img
                  :src="sede.imageUrl || '/placeholder-image.png'"
                  :alt="'Imagen de ' + (sede.nombre || 'Sede')"
                  class="image-placeholder clickable-image"
                  :data-image-id="'sede-image-' + sedeIndex"
                  @click="openCloudinaryModal('sede', sedeIndex, sede.imageUrl)"
                  style="width: 100%;height: 10rem ;max-height: 250px; object-fit: cover; cursor: pointer; border: 1px dashed #ccc; border-radius: 8px;"
                />
                <p class="image-upload-hint" style="color: black;">Haz clic en la imagen para subir o cambiar la foto de la sede.</p>
              </div>
            </div>

            <div class="form-group">
              <label>Nombre</label>
              <input 
                type="text" 
                v-model="sede.nombre" 
                class="form-control"
                placeholder="Nombre de la sede"
              >
            </div>
            
            <div class="form-group">
              <label>Dirección</label>
              <input 
                type="text" 
                v-model="sede.direccion" 
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
          <div v-for="(territorio, territorioIndex) in datos.recursosMateriales" :key="territorioIndex" class="recurso-item">
            <div class="recurso-header">
              <h4>Territorio {{ territorioIndex + 1 }}</h4>
              <button 
                @click="eliminarTerritorio(territorioIndex)" 
                class="btn btn-danger"
                type="button"
                v-if="datos.recursosMateriales.length > 1"
              >
                Eliminar
              </button>
            </div>
            
            <div class="form-group">
              <label>Imagen del Territorio</label>
              <div class="form-group center-image-upload">
                <img
                  :src="territorio.imageUrl || '/placeholder-image.png'"
                  :alt="'Imagen de ' + (territorio.nombre || 'Territorio')"
                  class="image-placeholder clickable-image"
                  :data-image-id="'territorio-image-' + territorioIndex"
                  @click="openCloudinaryModal('territorio', territorioIndex, territorio.imageUrl)"
                  style="width: 100%;height: 10rem ;max-height: 250px; object-fit: cover; cursor: pointer; border: 1px dashed #ccc; border-radius: 8px;"
                />
                <p class="image-upload-hint">Haz clic en la imagen para subir o cambiar la foto del territorio.</p>
              </div>
            </div>

            <div class="form-group">
              <label>Nombre</label>
              <input 
                type="text" 
                v-model="territorio.nombre" 
                class="form-control"
                placeholder="Nombre del territorio"
              >
            </div>
            
            <div class="form-group">
              <label>Dirección</label>
              <input 
                type="text" 
                v-model="territorio.direccion" 
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
    </div>

    <!-- Vista Previa -->
    <div v-if="activeTab === 'preview'" class="preview-content">
      <div class="preview-container">
        <!-- Header con número de versión -->
        <div class="preview-header">
          <div class="version-badge">1.4</div>
          <h2 class="preview-title">DÓNDE<br>ESTAMOS</h2>
        </div>

        <!-- Sección de Sedes -->
          <div class="section-header">
            <div class="section-title-preview">
              <h3 class="section-title-black">sedes</h3>
            </div>
          </div>
          <div class="cards-grid">
            <div 
              v-for="(sede, index) in datos.recursosHumanos" 
              :key="'sede-' + index"
              class="location-card"
            >
              <div class="card-image">
                <img 
                  :src="sede.imageUrl || '/placeholder-image.png'" 
                  :alt="sede.nombre"
                  class="card-img"
                />
              </div>
              <div class="card-content">
                <h4 class="card-title">{{ sede.nombre || 'Sede ' + (index + 1) }}</h4>
                <p class="card-address">{{ sede.direccion || 'Dirección no especificada' }}</p>
              </div>
            </div>
          </div>

        <!-- Sección de Red de Territorios -->
          <div class="section-header">
            <div class="section-title-preview">
              <h3 class="section-title-black">red de territorios</h3>
            </div>
          </div>
          <div class="cards-grid">
            <div 
              v-for="(territorio, index) in datos.recursosMateriales" 
              :key="'territorio-' + index"
              class="location-card"
            >
              <div class="card-image">
                <img 
                  :src="territorio.imageUrl || '/placeholder-image.png'" 
                  :alt="territorio.nombre"
                  class="card-img"
                />
              </div>
              <div class="card-content">
                <h4 class="card-title">{{ territorio.nombre || 'Territorio ' + (index + 1) }}</h4>
                <p class="card-address">{{ territorio.direccion || 'Dirección no especificada' }}</p>
              </div>
            </div>
          </div>
        </div>
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

// Estado para las pestañas
const activeTab = ref('formulario');

const datos = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// Estado del modal de imágenes
const showImageModal = ref(false);
const modalTitle = ref('Seleccionar imagen');
const currentImageId = ref(null);
const currentIndex = ref(null);
const currentType = ref(null);

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

// Métodos del modal
const openCloudinaryModal = (type, index, currentImageUrl) => {
  currentType.value = type;
  currentIndex.value = index;
  modalTitle.value = `Seleccionar imagen para ${type === 'sede' ? 'Sede' : 'Territorio'} ${index + 1}`;
  showImageModal.value = true;
};

const closeImageModal = () => {
  showImageModal.value = false;
  currentImageId.value = null;
  currentIndex.value = null;
  currentType.value = null;
};

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

const handleImageUpload = async () => {
  try {
    closeImageModal();
  } catch (error) {
    console.error('Error al subir la imagen:', error);
  }
};

// Métodos para gestionar sedes
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

// Métodos para gestionar territorios
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

// Validación
const esValido = computed(() => {
  return datos.value.recursosHumanos.every(sede => 
    sede.nombre && sede.direccion
  ) &&
  datos.value.recursosMateriales.every(territorio => 
    territorio.nombre && territorio.direccion
  );
});

const guardarYFinalizar = () => {
  emit('guardar', datos.value);
  
  if (esValido.value) {
    emit('siguiente');
  }
};
</script>

<style scoped>
.vista-previa-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Estilos para las pestañas */
.tabs-container {
  display: flex;
  border-bottom: 2px solid #e9ecef;
  margin-bottom: 2rem;
}

.tab-button {
  padding: 1rem 2rem;
  border: none;
  background: transparent;
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

/* Estilos del formulario (mantener los originales) */
.form-step {
  max-width: 800px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1.5rem;
}

.recurso-item {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.recurso-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.recurso-header h4 {
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

/* Estilos para la vista previa */
.preview-content {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 8px;
}

.preview-container {
  max-width: 800px;
  margin: 0 auto;
  background: white;
}

.preview-header {
  display: flex;
  align-items: center;
  margin-bottom: 3rem;
  gap: 1rem;
  padding: 2rem;
}

.version-badge {
  background: #7ba7d9;
  color: white;
  padding: 0.5rem 0.75rem;
  font-size: 1.1rem;
  font-weight: bold;
  text-align: center;
}

.preview-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #7ba7d9;
  margin: 0;
  line-height: 1.1;
  text-transform: uppercase;
  border-bottom: 1px solid rgb(119, 155, 209);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  text-align: center;
  margin: -3rem 0px 0rem;
  position: relative;
  justify-content: center;
}


.section-title-preview {
  display: flex;
  flex-direction: column;
}

.section-title-black {
  color: #7aa7db82;
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  padding: 1rem 2rem;
  display: inline-block;
  border-radius: 8px;
  letter-spacing: 2px;
}

.section-title-blue {
  color: #779BD1;
  font-weight: bold;
  margin: 0;
  font-size: 1.8rem;
  border-bottom: 1px solid #779BD1;
}

.cards-grid {
  padding: 1.8rem;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  margin-bottom: 3rem;
}

.location-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.location-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.card-image {
  height: 200px;
  overflow: hidden;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.location-card:hover .card-img {
  transform: scale(1.05);
}

.card-content {
  padding: 0.5rem;
  text-align: center;
    display: flex;
    flex-direction: column;
}

.card-title {
  font-size: 0.8rem;
  font-weight: 700;
    color: #004698;
    margin: 0 0 0.5rem;
    line-height: 1.3;
    text-align: center;
}

.card-address {
  color: #666;
  font-size: 0.7rem;
  margin: 0;
  line-height: 1.4;
}

.brand-symbol {
  background: #00b8a9;
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
}

.brand-text {
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
  line-height: 1.2;
}

/* Responsive */
@media (max-width: 768px) {
  .preview-header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .preview-title {
    font-size: 2rem;
  }
  
  .section-title {
    font-size: 1.8rem;
  }
  
  .cards-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .tabs-container {
    flex-direction: column;
  }
  
  .tab-button {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #e9ecef;
  }
  
  .tab-button.active {
    border-bottom: 1px solid #004698;
  }
}

@media (max-width: 480px) {
  .preview-container {
    padding: 1rem;
  }
  
  .brand-logo {
    padding: 0.75rem 1.5rem;
    gap: 0.75rem;
  }
  
  .brand-symbol {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
  
  .brand-text {
    font-size: 1rem;
  }
}
</style>