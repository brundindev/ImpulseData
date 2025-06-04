<template>
  <div class="form-step">
    <div class="tabs-container">
      <div class="tabs">
        <button 
          :class="['tab', { active: activeTab === 'form' }]"
          @click="activeTab = 'form'"
        >
          Formulario
        </button>
        <button 
          :class="['tab', { active: activeTab === 'preview' }]"
          @click="activeTab = 'preview'"
        >
          Vista Previa
        </button>
      </div>
    </div>

    <!-- Formulario -->
    <div v-if="activeTab === 'form'" class="form-content">
      <h3>Qué hacemos</h3>
      
      <div class="lineas-estrategicas">
        <h4 class="section-titulo">Líneas Estratégicas</h4>
        <div v-for="(linea, index) in datos.lineasEstrategicas" :key="index" class="linea-item">
          <div class="linea-header">
            <h4>Línea estratégica {{ index + 1 }}</h4>
            <button 
              @click="eliminarLinea(index)" 
              class="btn btn-danger"
              type="button"
              v-if="datos.lineasEstrategicas.length > 1"
            >
              Eliminar
            </button>
          </div>
          
          <div class="form-group">
            <label>Título</label>
            <input 
              type="text" 
              v-model="linea.titulo" 
              class="form-control"
              placeholder="Título de la línea estratégica"
            >
          </div>

          <div class="form-group">
            <label>Acciones (una por línea)</label>
            <textarea 
              v-model="linea.acciones" 
              class="form-control"
              rows="3"
              placeholder="Lista de acciones principales de esta línea estratégica"
            ></textarea>
          </div>
        </div>
        
        <button 
          @click="agregarLinea" 
          class="btn btn-secondary"
          type="button"
          v-if="datos.lineasEstrategicas.length < 4"
        >
          Agregar Línea Estratégica
        </button>
      </div>

      <div class="departamentos">
        <h4 class="section-titulo">Departamentos</h4>
        <div v-for="(departamento, index) in datos.departamentos" :key="index" class="departamento-item">
          <div class="departamento-header">
            <h4>Departamento {{ index + 1 }}</h4>
            <button 
              @click="eliminarDepartamento(index)" 
              class="btn btn-danger"
              type="button"
              v-if="datos.departamentos.length > 1"
            >
              Eliminar
            </button>
          </div>
          
          <div class="form-group">
            <label>Nombre del Departamento</label>
            <input 
              type="text" 
              v-model="departamento.nombre" 
              class="form-control"
              placeholder="Nombre del departamento"
            >
          </div>
        </div>

        <button 
          @click="agregarDepartamento" 
          class="btn btn-secondary"
          type="button"
          v-if="datos.departamentos.length < 5"
        >
          Agregar Departamento
        </button>
      </div>
    </div>

    <!-- Vista Previa -->
    <div v-if="activeTab === 'preview'" class="preview-content">
      <div class="preview-container">
        <div class="preview-section">
        <!-- Header -->
        <div class="preview-header">
          <div class="header-number">1.2</div>
          <div class="header-title">
            QUÉ<br>
            <span class="title-hacemos">HACEMOS</span>
          </div>
        </div>

        <!-- Descripción inicial -->
        <div class="description-section">
          <p>
            Desde su creación, en el año 2000, la <strong>Agencia Local de Desarrollo Económico y Social</strong> es la entidad gestora de las actuaciones y estrategias definidas en el <strong>Pacto Territorial por el Empleo de la ciudad de Alicante</strong> , y la encargada de poner en marcha políticas que impulsen la creación de empleo y el desarrollo socioeconómico del municipio.
          </p>
          <p>
            Todas las actuaciones realizadas van encaminadas al desarrollo de las<strong> cuatro líneas estratégicas</strong> del Pacto Territorial.
          </p>
        </div>

        <div class="strategic">
          <!-- Título Líneas Estratégicas -->
          <div class="strategic-lines-title">
            <h2>líneas estratégicas</h2>
          </div>
              <!-- Líneas Estratégicas -->
              <div class="strategic-lines-grid">
                <div 
                  v-for="(linea, index) in datos.lineasEstrategicas" 
                  :key="index" 
                  class="strategic-line"
                >
                  <div class="line-number">{{ index + 1 }}</div>
                  <div class="line-content">
                    <h3 class="line-title">{{ linea.titulo || `Línea Estratégica ${index + 1}` }}</h3>
                    <ul class="line-actions" v-if="linea.acciones">
                      <li v-for="accion in getAcciones(linea.acciones)" :key="accion">
                        {{ accion }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
        </div>

        <div class="department">
          <!-- Título Líneas Estratégicas -->
          <div class="departments-section-title">
            <h2>{{ datos?.departamentos?.length || 0 }} áreas</h2>
          </div>

        <!-- Departamentos -->
        <div class="departments-section">
          <div 
            v-for="(departamento, index) in datos.departamentos" 
            :key="index" 
            class="department-box"
          >
            <div class="department-content">
              {{ departamento.nombre || `Departamento ${index + 1}` }}
            </div>
          </div>
        </div>
        </div>
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

const activeTab = ref('form');

const datos = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// Inicializar datos si no existen
if (!datos.value.lineasEstrategicas) {
  datos.value.lineasEstrategicas = [
    {
      titulo: 'Apoyo activo al empleo con especial atención a colectivos vulnerables',
      acciones: '• Orientación laboral\n• Formación para el empleo\n• Intermediación laboral'
    },
    {
      titulo: 'Dinamización y diversificación de la economía del territorio',
      acciones: '• Modernización del tejido empresarial\n• Promoción del emprendimiento\n• Atracción de inversiones (ALIA)'
    },
    {
      titulo: 'Transición del modelo productivo hacia la nueva economía',
      acciones: '• Desarrollo tecnológico\n• Transformación digital\n• Promover la innovación empresarial en industria 4.0 - Alicante Futura'
    },
    {
      titulo: 'Impulsar la colaboración público privada en la planificación estratégica',
      acciones: '• Firme colaboraciones intersectoriales\n• Con entidades públicas y privadas de interés\n• Mejora de los servicios al ciudadano'
    }
  ];
}

if (!datos.value.departamentos) {
  datos.value.departamentos = [
    { nombre: 'Departamento de Empleo y Formación' },
    { nombre: 'Departamento de Promoción Económica' },
    { nombre: 'Departamento Jurídico Administrativo' },
    { nombre: 'Departamento Económico Financiero' },
    { nombre: 'Departamento de Marketing y Comunicación' }
  ];
}

const agregarLinea = () => {
  if (datos.value.lineasEstrategicas.length < 4) {
    datos.value.lineasEstrategicas.push({
      titulo: '',
      acciones: ''
    });
  }
};

const eliminarLinea = (index) => {
  if (datos.value.lineasEstrategicas.length > 1) {
    datos.value.lineasEstrategicas.splice(index, 1);
  }
};

const agregarDepartamento = () => {
  if (datos.value.departamentos.length < 5) {
    datos.value.departamentos.push({
      nombre: ''
    });
  }
};

const eliminarDepartamento = (index) => {
  if (datos.value.departamentos.length > 1) {
    datos.value.departamentos.splice(index, 1);
  }
};

const getAcciones = (acciones) => {
  if (!acciones) return [];
  return acciones.split('\n').filter(accion => accion.trim() !== '').map(accion => accion.replace(/^[•\-\*]\s*/, ''));
};

const esValido = computed(() => {
  return datos.value.lineasEstrategicas.every(linea => 
    linea.titulo
  ) && datos.value.departamentos.every(dept =>
    dept.nombre
  );
});
</script>

<style scoped>
.form-step {
  max-width: 1200px;
  margin: 0 auto;
}

.tabs-container {
  margin-bottom: 2rem;
  border-bottom: 2px solid #e0e6ed;
}

.tabs {
  display: flex;
  gap: 0;
}

.tab {
  padding: 12px 24px;
  border: none;
  background: #f8f9fa;
  color: #6c757d;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  font-weight: 500;
  transition: all 0.3s ease;
}

.tab.active {
  background: white;
  color: #1B5E96;
  border-bottom-color: #1B5E96;
}

.tab:hover:not(.active) {
  background: #e9ecef;
}

.form-content {
  max-width: 800px;
  margin: 0 auto;
}

.section-titulo {
  color: #004698;
  font-size: 1.3rem;
  margin: 2rem 0 1rem 0;
  border-bottom: 2px solid #004698;
  padding-bottom: 0.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.linea-item, .departamento-item {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.linea-header, .departamento-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.linea-header h4, .departamento-header h4 {
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

/* Vista Previa Styles */
.preview-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
}

.preview-container {
  max-width: 900px;
  margin: 0 auto;
}

.preview-section{
  background: white;
  margin-bottom: 2rem;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.preview-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.header-number {
  background: #8DB4E2;
  padding: 0.75rem 1rem;
  font-weight: bold;
  font-size: 1.5rem;
}

.header-title {
  color: black;
  font-size: 1.3rem;
  font-weight: bold;
  line-height: 1.1;
}

.title-hacemos {
  text-decoration: underline;
  text-decoration-color: #8DB4E2;
  text-underline-offset: 4px;
  color:#8DB4E2;
  font-size:1.8rem;
}

.description-section {
  margin-bottom: 2rem;
  font-size: 0.95rem;
  line-height: 1.6;
  color: #333;
}

.description-section p {
  margin-bottom: 1rem;
}

.strategic{
  display:flex;
  flex-direction: column;
}

.strategic-lines-title {
  text-align: center;
  margin: 3rem 0 2rem 0;
  position: relative;
}

.strategic-lines-title h2 {
  background: rgba(139, 180, 226, 0.1);
  color: #8DB4E2;
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0;
  padding: 1rem 2rem;
  display: inline-block;
  border-radius: 8px;
  letter-spacing: 2px;
}

.strategic-lines-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  margin-bottom: 3rem;
  margin-top:-1.5rem;
}

.strategic-line {
  background: #E0E6ED;
  border: 2px solid #E0E6ED;
  padding: 1.5rem;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.strategic-line:hover {
  transform: translateY(-2px);
}

.line-number {
  position: absolute;
  left: 20px;
  color: #1B5E96;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
}

.line-content {
  margin-top: 1rem;
  top:1.5rem;
  position:relative;
}

.line-title {
  color: #1B5E96;
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 1rem;
  line-height: 1.3;
}

.line-description {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  line-height: 1.4;
}

.line-actions {
  list-style: none;
  padding: 0;
  margin: 0;
}

.line-actions li {
  color: #312d2d;
  font-size: 0.85rem;
  margin-bottom: 0.3rem;
  position: relative;
  padding-left: 1rem;
}

.line-actions li::before {
  content: '•';
  color: #1B5E96;
  position: absolute;
  left: 0;
  font-weight: bold;
}

.departments-section {
  justify-content: center;
  display:grid;
  grid-template-columns: repeat(5,1fr);
  gap:1rem;
  align-content:center;
  align-items:center;
  text-align:center;
}
.departments-section-title{
  background: #8bb4e21a;
    color: #8db4e2;
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0;
    padding: 1rem 2rem;
    display: inline-block;
    border-radius: 8px;
    letter-spacing: 7px;
}

.department-box {
  background: #E0E6ED;
  color: white;
  padding: 1rem 1.5rem;
  text-align: center;
  font-weight: 500;
  font-size: 0.9rem;
  line-height: 1.3;
  max-width: 200px;
  height: -webkit-fill-available;
  display: flex;
  align-content: center;
  align-items: center;
}

.department-content {
  word-wrap: break-word;
  color: #1b5e96;
  font-weight: bolder;
}

@media (max-width: 768px) {
  .strategic-lines-grid {
    grid-template-columns: 1fr;
  }
  
  .preview-header {
    flex-direction: column;
    text-align: center;
  }
  
  .strategic-lines-title h2 {
    font-size: 2rem;
  }
  
  .departments-section {
    flex-direction: column;
    align-items: center;
  }
  
  .department-box {
    max-width: 100%;
  }
}
</style>