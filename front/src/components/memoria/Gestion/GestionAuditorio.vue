<template>
  <div class="form-step">
    <h3 class="program-title">Auditorio</h3>
    
    <div class="form-group">
      <label>Nº de Actividades</label>
      <input 
        type="number" 
        v-model="datos.actividades" 
        class="form-control"
        min="0"
        placeholder="Ej: 4"
      >
    </div>

    <div class="form-group">
      <label>Nº de Asistentes</label>
      <input 
        type="number" 
        v-model="datos.asistentes" 
        class="form-control"
        min="0"
        placeholder="Ej: 2550"
      >
    </div>

    <!-- Vista Previa -->
    <section class="bloque vista-previa">
      <h4>Vista Previa del Auditorio</h4>
      <div class="preview-container">
        <div class="preview-header">
          <div class="preview-number">5.1</div>
          <div class="preview-title-section">
            <h2 class="preview-main-title">AUDITORIO</h2>
          </div>
        </div>

        <div class="preview-stats-grid">
          <div class="stat-card">
            <div class="stat-icon">📅</div>
            <div class="stat-value">{{ datos.actividades || '0' }}</div>
            <div class="stat-label">Actividades realizadas</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">👥</div>
            <div class="stat-value">{{ datos.asistentes || '0' }}</div>
            <div class="stat-label">Total asistentes</div>
          </div>
        </div>

        <!-- <div class="anexo-nota">
          <div class="anexo-icon">📎</div>
          <div class="anexo-text">Anexo 50: Actividades realizadas en el auditorio Puerto Ferriza</div>
        </div> -->
      </div>
    </section>

    <div class="form-actions">
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

const esValido = computed(() => {
  return datos.value.actividades && 
         datos.value.asistentes;
});

const emit = defineEmits(['update:modelValue', 'siguiente']);

const datos = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

</script>

<style scoped>
/* Estilos heredados de DesarrolloLocal */
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
  background: #C696C4;
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  padding: 1rem 1.2rem;
}

.preview-main-title {
  color: #8C5CA6;
  font-size: 1.8rem;
  margin: 0;
  font-weight: bold;
  border-bottom: solid #C696C4;
}

.preview-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
}

.stat-card {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: 2px solid #b71c50;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
}

.stat-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: bold;
  color: #b71c50;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #495057;
  font-weight: 500;
  font-size: 1.1rem;
}

/* .anexo-nota {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #edc7cd;
  border-radius: 8px;
  margin-top: 2rem;
}

.anexo-icon {
  font-size: 1.5rem;
}

.anexo-text {
  color: #b71c50;
  font-weight: 500;
  font-size: 0.95rem;
} */

/* Estilos existentes del formulario */
.form-step {
  max-width: 1000px;
  margin: 0 auto;
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px #0001;
}

.program-title {
  color: #b71c50;
  font-weight: bolder;
  border-bottom: 2px solid #ac3b61;
  padding-bottom: 8px;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-actions {
  margin-top: 2rem;
  display: flex;
  justify-content: flex-end;
}

.btn-primary {
  background: #ac3b61;
  color: white;
}

@media (max-width: 768px) {
  .preview-stats-grid {
    grid-template-columns: 1fr;
  }
  
  .preview-header {
    flex-direction: column;
    text-align: center;
  }
  
  .preview-number {
    margin-bottom: 1rem;
  }
}
</style>