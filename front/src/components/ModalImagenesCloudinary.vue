<template>  
    <div v-if="isVisible" class="image-selector-overlay" @click.self="closeModal">  
      <div class="image-selector-dialog">  
        <div class="image-selector-header">  
          <h3>{{ title }}</h3>  
          <div class="header-actions">
            <button @click="reloadImages" class="reload-button" title="Recargar imágenes">
              <span class="reload-icon">↻</span>
            </button>
            <button @click="closeModal" class="close-button">&times;</button>  
          </div>
        </div>  
          
        <div class="image-selector-content">  
          <!-- Campo de búsqueda y botón de subida -->  
          <div class="search-container">  
            <div class="search-input-group">
              <input   
                type="text"   
                v-model="imageFilter"   
                placeholder="Buscar imágenes..."   
                @input="filterImages"  
                class="search-input"  
              />
              <button @click="openUploadDialog" class="upload-button">
                <span class="upload-icon">+</span> Subir imagen
              </button>
            </div>
          </div>  
            
          <!-- Cargando imágenes -->  
          <div v-if="isLoadingImages" class="loading-images">  
            <div class="loading-spinner"></div>  
            <p>Cargando imágenes...</p>  
          </div>  
            
          <!-- Error al cargar imágenes -->
          <div v-else-if="loadError" class="error-container">
            <p class="error-message">{{ loadError }}</p>
            <button @click="loadAvailableImages" class="retry-button">
              Reintentar
            </button>
          </div>
            
          <!-- Sin imágenes -->  
          <div v-else-if="filteredImages.length === 0" class="no-images">  
            <p>No se encontraron imágenes disponibles</p>  
            <button @click="openUploadDialog" class="upload-button">
              <span class="upload-icon">+</span> Subir nueva imagen
            </button>
          </div>  
            
          <!-- Grid de imágenes -->  
          <div v-else class="images-grid">  
            <div   
              v-for="image in paginatedImages"   
              :key="image.publicId"   
              class="image-item"  
              @click="selectImage(image)"  
            >  
              <div class="image-preview-container">  
                <div v-if="imageLoading[image.publicId]" class="image-loading">
                  <div class="loading-spinner small"></div>
                </div>
                <img   
                  :src="getCloudinaryUrl(image.publicId, { width: 120, height: 120 })"   
                  :alt="image.alt"  
                  class="image-preview"  
                  @error="handleImageLoadError"  
                  @load="handleImageLoad"
                  :data-public-id="image.publicId"
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
      </div>  
    </div>  
  </template>  
    
  <script setup>  
  import { ref, computed, watch, onMounted } from 'vue';  
  import SimpleCloudinaryService from '../services/SimpleCloudinaryService';  
    
  // Props  
  const props = defineProps({  
    isVisible: {  
      type: Boolean,  
      default: false  
    },  
    title: {  
      type: String,  
      default: 'Selecciona una imagen'  
    },  
    imagesPerPage: {  
      type: Number,  
      default: 24  
    }  
  });  
    
  // Emits  
  const emit = defineEmits(['close', 'select', 'upload']);  
    
  // Variables reactivas  
  const allAvailableImages = ref([]);  
  const imageFilter = ref('');  
  const currentPage = ref(1);  
  const isLoadingImages = ref(false);  
  const loadError = ref(null);
  const imageLoading = ref({});
    
  // Imágenes de fallback  
  const fallbackImages = ref([  
    { publicId: 'sample', alt: 'Muestra general' },  
    { publicId: 'samples/landscapes/nature-mountains', alt: 'Montañas' },  
    { publicId: 'samples/food/pot-mussels', alt: 'Comida' },  
    { publicId: 'samples/ecommerce/accessories-bag', alt: 'Producto' }  
  ]);  
    
  // Computed properties  
  const filteredImages = computed(() => {  
    if (!imageFilter.value.trim()) {  
      return allAvailableImages.value.length > 0 ? allAvailableImages.value : fallbackImages.value;  
    }  
      
    const searchTerm = imageFilter.value.toLowerCase().trim();  
    const images = allAvailableImages.value.length > 0 ? allAvailableImages.value : fallbackImages.value;  
      
    return images.filter(img => {  
      return (img.alt && img.alt.toLowerCase().includes(searchTerm)) ||   
             (img.publicId && img.publicId.toLowerCase().includes(searchTerm));  
    });  
  });  
    
  const totalPages = computed(() => {  
    return Math.ceil(filteredImages.value.length / props.imagesPerPage);  
  });  
    
  const paginatedImages = computed(() => {  
    const startIndex = (currentPage.value - 1) * props.imagesPerPage;  
    const endIndex = startIndex + props.imagesPerPage;  
    return filteredImages.value.slice(startIndex, endIndex);  
  });  
    
  // Métodos  
  const getCloudinaryUrl = (publicId, options = {}) => {  
    if (!publicId) return 'https://res.cloudinary.com/drqt6gd5v/image/upload/v1745577235/docs/models-13.png';  
      
    try {  
      return SimpleCloudinaryService.getImageUrl(publicId, options);  
    } catch (error) {  
      console.error('Error al generar URL de Cloudinary:', error);  
      return 'https://res.cloudinary.com/drqt6gd5v/image/upload/v1745577235/docs/models-13.png';  
    }  
  };  
    
  const loadAvailableImages = async () => {  
    isLoadingImages.value = true;  
    loadError.value = null;
      
    try {  
      const images = await SimpleCloudinaryService.getAllImages();  
      console.log('Imágenes cargadas:', images.length);  
      allAvailableImages.value = images;  
    } catch (error) {  
      console.error('Error al cargar imágenes:', error);  
      loadError.value = 'Error al cargar las imágenes. Por favor, inténtalo de nuevo.';
      allAvailableImages.value = [...fallbackImages.value];  
    } finally {  
      isLoadingImages.value = false;  
    }  
  };  

  const reloadImages = () => {
    loadAvailableImages();
  };
    
  const filterImages = () => {  
    currentPage.value = 1;  
  };  
    
  const selectImage = (image) => {  
    emit('select', {  
      publicId: image.publicId,  
      alt: image.alt,  
      url: getCloudinaryUrl(image.publicId)  
    });  
    closeModal();  
  };  

  const openUploadDialog = () => {
    emit('upload');
  };
    
  const closeModal = () => {  
    emit('close');  
  };  
    
  const handleImageLoadError = (event) => {  
    const img = event.target;  
    const publicId = img.dataset.publicId;
    if (publicId) {
      imageLoading.value[publicId] = false;
    }
    img.src = 'https://res.cloudinary.com/drqt6gd5v/image/upload/v1745577235/docs/models-13.png';  
  };  

  const handleImageLoad = (event) => {
    const img = event.target;
    const publicId = img.dataset.publicId;
    if (publicId) {
      imageLoading.value[publicId] = false;
    }
  };
    
  // Watchers  
  watch(() => props.isVisible, (newValue) => {  
    if (newValue && allAvailableImages.value.length === 0) {  
      loadAvailableImages();  
    }  
  });  
    
  // Lifecycle  
  onMounted(() => {  
    if (props.isVisible) {  
      loadAvailableImages();  
    }  
  });  
  </script>  
    
  <style scoped>  
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

  .header-actions {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .reload-button {
    background: transparent;
    border: none;
    color: white;
    font-size: 20px;
    cursor: pointer;
    padding: 5px;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }

  .reload-button:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .reload-icon {
    display: inline-block;
    transition: transform 0.3s;
  }

  .reload-button:hover .reload-icon {
    transform: rotate(180deg);
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

  .search-input-group {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .upload-button {
    background: #004698;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
    transition: all 0.2s;
  }

  .upload-button:hover {
    background: #003366;
  }

  .upload-icon {
    font-size: 18px;
    font-weight: bold;
  }

  .error-container {
    text-align: center;
    padding: 20px;
    background: #fff3f3;
    border-radius: 8px;
    margin: 20px 0;
  }

  .error-message {
    color: #dc3545;
    margin-bottom: 10px;
  }

  .retry-button {
    background: #dc3545;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .retry-button:hover {
    background: #c82333;
  }

  .image-loading {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .loading-spinner.small {
    width: 24px;
    height: 24px;
    border-width: 2px;
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
    
  .loading-images {  
    text-align: center;  
    padding: 40px;  
  }  
    
  .loading-spinner {  
    width: 40px;  
    height: 40px;  
    border: 4px solid #f3f3f3;  
    border-top: 4px solid #004698;  
    border-radius: 50%;  
    animation: spin 1s linear infinite;  
    margin: 0 auto 16px;  
  }  
    
  @keyframes spin {  
    0% { transform: rotate(0deg); }  
    100% { transform: rotate(360deg); }  
  }  
    
  .no-images {  
    text-align: center;  
    padding: 40px;  
    color: #666;  
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
    transition: all 0.3s;  
    background: #f8f9fa;  
    border: 2px solid transparent;  
  }  
    
  .image-item:hover {  
    transform: translateY(-2px);  
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);  
    border-color: #004698;  
  }  
    
  .image-preview-container {  
    width: 100%;  
    height: 120px;  
    overflow: hidden;  
    display: flex;  
    align-items: center;  
    justify-content: center;  
    background: #f0f0f0;  
    position: relative;
  }  
    
  .image-preview {  
    width: 100%;  
    height: 100%;  
    object-fit: cover;  
    transition: transform 0.3s;  
  }  
    
  .image-item:hover .image-preview {  
    transform: scale(1.05);  
  }  
    
  .image-name {  
    padding: 8px;  
    font-size: 12px;  
    text-align: center;  
    color: #333;  
    background: white;  
    border-top: 1px solid #eee;  
    white-space: nowrap;  
    overflow: hidden;  
    text-overflow: ellipsis;  
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

    .search-input-group {
      flex-direction: column;
    }

    .upload-button {
      width: 100%;
      justify-content: center;
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
  </style>