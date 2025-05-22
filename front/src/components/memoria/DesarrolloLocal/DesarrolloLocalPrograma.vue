<template>
  <div class="form-step">
    <h3 class="program-title">4.1 PROGRAMA DE DINAMIZACIÓN DE POLÍGONOS INDUSTRIALES Y NUEVOS ESPACIOS PRODUCTIVOS</h3>
    
    <div class="form-group">
      <label>Descripción General del Programa</label>
      <textarea 
        v-model="datos.descripcionGeneral" 
        class="form-control"
        rows="4"
        placeholder="Las áreas industriales son el principal motor económico de nuestra ciudad..."
      ></textarea>
    </div>

    <div class="form-group">
      <label>Inversión Áreas Industriales</label>
      <div class="inversion-container">
        <div class="form-group">
          <label>Período</label>
          <input 
            type="text" 
            v-model="datos.periodoInversion" 
            class="form-control"
            placeholder="Ej: 2018-2023"
          >
        </div>
        <div class="form-group">
          <label>Importe Total (€)</label>
          <input 
            type="text" 
            v-model="datos.importeInversion" 
            class="form-control"
            placeholder="Ej: 3.850.000"
          >
        </div>
      </div>
    </div>

    <div class="form-group">
      <label>Resumen Áreas Industriales</label>
      <div class="resumen-areas">
        <div class="form-group">
          <label>Número de Áreas Industriales</label>
          <input 
            type="text" 
            v-model="datos.numeroAreas" 
            class="form-control"
            placeholder="Ej: 9+2"
          >
        </div>
        <div class="form-group">
          <label>Superficie Total (m²)</label>
          <input 
            type="text" 
            v-model="datos.superficieTotal" 
            class="form-control"
            placeholder="Ej: 6.634.453"
          >
        </div>
        <div class="form-group">
          <label>Número de Empleos</label>
          <input 
            type="text" 
            v-model="datos.numeroEmpleos" 
            class="form-control"
            placeholder="Ej: 15.000"
          >
        </div>
        <div class="form-group">
          <label>Facturación Total (M.€)</label>
          <input 
            type="text" 
            v-model="datos.facturacionTotal" 
            class="form-control"
            placeholder="Ej: 2.438"
          >
        </div>
      </div>
    </div>

    <h4 class="section-title">4.1.1 Ampliación del suelo industrial en Alicante</h4>
    
    <div class="form-group">
      <label>Descripción de la Ampliación</label>
      <textarea 
        v-model="datos.descripcionAmpliacion" 
        class="form-control"
        rows="3"
        placeholder="A lo largo del año se ha avanzado en los trámites jurídicos y técnicos para ampliar el suelo industrial..."
      ></textarea>
    </div>

    <div class="form-group">
      <label>Áreas de Ampliación</label>
      <div class="areas-container">
        <div v-for="(area, index) in datos.areasAmpliacion" :key="index" class="area-item">
          <div class="area-header">
            <h4>Área de Ampliación {{ index + 1 }}</h4>
            <button 
              @click="eliminarAreaAmpliacion(index)" 
              class="btn btn-danger"
              type="button"
              v-if="datos.areasAmpliacion.length > 1"
            >
              Eliminar
            </button>
          </div>
          
          <div class="form-group">
            <label>Nombre del Área</label>
            <input 
              type="text" 
              v-model="area.nombre" 
              class="form-control"
              placeholder="Ej: EGM Atalayas, ciudad empresarial"
            >
          </div>
          
          <div class="form-group">
            <label>Superficie (m²)</label>
            <input 
              type="text" 
              v-model="area.superficie" 
              class="form-control"
              placeholder="Ej: 160.000"
            >
          </div>
          
          <div class="form-group">
            <label>Descripción</label>
            <textarea 
              v-model="area.descripcion" 
              class="form-control"
              rows="2"
              placeholder="Breve descripción del área"
            ></textarea>
          </div>
        </div>
        
        <button 
          @click="agregarAreaAmpliacion" 
          class="btn btn-secondary"
          type="button"
        >
          Agregar Área de Ampliación
        </button>
      </div>
    </div>

    <h4 class="section-title">4.1.2 Impulso a la creación de Áreas Industriales Avanzadas</h4>
    
    <div class="form-group">
      <label>Descripción del Impulso</label>
      <textarea 
        v-model="datos.descripcionImpulso" 
        class="form-control"
        rows="3"
        placeholder="Desde la Agencia Local se siguen impulsando diferentes proyectos y actuaciones en los polígonos industriales..."
      ></textarea>
    </div>

    <div class="form-group">
      <label>Mejoras en Áreas Industriales</label>
      <div class="mejoras-container">
        <div v-for="(mejora, index) in datos.mejoras" :key="index" class="mejora-item">
          <div class="form-check">
            <input 
              type="checkbox" 
              :id="'mejora-' + index"
              v-model="mejora.seleccionada" 
              class="form-check-input"
            >
            <input 
              type="text" 
              v-model="mejora.nombre" 
              class="form-control mejora-input"
              placeholder="Nombre de la mejora"
            >
            <button 
              @click="eliminarMejora(index)" 
              class="btn btn-sm btn-danger"
              type="button"
            >
              X
            </button>
          </div>
        </div>
        
        <button 
          @click="agregarMejora" 
          class="btn btn-secondary"
          type="button"
        >
          Agregar Mejora
        </button>
      </div>
    </div>

    <h4 class="section-title">4.1.3 Creación de Entidades de Gestión y Modernización en las áreas industriales</h4>
    
    <div class="form-group">
      <label>Descripción de las Entidades de Gestión</label>
      <textarea 
        v-model="datos.descripcionEntidades" 
        class="form-control"
        rows="3"
        placeholder="La creación de Entidades de Gestión y Modernización (EGM), tiene por objetivo mejorar las áreas industriales..."
      ></textarea>
    </div>

    <div class="form-group">
      <label>Entidades de Gestión</label>
      <div class="entidades-container">
        <div v-for="(entidad, index) in datos.entidades" :key="index" class="entidad-item">
          <div class="entidad-header">
            <h4>Entidad de Gestión {{ index + 1 }}</h4>
            <button 
              @click="eliminarEntidad(index)" 
              class="btn btn-danger"
              type="button"
              v-if="datos.entidades.length > 1"
            >
              Eliminar
            </button>
          </div>
          
          <div class="form-group">
            <label>Nombre de la Entidad</label>
            <input 
              type="text" 
              v-model="entidad.nombre" 
              class="form-control"
              placeholder="Ej: EGM Área Empresarial de Aguamarga"
            >
          </div>
          
          <div class="form-group">
            <label>Año de Constitución</label>
            <input 
              type="text" 
              v-model="entidad.año" 
              class="form-control"
              placeholder="Ej: 2023"
            >
          </div>
          
          <div class="form-group">
            <label>Descripción</label>
            <textarea 
              v-model="entidad.descripcion" 
              class="form-control"
              rows="2"
              placeholder="Breve descripción de la entidad"
            ></textarea>
          </div>
        </div>
        
        <button 
          @click="agregarEntidad" 
          class="btn btn-secondary"
          type="button"
        >
          Agregar Entidad de Gestión
        </button>
      </div>
    </div>

    <h4 class="section-title">4.1.4 Proyectos Específicos</h4>
    
    <div class="form-group">
      <label>Proyectos</label>
      <div class="proyectos-container">
        <div v-for="(proyecto, index) in datos.proyectos" :key="index" class="proyecto-item">
          <div class="proyecto-header">
            <h4>Proyecto {{ index + 1 }}</h4>
            <button 
              @click="eliminarProyecto(index)" 
              class="btn btn-danger"
              type="button"
              v-if="datos.proyectos.length > 1"
            >
              Eliminar
            </button>
          </div>
          
          <div class="form-group">
            <label>Nombre del Proyecto</label>
            <input 
              type="text" 
              v-model="proyecto.nombre" 
              class="form-control"
              placeholder="Ej: Proyecto de No rotonda táctica en Atalayas"
            >
          </div>
          
          <div class="form-group">
            <label>Inversión (€)</label>
            <input 
              type="text" 
              v-model="proyecto.inversion" 
              class="form-control"
              placeholder="Ej: 234.951,00"
            >
          </div>
          
          <div class="form-group">
            <label>Descripción</label>
            <textarea 
              v-model="proyecto.descripcion" 
              class="form-control"
              rows="3"
              placeholder="Descripción del proyecto"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label>Fecha de Finalización</label>
            <input 
              type="text" 
              v-model="proyecto.fechaFinalizacion" 
              class="form-control"
              placeholder="Ej: 11 de diciembre de 2023"
            >
          </div>
        </div>
        
        <button 
          @click="agregarProyecto" 
          class="btn btn-secondary"
          type="button"
        >
          Agregar Proyecto
        </button>
      </div>
    </div>

    <h4 class="section-title">4.1.5 Declaración de proyectos prioritarios</h4>
    
    <div class="form-group">
      <label>Resumen de Proyectos Prioritarios</label>
      <div class="proyectos-prioritarios">
        <div class="form-group">
          <label>Proyectos tramitados en el año</label>
          <input 
            type="text" 
            v-model="datos.proyectosTramitados" 
            class="form-control"
            placeholder="Ej: 13"
          >
        </div>
        <div class="form-group">
          <label>Presupuesto de Ejecución (€)</label>
          <input 
            type="text" 
            v-model="datos.presupuestoEjecucion" 
            class="form-control"
            placeholder="Ej: 34.502.874,23"
          >
        </div>
        <div class="form-group">
          <label>Puestos creados durante la ejecución</label>
          <input 
            type="text" 
            v-model="datos.puestosEjecucion" 
            class="form-control"
            placeholder="Ej: 240"
          >
        </div>
        <div class="form-group">
          <label>Puestos que se crearán a la finalización</label>
          <input 
            type="text" 
            v-model="datos.puestosFinalizacion" 
            class="form-control"
            placeholder="Ej: 151"
          >
        </div>
      </div>
    </div>

    <div class="form-actions">
      <button 
        @click="$emit('siguiente')" 
        class="btn btn-primary"
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

// Inicializar estructura vacía solo si no existe
if (!datos.value.areasAmpliacion) {
  datos.value.areasAmpliacion = [{}];
}

if (!datos.value.mejoras) {
  datos.value.mejoras = [
    { nombre: 'Eficiencia energética', seleccionada: false },
    { nombre: 'Cámaras de control de los hidrantes', seleccionada: false },
    { nombre: 'Asfaltado', seleccionada: false },
    { nombre: 'Nuevas plazas de aparcamiento', seleccionada: false },
    { nombre: 'Jardinería', seleccionada: false },
    { nombre: 'Directorios y paneles informativos', seleccionada: false },
    { nombre: 'Sensores calidad de aire', seleccionada: false }
  ];
}

if (!datos.value.entidades) {
  datos.value.entidades = [{}];
}

if (!datos.value.proyectos) {
  datos.value.proyectos = [{}];
}

const agregarAreaAmpliacion = () => {
  datos.value.areasAmpliacion.push({});
};

const eliminarAreaAmpliacion = (index) => {
  if (datos.value.areasAmpliacion.length > 1) {
    datos.value.areasAmpliacion.splice(index, 1);
  }
};

const agregarMejora = () => {
  datos.value.mejoras.push({ nombre: '', seleccionada: false });
};

const eliminarMejora = (index) => {
  datos.value.mejoras.splice(index, 1);
};

const agregarEntidad = () => {
  datos.value.entidades.push({});
};

const eliminarEntidad = (index) => {
  if (datos.value.entidades.length > 1) {
    datos.value.entidades.splice(index, 1);
  }
};

const agregarProyecto = () => {
  datos.value.proyectos.push({});
};

const eliminarProyecto = (index) => {
  if (datos.value.proyectos.length > 1) {
    datos.value.proyectos.splice(index, 1);
  }
};
</script>

<style scoped>
.form-step {
  max-width: 800px;
  margin: 0 auto;
}

.program-title {
  background-color: #ac3b61;
  color: white;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 20px;
  font-size: 1.5rem;
  font-weight: bold;
}

.section-title {
  color: #ac3b61;
  border-bottom: 2px solid #ac3b61;
  padding-bottom: 8px;
  margin-top: 30px;
  margin-bottom: 20px;
  font-size: 1.2rem;
  font-weight: bold;
}

.form-group {
  margin-bottom: 1.5rem;
}

.inversion-container,
.resumen-areas,
.proyectos-prioritarios {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.area-item,
.entidad-item,
.proyecto-item {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  border-left: 4px solid #ac3b61;
}

.area-header,
.entidad-header,
.proyecto-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.area-header h4,
.entidad-header h4,
.proyecto-header h4 {
  margin: 0;
  color: #ac3b61;
  font-size: 1.2rem;
}

.mejoras-container {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
}

.mejora-item {
  margin-bottom: 0.5rem;
}

.form-check {
  display: flex;
  align-items: center;
  gap: 10px;
}

.mejora-input {
  flex-grow: 1;
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
  border-color: #ac3b61;
  box-shadow: 0 0 0 2px rgba(172, 59, 97, 0.1);
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

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.btn-primary {
  background: #ac3b61;
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

.form-actions {
  margin-top: 2rem;
  display: flex;
  justify-content: flex-end;
}
</style>