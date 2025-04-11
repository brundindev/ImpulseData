<template>
  <div class="gemini-container">
    <button 
      type="button" 
      class="gemini-btn" 
      :class="{ 'loading': loading }"
      @click="toggleSidebar"
      :disabled="loading"
      :title="loading ? 'Generando...' : 'Completar con Gemini AI'"
    >
      <span v-if="loading" class="gemini-loading"></span>
      <span v-else>G</span>
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
          <span v-else>Generar con Gemini</span>
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
const showSidebar = ref(false);
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
/* Estilos existentes para el botón Gemini */
.gemini-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #4285f4;
  color: white;
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.gemini-btn:hover {
  background-color: #3367d6;
  transform: scale(1.5);
}

.gemini-btn:disabled {
  background-color: #a1a1a1;
  cursor: not-allowed;
  transform: none;
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

/* Estilos del panel lateral */
.gemini-container {
  position: relative;
  display: inline-block;
  z-index: 900;
}

.gemini-sidebar {
  position: absolute;
  top: -100px; 
  right: calc(100% + 80px);
  width: 320px;
  height: auto;
  max-height: 400px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  z-index: 950;
  transition: all 0.25s cubic-bezier(0.25, 1, 0.5, 1);
  display: flex;
  flex-direction: column;
  transform: translateX(5px);
  opacity: 0;
  pointer-events: none;
  overflow: hidden;
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
  border-left: 13px solid white; /* Hacemos la flecha más larga */
  filter: drop-shadow(2px 0px 1px rgba(0, 0, 0, 0.1));
}

/* Prevenir que el panel se salga del viewport */
@media (max-width: 768px) {
  .gemini-sidebar {
    position: fixed;
    top: auto;
    bottom: 10px;
    right: 10px;
    left: 10px;
    width: auto;
    max-width: calc(100vw - 20px);
    transform: translateY(5px); /* Animación más sutil */
  }
  
  .sidebar-open {
    transform: translateY(0);
  }
  
  /* Quitar flecha en móviles */
  .gemini-sidebar::after {
    display: none;
  }
}

.gemini-sidebar-header {
  padding: 16px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.gemini-sidebar-header h3 {
  margin: 0;
  color: #4285f4;
  font-size: 16px;
}

.gemini-sidebar-close {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #999;
  transition: color 0.2s;
}

.gemini-sidebar-close:hover {
  color: #333;
}

.gemini-sidebar-body {
  padding: 16px;
  flex-grow: 1;
  overflow-y: auto;
}

.field-info, .context-info, .current-value-info {
  margin-bottom: 10px;
  font-size: 14px;
}

.form-group {
  margin-top: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.gemini-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: inherit;
  font-size: 14px;
  transition: border-color 0.2s;
  resize: vertical;
}

.gemini-input:focus {
  outline: none;
  border-color: #4285f4;
  box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.1);
}

.hint {
  display: block;
  margin-top: 5px;
  font-size: 12px;
  color: #777;
}

.gemini-sidebar-footer {
  padding: 16px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.gemini-cancel-btn, .gemini-generate-btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.gemini-cancel-btn {
  background-color: transparent;
  border: 1px solid #ddd;
  color: #333;
}

.gemini-cancel-btn:hover {
  background-color: #f5f5f5;
}

.gemini-generate-btn {
  background-color: #4285f4;
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gemini-generate-btn:hover {
  background-color: #3367d6;
}

.gemini-generate-btn:disabled {
  background-color: #a1a1a1;
  cursor: not-allowed;
}

/* Capa de fondo para detectar clics fuera */
.gemini-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: transparent;
  z-index: 940;
}
</style> 