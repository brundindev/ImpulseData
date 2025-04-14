<template>
  <div class="ai-button-container">
    <button 
      class="ai-button" 
      @click="handleAIClick"
      :title="tooltip"
      :aria-label="tooltip"
    >
      <svg class="magic-wand-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
        <g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M15 4V2M15 16v-2M8 9h2M20 9h2M17.8 11.8l1.4 1.4M17.8 6.2l1.4-1.4M17.8 6.2l-1.4-1.4M17.8 11.8l-1.4 1.4M9 15l11-11M5 19l4-4" />
          <path d="M14 21.08l-5.1-2.12c-.48-.2-.8-.68-.8-1.2 0-.18.03-.36.08-.53L10 12l-4.88-1.82a1.34 1.34 0 0 1-.8-1.2c0-.18.03-.36.08-.53L5.72 5c.14-.33.4-.59.73-.73l3.45-1.32c.17-.05.35-.08.53-.08.52 0 1 .32 1.2.8L13.5 8l4.88-1.82c.17-.05.35-.08.53-.08.52 0 1 .32 1.2.8l1.28 3.1c.14.33.14.7 0 1.02l-1.29 3.12c-.2.47-.68.8-1.2.8-.18 0-.36-.03-.53-.08L14 13l-1.83 4.1c-.2.47-.68.8-1.2.8-.18 0-.36-.03-.53-.08l-3.36-1.38c-.33-.14-.59-.4-.73-.73l-1.3-3.43a1.34 1.34 0 0 1 .08-1.08L7 8" stroke="none" fill="currentColor" />
        </g>
      </svg>
      <span class="ai-label">IA</span>
    </button>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
  tooltip: {
    type: String,
    default: 'Usar inteligencia artificial'
  }
});

const emit = defineEmits(['ai-click']);

const handleAIClick = () => {
  emit('ai-click');
};
</script>

<style scoped>
.ai-button-container {
  display: inline-block;
  position: relative;
}

.ai-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background-color: #f0f6ff;
  border: 1px solid #d0e1fd;
  border-radius: 8px;
  padding: 7px 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #3a87fd;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.ai-button:hover {
  background-color: #e0edff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
}

.ai-button:active {
  transform: translateY(-50%) scale(0.97);
}

.ai-button:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(58, 135, 253, 0.3);
}

.magic-wand-icon {
  width: 18px;
  height: 18px;
  color: #3a87fd;
}

.ai-label {
  font-size: 14px;
  font-weight: 600;
  color: #3a87fd;
}

/* Asegurar que el botón no interfiera con los controles de formulario */
input:focus + .ai-button-container .ai-button,
textarea:focus + .ai-button-container .ai-button,
select:focus + .ai-button-container .ai-button {
  z-index: 2;
}

/* Estilo específico para campos más pequeños */
@media (max-width: 768px) {
  .ai-button {
    padding: 6px 8px;
  }
  
  .magic-wand-icon {
    width: 16px;
    height: 16px;
  }
  
  .ai-label {
    font-size: 12px;
  }
}
</style> 