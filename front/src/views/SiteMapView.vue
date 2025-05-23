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
          <div class="map-container" ref="mapContainer"></div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const mapContainer = ref(null);

onMounted(() => {
  // Cambiar el título de la página
  document.title = 'Mapa del Sitio - ImpulseData';

  // Cargar el script de Google Maps
  const googleMapsScript = document.createElement('script');
  googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=TU_API_KEY`;
  googleMapsScript.async = true;
  googleMapsScript.defer = true;
  
  googleMapsScript.onload = initMap;
  document.head.appendChild(googleMapsScript);

  // Cargar Font Awesome
  const fontAwesomeScript = document.createElement('script');
  fontAwesomeScript.src = 'https://kit.fontawesome.com/a076d05399.js';
  fontAwesomeScript.crossOrigin = 'anonymous';
  document.head.appendChild(fontAwesomeScript);
});

function initMap() {
  // Coordenadas del Ayuntamiento de Alicante
  const ayuntamiento = { lat: 38.345996, lng: -0.481624 };
  
  // Crear el mapa
  const map = new google.maps.Map(mapContainer.value, {
    zoom: 16,
    center: ayuntamiento,
    styles: [
      {
        featureType: "all",
        elementType: "labels.text.fill",
        stylers: [{ color: "#444444" }]
      }
    ]
  });

  // Añadir marcador
  const marker = new google.maps.Marker({
    position: ayuntamiento,
    map: map,
    title: 'Ayuntamiento de Alicante'
  });

  // Añadir ventana de información
  const infowindow = new google.maps.InfoWindow({
    content: '<div style="padding: 10px;"><h3>Ayuntamiento de Alicante</h3><p>Plaza del Ayuntamiento, 1<br>03002 Alicante</p></div>'
  });

  marker.addListener('click', () => {
    infowindow.open(map, marker);
  });
}
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