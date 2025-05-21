<template>
  <div class="form-step">
    <h3>6.1 Web y Redes Sociales</h3>
        
        <div class="form-group">
          <label>Web ImpulsaAlicante</label>
          <input 
            v-model="datos.webImpulsaAlicante" 
            class="form-control"
            placeholder="URL de la web principal"
          >
        </div>

        <div class="form-group">
          <label>Web Portalempleo</label>
          <input 
            v-model="datos.webPortalempleo" 
            class="form-control"
            placeholder="URL de la web de empleo"
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
              placeholder="Nº de publicaciones"
            >
            <span class="input-info">Incluir noticias y eventos</span>
          </div>
        </div>
               
        <div class="form-group">
          <label>Nº de cursos y píldoras formativas difundidas a través de PortalEmpleo</label>
          <input 
            type="number" 
            v-model="datos.cursosPortalempleo" 
            class="form-control"
            min="0"
            placeholder="Nº de cursos"
          >
        </div>

        <div class="form-group">
          <label>Nº de empresas que han difundido ofertas de trabajo a través de PortalEmpleo</label>
          <input 
            type="number" 
            v-model="datos.empresasPortalempleo" 
            class="form-control"
            min="0"
            placeholder="Nº de empresas"
          >
        </div>

        <div class="form-section">
          <h4>Redes Sociales - Seguidores</h4>
          <div class="social-grid">
            <div class="social-item">
              <label>Facebook</label>
              <input 
                type="number" 
                v-model="datos.seguidoresFacebook" 
                class="form-control"
                min="0"
                placeholder="Nº de seguidores"
              >
            </div>
            <div class="social-item">
              <label>Twitter</label>
              <input 
                type="number" 
                v-model="datos.seguidoresTwitter" 
                class="form-control"
                min="0"
                placeholder="Nº de seguidores"
              >
            </div>
            <div class="social-item">
              <label>Instagram</label>
              <input 
                type="number" 
                v-model="datos.seguidoresInstagram" 
                class="form-control"
                min="0"
                placeholder="Nº de seguidores"
              >
            </div>
            <div class="social-item">
              <label>YouTube</label>
              <input 
                type="number" 
                v-model="datos.seguidoresYoutube" 
                class="form-control"
                min="0"
                placeholder="Nº de seguidores"
              >
            </div>
            <div class="social-item">
              <label>LinkedIn</label>
              <input 
                type="number" 
                v-model="datos.seguidoresLinkedin" 
                class="form-control"
                min="0"
                placeholder="Nº de seguidores"
              >
            </div>
            <div class="social-item">
              <label>Telegram</label>
              <input 
                type="number" 
                v-model="datos.seguidoresTelegram" 
                class="form-control"
                min="0"
                placeholder="Nº de seguidores"
              >
            </div>
          </div>
        </div>

        <div class="form-section">
          <h4>Redes Sociales - Publicaciones</h4>
          <div class="social-grid">
            <div class="social-item">
              <label>Facebook</label>
              <input 
                type="number" 
                v-model="datos.publicacionesFacebook" 
                class="form-control"
                min="0"
                placeholder="Nº de publicaciones"
              >
            </div>
            <div class="social-item">
              <label>Twitter</label>
              <input 
                type="number" 
                v-model="datos.publicacionesTwitter" 
                class="form-control"
                min="0"
                placeholder="Nº de publicaciones"
              >
            </div>
            <div class="social-item">
              <label>Instagram</label>
              <input 
                type="number" 
                v-model="datos.publicacionesInstagram" 
                class="form-control"
                min="0"
                placeholder="Nº de publicaciones"
              >
            </div>
            <div class="social-item">
              <label>YouTube</label>
              <input 
                type="number" 
                v-model="datos.publicacionesYoutube" 
                class="form-control"
                min="0"
                placeholder="Nº de publicaciones"
              >
            </div>
            <div class="social-item">
              <label>LinkedIn</label>
              <input 
                type="number" 
                v-model="datos.publicacionesLinkedin" 
                class="form-control"
                min="0"
                placeholder="Nº de publicaciones"
              >
            </div>
            <div class="social-item">
              <label>Telegram</label>
              <input 
                type="number" 
                v-model="datos.publicacionesTelegram" 
                class="form-control"
                min="0"
                placeholder="Nº de publicaciones"
              >
            </div>
          </div>
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
if (!datos.value.descripcion) datos.value.descripcion = '';
if (!datos.value.personal) {
  datos.value.personal = [{
    nombre: '',
    cargo: '',
    formacion: '',
    experiencia: ''
  }];
}
if (!datos.value.presupuestoAnual) datos.value.presupuestoAnual = 0;
if (!datos.value.herramientas) datos.value.herramientas = '';
if (!datos.value.recursosMateriales) datos.value.recursosMateriales = '';

const agregarPersona = () => {
  datos.value.personal.push({
    nombre: '',
    cargo: '',
    formacion: '',
    experiencia: ''
  });
};

const eliminarPersona = (index) => {
  if (datos.value.personal.length > 1) {
    datos.value.personal.splice(index, 1);
  }
};

const esValido = computed(() => {
  return datos.value.descripcion &&
         datos.value.personal.every(persona => 
           persona.nombre && persona.cargo
         ) &&
         datos.value.presupuestoAnual >= 0;
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

.persona-item {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.persona-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.persona-header h4 {
  margin: 0;
  color: #004698;
  font-size: 1.2rem;
}

.recursos {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
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