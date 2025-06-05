<template>
  <div class="home-page">
    <AnimatedBackground />
    <div class="dashboard-container">
      <div class="dashboard-header">
        <div class="welcome-section">
          <h1 class="welcome-title">Memoria Anual</h1>
          <p class="welcome-subtitle">Gestión y seguimiento de la memoria anual</p>
        </div>
      </div>

      <div class="secciones-grid">
        <!-- AGENCIA LOCAL -->
        <div class="seccion-card company-card" :class="{ 'completa': secciones.agenciaLocal.completa, 'parcial': secciones.agenciaLocal.parcial }" v-scroll-animate:150="'animate-in'">
          <div class="seccion-header">
            <h2>Agencia Local de Desarollo Económico y Social</h2>
            <div class="estado-indicador">
              <span v-if="secciones.agenciaLocal.completa" class="check">✓</span>
              <span v-else-if="secciones.agenciaLocal.parcial" class="parcial">-</span>
            </div>
          </div>
          <div class="seccion-content">
            <p>Gestión y coordinación de la agencia local</p>
            <button @click="abrirFormulario('agenciaLocal')" class="btn-llenar">
              {{ secciones.agenciaLocal.completa ? 'Editar' : 'Rellenar' }}
            </button>
          </div>
        </div>

        <!-- DEPARTAMENTO DE EMPLEO Y FORMACIÓN -->
        <div class="seccion-card company-card" :class="{ 'completa': secciones.empleoFormacion.completa, 'parcial': secciones.empleoFormacion.parcial }" v-scroll-animate:150="'animate-in'" style="animation-delay: 0.15s">
          <div class="seccion-header">
            <h2>Departamento de Empleo y Formación</h2>
            <div class="estado-indicador">
              <span v-if="secciones.empleoFormacion.completa" class="check">✓</span>
              <span v-else-if="secciones.empleoFormacion.parcial" class="parcial">-</span>
            </div>
          </div>
          <div class="seccion-content">
            <p>Gestión de empleo y programas formativos</p>
            <button @click="abrirFormulario('empleoFormacion')" class="btn-llenar">
              {{ secciones.empleoFormacion.completa ? 'Editar' : 'Rellenar' }}
            </button>
          </div>
        </div>

        <!-- DEPARTAMENTO DE PROMOCIÓN ECONÓMICA -->
        <div class="seccion-card company-card" :class="{ 'completa': secciones.promocionEconomica.completa, 'parcial': secciones.promocionEconomica.parcial }" v-scroll-animate:150="'animate-in'" style="animation-delay: 0.3s">
          <div class="seccion-header">
            <h2>Departamento de Promoción Económica</h2>
            <div class="estado-indicador">
              <span v-if="secciones.promocionEconomica.completa" class="check">✓</span>
              <span v-else-if="secciones.promocionEconomica.parcial" class="parcial">-</span>
            </div>
          </div>
          <div class="seccion-content">
            <p>Promoción y desarrollo económico local</p>
            <button @click="abrirFormulario('promocionEconomica')" class="btn-llenar">
              {{ secciones.promocionEconomica.completa ? 'Editar' : 'Rellenar' }}
            </button>
          </div>
        </div>

        <!-- PROGRAMAS DE DESARROLLO LOCAL ESTRATÉGICO -->
        <div class="seccion-card company-card" :class="{ 'completa': secciones.desarrolloLocal.completa, 'parcial': secciones.desarrolloLocal.parcial }" v-scroll-animate:150="'animate-in'" style="animation-delay: 0.45s">
          <div class="seccion-header">
            <h2>Programas de Desarrollo Local Estratégico</h2>
            <div class="estado-indicador">
              <span v-if="secciones.desarrolloLocal.completa" class="check">✓</span>
              <span v-else-if="secciones.desarrolloLocal.parcial" class="parcial">-</span>
            </div>
          </div>
          <div class="seccion-content">
            <p>Programas estratégicos de desarrollo local</p>
            <button @click="abrirFormulario('desarrolloLocal')" class="btn-llenar">
              {{ secciones.desarrolloLocal.completa ? 'Editar' : 'Rellenar' }}
            </button>
          </div>
        </div>

        <!-- ÁREA DE GESTIÓN -->
        <div class="seccion-card" :class="{ 'completa': secciones.gestion.completa, 'parcial': secciones.gestion.parcial }">
          <div class="seccion-header">
            <h2>Área de Gestión</h2>
            <div class="estado-indicador">
              <span v-if="secciones.gestion.completa" class="check">✓</span>
              <span v-else-if="secciones.gestion.parcial" class="parcial">-</span>
            </div>
          </div>
          <div class="seccion-content">
            <p>Gestión administrativa y financiera</p>
            <button @click="abrirFormulario('gestion')" class="btn-llenar">
              {{ secciones.gestion.completa ? 'Editar' : 'Rellenar' }}
            </button>
          </div>
        </div>

        <!-- DEPARTAMENTO DE MARKETING Y COMUNICACIÓN -->
        <div class="seccion-card" :class="{ 'completa': secciones.marketing.completa, 'parcial': secciones.marketing.parcial }">
          <div class="seccion-header">
            <h2>Departamento de Marketing y Comunicación</h2>
            <div class="estado-indicador">
              <span v-if="secciones.marketing.completa" class="check">✓</span>
              <span v-else-if="secciones.marketing.parcial" class="parcial">-</span>
            </div>
          </div>
          <div class="seccion-content">
            <p>Marketing y estrategias de comunicación</p>
            <button @click="abrirFormulario('marketing')" class="btn-llenar">
              {{ secciones.marketing.completa ? 'Editar' : 'Rellenar' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <teleport to="body">
      <div v-if="mostrarFormulario" class="modal-overlay" @click.self="cerrarFormulario">
        <div class="modal-container apple-modal">
          <div class="modal-accent-shapes">
            <div class="modal-accent-shape shape-1"></div>
            <div class="modal-accent-shape shape-2"></div>
          </div>
          
          <div class="modal-header apple-modal-header">
            <div class="modal-title-wrapper">
              <div class="modal-icon-container">
                <span class="modal-icon">📝</span>
              </div>
              <h2>{{ tituloFormulario }}</h2>
            </div>
            <button class="btn-close apple-btn-close" @click="cerrarFormulario">×</button>
          </div>
          
          <!-- Barra de Progreso -->
          <div class="progress-bar">
            <div class="progress-steps">
              <div 
                v-for="(step, index) in pasosActuales" 
                :key="index"
                class="step"
                :class="{ 
                  'active': pasoActual >= index,
                  'completed': pasoActual > index
                }"
              >
                <span class="step-number">{{ index + 1 }}</span>
                <span class="step-title">{{ step.titulo }}</span>
              </div>
            </div>
            <div class="progress-line">
              <div 
                class="progress-fill"
                :style="{ width: `${(pasoActual / (pasosActuales.length - 1)) * 100}%` }"
              ></div>
            </div>
          </div>

          <!-- Contenido del Formulario -->
          <div class="form-content">
            <component 
              :is="pasosActuales[pasoActual].componente"
              v-model="datosFormulario"
              @siguiente="siguientePaso"
              @anterior="anteriorPaso"
              @guardar="guardarFormulario"
            />
          </div>
        </div>
      </div>
    </teleport>

    <teleport to="body">
      <SaveConfirmationModal
        :show="mostrarConfirmacion"
        @save="guardarProgreso"
        @discard="descartarFormulario"
      />
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { doc, collection, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import AnimatedBackground from '../components/AnimatedBackground.vue';
import ScrollAnimation from '../components/ScrollAnimation.vue';

// Importar estilos
import '../assets/variables.css';

// Importar componentes de Agencia Local
import AgenciaLocalGeneral from '../components/memoria/AgenciaLocal/AgenciaLocalGeneral.vue';
import AgenciaLocalQueHacemos from '../components/memoria/AgenciaLocal/AgenciaLocalQueHacemos.vue';
import AgenciaLocalEstructura from '../components/memoria/AgenciaLocal/AgenciaLocalEstructura.vue';
import AgenciaLocalSedes from '../components/memoria/AgenciaLocal/AgenciaLocalSedes.vue';

// Importar componentes de Empleo y Formación
import EmpleoFormacionDatos from '../components/memoria/EmpleoFormacion/EmpleoFormacionDatos.vue';
import EmpleoFormacionCentros from '../components/memoria/EmpleoFormacion/EmpleoFormacionCentros.vue';
import EmpleoFormacionServicios from '../components/memoria/EmpleoFormacion/EmpleoFormacionServicios.vue';
import EmpleoFormacionFormacion from '../components/memoria/EmpleoFormacion/EmpleoFormacionFormacion.vue';
import EmpleoFormacionProgramas from '../components/memoria/EmpleoFormacion/EmpleoFormacionProgramas.vue';
import EmpleoFormacionSubvenciones from '../components/memoria/EmpleoFormacion/EmpleoFormacionSubvenciones.vue';
import EmpleoFormacionOtros from '../components/memoria/EmpleoFormacion/EmpleoFormacionOtros.vue';

// Importar componentes de Promoción Económica
import PromocionEconomicaProgramas from '../components/memoria/PromocionEconomica/PromocionEconomicaProgramas.vue';
import PromocionEconomicaViveros from '../components/memoria/PromocionEconomica/PromocionEconomicaViveros.vue';
import PromocionEconomicaAyudasEconomicas from '../components/memoria/PromocionEconomica/PromocionEconomicaAyudasEconomicas.vue';
import PromocionEconomicaColaboracion from '../components/memoria/PromocionEconomica/PromocionEconomicaColaboracion.vue';
import PromocionEconomicaEmprendimiento from '../components/memoria/PromocionEconomica/PromocionEconomicaEmprendimiento.vue';

// Importar componentes de Desarrollo Local
import DesarrolloLocalPrograma from '../components/memoria/DesarrolloLocal/DesarrolloLocalPrograma.vue';
import DesarrolloLocalObservatorio from '../components/memoria/DesarrolloLocal/DesarrolloLocalObservatorio.vue';
import DesarrolloLocalAlicanteFutura from '../components/memoria/DesarrolloLocal/DesarrolloLocalAlicanteFutura.vue';
import DesarrolloLocalALIA from '../components/memoria/DesarrolloLocal/DesarrolloLocalALIA.vue';
import DesarrolloLocalCILAB from '../components/memoria/DesarrolloLocal/DesarrolloLocalCILAB.vue';
import DesarrolloLocalOficinaProyEuropeos from '../components/memoria/DesarrolloLocal/DesarrolloLocalOficinaProyEuropeos.vue';
import DesarrolloLocalParticipacion from '../components/memoria/DesarrolloLocal/DesarrolloLocalParticipacion.vue';

// Importar componentes de Gestión
import GestionAuditorio from '../components/memoria/Gestion/GestionAuditorio.vue';
import GestionJuridica from '../components/memoria/Gestion/GestionJuridica.vue';

// Importar componentes de Marketing
import MarketingWebRRSS from '../components/memoria/Marketing/MarketingWebRRSS.vue';
import MarketingCanales from '../components/memoria/Marketing/MarketingCanales.vue';
import MarketingCampañas from '../components/memoria/Marketing/MarketingCampañas.vue';

//Importar componente de confirmacion de guardado
import SaveConfirmationModal from '../components/memoria/SaveConfirmationModal.vue';

const router = useRouter();

// Estado de las secciones
const secciones = ref({
  agenciaLocal: { completa: false, parcial: false },
  empleoFormacion: { completa: false, parcial: false },
  promocionEconomica: { completa: false, parcial: false },
  desarrolloLocal: { completa: false, parcial: false },
  gestion: { completa: false, parcial: false },
  marketing: { completa: false, parcial: false }
});

// Estado del formulario
const mostrarFormulario = ref(false);
const seccionActual = ref('');
const pasoActual = ref(0);
const datosFormulario = ref({});
const mostrarConfirmacion = ref(false);

// Título del formulario actual
const tituloFormulario = computed(() => {
  const titulos = {
    agenciaLocal: 'Agencia Local',
    empleoFormacion: 'Departamento de Empleo y Formación',
    promocionEconomica: 'Departamento de Promoción Económica',
    desarrolloLocal: 'Programas de Desarrollo Local Estratégico',
    gestion: 'Área de Gestión',
    marketing: 'Departamento de Marketing y Comunicación'
  };
  return titulos[seccionActual.value] || '';
});

// Pasos del formulario actual
const pasosActuales = computed(() => {
  switch (seccionActual.value) {
    case 'agenciaLocal':
      return [
        { titulo: 'La agencia local en cifras', componente: AgenciaLocalGeneral },
        { titulo: 'Qué hacemos', componente: AgenciaLocalQueHacemos },
        { titulo: 'Cómo estamos organizados', componente: AgenciaLocalEstructura },
        { titulo: 'Dónde estamos', componente: AgenciaLocalSedes }
      ];
    case 'empleoFormacion':
      return [
        { titulo: 'Datos Totales', componente: EmpleoFormacionDatos },
        { titulo: 'Nuestros Centros', componente: EmpleoFormacionCentros },
        { titulo: 'Nuestros Servicios', componente: EmpleoFormacionServicios },
        { titulo: 'Formación', componente: EmpleoFormacionFormacion },
        { titulo: 'Programas y Proyectos', componente: EmpleoFormacionProgramas },
        { titulo: 'Subvenciones', componente: EmpleoFormacionSubvenciones },
        { titulo: 'Otros', componente: EmpleoFormacionOtros }
      ];
    case 'promocionEconomica':
      return [
        { titulo: 'Datos Totales', componente: PromocionEconomicaProgramas },
        { titulo: 'Programas de Fomento de Emprendimiento', componente: PromocionEconomicaViveros },
        { titulo: 'Viveros Empresariales', componente: PromocionEconomicaAyudasEconomicas },
        { titulo: ' Ayudas Económicas a Empresas de la ciudad de Alicante ', componente: PromocionEconomicaColaboracion },
        { titulo: 'Colaboración en eventos de emprendimiento y promoción empresarial', componente: PromocionEconomicaEmprendimiento }
      ];
    case 'desarrolloLocal':
      return [
        { titulo: 'Programa de dinamización de Polígonos Industriales y Nuevos espacios productivos', componente: DesarrolloLocalPrograma },
        { titulo: 'Observatorio de Estrategias del Pacto Territorial por el empleo de la ciudad de Alicante', componente: DesarrolloLocalObservatorio },
        { titulo: 'Alicante Futura', componente: DesarrolloLocalAlicanteFutura },
        { titulo: 'Oficina de Atracción de Inversiones - OAI', componente: DesarrolloLocalALIA },
        { titulo: 'Proyecto CILAB Alicante Fase II', componente: DesarrolloLocalCILAB },
        { titulo: 'Oficina de Proyectos Europeos', componente: DesarrolloLocalOficinaProyEuropeos },
        { titulo: 'Participación en eventos y congresos', componente: DesarrolloLocalParticipacion }
      ];
    case 'gestion':
      return [
        { titulo: 'Auditorio', componente: GestionAuditorio },
        { titulo: 'Departamento Jurídico Administrativo', componente: GestionJuridica }
      ];
    case 'marketing':
      return [
        { titulo: 'Web y Redes Sociales', componente: MarketingWebRRSS },
        { titulo: 'Otros Canales Online', componente: MarketingCanales },
        { titulo: 'Campañas de Marketing y Publicidad', componente: MarketingCampañas }
      ];
    default:
      return [];
  }
});

// Funciones
const abrirFormulario = async (seccion) => {
  try {
    seccionActual.value = seccion;
    pasoActual.value = 0;
    
    // Usar el ID de Impulsalicante directamente
    const empresaId = 'Impulsalicante';

    // Intentar cargar datos desde Firebase
    const empresaRef = doc(db, 'empresas', empresaId);
    const docSnap = await getDoc(empresaRef);
    
    if (!docSnap.exists()) {
      // Si el documento no existe, crearlo con la estructura inicial
      await setDoc(empresaRef, {
        nombre: 'Impulsalicante',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        memoriaAnual: {
          agenciaLocal: { estado: 'pendiente' },
          empleoFormacion: { estado: 'pendiente' },
          promocionEconomica: { estado: 'pendiente' },
          desarrolloLocal: { estado: 'pendiente' },
          gestion: { estado: 'pendiente' },
          marketing: { estado: 'pendiente' }
        }
      });
    }
    
    // Cargar datos existentes o inicializar con datos vacíos
    const datosActuales = docSnap.exists() ? docSnap.data() : {};
    if (datosActuales.memoriaAnual && datosActuales.memoriaAnual[seccion]) {
      datosFormulario.value = datosActuales.memoriaAnual[seccion];
      secciones.value[seccion].completa = datosActuales.memoriaAnual[seccion].estado === 'completo';
      secciones.value[seccion].parcial = datosActuales.memoriaAnual[seccion].estado === 'parcial';
    } else {
      datosFormulario.value = {};
    }
    
    mostrarFormulario.value = true;
  } catch (error) {
    console.error('Error al cargar datos:', error);
  }
};

const cerrarFormulario = () => {
  if (Object.keys(datosFormulario.value).length > 0 && !secciones.value[seccionActual.value].completa) {
    mostrarConfirmacion.value = true;
  } else {
    mostrarFormulario.value = false;
    mostrarConfirmacion.value = false;
    seccionActual.value = '';
    pasoActual.value = 0;
    datosFormulario.value = {};
  }
};

const siguientePaso = () => {
  if (pasoActual.value < pasosActuales.value.length - 1) {
    pasoActual.value++;
  }
};

const anteriorPaso = () => {
  if (pasoActual.value > 0) {
    pasoActual.value--;
  }
};

const guardarFormulario = async () => {
  try {
    const empresaId = 'Impulsalicante';
    const empresaRef = doc(db, 'empresas', empresaId);
    
    // Verificar si el documento existe
    const docSnap = await getDoc(empresaRef);
    if (!docSnap.exists()) {
      // Si no existe, crear el documento con la estructura inicial
      await setDoc(empresaRef, {
        nombre: 'Impulsalicante',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        memoriaAnual: {}
      });
    }

    // Obtener los datos actuales
    const datosActuales = docSnap.exists() ? docSnap.data() : {};
    const memoriaAnualActual = datosActuales.memoriaAnual || {};

    // Preparar los datos para guardar, manteniendo los datos existentes
    const datosAGuardar = {
      [`memoriaAnual.${seccionActual.value}`]: {
        ...datosFormulario.value,
        fechaActualizacion: new Date().toISOString(),
        estado: 'completo'
      }
    };

    // Guardar en Firebase
    await updateDoc(empresaRef, datosAGuardar);
    
    // Actualizar estado de la sección
    secciones.value[seccionActual.value].completa = true;
    secciones.value[seccionActual.value].parcial = false;
    
    console.log('Datos guardados exitosamente en Firebase');
    cerrarFormulario();
  } catch (error) {
    console.error('Error al guardar:', error);
  }
};

const guardarProgreso = async () => {
  try {
    const empresaId = 'Impulsalicante';
    const empresaRef = doc(db, 'empresas', empresaId);
    
    // Verificar si el documento existe
    const docSnap = await getDoc(empresaRef);
    if (!docSnap.exists()) {
      // Si no existe, crear el documento con la estructura inicial
      await setDoc(empresaRef, {
        nombre: 'Impulsalicante',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        memoriaAnual: {}
      });
    }

    // Obtener los datos actuales
    const datosActuales = docSnap.exists() ? docSnap.data() : {};
    const memoriaAnualActual = datosActuales.memoriaAnual || {};

    // Preparar los datos para guardar, manteniendo los datos existentes
    const datosAGuardar = {
      [`memoriaAnual.${seccionActual.value}`]: {
        ...datosFormulario.value,
        fechaActualizacion: new Date().toISOString(),
        estado: 'parcial'
      }
    };

    // Guardar en Firebase
    await updateDoc(empresaRef, datosAGuardar);
    
    // Actualizar estado de la sección
    secciones.value[seccionActual.value].parcial = true;
    secciones.value[seccionActual.value].completa = false;
    
    console.log('Progreso guardado exitosamente en Firebase');
    
    // Limpiar el estado
    mostrarConfirmacion.value = false;
    mostrarFormulario.value = false;
    seccionActual.value = '';
    pasoActual.value = 0;
    datosFormulario.value = {};
  } catch (error) {
    console.error('Error al guardar el progreso:', error);
  }
};

const descartarFormulario = () => {
  mostrarFormulario.value = false;
  mostrarConfirmacion.value = false;
  seccionActual.value = '';
  pasoActual.value = 0;
  datosFormulario.value = {};
};

// Agregar evento para detectar cierre del navegador
window.addEventListener('beforeunload', (e) => {
  if (mostrarFormulario.value && Object.keys(datosFormulario.value).length > 0) {
    e.preventDefault();
    e.returnValue = '';
    return '';
  }
});
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-x: hidden;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  color: white;
}

.home-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: radial-gradient(circle at 15% 15%, rgba(255, 105, 180, 0.1) 0%, transparent 60%);
  pointer-events: none;
}

.home-page::after {
  content: '';
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 85% 85%, rgba(147, 112, 219, 0.15) 0%, transparent 55%);
  pointer-events: none;
}

.dashboard-container {
  flex: 1;
  padding: 6rem 3rem 3rem;
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  background: transparent;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  overflow-y: visible;
  min-height: calc(100vh - 100px);
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.welcome-title {
  margin-bottom: 0.5rem;
  color: white;
  font-size: 2.5rem;
  font-weight: 700;
}

.welcome-subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
}

.secciones-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.seccion-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.seccion-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(255, 255, 255, 0.1), 0 10px 15px rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.15);
}

.seccion-card.completa {
  border-left: 4px solid #4CAF50;
}

.seccion-card.parcial {
  border-left: 4px solid #FFC107;
}

.seccion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.seccion-header h2 {
  font-size: 1.2rem;
  color: white;
  margin: 0;
}

.estado-indicador {
  font-size: 1.5rem;
}

.estado-indicador .check {
  color: #4CAF50;
}

.estado-indicador .parcial {
  color: #FFC107;
}

.seccion-content {
  color: rgba(255, 255, 255, 0.9);
}

.btn-llenar {
  background: var(--primary-gradient);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  width: 100%;
  font-weight: 600;
}

.btn-llenar:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 195, 255, 0.3);
}

/* Estilos del Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  overflow-y: auto;
  padding: 2rem;
}

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
  display: flex;
  flex-direction: column;
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
  background: linear-gradient(90deg, #ff69b4, #9370db);
  animation: float-very-slow 30s ease-in-out infinite alternate;
}

.modal-accent-shape.shape-2 {
  width: 300px;
  height: 300px;
  bottom: -150px;
  left: -150px;
  background: linear-gradient(135deg, #ff69b4, #9370db);
  animation: float-very-slow 25s ease-in-out infinite alternate-reverse;
}

@keyframes float-very-slow {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  100% {
    transform: translate(30px, 30px) rotate(5deg);
  }
}

.apple-modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
}

.modal-title-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.modal-icon-container {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--primary-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
}

.apple-btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
  line-height: 1;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.apple-btn-close:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #333;
}

/* Barra de Progreso */
.progress-bar {
  padding: 1.5rem;
  background: #f8f9fa;
  position: relative;
  z-index: 1;
}

.progress-steps {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  flex: 1;
}

.step-number {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
}

.step.active .step-number {
  background: var(--primary-gradient);
  color: white;
}

.step.completed .step-number {
  background: #4CAF50;
  color: white;
}

.step-title {
  font-size: 0.9rem;
  color: #666;
  text-align: center;
}

.progress-line {
  height: 4px;
  background: #eee;
  position: relative;
  margin: 0 15px;
}

.progress-fill {
  height: 100%;
  background: var(--primary-gradient);
  transition: width 0.3s ease;
}

.form-content {
  padding: 1.5rem;
  background-color: white;
  position: relative;
  z-index: 1;
  overflow-y: auto;
  flex: 1;
}

/* Animaciones */
@keyframes animate-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-in {
  animation: animate-in 0.5s ease forwards;
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard-container {
    padding: 4rem 1.5rem 2rem;
  }

  .secciones-grid {
    grid-template-columns: 1fr;
  }

  .welcome-title {
    font-size: 2rem;
  }

  .welcome-subtitle {
    font-size: 1rem;
  }
}
</style> 