<template>
  <div class="chatbot-container">
    <!-- Nuevo botón flotante animado para abrir el chat -->
    <div class="button-container">
      <button 
        class="uiverse" 
        @click="toggleChat" 
        :class="{ 'chat-open': isOpen }"
        :aria-label="isOpen ? 'Cerrar asistente' : 'Abrir asistente'"
      >
        <div class="wrapper">
          <span>{{ isOpen ? 'Cerrar' : 'ImpulseAI' }}</span>
          <div class="circle circle-12"></div>
          <div class="circle circle-11"></div>
          <div class="circle circle-10"></div>
          <div class="circle circle-9"></div>
          <div class="circle circle-8"></div>
          <div class="circle circle-7"></div>
          <div class="circle circle-6"></div>
          <div class="circle circle-5"></div>
          <div class="circle circle-4"></div>
          <div class="circle circle-3"></div>
          <div class="circle circle-2"></div>
          <div class="circle circle-1"></div>
        </div>
      </button>
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

        <!-- Botón destacado para crear empresa -->
        <div v-if="messages.length === 0" class="create-company-button-container">
          <button @click="handleCrearEmpresa" class="create-company-button">
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
            >
              {{ question }}
            </button>
          </div>
          <button 
            @click="showMoreQuestions = !showMoreQuestions" 
            class="toggle-questions-button"
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
const showMoreQuestions = ref(false);

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
  } catch (error) {
    console.error('Error al procesar el mensaje:', error);
    messages.value.push({
      id: Date.now(),
      text: 'Lo siento, ha ocurrido un error. Por favor, intenta de nuevo más tarde.',
      isUser: false,
      timestamp: new Date().toLocaleTimeString()
    });
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
/* Estilos para el nuevo botón */
.uiverse {
  --duration: 7s;
  --easing: linear;
  --c-color-1: rgba(255, 163, 26, 0.7);
  --c-color-2: #1a23ff;
  --c-color-3: #e21bda;
  --c-color-4: rgba(255, 232, 26, 0.7);
  --c-shadow: rgba(255, 223, 87, 0.5);
  --c-shadow-inset-top: rgba(255, 223, 52, 0.9);
  --c-shadow-inset-bottom: rgba(255, 250, 215, 0.8);
  --c-radial-inner: #ffd215;
  --c-radial-outer: #fff172;
  --c-color: #fff;
  -webkit-tap-highlight-color: transparent;
  -webkit-appearance: none;
  outline: none;
  position: relative;
  cursor: pointer;
  border: none;
  display: table;
  border-radius: 24px;
  padding: 0;
  margin: 0;
  text-align: center;
  font-weight: 600;
  font-size: 16px;
  letter-spacing: 0.02em;
  line-height: 1.5;
  color: var(--c-color);
  background: radial-gradient(
    circle,
    var(--c-radial-inner),
    var(--c-radial-outer) 80%
  );
  box-shadow: 0 0 14px var(--c-shadow);
  position: fixed;
  bottom: 25px;
  right: 25px;
  z-index: 1001;
}

.uiverse:before {
  content: "";
  pointer-events: none;
  position: absolute;
  z-index: 3;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  border-radius: 24px;
  box-shadow:
    inset 0 3px 12px var(--c-shadow-inset-top),
    inset 0 -3px 4px var(--c-shadow-inset-bottom);
}

.uiverse .wrapper {
  -webkit-mask-image: -webkit-radial-gradient(white, black);
  overflow: hidden;
  border-radius: 24px;
  min-width: 132px;
  padding: 12px 0;
}

.uiverse .wrapper span {
  display: inline-block;
  position: relative;
  z-index: 1;
}

.uiverse:hover {
  --duration: 1400ms;
}

.uiverse .wrapper .circle {
  position: absolute;
  left: 0;
  top: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  filter: blur(var(--blur, 8px));
  background: var(--background, transparent);
  transform: translate(var(--x, 0), var(--y, 0)) translateZ(0);
  animation: var(--animation, none) var(--duration) var(--easing) infinite;
}

.uiverse .wrapper .circle.circle-1,
.uiverse .wrapper .circle.circle-9,
.uiverse .wrapper .circle.circle-10 {
  --background: var(--c-color-4);
}

.uiverse .wrapper .circle.circle-3,
.uiverse .wrapper .circle.circle-4 {
  --background: var(--c-color-2);
  --blur: 14px;
}

.uiverse .wrapper .circle.circle-5,
.uiverse .wrapper .circle.circle-6 {
  --background: var(--c-color-3);
  --blur: 16px;
}

.uiverse .wrapper .circle.circle-2,
.uiverse .wrapper .circle.circle-7,
.uiverse .wrapper .circle.circle-8,
.uiverse .wrapper .circle.circle-11,
.uiverse .wrapper .circle.circle-12 {
  --background: var(--c-color-1);
  --blur: 12px;
}

.uiverse .wrapper .circle.circle-1 {
  --x: 0;
  --y: -40px;
  --animation: circle-1;
}

.uiverse .wrapper .circle.circle-2 {
  --x: 92px;
  --y: 8px;
  --animation: circle-2;
}

.uiverse .wrapper .circle.circle-3 {
  --x: -12px;
  --y: -12px;
  --animation: circle-3;
}

.uiverse .wrapper .circle.circle-4 {
  --x: 80px;
  --y: -12px;
  --animation: circle-4;
}

.uiverse .wrapper .circle.circle-5 {
  --x: 12px;
  --y: -4px;
  --animation: circle-5;
}

.uiverse .wrapper .circle.circle-6 {
  --x: 56px;
  --y: 16px;
  --animation: circle-6;
}

.uiverse .wrapper .circle.circle-7 {
  --x: 8px;
  --y: 28px;
  --animation: circle-7;
}

.uiverse .wrapper .circle.circle-8 {
  --x: 28px;
  --y: -4px;
  --animation: circle-8;
}

.uiverse .wrapper .circle.circle-9 {
  --x: 20px;
  --y: -12px;
  --animation: circle-9;
}

.uiverse .wrapper .circle.circle-10 {
  --x: 64px;
  --y: 16px;
  --animation: circle-10;
}

.uiverse .wrapper .circle.circle-11 {
  --x: 4px;
  --y: 4px;
  --animation: circle-11;
}

.uiverse .wrapper .circle.circle-12 {
  --blur: 14px;
  --x: 52px;
  --y: 4px;
  --animation: circle-12;
}

@keyframes circle-1 {
  33% {
    transform: translate(0px, 16px) translateZ(0);
  }

  66% {
    transform: translate(12px, 64px) translateZ(0);
  }
}

@keyframes circle-2 {
  33% {
    transform: translate(80px, -10px) translateZ(0);
  }

  66% {
    transform: translate(72px, -48px) translateZ(0);
  }
}

@keyframes circle-3 {
  33% {
    transform: translate(20px, 12px) translateZ(0);
  }

  66% {
    transform: translate(12px, 4px) translateZ(0);
  }
}

@keyframes circle-4 {
  33% {
    transform: translate(76px, -12px) translateZ(0);
  }

  66% {
    transform: translate(112px, -8px) translateZ(0);
  }
}

@keyframes circle-5 {
  33% {
    transform: translate(84px, 28px) translateZ(0);
  }

  66% {
    transform: translate(40px, -32px) translateZ(0);
  }
}

@keyframes circle-6 {
  33% {
    transform: translate(28px, -16px) translateZ(0);
  }

  66% {
    transform: translate(76px, -56px) translateZ(0);
  }
}

@keyframes circle-7 {
  33% {
    transform: translate(8px, 28px) translateZ(0);
  }

  66% {
    transform: translate(20px, -60px) translateZ(0);
  }
}

@keyframes circle-8 {
  33% {
    transform: translate(32px, -4px) translateZ(0);
  }

  66% {
    transform: translate(56px, -20px) translateZ(0);
  }
}

@keyframes circle-9 {
  33% {
    transform: translate(20px, -12px) translateZ(0);
  }

  66% {
    transform: translate(80px, -8px) translateZ(0);
  }
}

@keyframes circle-10 {
  33% {
    transform: translate(68px, 20px) translateZ(0);
  }

  66% {
    transform: translate(100px, 28px) translateZ(0);
  }
}

@keyframes circle-11 {
  33% {
    transform: translate(4px, 4px) translateZ(0);
  }

  66% {
    transform: translate(68px, 20px) translateZ(0);
  }
}

@keyframes circle-12 {
  33% {
    transform: translate(56px, 0px) translateZ(0);
  }

  66% {
    transform: translate(60px, -32px) translateZ(0);
  }
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
  background-color: #004698;
  color: white;
  padding: 15px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.assistant-avatar {
  background-color: white;
  color: #004698;
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
  background-color: white;
  border-radius: 18px;
  padding: 10px 15px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  max-width: 100%;
  word-break: break-word;
}

.user-message .message-bubble {
  background-color: #004698;
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
  padding: 15px;
  background-color: white;
  border-top: 1px solid #e0e0e0;
}

.chat-input input {
  flex: 1;
  padding: 12px 15px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  outline: none;
  font-size: 14px;
}

.chat-input input:focus {
  border-color: #004698;
}

.send-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #004698;
  color: white;
  border: none;
  margin-left: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
  font-size: 18px;
}

.send-button:hover {
  background-color: #0056b8;
}

.integrated-questions {
  background-color: #f5f7fa;
  padding: 10px;
  margin-top: 5px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.question-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.question-button {
  background-color: white;
  border: 1px solid #d4e4fc;
  color: #004698;
  border-radius: 8px;
  padding: 10px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.question-button:hover {
  background-color: #e8f0fe;
  border-color: #004698;
}

.create-question {
  background-color: #e0f0ff;
  border-color: #83b9ff;
  font-weight: bold;
}

.toggle-questions-button {
  background: none;
  border: none;
  color: #004698;
  font-size: 13px;
  margin-top: 10px;
  cursor: pointer;
  text-decoration: underline;
}

.create-company-button-container {
  display: flex;
  justify-content: center;
  margin: 15px 0 5px;
}

.create-company-button {
  background-color: #004698;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 16px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.create-company-button:hover {
  background-color: #0056b8;
  transform: translateY(-2px);
}

.plus-icon {
  font-size: 18px;
  font-weight: bold;
}

.typing-indicator {
  display: flex;
  align-items: center;
  padding: 8px 15px;
  justify-content: flex-start;
  background-color: #e6e6e6;
  border-radius: 15px;
  min-width: 50px;
  max-width: 70px;
}

.typing-indicator span {
  height: 10px;
  width: 10px;
  background-color: #888;
  border-radius: 50%;
  display: inline-block;
  margin: 0 2px;
  opacity: 0.5;
  animation: typingBounce 1.5s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) {
  animation-delay: 0s;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typingBounce {
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-8px);
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
</style> 