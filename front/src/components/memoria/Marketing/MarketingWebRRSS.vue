<template>
  <div class="form-step">
    <h3 style="color: #706052;">Web y Redes Sociales</h3>
    
    <div class="form-group">
      <label>Web Impulsalicante</label>
      <input 
        v-model="datos.webImpulsalicante" 
        class="form-control"
        placeholder="URL de la web principal"
        :value="datos.webImpulsalicante || 'www.impulsalicante.es'"
      >
    </div>

    <div class="form-group">
      <label>Web Portalemp</label>
      <input 
        v-model="datos.webPortalemp" 
        class="form-control"
        placeholder="URL de la web de empleo"
        :value="datos.webPortalemp || 'https://impulsalicante.portalemp.com/'"
      >
    </div>

    <div class="form-group">
      <label>Nº publicaciones en la página web</label>
      <div class="input-with-info">
        <input 
          type="number" 
          v-model="datos.publicacionesWeb" 
          class="form-control"
          min="0"
          placeholder="Nº de publicaciones (noticias y eventos)"
          :value="datos.publicacionesWeb"
        >
        <small class="text-muted">Incluye <input type="number" v-model="datos.noticiasWeb" class="form-control" min="0" placeholder="Nº de noticias" :value="datos.noticiasWeb"> noticias y <input type="number" v-model="datos.eventosWeb" class="form-control" min="0" placeholder="Nº de eventos" :value="datos.eventosWeb"> eventos</small>
      </div>
    </div>
         
    <div class="form-group">
      <label>Nº de cursos y píldoras formativas difundidas a través de Portalemp</label>
      <input 
        type="number" 
        v-model="datos.cursosPortalemp" 
        class="form-control"
        min="0"
        placeholder="Nº de cursos"
        :value="datos.cursosPortalemp"
      >
    </div>

    <div class="form-group">
      <label>Nº de empresas que han difundido ofertas de trabajo a través de Portalemp</label>
      <input 
        type="number" 
        v-model="datos.empresasPortalemp" 
        class="form-control"
        min="0"
        placeholder="Nº de empresas"  
        :value="datos.empresasPortalemp"
      >
    </div>

    <div class="redes-section">
      <h4>Redes Sociales</h4>
      
      <div class="redes-table">
        <div class="redes-header">
          <div class="red-col" style="color:white !important">Red Social</div>
          <div class="stats-col">Nº Seguidores</div>
          <div class="stats-col">Publicaciones</div>
        </div>
        
        <div class="redes-row">
          <div class="red-col">Facebook</div>
          <div class="stats-col">
            <input 
              type="number" 
              v-model="datos.seguidoresFacebook" 
              class="form-control"
              min="0"
              :value="datos.seguidoresFacebook"
            >
          </div>
          <div class="stats-col">
            <input 
              type="number" 
              v-model="datos.publicacionesFacebook" 
              class="form-control"
              min="0"
              :value="datos.publicacionesFacebook"
            >
          </div>
        </div>
        
        <div class="redes-row">
          <div class="red-col">Twitter</div>
          <div class="stats-col">
            <input 
              type="number" 
              v-model="datos.seguidoresTwitter" 
              class="form-control"
              min="0"
              :value="datos.seguidoresTwitter"
            >
          </div>
          <div class="stats-col">
            <input 
              type="number" 
              v-model="datos.publicacionesTwitter" 
              class="form-control"
              min="0"
              :value="datos.publicacionesTwitter"
            >
          </div>
        </div>
        
        <div class="redes-row">
          <div class="red-col">Instagram</div>
          <div class="stats-col">
            <input 
              type="number" 
              v-model="datos.seguidoresInstagram" 
              class="form-control"
              min="0"
              :value="datos.seguidoresInstagram"
            >
          </div>
          <div class="stats-col">
            <input 
              type="number" 
              v-model="datos.publicacionesInstagram" 
              class="form-control"
              min="0"
              :value="datos.publicacionesInstagram"
            >
          </div>
        </div>
        
        <div class="redes-row">
          <div class="red-col">YouTube</div>
          <div class="stats-col">
            <input 
              type="number" 
              v-model="datos.seguidoresYoutube" 
              class="form-control"
              min="0"
              :value="datos.seguidoresYoutube"
            >
          </div>
          <div class="stats-col">
            <input 
              type="number" 
              v-model="datos.publicacionesYoutube" 
              class="form-control"
              min="0"
              :value="datos.publicacionesYoutube"
            >
          </div>
        </div>
        
        <div class="redes-row">
          <div class="red-col">LinkedIn</div>
          <div class="stats-col">
            <input 
              type="number" 
              v-model="datos.seguidoresLinkedin" 
              class="form-control"
              min="0"
              :value="datos.seguidoresLinkedin"
            >
          </div>
          <div class="stats-col">
            <input 
              type="number" 
              v-model="datos.publicacionesLinkedin" 
              class="form-control"
              min="0"
              :value="datos.publicacionesLinkedin"
            >
          </div>
        </div>
        
        <div class="redes-row">
          <div class="red-col">Telegram</div>
          <div class="stats-col">
            <input 
              type="number" 
              v-model="datos.seguidoresTelegram" 
              class="form-control"
              min="0"
              :value="datos.seguidoresTelegram"
            >
          </div>
          <div class="stats-col">
            <input 
              type="number" 
              v-model="datos.publicacionesTelegram" 
              class="form-control"
              min="0"
              :value="datos.publicacionesTelegram"
            >
          </div>
        </div>
      </div>
    </div>


    <!-- Agregar esta sección antes de .form-actions -->
<section class="bloque vista-previa">
  <h4>Vista Previa de Web y Redes Sociales</h4>
  <div class="preview-container">
    <div class="preview-header">
      <div class="preview-number">6.1</div>
      <div class="preview-title-section">
        <h2 class="preview-main-title">WEB Y REDES SOCIALES</h2>
      </div>
    </div>

    <!-- Web info -->
    <div class="web-info">
      <div class="web-item">
        <strong>Web Impulsalicante:</strong> {{ datos.webImpulsalicante || 'www.impulsalicante.es' }}
      </div>
      <div class="web-item">
        <strong>Web Portalemp:</strong> {{ datos.webPortalemp || 'https://impulsalicante.portalemp.com/' }}
      </div>
    </div>

    <!-- Stats boxes -->
    <div class="stats-boxes">
      <div class="stat-box">
        <div class="stat-icon">🌐</div>
        <div class="stat-number">{{ datos.publicacionesWeb || '0' }}</div>
        <div class="stat-text">publicaciones en la página web ({{ datos.noticiasWeb || '0' }} noticias y {{ datos.eventosWeb || '0' }} eventos)</div>
      </div>
      
      <div class="stat-box">
        <div class="stat-icon">📚</div>
        <div class="stat-number">{{ datos.cursosPortalemp || '0' }}</div>
        <div class="stat-text">cursos y píldoras formativas difundidas a través de Portalemp</div>
      </div>
      
      <div class="stat-box">
        <div class="stat-icon">🏢</div>
        <div class="stat-number">{{ datos.empresasPortalemp || '0' }}</div>
        <div class="stat-text">empresas han difundido ofertas de trabajo a través de Portalemp</div>
      </div>
    </div>

    <!-- Social media table -->
    <div class="social-table">
      <div class="social-header">
        <div class="platform-col"></div>
        <div class="platform-col">Facebook</div>
        <div class="platform-col">X-Twitter</div>
        <div class="platform-col">Instagram</div>
        <div class="platform-col">Youtube</div>
        <div class="platform-col">LinkedIn</div>
        <div class="platform-col">Telegram</div>
      </div>
      
      <div class="social-row">
        <div class="row-label">Nº Seguidores</div>
        <div class="social-value">{{ datos.seguidoresFacebook || '0' }}</div>
        <div class="social-value">{{ datos.seguidoresTwitter || '0' }}</div>
        <div class="social-value">{{ datos.seguidoresInstagram || '0' }}</div>
        <div class="social-value">{{ datos.seguidoresYoutube || '0' }}</div>
        <div class="social-value">{{ datos.seguidoresLinkedin || '0' }}</div>
        <div class="social-value">{{ datos.seguidoresTelegram || '0' }}</div>
      </div>
      
      <div class="social-row">
        <div class="row-label">Publicaciones</div>
        <div class="social-value">{{ datos.publicacionesFacebook || '0' }}</div>
        <div class="social-value">{{ datos.publicacionesTwitter || '0' }}</div>
        <div class="social-value">{{ datos.publicacionesInstagram || '0' }}</div>
        <div class="social-value">{{ datos.publicacionesYoutube || '0' }}</div>
        <div class="social-value">{{ datos.publicacionesLinkedin || '0' }}</div>
        <div class="social-value">{{ datos.publicacionesTelegram || '0' }}</div>
      </div>
    </div>
  </div>
</section>

    <div class="form-actions">
      <button 
        @click="$emit('siguiente')" 
        class="btn btn-primary"
      >
        Siguiente
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update:modelValue', 'siguiente']);

const datos = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// Inicializar datos si no existen
if (!datos.value.webImpulsalicante) datos.value.webImpulsalicante = 'www.impulsalicante.es';
if (!datos.value.webPortalemp) datos.value.webPortalemp = 'https://impulsalicante.portalemp.com/';


const esValido = computed(() => {
  return datos.value.webImpulsalicante && 
         datos.value.webPortalemp &&
         datos.value.publicacionesWeb > 0;
});
</script>

<style scoped>
.form-step {
  max-width: 1000px;
  margin: 0 auto;
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px #0001;
}

.form-group {
  margin-bottom: 1.5rem;
}

.input-with-info {
  position: relative;
}

.text-muted {
  color: #6c757d;
  font-size: 0.85rem;
  margin-top: 0.25rem;
  display: block;
}

.redes-section {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.redes-section h4 {
  margin-top: 0;
  color: #004698;
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.redes-table {
  width: 100%;
}

.redes-header {
  display: flex;
  background: #8a6d57;  ;
  color: white;
  font-weight: 500;
  border-radius: 4px 4px 0 0;
}

.redes-row {
  display: flex;
  border-bottom: 1px solid #e9ecef;
}

.redes-row:last-child {
  border-bottom: none;
}

.red-col {
  flex: 1;
  padding: 0.75rem;
  display: flex;
  align-items: center;
  color:black;
  :first-child{
    color:white !important;
  };
}

.stats-col {
  flex: 1;
  padding: 0.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-control:focus {
  outline: none;
  border-color: #004698;
  box-shadow: 0 0 0 2px rgba(0, 70, 152, 0.1);
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-sm {
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
}

.btn-icon {
  margin-right: 0.25rem;
}

.btn-primary {
  background: #004698;
  color: white;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn:hover {
  opacity: 0.9;
}

.btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.form-actions {
  margin-top: 2rem;
  display: flex;
  justify-content: flex-end;
}
/* vista previa */
.bloque {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.vista-previa {
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 1.5rem;
  background: #f8f9fa;
  margin-top: 2rem;
}

.preview-container {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.preview-header {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
}

.preview-number {
  background: #8a6d57;
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  padding: 1rem 1.2rem;
}

.preview-main-title {
  color: #8a6d57;
  font-size: 1.8rem;
  margin: 0;
  font-weight: bold;
  border-bottom: 3px solid #8a6d57;
  padding-bottom: 0.5rem;
}

.web-info {
  margin-bottom: 2rem;
  font-size: 0.95rem;
  text-align: center;
}

.web-item {
  margin-bottom: 0.5rem;
  color: #495057;
}

.stats-boxes {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: center;
}

.stat-box {
  padding: 0.5rem;
  border-radius: 8px;
  flex: 1;
  min-width: 100px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stat-icon {
  font-size: 2rem;
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  background: #8a6d57;
  width: 4rem;
}

.stat-text {
  font-size: 0.9rem;
  line-height: 1.3;
  color: black;
}

.social-table {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #dee2e6;
}

.social-header {
  background: #8a6d57;
  color: white;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  font-weight: 600;
  font-size: 0.85rem;
}

.platform-col {
  padding: 0.75rem 0.5rem;
  text-align: center;
  border-right: 1px solid rgba(255,255,255,0.2);
}

.platform-col:last-child {
  border-right: none;
}

.social-row {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border-bottom: 1px solid #dee2e6;
}

.social-row:last-child {
  border-bottom: none;
}

.row-label {
  background: #f8f9fa;
  /* padding: 0.75rem; */
  /* font-weight: 600; */
  color: black;
  border-right: 1px solid #dee2e6;
  display: flex;
  align-items: center;
  font-size: small;
  font-weight: bold;
  justify-content: center;
}

.social-value {
  padding: 0.75rem 0.5rem;
  text-align: center;
  border-right: 1px solid #dee2e6;
  color: black;
}

.social-value:last-child {
  border-right: none;
}

@media (max-width: 768px) {
  .stats-boxes {
    flex-direction: column;
  }
  
  .stat-box {
    min-width: auto;
  }
  
  .social-header,
  .social-row {
    grid-template-columns: repeat(3, 1fr);
    font-size: 0.75rem;
  }
  
  .platform-col,
  .social-value {
    padding: 0.5rem 0.25rem;
  }
}
</style>