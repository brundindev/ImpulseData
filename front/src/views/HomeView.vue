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
    
    <!-- Componente de animación de scroll -->
    <ScrollAnimation />
    
    <div class="dashboard-container">
      <!-- Encabezado del dashboard -->
      <div class="dashboard-header">
        <div>
          <h1 class="welcome-title">Dashboard</h1>
          <p class="welcome-subtitle">¡Bienvenido, <span class="user-name">{{ usuario?.nombre || usuario?.displayName || 'Usuario' }}</span>!</p>
        </div>
        <div class="action-buttons">
          <button @click="showFormModal = true; modoEdicion = false;" class="btn btn-primary btn-create">
            <span class="icon">+</span> Crear empresa
          </button>
          <button 
            type="button" 
            class="btn btn-secondary btn-create"
            @click="$refs.fileInput.click()"
            :disabled="importando"
          >
            <span class="icon">↓</span>
            <span v-if="importando">Importando...</span>
            <span v-else>Importar Empresas</span>
          </button>
          <input 
            type="file" 
            ref="fileInput" 
            style="display: none" 
            accept=".csv,.json"
            @change="importarArchivo"
          >
          <div v-if="errorImportacion" class="error-message">
            {{ errorImportacion }}
          </div>
        </div>
      </div>
      
      <!-- Banner de Alicante destacado -->
      <div class="alicante-banner-showcase">
        <div class="banner-content">
          <div class="banner-image-container">
            <img src="@/assets/img/impulsaalicante.png" alt="Impulsa Alicante" class="banner-image" />
            <div class="image-glow"></div>
          </div>
          <div class="banner-info">
            <h3>ImpulseData - Alicante Futura</h3>
            <p>Plataforma digital de gestión de datos para la innovación y el desarrollo sostenible de Alicante.</p>
            <div class="banner-action">
              <button class="btn-apple" @click="openChatbot">Explorar <span class="arrow">→</span></button>
            </div>
          </div>
        </div>
        <div class="banner-accent-shapes">
          <div class="accent-shape shape-1"></div>
          <div class="accent-shape shape-2"></div>
          <div class="accent-shape shape-3"></div>
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
      
      <!-- El botón flotante ha sido reemplazado por el asistente virtual -->
      
      <!-- Modal para crear/editar empresa -->
      <teleport to="body">
      <div class="modal-overlay" v-if="showFormModal" @click.self="showFormModal = false">
        <div class="modal-container apple-modal">
          <div class="modal-accent-shapes">
            <div class="modal-accent-shape shape-1"></div>
            <div class="modal-accent-shape shape-2"></div>
            <div class="modal-accent-shape shape-3"></div>
          </div>
          
          <div class="modal-header apple-modal-header">
            <div class="modal-title-wrapper">
              <div class="modal-icon-container">
                <span class="modal-icon">{{ modoEdicion ? '✏️' : '➕' }}</span>
              </div>
              <h2>{{ modoEdicion ? 'Editar empresa' : 'Crear nueva empresa' }}</h2>
            </div>
            <button class="btn-close apple-btn-close" @click="showFormModal = false">
              <span>×</span>
            </button>
          </div>
          
          <div class="modal-body apple-modal-body">
            <div v-if="guardando" class="saving-overlay apple-saving-overlay">
                <div class="apple-spinner">
                  <div class="apple-spinner-dot dot-1"></div>
                  <div class="apple-spinner-dot dot-2"></div>
                  <div class="apple-spinner-dot dot-3"></div>
                </div>
                <p>Guardando información...</p>
            </div>
            
            <form @submit.prevent="guardarEmpresa" class="apple-form">
              <div class="apple-form-section">
                <h3 class="apple-section-header">Información general</h3>
                
                <div class="form-group apple-form-group">
                  <label for="nombreEmpresa">Nombre de la empresa</label>
                  <div class="apple-input-container input-gemini-container">
                    <input 
                      type="text" 
                      id="nombreEmpresa" 
                      v-model="nuevaEmpresa.nombre" 
                      required 
                      placeholder="Ej: Acme Corporation"
                      class="apple-input"
                    >
                    <GeminiButton 
                      field-name="nombre de empresa"
                      :current-value="nuevaEmpresa.nombre"
                      @suggestion="(text) => nuevaEmpresa.nombre = text"
                    />
                    <div class="input-focus-effect"></div>
                  </div>
                </div>
                
                <div class="form-group apple-form-group">
                  <label for="fechaCreacion">Fecha de creación</label>
                  <div class="apple-input-container">
                    <input 
                      type="date" 
                      id="fechaCreacion" 
                      v-model="nuevaEmpresa.fechaCreacion" 
                      required
                      class="apple-input"
                    >
                    <div class="input-focus-effect"></div>
                  </div>
                </div>
                
                <div class="form-group apple-form-group">
                  <label for="descripcionEmpresa">Descripción</label>
                  <div class="apple-input-container input-gemini-container">
                    <textarea 
                      id="descripcionEmpresa" 
                      v-model="nuevaEmpresa.descripcion" 
                      rows="3" 
                      placeholder="Describe brevemente la empresa"
                      class="apple-input apple-textarea"
                    ></textarea>
                    <GeminiButton 
                      field-name="descripción empresa"
                      :context="nuevaEmpresa.nombre"
                      :current-value="nuevaEmpresa.descripcion"
                      @suggestion="(text) => nuevaEmpresa.descripcion = text"
                    />
                    <div class="input-focus-effect"></div>
                  </div>
                </div>
                
                <div class="form-group apple-form-group">
                  <label for="ciudadEmpresa">Ciudad</label>
                  <div class="apple-input-container">
                    <input 
                      type="text" 
                      id="ciudadEmpresa" 
                      v-model="nuevaEmpresa.ciudad" 
                      required 
                      placeholder="Ej: Alicante"
                      class="apple-input"
                    >
                    <div class="input-focus-effect"></div>
                  </div>
                </div>
              </div>
              
              <div class="apple-form-section">
                <h3 class="apple-section-header">
                  <span>Departamentos</span>
                  <button type="button" class="apple-add-btn" @click="agregarDepartamento">
                    <span class="add-icon">+</span>
                    <span class="add-text">Añadir</span>
                  </button>
                </h3>
                
                <div class="apple-cards-container">
                  <div 
                    v-for="(departamento, index) in nuevaEmpresa.departamentos" 
                    :key="index" 
                    class="apple-card"
                  >
                    <div class="apple-card-header">
                      <h4>Departamento {{ index + 1 }}</h4>
                      <button 
                        type="button" 
                        class="apple-delete-btn" 
                        @click="eliminarDepartamento(index)"
                        v-if="nuevaEmpresa.departamentos.length > 1"
                      >
                        <span class="delete-icon">×</span>
                      </button>
                    </div>
                    
                    <div class="form-group apple-form-group">
                      <label :for="'nombreDep'+index">Nombre del departamento</label>
                      <div class="apple-input-container input-gemini-container">
                        <input 
                          type="text" 
                          :id="'nombreDep'+index" 
                          v-model="departamento.nombre" 
                          required 
                          placeholder="Ej: Empleo y Formación"
                          class="apple-input"
                        >
                        <GeminiButton 
                          field-name="nombre de departamento"
                          :context="nuevaEmpresa.nombre"
                          :current-value="departamento.nombre"
                          @suggestion="(text) => departamento.nombre = text"
                        />
                        <div class="input-focus-effect"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="apple-form-section">
                <h3 class="apple-section-header">
                  <span>Centros</span>
                  <button type="button" class="apple-add-btn" @click="agregarCentro">
                    <span class="add-icon">+</span>
                    <span class="add-text">Añadir</span>
                  </button>
                </h3>
                
                <div class="apple-cards-container">
                  <div 
                    v-for="(centro, index) in nuevaEmpresa.centros" 
                    :key="index" 
                    class="apple-card"
                  >
                    <div class="apple-card-header">
                      <h4>Centro {{ index + 1 }}</h4>
                      <button 
                        type="button" 
                        class="apple-delete-btn" 
                        @click="eliminarCentro(index)"
                        v-if="nuevaEmpresa.centros.length > 1"
                      >
                        <span class="delete-icon">×</span>
                      </button>
                    </div>
                    
                    <div class="form-group apple-form-group">
                      <label :for="'nombreCentro'+index">Nombre del centro</label>
                      <div class="apple-input-container input-gemini-container">
                        <input 
                          type="text" 
                          :id="'nombreCentro'+index" 
                          v-model="centro.nombre" 
                          required 
                          placeholder="Ej: Sede Principal"
                          class="apple-input"
                        >
                        <GeminiButton 
                          field-name="nombre de centro"
                          :context="nuevaEmpresa.nombre"
                          :current-value="centro.nombre"
                          @suggestion="(text) => centro.nombre = text"
                        />
                        <div class="input-focus-effect"></div>
                      </div>
                    </div>
                    
                    <div class="form-group apple-form-group">
                      <label :for="'direccionCentro'+index">Dirección</label>
                      <div class="apple-input-container input-gemini-container">
                        <input 
                          type="text" 
                          :id="'direccionCentro'+index" 
                          v-model="centro.direccion" 
                          required 
                          placeholder="Ej: Calle Principal 123"
                          class="apple-input"
                        >
                        <GeminiButton 
                          field-name="dirección"
                          :context="nuevaEmpresa.ciudad || 'Alicante'"
                          :current-value="centro.direccion"
                          @suggestion="(text) => centro.direccion = text"
                        />
                        <div class="input-focus-effect"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="apple-form-section">
                <h3 class="apple-section-header">
                  <span>Formaciones</span>
                  <button type="button" class="apple-add-btn" @click="agregarFormacion">
                    <span class="add-icon">+</span>
                    <span class="add-text">Añadir</span>
                  </button>
                </h3>
                
                <div class="apple-cards-container">
                  <div 
                    v-for="(formacion, index) in nuevaEmpresa.formaciones" 
                    :key="index" 
                    class="apple-card"
                  >
                    <div class="apple-card-header">
                      <h4>Formación {{ index + 1 }}</h4>
                      <button 
                        type="button" 
                        class="apple-delete-btn" 
                        @click="eliminarFormacion(index)"
                        v-if="nuevaEmpresa.formaciones.length > 1"
                      >
                        <span class="delete-icon">×</span>
                      </button>
                    </div>
                    
                    <div class="form-group apple-form-group">
                      <label :for="'nombreFormacion'+index">Nombre de la formación</label>
                      <div class="apple-input-container input-gemini-container">
                        <input 
                          type="text" 
                          :id="'nombreFormacion'+index" 
                          v-model="formacion.nombre" 
                          required 
                          placeholder="Ej: LABORA"
                          class="apple-input"
                        >
                        <GeminiButton 
                          field-name="nombre de formación"
                          :context="nuevaEmpresa.nombre"
                          :current-value="formacion.nombre"
                          @suggestion="(text) => formacion.nombre = text"
                        />
                        <div class="input-focus-effect"></div>
                      </div>
                    </div>
                    
                    <div class="form-group apple-form-group">
                      <label :for="'tipoFormacion'+index">Tipo de formación</label>
                      <div class="apple-select-container">
                        <select 
                          :id="'tipoFormacion'+index" 
                          v-model="formacion.tipo" 
                          required
                          class="apple-select"
                        >
                          <option value="presencial">Presencial</option>
                          <option value="virtual">Virtual</option>
                          <option value="hibrida">Híbrida</option>
                        </select>
                        <div class="select-arrow"></div>
                        <div class="input-focus-effect"></div>
                      </div>
                    </div>
                    
                    <div class="form-group apple-form-group">
                      <label :for="'duracionFormacion'+index">Duración (horas)</label>
                      <div class="apple-input-container">
                        <input 
                          type="number" 
                          :id="'duracionFormacion'+index" 
                          v-model="formacion.duracion" 
                          required 
                          min="1"
                          class="apple-input"
                        >
                        <div class="input-focus-effect"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="apple-form-actions">
                <button type="button" class="apple-btn-cancel" @click="showFormModal = false">
                  <span class="btn-text">Cancelar</span>
                </button>
                <button type="submit" class="apple-btn-save" :disabled="guardando">
                  <span class="btn-icon">{{ modoEdicion ? '✓' : '➕' }}</span>
                  <span class="btn-text">{{ modoEdicion ? 'Guardar cambios' : 'Crear empresa' }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      </teleport>
      
      <!-- Modal de confirmación para eliminar -->
      <teleport to="body">
      <div class="modal-overlay" v-if="mostrarConfirmacion" @click.self="mostrarConfirmacion = false">
        <div class="modal-container modal-small apple-modal apple-modal-confirm">
          <div class="modal-accent-shapes">
            <div class="modal-accent-shape shape-1"></div>
          </div>
          
          <div class="modal-header apple-modal-header">
            <div class="modal-title-wrapper">
              <div class="modal-icon-container delete-icon-container">
                <span class="modal-icon">🗑️</span>
              </div>
              <h2>Confirmar eliminación</h2>
            </div>
            <button class="btn-close apple-btn-close" @click="mostrarConfirmacion = false">
              <span>×</span>
            </button>
          </div>
          
          <div class="modal-body apple-modal-body">
            <p class="confirm-message">¿Estás seguro de que deseas eliminar la empresa <strong>{{ empresaAEliminar?.nombre }}</strong>?</p>
            <p class="warning-text">Esta acción no se puede deshacer.</p>
            
            <div class="apple-form-actions">
              <button class="apple-btn-cancel" @click="mostrarConfirmacion = false">
                <span class="btn-text">Cancelar</span>
              </button>
              <button 
                class="apple-btn-delete" 
                @click="eliminarEmpresa" 
                :disabled="eliminando"
              >
                <span class="btn-icon">🗑️</span>
                <span class="btn-text">Eliminar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      </teleport>
      
      <!-- Modal de vista de empresa -->
      <teleport to="body">
      <div class="modal-overlay" v-if="showViewModal" @click.self="showViewModal = false">
        <div class="modal-container apple-modal apple-modal-view">
          <div class="modal-accent-shapes">
            <div class="modal-accent-shape shape-1"></div>
            <div class="modal-accent-shape shape-2"></div>
          </div>
          
          <div class="modal-header apple-modal-header">
            <div class="modal-title-wrapper">
              <div class="modal-icon-container view-icon-container">
                <span class="modal-icon">👁️</span>
              </div>
              <h2>{{ empresaActual.nombre }}</h2>
            </div>
            <div class="view-modal-actions">
              <button class="apple-action-btn edit-btn" @click="editarEmpresaDesdeVista()">
                <span class="action-icon">✏️</span>
                <span class="action-text">Editar</span>
              </button>
              <button class="apple-action-btn pdf-btn" @click="previsualizarPDF()">
                <span class="action-icon">📄</span>
                <span class="action-text">PDF</span>
              </button>
              <button class="btn-close apple-btn-close" @click="showViewModal = false">
                <span>×</span>
              </button>
            </div>
          </div>
          
          <div class="modal-body apple-modal-body">
            <div class="apple-view-sections">
              <!-- Información general -->
              <div class="apple-view-section">
                <div class="view-section-header">
                  <h3>Información general</h3>
                  <div class="view-section-badge">
                    <span class="badge-icon">📊</span>
                  </div>
                </div>
                
                <div class="apple-info-grid">
                  <div class="info-item">
                    <div class="info-label">Ciudad</div>
                    <div class="info-value">{{ empresaActual.ciudad || 'No especificada' }}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Fecha de creación</div>
                    <div class="info-value">{{ formatDate(empresaActual.fechaCreacion) }}</div>
                  </div>
                  <div class="info-item wide-item">
                    <div class="info-label">Descripción</div>
                    <div class="info-value description">{{ empresaActual.descripcion || 'Sin descripción' }}</div>
                  </div>
                </div>
              </div>
              
              <!-- Departamentos -->
              <div class="apple-view-section">
                <div class="view-section-header">
                  <h3>Departamentos</h3>
                  <div class="view-section-badge blue-badge">
                    <span class="badge-icon">🏢</span>
                  </div>
                </div>
                
                <div v-if="!empresaActual.departamentos || empresaActual.departamentos.length === 0" class="empty-message">
                  No hay departamentos registrados
                </div>
                
                <div v-else class="apple-cards-view">
                  <div 
                    v-for="(departamento, index) in empresaActual.departamentos" 
                    :key="index"
                    class="apple-view-card"
                  >
                    <div class="view-card-header">
                      <h4>Departamento {{ index + 1 }}</h4>
                    </div>
                    <div class="view-card-content">
                      <div class="info-item">
                        <div class="info-label">Nombre</div>
                        <div class="info-value">{{ departamento.nombre }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Centros -->
              <div class="apple-view-section">
                <div class="view-section-header">
                  <h3>Centros</h3>
                  <div class="view-section-badge purple-badge">
                    <span class="badge-icon">📍</span>
                  </div>
                </div>
                
                <div v-if="!empresaActual.centros || empresaActual.centros.length === 0" class="empty-message">
                  No hay centros registrados
                </div>
                
                <div v-else class="apple-cards-view">
                  <div 
                    v-for="(centro, index) in empresaActual.centros" 
                    :key="index"
                    class="apple-view-card"
                  >
                    <div class="view-card-header">
                      <h4>{{ centro.nombre }}</h4>
                    </div>
                    <div class="view-card-content">
                      <div class="info-item">
                        <div class="info-label">Dirección</div>
                        <div class="info-value">{{ centro.direccion || 'No especificada' }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Formaciones -->
              <div class="apple-view-section">
                <div class="view-section-header">
                  <h3>Formaciones</h3>
                  <div class="view-section-badge orange-badge">
                    <span class="badge-icon">🎓</span>
                  </div>
                </div>
                
                <div v-if="!empresaActual.formaciones || empresaActual.formaciones.length === 0" class="empty-message">
                  No hay formaciones registradas
                </div>
                
                <div v-else class="apple-cards-view">
                  <div 
                    v-for="(formacion, index) in empresaActual.formaciones" 
                    :key="index"
                    class="apple-view-card"
                  >
                    <div class="view-card-header">
                      <h4>{{ formacion.nombre }}</h4>
                    </div>
                    <div class="view-card-content">
                      <div class="info-item">
                        <div class="info-label">Tipo</div>
                        <div class="info-value">
                          <span class="tipo-badge" :class="'tipo-' + formacion.tipo">
                            {{ formatTipoFormacion(formacion.tipo) }}
                          </span>
                        </div>
                      </div>
                      <div class="info-item">
                        <div class="info-label">Duración</div>
                        <div class="info-value">{{ formacion.duracion }} horas</div>
                      </div>
                    </div>
                  </div>
                </div>
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
    :pdfBytes="pdfBytes"
    :nombre-archivo="`informe_${empresaActual.nombre.replace(/\s+/g, '_')}.pdf`"
    @close="cerrarPreviewPDF" 
    @download="descargarPDFPreview"
  />

  <!-- Modal de confirmación de importación -->
  <div v-if="mostrarConfirmacionImportacion" class="modal-overlay">
    <div class="modal-container modal-small">
      <div class="modal-header">
        <h2>{{ resultadoImportacion.exitoso ? 'Importación Exitosa' : 'Error en la Importación' }}</h2>
        <button class="btn-close" @click="mostrarConfirmacionImportacion = false">×</button>
      </div>
      <div class="modal-body">
        <div class="resultado-importacion">
          <p :class="{ 'text-success': resultadoImportacion.exitoso, 'text-error': !resultadoImportacion.exitoso }">
            {{ resultadoImportacion.mensaje }}
          </p>
          <div v-if="resultadoImportacion.detalles" class="detalles-importacion">
            <h3 v-if="resultadoImportacion.exitoso">Empresas importadas:</h3>
            <ul>
              <li v-for="(detalle, index) in resultadoImportacion.detalles" :key="index">
                {{ detalle }}
              </li>
            </ul>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn btn-primary" @click="mostrarConfirmacionImportacion = false">Cerrar</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Pantalla de carga durante la importación -->
  <div v-if="importando" class="loading-overlay">
    <div class="spinnerContainer">
      <div class="spinner"></div>
      <div class="loader">
        <span class="words">Importando empresas...</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed, watch, onUnmounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import AuthService from '../services/AuthService';
import FirestoreService from '../services/FirestoreService';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import FirebaseAuthService from '../services/FirebaseAuthService';
import axios from 'axios';
import AnimatedNumber from '../components/AnimatedNumber.vue';
import ScrollAnimation from '../components/ScrollAnimation.vue';
import PDFPreviewModal from '../components/PDFPreviewModal.vue';
import GeminiButton from '../components/GeminiButton.vue';
// Importar PDFService
import PDFService from '../services/PDFService';
// Importar el logo e imágenes
import logoUrl from '../assets/img/impulsedata_logo.png';
import impulsaAlicanteLogo from '../assets/img/impulsaalicante.png';
import ayuntamientoLogo from '../assets/img/ayuntamiento-alicante.jpg';
import FileImportService from '../services/FileImportService';

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
  ],
  contratos: [
    {
      nombre: '',
      fechaInicio: '',
      fechaFin: '',
      tipo: 'presencial',
      duracion: 8
    }
  ]

});

// Agregar después de las variables reactivas existentes
const importando = ref(false);
const errorImportacion = ref(null);
const mostrarConfirmacionImportacion = ref(false);
const resultadoImportacion = ref(null);

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
    
    console.log("Estado de autenticación:", {
      "Firebase auth": user ? "Activo" : "Inactivo",
      "JWT": jwtToken ? "Presente" : "Ausente", 
      "userData": userData
    });
    
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
    
    // Si no hay usuario Firebase pero sí hay JWT, podemos continuar igualmente
    // ya que las empresas se filtran por el ID de usuario en el backend
    if (!user && jwtToken) {
      console.log("Continuando con JWT sin autenticación de Firebase");
      
      try {
        // Obtener contadores
        const contadores = await FirestoreService.obtenerContadores();
        empresasCount.value = parseInt(contadores.empresasCount) || 0;
        departamentosCount.value = parseInt(contadores.departamentosCount) || 0;
        centrosCount.value = parseInt(contadores.centrosCount) || 0;
        formacionesCount.value = parseInt(contadores.formacionesCount) || 0;
        
        // Obtener empresas usando solo el JWT
        const empresasRecibidas = await FirestoreService.obtenerEmpresas();
        empresas.value = empresasRecibidas;
        
        cargando.value = false;
        return;
      } catch (err) {
        console.error("Error al cargar datos con solo JWT:", err);
        // Continuamos con el flujo normal para intentar otra estrategia
      }
    }
    
    // Si no hay token JWT, mostrar error
    if (!jwtToken) {
      console.error("HomeView - No hay JWT");
      
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
    
    // Si hay usuario de Firebase, filtrar por su UID
    if (user) {
      // Triple verificación: solo mostrar empresas del usuario actual
      empresas.value = empresasRecibidas.filter(empresa => {
        const perteneceAlUsuario = empresa.creadoPor === user.uid;
        if (!perteneceAlUsuario) {
          console.warn(`⚠️ SEGURIDAD: Se detectó empresa que no pertenece al usuario actual: ${empresa.nombre}`);
        }
        return perteneceAlUsuario;
      });
    } else {
      // Si no hay usuario Firebase pero llegamos aquí, mostrar todas las empresas recibidas
      // ya que el backend ya filtrará por el JWT
      empresas.value = empresasRecibidas;
    }
    
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

// Función para formatear el tipo de formación
const formatTipoFormacion = (tipo) => {
  switch (tipo) {
    case 'presencial':
      return 'Presencial';
    case 'virtual':
      return 'Virtual';
    case 'hibrida':
      return 'Híbrida';
    default:
      return tipo;
  }
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

const pdfPreviewUrl = ref('');
const pdfBytes = ref(null);
const showPDFPreview = ref(false);

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
      const pdfBytesData = await PDFService.generarInformeEmpresa(empresaActual);
      // Guardar los bytes para la descarga posterior
      pdfBytes.value = pdfBytesData;
      
      // Intentar crear URL para previsualización
      try {
        // Crear blob y url
        const blob = new Blob([pdfBytesData], { type: 'application/pdf' });
        pdfPreviewUrl.value = URL.createObjectURL(blob);
        
        // Mostrar el modal de previsualización
        showPDFPreview.value = true;
      } catch (previewError) {
        console.error("Error al crear previsualización, descargando directamente:", previewError);
        
        // Si falla la previsualización, descargar directamente
        PDFService.guardarPDF(pdfBytesData, `informe_${empresaActual.nombre.replace(/\s+/g, '_')}.pdf`);
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
    // Comprobar si ya tenemos los bytes del PDF
    if (pdfBytes.value && pdfBytes.value.length > 0) {
      // Usar los bytes ya generados para descargar
      PDFService.guardarPDF(pdfBytes.value, `informe_${empresaActual.nombre.replace(/\s+/g, '_')}.pdf`);
      
      // Limpiar después de la descarga
      URL.revokeObjectURL(pdfPreviewUrl.value);
      pdfPreviewUrl.value = null;
      pdfBytes.value = null;
      showPDFPreview.value = false;
      
      return;
    }
    
    // Si no tenemos bytes, generar el PDF nuevamente
    guardando.value = true;
    
    try {
      const pdfBytesData = await PDFService.generarInformeEmpresa(empresaActual);
      PDFService.guardarPDF(pdfBytesData, `informe_${empresaActual.nombre.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error("Error al generar o descargar el PDF:", error);
      alert("No se pudo descargar el PDF. Por favor, inténtelo de nuevo más tarde.");
    } finally {
      guardando.value = false;
      
      // Cerrar modales
      showPDFPreview.value = false;
      showViewModal.value = false;
    }
  } catch (error) {
    console.error("Error inesperado al descargar el PDF:", error);
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

// Función para descargar el PDF desde la previsualization
const descargarPDFPreview = () => {
  if (pdfBytes.value) {
    PDFService.guardarPDF(pdfBytes.value, `informe_${empresaActual.nombre.replace(/\s+/g, '_')}.pdf`);
  } else {
    console.error('No hay datos de PDF para descargar');
    alert('Error: No hay datos de PDF disponibles para descargar');
  }
};

// La funcionalidad de edición en Canva ha sido reemplazada por la generación directa de PDF con html2pdf

// Función para abrir el chatbot
const openChatbot = () => {
  // Usar un evento personalizado para comunicarse con el componente ChatbotAssistant
  window.dispatchEvent(new CustomEvent('toggle-chatbot'));
};

// Arrays para controlar las animaciones de entrada
const departamentosAnimados = ref([]);
const centrosAnimados = ref([]);
const formacionesAnimados = ref([]);

// Inicializar arrays al agregar nuevos elementos
watch(() => nuevaEmpresa.departamentos.length, (newLength) => {
  while (departamentosAnimados.value.length < newLength) {
    departamentosAnimados.value.push(false);
  }
});

watch(() => nuevaEmpresa.centros.length, (newLength) => {
  while (centrosAnimados.value.length < newLength) {
    centrosAnimados.value.push(false);
  }
});

watch(() => nuevaEmpresa.formaciones.length, (newLength) => {
  while (formacionesAnimados.value.length < newLength) {
    formacionesAnimados.value.push(false);
  }
});

// Estado de autenticación
const isAdmin = ref(true); // Temporalmente true para ver el debugger

// Agregar después de las funciones existentes
const importarArchivo = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    importando.value = true;
    let empresas;

    if (file.name.endsWith('.csv')) {
      empresas = await FileImportService.importFromCSV(file);
    } else if (file.name.endsWith('.json')) {
      empresas = await FileImportService.importFromJSON(file);
    } else {
      throw new Error('Formato de archivo no soportado. Use .csv o .json');
    }

    const ids = await FileImportService.guardarEmpresasImportadas(empresas);
    await cargarDatos();
    
    // Mostrar confirmación después de cargar los datos
    resultadoImportacion.value = {
      exitoso: true,
      mensaje: `Se importaron ${ids.length} empresas correctamente`,
      detalles: empresas.map(e => e.nombre)
    };
    mostrarConfirmacionImportacion.value = true;
  } catch (error) {
    resultadoImportacion.value = {
      exitoso: false,
      mensaje: 'Error al importar empresas',
      detalles: error.message
    };
    mostrarConfirmacionImportacion.value = true;
  } finally {
    importando.value = false;
    event.target.value = ''; // Resetear el input
  }
};
</script>

<style src="../assets/Home.css"></style>

<style>
/* Estilos del banner al estilo Apple */
.alicante-banner-showcase {
  background: linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(240,240,247,0.9) 100%);
  border-radius: 18px;
  margin: 20px 0 40px;
  padding: 0;
  overflow: hidden;
  position: relative;
  box-shadow: 0 20px 40px -10px rgba(0,0,0,0.05), 
              0 1px 3px rgba(0,0,0,0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  transition: transform 0.5s ease, box-shadow 0.5s ease;
}

.alicante-banner-showcase:hover {
  transform: translateY(-5px);
  box-shadow: 0 30px 60px -12px rgba(0,0,0,0.1),
              0 4px 25px -2px rgba(0,0,0,0.06),
              0 2px 6px rgba(0,0,0,0.1);
}

.banner-content {
  display: flex;
  align-items: center;
  padding: 40px;
  position: relative;
  z-index: 2;
}

.banner-image-container {
  flex: 0 0 40%;
  position: relative;
  transform-style: preserve-3d;
  perspective: 1000px;
}

.banner-image {
  width: 100%;
  border-radius: 12px;
  transform: translateZ(20px) rotateY(-5deg);
  box-shadow: 0 15px 35px rgba(0,0,0,0.1);
  transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.alicante-banner-showcase:hover .banner-image {
  transform: translateZ(40px) rotateY(-8deg);
}

.image-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), transparent 70%);
  opacity: 0;
  transition: opacity 0.6s ease;
  pointer-events: none;
}

.alicante-banner-showcase:hover .image-glow {
  opacity: 0.8;
}

.banner-info {
  flex: 1;
  padding-left: 40px;
  transform: translateZ(0);
  transition: transform 0.4s ease;
}

.alicante-banner-showcase:hover .banner-info {
  transform: translateZ(10px);
}

.banner-info h3 {
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 15px;
  background: linear-gradient(90deg, #007AFF, #34AADC);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.5px;
}

.banner-info p {
  font-size: 16px;
  line-height: 1.6;
  color: #000000;
  margin-bottom: 25px;
  max-width: 90%;
  font-weight: 500;
}

.banner-action {
  margin-top: 20px;
}

.btn-apple {
  background: linear-gradient(90deg, #007AFF, #34AADC);
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 500;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  box-shadow: 0 5px 15px rgba(0, 122, 255, 0.3);
}

.btn-apple:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 122, 255, 0.4);
}

.btn-apple .arrow {
  margin-left: 8px;
  transition: transform 0.3s ease;
}

.btn-apple:hover .arrow {
  transform: translateX(4px);
}

.banner-accent-shapes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  overflow: hidden;
  pointer-events: none;
}

.accent-shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.4;
  background: linear-gradient(135deg, #007AFF, #34AADC);
  filter: blur(40px);
}

.shape-1 {
  width: 300px;
  height: 300px;
  top: -150px;
  right: -100px;
  animation: float-slow 10s ease-in-out infinite alternate;
}

.shape-2 {
  width: 200px;
  height: 200px;
  bottom: -100px;
  left: 40%;
  background: linear-gradient(135deg, #5856D6, #AF52DE);
  animation: float-slow 7s ease-in-out infinite alternate-reverse;
}

.shape-3 {
  width: 150px;
  height: 150px;
  top: 40%;
  left: -50px;
  background: linear-gradient(135deg, #FF9500, #FF2D55);
  animation: float-slow 12s ease-in-out infinite alternate;
}

@keyframes float-slow {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(20px, 20px);
  }
}

/* Estilos para modales al estilo Apple */
.apple-modal {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.2), 
              0 0 1px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.5);
  overflow: hidden;
  position: relative;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform: translateY(0);
  max-height: 90vh;
  max-width: 900px;
  width: 90%;
}

.apple-modal:hover {
  box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.25),
              0 0 1px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
}

.modal-accent-shapes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
  opacity: 0.5;
  pointer-events: none;
}

.modal-accent-shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.3;
  filter: blur(60px);
}

.modal-accent-shape.shape-1 {
  width: 400px;
  height: 400px;
  top: -200px;
  right: -200px;
  background: var(--primary-gradient);
  animation: float-very-slow 30s ease-in-out infinite alternate;
}

.modal-accent-shape.shape-2 {
  width: 300px;
  height: 300px;
  bottom: -150px;
  left: 30%;
  background: linear-gradient(135deg, #00c3ff, #00ff8c);
  animation: float-very-slow 20s ease-in-out infinite alternate-reverse;
}

.modal-accent-shape.shape-3 {
  width: 200px;
  height: 200px;
  top: 30%;
  left: -100px;
  background: linear-gradient(225deg, #00c3ff, #00ff8c);
  animation: float-very-slow 25s ease-in-out infinite alternate;
}

@keyframes float-very-slow {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(30px, 30px);
  }
}

.apple-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 30px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  position: relative;
  z-index: 1;
}

.modal-title-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.modal-icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-gradient);
  width: 40px;
  height: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 195, 255, 0.2);
}

.modal-icon {
  font-size: 20px;
  color: white;
}

.apple-modal-header h2 {
  font-size: 22px;
  font-weight: 600;
  margin: 0;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.5px;
}

.apple-btn-close {
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background: rgba(0, 0, 0, 0.05);
  color: #666;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.apple-btn-close:hover {
  background: rgba(0, 0, 0, 0.1);
  transform: scale(1.1);
}

.apple-btn-close span {
  font-size: 20px;
  line-height: 1;
}

.apple-modal-body {
  padding: 30px;
  position: relative;
  z-index: 1;
  overflow-y: auto;
  max-height: calc(90vh - 80px);
}

.apple-saving-overlay {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  z-index: 10;
}

.apple-saving-overlay p {
  font-size: 18px;
  color: #333;
  font-weight: 500;
}

.apple-spinner {
  display: flex;
  gap: 8px;
}

.apple-spinner-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--primary-gradient);
  animation: apple-spinner 1.2s infinite ease-in-out;
}

.apple-spinner-dot.dot-1 {
  animation-delay: 0s;
}

.apple-spinner-dot.dot-2 {
  animation-delay: 0.2s;
}

.apple-spinner-dot.dot-3 {
  animation-delay: 0.4s;
}

@keyframes apple-spinner {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.apple-form {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.apple-form-section {
  background: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.apple-form-section:hover {
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.apple-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 0 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.apple-add-btn {
  background: var(--primary-gradient);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(0, 195, 255, 0.3);
}

.apple-add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 195, 255, 0.4);
}

.add-icon {
  font-size: 16px;
  font-weight: bold;
}

.apple-cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 10px;
}

.apple-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.03);
}

.apple-card.card-enter {
  animation: card-enter 0.4s cubic-bezier(0.215, 0.61, 0.355, 1);
}

@keyframes card-enter {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.apple-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.08);
}

.apple-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.apple-card-header h4 {
  margin: 0;
  font-size: 16px;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 500;
}

.apple-delete-btn {
  width: 28px;
  height: 28px;
  border-radius: 14px;
  border: none;
  background: rgba(255, 59, 48, 0.1);
  color: #FF3B30;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.apple-delete-btn:hover {
  background: rgba(255, 59, 48, 0.2);
  transform: scale(1.1);
}

.delete-icon {
  font-size: 18px;
  line-height: 1;
}

.apple-form-group {
  margin-bottom: 16px;
}

.apple-form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #000000;
}

.apple-input-container {
  position: relative;
}

.apple-input, .apple-select {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.2s ease;
  background: rgba(255, 255, 255, 0.9);
  color: #333;
}

.apple-textarea {
  min-height: 80px;
  resize: vertical;
}

.apple-input:focus, .apple-select:focus {
  outline: none;
  border-color: #00c3ff;
  box-shadow: 0 0 0 3px rgba(0, 195, 255, 0.15);
}

.input-focus-effect {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: var(--primary-gradient);
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.apple-input:focus ~ .input-focus-effect, 
.apple-select:focus ~ .input-focus-effect {
  width: 100%;
}

.apple-select-container {
  position: relative;
}

.select-arrow {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  width: 10px;
  height: 10px;
  border-right: 2px solid #999;
  border-bottom: 2px solid #999;
  pointer-events: none;
  transform: translateY(-50%) rotate(45deg);
}

.apple-select {
  appearance: none;
  padding-right: 30px;
}

.apple-form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 20px;
}

.apple-btn-cancel {
  padding: 12px 20px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.05);
  color: #666;
  border: none;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.apple-btn-cancel:hover {
  background: rgba(0, 0, 0, 0.1);
}

.apple-btn-save {
  background: var(--primary-gradient);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 195, 255, 0.3);
}

.apple-btn-save:hover:not([disabled]) {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 195, 255, 0.4);
}

.apple-btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-icon {
  font-size: 16px;
}

/* Responsive styles */
@media (max-width: 768px) {
  .apple-cards-container {
    grid-template-columns: 1fr;
  }
  
  .apple-form-actions {
    flex-direction: column-reverse;
  }
  
  .apple-btn-cancel, .apple-btn-save {
    width: 100%;
    justify-content: center;
  }
}

/* Estilos adicionales para los modales de confirmación y vista */
.apple-modal-confirm {
  max-width: 500px;
}

.delete-icon-container {
  background: linear-gradient(135deg, #FF3B30, #FF9500);
}

.confirm-message {
  font-size: 16px;
  line-height: 1.6;
  color: white;
  margin-bottom: 10px;
  text-align: center;
}

.warning-text {
  color: #FF3B30;
  text-align: center;
  font-size: 14px;
  margin-bottom: 30px;
}

.apple-btn-delete {
  background: linear-gradient(to right, #FF3B30, #FF9500);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(255, 59, 48, 0.3);
}

.apple-btn-delete:hover:not([disabled]) {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(255, 59, 48, 0.4);
}

.apple-btn-delete:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Estilos para el modal de vista */
.apple-modal-view {
  max-width: 1000px;
}

.view-icon-container {
  background: var(--primary-gradient);
}

.view-modal-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.apple-action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.edit-btn {
  background: rgba(0, 195, 255, 0.1);
  color: #00c3ff;
}

.edit-btn:hover {
  background: rgba(0, 195, 255, 0.2);
  transform: translateY(-2px);
}

.pdf-btn {
  background: rgba(255, 69, 58, 0.1);
  color: #FF3B30;
}

.pdf-btn:hover {
  background: rgba(255, 69, 58, 0.2);
  transform: translateY(-2px);
}

.action-icon {
  font-size: 16px;
}

.apple-view-sections {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.apple-view-section {
  background: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.apple-view-section:hover {
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.view-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 0 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.view-section-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.view-section-badge {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--primary-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 195, 255, 0.2);
  color: white;
}

.blue-badge {
  background: var(--primary-gradient);
}

.purple-badge {
  background: linear-gradient(135deg, #00c3ff, #00e1a0);
}

.orange-badge {
  background: linear-gradient(135deg, #00e1a0, #00ff8c);
}

.badge-icon {
  font-size: 16px;
}

.apple-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.wide-item {
  grid-column: 1 / -1;
}

.info-label {
  font-size: 13px;
  color: #666;
  font-weight: 500;
}

.info-value {
  font-size: 16px;
  color: #333;
  background: rgba(255, 255, 255, 0.5);
  padding: 10px;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.info-value.description {
  line-height: 1.6;
  white-space: pre-line;
}

.empty-message {
  text-align: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  color: #666;
  font-style: italic;
}

.apple-cards-view {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 10px;
}

.apple-view-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.03);
}

.apple-view-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.08);
}

.view-card-header {
  background: linear-gradient(to right, rgba(0, 195, 255, 0.1), rgba(0, 255, 140, 0.1));
  padding: 15px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.view-card-header h4 {
  margin: 0;
  font-size: 16px;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 500;
}

.view-card-content {
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.tipo-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 500;
}

.tipo-presencial {
  background-color: rgba(0, 195, 255, 0.2);
  color: #00c3ff;
}

.tipo-virtual {
  background-color: rgba(0, 231, 160, 0.2);
  color: #00e1a0;
}

.tipo-hibrida {
  background-color: rgba(0, 255, 140, 0.2);
  color: #00ff8c;
}

/* Responsive styles */
@media (max-width: 768px) {
  .view-modal-actions {
    flex-wrap: wrap;
  }
  
  .apple-cards-view {
    grid-template-columns: 1fr;
  }
  
  .apple-info-grid {
    grid-template-columns: 1fr;
  }
}

/* Estilos para las estrellas brillantes */
.stars-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  overflow: hidden;
  pointer-events: none;
}

.star {
  position: absolute;
  width: 2px;
  height: 2px;
  background: #fff;
  border-radius: 50%;
  opacity: 0.5;
  animation: twinkle 1s infinite ease-in-out;
}

@keyframes twinkle {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: transparent;
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  transition: all 0.3s ease;
  overflow: hidden;
}

.navbar::before {
  content: none;
}

.text-success {
  color: #4CAF50;
}

.text-error {
  color: #f44336;
}

.detalles-importacion {
  margin-top: 1rem;
  max-height: 200px;
  overflow-y: auto;
}

.detalles-importacion h3 {
  margin-bottom: 0.5rem;
  color: var(--primary-color);
}

.detalles-importacion ul {
  list-style-type: none;
  padding: 0;
}

.detalles-importacion li {
  padding: 0.5rem;
  color: white;
}

.detalles-importacion li:last-child {
  border-bottom: none;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-overlay .spinnerContainer {
  background: transparent;
  box-shadow: none;
}

.loading-overlay .loader {
  color: white;
}

.loading-overlay .words {
  color: white;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.text-success {
  color: #4CAF50;
}

.text-error {
  color: #f44336;
}

.detalles-importacion {
  margin-top: 1rem;
  max-height: 200px;
  overflow-y: auto;
}

.detalles-importacion h3 {
  margin-bottom: 0.5rem;
  color: var(--primary-color);
}

.detalles-importacion ul {
  list-style-type: none;
  padding: 0;
}

.detalles-importacion li {
  padding: 0.5rem;
  color: white;
}
</style>