<template>
  <div class="form-step">
    <h3>Programas de Empleo</h3>
    
    <div class="form-group">
      <label>Programas de Orientación</label>
      <div class="programas">
        <div v-for="(programa, index) in datos.programasOrientacion" :key="index" class="programa-item">
          <div class="programa-header">
            <h4>Programa {{ index + 1 }}</h4>
            <button 
              @click="eliminarPrograma(index, 'orientacion')" 
              class="btn btn-danger"
              type="button"
              v-if="datos.programasOrientacion.length > 1"
            >
              Eliminar
            </button>
          </div>
          
          <div class="form-group">
            <label>Nombre del Programa</label>
            <input 
              type="text" 
              v-model="programa.nombre" 
              class="form-control"
              placeholder="Nombre del programa de orientación"
            >
          </div>
          
          <div class="form-group">
            <label>Descripción</label>
            <textarea 
              v-model="programa.descripcion" 
              class="form-control"
              rows="3"
              placeholder="Describa el programa y sus objetivos"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label>Personas Atendidas</label>
            <input 
              type="number" 
              v-model="programa.personasAtendidas" 
              class="form-control"
              min="0"
              placeholder="Número de personas atendidas"
            >
          </div>
          
          <div class="form-group">
            <label>Resultados</label>
            <textarea 
              v-model="programa.resultados" 
              class="form-control"
              rows="3"
              placeholder="Describa los resultados obtenidos"
            ></textarea>
          </div>
        </div>
        
        <button 
          @click="agregarPrograma('orientacion')" 
          class="btn btn-secondary"
          type="button"
        >
          Agregar Programa de Orientación
        </button>
      </div>
    </div>

    <div class="form-group">
      <label>Programas de Inserción</label>
      <div class="programas">
        <div v-for="(programa, index) in datos.programasInsercion" :key="index" class="programa-item">
          <div class="programa-header">
            <h4>Programa {{ index + 1 }}</h4>
            <button 
              @click="eliminarPrograma(index, 'insercion')" 
              class="btn btn-danger"
              type="button"
              v-if="datos.programasInsercion.length > 1"
            >
              Eliminar
            </button>
          </div>
          
          <div class="form-group">
            <label>Nombre del Programa</label>
            <input 
              type="text" 
              v-model="programa.nombre" 
              class="form-control"
              placeholder="Nombre del programa de inserción"
            >
          </div>
          
          <div class="form-group">
            <label>Descripción</label>
            <textarea 
              v-model="programa.descripcion" 
              class="form-control"
              rows="3"
              placeholder="Describa el programa y sus objetivos"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label>Personas Inscritas</label>
            <input 
              type="number" 
              v-model="programa.personasInscritas" 
              class="form-control"
              min="0"
              placeholder="Número de personas inscritas"
            >
          </div>
          
          <div class="form-group">
            <label>Personas Insertadas</label>
            <input 
              type="number" 
              v-model="programa.personasInsertadas" 
              class="form-control"
              min="0"
              placeholder="Número de personas insertadas"
            >
          </div>
          
          <div class="form-group">
            <label>Resultados</label>
            <textarea 
              v-model="programa.resultados" 
              class="form-control"
              rows="3"
              placeholder="Describa los resultados obtenidos"
            ></textarea>
          </div>
        </div>
        
        <button 
          @click="agregarPrograma('insercion')" 
          class="btn btn-secondary"
          type="button"
        >
          Agregar Programa de Inserción
        </button>
      </div>
    </div>

    <div class="form-group">
      <label>Colaboraciones con Empresas</label>
      <div class="colaboraciones">
        <div v-for="(colaboracion, index) in datos.colaboracionesEmpresas" :key="index" class="colaboracion-item">
          <div class="colaboracion-header">
            <h4>Colaboración {{ index + 1 }}</h4>
            <button 
              @click="eliminarColaboracion(index)" 
              class="btn btn-danger"
              type="button"
              v-if="datos.colaboracionesEmpresas.length > 1"
            >
              Eliminar
            </button>
          </div>
          
          <div class="form-group">
            <label>Nombre de la Empresa</label>
            <input 
              type="text" 
              v-model="colaboracion.empresa" 
              class="form-control"
              placeholder="Nombre de la empresa colaboradora"
            >
          </div>
          
          <div class="form-group">
            <label>Tipo de Colaboración</label>
            <select v-model="colaboracion.tipo" class="form-control">
              <option value="">Seleccione un tipo</option>
              <option value="practicas">Prácticas</option>
              <option value="contratacion">Contratación</option>
              <option value="formacion">Formación</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Descripción</label>
            <textarea 
              v-model="colaboracion.descripcion" 
              class="form-control"
              rows="3"
              placeholder="Describa la colaboración y sus resultados"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label>Personas Beneficiadas</label>
            <input 
              type="number" 
              v-model="colaboracion.personasBeneficiadas" 
              class="form-control"
              min="0"
              placeholder="Número de personas beneficiadas"
            >
          </div>
        </div>
        
        <button 
          @click="agregarColaboracion" 
          class="btn btn-secondary"
          type="button"
        >
          Agregar Colaboración
        </button>
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

const datos = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// Inicializar datos si no existen
if (!datos.value.programasOrientacion) {
  datos.value.programasOrientacion = [{
    nombre: '',
    descripcion: '',
    personasAtendidas: 0,
    resultados: ''
  }];
}

if (!datos.value.programasInsercion) {
  datos.value.programasInsercion = [{
    nombre: '',
    descripcion: '',
    personasInscritas: 0,
    personasInsertadas: 0,
    resultados: ''
  }];
}

if (!datos.value.colaboracionesEmpresas) {
  datos.value.colaboracionesEmpresas = [{
    empresa: '',
    tipo: '',
    descripcion: '',
    personasBeneficiadas: 0
  }];
}

const agregarPrograma = (tipo) => {
  if (tipo === 'orientacion') {
    datos.value.programasOrientacion.push({
      nombre: '',
      descripcion: '',
      personasAtendidas: 0,
      resultados: ''
    });
  } else {
    datos.value.programasInsercion.push({
      nombre: '',
      descripcion: '',
      personasInscritas: 0,
      personasInsertadas: 0,
      resultados: ''
    });
  }
};

const eliminarPrograma = (index, tipo) => {
  if (tipo === 'orientacion' && datos.value.programasOrientacion.length > 1) {
    datos.value.programasOrientacion.splice(index, 1);
  } else if (tipo === 'insercion' && datos.value.programasInsercion.length > 1) {
    datos.value.programasInsercion.splice(index, 1);
  }
};

const agregarColaboracion = () => {
  datos.value.colaboracionesEmpresas.push({
    empresa: '',
    tipo: '',
    descripcion: '',
    personasBeneficiadas: 0
  });
};

const eliminarColaboracion = (index) => {
  if (datos.value.colaboracionesEmpresas.length > 1) {
    datos.value.colaboracionesEmpresas.splice(index, 1);
  }
};

const esValido = computed(() => {
  return datos.value.programasOrientacion.every(programa => 
    programa.nombre && programa.descripcion && programa.personasAtendidas >= 0
  ) &&
  datos.value.programasInsercion.every(programa => 
    programa.nombre && programa.descripcion && 
    programa.personasInscritas >= 0 && programa.personasInsertadas >= 0
  ) &&
  datos.value.colaboracionesEmpresas.every(colaboracion => 
    colaboracion.empresa && colaboracion.tipo && colaboracion.descripcion
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

.programa-item,
.colaboracion-item {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.programa-header,
.colaboracion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.programa-header h4,
.colaboracion-header h4 {
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
  justify-content: flex-end;
}
</style> 