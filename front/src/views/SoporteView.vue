<template>
  <div class="soporte-container">
    <div class="soporte-header">
      <h1>Soporte Técnico</h1>
      <p>Conectado con: <span class="support-admin">Administrador</span></p>
    </div>
    
    <!-- Estado de carga inicial -->
    <div v-if="isInitializing" class="loading-container">
      <div class="spinner"></div>
      <p>Conectando con el servicio de soporte...</p>
    </div>
    
    <!-- Error de conexión -->
    <div v-else-if="hasError" class="container">
      <div class="icon">⚠️</div>
      <h3>Ticket de soporte</h3>
      <p>Si quieres abrir un ticket, por favor, dale a este botón y te abriremos un ticket en nuestra plataforma de tickets.</p>
      <button @click="retryConnection" class="retry-button">
        Abrir ticket
      </button>
    </div>
    
    <!-- Chat principal (se muestra cuando no hay errores y se completó la inicialización) -->
    <div v-else class="chat-container">
      <div class="ticket-header">
        <div class="ticket-info">
          <h3>{{ chatId }}</h3>
          <span :class="['ticket-status', ticketClosed ? 'status-closed' : 'status-open']">
            {{ ticketClosed ? 'Cerrado' : 'Abierto' }}
          </span>
        </div>
      </div>
      
      <div class="chat-messages" ref="chatContainer">
        <!-- Mensaje de bienvenida del sistema -->
        <div class="message system-message">
          <p>Bienvenido al chat de soporte técnico. Un administrador te atenderá a la brevedad.</p>
          <span class="timestamp">{{ getCurrentTime() }}</span>
        </div>
        
        <!-- Notificación de ticket cerrado -->
        <div v-if="ticketClosed" class="message system-message warning-message">
          <p>Este ticket ha sido cerrado por un administrador. No se pueden enviar más mensajes.</p>
          <span class="timestamp">{{ getCurrentTime() }}</span>
        </div>
        
        <!-- Mensajes dinámicos -->
        <div v-for="message in messages" :key="message.id" 
             :class="['message', message.isAdmin ? 'admin-message' : 'user-message']">
          <div class="message-header">
            <span class="admin-name">{{ message.isAdmin ? 'Administrador' : 'Tú' }}</span>
            <span class="timestamp">{{ formatTimestamp(message.timestamp) }}</span>
          </div>
          <div class="message-content">
            <p>{{ message.text }}</p>
          </div>
        </div>
        
        <!-- Indicador de escritura -->
        <div v-if="isAdminTyping" class="message admin-message typing-message">
          <div class="message-header">
            <span class="admin-name">Administrador</span>
          </div>
          <div class="message-content typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
      
      <div class="chat-input">
        <textarea 
          v-model="userInput" 
          placeholder="Escribe tu mensaje aquí..." 
          @keyup.enter.prevent="sendMessage"
          :disabled="isLoading || ticketClosed"
          ref="messageInput"
        ></textarea>
        <div class="input-actions">
          <div class="connection-status" :class="{ 'online': isConnected, 'offline': !isConnected }">
            {{ isConnected ? 'Conectado' : 'Desconectado' }}
          </div>
          <div>
            <button 
              @click="sendMessage" 
              class="send-button" 
              :disabled="!userInput.trim() || isLoading || ticketClosed"
            >
              Enviar <i class="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
        <div v-if="ticketClosed" class="ticket-closed-notice">
          Este ticket está cerrado. No se pueden enviar más mensajes.
        </div>
      </div>
    </div>
    
    <div class="additional-actions">
      <div class="contact-hours">
        <h3>Horario de atención</h3>
        <p>Lunes a Viernes: 9:00 - 18:00</p>
        <p>Sábados: 9:00 - 13:00</p>
      </div>
      <div class="alternative-contact">
        <h3>Otras formas de contacto</h3>
        <p><i class="fas fa-phone"></i> +34 123 456 789</p>
        <p><i class="fas fa-envelope"></i> info@impulsedata.es</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { 
  getDatabase, 
  ref as dbRef, 
  push, 
  set, 
  onValue, 
  onChildAdded, 
  onDisconnect,
  serverTimestamp,
  get
} from 'firebase/database';

// Importar la instancia existente de Firebase
import firebaseApp, { auth, waitForAuthInit } from '../firebase';

const router = useRouter();
const store = useStore();

// Estado del chat
const messages = ref([]);
const userInput = ref('');
const isLoading = ref(false);
const isAdminTyping = ref(false);
const chatContainer = ref(null);
const messageInput = ref(null);
const isConnected = ref(false);
const chatId = ref('');
const userId = ref('');
const userEmail = ref('');
const adminEmail = ['brundindev@gmail.com', 'adrianreynauclaramunt2@gmail.com']; // Emails de administradores
const ticketClosed = ref(false); // Nuevo estado para controlar si el ticket está cerrado

// Estado de la aplicación
const isInitializing = ref(true);
const hasError = ref(false);
const errorMessage = ref('');

// Usar la instancia de Firebase existente
let database;
try {
  database = getDatabase(firebaseApp);
  console.log('Base de datos de Firebase obtenida correctamente');
} catch (error) {
  console.error('Error al obtener la base de datos de Firebase:', error);
  hasError.value = true;
  errorMessage.value = 'No se pudo inicializar el servicio de chat. Por favor, intenta más tarde.';
  isInitializing.value = false;
}

// Obtener información del usuario
const getUserInfo = () => {
  try {
    // Verificar si el store está disponible
    if (store && store.state && store.state.auth && store.state.auth.usuario) {
      userId.value = store.state.auth.usuario.id || Date.now().toString();
      userEmail.value = store.state.auth.usuario.email || 'usuario@impulsedata.es';
      console.log('Usuario obtenido desde Vuex store:', userEmail.value);
    } 
    // Si no hay usuario en Vuex, verificar Firebase Auth
    else if (auth && auth.currentUser) {
      userId.value = auth.currentUser.uid;
      userEmail.value = auth.currentUser.email || 'usuario_firebase@impulsedata.es';
      console.log('Usuario obtenido desde Firebase Auth:', userEmail.value);
    }
    // Último recurso - generar ID temporal
    else {
      userId.value = 'guest_' + Date.now().toString();
      userEmail.value = 'usuario_invitado@impulsedata.es';
      console.log('Usando usuario invitado:', userEmail.value);
    }
    
    // Verificar si el usuario ya tiene un ticket asignado
    checkExistingTicket();
    
    console.log('Información de usuario obtenida:', { userId: userId.value, userEmail: userEmail.value });
  } catch (error) {
    console.error('Error al obtener información del usuario:', error);
    userId.value = 'guest_' + Date.now().toString();
    userEmail.value = 'usuario_invitado@impulsedata.es';
    checkExistingTicket();
  }
};

// Verificar si el usuario ya tiene un ticket asignado
const checkExistingTicket = async () => {
  try {
    if (!database) return;
    
    // Buscar tickets asociados al usuario actual
    const userTicketsRef = dbRef(database, 'userTickets');
    const snapshot = await get(userTicketsRef);
    
    if (snapshot.exists()) {
      const userTickets = snapshot.val();
      // Buscar ticket por email de usuario
      for (const ticketId in userTickets) {
        if (userTickets[ticketId].userEmail === userEmail.value) {
          // El usuario ya tiene un ticket
          chatId.value = ticketId;
          console.log('Ticket existente encontrado:', chatId.value);
          return;
        }
      }
    }
    
    // Si no se encontró un ticket, crear uno nuevo
    generateNewTicketId();
  } catch (error) {
    console.error('Error al verificar tickets existentes:', error);
    generateNewTicketId();
  }
};

// Generar un nuevo ID de ticket
const generateNewTicketId = async () => {
  try {
    if (!database) return;
    
    // Obtener el último número de ticket
    const ticketCounterRef = dbRef(database, 'ticketCounter');
    const snapshot = await get(ticketCounterRef);
    
    let ticketNumber = 1;
    if (snapshot.exists()) {
      ticketNumber = snapshot.val() + 1;
    }
    
    // Formatear el número con ceros a la izquierda
    const formattedNumber = String(ticketNumber).padStart(3, '0');
    chatId.value = `ticket-${formattedNumber}`;
    
    // Guardar el nuevo contador
    await set(ticketCounterRef, ticketNumber);
    
    // Registrar la relación usuario-ticket
    const userTicketRef = dbRef(database, `userTickets/${chatId.value}`);
    await set(userTicketRef, {
      userEmail: userEmail.value,
      userId: userId.value,
      createdAt: serverTimestamp()
    });
    
    console.log('Nuevo ticket generado:', chatId.value);
  } catch (error) {
    console.error('Error al generar nuevo ticket:', error);
    // Fallback: generar ID con timestamp
    chatId.value = `ticket-${Date.now()}`;
  }
};

// Función para obtener la hora actual formateada
const getCurrentTime = () => {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Formatear timestamp del servidor
const formatTimestamp = (timestamp) => {
  if (!timestamp) return getCurrentTime();
  
  try {
    // Si es timestamp de Firebase (objeto con segundos y nanosegundos)
    if (timestamp.seconds) {
      const date = new Date(timestamp.seconds * 1000);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Si es timestamp normal (número)
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return getCurrentTime();
  }
};

// Conectar con la base de datos Firebase para este chat
const connectToChat = () => {
  try {
    // Verificar si la base de datos está disponible
    if (!database) {
      console.error('La base de datos de Firebase no está disponible');
      isConnected.value = false;
      hasError.value = true;
      errorMessage.value = 'No se pudo conectar a la base de datos. Por favor, intenta más tarde.';
      isInitializing.value = false;
      return;
    }

    // Verificar si el usuario está autenticado en la tienda
    const isAuthenticated = store && store.getters && typeof store.getters.isAuthenticated === 'function' 
      ? store.getters.isAuthenticated()
      : (auth && auth.currentUser ? true : false);
      
    if (!isAuthenticated) {
      console.warn('Usuario no autenticado, usando ID de invitado');
      userId.value = 'guest_' + Date.now().toString();
    }
    
    // Referencia a este chat particular
    const chatRef = dbRef(database, `chats/${chatId.value}`);
    
    // Referencia a los mensajes de este chat
    const messagesRef = dbRef(database, `chats/${chatId.value}/messages`);
    
    // Referencia para el estado de "escribiendo" del administrador
    const adminTypingRef = dbRef(database, `chats/${chatId.value}/adminTyping`);
    
    // Escuchar cambios en los mensajes
    onChildAdded(messagesRef, (snapshot) => {
      const message = snapshot.val();
      // Evitar duplicados
      if (!messages.value.some(m => m.id === message.id)) {
        messages.value.push(message);
        nextTick(() => {
          scrollToBottom();
        });
      }
    });
    
    // Escuchar si el administrador está escribiendo
    onValue(adminTypingRef, (snapshot) => {
      isAdminTyping.value = snapshot.val() === true;
      if (isAdminTyping.value) {
        nextTick(() => {
          scrollToBottom();
        });
      }
    });
    
    // Verificar si el ticket está cerrado
    const statusRef = dbRef(database, `chats/${chatId.value}/metadata/status`);
    onValue(statusRef, (snapshot) => {
      if (snapshot.exists()) {
        const status = snapshot.val();
        ticketClosed.value = status === 'closed';
        console.log(`Estado del ticket: ${status}`);
      } else {
        ticketClosed.value = false;
      }
    });
    
    // Configurar metadatos del chat si no existen
    get(dbRef(database, `chats/${chatId.value}/metadata`)).then((snapshot) => {
      if (!snapshot.exists()) {
        // Si no existen metadatos, es un chat nuevo
        set(dbRef(database, `chats/${chatId.value}/metadata`), {
          userEmail: userEmail.value,
          adminEmail: adminEmail,
          ticketId: chatId.value,
          startedAt: serverTimestamp(),
          active: true,
          status: 'open'
        });
      }
    });
    
    // Establecer un estado "online" y limpiarlo al desconectarse
    const connectionRef = dbRef(database, `chats/${chatId.value}/connection`);
    set(connectionRef, true);
    onDisconnect(connectionRef).set(false);
    
    // Escuchar cambios en la conexión
    onValue(connectionRef, (snapshot) => {
      isConnected.value = snapshot.val() === true;
    });
    
    console.log('Conectado al chat:', chatId.value);
    isInitializing.value = false;
    hasError.value = false;
  } catch (error) {
    console.error('Error al conectar con el chat:', error);
    isConnected.value = false;
    hasError.value = true;
    errorMessage.value = 'Error al conectar con el servicio de chat: ' + error.message;
    isInitializing.value = false;
  }
};

// Reintentar conexión
const retryConnection = () => {
  isInitializing.value = true;
  hasError.value = false;
  errorMessage.value = '';
  
  // Pequeño delay para mostrar la interfaz de carga
  setTimeout(() => {
    // Reiniciar la conexión
    getUserInfo();
    connectToChat();
  }, 1000);
};

// Función para enviar un mensaje
const sendMessage = async () => {
  if (!userInput.value.trim() || isLoading.value || !isConnected.value || ticketClosed.value) return;
  
  try {
    // Verificar si la base de datos está disponible
    if (!database) {
      alert('No hay conexión con la base de datos. Por favor, recarga la página.');
      return;
    }
    
    isLoading.value = true;
    
    // Guardar el texto del mensaje
    const messageText = userInput.value.trim();
    
    // Crear objeto de mensaje
    const newMessage = {
      id: Date.now().toString(),
      text: messageText,
      isAdmin: false,
      sender: userEmail.value,
      receiver: adminEmail,
      timestamp: serverTimestamp(),
      read: false
    };
    
    // Referencia a los mensajes
    const messagesRef = dbRef(database, `chats/${chatId.value}/messages`);
    
    // Guardar mensaje en Firebase
    const newMessageRef = push(messagesRef);
    await set(newMessageRef, newMessage);
    
    // Notificar al administrador por correo (esto debería implementarse en el backend)
    notifyAdmin(messageText);
    
    // Limpiar input
    userInput.value = '';
    
    // Hacer scroll al final
    await nextTick();
    scrollToBottom();
    
    // También enviar una notificación al administrador
    await set(dbRef(database, `notifications/admin`), {
      type: 'new_message',
      chatId: chatId.value,
      userEmail: userEmail.value,
      timestamp: serverTimestamp(),
      preview: messageText.substring(0, 50) + (messageText.length > 50 ? '...' : '')
    });
    
  } catch (error) {
    console.error('Error al enviar mensaje:', error);
    alert('No se pudo enviar el mensaje. Por favor, intenta nuevamente.');
  } finally {
    isLoading.value = false;
  }
};

// Notificar al administrador (implementación simple, debería mejorarse en producción)
const notifyAdmin = async (messageText) => {
  // En un entorno real, esto debería implementarse en el backend
  // Aquí solo simulamos la funcionalidad
  console.log(`Notificación para ${adminEmail.join(', ')}: Nuevo mensaje de ${userEmail.value}`);
  
  // Podrías implementar un webhook o servicio para enviar realmente un correo
  // Por ejemplo, usando un servicio como EmailJS o una función serverless
  try {
    // Simulación: marcar tiempo para indicar que se envió notificación
    await set(dbRef(database, `chats/${chatId.value}/lastNotification`), serverTimestamp());
  } catch (error) {
    console.error('Error al notificar:', error);
  }
};

// Función para hacer scroll al último mensaje
const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

// Inicialización y limpieza
onMounted(async () => {
  try {
    // Esperar a que Firebase Auth esté inicializado
    await waitForAuthInit();
    
    // Obtener información del usuario primero
    getUserInfo();
    
    // Mostrar mensaje de depuración
    console.log(`Iniciando chat para usuario: ${userId.value} (${userEmail.value})`);
    
    // Conectar al chat
    if (database) {
      connectToChat();
    } else {
      console.error('Firebase no está disponible');
      isConnected.value = false;
      hasError.value = true;
      errorMessage.value = 'No se pudo conectar a la base de datos de Firebase.';
      isInitializing.value = false;
    }
    
    // Enfocar el campo de entrada
    if (messageInput.value) {
      messageInput.value.focus();
    }
    
    // Configurar chat container
    if (chatContainer.value) {
      scrollToBottom();
    }

    // Verificar si el usuario está autenticado
    if (isAuthenticated) {
      console.log("Usuario autenticado en la vista de soporte", userEmail.value);
    } else {
      console.log("Usuario no autenticado en la vista de soporte");
      router.push('/login');
    }
  } catch (error) {
    console.error('Error al inicializar el chat:', error);
    isConnected.value = false;
    hasError.value = true;
    errorMessage.value = 'Error al inicializar el chat: ' + error.message;
    isInitializing.value = false;
  }
});

// Limpiar al desmontar el componente
onUnmounted(() => {
  // Cerrar conexiones de Firebase
  try {
    if (database && chatId.value) {
      // Solo establecer conexión como false, pero mantener el chat activo
      set(dbRef(database, `chats/${chatId.value}/connection`), false);
    }
  } catch (error) {
    console.error('Error al desconectar:', error);
  }
});

// Observar cambios en los mensajes para hacer scroll automático
watch(messages, () => {
  nextTick(() => {
    scrollToBottom();
  });
});
</script>

<style scoped>
.soporte-container {
  max-width: 1200px;
  margin: 30px auto;
  padding: 0 20px;
}

.soporte-header {
  text-align: center;
  margin-bottom: 30px;
}

.soporte-header h1 {
  color: #004698;
  margin-bottom: 10px;
}

.support-admin {
  background: linear-gradient(90deg, #00c3ff, #00ff8c);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
}

/* Loading container */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  padding: 50px 20px;
  margin-bottom: 30px;
  height: 400px;
}

.loading-container .spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(0, 195, 255, 0.1);
  border-radius: 50%;
  border-top: 5px solid #00c3ff;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-container p {
  font-size: 18px;
  color: #666;
}

/* Error container */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  padding: 50px 20px;
  margin-bottom: 30px;
  height: 400px;
  text-align: center;
}

.error-icon {
  font-size: 50px;
  margin-bottom: 20px;
}

.error-container h3 {
  color: #f44336;
  margin-bottom: 10px;
  font-size: 22px;
}

.error-container p {
  margin-bottom: 25px;
  color: #666;
  max-width: 500px;
}

.retry-button {
  background: linear-gradient(90deg, #00c3ff, #00ff8c);
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 30px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 195, 255, 0.3);
}

.chat-container {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: 550px;
  overflow: hidden;
  margin-bottom: 30px;
}

.ticket-header {
  padding: 15px;
  border-bottom: 1px solid #eee;
  background: white;
}

.ticket-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ticket-info h3 {
  color: #004698;
  margin: 0;
}

.ticket-status {
  padding: 5px 10px;
  border-radius: 12px;
  font-weight: bold;
}

.ticket-status.status-closed {
  background-color: rgba(255, 0, 0, 0.1);
  color: #e00000;
}

.ticket-status.status-open {
  background-color: rgba(0, 200, 0, 0.1);
  color: #00a000;
}

.chat-messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #f9f9f9;
  background-image: 
    radial-gradient(circle at 10% 20%, rgba(0, 195, 255, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 90% 80%, rgba(0, 255, 140, 0.05) 0%, transparent 50%);
}

.message {
  margin-bottom: 15px;
  max-width: 80%;
  border-radius: 12px;
  padding: 12px 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.system-message {
  background-color: #f1f1f1;
  color: #666;
  text-align: center;
  padding: 10px 20px;
  font-style: italic;
  max-width: 100%;
  margin: 0 auto 20px;
}

.warning-message {
  background-color: rgba(255, 200, 100, 0.2);
  border: 1px solid rgba(255, 200, 100, 0.4);
  color: #9b7300;
}

.admin-message {
  background: linear-gradient(45deg, rgba(0, 195, 255, 0.1), rgba(0, 255, 140, 0.1));
  border-left: 3px solid #00c3ff;
  margin-right: auto;
}

.user-message {
  background-color: #e7f5ff;
  border-right: 3px solid #004698;
  margin-left: auto;
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 0.9em;
}

.admin-name {
  font-weight: bold;
  color: #004698;
}

.timestamp {
  font-size: 0.8em;
  color: #888;
}

.message-content p {
  margin: 0;
  line-height: 1.4;
}

.chat-input {
  padding: 15px;
  border-top: 1px solid #eee;
  background: white;
}

textarea {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: none;
  height: 80px;
  font-family: inherit;
  font-size: 14px;
  margin-bottom: 10px;
  transition: border 0.3s ease;
}

textarea:focus {
  outline: none;
  border-color: #00c3ff;
  box-shadow: 0 0 0 2px rgba(0, 195, 255, 0.2);
}

.input-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.send-button {
  background: linear-gradient(90deg, #00c3ff, #00ff8c);
  color: white;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 8px;
}

.send-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 195, 255, 0.3);
}

.send-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.additional-actions {
  display: flex;
  gap: 30px;
}

.contact-hours, .alternative-contact {
  flex: 1;
  background-color: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.contact-hours h3, .alternative-contact h3 {
  color: #004698;
  margin-top: 0;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 10px;
  margin-bottom: 15px;
}

/* Indicador de escritura */
.typing-indicator {
  display: flex;
  align-items: center;
  padding: 10px 0;
}

.typing-indicator span {
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: #00c3ff;
  border-radius: 50%;
  margin: 0 2px;
  opacity: 0.6;
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

/* Estado de conexión */
.connection-status {
  font-size: 0.8em;
  padding: 5px 10px;
  border-radius: 12px;
  font-weight: bold;
}

.connection-status.online {
  background-color: rgba(0, 200, 0, 0.1);
  color: #00a000;
}

.connection-status.offline {
  background-color: rgba(255, 0, 0, 0.1);
  color: #e00000;
}

/* Responsive */
@media (max-width: 768px) {
  .chat-container {
    height: 70vh;
  }
  
  .additional-actions {
    flex-direction: column;
  }
  
  .message {
    max-width: 90%;
  }
}

.ticket-closed-notice {
  text-align: center;
  color: #e00000;
  background-color: rgba(255, 0, 0, 0.05);
  padding: 8px;
  margin-top: 10px;
  border-radius: 8px;
  font-size: 0.9em;
}
</style> 