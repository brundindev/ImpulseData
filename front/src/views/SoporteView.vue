<template>
  <div class="soporte-container">
    <!-- Nuevos efectos visuales -->
    <div class="animated-background">
      <div class="gradient-sphere sphere-1"></div>
      <div class="gradient-sphere sphere-2"></div>
      <div class="gradient-sphere sphere-3"></div>
    </div>
    
    <!-- Partículas flotantes -->
    <div class="floating-particles welcome-particles">
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
    </div>
    
    <!-- Estrellas brillantes -->
    <div class="stars-container">
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>
    </div>
    
    <!-- Efecto de ondas -->
    <div class="wave-background">
      <div class="wave"></div>
      <div class="wave"></div>
      <div class="wave"></div>
    </div>
    
    <div class="dashboard-container">
      <!-- Encabezado -->
      <div class="dashboard-header">
        <div>
          <h1 class="welcome-title">Soporte Técnico</h1>
          <p class="welcome-subtitle">¡Bienvenido al centro de soporte, <span class="user-name">{{ userEmail.split('@')[0] || 'Usuario' }}</span>!</p>
        </div>
      </div>
      
      <!-- Estado de carga inicial -->
      <div v-if="isInitializing" class="loading-container">
        <div class="spinner"></div>
        <div class="loader">
          <p>Conectando</p>
          <div class="words">
            <span class="word">servicio</span>
            <span class="word">soporte</span>
            <span class="word">ticket</span>
            <span class="word">sistema</span>
            <span class="word">servicio</span>
          </div>
        </div>
      </div>
      
      <!-- Error de conexión -->
      <div v-else-if="hasError" class="error-container">
        <div class="error-content">
          <div class="error-icon">⚠️</div>
          <h3>Ticket de soporte</h3>
          <p>Si quieres abrir un ticket, por favor, dale a este botón y te abriremos un ticket en nuestra plataforma de tickets.</p>
          <button @click="retryConnection" class="btn btn-primary">
            Abrir ticket
          </button>
        </div>
      </div>
      
      <!-- Chat principal -->
      <div v-else class="dashboard-content">
        <div class="alicante-banner-showcase">
          <div class="banner-content">
            <div class="banner-image-container">
              <img src="@/assets/img/impulsaalicante.png" alt="Impulsa Alicante" class="banner-image" />
              <div class="image-glow"></div>
            </div>
            <div class="banner-info">
              <h3>Soporte ImpulseData {{ chatId }}</h3>
              <div class="ticket-status-banner">
                <span :class="['ticket-status', ticketClosed ? 'status-closed' : 'status-open']">
                  {{ ticketClosed ? 'Ticket cerrado' : 'Ticket abierto' }}
                </span>
              </div>
            </div>
          </div>
          <div class="banner-accent-shapes">
            <div class="accent-shape shape-1"></div>
            <div class="accent-shape shape-2"></div>
            <div class="accent-shape shape-3"></div>
          </div>
        </div>
        
        <div class="support-chat-container">
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
                  class="btn btn-primary" 
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
        
        <!-- Información adicional -->
        <div class="stats-section">
          <div class="stat-card">
            <h3>Horario</h3>
            <div class="stat-content">
              <p>Lunes a Viernes: 9:00 - 18:00</p>
              <p>Sábados: 9:00 - 13:00</p>
            </div>
          </div>
          <div class="stat-card">
            <h3>Contacto</h3>
            <div class="stat-content">
              <p><i class="fas fa-phone"></i> +34 123 456 789</p>
              <p><i class="fas fa-envelope"></i> info@impulsedata.es</p>
            </div>
          </div>
          <div class="stat-card">
            <h3>Estado</h3>
            <div class="stat-content">
              <p>Ticket: <strong>{{ chatId }}</strong></p>
              <p>Estado: <strong>{{ ticketClosed ? 'Cerrado' : 'Abierto' }}</strong></p>
            </div>
          </div>
        </div>
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
  position: relative;
  overflow: hidden;
  min-height: 100vh;
  padding-bottom: 30px;
}

/* Efectos de fondo */
.animated-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
}

.gradient-sphere {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.5;
}

.sphere-1 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle at center, rgba(0, 195, 255, 0.4), rgba(0, 195, 255, 0));
  top: -200px;
  left: -200px;
  animation: float1 20s ease-in-out infinite;
}

.sphere-2 {
  width: 800px;
  height: 800px;
  background: radial-gradient(circle at center, rgba(0, 255, 140, 0.3), rgba(0, 255, 140, 0));
  bottom: -300px;
  right: -300px;
  animation: float2 25s ease-in-out infinite;
}

.sphere-3 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0));
  bottom: 10%;
  left: 30%;
  animation: float3 15s ease-in-out infinite;
}

@keyframes float1 {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(50px, 50px); }
}

@keyframes float2 {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(-30px, -50px); }
}

@keyframes float3 {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(20px, -30px); }
}

/* Partículas flotantes */
.floating-particles {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: -1;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 6px;
  height: 6px;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  animation: float-particle 20s linear infinite;
}

.particle:nth-child(1) { top: 20%; left: 10%; animation-duration: 15s; }
.particle:nth-child(2) { top: 30%; left: 80%; animation-duration: 18s; }
.particle:nth-child(3) { top: 70%; left: 20%; animation-duration: 22s; }
.particle:nth-child(4) { top: 40%; left: 40%; animation-duration: 14s; }
.particle:nth-child(5) { top: 85%; left: 70%; animation-duration: 19s; }
.particle:nth-child(6) { top: 15%; left: 60%; animation-duration: 17s; }
.particle:nth-child(7) { top: 50%; left: 30%; animation-duration: 21s; }
.particle:nth-child(8) { top: 60%; left: 90%; animation-duration: 16s; }

@keyframes float-particle {
  0% { transform: translate(0, 0); }
  25% { transform: translate(20px, 20px); }
  50% { transform: translate(0, 40px); }
  75% { transform: translate(-20px, 20px); }
  100% { transform: translate(0, 0); }
}

/* Estrellas brillantes */
.stars-container {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: -1;
  pointer-events: none;
}

.star {
  position: absolute;
  width: 3px;
  height: 3px;
  background-color: white;
  border-radius: 50%;
  animation: twinkle 5s ease-in-out infinite;
}

.star:nth-child(1) { top: 15%; left: 20%; animation-delay: 0s; }
.star:nth-child(2) { top: 25%; left: 85%; animation-delay: 0.5s; }
.star:nth-child(3) { top: 65%; left: 15%; animation-delay: 1s; }
.star:nth-child(4) { top: 35%; left: 45%; animation-delay: 1.5s; }
.star:nth-child(5) { top: 75%; left: 75%; animation-delay: 2s; }
.star:nth-child(6) { top: 10%; left: 55%; animation-delay: 2.5s; }
.star:nth-child(7) { top: 45%; left: 25%; animation-delay: 3s; }
.star:nth-child(8) { top: 55%; left: 85%; animation-delay: 3.5s; }
.star:nth-child(9) { top: 85%; left: 35%; animation-delay: 4s; }
.star:nth-child(10) { top: 5%; left: 65%; animation-delay: 4.5s; }

@keyframes twinkle {
  0%, 100% { opacity: 0.2; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.5); }
}

/* Efecto de ondas */
.wave-background {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: -1;
  pointer-events: none;
  opacity: 0.4;
}

.wave {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100px;
  background: linear-gradient(to top, rgba(0, 195, 255, 0.05), transparent);
  transform-origin: bottom center;
  animation: wave 20s linear infinite;
}

.wave:nth-child(2) {
  height: 140px;
  animation-delay: 5s;
  opacity: 0.3;
}

.wave:nth-child(3) {
  height: 180px;
  animation-delay: 10s;
  opacity: 0.2;
}

@keyframes wave {
  0%, 100% { transform: scaleY(1) translateY(0); }
  50% { transform: scaleY(1.2) translateY(-20px); }
}

/* Elementos de dashboard */
.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.dashboard-header {
  padding: 20px 0;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.welcome-title {
  font-size: 2.5rem;
  margin: 0;
  background: linear-gradient(90deg, #004698, #00c3ff);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
}

.welcome-subtitle {
  font-size: 1.2rem;
  color: #666;
  margin: 5px 0 0;
}

.user-name {
  color: #004698;
  font-weight: bold;
}

/* Componentes de soporte */
.dashboard-content {
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  margin-bottom: 30px;
}

.alicante-banner-showcase {
  margin-bottom: 24px;
  background: linear-gradient(135deg, rgba(0, 70, 152, 0.05), rgba(0, 195, 255, 0.1));
  border-radius: 16px;
  padding: 20px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.banner-content {
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1;
}

.banner-image-container {
  flex: 0 0 120px;
  position: relative;
}

.banner-image {
  width: 100%;
  height: auto;
  border-radius: 12px;
}

.image-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120%;
  height: 120%;
  background: radial-gradient(circle at center, rgba(0, 195, 255, 0.3), transparent 70%);
  z-index: -1;
}

.banner-info {
  flex: 1;
  padding-left: 20px;
}

.banner-info h3 {
  margin: 0 0 10px;
  color: #004698;
  font-size: 1.5rem;
}

.banner-accent-shapes {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 0;
  overflow: hidden;
}

.accent-shape {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(0, 195, 255, 0.1), rgba(0, 255, 140, 0.1));
}

.shape-1 {
  width: 100px;
  height: 100px;
  top: -30px;
  right: 10%;
}

.shape-2 {
  width: 150px;
  height: 150px;
  bottom: -50px;
  right: -30px;
}

.shape-3 {
  width: 80px;
  height: 80px;
  bottom: 10px;
  left: 15%;
}

.ticket-status-banner {
  margin-top: 15px;
}

.ticket-status {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 0.9rem;
}

.status-open {
  background: linear-gradient(to right, #00c3ff, #00ff8c);
  color: white;
}

.status-closed {
  background: linear-gradient(to right, #ff3860, #ff5e3a);
  color: white;
}

/* Contenedor del chat */
.support-chat-container {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  height: 500px;
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
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
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

/* Área de input */
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

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
}

.btn-primary {
  background: linear-gradient(90deg, #00c3ff, #00ff8c);
  color: white;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 195, 255, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Elementos de estado de conexión */
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

.ticket-closed-notice {
  text-align: center;
  color: #e00000;
  background-color: rgba(255, 0, 0, 0.05);
  padding: 8px;
  margin-top: 10px;
  border-radius: 8px;
  font-size: 0.9em;
}

/* Tarjetas de estadísticas */
.stats-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.stat-card h3 {
  margin: 0 0 15px;
  color: #004698;
  font-size: 1.2rem;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 10px;
}

.stat-content {
  color: #555;
  font-size: 0.9rem;
}

.stat-content p {
  margin: 5px 0;
}

/* Estado de carga */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  padding: 40px 20px;
  min-height: 400px;
}

.spinner {
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

.loader {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.loader p {
  margin: 0;
  font-size: 1.2rem;
  color: #004698;
}

.words {
  margin-top: 10px;
  display: inline-block;
  position: relative;
  text-align: center;
  color: #00c3ff;
  font-weight: bold;
}

.word {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  opacity: 0;
  animation: rotateWord 10s linear infinite;
}

.word:nth-child(2) { animation-delay: 2s; }
.word:nth-child(3) { animation-delay: 4s; }
.word:nth-child(4) { animation-delay: 6s; }
.word:nth-child(5) { animation-delay: 8s; }

@keyframes rotateWord {
  0%, 20% { opacity: 0; transform: translateY(10px); }
  25%, 45% { opacity: 1; transform: translateY(0); }
  50%, 100% { opacity: 0; transform: translateY(-10px); }
}

/* Error container */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  padding: 40px 20px;
  min-height: 400px;
}

.error-content {
  max-width: 500px;
  text-align: center;
}

.error-icon {
  font-size: 50px;
  margin-bottom: 20px;
}

.error-container h3 {
  color: #004698;
  margin-bottom: 15px;
  font-size: 1.8rem;
}

.error-container p {
  margin-bottom: 25px;
  color: #666;
}

/* Responsive */
@media (max-width: 768px) {
  .stats-section {
    grid-template-columns: 1fr;
  }
  
  .support-chat-container {
    height: 400px;
  }
  
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    text-align: center;
  }
  
  .banner-content {
    flex-direction: column;
    text-align: center;
  }
  
  .banner-image-container {
    margin-bottom: 15px;
  }
  
  .banner-info {
    padding-left: 0;
  }
}
</style> 