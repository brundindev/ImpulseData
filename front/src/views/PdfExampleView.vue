<template>
  <div class="pdf-example-view">
    <h1>Generación de PDF de {{ empresa ? empresa.nombre : 'Empresa' }}</h1>
    
    <!-- Sección de información de la empresa -->
    <div class="empresa-info-panel" v-if="empresa">
      <h2>Información de la Empresa</h2>
      
      <div class="empresa-info-grid">
        <!-- Información general -->
        <div class="empresa-section">
          <h3>Información General</h3>
          <div class="info-item">
            <div class="info-label">Nombre:</div>
            <input v-model="empresa.nombre" class="info-input" type="text" />
          </div>
          <div class="info-item">
            <div class="info-label">Ciudad:</div>
            <input v-model="empresa.ciudad" class="info-input" type="text" placeholder="No especificada" />
          </div>
          <div class="info-item">
            <div class="info-label">Fecha de creación:</div>
            <input v-model="empresa.fechaCreacion" class="info-input" type="date" />
          </div>
          <div class="info-item">
            <div class="info-label">Descripción:</div>
            <textarea v-model="empresa.descripcion" class="info-textarea" rows="3" placeholder="Sin descripción"></textarea>
          </div>
          
          <!-- Selector de logo -->
          <div class="info-item">
            <div class="info-label">Logo:</div>
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
        </div>
        
        <!-- Departamentos -->
        <div class="empresa-section">
          <h3>Departamentos</h3>
          <div v-if="!empresa.departamentos || empresa.departamentos.length === 0" class="empty-message">
            No hay departamentos registrados
          </div>
          <div v-else class="items-list">
            <div v-for="(departamento, index) in empresa.departamentos" :key="index" class="list-item">
              <div class="item-header">Departamento {{ index + 1 }}</div>
              <div class="info-item">
                <div class="info-label">Nombre:</div>
                <input v-model="departamento.nombre" class="info-input" type="text" />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Centros -->
        <div class="empresa-section">
          <h3>Centros</h3>
          <div v-if="!empresa.centros || empresa.centros.length === 0" class="empty-message">
            No hay centros registrados
          </div>
          <div v-else class="items-list">
            <div v-for="(centro, index) in empresa.centros" :key="index" class="list-item">
              <div class="item-header">Centro {{ index + 1 }}</div>
              <div class="info-item">
                <div class="info-label">Nombre:</div>
                <input v-model="centro.nombre" class="info-input" type="text" />
              </div>
              <div class="info-item">
                <div class="info-label">Dirección:</div>
                <input v-model="centro.direccion" class="info-input" type="text" placeholder="No especificada" />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Formaciones -->
        <div class="empresa-section">
          <h3>Formaciones</h3>
          <div v-if="!empresa.formaciones || empresa.formaciones.length === 0" class="empty-message">
            No hay formaciones registradas
          </div>
          <div v-else class="items-list">
            <div v-for="(formacion, index) in empresa.formaciones" :key="index" class="list-item">
              <div class="item-header">Formación {{ index + 1 }}</div>
              <div class="info-item">
                <div class="info-label">Nombre:</div>
                <input v-model="formacion.nombre" class="info-input" type="text" />
              </div>
              <div class="info-item">
                <div class="info-label">Tipo:</div>
                <select v-model="formacion.tipo" class="info-select">
                  <option value="presencial">Presencial</option>
                  <option value="online">Online</option>
                  <option value="mixta">Mixta</option>
                  <option value="externa">Externa</option>
                </select>
              </div>
              <div class="info-item">
                <div class="info-label">Duración (horas):</div>
                <input v-model.number="formacion.duracion" class="info-input" type="number" min="0" />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Opciones adicionales -->
        <div class="empresa-section">
          <h3>Opciones del PDF</h3>
          <div class="info-item">
            <div class="info-label">Título del documento:</div>
            <input v-model="pdfOptions.title" class="info-input" type="text" />
          </div>
          <div class="info-item">
            <div class="info-label">Subtítulo:</div>
            <input v-model="pdfOptions.subtitle" class="info-input" type="text" />
          </div>
          <div class="info-item">
            <div class="info-label">Nombre del archivo:</div>
            <input v-model="pdfOptions.filename" class="info-input" type="text" />
          </div>
          <!-- Selector de imágenes -->
          <div class="info-item">
            <div class="info-label">Imágenes:</div>
            <div class="images-list">
              <div v-for="(image, index) in pdfOptions.images" :key="index" class="image-item">
                <img 
                  :src="getCloudinaryUrl(image.publicId, {width: 100})" 
                  :alt="image.alt || 'Imagen'" 
                  class="preview-image"
                />
                <div class="image-item-controls">
                  <input v-model="image.caption" placeholder="Título de la imagen" class="info-input" />
                  <button @click="removeImage(index)" class="btn-remove">Eliminar</button>
                </div>
              </div>
              <button @click="selectImage('pdf')" class="btn-add">Añadir Imagen</button>
            </div>
          </div>
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
    
    <!-- Selector de Imágenes mejorado -->
    <div v-if="showImageSelector" class="image-selector-overlay">
      <div class="image-selector-dialog">
        <div class="image-selector-header">
          <h3>Selecciona una imagen</h3>
          <button @click="showImageSelector = false" class="close-button">&times;</button>
        </div>
        
        <div class="image-selector-content">
          <!-- Campo de búsqueda -->
          <div class="search-container">
            <input 
              type="text" 
              v-model="imageFilter" 
              placeholder="Buscar imágenes..." 
              @input="filterImages"
              class="search-input"
            />
          </div>
          
          <!-- Cargando imágenes -->
          <div v-if="isLoadingImages" class="loading-images">
            <div class="loading-spinner"></div>
            <p>Cargando imágenes...</p>
          </div>
          
          <!-- Sin imágenes -->
          <div v-else-if="availableImages.length === 0" class="no-images">
            <p>No se encontraron imágenes disponibles</p>
            <p class="upload-prompt">Puedes subir una nueva imagen usando el formulario de abajo</p>
          </div>
          
          <!-- Grid de imágenes -->
          <div v-else class="images-grid">
            <div 
              v-for="image in paginatedImages" 
              :key="image.publicId" 
              class="image-item"
              @click="selectAvailableImage(image.publicId)"
            >
              <div class="image-preview-container">
                <img 
                  :src="getCloudinaryUrl(image.publicId, { width: 120, height: 120 })" 
                  :alt="image.alt"
                  class="image-preview"
                  @error="handleImageLoadError"
                  loading="lazy"
                />
              </div>
              <div class="image-name">{{ image.alt }}</div>
            </div>
          </div>
          
          <!-- Paginación -->
          <div v-if="totalPages > 1" class="pagination">
            <button 
              @click="currentPage > 1 && (currentPage--)" 
              :disabled="currentPage === 1"
              class="pagination-button"
            >
              &laquo; Anterior
            </button>
            
            <span class="page-info">{{ currentPage }} de {{ totalPages }}</span>
            
            <button 
              @click="currentPage < totalPages && (currentPage++)" 
              :disabled="currentPage === totalPages"
              class="pagination-button"
            >
              Siguiente &raquo;
            </button>
          </div>
        </div>
        
        <!-- Sección de subida de archivos -->
        <div class="upload-section">
          <h4>Subir una nueva imagen</h4>
          <div class="file-upload-container">
            <input type="file" id="file-upload" @change="handleFileSelect" accept="image/*" ref="fileInput" class="file-input" />
            <label for="file-upload" class="file-upload-label">
              <span class="upload-icon">📷</span>
              <span class="upload-text">Seleccionar imagen</span>
            </label>
          </div>
          <div v-if="uploadStatus" class="upload-status" :class="{'upload-error': uploadStatus.includes('Error')}">
            {{ uploadStatus }}
          </div>
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
import { ref, reactive, onMounted, computed, watch, onUnmounted } from 'vue';
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

// Dentro del script, añadir estas variables reactivas
const isGenerating = ref(false);
const loadingMessage = ref('');

// Verificar que la sesión se mantiene activa
const tokenInicial = localStorage.getItem('authToken');
if (tokenInicial) {
  console.log("Vista PDF: Sesión activa detectada");
}

// Funciones para mantener la sesión activa
const verificarSesion = () => {
  const tokenActual = localStorage.getItem('authToken');
  if (!tokenActual && tokenInicial) {
    console.warn("Vista PDF: Token de sesión perdido, pero manteniendo la vista");
    // Restaurar el token en lugar de redirigir
    localStorage.setItem('authToken', tokenInicial);
  }
};

// Verificar la sesión periódicamente mientras se usa la vista PDF
const intervaloVerificacion = setInterval(verificarSesion, 5000);

// Función para formatear fechas
const formatDate = (dateString) => {
  if (!dateString) return 'No especificada';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Error al formatear fecha:', error);
    return dateString;
  }
};

// Limpiar el intervalo cuando se desmonta el componente
onMounted(() => {
  console.log("Componente PDF montado correctamente");
  verificarSesion();
  
  // Cargar imágenes inmediatamente
  loadAvailableImages();
  
  // Después cargar la plantilla HTML
  setTimeout(() => {
    loadPlantillaHTML();
  }, 500);
});

onUnmounted(() => {
  console.log("Componente PDF desmontado");
  clearInterval(intervaloVerificacion);
});

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

// Paginación y filtrado
const allAvailableImages = ref([]);
const imageFilter = ref('');
const currentPage = ref(1);
const imagesPerPage = ref(24); // Mostrar 24 imágenes por página (4x6 grid)
const isLoadingImages = ref(false);
const imageLoadErrors = ref({});

// Imágenes disponibles por defecto (fallback)
const availableImages = ref([
  { publicId: 'sample', alt: 'Muestra general' },
  { publicId: 'samples/landscapes/nature-mountains', alt: 'Montañas' },
  { publicId: 'samples/food/pot-mussels', alt: 'Comida' },
  { publicId: 'samples/ecommerce/accessories-bag', alt: 'Producto' }
]);

// Filtrar imágenes basado en el texto de búsqueda
const filteredImages = computed(() => {
  if (!imageFilter.value.trim()) {
    return allAvailableImages.value.length > 0 ? allAvailableImages.value : availableImages.value;
  }
  
  const searchTerm = imageFilter.value.toLowerCase().trim();
  const images = allAvailableImages.value.length > 0 ? allAvailableImages.value : availableImages.value;
  
  return images.filter(img => {
    return (img.alt && img.alt.toLowerCase().includes(searchTerm)) || 
           (img.publicId && img.publicId.toLowerCase().includes(searchTerm));
  });
});

// Calcular el total de páginas
const totalPages = computed(() => {
  return Math.ceil(filteredImages.value.length / imagesPerPage.value);
});

// Obtener las imágenes de la página actual
const paginatedImages = computed(() => {
  const startIndex = (currentPage.value - 1) * imagesPerPage.value;
  const endIndex = startIndex + imagesPerPage.value;
  return filteredImages.value.slice(startIndex, endIndex);
});

// Resetear a la primera página cuando cambia el filtro
const filterImages = () => {
  currentPage.value = 1;
};

// Función para obtener URL de Cloudinary con manejo de errores
const getCloudinaryUrl = (publicId, options = {}) => {
  if (!publicId) return 'https://res.cloudinary.com/drqt6gd5v/image/upload/v1745577235/docs/models-13.png';
  
  try {
    return SimpleCloudinaryService.getImageUrl(publicId, options);
  } catch (error) {
    console.error('Error al generar URL de Cloudinary:', error);
    return 'https://res.cloudinary.com/drqt6gd5v/image/upload/v1745577235/docs/models-13.png';
  }
};

// Cargar imágenes disponibles desde Cloudinary
const loadAvailableImages = () => {
  isLoadingImages.value = true;
  
  SimpleCloudinaryService.getAllImages()
    .then(images => {
      console.log('Imágenes cargadas:', images.length);
      // Guardar en allAvailableImages para mantener las originales
      allAvailableImages.value = images;
    })
    .catch(error => {
      console.error('Error al cargar imágenes:', error);
      // Usar las imágenes de fallback si hay error
      allAvailableImages.value = [...availableImages.value];
    })
    .finally(() => {
      isLoadingImages.value = false;
    });
};

// Seleccionar una imagen disponible
const selectAvailableImage = (publicId) => {
  try {
    console.log(`Seleccionando imagen: ${publicId}`);
    
    if (currentImageType.value === 'logo') {
      pdfOptions.logoPublicId = publicId;
    } else {
      // Buscar la imagen en las disponibles para obtener el alt
      const source = allAvailableImages.value.length > 0 ? allAvailableImages.value : availableImages.value;
      const imagen = source.find(img => img.publicId === publicId);
      const alt = imagen ? imagen.alt : 'Imagen';
      
      pdfOptions.images.push({
        publicId,
        alt,
        caption: `Descripción de ${alt}`,
        width: null,
        height: null
      });
    }
    showImageSelector.value = false;
  } catch (error) {
    console.error('Error al seleccionar imagen:', error);
    alert('Hubo un problema al seleccionar la imagen. Por favor, intenta con otra.');
  }
};

// Manejar error de carga de imagen
const handleImageLoadError = (event) => {
  // Reemplazar la imagen que falló con una imagen de reemplazo
  const alt = event.target.alt || 'imagen';
  console.warn(`Error al cargar la imagen: ${alt}`);
  
  // Usar una imagen de fallback que existe en la cuenta del usuario
  event.target.src = 'https://res.cloudinary.com/drqt6gd5v/image/upload/v1745577235/docs/models-13.png';
  
  // Registrar el error para evitar reintentos
  imageLoadErrors.value[alt] = true;
};

// Método para generar el PDF a partir de la plantilla HTML mostrada en la vista previa
const generatePdf = async () => {
  try {
    // Activar indicador de carga
    isGenerating.value = true;
    loadingMessage.value = 'Preparando la plantilla...';
    
    // Asegurarse de que la plantilla esté actualizada
    await loadPlantillaHTML();
    
    // Dar tiempo al DOM para actualizarse antes de la captura
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    loadingMessage.value = 'Generando PDF desde la plantilla HTML...';
    
    // Obtener el elemento que contiene la plantilla HTML
    const plantillaContainer = document.getElementById('plantilla-container');
    if (!plantillaContainer) {
      throw new Error('No se encontró el contenedor de la plantilla');
    }
    
    // Crear un iframe temporal para renderizar correctamente la plantilla con estilos
    const iframe = document.createElement('iframe');
    iframe.style.width = '210mm';  // Ancho A4 exacto
    iframe.style.height = '297mm'; // Alto A4 exacto
    iframe.style.position = 'absolute';
    iframe.style.top = '-9999px';
    iframe.style.left = '-9999px';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);
    
    // Copiar todo el contenido de la plantilla al iframe con los estilos correctos
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>PDF</title>
          <style>
            @page {
              size: A4;
              margin: 0;
            }
            body { 
              margin: 0; 
              padding: 0; 
              background: white; 
              font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              color: #000;
              width: 210mm;
              height: 297mm;
            }
            * { box-sizing: border-box; }
            
            .page { 
              page-break-after: always; 
              break-after: page;
              width: 210mm;
              min-height: 297mm;
              position: relative;
              padding: 0;
              margin: 0;
              background: white;
              overflow: hidden;
            }
            
            .pagebreak {
              display: block;
              clear: both;
              page-break-after: always;
              break-after: page;
              height: 0;
              margin: 0;
              padding: 0;
              border: 0;
            }
            
            .page:last-child,
            #contraportada {
              page-break-after: auto;
              break-after: auto;
            }
            
            img {
              max-width: 100%;
              height: auto;
              display: block;
            }
            
            p, h1, h2, h3, h4, h5, h6 {
              page-break-inside: avoid;
              break-inside: avoid;
            }
            
            .no-break {
              page-break-inside: avoid;
              break-inside: avoid;
            }
          </style>
          <!-- Copiar los estilos originales de la plantilla -->
          <style>${iframeDoc.styleSheets[0]?.cssRules ? Array.from(iframeDoc.styleSheets[0].cssRules).map(rule => rule.cssText).join('\n') : ''}</style>
        </head>
        <body>${plantillaHTML.value}</body>
      </html>
    `);
    iframeDoc.close();
    
    // Dar tiempo para que el iframe renderice completamente
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Identificar todas las páginas de la plantilla
    loadingMessage.value = 'Identificando páginas del documento...';
    
    // Obtener todos los elementos que deben ser páginas separadas
    // Incluye divs de clase 'page', divs de id específicos como 'portada', 'contraportada', etc.,
    // y elementos con clase 'pagebreak'
    const pageElements = iframeDoc.querySelectorAll('.page, #portada, #contraportada, #indice, .section-agencia, .section-empleo, .section-promo, .section-desarrollo, .section-gestion, .section-marketing, .section-anexos, .pagebreak');
    
    // Si no hay elementos de página, usar todo el body como una sola página
    let pages = [];
    if (pageElements.length === 0) {
      pages.push(iframeDoc.body);
    } else {
      // Filtrar elementos vacíos o muy pequeños
      pages = Array.from(pageElements).filter(el => {
        return el.offsetHeight > 20 || el.classList.contains('pagebreak');
      });
    }
    
    // Crear el documento PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });
    
    // Configuración para html2canvas optimizada para calidad
    const html2canvasOptions = {
      scale: 2, // Mayor escala para mejor calidad
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      onclone: (clonedDoc) => {
        // Asegurarse que los elementos con pagebreak tengan altura cero
        const pagebreaks = clonedDoc.querySelectorAll('.pagebreak');
        pagebreaks.forEach(pb => {
          pb.style.height = '0px';
          pb.style.display = 'block';
        });
      }
    };
    
    // Procesar cada página secuencialmente
    loadingMessage.value = 'Capturando páginas...';
    
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      
      // Actualizar mensaje de carga
      loadingMessage.value = `Procesando página ${i + 1} de ${pages.length}...`;
      
      // Si es solo un pagebreak, añadir nueva página y continuar
      if (page.classList.contains('pagebreak')) {
        if (i > 0) { // No añadir página en blanco si es el primer elemento
          pdf.addPage();
        }
        continue;
      }
      
      try {
        // Asegurarse que la página sea visible durante la captura
        page.style.display = 'block';
        
        // Capturar la página como imagen
        const canvas = await html2canvas(page, html2canvasOptions);
        
        // Si no es la primera página, añadir una nueva página al PDF
        if (i > 0) {
          pdf.addPage();
        }
        
        // Convertir canvas a imagen
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        
        // Dimensiones del PDF
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        
        // Calcular proporción para mantener el aspecto
        const canvasAspectRatio = canvas.width / canvas.height;
        const pageAspectRatio = pageWidth / pageHeight;
        
        let imgWidth = pageWidth;
        let imgHeight = imgWidth / canvasAspectRatio;
        
        // Si la imagen es más alta que la página, ajustar altura
        if (imgHeight > pageHeight) {
          imgHeight = pageHeight;
          imgWidth = imgHeight * canvasAspectRatio;
        }
        
        // Centrar imagen si no ocupa todo el ancho
        const xOffset = (pageWidth - imgWidth) / 2;
        
        // Añadir imagen al PDF
        pdf.addImage(
          imgData,
          'JPEG',
          xOffset,
          0,
          imgWidth,
          imgHeight
        );
      } catch (error) {
        console.error(`Error al procesar página ${i + 1}:`, error);
        
        // Añadir página en blanco con mensaje de error
        if (i > 0) {
          pdf.addPage();
        }
        pdf.setFontSize(12);
        pdf.text(`[Error en página ${i + 1}]`, 20, 20);
      }
    }
    
    // Finalizar y descargar el PDF
    loadingMessage.value = 'Finalizando y descargando PDF...';
    
    // Nombre del archivo
    const filename = pdfOptions.filename.endsWith('.pdf') ? 
                     pdfOptions.filename : 
                     `${pdfOptions.filename}.pdf`;
    
    // Guardar PDF
    pdf.save(filename);
    
    // Limpiar
    document.body.removeChild(iframe);
    
    loadingMessage.value = '¡PDF generado con éxito!';
    setTimeout(() => {
      isGenerating.value = false;
    }, 1500);
    
  } catch (error) {
    console.error('Error al generar el PDF:', error);
    
    // Intentar método alternativo si falla el principal
    loadingMessage.value = 'Intentando método alternativo...';
    
    try {
      // Método alternativo usando html2pdf.js
      const plantillaHTML = document.getElementById('plantilla-container');
      
      if (!plantillaHTML) {
        throw new Error('No se pudo encontrar la plantilla HTML');
      }
      
      // Crear iframe temporal para capturar toda la plantilla de una vez
      const iframe = document.createElement('iframe');
      iframe.style.width = '210mm';
      iframe.style.height = '297mm';
      iframe.style.position = 'absolute';
      iframe.style.top = '-9999px';
      iframe.style.left = '-9999px';
      document.body.appendChild(iframe);
      
      // Copiar el contenido al iframe
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      iframeDoc.open();
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <title>PDF</title>
            <style>
              @page { size: A4; margin: 0; }
              body { 
                margin: 0; 
                padding: 0; 
                font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              }
              .page { page-break-after: always; }
              .page:last-child { page-break-after: auto; }
              .pagebreak { page-break-after: always; height: 0; }
            </style>
          </head>
          <body>${plantillaHTML.innerHTML}</body>
        </html>
      `);
      iframeDoc.close();
      
      // Dar tiempo para renderizar
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Capturar el documento completo
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Nombre del archivo
      const filename = pdfOptions.filename.endsWith('.pdf') ? 
                      pdfOptions.filename : 
                      `${pdfOptions.filename}.pdf`;
      
      // Mensaje para el usuario
      pdf.setFontSize(16);
      pdf.text('La vista previa no pudo ser capturada correctamente.', 20, 30);
      pdf.setFontSize(12);
      pdf.text('Recomendamos usar la función de impresión del navegador:', 20, 50);
      pdf.text('1. Haga clic derecho en la vista previa', 20, 70);
      pdf.text('2. Seleccione "Imprimir"', 20, 80);
      pdf.text('3. Elija "Guardar como PDF"', 20, 90);
      
      pdf.save(filename);
      
      // Limpiar
      document.body.removeChild(iframe);
      
    } catch (fallbackError) {
      console.error('Error en método alternativo:', fallbackError);
      alert('No se pudo generar el PDF. Por favor, use la función de impresión del navegador para guardar la vista previa como PDF.');
    } finally {
      loadingMessage.value = '';
      isGenerating.value = false;
    }
  }
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
  uploadStatus.value = ''; // Limpiar cualquier mensaje de error anterior
  isLoadingImages.value = true; // Mostrar indicador de carga
  
  // Si no tenemos imágenes cargadas aún, cargarlas ahora
  if (allAvailableImages.value.length === 0) {
    loadAvailableImages();
  } else {
    isLoadingImages.value = false;
  }
  
  showImageSelector.value = true;
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
      allAvailableImages.value.push({
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

// Actualizar también la descripción del PDF cuando cambian los datos de la empresa
watch(empresa, async () => {
  if (empresa.value) {
    // Actualizar el título y subtítulo
    pdfOptions.title = `Informe de ${empresa.value.nombre}`;
    pdfOptions.subtitle = `Datos principales de ${empresa.value.nombre}`;
    
    // Construir una descripción más completa con los datos actualizados
    let descripcionCompleta = empresa.value.descripcion || '';
    
    if (empresa.value.ciudad) {
      descripcionCompleta += `\n\nUbicación: ${empresa.value.ciudad}`;
    }
    
    if (empresa.value.fechaCreacion) {
      descripcionCompleta += `\n\nFecha de creación: ${formatDate(empresa.value.fechaCreacion)}`;
    }
    
    // Añadir información sobre departamentos
    if (empresa.value.departamentos && empresa.value.departamentos.length > 0) {
      descripcionCompleta += `\n\nDepartamentos: ${empresa.value.departamentos.length}`;
      descripcionCompleta += `\n- ${empresa.value.departamentos.map(d => d.nombre).join('\n- ')}`;
    }
    
    // Añadir información sobre centros
    if (empresa.value.centros && empresa.value.centros.length > 0) {
      descripcionCompleta += `\n\nCentros: ${empresa.value.centros.length}`;
      descripcionCompleta += `\n- ${empresa.value.centros.map(c => c.nombre).join('\n- ')}`;
    }
    
    // Añadir información sobre formaciones
    if (empresa.value.formaciones && empresa.value.formaciones.length > 0) {
      descripcionCompleta += `\n\nFormaciones: ${empresa.value.formaciones.length}`;
      descripcionCompleta += `\n- ${empresa.value.formaciones.map(f => f.nombre).join('\n- ')}`;
    }
    
    pdfOptions.description = descripcionCompleta;
    pdfOptions.filename = `informe_${empresa.value.nombre.replace(/\s+/g, '_')}.pdf`;
  }
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
  font-size: 28px;
  font-weight: 600;
}

h2 {
  color: #00519e;
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 20px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e0e0e0;
}

h3 {
  color: #0067c5;
  font-size: 18px;
  font-weight: 500;
  margin-top: 0;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eaeaea;
}

.empresa-info-panel {
  background: linear-gradient(to bottom, #ffffff, #f9f9f9);
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 3px 15px rgba(0, 70, 152, 0.1);
  margin-bottom: 25px;
  border: 1px solid #eaeaea;
}

.empresa-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 15px;
}

.empresa-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
}

.empresa-section:hover {
  box-shadow: 0 4px 15px rgba(0, 70, 152, 0.15);
  transform: translateY(-2px);
}

.info-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}

.info-label {
  font-weight: 600;
  color: #5175a0;
  margin-bottom: 6px;
  font-size: 14px;
}

.info-input, .info-textarea, .info-select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  color: #333;
  background-color: #fff;
  transition: all 0.3s ease;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
}

.info-input:focus, .info-textarea:focus, .info-select:focus {
  border-color: #00a0ff;
  box-shadow: 0 0 0 3px rgba(0, 160, 255, 0.15);
  outline: none;
}

.info-textarea {
  resize: vertical;
  min-height: 80px;
}

.info-select {
  height: 40px;
  cursor: pointer;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%235175a0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 16px;
  padding-right: 30px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

.empty-message {
  text-align: center;
  color: #999;
  font-style: italic;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 6px;
  margin: 10px 0;
  border: 1px dashed #ddd;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 10px;
}

.list-item {
  background: #f7f9fd;
  border-radius: 8px;
  padding: 15px;
  border-left: 4px solid #00a0ff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.item-header {
  font-weight: 600;
  color: #004698;
  margin-bottom: 12px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.btn-remove-sm {
  background: #ff5252;
}

/* Selector de imágenes mejorado */
.image-selector-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.image-selector-dialog {
  background: white;
  border-radius: 12px;
  width: 80%;
  max-width: 900px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  animation: fadeInScale 0.3s ease;
}

@keyframes fadeInScale {
  from { 
    opacity: 0; 
    transform: scale(0.95);
  }
  to { 
    opacity: 1; 
    transform: scale(1);
  }
}

.image-selector-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #004698;
  color: white;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.image-selector-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: white;
}

.close-button {
  background: transparent;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  line-height: 24px;
  transition: all 0.2s;
}

.close-button:hover {
  transform: scale(1.2);
}

.image-selector-content {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

.search-container {
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  padding: 12px 16px;
  border-radius: 30px;
  border: 1px solid #ddd;
  font-size: 14px;
  background: #f5f5f5;
  transition: all 0.3s;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.search-input:focus {
  outline: none;
  border-color: #004698;
  background: white;
  box-shadow: 0 0 0 3px rgba(0, 70, 152, 0.15);
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.image-item {
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background: white;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
}

.image-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  border-color: #004698;
}

.image-preview-container {
  width: 100%;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #f0f0f0;
}

.image-preview {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.image-name {
  padding: 8px 10px;
  font-size: 12px;
  color: #333;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background: #f8f8f8;
}

.no-images {
  text-align: center;
  padding: 40px 20px;
  color: #666;
  background: #f8f8f8;
  border-radius: 8px;
}

.upload-prompt {
  margin-top: 10px;
  font-size: 14px;
  color: #999;
}

.loading-images {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #004698;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  padding: 10px 0;
}

.pagination-button {
  background: #f0f0f0;
  color: #333;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-button:not(:disabled):hover {
  background: #004698;
  color: white;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  margin: 0 15px;
  color: #666;
  font-size: 14px;
}

.upload-section {
  padding: 20px;
  background: #f8f8f8;
  border-top: 1px solid #eee;
}

.upload-section h4 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
  font-size: 16px;
}

.file-upload-container {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
}

.file-input {
  display: none;
}

.file-upload-label {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(90deg, #00c3ff, #00ff8c);
  color: white;
  padding: 12px 20px;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 4px 10px rgba(0, 195, 255, 0.3);
}

.file-upload-label:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 195, 255, 0.4);
}

.upload-icon {
  margin-right: 8px;
  font-size: 18px;
}

.upload-status {
  text-align: center;
  padding: 10px 15px;
  border-radius: 8px;
  font-size: 14px;
  background: #e1f5fe;
  color: #0277bd;
  margin-top: 10px;
}

.upload-error {
  background: #ffebee;
  color: #c62828;
}

/* Media queries para responsividad */
@media (max-width: 768px) {
  .image-selector-dialog {
    width: 95%;
    max-height: 90vh;
  }
  
  .images-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
  
  .image-preview-container {
    height: 100px;
  }
}

@media (max-width: 480px) {
  .images-grid {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 10px;
  }
  
  .image-preview-container {
    height: 80px;
  }
}

.preview-panel {
  margin-top: 30px;
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border: 1px solid #eaeaea;
}

.pdf-template {
  width: 210mm; /* Tamaño A4 */
  margin: 0 auto;
  background-color: white;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  border: 1px solid #d0d0d0;
}

.action-buttons {
  margin-top: 25px;
  display: flex;
  justify-content: center;
  padding: 15px 0;
}

.pdf-button {
  background: linear-gradient(90deg, #004698, #0067c5);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 14px 30px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 70, 152, 0.25);
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.pdf-button::before {
  content: "📄";
  font-size: 20px;
}

.pdf-button:hover {
  background: linear-gradient(90deg, #003d85, #0058b0);
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 70, 152, 0.35);
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
  backdrop-filter: blur(3px);
}

.loading-content {
  background-color: white;
  padding: 35px;
  border-radius: 12px;
  text-align: center;
  max-width: 80%;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  animation: fadeIn 0.3s ease;
}

.loading-spinner {
  display: inline-block;
  width: 60px;
  height: 60px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #004698;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

.loading-text {
  font-size: 18px;
  color: #333;
  font-weight: 500;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Estilos para pantallas pequeñas */
@media (max-width: 768px) {
  .empresa-info-grid {
    grid-template-columns: 1fr;
  }
  
  .info-item {
    flex-direction: column;
  }
  
  .info-label {
    margin-right: 0;
    margin-bottom: 6px;
    width: 100%;
  }
}

/* Estilos para los botones de selección de logo y añadir imágenes */
.btn-select, .btn-add, .btn-remove {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(90deg, #00c3ff, #00ff8c);
  color: white;
  padding: 10px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s;
  box-shadow: 0 4px 10px rgba(0, 195, 255, 0.2);
}

.btn-select:hover, .btn-add:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 195, 255, 0.3);
}

.btn-select:active, .btn-add:active {
  transform: translateY(0);
  box-shadow: 0 2px 5px rgba(0, 195, 255, 0.2);
}

.btn-select::before {
  content: "🖼️";
  margin-right: 8px;
  font-size: 16px;
}

.btn-add::before {
  content: "+";
  margin-right: 8px;
  font-size: 18px;
  font-weight: bold;
}

.btn-remove {
  background: linear-gradient(90deg, #ff5e62, #ff9966);
  box-shadow: 0 4px 10px rgba(255, 94, 98, 0.2);
}

.btn-remove:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(255, 94, 98, 0.3);
}

.btn-remove:active {
  transform: translateY(0);
  box-shadow: 0 2px 5px rgba(255, 94, 98, 0.2);
}

.btn-remove::before {
  content: "×";
  margin-right: 8px;
  font-size: 18px;
  font-weight: bold;
}

/* Estilos para la lista de imágenes */
.images-list {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 10px;
  width: 100%;
}

.image-item {
  border: 1px solid #eaeaea;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
}

.image-item:hover {
  box-shadow: 0 4px 12px rgba(0, 70, 152, 0.1);
  transform: translateY(-2px);
}

.preview-image {
  max-width: 120px;
  max-height: 100px;
  object-fit: contain;
  border-radius: 4px;
  background-color: #f9f9f9;
  padding: 5px;
}

.image-item-controls {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Estilos para inputs en controles de imágenes */
.image-item-controls input {
  padding: 8px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
}

.image-item-controls input:focus {
  border-color: #00a0ff;
  outline: none;
  box-shadow: 0 0 0 2px rgba(0, 160, 255, 0.15);
}
</style> 