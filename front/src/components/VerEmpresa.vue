<PDFPreviewModal 
  :show="mostrarPdfPreview" 
  :pdf-url="pdfUrl" 
  :pdf-bytes="pdfBytes"
  :nombre-archivo="`informe_${empresa?.nombre || 'empresa'}.pdf`"
  @close="mostrarPdfPreview = false" 
  @download="descargarPDF" 
/>

<template>
  <!-- ... existing template code ... -->
</template>

<script>
import PDFService from '../services/PDFService';

export default {
  data() {
    return {
      mostrarPdfPreview: false,
      pdfUrl: '',
      pdfBytes: null,
      generandoPDF: false,
    };
  },

  methods: {
    /**
     * Genera el PDF y muestra el modal de previsualización
     */
    async generarPDF() {
      try {
        this.generandoPDF = true;
        const pdfBytes = await PDFService.generarInformeEmpresa(this.empresa);
        this.pdfBytes = pdfBytes; // Guardar los bytes para descargar después
        
        // Crear blob y URL para previsualización
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        this.pdfUrl = URL.createObjectURL(blob);
        
        this.mostrarPdfPreview = true;
      } catch (error) {
        console.error('Error al generar PDF:', error);
        this.$toast.error('Error al generar el PDF. Por favor, inténtelo de nuevo.');
      } finally {
        this.generandoPDF = false;
      }
    },

    /**
     * Descarga el PDF generado
     */
    descargarPDF() {
      if (this.pdfBytes) {
        PDFService.guardarPDF(this.pdfBytes, `informe_${this.empresa?.nombre || 'empresa'}.pdf`);
      } else {
        this.$toast.error('No hay un PDF disponible para descargar. Por favor, genérelo primero.');
      }
    },
  },
};
</script>

<style>
  /* ... existing style code ... */
</style> 