<template>
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
    
  <!-- Estrellas brillantes -->
  <div class="stars-container">
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
  </div>
    
  <!-- Efecto de ondas -->
  <div class="wave-background">
    <div class="wave"></div>
    <div class="wave"></div>
    <div class="wave"></div>
  </div>
</template>

<script>
export default {
  name: 'AnimatedBackground'
}
</script>

<style>
/* Fondo base oscuro */
.home-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0a1520 0%, #132030 100%);
  z-index: -10;
}

.home-background::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 20%, rgba(0, 70, 152, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(0, 70, 152, 0.15) 0%, transparent 50%);
  pointer-events: none;
}

/* Efectos de fondo */
.animated-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
}

.gradient-sphere {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
}

.sphere-1 {
  width: 500px;
  height: 500px;
  background: linear-gradient(45deg, rgba(0, 70, 152, 0.4), rgba(0, 176, 255, 0.4));
  top: -100px;
  left: -100px;
  animation: floatSphere 25s infinite ease-in-out;
  animation-delay: 0s;
}

.sphere-2 {
  width: 600px;
  height: 600px;
  background: linear-gradient(135deg, rgba(0, 234, 184, 0.3), rgba(0, 118, 230, 0.3));
  bottom: -200px;
  right: -100px;
  animation: floatSphere 25s infinite ease-in-out;
  animation-delay: -5s;
}

.sphere-3 {
  width: 400px;
  height: 400px;
  background: linear-gradient(225deg, rgba(0, 171, 255, 0.3), rgba(0, 245, 157, 0.3));
  top: 40%;
  left: 60%;
  animation: floatSphere 25s infinite ease-in-out;
  animation-delay: -10s;
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

/* Partículas flotantes */
.floating-particles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -5;
  overflow: hidden;
}

.particle {
  position: absolute;
  background: linear-gradient(135deg, rgba(0, 70, 152, 0.2) 0%, rgba(0, 200, 255, 0.3) 100%);
  border-radius: 50%;
  animation: float 20s infinite ease-in-out;
  filter: blur(2px);
  box-shadow: 0 0 20px rgba(0, 70, 152, 0.3);
}

.particle:nth-child(1) {
  width: 100px;
  height: 100px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.particle:nth-child(2) {
  width: 80px;
  height: 80px;
  top: 20%;
  right: 15%;
  animation-delay: -5s;
}

.particle:nth-child(3) {
  width: 60px;
  height: 60px;
  bottom: 20%;
  left: 20%;
  animation-delay: -10s;
}

.particle:nth-child(4) {
  width: 120px;
  height: 120px;
  bottom: 10%;
  right: 10%;
  animation-delay: -15s;
}

.particle:nth-child(5) {
  width: 50px;
  height: 50px;
  top: 50%;
  left: 50%;
  animation-delay: -7s;
}

.particle:nth-child(6) {
  width: 90px;
  height: 90px;
  top: 80%;
  left: 40%;
  animation-delay: -12s;
}

.particle:nth-child(7) {
  width: 70px;
  height: 70px;
  top: 30%;
  right: 30%;
  animation-delay: -3s;
}

.particle:nth-child(8) {
  width: 110px;
  height: 110px;
  bottom: 40%;
  right: 25%;
  animation-delay: -9s;
}

@keyframes float {
  0% {
    transform: translate(0, 0) rotate(0deg) scale(1);
    opacity: 0.5;
  }
  25% {
    transform: translate(50px, 50px) rotate(90deg) scale(1.1);
    opacity: 0.7;
  }
  50% {
    transform: translate(0, 100px) rotate(180deg) scale(1);
    opacity: 0.5;
  }
  75% {
    transform: translate(-50px, 50px) rotate(270deg) scale(0.9);
    opacity: 0.7;
  }
  100% {
    transform: translate(0, 0) rotate(360deg) scale(1);
    opacity: 0.5;
  }
}

/* Efecto de ondas */
.wave-background {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: -12;
  overflow: hidden;
  pointer-events: none;
}

.wave {
  position: absolute;
  width: 200%;
  height: 200%;
  top: -50%;
  left: -50%;
  border-radius: 40%;
  animation: wave 20s infinite linear;
  background: radial-gradient(ellipse at center, rgba(0, 70, 152, 0) 0%, rgba(0, 70, 152, 0.05) 100%);
}

.wave:nth-child(1) {
  animation-duration: 20s;
}

.wave:nth-child(2) {
  animation-duration: 25s;
  animation-delay: -5s;
  opacity: 0.6;
}

.wave:nth-child(3) {
  animation-duration: 30s;
  animation-delay: -10s;
  opacity: 0.4;
}

@keyframes wave {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}



.welcome-page {
  min-height: 100vh;
  height: 100vh;
  background: linear-gradient(180deg, #1D2024 0%, black 50%, black 100%);
  color: white;
  position: relative;
  overflow: hidden !important; /* Esto solo afecta a .welcome-page */
  margin: 0;
  padding: 0;
}
  
.welcome-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: radial-gradient(circle at 15% 15%, rgba(0, 195, 255, 0.1) 0%, transparent 60%);
  pointer-events: none;
}

.welcome-page::after {
  content: '';
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 85% 85%, rgba(0, 255, 140, 0.15) 0%, transparent 55%);
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
  background: var(--primary-gradient);
  top: -100px;
  left: -100px;
  animation-delay: 0s;
}

.sphere-2 {
  width: 600px;
  height: 600px;
  background: var(--primary-gradient);
  bottom: -200px;
  right: -100px;
  animation-delay: -5s;
}

.sphere-3 {
  width: 400px;
  height: 400px;
  background: var(--primary-gradient);
  top: 40%;
  left: 60%;
  animation-delay: -10s;
}

.welcome-particles {
  z-index: 1;
}

.welcome-particles .particle {
  background: linear-gradient(to right, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.3));
  box-shadow: 0 0 15px rgba(0, 195, 255, 0.3);
}

.welcome-waves {
  z-index: 1;
}

.welcome-waves .wave {
  background: linear-gradient(90deg, 
    rgba(0, 195, 255, 0.1), 
    rgba(0, 255, 140, 0.2), 
    rgba(0, 195, 255, 0.1),
    rgba(0, 255, 140, 0.2),
    rgba(0, 195, 255, 0.1)
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

.stars-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
}

.star {
  position: absolute;
  width: 2px;
  height: 2px;
  background: white;
  border-radius: 50%;
  animation: twinkle 5s infinite ease-in-out;
}

.star:nth-child(1) { top: 10%; left: 20%; animation-delay: 0s; }
.star:nth-child(2) { top: 20%; left: 40%; animation-delay: 1s; }
.star:nth-child(3) { top: 30%; left: 70%; animation-delay: 2s; }
.star:nth-child(4) { top: 40%; left: 85%; animation-delay: 3s; }
.star:nth-child(5) { top: 50%; left: 10%; animation-delay: 4s; }
.star:nth-child(6) { top: 60%; left: 30%; animation-delay: 5s; }
.star:nth-child(7) { top: 70%; left: 60%; animation-delay: 6s; }
.star:nth-child(8) { top: 80%; left: 80%; animation-delay: 7s; }
.star:nth-child(9) { top: 90%; left: 50%; animation-delay: 8s; }
.star:nth-child(10) { top: 15%; left: 90%; animation-delay: 9s; }
.star:nth-child(11) { top: 25%; left: 5%; animation-delay: 10s; }
.star:nth-child(12) { top: 35%; left: 55%; animation-delay: 11s; }

@keyframes twinkle {
  0%, 100% {
    opacity: 0.2;
    transform: scale(1);
    box-shadow: 0 0 2px rgba(0, 195, 255, 0.1);
  }
  50% {
    opacity: 1;
    transform: scale(2);
    box-shadow: 0 0 8px rgba(0, 255, 140, 0.8), 0 0 12px rgba(255, 255, 255, 0.4);
  }
}

/* Mejorando las ondas de fondo */
.wave-background {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 40%;
  overflow: hidden;
  z-index: 0;
}

.wave {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 200%;
  height: 100%;
  background-repeat: repeat-x;
  animation: wave-animation 20s linear infinite;
  opacity: 0.3;
}

.wave:nth-child(1) {
  bottom: -5%;
  height: 40%;
  animation-duration: 20s;
  opacity: 0.5;
  background: linear-gradient(90deg, 
    rgba(0, 195, 255, 0.1), 
    rgba(0, 255, 140, 0.2), 
    rgba(0, 195, 255, 0.1),
    rgba(0, 255, 140, 0.2),
    rgba(0, 195, 255, 0.1)
  );
}

.wave:nth-child(2) {
  bottom: -10%;
  height: 60%;
  animation-duration: 25s;
  animation-direction: reverse;
  opacity: 0.3;
  background: linear-gradient(90deg, 
    rgba(0, 195, 255, 0.1), 
    rgba(0, 255, 140, 0.2), 
    rgba(0, 195, 255, 0.1)
  );
}

.wave:nth-child(3) {
  bottom: -15%;
  height: 80%;
  animation-duration: 30s;
  opacity: 0.2;
  background: linear-gradient(90deg, 
    rgba(0, 255, 140, 0.1), 
    rgba(0, 195, 255, 0.2), 
    rgba(0, 255, 140, 0.1)
  );
}

@keyframes wave-animation {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

/* Mejorando las partículas */
.floating-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 195, 255, 0.5), rgba(0, 255, 140, 0.5));
  box-shadow: 0 0 10px rgba(0, 195, 255, 0.5), 0 0 20px rgba(0, 255, 140, 0.3);
  animation: float-particle 15s infinite ease-in-out;
}

.particle:nth-child(1) { top: 20%; left: 10%; animation-delay: 0s; }
.particle:nth-child(2) { top: 30%; left: 30%; animation-delay: 2s; }
.particle:nth-child(3) { top: 50%; left: 20%; animation-delay: 4s; }
.particle:nth-child(4) { top: 70%; left: 40%; animation-delay: 6s; }
.particle:nth-child(5) { top: 10%; left: 60%; animation-delay: 8s; }
.particle:nth-child(6) { top: 40%; left: 80%; animation-delay: 10s; }
.particle:nth-child(7) { top: 60%; left: 70%; animation-delay: 12s; }
.particle:nth-child(8) { top: 80%; left: 90%; animation-delay: 14s; }

@keyframes float-particle {
  0%, 100% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(50px, 50px);
  }
  50% {
    transform: translate(100px, 0);
  }
  75% {
    transform: translate(50px, -50px);
  }
}
</style>