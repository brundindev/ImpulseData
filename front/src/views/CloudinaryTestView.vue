<template>
  <div class="cloudinary-test-view">
    <h1>Prueba de Cloudinary</h1>
    
    <div class="test-container">
      <h2>Subida de Imágenes</h2>
      
      <div class="upload-section">
        <h3>Subir una nueva imagen</h3>
        <input type="file" @change="handleFileSelect" accept="image/*" ref="fileInput" />
        <button @click="$refs.fileInput.click()" class="btn-upload">Seleccionar archivo</button>
        
        <div v-if="uploadStatus" class="upload-status" :class="{ 'error': uploadError }">
          {{ uploadStatus }}
        </div>
      </div>
      
      <div class="result-section" v-if="uploadedImage">
        <h3>Imagen Subida</h3>
        <div class="image-preview">
          <img :src="uploadedImage.url" :alt="uploadedImage.publicId" />
          <div class="image-info">
            <p><strong>Public ID:</strong> {{ uploadedImage.publicId }}</p>
            <p><strong>URL:</strong> <a :href="uploadedImage.url" target="_blank">{{ uploadedImage.url }}</a></p>
            <p><strong>Formato:</strong> {{ uploadedImage.format }}</p>
            <p><strong>Tamaño:</strong> {{ formatBytes(uploadedImage.bytes) }}</p>
          </div>
        </div>
      </div>
      
      <div class="test-images">
        <h3>Imágenes de prueba de Cloudinary</h3>
        <div class="images-grid">
          <div v-for="image in testImages" :key="image.publicId" class="image-item">
            <SimpleCloudinaryImage 
              :publicId="image.publicId" 
              width="150" 
              :alt="image.alt" 
            />
            <p>{{ image.alt }}</p>
            <p class="image-id">{{ image.publicId }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import SimpleCloudinaryImage from '../components/SimpleCloudinaryImage.vue';
import SimpleCloudinaryService from '../services/SimpleCloudinaryService';

// Estado
const fileInput = ref(null);
const uploadStatus = ref('');
const uploadError = ref(false);
const uploadedImage = ref(null);

// Imágenes de prueba (usar IDs válidos que sepamos que existen)
const testImages = ref([
  { publicId: 'sample', alt: 'Muestra general' },
  { publicId: 'samples/landscapes/nature-mountains', alt: 'Montañas' },
  { publicId: 'samples/food/pot-mussels', alt: 'Comida' },
  { publicId: 'samples/ecommerce/accessories-bag', alt: 'Accesorios' }
]);

// Manejar la selección y subida de archivos
const handleFileSelect = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  uploadStatus.value = 'Subiendo imagen...';
  uploadError.value = false;
  uploadedImage.value = null;
  
  try {
    // Usar el servicio simplificado para subir la imagen
    const result = await SimpleCloudinaryService.uploadImage(file);
    
    // Mostrar resultados
    uploadStatus.value = '¡Imagen subida exitosamente!';
    uploadedImage.value = {
      publicId: result.public_id,
      url: result.secure_url,
      format: result.format,
      bytes: result.bytes
    };
  } catch (error) {
    uploadError.value = true;
    console.error('Error al subir imagen:', error);
    
    if (error.response && error.response.data) {
      uploadStatus.value = `Error: ${error.response.data.error?.message || JSON.stringify(error.response.data)}`;
    } else {
      uploadStatus.value = `Error: ${error.message || 'No se pudo conectar con Cloudinary'}`;
    }
  }
};

// Función para formatear bytes
const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};
</script>

<style scoped>
.cloudinary-test-view {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  color: #004698;
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;
}

.test-container {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

.upload-section {
  margin-bottom: 30px;
  padding: 20px;
  border: 2px dashed #ddd;
  border-radius: 8px;
  background: #fff;
}

.upload-section input[type="file"] {
  display: none;
}

.btn-upload {
  background: linear-gradient(90deg, #00c3ff, #00ff8c);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 10px;
  transition: all 0.3s ease;
}

.btn-upload:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.upload-status {
  margin-top: 15px;
  padding: 10px;
  border-radius: 4px;
  background: #e1f5fe;
  color: #0277bd;
  font-weight: bold;
}

.upload-status.error {
  background: #ffebee;
  color: #c62828;
}

.result-section {
  margin-top: 30px;
  padding: 20px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.image-preview {
  display: flex;
  gap: 20px;
  margin-top: 15px;
}

.image-preview img {
  max-width: 300px;
  max-height: 300px;
  object-fit: contain;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.image-info {
  flex: 1;
}

.image-info p {
  margin: 8px 0;
}

.test-images {
  margin-top: 30px;
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 15px;
}

.image-item {
  padding: 10px;
  border-radius: 8px;
  background: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.image-item p {
  margin: 5px 0;
}

.image-id {
  font-size: 0.8rem;
  color: #666;
  word-break: break-all;
}
</style> 