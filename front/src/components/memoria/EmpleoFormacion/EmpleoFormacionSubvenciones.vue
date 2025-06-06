<template>
  <div class="form-step">
    <h3>SUBVENCIONES A ENTIDADES</h3>

    <!-- Campos iniciales -->
    <div class="form-section">
      <div class="form-group">
        <label>Subvenciones a entidades y convenios nominativos (€)</label>
        <input
          type="number"
          v-model.number="datos.importeTotalSubvenciones"
          class="form-control"
          min="0"
          step="0.01"
          placeholder="Importe total en euros"
        >
      </div>

      <div class="form-group">
        <label>Entidades Beneficiarias</label>
        <input
          type="number"
          v-model.number="datos.entidadesBeneficiarias"
          class="form-control"
          min="0"
          placeholder="Número de entidades beneficiarias"
        >
      </div>

      <div class="form-group">
        <label>Personas Usuarias</label>
        <input
          type="number"
          v-model.number="datos.personasUsuarias"
          class="form-control"
          min="0"
          placeholder="Número de personas usuarias"
        >
      </div>
    </div>

    <!-- Subvenciones a entidades sin ánimo de lucro -->
    <div class="form-section">
      <h4>Subvenciones a entidades sin ánimo de lucro</h4>

      <div class="form-group">
        <label>Breve Descripción</label>
        <textarea
          v-model="datos.subvencionesSinAnimoLucro.descripcion"
          class="form-control"
          rows="3"
          placeholder="Breve descripción de las subvenciones"
        ></textarea>
      </div>

      <div class="form-group">
        <label>Importe total (€)</label>
        <input
          type="number"
          v-model.number="datos.subvencionesSinAnimoLucro.importeTotal"
          class="form-control"
          min="0"
          step="0.01"
          placeholder="Importe total en euros"
        >
      </div>

      <!-- Modalidades -->
      <div class="modalidades-section">
        <h5>Modalidades</h5>

        <!-- Modalidad A -->
        <div class="modalidad-item form-section-compact">
          <h6>Modalidad A</h6>
          <div class="form-group">
            <label>Número de proyectos</label>
            <input
              type="number"
              v-model.number="datos.subvencionesSinAnimoLucro.modalidadA.numeroProyectos"
              class="form-control"
              min="0"
            >
          </div>
          <div class="form-group">
            <label>Descripción</label>
            <textarea
              v-model="datos.subvencionesSinAnimoLucro.modalidadA.descripcion"
              class="form-control"
              rows="2"
              placeholder="Descripción de la modalidad A"
            ></textarea>
          </div>
          <div class="form-group">
            <label>Importe (€)</label>
            <input
              type="number"
              v-model.number="datos.subvencionesSinAnimoLucro.modalidadA.importe"
              class="form-control"
              min="0"
              step="0.01"
              placeholder="Importe de la modalidad A"
            >
          </div>

          <!-- Tabla Modalidad A -->
          <div class="table-responsive mt-3">
            <h6>Proyectos Modalidad A</h6>
            <table class="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>Nº Proyecto</th>
                  <th>Entidad del proyecto</th>
                  <th>Subvención concedida (€)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(proyecto, index) in datos.subvencionesSinAnimoLucro.modalidadA.proyectos" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>
                    <input type="text" v-model="proyecto.entidad" class="form-control form-control-sm">
                  </td>
                  <td>
                    <input type="number" v-model.number="proyecto.subvencion" class="form-control form-control-sm" min="0" step="0.01">
                  </td>
                </tr>
                <tr>
                  <td colspan="2" class="text-end"><strong>TOTAL</strong></td>
                  <td><strong>{{ totalSubvencionModalidad('modalidadA') }} €</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Modalidad B -->
         <div class="modalidad-item form-section-compact">
          <h6>Modalidad B</h6>
          <div class="form-group">
            <label>Número de proyectos</label>
            <input
              type="number"
              v-model.number="datos.subvencionesSinAnimoLucro.modalidadB.numeroProyectos"
              class="form-control"
              min="0"
            >
          </div>
          <div class="form-group">
            <label>Descripción</label>
            <textarea
              v-model="datos.subvencionesSinAnimoLucro.modalidadB.descripcion"
              class="form-control"
              rows="2"
              placeholder="Descripción de la modalidad B"
            ></textarea>
          </div>
          <div class="form-group">
            <label>Importe (€)</label>
            <input
              type="number"
              v-model.number="datos.subvencionesSinAnimoLucro.modalidadB.importe"
              class="form-control"
              min="0"
              step="0.01"
              placeholder="Importe de la modalidad B"
            >
          </div>

           <!-- Tabla Modalidad B -->
          <div class="table-responsive mt-3">
            <h6>Proyectos Modalidad B</h6>
            <table class="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>Nº Proyecto</th>
                  <th>Entidad del proyecto</th>
                  <th>Subvención concedida (€)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(proyecto, index) in datos.subvencionesSinAnimoLucro.modalidadB.proyectos" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>
                    <input type="text" v-model="proyecto.entidad" class="form-control form-control-sm">
                  </td>
                  <td>
                    <input type="number" v-model.number="proyecto.subvencion" class="form-control form-control-sm" min="0" step="0.01">
                  </td>
                </tr>
                 <tr>
                  <td colspan="2" class="text-end"><strong>TOTAL</strong></td>
                  <td><strong>{{ totalSubvencionModalidad('modalidadB') }} €</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Modalidad C -->
         <div class="modalidad-item form-section-compact">
          <h6>Modalidad C</h6>
          <div class="form-group">
            <label>Número de proyectos</label>
            <input
              type="number"
              v-model.number="datos.subvencionesSinAnimoLucro.modalidadC.numeroProyectos"
              class="form-control"
              min="0"
            >
          </div>
          <div class="form-group">
            <label>Descripción</label>
            <textarea
              v-model="datos.subvencionesSinAnimoLucro.modalidadC.descripcion"
              class="form-control"
              rows="2"
              placeholder="Descripción de la modalidad C"
            ></textarea>
          </div>
          <div class="form-group">
            <label>Importe (€)</label>
            <input
              type="number"
              v-model.number="datos.subvencionesSinAnimoLucro.modalidadC.importe"
              class="form-control"
              min="0"
              step="0.01"
              placeholder="Importe de la modalidad C"
            >
          </div>

           <!-- Tabla Modalidad C -->
          <div class="table-responsive mt-3">
            <h6>Proyectos Modalidad C</h6>
            <table class="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>Nº Proyecto</th>
                  <th>Entidad del proyecto</th>
                  <th>Subvención concedida (€)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(proyecto, index) in datos.subvencionesSinAnimoLucro.modalidadC.proyectos" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>
                    <input type="text" v-model="proyecto.entidad" class="form-control form-control-sm">
                  </td>
                  <td>
                    <input type="number" v-model.number="proyecto.subvencion" class="form-control form-control-sm" min="0" step="0.01">
                  </td>
                </tr>
                 <tr>
                  <td colspan="2" class="text-end"><strong>TOTAL</strong></td>
                  <td><strong>{{ totalSubvencionModalidad('modalidadC') }} €</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Convenios Nominativos y Formativos -->
    <div class="form-section">
      <h4>Convenios Nominativos y Formativos</h4>

      <div class="form-group">
        <label>Número de convenios</label>
        <input
          type="number"
          v-model.number="datos.convenios.numeroConvenios"
          class="form-control"
          min="0"
        >
      </div>

      <div class="form-group">
        <label>Financiación (€)</label>
        <input
          type="number"
          v-model.number="datos.convenios.financiacion"
          class="form-control"
          min="0"
          step="0.01"
          placeholder="Importe de la financiación"
        >
      </div>

      <!-- Lista de Convenios -->
      <div class="convenios-list">
        <div v-for="(convenio, index) in datos.convenios.lista" :key="index" class="convenio-item form-section-compact">
          <div class="convenio-header">
            <h6>Convenio {{ index + 1 }}</h6>
            <button
              @click="eliminarConvenio(index)"
              class="btn btn-danger btn-sm"
              type="button"
              v-if="datos.convenios.lista.length > 1"
            >
              Eliminar Convenio
            </button>
          </div>

          <div class="form-group">
             <label>Tipo de Convenio</label>
             <select v-model="convenio.tipo" class="form-control">
               <option value="nominativo">Nominativo</option>
               <option value="formativo">Formativo</option>
             </select>
           </div>

          <!-- Imagen Logo -->
          <div class="form-group center-image-upload">
            <label>Logo de la Entidad</label>
             <div
                class="image-preview"
                @click="openCloudinaryModalConvenio(index)"
              >
                <img
                  v-if="convenio.logoUrl"
                  :src="convenio.logoUrl"
                  alt="Logo de la entidad"
                >
                <div v-else class="image-preview-placeholder">
                  <i class="fas fa-image"></i>
                  <p>Haz clic para seleccionar el logo</p>
                </div>
              </div>
          </div>

          <div class="form-group">
            <label>Descripción</label>
            <textarea
              v-model="convenio.descripcion"
              class="form-control"
              rows="3"
              placeholder="Descripción del convenio"
            ></textarea>
          </div>

          <!-- Campos Adicionales para el Convenio -->
          <div class="additional-fields">
            <h5>Campos Adicionales</h5>
            <div v-for="(campo, campoIndex) in convenio.camposAdicionales" :key="campoIndex" class="form-group additional-field-item">
              <div class="field-inputs">
                <input
                  type="text"
                  v-model="campo.nombre"
                  class="form-control field-name-input" maxlength="50"
                  placeholder="Nombre del campo"
                >
                 <select v-model="campo.tipo" class="form-control field-type-select">
                  <option value="text">Texto Corto</option>
                  <option value="textarea">Texto Largo</option>
                  <option value="number">Numérico</option>
                 </select>
                <input
                  v-if="campo.tipo === 'text'"
                  type="text"
                  v-model="campo.valor"
                  class="form-control field-value-input"
                  placeholder="Valor del campo"
                >
                <textarea
                  v-else-if="campo.tipo === 'textarea'"
                  v-model="campo.valor"
                  class="form-control field-value-input" rows="2"
                  placeholder="Valor del campo"
                ></textarea>
                <input
                  v-else-if="campo.tipo === 'number'"
                  type="number"
                  v-model.number="campo.valor"
                  class="form-control field-value-input"
                  placeholder="0"
                  min="0"
                >
              </div>
              <button
                @click="eliminarCampoAdicionalConvenio(index, campoIndex)"
                class="btn btn-danger btn-sm"
                type="button"
              >
                Eliminar Campo
              </button>
            </div>
            <button
              @click="agregarCampoAdicionalConvenio(index)"
              class="btn btn-secondary btn-sm"
              type="button"
            >
              Agregar Campo Adicional
            </button>
          </div>

        </div>
      </div>

      <button
        @click="agregarConvenio"
        class="btn btn-secondary mt-3"
        type="button"
      >
        Agregar Convenio
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
      <!-- Este es el último paso, el botón debe guardar -->
      <button
        @click="$emit('siguiente')"
        class="btn btn-primary"
        :disabled="!esValido"
      >
        Siguiente
      </button>
    </div>

     <!-- Modal de selección de imágenes -->
    <teleport to="body">
      <ModalImagenesCloudinary
        :is-visible="showImageModal"
        :title="modalTitle"
        @close="closeImageModal"
        @select="handleImageSelect"
        @upload="handleImageUpload"
      />
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import ModalImagenesCloudinary from '../../ModalImagenesCloudinary.vue';

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
});

// Emitimos 'guardar' en el último paso
const emit = defineEmits(['update:modelValue', 'anterior', 'siguiente']);

const datos = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// Estado del modal de imágenes
const showImageModal = ref(false);
const modalTitle = ref('Seleccionar imagen');
const currentConvenioIndex = ref(null);

// Inicializar datos si no existen
if (!datos.value.importeTotalSubvenciones) datos.value.importeTotalSubvenciones = 0;
if (!datos.value.entidadesBeneficiarias) datos.value.entidadesBeneficiarias = 0;
if (!datos.value.personasUsuarias) datos.value.personasUsuarias = 0;

if (!datos.value.subvencionesSinAnimoLucro) {
  datos.value.subvencionesSinAnimoLucro = {
    descripcion: '',
    importeTotal: 0,
    modalidadA: { numeroProyectos: 0, descripcion: '', importe: 0, proyectos: [] },
    modalidadB: { numeroProyectos: 0, descripcion: '', importe: 0, proyectos: [] },
    modalidadC: { numeroProyectos: 0, descripcion: '', importe: 0, proyectos: [] },
  };
}

// Sincronizar el número de proyectos con las filas de la tabla para cada modalidad
const syncProyectos = (modalidad) => {
  const numProyectos = datos.value.subvencionesSinAnimoLucro[modalidad].numeroProyectos;
  const proyectos = datos.value.subvencionesSinAnimoLucro[modalidad].proyectos;

  if (numProyectos < proyectos.length) {
    proyectos.splice(numProyectos);
  } else if (numProyectos > proyectos.length) {
    const diff = numProyectos - proyectos.length;
    for (let i = 0; i < diff; i++) {
      proyectos.push({ entidad: '', subvencion: 0 });
    }
  }
};

watch(() => datos.value.subvencionesSinAnimoLucro.modalidadA.numeroProyectos, () => syncProyectos('modalidadA'), { immediate: true });
watch(() => datos.value.subvencionesSinAnimoLucro.modalidadB.numeroProyectos, () => syncProyectos('modalidadB'), { immediate: true });
watch(() => datos.value.subvencionesSinAnimoLucro.modalidadC.numeroProyectos, () => syncProyectos('modalidadC'), { immediate: true });

// Calcular el total de subvenciones por modalidad
const totalSubvencionModalidad = (modalidad) => {
  return datos.value.subvencionesSinAnimoLucro[modalidad].proyectos.reduce((sum, proyecto) => sum + (parseFloat(proyecto.subvencion) || 0), 0).toFixed(2);
};


if (!datos.value.convenios) {
  datos.value.convenios = {
    numeroConvenios: 0,
    financiacion: 0,
    lista: []
  };
}

// Sincronizar el número de convenios con la lista
const syncConvenios = () => {
  const numConvenios = datos.value.convenios.numeroConvenios;
  const listaConvenios = datos.value.convenios.lista;

  if (numConvenios < listaConvenios.length) {
    listaConvenios.splice(numConvenios);
  } else if (numConvenios > listaConvenios.length) {
    const diff = numConvenios - listaConvenios.length;
    for (let i = 0; i < diff; i++) {
      listaConvenios.push({
        tipo: 'nominativo', // Por defecto nominativo
        logoUrl: '',
        descripcion: '',
        camposAdicionales: []
      });
    }
  }
};

watch(() => datos.value.convenios.numeroConvenios, syncConvenios, { immediate: true });

// Método para agregar un nuevo convenio (segun el numero indicado arriba)
const agregarConvenio = () => {
  // Esta función ya no agrega directamente, sino que la lista se sincroniza con numeroConvenios
  // Pero mantenemos la función por si se quisiera agregar independientemente en el futuro
  // Para ahora, solo incrementamos el numeroConvenios
  datos.value.convenios.numeroConvenios++;
};

// Método para eliminar un convenio (reduciendo el numero indicado arriba)
const eliminarConvenio = (index) => {
   if (datos.value.convenios.lista.length > 1) {
    // Eliminar el convenio de la lista y decrementar el numeroConvenios
     datos.value.convenios.lista.splice(index, 1);
     datos.value.convenios.numeroConvenios--;
   } else if (datos.value.convenios.lista.length === 1) {
      // Si solo queda uno, lo vaciamos en lugar de eliminarlo completamente
       datos.value.convenios.lista = [];
       datos.value.convenios.numeroConvenios = 0;
   }
};

// Métodos para campos adicionales de los convenios
const agregarCampoAdicionalConvenio = (convenioIndex) => {
  datos.value.convenios.lista[convenioIndex].camposAdicionales.push({
    nombre: '',
    tipo: 'text', // Tipo de campo por defecto
    valor: '',
  });
};

const eliminarCampoAdicionalConvenio = (convenioIndex, campoIndex) => {
  datos.value.convenios.lista[convenioIndex].camposAdicionales.splice(campoIndex, 1);
};

// Métodos para el modal de imágenes de convenios
const openCloudinaryModalConvenio = (convenioIndex) => {
  currentConvenioIndex.value = convenioIndex;
  modalTitle.value = 'Seleccionar logo';
  showImageModal.value = true;
};

const closeImageModal = () => {
  showImageModal.value = false;
  currentConvenioIndex.value = null;
};

const handleImageSelect = (selectedImage) => {
  if (currentConvenioIndex.value !== null) {
    datos.value.convenios.lista[currentConvenioIndex.value].logoUrl = selectedImage.url;
  }
  closeImageModal();
};

const handleImageUpload = async () => {
  // Lógica de subida de imágenes (si es diferente para convenios)
  // Por ahora, solo cerramos el modal
   closeImageModal();
};

// Validación del formulario
const esValido = computed(() => {
  // Validación campos iniciales
  const camposInicialesValidos = 
    datos.value.importeTotalSubvenciones >= 0 &&
    datos.value.entidadesBeneficiarias >= 0 &&
    datos.value.personasUsuarias >= 0;

  // Validación Subvenciones sin Ánimo de Lucro
  const subvencionesSinAnimoLucroValido = 
    datos.value.subvencionesSinAnimoLucro.descripcion !== '' &&
    datos.value.subvencionesSinAnimoLucro.importeTotal >= 0 &&
    datos.value.subvencionesSinAnimoLucro.modalidadA.numeroProyectos >= 0 &&
    datos.value.subvencionesSinAnimoLucro.modalidadA.descripcion !== '' &&
    datos.value.subvencionesSinAnimoLucro.modalidadA.importe >= 0 &&
    datos.value.subvencionesSinAnimoLucro.modalidadA.proyectos.every(p => p.entidad !== '' && p.subvencion >= 0) &&
    datos.value.subvencionesSinAnimoLucro.modalidadB.numeroProyectos >= 0 &&
    datos.value.subvencionesSinAnimoLucro.modalidadB.descripcion !== '' &&
    datos.value.subvencionesSinAnimoLucro.modalidadB.importe >= 0 &&
    datos.value.subvencionesSinAnimoLucro.modalidadB.proyectos.every(p => p.entidad !== '' && p.subvencion >= 0) &&
    datos.value.subvencionesSinAnimoLucro.modalidadC.numeroProyectos >= 0 &&
    datos.value.subvencionesSinAnimoLucro.modalidadC.descripcion !== '' &&
    datos.value.subvencionesSinAnimoLucro.modalidadC.importe >= 0 &&
    datos.value.subvencionesSinAnimoLucro.modalidadC.proyectos.every(p => p.entidad !== '' && p.subvencion >= 0);

  // Validación Convenios Nominativos y Formativos
  const conveniosValido = 
    datos.value.convenios.numeroConvenios >= 0 &&
    datos.value.convenios.financiacion >= 0 &&
    datos.value.convenios.lista.every(convenio =>
      convenio.tipo !== '' &&
      // logoUrl no es estrictamente obligatorio según la imagen, pero se puede validar si se desea
      convenio.descripcion !== '' &&
      convenio.camposAdicionales.every(campo =>
        campo.nombre !== '' &&
        (campo.tipo === 'number' ? !isNaN(parseFloat(campo.valor)) && isFinite(campo.valor) && campo.valor >= 0 : campo.valor !== '')
      )
    );

  return camposInicialesValidos && subvencionesSinAnimoLucroValido && conveniosValido;
});


</script>

<style scoped>
.form-step {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.form-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 5px solid #004698;
}

.form-section h4 {
  margin-top: 0;
  color: #004698;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
}

.form-section h5 {
  color: #004698;
  margin: 1.5rem 0 1rem;
  font-size: 1.1rem;
}

.form-section h6 {
    color: #0056b3;
    margin-top: 0;
    margin-bottom: 1rem;
    font-size: 1rem;
}

.form-section-compact {
    padding: 1rem;
    background-color: #e9ecef;
    border-radius: 6px;
    margin-bottom: 1.5rem;
    border: 1px solid #dee2e6;
}

.form-group {
  margin-bottom: 1.5rem;
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
  color: #333;
  background-color: #fff;
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

.modalidades-section {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid #eee;
}

.convenios-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.convenio-item {
    background: #fff3e0; /* Color similar al de programas */
    border-left: 5px solid #f0803b;
    padding: 1.5rem;
    border-radius: 8px;
}

.convenio-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    border-bottom: 1px solid #fcd7b0;
    padding-bottom: 0.5rem;
}

.convenio-header h6 {
    color: #f0803b;
    margin: 0;
}

/* Estilos para campos adicionales */
.additional-fields {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
}

.additional-fields h5 {
  color: #004698;
  margin-bottom: 1rem;
}

.additional-field-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  background-color: #f8f9fa; /* Fondo ligero para cada campo adicional */
  padding: 0.8rem;
  border-radius: 4px;
}

.additional-field-item .field-inputs {
  flex-grow: 1;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap; /* Permitir que los inputs se envuelvan en pantallas pequeñas */
}

.additional-field-item .field-name-input {
  flex: 1; /* Nombre del campo ocupa espacio */
  min-width: 120px; /* Ancho mínimo para el nombre */
}

.additional-field-item .field-type-select {
    flex: 0 0 auto; /* El select no crece ni se encoge */
    width: 120px; /* Ancho fijo para el select */
}

.additional-field-item .field-value-input {
  flex: 2; /* El valor del campo ocupa más espacio */
  min-width: 150px; /* Ancho mínimo para el valor */
}

/* Estilos para tabla de proyectos */
.table th,
.table td {
  vertical-align: middle;
  color: #000; /* Asegurar texto negro */
}

.table-responsive {
  overflow-x: auto;
}

/* Estilos de imagen y placeholder (reutilizados de EmpleoFormacionProgramas.vue) */
.center-image-upload {
  text-align: center;
  margin-bottom: 1.5rem;
}

.image-preview {
  width: 100%;
  height: 150px;
  border: 1px dashed #ccc;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  background-color: #f8f9fa;
  transition: all 0.3s ease;
}

.image-preview:hover {
  border-color: #004698;
  box-shadow: 0 0 10px rgba(0, 70, 152, 0.2);
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-preview-placeholder {
  color: #6c757d;
  font-style: italic;
  text-align: center;
  padding: 1rem;
}

.image-preview-placeholder i {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  display: block;
}

/* Ajustes responsivos */
@media (max-width: 768px) {
  .form-section {
     padding: 1rem;
  }
  .form-section h4 {
      margin-bottom: 1rem;
  }
    .form-section-compact {
        padding: 0.8rem;
    }

  .convenio-item {
     padding: 1rem;
  }

  .convenio-header {
     flex-direction: column;
     align-items: flex-start;
     margin-bottom: 1rem;
  }

  .convenio-header h6 {
     margin-bottom: 0.5rem;
  }

  .additional-field-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .additional-field-item .field-inputs {
    flex-direction: column; /* Apilar inputs en pantallas pequeñas */
    width: 100%;
  }

  .additional-field-item .field-name-input,
  .additional-field-item .field-type-select,
  .additional-field-item .field-value-input {
    flex: none;
    width: 100%;
    min-width: 0;
  }

  .additional-field-item .btn-danger.btn-sm {
    margin-top: 0.5rem;
  }
}

</style> 