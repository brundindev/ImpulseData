<template>
  <div>
    <!-- Botón para generar el PDF -->
    <button @click="generatePdf" class="pdf-button">
      Generar PDF
    </button>

    <!-- Plantilla que se convertirá en PDF -->
    <div ref="pdfTemplate" class="pdf-template">
      <div class="pdf-header">
        <img 
          :src="logoUrl" 
          alt="Logo de la empresa" 
          class="pdf-logo" 
        />
        <h1>{{ title }}</h1>
      </div>
      
      <div class="pdf-content">
        <h2>{{ subtitle }}</h2>
        <p>{{ description }}</p>
        
        <!-- Tabla de datos -->
        <table class="pdf-table" v-if="tableData.length > 0">
          <thead>
            <tr>
              <th v-for="(header, index) in tableHeaders" :key="index">
                {{ header }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rowIndex) in tableData" :key="rowIndex">
              <td v-for="(cell, cellIndex) in row" :key="cellIndex">
                {{ cell }}
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- Imágenes de Cloudinary -->
        <div class="pdf-images">
          <div v-for="(image, index) in images" :key="index" class="pdf-image-container">
            <SimpleCloudinaryImage 
              :publicId="image.publicId" 
              :alt="image.alt || 'Imagen'" 
              :width="image.width" 
              :height="image.height"
              forPdf 
            />
            <p class="image-caption" v-if="image.caption">{{ image.caption }}</p>
          </div>
        </div>
      </div>
      
      <div class="pdf-footer">
        <p>{{ footerText }}</p>
        <p>Generado el {{ currentDate }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import SimpleCloudinaryImage from './SimpleCloudinaryImage.vue';
import PdfService from '../services/PDFService';

const props = defineProps({
  title: {
    type: String,
    default: 'Informe'
  },
  subtitle: {
    type: String,
    default: 'Datos del informe'
  },
  description: {
    type: String,
    default: 'Este es un informe generado automáticamente.'
  },
  logoPublicId: {
    type: String,
    default: '' // ID público de tu logo en Cloudinary
  },
  tableHeaders: {
    type: Array,
    default: () => []
  },
  tableData: {
    type: Array,
    default: () => []
  },
  images: {
    type: Array,
    default: () => []
  },
  footerText: {
    type: String,
    default: '© 2025 ImpulseData. Todos los derechos reservados.'
  },
  filename: {
    type: String,
    default: 'informe.pdf'
  }
});

const pdfTemplate = ref(null);

// Obtener la URL del logo desde Cloudinary de forma manual
const logoUrl = computed(() => {
  if (!props.logoPublicId) return '';
  
  // Generar URL de Cloudinary sin el SDK
  const cloudName = 'drqt6gd5v';
  return `https://res.cloudinary.com/${cloudName}/image/upload/w_200,q_auto/${props.logoPublicId}`;
});

// Fecha actual formateada
const currentDate = computed(() => {
  const now = new Date();
  return now.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

// Método para generar el PDF
const generatePdf = async () => {
  if (!pdfTemplate.value) return;
  
  try {
    // Obtener opciones para el PDF
    const options = {
      filename: props.filename,
      margin: 10,
      orientation: 'portrait',
      format: 'a4'
    };
    
    // Generar el PDF usando el servicio
    await PdfService.generatePdfFromTemplate(pdfTemplate.value, options);
  } catch (error) {
    console.error('Error al generar el PDF:', error);
  }
};
</script>

<style scoped>
.pdf-button {
  background: linear-gradient(90deg, #00c3ff, #00ff8c);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.pdf-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.pdf-template {
  width: 210mm; /* Tamaño A4 */
  padding: 15mm;
  background-color: white;
  color: #333;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
}

.pdf-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.pdf-logo {
  height: 50px;
  margin-right: 20px;
  object-fit: contain;
}

.pdf-header h1 {
  margin: 0;
  color: #004698;
  font-size: 24px;
}

.pdf-content h2 {
  color: #5175a0;
  font-size: 18px;
  margin-top: 0;
}

.pdf-table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}

.pdf-table th, .pdf-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.pdf-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.pdf-images {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin: 20px 0;
}

.pdf-image-container {
  max-width: 45%;
}

.image-caption {
  font-size: 14px;
  text-align: center;
  margin-top: 5px;
  font-style: italic;
  color: #666;
}

.pdf-footer {
  margin-top: 30px;
  padding-top: 10px;
  border-top: 1px solid #eee;
  font-size: 12px;
  color: #666;
  text-align: center;
}
</style> 