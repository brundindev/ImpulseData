<template>
  <div class="terms-container">
    <div class="content-wrapper">
      <h1>Términos de Servicio</h1>
      
      <section class="terms-section">
        <h2>1. Aceptación de los Términos</h2>
        <p>Al acceder y utilizar ImpulseData, usted acepta estar sujeto a estos Términos de Servicio. Si no está de acuerdo con alguna parte de los términos, no podrá acceder al servicio.</p>
      </section>

      <section class="terms-section">
        <h2>2. Descripción del Servicio</h2>
        <p>ImpulseData es una plataforma de gestión de datos desarrollada para el Ayuntamiento de Alicante que proporciona:</p>
        <ul>
          <li>Análisis de datos en tiempo real</li>
          <li>Visualización de información municipal</li>
          <li>Herramientas de gestión y seguimiento</li>
          <li>Integración con sistemas municipales</li>
        </ul>
      </section>

      <section class="terms-section">
        <h2>3. Cuentas de Usuario</h2>
        <p>Al crear una cuenta en nuestra plataforma, usted garantiza que:</p>
        <ul>
          <li>Toda la información proporcionada es verdadera y precisa</li>
          <li>Mantendrá la información de su cuenta actualizada</li>
          <li>Es mayor de edad y tiene capacidad legal para aceptar estos términos</li>
          <li>No compartirá sus credenciales de acceso</li>
        </ul>
      </section>

      <section class="terms-section">
        <h2>4. Uso Aceptable</h2>
        <p>Se compromete a no utilizar el servicio para:</p>
        <ul>
          <li>Actividades ilegales o fraudulentas</li>
          <li>Transmitir malware o código dañino</li>
          <li>Interferir con la seguridad del servicio</li>
          <li>Acceder a datos no autorizados</li>
        </ul>
      </section>

      <section class="terms-section">
        <h2>5. Propiedad Intelectual</h2>
        <p>Todo el contenido presente en ImpulseData, incluyendo pero no limitado a:</p>
        <ul>
          <li>Textos, gráficos y logotipos</li>
          <li>Software y código fuente</li>
          <li>Bases de datos y estructuras</li>
          <li>Diseños y elementos visuales</li>
        </ul>
        <p>Son propiedad del Ayuntamiento de Alicante y están protegidos por las leyes de propiedad intelectual.</p>
      </section>

      <section class="terms-section">
        <h2>6. Modificaciones del Servicio</h2>
        <p>Nos reservamos el derecho de:</p>
        <ul>
          <li>Modificar o discontinuar el servicio</li>
          <li>Cambiar tarifas de suscripción</li>
          <li>Actualizar estos términos de servicio</li>
        </ul>
        <p>Los cambios serán efectivos tras su publicación en la plataforma.</p>
      </section>

      <section class="terms-section">
        <h2>7. Contacto</h2>
        <p>Para cualquier consulta sobre estos términos, contacte con:</p>
        <div class="contact-info">
          <p>Email: legal@impulsedata.es</p>
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
  document.title = 'Términos de Servicio - ImpulseData';
});
</script>

<style scoped>
.terms-container {
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

.terms-section {
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
  .terms-container {
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