<template>
  <div class="gemini-container">
    <button 
      type="button" 
      class="gemini-btn" 
      :class="{ 'loading': loading }"
      @click="toggleSidebar"
      :disabled="loading"
      :title="loading ? 'Generando...' : 'Completar con IA'"
    >
      <span v-if="loading" class="gemini-loading"></span>
      <svg v-else class="magic-wand-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
        <g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M15 4V2M15 16v-2M8 9h2M20 9h2M17.8 11.8l1.4 1.4M17.8 6.2l1.4-1.4M17.8 6.2l-1.4-1.4M17.8 11.8l-1.4 1.4M9 15l11-11M5 19l4-4" />
          <path d="M5.5 8.5L8 11l-2.5 2.5L3 11l2.5-2.5z" stroke="none" fill="currentColor" />
        </g>
      </svg>
    </button>
    
    <!-- Capa de fondo para detectar clics fuera -->
    <div v-if="showSidebar" class="gemini-backdrop" @click="closeSidebar"></div>
    
    <!-- Panel lateral para prompt personalizado -->
    <div class="gemini-sidebar" :class="{ 'sidebar-open': showSidebar }">
      <div class="gemini-sidebar-header">
        <h3>Personalizar generación</h3>
        <button class="gemini-sidebar-close" @click="closeSidebar">×</button>
      </div>
      
      <div class="gemini-sidebar-body">
        <p class="field-info">
          <strong>Campo:</strong> {{ fieldName }}
        </p>
        <p class="context-info" v-if="context">
          <strong>Contexto:</strong> {{ context }}
        </p>
        <p class="current-value-info" v-if="currentValue">
          <strong>Valor actual:</strong> {{ currentValue }}
        </p>
        
        <div class="form-group">
          <label for="customPrompt">¿Qué deseas generar?</label>
          <textarea 
            id="customPrompt" 
            v-model="customPrompt" 
            rows="3" 
            placeholder="Por ejemplo: Genera una descripción formal y técnica..."
            :disabled="loading"
            class="gemini-input"
            @keydown.enter.ctrl="generateText"
          ></textarea>
          <small class="hint">Ctrl+Enter para generar</small>
        </div>
      </div>
      
      <div class="gemini-sidebar-footer">
        <button 
          class="gemini-cancel-btn" 
          @click="closeSidebar" 
          :disabled="loading"
        >
          Cancelar
        </button>
        <button 
          class="gemini-generate-btn" 
          @click="generateText" 
          :disabled="loading || !customPrompt.trim()"
        >
          <span v-if="loading" class="gemini-loading"></span>
          <span v-else>Generar con IA</span>
        </button>
      </div>
    </div>
    
    <!-- Notificación para errores -->
    <GeminiNotification
      v-if="notification.show"
      :message="notification.message"
      :type="notification.type"
      :duration="5000"
      @close="notification.show = false"
    />
  </div>
</template>

<script setup>
import { ref, reactive, watch, onUnmounted } from 'vue';
import GeminiService from '../services/GeminiService';
import GeminiNotification from './GeminiNotification.vue';

// Props para personalizar el componente
const props = defineProps({
  // Nombre del campo (para que Gemini sepa qué tipo de sugerencia generar)
  fieldName: {
    type: String,
    required: true
  },
  // Información de contexto adicional para mejorar la sugerencia
  context: {
    type: String,
    default: ''
  },
  // Valor actual del campo para personalizar aún más la respuesta
  currentValue: {
    type: String,
    default: ''
  },
  // Si mostrar notificaciones de éxito
  showSuccessNotification: {
    type: Boolean,
    default: false
  }
});

// Emite el evento cuando se obtiene una sugerencia
const emit = defineEmits(['suggestion']);

const loading = ref(false);
const showSidebar = ref(false); // Por defecto cerrado
const customPrompt = ref('');
const notification = reactive({
  show: false,
  message: '',
  type: 'info' // 'success', 'error', 'info'
});

/**
 * Muestra una notificación
 */
const showNotification = (message, type = 'info') => {
  notification.message = message;
  notification.type = type;
  notification.show = true;
};

/**
 * Muestra u oculta el panel lateral
 */
const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value;
  if (showSidebar.value) {
    customPrompt.value = generateInitialPrompt();
  }
};

/**
 * Cierra el panel lateral
 */
const closeSidebar = () => {
  if (loading.value) return; // No cerrar si está cargando
  showSidebar.value = false;
};

// Cerrar al presionar Escape
const handleKeyDown = (event) => {
  if (event.key === 'Escape' && showSidebar.value) {
    closeSidebar();
  }
};

// Añadir/eliminar event listener para tecla Escape
watch(showSidebar, (newValue) => {
  if (newValue) {
    document.addEventListener('keydown', handleKeyDown);
  } else {
    document.removeEventListener('keydown', handleKeyDown);
  }
});

// Eliminar event listener al desmontar el componente
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown);
});

/**
 * Genera un prompt inicial según el tipo de campo
 */
const generateInitialPrompt = () => {
  const campo = props.fieldName.toLowerCase();
  let prompt = '';
  
  if (campo.includes('descripción')) {
    prompt = 'Genera una descripción profesional y concisa';
  } else if (campo.includes('nombre')) {
    prompt = 'Genera un nombre creativo y memorable';
  } else if (campo.includes('dirección')) {
    prompt = 'Genera una dirección realista en Alicante';
  } else {
    prompt = `Genera un texto para el campo "${props.fieldName}"`;
  }
  
  return prompt;
};

/**
 * Procesa el texto generado
 */
const generateText = async () => {
  if (!customPrompt.value.trim() || loading.value) return;
  
  try {
    loading.value = true;
    
    // Llamar al servicio de Gemini con el prompt personalizado
    const resultado = await GeminiService.obtenerSugerenciaPersonalizada(
      customPrompt.value,
      props.context,
      props.currentValue
    );
    
    // Emitir el resultado al componente padre
    emit('suggestion', resultado);
    
    // Cerrar el panel lateral
    closeSidebar();
    
    // Mostrar notificación de éxito si está habilitado
    if (props.showSuccessNotification) {
      showNotification('Sugerencia generada con éxito', 'success');
    }
  } catch (error) {
    console.error('Error al generar texto con Gemini:', error);
    showNotification(
      error.message || 'Error al generar sugerencia con Gemini',
      'error'
    );
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Estilos del botón de IA con varita mágica */
.gemini-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3498db, #2ecc71);
  color: white;
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.gemini-btn:hover {
  background: linear-gradient(135deg, #4aa3df, #3ddb7f);
  transform: scale(1.1);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.gemini-btn:disabled {
  background: #a1a1a1;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.gemini-container {
  position: relative;
  display: inline-block;
  z-index: 900;
}

.magic-wand-icon {
  width: 16px;
  height: 16px;
}

/* Animación de carga */
.gemini-loading {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Estilos para el panel lateral */
.gemini-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
  z-index: 940;
  transition: opacity 0.3s ease;
}

.gemini-sidebar {
  position: absolute;
  top: -100px; 
  right: calc(100% + 80px);
  width: 340px;
  height: auto;
  max-height: 420px;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05);
  z-index: 950;
  transition: all 0.25s cubic-bezier(0.25, 1, 0.5, 1);
  display: flex;
  flex-direction: column;
  transform: translateX(5px);
  opacity: 0;
  pointer-events: none;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.sidebar-open {
  transform: translateX(0);
  opacity: 1;
  pointer-events: auto;
}

/* Flecha apuntando al botón */
.gemini-sidebar::after {
  content: '';
  position: absolute;
  top: 116px; /* Ajustamos para alinear con el botón */
  right: -13px; /* Hacemos la flecha más larga */
  width: 0; 
  height: 0;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  border-left: 13px solid rgba(255, 255, 255, 0.95); /* Hacemos la flecha más larga */
  filter: drop-shadow(2px 0px 2px rgba(0, 0, 0, 0.1));
}

/* Prevenir que el panel se salga del viewport */
@media (max-width: 768px) {
  .gemini-sidebar {
    position: fixed;
    top: auto;
    bottom: 20px;
    right: 20px;
    left: 20px;
    width: auto;
    max-width: calc(100vw - 40px);
    transform: translateY(10px) scale(0.98); /* Animación más sutil */
    backdrop-filter: blur(10px);
  }
  
  .sidebar-open {
    transform: translateY(0) scale(1);
  }
  
  /* Quitar flecha en móviles */
  .gemini-sidebar::after {
    display: none;
  }
}

.gemini-sidebar-header {
  padding: 18px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, rgba(52, 152, 219, 0.05), rgba(41, 128, 185, 0.05));
}

.gemini-sidebar-header h3 {
  margin: 0;
  background: linear-gradient(135deg, #3498db, #2ecc71);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 18px;
  font-weight: 500;
  letter-spacing: -0.3px;
}

.gemini-sidebar-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  transition: all 0.2s;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.gemini-sidebar-close:hover {
  color: #333;
  background-color: rgba(0, 0, 0, 0.05);
}

.gemini-sidebar-body {
  padding: 20px;
  flex-grow: 1;
  overflow-y: auto;
}

.field-info, .context-info, .current-value-info {
  margin-bottom: 12px;
  font-size: 14px;
  color: #666;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.03);
  border-radius: 8px;
}

.field-info strong, .context-info strong, .current-value-info strong {
  color: #3498db;
  font-weight: 600;
}

.form-group {
  margin-top: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 10px;
  font-weight: 500;
  color: #444;
  font-size: 15px;
}

.gemini-input {
  width: 100%;
  padding: 14px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  font-family: inherit;
  font-size: 14px;
  transition: all 0.2s ease;
  resize: vertical;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05) inset;
}

.gemini-input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.15);
}

.hint {
  display: block;
  margin-top: 8px;
  font-size: 12px;
  color: #888;
  text-align: right;
}

.gemini-sidebar-footer {
  padding: 18px 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: flex-end;
  gap: 14px;
  background: linear-gradient(135deg, rgba(52, 152, 219, 0.05), rgba(41, 128, 185, 0.05));
}

.gemini-cancel-btn, .gemini-generate-btn {
  padding: 10px 18px;
  border-radius: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
}

.gemini-cancel-btn {
  background-color: rgba(0, 0, 0, 0.05);
  border: none;
  color: #555;
}

.gemini-cancel-btn:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.gemini-generate-btn {
  background: linear-gradient(135deg, #3498db, #2ecc71);
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(52, 152, 219, 0.4);
  gap: 8px;
  min-width: 140px;
}

.gemini-generate-btn:hover {
  background: linear-gradient(135deg, #4aa3df, #3ddb7f);
  box-shadow: 0 4px 10px rgba(52, 152, 219, 0.5);
  transform: translateY(-1px);
}

.gemini-generate-btn:disabled {
  background: #a1a1a1;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}
</style> 