<template>
  <div class="chatbot-container">
    <!-- Nuevo botón flotante con diseño renovado -->
    <div class="button-container">
      <div 
        class="outer-cont flex" 
        @click="toggleChat" 
        :class="{ 'chat-open': isOpen }"
        :aria-label="isOpen ? 'Cerrar asistente' : 'Abrir asistente'"
        role="button"
        tabindex="0"
        @keydown.enter="toggleChat"
        @keydown.space="toggleChat"
      >
        <svg
          viewBox="0 0 24 24"
          height="24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <g fill="none">
            <path
              d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"
            ></path>
            <path
              d="M9.107 5.448c.598-1.75 3.016-1.803 3.725-.159l.06.16l.807 2.36a4 4 0 0 0 2.276 2.411l.217.081l2.36.806c1.75.598 1.803 3.016.16 3.725l-.16.06l-2.36.807a4 4 0 0 0-2.412 2.276l-.081.216l-.806 2.361c-.598 1.75-3.016 1.803-3.724.16l-.062-.16l-.806-2.36a4 4 0 0 0-2.276-2.412l-.216-.081l-2.36-.806c-1.751-.598-1.804-3.016-.16-3.724l.16-.062l2.36-.806A4 4 0 0 0 8.22 8.025l.081-.216zM11 6.094l-.806 2.36a6 6 0 0 1-3.49 3.649l-.25.091l-2.36.806l2.36.806a6 6 0 0 1 3.649 3.49l.091.25l.806 2.36l.806-2.36a6 6 0 0 1 3.49-3.649l.25-.09l2.36-.807l-2.36-.806a6 6 0 0 1-3.649-3.49l-.09-.25zM19 2a1 1 0 0 1 .898.56l.048.117l.35 1.026l1.027.35a1 1 0 0 1 .118 1.845l-.118.048l-1.026.35l-.35 1.027a1 1 0 0 1-1.845.117l-.048-.117l-.35-1.026l-1.027-.35a1 1 0 0 1-.118-1.845l.118-.048l1.026-.35l.35-1.027A1 1 0 0 1 19 2"
              fill="currentColor"
            ></path>
          </g>
        </svg>
        ImpulseAI
      </div>
    </div>

    <!-- Ventana de chat -->
    <div class="chat-window" :class="{ 'chat-open': isOpen }">
      <!-- Cabecera del chat -->
      <div class="chat-header">
        <div class="assistant-avatar">
          <span>🤖</span>
        </div>
        <div class="assistant-info">
          <h3 class="title-white">Asistente ImpulseData</h3>
          <div class="status-indicator">
            <span class="status-dot"></span>
            <span class="status-text">{{ isOffline ? 'Sin conexión' : 'En línea 24/7' }}</span>
          </div>
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

        <!-- Indicador de estado offline -->
        <div v-if="isOffline" class="message-wrapper bot-message">
          <div class="message-content">
            <div class="message-avatar">
              <span>🔌</span>
            </div>
            <div class="message-bubble isSystemMessage reconnecting-message">
              <p>No hay conexión a internet. Intentando reconectar...</p>
              <span class="message-time">{{ new Date().toLocaleTimeString() }}</span>
            </div>
          </div>
        </div>

        <!-- Botón destacado para crear empresa -->
        <div v-if="messages.length === 0" class="create-company-button-container">
          <button 
            @click="handleCrearEmpresa" 
            class="create-company-button"
            aria-label="Crear nueva empresa"
          >
            <span class="plus-icon">+</span> Crear nueva empresa
          </button>
        </div>

        <!-- Preguntas frecuentes integradas en el chat -->
        <div v-if="messages.length === 0" class="integrated-questions">
          <div class="question-buttons">
            <button 
              v-for="(question, index) in suggestedQuestions.slice(0, 4)" 
              :key="index"
              @click="selectSuggestion(question)"
              class="question-button"
              :class="{ 'create-question': question.toLowerCase().includes('crear') }"
              :aria-label="'Preguntar: ' + question"
            >
              {{ question }}
            </button>
          </div>
          <div class="question-buttons" v-if="showMoreQuestions">
            <button 
              v-for="(question, index) in suggestedQuestions.slice(4)" 
              :key="index + 4"
              @click="selectSuggestion(question)"
              class="question-button"
              :aria-label="'Preguntar: ' + question"
            >
              {{ question }}
            </button>
          </div>
          <button 
            @click="showMoreQuestions = !showMoreQuestions" 
            class="toggle-questions-button"
            :aria-label="showMoreQuestions ? 'Mostrar menos preguntas' : 'Mostrar más preguntas'"
          >
            {{ showMoreQuestions ? 'Mostrar menos' : 'Mostrar más' }}
          </button>
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
              <span v-else-if="message.isError">⚠️</span>
              <span v-else-if="message.isSystemMessage">ℹ️</span>
              <span v-else>🤖</span>
            </div>
            <div class="message-bubble" 
              :class="{
                'isError': message.isError,
                'isSystemMessage': message.isSystemMessage,
                'isRecovered': message.isRecovered
              }"
            >
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

      <!-- Campo de entrada de mensajes -->
      <div class="chat-input">
        <input 
          type="text" 
          v-model="userInput" 
          @keyup.enter="sendMessage"
          placeholder="Escribe tu mensaje..."
          aria-label="Mensaje"
          :disabled="isOffline || errorState.retryCount > errorState.maxRetries"
        />
        <button 
          @click="sendMessage" 
          class="send-button" 
          aria-label="Enviar mensaje"
          :disabled="isOffline || errorState.retryCount > errorState.maxRetries || !userInput.trim()"
        >
          ➤
        </button>
      </div>
      
      <!-- Indicador persistente de estado offline -->
      <div v-if="isOffline" class="offline-indicator">
        Sin conexión a internet
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, onUnmounted } from 'vue';

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
const showMoreQuestions = ref(false);
const textChanging = ref(false);
// Sistema de manejo de errores
const errorState = ref({
  hasError: false,
  message: '',
  retryCount: 0,
  maxRetries: 3
});
const isOffline = ref(false);
const networkRetryTimeout = ref(null);

// Lista de preguntas sugeridas
const suggestedQuestions = ref([
  '¿Qué es ImpulseData?',
  '¿Cómo crear una nueva empresa?',
  '¿Cómo añadir un departamento?',
  '¿Cómo generar informes PDF?',
  '¿Cómo gestionar los centros?',
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

// Alternar la visibilidad del chat
const toggleChat = () => {
  textChanging.value = true;
  
  // Guardar el valor actual antes de cambiarlo
  const willBeOpen = !isOpen.value;
  
  setTimeout(() => {
    isOpen.value = willBeOpen;
    setTimeout(() => {
      textChanging.value = false;
    }, 200);
  }, 150);
  
  if (willBeOpen) {
    // El chat se va a abrir, preparar el scroll después de que esté visible
    nextTick(() => {
      scrollToBottom();
      // Limpiar errores previos al abrir chat
      resetErrorState();
    });
  } else {
    // El chat se va a cerrar, limpiar entradas
    isTyping.value = false;
    userInput.value = '';
  }
};

// Función para resetear el estado de errores
const resetErrorState = () => {
  errorState.value = {
    hasError: false,
    message: '',
    retryCount: 0,
    maxRetries: 3
  };
};

// Función para manejar errores
const handleError = (error, context = 'general') => {
  console.error(`Error en ${context}:`, error);
  
  // Incrementar contador de reintentos
  errorState.value.retryCount++;
  
  // Comprobar el tipo de error
  if (!navigator.onLine || error.message?.includes('network') || error.name === 'NetworkError') {
    isOffline.value = true;
    errorState.value.message = 'Parece que no tienes conexión a internet. Intentando reconectar...';
    scheduleNetworkRetry();
  } else {
    errorState.value.hasError = true;
    errorState.value.message = 'Ha ocurrido un error al procesar tu solicitud.';
  }
  
  // Si se han excedido los reintentos, mostrar mensaje de error persistente
  if (errorState.value.retryCount > errorState.value.maxRetries) {
    errorState.value.message = 'Hemos tenido problemas para responder. Por favor, inténtalo más tarde.';
  }
  
  return errorState.value.message;
};

// Programar un reintento de conexión
const scheduleNetworkRetry = () => {
  if (networkRetryTimeout.value) {
    clearTimeout(networkRetryTimeout.value);
  }
  
  const retryTime = Math.min(2000 * Math.pow(2, errorState.value.retryCount - 1), 30000);
  
  networkRetryTimeout.value = setTimeout(() => {
    if (navigator.onLine) {
      isOffline.value = false;
      errorState.value.hasError = false;
      
      // Notificar al usuario que la conexión se ha restablecido
      if (isOpen.value) {
        messages.value.push({
          id: Date.now(),
          text: 'La conexión se ha restablecido. ¡Ya puedes seguir usando el asistente!',
          isUser: false,
          timestamp: new Date().toLocaleTimeString(),
          isSystemMessage: true
        });
      }
    } else {
      // Seguir intentando
      scheduleNetworkRetry();
    }
  }, retryTime);
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
  
  // Verificar si hay conexión a internet antes de continuar
  if (!navigator.onLine) {
    isOffline.value = true;
    messages.value.push({
      id: Date.now(),
      text: 'No se puede enviar el mensaje porque no hay conexión a internet. Intentando reconectar...',
      isUser: false,
      timestamp: new Date().toLocaleTimeString(),
      isSystemMessage: true
    });
    scheduleNetworkRetry();
    return;
  }
  
  // Detectar si el usuario quiere crear una empresa
  const userMessageLower = userInput.value.toLowerCase();
  if ((userMessageLower.includes('crear') || userMessageLower.includes('nueva') || userMessageLower.includes('añadir')) 
       && userMessageLower.includes('empresa')) {
    // Si el usuario quiere crear una empresa, disparar la acción directamente
    try {
      handleCrearEmpresa();
      // Agregar mensaje explicativo
      messages.value.push({
        id: Date.now(),
        text: userInput.value,
        isUser: true,
        timestamp: new Date().toLocaleTimeString()
      });
      
      // Mostrar indicador de escritura
      setTypingIndicator(true);
      
      // Esperar 3 segundos para simular escritura
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Agregar mensaje vacío que se irá llenando
      const botMessageId = Date.now() + 1;
      const botMessageText = "Abriendo el formulario para crear una nueva empresa...";
      
      messages.value.push({
        id: botMessageId,
        text: "",
        isUser: false,
        timestamp: new Date().toLocaleTimeString()
      });
      
      // Ocultar indicador de escritura
      setTypingIndicator(false);
      
      // Simular escritura palabra por palabra
      await typeMessageWordByWord(botMessageId, botMessageText);
      
      // Limpiar input y salir
      userInput.value = '';
    } catch (error) {
      const errorMessage = handleError(error, 'crear-empresa');
      messages.value.push({
        id: Date.now(),
        text: errorMessage,
        isUser: false,
        timestamp: new Date().toLocaleTimeString(),
        isError: true
      });
    }
    return;
  }
  
  // Agregar mensaje del usuario
  messages.value.push({
    id: Date.now(),
    text: userInput.value,
    isUser: true,
    timestamp: new Date().toLocaleTimeString()
  });
  
  // Mostrar indicador de escritura
  setTypingIndicator(true);
  
  // Guardar mensaje y limpiar entrada
  const userMessage = userInput.value;
  userInput.value = '';
  
  try {
    // Esperar exactamente 3 segundos para simular escritura
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Obtener respuesta del bot
    const response = await getBotResponse(userMessage);
    
    // Agregar mensaje vacío que se irá llenando
    const botMessageId = Date.now();
    
    messages.value.push({
      id: botMessageId,
      text: "",
      isUser: false,
      timestamp: new Date().toLocaleTimeString()
    });
    
    // Ocultar indicador de escritura
    setTypingIndicator(false);
    
    // Simular escritura palabra por palabra
    await typeMessageWordByWord(botMessageId, response);
    
    // Scroll al último mensaje
    nextTick(() => {
      scrollToBottom();
    });
    
    // Si llegamos aquí sin errores, resetear el estado de error
    resetErrorState();
    
  } catch (error) {
    console.error('Error al procesar el mensaje:', error);
    const errorMessage = handleError(error, 'enviar-mensaje');
    
    messages.value.push({
      id: Date.now(),
      text: errorMessage,
      isUser: false,
      timestamp: new Date().toLocaleTimeString(),
      isError: true
    });
    
    // Programar reintento automático si es apropiado
    if (errorState.value.retryCount <= errorState.value.maxRetries) {
      setTimeout(() => {
        if (isOpen.value && !isOffline.value) {
          setTypingIndicator(true);
          getBotResponse(userMessage)
            .then(response => {
              const botMessageId = Date.now();
              messages.value.push({
                id: botMessageId,
                text: "",
                isUser: false,
                timestamp: new Date().toLocaleTimeString(),
                isRecovered: true
              });
              setTypingIndicator(false);
              typeMessageWordByWord(botMessageId, response);
              resetErrorState();
            })
            .catch(retryError => {
              handleError(retryError, 'reintento-mensaje');
            });
        }
      }, 5000);
    }
  } finally {
    // Ocultar indicador de escritura
    setTypingIndicator(false);
  }
};

// Función para simular escritura palabra por palabra
const typeMessageWordByWord = async (messageId, fullText) => {
  const words = fullText.split(' ');
  let currentText = '';
  
  // Encontrar el mensaje en el array
  const messageIndex = messages.value.findIndex(msg => msg.id === messageId);
  if (messageIndex === -1) return;
  
  // Escribir palabra por palabra con una velocidad realista
  for (let i = 0; i < words.length; i++) {
    // Añadir la palabra
    currentText += (i > 0 ? ' ' : '') + words[i];
    
    // Actualizar el mensaje
    messages.value[messageIndex].text = currentText;
    
    // Hacer scroll a medida que se escribe
    scrollToBottom();
    
    // Pausa entre palabras (velocidad variable para parecer más humano)
    const pauseDuration = Math.random() * 150 + 50; // Entre 50ms y 200ms
    await new Promise(resolve => setTimeout(resolve, pauseDuration));
  }
};

// Obtener respuesta de la IA (simulada)
const getBotResponse = async (message) => {
  // Verificar conexión a internet
  if (!navigator.onLine) {
    throw new Error('NetworkError: Sin conexión a internet');
  }
  
  // Simulación de error aleatorio para pruebas (10% de probabilidad)
  if (Math.random() < 0.1 && process.env.NODE_ENV === 'development') {
    throw new Error('Error simulado para pruebas');
  }
  
  try {
    // Simulación para desarrollo
    return simulateResponse(message);
  } catch (error) {
    console.error('Error en getBotResponse:', error);
    throw error;
  }
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

  // Escuchar el evento personalizado para abrir/cerrar el chatbot
  window.addEventListener('toggle-chatbot', toggleChat);
  
  // Monitorear el estado de la conexión
  window.addEventListener('online', handleOnlineStatus);
  window.addEventListener('offline', handleOnlineStatus);
});

onUnmounted(() => {
  window.removeEventListener('toggle-chatbot', toggleChat);
  window.removeEventListener('online', handleOnlineStatus);
  window.removeEventListener('offline', handleOnlineStatus);
  
  if (networkRetryTimeout.value) {
    clearTimeout(networkRetryTimeout.value);
  }
});

// Manejar cambios en el estado de la conexión
const handleOnlineStatus = () => {
  isOffline.value = !navigator.onLine;
  
  if (navigator.onLine) {
    // Si recuperamos la conexión y hay errores, intentar limpiarlos
    if (errorState.value.hasError && isOpen.value) {
      messages.value.push({
        id: Date.now(),
        text: 'Conexión restablecida. Puedes continuar usando el asistente.',
        isUser: false,
        timestamp: new Date().toLocaleTimeString(),
        isSystemMessage: true
      });
      resetErrorState();
    }
  } else if (isOpen.value) {
    messages.value.push({
      id: Date.now(),
      text: 'Se ha perdido la conexión a internet. Algunas funciones pueden no estar disponibles.',
      isUser: false,
      timestamp: new Date().toLocaleTimeString(),
      isSystemMessage: true
    });
  }
};
</script>

<style scoped>
/* Variables de color */
:root {
  --primary-gradient: linear-gradient(90deg, #00c3ff, #00ff8c);
  --primary-color: #004698;
  --primary-hover: #0056b8;
  --secondary-color: #5175a0;
  --danger-color: #f44336;
  --success-color: #4CAF50;
  --border-color: #e0e0e0;
  --text-color: #333333;
  --light-text: #666666;
  --card-background: #ffffff;
}

/* Estilos para el nuevo botón */
.flex {
  display: flex;
  align-items: center;
  gap: 5px;
}

.outer-cont {
  padding: 12px 20px;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  position: relative;
  background: linear-gradient(45deg, #00c3ff, #00e1a0, #00ff8c);
  background-size: 200% 200%;
  animation: gradientAnimation 8s ease infinite;
  border-radius: 12px;
  color: #fff;
  transition: all 0.3s ease;
  box-shadow:
    inset 0px 0px 5px #ffffffa9,
    inset 0px 35px 30px rgba(0, 0, 0, 0.5),
    0px 5px 15px rgba(0, 0, 0, 0.6);
  text-shadow: 1px 1px 1px #000;
  position: fixed;
  bottom: 25px;
  right: 25px;
  z-index: 1001;
  font-weight: 600;
}

.outer-cont::before {
  content: "";
  position: absolute;
  inset: 0;
  margin: auto;
  border-radius: 12px;
  filter: blur(0);
  z-index: -1;
  box-shadow: none;
  background: conic-gradient(
    #00000000 80deg,
    #00c3ff,
    #00e1a0,
    #00ff8c,
    #00c3ff,
    #00000000 280deg
  );
  transition: all 0.3s ease;
  opacity: 0.7;
}

.outer-cont:hover {
  background-size: 150% 150%;
  transform: translateY(-3px);
}

.outer-cont:hover::before {
  filter: blur(15px);
  opacity: 1;
}

.outer-cont:active::before {
  filter: blur(5px);
  transform: translateY(1px);
}

.outer-cont:active {
  box-shadow:
    inset 0px 0px 5px #ffffffa9,
    inset 0px 35px 30px rgba(0, 0, 0, 0.5);
  margin-top: 3px;
}

.outer-cont.chat-open {
  background: linear-gradient(45deg, #ff4d4d, #ff6e6e, #ff8080);
  background-size: 200% 200%;
  animation: gradientAnimation 8s ease infinite;
}

.outer-cont.chat-open::before {
  background: conic-gradient(
    #00000000 80deg,
    #ff4d4d,
    #ff6e6e,
    #ff8080,
    #ff4d4d,
    #00000000 280deg
  );
}

@keyframes gradientAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Animación para el botón cuando se abre o cierra */
.outer-cont svg {
  transition: transform 0.3s ease;
}

.outer-cont:hover svg {
  transform: rotate(20deg);
}

/* Título blanco */
.title-white {
  color: white !important;
  font-weight: bold;
}

/* Ocultar el antiguo botón flotante */
.chat-toggle-button {
  display: none !important;
  visibility: hidden;
}

.chatbot-container {
  position: fixed;
  bottom: 25px;
  right: 25px;
  z-index: 1000;
  font-family: 'Arial', sans-serif;
}

.button-container {
  position: relative;
  width: 140px;
  height: 48px;
}

.chat-window {
  position: fixed;
  bottom: 95px;
  right: 25px;
  width: 370px;
  height: 550px;
  max-height: calc(100vh - 120px);
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
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
  background: var(--primary-gradient);
  color: white;
  padding: 15px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.assistant-avatar {
  background-color: white;
  color: #00c3ff;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  font-size: 20px;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
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
  background: transparent;
  color: white;
  border: none;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.close-button:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.chat-messages {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  background-color: #f5f5f5;
  background-image: 
    radial-gradient(circle at 10% 20%, rgba(0, 195, 255, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 90% 80%, rgba(0, 255, 140, 0.05) 0%, transparent 50%);
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
  background-color: #004698;
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
  max-width: 80%;
  padding: 10px 15px;
  margin: 5px 0;
  border-radius: 18px;
  position: relative;
  word-wrap: break-word;
  background: var(--message-bg, rgba(240, 240, 240, 0.9));
  backdrop-filter: blur(5px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  color: var(--message-color, #333);
}

.bot-message .message-bubble {
  background: var(--primary-gradient);
  color: white;
  margin-right: auto;
  border-top-left-radius: 2px;
}

.user-message .message-bubble {
  background: rgba(255, 255, 255, 0.9);
  margin-left: auto;
  border-top-right-radius: 2px;
}

.message-bubble p {
  margin: 0 0 5px 0;
}

.message-time {
  font-size: 10px;
  opacity: 0.7;
  display: block;
  text-align: right;
  margin-top: 4px;
}

.chat-input {
  display: flex;
  padding: 10px;
  border-top: 1px solid #e0e0e0;
  background-color: #fff;
}

.chat-input input {
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  margin-right: 10px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.chat-input input:focus {
  outline: none;
  border-color: #00c3ff;
  box-shadow: 0 0 0 2px rgba(0, 195, 255, 0.2);
}

.send-button {
  background: var(--primary-gradient);
  color: white;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  box-shadow: 0 2px 8px rgba(0, 195, 255, 0.4);
  transition: all 0.3s ease;
}

.send-button:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 12px rgba(0, 195, 255, 0.6);
}

.integrated-questions {
  margin: 20px 0;
  padding: 10px;
  border-radius: 10px;
  background-color: rgba(245, 245, 245, 0.5);
  backdrop-filter: blur(5px);
}

.question-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.question-button {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 195, 255, 0.3);
  color: #333;
  padding: 8px 12px;
  border-radius: 18px;
  font-size: 14px;
  margin: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.question-button::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--primary-gradient);
  opacity: 0;
  z-index: -1;
  transition: opacity 0.3s ease;
}

.question-button:hover {
  color: white;
  border-color: transparent;
}

.question-button:hover::after {
  opacity: 1;
}

.question-button.create-question {
  background: var(--primary-gradient);
  color: white;
  border: none;
}

.toggle-questions-button {
  display: block;
  margin: 10px auto 0;
  background: transparent;
  border: none;
  color: #00c3ff;
  cursor: pointer;
  font-size: 14px;
  padding: 5px;
}

.toggle-questions-button:hover {
  text-decoration: underline;
}

.create-company-button-container {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

.create-company-button {
  background: var(--primary-gradient);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 20px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 195, 255, 0.3);
  transition: all 0.3s ease;
}

.create-company-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0, 195, 255, 0.5);
}

.plus-icon {
  background-color: white;
  color: #00c3ff;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.typing-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 195, 255, 0.7);
  min-width: 50px;
  padding: 8px 12px;
}

.typing-indicator span {
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: #fff;
  border-radius: 50%;
  margin: 0 2px;
  animation: typing-dot 1.4s infinite ease-in-out both;
}

.typing-indicator span:nth-child(1) {
  animation-delay: -0.32s;
}

.typing-indicator span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes typing-dot {
  0%, 80%, 100% { 
    transform: scale(0);
  } 
  40% { 
    transform: scale(1);
  }
}

/* Estilos responsive */
@media (max-width: 576px) {
  .chat-window {
    width: 320px;
    height: 500px;
    bottom: 80px;
    right: 20px;
  }
  
  .chat-toggle-button {
    width: 50px;
    height: 50px;
    font-size: 20px;
    bottom: 20px;
    right: 20px;
  }
}

/* Animación de ondas para el botón */
.ripple-container {
  display: none;
}

.ripple {
  display: none;
}

/* Estilos para el indicador de estado */
.status-indicator {
  display: flex;
  align-items: center;
  font-size: 12px;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #4cff8c;
  border-radius: 50%;
  margin-right: 5px;
  position: relative;
}

.status-dot::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: inherit;
  border-radius: inherit;
  opacity: 0.7;
  animation: pulse-status 1.5s ease-out infinite;
}

@keyframes pulse-status {
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  50% {
    transform: scale(2.5);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}

.status-text {
  color: white;
  font-size: 12px;
  font-weight: 400;
}

/* Estilos para mensajes de error y sistema */
.message-bubble.isError {
  background: rgba(255, 0, 0, 0.1);
  border-left: 3px solid #f44336;
  color: #f44336;
}

.message-bubble.isSystemMessage {
  background: rgba(0, 0, 0, 0.05);
  font-style: italic;
  color: #666;
}

.message-bubble.isRecovered {
  border-left: 3px solid #4CAF50;
}

/* Estado offline */
.offline-indicator {
  background: rgba(0, 0, 0, 0.7);
  color: white;
  text-align: center;
  padding: 5px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  font-size: 12px;
  z-index: 10;
}

/* Mensaje de reconexión */
.reconnecting-message {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.5;
  }
}

/* Mejorar accesibilidad de los botones */
.question-button:focus, 
.send-button:focus,
.close-button:focus,
.create-company-button:focus {
  outline: 2px solid #00c3ff;
  outline-offset: 2px;
}

.outer-cont:focus {
  outline: 3px solid #00c3ff;
  outline-offset: 3px;
}
</style> 