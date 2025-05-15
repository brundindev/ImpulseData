<template>
  <div class="form-step">
    <h3>Anexos</h3>
    
    <div class="form-group">
      <label>Documentos Adjuntos</label>
      <div class="documentos">
        <div v-for="(documento, index) in datos.documentos" :key="index" class="documento-item">
          <div class="documento-header">
            <h4>Documento {{ index + 1 }}</h4>
            <button 
              @click="eliminarDocumento(index)" 
              class="btn btn-danger"
              type="button"
              v-if="datos.documentos.length > 1"
            >
              Eliminar
            </button>
          </div>
          
          <div class="form-group">
            <label>Título del Documento</label>
            <input 
              type="text" 
              v-model="documento.titulo" 
              class="form-control"
              placeholder="Título del documento"
            >
          </div>
          
          <div class="form-group">
            <label>Tipo de Documento</label>
            <select v-model="documento.tipo" class="form-control">
              <option value="">Seleccione un tipo</option>
              <option value="informe">Informe</option>
              <option value="estadistica">Estadística</option>
              <option value="contrato">Contrato</option>
              <option value="certificado">Certificado</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Descripción</label>
            <textarea 
              v-model="documento.descripcion" 
              class="form-control"
              rows="2"
              placeholder="Describa el contenido del documento"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label>Archivo</label>
            <input 
              type="file" 
              @change="handleFileUpload($event, index)" 
              class="form-control"
              accept=".pdf,.doc,.docx,.xls,.xlsx"
            >
            <small class="text-muted">Formatos permitidos: PDF, DOC, DOCX, XLS, XLSX</small>
          </div>
        </div>
        
        <button 
          @click="agregarDocumento" 
          class="btn btn-secondary"
          type="button"
        >
          Agregar Documento
        </button>
      </div>
    </div>

    <div class="form-group">
      <label>Enlaces Externos</label>
      <div class="enlaces">
        <div v-for="(enlace, index) in datos.enlaces" :key="index" class="enlace-item">
          <div class="enlace-header">
            <h4>Enlace {{ index + 1 }}</h4>
            <button 
              @click="eliminarEnlace(index)" 
              class="btn btn-danger"
              type="button"
              v-if="datos.enlaces.length > 1"
            >
              Eliminar
            </button>
          </div>
          
          <div class="form-group">
            <label>Título del Enlace</label>
            <input 
              type="text" 
              v-model="enlace.titulo" 
              class="form-control"
              placeholder="Título del enlace"
            >
          </div>
          
          <div class="form-group">
            <label>URL</label>
            <input 
              type="url" 
              v-model="enlace.url" 
              class="form-control"
              placeholder="https://ejemplo.com"
            >
          </div>
          
          <div class="form-group">
            <label>Descripción</label>
            <textarea 
              v-model="enlace.descripcion" 
              class="form-control"
              rows="2"
              placeholder="Describa el contenido del enlace"
            ></textarea>
          </div>
        </div>
        
        <button 
          @click="agregarEnlace" 
          class="btn btn-secondary"
          type="button"
        >
          Agregar Enlace
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
if (!datos.value.documentos) {
  datos.value.documentos = [{
    titulo: '',
    tipo: '',
    descripcion: '',
    archivo: null
  }];
}

if (!datos.value.enlaces) {
  datos.value.enlaces = [{
    titulo: '',
    url: '',
    descripcion: ''
  }];
}

const agregarDocumento = () => {
  datos.value.documentos.push({
    titulo: '',
    tipo: '',
    descripcion: '',
    archivo: null
  });
};

const eliminarDocumento = (index) => {
  if (datos.value.documentos.length > 1) {
    datos.value.documentos.splice(index, 1);
  }
};

const handleFileUpload = (event, index) => {
  const file = event.target.files[0];
  if (file) {
    datos.value.documentos[index].archivo = file;
  }
};

const agregarEnlace = () => {
  datos.value.enlaces.push({
    titulo: '',
    url: '',
    descripcion: ''
  });
};

const eliminarEnlace = (index) => {
  if (datos.value.enlaces.length > 1) {
    datos.value.enlaces.splice(index, 1);
  }
};

const esValido = computed(() => {
  const validarUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return datos.value.documentos.every(documento => 
    documento.titulo && documento.tipo && documento.descripcion
  ) &&
  datos.value.enlaces.every(enlace => 
    enlace.titulo && 
    enlace.url && 
    validarUrl(enlace.url) && 
    enlace.descripcion
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

.documento-item,
.enlace-item {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.documento-header,
.enlace-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.documento-header h4,
.enlace-header h4 {
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

.text-muted {
  color: #6c757d;
  font-size: 0.875rem;
  margin-top: 0.25rem;
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