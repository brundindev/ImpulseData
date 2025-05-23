<template>
  <div class="home-page">
    <AnimatedBackground />
    <div class="dashboard-container">
      <DashboardHeader 
        :usuario="usuario"
        :importando="importando"
        :error-importacion="errorImportacion"
        @create-company="showFormModal = true; modoEdicion = false;"
        @file-selected="importarArchivo"
        v-scroll-animate="'animate-left'"
      />
      <AlicanteBanner 
        v-scroll-animate="'animate-zoom'"
      />
      <!-- Contenido principal -->
      <div class="dashboard-content">
        <!-- Panel de estadísticas -->
        <StatsPanel 
          :empresasCount="empresasCount"
          :departamentosCount="departamentosCount"
          :centrosCount="centrosCount"
          :formacionesCount="formacionesCount"
          v-scroll-animate="'animate-up'"
        />
        
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
        <div v-else-if="error" class="error-container" v-scroll-animate="'animate-zoom'">
          <p>{{ error }}</p>
          <button @click="cargarDatos" class="btn btn-primary">Reintentar</button>
        </div>
        
        <!-- Lista de empresas -->
        <div v-else class="forms-section">
          <div class="section-title" v-scroll-animate="'animate-left'">
            <h2>Tus Empresas</h2>
          </div>
          <CompaniesList 
            :empresas="empresas"
            @create-company="() => { showFormModal = true; modoEdicion = false; }"
            @edit-company="(empresa) => { editarEmpresa(empresa); showFormModal = true; }"
            @view-company="(empresa) => { verEmpresa(empresa); showViewModal = true; }"
            @delete-company="confirmarEliminar"
          />
        </div>
      </div>
      <!-- Modal para crear/editar empresa -->
      <CompanyFormModal
        :show="showFormModal"
        :is-editing="modoEdicion"
        :company="nuevaEmpresa"
        :saving="guardando"
        @close="showFormModal = false"
        @submit="guardarEmpresa"
      />
      
      <!-- Modal de confirmación para eliminar -->
      <teleport to="body">
      <div class="modal-overlay" v-if="mostrarConfirmacion" @click.self="mostrarConfirmacion = false">
        <div class="modal-container modal-small apple-modal apple-modal-confirm" v-scroll-animate="'animate-zoom'">
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
              <button class="apple-action-btn pdf-btn" @click="irAPaginaPDF()">
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
                
                <div v-if="!empresaActual.departamentos || empresaActual.departamentos.length === 0" class="empty-message" v-scroll-animate="'animate-up'">
                  No hay departamentos registrados
                </div>
                
                <div v-else class="apple-cards-view">
                  <div 
                    v-for="(departamento, index) in empresaActual.departamentos" 
                    :key="index"
                    class="apple-view-card"
                    v-scroll-animate:100="'animate-right'"
                    :style="{ 'animation-delay': `${index * 0.1}s` }"
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
                
                <div v-if="!empresaActual.centros || empresaActual.centros.length === 0" class="empty-message" v-scroll-animate="'animate-up'">
                  No hay centros registrados
                </div>
                
                <div v-else class="apple-cards-view">
                  <div 
                    v-for="(centro, index) in empresaActual.centros" 
                    :key="index"
                    class="apple-view-card"
                    v-scroll-animate:150="'animate-left'"
                    :style="{ 'animation-delay': `${index * 0.1}s` }"
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
                
                <div v-if="!empresaActual.formaciones || empresaActual.formaciones.length === 0" class="empty-message" v-scroll-animate="'animate-up'">
                  No hay formaciones registradas
                </div>
                
                <div v-else class="apple-cards-view">
                  <div 
                    v-for="(formacion, index) in empresaActual.formaciones" 
                    :key="index"
                    class="apple-view-card"
                    v-scroll-animate:200="'animate-up'"
                    :style="{ 'animation-delay': `${index * 0.1}s` }"
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
    <AppFooter />
  </div>
  
  <!-- Modal para previsualizar PDF -->

  <!-- Modal de confirmación de importación -->
  <ImportConfirmationModal
    :show="mostrarConfirmacionImportacion"
    :resultado="resultadoImportacion"
    @close="mostrarConfirmacionImportacion = false"
  />

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
import AnimatedBackground from '../components/AnimatedBackground.vue';
import AnimatedNumber from '../components/AnimatedNumber.vue';
import ScrollAnimation from '../components/ScrollAnimation.vue';
import AlicanteBanner from '../components/home/AlicanteBanner.vue';
import StatsPanel from '../components/home/StatsPanel.vue';
import CompaniesList from '../components/home/CompaniesList.vue';
import CompanyFormModal from '@/components/home/CompanyFormModal.vue';
import AppFooter from '../components/home/AppFooter.vue';
import GeminiButton from '../components/GeminiButton.vue';
import DashboardHeader from '../components/home/DashboardHeader.vue';
// Importar PDFService
import PDFService from '../services/PDFService';
// Importar el logo e imágenes
import logoUrl from '../assets/img/logo_impulsedata.jpg';
import impulsaAlicanteLogo from '../assets/img/impulsaalicante.png';
import ayuntamientoLogo from '../assets/img/ayuntamiento-alicante.jpg';
import FileImportService from '../services/FileImportService';
import {
  cargarDatos,
  cargando,
  error,
  empresas,
  empresasCount,
  departamentosCount,
  centrosCount,
  formacionesCount
} from '../services/DataService';
import ImportConfirmationModal from '@/components/home/ImportConfirmationModal.vue';
import EmpresaService from '../services/EmpresaService';

import { usePdfNavigator } from '../services/usePdfNavigator';
import { useEmpresaViewer } from '../services/useEmpresaViewer';
import { useWordDownloader } from '../services/useWordDownloader';
const router = useRouter();
const auth = getAuth();
const usuario = ref(null);
const showFormModal = ref(false);
const showViewModal = ref(false);
const { verEmpresa } = useEmpresaViewer(showViewModal);
const guardando = ref(false);
const mostrarConfirmacion = ref(false);
const empresaAEliminar = ref(null);
const eliminando = ref(false);
const modoEdicion = ref(false);
const empresaEditandoId = ref(null);

// Reemplazar las variables reactivas existentes
const nuevaEmpresa = EmpresaService.nuevaEmpresa;
const empresaActual = EmpresaService.empresaActual;
const { descargarWord } = useWordDownloader(empresaActual);
const { irAPaginaPDF } = usePdfNavigator(showViewModal, empresaActual);

// Reemplazar las funciones existentes
const resetearFormulario = () => EmpresaService.resetearFormulario();

const guardarEmpresa = async (empresaData) => {
  try {
    guardando.value = true;
    await EmpresaService.guardarEmpresa(empresaData, modoEdicion.value, empresaEditandoId.value);
    await cargarDatos();
    showFormModal.value = false;
    resetearFormulario();
  } catch (err) {
    console.error('Error al guardar empresa:', err);
    error.value = modoEdicion.value ? 
      'No se pudo actualizar la empresa. Por favor, inténtalo de nuevo.' : 
      'No se pudo guardar la empresa. Por favor, inténtalo de nuevo.';
  } finally {
    guardando.value = false;
  }
};

const editarEmpresa = async (empresa) => {
  modoEdicion.value = true;
  empresaEditandoId.value = empresa.id;
  
  // Asignar datos básicos a nuevaEmpresa
  Object.assign(EmpresaService.nuevaEmpresa, {
    nombre: empresa.nombre || '',
    fechaCreacion: empresa.fechaCreacion || '',
    descripcion: empresa.descripcion || '',
    ciudad: empresa.ciudad || '',
    departamentos: [],
    centros: [],
    formaciones: []
  });
  
  try {
    await EmpresaService.cargarSubcolecciones(empresa.id);
    showFormModal.value = true;
  } catch (err) {
    console.error("Error al preparar datos para edición:", err);
    error.value = "No se pudieron cargar los datos para edición. Por favor, inténtalo de nuevo.";
  }
};


const eliminarEmpresa = async () => {
  if (!empresaAEliminar.value) return;
  
  try {
    eliminando.value = true;
    await EmpresaService.eliminarEmpresa(empresaAEliminar.value.id);
    await cargarDatos();
    mostrarConfirmacion.value = false;
    empresaAEliminar.value = null;
  } catch (err) {
    console.error('Error al eliminar empresa:', err);
    error.value = 'No se pudo eliminar la empresa. Por favor, inténtalo de nuevo.';
  } finally {
    eliminando.value = false;
  }
};

// Reemplazar las funciones de formateo
const formatTipoFormacion = (tipo) => EmpresaService.formatTipoFormacion(tipo);
const formatDate = (date) => EmpresaService.formatDate(date);

onMounted(() => {
    cargarDatos();
// Verificar estado de autenticación
  onAuthStateChanged(auth, (user) => {
    if (user) {
      usuario.value = AuthService.getCurrentUser();
      cargarDatos();
    } else {
      // Si no hay usuario, redirigir al login
      router.push('/login');
    }
  
  document.body.classList.add('home-bg-black');
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

  document.body.classList.remove('home-bg-black');
});

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

// Función para previsualizar un PDF con manejo de errores mejorado
const previsualizarPDF = () => {
  try {
    // Cerrar el modal de vista
    showViewModal.value = false;
    
    // Almacenar los datos de la empresa actual en localStorage para recuperarlos en la página PDF
    localStorage.setItem('empresa_pdf', JSON.stringify(empresaActual));
    
    // Redirigir a la página /pdf
    router.push('/pdf');
  } catch (error) {
    console.error("Error al redirigir a la página PDF:", error);
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

// Función para ir a la página de PDF

const confirmarEliminar = (empresa) => {
  empresaAEliminar.value = empresa;
  mostrarConfirmacion.value = true;
};

// Función para aplicar animaciones a las tarjetas de empresas
const applyCompanyCardAnimations = () => {
  const companyCards = document.querySelectorAll('.company-card');
  if (companyCards.length > 0) {
    companyCards.forEach((card, index) => {
      // Añadir clase para el selector de la directiva
      card.classList.add('scroll-animate-hidden');
      
      // Asegurar que el elemento sea interactivo desde el principio
      card.style.visibility = 'visible';
      card.style.pointerEvents = 'auto';
      
      // Configurar opciones de Intersection Observer
      const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
      };
      
      // Callback cuando la tarjeta es visible
      const onIntersect = (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Añadir un retraso escalonado basado en el índice
            setTimeout(() => {
              card.classList.add('animate-in');
              card.classList.add('company-card-animated');
            }, 100 * index);
            
            // Dejar de observar este elemento
            observer.unobserve(card);
          }
        });
      };
      
      // Crear y aplicar el observer
      const observer = new IntersectionObserver(onIntersect, options);
      observer.observe(card);
    });
  }
};

// Función para aplicar animaciones a las tarjetas de estadísticas
const applyStatCardAnimations = () => {
  const statCards = document.querySelectorAll('.stat-card');
  if (statCards.length > 0) {
    statCards.forEach((card, index) => {
      card.classList.add('scroll-animate-hidden');
      
      // Asegurar que el elemento sea interactivo desde el principio
      card.style.visibility = 'visible';
      card.style.pointerEvents = 'auto';
      
      const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
      };
      
      const onIntersect = (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              card.classList.add('animate-in');
              card.classList.add('stat-card-animated');
            }, 150 * index);
            
            observer.unobserve(card);
          }
        });
      };
      
      const observer = new IntersectionObserver(onIntersect, options);
      observer.observe(card);
    });
  }
};

// Observar cuando las empresas cambian para aplicar animaciones
watch(() => empresas.value, () => {
  // Permitir scroll inmediato sin esperar animaciones
  document.body.style.overflowY = 'auto';
  document.documentElement.style.overflowY = 'auto';
  
  // Esperar a que el DOM se actualice
  setTimeout(() => {
    applyCompanyCardAnimations();
  }, 100);
}, { deep: true });

// Aplicar animaciones adicionales cuando el componente se monta
onMounted(() => {
  // Permitir scroll inmediato sin esperar animaciones
  document.body.style.overflowY = 'auto';
  document.documentElement.style.overflowY = 'auto';
  
  // Aplicar animaciones a las estadísticas
  setTimeout(() => {
    applyStatCardAnimations();
  }, 200);
  
  // Escuchar eventos de scroll para animar elementos según se necesite
  window.addEventListener('scroll', () => {
    applyCompanyCardAnimations();
    applyStatCardAnimations();
  });
  
  // Resto del código de onMounted...
  // ... existing code ...
});

// Limpiar event listeners cuando el componente se desmonta
onUnmounted(() => {
  window.removeEventListener('scroll', () => {
    applyCompanyCardAnimations();
    applyStatCardAnimations();
  });
  
  // Resto del código de onUnmounted...
  // ... existing code ...
});
</script>

<style src="../assets/Home.css"></style>

<style>
/* Eliminar cualquier background que pueda estar interfiriendo */
.home-page {
  min-height: 100vh;
  width: 100vw;
  position: relative;
  background: transparent !important;
}

.dashboard-container {
  min-height: 100vh;
  width: 100%;
  padding: 2rem;
  position: relative;
  background: transparent !important;
  color: white;
  z-index: 1;
}

.dashboard-content {
  position: relative;
  z-index: 1;
  background: transparent !important;
}

/* Asegurarse de que el contenido ocupe todo el espacio */
.row {
  margin: 0;
  min-height: calc(100vh - 4rem);
  background: transparent !important;
}

/* Añadir estilos específicos para el HomeView */
.section-title {
  margin-bottom: 20px;
  position: relative;
}

.section-title h2 {
  color: #ffffff;
  font-size: 1.8rem;
  position: relative;
  display: inline-block;
}

.section-title h2::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0;
  height: 3px;
  background: linear-gradient(90deg, #ffffff, #e91e63);
  transition: width 0.8s ease;
}

.section-title.animate-in h2::after {
  width: 100%;
}

/* Estilos para las animaciones de las tarjetas */
.company-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.company-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(255, 255, 255, 0.1), 0 10px 15px rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.15) !important;
}

.company-card-animated {
  animation: pulse 2s infinite ease-in-out;
  animation-delay: 0.8s;
}

.stat-card-animated {
  animation: glow 3s infinite alternate;
  animation-delay: 0.8s;
}

@keyframes pulse {
  0% {
    box-shadow: 0 10px 25px rgba(255, 255, 255, 0.1), 0 5px 10px rgba(255, 255, 255, 0.1);
  }
  50% {
    box-shadow: 0 15px 30px rgba(255, 255, 255, 0.2), 0 8px 15px rgba(255, 255, 255, 0.2);
  }
  100% {
    box-shadow: 0 10px 25px rgba(255, 255, 255, 0.1), 0 5px 10px rgba(255, 255, 255, 0.1);
  }
}

@keyframes glow {
  from {
    box-shadow: 0 0 5px rgba(255, 255, 255, 0.2), 0 0 10px rgba(255, 255, 255, 0.2);
  }
  to {
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.3), 0 0 20px rgba(255, 255, 255, 0.3);
  }
}

/* Asegurarse de que las animaciones respetan la preferencia de movimiento reducido */
@media (prefers-reduced-motion: reduce) {
  .section-title h2::after {
    transition: none;
    width: 100%;
  }
  
  .company-card {
    transition: none;
  }
  
  .company-card:hover {
    transform: none;
  }
  
  .company-card-animated,
  .stat-card-animated {
    animation: none;
  }
}
</style>
