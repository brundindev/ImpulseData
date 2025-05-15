<template>
  <div v-if="showBanner" class="cookie-banner">
    <div class="cookie-content">
      <div class="cookie-text">
        <h3>Política de Cookies</h3>
        <p>
          Utilizamos cookies propias y de terceros para mejorar nuestros servicios y mostrarle 
          publicidad relacionada con sus preferencias mediante el análisis de sus hábitos de navegación. 
          Si continúa navegando, consideramos que acepta su uso.
        </p>
      </div>
      
      <div class="cookie-options">
        <div class="cookie-checkboxes">
          <div class="checkbox-item">
            <input 
              id="necessary-cookies" 
              type="checkbox" 
              v-model="cookieOptions.necessary" 
              disabled 
              checked
            />
            <label for="necessary-cookies">Cookies necesarias (obligatorias)</label>
          </div>
          
          <div class="checkbox-item">
            <input 
              id="analytics-cookies" 
              type="checkbox" 
              v-model="cookieOptions.analytics"
            />
            <label for="analytics-cookies">Cookies analíticas</label>
          </div>
          
          <div class="checkbox-item">
            <input 
              id="marketing-cookies" 
              type="checkbox" 
              v-model="cookieOptions.marketing"
            />
            <label for="marketing-cookies">Cookies de marketing</label>
          </div>
        </div>
        
        <div class="cookie-buttons">
          <button @click="rejectAll" class="cookie-button reject">Rechazar todas</button>
          <button @click="acceptSelected" class="cookie-button accept">Aceptar seleccionadas</button>
          <button @click="acceptAll" class="cookie-button accept-all">Aceptar todas</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CookieConsent',
  data() {
    return {
      showBanner: false,
      cookieOptions: {
        necessary: true, // Siempre activado
        analytics: false,
        marketing: false
      }
    };
  },
  created() {
    // Comprobar si ya se han guardado las preferencias
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      // Si no hay consentimiento guardado, mostrar el banner
      this.showBanner = true;
    } else {
      // Si hay consentimiento, cargar las preferencias
      const savedOptions = JSON.parse(cookieConsent);
      this.cookieOptions = {
        ...this.cookieOptions,
        ...savedOptions
      };
      
      // Aplicar las configuraciones de cookies
      this.applyCookieSettings();
    }
  },
  methods: {
    acceptAll() {
      this.cookieOptions = {
        necessary: true,
        analytics: true,
        marketing: true
      };
      this.savePreferences();
    },
    
    acceptSelected() {
      // Las opciones ya están en el estado
      this.savePreferences();
    },
    
    rejectAll() {
      this.cookieOptions = {
        necessary: true, // Siempre necesarias
        analytics: false,
        marketing: false
      };
      this.savePreferences();
    },
    
    savePreferences() {
      // Guardar en localStorage
      localStorage.setItem('cookieConsent', JSON.stringify(this.cookieOptions));
      
      // Enviar a la base de datos
      this.saveToDB();
      
      // Aplicar las configuraciones
      this.applyCookieSettings();
      
      // Ocultar el banner
      this.showBanner = false;
    },
    
    saveToDB() {
      // Si el usuario está autenticado, guardar las preferencias en BD
      const userId = this.getUserId(); // Implementar método para obtener ID del usuario
      
      if (userId) {
        // Hacer una petición al backend
        fetch('/api/cookies/preferences', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            preferences: this.cookieOptions
          }),
        })
        .then(response => response.json())
        .then(data => {
          console.log('Preferencias de cookies guardadas en BD:', data);
        })
        .catch(error => {
          console.error('Error al guardar preferencias de cookies:', error);
        });
      }
    },
    
    getUserId() {
      // Implementar según su sistema de autenticación
      // Por ejemplo, obtener de localStorage, Vuex, etc.
      return localStorage.getItem('userId') || null;
    },
    
    applyCookieSettings() {
      // Aplicar configuraciones según las preferencias guardadas
      
      // Cookies analíticas (Google Analytics)
      if (this.cookieOptions.analytics) {
        this.enableAnalytics();
      } else {
        this.disableAnalytics();
      }
      
      // Cookies de marketing
      if (this.cookieOptions.marketing) {
        this.enableMarketing();
      } else {
        this.disableMarketing();
      }
    },
    
    enableAnalytics() {
      // Activar Google Analytics
      if (window.gtag) {
        window['ga-disable-UA-XXXXX-Y'] = false; // Reemplazar con tu ID de GA
      }
    },
    
    disableAnalytics() {
      // Desactivar Google Analytics
      window['ga-disable-UA-XXXXX-Y'] = true; // Reemplazar con tu ID de GA
      
      // Eliminar cookies de Analytics
      this.deleteCookie('_ga');
      this.deleteCookie('_gat');
      this.deleteCookie('_gid');
    },
    
    enableMarketing() {
      // Activar cookies de marketing (ejemplo)
      // Implementar según tus necesidades
    },
    
    disableMarketing() {
      // Desactivar cookies de marketing
      // Eliminar cookies específicas de marketing
      // Implementar según tus necesidades
    },
    
    deleteCookie(name) {
      document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
  }
};
</script>

<style scoped>
.cookie-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #ffffff;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

.cookie-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.cookie-text {
  margin-bottom: 20px;
}

.cookie-text h3 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #0066CC;
  font-size: 18px;
}

.cookie-text p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #1D1D1F;
}

.cookie-options {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.cookie-checkboxes {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  margin-right: 20px;
}

.checkbox-item input {
  margin-right: 8px;
}

.cookie-buttons {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 10px;
}

.cookie-button {
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  border: none;
  transition: background-color 0.2s, transform 0.2s;
}

.cookie-button:hover {
  transform: translateY(-2px);
}

.reject {
  background-color: #F5F5F7;
  color: #1D1D1F;
}

.reject:hover {
  background-color: #E5E5E7;
}

.accept {
  background-color: #34C759;
  color: white;
}

.accept:hover {
  background-color: #2EB350;
}

.accept-all {
  background-color: #0066CC;
  color: white;
}

.accept-all:hover {
  background-color: #0055AA;
}

@media (min-width: 768px) {
  .cookie-content {
    padding: 30px;
  }
  
  .cookie-options {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  
  .cookie-checkboxes {
    flex: 1;
  }
  
  .cookie-buttons {
    margin-top: 0;
  }
}

@media (max-width: 767px) {
  .cookie-checkboxes {
    flex-direction: column;
  }
  
  .cookie-buttons {
    flex-wrap: wrap;
  }
  
  .cookie-button {
    flex: 1;
    text-align: center;
    min-width: 120px;
  }
}
</style> 