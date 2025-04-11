<template>
  <div 
    v-if="visible" 
    class="gemini-notification"
    :class="{ 'success': type === 'success', 'error': type === 'error' }"
  >
    <div class="notification-icon">
      <span v-if="type === 'success'">✓</span>
      <span v-else-if="type === 'error'">✗</span>
      <span v-else>i</span>
    </div>
    <div class="notification-content">
      {{ message }}
    </div>
    <button class="notification-close" @click="close">×</button>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'info'].includes(value)
  },
  duration: {
    type: Number,
    default: 3000 // 3 segundos por defecto
  },
  show: {
    type: Boolean,
    default: true
  }
});

const visible = ref(props.show);
let timeoutId = null;

// Emitir evento cuando se cierra
const emit = defineEmits(['close']);

// Función para cerrar la notificación
const close = () => {
  visible.value = false;
  emit('close');
};

// Iniciar temporizador para cerrar automáticamente
const startAutoClose = () => {
  if (props.duration > 0) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      close();
    }, props.duration);
  }
};

// Observar cambios en la prop show
watch(() => props.show, (newValue) => {
  visible.value = newValue;
  if (newValue) {
    startAutoClose();
  }
});

// Inicializar al montar el componente
onMounted(() => {
  if (visible.value) {
    startAutoClose();
  }
});
</script>

<style scoped>
.gemini-notification {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
  padding: 12px 16px;
  display: flex;
  align-items: center;
  min-width: 300px;
  max-width: 400px;
  z-index: 9999;
  animation: slideIn 0.3s ease forwards;
}

.notification-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  background-color: var(--secondary-color);
  color: white;
  font-weight: bold;
}

.success .notification-icon {
  background-color: var(--success-color);
}

.error .notification-icon {
  background-color: var(--danger-color);
}

.notification-content {
  flex: 1;
  font-size: 14px;
}

.notification-close {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  opacity: 0.5;
  margin-left: 8px;
  transition: opacity 0.2s;
  color: var(--text-color);
}

.notification-close:hover {
  opacity: 1;
}

@keyframes slideIn {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style> 