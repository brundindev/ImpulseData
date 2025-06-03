<template>
  <div class="dashboard-header">
    <div v-scroll-animate="'animate-left'">
      <h1 class="welcome-title">Dashboard</h1>
      <p class="welcome-subtitle">¡Bienvenido, <span class="user-name">{{ usuario?.nombre || usuario?.displayName || 'Usuario' }}</span>!</p>
    </div>
    <!--<div class="action-buttons" v-scroll-animate:200="'animate-right'">
      <button @click="$emit('create-company')" class="btn btn-primary btn-create">
        <span class="icon">+</span> Crear entidad
      </button>
      <button 
        type="button" 
        class="btn btn-secondary btn-create"
        @click="triggerFileInput"
        :disabled="importando"
      >
        <span class="icon">↓</span>
        <span v-if="importando">Importando...</span>
        <span v-else>Importar entidad</span>
      </button>
      <input 
        ref="fileInput"
        type="file" 
        style="display: none" 
        accept=".csv,.json"
        @change="handleFileChange"
      >
      <div v-if="errorImportacion" class="error-message" v-scroll-animate:300="'animate-up'">
        {{ errorImportacion }}
      </div>
    </div>-->
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  usuario: {
    type: Object,
    default: () => ({})
  },
  importando: {
    type: Boolean,
    default: false
  },
  errorImportacion: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['create-company', 'file-selected']);
const fileInput = ref(null);

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileChange = (event) => {
  emit('file-selected', event);
};
</script>

<style scoped>
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  position: relative;
  z-index: 1;
}

.welcome-title {
  margin-bottom: 0.5rem;
  color: var(--primary-color);
}
.welcome-subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
}

.user-name {
  font-weight: 700;
  color: white;
  position: relative;
  display: inline-block;
  padding: 0 4px;
  background: linear-gradient(90deg, #00c3ff, #7928ca, #ff0080);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: white;
  text-shadow: 0 0 10px rgba(0, 195, 255, 0.7);
  animation: gradientText 6s linear infinite;
}

.user-name:hover {
  -webkit-text-fill-color: transparent;
}

@keyframes gradientText {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.action-buttons {
  display: flex;
  gap: 1rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  font-size: 0.9rem;
  /* height: 36px; */
}
.btn-primary {
  background: var(--primary-gradient) !important;
  color: white !important;
  border: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  z-index: 1;
  box-shadow: 0 0 15px rgba(0, 70, 152, 0.5);
}

.btn-primary:hover {
  background-color: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 70, 152, 0.2);
}

.btn-secondary {
  background: linear-gradient(135deg, #5175a0 0%, #3a4d6b 100%) !important;
  color: white !important;
  border: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  z-index: 1;
  box-shadow: 0 0 15px rgba(81, 117, 160, 0.5);
}

.btn-secondary:hover:not([disabled]) {
  transform: translateY(-2px);
  box-shadow: 0 0 20px rgba(81, 117, 160, 0.7), 0 0 40px rgba(81, 117, 160, 0.3);
}

.btn-secondary::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0) 100%);
  transition: all 0.5s ease;
}

.btn-secondary:hover::after {
  left: 100%;
}

.btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

.btn-secondary .icon {
  font-size: 1rem;
  font-weight: bold;
  margin-right: 0.5rem;
}

.btn-danger {
  background-color: var(--danger-color);
  color: white;
}

.btn-danger:hover:not([disabled]) {
  background-color: #d32f2f;
  transform: translateY(-2px);
}

.btn-create {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  justify-content: center;
  font-size: 1rem;
}

.icon {
  font-size: 1.2rem;
  font-weight: bold;
}


.error-message {
  color: #ff4444;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .action-buttons {
    flex-direction: column;
    width: 100%;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style> 