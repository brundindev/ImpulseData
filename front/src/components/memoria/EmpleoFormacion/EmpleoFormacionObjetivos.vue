<template>
  <div class="form-step">
    <h3>Objetivos y Metas</h3>
    
    <div class="form-group">
      <label>Objetivos Generales</label>
      <div class="objetivos-generales">
        <div v-for="(objetivo, index) in datos.objetivosGenerales" :key="index" class="objetivo-item">
          <div class="objetivo-header">
            <h4>Objetivo {{ index + 1 }}</h4>
            <button 
              @click="eliminarObjetivo(index, 'general')" 
              class="btn btn-danger"
              type="button"
              v-if="datos.objetivosGenerales.length > 1"
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
              placeholder="Describa el objetivo general"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label>Metas Asociadas</label>
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
                <label>Indicador de Éxito</label>
                <input 
                  type="text" 
                  v-model="meta.indicador" 
                  class="form-control"
                  placeholder="Indicador para medir el éxito"
                >
              </div>
              
              <div class="form-group">
                <label>Valor Objetivo</label>
                <input 
                  type="number" 
                  v-model="meta.valorObjetivo" 
                  class="form-control"
                  min="0"
                  placeholder="Valor objetivo a alcanzar"
                >
              </div>
              
              <div class="form-group">
                <label>Valor Alcanzado</label>
                <input 
                  type="number" 
                  v-model="meta.valorAlcanzado" 
                  class="form-control"
                  min="0"
                  placeholder="Valor alcanzado"
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
        
        <button 
          @click="agregarObjetivo('general')" 
          class="btn btn-secondary"
          type="button"
        >
          Agregar Objetivo General
        </button>
      </div>
    </div>

    <div class="form-group">
      <label>Objetivos Específicos</label>
      <div class="objetivos-especificos">
        <div v-for="(objetivo, index) in datos.objetivosEspecificos" :key="index" class="objetivo-item">
          <div class="objetivo-header">
            <h4>Objetivo {{ index + 1 }}</h4>
            <button 
              @click="eliminarObjetivo(index, 'especifico')" 
              class="btn btn-danger"
              type="button"
              v-if="datos.objetivosEspecificos.length > 1"
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
              placeholder="Describa el objetivo específico"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label>Metas Asociadas</label>
            <div v-for="(meta, metaIndex) in objetivo.metas" :key="metaIndex" class="meta-item">
              <div class="meta-header">
                <h5>Meta {{ metaIndex + 1 }}</h5>
                <button 
                  @click="eliminarMetaEspecifica(index, metaIndex)" 
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
                <label>Indicador de Éxito</label>
                <input 
                  type="text" 
                  v-model="meta.indicador" 
                  class="form-control"
                  placeholder="Indicador para medir el éxito"
                >
              </div>
              
              <div class="form-group">
                <label>Valor Objetivo</label>
                <input 
                  type="number" 
                  v-model="meta.valorObjetivo" 
                  class="form-control"
                  min="0"
                  placeholder="Valor objetivo a alcanzar"
                >
              </div>
              
              <div class="form-group">
                <label>Valor Alcanzado</label>
                <input 
                  type="number" 
                  v-model="meta.valorAlcanzado" 
                  class="form-control"
                  min="0"
                  placeholder="Valor alcanzado"
                >
              </div>
            </div>
            
            <button 
              @click="agregarMetaEspecifica(index)" 
              class="btn btn-secondary"
              type="button"
            >
              Agregar Meta
            </button>
          </div>
        </div>
        
        <button 
          @click="agregarObjetivo('especifico')" 
          class="btn btn-secondary"
          type="button"
        >
          Agregar Objetivo Específico
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
if (!datos.value.objetivosGenerales) {
  datos.value.objetivosGenerales = [{
    descripcion: '',
    metas: [{
      descripcion: '',
      indicador: '',
      valorObjetivo: 0,
      valorAlcanzado: 0
    }]
  }];
}

if (!datos.value.objetivosEspecificos) {
  datos.value.objetivosEspecificos = [{
    descripcion: '',
    metas: [{
      descripcion: '',
      indicador: '',
      valorObjetivo: 0,
      valorAlcanzado: 0
    }]
  }];
}

const agregarObjetivo = (tipo) => {
  const nuevoObjetivo = {
    descripcion: '',
    metas: [{
      descripcion: '',
      indicador: '',
      valorObjetivo: 0,
      valorAlcanzado: 0
    }]
  };
  
  if (tipo === 'general') {
    datos.value.objetivosGenerales.push(nuevoObjetivo);
  } else {
    datos.value.objetivosEspecificos.push(nuevoObjetivo);
  }
};

const eliminarObjetivo = (index, tipo) => {
  if (tipo === 'general' && datos.value.objetivosGenerales.length > 1) {
    datos.value.objetivosGenerales.splice(index, 1);
  } else if (tipo === 'especifico' && datos.value.objetivosEspecificos.length > 1) {
    datos.value.objetivosEspecificos.splice(index, 1);
  }
};

const agregarMeta = (objetivoIndex) => {
  datos.value.objetivosGenerales[objetivoIndex].metas.push({
    descripcion: '',
    indicador: '',
    valorObjetivo: 0,
    valorAlcanzado: 0
  });
};

const eliminarMeta = (objetivoIndex, metaIndex) => {
  if (datos.value.objetivosGenerales[objetivoIndex].metas.length > 1) {
    datos.value.objetivosGenerales[objetivoIndex].metas.splice(metaIndex, 1);
  }
};

const agregarMetaEspecifica = (objetivoIndex) => {
  datos.value.objetivosEspecificos[objetivoIndex].metas.push({
    descripcion: '',
    indicador: '',
    valorObjetivo: 0,
    valorAlcanzado: 0
  });
};

const eliminarMetaEspecifica = (objetivoIndex, metaIndex) => {
  if (datos.value.objetivosEspecificos[objetivoIndex].metas.length > 1) {
    datos.value.objetivosEspecificos[objetivoIndex].metas.splice(metaIndex, 1);
  }
};

const esValido = computed(() => {
  const validarObjetivos = (objetivos) => {
    return objetivos.every(objetivo => 
      objetivo.descripcion && 
      objetivo.metas.every(meta => 
        meta.descripcion && 
        meta.indicador && 
        meta.valorObjetivo >= 0 && 
        meta.valorAlcanzado >= 0
      )
    );
  };

  return validarObjetivos(datos.value.objetivosGenerales) && 
         validarObjetivos(datos.value.objetivosEspecificos);
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

.meta-item {
  background: white;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
}

.objetivo-header,
.meta-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.objetivo-header h4,
.meta-header h5 {
  margin: 0;
  color: #004698;
}

.objetivo-header h4 {
  font-size: 1.2rem;
}

.meta-header h5 {
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