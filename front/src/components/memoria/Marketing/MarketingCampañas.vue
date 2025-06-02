<template>
  <div class="form-step">
    <h3 style="color: #706052;">Campañas de Marketing y Publicidad</h3>
    
    <div class="campanias-section">
      <div class="campanias-grid">
        <div 
          v-for="(campania, index) in datos.campanias" 
          :key="index" 
          class="campania-item"
        >
          <div class="campania-header">
            <h4>Campaña {{ index + 1 }}</h4>
            <button 
              v-if="datos.campanias.length > 1" 
              @click="eliminarCampania(index)" 
              class="btn btn-sm btn-danger"
            >
              <span class="btn-icon">×</span>
            </button>
          </div>
          <div class="form-group">
            <label>Nombre de la campaña</label>
            <input 
              v-model="campania.nombre" 
              class="form-control"
              placeholder="Nombre de la campaña"
            >
          </div>
        </div>
      </div>
      <button @click="agregarCampania" class="btn btn-primary">
        <span class="btn-icon">+</span> Agregar Campaña
      </button>
    </div>

    <div class="preview-section">
      <h4>Vista previa de las campañas</h4>
      <div class="report-section">
        <div class="report-header">
          <div class="report-number">6.3</div>
          <div class="report-title">
            <h2 class="preview-main-title-black">CAMPAÑAS DE </h2>
            <h2 class="preview-main-title-brown">MARKETING Y PUBLICIDAD</h2>
          </div>
        </div>
        
        <div class="report-content">
          <div class="campaigns-display">
            <div class="campaigns-column">
              <div v-for="(campania, index) in campaniasColumn1" :key="'camp1-'+index" class="campaign-item-preview">
                <div class="bullet">•</div>
                <div class="campaign-text">{{ campania.nombre || 'Campaña ' + (index+1) }}</div>
              </div>
            </div>
            <div class="campaigns-column">
              <div v-for="(campania, index) in campaniasColumn2" :key="'camp2-'+index" class="campaign-item-preview">
                <div class="bullet">•</div>
                <div class="campaign-text">{{ campania.nombre || 'Campaña ' + (index+1+campaniasColumn1.length) }}</div>
              </div>
            </div>
          </div>
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
        @click="guardarYFinalizar" 
        class="btn btn-primary"
        :disabled="!esValido"
      >
        Guardar y Finalizar
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

const emit = defineEmits(['update:modelValue', 'siguiente', 'anterior', 'guardar']);

const datos = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// Inicializar campanias si no existen
if (!datos.value.campanias || !datos.value.campanias.length) {
  datos.value.campanias = [
  ];
}

// Dividir las campañas en dos columnas para el informe
const campaniasColumn1 = computed(() => {
  const mitad = Math.ceil(datos.value.campanias.length / 2);
  return datos.value.campanias.slice(0, mitad);
});

const campaniasColumn2 = computed(() => {
  const mitad = Math.ceil(datos.value.campanias.length / 2);
  return datos.value.campanias.slice(mitad);
});

const agregarCampania = () => {
  datos.value.campanias.push({
    nombre: ''
  });
};

const eliminarCampania = (index) => {
  datos.value.campanias.splice(index, 1);
};

const esValido = computed(() => {
  return datos.value.campanias.length > 0 && 
         datos.value.campanias.every(campania => campania.nombre);
});

function guardarYFinalizar() {
  // Guardar los datos 
  emit('guardar', datos.value);
  
  // Si todo está completo, avanzar
  if (esValido.value) {
    emit('siguiente');
  }
}
</script>

<style scoped>
.form-step {
  max-width: 1000px;
  margin: 0 auto;
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px #0001;
  color: black;
}

.campanias-section {
  margin-bottom: 2rem;
}

.campanias-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.campania-item {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
}

.campania-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.campania-header h4 {
  margin: 0;
  color: #004698;
  font-size: 1.2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

/* Preview section */
.preview-section {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.preview-section h4 {
  margin-top: 0;
  color: #004698;
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.report-section {
  background: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  overflow: hidden;
}

.report-header {
  display: flex;
  align-items: center;
}

.report-number {
  background: #8B7D6B;
  color: white;
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.8rem;
  flex-shrink: 0;
}

.report-title {
  padding: 1rem 1.5rem;
  font-size: 1.4rem;
  flex: 1;
  letter-spacing: 0.5px;
}

.preview-main-title-black{
  color:black;
}

.preview-main-title-brown{
  color:#8B7D6B;
  border-bottom: 2px solid #8B7D6B;
}

.report-content {
  padding: 2rem;
  background: #f5f5f5;
}

.campaigns-display {
  display: flex;
  gap: 2rem;
}

.campaigns-column {
  flex: 1;
  background: #D4CFC7;
  padding: 1.5rem;
}

.campaign-item-preview {
  display: flex;
  align-items: flex-start;
  margin-bottom: 1rem;
  line-height: 1.4;
}

.bullet {
  margin-right: 0.75rem;
  color: black;
  font-weight: bold;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.campaign-text {
  color: black;
  font-size: 0.95rem;
  font-weight: 500;
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