<template>
    <div class="welcome-page no-scrollbar">
      <div class="hero-section">
        <div class="hero-content">
          <h1>ImpulseData</h1>
          <p style="text-align: center;">Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur magni facere </p>
          <div class="cta-buttons" style="display: flex; justify-content: center;">
            <router-link to="/registro" class="signup-btn">Registrarse</router-link>
            <router-link to="/login" class="login-btn">Iniciar sesión</router-link>
          </div>
        </div>
        <div class="hero-image">
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
  
  <style scoped>
  html, body {
    scrollbar-width: none !important; /* Firefox */
    -ms-overflow-style: none !important; /* IE and Edge */  
    overflow-y: hidden !important;
  }

  html::-webkit-scrollbar, body::-webkit-scrollbar {
    display: none; /* Chrome, Safari y Opera */
  }
  
  .no-scrollbar{
    /* height: 80vh; */
    overflow-y: hidden;
    overflow-x: hidden;
  }
  .welcome-page {
    min-height: calc(100vh - 4.2em);
    background: linear-gradient(180deg, #1D2024 0%, black 50%, black 100%);
    color: white;
    position: relative;
    overflow: hidden;
  }
  
  .welcome-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: radial-gradient(circle at 15% 15%, rgba(116, 155, 208, 0.1) 0%, transparent 60%);
  pointer-events: none;
}

 .welcome-page::after {
  content: '';
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 85% 85%, rgba(0, 70, 152, 0.15) 0%, transparent 55%);
  pointer-events: none;
  }

  .hero-section {
    display: flex;
    padding: 4rem 2rem;
    max-width: 1200px;
    margin: 0 auto;
    align-items: center;
    gap: 2rem;
    height: calc(100vh - 8rem);
  }
  
  .hero-content {
    flex: 1;
  }
  
  .hero-content h1 {
    font-size: 2.5rem;
    color: white;
    margin-bottom: 1rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  .hero-content p {
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 2rem;
  }
  
  .cta-buttons {
    display: flex;
    gap: 1rem;
  }
  
  .signup-btn {
    background-color: var(--primary-color);
    color: white;
    padding: 0.5rem 1.5rem;
    border-radius: 4px;
    transition: background-color 0.3s ease;
  }
  
  .signup-btn:hover {
    background-color: var(--primary-hover);
    color: white;
  }
  
  .login-btn {
    background-color: transparent;
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    padding: 0.5rem 1.5rem;
    border-radius: 4px;
    transition: background-color 0.3s ease;
  }
  
  .login-btn:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  .hero-image {
    flex: 1;
    box-shadow: var(--shadow);
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    align-items: center;
  }
  
  .hero-image img {
    width: 100%;
    height: auto;
    display: block;
    object-fit: contain;
  }
    
  /* Responsive */
  @media (max-width: 768px) {
    .hero-section {
      flex-direction: column;
      padding: 3rem 1rem;
      height:auto;
    }
    
    .hero-content h1 {
      font-size: 2rem;
    }

    .hero-image {
      max-height: 50vh; /* Limita la altura en móviles */
    }
  }  
  </style>