<template>
  <div class="alicante-banner" :class="{ 'alicante-banner-fixed': fixed, 'alicante-banner-small': small }">
    <div class="banner-image-container">
      <img src="@/assets/img/banderaalicante.jpg" alt="Bandera de Alicante" class="banner-image" />
      <div class="banner-overlay"></div>
    </div>
    <div v-if="showText" class="banner-text">
      <h3>{{ title || 'Alicante' }}</h3>
      <p v-if="subtitle">{{ subtitle }}</p>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

// Define props para personalizar el componente
const props = defineProps({
  fixed: {
    type: Boolean,
    default: false
  },
  small: {
    type: Boolean,
    default: false
  },
  showText: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  }
});
</script>

<style scoped>
.alicante-banner {
  position: relative;
  overflow: hidden;
  width: 200px;
  height: 100px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  margin: 10px;
  transition: all 0.3s ease;
}

.alicante-banner:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

.alicante-banner-small {
  width: 100px;
  height: 60px;
}

.alicante-banner-fixed {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 100;
}

.banner-image-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.alicante-banner:hover .banner-image {
  transform: scale(1.05);
}

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(transparent 80%, rgba(255, 255, 255, 0.7));
  pointer-events: none;
}

.banner-text {
  position: absolute;
  bottom: 10px;
  left: 10px;
  color: white;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.7);
  max-width: 90%;
}

.banner-text h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.banner-text p {
  margin: 5px 0 0;
  font-size: 12px;
  opacity: 0.9;
}

.alicante-banner-small .banner-text h3 {
  font-size: 14px;
}

.alicante-banner-small .banner-text p {
  font-size: 10px;
}
</style> 