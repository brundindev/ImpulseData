<template>
  <div class="form-step">
    <h3>Programas</h3>

    <div class="programas-list">
      <div v-for="(programa, index) in datos.programas" :key="index" class="programa-item form-section">
        <div class="programa-header">
          <h4>Programa {{ index + 1 }}</h4>
          <button
            @click="eliminarPrograma(index)"
            class="btn btn-danger btn-sm"
            type="button"
            v-if="datos.programas.length > 1"
          >
            Eliminar Programa
          </button>
        </div>

        <div class="form-group">
          <label>Nombre del Programa</label>
          <input
            type="text"
            v-model="programa.nombre"
            class="form-control"
            placeholder="Nombre del programa"
          >
        </div>

        <div class="additional-fields">
          <h5>Campos Adicionales</h5>
          <div v-for="(campo, campoIndex) in programa.camposAdicionales" :key="campoIndex" class="form-group additional-field-item">
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
                <option value="image">Imagen</option>
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
              <div
                v-else-if="campo.tipo === 'image'"
                class="image-preview"
                @click="openCloudinaryModal(index, campoIndex)"
              >
                <img
                  v-if="campo.valor"
                  :src="campo.valor"
                  alt="Vista previa de la imagen"
                >
                <div v-else class="image-preview-placeholder">
                  <i class="fas fa-image"></i>
                  <p>Haz clic para seleccionar una imagen</p>
                </div>
              </div>
            </div>
            <button
              @click="eliminarCampoAdicional(index, campoIndex)"
              class="btn btn-danger btn-sm"
              type="button"
            >
              Eliminar Campo
            </button>
          </div>
          <button
            @click="agregarCampoAdicional(index)"
            class="btn btn-secondary btn-sm"
            type="button"
          >
            Agregar Campo Adicional
          </button>
        </div>

      </div>
    </div>

    <button
      @click="agregarPrograma"
      class="btn btn-secondary mt-3"
      type="button"
    >
      Agregar Programa
    </button>

    <div class="form-actions">
      <button
        @click="$emit('anterior')"
        class="btn btn-secondary"
        type="button"
      >
        Anterior
      </button>
      <!-- Este es el último paso de esta sección, por lo tanto, el botón debe guardar -->
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
import { ref, computed } from 'vue';
import ModalImagenesCloudinary from '../../ModalImagenesCloudinary.vue';

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
});

// Emitimos 'guardar' en el último paso
const emit = defineEmits(['update:modelValue', 'guardar', 'anterior', 'siguiente']);

const datos = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// Inicializar datos con un array de programas, con uno por defecto si no hay ninguno
if (!datos.value.programas || !Array.isArray(datos.value.programas) || datos.value.programas.length === 0) {
  datos.value.programas = [{
    nombre: '',
    camposAdicionales: []
  }];
}

// Método para agregar un nuevo programa
const agregarPrograma = () => {
  datos.value.programas.push({
    nombre: '',
    camposAdicionales: []
  });
};

// Método para eliminar un programa
const eliminarPrograma = (index) => {
  if (datos.value.programas.length > 1) {
    datos.value.programas.splice(index, 1);
  }
};

// Métodos para campos adicionales de los programas
const agregarCampoAdicional = (programaIndex) => {
  datos.value.programas[programaIndex].camposAdicionales.push({
    nombre: '',
    tipo: 'text', // Tipo de campo por defecto
    valor: '',
  });
};

const eliminarCampoAdicional = (programaIndex, campoIndex) => {
  datos.value.programas[programaIndex].camposAdicionales.splice(campoIndex, 1);
};

// Validación del formulario
const esValido = computed(() => {
  return datos.value.programas.every(programa =>
    programa.nombre && // El nombre del programa es obligatorio
    programa.camposAdicionales.every(campo =>
      campo.nombre && // El nombre del campo adicional es obligatorio
      (campo.tipo === 'number' ? !isNaN(parseFloat(campo.valor)) && isFinite(campo.valor) && campo.valor >= 0 : 
       campo.tipo === 'image' ? campo.valor !== '' : 
       campo.valor !== '') // Validar valor según tipo
    )
  );
});

// Asegurarse de que haya al menos un programa al cargar el componente si no hay datos iniciales
if (!datos.value.programas || !Array.isArray(datos.value.programas) || datos.value.programas.length === 0) {
  agregarPrograma();
}

// Estado del modal de imágenes
const showImageModal = ref(false);
const modalTitle = ref('Seleccionar imagen');
const currentProgramaIndex = ref(null);
const currentCampoIndex = ref(null);

// Método para abrir el modal de imágenes
const openCloudinaryModal = (programaIndex, campoIndex) => {
  currentProgramaIndex.value = programaIndex;
  currentCampoIndex.value = campoIndex;
  modalTitle.value = 'Seleccionar imagen';
  showImageModal.value = true;
};

// Método para cerrar el modal
const closeImageModal = () => {
  showImageModal.value = false;
  currentProgramaIndex.value = null;
  currentCampoIndex.value = null;
};

// Método para manejar la selección de una imagen
const handleImageSelect = (selectedImage) => {
  if (currentProgramaIndex.value !== null && currentCampoIndex.value !== null) {
    datos.value.programas[currentProgramaIndex.value].camposAdicionales[currentCampoIndex.value].valor = selectedImage.url;
  }
  closeImageModal();
};

// Método para manejar la subida de una nueva imagen
const handleImageUpload = async () => {
  try {
    // Aquí implementaremos la lógica de subida de imágenes
    // Por ahora, cerramos el modal
    closeImageModal();
  } catch (error) {
    console.error('Error al subir la imagen:', error);
  }
};
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

.programas-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 1.5rem;
}

.programa-item {
  background: #fff3e0; /* Color similar al de viveros */
  border-left: 5px solid #f0803b;
  padding: 1.5rem;
  border-radius: 8px;
}

.programa-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #fcd7b0;
  padding-bottom: 0.5rem;
}

.programa-header h4 {
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

/* Ajustes responsivos */
@media (max-width: 768px) {
  .programas-list {
    gap: 1.5rem;
  }

  .programa-item {
     padding: 1rem;
  }

  .programa-header {
     flex-direction: column;
     align-items: flex-start;
     margin-bottom: 1rem;
  }

  .programa-header h4 {
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
    flex: none; /* Desactivar flex-grow */
    width: 100%; /* Ancho completo */
    min-width: 0; /* Eliminar ancho mínimo */
  }

  .additional-field-item .btn-danger.btn-sm {
    margin-top: 0.5rem;
  }
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
</style> 