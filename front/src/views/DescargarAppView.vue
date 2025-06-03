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
        <button @click="handleDownload('/descargar/ImpulseData-Setup.exe', 'ImpulseData-Setup.exe')" class="download-button">
          <i class="fas fa-download"></i> Descargar para Windows
        </button>
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
        <button @click="handleDownload('/descargar/ImpulseData-1.0.0.dmg', 'ImpulseData-1.0.0.dmg')" class="download-button">
          <i class="fas fa-download"></i> Descargar para macOS
        </button>
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
          <li>Descarga el archivo <strong>ImpulseData-1.0.0.dmg</strong></li>
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
          <i class="fa-solid fa-file-pdf"></i>
          <h3>Automatización de PDF</h3>
          <p>Automatiza la generación de PDF de tus memorias corporativas.</p>
        </div>
        <div class="feature-item">
          <i class="fa-solid fa-robot"></i>
          <h3>Soporte Personalizado</h3>
          <p>Recibe soporte personalizado para tus necesidades mediante tickets o nuestro chatbot.</p>
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

// Función para manejar las descargas directamente
const handleDownload = (filePath, fileName) => {
  // Crear un enlace temporal y simular clic en él
  const link = document.createElement('a');
  link.href = filePath;
  link.download = fileName;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
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
  color: #9c27b0;
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
  border-left: 4px solid #e91e63;
  padding: 15px 20px;
  margin-bottom: 40px;
  border-radius: 4px;
}

.beta-notice i {
  font-size: 2em;
  color: #e91e63;
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
  color: #9c27b0;
}

.download-card h2 {
  font-size: 1.8em;
  margin-bottom: 5px;
  color: #9c27b0;
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
  color: #e91e63;
}

.download-button {
  display: flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(45deg, #9c27b0, #e91e63);
  color: white;
  border: none;
  padding: 13px 25px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.1em;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(156, 39, 176, 0.3);
}

.download-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(156, 39, 176, 0.4);
}

.instructions-section {
  margin-bottom: 60px;
}

.instructions-section h2 {
  text-align: center;
  color: #9c27b0;
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
  color: #9c27b0;
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
  color: #9c27b0;
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
  font-size: 2em;
  color: #e91e63;
  margin-bottom: 15px;
}

.feature-item h3 {
  color: #9c27b0;
  margin-bottom: 10px;
}

.support-section {
  text-align: center;
  background: #f9f9f9;
  padding: 30px;
  border-radius: 12px;
}

.support-section h2 {
  color: #9c27b0;
  margin-bottom: 15px;
}

.support-link {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background-color: #9c27b0;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.support-link:hover {
  background-color: #8e24aa;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(156, 39, 176, 0.3);
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