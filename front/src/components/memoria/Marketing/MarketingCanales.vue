<template>
  <div class="form-step">
    <h3>6.2 Otros Canales Online</h3>
    
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
  max-width: 800px;
  margin: 0 auto;
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
</style>