<template>
  <div class="pdf-example-view">
    <h1>Generación de PDF de {{ empresa ? empresa.nombre : 'Empresa' }}</h1>
    
    <div class="options-panel">
      <h2>Opciones del PDF</h2>
      
      <!-- Opciones básicas -->
      <div class="form-group">
        <label for="title">Título:</label>
        <input id="title" v-model="pdfOptions.title" type="text" />
      </div>
      
      <div class="form-group">
        <label for="subtitle">Subtítulo:</label>
        <input id="subtitle" v-model="pdfOptions.subtitle" type="text" />
      </div>
      
      <div class="form-group">
        <label for="description">Descripción:</label>
        <textarea id="description" v-model="pdfOptions.description" rows="3"></textarea>
      </div>
      
      <div class="form-group">
        <label for="filename">Nombre del archivo:</label>
        <input id="filename" v-model="pdfOptions.filename" type="text" />
      </div>
      
      <!-- Selector de logo -->
      <div class="form-group">
        <label>Logo:</label>
        <div class="logo-selector">
          <img 
            v-if="pdfOptions.logoPublicId" 
            :src="getCloudinaryUrl(pdfOptions.logoPublicId, {width: 100})" 
            alt="Logo" 
            class="preview-image"
          />
          <button @click="selectImage('logo')" class="btn-select">Seleccionar Logo</button>
        </div>
      </div>
      
      <!-- Selector de imágenes -->
      <div class="form-group">
        <label>Imágenes:</label>
        <div class="images-list">
          <div v-for="(image, index) in pdfOptions.images" :key="index" class="image-item">
            <img 
              :src="getCloudinaryUrl(image.publicId, {width: 100})" 
              :alt="image.alt || 'Imagen'" 
              class="preview-image"
            />
            <div class="image-item-controls">
              <input v-model="image.caption" placeholder="Título de la imagen" />
              <button @click="removeImage(index)" class="btn-remove">Eliminar</button>
            </div>
          </div>
          <button @click="selectImage('pdf')" class="btn-add">Añadir Imagen</button>
        </div>
      </div>
      
      <!-- Opciones de tabla -->
      <div class="form-group">
        <label>Tabla de datos:</label>
        <button @click="addTableRow" class="btn-add">Añadir Fila</button>
        <table class="editable-table" v-if="pdfOptions.tableData.length > 0">
          <thead>
            <tr>
              <th v-for="(header, index) in pdfOptions.tableHeaders" :key="index">
                <input v-model="pdfOptions.tableHeaders[index]" placeholder="Encabezado" />
              </th>
              <th v-if="pdfOptions.tableHeaders.length > 0">Acciones</th>
              <th v-else>
                <button @click="addTableColumn" class="btn-add-sm">+</button>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rowIndex) in pdfOptions.tableData" :key="rowIndex">
              <td v-for="(cell, cellIndex) in row" :key="cellIndex">
                <input v-model="pdfOptions.tableData[rowIndex][cellIndex]" placeholder="Dato" />
              </td>
              <td>
                <button @click="removeTableRow(rowIndex)" class="btn-remove-sm">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else class="empty-table-message">
          <p>No hay datos en la tabla. Añade una fila para comenzar.</p>
        </div>
      </div>
    </div>
    
    <!-- Vista previa con la plantilla de PlantillaPDF -->
    <div class="preview-panel">
      <h2>Vista Previa</h2>
      <div ref="pdfTemplate" class="pdf-template">
        <!-- Contenedor para insertar la plantilla de PlantillaPDF -->
        <div id="plantilla-container" v-html="plantillaHTML"></div>
      </div>
    </div>
    
    <!-- Botón para generar el PDF -->
    <div class="action-buttons">
      <button @click="generatePdf" class="pdf-button">
        Generar PDF
      </button>
    </div>
    
    <!-- Diálogo para seleccionar imágenes -->
    <div v-if="showImageSelector" class="image-selector-overlay">
      <div class="image-selector-dialog">
        <h3>Seleccionar Imagen</h3>
        
        <!-- Opciones para cargar imagen -->
        <div class="upload-section">
          <input type="file" @change="handleFileSelect" accept="image/*" ref="fileInput" />
          <button @click="$refs.fileInput.click()" class="btn-upload">Seleccionar archivo</button>
          
          <div v-if="uploadStatus" class="upload-status">
            {{ uploadStatus }}
          </div>
        </div>
        
        <!-- Imágenes disponibles -->
        <div class="available-images">
          <h4>Imágenes disponibles:</h4>
          <div class="images-grid">
            <div v-for="image in availableImages" :key="image.publicId" class="grid-item">
              <img 
                :src="getCloudinaryUrl(image.publicId, {width: 100})" 
                alt="Imagen disponible" 
                class="preview-image"
                @click="selectAvailableImage(image.publicId)"
              />
            </div>
          </div>
        </div>
        
        <div class="dialog-buttons">
          <button @click="showImageSelector = false" class="btn-cancel">Cancelar</button>
        </div>
      </div>
    </div>

    <!-- Añadir un indicador de carga en lugar del alert -->
    <div class="loading-overlay" v-if="isGenerating">
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <div class="loading-text">{{ loadingMessage }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue';
import { crearPlantillaPDF, html } from '../utils/PlantillaPDF';
import html2canvas from 'html2canvas';
import SimpleCloudinaryService from '../services/SimpleCloudinaryService';
import jsPDF from 'jspdf';

// Referencias a elementos del DOM
const pdfTemplate = ref(null);
const fileInput = ref(null);

// Datos de la empresa
const empresa = ref(null);

// Plantilla HTML generada a partir de PlantillaPDF.js
const plantillaHTML = ref("");

// Opciones del PDF
const pdfOptions = reactive({
  title: 'Informe de Empresa',
  subtitle: 'Resumen de actividades',
  description: 'Este informe contiene el resumen de las actividades de la empresa.',
  logoPublicId: '', // ID público del logo en Cloudinary
  tableHeaders: ['ID', 'Nombre', 'Fecha', 'Estado'],
  tableData: [
    ['001', 'Tarea 1', '01/05/2025', 'Completada'],
    ['002', 'Tarea 2', '15/05/2025', 'En progreso'],
    ['003', 'Tarea 3', '30/05/2025', 'Pendiente']
  ],
  images: [], // Array de objetos {publicId, alt, caption, width, height}
  footerText: '© 2025 ImpulseData. Todos los derechos reservados.',
  filename: 'informe-empresa.pdf'
});

// Estado del selector de imágenes
const showImageSelector = ref(false);
const currentImageType = ref(''); // 'logo' o 'pdf'
const uploadStatus = ref('');

// Imágenes disponibles
const availableImages = ref([
  { publicId: 'sample', alt: 'Muestra general' },
  { publicId: 'samples/landscapes/nature-mountains', alt: 'Montañas' },
  { publicId: 'samples/food/pot-mussels', alt: 'Comida' },
  { publicId: 'samples/ecommerce/accessories-bag', alt: 'Producto' }
]);

// Dentro del script, añadir estas variables reactivas
const isGenerating = ref(false);
const loadingMessage = ref('');

// Función para obtener URL de Cloudinary
const getCloudinaryUrl = (publicId, options = {}) => {
  if (!publicId) return '';
  
  const { width, height, format, quality } = options;
  
  // URL base de Cloudinary
  let url = `https://res.cloudinary.com/drqt6gd5v/image/upload`;
  
  // Transformaciones
  const transformations = [];
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (format && format !== 'auto') transformations.push(`f_${format}`);
  if (quality && quality !== 'auto') transformations.push(`q_${quality}`);
  else transformations.push('q_auto');
  
  // Añadir transformaciones a la URL
  if (transformations.length > 0) {
    url += `/${transformations.join(',')}`;
  }
  
  // Añadir el ID público a la URL
  url += `/${publicId}`;
  
  return url;
};

// Cargar la plantilla HTML
const loadPlantillaHTML = async () => {
  try {
    // Obtener el HTML de la plantilla sin modificar
    const htmlTemplate = await crearPlantillaPDF();
    
    // Actualizar la variable reactiva directamente sin personalizar
    plantillaHTML.value = htmlTemplate;
    
    console.log("Plantilla HTML cargada correctamente");
    
    // Asegurarse de que el contenedor se actualice correctamente
    setTimeout(() => {
      const container = document.getElementById('plantilla-container');
      if (container) {
        // Forzar la actualización del DOM con el contenido original
        container.innerHTML = htmlTemplate;
      }
    }, 100);
  } catch (error) {
    console.error("Error al cargar la plantilla HTML:", error);
    plantillaHTML.value = html; // Usar el HTML base como fallback
  }
};

// Abrir selector de imágenes
const selectImage = (type) => {
  currentImageType.value = type;
  showImageSelector.value = true;
};

// Seleccionar una imagen disponible
const selectAvailableImage = (publicId) => {
  if (currentImageType.value === 'logo') {
    pdfOptions.logoPublicId = publicId;
  } else {
    pdfOptions.images.push({
      publicId,
      alt: 'Imagen',
      caption: 'Descripción de la imagen',
      width: null,
      height: null
    });
  }
  showImageSelector.value = false;
};

// Eliminar una imagen
const removeImage = (index) => {
  pdfOptions.images.splice(index, 1);
};

// Manejar la selección de archivo
const handleFileSelect = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  try {
    uploadStatus.value = 'Subiendo imagen...';
    
    // Usar el servicio simplificado para subir la imagen
    const result = await SimpleCloudinaryService.uploadImage(file);
    
    if (result && result.public_id) {
      // Añadir la imagen a nuestra lista
      const publicId = result.public_id;
      
      if (currentImageType.value === 'logo') {
        pdfOptions.logoPublicId = publicId;
      } else {
        pdfOptions.images.push({
          publicId,
          alt: file.name,
          caption: 'Imagen subida',
          width: null,
          height: null
        });
      }
      
      uploadStatus.value = 'Imagen subida correctamente.';
      
      // También añadir a las disponibles
      availableImages.value.push({
        publicId,
        alt: file.name
      });
      
      setTimeout(() => {
        showImageSelector.value = false;
        uploadStatus.value = '';
      }, 1500);
    } else {
      throw new Error('La respuesta no contiene el ID público de la imagen');
    }
  } catch (error) {
    console.error('Error al subir la imagen:', error);
    if (error.response && error.response.data) {
      console.error('Error de Cloudinary:', error.response.data);
      uploadStatus.value = `Error: ${error.response.data.error?.message || 'Verifica tu upload_preset en Cloudinary'}`;
    } else {
      uploadStatus.value = 'Error al subir la imagen. Verifica que hayas creado un upload preset público.';
    }
  }
};

// Funciones para la tabla
const addTableRow = () => {
  // Crear una nueva fila con celdas vacías según las columnas actuales
  const newRow = pdfOptions.tableHeaders.map(() => '');
  pdfOptions.tableData.push(newRow);
  
  // Si no hay encabezados, añadir uno por defecto
  if (pdfOptions.tableHeaders.length === 0) {
    pdfOptions.tableHeaders.push('Columna 1');
  }
};

const removeTableRow = (index) => {
  pdfOptions.tableData.splice(index, 1);
};

const addTableColumn = () => {
  // Añadir una nueva columna al encabezado
  const columnIndex = pdfOptions.tableHeaders.length;
  pdfOptions.tableHeaders.push(`Columna ${columnIndex + 1}`);
  
  // Añadir celda vacía a cada fila existente
  pdfOptions.tableData.forEach(row => {
    row.push('');
  });
};

// Método para generar el PDF a partir de la plantilla HTML mostrada en la vista previa
const generatePdf = async () => {
  try {
    // Activar indicador de carga
    isGenerating.value = true;
    loadingMessage.value = 'Preparando la plantilla...';
    
    // Asegurarse de que la plantilla esté actualizada (sin personalizar)
    await loadPlantillaHTML();
    
    // Dar tiempo al DOM para actualizarse antes de la captura
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    loadingMessage.value = 'Generando PDF desde la plantilla HTML...';
    
    // Obtener el elemento que contiene la plantilla HTML
    const plantillaContainer = document.getElementById('plantilla-container');
    if (!plantillaContainer) {
      throw new Error('No se encontró el contenedor de la plantilla');
    }
    
    // Crear un iframe temporal para renderizar correctamente la plantilla con estilos
    const iframe = document.createElement('iframe');
    iframe.style.width = '793px';  // Ancho A4 en px (210mm)
    iframe.style.height = '1122px'; // Alto A4 en px (297mm)
    iframe.style.position = 'absolute';
    iframe.style.top = '-9999px';
    iframe.style.left = '-9999px';
    document.body.appendChild(iframe);
    
    // Copiar todo el contenido de la plantilla al iframe
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>PDF</title>
          <style>
            body { 
              margin: 0; 
              padding: 0; 
              background: white; 
              font-family: Arial, sans-serif;
              color: #000;
            }
            * { box-sizing: border-box; }
            .page { 
              page-break-after: always; 
              break-after: page;
              margin: 0;
              padding: 0;
              width: 100%;
              background: white;
              border: none;
              box-shadow: none;
              min-height: 1122px;
              height: auto;
              position: relative;
              overflow: hidden;
            }
            .page:last-child {
              page-break-after: auto;
              break-after: auto;
            }
            img {
              max-width: 100%;
              height: auto;
              display: block;
            }
            /* Evitar elementos huérfanos al final de una página */
            p, h1, h2, h3, h4, h5, h6 {
              page-break-inside: avoid;
              break-inside: avoid;
            }
            /* Evitar saltos de página dentro de secciones críticas */
            .no-break {
              page-break-inside: avoid;
              break-inside: avoid;
            }
          </style>
        </head>
        <body>${plantillaHTML.value}</body>
      </html>
    `);
    iframeDoc.close();
    
    // Dar tiempo para que el iframe renderice completamente
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Crear el PDF con html2canvas para cada página
    loadingMessage.value = 'Capturando la plantilla para el PDF...';
    
    // Obtener todas las secciones que deben ser páginas separadas
    const pages = iframeDoc.querySelectorAll('.page, .pagebreak');
    
    // Crear el documento PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });
    
    // Procesar cada página
    let pageIndex = 0;
    
    // Función para procesar páginas secuencialmente
    const processPage = async (index) => {
      if (index >= pages.length) {
        // Todas las páginas procesadas, terminar
        loadingMessage.value = 'Finalizando PDF...';
        
        // Nombre del archivo
        const filename = pdfOptions.filename.endsWith('.pdf') ? 
                        pdfOptions.filename : 
                        `${pdfOptions.filename}.pdf`;
        
        loadingMessage.value = 'Descargando PDF...';
        
        // Descargar el PDF
        pdf.save(filename);
        
        // Limpiar
        document.body.removeChild(iframe);
        
        loadingMessage.value = '¡PDF generado con éxito!';
        
        // Cerrar indicador de carga
        setTimeout(() => {
          isGenerating.value = false;
        }, 1000);
        
        return;
      }
      
      const page = pages[index];
      
      // Verificar si es un elemento .pagebreak sin contenido (solo generar nueva página)
      if (page.classList.contains('pagebreak') || 
          (page.tagName === 'DIV' && page.clientHeight < 10)) {
        // Si es solo un separador de página, añadir nueva página y continuar
        if (index > 0) {
          pdf.addPage();
        }
        
        // Procesar la siguiente página
        setTimeout(() => processPage(index + 1), 50);
        return;
      }
      
      loadingMessage.value = `Procesando página ${index + 1} de ${pages.length}...`;
      
      try {
        // Asegurarse que la página tenga dimensiones válidas
        if (!page.offsetWidth || !page.offsetHeight) {
          console.warn(`Página ${index + 1} tiene dimensiones inválidas, saltando...`);
          setTimeout(() => processPage(index + 1), 50);
          return;
        }
        
        // Capturar la página actual con html2canvas
        const canvas = await html2canvas(page, {
          scale: 2, // Mayor calidad (estaba en 1.5)
          useCORS: true,
          logging: false,
          allowTaint: true,
          backgroundColor: '#ffffff',
          // Quitar windowWidth y windowHeight para usar dimensiones naturales
          ignoreElements: (element) => {
            return element.classList.contains('pagebreak') ||
                  (element.tagName === 'DIV' && !element.textContent.trim() && !element.getElementsByTagName('img').length);
          }
        });
        
        // Verificar que el canvas tenga dimensiones válidas
        if (canvas.width < 10 || canvas.height < 10) {
          console.warn(`Canvas para página ${index + 1} tiene dimensiones demasiado pequeñas, saltando...`);
          setTimeout(() => processPage(index + 1), 50);
          return;
        }
        
        // Si no es la primera página, añadir una nueva
        if (index > 0) {
          pdf.addPage();
        }
        
        // Convertir canvas a imagen y añadir al PDF
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        
        // Ajustar la imagen al tamaño de la página A4
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        
        // Usar dimensiones fijas de página PDF, sin comprimir el contenido
        pdf.addImage(
          imgData, 
          'JPEG', 
          0, // x - sin márgenes
          0, // y - sin márgenes
          pageWidth, // Ancho completo de la página
          pageHeight // Alto completo de la página
        );
        
        // Procesar la siguiente página
        setTimeout(() => processPage(index + 1), 50);
      } catch (error) {
        console.error(`Error al procesar página ${index + 1}:`, error);
        
        // Añadir una página en blanco en caso de error
        if (index > 0) {
          pdf.addPage();
        }
        pdf.setFontSize(12);
        pdf.text(`[Error en página ${index + 1}]`, 20, 20);
        
        // Continuar con la siguiente página
        setTimeout(() => processPage(index + 1), 50);
      }
    };
    
    // Iniciar el procesamiento de páginas
    processPage(0);
    
  } catch (error) {
    console.error('Error al generar el PDF:', error);
    
    loadingMessage.value = 'Error al generar el PDF. Intentando método alternativo...';
    
    // Intentar usar un método alternativo basado en html2pdf.js
    try {
      // Crear un iframe temporal
      const iframe = document.createElement('iframe');
      iframe.style.width = '793px'; // Ancho A4 en px (210mm)
      iframe.style.height = '1122px'; // Alto A4 en px (297mm)
      iframe.style.position = 'absolute';
      iframe.style.top = '-9999px';
      iframe.style.left = '-9999px';
      document.body.appendChild(iframe);
      
      // Cargar la plantilla en el iframe
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      iframeDoc.open();
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <title>PDF</title>
            <style>
              @page {
                margin: 15mm;
                size: A4 portrait;
              }
              body { 
                margin: 0; 
                padding: 0; 
                background: white; 
                font-family: Arial, sans-serif;
                color: #000;
              }
              * { box-sizing: border-box; }
              .page, .pagebreak { 
                page-break-after: always; 
                break-after: page;
              }
              .page:last-child {
                page-break-after: auto;
                break-after: auto;
              }
            </style>
          </head>
          <body>${plantillaHTML.value}</body>
        </html>
      `);
      iframeDoc.close();
      
      // Esperar a que el contenido se cargue
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Nombre del archivo
      const filename = pdfOptions.filename.endsWith('.pdf') ? 
                      pdfOptions.filename : 
                      `${pdfOptions.filename}.pdf`;
      
      // Crear PDF simplificado si todo lo anterior falló
      if (!iframeDoc.body.textContent.trim()) {
        const pdf = new jsPDF();
        pdf.setFontSize(18);
        pdf.setTextColor(0, 70, 152);
        pdf.text('Memoria de Actividad - Impulsalicante', 20, 20);
        
        pdf.setFontSize(12);
        pdf.setTextColor(0, 0, 0);
        pdf.text('La plantilla es demasiado compleja para convertir directamente.', 20, 40);
        pdf.text('Por favor, utilice la función de impresión del navegador para', 20, 50);
        pdf.text('guardar la vista previa como PDF.', 20, 60);
        
        // Guardar PDF
        pdf.save(filename);
      }
      
      // Limpiar
      document.body.removeChild(iframe);
      
      loadingMessage.value = 'Se ha generado una versión básica del PDF.';
      setTimeout(() => {
        isGenerating.value = false;
      }, 2000);
      
    } catch (fallbackError) {
      console.error('Error también en el método alternativo:', fallbackError);
      loadingMessage.value = 'Error al generar el PDF. Por favor, utilice la función de impresión del navegador.';
      setTimeout(() => {
        isGenerating.value = false;
      }, 2000);
    }
  }
};

// Al montar el componente, recuperar los datos de la empresa y cargar la plantilla
onMounted(async () => {
  try {
    // Obtener datos de empresa desde localStorage
    const empresaData = localStorage.getItem('empresa_pdf');
    if (empresaData) {
      empresa.value = JSON.parse(empresaData);
      console.log('Datos de empresa recuperados:', empresa.value);
      
      // Rellenar opciones del PDF con datos de la empresa
      pdfOptions.title = `Informe de ${empresa.value.nombre}`;
      pdfOptions.subtitle = `Datos principales de ${empresa.value.nombre}`;
      pdfOptions.description = empresa.value.descripcion || 'Informe detallado de la empresa.';
      pdfOptions.filename = `informe_${empresa.value.nombre.replace(/\s+/g, '_')}.pdf`;
    } else {
      console.warn('No se encontraron datos de empresa en localStorage');
    }
    
    // Cargar la plantilla HTML
    await loadPlantillaHTML();
    
    // Cargar imágenes disponibles desde Cloudinary a través del backend
    try {
      loadingMessage.value = 'Cargando imágenes disponibles...';
      isGenerating.value = true;
      
      const images = await SimpleCloudinaryService.getAllImages(50);
      if (images && images.length > 0) {
        availableImages.value = images;
      }
      
      console.log('Imágenes cargadas correctamente:', availableImages.value.length);
    } catch (imageError) {
      console.error('Error al cargar imágenes:', imageError);
      // Mantenemos las imágenes por defecto
    } finally {
      loadingMessage.value = '';
      isGenerating.value = false;
    }
    
  } catch (error) {
    console.error('Error al inicializar componente:', error);
  }
});

// Actualizar la plantilla cuando cambian las opciones
watch(pdfOptions, async () => {
  await loadPlantillaHTML();
}, { deep: true });
</script>

<style scoped>
.pdf-example-view {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

h1 {
  color: #004698;
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;
}

.options-panel {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #5175a0;
}

input, textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
  background-color: #fff;
}

.logo-selector, .images-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.image-item {
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.image-item-controls {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.preview-image {
  max-width: 100px;
  max-height: 100px;
  object-fit: contain;
  border-radius: 4px;
}

.editable-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.editable-table th, .editable-table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.editable-table input {
  width: 100%;
  border: 1px solid transparent;
  background: transparent;
  padding: 4px;
  color: #333;
}

.editable-table input:focus {
  border-color: #00c3ff;
  background: white;
  color: #333;
}

.empty-table-message {
  text-align: center;
  color: #999;
  font-style: italic;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 4px;
}

/* Botones */
.btn-select, .btn-add, .btn-remove, .btn-add-sm, .btn-remove-sm, .btn-upload, .btn-cancel {
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  color: white;
}

.btn-select, .btn-add, .btn-upload {
  background: linear-gradient(90deg, #00c3ff, #00ff8c);
}

.btn-remove, .btn-cancel {
  background: #ff5252;
}

.btn-add-sm, .btn-remove-sm {
  padding: 2px 6px;
  font-size: 12px;
}

.btn-add-sm {
  background: #00c3ff;
}

.btn-remove-sm {
  background: #ff5252;
}

/* Selector de imágenes */
.image-selector-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.image-selector-dialog {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  width: 80%;
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;
}

.upload-section {
  margin: 20px 0;
  padding: 15px;
  border: 2px dashed #ddd;
  border-radius: 4px;
  text-align: center;
}

.upload-section input[type="file"] {
  display: none;
}

.upload-status {
  margin-top: 10px;
  padding: 5px;
  border-radius: 4px;
  background: #f0f0f0;
  font-size: 14px;
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 15px;
  margin-top: 15px;
}

.grid-item {
  cursor: pointer;
  border: 2px solid transparent;
  border-radius: 4px;
  padding: 5px;
  transition: all 0.2s;
}

.grid-item:hover {
  border-color: #00c3ff;
  transform: scale(1.05);
}

.dialog-buttons {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.preview-panel {
  margin-top: 30px;
}

.pdf-template {
  width: 210mm; /* Tamaño A4 */
  margin: 0 auto;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.action-buttons {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.pdf-button {
  background: linear-gradient(90deg, #00c3ff, #00ff8c);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px 25px;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.pdf-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-content {
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  text-align: center;
  max-width: 80%;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.loading-spinner {
  display: inline-block;
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #004698;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

.loading-text {
  font-size: 16px;
  color: #333;
  font-weight: bold;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style> 