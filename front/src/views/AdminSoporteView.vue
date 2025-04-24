<template>
  <div class="admin-soporte-container">
    <h1 class="admin-title">Panel de Soporte - Administrador</h1>
    
    <!-- Estado de carga inicial -->
    <div v-if="isLoading" class="loading-container">
      <div class="spinner"></div>
      <p>Cargando conversaciones de soporte...</p>
    </div>
    
    <!-- Error de conexión -->
    <div v-else-if="hasError" class="error-container">
      <div class="error-icon">⚠️</div>
      <h3>Error al cargar las conversaciones</h3>
      <p>{{ errorMessage }}</p>
      <button @click="loadChats" class="retry-button">
        Intentar nuevamente
      </button>
    </div>
    
    <!-- Contenido principal -->
    <div v-else class="admin-content">
      <!-- Lista de conversaciones -->
      <div class="chats-list">
        <h2>Conversaciones</h2>
        
        <div v-if="chats.length === 0" class="no-chats">
          <p>No hay conversaciones activas</p>
        </div>
        
        <div v-else class="chats-container">
          <div 
            v-for="chat in chats" 
            :key="chat.id"
            :class="['chat-item', selectedChatId === chat.id ? 'selected' : '']"
            @click="selectChat(chat.id)"
          >
            <div class="chat-user">
              <div class="user-avatar">{{ getUserInitial(chat.userEmail) }}</div>
              <div class="user-info">
                <h3>{{ chat.userEmail }}</h3>
                <span class="chat-timestamp">{{ formatDateTimestamp(chat.startedAt) }}</span>
              </div>
            </div>
            <div class="chat-preview">
              <span 
                v-if="chat.unreadCount" 
                class="unread-badge"
              >{{ chat.unreadCount }}</span>
              <p>{{ chat.lastMessage?.text || 'Nueva conversación' }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Área de chat -->
      <div class="chat-area">
        <div v-if="!selectedChatId" class="no-chat-selected">
          <div class="empty-state-icon">
            <i class="fas fa-comments"></i>
          </div>
          <h2>Selecciona una conversación</h2>
          <p>Selecciona una conversación de la lista para ver los mensajes y responder</p>
        </div>
        
        <div v-else class="active-chat">
          <div class="chat-header">
            <h2>{{ selectedChat?.userEmail }}</h2>
            <div class="chat-actions">
              <button class="action-button" title="Marcar como resuelto" @click="markAsResolved">
                <i class="fas fa-check-circle"></i>
              </button>
            </div>
          </div>
          
          <div class="chat-messages" ref="chatContainer">
            <div class="messages-container">
              <div 
                v-for="message in selectedChatMessages" 
                :key="message.id"
                :class="['message', message.isAdmin ? 'admin-message' : 'user-message']"
              >
                <div class="message-header">
                  <span class="sender-name">{{ message.isAdmin ? 'Admin' : selectedChat?.userEmail }}</span>
                  <span class="timestamp">{{ formatTimestamp(message.timestamp) }}</span>
                </div>
                <div class="message-content">
                  <p>{{ message.text }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="chat-input">
            <textarea 
              v-model="adminReply" 
              placeholder="Escribe tu respuesta aquí..." 
              @keyup.enter.prevent="sendAdminReply"
              :disabled="isReplying"
              ref="replyInput"
            ></textarea>
            <div class="input-actions">
              <button 
                @click="sendAdminReply" 
                class="send-button" 
                :disabled="!adminReply.trim() || isReplying"
              >
                Enviar <i class="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { 
  getDatabase, 
  ref as dbRef, 
  push, 
  set, 
  onValue, 
  onChildAdded, 
  get,
  query,
  orderByChild,
  update,
  serverTimestamp 
} from 'firebase/database';

import firebaseApp, { auth, waitForAuthInit } from '../firebase';

const router = useRouter();
const store = useStore();

// Estado de la aplicación
const isLoading = ref(true);
const hasError = ref(false);
const errorMessage = ref('');
const adminEmail = 'brundindev@gmail.com'; // Email del administrador

// Estado de chats
const chats = ref([]);
const selectedChatId = ref(null);
const selectedChatMessages = ref([]);
const adminReply = ref('');
const isReplying = ref(false);
const chatContainer = ref(null);
const replyInput = ref(null);

// Conexión a Firebase
let database;
let chatListeners = [];

// Chat seleccionado computado
const selectedChat = computed(() => {
  return chats.value.find(chat => chat.id === selectedChatId.value);
});

// Inicializar Firebase
try {
  database = getDatabase(firebaseApp);
} catch (error) {
  console.error('Error al obtener la base de datos de Firebase:', error);
  hasError.value = true;
  errorMessage.value = 'No se pudo inicializar la base de datos. Por favor, intenta más tarde.';
  isLoading.value = false;
}

// Cargar lista de chats
const loadChats = async () => {
  if (!database) return;
  
  try {
    isLoading.value = true;
    hasError.value = false;
    
    // Limpiar listeners anteriores
    cleanupChatListeners();
    
    // Referencia a todos los chats
    const chatsRef = dbRef(database, 'chats');
    
    // Escuchar cambios en la lista de chats
    const chatListener = onValue(chatsRef, async (snapshot) => {
      const chatsData = snapshot.val();
      const chatsArray = [];
      
      if (chatsData) {
        for (const chatId in chatsData) {
          // Obtener metadatos del chat
          const chatMetadata = chatsData[chatId].metadata || {};
          
          // Verificar si el chat está activo
          if (chatMetadata.active !== false) {
            // Obtener último mensaje para mostrar en la vista previa
            let lastMessage = null;
            let unreadCount = 0;
            
            // Verificar si hay mensajes
            if (chatsData[chatId].messages) {
              const messagesArray = Object.values(chatsData[chatId].messages);
              
              // Ordenar por timestamp
              messagesArray.sort((a, b) => {
                const timestampA = a.timestamp || 0;
                const timestampB = b.timestamp || 0;
                return timestampB - timestampA;
              });
              
              // Asignar el último mensaje
              if (messagesArray.length > 0) {
                lastMessage = messagesArray[0];
              }
              
              // Contar mensajes no leídos del usuario (no del admin)
              unreadCount = messagesArray.filter(msg => !msg.isAdmin && !msg.read).length;
            }
            
            // Agregar chat a la lista
            chatsArray.push({
              id: chatId,
              userEmail: chatMetadata.userEmail || 'Usuario Desconocido',
              adminEmail: chatMetadata.adminEmail || adminEmail,
              startedAt: chatMetadata.startedAt || null,
              active: chatMetadata.active !== false,
              lastMessage,
              unreadCount
            });
          }
        }
        
        // Ordenar chats por fecha de último mensaje (más reciente primero)
        chatsArray.sort((a, b) => {
          const timeA = a.lastMessage?.timestamp || a.startedAt || 0;
          const timeB = b.lastMessage?.timestamp || b.startedAt || 0;
          return timeB - timeA;
        });
        
        // Actualizar lista de chats
        chats.value = chatsArray;
      } else {
        chats.value = [];
      }
      
      isLoading.value = false;
    });
    
    // Guardar listener para limpieza
    chatListeners.push(chatListener);
    
  } catch (error) {
    console.error('Error al cargar los chats:', error);
    hasError.value = true;
    errorMessage.value = 'Error al cargar las conversaciones: ' + error.message;
    isLoading.value = false;
  }
};

// Seleccionar un chat
const selectChat = async (chatId) => {
  if (selectedChatId.value === chatId) return;
  
  try {
    // Limpiar mensajes anteriores
    selectedChatMessages.value = [];
    selectedChatId.value = chatId;
    
    if (!chatId) return;
    
    // Cargar mensajes del chat seleccionado
    const messagesRef = dbRef(database, `chats/${chatId}/messages`);
    
    // Crear un listener para nuevos mensajes
    const messageListener = onChildAdded(messagesRef, (snapshot) => {
      const message = snapshot.val();
      
      // Evitar duplicados
      if (!selectedChatMessages.value.some(m => m.id === message.id)) {
        selectedChatMessages.value.push(message);
        
        // Marcar como leído si es mensaje del usuario
        if (!message.isAdmin && !message.read) {
          const messageRef = dbRef(database, `chats/${chatId}/messages/${snapshot.key}`);
          update(messageRef, { read: true });
        }
        
        // Ordenar mensajes por timestamp
        selectedChatMessages.value.sort((a, b) => {
          const timeA = a.timestamp || 0;
          const timeB = b.timestamp || 0;
          return timeA - timeB;
        });
        
        // Hacer scroll al final
        nextTick(() => {
          scrollToBottom();
        });
      }
    });
    
    // Guardar listener para limpieza
    chatListeners.push(messageListener);
    
    // Cargar mensajes existentes
    const snapshot = await get(messagesRef);
    if (snapshot.exists()) {
      const messagesData = snapshot.val();
      const messagesArray = Object.values(messagesData);
      
      // Ordenar por timestamp y actualizar
      messagesArray.sort((a, b) => {
        const timeA = a.timestamp || 0;
        const timeB = b.timestamp || 0;
        return timeA - timeB;
      });
      
      selectedChatMessages.value = messagesArray;
      
      // Marcar mensajes como leídos
      Object.entries(messagesData).forEach(([key, message]) => {
        if (!message.isAdmin && !message.read) {
          const messageRef = dbRef(database, `chats/${chatId}/messages/${key}`);
          update(messageRef, { read: true });
        }
      });
    }
    
    // Enfocar input de respuesta
    nextTick(() => {
      if (replyInput.value) {
        replyInput.value.focus();
      }
      scrollToBottom();
    });
    
  } catch (error) {
    console.error('Error al seleccionar chat:', error);
    alert('Error al cargar los mensajes: ' + error.message);
  }
};

// Enviar respuesta del administrador
const sendAdminReply = async () => {
  if (!adminReply.value.trim() || isReplying.value || !selectedChatId.value) return;
  
  try {
    isReplying.value = true;
    
    // Crear objeto de mensaje
    const replyMessage = {
      id: Date.now().toString(),
      text: adminReply.value.trim(),
      isAdmin: true,
      sender: adminEmail,
      receiver: selectedChat.value?.userEmail || 'usuario',
      timestamp: serverTimestamp(),
      read: false
    };
    
    // Referencia a los mensajes
    const messagesRef = dbRef(database, `chats/${selectedChatId.value}/messages`);
    
    // Guardar mensaje en Firebase
    const newMessageRef = push(messagesRef);
    await set(newMessageRef, replyMessage);
    
    // Indicar que el administrador está escribiendo (false)
    const typingRef = dbRef(database, `chats/${selectedChatId.value}/adminTyping`);
    await set(typingRef, false);
    
    // Limpiar input
    adminReply.value = '';
    
    // Hacer scroll al final
    nextTick(() => {
      scrollToBottom();
    });
    
  } catch (error) {
    console.error('Error al enviar respuesta:', error);
    alert('No se pudo enviar la respuesta. Por favor, intenta nuevamente.');
  } finally {
    isReplying.value = false;
  }
};

// Marcar chat como resuelto (inactivo)
const markAsResolved = async () => {
  if (!selectedChatId.value) return;
  
  if (confirm('¿Estás seguro de marcar esta conversación como resuelta?')) {
    try {
      const metadataRef = dbRef(database, `chats/${selectedChatId.value}/metadata`);
      await update(metadataRef, { active: false });
      
      // Enviar mensaje del sistema
      const messagesRef = dbRef(database, `chats/${selectedChatId.value}/messages`);
      const systemMessage = {
        id: Date.now().toString(),
        text: 'Chat marcado como resuelto por el administrador.',
        isAdmin: true,
        sender: 'sistema',
        timestamp: serverTimestamp(),
        isSystemMessage: true
      };
      
      await push(messagesRef, systemMessage);
      
      // Seleccionar otro chat si hay disponible
      const otherChat = chats.value.find(chat => chat.id !== selectedChatId.value && chat.active);
      
      if (otherChat) {
        selectChat(otherChat.id);
      } else {
        selectedChatId.value = null;
        selectedChatMessages.value = [];
      }
      
      // Recargar lista de chats
      loadChats();
      
    } catch (error) {
      console.error('Error al marcar como resuelto:', error);
      alert('Error al marcar la conversación como resuelta: ' + error.message);
    }
  }
};

// Obtener inicial del usuario para mostrar en avatar
const getUserInitial = (email) => {
  if (!email) return '?';
  return email.charAt(0).toUpperCase();
};

// Formatear timestamp del servidor
const formatTimestamp = (timestamp) => {
  if (!timestamp) return '';
  
  try {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return '';
  }
};

// Formatear fecha completa
const formatDateTimestamp = (timestamp) => {
  if (!timestamp) return '';
  
  try {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return '';
  }
};

// Hacer scroll al último mensaje
const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

// Limpiar listeners para evitar memory leaks
const cleanupChatListeners = () => {
  chatListeners.forEach(listener => {
    if (typeof listener === 'function') {
      listener();
    }
  });
  chatListeners = [];
};

// Verificar si es administrador
const checkIsAdmin = () => {
  const user = store.getters.getUser || auth.currentUser;
  
  if (!user || user.email !== adminEmail) {
    alert('Acceso restringido. Solo el administrador puede acceder a esta página.');
    router.push('/');
    return false;
  }
  
  return true;
};

// Cambios en el input para mostrar "escribiendo..."
watch(adminReply, async (newValue, oldValue) => {
  if (!selectedChatId.value) return;
  
  // Solo actualizar si cambia el estado (de vacio a con texto o viceversa)
  if ((newValue.trim() !== '' && oldValue.trim() === '') || 
      (newValue.trim() === '' && oldValue.trim() !== '')) {
    const typingRef = dbRef(database, `chats/${selectedChatId.value}/adminTyping`);
    await set(typingRef, newValue.trim() !== '');
  }
});

// Inicialización
onMounted(async () => {
  try {
    // Esperar a que Firebase Auth esté inicializado
    await waitForAuthInit();
    
    // Verificar si es administrador
    if (checkIsAdmin()) {
      await loadChats();
    }
  } catch (error) {
    console.error('Error al inicializar el panel de soporte:', error);
    hasError.value = true;
    errorMessage.value = 'Error al inicializar el panel: ' + error.message;
    isLoading.value = false;
  }
});

// Limpiar al desmontar
onUnmounted(() => {
  // Limpiar todos los listeners activos
  cleanupChatListeners();
});
</script>

<style scoped>
.admin-soporte-container {
  max-width: 1500px;
  margin: 20px auto;
  padding: 0 20px;
}

.admin-title {
  margin-bottom: 20px;
  color: #004698;
  text-align: center;
}

/* Estado de carga */
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

.retry-button {
  background: linear-gradient(90deg, #00c3ff, #00ff8c);
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

/* Layout principal */
.admin-content {
  display: flex;
  gap: 20px;
  height: calc(100vh - 120px);
  min-height: 600px;
}

/* Lista de chats */
.chats-list {
  width: 350px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chats-list h2 {
  padding: 20px;
  margin: 0;
  background-color: #f5f5f5;
  color: #004698;
  border-bottom: 1px solid #e0e0e0;
}

.chats-container {
  flex: 1;
  overflow-y: auto;
}

.no-chats {
  padding: 30px;
  text-align: center;
  color: #666;
}

.chat-item {
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.2s;
}

.chat-item:hover {
  background-color: #f9f9f9;
}

.chat-item.selected {
  background-color: #e7f5ff;
  border-left: 3px solid #004698;
}

.chat-user {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #00c3ff, #00ff8c);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 10px;
}

.user-info {
  flex: 1;
}

.user-info h3 {
  margin: 0;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-timestamp {
  font-size: 12px;
  color: #888;
}

.chat-preview {
  position: relative;
  padding-right: 20px;
}

.chat-preview p {
  margin: 0;
  font-size: 13px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.unread-badge {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #ff3860;
  color: white;
  font-size: 11px;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

/* Área de chat */
.chat-area {
  flex: 1;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.no-chat-selected {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
  text-align: center;
  color: #666;
}

.empty-state-icon {
  font-size: 60px;
  color: #e0e0e0;
  margin-bottom: 20px;
}

.active-chat {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-header {
  padding: 15px 20px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.chat-header h2 {
  margin: 0;
  font-size: 16px;
  color: #004698;
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

.messages-container {
  display: flex;
  flex-direction: column;
}

.message {
  margin-bottom: 15px;
  max-width: 80%;
  border-radius: 12px;
  padding: 12px 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.admin-message {
  background: linear-gradient(45deg, rgba(0, 195, 255, 0.1), rgba(0, 255, 140, 0.1));
  border-left: 3px solid #00c3ff;
  align-self: flex-end;
}

.user-message {
  background-color: white;
  border-left: 3px solid #004698;
  align-self: flex-start;
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 0.9em;
}

.sender-name {
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
  justify-content: flex-end;
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

.action-button {
  background-color: transparent;
  color: #004698;
  font-size: 16px;
  padding: 5px 10px;
  border-radius: 4px;
}

.action-button:hover {
  background-color: rgba(0, 70, 152, 0.1);
}

/* Responsive */
@media (max-width: 900px) {
  .admin-content {
    flex-direction: column;
    height: auto;
  }
  
  .chats-list, .chat-area {
    width: 100%;
    height: 400px;
  }
  
  .active-chat, .no-chat-selected {
    height: 100%;
  }
}
</style> 