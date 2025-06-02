<template>
  <div class="form-step">
    <div class="tabs-container">
      <div class="tabs">
        <button 
          :class="['tab', { active: activeTab === 'form' }]"
          @click="activeTab = 'form'"
        >
          Formulario
        </button>
        <button 
          :class="['tab', { active: activeTab === 'preview' }]"
          @click="activeTab = 'preview'"
        >
          Vista Previa
        </button>
      </div>
    </div>

    <!-- Formulario -->
    <div v-if="activeTab === 'form'" class="form-content">
      <h3>Información General</h3>
      
      <div class="form-group">
        <label for="nombre">Nombre de la Agencia</label>
        <input 
          type="text" 
          id="nombre" 
          v-model="datos.nombre" 
          class="form-control"
          placeholder="Ingrese el nombre de la agencia"
        >
      </div>

      <div class="form-group">
        <label for="fechaCreacion">Fecha de Creación</label>
        <input 
          type="date" 
          id="fechaCreacion" 
          v-model="datos.fechaCreacion" 
          class="form-control"
        >
      </div>

      <div class="form-group">
        <label for="descripcion">Descripción</label>
        <textarea 
          id="descripcion" 
          v-model="datos.descripcion" 
          class="form-control"
          rows="4"
          placeholder="Describa brevemente la agencia y sus objetivos principales"
        ></textarea>
      </div>

      <h4 class="section-title">La Agencia Local en cifras</h4>
      
      <div class="cifras-grid">
        <div class="form-group">
          <label>Presupuesto(€)</label>
          <input 
            type="number" 
            v-model="datos.cifras.presupuestoInicial" 
            class="form-control"
            min="0"
            step="0.01"
          >
        </div>

        <div class="form-group">
          <label>Presupuesto ajustado (€)</label>
          <input 
            type="number" 
            v-model="datos.cifras.presupuestoAjustado" 
            class="form-control"
            min="0"
            step="0.01"
            @input="calcularPorcentajeEjecucion"
          >
        </div>

        <div class="form-group">
          <label>Presupuesto ejecutado (€)</label>
          <input 
            type="number" 
            v-model="datos.cifras.presupuestoEjecutado" 
            class="form-control"
            min="0"
            step="0.01"
            @input="calcularPorcentajeEjecucion"
          >
        </div>

        <div class="form-group">
          <label>Total de usuarios</label>
          <input 
            type="number" 
            v-model="datos.cifras.totalUsuarios" 
            class="form-control"
            min="0"
          >
        </div>

        <div class="form-group">
          <label>Nuevos usuarios</label>
          <input 
            type="number" 
            v-model="datos.cifras.nuevosUsuarios" 
            class="form-control"
            min="0"
          >
        </div>

        <div class="form-group">
          <label>Nº Personas atendidas en orientación</label>
          <input 
            type="number" 
            v-model="datos.cifras.personasOrientacion" 
            class="form-control"
            min="0"
          >
        </div>

        <div class="form-group">
          <label>Actividades formativas realizadas</label>
          <input 
            type="number" 
            v-model="datos.cifras.actividadesFormativas" 
            class="form-control"
            min="0"
          >
        </div>

        <div class="form-group">
          <label>Horas de orientación laboral realizadas</label>
          <input 
            type="number" 
            v-model="datos.cifras.horasOrientacion" 
            class="form-control"
            min="0"
          >
        </div>

        <div class="form-group">
          <label>Horas de formación</label>
          <input 
            type="number" 
            v-model="datos.cifras.horasFormacion" 
            class="form-control"
            min="0"
          >
        </div>

        <div class="form-group">
          <label>Ofertas de empleo gestionadas</label>
          <input 
            type="number" 
            v-model="datos.cifras.ofertasEmpleo" 
            class="form-control"
            min="0"
          >
        </div>

        <div class="form-group">
          <label>Participantes en actividades formativas</label>
          <input 
            type="number" 
            v-model="datos.cifras.participantesFormacion" 
            class="form-control"
            min="0"
          >
        </div>

        <div class="form-group">
          <label>Puestos de trabajo</label>
          <input 
            type="number" 
            v-model="datos.cifras.puestosGenerados" 
            class="form-control"
            min="0"
          >
        </div>

        <div class="form-group">
          <label>Asesoramientos a empresas y emprendedores</label>
          <input 
            type="number" 
            v-model="datos.cifras.asesoramientos" 
            class="form-control"
            min="0"
          >
        </div>

        <div class="form-group">
          <label>Personas contratadas</label>
          <input 
            type="number" 
            v-model="datos.cifras.personasContratadas" 
            class="form-control"
            min="0"
          >
        </div>
        
        <div class="form-group">
          <label>Empresas creadas</label>
          <input 
            type="number" 
            v-model="datos.cifras.empresasCreadas" 
            class="form-control"
            min="0"
          >
        </div>

        <div class="form-group">
          <label>Empresas en viveros</label>
          <input 
            type="number" 
            v-model="datos.cifras.empresasViveros" 
            class="form-control"
            min="0"
          >
        </div>

        <div class="form-group">
          <label>Ayudas concedidas a empresas (€)</label>
          <input 
            type="number" 
            v-model="datos.cifras.ayudasEmpresas" 
            class="form-control"
            min="0"
            step="0.01"
          >
        </div>

        <div class="form-group">
          <label>Ayudas concedidas a entidades (€)</label>
          <input 
            type="number" 
            v-model="datos.cifras.ayudasEntidades" 
            class="form-control"
            min="0"
            step="0.01"
          >
        </div>
      </div>
    </div>

    <!-- Vista Previa -->
    <div v-if="activeTab === 'preview'" class="preview-content">
      <div class="preview-container">
        
        <!-- Sección 1: Presupuestos -->
        <div class="preview-section">
          <div class="section-header">
            <span class="section-number">1.1</span>
            <h3>LA AGENCIA LOCAL<br>EN CIFRAS</h3>
          </div>
          
          <div class="budget-section">
            <div class="budget-item">
              <div class="budget-label">Presupuesto</div>
              <div class="budget-value">{{ formatCurrency(datos.cifras.presupuestoInicial) }}</div>
            </div>
            
            <div class="budget-item">
              <div class="budget-label">Presupuesto ajustado</div>
              <div class="budget-value">{{ formatCurrency(datos.cifras.presupuestoAjustado) }}</div>
            </div>
            
            <div class="budget-item">
              <div class="budget-label">Presupuesto ejecutado</div>
              <div class="budget-value">{{ formatCurrency(datos.cifras.presupuestoEjecutado) }}</div>
            </div>
          </div>

          <div class="execution-chart">
            <div class="chart-container">
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#E0E6ED" stroke-width="8"/>
                <circle 
                  cx="60" 
                  cy="60" 
                  r="50" 
                  fill="none" 
                  stroke="#1B5E96" 
                  stroke-width="8"
                  stroke-dasharray="314.16"
                  :stroke-dashoffset="314.16 - (314.16 * porcentajeEjecucionCalculado / 100)"
                  transform="rotate(-90 60 60)"
                />
              </svg>
              <div class="chart-center">
                <div class="chart-label">Porcentaje<br>de ejecución</div>
                <div class="chart-percentage">{{ porcentajeEjecucionCalculado.toFixed(2) }}%</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sección 2: Usuarios y Estadísticas -->
        <div class="preview-section">
          <div class="users-header">
            <div class="users-box">
              <div class="users-label">Total<br>usuarios:</div>
              <div class="users-number">{{ formatNumber(datos.cifras.totalUsuarios) }}</div>
            </div>
            <div class="users-box">
              <div class="users-label">Nuevos<br>usuarios:</div>
              <div class="users-number">{{ formatNumber(datos.cifras.nuevosUsuarios) }}</div>
            </div>
          </div>

          <div class="stats-grid">
            <div class="stats-row">
              <div class="stat-item">
                <div class="stat-icon">👥</div>
                <div class="stat-label">Nº personas atendidas en orientación</div>
                <div class="stat-value">{{ formatNumber(datos.cifras.personasOrientacion) }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-icon">📚</div>
                <div class="stat-label">Actividades formativas:</div>
                <div class="stat-value">{{ formatNumber(datos.cifras.actividadesFormativas) }}</div>
              </div>
            </div>

            <div class="stats-row">
              <div class="stat-item">
                <div class="stat-icon">⏰</div>
                <div class="stat-label">Horas de orientación laboral realizadas:</div>
                <div class="stat-value">{{ formatNumber(datos.cifras.horasOrientacion) }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-icon">⏱️</div>
                <div class="stat-label">Horas de formación:</div>
                <div class="stat-value">{{ formatNumber(datos.cifras.horasFormacion) }}</div>
              </div>
            </div>

            <div class="stats-row">
              <div class="stat-item">
                <div class="stat-icon">💼</div>
                <div class="stat-label">Ofertas de empleo gestionadas:</div>
                <div class="stat-value">{{ formatNumber(datos.cifras.ofertasEmpleo) }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-icon">👨‍🎓</div>
                <div class="stat-label">Participantes en actividades formativas:</div>
                <div class="stat-value">{{ formatNumber(datos.cifras.participantesFormacion) }}</div>
              </div>
            </div>

            <div class="stats-row">
              <div class="stat-item">
                <div class="stat-icon">🏢</div>
                <div class="stat-label">Puestos de trabajo:</div>
                <div class="stat-value">{{ formatNumber(datos.cifras.puestosGenerados) }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-icon">🤝</div>
                <div class="stat-label">Asesoramiento empresas y emprendedores:</div>
                <div class="stat-value">{{ formatNumber(datos.cifras.asesoramientos) }}</div>
              </div>
            </div>

            <div class="stats-row">
              <div class="stat-item">
                <div class="stat-icon">✅</div>
                <div class="stat-label">Personas contratadas:</div>
                <div class="stat-value">{{ formatNumber(datos.cifras.personasContratadas) }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-icon">🏭</div>
                <div class="stat-label">Empresas creadas:</div>
                <div class="stat-value">{{ formatNumber(datos.cifras.empresasCreadas) }}</div>
              </div>
            </div>

            <div class="stats-row">
              <div class="stat-item single-item">
                <div class="stat-icon">🌱</div>
                <div class="stat-label">Empresas en viveros:</div>
                <div class="stat-value">{{ formatNumber(datos.cifras.empresasViveros) }}</div>
              </div>
            </div>
          </div>

          <div class="aid-section">
            <div class="aid-box">
              <div class="aid-label">Ayudas<br>concedidas a<br>empresas</div>
              <div class="aid-value">{{ formatCurrency(datos.cifras.ayudasEmpresas) }}</div>
            </div>
            <div class="aid-box">
              <div class="aid-label">Ayudas<br>concedidas a<br>entidades</div>
              <div class="aid-value">{{ formatCurrency(datos.cifras.ayudasEntidades) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="form-actions">
      <button 
        @click="$emit('siguiente')" 
        class="btn btn-primary"
        :disabled="!esValido"
      >
        Siguiente
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update:modelValue', 'siguiente']);

const activeTab = ref('form');

const datos = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// Inicializar datos si no existen
if (!datos.value.cifras) {
  datos.value.cifras = {
    presupuestoInicial: 6336509.57,
    presupuestoAjustado: 5923758.36,
    presupuestoEjecutado: 5025482.34,
    totalUsuarios: 11662,
    nuevosUsuarios: 1979,
    ayudasEmpresas: 3944170.34,
    ayudasEntidades: 247271.99,
    personasOrientacion: 4159,
    ofertasEmpleo: 199,
    personasContratadas: 338,
    horasOrientacion: 9552,
    puestosGenerados: 2038,
    actividadesFormativas: 248,
    participantesFormacion: 3389,
    empresasCreadas: 168,
    empresasViveros: 14,
    horasFormacion: 6881,
    asesoramientos: 913
  };
}

const esValido = computed(() => {
  return datos.value.nombre && 
         datos.value.fechaCreacion && 
         datos.value.descripcion;
});

const porcentajeEjecucionCalculado = computed(() => {
  if (datos.value.cifras.presupuestoAjustado && datos.value.cifras.presupuestoEjecutado) {
    return (datos.value.cifras.presupuestoEjecutado / datos.value.cifras.presupuestoAjustado) * 100;
  }
  return 0;
});

const calcularPorcentajeEjecucion = () => {
  // El cálculo se hace automáticamente en el computed
};

const formatCurrency = (value) => {
  if (!value) return '0,00 €';
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
  }).format(value);
};

const formatNumber = (value) => {
  if (!value) return '0';
  return new Intl.NumberFormat('es-ES').format(value);
};
</script>

<style scoped>
.form-step {
  max-width: 1200px;
  margin: 0 auto;
}

.tabs-container {
  margin-bottom: 2rem;
  border-bottom: 2px solid #e0e6ed;
}

.tabs {
  display: flex;
  gap: 0;
}

.tab {
  padding: 12px 24px;
  border: none;
  background: #f8f9fa;
  color: #6c757d;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  font-weight: 500;
  transition: all 0.3s ease;
}

.tab.active {
  background: white;
  color: #1B5E96;
  border-bottom-color: #1B5E96;
}

.tab:hover:not(.active) {
  background: #e9ecef;
}

.form-content .form-group {
  margin-bottom: 1.5rem;
  background-color: aliceblue;
}

.section-title {
  margin: 2rem 0 1.5rem;
  color: #004698;
  font-size: 1.3rem;
}

.cifras-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-control:focus {
  outline: none;
  border-color: #004698;
  box-shadow: 0 0 0 2px rgba(0, 70, 152, 0.1);
}

textarea.form-control {
  resize: vertical;
  min-height: 100px;
}

/* Vista Previa Styles */
.preview-content {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 8px;
}

.preview-container {
  max-width: 800px;
  margin: 0 auto;
}

.preview-section {
  background: white;
  margin-bottom: 2rem;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-header {
  background: #8DB4E2;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.section-number {
  background: #1B5E96;
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  font-weight: bold;
  font-size: 1.1rem;
}

.section-header h3 {
  color: #1B5E96;
  font-weight: bold;
  margin: 0;
  font-size: 1.2rem;
  line-height: 1.2;
}

.budget-section {
  background: #1B5E96;
  padding: 2rem;
  color: white;
}

.budget-item {
  margin-bottom: 1.5rem;
}

.budget-item:last-child {
  margin-bottom: 0;
  border-bottom: 2px solid rgba(255, 255, 255, 0.3);
  padding-bottom: 1rem;
}

.budget-label {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.budget-value {
  font-size: 1.8rem;
  font-weight: bold;
  color: white;
}

.execution-chart {
  background: #1B5E96;
  padding: 2rem;
  display: flex;
  justify-content: center;
}

.chart-container {
  position: relative;
  width: 120px;
  height: 120px;
}

.chart-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
}

.chart-label {
  font-size: 0.7rem;
  margin-bottom: 0.5rem;
  line-height: 1.1;
}

.chart-percentage {
  font-size: 1.5rem;
  font-weight: bold;
}

.users-header {
  background: #1B5E96;
  display: flex;
  color: white;
}

.users-box {
  flex: 1;
  padding: 1.5rem;
  text-align: center;
}

.users-box + .users-box {
  border-left: 1px solid rgba(255, 255, 255, 0.2);
}

.users-label {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  line-height: 1.2;
}

.users-number {
  font-size: 1.8rem;
  font-weight: bold;
}

.stats-grid {
  padding: 1.5rem;
}

.stats-row {
  display: flex;
  margin-bottom: 1rem;
}

.stats-row:last-child {
  margin-bottom: 0;
}

.stat-item {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 4px;
}

.stat-item + .stat-item {
  margin-left: 1rem;
}

.stat-item.single-item {
  max-width: 50%;
}

.stat-icon {
  font-size: 1.2rem;
  min-width: 24px;
}

.stat-label {
  flex: 1;
  font-size: 0.85rem;
  color: #495057;
  line-height: 1.2;
}

.stat-value {
  background: #1B5E96;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-weight: bold;
  min-width: 60px;
  text-align: center;
}

.aid-section {
  background: #1B5E96;
  display: flex;
  color: white;
}

.aid-box {
  flex: 1;
  padding: 1.5rem;
  text-align: center;
}

.aid-box + .aid-box {
  border-left: 1px solid rgba(255, 255, 255, 0.2);
}

.aid-label {
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
  line-height: 1.2;
}

.aid-value {
  font-size: 1.4rem;
  font-weight: bold;
}

.form-actions {
  margin-top: 2rem;
  display: flex;
  justify-content: flex-end;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #004698;
  color: white;
}

.btn-primary:hover {
  background: #003366;
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>