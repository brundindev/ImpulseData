<template>
  <div class="forms-section">
    <h2>Mis empresas</h2>
    
    <div v-if="empresas.length === 0" class="empty-state">
      <p>No tienes empresas registradas todavía.</p>
      <button class="btn btn-secondary" @click="$emit('create-company')">Crear</button>
    </div>
    
    <div v-else class="forms-list">
      <div 
        v-for="(empresa, index) in empresas" 
        :key="empresa.id" 
        class="form-card company-card"
        v-scroll-animate:150="'animate-in'"
        :style="{ 'animation-delay': `${index * 0.15}s` }"
      >
        <div class="form-info" @click="$emit('view-company', empresa)">
          <h3>{{ empresa.nombre }}</h3>
          <p>{{ empresa.descripcion }}</p>
          <div class="form-meta">
            <span>Ciudad: {{ empresa.ciudad }}</span>
            <span>Creada: {{ formatDate(empresa.fechaCreacion) }}</span>
          </div>
          <div class="form-stats">
            <span class="stat-pill">{{ empresa.numDepartamentos }} departamentos</span>
            <span class="stat-pill">{{ empresa.numCentros }} centros</span>
            <span class="stat-pill">{{ empresa.numFormaciones }} formaciones</span>
          </div>
        </div>
        <div class="form-actions">
          <button class="button" @click.stop="$emit('edit-company', empresa)">Editar</button>
          <button class="button" @click.stop="$emit('view-company', empresa)">Ver</button>
          <button class="noselect" @click.stop="$emit('delete-company', empresa)">
            <span class="text">Eliminar</span>
            <span class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path>
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  empresas: {
    type: Array,
    required: true
  }
});

defineEmits(['create-company', 'edit-company', 'view-company', 'delete-company']);

const formatDate = (date) => {
  if (!date) return 'N/A';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
</script>

<style scoped src="../home/css/CompaniesList.css">

</style> 
