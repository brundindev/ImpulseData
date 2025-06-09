<template>
  <div class="form-step">
    <h3>Departamento Jurídico Administrativo</h3>
    
    <!-- Formulario para agregar contratos -->
    <div class="form-section">
      <h4>Añadir Contrato</h4>
      <div class="flex-row">
        <div class="form-group flex-1">
          <label>Tipo de Contrato</label>
          <select 
            v-model="nuevoContrato.tipoContrato" 
            class="form-control"
          >
            <option value="">Seleccione tipo</option>
            <option value="mayor">Contratos mayores</option>
            <option value="menor">Contratos menores</option>
          </select>
        </div>
        
        <div class="form-group flex-1">
          <label>Número de Contratos</label>
          <input 
            type="number" 
            v-model.number="nuevoContrato.cantidad" 
            class="form-control"
            min="1"
            placeholder="Nº de contratos"
          >
        </div>
        
        <div class="form-group flex-1">
          <label>Importe de Adjudicación</label>
          <input 
            type="number" 
            v-model.number="nuevoContrato.importe" 
            class="form-control"
            min="0"
            step="0.01"
            placeholder="Importe"
          >
        </div>
        
        <div class="form-group flex-0">
          <label>&nbsp;</label>
          <button 
            @click="agregarContrato" 
            class="btn btn-primary" 
            :disabled="!puedeAgregarContrato"
          >
            Añadir
          </button>
        </div>
      </div>
    </div>
    
    <!-- Tabla resumen de contratos -->
    <div class="form-section">
      <h4>Resumen de Contratos</h4>
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Nº contratos</th>
              <th>Importe Total Adjudicación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="contratosMayores.length === 0 && contratosMenores.length === 0">
              <td colspan="4" class="text-center">No hay contratos añadidos</td>
            </tr>
            
            <!-- Fila para contratos mayores si existen -->
            <tr v-if="contratosMayores.length > 0">
              <td>Contratos mayores</td>
              <td>{{ totalContratosMayores }}</td>
              <td>{{ formatCurrency(importeTotalMayores) }} €</td>
              <td class="action-buttons">
                <button @click="editarGrupo('mayor')" class="btn btn-sm btn-secondary">
                  Editar
                </button>
                <button @click="confirmarEliminarGrupo('mayor')" class="btn btn-sm btn-danger">
                  Eliminar
                </button>
              </td>
            </tr>
            
            <!-- Fila para contratos menores si existen -->
            <tr v-if="contratosMenores.length > 0">
              <td>Contratos menores</td>
              <td>{{ totalContratosMenores }}</td>
              <td>{{ formatCurrency(importeTotalMenores) }} €</td>
              <td class="action-buttons">
                <button @click="editarGrupo('menor')" class="btn btn-sm btn-secondary">
                  Editar
                </button>
                <button @click="confirmarEliminarGrupo('menor')" class="btn btn-sm btn-danger">
                  Eliminar
                </button>
              </td>
            </tr>
            
            <!-- Fila de totales -->
            <tr v-if="contratosMayores.length > 0 || contratosMenores.length > 0" class="total-row">
              <td>TOTAL</td>
              <td>{{ totalContratos }}</td>
              <td>{{ formatCurrency(importeTotal) }} €</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Modal para editar grupo de contratos -->
    <div v-if="mostrarModalEdicion" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h4>Editar {{ tipoContratoEditando === 'mayor' ? 'Contratos mayores' : 'Contratos menores' }}</h4>
          <button @click="cerrarModal" class="close-button">&times;</button>
        </div>
        <div class="modal-body">
          <div v-for="(contrato, index) in contratosEditando" :key="index" class="contrato-item">
            <div class="flex-row">
              <div class="form-group flex-1">
                <label>Nº de Contratos</label>
                <input 
                  type="number" 
                  v-model.number="contrato.cantidad" 
                  class="form-control"
                  min="1"
                >
              </div>
              <div class="form-group flex-1">
                <label>Importe</label>
                <input 
                  type="number" 
                  v-model.number="contrato.importe" 
                  class="form-control"
                  min="0"
                  step="0.01"
                >
              </div>
              <div class="form-group flex-0">
                <label>&nbsp;</label>
              </div>
            </div>
          </div>
          <div class="form-actions modal-actions">
            <button @click="cerrarModal" class="btn btn-secondary">Cancelar</button>
            <button @click="guardarEdicion" class="btn btn-primary">Guardar</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Modal de confirmación para eliminar -->
    <div v-if="mostrarModalConfirmacion" class="modal">
      <div class="modal-content confirmacion-modal">
        <div class="modal-header">
          <h4>Confirmar eliminación</h4>
          <button @click="mostrarModalConfirmacion = false" class="close-button">&times;</button>
        </div>
        <div class="modal-body">
          <p>¿Está seguro que desea eliminar todos los {{ tipoAEliminar === 'mayor' ? 'contratos mayores' : 'contratos menores' }}?</p>
          <p>Esta acción no se puede deshacer.</p>
          
          <div class="form-actions modal-actions">
            <button @click="mostrarModalConfirmacion = false" class="btn btn-secondary">Cancelar</button>
            <button @click="eliminarGrupo" class="btn btn-danger">Eliminar</button>
          </div>
        </div>
      </div>
    </div>
 <!-- Vista Previa -->
 <section class="bloque vista-previa">
      <h4>Vista Previa del Departamento Jurídico Administrativo</h4>
      <div class="preview-container">
        <div class="preview-header">
          <div class="preview-number">5.2</div>
          <div class="preview-title-section">
            <h2 class="preview-main-title">DEPARTAMENTO</h2>
            <h2 class="preview-subtitle">JURÍDICO ADMINISTRATIVO</h2>
          </div>
        </div>

        <div class="preview-description">
          Una de las principales tareas del Departamento Jurídico Administrativo es la redacción, licitación y adjudicación de los diferentes contratos de obras, servicios y suministros que se solicitan desde las distintas jefaturas de la Agencia Local.
        </div>

        <div class="preview-stats-section">
          <div class="preview-main-stat">
            <div class="main-stat-value">{{ formatCurrency(importeTotal) || 0 }} € </div>
            <div class="main-stat-label"> Importe adjudicación</div>
          </div>
          
          <div class="contracts-info">
            <div class="contracts-icon">📄</div>
            <div class="contracts-number">{{ totalContratos }}</div>
            <div class="contracts-label">contratos</div>
          </div>
        </div>

        <div class="preview-intermediate-text">
          En 2023 se han gestionado los siguientes contratos:
        </div>

        <div class="preview-contracts-table">
          <div class="contracts-table-header">
            <div class="header-col-tipo">Tipo</div>
            <div class="header-col-num">Nº contratos</div>
            <div class="header-col-importe">Importe Total Adjudicación</div>
          </div>
          
          <div class="contracts-table-body">
            <div v-if="contratosMayores.length > 0" class="contracts-table-row">
              <div class="row-col-tipo">Contratos mayores</div>
              <div class="row-col-num">{{ totalContratosMayores }}</div>
              <div class="row-col-importe">{{ formatCurrency(importeTotalMayores) }} €</div>
            </div>
            
            <div v-if="contratosMenores.length > 0" class="contracts-table-row">
              <div class="row-col-tipo">Contratos menores</div>
              <div class="row-col-num">{{ totalContratosMenores }}</div>
              <div class="row-col-importe">{{ formatCurrency(importeTotalMenores) }} €</div>
            </div>
            
            <div v-if="totalContratos > 0" class="contracts-table-total">
              <div class="row-col-tipo"></div>
              <div class="row-col-num">{{ totalContratos }}</div>
              <div class="row-col-importe">{{ formatCurrency(importeTotal) }} €</div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <div class="form-actions">
      <button 
        @click="$emit('anterior')" 
        class="btn btn-secondary"
      >
        Anterior
      </button>
      <button 
        @click="guardarYFinalizar" 
        class="btn btn-primary"
        :disabled="!esValido"
      >
        Guardar y Finalizar
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

const emit = defineEmits(['update:modelValue', 'siguiente', 'anterior', 'guardar']);

const datos = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// Inicializar datos si no existen
if (!datos.value.contratos) {
  datos.value.contratos = [];
}

const nuevoContrato = ref({
  tipoContrato: '',
  cantidad: 1,
  importe: 0
});

const mostrarModalEdicion = ref(false);
const mostrarModalConfirmacion = ref(false);
const tipoContratoEditando = ref(null);
const tipoAEliminar = ref(null);
const contratosEditando = ref([]);
const contratosCopia = ref([]);

// Obtener los contratos mayores y menores
const contratosMayores = computed(() => 
  datos.value.contratos.filter(c => c.tipoContrato === 'mayor')
);

const contratosMenores = computed(() => 
  datos.value.contratos.filter(c => c.tipoContrato === 'menor')
);

// Calcular totales para contratos mayores
const totalContratosMayores = computed(() => 
  contratosMayores.value.reduce((total, c) => total + (c.cantidad || 0), 0)
);

const importeTotalMayores = computed(() => 
  contratosMayores.value.reduce((total, c) => total + ((c.importe || 0)), 0)
);

// Calcular totales para contratos menores
const totalContratosMenores = computed(() => 
  contratosMenores.value.reduce((total, c) => total + (c.cantidad || 0), 0)
);

const importeTotalMenores = computed(() => 
  contratosMenores.value.reduce((total, c) => total + ((c.importe || 0)), 0)
);

// Totales generales
const totalContratos = computed(() => 
  totalContratosMayores.value + totalContratosMenores.value
);

const importeTotal = computed(() => 
  importeTotalMayores.value + importeTotalMenores.value
);

// Validación para agregar un nuevo contrato
const puedeAgregarContrato = computed(() => 
  nuevoContrato.value.tipoContrato && 
  nuevoContrato.value.cantidad > 0 && 
  nuevoContrato.value.importe >= 0
);

// Validación para el formulario completo
const esValido = computed(() => 
  datos.value.contratos.length > 0 && importeTotal.value > 0
);

// Funciones
function agregarContrato() {
  if (!puedeAgregarContrato.value) return;
  
  datos.value.contratos.push({
    tipoContrato: nuevoContrato.value.tipoContrato,
    cantidad: nuevoContrato.value.cantidad,
    importe: nuevoContrato.value.importe
  });
  
  // Resetear el formulario de nuevo contrato
  nuevoContrato.value = {
    tipoContrato: '',
    cantidad: 1,
    importe: 0
  };
}

function editarGrupo(tipo) {
  tipoContratoEditando.value = tipo;
  
  // Crear una copia profunda de los contratos para editar
  contratosEditando.value = JSON.parse(
    JSON.stringify(
      datos.value.contratos.filter(c => c.tipoContrato === tipo)
    )
  );
  
  // Guardar copia de seguridad de todos los contratos
  contratosCopia.value = JSON.parse(JSON.stringify(datos.value.contratos));
  
  mostrarModalEdicion.value = true;
}

function confirmarEliminarGrupo(tipo) {
  tipoAEliminar.value = tipo;
  mostrarModalConfirmacion.value = true;
}

function eliminarGrupo() {
  // Eliminar todos los contratos del tipo seleccionado
  datos.value.contratos = datos.value.contratos.filter(
    c => c.tipoContrato !== tipoAEliminar.value
  );
  
  mostrarModalConfirmacion.value = false;
}

function cerrarModal() {
  mostrarModalEdicion.value = false;
  // Restaurar datos originales
  datos.value.contratos = contratosCopia.value;
}

function guardarEdicion() {
  // Eliminar todos los contratos del tipo que estamos editando
  datos.value.contratos = datos.value.contratos.filter(
    c => c.tipoContrato !== tipoContratoEditando.value
  );
  
  // Añadir los contratos editados
  datos.value.contratos = [
    ...datos.value.contratos,
    ...contratosEditando.value
  ];
  
  mostrarModalEdicion.value = false;
}

function formatCurrency(value) {
  return new Intl.NumberFormat('es-ES').format(value);
}

function guardarYFinalizar() {
  // Actualizar los valores totales antes de enviar
  datos.value.importeAdjudicacion = importeTotal.value;
  datos.value.importeTotalAdjudicacion = importeTotal.value;
  
  // Guardar los datos
  emit('guardar', datos.value);
  
  // Si todo está completo, avanzar
  if (esValido.value) {
    emit('siguiente');
  }
}
</script>

<style scoped>
.form-step {
  max-width: 900px;
  margin: 0 auto;
  position: relative;
}

.form-section {
  margin-bottom: 2rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  background-color: #f9f9f9;
}

.form-section h4 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #004698;
}

.flex-row {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
}

.flex-1 {
  flex: 1;
}

.flex-0 {
  flex: 0 0 auto;
}

.form-group {
  margin-bottom: 1rem;
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
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-control:focus {
  outline: none;
  border-color: #004698;
  box-shadow: 0 0 0 2px rgba(0, 70, 152, 0.1);
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
  color: black;
}

.table th,
.table td {
  padding: 0.75rem;
  border-bottom: 1px solid #dee2e6;
  text-align: left;
}

.table th {
  background-color: #f8f9fa;
  font-weight: 600;
}

.table .text-center {
  text-align: center;
}

.total-row {
  font-weight: bold;
  background-color: #8c6f9e;
  color: white;
}

.table-responsive {
  overflow-x: auto;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-sm {
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
}

.btn-primary {
  background: #004698;
  color: white;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn:hover {
  opacity: 0.9;
}

.btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.form-actions {
  margin-top: 2rem;
  display: flex;
  justify-content: space-between;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

/* Modal styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h4 {
  margin: 0;
  color: #004698;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;
}

.modal-body {
  padding: 1.5rem;
}

.confirmacion-modal {
  max-width: 500px;
}

.modal-body p {
  margin-bottom: 1rem;
}

.contrato-item {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
}

.modal-actions {
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

/* Vista Previa Styles */
.bloque {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.vista-previa {
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 1.5rem;
  background: #f8f9fa;
  margin-top: 2rem;
}

.preview-container {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.preview-header {
  color: white;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.preview-number {
  background-color: #c696c4;
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  padding: 0.5rem 1rem;
}

.preview-title-section {
  flex: 1;
}

.preview-main-title {
  color: black;
  font-size: 1.4rem;
  margin: 0;
  font-weight: bold;
  line-height: 1.2;
}

.preview-subtitle {
  color: #c696c4;
  font-size: 1.8rem;
  margin: 0;
  font-weight: bold;
  text-decoration: underline;
  line-height: 1.2;
}

.preview-content {
  background: white;
}

.preview-description {
  padding: 1.5rem;
  color: #333;
  font-size: 0.95rem;
  line-height: 1.5;
  text-align: justify;
}

.preview-stats-section{
  display: flex;
  padding: 1rem 1.5rem;
  justify-content: space-evenly;
  flex-wrap: wrap;
  align-content: space-around;
}

.preview-main-stat {
  background: #8C5CA6;
  color: white;
  padding: 2rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
}

.main-stat-value {
  font-size: 2.5rem;
  font-weight: bold;
  color: white;
  margin-bottom: 0.5rem;
  line-height: 1;
}

.main-stat-label {
  color: white;
  font-size: 1.1rem;
  opacity: 0.9;
}

.contracts-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem 1.5rem;
  border-radius: 8px;
}

.contracts-icon {
  font-size: 1.5rem;
}

.contracts-number {
  font-size: 1.8rem;
  font-weight: bold;
  background-color: #8B5CA5;
  width: 5rem;
  text-align: center;
}

.contracts-label {
  font-size: 1rem;
  color:black;
}

.preview-intermediate-text {
  padding: 1rem 1.5rem;
  background: white;
  font-weight: 600;
  color: #333;
  text-align: center;
  font-size: 1rem;
}

.preview-contracts-table {
  background: white;
  padding: 0 2rem 2rem;
}

.contracts-table-header {
  background: #c696c4;
  color: white;
  display: grid;
  grid-template-columns: 2fr 1fr 2fr;
  padding: 1rem 1.5rem;
  font-weight: 600;
  font-size: 0.9rem;
  justify-items: center;
}

.contracts-table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 2fr;
  padding: 0.75rem 1.5rem;
  border-bottom: 1px solid #eee;
  font-size: 0.9rem;
  color: #333;
  justify-items: center;
}

.contracts-table-total {
  background: #8C5CA6;
  color: white;
  font-weight: bold;
  display: grid;
  grid-template-columns: 2fr 1fr 2fr;
  padding: 0.75rem 1.5rem;
  font-size: 0.9rem;
  justify-items: center;
}

.header-col-tipo, .row-col-tipo {
  display: flex;
  align-items: center;
}

.header-col-num, .row-col-num {
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-col-importe, .row-col-importe {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .preview-main-stat {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .contracts-info {
    align-self: stretch;
    justify-content: center;
  }
  
  .preview-header {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
  
  .contracts-table-header,
  .contracts-table-row,
  .contracts-table-total {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .header-col-num, .row-col-num,
  .header-col-importe, .row-col-importe {
    justify-content: flex-start;
  }
}
</style>