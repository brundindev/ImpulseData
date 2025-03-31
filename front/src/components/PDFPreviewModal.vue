<template>
  <div v-if="show" class="pdf-preview-modal">
    <div class="pdf-preview-content">
      <div class="pdf-preview-header">
        <h2>Previsualización del diseño</h2>
        <button class="close-button" @click="$emit('close')">&times;</button>
      </div>
      <div class="pdf-preview-body">
        <div class="iframe-container" style="height: 70vh; position: relative;">
          <div v-if="cargando" class="cargando-pdf">
            <v-progress-circular
              indeterminate
              color="primary"
              size="64"
            ></v-progress-circular>
            <div class="mt-3 text-body-1">Cargando diseño...</div>
          </div>
          
          <!-- Previsualización de imagen para Canva -->
          <div v-show="!cargando" class="canva-preview">
            <img 
              :src="imageSrc" 
              alt="Previsualización del diseño" 
              class="canva-preview-image" 
              @load="imageLoaded"
              @error="handleImageError"
            />
            <div v-if="imageError" class="error-message">
              <p>No se pudo cargar la previsualización del diseño.</p>
              <p>Se ha generado una vista simulada del informe.</p>
            </div>
          </div>
        </div>
      </div>
      <div class="pdf-preview-footer">
        <button class="button-cancel" @click="$emit('close')">Cancelar</button>
        <div class="canva-edit-container" v-if="canvaData && canvaData.designID">
          <button class="button-edit" @click="editarEnCanva">
            <span class="canva-icon">&#9998;</span>
            Editar en Canva
          </button>
          <div class="canva-tip">Personaliza colores, fuentes y más con el editor de Canva</div>
        </div>
        <button class="buttonDownload" @click="descargarPDF">Descargar PDF</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  pdfUrl: {
    type: String,
    required: true
  },
  canvaData: {
    type: Object,
    default: null
  },
  nombreArchivo: {
    type: String,
    default: 'informe.pdf'
  }
});

const emit = defineEmits(['close', 'download', 'edit-canva']);

const cargando = ref(true);
const imageError = ref(false);

// Determinar la URL de la imagen, manejando rutas relativas y absolutas
const imageSrc = computed(() => {
  if (!props.pdfUrl) return '';
  
  // Si la URL comienza con "/" o "./", es una ruta relativa
  if (props.pdfUrl.startsWith('/')) {
    // Para rutas relativas que vienen del servidor, usamos un SVG de muestra
    return '/placeholder-report.svg';
  }
  
  // Si es una URL completa
  if (props.pdfUrl.startsWith('http')) {
    return props.pdfUrl;
  }
  
  // En caso de error, usar una imagen de respaldo
  return '/placeholder-report.svg';
});

const imageLoaded = () => {
  cargando.value = false;
  imageError.value = false;
};

const handleImageError = () => {
  console.error('Error al cargar la imagen de previsualización');
  cargando.value = false;
  imageError.value = true;
  
  // Intentar cargar una imagen de respaldo
  const img = document.querySelector('.canva-preview-image');
  if (img) {
    img.src = '/placeholder-report.svg';
  }
};

const descargarPDF = () => {
  if (props.canvaData) {
    try {
      console.log("Iniciando descarga de PDF desde Canva...", props.nombreArchivo);
      // Emitir evento de descarga para notificar al componente padre
      emit('download');
    } catch (error) {
      console.error('Error al descargar el PDF:', error);
      alert('Error al descargar el PDF. Inténtelo de nuevo más tarde.');
    }
  } else {
    console.error('No hay datos del diseño para descargar');
    alert('No hay datos disponibles para descargar. Por favor, cierre y vuelva a intentarlo.');
  }
};

const editarEnCanva = () => {
  emit('edit-canva');
};

watch(() => props.show, (newVal) => {
  if (newVal) {
    cargando.value = true;
  }
});

onMounted(() => {
  // Precargar la imagen para mejorar la experiencia de usuario
  if (props.pdfUrl) {
    const img = new Image();
    img.src = props.pdfUrl;
    img.onload = () => {
      if (props.show) {
        cargando.value = false;
      }
    };
  }
});
</script>

<style src="../assets/PDFPreview.css"></style>

<style scoped>
.iframe-container {
  background-color: #f5f5f5;
  overflow: hidden;
}

.cargando-pdf {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
}

/* Estilos para la previsualización de Canva */
.canva-preview {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  overflow: auto;
}

.canva-preview-image {
  max-width: 95%;
  max-height: 95%;
  object-fit: contain;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
}

/* Estilos para el botón y mensaje de Canva */
.canva-edit-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 10px;
}

.button-edit {
  background-color: #00C4CC; /* Color de Canva */
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.button-edit:hover {
  background-color: #00A8AE;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.canva-icon {
  font-size: 16px;
}

.canva-tip {
  font-size: 11px;
  color: #666;
  margin-top: 4px;
  text-align: center;
  max-width: 160px;
}

.button-cancel {
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
  padding: 9px 18px;
  border-radius: 4px;
  margin-right: 10px;
  cursor: pointer;
}

.buttonDownload {
  background-color: #004698;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}

.buttonDownload:hover {
  background-color: #003570;
}

/* Estilos para el mensaje de error */
.error-message {
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 15px;
  text-align: center;
  border-radius: 4px;
  margin: 0 20px;
}

.error-message p {
  margin: 5px 0;
}
</style>