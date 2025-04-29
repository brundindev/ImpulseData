<template>
  <!-- ... existing template code ... -->
</template>

<script>
import PDFService from '../services/PDFService';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    return { router };
  },
  
  data() {
    return {
      generandoPDF: false,
    };
  },

  methods: {
    /**
     * Redirige a la página de PDF con la empresa actual
     */
    generarPDF() {
      try {
        // Almacenar los datos de la empresa en localStorage para recuperarlos en la página PDF
        localStorage.setItem('empresa_pdf', JSON.stringify(this.empresa));
        
        // Redirigir a la página /pdf
        this.router.push('/pdf');
      } catch (error) {
        console.error('Error al redirigir a la página PDF:', error);
        this.$toast.error('Error al abrir la página de PDF. Por favor, inténtelo de nuevo.');
      }
    },
  },
};
</script>

<style>
  /* ... existing style code ... */
</style> 