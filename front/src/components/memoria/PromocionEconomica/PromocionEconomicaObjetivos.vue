<template>
  <div class="form-step">
    <h3>Objetivos</h3>
    
    <div class="form-group">
      <label>Objetivos Estratégicos</label>
      <div class="objetivos">
        <div v-for="(objetivo, index) in datos.objetivos" :key="index" class="objetivo-item">
          <div class="objetivo-header">
            <h4>Objetivo {{ index + 1 }}</h4>
            <button 
              @click="eliminarObjetivo(index)" 
              class="btn btn-danger"
              type="button"
              v-if="datos.objetivos.length > 1"
            >
              Eliminar
            </button>
          </div>
          
          <div class="form-group">
            <label>Descripción del Objetivo</label>
            <textarea 
              v-model="objetivo.descripcion" 
              class="form-control"
              rows="3"
              placeholder="Describa el objetivo estratégico"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label>Indicadores de Éxito</label>
            <div class="indicadores">
              <div v-for="(indicador, iIndex) in objetivo.indicadores" :key="iIndex" class="indicador-item">
                <div class="indicador-header">
                  <h5>Indicador {{ iIndex + 1 }}</h5>
                  <button 
                    @click="eliminarIndicador(index, iIndex)" 
                    class="btn btn-danger btn-sm"
                    type="button"
                    v-if="objetivo.indicadores.length > 1"
                  >
                    Eliminar
                  </button>
                </div>
                
                <div class="form-group">
                  <label>Descripción del Indicador</label>
                  <input 
                    type="text" 
                    v-model="indicador.descripcion" 
                    class="form-control"
                    placeholder="Describa el indicador de éxito"
                  >
                </div>
                
                <div class="form-group">
                  <label>Meta</label>
                  <input 
                    type="text" 
                    v-model="indicador.meta" 
                    class="form-control"
                    placeholder="Especifique la meta a alcanzar"
                  >
                </div>
                
                <div class="form-group">
                  <label>Plazo</label>
                  <input 
                    type="date" 
                    v-model="indicador.plazo" 
                    class="form-control"
                  >
                </div>
              </div>
              
              <button 
                @click="agregarIndicador(index)" 
                class="btn btn-secondary btn-sm"
                type="button"
              >
                Agregar Indicador
              </button>
            </div>
          </div>
          
          <div class="form-group">
            <label>Acciones Necesarias</label>
            <div class="acciones">
              <div v-for="(accion, aIndex) in objetivo.acciones" :key="aIndex" class="accion-item">
                <div class="accion-header">
                  <h5>Acción {{ aIndex + 1 }}</h5>
                  <button 
                    @click="eliminarAccion(index, aIndex)" 
                    class="btn btn-danger btn-sm"
                    type="button"
                    v-if="objetivo.acciones.length > 1"
                  >
                    Eliminar
                  </button>
                </div>
                
                <div class="form-group">
                  <label>Descripción de la Acción</label>
                  <textarea 
                    v-model="accion.descripcion" 
                    class="form-control"
                    rows="2"
                    placeholder="Describa la acción necesaria"
                  ></textarea>
                </div>
                
                <div class="form-group">
                  <label>Responsable</label>
                  <input 
                    type="text" 
                    v-model="accion.responsable" 
                    class="form-control"
                    placeholder="Nombre del responsable"
                  >
                </div>
                
                <div class="form-group">
                  <label>Fecha de Inicio</label>
                  <input 
                    type="date" 
                    v-model="accion.fechaInicio" 
                    class="form-control"
                  >
                </div>
                
                <div class="form-group">
                  <label>Fecha de Fin</label>
                  <input 
                    type="date" 
                    v-model="accion.fechaFin" 
                    class="form-control"
                  >
                </div>
              </div>
              
              <button 
                @click="agregarAccion(index)" 
                class="btn btn-secondary btn-sm"
                type="button"
              >
                Agregar Acción
              </button>
            </div>
          </div>
        </div>
        
        <button 
          @click="agregarObjetivo" 
          class="btn btn-secondary"
          type="button"
        >
          Agregar Objetivo
        </button>
      </div>
    </div>

    <div class="form-actions">
      <button 
        @click="$emit('anterior')" 
        class="btn btn-secondary"
        type="button"
      >
        Anterior
      </button>
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

const emit = defineEmits(['update:modelValue', 'siguiente', 'anterior']);

const datos = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// Inicializar datos si no existen
if (!datos.value.objetivos) {
  datos.value.objetivos = [{
    descripcion: '',
    indicadores: [{
      descripcion: '',
      meta: '',
      plazo: ''
    }],
    acciones: [{
      descripcion: '',
      responsable: '',
      fechaInicio: '',
      fechaFin: ''
    }]
  }];
}

const agregarObjetivo = () => {
  datos.value.objetivos.push({
    descripcion: '',
    indicadores: [{
      descripcion: '',
      meta: '',
      plazo: ''
    }],
    acciones: [{
      descripcion: '',
      responsable: '',
      fechaInicio: '',
      fechaFin: ''
    }]
  });
};

const eliminarObjetivo = (index) => {
  if (datos.value.objetivos.length > 1) {
    datos.value.objetivos.splice(index, 1);
  }
};

const agregarIndicador = (objetivoIndex) => {
  datos.value.objetivos[objetivoIndex].indicadores.push({
    descripcion: '',
    meta: '',
    plazo: ''
  });
};

const eliminarIndicador = (objetivoIndex, indicadorIndex) => {
  if (datos.value.objetivos[objetivoIndex].indicadores.length > 1) {
    datos.value.objetivos[objetivoIndex].indicadores.splice(indicadorIndex, 1);
  }
};

const agregarAccion = (objetivoIndex) => {
  datos.value.objetivos[objetivoIndex].acciones.push({
    descripcion: '',
    responsable: '',
    fechaInicio: '',
    fechaFin: ''
  });
};

const eliminarAccion = (objetivoIndex, accionIndex) => {
  if (datos.value.objetivos[objetivoIndex].acciones.length > 1) {
    datos.value.objetivos[objetivoIndex].acciones.splice(accionIndex, 1);
  }
};

const esValido = computed(() => {
  return datos.value.objetivos.every(objetivo => 
    objetivo.descripcion &&
    objetivo.indicadores.every(indicador => 
      indicador.descripcion && 
      indicador.meta && 
      indicador.plazo
    ) &&
    objetivo.acciones.every(accion => 
      accion.descripcion && 
      accion.responsable && 
      accion.fechaInicio && 
      accion.fechaFin
    )
  );
});
</script>

<style scoped>
.form-step {
  max-width: 800px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1.5rem;
}

.objetivo-item {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.objetivo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.objetivo-header h4 {
  margin: 0;
  color: #004698;
  font-size: 1.2rem;
}

.indicador-item,
.accion-item {
  background: white;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.indicador-header,
.accion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.indicador-header h5,
.accion-header h5 {
  margin: 0;
  color: #004698;
  font-size: 1rem;
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

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
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
</style> 