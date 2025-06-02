<template>
  <div class="form-step">
    <h3 style="color: #706052;">Otros Canales Online</h3>
    
    <div class="canales-section">
      <h4>MailChimp</h4>
      <div class="grid-2">
        <div class="form-group">
          <label>Nº de contactos</label>
          <input 
            type="number"
            v-model="datos.mailchimpContactos"
            class="form-control"
            min="0"
            placeholder="Nº de contactos"
            :value="datos.mailchimpContactos"
          > 
        </div>
        <div class="form-group">
          <label>Nº de suscritos</label>
          <input 
            type="number"
            v-model="datos.mailchimpSuscritos"
            class="form-control"
            min="0"
            placeholder="Nº de suscritos"
            :value="datos.mailchimpSuscritos"
          > 
        </div>
      </div>
    </div>

    <div class="canales-section">
      <h4>Zoom</h4>
      <div class="form-group">
        <label>Nº de actividades formativas</label>
        <div class="input-with-info">
          <input 
            type="number"
            v-model="datos.zoomActividades"
            class="form-control"
            min="0"
            placeholder="Nº de actividades formativas"
            :value="datos.zoomActividades"
          >
          <small class="text-muted">Media de <input type="number" v-model="datos.zoomAsistentes" class="form-control" min="0" placeholder="Nº de asistentes" :value="datos.zoomAsistentes"> asistentes por sesión</small>
        </div>
      </div>
    </div>

    <!-- Vista Previa -->
  <section class="bloque vista-previa">
    <h4>Vista Previa de Otros Canales Online</h4>
    <div class="preview-container">
      <div class="preview-header">
        <div class="preview-number">6.2</div>
        <div class="preview-title-section">
          <h2 class="preview-main-title">OTROS CANALES ONLINE</h2>
        </div>
      </div>

      <div class="canales-stats">
        <div class="canal-item">
          <div class="canal-label">Mailchimp:</div>
          <div class="canal-values">
            <div class="canal-stat">
              <div class="stat-number">{{ datos.mailchimpContactos || '0' }}</div>
              <div class="stat-label">contactos</div>
            </div>
            <div class="canal-stat">
              <div class="stat-number">{{ datos.mailchimpSuscritos || '0' }}</div>
              <div class="stat-label">suscritos</div>
            </div>
          </div>
        </div>

        <div class="canal-item">
          <div class="canal-label">Zoom:</div>
          <div class="canal-values">
            <div class="canal-stat">
              <div class="stat-number">{{ datos.zoomActividades || '0' }}</div>
              <div class="stat-label">actividades formativas, con una media de {{ datos.zoomAsistentes || '0' }} asistentes por sesión</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

    <div class="form-actions">
      <button 
        @click="$emit('anterior')" 
        class="btn btn-secondary"
      >
        Anterior
      </button>
      <button 
        @click="$emit('siguiente')" 
        class="btn btn-primary"
        :disabled="!esValido"
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

const emit = defineEmits(['update:modelValue', 'siguiente', 'anterior']);

const datos = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});


const esValido = computed(() => {
  return datos.value.mailchimpContactos > 0 && 
         datos.value.mailchimpSuscritos > 0 &&
         datos.value.zoomActividades > 0;
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
  color:black;
}

.form-group {
  margin-bottom: 1.5rem;
}

.canales-section {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.canales-section h4 {
  margin-top: 0;
  color: #004698;
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
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
  justify-content: space-between;
}

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
  border-radius: 4px;
}

.preview-main-title {
  color: #8a6d57;
  font-size: 1.8rem;
  margin: 0;
  font-weight: bold;
  border-bottom: 3px solid #8a6d57;
  padding-bottom: 0.5rem;
}

.canales-stats {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.canal-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.canal-label {
  font-weight: bold;
  color: #495057;
  min-width: 100px;
}

.canal-values {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.canal-stat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stat-number {
  background: #8a6d57;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  min-width: 60px;
  text-align: center;
}

.stat-label {
  color: #495057;
  font-weight: 500;
}

@media (max-width: 768px) {
  .canal-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .canal-values {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .preview-header {
    flex-direction: column;
    text-align: center;
  }
}
</style>