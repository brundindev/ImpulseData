<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal-container modal-small">
      <div class="modal-header">
        <h2>{{ resultado.exitoso ? 'Importación Exitosa' : 'Error en la Importación' }}</h2>
        <button class="btn-close" @click="$emit('close')">×</button>
      </div>
      <div class="modal-body">
        <div class="resultado-importacion">
          <p :class="{ 'text-success': resultado.exitoso, 'text-error': !resultado.exitoso }">
            {{ resultado.mensaje }}
          </p>
          <div v-if="resultado.detalles" class="detalles-importacion">
            <h3 v-if="resultado.exitoso">Empresas importadas:</h3>
            <ul>
              <li v-for="(detalle, index) in resultado.detalles" :key="index">
                {{ detalle }}
              </li>
            </ul>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn btn-primary" @click="$emit('close')">Cerrar</button>
        </div>
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
  resultado: {
    type: Object,
    required: true
  }
});

defineEmits(['close']);
</script>

<style scoped src="../home/css/ImportConfirmationModal.css">

</style> 
