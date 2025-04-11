<template>
  <div class="gemini-debug">
    <h3>Depuración de Configuración Gemini</h3>
    <div class="debug-info">
      <p><strong>API Key configurada:</strong> {{ apiKeyConfigured ? 'Sí' : 'No' }}</p>
      <p><strong>Longitud de API Key:</strong> {{ apiKeyLength }} caracteres</p>
      <p><strong>URL de API:</strong> {{ apiUrl }}</p>
      <p><strong>Model:</strong> {{ model }}</p>
      <p><strong>Variables de entorno cargadas:</strong> {{ envLoaded ? 'Sí' : 'No' }}</p>
      <button @click="testApiConnection" :disabled="loading">
        {{ loading ? 'Probando...' : 'Probar conexión API' }}
      </button>
      <div v-if="testResult" :class="['test-result', { success: testSuccess, error: !testSuccess }]">
        {{ testResult }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { GEMINI_CONFIG } from '../config/gemini.config';
import GeminiService from '../services/GeminiService';

const loading = ref(false);
const testResult = ref('');
const testSuccess = ref(false);
const envLoaded = ref(false);

// Información de configuración
const apiKeyConfigured = computed(() => !!GEMINI_CONFIG.apiKey);
const apiKeyLength = computed(() => GEMINI_CONFIG.apiKey ? GEMINI_CONFIG.apiKey.length : 0);
const apiUrl = computed(() => GEMINI_CONFIG.apiUrl || 'No configurada');
const model = computed(() => GEMINI_CONFIG.model || 'No configurado');

// Comprueba si las variables de entorno están cargadas
onMounted(() => {
  console.log("Variables de entorno disponibles en la aplicación:", import.meta.env);
  envLoaded.value = !!import.meta.env.VITE_GEMINI_API_KEY;
});

// Prueba la conexión a la API
const testApiConnection = async () => {
  try {
    loading.value = true;
    testResult.value = '';
    testSuccess.value = false;
    
    const respuesta = await GeminiService.obtenerSugerencia('test', 'prueba');
    
    testResult.value = `Conexión exitosa. Respuesta: ${respuesta.substring(0, 50)}...`;
    testSuccess.value = true;
  } catch (error) {
    testResult.value = `Error: ${error.message}`;
    testSuccess.value = false;
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.gemini-debug {
  margin: 20px;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  max-width: 500px;
}

.debug-info {
  margin-top: 10px;
}

.debug-info p {
  margin: 5px 0;
}

button {
  margin-top: 15px;
  padding: 8px 16px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.test-result {
  margin-top: 10px;
  padding: 10px;
  border-radius: 4px;
}

.success {
  background-color: #d4edda;
  color: #155724;
}

.error {
  background-color: #f8d7da;
  color: #721c24;
}
</style> 