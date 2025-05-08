<template>
  <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h2>{{ company.nombre }}</h2>
        <button class="close-button" @click="$emit('close')">&times;</button>
      </div>
      
      <div class="modal-body">
        <div class="info-section">
          <h3>Información General</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">Descripción</span>
              <p class="value">{{ company.descripcion }}</p>
            </div>
            <div class="info-item">
              <span class="label">Ciudad</span>
              <p class="value">{{ company.ciudad }}</p>
            </div>
            <div class="info-item">
              <span class="label">Fecha de creación</span>
              <p class="value">{{ formatDate(company.fechaCreacion) }}</p>
            </div>
          </div>
        </div>
        
        <div class="stats-section">
          <h3>Estadísticas</h3>
          <div class="stats-grid">
            <div class="stat-card">
              <span class="stat-value">{{ company.numDepartamentos }}</span>
              <span class="stat-label">Departamentos</span>
            </div>
            <div class="stat-card">
              <span class="stat-value">{{ company.numCentros }}</span>
              <span class="stat-label">Centros</span>
            </div>
            <div class="stat-card">
              <span class="stat-value">{{ company.numFormaciones }}</span>
              <span class="stat-label">Formaciones</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="modal-footer">
        <button class="btn btn-secondary" @click="$emit('close')">Cerrar</button>
        <button class="btn btn-primary" @click="$emit('edit', company)">Editar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    required: true
  },
  company: {
    type: Object,
    required: true
  }
});

defineEmits(['close', 'edit']);

const formatDate = (date) => {
  if (!date) return 'N/A';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  color: #666;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.close-button:hover {
  color: #333;
}

.modal-body {
  padding: 20px;
}

.info-section,
.stats-section {
  margin-bottom: 30px;
}

.info-section h3,
.stats-section h3 {
  margin: 0 0 15px;
  font-size: 18px;
  color: #333;
}

.info-grid {
  display: grid;
  gap: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.value {
  margin: 0;
  color: #333;
  line-height: 1.4;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.stat-card {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 24px;
  font-weight: 600;
  color: #007AFF;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn {
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: #007AFF;
  color: white;
  border: none;
}

.btn-primary:hover {
  background: #0056b3;
}

.btn-secondary {
  background: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
}

.btn-secondary:hover {
  background: #e5e5e5;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style> 