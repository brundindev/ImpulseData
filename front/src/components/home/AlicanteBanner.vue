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
}

.alicante-banner-showcase:hover {
  transform: none;
  box-shadow: 0 20px 40px -10px rgba(0,0,0,0.05), 
              0 1px 3px rgba(0,0,0,0.05);
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
  transform-style: none;
  perspective: none;
}

.banner-image {
  width: 100%;
  border-radius: 12px;
  transform: none;
  box-shadow: 0 15px 35px rgba(0,0,0,0.1);
}

.alicante-banner-showcase:hover .banner-image {
  transform: none;
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
  pointer-events: none;
}

.alicante-banner-showcase:hover .image-glow {
  opacity: 0;
}

.banner-info {
  flex: 1;
  padding-left: 40px;
  transform: none;
}

.alicante-banner-showcase:hover .banner-info {
  transform: none;
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
  display: inline-flex;
  align-items: center;
  box-shadow: 0 5px 15px rgba(0, 122, 255, 0.3);
}

.btn-apple:hover {
  transform: none;
  box-shadow: 0 5px 15px rgba(0, 122, 255, 0.3);
}

.btn-apple .arrow {
  margin-left: 8px;
  transform: none;
}

.btn-apple:hover .arrow {
  transform: none;
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
}

.shape-2 {
  width: 200px;
  height: 200px;
  bottom: -100px;
  left: 40%;
  background: linear-gradient(135deg, #5856D6, #AF52DE);
}

.shape-3 {
  width: 150px;
  height: 150px;
  top: 40%;
  left: -50px;
  background: linear-gradient(135deg, #FF9500, #FF2D55);
}

@media (max-width: 768px) {
  .banner-content {
    flex-direction: column;
    padding: 30px;
    text-align: center;
  }

  .banner-image-container {
    flex: none;
    width: 80%;
    margin-bottom: 30px;
  }

  .banner-info {
    padding-left: 0;
  }

  .banner-info h3 {
    font-size: 24px;
  }

  .banner-info p {
    font-size: 1rem;
    max-width: 100%;
  }

  .btn-apple {
    font-size: 14px;
    padding: 10px 20px;
  }

  .accent-shape {
    filter: blur(20px);
  }

  .shape-1 {
    width: 200px;
    height: 200px;
    top: -100px;
    right: -50px;
  }

  .shape-2 {
    width: 150px;
    height: 150px;
    bottom: -80px;
    left: 30%;
  }

  .shape-3 {
    width: 100px;
    height: 100px;
    top: 50%;
    left: -30px;
  }
}
</style> 