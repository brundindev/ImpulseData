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

<style scoped src="../home/css/DashboardHeader.css">

</style> 
