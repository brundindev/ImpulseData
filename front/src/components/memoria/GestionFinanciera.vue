<template>
  <div class="form-step">
    <h3>Departamento Jurídico Administrativo</h3>
    
    <div class="form-group">
      <label>Importe Adjudicación</label>
      <input 
        type="number" 
        v-model="datos.importeAdjudicacion" 
        class="form-control"
        min="0"
        placeholder="Importe Adjudicación"
      >
    </div>

    <div class="form-group">
      <label>Nº de Contratos</label>
      <div v-for="(contrato, index) in datos.contratos" :key="index" class="item">
        <div class="item-header">
          <h4>Contrato {{ index + 1 }}</h4>
          <button 
            @click="eliminarContrato(index)" 
            class="btn btn-danger btn-sm"
            type="button"
            v-if="datos.contratos.length > 1"
          >
            <span class="btn-icon">✕</span>
          </button>
        </div>
        
        <div class="form-group">
          <label>Concepto</label>
          <input 
            type="text" 
            v-model="contrato.concepto" 
            class="form-control"
            placeholder="Concepto del contrato"
          >
        </div>
        
        <div class="form-group">
          <label>Cantidad</label>
          <input 
            type="number" 
            v-model="contrato.cantidad" 
            class="form-control"
            min="0"
            placeholder="Cantidad en euros"
          >
        </div>
      </div>
      
      <button 
        @click="agregarIngreso" 
        class="btn btn-secondary"
        type="button"
      >
        Agregar Contrato
      </button>
    </div>


    <div class="form-group">
      <label>Balance Final</label>
      <div class="balance">
        <p>Ingresos Totales: {{ ingresosTotales }}€</p>
        <p>Gastos Totales: {{ gastosTotales }}€</p>
        <p>Balance: {{ balance }}€</p>
      </div>
    </div>

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

const emit = defineEmits(['update:modelValue', 'siguiente', 'anterior']);

const datos = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// Inicializar datos si no existen
if (!datos.value.presupuestoTotal) datos.value.presupuestoTotal = 0;
if (!datos.value.ingresos) {
  datos.value.ingresos = [{
    concepto: '',
    cantidad: 0
  }];
}
if (!datos.value.gastos) {
  datos.value.gastos = [{
    concepto: '',
    cantidad: 0
  }];
}

const agregarIngreso = () => {
  datos.value.ingresos.push({
    concepto: '',
    cantidad: 0
  });
};

const eliminarIngreso = (index) => {
  if (datos.value.ingresos.length > 1) {
    datos.value.ingresos.splice(index, 1);
  }
};

const agregarGasto = () => {
  datos.value.gastos.push({
    concepto: '',
    cantidad: 0
  });
};

const eliminarGasto = (index) => {
  if (datos.value.gastos.length > 1) {
    datos.value.gastos.splice(index, 1);
  }
};

const ingresosTotales = computed(() => {
  return datos.value.ingresos.reduce((total, ingreso) => total + (ingreso.cantidad || 0), 0);
});

const gastosTotales = computed(() => {
  return datos.value.gastos.reduce((total, gasto) => total + (gasto.cantidad || 0), 0);
});

const balance = computed(() => {
  return ingresosTotales.value - gastosTotales.value;
});

const esValido = computed(() => {
  return datos.value.presupuestoTotal >= 0 &&
         datos.value.ingresos.every(ingreso => 
           ingreso.concepto && ingreso.cantidad >= 0
         ) &&
         datos.value.gastos.every(gasto => 
           gasto.concepto && gasto.cantidad >= 0
         );
});

const guardarYFinalizar = () => {
  // Guardar los datos
  emit('guardar', datos.value);
  
  // Si todo está completo, cerrar el formulario
  if (esValido.value) {
    emit('siguiente');
  }
};
</script>

<style scoped>
.form-step {
  max-width: 800px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1.5rem;
}

.item {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.item-header h4 {
  margin: 0;
  color: #004698;
  font-size: 1.2rem;
}

.balance {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
}

.balance p {
  margin: 0.5rem 0;
  font-size: 1.1rem;
}

.balance p:last-child {
  font-weight: bold;
  color: #004698;
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

.btn-icon {
  margin-right: 0.25rem;
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