<template>
    <div class="welcome-page">
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
  
      <section id="features" class="features-section">
        <h2 style="color: white;">Características</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-bolt"></i>
            </div>
            <h3 style="color: white;">Característica 1</h3>
            <p style="color: white;">Interfaz intuitiva y fácil de usar.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-shield-alt"></i>
            </div>
            <h3 style="color: white;">Característica 2</h3>
            <p style="color: white;">Seguridad y protección de datos.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-chart-line"></i>
            </div>
            <h3 style="color: white;">Característica 3</h3>
            <p style="color: white;">Generación de informes y análisis de datos.</p>
          </div>
        </div>
      </section>
  
      <footer class="welcome-footer">
        <div class="footer-content">
          <div class="footer-logo">
            <h3>Impulsa Alicante</h3>
            <p>© 2025 Impulsa Alicante. <br> Todos los derechos reservados.</p>
          </div>
          <div class="footer-links">
            <div class="footer-column">
                <h4>Ayuda</h4>
                <a href="#">Contacto</a>
                <a href="#">Soporte</a>
                <a href="#">FAQ</a>
            </div>
            <div class="footer-column">
              <h4>Legal</h4>
              <a href="#">Política de privacidad</a>
              <a href="#">Términos y condiciones</a>
            </div>
          </div>
        </div>
      </footer>
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
  .welcome-page {
    min-height: 100vh;
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
    padding: 8rem 2rem 4rem;
    max-width: 1200px;
    margin: 0 auto;
    align-items: center;
    gap: 2rem;
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
  
  .signup-btn, .pricing-btn {
    background-color: var(--primary-color);
    color: white;
    padding: 0.5rem 1.5rem;
    border-radius: 4px;
    transition: background-color 0.3s ease;
  }
  
  .signup-btn:hover, .pricing-btn:hover {
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
  }
  
  .hero-image img {
    width: 100%;
    height: auto;
    display: block;
  }
  
  /* Features Section */
  .features-section {
    padding: 4rem 2rem;
    max-width: 1200px;
    margin: 0 auto;
    text-align: center;
  }
  
  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
  }
  
  .feature-card {
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    padding: 2rem;
    transition: transform 0.3s ease;
  }
  
  .feature-card:hover {
    transform: translateY(-5px);
  }
  
  .feature-icon {
    font-size: 2rem;
    margin-bottom: 1rem;
    color: var(--secondary-color);
  }
  
  
  /* Footer */
  .welcome-footer {
    background-color: transparent;
    padding: 3rem 2rem;
  }
  
  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  
  .footer-logo {
    margin-bottom: 2rem;
  }
  
  .footer-logo h3 {
    color: white;
    margin-bottom: 0.5rem;
  }
  
  .footer-links {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
  }
  
  .footer-column h4 {
    color: white;
    margin-bottom: 1rem;
  }
  
  .footer-column a {
    display: block;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 0.5rem;
    transition: color 0.3s ease;
  }
  
  .footer-column a:hover {
    color: white;
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    .hero-section {
      flex-direction: column;
      padding: 6rem 1rem 2rem;
    }
    
    .hero-content h1 {
      font-size: 2rem;
    }
    
    .pricing-cards {
      flex-direction: column;
      align-items: center;
    }
    
    .pricing-card.featured {
      transform: none;
      order: -1;
    }
    
    .footer-content {
      flex-direction: column;
    }
  }
  </style>