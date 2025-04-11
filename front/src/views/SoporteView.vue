<template>
  <div class="soporte-container">
    <div class="card">
      <h1>Soporte Técnico</h1>
      
      <div class="info-section">
        <p>Si experimentas problemas con la aplicación, esta página te ofrece soluciones rápidas.</p>
      </div>
      
      <div class="actions">
        <div class="action-card">
          <h3>Resolver problemas de datos e IndexedDB</h3>
          <p>Soluciona errores de "NotFoundError" y problemas con el almacenamiento local.</p>
          <button @click="limpiarCacheIndexedDB" class="btn-primary">
            <i class="fas fa-database"></i> Limpiar datos almacenados
          </button>
        </div>
        
        <div class="action-card">
          <h3>Restablecer sesión</h3>
          <p>Cierra sesión y limpia todos los datos almacenados para comenzar de nuevo.</p>
          <button @click="cerrarSesionCompleta" class="btn-warning">
            <i class="fas fa-sign-out-alt"></i> Cerrar sesión y limpiar datos
          </button>
        </div>
        
        <div class="action-card">
          <h3>Reiniciar conexión Firebase</h3>
          <p>Restablece la conexión con Firebase si encuentras errores al cargar datos.</p>
          <button @click="reiniciarConexionFirebase" class="btn-info">
            <i class="fas fa-sync"></i> Reiniciar conexión
          </button>
        </div>
      </div>
      
      <div class="diagnostics-section">
        <h2>Diagnóstico del sistema</h2>
        <div class="diagnostics-info">
          <div class="diagnostic-item">
            <span class="label">Estado Firebase Auth:</span>
            <span class="value" :class="authStatus.class">{{ authStatus.text }}</span>
          </div>
          <div class="diagnostic-item">
            <span class="label">Estado Firestore:</span>
            <span class="value" :class="firestoreStatus.class">{{ firestoreStatus.text }}</span>
          </div>
          <div class="diagnostic-item">
            <span class="label">Sesión local:</span>
            <span class="value" :class="sessionStatus.class">{{ sessionStatus.text }}</span>
          </div>
          <div class="diagnostic-item">
            <span class="label">IndexedDB:</span>
            <span class="value" :class="indexedDBStatus.class">{{ indexedDBStatus.text }}</span>
          </div>
        </div>
      </div>
      
      <div class="actions mt-4">
        <button @click="volverAlInicio" class="btn-success wide-button">
          <i class="fas fa-home"></i> Volver al inicio
        </button>
      </div>
      
      <div v-if="message" class="message" :class="messageType">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { auth, firestore } from '../firebase';
import { enableNetwork, disableNetwork } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

export default {
  name: 'SoporteView',
  setup() {
    const router = useRouter();
    const message = ref('');
    const messageType = ref('');
    
    // Estados de diagnóstico
    const authStatus = ref({ text: 'Verificando...', class: '' });
    const firestoreStatus = ref({ text: 'Verificando...', class: '' });
    const sessionStatus = ref({ text: 'Verificando...', class: '' });
    const indexedDBStatus = ref({ text: 'Verificando...', class: '' });
    
    // Verificar estado de autenticación
    const verificarAuthStatus = () => {
      if (auth.currentUser) {
        authStatus.value = { text: 'Autenticado como ' + auth.currentUser.email, class: 'status-ok' };
      } else if (localStorage.getItem('authToken')) {
        authStatus.value = { text: 'Token JWT presente pero sin sesión en Firebase', class: 'status-warning' };
      } else {
        authStatus.value = { text: 'No autenticado', class: 'status-error' };
      }
    };
    
    // Verificar estado de Firestore
    const verificarFirestoreStatus = async () => {
      try {
        firestoreStatus.value = { text: 'Conectando...', class: 'status-pending' };
        await enableNetwork(firestore);
        firestoreStatus.value = { text: 'Conectado', class: 'status-ok' };
      } catch (error) {
        firestoreStatus.value = { text: 'Error: ' + error.message, class: 'status-error' };
      }
    };
    
    // Verificar estado de la sesión local
    const verificarSessionStatus = () => {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');
      
      if (token && userData) {
        sessionStatus.value = { text: 'Datos de sesión completos', class: 'status-ok' };
      } else if (token || userData) {
        sessionStatus.value = { text: 'Datos de sesión parciales', class: 'status-warning' };
      } else {
        sessionStatus.value = { text: 'No hay datos de sesión', class: 'status-error' };
      }
    };
    
    // Verificar estado de IndexedDB
    const verificarIndexedDBStatus = () => {
      if (!window.indexedDB) {
        indexedDBStatus.value = { text: 'No soportado', class: 'status-error' };
        return;
      }
      
      try {
        const request = window.indexedDB.open('firebase-heartbeat-database');
        request.onsuccess = () => {
          indexedDBStatus.value = { text: 'Funcionando correctamente', class: 'status-ok' };
          request.result.close();
        };
        request.onerror = () => {
          indexedDBStatus.value = { text: 'Error: ' + request.error.message, class: 'status-error' };
        };
      } catch (error) {
        indexedDBStatus.value = { text: 'Error al acceder: ' + error.message, class: 'status-error' };
      }
    };
    
    // Limpiar cache de IndexedDB
    const limpiarCacheIndexedDB = async () => {
      try {
        message.value = 'Limpiando datos almacenados...';
        messageType.value = 'info';
        
        // Deshabilitar red de Firestore
        await disableNetwork(firestore);
        
        // Intentar eliminar cualquier caché de IndexedDB
        if ('indexedDB' in window) {
          const dbNames = ['firebaseLocalStorageDb', 'firebase-heartbeat-database', 'firestore'];
          
          for (const dbName of dbNames) {
            try {
              const deleteRequest = indexedDB.deleteDatabase(dbName);
              deleteRequest.onsuccess = () => console.log(`Base de datos ${dbName} eliminada`);
              deleteRequest.onerror = () => console.error(`Error al eliminar ${dbName}`);
            } catch (e) {
              console.error(`Error al intentar eliminar ${dbName}: ${e}`);
            }
          }
        }
        
        // Eliminar elementos de sessionStorage
        sessionStorage.removeItem('firebaseUid');
        sessionStorage.removeItem('reautenticacionFallida');
        sessionStorage.removeItem('lastReload');
        sessionStorage.removeItem('indexedDBErrorFixed');
        
        // Esperar un momento antes de reconectar
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Habilitar de nuevo la red
        await enableNetwork(firestore);
        
        // Actualizar estado
        message.value = 'Datos limpiados correctamente. Actualiza la página para aplicar los cambios.';
        messageType.value = 'success';
        
        // Actualizar estados
        verificarFirestoreStatus();
        verificarIndexedDBStatus();
      } catch (error) {
        message.value = 'Error al limpiar datos: ' + error.message;
        messageType.value = 'error';
      }
    };
    
    // Cerrar sesión completa
    const cerrarSesionCompleta = async () => {
      try {
        message.value = 'Cerrando sesión y limpiando datos...';
        messageType.value = 'info';
        
        // Cerrar sesión en Firebase
        if (auth.currentUser) {
          await signOut(auth);
        }
        
        // Limpiar almacenamiento local
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('user');
        
        // Limpiar almacenamiento de sesión
        sessionStorage.clear();
        
        // Limpiar cache de IndexedDB
        await limpiarCacheIndexedDB();
        
        message.value = 'Sesión cerrada correctamente. Redirigiendo...';
        messageType.value = 'success';
        
        // Redirigir al login después de un breve retraso
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } catch (error) {
        message.value = 'Error al cerrar sesión: ' + error.message;
        messageType.value = 'error';
      }
    };
    
    // Reiniciar conexión Firebase
    const reiniciarConexionFirebase = async () => {
      try {
        message.value = 'Reiniciando conexión con Firebase...';
        messageType.value = 'info';
        
        // Deshabilitar red primero
        await disableNetwork(firestore);
        
        // Esperar un momento
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Habilitar la red nuevamente
        await enableNetwork(firestore);
        
        // Actualizar estados
        verificarFirestoreStatus();
        verificarAuthStatus();
        
        message.value = 'Conexión reiniciada correctamente';
        messageType.value = 'success';
      } catch (error) {
        message.value = 'Error al reiniciar conexión: ' + error.message;
        messageType.value = 'error';
      }
    };
    
    // Volver al inicio
    const volverAlInicio = () => {
      router.push('/home');
    };
    
    // Al montar el componente
    onMounted(() => {
      verificarAuthStatus();
      verificarFirestoreStatus();
      verificarSessionStatus();
      verificarIndexedDBStatus();
    });
    
    return {
      message,
      messageType,
      authStatus,
      firestoreStatus,
      sessionStatus,
      indexedDBStatus,
      limpiarCacheIndexedDB,
      cerrarSesionCompleta,
      reiniciarConexionFirebase,
      volverAlInicio
    };
  }
};
</script>

<style scoped>
.soporte-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  padding: 2rem;
  background-color: #f5f8fa;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 800px;
}

h1 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #eaeaea;
  padding-bottom: 0.75rem;
  text-align: center;
}

h2 {
  color: #3498db;
  margin: 1.5rem 0 1rem;
  font-size: 1.4rem;
}

.info-section {
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: #f1f8ff;
  border-radius: 6px;
  border-left: 4px solid #3498db;
}

.actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.action-card {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.action-card h3 {
  margin-top: 0;
  color: #3498db;
  font-size: 1.1rem;
}

.action-card p {
  flex-grow: 1;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #666;
}

button {
  cursor: pointer;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #3498db;
  color: white;
}

.btn-primary:hover {
  background-color: #2980b9;
}

.btn-warning {
  background-color: #e74c3c;
  color: white;
}

.btn-warning:hover {
  background-color: #c0392b;
}

.btn-info {
  background-color: #2ecc71;
  color: white;
}

.btn-info:hover {
  background-color: #27ae60;
}

.btn-success {
  background-color: #3498db;
  color: white;
}

.btn-success:hover {
  background-color: #2980b9;
}

.wide-button {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
}

.message {
  margin-top: 1.5rem;
  padding: 1rem;
  border-radius: 4px;
  text-align: center;
}

.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.info {
  background-color: #d1ecf1;
  color: #0c5460;
  border: 1px solid #bee5eb;
}

.diagnostics-section {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.diagnostics-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.diagnostic-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.label {
  font-weight: 600;
  color: #555;
}

.value {
  padding: 0.5rem;
  border-radius: 4px;
  font-weight: 500;
}

.status-ok {
  background-color: #d4edda;
  color: #155724;
}

.status-warning {
  background-color: #fff3cd;
  color: #856404;
}

.status-error {
  background-color: #f8d7da;
  color: #721c24;
}

.status-pending {
  background-color: #d1ecf1;
  color: #0c5460;
}

.mt-4 {
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .diagnostics-info {
    grid-template-columns: 1fr;
  }
  
  .soporte-container {
    padding: 1rem;
  }
}
</style> 