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
      <div class="instructions-box">
        <h3>Instrucciones</h3>
        <p>Haz clic en cualquier imagen de la plantilla para seleccionarla y elegir una imagen de Cloudinary para reemplazarla.</p>
        <p>Las imágenes seleccionadas se conservarán automáticamente entre sesiones.</p>
      </div>
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

    <!-- Añadir en el template, justo encima del contenedor de la plantilla -->
    <div class="image-tooltip">
      <i class="fas fa-info-circle"></i> 
      Haz clic en cualquier imagen de la plantilla para cambiarla por una de tu biblioteca.
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch, onUnmounted } from 'vue';
import { crearPlantillaPDF, html } from '../utils/PlantillaPDF';
import html2canvas from 'html2canvas';
import SimpleCloudinaryService from '../services/SimpleCloudinaryService';
import jsPDF from 'jspdf';
import html2pdf from 'html2pdf.js';

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

// Al montar el componente, recuperar los datos de la empresa y cargar la plantilla
onMounted(async () => {
  console.log("Componente PDF montado correctamente");
  verificarSesion();
  
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
    
    // Intentar restaurar las selecciones de imágenes guardadas
    try {
      const savedSelections = localStorage.getItem('templateImageSelections');
      if (savedSelections) {
        selectedImages.value = JSON.parse(savedSelections);
        console.log("Selecciones de imágenes restauradas:", selectedImages.value);
      }
    } catch (error) {
      console.error("Error al restaurar selecciones de imágenes:", error);
    }
    
    // Añadir estilos para imágenes seleccionables
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      .image-selected {
        border: 2px solid #00a0ff !important;
        box-shadow: 0 0 10px rgba(0, 160, 255, 0.8) !important;
      }
      
      .selectable-image {
        transition: all 0.3s ease;
      }
      
      .selectable-image:hover {
        opacity: 0.9;
      }
      
      #plantilla-container .selectable-image {
        cursor: pointer;
      }
    `;
    document.head.appendChild(styleElement);
    
    // Cargar imágenes inmediatamente
    loadAvailableImages();
    
    // Cargar la plantilla HTML
    setTimeout(() => {
      loadPlantillaHTML();
    }, 500);
    
  } catch (error) {
    console.error('Error al inicializar componente:', error);
  }
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

// Variables para las imágenes de la plantilla
const currentTemplateImageId = ref(null);
const selectedImages = ref(JSON.parse(localStorage.getItem('templateImageSelections') || '{}'));

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
        
        // Añadir event listeners a todas las imágenes seleccionables
        setupImageListeners();
      }
    }, 100);
  } catch (error) {
    console.error("Error al cargar la plantilla HTML:", error);
    plantillaHTML.value = html; // Usar el HTML base como fallback
  }
};

// Función para configurar los event listeners en las imágenes de la plantilla
const setupImageListeners = () => {
  const container = document.getElementById('plantilla-container');
  if (!container) return;
  
  const images = container.querySelectorAll('img');
  images.forEach((img, index) => {
    // Asegurarse de que la imagen tenga la clase selectable-image
    img.classList.add('selectable-image');
    
    // Asegurarse de que tiene un data-image-id
    if (!img.hasAttribute('data-image-id')) {
      img.setAttribute('data-image-id', `img-${index}`);
    }
    
    // Añadir cursor pointer para mejorar UX
    img.style.cursor = 'pointer';
    
    img.addEventListener('click', (event) => {
      // Guardar el ID de la imagen actual
      currentTemplateImageId.value = event.target.getAttribute('data-image-id');
      
      // Mostrar el selector de imágenes para la plantilla
      selectTemplateImage();
      
      // Añadir estilo visual para indicar que está seleccionada
      images.forEach(i => i.classList.remove('image-selected'));
      event.target.classList.add('image-selected');
      
      console.log(`Seleccionada imagen de plantilla: ${currentTemplateImageId.value}`);
    });
    
    // Estilo visual para mostrar interactividad
    img.addEventListener('mouseenter', () => {
      img.style.boxShadow = '0 0 10px rgba(0, 160, 255, 0.8)';
      img.style.transition = 'all 0.3s ease';
    });
    
    img.addEventListener('mouseleave', () => {
      if (!img.classList.contains('image-selected')) {
        img.style.boxShadow = '';
      }
    });
    
    // Si esta imagen ya tiene una selección, aplicarla
    const imageId = img.getAttribute('data-image-id');
    if (selectedImages.value[imageId]) {
      const selected = selectedImages.value[imageId];
      img.src = getCloudinaryUrl(selected.publicId);
      img.alt = selected.alt || 'Imagen';
    }
  });
};

// Seleccionar una imagen para la plantilla
const selectTemplateImage = () => {
  // Establecer tipo para que el selector de imágenes sepa que es para la plantilla
  currentImageType.value = 'template';
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

// Actualizar el método selectAvailableImage para manejar imágenes de la plantilla
const selectAvailableImage = (publicId) => {
  try {
    console.log(`Seleccionando imagen: ${publicId}`);
    
    if (currentImageType.value === 'logo') {
      pdfOptions.logoPublicId = publicId;
    } else if (currentImageType.value === 'template' && currentTemplateImageId.value) {
      // Buscar la imagen en las disponibles para obtener el alt
      const source = allAvailableImages.value.length > 0 ? allAvailableImages.value : availableImages.value;
      const imagen = source.find(img => img.publicId === publicId);
      const alt = imagen ? imagen.alt : 'Imagen';
      
      // Guardar la selección para esta imagen de la plantilla
      selectedImages.value[currentTemplateImageId.value] = {
        publicId,
        alt
      };
      
      // Actualizar la imagen en la plantilla
      const container = document.getElementById('plantilla-container');
      if (container) {
        const imgElement = container.querySelector(`[data-image-id="${currentTemplateImageId.value}"]`);
        if (imgElement) {
          // Establecer src directamente y como atributo para asegurar la actualización
          const imageUrl = getCloudinaryUrl(publicId);
          imgElement.src = imageUrl;
          imgElement.setAttribute('src', imageUrl);
          imgElement.alt = alt;
          
          // Forzar refresh de la imagen
          imgElement.style.opacity = '0.99';
          setTimeout(() => {
            imgElement.style.opacity = '1';
          }, 50);
        }
      }
      
      // Guardar las selecciones en localStorage para persistencia
      localStorage.setItem('templateImageSelections', JSON.stringify(selectedImages.value));
      
      // Forzar actualización de la plantilla
      setTimeout(() => {
        const img = new Image();
        img.onload = () => {
          // Trigger para avisar que una imagen ha sido actualizada
          const event = new CustomEvent('image-updated', { detail: { id: currentTemplateImageId.value } });
          document.dispatchEvent(event);
        };
        img.src = getCloudinaryUrl(publicId);
      }, 100);
    } else {
      // Caso normal para añadir imagen a la lista
      pdfOptions.images.push({
        publicId,
        alt: 'Imagen',
        caption: 'Descripción de la imagen',
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
  if (isGenerating.value) return;
  isGenerating.value = true;
  loadingMessage.value = 'Preparando para generar PDF...';
  
  try {
    // Obtener contenedor
    const plantillaContainer = document.getElementById('plantilla-container');
    if (!plantillaContainer) {
      throw new Error('No se pudo encontrar el contenedor de la plantilla');
    }
    
    // Crear un iframe para aislar las operaciones
    const iframe = document.createElement('iframe');
    iframe.style.width = '793px'; // Ancho A4 en px (210mm)
    iframe.style.height = '1122px'; // Alto A4 en px (297mm)
    iframe.style.position = 'fixed';
    iframe.style.top = '-9999px';
    iframe.style.left = '-9999px';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);
    
    // Acceder al documento del iframe
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    
    // Copiar el contenido HTML al iframe
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
              background: white; 
              font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            }
            /* Estilo para capturar cada página exactamente como se ve */
            .pdf-page {
              width: 210mm;
              height: 297mm;
              margin: 0 auto;
              background: white;
              position: relative;
              page-break-after: always;
              overflow: hidden;
            }
            /* Hacer todas las páginas visibles por separado */
            .page {
              display: block;
              margin-bottom: 20mm;
              page-break-after: always;
              break-after: page;
            }
            .page:last-child { 
              page-break-after: auto; 
              break-after: auto;
            }
            .pagebreak { 
              page-break-after: always; 
              break-after: page;
              display: block;
              height: 0;
            }
          </style>
        </head>
        <body>${plantillaContainer.innerHTML}</body>
      </html>
    `);
    iframeDoc.close();
    
    // Esperar a que todo se cargue
    await new Promise(resolve => {
      iframe.onload = resolve;
      setTimeout(resolve, 1000); // Timeout como respaldo
    });
    
    loadingMessage.value = 'Generando PDF...';
    
    // Crear el PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });
    
    // Obtener todas las páginas tal como se ven en la vista previa
    const previewPages = iframeDoc.querySelectorAll('.page');
    
    // Si no hay elementos de página definidos, capturar todo el body como una página
    if (previewPages.length === 0) {
      loadingMessage.value = 'Capturando documento completo...';
      
      try {
        const canvas = await html2canvas(iframeDoc.body, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: 'white'
        });
        
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        
        // Ajustar proporción para mantener el aspecto
        const canvasRatio = canvas.width / canvas.height;
        const pageRatio = pageWidth / pageHeight;
        
        let imgWidth, imgHeight;
        
        if (canvasRatio > pageRatio) {
          imgWidth = pageWidth;
          imgHeight = imgWidth / canvasRatio;
        } else {
          imgHeight = pageHeight;
          imgWidth = imgHeight * canvasRatio;
        }
        
        // Centrar la imagen
        const xOffset = (pageWidth - imgWidth) / 2;
        const yOffset = (pageHeight - imgHeight) / 2;
        
        pdf.addImage(imgData, 'JPEG', xOffset, yOffset, imgWidth, imgHeight);
      } catch (error) {
        console.error('Error al capturar documento completo:', error);
      }
    } else {
      // Capturar cada página individualmente
      for (let i = 0; i < previewPages.length; i++) {
        const page = previewPages[i];
        
        loadingMessage.value = `Procesando página ${i + 1} de ${previewPages.length}...`;
        
        try {
          // Capturar la página tal como se ve
          const canvas = await html2canvas(page, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: 'white'
          });
          
          // Si no es la primera página, añadir una nueva página al PDF
          if (i > 0) {
            pdf.addPage();
          }
          
          // Añadir la imagen al PDF
          const imgData = canvas.toDataURL('image/jpeg', 1.0);
          const pageWidth = pdf.internal.pageSize.getWidth();
          const pageHeight = pdf.internal.pageSize.getHeight();
          
          // Ajustar proporción para mantener el aspecto
          const canvasRatio = canvas.width / canvas.height;
          const pageRatio = pageWidth / pageHeight;
          
          let imgWidth, imgHeight;
          
          if (canvasRatio > pageRatio) {
            imgWidth = pageWidth;
            imgHeight = imgWidth / canvasRatio;
          } else {
            imgHeight = pageHeight;
            imgWidth = imgHeight * canvasRatio;
          }
          
          // Centrar la imagen
          const xOffset = (pageWidth - imgWidth) / 2;
          const yOffset = 0;
          
          pdf.addImage(imgData, 'JPEG', xOffset, yOffset, imgWidth, imgHeight);
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
    }
    
    // Guardar el PDF
    loadingMessage.value = 'Finalizando y descargando PDF...';
    pdf.save('plantilla.pdf');
    
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
      // Método alternativo más simple
      const plantillaHTML = document.getElementById('plantilla-container');
      
      if (!plantillaHTML) {
        throw new Error('No se pudo encontrar la plantilla HTML');
      }
      
      // Capturar las páginas individuales
      const pages = plantillaHTML.querySelectorAll('.page');
      
      // Crear PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Si no hay páginas definidas, capturar todo el contenedor
      if (pages.length === 0) {
        const canvas = await html2canvas(plantillaHTML, {
          scale: 1.5,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#FFFFFF'
        });
        
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        
        pdf.addImage(imgData, 'JPEG', 0, 0, pageWidth, pageHeight);
      } else {
        // Capturar cada página individualmente
        for (let i = 0; i < pages.length; i++) {
          if (i > 0) {
            pdf.addPage();
          }
          
          const canvas = await html2canvas(pages[i], {
            scale: 1.5,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#FFFFFF'
          });
          
          const imgData = canvas.toDataURL('image/jpeg', 0.95);
          const pageWidth = pdf.internal.pageSize.getWidth();
          const pageHeight = pdf.internal.pageSize.getHeight();
          
          pdf.addImage(imgData, 'JPEG', 0, 0, pageWidth, pageHeight);
        }
      }
      
      pdf.save('plantilla.pdf');
      
    } catch (fallbackError) {
      console.error('Error en método alternativo:', fallbackError);
      alert('No se pudo generar el PDF. Por favor, use la función de impresión del navegador para guardar la vista previa como PDF.');
    } finally {
      loadingMessage.value = '';
      isGenerating.value = false;
    }
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

// Asegurarnos que la función setupImageListeners() aplique las selecciones guardadas
const applySelectedImages = () => {
  const container = document.getElementById('plantilla-container');
  if (!container) return;
  
  // Aplicar las imágenes seleccionadas guardadas
  Object.entries(selectedImages.value).forEach(([imageId, selection]) => {
    const imgElement = container.querySelector(`[data-image-id="${imageId}"]`);
    if (imgElement && selection && selection.publicId) {
      imgElement.src = getCloudinaryUrl(selection.publicId);
      imgElement.alt = selection.alt || 'Imagen';
      imgElement.classList.add('image-selected');
      console.log(`Aplicada imagen guardada para ${imageId}: ${selection.publicId}`);
    }
  });
};

// Modificar initPlantillaContainer
const initPlantillaContainer = async () => {
  try {
    const container = document.getElementById('plantilla-container');
    if (!container) return;

    container.innerHTML = '';
    const htmlContent = await crearPlantillaPDF();
    container.innerHTML = htmlContent;
    
    // Esperar a que el DOM se actualice
    setTimeout(() => {
      setupImageListeners();
      applySelectedImages();
      console.log("Plantilla inicializada y selecciones aplicadas");
    }, 300);
  } catch (error) {
    console.error('Error al inicializar plantilla:', error);
  }
};

// Modificar onMounted para usar initPlantillaContainer
onMounted(async () => {
  try {
    // Cargar imágenes disponibles
    await loadAvailableImages();
    
    // Inicializar el contenedor de la plantilla
    await initPlantillaContainer();
    
    // Añadir escucha para eventos de actualización de imagen
    document.addEventListener('image-updated', (event) => {
      console.log('Imagen actualizada:', event.detail.id);
      // Podríamos hacer algo adicional aquí si es necesario
    });
  } catch (error) {
    console.error('Error al inicializar componente:', error);
  }
});
</script>

<style scoped>
.pdf-example-view {
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
}

h1 {
  color: #004698;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
}

.empresa-info-panel {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.empresa-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  width: 100%;
  box-sizing: border-box;
}

.empresa-section {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
}

h2, h3 {
  color: #004698;
  margin-bottom: 1.5rem;
}

.info-item {
  margin-bottom: 1.5rem;
}

.info-label {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.info-input, .info-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
}

.info-textarea {
  resize: vertical;
  min-height: 100px;
}

.preview-panel {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
}

.pdf-template {
  width: 100%;
  max-width: 210mm;
  margin: 0 auto;
  background: white;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  box-sizing: border-box;
}

#plantilla-container {
  width: 100%;
  margin: 0 auto;
}

.instructions-box {
  background: #e8f4ff;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.instructions-box h3 {
  color: #004698;
  margin-bottom: 1rem;
}

.instructions-box p {
  color: #333;
  margin-bottom: 0.5rem;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.pdf-button {
  background: #004698;
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pdf-button:hover {
  background: #003366;
  transform: translateY(-2px);
}

.logo-selector, .images-list {
  margin-top: 1rem;
}

.preview-image {
  max-width: 100px;
  height: auto;
  margin-right: 1rem;
  border-radius: 4px;
}

.btn-select, .btn-add, .btn-remove {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-select, .btn-add {
  background: #004698;
  color: white;
}

.btn-remove {
  background: #dc3545;
  color: white;
}

.image-item {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.image-item-controls {
  flex: 1;
  display: flex;
  gap: 1rem;
  align-items: center;
}

/* Estilos para el selector de imágenes */
.image-selector-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
  backdrop-filter: blur(5px);
}

.image-selector-dialog {
  background: white;
  border-radius: 12px;
  width: 95%;
  max-width: 800px;
  margin: 0 auto;
  height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
}

.image-selector-header {
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
  border-radius: 12px 12px 0 0;
}

.image-selector-header h3 {
  margin: 0;
  color: #004698;
  font-size: 1.5rem;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-button:hover {
  background: #eee;
  color: #333;
}

.image-selector-content {
  padding: 1.5rem;
  flex: 1;
  overflow-y: auto;
}

.search-container {
  margin-bottom: 1.5rem;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #eee;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  border-color: #004698;
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 70, 152, 0.1);
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  padding: 0.5rem;
}

.image-item {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.image-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.image-preview-container {
  position: relative;
  padding-top: 100%;
  overflow: hidden;
}

.image-preview {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.image-item:hover .image-preview {
  transform: scale(1.05);
}

.image-name {
  padding: 0.75rem;
  font-size: 0.9rem;
  color: #333;
  text-align: center;
  background: #f8f9fa;
  border-top: 1px solid #eee;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.loading-images {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #004698;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.no-images {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.upload-prompt {
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #999;
}

/* Estilos para la paginación */
.pagination {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
  padding: 1rem;
  border-top: 1px solid #eee;
}

.page-button {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  color: #333;
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-button:hover {
  background: #f8f9fa;
  border-color: #004698;
  color: #004698;
}

.page-button.active {
  background: #004698;
  color: white;
  border-color: #004698;
}

.page-button:disabled {
  background: #f8f9fa;
  color: #999;
  cursor: not-allowed;
  border-color: #ddd;
}

/* Estilos para el formulario de subida */
.upload-section {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 2px dashed #ddd;
}

.upload-section h4 {
  margin-bottom: 1rem;
  color: #004698;
}

.file-upload-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.file-input {
  width: 100%;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.file-upload-label {
  background: #004698;
  color: white;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.file-upload-label:hover {
  background: #003366;
  transform: translateY(-2px);
}

.upload-status {
  margin-top: 1rem;
  padding: 0.75rem;
  border-radius: 4px;
  text-align: center;
}

.upload-status.success {
  background: #d4edda;
  color: #155724;
}

.upload-status.error {
  background: #f8d7da;
  color: #721c24;
}

/* Mantener el resto de los estilos existentes */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.loading-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #004698;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

.loading-text {
  color: #333;
  font-size: 1.1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Media queries para responsividad */
@media (max-width: 768px) {
  .pdf-example-view {
    padding: 0;
    width: 100vw;
  }

  .preview-panel {
    padding: 0;
    width: 100%;
    border-radius: 0;
    margin-bottom: 1rem;
  }

  .pdf-template {
    max-width: 100%;
    transform: none;
    margin: 0;
    padding: 0;
  }

  #plantilla-container {
    width: 100%;
    transform: none;
  }

  #plantilla-container img {
    width: 100% !important;
    height: auto !important;
    max-width: none !important;
  }

  /* Ajustar todos los elementos dentro del contenedor del PDF */
  #plantilla-container * {
    max-width: 100% !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
    box-sizing: border-box !important;
  }

  .page {
    width: 100% !important;
    margin: 0 !important;
    padding: 1rem !important;
  }

  /* Ajustes responsivos para el selector de imágenes */
  .image-selector-dialog {
    width: 100%;
    height: 100vh;
    margin: 0;
    border-radius: 0;
  }

  .images-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
}

@media (max-width: 480px) {
  .pdf-example-view {
    padding: 0;
  }

  .preview-panel {
    padding: 0;
    margin: 0;
  }

  .pdf-template {
    transform: none;
    width: 100%;
    max-width: 100%;
  }

  #plantilla-container {
    width: 100%;
    padding: 0;
  }

  /* Asegurar que las imágenes y elementos del PDF ocupen todo el ancho */
  #plantilla-container img,
  #plantilla-container .page,
  #plantilla-container div {
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 !important;
  }

  /* Ajustes responsivos adicionales para el selector de imágenes */
  .image-selector-header {
    padding: 1rem;
  }

  .image-selector-header h3 {
    font-size: 1.2rem;
  }

  .images-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 0.5rem;
  }

  .image-name {
    font-size: 0.8rem;
    padding: 0.5rem;
  }
}
</style> 