<template>
  <div class="welcome-page">
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
    
    <!-- Efecto de ondas -->
    <div class="wave-background welcome-waves">
      <div class="wave"></div>
      <div class="wave"></div>
      <div class="wave"></div>
    </div>
    
    <!-- Componente de animación de scroll -->
    <ScrollAnimation />
    
    <div class="dashboard-container">
      <!-- Encabezado del dashboard -->
      <div class="dashboard-header">
        <div class="welcome-section">
          <h1 class="welcome-title">Dashboard</h1>
          <p class="welcome-subtitle" v-if="usuario">¡Bienvenido, <span class="user-name">{{ usuario.nombre }}</span>!</p>
        </div>
        <div class="action-buttons">
          <button class="btn-nueva-empresa" @click="showFormModal = true; modoEdicion = false;">
            <a href="#"><span>+ Crear nueva empresa</span></a>
          </button>
        </div>
      </div>
      
      <!-- Banner de Alicante destacado -->
      <div class="alicante-banner-showcase">
        <div class="banner-image-container">
          <img src="@/assets/img/impulsaalicante.png" alt="Impulsa Alicante" class="banner-image" />
        </div>
        <div class="banner-info">
          <h3>Impulsedata - Alicante Futura</h3>
          <p>Plataforma digital de gestión de datos para la innovación y el desarrollo sostenible de Alicante.</p>
        </div>
      </div>
      
      <!-- Contenido principal -->
      <div class="dashboard-content">
        <!-- Panel de estadísticas -->
        <div class="stats-section">
          <div class="stat-card">
            <h3>Empresas</h3>
            <div class="stat-value"><AnimatedNumber :number="empresasCount" /></div>
          </div>
          <div class="stat-card">
            <h3>Departamentos</h3>
            <div class="stat-value"><AnimatedNumber :number="departamentosCount" /></div>
          </div>
          <div class="stat-card">
            <h3>Centros</h3>
            <div class="stat-value"><AnimatedNumber :number="centrosCount" /></div>
          </div>
          <div class="stat-card">
            <h3>Formaciones</h3>
            <div class="stat-value"><AnimatedNumber :number="formacionesCount" /></div>
          </div>
        </div>
        
        <!-- Loader para estados de carga -->
        <div v-if="cargando" class="spinnerContainer">
          <div class="spinner"></div>
          <div class="loader">
            <p>cargando</p>
            <div class="words">
              <span class="word">usuarios</span>
              <span class="word">ImpulseData</span>
              <span class="word">estadísticas</span>
              <span class="word">datos</span>
              <span class="word">usuarios</span>
            </div>
          </div>
        </div>
        
        <!-- Mensaje de error si algo falla -->
        <div v-else-if="error" class="error-container">
          <p>{{ error }}</p>
          <button @click="cargarDatos" class="btn btn-primary">Reintentar</button>
        </div>
        
        <!-- Lista de empresas -->
        <div v-else class="forms-section">
          <h2>Mis empresas</h2>
          
          <div v-if="empresas.length === 0" class="empty-state">
            <p>No tienes empresas registradas todavía.</p>
            <button class="btn btn-secondary" @click="showFormModal = true">Crear</button>
          </div>
          
          <div v-else class="forms-list">
            <div v-for="empresa in empresas" :key="empresa.id" class="form-card">
              <div class="form-info" @click="verEmpresa(empresa)">
                <h3>{{ empresa.nombre }}</h3>
                <p>{{ empresa.descripcion }}</p>
                <div class="form-meta">
                  <span>Ciudad: {{ empresa.ciudad }}</span>
                  <span>Creada: {{ formatDate(empresa.fechaCreacion) }}</span>
                </div>
                <div class="form-stats">
                  <span class="stat-pill">{{ empresa.numDepartamentos }} departamentos</span>
                  <span class="stat-pill">{{ empresa.numCentros }} centros</span>
                  <span class="stat-pill">{{ empresa.numFormaciones }} formaciones</span>
                </div>
              </div>
              <div class="form-actions">
                <button class="button" @click="editarEmpresa(empresa)">Editar</button>
                <button class="button" @click="verEmpresa(empresa)">Ver</button>
                <button class="noselect" @click="confirmarEliminar(empresa)">
                  <span class="text">Eliminar</span>
                  <span class="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                      <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path>
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Botón flotante para crear nueva empresa -->
      <!-- Removido el botón flotante para usar el asistente virtual en su lugar
      <button class="btn-floating" @click="showFormModal = true; modoEdicion = false;">
        <span class="icon">+</span>
      </button>
      -->
      
      <!-- Modal para crear/editar empresa -->
      <teleport to="body">
      <div class="modal-overlay" v-if="showFormModal" @click.self="showFormModal = false">
        <div class="modal-container">
          <div class="modal-header">
            <h2>{{ modoEdicion ? 'Editar empresa' : 'Crear nueva empresa' }}</h2>
            <button class="btn-close" @click="showFormModal = false">×</button>
          </div>
          <div class="modal-body">
            <div v-if="guardando" class="saving-overlay">
                <div class="spinner"></div>
                <div class="loader">
                  <p>cargando</p>
                  <div class="words">
                    <span class="word">usuarios</span>
                    <span class="word">ImpulseData</span>
                    <span class="word">estadísticas</span>
                    <span class="word">datos</span>
                    <span class="word">usuarios</span>
                  </div>
                </div>
            </div>
            <form @submit.prevent="guardarEmpresa">
              <div class="form-group">
                <label for="nombreEmpresa">Nombre de la empresa</label>
                <input 
                  type="text" 
                  id="nombreEmpresa" 
                  v-model="nuevaEmpresa.nombre" 
                  required 
                  placeholder="Ej: Acme Corporation"
                >
              </div>
              
              <div class="form-group">
                <label for="fechaCreacion">Fecha de creación</label>
                <input 
                  type="date" 
                  id="fechaCreacion" 
                  v-model="nuevaEmpresa.fechaCreacion" 
                  required
                >
              </div>
              
              <div class="form-group">
                <label for="descripcionEmpresa">Descripción</label>
                <textarea 
                  id="descripcionEmpresa" 
                  v-model="nuevaEmpresa.descripcion" 
                  rows="3" 
                  placeholder="Describe brevemente la empresa"
                ></textarea>
              </div>
              
              <div class="form-group">
                <label for="ciudadEmpresa">Ciudad</label>
                <input 
                  type="text" 
                  id="ciudadEmpresa" 
                  v-model="nuevaEmpresa.ciudad" 
                  required 
                  placeholder="Ej: Alicante"
                >
              </div>
              
              <h3 class="section-title">Departamentos</h3>
              <div class="questions-container">
                <div v-for="(departamento, index) in nuevaEmpresa.departamentos" :key="index" class="question-item">
                  <div class="question-header">
                    <h4>Departamento {{ index + 1 }}</h4>
                    <button 
                      type="button" 
                      class="btn-icon btn-delete-small" 
                      @click="eliminarDepartamento(index)"
                      v-if="nuevaEmpresa.departamentos.length > 1"
                    >×</button>
                  </div>
                  
                  <div class="form-group">
                    <label :for="'nombreDep'+index">Nombre del departamento</label>
                    <input 
                      type="text" 
                      :id="'nombreDep'+index" 
                      v-model="departamento.nombre" 
                      required 
                      placeholder="Ej: Empleo y Formación"
                    >
                  </div>
                </div>
              </div>
              <button type="button" class="btn btn-secondary" @click="agregarDepartamento">
                + Añadir departamento
              </button>
              
              <h3 class="section-title">Centros</h3>
              <div class="questions-container">
                <div v-for="(centro, index) in nuevaEmpresa.centros" :key="index" class="question-item">
                  <div class="question-header">
                    <h4>Centro {{ index + 1 }}</h4>
                    <button 
                      type="button" 
                      class="btn-icon btn-delete-small" 
                      @click="eliminarCentro(index)"
                      v-if="nuevaEmpresa.centros.length > 1"
                    >×</button>
                  </div>
                  
                  <div class="form-group">
                    <label :for="'nombreCentro'+index">Nombre del centro</label>
                    <input 
                      type="text" 
                      :id="'nombreCentro'+index" 
                      v-model="centro.nombre" 
                      required 
                      placeholder="Ej: Sede Principal"
                    >
                  </div>
                  
                  <div class="form-group">
                    <label :for="'direccionCentro'+index">Dirección</label>
                    <input 
                      type="text" 
                      :id="'direccionCentro'+index" 
                      v-model="centro.direccion" 
                      required 
                      placeholder="Ej: Calle Principal 123"
                    >
                  </div>
                </div>
              </div>
              <button type="button" class="btn btn-secondary" @click="agregarCentro">
                + Añadir centro
              </button>
              
              <h3 class="section-title">Formaciones</h3>
              <div class="questions-container">
                <div v-for="(formacion, index) in nuevaEmpresa.formaciones" :key="index" class="question-item">
                  <div class="question-header">
                    <h4>Formación {{ index + 1 }}</h4>
                    <button 
                      type="button" 
                      class="btn-icon btn-delete-small" 
                      @click="eliminarFormacion(index)"
                      v-if="nuevaEmpresa.formaciones.length > 1"
                    >×</button>
                  </div>
                  
                  <div class="form-group">
                    <label :for="'nombreFormacion'+index">Nombre de la formación</label>
                    <input 
                      type="text" 
                      :id="'nombreFormacion'+index" 
                      v-model="formacion.nombre" 
                      required 
                      placeholder="Ej: LABORA"
                    >
                  </div>
                  
                  <div class="form-group">
                    <label :for="'tipoFormacion'+index">Tipo de formación</label>
                    <select :id="'tipoFormacion'+index" v-model="formacion.tipo" required>
                      <option value="presencial">Presencial</option>
                      <option value="virtual">Virtual</option>
                      <option value="hibrida">Híbrida</option>
                    </select>
                  </div>
                  
                  <div class="form-group">
                    <label :for="'duracionFormacion'+index">Duración (horas)</label>
                    <input 
                      type="number" 
                      :id="'duracionFormacion'+index" 
                      v-model="formacion.duracion" 
                      required 
                      min="1"
                    >
                  </div>
                </div>
              </div>
              <button type="button" class="btn btn-secondary" @click="agregarFormacion">
                + Añadir formación
              </button>
              
              <div class="form-actions modal-actions">
                <button type="button" class="button-cancel" @click="showFormModal = false">Cancelar</button>
                <button type="submit" class="btn btn-save" :disabled="guardando">Guardar empresa</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      </teleport>
      
      <!-- Modal de confirmación para eliminar -->
      <teleport to="body">
      <div class="modal-overlay" v-if="mostrarConfirmacion" @click.self="mostrarConfirmacion = false">
        <div class="modal-container modal-small">
          <div class="modal-header">
            <h2>Confirmar eliminación</h2>
            <button class="btn-close" @click="mostrarConfirmacion = false">×</button>
          </div>
          <div class="modal-body">
            <p>¿Estás seguro de que deseas eliminar la empresa <strong>{{ empresaAEliminar?.nombre }}</strong>?</p>
            <p class="warning-text">Esta acción no se puede deshacer y eliminará todos los departamentos, centros y formaciones asociados.</p>
            
            <div class="form-actions modal-actions">
              <button type="button" class="button-cancel" @click="mostrarConfirmacion = false">Cancelar</button>
              <button type="button" class="noselect" @click="eliminarEmpresa" :disabled="eliminando">
                <span class="text">{{ eliminando ? 'Eliminando...' : 'Eliminar' }}</span>
                <span class="icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path>
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
      </teleport>
      
      <!-- Modal para ver detalles de empresa -->
      <teleport to="body">
      <div class="modal-overlay" v-if="showViewModal" @click.self="showViewModal = false">
        <div class="modal-container">
          <div class="modal-header">
            <h2>Detalles de empresa</h2>
            <button class="btn-close" @click="showViewModal = false">×</button>
          </div>
          <div class="modal-body">
            <div v-if="cargando" class="saving-overlay">
                <div class="spinner"></div>
                <div class="loader">
                  <p>cargando</p>
                  <div class="words">
                    <span class="word">usuarios</span>
                    <span class="word">ImpulseData</span>
                    <span class="word">estadísticas</span>
                    <span class="word">datos</span>
                    <span class="word">usuarios</span>
                  </div>
                </div>
            </div>
            <div class="view-content">
              <div class="form-group">
                <label>Nombre de la empresa</label>
                <div class="view-field">{{ empresaActual.nombre }}</div>
              </div>
              
              <div class="form-group">
                <label>Fecha de creación</label>
                <div class="view-field">{{ formatDate(empresaActual.fechaCreacion) }}</div>
              </div>
              
              <div class="form-group">
                <label>Descripción</label>
                <div class="view-field description">{{ empresaActual.descripcion || 'Sin descripción' }}</div>
              </div>
              
              <div class="form-group">
                <label>Ciudad</label>
                <div class="view-field">{{ empresaActual.ciudad || 'No especificada' }}</div>
              </div>
              
              <h3 class="section-title">Departamentos</h3>
              <div class="view-list">
                <div v-if="!empresaActual.departamentos || empresaActual.departamentos.length === 0" class="empty-message">
                  No hay departamentos registrados.
                </div>
                <div v-for="(departamento, index) in empresaActual.departamentos" :key="index" class="view-item">
                  <div class="view-item-title">Departamento {{ index + 1 }}</div>
                  <div class="view-item-content">{{ departamento.nombre }}</div>
                </div>
              </div>
              
              <h3 class="section-title">Centros</h3>
              <div class="view-list">
                <div v-if="!empresaActual.centros || empresaActual.centros.length === 0" class="empty-message">
                  No hay centros registrados.
                </div>
                <div v-for="(centro, index) in empresaActual.centros" :key="index" class="view-item">
                  <div class="view-item-title">Centro {{ index + 1 }}</div>
                  <div class="view-item-content">
                    <div><strong>Nombre:</strong> {{ centro.nombre }}</div>
                    <div><strong>Dirección:</strong> {{ centro.direccion || 'No especificada' }}</div>
                  </div>
                </div>
              </div>
              
              <h3 class="section-title">Formaciones</h3>
              <div class="view-list">
                <div v-if="!empresaActual.formaciones || empresaActual.formaciones.length === 0" class="empty-message">
                  No hay formaciones registradas.
                </div>
                <div v-for="(formacion, index) in empresaActual.formaciones" :key="index" class="view-item">
                  <div class="view-item-title">Formación {{ index + 1 }}</div>
                  <div class="view-item-content">
                    <div><strong>Nombre:</strong> {{ formacion.nombre }}</div>
                    <div><strong>Tipo:</strong> {{ formatTipoFormacion(formacion.tipo) }}</div>
                    <div><strong>Duración:</strong> {{ formacion.duracion }} horas</div>
                  </div>
                </div>
              </div>
              
              <div class="form-actions modal-actions">
                <button type="button" class="button-cancel" @click="showViewModal = false">Cancelar</button>
                <button type="button" class="button" @click="editarEmpresaDesdeVista()">
                  Editar
                </button>
                <button type="button" class="buttonDownload" @click="previsualizarPDF()">
                  Descargar PDF
                </button>
                  <button type="button" class="buttonDownload word-btn" @click="descargarWord()">
                    Descargar Word
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      </teleport>
    </div>
    
    <!-- Footer -->
    <footer class="app-footer" style="position: relative; z-index: 10;">
      <div class="footer-difuminado" style="position: absolute; top: -150px; left: 0; right: 0; height: 150px; background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.3) 40%, rgba(0, 0, 0, 0.6) 70%, rgba(0, 0, 0, 0.85) 100%); z-index: -1; pointer-events: none;"></div>
      <div class="footer-container">
        <div class="footer-column logo-column">
          <img src="@/assets/img/impulsedata_logo.png" alt="ImpulseData Logo" class="footer-logo" />
          <h3>ImpulseData</h3>
          <p>✨ Transformando datos en conocimiento, donde la excelencia se hace realidad.</p>
        </div>
        
        <div class="footer-column links-column">
          <h4>Enlaces</h4>
          <ul>
            <li><a href="/home">Inicio</a></li>
            <li><a href="/perfil">Mi Perfil</a></li>
            <li><a href="/panel-control">Panel de Control</a></li>
          </ul>
        </div>
        
        <div class="footer-column contact-column">
          <h4>Contacto</h4>
          <p><i class="location-icon">📍</i> Plaza del Ayuntamiento, Alicante</p>
          <p><i class="phone-icon">📞</i> +34 965 123 456</p>
          <p><i class="email-icon">✉️</i> info@impulsedata.es</p>
        </div>
        
        <div class="footer-column social-column">
          <h4>Síguenos</h4>
          <div class="social-icons">
            <a href="https://www.facebook.com/impulsedata" target="_blank" class="social-icon">
              <svg viewBox="0 0 24 24" class="facebook-icon">
                <path d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z"></path>
              </svg>
            </a>
            <a href="https://twitter.com/impulsedata" target="_blank" class="social-icon">
              <svg viewBox="0 0 24 24" class="twitter-icon">
                <path d="M22.162 5.65593C21.3986 5.99362 20.589 6.2154 19.76 6.31393C20.6337 5.79136 21.2877 4.96894 21.6 3.99993C20.78 4.48793 19.881 4.82993 18.944 5.01493C18.3146 4.34151 17.4804 3.89489 16.5709 3.74451C15.6615 3.59413 14.7279 3.74842 13.9153 4.18338C13.1026 4.61834 12.4564 5.30961 12.0771 6.14972C11.6978 6.98983 11.6067 7.93171 11.818 8.82893C10.1551 8.74558 8.52832 8.31345 7.04328 7.56059C5.55823 6.80773 4.24812 5.75097 3.198 4.45893C2.82629 5.09738 2.63095 5.82315 2.631 6.56193C2.631 8.01193 3.37 9.29293 4.492 10.0429C3.82801 10.022 3.17863 9.84271 2.598 9.51993V9.57193C2.5982 10.5376 2.93237 11.4735 3.54385 12.221C4.15533 12.9684 5.00647 13.4814 5.953 13.6729C5.33661 13.84 4.69031 13.8646 4.063 13.7449C4.32987 14.5762 4.85001 15.3031 5.55059 15.824C6.25118 16.345 7.09712 16.6337 7.97 16.6499C7.10249 17.3313 6.10917 17.8349 5.04680 18.1321C3.98442 18.4293 2.87412 18.5142 1.779 18.3819C3.6907 19.6114 5.91599 20.264 8.189 20.2619C15.882 20.2619 20.089 13.889 20.089 8.36193C20.089 8.18193 20.084 7.99993 20.076 7.82193C20.8949 7.2301 21.6016 6.49695 22.163 5.65693L22.162 5.65593Z"></path>
              </svg>
            </a>
            <a href="https://www.instagram.com/impulsedata/" target="_blank" class="social-icon">
              <svg viewBox="0 0 24 24" class="instagram-icon">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
              </svg>
            </a>
            <a href="https://www.linkedin.com/company/impulsedata" target="_blank" class="social-icon">
              <svg viewBox="0 0 24 24" class="linkedin-icon">
                <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; 2025 ImpulseData - Alicante Futura. Todos los derechos reservados.</p>
        <div class="footer-bottom-links">
          <a href="#">Políticas de Privacidad</a>
          <a href="#">Términos de Servicio</a>
          <a href="#">Mapa del Sitio</a>
        </div>
      </div>
    </footer>
  </div>
  
  <!-- Modal para previsualizar PDF -->
  <PDFPreviewModal 
    v-if="showPDFPreview" 
    :show="showPDFPreview" 
    :pdfUrl="pdfPreviewUrl" 
    @close="cerrarPreviewPDF" 
    @download="descargarPDF"
  />
</template>

<script setup>
import { ref, onMounted, reactive, computed, watch, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import AuthService from '../services/AuthService';
import FirestoreService from '../services/FirestoreService';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import FirebaseAuthService from '../services/FirebaseAuthService';
import axios from 'axios';
import AnimatedNumber from '../components/AnimatedNumber.vue';
import ScrollAnimation from '../components/ScrollAnimation.vue';
import PDFPreviewModal from '../components/PDFPreviewModal.vue';
// Importar PDFService
import PDFService from '../services/PDFService';
// Importar el logo e imágenes
import logoUrl from '../assets/img/impulsedata_logo.png';
import impulsaAlicanteLogo from '../assets/img/impulsaalicante.png';
import ayuntamientoLogo from '../assets/img/ayuntamiento-alicante.jpg';

const router = useRouter();
const auth = getAuth();
const usuario = ref(null);
const showFormModal = ref(false);
const showViewModal = ref(false);
const empresasCount = ref(0);
const departamentosCount = ref(0);
const centrosCount = ref(0);
const formacionesCount = ref(0);
const cargando = ref(true);
const guardando = ref(false);
const error = ref(null);
const mostrarConfirmacion = ref(false);
const empresaAEliminar = ref(null);
const eliminando = ref(false);
const modoEdicion = ref(false);
const empresaEditandoId = ref(null);
const empresaActual = reactive({
  id: '',
  nombre: '',
  fechaCreacion: '',
  descripcion: '',
  ciudad: '',
  departamentos: [],
  centros: [],
  formaciones: []
});

// Lista de empresas
const empresas = ref([]);

// Datos para nueva empresa
const nuevaEmpresa = reactive({
  nombre: '',
  fechaCreacion: '',
  descripcion: '',
  ciudad: '',
  departamentos: [
    {
      nombre: ''
    }
  ],
  centros: [
    {
      nombre: '',
      direccion: ''
    }
  ],
  formaciones: [
    {
      nombre: '',
      tipo: 'presencial',
      duracion: 8
    }
  ]
});

onMounted(() => {
  // Verificar estado de autenticación
  onAuthStateChanged(auth, (user) => {
    if (user) {
      usuario.value = AuthService.getCurrentUser();
      cargarDatos();
    } else {
      // Si no hay usuario, redirigir al login
      router.push('/login');
    }
  });
  
  // Añadir evento para escuchar cuando el chatbot quiere abrir el modal de empresa
  window.addEventListener('abrir-modal-empresa', abrirModalEmpresa);
});

// Función para abrir el modal de creación de empresa
const abrirModalEmpresa = () => {
  showFormModal.value = true;
  modoEdicion.value = false;
};

// Limpieza del evento al desmontar el componente
onUnmounted(() => {
  window.removeEventListener('abrir-modal-empresa', abrirModalEmpresa);
});

// Cargar datos desde Firestore
const cargarDatos = async () => {
  try {
    cargando.value = true;
    error.value = null;
    
    // Limpiar datos previos para evitar mostrar datos de otro usuario
    empresas.value = [];
    
    // Verificar doble autenticación (Firebase y JWT)
    const user = auth.currentUser;
    const jwtToken = localStorage.getItem('authToken');
    const userData = AuthService.getCurrentUser();
    
    // Si hay JWT pero no hay usuario Firebase, intentar iniciar sesión con Firebase
    if (!user && jwtToken && userData) {
      console.warn("HomeView - Hay JWT pero no hay sesión en Firebase. Intentando recuperar sesión...");
      
      try {
        // Intentar iniciar sesión silenciosamente usando credenciales guardadas
        // Esto es solo para sincronizar Firebase, no para mostrar UI
        await FirebaseAuthService.reautenticar();
        
        // Verificar si ahora tenemos usuario Firebase
        const userAfterReauth = auth.currentUser;
        
        if (userAfterReauth) {
          // Intentar cargar datos otra vez
          setTimeout(() => cargarDatos(), 500);
          return;
        }
      } catch (error) {
        console.error("Error al recuperar sesión Firebase:", error);
      }
    }
    
    // Si no hay usuario o token, mostrar error
    if (!user || !jwtToken) {
      console.error("HomeView - Autenticación incompleta:", 
                    "Firebase:", user ? "Sí" : "No", 
                    "JWT:", jwtToken ? "Sí" : "No");
      
      error.value = 'No se pudo verificar tu autenticación. Por favor, inicia sesión de nuevo.';
      cargando.value = false;
      
      // Esperar un momento antes de redirigir
      setTimeout(() => {
        router.push('/login');
      }, 2000);
      
      return;
    }
    
    // Obtener contadores
    const contadores = await FirestoreService.obtenerContadores();
    empresasCount.value = parseInt(contadores.empresasCount) || 0;
    departamentosCount.value = parseInt(contadores.departamentosCount) || 0;
    centrosCount.value = parseInt(contadores.centrosCount) || 0;
    formacionesCount.value = parseInt(contadores.formacionesCount) || 0;
    
    // Obtener empresas
    const empresasRecibidas = await FirestoreService.obtenerEmpresas();
    
    // Triple verificación: solo mostrar empresas del usuario actual
    empresas.value = empresasRecibidas.filter(empresa => {
      const perteneceAlUsuario = empresa.creadoPor === user.uid;
      if (!perteneceAlUsuario) {
        console.error(`⚠️ ALERTA DE SEGURIDAD: Se detectó empresa que no pertenece al usuario actual: ${empresa.nombre}`);
      }
      return perteneceAlUsuario;
    });
    
  } catch (err) {
    console.error("Error al cargar datos en HomeView:", err);
    error.value = 'No se pudieron cargar los datos. Por favor, inténtalo de nuevo.';
  } finally {
    cargando.value = false;
  }
};

// Formatear fecha
const formatDate = (date) => {
  if (!date) return 'N/A';
  
  // Si date es un string ISO, convertirlo a objeto Date
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Funciones para manejar los departamentos
const agregarDepartamento = () => {
  nuevaEmpresa.departamentos.push({
    nombre: ''
  });
};

const eliminarDepartamento = (index) => {
  nuevaEmpresa.departamentos.splice(index, 1);
};

// Funciones para manejar los centros
const agregarCentro = () => {
  nuevaEmpresa.centros.push({
    nombre: '',
    direccion: ''
  });
};

const eliminarCentro = (index) => {
  nuevaEmpresa.centros.splice(index, 1);
};

// Funciones para manejar las formaciones
const agregarFormacion = () => {
  nuevaEmpresa.formaciones.push({
    nombre: '',
    tipo: 'presencial',
    duracion: 8
  });
};

const eliminarFormacion = (index) => {
  nuevaEmpresa.formaciones.splice(index, 1);
};

// Guardar empresa en Firestore
const guardarEmpresa = async () => {
  try {
    guardando.value = true;
    
    if (modoEdicion.value && empresaEditandoId.value) {
      // Actualizar empresa existente
      await actualizarEmpresaExistente();
    } else {
      // Crear nueva empresa
      await FirestoreService.guardarEmpresa(nuevaEmpresa);
    }
    
    // Recargar datos
    await cargarDatos();
    
    // Cerrar el modal y limpiar el formulario
    showFormModal.value = false;
    resetearFormulario();
    
    // Mostrar mensaje de éxito
    // Aquí se podría añadir un toast o notificación
    
  } catch (err) {
    console.error('Error al guardar empresa:', err);
    error.value = modoEdicion.value ? 
      'No se pudo actualizar la empresa. Por favor, inténtalo de nuevo.' : 
      'No se pudo guardar la empresa. Por favor, inténtalo de nuevo.';
  } finally {
    guardando.value = false;
  }
};

// Actualizar empresa existente
const actualizarEmpresaExistente = async () => {
  try {
    // Implementar la lógica para actualizar la empresa
    // Por ahora, una versión simple para actualizar solo los datos principales
    // En una implementación completa, se debería manejar también las subcolecciones
    
    const empresaData = {
      id: empresaEditandoId.value,
      nombre: nuevaEmpresa.nombre,
      descripcion: nuevaEmpresa.descripcion || "",
      fechaCreacion: nuevaEmpresa.fechaCreacion,
      ciudad: nuevaEmpresa.ciudad || "",
      fechaActualizacion: new Date().toISOString()
    };
    
    
    // Actualizar empresa principal
    await FirestoreService.actualizarEmpresa(empresaEditandoId.value, empresaData);
    
    // Actualizar subcolecciones
    await FirestoreService.actualizarSubcolecciones(
      empresaEditandoId.value,
      nuevaEmpresa.departamentos,
      nuevaEmpresa.centros,
      nuevaEmpresa.formaciones
    );
    
    modoEdicion.value = false;
    empresaEditandoId.value = null;
    
    return true;
  } catch (error) {
    console.error("Error al actualizar empresa:", error);
    throw error;
  }
};

// Editar empresa
const editarEmpresa = (empresa) => {
  modoEdicion.value = true;
  empresaEditandoId.value = empresa.id;
  
  // Cargar datos de la empresa en el formulario
  nuevaEmpresa.nombre = empresa.nombre || '';
  nuevaEmpresa.fechaCreacion = empresa.fechaCreacion || '';
  nuevaEmpresa.descripcion = empresa.descripcion || '';
  nuevaEmpresa.ciudad = empresa.ciudad || '';
  
  // Cargar departamentos, centros y formaciones
  cargarSubcolecciones(empresa.id);
  
  // Mostrar el modal
  showFormModal.value = true;
};

// Cargar subcolecciones para edición
const cargarSubcolecciones = async (empresaId) => {
  try {
    // Cargar departamentos
    const departamentos = await FirestoreService.obtenerDepartamentos(empresaId);
    if (departamentos && departamentos.length > 0) {
      nuevaEmpresa.departamentos = departamentos;
    } else {
      nuevaEmpresa.departamentos = [{ nombre: '' }];
    }
    
    // Cargar centros
    const centros = await FirestoreService.obtenerCentros(empresaId);
    if (centros && centros.length > 0) {
      nuevaEmpresa.centros = centros;
    } else {
      nuevaEmpresa.centros = [{ nombre: '', direccion: '' }];
    }
    
    // Cargar formaciones
    const formaciones = await FirestoreService.obtenerFormaciones(empresaId);
    if (formaciones && formaciones.length > 0) {
      nuevaEmpresa.formaciones = formaciones;
    } else {
      nuevaEmpresa.formaciones = [{ nombre: '', tipo: 'presencial', duracion: 8 }];
    }
  } catch (error) {
    console.error("Error al cargar subcolecciones:", error);
    error.value = "No se pudieron cargar los datos para edición. Por favor, inténtalo de nuevo.";
  }
};

// Resetear formulario
const resetearFormulario = () => {
  nuevaEmpresa.nombre = '';
  nuevaEmpresa.fechaCreacion = '';
  nuevaEmpresa.descripcion = '';
  nuevaEmpresa.ciudad = '';
  nuevaEmpresa.departamentos = [{
    nombre: ''
  }];
  nuevaEmpresa.centros = [{
    nombre: '',
    direccion: ''
  }];
  nuevaEmpresa.formaciones = [{
    nombre: '',
    tipo: 'presencial',
    duracion: 8
  }];
};

// Confirmar eliminación
const confirmarEliminar = (empresa) => {
  empresaAEliminar.value = empresa;
  mostrarConfirmacion.value = true;
};

// Eliminar empresa
const eliminarEmpresa = async () => {
  if (!empresaAEliminar.value) return;
  
  try {
    eliminando.value = true;
    
    // Eliminar la empresa y todas sus relaciones
    await FirestoreService.eliminarEmpresa(empresaAEliminar.value.id);
    
    // Recargar datos
    await cargarDatos();
    
    // Cerrar modal de confirmación
    mostrarConfirmacion.value = false;
    empresaAEliminar.value = null;
    
    // Mostrar mensaje de éxito
    // Aquí se podría añadir un toast o notificación
    
  } catch (err) {
    console.error('Error al eliminar empresa:', err);
    error.value = 'No se pudo eliminar la empresa. Por favor, inténtalo de nuevo.';
  } finally {
    eliminando.value = false;
  }
};

// Logout function modificada para limpiar todos los datos
const logout = () => {
  // Limpiar todos los datos locales
  empresas.value = [];
  empresasCount.value = 0;
  departamentosCount.value = 0;
  centrosCount.value = 0;
  formacionesCount.value = 0;
  
  // Restablecer formularios y estados
  resetearFormulario();
  showFormModal.value = false;
  showViewModal.value = false;
  
  // Llamamos al método logout de AuthService
  AuthService.logout();
  
  // Limpiamos cualquier estado de la aplicación
  usuario.value = null;
  
  // Eliminamos cualquier otro dato de la sesión 
  localStorage.clear();
  sessionStorage.clear();
  
  // Disparar evento para actualizar la navegación
  window.dispatchEvent(new CustomEvent('auth-state-changed'));
  
  // Forzamos la redirección
  router.push('/login');
};

// Ver detalles de empresa
const verEmpresa = async (empresa) => {
  // Limpiar datos previos
  Object.keys(empresaActual).forEach(key => {
    if (Array.isArray(empresaActual[key])) {
      empresaActual[key] = [];
    } else {
      empresaActual[key] = '';
    }
  });
  
  // Cargar datos básicos de la empresa
  empresaActual.id = empresa.id;
  empresaActual.nombre = empresa.nombre || '';
  empresaActual.fechaCreacion = empresa.fechaCreacion || '';
  empresaActual.descripcion = empresa.descripcion || '';
  empresaActual.ciudad = empresa.ciudad || '';
  
  // Mostrar el modal y cargar subcolecciones
  showViewModal.value = true;
  cargando.value = true;
  
  try {
    // Cargar subcolecciones
    await cargarSubcoleccionesParaVista(empresa.id);
  } catch (error) {
    console.error("Error al cargar datos para vista:", error);
  } finally {
    cargando.value = false;
  }
};

// Cargar subcolecciones para la vista de detalles
const cargarSubcoleccionesParaVista = async (empresaId) => {
  try {
    // Cargar departamentos
    const departamentos = await FirestoreService.obtenerDepartamentos(empresaId);
    empresaActual.departamentos = departamentos || [];
    
    // Cargar centros
    const centros = await FirestoreService.obtenerCentros(empresaId);
    empresaActual.centros = centros || [];
    
    // Cargar formaciones
    const formaciones = await FirestoreService.obtenerFormaciones(empresaId);
    empresaActual.formaciones = formaciones || [];
  } catch (error) {
    console.error("Error al cargar subcolecciones para vista:", error);
    throw error;
  }
};

// Editar desde la vista de detalles
const editarEmpresaDesdeVista = () => {
  // Cerrar modal de vista
  showViewModal.value = false;
  
  // Buscar la empresa completa en la lista
  const empresa = empresas.value.find(e => e.id === empresaActual.id);
  if (empresa) {
    // Abrir modal de edición con los datos de la empresa
    editarEmpresa(empresa);
  } else {
    console.error("No se encontró la empresa para editar");
  }
};

// Formatear tipo de formación
const formatTipoFormacion = (tipo) => {
  if (!tipo) return 'No especificado';
  
  const tiposFormateados = {
    'presencial': 'Presencial',
    'virtual': 'Virtual',
    'hibrida': 'Híbrida'
  };
  
  return tiposFormateados[tipo.toLowerCase()] || tipo;
};

// Función para crear una portada para cada sección
const crearPortadaSeccion = (texto, doc) => {
  // Añadir nueva página para portada
  doc.addPage();
  
  // Fondo decorativo para toda la página
  doc.setFillColor(240, 245, 255);
  doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');
  
  // Borde decorativo
  doc.setDrawColor(0, 70, 152);
  doc.setLineWidth(1.5);
  doc.rect(20, 20, doc.internal.pageSize.width - 40, doc.internal.pageSize.height - 40, 'S');
  
  // Marco interior
  doc.setDrawColor(0, 100, 200);
  doc.setLineWidth(0.5);
  doc.rect(30, 30, doc.internal.pageSize.width - 60, doc.internal.pageSize.height - 60, 'S');
  
  // Líneas decorativas en las esquinas
  doc.setDrawColor(0, 70, 152);
  doc.setLineWidth(2);
  // Esquina superior izquierda
  doc.line(20, 35, 50, 35);
  doc.line(35, 20, 35, 50);
  // Esquina superior derecha
  doc.line(doc.internal.pageSize.width - 50, 35, doc.internal.pageSize.width - 20, 35);
  doc.line(doc.internal.pageSize.width - 35, 20, doc.internal.pageSize.width - 35, 50);
  // Esquina inferior izquierda
  doc.line(20, doc.internal.pageSize.height - 35, 50, doc.internal.pageSize.height - 35);
  doc.line(35, doc.internal.pageSize.height - 50, 35, doc.internal.pageSize.height - 20);
  // Esquina inferior derecha
  doc.line(doc.internal.pageSize.width - 50, doc.internal.pageSize.height - 35, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 35);
  doc.line(doc.internal.pageSize.width - 35, doc.internal.pageSize.height - 50, doc.internal.pageSize.width - 35, doc.internal.pageSize.height - 20);
  
  // Logo o imagen (dibujamos un círculo para representar un logo)
  doc.setFillColor(0, 70, 152);
  doc.circle(doc.internal.pageSize.width / 2, 70, 20, 'F');
  
  // Título grande y centrado
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 70, 152);
  doc.setFontSize(28);
  const titleWidth = doc.getStringUnitWidth(texto) * doc.getFontSize() / doc.internal.scaleFactor;
  const titleX = (doc.internal.pageSize.width - titleWidth) / 2;
  doc.text(texto, titleX, 120);
  
  // Línea decorativa bajo el título
  doc.setLineWidth(1);
  doc.line(doc.internal.pageSize.width / 2 - 50, 130, doc.internal.pageSize.width / 2 + 50, 130);
  
  // Subtítulo o descripción
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(14);
  doc.setTextColor(100, 100, 100);
  const subtitulo = `Informe detallado de ${empresaActual.nombre}`;
  const subtitleWidth = doc.getStringUnitWidth(subtitulo) * doc.getFontSize() / doc.internal.scaleFactor;
  const subtitleX = (doc.internal.pageSize.width - subtitleWidth) / 2;
  doc.text(subtitulo, subtitleX, 150);
  
  // Fecha del informe
  const fechaGeneracion = new Date().toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  doc.setFontSize(12);
  const fechaWidth = doc.getStringUnitWidth(fechaGeneracion) * doc.getFontSize() / doc.internal.scaleFactor;
  const fechaX = (doc.internal.pageSize.width - fechaWidth) / 2;
  doc.text(fechaGeneracion, fechaX, 170);
  
  // Añadir paginación al pie de página
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('ImpulseData - Alicante Futura', doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 20, { align: 'center' });
  
  // Añadir una nueva página para comenzar la sección
  doc.addPage();
  
  return 20; // Retorna la posición Y inicial para comenzar la sección
};

// Función para generar el contenido del PDF
const generarContenidoPDF = (doc) => {
  // Portada principal
  doc.setFillColor(240, 245, 255);
  doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');
  
  // Borde decorativo
  doc.setDrawColor(0, 70, 152);
  doc.setLineWidth(1.5);
  doc.rect(15, 15, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 30, 'S');
  
  // Logos en la portada
  try {
    // Logo ImpulseData
    doc.addImage(logoUrl, 'PNG', doc.internal.pageSize.width / 2 - 30, 40, 60, 30);
    
    // Logo Alicante Futura
    doc.addImage(impulsaAlicanteLogo, 'PNG', doc.internal.pageSize.width / 2 - 40, 80, 80, 30);
    
    // Logo Ayuntamiento
    doc.addImage(ayuntamientoLogo, 'JPG', doc.internal.pageSize.width / 2 - 25, 120, 50, 30);
  } catch (error) {
    console.error("Error al cargar imágenes:", error);
    // Si falla la carga de imágenes, dibujamos placeholders
    doc.setFillColor(0, 70, 152);
    doc.circle(doc.internal.pageSize.width / 2, 60, 15, 'F');
    doc.circle(doc.internal.pageSize.width / 2, 95, 15, 'F');
    doc.circle(doc.internal.pageSize.width / 2, 130, 15, 'F');
  }
  
  // Título principal
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 70, 152);
  doc.setFontSize(22);
  doc.text('INFORME EMPRESARIAL', doc.internal.pageSize.width / 2, 170, { align: 'center' });
  
  // Subtítulo
  doc.setFont('helvetica', 'normal');
      doc.setFontSize(16);
  doc.text(empresaActual.nombre, doc.internal.pageSize.width / 2, 185, { align: 'center' });
  
  // Fecha de generación
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
      doc.text(
    `Generado el ${new Date().toLocaleDateString('es-ES', {day: '2-digit', month: 'long', year: 'numeric'})}`, 
    doc.internal.pageSize.width / 2, 
    doc.internal.pageSize.height - 20, 
    { align: 'center' }
  );
  
  // Sección de información general
  let yPos = crearPortadaSeccion('Información General', doc);
  
  // Datos de la empresa
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text('Nombre de la empresa:', 20, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(empresaActual.nombre, 120, yPos);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Fecha de creación:', 20, yPos + 10);
  doc.setFont('helvetica', 'normal');
  doc.text(formatDate(empresaActual.fechaCreacion), 120, yPos + 10);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Ciudad:', 20, yPos + 20);
  doc.setFont('helvetica', 'normal');
  doc.text(empresaActual.ciudad || 'No especificada', 120, yPos + 20);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Descripción:', 20, yPos + 30);
  doc.setFont('helvetica', 'normal');
  
  // Manejo de texto largo en descripción
  const descripcion = empresaActual.descripcion || 'Sin descripción';
  const textLines = doc.splitTextToSize(descripcion, 150);
  doc.text(textLines, 120, yPos + 30);
  
  // Sección de departamentos
  yPos = crearPortadaSeccion('Departamentos', doc);
  
  if (empresaActual.departamentos && empresaActual.departamentos.length > 0) {
    // Crear tabla de departamentos
    const departamentosData = empresaActual.departamentos.map((dep, index) => {
      return [index + 1, dep.nombre];
    });
    
    autoTable(doc, {
      startY: yPos,
      head: [['#', 'Nombre del Departamento']],
      body: departamentosData,
      theme: 'grid',
    headStyles: { 
      fillColor: [0, 70, 152],
        textColor: [255, 255, 255]
      }
    });
  } else {
    doc.text('No hay departamentos registrados.', 20, yPos);
  }
  
  // Sección de centros
  yPos = crearPortadaSeccion('Centros', doc);
  
  if (empresaActual.centros && empresaActual.centros.length > 0) {
    // Crear tabla de centros
    const centrosData = empresaActual.centros.map((centro, index) => {
      return [index + 1, centro.nombre, centro.direccion || 'No especificada'];
    });
    
    autoTable(doc, {
      startY: yPos,
      head: [['#', 'Nombre del Centro', 'Dirección']],
      body: centrosData,
      theme: 'grid',
      headStyles: {
        fillColor: [0, 70, 152],
        textColor: [255, 255, 255]
      }
    });
  } else {
    doc.text('No hay centros registrados.', 20, yPos);
  }
  
  // Sección de formaciones
  yPos = crearPortadaSeccion('Formaciones', doc);
  
  if (empresaActual.formaciones && empresaActual.formaciones.length > 0) {
    // Crear tabla de formaciones
    const formacionesData = empresaActual.formaciones.map((formacion, index) => {
      return [
        index + 1, 
        formacion.nombre, 
        formatTipoFormacion(formacion.tipo), 
        `${formacion.duracion} horas`
      ];
    });
    
    autoTable(doc, {
      startY: yPos,
      head: [['#', 'Nombre de la Formación', 'Tipo', 'Duración']],
      body: formacionesData,
      theme: 'grid',
      headStyles: {
        fillColor: [0, 70, 152],
        textColor: [255, 255, 255]
      }
    });
    
    // Añadir gráficos o estadísticas adicionales
    const tiposCounts = {
      presencial: 0,
      virtual: 0,
      hibrida: 0
    };
    
    empresaActual.formaciones.forEach(formacion => {
      if (tiposCounts[formacion.tipo] !== undefined) {
        tiposCounts[formacion.tipo]++;
      }
    });
    
    // Crear tabla resumen por tipo
    doc.addPage();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Resumen por tipo de formación', 20, 20);
    
    const tiposData = Object.entries(tiposCounts).map(([tipo, count]) => {
      return [formatTipoFormacion(tipo), count];
    });
    
    autoTable(doc, {
      startY: 30,
      head: [['Tipo de Formación', 'Cantidad']],
      body: tiposData,
      theme: 'grid',
      headStyles: {
        fillColor: [0, 70, 152],
        textColor: [255, 255, 255]
      }
    });
    
    // Calcular total para porcentajes
    const total = Object.values(tiposCounts).reduce((sum, count) => sum + count, 0);
    
    if (total > 0) {
      // Configuración del gráfico circular mejorado
      const centerX = 105;
      const centerY = 100;
      const radius = 40;
      
      // Colores para los tipos de formación
      const colors = {
        presencial: [0, 70, 152], // Azul
        virtual: [220, 57, 18],   // Rojo
        hibrida: [255, 153, 0]    // Naranja
      };
      
      // Añadir sombra al gráfico
      doc.setDrawColor(200, 200, 200);
      doc.setFillColor(240, 240, 240);
      doc.circle(centerX + 2, centerY + 2, radius, 'F');
      
      // Variables para el tracking del ángulo
      let startAngle = 0;
      let endAngle = 0;
      
      // Crear una leyenda mejorada
      doc.setFillColor(230, 240, 255);
      doc.rect(150, 75, 50, 70, 'F');
      doc.setDrawColor(0, 70, 152);
      doc.setLineWidth(0.1);
      doc.rect(150, 75, 50, 70, 'S');
      
      doc.setFontSize(10);
      doc.setTextColor(0, 70, 152);
      doc.text('Leyenda:', 155, 85);
      
      let legendY = 100;
      
      // Dibujar el gráfico circular mejorado
      Object.entries(tiposCounts).forEach(([tipo, count], index) => {
        if (count > 0) {
          const porcentaje = count / total;
          startAngle = endAngle;
          endAngle = startAngle + (porcentaje * 2 * Math.PI);
          
          // Dibujar sector con efecto 3D
          doc.setFillColor(...colors[tipo]);
          doc.setDrawColor(255, 255, 255);
          doc.setLineWidth(0.5);
          
          const steps = Math.max(20, Math.floor(porcentaje * 100));
          
          // Dibujar sector principal
          doc.moveTo(centerX, centerY);
          for (let i = 0; i <= steps; i++) {
            const angle = startAngle + (i * (endAngle - startAngle) / steps);
            const xPos = centerX + Math.cos(angle) * radius;
            const yPos = centerY + Math.sin(angle) * radius;
            
            if (i === 0) {
              doc.moveTo(centerX, centerY);
              doc.lineTo(xPos, yPos);
            } else {
              doc.lineTo(xPos, yPos);
            }
          }
          doc.lineTo(centerX, centerY);
          doc.fill();
          
          // Añadir borde blanco para efecto 3D
          doc.setDrawColor(255, 255, 255);
          doc.setLineWidth(0.5);
          doc.moveTo(centerX, centerY);
          for (let i = 0; i <= steps; i++) {
            const angle = startAngle + (i * (endAngle - startAngle) / steps);
            const xPos = centerX + Math.cos(angle) * radius;
            const yPos = centerY + Math.sin(angle) * radius;
            
            if (i === 0) {
              doc.moveTo(centerX, centerY);
              doc.lineTo(xPos, yPos);
            } else {
              doc.lineTo(xPos, yPos);
            }
          }
          doc.stroke();
          
          // Añadir etiqueta de porcentaje dentro del sector (si hay espacio suficiente)
          if (porcentaje > 0.1) {
            const labelAngle = startAngle + (endAngle - startAngle) / 2;
            const labelDistance = radius * 0.7;
            const labelX = centerX + Math.cos(labelAngle) * labelDistance;
            const labelY = centerY + Math.sin(labelAngle) * labelDistance;
            
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(8);
            doc.text(`${Math.round(porcentaje * 100)}%`, labelX, labelY, { align: 'center' });
          }
          
          // Agregar a la leyenda
          doc.setFillColor(...colors[tipo]);
          doc.rect(155, legendY - 5, 10, 10, 'F');
          
          doc.setTextColor(0, 0, 0);
          doc.setFontSize(8);
          doc.text(`${formatTipoFormacion(tipo)} (${count})`, 170, legendY);
          
          legendY += 15;
        }
      });
      
      // Título del gráfico
      doc.setFontSize(12);
      doc.setTextColor(0, 70, 152);
      doc.text('Distribución por tipo', centerX, centerY - radius - 10, { align: 'center' });
    }
    
  } else {
    doc.text('No hay formaciones registradas.', 20, yPos);
  }
  
  // En lugar de guardar directamente, generamos una URL para previsualización
  const pdfOutput = doc.output('blob');
  pdfPreviewUrl.value = URL.createObjectURL(pdfOutput);
  showPDFPreview.value = true;
  
};

// Usar la función para descargar informe en formato Word (docx)
const descargarWord = () => {
  try {
    // Crear un elemento de texto HTML que servirá como fuente para el documento Word
    const contenido = document.createElement('div');
    contenido.className = 'word-export-content';
    
    // Estilos para la exportación (se incluirán en el documento)
    const estilos = `
      <style>
        @page { size: A4; margin: 2cm; }
        body { font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0; }
        h1 { color: #004698; font-size: 20pt; margin-bottom: 15px; }
        h2 { color: #004698; font-size: 16pt; margin-top: 25px; margin-bottom: 10px; }
        h3 { color: #004698; font-size: 14pt; margin-top: 20px; }
        p { margin: 5px 0; }
        table { border-collapse: collapse; width: 100%; margin: 15px 0; }
        th { background-color: #004698; color: white; padding: 8px; text-align: left; border: 1px solid #ddd; }
        td { padding: 8px; border: 1px solid #ddd; }
        .portada { text-align: center; padding: 40px 20px; margin-bottom: 40px; }
        .portada-borde { border: 2px solid #004698; padding: 20px; margin: 0 auto; height: 90%; }
        .logos { margin-bottom: 40px; }
        .logo { max-width: 200px; max-height: 70px; margin: 10px; }
        .portada h1 { font-size: 28pt; margin: 40px 0 10px 0; }
        .portada h2 { font-size: 18pt; margin: 10px 0 40px 0; }
        .info-empresa { margin-bottom: 30px; }
        .info-item { margin-bottom: 10px; }
        .info-label { font-weight: bold; display: inline-block; width: 150px; }
        .seccion { margin-top: 30px; page-break-before: always; padding: 20px; }
        .seccion-titulo { 
          background-color: #f0f5ff; 
          color: #004698; 
          text-align: center; 
          padding: 15px 0;
          margin-bottom: 20px;
          font-size: 24pt;
          border: 1px solid #004698;
          border-radius: 5px;
        }
        .seccion-borde { border: 1px solid #004698; padding: 15px; margin-bottom: 15px; border-radius: 5px; }
        .footer { text-align: center; font-size: 9pt; color: #666; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 10px; }
        .header { border-bottom: 2px solid #004698; padding-bottom: 10px; margin-bottom: 20px; }
        .resumen-box { background-color: #f9f9f9; border: 1px solid #ddd; padding: 15px; margin: 20px 0; }
      </style>
    `;
    
    // Portada principal
    const portada = `
      <div class="portada">
        <div class="portada-borde">
          <div class="logos">
            <img src="${logoUrl}" alt="Logo ImpulseData" class="logo" />
            <br/>
            <img src="${impulsaAlicanteLogo}" alt="Impulsa Alicante" class="logo" />
            <br/>
            <img src="${ayuntamientoLogo}" alt="Ayuntamiento Alicante" class="logo" />
          </div>
          <h1>INFORME EMPRESARIAL</h1>
          <h2>${empresaActual.nombre}</h2>
          <p style="margin-top: 50px; font-size: 12pt;">Memoria de actividad</p>
          <p style="margin-top: 100px; font-size: 12pt;">Informe generado el ${new Date().toLocaleDateString('es-ES', {day: '2-digit', month: 'long', year: 'numeric'})}</p>
        </div>
      </div>
    `;
    
    // Sección de información general
    const infoEmpresa = `
      <div class="seccion">
        <div class="seccion-titulo">
          Información General
        </div>
        <div class="seccion-borde">
          <div class="info-empresa">
            <div class="info-item"><span class="info-label">Nombre:</span> ${empresaActual.nombre}</div>
            <div class="info-item"><span class="info-label">Fecha de creación:</span> ${formatDate(empresaActual.fechaCreacion)}</div>
            <div class="info-item"><span class="info-label">Ciudad:</span> ${empresaActual.ciudad || 'No especificada'}</div>
            <div class="info-item"><span class="info-label">Descripción:</span> ${empresaActual.descripcion || 'Sin descripción'}</div>
          </div>
        </div>
      </div>
    `;
    
    // Sección de departamentos
    let departamentosHTML = `
      <div class="seccion">
        <div class="seccion-titulo">
          Departamentos
        </div>
        <div class="seccion-borde">
    `;
    
    if (empresaActual.departamentos && empresaActual.departamentos.length > 0) {
      departamentosHTML += `<table>
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre del Departamento</th>
          </tr>
        </thead>
        <tbody>`;
      
      empresaActual.departamentos.forEach((dep, index) => {
        departamentosHTML += `
          <tr>
            <td>${index + 1}</td>
            <td>${dep.nombre}</td>
          </tr>
        `;
      });
      
      departamentosHTML += `</tbody></table>`;
              } else {
      departamentosHTML += `<p>No hay departamentos registrados.</p>`;
    }
    
    departamentosHTML += `</div></div>`;
    
    // Sección de centros
    let centrosHTML = `
      <div class="seccion">
        <div class="seccion-titulo">
          Centros
        </div>
        <div class="seccion-borde">
    `;
    
    if (empresaActual.centros && empresaActual.centros.length > 0) {
      centrosHTML += `<table>
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre del Centro</th>
            <th>Dirección</th>
          </tr>
        </thead>
        <tbody>`;
      
      empresaActual.centros.forEach((centro, index) => {
        centrosHTML += `
          <tr>
            <td>${index + 1}</td>
            <td>${centro.nombre}</td>
            <td>${centro.direccion || 'No especificada'}</td>
          </tr>
        `;
      });
      
      centrosHTML += `</tbody></table>`;
    } else {
      centrosHTML += `<p>No hay centros registrados.</p>`;
    }
    
    centrosHTML += `</div></div>`;
    
    // Sección de formaciones
    let formacionesHTML = `
      <div class="seccion">
        <div class="seccion-titulo">
          Formaciones
        </div>
        <div class="seccion-borde">
    `;
    
    if (empresaActual.formaciones && empresaActual.formaciones.length > 0) {
      // Tabla principal de formaciones
      formacionesHTML += `
        <h2>Listado completo de formaciones</h2>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre de la Formación</th>
              <th>Tipo</th>
              <th>Duración</th>
            </tr>
          </thead>
          <tbody>
      `;
      
      empresaActual.formaciones.forEach((formacion, index) => {
        formacionesHTML += `
          <tr>
            <td>${index + 1}</td>
            <td>${formacion.nombre}</td>
            <td>${formatTipoFormacion(formacion.tipo)}</td>
            <td>${formacion.duracion} horas</td>
          </tr>
        `;
      });
      
      formacionesHTML += `</tbody></table>`;
      
      // Distribucion por tipo
      const tiposCounts = {
        presencial: 0,
        virtual: 0,
        hibrida: 0
      };
      
      empresaActual.formaciones.forEach(formacion => {
        if (tiposCounts[formacion.tipo] !== undefined) {
          tiposCounts[formacion.tipo]++;
        }
      });
      
      // Horas por tipo
      const horasPorTipo = {
        presencial: 0,
        virtual: 0,
        hibrida: 0
      };
      
      empresaActual.formaciones.forEach(formacion => {
        if (horasPorTipo[formacion.tipo] !== undefined) {
          horasPorTipo[formacion.tipo] += parseInt(formacion.duracion) || 0;
        }
      });
      
      // Total horas
      const totalHoras = Object.values(horasPorTipo).reduce((sum, curr) => sum + curr, 0);
      
      // Resumen por tipo de formación
      formacionesHTML += `
        <div class="resumen-box">
          <h2>Resumen por tipo de formación</h2>
          <table>
            <thead>
              <tr>
                <th>Tipo de Formación</th>
                <th>Cantidad</th>
                <th>Porcentaje</th>
              </tr>
            </thead>
            <tbody>
      `;
      
      const total = Object.values(tiposCounts).reduce((sum, count) => sum + count, 0);
      
      Object.entries(tiposCounts).forEach(([tipo, count]) => {
        const porcentaje = total > 0 ? Math.round((count / total) * 100) : 0;
        formacionesHTML += `
          <tr>
            <td>${formatTipoFormacion(tipo)}</td>
            <td>${count}</td>
            <td>${porcentaje}%</td>
          </tr>
        `;
      });
      
      formacionesHTML += `
        <tr style="font-weight: bold;">
          <td>Total</td>
          <td>${total}</td>
          <td>100%</td>
        </tr>
      `;
      
      formacionesHTML += `</tbody></table>`;
      
      // Lista de formaciones ordenadas por duración
      const formacionesOrdenadas = [...empresaActual.formaciones].sort((a, b) => 
        (parseInt(b.duracion) || 0) - (parseInt(a.duracion) || 0)
      );
      
      formacionesHTML += `
        <h2>Formaciones ordenadas por duración</h2>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Duración</th>
            </tr>
          </thead>
          <tbody>
      `;
      
      formacionesOrdenadas.forEach((formacion, index) => {
        formacionesHTML += `
          <tr>
            <td>${index + 1}</td>
            <td>${formacion.nombre}</td>
            <td>${formatTipoFormacion(formacion.tipo)}</td>
            <td>${formacion.duracion} horas</td>
          </tr>
        `;
      });
      
      formacionesHTML += `</tbody></table>`;
      
      // Añadir gráficos representativos
      formacionesHTML += `
        <div style="margin-top: 30px; border: 1px solid #ddd; padding: 15px; background-color: #f9f9f9;">
          <h2>Representación gráfica</h2>
          
          <!-- Gráfico de barras para tipos de formación -->
          <div style="margin: 20px 0;">
            <h3>Distribución por tipo de formación</h3>
            <div style="display: flex; height: 200px; align-items: flex-end; margin-top: 20px; border-bottom: 2px solid #004698; border-left: 2px solid #004698; padding-left: 40px;">
      `;
      
      // Calculamos el porcentaje para cada tipo y creamos barras
      Object.entries(tiposCounts).forEach(([tipo, count], index) => {
        const porcentaje = total > 0 ? Math.round((count / total) * 100) : 0;
        const altura = Math.max(porcentaje * 1.8, 10); // Altura mínima de 10px
        
        // Determinamos color según el tipo
        let color;
        switch(tipo) {
          case 'presencial':
            color = '#3366cc';
            break;
          case 'virtual':
            color = '#dc3912';
            break;
          case 'hibrida':
            color = '#ff9900';
            break;
          default:
            color = '#109618';
        }
        
        formacionesHTML += `
          <div style="display: flex; flex-direction: column; align-items: center; margin-right: 40px;">
            <div style="height: ${altura}px; width: 60px; background-color: ${color}; margin-bottom: 5px;"></div>
            <div style="font-weight: bold;">${formatTipoFormacion(tipo)}</div>
            <div>${porcentaje}%</div>
          </div>
        `;
      });
      
      formacionesHTML += `
            </div>
          </div>
          
          <!-- Gráfico circular para horas totales -->
          <div style="margin: 30px 0;">
            <h3>Horas por tipo de formación</h3>
            <div style="display: flex; justify-content: space-around; margin-top: 20px;">
              <div style="width: 220px; height: 220px; border-radius: 50%; background: conic-gradient(
      `;
      
      // Calculamos los ángulos para el gráfico circular
      let startAngle = 0;
      const colors = ['#3366cc', '#dc3912', '#ff9900', '#109618'];
      let colorSegments = [];
      
      Object.entries(horasPorTipo).forEach(([tipo, horas], index) => {
        if (totalHoras > 0) {
          const porcentaje = (horas / totalHoras);
          const endAngle = startAngle + (porcentaje * 360);
          
          colorSegments.push(`${colors[index % colors.length]} ${startAngle}deg ${endAngle}deg`);
          startAngle = endAngle;
        }
      });
      
      formacionesHTML += colorSegments.join(', ');
      formacionesHTML += `
              )"></div>
              
              <!-- Leyenda del gráfico -->
              <div style="margin-left: 20px;">
      `;
      
      Object.entries(horasPorTipo).forEach(([tipo, horas], index) => {
        const porcentaje = totalHoras > 0 ? Math.round((horas / totalHoras) * 100) : 0;
        
        formacionesHTML += `
          <div style="display: flex; align-items: center; margin-bottom: 10px;">
            <div style="width: 20px; height: 20px; background-color: ${colors[index % colors.length]}; margin-right: 10px;"></div>
            <div>${formatTipoFormacion(tipo)}: ${horas} horas (${porcentaje}%)</div>
          </div>
        `;
      });
      
      formacionesHTML += `
              </div>
            </div>
          </div>
        </div>
      `;
      
    } else {
      formacionesHTML += `<p>No hay formaciones registradas.</p>`;
    }
    
    formacionesHTML += `</div></div>`;
    
    // Pie de página
    const footer = `
      <div class="footer">
        <p>ImpulseData - Alicante Futura</p>
        <p>Documento generado el ${new Date().toLocaleDateString('es-ES')} a las ${new Date().toLocaleTimeString('es-ES')}</p>
      </div>
    `;
    
    // Combinar todo el contenido
    contenido.innerHTML = estilos + portada + infoEmpresa + departamentosHTML + centrosHTML + formacionesHTML + footer;
    
    // Convertir a Blob
    const blob = new Blob([contenido.outerHTML], { type: 'application/msword' });
    
    // Crear elemento de descarga
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `informe_${empresaActual.nombre.replace(/\s+/g, '_')}.doc`;
    
    // Añadir a la página, hacer clic y eliminar
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
  } catch (error) {
    console.error("Error al generar el documento Word:", error);
    alert("Error al generar el documento Word. Por favor, inténtelo de nuevo.");
  }
};

const showPDFPreview = ref(false);
const pdfPreviewUrl = ref('');

// Función para previsualizar un PDF con manejo de errores mejorado
const previsualizarPDF = async () => {
  try {
    // Indicar que estamos cargando
    guardando.value = true;
    
    // Cerrar el modal de vista antes de mostrar la previsualización
    showViewModal.value = false;
    
    // Limpiar cualquier URL previa
    if (pdfPreviewUrl.value) {
      URL.revokeObjectURL(pdfPreviewUrl.value);
      pdfPreviewUrl.value = null;
    }
    
    // Generar el PDF - directamente descargar en lugar de previsualizar si hay error
    try {
      const pdfBytes = await PDFService.generarInformeEmpresa(empresaActual);
      
      // Intentar crear URL para previsualización
      try {
        // Crear blob y url
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        pdfPreviewUrl.value = URL.createObjectURL(blob);
        
        // Mostrar el modal de previsualización
        showPDFPreview.value = true;
      } catch (previewError) {
        console.error("Error al crear previsualización, descargando directamente:", previewError);
        
        // Si falla la previsualización, descargar directamente
        PDFService.guardarPDF(pdfBytes, `informe_${empresaActual.nombre.replace(/\s+/g, '_')}.pdf`);
        alert("No se pudo generar la previsualización. El PDF se ha descargado directamente.");
      }
    } catch (pdfError) {
      console.error("Error grave al generar el PDF:", pdfError);
      alert("Error al generar el PDF. Por favor, inténtelo de nuevo más tarde.");
    }
    
    // Finalizar carga
    guardando.value = false;
  } catch (generalError) {
    console.error("Error inesperado en previsualizarPDF:", generalError);
    guardando.value = false;
    alert("Ha ocurrido un error inesperado. Por favor, inténtelo de nuevo.");
  }
};

// Función para descargar el PDF después de la previsualización
const descargarPDF = async () => {
  try {
    guardando.value = true;
    
    // Generar el PDF
    try {
      const pdfBytes = await PDFService.generarInformeEmpresa(empresaActual);
      
      // Intentar guardar el PDF
      try {
        PDFService.guardarPDF(pdfBytes, `informe_${empresaActual.nombre.replace(/\s+/g, '_')}.pdf`);
      } catch (saveError) {
        console.error("Error al guardar el PDF:", saveError);
        alert("No se pudo descargar el PDF. Verifique los permisos de su navegador.");
        return; // Salir temprano sin cerrar modales si falla la descarga
      }
    } catch (pdfError) {
      console.error("Error al generar el PDF para descarga:", pdfError);
      alert("Error al generar el PDF. Por favor, inténtelo de nuevo más tarde.");
      guardando.value = false;
      return; // Salir temprano sin cerrar modales
    }
    
    // Limpiar la URL del objeto
    if (pdfPreviewUrl.value) {
      URL.revokeObjectURL(pdfPreviewUrl.value);
      pdfPreviewUrl.value = null;
    }
    
    // Cerrar modales
    showPDFPreview.value = false;
    showViewModal.value = false;  // Asegurar que el modal de detalles también se cierre
    
    guardando.value = false;
  } catch (error) {
    console.error("Error inesperado al descargar el PDF:", error);
    guardando.value = false;
    alert("Ha ocurrido un error inesperado. Por favor, inténtelo de nuevo.");
  }
};

// Función para cerrar la previsualización del PDF
const cerrarPreviewPDF = () => {
  // Limpiar la URL y cerrar todos los modales
  if (pdfPreviewUrl.value) {
    URL.revokeObjectURL(pdfPreviewUrl.value);
    pdfPreviewUrl.value = null;
  }
  
  showPDFPreview.value = false;
  showViewModal.value = false; // Asegurar que el modal de detalles también se cierre
};
</script>

<style src="../assets/Home.css"></style>