<template>
  <div class="cloudinary-image-container">
    <img 
      :src="imageUrl" 
      :alt="alt" 
      :width="width" 
      :height="height"
      class="cloudinary-image"
      :class="{ 'loading': isLoading }"
      @load="handleImageLoaded"
      @error="handleImageError"
    />
    <div v-if="isLoading" class="loading-indicator">Cargando...</div>
    <div v-if="hasError" class="error-message">Error al cargar la imagen</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const props = defineProps({
  publicId: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: 'Imagen'
  },
  width: {
    type: [Number, String],
    default: null
  },
  height: {
    type: [Number, String],
    default: null
  },
  format: {
    type: String,
    default: 'auto'
  },
  quality: {
    type: [Number, String],
    default: 'auto'
  },
  forPdf: {
    type: Boolean,
    default: false
  },
  cloudName: {
    type: String,
    default: 'drqt6gd5v'
  }
});

const isLoading = ref(true);
const hasError = ref(false);

// Función simplificada para generar URLs de Cloudinary sin usar el SDK
const generateCloudinaryUrl = (publicId, options = {}) => {
  if (!publicId) return '';
  
  const { width, height, format, quality, cloudName } = options;
  
  // URL base de Cloudinary
  let url = `https://res.cloudinary.com/${cloudName}/image/upload`;
  
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

const imageUrl = computed(() => {
  const options = {
    width: props.width,
    height: props.height,
    format: props.forPdf ? 'png' : props.format,
    quality: props.forPdf ? 'auto:best' : props.quality,
    cloudName: props.cloudName
  };
  
  return generateCloudinaryUrl(props.publicId, options);
});

const handleImageLoaded = () => {
  isLoading.value = false;
};

const handleImageError = () => {
  isLoading.value = false;
  hasError.value = true;
};

onMounted(() => {
  // Precarga la imagen
  const img = new Image();
  img.src = imageUrl.value;
  img.onload = handleImageLoaded;
  img.onerror = handleImageError;
});
</script>

<style scoped>
.cloudinary-image-container {
  position: relative;
  display: inline-block;
}

.cloudinary-image {
  max-width: 100%;
  transition: opacity 0.3s ease;
}

.cloudinary-image.loading {
  opacity: 0.5;
}

.loading-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.8rem;
  color: #333;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 0.3rem 0.5rem;
  border-radius: 4px;
}

.error-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #ff5252;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 0.3rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
}
</style> 