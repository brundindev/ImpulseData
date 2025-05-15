<template>
  <div class="alicante-banner-showcase">
    <div class="banner-content">
      <div class="banner-image-container" v-scroll-animate:100="'animate-left'">
        <img src="@/assets/img/impulsaalicante.png" alt="Impulsa Alicante" class="banner-image" />
        <div class="image-glow"></div>
      </div>
      <div class="banner-info" v-scroll-animate:300="'animate-right'">
        <h3>ImpulseData - Alicante Futura</h3>
        <p>Plataforma digital de gestión de datos para la innovación y el desarrollo sostenible de Alicante.</p>
        <div class="banner-action">
          <button class="btn-apple" @click="openChatbot">Explorar <span class="arrow">→</span></button>
        </div>
      </div>
    </div>
    <div class="banner-accent-shapes">
      <div class="accent-shape shape-1" v-scroll-animate:200="'animate-zoom'"></div>
      <div class="accent-shape shape-2" v-scroll-animate:400="'animate-zoom'"></div>
      <div class="accent-shape shape-3" v-scroll-animate:600="'animate-zoom'"></div>
    </div>
  </div>
</template>

<script setup>
const openChatbot = () => {
  window.dispatchEvent(new CustomEvent('toggle-chatbot'));
};
</script>

<style scoped>
.alicante-banner-showcase {
  background: linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(240,240,247,0.9) 100%);
  border-radius: 18px;
  margin: 20px 0 40px;
  padding: 0;
  position: relative;
  box-shadow: 0 20px 40px -10px rgba(0,0,0,0.05), 
              0 1px 3px rgba(0,0,0,0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  transition: transform 0.5s ease, box-shadow 0.5s ease;
}

.alicante-banner-showcase:hover {
  transform: translateY(-5px);
  box-shadow: 0 30px 60px -12px rgba(0,0,0,0.1),
              0 4px 25px -2px rgba(0,0,0,0.06),
              0 2px 6px rgba(0,0,0,0.1);
}

.banner-content {
  display: flex;
  align-items: center;
  padding: 40px;
  position: relative;
  z-index: 2;
}

.banner-image-container {
  flex: 0 0 40%;
  position: relative;
  transform-style: preserve-3d;
  perspective: 1000px;
}

.banner-image {
  width: 100%;
  border-radius: 12px;
  transform: translateZ(20px) rotateY(-5deg);
  box-shadow: 0 15px 35px rgba(0,0,0,0.1);
  transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.alicante-banner-showcase:hover .banner-image {
  transform: translateZ(40px) rotateY(-8deg);
}

.image-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), transparent 70%);
  opacity: 0;
  transition: opacity 0.6s ease;
  pointer-events: none;
}

.alicante-banner-showcase:hover .image-glow {
  opacity: 0.8;
}

.banner-info {
  flex: 1;
  padding-left: 40px;
  transform: translateZ(0);
  transition: transform 0.4s ease;
}

.alicante-banner-showcase:hover .banner-info {
  transform: translateZ(10px);
}

.banner-info h3 {
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 15px;
  background: linear-gradient(90deg, #007AFF, #34AADC);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.5px;
}

.banner-info p {
  font-size: 1.2rem;
  line-height: 1.6;
  color: #000000;
  margin-bottom: 25px;
  max-width: 90%;
  font-weight: 500;
}

.banner-action {
  margin-top: 20px;
}

.btn-apple {
  background: linear-gradient(90deg, #007AFF, #34AADC);
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 500;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  box-shadow: 0 5px 15px rgba(0, 122, 255, 0.3);
}

.btn-apple:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 122, 255, 0.4);
}

.btn-apple .arrow {
  margin-left: 8px;
  transition: transform 0.3s ease;
}

.btn-apple:hover .arrow {
  transform: translateX(4px);
}

.banner-accent-shapes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  overflow: hidden;
  pointer-events: none;
}

.accent-shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.4;
  background: linear-gradient(135deg, #007AFF, #34AADC);
  filter: blur(40px);
}

.shape-1 {
  width: 300px;
  height: 300px;
  top: -150px;
  right: -100px;
  animation: float-slow 10s ease-in-out infinite alternate;
}

.shape-2 {
  width: 200px;
  height: 200px;
  bottom: -100px;
  left: 40%;
  background: linear-gradient(135deg, #5856D6, #AF52DE);
  animation: float-slow 7s ease-in-out infinite alternate-reverse;
}

.shape-3 {
  width: 150px;
  height: 150px;
  top: 40%;
  left: -50px;
  background: linear-gradient(135deg, #FF9500, #FF2D55);
  animation: float-slow 12s ease-in-out infinite alternate;
}

@keyframes float-slow {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(20px, 20px);
  }
}

@media (max-width: 768px) {
  .banner-content {
    flex-direction: column;
    padding: 20px;
  }

  .banner-image-container {
    flex: 0 0 100%;
    margin-bottom: 20px;
  }

  .banner-info {
    padding-left: 0;
    text-align: center;
  }

  .banner-info p {
    max-width: 100%;
  }
}
</style> 