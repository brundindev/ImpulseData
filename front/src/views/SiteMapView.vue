<template>
  <div class="sitemap-container">
    <div class="content-wrapper">
      <h1>Mapa del Sitio</h1>

      <div class="grid-container">
        <!-- Sección de Contacto -->
        <section class="contact-section">
          <h2>Información de Contacto</h2>
          
          <div class="contact-card">
            <div class="contact-item">
              <i class="fas fa-map-marker-alt"></i>
              <div>
                <h3>Dirección</h3>
                <p>Plaza del Ayuntamiento, 1</p>
                <p>03002 Alicante, España</p>
              </div>
            </div>

            <div class="contact-item">
              <i class="fas fa-phone"></i>
              <div>
                <h3>Teléfono</h3>
                <p>+34 965 14 00 00</p>
                <p>Lunes a Viernes: 9:00 - 14:00</p>
              </div>
            </div>

            <div class="contact-item">
              <i class="fas fa-envelope"></i>
              <div>
                <h3>Email</h3>
                <p>info@impulsedata.es</p>
                <p>soporte@impulsedata.es</p>
              </div>
            </div>

            <div class="social-media">
              <h3>Redes Sociales</h3>
              <div class="social-icons">
                <a href="#" class="social-icon"><i class="fab fa-facebook"></i></a>
                <a href="#" class="social-icon"><i class="fab fa-twitter"></i></a>
                <a href="#" class="social-icon"><i class="fab fa-linkedin"></i></a>
                <a href="#" class="social-icon"><i class="fab fa-instagram"></i></a>
              </div>
            </div>
          </div>
        </section>

        <!-- Mapa de Google -->
        <section class="map-section">
          <h2>Ubicación</h2>
          <div class="map-container">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7494.148486983516!2d-0.4865065368424072!3d38.34582365127152!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd6237b04d11e95d%3A0x7d39ba606c50f5cf!2sAyuntamiento%20de%20Alicante!5e0!3m2!1ses!2ses!4v1748000541141!5m2!1ses!2ses" width="600" height="550" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  // Cambiar el título de la página
  document.title = 'Mapa del Sitio - ImpulseData';
});
</script>

<style scoped>
.sitemap-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background: #ffffff;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
}

.content-wrapper {
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  color: var(--primary-color);
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
  font-weight: 700;
}

h2 {
  color: var(--primary-color);
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

h3 {
  color: var(--primary-color);
  font-size: 1.3rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
}

.contact-section, .map-section {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.contact-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.contact-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
}

.contact-item:last-child {
  border-bottom: none;
}

.contact-item i {
  font-size: 1.5rem;
  color: var(--primary-color);
  margin-right: 1rem;
  width: 2rem;
  text-align: center;
}

.contact-item p {
  margin: 0.25rem 0;
  color: var(--text-color);
}

.social-media {
  text-align: center;
  margin-top: 2rem;
}

.social-icons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

.social-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.social-icon:hover {
  transform: translateY(-3px);
}

.map-container {
  height: 400px;
  border-radius: 8px;
  overflow: hidden;
}

.links-section {
  margin-top: 3rem;
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  margin-top: 2rem;
}

.links-column ul {
  list-style: none;
  padding: 0;
}

.links-column li {
  margin-bottom: 0.5rem;
}

.links-column a {
  color: var(--text-color);
  text-decoration: none;
  transition: color 0.3s ease;
}

.links-column a:hover {
  color: var(--primary-color);
}

@media (max-width: 992px) {
  .grid-container {
    grid-template-columns: 1fr;
  }

  .links-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 576px) {
  .sitemap-container {
    padding: 1rem;
  }

  .content-wrapper {
    padding: 1rem;
  }

  .links-grid {
    grid-template-columns: 1fr;
  }

  h1 {
    font-size: 2rem;
  }

  h2 {
    font-size: 1.5rem;
  }

  .map-container {
    height: 300px;
  }
}
</style> 