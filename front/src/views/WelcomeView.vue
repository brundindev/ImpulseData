<template>
    <div class="welcome-page no-scrollbar">
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

  /* Nuevos efectos visuales */
  .animated-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 0;
  }

  .gradient-sphere {
    position: absolute;
    border-radius: 50%;
    filter: blur(50px);
    opacity: 0.4;
    animation: floatSphere 25s infinite ease-in-out;
  }

  .sphere-1 {
    width: 500px;
    height: 500px;
    background: linear-gradient(45deg, #ff3d00, #00b0ff);
    top: -100px;
    left: -100px;
    animation-delay: 0s;
  }

  .sphere-2 {
    width: 600px;
    height: 600px;
    background: linear-gradient(135deg, #6200ea, #00e676);
    bottom: -200px;
    right: -100px;
    animation-delay: -5s;
  }

  .sphere-3 {
    width: 400px;
    height: 400px;
    background: linear-gradient(225deg, #ffab00, #f50057);
    top: 40%;
    left: 60%;
    animation-delay: -10s;
  }

  .welcome-particles {
    z-index: 1;
  }

  .welcome-particles .particle {
    background: linear-gradient(to right, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.3));
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
  }

  .welcome-waves {
    z-index: 1;
  }

  .welcome-waves .wave {
    background: linear-gradient(90deg, 
      rgba(0, 70, 152, 0.1), 
      rgba(116, 155, 208, 0.2), 
      rgba(255, 61, 0, 0.1),
      rgba(255, 171, 0, 0.2),
      rgba(0, 70, 152, 0.1)
    );
  }

  @keyframes floatSphere {
    0%, 100% {
      transform: translate(0, 0) scale(1);
    }
    25% {
      transform: translate(5%, 5%) scale(1.05);
    }
    50% {
      transform: translate(-5%, 8%) scale(0.95);
    }
    75% {
      transform: translate(8%, -3%) scale(1.02);
    }
  }

  .animated-title {
    position: relative;
    display: inline-block;
    background: linear-gradient(90deg, #00b0ff, #00b0ff, #0062ff);
    background-size: 400% 400%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: gradientShift 10s ease infinite;
    text-shadow: none;
    font-weight: 700;
    letter-spacing: 1px;
  }

  .pulse-animation {
    animation: pulse 3s infinite ease-in-out;
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
      box-shadow: 0 0 20px rgba(0, 181, 255, 0.3);
    }
    50% {
      transform: scale(1.03);
      box-shadow: 0 0 30px rgba(0, 181, 255, 0.5);
    }
  }

  .glow-effect {
    position: relative;
    z-index: 1;
    overflow: hidden;
  }

  .glow-effect::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
    opacity: 0;
    transform: scale(0.5);
    transition: opacity 0.3s, transform 0.5s;
    z-index: -1;
  }

  .glow-effect:hover::after {
    opacity: 1;
    transform: scale(1);
  }

  .hero-section {
    display: flex;
    padding: 4rem 2rem;
    max-width: 1200px;
    margin: 0 auto;
    align-items: center;
    gap: 2rem;
    height: calc(100vh - 8rem);
    position: relative;
    z-index: 2;
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
    text-align: left;
  }
  
  .cta-buttons {
    display: flex;
    gap: 1rem;
    justify-content: flex-start;
  }
  
  .signup-btn {
    background-color: var(--primary-color);
    color: white;
    padding: 0.5rem 1.5rem;
    border-radius: 4px;
    transition: all 0.3s ease;
  }
  
  .signup-btn:hover {
    background-color: var(--primary-hover);
    color: white;
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 70, 152, 0.4);
  }
  
  .login-btn {
    background-color: transparent;
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    padding: 0.5rem 1.5rem;
    border-radius: 4px;
    transition: all 0.3s ease;
  }
  
  .login-btn:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(255, 255, 255, 0.2);
  }
  
  .hero-image {
    flex: 1;
    box-shadow: var(--shadow);
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    align-items: center;
    transition: all 0.5s ease;
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

    .gradient-sphere {
      opacity: 0.2;
      filter: blur(70px);
    }
  }

  @keyframes gradientShift {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  </style>