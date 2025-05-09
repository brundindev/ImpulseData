<template>
  <div class="pdf-example-view">
    <!-- Mensaje cuando la autenticación está en progreso -->
    <div v-if="!authVerified" class="auth-checking">
      <div class="auth-spinner"></div>
      <p>Verificando sesión...</p>
    </div>
    
    <!-- Contenido principal cuando el usuario está autenticado -->
    <div v-else>
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
        <div class="pdf-wrapper">
          <div ref="pdfTemplate" class="pdf-template">
            <!-- Contenedor para insertar la plantilla de PlantillaPDF -->
            <div id="plantilla-container" class="a4-container" v-html="plantillaHTML"></div>
          </div>
        </div>
        
        <!-- Controles de vista previa -->
        <div class="preview-controls">
          <button class="btn-zoom-in" @click="zoomIn" title="Aumentar zoom">
            <span>+</span>
          </button>
          <button class="btn-zoom-out" @click="zoomOut" title="Reducir zoom">
            <span>-</span>
          </button>
          <button class="btn-reset-zoom" @click="resetZoom" title="Restablecer zoom">
            <span>100%</span>
          </button>
        </div>
      </div>
      
      <!-- Botón para generar el PDF -->
      <div class="action-buttons">
        <button @click="generatePdf" class="pdf-button">
          Generar PDF
        </button>
      </div>
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
import { useRouter } from 'vue-router';
import { crearPlantillaPDF, html } from '../utils/PlantillaPDF';
import html2canvas from 'html2canvas';
import SimpleCloudinaryService from '../services/SimpleCloudinaryService';
import AuthService from '../services/AuthService';
import jsPDF from 'jspdf';

// Router para redirecciones
const router = useRouter();

// Referencias a elementos del DOM
const pdfTemplate = ref(null);
const fileInput = ref(null);

// Datos de la empresa
const empresa = ref(null);

// Plantilla HTML generada a partir de PlantillaPDF.js
const plantillaHTML = ref("");

// Control de zoom para la vista previa
const zoomLevel = ref(0.9); // Nivel inicial de zoom (90%)
const maxZoom = 1.5; // Zoom máximo 150%
const minZoom = 0.5; // Zoom mínimo 50%
const zoomStep = 0.1; // Incremento/decremento de zoom

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
const authVerified = ref(false);

// Verificar la autenticación antes de continuar
const verifyAuth = async () => {
  try {
    // Verificar si hay un token de autenticación
    if (!AuthService.isAuthenticated()) {
      console.warn('Usuario no autenticado, redirigiendo a login...');
      router.push('/login');
      return false;
    }
    
    // Intentar obtener el usuario actual
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) {
      console.warn('No se pudo obtener datos del usuario, redirigiendo a login...');
      router.push('/login');
      return false;
    }
    
    // Autenticación verificada
    console.log('Usuario autenticado correctamente:', currentUser.email);
    authVerified.value = true;
    return true;
  } catch (error) {
    console.error('Error al verificar autenticación:', error);
    return false;
  }
};

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
    console.log("Iniciando carga de la plantilla HTML completa...");
    
    // Obtener el HTML completo de la plantilla (el HTML raw, no el procesado)
    // Usamos directamente la constante 'html' del archivo PlantillaPDF
    const rawHtmlTemplate = html;
    
    // Actualizar la variable reactiva
    plantillaHTML.value = rawHtmlTemplate;
    
    // Asegurarse de que el contenedor se actualice correctamente
    setTimeout(() => {
      const container = document.getElementById('plantilla-container');
      if (container) {
        // Crear un iframe para aislar el documento completo y preservar todos los estilos
        const iframe = document.createElement('iframe');
        iframe.style.width = '100%';
        iframe.style.height = '100%'; 
        iframe.style.border = 'none';
        iframe.style.overflow = 'visible';
        
        // Limpiar cualquier contenido previo
        container.innerHTML = '';
        container.appendChild(iframe);
        
        // Acceder al documento del iframe
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        
        // Establecer el contenido del iframe con el HTML completo
        iframeDoc.open();
        iframeDoc.write(rawHtmlTemplate);
        iframeDoc.close();
        
        // Ajustar la altura del iframe para que muestre todo el contenido
        setTimeout(() => {
          const body = iframeDoc.body;
          if (body) {
            iframe.style.height = `${body.scrollHeight}px`;
          }
          
          // Aplicar ajustes adicionales si es necesario
          adjustPageDisplay(iframeDoc);
        }, 300);
        
        console.log("Plantilla HTML cargada correctamente en iframe");
      }
    }, 200);
  } catch (error) {
    console.error("Error al cargar la plantilla HTML:", error);
    const container = document.getElementById('plantilla-container');
    if (container) {
      container.innerHTML = '<div class="error-message">Error al cargar la plantilla</div>';
    }
  }
};

// Función para ajustar la visualización de páginas dentro del iframe
const adjustPageDisplay = (doc) => {
  // Ajustar todas las imágenes para asegurar que tengan contenido
  const images = doc.querySelectorAll('img');
  images.forEach(img => {
    if (!img.src || img.src === '' || img.src === 'about:blank') {
      // Usar un placeholder para imágenes vacías
      img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAyCAYAAACqNX6+AAAACXBIWXMAAAsTAAALEwEAmpwYAAAEOklEQVR4nO2cW27bMBCGp4/tqkBOIJ+gQBYoeoKgJ0ib9LHICdKcoMgJmhO06QnSnCDNCdrnAn1q0RMUaFFUHiRbHJJDUpTlhUX9AwZsLNnk/OTMcGZIhyASiUQikUgkEolEIpFIJBIJGQC3AewA+ExEFRHVeATnOwBeArhTluUrpZRCYMqyxPl85iTG87wvRVG8BvDQNAullDiV1lpXSu2I6BOAt7Zt22GapnUQBOcAbpmmWRVF8SMIgg8AntByJ87X67XUdd3wOF8sFnA9DMPwptPpewBvbJ9xPp9Dr74Z3/fb0+lUl2UJ9r+UUsi9RpIkCIKgZbquqyiKQoQwRkEQFGEYVnEcV2w8Ho8ZNKSvubdwbNu2V2maXs9msz7nQRB8DcOwStO0SpKkbttW7eJFmmYvgzRNw/d9HXM+m80wHo8RRVH3dxiGKIpiy9jsMHEcFy7P7JthmiYejwej6aNlU8AZx1GD5yYZZ/oZTbmxyzXbtgMAK+YSAJ9d181cAq5WK+R5jrqudcZ93zdKszzvvM/zHEopY64cDAZ6jTzPUVUVkiS5fq7neTfcn5vNJhaLBZIkQZqmOtRxcUzT1BhKoijq5tJsNkMYhtfWjeO4832e57Bt276vj9bzDMNQuLYoCtR1jfl83pnb8zydmPM813/jue99jPP5HGVZGkGaptVoNMJ0OsVkMukSfxAE2rtc+2dZpkE+nU4Nj+TCnKbptQewx7Ixf5bCNrZarYxnHEKAKIrqXc/uDftbfZ2/1+Gfv9e29dgmjdHb29Z6z+uFHFpbWVWVMWfUdd0Zwxb+8G39Lmvc1qvfFw67lWmaOmx1eOHN3/D4tv2Mvu+39/X8IYRbzDRtbP/sMmzbNnrP42LNZKIoCjFYE1qWpXMYyPNcex7P8ZozGAwwHA61l7TZF7WKQ0N7XVmWsG0bWutdszyluztN0yBJEjx6Bq7VYV0FjhXGLr7BVWy+7/J1vqZpGq5Xw3VdreVf+UJR6z4nk8lRnmDbtl4D1zE7RJvN5ufKWblc7lu/0xxZlv242Gw2Z7VWL9brNd4DuNh33fF4/LFt20daa6SXl/h0B0CWZZfX/ZjF9/0zz/POLcu6hcNNWqc+1ut1q5TaAri8q/HiOP7ouq5mE4bhrWVZr3dd53neudZ6DeDxnzbnE631h9VqhbeMw3AThqH2CsZdxnQ6RV8Gd5V0NptBa90J2uXlJebz+d7wF4YhkiTRibxvTsuy+o5PuOXuqxZt2z6zbdto8PaVf1mWbTrUXQqKfrXJ11xVk4aN4V1N4b7yvq+87Hv+vtptX9PXtc8xjd9Vfai27P8aR7fOl2XZjSAIHpRluX848y5clPXvvI2zzp+/ZXkL4P6h+0QikUgkEolEIpFIJBKJRCLRb9UvkR6lzA/rWkAAAAAASUVORK5CYII=';
    }
  });
  
  // Añadir números de página
  const pages = doc.querySelectorAll('.page');
  pages.forEach((page, index) => {
    // Añadir un indicador de página
    const pageIndicator = doc.createElement('div');
    pageIndicator.textContent = `Página ${index + 1}`;
    pageIndicator.style.position = 'absolute';
    pageIndicator.style.bottom = '5mm';
    pageIndicator.style.right = '10mm';
    pageIndicator.style.fontSize = '8pt';
    pageIndicator.style.color = '#999';
    page.appendChild(pageIndicator);
  });
  
  // Visualizar saltos de página con líneas punteadas
  const pagebreaks = doc.querySelectorAll('.pagebreak');
  pagebreaks.forEach(pb => {
    const marker = doc.createElement('div');
    marker.innerHTML = '<hr style="border: none; border-top: 1px dashed #ccc; margin: 20px 0;">';
    
    if (pb.parentNode) {
      pb.parentNode.insertBefore(marker, pb);
    }
  });
}

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
    if (error.response && error.response.status === 401) {
      uploadStatus.value = 'Error de autenticación. Por favor, inicia sesión nuevamente.';
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } else if (error.response && error.response.data) {
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
  // Verificar autenticación antes de continuar
  if (!authVerified.value && !(await verifyAuth())) {
    return;
  }
  
  try {
    // Activar indicador de carga
    isGenerating.value = true;
    loadingMessage.value = 'Preparando la plantilla...';
    
    // Obtener iframe con la plantilla
    const container = document.getElementById('plantilla-container');
    if (!container) {
      throw new Error('No se encontró el contenedor de la plantilla');
    }
    
    // Obtener el iframe dentro del contenedor
    const iframe = container.querySelector('iframe');
    if (!iframe) {
      throw new Error('No se encontró el iframe con la plantilla');
    }
    
    // Acceder al documento del iframe
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    if (!iframeDoc || !iframeDoc.body) {
      throw new Error('No se pudo acceder al contenido del iframe');
    }
    
    loadingMessage.value = 'Generando PDF desde la plantilla HTML...';
    
    // Crear un iframe temporal para la generación del PDF (sin afectar la visualización)
    const tempIframe = document.createElement('iframe');
    tempIframe.style.position = 'absolute';
    tempIframe.style.top = '-9999px';
    tempIframe.style.left = '-9999px';
    tempIframe.style.width = '210mm';
    tempIframe.style.height = '297mm';
    tempIframe.style.border = 'none';
    document.body.appendChild(tempIframe);
    
    // Configurar el documento temporal con estilos optimizados para PDF
    const tempDoc = tempIframe.contentDocument || tempIframe.contentWindow.document;
    tempDoc.open();
    tempDoc.write(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Memoria de Actividad - Impulsalicante</title>
        <style>
          @page {
            size: A4;
            margin: 0;
          }
          body {
            margin: 0;
            padding: 0;
            background-color: white;
            font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          }
          ${Array.from(iframeDoc.querySelectorAll('style')).map(style => style.innerHTML).join('\n')}
        </style>
      </head>
      <body>${iframeDoc.body.innerHTML}</body>
      </html>
    `);
    tempDoc.close();
    
    // Eliminar elementos de UI que no deberían estar en el PDF
    const pageIndicators = tempDoc.querySelectorAll('[style*="position: absolute"][style*="bottom: 5mm"]');
    pageIndicators.forEach(el => el.parentNode.removeChild(el));
    
    // Esperar a que todo el contenido se cargue
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Configuración para jsPDF
    loadingMessage.value = 'Creando documento PDF...';
    
    // Crear PDF con la biblioteca jsPDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });
    
    // Obtener las páginas del documento
    const pages = tempDoc.querySelectorAll('.page, #portada, #contraportada, #indice, .section-agencia, .section-empleo, .section-promo, .section-desarrollo, .section-gestion, .section-marketing, .section-anexos');
    
    // Si no encontramos páginas, usar el body completo
    const elements = pages.length > 0 ? Array.from(pages) : [tempDoc.body];
    
    // Configuración para html2canvas
    const html2canvasOptions = {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#FFFFFF',
      logging: false
    };
    
    // Procesar cada página
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      
      loadingMessage.value = `Procesando página ${i + 1} de ${elements.length}...`;
      
      try {
        // Convertir la página a canvas
        const canvas = await html2canvas(element, html2canvasOptions);
        
        // Si no es la primera página, agregar una nueva
        if (i > 0) {
          pdf.addPage();
        }
        
        // Obtener dimensiones de la página PDF
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        
        // Calcular relación de aspecto para mantener proporciones
        const canvasRatio = canvas.width / canvas.height;
        const pageRatio = pageWidth / pageHeight;
        
        let imgWidth = pageWidth;
        let imgHeight = imgWidth / canvasRatio;
        
        // Si la imagen es más alta que la página, ajustar altura
        if (imgHeight > pageHeight) {
          imgHeight = pageHeight;
          imgWidth = imgHeight * canvasRatio;
        }
        
        // Centrar la imagen si es más estrecha que la página
        const xOffset = (pageWidth - imgWidth) / 2;
        
        // Convertir canvas a imagen y añadir al PDF
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        pdf.addImage(imgData, 'JPEG', xOffset, 0, imgWidth, imgHeight);
      } catch (pageError) {
        console.error(`Error al procesar página ${i + 1}:`, pageError);
        
        // Si hay error, añadir página con mensaje de error
        if (i > 0) {
          pdf.addPage();
        }
        
        pdf.setFontSize(14);
        pdf.text(`Error al procesar página ${i + 1}`, 20, 20);
      }
    }
    
    // Nombre del archivo
    const filename = pdfOptions.filename.endsWith('.pdf') ? 
                     pdfOptions.filename : 
                     `${pdfOptions.filename}.pdf`;
    
    // Guardar PDF
    loadingMessage.value = 'Guardando PDF...';
    pdf.save(filename);
    
    // Limpiar
    document.body.removeChild(tempIframe);
    
    loadingMessage.value = '¡PDF generado con éxito!';
    setTimeout(() => {
      isGenerating.value = false;
    }, 1500);
    
  } catch (error) {
    console.error('Error al generar el PDF:', error);
    
    // Verificar si es un error de autenticación
    if (error.response && error.response.status === 401) {
      loadingMessage.value = 'Sesión expirada. Redirigiendo al login...';
      setTimeout(() => {
        router.push('/login');
      }, 2000);
      return;
    }
    
    // Mostrar mensaje de error
    loadingMessage.value = `Error: ${error.message}`;
    setTimeout(() => {
      isGenerating.value = false;
    }, 3000);
  }
};

// Función para cargar datos
const loadData = async () => {
  try {
    // Verificar autenticación antes de cargar datos
    if (!authVerified.value && !(await verifyAuth())) {
      return;
    }
    
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
    
    // Aplicar zoom inicial después de que la plantilla se haya cargado
    setTimeout(() => {
      applyZoom();
    }, 300);
    
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
      // Verificar si es un error de autenticación
      if (imageError.response && imageError.response.status === 401) {
        console.warn('Sesión expirada al cargar imágenes, redirigiendo a login...');
        // No redirigir automáticamente para evitar bucles, usar las imágenes por defecto
      }
      // Mantenemos las imágenes por defecto
    } finally {
      loadingMessage.value = '';
      isGenerating.value = false;
    }
  } catch (error) {
    console.error('Error al inicializar componente:', error);
    if (error.response && error.response.status === 401) {
      console.warn('Error de autenticación, se usarán datos por defecto');
    }
  }
};

// Al montar el componente, recuperar los datos de la empresa y cargar la plantilla
onMounted(async () => {
  // Primero verificar autenticación
  if (await verifyAuth()) {
    await loadData();
    
    // Inicializar observador para ajustar zoom cuando cambien los estilos o el DOM
    const observer = new MutationObserver(() => {
      applyZoom();
    });
    
    // Observar el contenedor de la plantilla
    const container = document.getElementById('plantilla-container');
    if (container) {
      observer.observe(container, { 
        childList: true, 
        subtree: true, 
        attributes: true,
        characterData: true 
      });
    }
    
    // Aplicar zoom inicial después de un breve retraso para permitir la renderización completa
    setTimeout(() => {
      applyZoom();
    }, 500);
  }
});

// Actualizar la plantilla cuando cambian las opciones
watch(pdfOptions, async () => {
  if (authVerified.value) {
    await loadPlantillaHTML();
  }
}, { deep: true });

// Función para aumentar zoom
const zoomIn = () => {
  if (zoomLevel.value < maxZoom) {
    zoomLevel.value = Math.min(maxZoom, zoomLevel.value + zoomStep);
    applyZoom();
  }
};

// Función para reducir zoom
const zoomOut = () => {
  if (zoomLevel.value > minZoom) {
    zoomLevel.value = Math.max(minZoom, zoomLevel.value - zoomStep);
    applyZoom();
  }
};

// Función para restablecer zoom
const resetZoom = () => {
  zoomLevel.value = 0.9;
  applyZoom();
};

// Aplicar nivel de zoom a la plantilla
const applyZoom = () => {
  const container = document.querySelector('.a4-container');
  if (container) {
    container.style.transform = `scale(${zoomLevel.value})`;
    
    // Ajustar el margen si es necesario para centrar mejor
    if (zoomLevel.value !== 1) {
      const marginAdjustment = ((1 - zoomLevel.value) * 100) / 2;
      container.style.marginTop = zoomLevel.value < 1 ? `${marginAdjustment}px` : '0';
    } else {
      container.style.marginTop = '0';
    }
  }
};
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

/* Estilos para el componente de verificación de autenticación */
.auth-checking {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.auth-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 70, 152, 0.1);
  border-top: 4px solid #004698;
  border-radius: 50%;
  animation: auth-spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes auth-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.auth-checking p {
  font-size: 16px;
  font-weight: bold;
  color: #004698;
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
  display: flex;
  flex-direction: column;
  align-items: center;
}

.preview-panel h2 {
  margin-bottom: 15px;
  color: #004698;
}

.pdf-wrapper {
  width: 100%;
  margin: 0 auto;
  background-color: #f5f5f5;
  position: relative;
  overflow: visible;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

.pdf-template {
  width: 100%;
  margin: 0 auto;
  background-color: #f5f5f5;
  position: relative;
  overflow-y: auto;
  max-height: 80vh;
  padding: 0;
  box-sizing: border-box;
}

.a4-container {
  width: 210mm;
  max-width: 100%;
  margin: 0 auto;
  padding: 0;
  background-color: white;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  position: relative;
  box-sizing: border-box;
  transform-origin: top center;
  overflow: hidden;
}

/* Aseguramos que se renderice correctamente la plantilla HTML completa */
.a4-container .container {
  max-width: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
  box-sizing: border-box !important;
}

.template-wrapper {
  width: 100%;
  margin: 0 auto;
  background-color: white;
  position: relative;
}

/* Estilos para simular páginas de papel */
.template-wrapper .page {
  width: 100%;
  margin-bottom: 20px;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border-radius: 2px;
  overflow: hidden;
  box-sizing: border-box;
}

/* Estilo para el marcador de salto de página */
.page-break-marker {
  border-top: 1px dashed #999;
  margin: 20px 0;
  padding: 5px 0;
  text-align: center;
  color: #999;
  font-size: 10px;
}

/* Controles de zoom */
.preview-controls {
  margin-top: 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.btn-zoom-in, .btn-zoom-out, .btn-reset-zoom {
  background: linear-gradient(90deg, #00c3ff, #00ff8c);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 15px;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: all 0.2s;
}

.btn-zoom-in:hover, .btn-zoom-out:hover, .btn-reset-zoom:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
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

/* Estilos específicos para simulación A4 */
.a4-container {
  width: 210mm;
  height: 297mm;
  margin: 0 auto;
  padding: 10mm;
  background-color: white;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  font-family: Arial, sans-serif;
  transform-origin: top center;
}

.pdf-template {
  width: 210mm; /* Tamaño A4 */
  margin: 0 auto;
  background-color: white;
  position: relative;
  overflow: visible;
  padding: 0;
  max-width: 100%;
  box-sizing: border-box;
}

.preview-panel {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.preview-panel h2 {
  margin-bottom: 15px;
  color: #004698;
}

@media screen {
  .a4-container {
    border: 1px solid #ddd;
  }
  
  /* Contenedor con scroll para evitar problemas en pantallas pequeñas */
  .pdf-template {
    max-height: 80vh;
    overflow-y: auto;
    padding: 1rem;
    border-radius: 4px;
  }
}

@media print {
  @page {
    size: A4;
    margin: 0;
  }
  
  .a4-container {
    width: 100%;
    height: 100%;
    box-shadow: none;
    border: none;
    transform: scale(1);
  }
  
  /* Ocultar elementos que no deben imprimirse */
  .options-panel, .action-buttons, .preview-panel h2 {
    display: none;
  }
  
  /* El contenedor de vista previa ocupa toda la página */
  .preview-panel {
    margin: 0;
    padding: 0;
  }
}
</style> 