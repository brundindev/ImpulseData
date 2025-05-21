<template>
  <div class="form-step">
    <h3>Objetivos y Metas</h3>
    
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
            <label>Metas Asociadas</label>
            <div class="metas">
              <div v-for="(meta, metaIndex) in objetivo.metas" :key="metaIndex" class="meta-item">
                <div class="meta-header">
                  <h5>Meta {{ metaIndex + 1 }}</h5>
                  <button 
                    @click="eliminarMeta(index, metaIndex)" 
                    class="btn btn-danger"
                    type="button"
                    v-if="objetivo.metas.length > 1"
                  >
                    Eliminar
                  </button>
                </div>
                
                <div class="form-group">
                  <label>Descripción de la Meta</label>
                  <textarea 
                    v-model="meta.descripcion" 
                    class="form-control"
                    rows="2"
                    placeholder="Describa la meta"
                  ></textarea>
                </div>
                
                <div class="form-group">
                  <label>Indicador de Cumplimiento</label>
                  <input 
                    type="text" 
                    v-model="meta.indicador" 
                    class="form-control"
                    placeholder="Indicador de cumplimiento"
                  >
                </div>
                
                <div class="form-group">
                  <label>Valor Objetivo</label>
                  <input 
                    type="number" 
                    v-model="meta.valorObjetivo" 
                    class="form-control"
                    min="0"
                    placeholder="Valor objetivo"
                  >
                </div>
                
                <div class="form-group">
                  <label>Unidad de Medida</label>
                  <input 
                    type="text" 
                    v-model="meta.unidad" 
                    class="form-control"
                    placeholder="Unidad de medida"
                  >
                </div>
                
                <div class="form-group">
                  <label>Fecha de Cumplimiento</label>
                  <input 
                    type="date" 
                    v-model="meta.fechaCumplimiento" 
                    class="form-control"
                  >
                </div>
              </div>
              
              <button 
                @click="agregarMeta(index)" 
                class="btn btn-secondary"
                type="button"
              >
                Agregar Meta
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

    <div class="form-group">
      <label>Plan de Acción</label>
      <div class="plan-accion">
        <div v-for="(accion, index) in datos.planAccion" :key="index" class="accion-item">
          <div class="accion-header">
            <h4>Acción {{ index + 1 }}</h4>
            <button 
              @click="eliminarAccion(index)" 
              class="btn btn-danger"
              type="button"
              v-if="datos.planAccion.length > 1"
            >
              Eliminar
            </button>
          </div>
          
          <div class="form-group">
            <label>Descripción de la Acción</label>
            <textarea 
              v-model="accion.descripcion" 
              class="form-control"
              rows="3"
              placeholder="Describa la acción"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label>Responsable</label>
            <input 
              type="text" 
              v-model="accion.responsable" 
              class="form-control"
              placeholder="Responsable de la acción"
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
            <label>Fecha de Finalización</label>
            <input 
              type="date" 
              v-model="accion.fechaFin" 
              class="form-control"
            >
          </div>
          
          <div class="form-group">
            <label>Recursos Necesarios</label>
            <textarea 
              v-model="accion.recursos" 
              class="form-control"
              rows="2"
              placeholder="Describa los recursos necesarios"
            ></textarea>
          </div>
        </div>
        
        <button 
          @click="agregarAccion" 
          class="btn btn-secondary"
          type="button"
        >
          Agregar Acción
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
    metas: [{
      descripcion: '',
      indicador: '',
      valorObjetivo: 0,
      unidad: '',
      fechaCumplimiento: ''
    }]
  }];
}

if (!datos.value.planAccion) {
  datos.value.planAccion = [{
    descripcion: '',
    responsable: '',
    fechaInicio: '',
    fechaFin: '',
    recursos: ''
  }];
}

const agregarObjetivo = () => {
  datos.value.objetivos.push({
    descripcion: '',
    metas: [{
      descripcion: '',
      indicador: '',
      valorObjetivo: 0,
      unidad: '',
      fechaCumplimiento: ''
    }]
  });
};

const eliminarObjetivo = (index) => {
  if (datos.value.objetivos.length > 1) {
    datos.value.objetivos.splice(index, 1);
  }
};

const agregarMeta = (objetivoIndex) => {
  datos.value.objetivos[objetivoIndex].metas.push({
    descripcion: '',
    indicador: '',
    valorObjetivo: 0,
    unidad: '',
    fechaCumplimiento: ''
  });
};

const eliminarMeta = (objetivoIndex, metaIndex) => {
  if (datos.value.objetivos[objetivoIndex].metas.length > 1) {
    datos.value.objetivos[objetivoIndex].metas.splice(metaIndex, 1);
  }
};

const agregarAccion = () => {
  datos.value.planAccion.push({
    descripcion: '',
    responsable: '',
    fechaInicio: '',
    fechaFin: '',
    recursos: ''
  });
};

const eliminarAccion = (index) => {
  if (datos.value.planAccion.length > 1) {
    datos.value.planAccion.splice(index, 1);
  }
};

const esValido = computed(() => {
  return datos.value.objetivos.every(objetivo => 
    objetivo.descripcion &&
    objetivo.metas.every(meta => 
      meta.descripcion && 
      meta.indicador && 
      meta.valorObjetivo >= 0 && 
      meta.unidad && 
      meta.fechaCumplimiento
    )
  ) &&
  datos.value.planAccion.every(accion => 
    accion.descripcion && 
    accion.responsable && 
    accion.fechaInicio && 
    accion.fechaFin && 
    accion.recursos
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

.objetivo-item,
.accion-item {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.objetivo-header,
.accion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.objetivo-header h4,
.accion-header h4 {
  margin: 0;
  color: #004698;
  font-size: 1.2rem;
}

.meta-item {
  background: white;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.meta-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.meta-header h5 {
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