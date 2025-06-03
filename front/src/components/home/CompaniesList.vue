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

<style scoped>
.forms-section {
  margin-top: 30px;
  position: relative;
  z-index: 1;
  margin-top: 3rem;

}

.forms-section h2 {
  margin-bottom: 1.5rem;
  color: var(--text-color);
  font-size: 1.5rem;
  position: relative;
  overflow: hidden;
  text-shadow: 0 0 10px rgba(0, 195, 255, 0.7);
  color: white !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
}
.forms-section h2:hover::after{
  width: 100%;
  transform: scaleX(1);
}

.empty-state {
  text-align: center;
  padding: 3rem;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.empty-state p {
  margin-bottom: 1.5rem;
  color: white;
  font-size: 1.1rem;
}
.empty-state button {
  background-color: #004698;
  color: white;
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 5px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.empty-state button:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.4);
  background-color: #0056b8;
}

.forms-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;}

.form-card {
  background-color: var(--card-background);
  border-radius: 8px;
  box-shadow: var(--shadow);
  padding: 1.5rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.form-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.form-info {
  cursor: pointer;
  transition: all 0.2s ease;
  flex-grow: 1;
}
.form-info:hover {
  /* Se elimina el cambio de color de fondo */
  border-radius: 8px 8px 0 0;
}

.form-info h3 {
  margin-bottom: 0.5rem;
  color: var(--primary-color);
}

.form-info p {
  color: var(--light-text);
  margin-bottom: 1rem;
  min-height: 3rem;
}

.form-meta {
  display: flex;
  justify-content: space-between;
  color: var(--light-text);
  font-size: 0.85rem;
  margin-bottom: 1rem;
}
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.btn-icon {
  padding: 0.5rem 0.75rem;
  font-size: 0.8rem;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: #f5f5f5;
  color: var(--text-color);
  border: 1px solid transparent;
}

.btn-edit {
  border-color: var(--secondary-color);
}

.btn-view {
  border-color: var(--primary-color);
}

.btn-delete {
  border-color: var(--danger-color);
}

.btn-edit:hover {
  background-color: var(--secondary-color);
  color: white;
}

.btn-view:hover {
  background-color: var(--primary-color);
  color: white;
}

.btn-delete:hover {
  background-color: var(--danger-color);
  color: white;
}


.form-stats {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-start;
  overflow-x: auto;
}

.form-stats span{
  color: #ffffff !important;
  font-weight: bold;
  text-shadow: none;
}

.stat-pill {
  background: rgba(255, 255, 255, 0.25);
  color: #222 !important;
  border-radius: 12px;
  padding: 0.2rem 0.6rem;
  font-size: 0.8rem;
  font-weight: 500;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1.5px solid rgba(255,255,255,0.7);
  box-shadow: 0 2px 8px rgba(255,255,255,0.08);
  transition: background 0.2s, color 0.2s;
  white-space: nowrap;
}

.button {
  padding: 0.6em 1.2em;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  letter-spacing: 3px;
  text-transform: uppercase;
  cursor: pointer;
  color: #004698;
  transition: all 1000ms;
  font-size: 14px;
  position: relative;
  overflow: hidden;
  outline: 2px solid #004698;
  background-color: transparent;
}

.button:hover {
  color: #ffffff;
  transform: scale(1.1);
  outline: 2px solid #0062d6;
  box-shadow: 4px 5px 17px -4px #002d6e;
}
.button::before {
  content: "";
  position: absolute;
  left: -50px;
  top: 0;
  width: 0;
  height: 100%;
  background-color: #004698;
  transform: skewX(45deg);
  z-index: -1;
  transition: width 1000ms;
}
.button:hover::before {
  width: 250%;
}

/* Botón de eliminar con animación */
.noselect {
  width: 130px;
  height: 38px;
  cursor: pointer;
  display: flex;
  align-items: center;
  background: #e62222;
  border: none;
  border-radius: 5px;
  box-shadow: 1px 1px 3px rgba(0,0,0,0.15);
  transition: 200ms;
  overflow: hidden;
  position: relative;
}

button.noselect .text {
  /* cambios para el texto */
  position:static;
  width: auto;
  opacity: 1;
  margin: 15px;
  /* hasta aqui */
  transform: translateX(5px);
  color: white;
  font-weight: bold;
  font-size: 14px;
  transition: 200ms;
  z-index: 2;
  flex: 1;
  text-align: start;
}

.noselect .icon {
  position: absolute;
  border-left: 1px solid #c41b1b;
  transform: translateX(90px);
  height: 28px;
  width: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 200ms;
}

.noselect svg {
  width: 15px;
  fill: #eee;
}

.noselect:hover {
  background: #ff3636;
}

button.noselect:hover .text {
  color: transparent;
  transform: translateX(-25px);
}

.noselect:hover .icon {
  width: 130px;
  border-left: none;
  transform: translateX(0);
}

.noselect:focus {
  outline: none;
}

.noselect:active .icon svg {
  transform: scale(0.8);
}

.noselect:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.noselect:disabled .icon {
  border-left: 1px solid #b1b1b1;
}

@media (max-width: 768px) {
  .forms-list {
    grid-template-columns: 1fr;
  }
}

/* Añadir estilos específicos para las animaciones */
.company-card {
  transform: translateY(20px);
  opacity: 0.2;
  transition: transform 0.4s ease-out, opacity 0.4s ease-out, box-shadow 0.3s ease;
}

.company-card.animate-in {
  transform: translateY(0);
  opacity: 1;
}

/* Reducir la intensidad de los efectos de pulsación */
.form-card:nth-child(odd).animate-in {
  animation: pulseCardOdd 5s ease-in-out;
  animation-delay: 0.5s;
}

.form-card:nth-child(even).animate-in {
  animation: pulseCardEven 5s ease-in-out;
  animation-delay: 0.75s;
}

@keyframes pulseCardOdd {
  0%, 100% {
    box-shadow: 0 4px 8px rgba(156, 39, 176, 0.1);
  }
  50% {
    box-shadow: 0 6px 12px rgba(156, 39, 176, 0.2);
  }
}

@keyframes pulseCardEven {
  0%, 100% {
    box-shadow: 0 4px 8px rgba(233, 30, 99, 0.1);
  }
  50% {
    box-shadow: 0 6px 12px rgba(233, 30, 99, 0.2);
  }
}

/* Asegurarse de que las animaciones respetan la preferencia de movimiento reducido */
@media (prefers-reduced-motion: reduce) {
  .company-card {
    transform: none !important;
    opacity: 1 !important;
    transition: none !important;
  }
  
  .form-card:nth-child(odd).animate-in,
  .form-card:nth-child(even).animate-in {
    animation: none !important;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
  }
}
</style> 