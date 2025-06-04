<template>
  <teleport to="body">
    <div class="modal-overlay" v-if="show" @click.self="$emit('close')">
      <div class="modal-container apple-modal">
        <div class="modal-accent-shapes">
          <div class="modal-accent-shape shape-1"></div>
          <div class="modal-accent-shape shape-2"></div>
          <div class="modal-accent-shape shape-3"></div>
        </div>
        
        <div class="modal-header apple-modal-header">
          <div class="modal-title-wrapper">
            <div class="modal-icon-container">
              <span class="modal-icon">{{ isEditing ? '✏️' : '➕' }}</span>
            </div>
            <h2>{{ isEditing ? 'Editar empresa' : 'Crear nueva empresa' }}</h2>
          </div>
          <button class="btn-close apple-btn-close" @click="$emit('close')">
            <span>×</span>
          </button>
        </div>
        
        <div class="modal-body apple-modal-body">
          <div v-if="saving" class="saving-overlay apple-saving-overlay">
            <div class="apple-spinner">
              <div class="apple-spinner-dot dot-1"></div>
              <div class="apple-spinner-dot dot-2"></div>
              <div class="apple-spinner-dot dot-3"></div>
            </div>
            <p>Guardando información...</p>
          </div>
          
          <form @submit.prevent="handleSubmit" class="apple-form">
            <div class="apple-form-section">
              <h3 class="apple-section-header">Información general</h3>
              
              <div class="form-group apple-form-group">
                <label for="nombreEmpresa">Nombre de la empresa</label>
                <div class="apple-input-container input-gemini-container">
                  <input 
                    type="text" 
                    id="nombreEmpresa" 
                    v-model="formData.nombre" 
                    required 
                    placeholder="Ej: Acme Corporation"
                    class="apple-input"
                  >
                  <GeminiButton 
                    field-name="nombre de empresa"
                    :current-value="formData.nombre"
                    @suggestion="(text) => formData.nombre = text"
                  />
                  <div class="input-focus-effect"></div>
                </div>
              </div>
              
              <div class="form-group apple-form-group">
                <label for="fechaCreacion">Fecha de creación</label>
                <div class="apple-input-container">
                  <input 
                    type="date" 
                    id="fechaCreacion" 
                    v-model="formData.fechaCreacion" 
                    required
                    class="apple-input"
                  >
                  <div class="input-focus-effect"></div>
                </div>
              </div>
              
              <div class="form-group apple-form-group">
                <label for="descripcionEmpresa">Descripción</label>
                <div class="apple-input-container input-gemini-container">
                  <textarea 
                    id="descripcionEmpresa" 
                    v-model="formData.descripcion" 
                    rows="3" 
                    placeholder="Describe brevemente la empresa"
                    class="apple-input apple-textarea"
                  ></textarea>
                  <GeminiButton 
                    field-name="descripción empresa"
                    :context="formData.nombre"
                    :current-value="formData.descripcion"
                    @suggestion="(text) => formData.descripcion = text"
                  />
                  <div class="input-focus-effect"></div>
                </div>
              </div>
              
              <div class="form-group apple-form-group">
                <label for="ciudadEmpresa">Ciudad</label>
                <div class="apple-input-container">
                  <input 
                    type="text" 
                    id="ciudadEmpresa" 
                    v-model="formData.ciudad" 
                    required 
                    placeholder="Ej: Alicante"
                    class="apple-input"
                  >
                  <div class="input-focus-effect"></div>
                </div>
              </div>
            </div>
            
            <div class="apple-form-section">
              <h3 class="apple-section-header">
                <span>Departamentos</span>
                <button type="button" class="apple-add-btn" @click="agregarDepartamento">
                  <span class="add-icon">+</span>
                  <span class="add-text">Añadir</span>
                </button>
              </h3>
              
              <div class="apple-cards-container">
                <div 
                  v-for="(departamento, index) in formData.departamentos" 
                  :key="index" 
                  class="apple-card"
                >
                  <div class="apple-card-header">
                    <h4>Departamento {{ index + 1 }}</h4>
                    <button 
                      type="button" 
                      class="apple-delete-btn" 
                      @click="eliminarDepartamento(index)"
                      v-if="formData.departamentos.length > 1"
                    >
                      <span class="delete-icon">×</span>
                    </button>
                  </div>
                  
                  <div class="form-group apple-form-group">
                    <label :for="'nombreDep'+index">Nombre del departamento</label>
                    <div class="apple-input-container input-gemini-container">
                      <input 
                        type="text" 
                        :id="'nombreDep'+index" 
                        v-model="departamento.nombre" 
                        required 
                        placeholder="Ej: Empleo y Formación"
                        class="apple-input"
                      >
                      <GeminiButton 
                        field-name="nombre de departamento"
                        :context="formData.nombre"
                        :current-value="departamento.nombre"
                        @suggestion="(text) => departamento.nombre = text"
                      />
                      <div class="input-focus-effect"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="apple-form-section">
              <h3 class="apple-section-header">
                <span>Centros</span>
                <button type="button" class="apple-add-btn" @click="agregarCentro">
                  <span class="add-icon">+</span>
                  <span class="add-text">Añadir</span>
                </button>
              </h3>
              
              <div class="apple-cards-container">
                <div 
                  v-for="(centro, index) in formData.centros" 
                  :key="index" 
                  class="apple-card"
                >
                  <div class="apple-card-header">
                    <h4>Centro {{ index + 1 }}</h4>
                    <button 
                      type="button" 
                      class="apple-delete-btn" 
                      @click="eliminarCentro(index)"
                      v-if="formData.centros.length > 1"
                    >
                      <span class="delete-icon">×</span>
                    </button>
                  </div>
                  
                  <div class="form-group apple-form-group">
                    <label :for="'nombreCentro'+index">Nombre del centro</label>
                    <div class="apple-input-container input-gemini-container">
                      <input 
                        type="text" 
                        :id="'nombreCentro'+index" 
                        v-model="centro.nombre" 
                        required 
                        placeholder="Ej: Sede Principal"
                        class="apple-input"
                      >
                      <GeminiButton 
                        field-name="nombre de centro"
                        :context="formData.nombre"
                        :current-value="centro.nombre"
                        @suggestion="(text) => centro.nombre = text"
                      />
                      <div class="input-focus-effect"></div>
                    </div>
                  </div>
                  
                  <div class="form-group apple-form-group">
                    <label :for="'direccionCentro'+index">Dirección</label>
                    <div class="apple-input-container input-gemini-container">
                      <input 
                        type="text" 
                        :id="'direccionCentro'+index" 
                        v-model="centro.direccion" 
                        required 
                        placeholder="Ej: Calle Principal 123"
                        class="apple-input"
                      >
                      <GeminiButton 
                        field-name="dirección"
                        :context="formData.ciudad || 'Alicante'"
                        :current-value="centro.direccion"
                        @suggestion="(text) => centro.direccion = text"
                      />
                      <div class="input-focus-effect"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="apple-form-section">
              <h3 class="apple-section-header">
                <span>Formaciones</span>
                <button type="button" class="apple-add-btn" @click="agregarFormacion">
                  <span class="add-icon">+</span>
                  <span class="add-text">Añadir</span>
                </button>
              </h3>
              
              <div class="apple-cards-container">
                <div 
                  v-for="(formacion, index) in formData.formaciones" 
                  :key="index" 
                  class="apple-card"
                >
                  <div class="apple-card-header">
                    <h4>Formación {{ index + 1 }}</h4>
                    <button 
                      type="button" 
                      class="apple-delete-btn" 
                      @click="eliminarFormacion(index)"
                      v-if="formData.formaciones.length > 1"
                    >
                      <span class="delete-icon">×</span>
                    </button>
                  </div>
                  
                  <div class="form-group apple-form-group">
                    <label :for="'nombreFormacion'+index">Nombre de la formación</label>
                    <div class="apple-input-container input-gemini-container">
                      <input 
                        type="text" 
                        :id="'nombreFormacion'+index" 
                        v-model="formacion.nombre" 
                        required 
                        placeholder="Ej: LABORA"
                        class="apple-input"
                      >
                      <GeminiButton 
                        field-name="nombre de formación"
                        :context="formData.nombre"
                        :current-value="formacion.nombre"
                        @suggestion="(text) => formacion.nombre = text"
                      />
                      <div class="input-focus-effect"></div>
                    </div>
                  </div>
                  
                  <div class="form-group apple-form-group">
                    <label :for="'tipoFormacion'+index">Tipo de formación</label>
                    <div class="apple-select-container">
                      <select 
                        :id="'tipoFormacion'+index" 
                        v-model="formacion.tipo" 
                        required
                        class="apple-select"
                      >
                        <option value="presencial">Presencial</option>
                        <option value="virtual">Virtual</option>
                        <option value="hibrida">Híbrida</option>
                      </select>
                      <div class="select-arrow"></div>
                      <div class="input-focus-effect"></div>
                    </div>
                  </div>
                  
                  <div class="form-group apple-form-group">
                    <label :for="'duracionFormacion'+index">Duración (horas)</label>
                    <div class="apple-input-container">
                      <input 
                        type="number" 
                        :id="'duracionFormacion'+index" 
                        v-model="formacion.duracion" 
                        required 
                        min="1"
                        class="apple-input"
                      >
                      <div class="input-focus-effect"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="apple-form-actions">
              <button type="button" class="apple-btn-cancel" @click="$emit('close')">
                <span class="btn-text">Cancelar</span>
              </button>
              <button type="submit" class="apple-btn-save" :disabled="saving">
                <span class="btn-icon">{{ isEditing ? '✓' : '➕' }}</span>
                <span class="btn-text">{{ saving ? 'Guardando...' : (isEditing ? 'Guardar cambios' : 'Crear empresa') }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import GeminiButton from '../GeminiButton.vue';

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  isEditing: {
    type: Boolean,
    default: false
  },
  company: {
    type: Object,
    default: () => ({
      nombre: '',
      fechaCreacion: '',
      descripcion: '',
      ciudad: '',
      departamentos: [{ nombre: '' }],
      centros: [{ nombre: '', direccion: '' }],
      formaciones: [{ nombre: '', tipo: 'presencial', duracion: 8 }]
    })
  },
  saving: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'submit']);

// Inicializar formData con los valores por defecto
const formData = reactive({
  nombre: '',
  fechaCreacion: '',
  descripcion: '',
  ciudad: '',
  departamentos: [{ nombre: '' }],
  centros: [{ nombre: '', direccion: '' }],
  formaciones: [{ nombre: '', tipo: 'presencial', duracion: 8 }]
});

// Observar cambios en la prop company
watch(() => props.company, (newCompany) => {
  if (newCompany) {
    // Crear una copia profunda de los datos
    const companyData = JSON.parse(JSON.stringify(newCompany));
    
    // Actualizar cada campo individualmente
    formData.nombre = companyData.nombre || '';
    formData.fechaCreacion = companyData.fechaCreacion || '';
    formData.descripcion = companyData.descripcion || '';
    formData.ciudad = companyData.ciudad || '';
    formData.departamentos = companyData.departamentos || [{ nombre: '' }];
    formData.centros = companyData.centros || [{ nombre: '', direccion: '' }];
    formData.formaciones = companyData.formaciones || [{ nombre: '', tipo: 'presencial', duracion: 8 }];
  }
}, { deep: true, immediate: true });

// Función para manejar el envío del formulario
const handleSubmit = () => {
  // Crear una copia profunda de los datos antes de emitir
  const submitData = JSON.parse(JSON.stringify(formData));
  emit('submit', submitData);
};

// Funciones para manejar departamentos
const agregarDepartamento = () => {
  formData.departamentos.push({ nombre: '' });
};

const eliminarDepartamento = (index) => {
  formData.departamentos.splice(index, 1);
};

// Funciones para manejar centros
const agregarCentro = () => {
  formData.centros.push({ nombre: '', direccion: '' });
};

const eliminarCentro = (index) => {
  formData.centros.splice(index, 1);
};

// Funciones para manejar formaciones
const agregarFormacion = () => {
  formData.formaciones.push({ nombre: '', tipo: 'presencial', duracion: 8 });
};

const eliminarFormacion = (index) => {
  formData.formaciones.splice(index, 1);
};
</script>

<style scoped src="../home/css/CompanyFormModal.css">

</style> 
