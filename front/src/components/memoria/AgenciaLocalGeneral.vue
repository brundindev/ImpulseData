<template>
  <div class="form-step">
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
        <label>Presupuesto inicial (€)</label>
        <input 
          type="number" 
          v-model="datos.cifras.presupuestoInicial" 
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

      <div class="form-group" v-if="mostrarPorcentajeEjecucion">
        <label>Porcentaje de ejecución (%)</label>
        <input 
          type="number" 
          v-model="datos.cifras.porcentajeEjecucion" 
          class="form-control"
          disabled
          readonly
          style="background-color: #e9ecef; cursor: not-allowed;"
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

      <div class="form-group">
        <label>Personas atendidas en orientación</label>
        <input 
          type="number" 
          v-model="datos.cifras.personasOrientacion" 
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
        <label>Personas contratadas</label>
        <input 
          type="number" 
          v-model="datos.cifras.personasContratadas" 
          class="form-control"
          min="0"
        >
      </div>

      <div class="form-group">
        <label>Horas de orientación realizadas</label>
        <input 
          type="number" 
          v-model="datos.cifras.horasOrientacion" 
          class="form-control"
          min="0"
        >
      </div>

      <div class="form-group">
        <label>Puestos de trabajo generados</label>
        <input 
          type="number" 
          v-model="datos.cifras.puestosGenerados" 
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
        <label>Participantes en actividades formativas</label>
        <input 
          type="number" 
          v-model="datos.cifras.participantesFormacion" 
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
        <label>Horas de formación</label>
        <input 
          type="number" 
          v-model="datos.cifras.horasFormacion" 
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
if (!datos.value.cifras) {
  datos.value.cifras = {
    presupuestoInicial: 0,
    presupuestoEjecutado: 0,
    porcentajeEjecucion: 0,
    totalUsuarios: 0,
    nuevosUsuarios: 0,
    ayudasEmpresas: 0,
    ayudasEntidades: 0,
    personasOrientacion: 0,
    ofertasEmpleo: 0,
    personasContratadas: 0,
    horasOrientacion: 0,
    puestosGenerados: 0,
    actividadesFormativas: 0,
    participantesFormacion: 0,
    empresasCreadas: 0,
    empresasViveros: 0,
    horasFormacion: 0,
    asesoramientos: 0
  };
}

const esValido = computed(() => {
  return datos.value.nombre && 
         datos.value.fechaCreacion && 
         datos.value.descripcion;
});

const mostrarPorcentajeEjecucion = ref(false);

const calcularPorcentajeEjecucion = () => {
  if (datos.value.cifras.presupuestoInicial && datos.value.cifras.presupuestoEjecutado) {
    mostrarPorcentajeEjecucion.value = true;
    const porcentaje = (datos.value.cifras.presupuestoEjecutado / datos.value.cifras.presupuestoInicial) * 100;
    datos.value.cifras.porcentajeEjecucion = Number(porcentaje.toFixed(2));
  } else {
    mostrarPorcentajeEjecucion.value = false;
    datos.value.cifras.porcentajeEjecucion = null;
  }
};
</script>

<style scoped>
.form-step {
  max-width: 1200px;
  margin: 0 auto;
}

.form-group {
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