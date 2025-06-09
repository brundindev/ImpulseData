<template>
  <div class="form-step">
    <!-- Pestañas -->
    <div class="tabs-container">
      <div class="tabs">
        <button 
          class="tab-button" 
          :class="{ active: activeTab === 'form' }"
          @click="activeTab = 'form'"
        >
          Formulario
        </button>
        <button 
          class="tab-button" 
          :class="{ active: activeTab === 'preview' }"
          @click="activeTab = 'preview'"
        >
          Vista previa
        </button>
      </div>
    </div>

    <!-- Contenido del formulario -->
    <div v-show="activeTab === 'form'" class="tab-content">
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
    </div>

    <!-- Vista previa -->
    <div v-show="activeTab === 'preview'" class="tab-content">
      <div class="preview-container">
        <div class="preview-document">
          <!-- Header 2.3 -->
          <div class="preview-header">
            <div class="section-number">2.3</div>
            <div class="section-title">
              <div class="title-main">SERVICIOS PARA</div>
              <div class="title-highlight">EL EMPLEO</div>
            </div>
          </div>

          <div class="center-image" v-if="datos.orientacion.imageUrl">
            <img :src="datos.orientacion.imageUrl" :alt="Imagen"
          </div>
          <!-- Subsección 2.3.1 -->
          <div class="preview-subsection">
            <div class="subsection-header">
              <span class="subsection-number">2.3.1</span>
              <span class="subsection-title">Orientación e intermediación laboral</span>
            </div>
          </div>

          <!-- Estadísticas principales -->
          <div class="stats-main-container">
            <div class="stats-left">
              <div class="stat-box primary">
                <div class="stat-label">Demandantes de<br>empleo registrados:</div>
                <div class="stat-value">{{ formatNumber(datos.orientacion.demandantesRegistrados) }}</div>
              </div>
              <div class="stat-box primary">
                <div class="stat-label">Personas<br>atendidas:</div>
                <div class="stat-value">{{ formatNumber(datos.orientacion.personasAtendidas) }}</div>
              </div>
            </div>

            <div class="stats-right">
              <div class="stat-item-small">
                <div class="stat-icon">⚙️</div>
                <div class="stat-content">
                  <div class="stat-label-small">Perceptoras de<br>prestaciones por<br>desempleo:</div>
                  <div class="stat-value-small">{{ formatNumber(datos.orientacion.perceptorasPrestaciones) }}</div>
                </div>
              </div>

              <div class="stat-item-small">
                <div class="stat-icon">⚙️</div>
                <div class="stat-content">
                  <div class="stat-label-small">Pertenecientes a<br>colectivos vulnerables:</div>
                  <div class="stat-value-small">{{ formatNumber(datos.orientacion.colectivosVulnerables) }}</div>
                </div>
              </div>

              <div class="stat-item-small">
                <div class="stat-icon">📅</div>
                <div class="stat-content">
                  <div class="stat-label-small">Ofertas de empleo:</div>
                  <div class="stat-value-small">{{ formatNumber(datos.orientacion.ofertasEmpleo) }}</div>
                </div>
              </div>

              <div class="stat-item-small">
                <div class="stat-icon">📋</div>
                <div class="stat-content">
                  <div class="stat-label-small">Inscripciones y<br>derivaciones a ofertas:</div>
                  <div class="stat-value-small">{{ formatNumber(datos.orientacion.inscripcionesDerivaciones) }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Perfil demandantes -->
          <div class="perfil-section">
            <div class="perfil-header">PERFIL DEMANDANTES 2023:</div>
            <div class="perfil-subtitle">{{ datos.orientacion.perfilDemandante || 'Mujer mayor de 45 años, parada de larga duración' }}</div>
            
            <div class="perfil-stats">
              <div class="perfil-total">
                <div class="total-label">TOTAL NUEVOS<br>DEMANDANTES</div>
                <div class="total-value">{{ formatNumber(datos.orientacion.nuevosDemandantes) }}</div>
              </div>
              
              <div class="perfil-charts">
                <div class="chart-container">
                  <div class="pie-chart gender-chart">
                    <div class="chart-values">
                      <div class="chart-value women">{{ Math.round(datos.orientacion.nuevosDemandantes * 0.6) }}</div>
                      <div class="chart-value men">{{ Math.round(datos.orientacion.nuevosDemandantes * 0.4) }}</div>
                    </div>
                  </div>
                  <div class="chart-legend">
                    <div class="legend-item">
                      <div class="legend-color women-color"></div>
                      <span>Mujeres</span>
                    </div>
                    <div class="legend-item">
                      <div class="legend-color men-color"></div>
                      <span>Hombres</span>
                    </div>
                  </div>
                </div>

                <div class="chart-container">
                  <div class="pie-chart age-chart">
                    <div class="chart-values">
                      <div class="chart-value age-45">{{ Math.round(datos.orientacion.nuevosDemandantes * 0.5) }}</div>
                      <div class="chart-value age-30">{{ Math.round(datos.orientacion.nuevosDemandantes * 0.35) }}</div>
                      <div class="chart-value age-under30">{{ Math.round(datos.orientacion.nuevosDemandantes * 0.15) }}</div>
                    </div>
                  </div>
                  <div class="chart-legend">
                    <div class="legend-item">
                      <div class="legend-color age-45-color"></div>
                      <span>Mayores de 45</span>
                    </div>
                    <div class="legend-item">
                      <div class="legend-color age-30-color"></div>
                      <span>Entre 30 y 45 años</span>
                    </div>
                    <div class="legend-item">
                      <div class="legend-color age-under30-color"></div>
                      <span>Menores de 30</span>
                    </div>
                  </div>
                </div>
              </div>
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

const emit = defineEmits(['update:modelValue', 'siguiente', 'anterior']);

// Estado del componente
const activeTab = ref('form');

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
    demandantesRegistrados: 8318,
    personasAtendidas: 4155,
    perceptorasPrestaciones: 749,
    colectivosVulnerables: 3906,
    ofertasEmpleo: 109,
    inscripcionesDerivaciones: 1949,
    perfilDemandante: 'Mujer mayor de 45 años, parada de larga duración',
    nuevosDemandantes: 1979
  };
}

if (!datos.value.asesoramiento) {
  datos.value.asesoramiento = {
    personasAtendidas: 347,
    empresasCreadas: 54
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
    closeImageModal();
  } catch (error) {
    console.error('Error al subir la imagen:', error);
  }
};

// Métodos para la vista previa
const formatNumber = (num) => {
  return num ? num.toLocaleString('es-ES') : '0';
};

const esValido = computed(() => {
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
/* Estilos generales */
.form-step {
  max-width: 1200px;
  margin: 0 auto;
}

/* Pestañas */
.tabs-container {
  margin-bottom: 2rem;
}

.tabs {
  display: flex;
  border-bottom: 2px solid #e9ecef;
  margin-bottom: 2rem;
}

.tab-button {
  padding: 1rem 2rem;
  border: none;
  background: transparent;
  color: #6c757d;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.3s ease;
}

.tab-button:hover {
  color: #004698;
  background: rgba(0, 70, 152, 0.05);
}

.tab-button.active {
  color: #004698;
  border-bottom-color: #004698;
  background: rgba(0, 70, 152, 0.1);
}

.tab-content {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Vista previa */
.preview-container {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 8px;
}

.preview-document {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 900px;
  margin: 0 auto;
}

/* Header 2.3 */
.preview-header {
  display: flex;
}

.section-number {
  background: #52c4b2b0;
    color: #fff;
    font-size: 1.5rem;
    font-weight: 700;
    text-align: center;
    align-self: center;
    padding: 0.5rem;
    margin-right: 0.8rem;
}

.section-title {
  flex: 1;
}

.title-main {
  color: #333;
    font-size: 1.2rem;
    font-weight: 700;
    display: block;
    text-shadow: none;
}

.title-highlight {
  color: #3ecbcd;
    font-size: 1.6rem;
    font-weight: 700;
    display: block;
    text-shadow: none;
}

/* Subsección */
.subsection-header {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e9ecef;
}

.subsection-number {
  background: #333;
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  padding: 0.5rem 1rem;
  margin-right: 1rem;
}

.subsection-title {
  color: #3ECBCD;
  font-size: 1.4rem;
  font-weight: 600;
}

/* Estadísticas principales */
.stats-main-container {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
}

.stats-left {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
}

.stat-box {
  background: #3ECBCD;
  color: white;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
}

.stat-label {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  opacity: 0.9;
  line-height: 1.2;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: bold;
}

.stats-right {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  flex: 1;
}

.stat-item-small {
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1rem;
  min-height: 80px;
}

.stat-icon {
  background: #3ECBCD;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-label-small {
  font-size: 0.75rem;
  color: #666;
  margin-bottom: 0.25rem;
  line-height: 1.1;
}

.stat-value-small {
  font-size: 1.5rem;
  font-weight: bold;
  color: #3ECBCD;
}

/* Perfil section */
.perfil-section {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.perfil-header {
  color: #3ECBCD;
  font-size: 1.2rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 0.5rem;
}

.perfil-subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 1.5rem;
  font-style: italic;
}

.perfil-stats {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

.perfil-total {
  background: #3ECBCD;
  color: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  min-width: 200px;
}

.total-label {
  font-size: 0.9rem;
  margin-bottom: 1rem;
  opacity: 0.9;
  line-height: 1.2;
}

.total-value {
  font-size: 3rem;
  font-weight: bold;
}

.perfil-charts {
  display: flex;
  gap: 2rem;
  flex: 1;
}

.chart-container {
  flex: 1;
  text-align: center;
}

.pie-chart {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin: 0 auto 1rem;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gender-chart {
  background: conic-gradient(
    #3ECBCD 0deg 216deg,
    #87ceeb 216deg 360deg
  );
}

.age-chart {
  background: conic-gradient(
    #3ECBCD 0deg 180deg,
    #87ceeb 180deg 306deg,
    #b0e0e6 306deg 360deg
  );
}

.chart-values {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-weight: bold;
  color: white;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
}

.chart-value {
  font-size: 0.9rem;
  line-height: 1;
}

.chart-legend {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-start; 
  color:black;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.women-color { background: #3ECBCD; }
.men-color { background: #87ceeb; }
.age-45-color { background: #3ECBCD; }
.age-30-color { background: #87ceeb; }
.age-under30-color { background: #b0e0e6; }

/* Formulario */
.form-section {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.form-section h4 {
  color: #3ECBCD;
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #3ECBCD;
}

.form-section h5 {
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 1.5rem 0 1rem 0;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 500;
  color: #333;
  margin-bottom: 0.5rem;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-control:focus {
  outline: none;
  border-color: #3ECBCD;
  box-shadow: 0 0 0 2px rgba(62, 203, 205, 0.1);
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

.center-image-upload {
  text-align: center;
}

.image-placeholder {
  max-width: 100%;
  height: auto;
  border: 2px dashed #ddd;
  border-radius: 8px;
  transition: border-color 0.3s ease;
}

.image-placeholder:hover {
  border-color: #3ECBCD;
}

.image-upload-hint {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #666;
  font-style: italic;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e9ecef;
}

.btn {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
  text-align: center;
}

.btn-primary {
  background: #3ECBCD;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2fb5b7;
  transform: translateY(-1px);
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #545b62;
  transform: translateY(-1px);
}

/* Responsive */
@media (max-width: 768px) {
  .stats-main-container {
    flex-direction: column;
  }
  
  .stats-right {
    grid-template-columns: 1fr;
  }
  
  .perfil-stats {
    flex-direction: column;
    align-items: center;
  }
  
  .perfil-charts {
    justify-content: center;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style>