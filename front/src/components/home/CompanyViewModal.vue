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

<style scoped src="../home/css/CompanyViewModal.css">

</style> 
