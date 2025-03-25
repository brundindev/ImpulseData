<template>
    <div class="welcome-page">
      <!-- Nuevos efectos visuales -->
      <div class="animated-background">
        <div class="gradient-sphere sphere-1"></div>
        <div class="gradient-sphere sphere-2"></div>
        <div class="gradient-sphere sphere-3"></div>
      </div>
      
      <!-- Partículas flotantes -->
      <div class="floating-particles welcome-particles">
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
      </div>
      
      <!-- Efecto de ondas -->
      <div class="wave-background welcome-waves">
        <div class="wave"></div>
        <div class="wave"></div>
        <div class="wave"></div>
      </div>
      
      <div class="hero-section">
        <div class="hero-content">
          <h1 class="animated-title">ImpulseData</h1>
          <p>✨ <strong>ImpulseData</strong> – Transformando datos en conocimiento, donde la excelencia se hace realidad. 🚀</p>
          <div class="cta-buttons">
            <router-link to="/registro" class="signup-btn glow-effect">Registrarse</router-link>
            <router-link to="/login" class="login-btn glow-effect">Iniciar sesión</router-link>
          </div>
        </div>
        <div class="hero-image pulse-animation">
          <img src="../assets/img/impulsedata_logo.png" alt="Application Dashboard Preview" />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted, onBeforeUnmount } from 'vue'

  const emit = defineEmits(['set-welcome-page'])

  onMounted(() => {
    emit('set-welcome-page', true)
  })

  onBeforeUnmount(() => {
    emit('set-welcome-page', false)
  })
  </script>
  
  <style src="../assets/Welcome.css"></style>
