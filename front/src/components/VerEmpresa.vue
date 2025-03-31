<PDFPreviewModal 
  :show="mostrarPdfPreview" 
  :pdf-url="pdfUrl" 
  :canva-data="canvaData"
  :nombre-archivo="`informe_${empresa?.nombre || 'empresa'}.pdf`"
  @close="mostrarPdfPreview = false" 
  @download="descargarPDF" 
  @edit-canva="editarEnCanva"
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
      canvaData: null,
      generandoPDF: false,
    };
  },

  methods: {
    /**
     * Genera el PDF usando Canva y muestra el modal de previsualización
     */
    async generarPDF() {
      try {
        this.generandoPDF = true;
        const canvaResponse = await PDFService.generarInformeEmpresa(this.empresa);
        this.canvaData = canvaResponse; // Guardar los datos de Canva
        
        // Generar URL para previsualización
        const pdfUrlData = PDFService.generarURLPreview(canvaResponse);
        this.pdfUrl = pdfUrlData.url;
        
        this.mostrarPdfPreview = true;
      } catch (error) {
        console.error('Error al generar PDF con Canva:', error);
        this.$toast.error('Error al generar el informe con Canva. Por favor, inténtelo de nuevo.');
      } finally {
        this.generandoPDF = false;
      }
    },

    /**
     * Descarga el PDF generado por Canva
     */
    descargarPDF() {
      if (this.canvaData) {
        PDFService.guardarPDF(this.canvaData, `informe_${this.empresa?.nombre || 'empresa'}.pdf`);
      } else {
        this.$toast.error('No hay un diseño disponible para descargar. Por favor, genérelo primero.');
      }
    },

    /**
     * Abre el diseño en Canva para edición
     */
    editarEnCanva() {
      if (this.canvaData && this.canvaData.designID) {
        PDFService.abrirEnCanva(this.canvaData.designID);
      } else {
        this.$toast.error('No se puede editar el diseño en Canva. Por favor, genere un nuevo informe.');
      }
    }
  },
};
</script>

<style>
  /* ... existing style code ... */
</style> 