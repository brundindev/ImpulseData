<template>
  <div class="form-step">
    <h3>Ayudas Económicas a Empresas de la Ciudad de Alicante</h3>

    <div class="form-group">
      <label>Resumen Total</label>
      <div class="indicadores">
        <div class="form-group">
          <label>Importe Total Concedido (€)</label>
          <input
            type="number"
            v-model="datos.importeTotalConcedido"
            class="form-control"
            min="0"
            step="0.01"
            placeholder="Importe total de ayudas concedidas"
          >
        </div>

        <div class="form-group">
          <label>Empresas Beneficiarias Totales</label>
          <input
            type="number"
            v-model="datos.empresasBeneficiariasTotales"
            class="form-control"
            min="0"
            placeholder="Número total de empresas beneficiarias"
          >
        </div>
      </div>
    </div>

    <div class="form-group">
      <label>Detalle por Ayuda/Subvención</label>
      <div class="table-responsive">
        <table class="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Nombre Ayuda/Subvención</th>
              <th>Procedencia Fondos</th>
              <th>Solicitadas</th>
              <th>Aprobadas</th>
              <th>Importe Concedido (€)</th>
              <th>Denegadas</th>
              <th>Renuncias</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(ayuda, index) in datos.ayudas" :key="index">
              <td><input type="text" v-model="ayuda.nombre" class="form-control form-control-sm" placeholder="Nombre"></td>
              <td><input type="text" v-model="ayuda.procedencia" class="form-control form-control-sm" placeholder="Procedencia"></td>
              <td><input type="number" v-model="ayuda.solicitadas" class="form-control form-control-sm" min="0" placeholder="0"></td>
              <td><input type="number" v-model="ayuda.aprobadas" class="form-control form-control-sm" min="0" placeholder="0"></td>
              <td><input type="number" v-model="ayuda.importeConcedido" class="form-control form-control-sm" min="0" step="0.01" placeholder="0.00"></td>
              <td><input type="number" v-model="ayuda.denegadas" class="form-control form-control-sm" min="0" placeholder="0"></td>
              <td><input type="number" v-model="ayuda.renuncias" class="form-control form-control-sm" min="0" placeholder="0"></td>
              <td>
                <button
                  @click="eliminarAyuda(index)"
                  class="btn btn-danger btn-sm"
                  type="button"
                  v-if="datos.ayudas.length > 1"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" class="text-end"><strong>Total:</strong></td>
              <td><strong>{{ totalSolicitadas }}</strong></td>
              <td><strong>{{ totalAprobadas }}</strong></td>
              <td><strong>{{ totalImporteConcedido.toFixed(2) }} €</strong></td>
              <td><strong>{{ totalDenegadas }}</strong></td>
              <td><strong>{{ totalRenuncias }}</strong></td>
              <td></td> <!-- Celda vacía para la columna de acciones -->
            </tr>
          </tfoot>
        </table>
      </div>
      <button
        @click="agregarAyuda"
        class="btn btn-secondary btn-sm mt-3"
        type="button"
      >
        Agregar Ayuda/Subvención
      </button>
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

// Inicializar datos
if (!datos.value.importeTotalConcedido) datos.value.importeTotalConcedido = 0;
if (!datos.value.empresasBeneficiariasTotales) datos.value.empresasBeneficiariasTotales = 0;

// Inicializar array de ayudas
if (!datos.value.ayudas || datos.value.ayudas.length === 0) {
  datos.value.ayudas = [{
    nombre: '',
    procedencia: '',
    solicitadas: 0,
    aprobadas: 0,
    importeConcedido: 0,
    denegadas: 0,
    renuncias: 0,
  }];
}

// Método para agregar una nueva ayuda
const agregarAyuda = () => {
  datos.value.ayudas.push({
    nombre: '',
    procedencia: '',
    solicitadas: 0,
    aprobadas: 0,
    importeConcedido: 0,
    denegadas: 0,
    renuncias: 0,
  });
};

// Método para eliminar una ayuda
const eliminarAyuda = (index) => {
  if (datos.value.ayudas.length > 1) {
    datos.value.ayudas.splice(index, 1);
  }
};

// Métodos computados para calcular los totales
const totalSolicitadas = computed(() => {
  return datos.value.ayudas.reduce((sum, ayuda) => sum + (Number(ayuda.solicitadas) || 0), 0);
});

const totalAprobadas = computed(() => {
  return datos.value.ayudas.reduce((sum, ayuda) => sum + (Number(ayuda.aprobadas) || 0), 0);
});

const totalImporteConcedido = computed(() => {
  return datos.value.ayudas.reduce((sum, ayuda) => sum + (Number(ayuda.importeConcedido) || 0), 0);
});

const totalDenegadas = computed(() => {
  return datos.value.ayudas.reduce((sum, ayuda) => sum + (Number(ayuda.denegadas) || 0), 0);
});

const totalRenuncias = computed(() => {
  return datos.value.ayudas.reduce((sum, ayuda) => sum + (Number(ayuda.renuncias) || 0), 0);
});

const esValido = computed(() => {
  return datos.value.importeTotalConcedido >= 0 &&
         datos.value.empresasBeneficiariasTotales >= 0 &&
         datos.value.ayudas.every(ayuda =>
           ayuda.nombre &&
           ayuda.procedencia &&
           ayuda.solicitadas >= 0 &&
           ayuda.aprobadas >= 0 &&
           ayuda.importeConcedido >= 0 &&
           ayuda.denegadas >= 0 &&
           ayuda.renuncias >= 0
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

.indicadores {
    display: flex;
    gap: 20px;
    margin-bottom: 1.5rem;
}

.indicadores .form-group {
    flex: 1;
    margin-bottom: 0;
}

/* Estilos para la tabla */
.table-responsive {
    width: 100%;
    overflow-x: auto; /* Permite scroll horizontal en pantallas pequeñas */
    margin-top: 1rem;
}

.table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1rem; /* Espacio antes del botón de agregar */
}

.table th,
.table td {
    padding: 8px;
    text-align: left;
    border: 1px solid #ddd; /* Bordes de celda */
}

.table th {
    background-color: #f0803b; /* Naranja para las cabeceras */
    font-weight: bold;
    color: white; /* Texto blanco para contraste */
}

.table-striped tbody tr:nth-child(odd) {
    background-color: #fff3e0; /* Rayado de filas en naranja claro */
}

.table-bordered th,
.table-bordered td {
    border: 1px solid #f0803b; /* Bordes naranjas */
}

.table tfoot tr {
    background-color: #fcd7b0; /* Fondo naranja más claro para la fila de totales */
    font-weight: bold;
    color: #333; /* Texto oscuro para contraste */
}

.form-control-sm {
    padding: 0.25rem 0.5rem; /* Padding reducido para inputs dentro de la tabla */
    font-size: 0.875rem;
}

.text-end {
    text-align: right;
}

.btn-sm {
    padding: 0.25rem 0.5rem; /* Padding reducido para botones pequeños */
    font-size: 0.875rem;
}

.form-actions {
  margin-top: 2rem;
  display: flex;
  justify-content: space-between;
}

@media (max-width: 768px) {
    .indicadores {
        flex-direction: column;
        gap: 1.5rem;
    }

    .indicadores .form-group {
        flex: none;
    }
    
    .table th,
    .table td {
        /* Ajustes para pantallas pequeñas si es necesario */
        white-space: nowrap; /* Evita que el texto se corte */
    }
}

</style> 