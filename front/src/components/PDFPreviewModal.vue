<template>
  <div v-if="show" class="pdf-preview-modal">
    <div class="pdf-preview-content">
      <div class="pdf-preview-header">
        <h2>Previsualización del PDF</h2>
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
            <div class="mt-3 text-body-1">Cargando documento...</div>
          </div>
          <iframe 
            v-show="!cargando"
            ref="pdfIframe"
            :src="pdfUrlCompleta" 
            style="width: 100%; height: 100%; border: none;"
            @load="iframeLoaded"
          ></iframe>
        </div>
      </div>
      <div class="pdf-preview-footer">
        <button class="button-cancel" @click="$emit('close')">Cancelar</button>
        <button class="buttonDownload" @click="descargarPDF">Descargar PDF</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, onUnmounted } from 'vue';
import PDFService from '../services/PDFService';

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  pdfUrl: {
    type: [String, Object],
    required: true
  },
  pdfBytes: {
    type: Uint8Array,
    default: null
  },
  nombreArchivo: {
    type: String,
    default: 'informe.pdf'
  }
});

const emit = defineEmits(['close', 'download']);

const pdfIframe = ref(null);
const cargando = ref(true);

// Construir la URL completa con parámetros de visualización
const pdfUrlCompleta = computed(() => {
  if (!props.pdfUrl) return '';
  
  // Comprobar si pdfUrl es un objeto o una cadena
  if (typeof props.pdfUrl === 'object' && props.pdfUrl.url) {
    const baseUrl = props.pdfUrl.url;
    const params = props.pdfUrl.params || {};
    
    // Construir fragmentos para los parámetros
    const fragments = Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    
    return fragments ? `${baseUrl}#${fragments}` : baseUrl;
  } else {
    // Tratar como cadena (para compatibilidad con versiones anteriores)
    return props.pdfUrl;
  }
});

// Listener para mensajes de postMessage para comunicarse con el visor PDF
const handleMessage = (event) => {
  // Solo procesar mensajes relevantes para ajustar el PDF
  if (event.data && event.data.type === 'pdfViewerReady') {
    // Enviar mensaje para ajustar el zoom
    event.source.postMessage({
      type: 'pdfViewerCommand',
      command: 'setZoom',
      value: 'page-fit'
    }, '*');
  }
};

// Eventos del ciclo de vida para manejar el listener de mensajes
onMounted(() => {
  window.addEventListener('message', handleMessage);
});

onUnmounted(() => {
  window.removeEventListener('message', handleMessage);
});

const iframeLoaded = () => {
  // Dar un poco de tiempo para que se cargue el PDF completamente
  setTimeout(() => {
    cargando.value = false;
    
    // Intentar ajustar la visualización directamente en el iframe después de cargar
    try {
      const iframe = pdfIframe.value;
      if (iframe && iframe.contentWindow) {
        // Algunos visores PDF admiten mensajes para controlar el zoom
        iframe.contentWindow.postMessage({
          type: 'pdfViewerCommand',
          command: 'setZoom',
          value: 'page-fit'
        }, '*');
        
        // Intentar aplicar estilos para maximizar la visualización
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        if (iframeDoc) {
          // Insertar estilos para el visor de PDF
          const style = iframeDoc.createElement('style');
          style.textContent = `
            body, html {
              margin: 0 !important;
              padding: 0 !important;
              overflow: auto !important;
            }
            
            .pdfViewer .page {
              margin: 0 auto !important;
              border: none !important;
            }
            
            #viewer {
              margin: 0 !important;
              width: 100% !important;
            }
            
            .pdfViewer {
              width: 100% !important;
            }
          `;
          iframeDoc.head.appendChild(style);
          
          // Buscar el elemento del visor y ajustar
          const viewer = iframeDoc.getElementById('viewer');
          if (viewer) {
            viewer.style.transform = 'scale(1)';
            viewer.style.transformOrigin = 'center top';
          }
        }
      }
    } catch (error) {
      console.log('No se pudo ajustar el zoom automáticamente:', error);
    }
  }, 500);
};

const descargarPDF = () => {
  if (props.pdfBytes) {
    try {
      console.log("Iniciando descarga de PDF desde el modal...", props.nombreArchivo);
      PDFService.guardarPDF(props.pdfBytes, props.nombreArchivo);
      // Emitir evento de descarga para notificar al componente padre
      emit('download');
    } catch (error) {
      console.error('Error al descargar el PDF:', error);
      alert('Error al descargar el PDF. Inténtelo de nuevo más tarde.');
    }
  } else {
    console.error('No hay datos de PDF para descargar');
    alert('No hay datos de PDF disponibles para descargar. Por favor, cierre y vuelva a intentarlo.');
  }
};

watch(() => props.show, (newVal) => {
  if (newVal) {
    cargando.value = true;
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

/* Ajustes específicos para el iframe del PDF */
iframe {
  margin: 0;
  padding: 0;
  transform-origin: center top;
  display: block;
}

/* Ajustes para PDF embebido */
:deep(embed[type="application/pdf"]) {
  width: 100% !important;
  height: 100% !important;
}

/* Ajustes para visualizador de PDF de Chrome */
:deep(.pdf-viewer-container) {
  width: 100% !important;
  height: 100% !important;
}
</style>