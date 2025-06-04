<template>
  <div class="alicante-banner-showcase no-animation">
    <div class="banner-content">
      <div class="banner-image-container">
        <img src="@/assets/img/impulsaalicante.png" alt="Impulsa Alicante" class="banner-image no-animation" />
        <div class="image-glow no-animation"></div>
      </div>
      <div class="banner-info">
        <h3>ImpulseData - Alicante Futura</h3>
        <p>Plataforma digital de gestión de datos para la innovación y el desarrollo sostenible de Alicante.</p>
        <div class="banner-action">
          <button class="btn-apple no-animation" @click="openChatbot">Explorar <span class="arrow no-animation">→</span></button>
        </div>
      </div>
    </div>
    <div class="banner-accent-shapes no-animation">
      <div class="accent-shape shape-1 no-animation"></div>
      <div class="accent-shape shape-2 no-animation"></div>
      <div class="accent-shape shape-3 no-animation"></div>
    </div>
  </div>
</template>

<script setup>
const openChatbot = () => {
  window.dispatchEvent(new CustomEvent('toggle-chatbot'));
};
</script>

<style scoped src="../home/css/AlicanteBanner.css">

</style> 
