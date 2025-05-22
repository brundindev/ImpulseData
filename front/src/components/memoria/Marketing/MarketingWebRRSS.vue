<template>
  <div class="form-step">
    <h3>6.1 Web y Redes Sociales</h3>
    
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
        <small class="text-muted">Incluye {{ Math.round((datos.publicacionesWeb || 443) * 0.78) }} noticias y {{ Math.round((datos.publicacionesWeb || 443) * 0.22) }} eventos</small>
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
          <div class="red-col">Red Social</div>
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
  max-width: 800px;
  margin: 0 auto;
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
</style>