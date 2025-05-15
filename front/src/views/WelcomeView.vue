<template>
    <div class="welcome-page fullscreen">
      <AnimatedBackground />
      
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
          <img src="../assets/img/logo_impulsedata.jpg" alt="Application Dashboard Preview" />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted, onBeforeUnmount } from 'vue'
  import AnimatedBackground from '../components/AnimatedBackground.vue';
  const emit = defineEmits(['set-welcome-page'])

  onMounted(() => {
    emit('set-welcome-page', true)
    document.body.classList.add('welcome-open')
  })

  onBeforeUnmount(() => {
    emit('set-welcome-page', false)
    document.body.classList.remove('welcome-open')
  })
  </script>
  
  <style src="../assets/Welcome.css"></style>
  
  <style scoped>
  .fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    margin: 0;
    padding: 0;
    z-index: 1000;
    overflow: hidden;
  }
  
  .welcome-page {
    min-height: 100vh;
    height: 100vh;
    max-height: 100vh;
  }
  
  .hero-section {
    padding-top: 10rem;
  }

  /* Ocultar/difuminar elementos de la parte inferior */
  .wave-background {
    opacity: 0.1; /* Casi invisible */
  }
  
  .wave {
    opacity: 0.1; /* Casi invisible */
    filter: blur(15px); /* Muy difuminado */
  }
  
  /* Difuminar esferas inferiores */
  .sphere-2 {
    opacity: 0.1;
    filter: blur(80px);
  }
  </style>
