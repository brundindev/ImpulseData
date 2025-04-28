<template>
  <div class="pdf-example-view">
    <h1>Ejemplo de generación de PDF con Cloudinary</h1>
    
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
          <SimpleCloudinaryImage 
            v-if="pdfOptions.logoPublicId" 
            :publicId="pdfOptions.logoPublicId" 
            width="100" 
            alt="Logo" 
          />
          <button @click="selectImage('logo')" class="btn-select">Seleccionar Logo</button>
        </div>
      </div>
      
      <!-- Selector de imágenes -->
      <div class="form-group">
        <label>Imágenes:</label>
        <div class="images-list">
          <div v-for="(image, index) in pdfOptions.images" :key="index" class="image-item">
            <SimpleCloudinaryImage 
              :publicId="image.publicId" 
              width="100" 
              :alt="image.alt || 'Imagen'" 
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
    
    <!-- Vista previa de la plantilla -->
    <div class="preview-panel">
      <h2>Vista Previa</h2>
      <PdfTemplate 
        :title="pdfOptions.title"
        :subtitle="pdfOptions.subtitle"
        :description="pdfOptions.description"
        :logoPublicId="pdfOptions.logoPublicId"
        :tableHeaders="pdfOptions.tableHeaders"
        :tableData="pdfOptions.tableData"
        :images="pdfOptions.images"
        :footerText="pdfOptions.footerText"
        :filename="pdfOptions.filename"
      />
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
              <SimpleCloudinaryImage 
                :publicId="image.publicId" 
                width="100" 
                alt="Imagen disponible" 
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
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import PdfTemplate from '../components/PdfTemplate.vue';
import SimpleCloudinaryImage from '../components/SimpleCloudinaryImage.vue';
import SimpleCloudinaryService from '../services/SimpleCloudinaryService';

// Opciones del PDF
const pdfOptions = reactive({
  title: 'Informe de Proyecto',
  subtitle: 'Resumen de actividades',
  description: 'Este informe contiene el resumen de las actividades realizadas durante el proyecto.',
  logoPublicId: '', // ID público del logo en Cloudinary
  tableHeaders: ['ID', 'Nombre', 'Fecha', 'Estado'],
  tableData: [
    ['001', 'Tarea 1', '01/05/2023', 'Completada'],
    ['002', 'Tarea 2', '15/05/2023', 'En progreso'],
    ['003', 'Tarea 3', '30/05/2023', 'Pendiente']
  ],
  images: [], // Array de objetos {publicId, alt, caption, width, height}
  footerText: '© 2023 ImpulseData. Todos los derechos reservados.',
  filename: 'informe-proyecto.pdf'
});

// Estado del selector de imágenes
const showImageSelector = ref(false);
const currentImageType = ref(''); // 'logo' o 'pdf'
const uploadStatus = ref('');
const fileInput = ref(null);

// Imágenes disponibles (corregidas para usar imágenes reales de Cloudinary)
const availableImages = ref([
  { publicId: 'sample', alt: 'Muestra general' },
  { publicId: 'samples/landscapes/nature-mountains', alt: 'Montañas' },
  { publicId: 'samples/food/pot-mussels', alt: 'Comida' },
  { publicId: 'samples/ecommerce/accessories-bag', alt: 'Producto' }
]);

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
}

.editable-table input:focus {
  border-color: #00c3ff;
  background: white;
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
}

.btn-select, .btn-add, .btn-upload {
  background: linear-gradient(90deg, #00c3ff, #00ff8c);
  color: white;
}

.btn-remove, .btn-cancel {
  background: #ff5252;
  color: white;
}

.btn-add-sm, .btn-remove-sm {
  padding: 2px 6px;
  font-size: 12px;
}

.btn-add-sm {
  background: #00c3ff;
  color: white;
}

.btn-remove-sm {
  background: #ff5252;
  color: white;
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
</style> 