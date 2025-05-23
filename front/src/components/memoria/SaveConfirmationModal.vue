<template>
  <div v-if="show" class="save-confirmation-overlay">
    <div class="save-confirmation-container">
      <div class="save-confirmation-content">
        <h3>¿Deseas guardar tu progreso antes de salir?</h3>
        <div class="modal-actions">
          <button @click="$emit('save')" class="btn-save">Guardar</button>
          <button @click="$emit('discard')" class="btn-discard">Descartar</button>
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
  }
});

defineEmits(['save', 'discard']);
</script>

<style scoped>
.save-confirmation-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.save-confirmation-container {
  background: white;
  border-radius: 10px;
  padding: 2rem;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.save-confirmation-content {
  text-align: center;
}

.save-confirmation-content h3 {
  color: #333;
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.btn-save, .btn-discard {
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-save {
  background: #004698;
  color: white;
}

.btn-save:hover {
  background: #003366;
}

.btn-discard {
  background: #dc3545;
  color: white;
}

.btn-discard:hover {
  background: #c82333;
}

.modal-resumen {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
}
</style> 