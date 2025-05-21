<template>
  <div class="form-step">
    <h3>Conclusiones y Recomendaciones</h3>
    
    <div class="form-group">
      <label>Conclusiones</label>
      <div class="conclusiones">
        <div v-for="(conclusion, index) in datos.conclusiones" :key="index" class="conclusion-item">
          <div class="conclusion-header">
            <h4>Conclusión {{ index + 1 }}</h4>
            <button 
              @click="eliminarConclusion(index)" 
              class="btn btn-danger"
              type="button"
              v-if="datos.conclusiones.length > 1"
            >
              Eliminar
            </button>
          </div>
          
          <div class="form-group">
            <label>Descripción</label>
            <textarea 
              v-model="conclusion.descripcion" 
              class="form-control"
              rows="3"
              placeholder="Describa la conclusión"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label>Área Relacionada</label>
            <select v-model="conclusion.area" class="form-control">
              <option value="">Seleccione un área</option>
              <option value="empleo">Empleo</option>
              <option value="formacion">Formación</option>
              <option value="orientacion">Orientación</option>
              <option value="insercion">Inserción</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Impacto</label>
            <select v-model="conclusion.impacto" class="form-control">
              <option value="">Seleccione el impacto</option>
              <option value="alto">Alto</option>
              <option value="medio">Medio</option>
              <option value="bajo">Bajo</option>
            </select>
          </div>
        </div>
        
        <button 
          @click="agregarConclusion" 
          class="btn btn-secondary"
          type="button"
        >
          Agregar Conclusión
        </button>
      </div>
    </div>

    <div class="form-group">
      <label>Recomendaciones</label>
      <div class="recomendaciones">
        <div v-for="(recomendacion, index) in datos.recomendaciones" :key="index" class="recomendacion-item">
          <div class="recomendacion-header">
            <h4>Recomendación {{ index + 1 }}</h4>
            <button 
              @click="eliminarRecomendacion(index)" 
              class="btn btn-danger"
              type="button"
              v-if="datos.recomendaciones.length > 1"
            >
              Eliminar
            </button>
          </div>
          
          <div class="form-group">
            <label>Descripción</label>
            <textarea 
              v-model="recomendacion.descripcion" 
              class="form-control"
              rows="3"
              placeholder="Describa la recomendación"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label>Área de Aplicación</label>
            <select v-model="recomendacion.area" class="form-control">
              <option value="">Seleccione un área</option>
              <option value="empleo">Empleo</option>
              <option value="formacion">Formación</option>
              <option value="orientacion">Orientación</option>
              <option value="insercion">Inserción</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Prioridad</label>
            <select v-model="recomendacion.prioridad" class="form-control">
              <option value="">Seleccione la prioridad</option>
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Plazo de Implementación</label>
            <select v-model="recomendacion.plazo" class="form-control">
              <option value="">Seleccione el plazo</option>
              <option value="corto">Corto Plazo (0-6 meses)</option>
              <option value="medio">Medio Plazo (6-12 meses)</option>
              <option value="largo">Largo Plazo (más de 12 meses)</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Recursos Necesarios</label>
            <textarea 
              v-model="recomendacion.recursos" 
              class="form-control"
              rows="2"
              placeholder="Describa los recursos necesarios para implementar la recomendación"
            ></textarea>
          </div>
        </div>
        
        <button 
          @click="agregarRecomendacion" 
          class="btn btn-secondary"
          type="button"
        >
          Agregar Recomendación
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
if (!datos.value.conclusiones) {
  datos.value.conclusiones = [{
    descripcion: '',
    area: '',
    impacto: ''
  }];
}

if (!datos.value.recomendaciones) {
  datos.value.recomendaciones = [{
    descripcion: '',
    area: '',
    prioridad: '',
    plazo: '',
    recursos: ''
  }];
}

const agregarConclusion = () => {
  datos.value.conclusiones.push({
    descripcion: '',
    area: '',
    impacto: ''
  });
};

const eliminarConclusion = (index) => {
  if (datos.value.conclusiones.length > 1) {
    datos.value.conclusiones.splice(index, 1);
  }
};

const agregarRecomendacion = () => {
  datos.value.recomendaciones.push({
    descripcion: '',
    area: '',
    prioridad: '',
    plazo: '',
    recursos: ''
  });
};

const eliminarRecomendacion = (index) => {
  if (datos.value.recomendaciones.length > 1) {
    datos.value.recomendaciones.splice(index, 1);
  }
};

const esValido = computed(() => {
  return datos.value.conclusiones.every(conclusion => 
    conclusion.descripcion && conclusion.area && conclusion.impacto
  ) &&
  datos.value.recomendaciones.every(recomendacion => 
    recomendacion.descripcion && 
    recomendacion.area && 
    recomendacion.prioridad && 
    recomendacion.plazo
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

.conclusion-item,
.recomendacion-item {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.conclusion-header,
.recomendacion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.conclusion-header h4,
.recomendacion-header h4 {
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