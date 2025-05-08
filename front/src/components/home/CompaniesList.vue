<template>
  <div class="forms-section">
    <h2>Mis empresas</h2>
    
    <div v-if="empresas.length === 0" class="empty-state">
      <p>No tienes empresas registradas todavía.</p>
      <button class="btn btn-secondary" @click="$emit('create-company')">Crear</button>
    </div>
    
    <div v-else class="forms-list">
      <div v-for="empresa in empresas" :key="empresa.id" class="form-card">
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
          <button class="button" @click="$emit('edit-company', empresa)">Editar</button>
          <button class="button" @click="$emit('view-company', empresa)">Ver</button>
          <button class="noselect" @click="$emit('delete-company', empresa)">
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

<style scoped>
.forms-section {
  margin-top: 30px;
}

.forms-section h2 {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}

.empty-state {
  text-align: center;
  padding: 40px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.empty-state p {
  margin-bottom: 20px;
  color: #666;
}

.forms-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.form-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.form-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.form-info {
  padding: 20px;
  cursor: pointer;
}

.form-info h3 {
  margin: 0 0 10px;
  font-size: 18px;
  color: #333;
}

.form-info p {
  margin: 0 0 15px;
  color: #666;
  font-size: 14px;
  line-height: 1.4;
}

.form-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #999;
  margin-bottom: 15px;
}

.form-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.stat-pill {
  background: rgba(0, 122, 255, 0.1);
  color: #007AFF;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.form-actions {
  display: flex;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  background: rgba(255, 255, 255, 0.5);
}

.button {
  flex: 1;
  padding: 12px;
  border: none;
  background: none;
  color: #007AFF;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.button:hover {
  background: rgba(0, 122, 255, 0.1);
}

.noselect {
  flex: 1;
  padding: 12px;
  border: none;
  background: none;
  color: #FF3B30;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.noselect:hover {
  background: rgba(255, 59, 48, 0.1);
}

.noselect .icon {
  width: 16px;
  height: 16px;
}

.noselect .icon svg {
  fill: currentColor;
}

@media (max-width: 768px) {
  .forms-list {
    grid-template-columns: 1fr;
  }
}
</style> 