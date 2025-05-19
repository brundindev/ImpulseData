<template>
  <div class="memoria-anual-container">
    <div class="header">
      <h1>Memoria Anual</h1>
      <p class="subtitle">Gestión y seguimiento de la memoria anual</p>
    </div>

    <div class="secciones-grid">
      <!-- AGENCIA LOCAL -->
      <div class="seccion-card" :class="{ 'completa': secciones.agenciaLocal.completa, 'parcial': secciones.agenciaLocal.parcial }">
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
      <div class="seccion-card" :class="{ 'completa': secciones.empleoFormacion.completa, 'parcial': secciones.empleoFormacion.parcial }">
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
      <div class="seccion-card" :class="{ 'completa': secciones.promocionEconomica.completa, 'parcial': secciones.promocionEconomica.parcial }">
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
      <div class="seccion-card" :class="{ 'completa': secciones.desarrolloLocal.completa, 'parcial': secciones.desarrolloLocal.parcial }">
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

    <!-- Modal de Formulario Multistep -->
    <teleport to="body">
      <div v-if="mostrarFormulario" class="modal-overlay" @click.self="cerrarFormulario">
        <div class="modal-container">
          <div class="modal-header">
            <h2>{{ tituloFormulario }}</h2>
            <button class="btn-close" @click="cerrarFormulario">×</button>
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
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

// Importar componentes de Agencia Local
import AgenciaLocalGeneral from '../components/memoria/AgenciaLocalGeneral.vue';
import AgenciaLocalQueHacemos from '../components/memoria/AgenciaLocalQueHacemos.vue';
import AgenciaLocalEstructura from '../components/memoria/AgenciaLocalEstructura.vue';
import AgenciaLocalSedes from '../components/memoria/AgenciaLocalSedes.vue';

// Importar componentes de Empleo y Formación
import EmpleoFormacionProgramas from '../components/memoria/EmpleoFormacionProgramas.vue';
import EmpleoFormacionFormacion from '../components/memoria/EmpleoFormacionFormacion.vue';
import EmpleoFormacionEstadisticas from '../components/memoria/EmpleoFormacionEstadisticas.vue';
import EmpleoFormacionObjetivos from '../components/memoria/EmpleoFormacionObjetivos.vue';
import EmpleoFormacionConclusiones from '../components/memoria/EmpleoFormacionConclusiones.vue';
import EmpleoFormacionAnexos from '../components/memoria/EmpleoFormacionAnexos.vue';

// Importar componentes de Promoción Económica
import PromocionEconomicaGeneral from '../components/memoria/PromocionEconomicaGeneral.vue';
import PromocionEconomicaProgramas from '../components/memoria/PromocionEconomicaProgramas.vue';
import PromocionEconomicaEmpresas from '../components/memoria/PromocionEconomicaEmpresas.vue';
import PromocionEconomicaResultados from '../components/memoria/PromocionEconomicaResultados.vue';
import PromocionEconomicaObjetivos from '../components/memoria/PromocionEconomicaObjetivos.vue';
import PromocionEconomicaConclusiones from '../components/memoria/PromocionEconomicaConclusiones.vue';

// Importar componentes de Desarrollo Local
import DesarrolloLocalGeneral from '../components/memoria/DesarrolloLocalGeneral.vue';
import DesarrolloLocalProgramas from '../components/memoria/DesarrolloLocalProgramas.vue';
import DesarrolloLocalResultados from '../components/memoria/DesarrolloLocalResultados.vue';
import DesarrolloLocalObjetivos from '../components/memoria/DesarrolloLocalObjetivos.vue';
import DesarrolloLocalConclusiones from '../components/memoria/DesarrolloLocalConclusiones.vue';

// Importar componentes de Gestión
import GestionGeneral from '../components/memoria/GestionGeneral.vue';
import GestionFinanciera from '../components/memoria/GestionFinanciera.vue';

// Importar componentes de Marketing
import MarketingGeneral from '../components/memoria/MarketingGeneral.vue';
import MarketingEstrategias from '../components/memoria/MarketingEstrategias.vue';
import MarketingResultados from '../components/memoria/MarketingResultados.vue';
import MarketingObjetivos from '../components/memoria/MarketingObjetivos.vue';
import MarketingConclusiones from '../components/memoria/MarketingConclusiones.vue';

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
        { titulo: 'LA AGENCIA LOCAL EN CIFRAS', componente: AgenciaLocalGeneral },
        { titulo: 'Qué hacemos', componente: AgenciaLocalQueHacemos },
        { titulo: 'CÓMO ESTAMOS ORGANIZADOS', componente: AgenciaLocalEstructura },
        { titulo: 'Dónde estamos', componente: AgenciaLocalSedes }
      ];
    case 'empleoFormacion':
      return [
        { titulo: 'Programas de Empleo', componente: EmpleoFormacionProgramas },
        { titulo: 'Formación', componente: EmpleoFormacionFormacion },
        { titulo: 'Estadísticas', componente: EmpleoFormacionEstadisticas },
        { titulo: 'Objetivos', componente: EmpleoFormacionObjetivos },
        { titulo: 'Conclusiones', componente: EmpleoFormacionConclusiones },
        { titulo: 'Anexos', componente: EmpleoFormacionAnexos }
      ];
    case 'promocionEconomica':
      return [
        { titulo: 'Información General', componente: PromocionEconomicaGeneral },
        { titulo: 'Programas y Proyectos', componente: PromocionEconomicaProgramas },
        { titulo: 'Empresas y Emprendedores', componente: PromocionEconomicaEmpresas },
        { titulo: 'Resultados', componente: PromocionEconomicaResultados },
        { titulo: 'Objetivos', componente: PromocionEconomicaObjetivos },
        { titulo: 'Conclusiones', componente: PromocionEconomicaConclusiones }
      ];
    case 'desarrolloLocal':
      return [
        { titulo: 'Información General', componente: DesarrolloLocalGeneral },
        { titulo: 'Programas Estratégicos', componente: DesarrolloLocalProgramas },
        { titulo: 'Resultados', componente: DesarrolloLocalResultados },
        { titulo: 'Objetivos', componente: DesarrolloLocalObjetivos },
        { titulo: 'Conclusiones', componente: DesarrolloLocalConclusiones }
      ];
    case 'gestion':
      return [
        { titulo: 'Información General', componente: GestionGeneral },
        { titulo: 'Gestión Financiera', componente: GestionFinanciera }
      ];
    case 'marketing':
      return [
        { titulo: 'Información General', componente: MarketingGeneral },
        { titulo: 'Estrategias', componente: MarketingEstrategias },
        { titulo: 'Resultados', componente: MarketingResultados },
        { titulo: 'Objetivos', componente: MarketingObjetivos }
      ];
    default:
      return [];
  }
});

// Funciones
const abrirFormulario = (seccion) => {
  seccionActual.value = seccion;
  pasoActual.value = 0;
  
  // Intentar cargar datos guardados
  const datosGuardados = localStorage.getItem(`memoria_${seccion}`);
  if (datosGuardados) {
    datosFormulario.value = JSON.parse(datosGuardados);
  } else {
    datosFormulario.value = {};
  }
  
  mostrarFormulario.value = true;
};

const cerrarFormulario = () => {
  // Verificar si hay datos sin guardar
  if (Object.keys(datosFormulario.value).length > 0 && !secciones.value[seccionActual.value].completa) {
    if (confirm('¿Deseas guardar tu progreso antes de salir?')) {
      guardarProgreso();
    }
  }
  mostrarFormulario.value = false;
  seccionActual.value = '';
  pasoActual.value = 0;
  datosFormulario.value = {};
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
    // Aquí iría la lógica para guardar los datos
    console.log('Guardando datos:', datosFormulario.value);
    
    // Actualizar estado de la sección
    secciones.value[seccionActual.value].completa = true;
    secciones.value[seccionActual.value].parcial = false;
    
    cerrarFormulario();
  } catch (error) {
    console.error('Error al guardar:', error);
  }
};

const guardarProgreso = async () => {
  try {
    // Aquí iría la lógica para guardar el progreso en el backend
    console.log('Guardando progreso:', datosFormulario.value);
    
    // Actualizar estado de la sección a parcial
    secciones.value[seccionActual.value].parcial = true;
    secciones.value[seccionActual.value].completa = false;
    
    // Guardar en localStorage como respaldo
    localStorage.setItem(`memoria_${seccionActual.value}`, JSON.stringify(datosFormulario.value));
    
    alert('Progreso guardado correctamente');
  } catch (error) {
    console.error('Error al guardar el progreso:', error);
    alert('Error al guardar el progreso');
  }
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
.memoria-anual-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
}

.header h1 {
  font-size: 2.5rem;
  color: #004698;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #666;
  font-size: 1.1rem;
}

.secciones-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.seccion-card {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.seccion-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
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
  color: #333;
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
  color: #666;
}

.btn-llenar {
  background: #004698;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
  margin-top: 1rem;
  width: 100%;
}

.btn-llenar:hover {
  background: #003366;
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
}

.modal-container {
  background: white;
  border-radius: 10px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  color: #004698;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
}

/* Barra de Progreso */
.progress-bar {
  padding: 1.5rem;
  background: #f8f9fa;
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
}

.step.active .step-number {
  background: #004698;
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
  background: #004698;
  transition: width 0.3s ease;
}

.form-content {
  padding: 1.5rem;
  background-color: aliceblue;
}
</style> 