<template>
  <div class="descargar-container">
    <div class="header-section">
      <h1>Descarga la aplicación de escritorio</h1>
      <p class="subtitle">Accede a ImpulseData desde tu ordenador con nuestra aplicación nativa</p>
    </div>

    <!-- Aviso de versión beta -->
    <div class="beta-notice">
      <i class="fas fa-info-circle"></i>
      <p>La aplicación de escritorio está actualmente en fase beta. Si encuentras algún error, por favor repórtalo a través de nuestro sistema de soporte.</p>
    </div>

    <div class="download-options">
      <div class="download-card">
        <div class="platform-logo">
          <i class="fab fa-windows"></i>
        </div>
        <h2>Windows</h2>
        <p>Versión 1.0.0</p>
        <div class="requirements">
          <p>Requisitos:</p>
          <ul>
            <li>Windows 10 o superior</li>
            <li>4GB RAM mínimo</li>
            <li>100MB espacio libre</li>
          </ul>
        </div>
        <a href="/descargar/ImpulseData-Setup.exe" class="download-button">
          <i class="fas fa-download"></i> Descargar para Windows
        </a>
      </div>

      <div class="download-card">
        <div class="platform-logo">
          <i class="fab fa-apple"></i>
        </div>
        <h2>macOS</h2>
        <p>Versión 1.0.0</p>
        <div class="requirements">
          <p>Requisitos:</p>
          <ul>
            <li>macOS 10.15 o superior</li>
            <li>4GB RAM mínimo</li>
            <li>100MB espacio libre</li>
          </ul>
        </div>
        <a href="/descargar/ImpulseData.dmg" class="download-button">
          <i class="fas fa-download"></i> Descargar para macOS
        </a>
      </div>
    </div>

    <div class="instructions-section">
      <h2>Instrucciones de instalación</h2>
      
      <div class="instruction-card">
        <h3>Windows</h3>
        <ol>
          <li>Descarga el archivo <strong>ImpulseData-Setup.exe</strong></li>
          <li>Haz doble clic en el archivo descargado</li>
          <li>Sigue las instrucciones del asistente de instalación</li>
          <li>Una vez completada la instalación, abre la aplicación desde el menú de inicio</li>
        </ol>
      </div>

      <div class="instruction-card">
        <h3>macOS</h3>
        <ol>
          <li>Descarga el archivo <strong>ImpulseData.dmg</strong></li>
          <li>Haz doble clic en el archivo descargado para montarlo</li>
          <li>Arrastra el icono de ImpulseData a la carpeta Aplicaciones</li>
          <li>Abre la aplicación desde el Launchpad o la carpeta Aplicaciones</li>
        </ol>
      </div>
    </div>

    <div class="features-section">
      <h2>Características de la aplicación</h2>
      <div class="features-grid">
        <div class="feature-item">
          <i class="fas fa-bolt"></i>
          <h3>Rendimiento Optimizado</h3>
          <p>Disfruta de una experiencia más rápida y fluida que en la versión web.</p>
        </div>
        <div class="feature-item">
          <i class="fas fa-wifi"></i>
          <h3>Modo Offline</h3>
          <p>Accede a parte de tus datos aunque no tengas conexión a internet.</p>
        </div>
        <div class="feature-item">
          <i class="fas fa-bell"></i>
          <h3>Notificaciones Nativas</h3>
          <p>Recibe alertas directamente en tu sistema operativo.</p>
        </div>
        <div class="feature-item">
          <i class="fas fa-lock"></i>
          <h3>Seguridad Mejorada</h3>
          <p>Almacenamiento local más seguro para tus datos sensibles.</p>
        </div>
      </div>
    </div>

    <div class="support-section">
      <h2>¿Necesitas ayuda?</h2>
      <p>Si tienes problemas con la descarga o instalación, contacta con nuestro equipo de soporte.</p>
      <RouterLink to="/soporte" class="support-link">
        <i class="fas fa-headset"></i> Ir a Soporte Técnico
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  document.title = 'Descargar App - ImpulseData';
});
</script>

<style scoped>
.descargar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  color: #333;
}

.header-section {
  text-align: center;
  margin-bottom: 30px;
}

.header-section h1 {
  font-size: 2.5em;
  color: #004698;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 1.2em;
  color: #666;
}

/* Aviso de versión beta */
.beta-notice {
  display: flex;
  align-items: center;
  gap: 15px;
  background-color: #f8f9fa;
  border-left: 4px solid #00c3ff;
  padding: 15px 20px;
  margin-bottom: 40px;
  border-radius: 4px;
}

.beta-notice i {
  font-size: 2em;
  color: #00c3ff;
}

.beta-notice p {
  margin: 0;
  color: #555;
}

.download-options {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 60px;
  flex-wrap: wrap;
}

.download-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  padding: 30px;
  width: 350px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.download-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.platform-logo {
  font-size: 3em;
  margin-bottom: 20px;
  color: #004698;
}

.download-card h2 {
  font-size: 1.8em;
  margin-bottom: 5px;
  color: #004698;
}

.download-card p {
  color: #666;
  margin-bottom: 20px;
}

.requirements {
  width: 100%;
  margin-bottom: 25px;
  text-align: left;
}

.requirements p {
  font-weight: bold;
  margin-bottom: 8px;
}

.requirements ul {
  list-style-type: none;
  padding-left: 5px;
}

.requirements li {
  margin-bottom: 5px;
  position: relative;
  padding-left: 20px;
}

.requirements li:before {
  content: "✓";
  position: absolute;
  left: 0;
  color: #00c3ff;
}

.download-button {
  background: linear-gradient(90deg, #00c3ff, #00ff8c);
  color: white;
  text-decoration: none;
  padding: 12px 25px;
  border-radius: 30px;
  font-weight: bold;
  display: inline-block;
  transition: transform 0.2s ease;
}

.download-button:hover {
  transform: scale(1.05);
}

.instructions-section {
  margin-bottom: 60px;
}

.instructions-section h2 {
  text-align: center;
  color: #004698;
  margin-bottom: 30px;
}

.instruction-cards {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
  justify-content: center;
}

.instruction-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.08);
  padding: 25px;
  margin-bottom: 20px;
}

.instruction-card h3 {
  color: #004698;
  margin-bottom: 15px;
  border-bottom: 2px solid #f5f5f5;
  padding-bottom: 10px;
}

.instruction-card ol {
  padding-left: 20px;
}

.instruction-card li {
  margin-bottom: 10px;
}

/* Sección de características */
.features-section {
  margin-bottom: 60px;
}

.features-section h2 {
  text-align: center;
  color: #004698;
  margin-bottom: 30px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
}

.feature-item {
  background: white;
  border-radius: 12px;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.08);
  padding: 25px;
  text-align: center;
  transition: transform 0.3s ease;
}

.feature-item:hover {
  transform: translateY(-5px);
}

.feature-item i {
  font-size: 2.5em;
  color: #00c3ff;
  margin-bottom: 15px;
}

.feature-item h3 {
  color: #004698;
  margin-bottom: 10px;
}

.support-section {
  text-align: center;
  background: #f9f9f9;
  padding: 30px;
  border-radius: 12px;
}

.support-section h2 {
  color: #004698;
  margin-bottom: 15px;
}

.support-link {
  display: inline-block;
  margin-top: 15px;
  background: #004698;
  color: white;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 30px;
  font-weight: bold;
  transition: background 0.2s ease;
}

.support-link:hover {
  background: #003475;
}

@media (max-width: 768px) {
  .download-options {
    flex-direction: column;
    align-items: center;
  }

  .download-card {
    width: 100%;
    max-width: 400px;
    margin-bottom: 20px;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style> 