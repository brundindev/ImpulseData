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
            :src="pdfUrl" 
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
import { ref, watch } from 'vue';
import PDFService from '../services/PDFService';

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  pdfUrl: {
    type: String,
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

const iframeLoaded = () => {
  setTimeout(() => {
    cargando.value = false;
  }, 300);
};

const descargarPDF = () => {
  if (props.pdfBytes) {
    PDFService.guardarPDF(props.pdfBytes, props.nombreArchivo);
  } else {
    console.error('No hay datos de PDF para descargar');
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
</style>