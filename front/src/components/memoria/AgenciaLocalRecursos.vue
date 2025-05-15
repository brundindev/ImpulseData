<template>
  <div class="form-step">
    <h3>Gestión de Recursos</h3>
    
    <div class="form-group">
      <label>Recursos Humanos</label>
      <div class="recursos-humanos">
        <div v-for="(recurso, index) in datos.recursosHumanos" :key="index" class="recurso-item">
          <div class="recurso-header">
            <h4>Recurso {{ index + 1 }}</h4>
            <button 
              @click="eliminarRecurso(index)" 
              class="btn btn-danger"
              type="button"
              v-if="datos.recursosHumanos.length > 1"
            >
              Eliminar
            </button>
          </div>
          
          <div class="form-group">
            <label>Categoría</label>
            <select v-model="recurso.categoria" class="form-control">
              <option value="">Seleccione una categoría</option>
              <option value="personal">Personal</option>
              <option value="consultor">Consultor</option>
              <option value="becario">Becario</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Número de Personas</label>
            <input 
              type="number" 
              v-model="recurso.numeroPersonas" 
              class="form-control"
              min="0"
              placeholder="Número de personas en esta categoría"
            >
          </div>
          
          <div class="form-group">
            <label>Descripción de Funciones</label>
            <textarea 
              v-model="recurso.funciones" 
              class="form-control"
              rows="3"
              placeholder="Describa las funciones principales de esta categoría"
            ></textarea>
          </div>
        </div>
        
        <button 
          @click="agregarRecurso" 
          class="btn btn-secondary"
          type="button"
        >
          Agregar Recurso Humano
        </button>
      </div>
    </div>

    <div class="form-group">
      <label>Recursos Materiales</label>
      <div class="recursos-materiales">
        <div v-for="(recurso, index) in datos.recursosMateriales" :key="index" class="recurso-item">
          <div class="recurso-header">
            <h4>Recurso {{ index + 1 }}</h4>
            <button 
              @click="eliminarRecursoMaterial(index)" 
              class="btn btn-danger"
              type="button"
              v-if="datos.recursosMateriales.length > 1"
            >
              Eliminar
            </button>
          </div>
          
          <div class="form-group">
            <label>Tipo de Recurso</label>
            <select v-model="recurso.tipo" class="form-control">
              <option value="">Seleccione un tipo</option>
              <option value="oficina">Oficina</option>
              <option value="equipamiento">Equipamiento</option>
              <option value="tecnologia">Tecnología</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Descripción</label>
            <textarea 
              v-model="recurso.descripcion" 
              class="form-control"
              rows="3"
              placeholder="Describa el recurso material"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label>Valor Estimado (€)</label>
            <input 
              type="number" 
              v-model="recurso.valor" 
              class="form-control"
              min="0"
              step="0.01"
              placeholder="Valor estimado del recurso"
            >
          </div>
        </div>
        
        <button 
          @click="agregarRecursoMaterial" 
          class="btn btn-secondary"
          type="button"
        >
          Agregar Recurso Material
        </button>
      </div>
    </div>

    <div class="form-group">
      <label>Recursos Financieros</label>
      <div class="recursos-financieros">
        <div class="form-group">
          <label>Presupuesto Total (€)</label>
          <input 
            type="number" 
            v-model="datos.recursosFinancieros.presupuestoTotal" 
            class="form-control"
            min="0"
            step="0.01"
            placeholder="Presupuesto total disponible"
          >
        </div>
        
        <div class="form-group">
          <label>Fuentes de Financiación</label>
          <div v-for="(fuente, index) in datos.recursosFinancieros.fuentes" :key="index" class="fuente-item">
            <div class="fuente-header">
              <h4>Fuente {{ index + 1 }}</h4>
              <button 
                @click="eliminarFuente(index)" 
                class="btn btn-danger"
                type="button"
                v-if="datos.recursosFinancieros.fuentes.length > 1"
              >
                Eliminar
              </button>
            </div>
            
            <div class="form-group">
              <label>Nombre de la Fuente</label>
              <input 
                type="text" 
                v-model="fuente.nombre" 
                class="form-control"
                placeholder="Nombre de la fuente de financiación"
              >
            </div>
            
            <div class="form-group">
              <label>Importe (€)</label>
              <input 
                type="number" 
                v-model="fuente.importe" 
                class="form-control"
                min="0"
                step="0.01"
                placeholder="Importe de la financiación"
              >
            </div>
            
            <div class="form-group">
              <label>Descripción</label>
              <textarea 
                v-model="fuente.descripcion" 
                class="form-control"
                rows="2"
                placeholder="Describa la fuente de financiación"
              ></textarea>
            </div>
          </div>
          
          <button 
            @click="agregarFuente" 
            class="btn btn-secondary"
            type="button"
          >
            Agregar Fuente de Financiación
          </button>
        </div>
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
if (!datos.value.recursosHumanos) {
  datos.value.recursosHumanos = [{
    categoria: '',
    numeroPersonas: 0,
    funciones: ''
  }];
}

if (!datos.value.recursosMateriales) {
  datos.value.recursosMateriales = [{
    tipo: '',
    descripcion: '',
    valor: 0
  }];
}

if (!datos.value.recursosFinancieros) {
  datos.value.recursosFinancieros = {
    presupuestoTotal: 0,
    fuentes: [{
      nombre: '',
      importe: 0,
      descripcion: ''
    }]
  };
}

const agregarRecurso = () => {
  datos.value.recursosHumanos.push({
    categoria: '',
    numeroPersonas: 0,
    funciones: ''
  });
};

const eliminarRecurso = (index) => {
  if (datos.value.recursosHumanos.length > 1) {
    datos.value.recursosHumanos.splice(index, 1);
  }
};

const agregarRecursoMaterial = () => {
  datos.value.recursosMateriales.push({
    tipo: '',
    descripcion: '',
    valor: 0
  });
};

const eliminarRecursoMaterial = (index) => {
  if (datos.value.recursosMateriales.length > 1) {
    datos.value.recursosMateriales.splice(index, 1);
  }
};

const agregarFuente = () => {
  datos.value.recursosFinancieros.fuentes.push({
    nombre: '',
    importe: 0,
    descripcion: ''
  });
};

const eliminarFuente = (index) => {
  if (datos.value.recursosFinancieros.fuentes.length > 1) {
    datos.value.recursosFinancieros.fuentes.splice(index, 1);
  }
};

const esValido = computed(() => {
  return datos.value.recursosHumanos.every(recurso => 
    recurso.categoria && recurso.numeroPersonas > 0 && recurso.funciones
  ) &&
  datos.value.recursosMateriales.every(recurso => 
    recurso.tipo && recurso.descripcion && recurso.valor >= 0
  ) &&
  datos.value.recursosFinancieros.presupuestoTotal >= 0 &&
  datos.value.recursosFinancieros.fuentes.every(fuente => 
    fuente.nombre && fuente.importe >= 0
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

.recurso-item,
.fuente-item {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.recurso-header,
.fuente-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.recurso-header h4,
.fuente-header h4 {
  margin: 0;
  color: #004698;
  font-size: 1.2rem;
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