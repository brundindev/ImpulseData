<template>
  <div v-if="show" class="pdf-preview-modal">
    <div class="pdf-preview-content">
      <div class="pdf-preview-header">
        <h2>Previsualización del PDF</h2>
        <button class="close-button" @click="$emit('close')">&times;</button>
      </div>
      <div class="pdf-preview-body">
        <iframe :src="pdfUrl" frameborder="0"></iframe>
      </div>
      <div class="pdf-preview-footer">
        <button class="button-cancel" @click="$emit('close')">Cancelar</button>
        <button class="buttonDownload" @click="$emit('download')">Descargar PDF</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    required: true
  },
  pdfUrl: {
    type: String,
    required: true
  }
});

defineEmits(['close', 'download']);
</script>

<style src="../assets/PDFPreview.css"></style>