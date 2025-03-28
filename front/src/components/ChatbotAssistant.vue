<template>
  <div class="chatbot-container">
    <!-- Botón flotante para abrir el chat -->
    <button 
      class="chat-toggle-button" 
      @click="toggleChat" 
      :class="{ 'chat-open': isOpen }"
      :aria-label="isOpen ? 'Cerrar asistente' : 'Abrir asistente'"
    >
      <span v-if="isOpen">✕</span>
      <span v-else>💬</span>
    </button>

    <!-- Ventana de chat -->
    <div class="chat-window" :class="{ 'chat-open': isOpen }">
      <!-- Cabecera del chat -->
      <div class="chat-header">
        <div class="assistant-avatar">
          <span>🤖</span>
        </div>
        <div class="assistant-info">
          <h3>Asistente ImpulseData</h3>
          <p>Responderé tus consultas sobre la plataforma</p>
        </div>
        <button class="close-button" @click="toggleChat" aria-label="Cerrar chat">
          ✕
        </button>
      </div>

      <!-- Contenedor de mensajes -->
      <div class="chat-messages" ref="chatContainer">
        <!-- Mensaje de bienvenida -->
        <div class="message-wrapper bot-message">
          <div class="message-content">
            <div class="message-avatar">
              <span>🤖</span>
            </div>
            <div class="message-bubble">
              <p>¡Hola! Soy el asistente virtual de ImpulseData. ¿En qué puedo ayudarte hoy?</p>
              <span class="message-time">{{ new Date().toLocaleTimeString() }}</span>
            </div>
          </div>
        </div>

        <!-- Mensajes dinámicos -->
        <div 
          v-for="message in messages" 
          :key="message.id" 
          class="message-wrapper"
          :class="message.isUser ? 'user-message' : 'bot-message'"
        >
          <div class="message-content">
            <div class="message-avatar">
              <span v-if="message.isUser">👤</span>
              <span v-else>🤖</span>
            </div>
            <div class="message-bubble">
              <p>{{ message.text }}</p>
              <span class="message-time">{{ message.timestamp }}</span>
            </div>
          </div>
        </div>

        <!-- Indicador de escritura -->
        <div v-if="isTyping" class="message-wrapper bot-message">
          <div class="message-content">
            <div class="message-avatar">
              <span>🤖</span>
            </div>
            <div class="message-bubble typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Sugerencias -->
      <div v-if="showSuggestions && messages.length === 0" class="suggested-questions">
        <p>Preguntas frecuentes:</p>
        <div class="suggestions-container">
          <button 
            v-for="(question, index) in suggestedQuestions" 
            :key="index"
            @click="selectSuggestion(question)"
            class="suggestion-button"
          >
            {{ question }}
          </button>
        </div>
      </div>

      <!-- Campo de entrada de mensajes -->
      <div class="chat-input">
        <input 
          type="text" 
          v-model="userInput" 
          @keyup.enter="sendMessage"
          placeholder="Escribe tu mensaje..."
          aria-label="Mensaje"
        />
        <button @click="sendMessage" class="send-button" aria-label="Enviar mensaje">
          ➤
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';

// Eliminar estas importaciones que pueden causar problemas
// import { library } from '@fortawesome/fontawesome-svg-core';
// import { faRobot, faPaperPlane, faUser, faTimes, faComments } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// Registrar iconos
// library.add(faRobot, faPaperPlane, faUser, faTimes, faComments);

// Estado del chat
const isOpen = ref(false);
const userInput = ref('');
const messages = ref([]);
const isTyping = ref(false);
const showSuggestions = ref(true);
const chatContainer = ref(null);

// Lista de preguntas sugeridas
const suggestedQuestions = ref([
  '¿Qué es ImpulseData?',
  '¿Cómo creo una nueva empresa?',
  '¿Cómo añadir un departamento?',
  '¿Cómo generar informes PDF?',
  '¿Cómo gestionar los centros?',
  '¿Cómo añadir formaciones?',
  '¿Qué estadísticas ofrece el sistema?',
  '¿Cómo exportar datos?',
  '¿Qué medidas de seguridad implementa?'
]);

// Simulador para desarrollo sin API - Más extenso para mejorar respuestas
const chatResponses = {
  'saludo': [
    '¡Hola! Soy el asistente virtual de ImpulseData. ¿En qué puedo ayudarte hoy?',
    '¡Bienvenido a ImpulseData! Estoy aquí para responder tus dudas. ¿En qué puedo ayudarte?',
    '¡Hola! Soy el asistente de ImpulseData. ¿Cómo puedo ayudarte?'
  ],
  'que_es': [
    'ImpulseData es una plataforma de gestión de datos para empresas que permite organizar información sobre departamentos, centros y formaciones. Facilita la administración y visualización de todos tus datos empresariales en un solo lugar.',
    'Es una herramienta para gestionar información empresarial, ayudándote a organizar departamentos, centros y formaciones de manera eficiente.',
    'ImpulseData es un sistema diseñado para empresas que necesitan centralizar y administrar datos sobre su estructura organizativa, ubicaciones y programas de formación.'
  ],
  'registrar_empresa': [
    'Para registrar una nueva empresa, haz clic en el botón "Crear nueva empresa" en la página principal. Completa el formulario con los datos requeridos y guarda los cambios.',
    'Puedes crear una empresa desde la página principal haciendo clic en "Crear nueva empresa". Rellena los datos solicitados y haz clic en guardar.',
    'En la pantalla principal encontrarás un botón para crear una nueva empresa. Completa la información de tu empresa y el sistema la registrará automáticamente.'
  ],
  'departamento': [
    'Para añadir un nuevo departamento, primero selecciona la empresa a la que quieres agregarlo. Luego, en la vista de detalles, ve a la sección "Departamentos" y haz clic en "Agregar departamento". Completa los campos requeridos y guarda los cambios.',
    'Puedes crear departamentos desde la vista de detalles de una empresa. Busca la sección correspondiente y usa el botón de añadir.',
    'Los departamentos se gestionan dentro de cada empresa. Accede a los detalles de la empresa y utiliza el formulario específico para añadir o modificar departamentos.'
  ],
  'pdf': [
    'Sí, puedes generar informes en PDF. En la vista de detalles de la empresa, encontrarás un botón "Generar PDF" que creará un informe completo con todos los datos de la empresa, incluyendo sus departamentos, centros y formaciones.',
    'La plataforma permite exportar toda la información de una empresa en formato PDF. Busca esta opción en la vista de detalles de cualquier empresa.',
    'Los informes en PDF son una función clave de ImpulseData. Puedes generarlos con un solo clic desde la vista de detalles de cualquier empresa.'
  ],
  'editar': [
    'Para editar los datos de una empresa, ve a la lista de empresas, busca la que deseas modificar y haz clic en el botón "Editar" (ícono de lápiz). Se abrirá un formulario con los datos actuales que podrás modificar y guardar.',
    'La edición de datos es sencilla: busca el botón de editar junto a cada empresa y modifica los campos que necesites actualizar.',
    'Puedes actualizar la información en cualquier momento usando el botón de editar que aparece junto a cada empresa en el listado principal.'
  ],
  'centros': [
    'Los centros representan las ubicaciones físicas de tu empresa. Puedes añadirlos desde la vista de detalles de la empresa, en la sección "Centros". Cada centro puede tener una dirección y datos de contacto.',
    'Para gestionar los centros de una empresa, accede a sus detalles y utiliza la sección correspondiente para añadir, editar o eliminar ubicaciones.',
    'Cada empresa puede tener múltiples centros. Gestiónalos desde la sección específica en la vista de detalles de la empresa.'
  ],
  'formaciones': [
    'Las formaciones son cursos o programas educativos que ofrece tu empresa. Puedes añadirlas desde la vista de detalles, especificando nombre, tipo (presencial, virtual o híbrido) y duración en horas.',
    'Para registrar formaciones, accede a los detalles de la empresa y busca la sección específica. Podrás indicar el tipo y duración de cada formación.',
    'El sistema permite registrar diferentes tipos de formaciones (presenciales, virtuales o híbridas) con su correspondiente duración en horas.'
  ],
  'estadisticas': [
    'ImpulseData ofrece visualizaciones estadísticas automáticas basadas en tus datos. En la página principal verás un resumen, y en cada empresa podrás ver gráficos más detallados sobre departamentos, centros y formaciones.',
    'Las estadísticas son generadas automáticamente a partir de los datos ingresados. Encontrarás visualizaciones tanto en la página principal como en cada empresa.',
    'El sistema genera gráficos y análisis basados en la información registrada, permitiéndote visualizar la distribución de departamentos, centros y formaciones.'
  ],
  'exportar': [
    'Además de los PDF, puedes exportar los datos a formato Word. Esta opción está disponible en la vista de detalles de cada empresa, junto a la opción de PDF.',
    'ImpulseData permite exportar la información en formatos PDF y Word, facilitando el compartir datos con terceros.',
    'Puedes exportar los datos de tus empresas en diferentes formatos desde la vista de detalles, donde encontrarás botones específicos para cada formato disponible.'
  ],
  'seguridad': [
    'La plataforma implementa medidas de seguridad robustas, incluyendo autenticación de usuarios, cifrado de datos y protección contra accesos no autorizados.',
    'Tus datos están protegidos mediante sistemas de autenticación seguros y cifrado. Solo los usuarios autorizados pueden acceder a la información.',
    'La seguridad es una prioridad en ImpulseData, con múltiples capas de protección para garantizar la integridad y confidencialidad de tu información empresarial.'
  ],
  'gracias': [
    '¡De nada! Estoy aquí para ayudarte con cualquier duda sobre ImpulseData. ¿Hay algo más en lo que pueda asistirte?',
    'Ha sido un placer ayudarte. Si necesitas más información sobre ImpulseData, no dudes en preguntar.',
    '¡Encantado de haber sido útil! Estoy a tu disposición para cualquier otra consulta sobre la plataforma.'
  ],
  'default': [
    'Gracias por tu pregunta sobre ImpulseData. Para obtener información más específica, puedes consultar la sección de ayuda en el menú principal o contactar con soporte técnico a través del formulario de contacto.',
    'Tu consulta es interesante. Puedes encontrar más información en la documentación de la plataforma o contactando con nuestro equipo de soporte.',
    'Entiendo tu pregunta. Te recomiendo revisar los tutoriales disponibles en la plataforma o consultar con el equipo de soporte para una respuesta más detallada.'
  ]
};

// Instrucciones del sistema para la IA
const SYSTEM_PROMPT = `
Eres un asistente virtual para la plataforma ImpulseData, un sistema de gestión de datos para empresas.
Responde de manera concisa y amigable preguntas relacionadas con la plataforma.

Información sobre ImpulseData:
- Es una plataforma para gestionar datos de empresas, departamentos, centros y formaciones.
- Los usuarios pueden registrarse y crear una cuenta.
- Permite añadir empresas con sus departamentos, centros y formaciones.
- Se pueden generar informes en PDF con los datos de las empresas.
- Ofrece visualización de estadísticas de los datos registrados.
- Las empresas pueden tener múltiples departamentos y centros.
- Los usuarios pueden editar y eliminar los datos.

Limita tus respuestas SOLO a información relacionada con la plataforma ImpulseData.
Si te preguntan sobre temas no relacionados, responde amablemente que solo puedes proporcionar información sobre ImpulseData.
Tus respuestas deben ser claras, concisas y en español.
`;

// Abrir/cerrar el chat y manejar la creación de empresa
const toggleChat = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    nextTick(() => {
      if (chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
      }
    });
  }
};

// Manejar la acción de crear empresa (emite un evento global)
const handleCrearEmpresa = () => {
  // Emitir un evento personalizado para que HomeView lo capture
  window.dispatchEvent(new CustomEvent('abrir-modal-empresa'));
  // Cerrar el chatbot
  isOpen.value = false;
};

// Seleccionar una sugerencia
const selectSuggestion = (question) => {
  // Si la pregunta es sobre crear empresa, ejecutar acción especial
  if (question.toLowerCase().includes('crear') && question.toLowerCase().includes('empresa')) {
    handleCrearEmpresa();
    return;
  }
  
  // Para otras preguntas, comportamiento normal
  userInput.value = question;
  sendMessage();
};

// Formatear mensaje para mostrar saltos de línea
const formatMessage = (text) => {
  return text.replace(/\n/g, '<br>');
};

// Enviar una pregunta predefinida
const sendQuestion = (question) => {
  userInput.value = question;
  sendMessage();
};

// Función para activar/desactivar el indicador de escritura
const setTypingIndicator = (typing) => {
  isTyping.value = typing;
  if (typing) {
    showSuggestions.value = false;
  }
};

// Método para manejar el envío de mensajes
const sendMessage = async () => {
  if (!userInput.value.trim()) return;
  
  // Detectar si el usuario quiere crear una empresa
  const userMessageLower = userInput.value.toLowerCase();
  if ((userMessageLower.includes('crear') || userMessageLower.includes('nueva') || userMessageLower.includes('añadir')) 
       && userMessageLower.includes('empresa')) {
    // Si el usuario quiere crear una empresa, disparar la acción directamente
    handleCrearEmpresa();
    // Agregar mensaje explicativo
    messages.value.push({
      id: Date.now(),
      text: userInput.value,
      isUser: true,
      timestamp: new Date().toLocaleTimeString()
    });
    
    messages.value.push({
      id: Date.now() + 1,
      text: "Abriendo el formulario para crear una nueva empresa...",
      isUser: false,
      timestamp: new Date().toLocaleTimeString()
    });
    
    // Limpiar input y salir
    userInput.value = '';
    return;
  }
  
  // Agregar mensaje del usuario
  messages.value.push({
    id: Date.now(),
    text: userInput.value,
    isUser: true,
    timestamp: new Date().toLocaleTimeString()
  });
  
  setTypingIndicator(true);
  
  // Guardar mensaje y limpiar entrada
  const userMessage = userInput.value;
  userInput.value = '';
  
  try {
    // Pequeña pausa para simular procesamiento
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    // Obtener respuesta del bot
    const response = await getBotResponse(userMessage);
    
    // Añadir respuesta del bot
    messages.value.push({
      id: Date.now(),
      text: response,
      isUser: false,
      timestamp: new Date().toLocaleTimeString()
    });
    
    // Scroll al último mensaje
    nextTick(() => {
      scrollToBottom();
    });
  } catch (error) {
    console.error('Error al procesar el mensaje:', error);
    messages.value.push({
      id: Date.now(),
      text: 'Lo siento, ha ocurrido un error. Por favor, intenta de nuevo más tarde.',
      isUser: false,
      timestamp: new Date().toLocaleTimeString()
    });
  } finally {
    setTypingIndicator(false);
  }
};

// Obtener respuesta de la IA (simulada)
const getBotResponse = async (message) => {
  // Simulación para desarrollo
  return simulateResponse(message);
};

// Simular respuestas para desarrollo sin consumir API
const simulateResponse = (message) => {
  const lowerMsg = message.toLowerCase();
  let responseCategory = 'default';
  
  // Determinar la categoría más relevante
  if (lowerMsg.includes('hola') || lowerMsg.includes('buenas') || lowerMsg.includes('saludos')) {
    responseCategory = 'saludo';
  } else if (lowerMsg.includes('qué es') || lowerMsg.includes('que es') || lowerMsg.includes('para qué sirve') || lowerMsg.includes('para que sirve')) {
    responseCategory = 'que_es';
  } else if (lowerMsg.includes('registrar') || lowerMsg.includes('crear empresa') || lowerMsg.includes('nueva empresa')) {
    responseCategory = 'registrar_empresa';
  } else if (lowerMsg.includes('departamento') || lowerMsg.includes('añadir departamento')) {
    responseCategory = 'departamento';
  } else if (lowerMsg.includes('pdf') || lowerMsg.includes('informe') || lowerMsg.includes('generar informe')) {
    responseCategory = 'pdf';
  } else if (lowerMsg.includes('editar') || lowerMsg.includes('modificar') || lowerMsg.includes('actualizar datos')) {
    responseCategory = 'editar';
  } else if (lowerMsg.includes('centro') || lowerMsg.includes('ubicacion') || lowerMsg.includes('dirección') || lowerMsg.includes('direcciones')) {
    responseCategory = 'centros';
  } else if (lowerMsg.includes('formacion') || lowerMsg.includes('curso') || lowerMsg.includes('cursos') || lowerMsg.includes('capacitacion')) {
    responseCategory = 'formaciones';
  } else if (lowerMsg.includes('estadistica') || lowerMsg.includes('grafico') || lowerMsg.includes('gráfico')) {
    responseCategory = 'estadisticas';
  } else if (lowerMsg.includes('exportar') || lowerMsg.includes('word') || lowerMsg.includes('documento')) {
    responseCategory = 'exportar';
  } else if (lowerMsg.includes('seguridad') || lowerMsg.includes('privacidad') || lowerMsg.includes('proteccion') || lowerMsg.includes('datos personales')) {
    responseCategory = 'seguridad';
  } else if (lowerMsg.includes('gracias')) {
    responseCategory = 'gracias';
  }
  
  // Obtener respuestas para la categoría
  const possibleResponses = chatResponses[responseCategory] || chatResponses['default'];
  
  // Elegir aleatoriamente una respuesta
  const randomIndex = Math.floor(Math.random() * possibleResponses.length);
  return possibleResponses[randomIndex];
};

// Hacer scroll al último mensaje
const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
  });
};

// Observar cambios en los mensajes para hacer scroll
watch(messages, () => {
  scrollToBottom();
});

// Ajustar altura del textarea automáticamente
watch(userInput, () => {
  if (chatContainer.value) {
    chatContainer.value.style.height = 'auto';
    chatContainer.value.style.height = Math.min(chatContainer.value.scrollHeight, 100) + 'px';
  }
});

// Inicialización
onMounted(() => {
  // Escuchar tecla Escape para cerrar el chat
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen.value) {
      toggleChat();
    }
  });
});
</script>

<style scoped>
.chatbot-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  font-family: 'Arial', sans-serif;
}

.chat-toggle-button {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #1976D2;
  color: white;
  border: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  transition: all 0.3s ease;
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1001;
}

.chat-toggle-button:hover {
  background-color: #1565C0;
  transform: scale(1.05);
}

.chat-window {
  position: absolute;
  bottom: 80px;
  right: 0;
  width: 350px;
  height: 500px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transform: scale(0);
  transform-origin: bottom right;
  transition: transform 0.3s ease;
  opacity: 0;
}

.chat-window.chat-open {
  transform: scale(1);
  opacity: 1;
}

.chat-header {
  background-color: #1976D2;
  color: white;
  padding: 15px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.assistant-avatar {
  background-color: white;
  color: #1976D2;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  font-size: 20px;
}

.assistant-info {
  flex: 1;
}

.assistant-info h3 {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
}

.assistant-info p {
  margin: 0;
  font-size: 12px;
  opacity: 0.8;
}

.close-button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 18px;
  padding: 5px;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  background-color: #f5f7fa;
}

.message-wrapper {
  display: flex;
  flex-direction: column;
  max-width: 85%;
}

.user-message {
  align-self: flex-end;
}

.bot-message {
  align-self: flex-start;
}

.message-content {
  display: flex;
  align-items: flex-start;
}

.message-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  flex-shrink: 0;
}

.user-message .message-avatar {
  background-color: #1976D2;
  color: white;
  order: 1;
  margin-right: 0;
  margin-left: 8px;
}

.bot-message .message-avatar {
  background-color: #4CAF50;
  color: white;
}

.message-bubble {
  background-color: white;
  border-radius: 18px;
  padding: 10px 15px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  max-width: 100%;
  word-break: break-word;
}

.user-message .message-bubble {
  background-color: #1976D2;
  color: white;
}

.message-bubble p {
  margin: 0 0 5px 0;
}

.message-time {
  font-size: 10px;
  opacity: 0.7;
  display: block;
  text-align: right;
}

.chat-input {
  display: flex;
  padding: 10px;
  background-color: white;
  border-top: 1px solid #e0e0e0;
}

.chat-input input {
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  outline: none;
  font-size: 14px;
}

.chat-input input:focus {
  border-color: #1976D2;
}

.send-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #1976D2;
  color: white;
  border: none;
  margin-left: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
}

.send-button:hover {
  background-color: #1565C0;
}

.suggested-questions {
  padding: 10px 15px;
  background-color: white;
  border-top: 1px solid #e0e0e0;
}

.suggested-questions p {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #555;
}

.suggestions-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.suggestion-button {
  background-color: #f1f5f9;
  border: 1px solid #e0e0e0;
  border-radius: 15px;
  padding: 5px 10px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.suggestion-button:hover {
  background-color: #e9eef2;
}

.typing-indicator {
  display: flex;
  align-items: center;
  padding: 10px 15px;
}

.typing-indicator span {
  height: 8px;
  width: 8px;
  background-color: #4CAF50;
  border-radius: 50%;
  display: inline-block;
  margin: 0 2px;
  animation: typing 1.4s infinite both;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0% {
    transform: scale(0.5);
    opacity: 0.5;
  }
  50% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0.5);
    opacity: 0.5;
  }
}

/* Estilos responsive */
@media (max-width: 576px) {
  .chat-window {
    width: 300px;
    height: 450px;
    bottom: 70px;
  }
  
  .chat-toggle-button {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }
}
</style> 