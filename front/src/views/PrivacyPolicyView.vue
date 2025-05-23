<template>
  <div class="privacy-container">
    <div class="content-wrapper">
      <h1>Política de Privacidad</h1>
      
      <section class="privacy-section">
        <h2>1. Información que Recopilamos</h2>
        <p>En ImpulseData, recopilamos la siguiente información:</p>
        <ul>
          <li>Información de registro (nombre, email, etc.)</li>
          <li>Datos de uso de la plataforma</li>
          <li>Información técnica (IP, tipo de dispositivo, etc.)</li>
        </ul>
      </section>

      <section class="privacy-section">
        <h2>2. Uso de la Información</h2>
        <p>Utilizamos la información recopilada para:</p>
        <ul>
          <li>Proporcionar y mejorar nuestros servicios</li>
          <li>Personalizar su experiencia</li>
          <li>Comunicarnos con usted</li>
          <li>Garantizar la seguridad de la plataforma</li>
        </ul>
      </section>

      <section class="privacy-section">
        <h2>3. Protección de Datos</h2>
        <p>Sus datos están protegidos mediante:</p>
        <ul>
          <li>Encriptación de datos sensibles</li>
          <li>Acceso restringido a personal autorizado</li>
          <li>Monitorización continua de seguridad</li>
          <li>Cumplimiento con RGPD y normativas aplicables</li>
        </ul>
      </section>

      <section class="privacy-section">
        <h2>4. Sus Derechos</h2>
        <p>Usted tiene derecho a:</p>
        <ul>
          <li>Acceder a sus datos personales</li>
          <li>Rectificar información inexacta</li>
          <li>Solicitar la eliminación de sus datos</li>
          <li>Oponerse al procesamiento de sus datos</li>
          <li>Portabilidad de datos</li>
        </ul>
      </section>

      <section class="privacy-section">
        <h2>5. Contacto</h2>
        <p>Para cualquier consulta sobre privacidad, contacte con:</p>
        <div class="contact-info">
          <p>Email: privacidad@impulsedata.es</p>
          <p>Teléfono: +34 965 14 00 00</p>
          <p>Dirección: Plaza del Ayuntamiento, 1, 03002 Alicante</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  // Cambiar el título de la página
  document.title = 'Política de Privacidad - ImpulseData';
});
</script>

<style scoped>
.privacy-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background: #ffffff;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
}

.content-wrapper {
  max-width: 800px;
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

.privacy-section {
  margin-bottom: 3rem;
}

h2 {
  color: var(--primary-color);
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

p {
  color: var(--text-color);
  line-height: 1.6;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

ul {
  list-style-type: none;
  padding-left: 1.5rem;
  margin-bottom: 1.5rem;
}

li {
  color: var(--text-color);
  margin-bottom: 0.5rem;
  position: relative;
  line-height: 1.6;
  font-size: 1.1rem;
}

li::before {
  content: "•";
  color: var(--primary-color);
  font-weight: bold;
  position: absolute;
  left: -1.5rem;
}

.contact-info {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-top: 1rem;
}

.contact-info p {
  margin-bottom: 0.5rem;
}

@media (max-width: 768px) {
  .privacy-container {
    padding: 1rem;
  }

  .content-wrapper {
    padding: 1rem;
  }

  h1 {
    font-size: 2rem;
  }

  h2 {
    font-size: 1.5rem;
  }

  p, li {
    font-size: 1rem;
  }
}
</style> 