<template>
  <div class="form-step">
    <h3 class="program-title">Programa de Dinamización de Polígonos Industriales y Nuevos Espacios Productivos</h3>
    
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
            placeholder="Ej: 2018-2025" 
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
              placeholder="Ej: 2025"
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
              placeholder="Ej: 11 de diciembre de 2025"
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

    <!-- Vista previa visual -->
    <section class="bloque vista-previa">
      <h4>Vista Previa del Programa</h4>
      <div class="programa-card">
        <div class="programa-header">
          <div class="numero-seccion">4.1</div>
          <div class="titulo-seccion">
            <h5>PROGRAMA DE DINAMIZACIÓN DE</h5>
            <h6>POLÍGONOS INDUSTRIALES Y NUEVOS ESPACIOS PRODUCTIVOS</h6>
          </div>
        </div>
        
        <p class="descripcion-card">
          {{ datos.descripcionGeneral || 'Las áreas industriales son el principal motor económico de nuestra ciudad. Tal y como se expone en el III Pacto Territorial por el Empleo de la ciudad de Alicante, en él se establece, como objetivo estratégico, la mejora integral de las áreas industriales de la ciudad de Alicante y ampliación del suelo industrial disponible.' }}
        </p>

        <!-- Inversión destacada -->
        <div class="inversion-destacada">
          <div class="inversion-monto">{{ formatearEuros(datos.importeInversion) || '0 €' }}</div>
          <div class="inversion-label">Inversión Áreas Industriales {{ datos.periodoInversion || 'Periodo' }}</div>
        </div>

        <!-- Resumen áreas industriales -->
        <div class="resumen-section">
          <div class="areas-numero">{{ datos.numeroAreas || 'nº Áreas' }}</div>
          <div class="areas-label">Áreas Industriales:</div>
          
          <div class="metricas-grid">
            <div class="metrica-item">
              <div class="metrica-icono">🏭</div>
              <div class="metrica-numero">{{ formatearNumero(datos.superficieTotal) || 'm²' }}</div>
              <div class="metrica-label">m²</div>
            </div>
            <div class="metrica-item">
              <div class="metrica-icono">👥</div>
              <div class="metrica-numero">{{ formatearNumero(datos.numeroEmpleos) || 'nº Empleos' }}</div>
              <div class="metrica-label">Empleos</div>
            </div>
            <div class="metrica-item">
              <div class="metrica-icono">💰</div>
              <div class="metrica-numero">{{ datos.facturacionTotal || 'M.€ Facturación' }}</div>
              <div class="metrica-label">M.€ Facturación</div>
            </div>
          </div>
        </div>

        <!-- Secciones del programa -->
        <div class="seccion-programa">
          <div class="seccion-numero">4.1.1</div>
          <div class="seccion-titulo">Ampliación del suelo industrial en Alicante</div>
          <div class="seccion-descripcion">
            {{ datos.descripcionAmpliacion || 'A lo largo del año se ha avanzado en los trámites jurídicos y técnicos para ampliar el suelo industrial en EGM de "Atalayas, ciudad empresarial".' }}
          </div>
          
          <!-- Áreas de ampliación -->
          <div class="areas-ampliacion" v-if="datos.areasAmpliacion && datos.areasAmpliacion.length > 0">
            <div v-for="(area, index) in datos.areasAmpliacion.filter(a => a.nombre)" :key="index" class="area-ampliacion-item">
              <div class="area-nombre">{{ area.nombre }}</div>
              <div class="area-superficie">{{ formatearNumero(area.superficie) }} m²</div>
            </div>
          </div>
        </div>

        <div class="seccion-programa">
          <div class="seccion-numero">4.1.2</div>
          <div class="seccion-titulo">Impulso a la creación de Áreas Industriales Avanzadas</div>
          <div class="seccion-descripcion">
            {{ datos.descripcionImpulso || 'Desde la Agencia Local se siguen impulsando diferentes proyectos y actuaciones en los polígonos industriales de la ciudad con el fin de convertirlos en Áreas Industriales Avanzadas.' }}
          </div>
          
          <!-- Mejoras seleccionadas -->
          <div class="mejoras-section" v-if="mejorasSeleccionadas.length > 0">
            <h6>Mejoras en Áreas Industriales</h6>
            <div class="mejoras-lista">
              <div v-for="mejora in mejorasSeleccionadas" :key="mejora" class="mejora-badge">
                {{ mejora }}
              </div>
            </div>
          </div>
        </div>

        <div class="seccion-programa">
          <div class="seccion-numero">4.1.3</div>
          <div class="seccion-titulo">Creación de Entidades de Gestión y Modernización</div>
          <div class="seccion-descripcion">
            {{ datos.descripcionEntidades || 'La creación de Entidades de Gestión y Modernización (EGM), tiene por objetivo mejorar las áreas industriales de la Comunitat, hacerlas más competitivas y atractivas para la implantación de nuevos proyectos y beneficiar así a vez a las empresas ya instaladas.' }}
          </div>
          
          <!-- Entidades -->
          <div class="entidades-lista" v-if="datos.entidades && datos.entidades.length > 0">
            <div v-for="(entidad, index) in datos.entidades.filter(e => e.nombre)" :key="index" class="entidad-item-preview">
              <div class="entidad-año">{{ entidad.año || 'Año' }}</div>
              <div class="entidad-nombre">{{ entidad.nombre }}</div>
            </div>
          </div>
        </div>

        <div class="seccion-programa">
          <div class="seccion-numero">4.1.4</div>
          <div class="seccion-titulo">Proyectos Específicos</div>
          
          <div class="proyectos-lista" v-if="datos.proyectos && datos.proyectos.length > 0">
            <div v-for="(proyecto, index) in datos.proyectos.filter(p => p.nombre)" :key="index" class="proyecto-preview">
              <div class="proyecto-inversion">{{ formatearEuros(proyecto.inversion) }}</div>
              <div class="proyecto-info">
                <div class="proyecto-nombre">{{ proyecto.nombre }}</div>
                <div class="proyecto-fecha" v-if="proyecto.fechaFinalizacion">{{ proyecto.fechaFinalizacion }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="seccion-programa">
          <div class="seccion-numero">4.1.5</div>
          <div class="seccion-titulo">Declaración de proyectos prioritarios</div>
          
          <div class="proyectos-prioritarios-resumen">
            <div class="prioritario-item">
              <div class="prioritario-numero">{{ datos.proyectosTramitados || 'nº de proyectos' }}</div>
              <div class="prioritario-label">Proyectos tramitados</div>
            </div>
            <div class="prioritario-item">
              <div class="prioritario-numero">{{ formatearEuros(datos.presupuestoEjecucion) || 'Presupuesto de Ejecución' }}</div>
              <div class="prioritario-label">Presupuesto de Ejecución</div>
            </div>
            <div class="prioritario-empleos">
              <div class="empleo-item">
                <div class="empleo-numero">{{ datos.puestosEjecucion || 'nº Puestos' }}</div>
                <div class="empleo-label">Puestos creados durante la ejecución</div>
              </div>
              <div class="empleo-item">
                <div class="empleo-numero">{{ datos.puestosFinalizacion || 'nº Puestos' }}</div>
                <div class="empleo-label">Puestos que se crearán a la finalización</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

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

// Funciones de formato
const formatearNumero = (numero) => {
  if (!numero) return '';
  return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const formatearEuros = (cantidad) => {
  if (!cantidad) return '';
  const numero = cantidad.toString().replace(/[^0-9.,]/g, '');
  return numero + ' €';
};

// Computed para mejoras seleccionadas
const mejorasSeleccionadas = computed(() => {
  if (!datos.value.mejoras) return [];
  return datos.value.mejoras
    .filter(mejora => mejora.seleccionada && mejora.nombre)
    .map(mejora => mejora.nombre);
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
  max-width: 1000px;
  margin: 0 auto;
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px #0001;
}

.program-title {
  color:#b71c50;
  font-weight: bolder;
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

/* Estilos para la vista previa */
.bloque {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;

}

.bloque h4 {
  color: #ac3b61;
  margin-bottom: 1rem;
}

.vista-previa {
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 1.5rem;
  background: #f8f9fa;
  margin-top: 3rem;
}

.programa-card {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.programa-header {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 3px solid #ac3b61;
}

.numero-seccion {
  background: #ac3b61;
  color: white;
  font-size: 2rem;
  font-weight: bold;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  margin-right: 1.5rem;
}

.titulo-seccion h5 {
  color: white;
  font-size: 1.8rem;
  font-weight: bold;
  margin: 0;
  line-height: 1.2;
}

.titulo-seccion h6 {
  color: #b71c50;
  font-size: 1rem;
  font-weight: normal;
  margin: 0;
  line-height: 1.2;
}

.descripcion-card {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1.5rem;
  text-align: justify;
}

.resultados-section h6 {
  color: #333;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.resultados-section h7 {
  color: #b71c50;
  font-size: 0.9rem;
  font-weight: bold;
  display: block;
  margin-bottom: 1rem;
}

.metricas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.metrica {
  text-align: center;
  padding: 1rem;
  border-radius: 8px;
  background: #f8f9fa;
}

.metrica-numero {
  font-size: 2rem;
  font-weight: bold;
  color: #b71c50;
  background: white;
  padding: 0.5rem;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.metrica-label {
  font-size: 0.85rem;
  color: #666;
  font-weight: 500;
}

.informes-section {
  margin-bottom: 1.5rem;
}

.informes-section h6 {
  color: #333;
  font-weight: bold;
  margin-bottom: 1rem;
}

.informes-grid {
  display: flex;
  gap: 2rem;
  justify-content: space-around;
  flex-wrap: wrap;
}

.informe-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.informe-numero {
  background: #b71c50;
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  min-width: 40px;
  text-align: center;
}

.informe-label {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

.eventos-section {
  margin-bottom: 1.5rem;
}

.eventos-header {
  margin-bottom: 1rem;
}

.eventos-box {
  background: #b71c50;
  color: white;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.eventos-box h6 {
  margin: 0;
  font-size: 1rem;
  font-weight: bold;
}

.eventos-numero {
  font-size: 2rem;
  font-weight: bold;
  background: rgba(255,255,255,0.2);
  padding: 0.5rem 1rem;
  border-radius: 6px;
}

.eventos-lista {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  max-height: 200px;
  overflow-y: auto;
}

.evento-item {
  padding: 0.5rem 0;
  border-bottom: 1px solid #e9ecef;
  font-size: 0.9rem;
}

.evento-item:last-child {
  border-bottom: none;
}

.eventos-vacia {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  color: #999;
  font-style: italic;
}

.actividades-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
}

.actividades-label {
  font-weight: 500;
  color: #333;
}

.actividades-numero {
  background: #b71c50;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  padding: 0.5rem 1rem;
  border-radius: 6px;
}

/* Estilos originales del formulario */
.fila {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  align-items: flex-end;
}

.campo {
  flex: 1 1 200px;
  min-width: 200px;
}

.evento {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.btn {
  margin-top: 0.5rem;
}

.form-actions {
  margin-top: 2rem;
  display: flex;
  justify-content: space-between;
}

input::placeholder,
textarea::placeholder {
  color: rgba(0, 0, 0, 0.6) !important;
  font-weight: 400;
}

@media (max-width: 768px) {
  .metricas-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .informes-grid {
    flex-direction: column;
    gap: 1rem;
  }
  
  .eventos-box {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .actividades-section {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
h3, h5{
  color: #b71c50;
}

/* Estilos para la vista previa del programa */
.bloque.vista-previa {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
}

.programa-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  overflow: hidden;
}

/* Header del programa */
.programa-header {
  background: white;
  color: white;
  padding: 20px;
  display: flex;
  align-items: flex-start;
  gap: 15px;
}

.numero-seccion {
  background: #ac3b61;
  color: white;
  font-size: 24px;
  font-weight: bold;
  padding: 8px 12px;
  border-radius: 4px;
  min-width: 60px;
  text-align: center;
}

.titulo-seccion h5 {
  color: black;
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.titulo-seccion h6 {
  color: #b71c50;
  margin: 5px 0 0 0;
  font-size: 16px;
  font-weight: revert-layer;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

/* Descripción principal */
.descripcion-card {
  padding: 20px;
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: #333;
}

/* Inversión destacada */
.inversion-destacada {
  background: #c2185b;
  color: white;
  text-align: center;
  padding: 20px;
  margin: 0 20px 20px 20px;
  border-radius: 8px;
}

.inversion-monto {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 5px;
}

.inversion-label {
  font-size: 14px;
  opacity: 0.9;
}

/* Resumen de áreas industriales */
.resumen-section {
  padding: 20px;
  background: #f8f9fa;
  margin: 0 20px 20px 20px;
  border-radius: 8px;
}

.areas-numero {
  font-size: 48px;
  font-weight: bold;
  color: #c2185b;
  text-align: center;
  margin-bottom: 5px;
}

.areas-label {
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.metricas-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.metrica-item {
  text-align: center;
  background: white;
  padding: 15px 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.metrica-icono {
  font-size: 24px;
  margin-bottom: 8px;
}

.metrica-numero {
  font-size: 20px;
  font-weight: bold;
  color: #c2185b;
  margin-bottom: 5px;
}

.metrica-label {
  font-size: 12px;
  color: #666;
  font-weight: bold;
}

/* Secciones del programa */
.seccion-programa {
  margin: 20px;
  padding: 20px;
  border-left: 4px solid #c2185b;
  background: #fafafa;
  border-radius: 0 8px 8px 0;
}

.seccion-numero {
  background: #333;
  color: white;
  font-size: 14px;
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
  margin-bottom: 10px;
}

.seccion-titulo {
  font-size: 18px;
  font-weight: bold;
  color: #c2185b;
  margin-bottom: 10px;
}

.seccion-descripcion {
  font-size: 14px;
  line-height: 1.5;
  color: #333;
  margin-bottom: 15px;
}

/* Áreas de ampliación */
.areas-ampliacion {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 15px;
}

.area-ampliacion-item {
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-align: center;
}

.area-nombre {
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
  font-size: 14px;
}

.area-superficie {
  background: #c2185b;
  color: white;
  padding: 8px 12px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 16px;
}

/* Mejoras */
.mejoras-section h6 {
  color: #c2185b;
  font-weight: bold;
  margin-bottom: 15px;
  font-size: 16px;
}

.mejoras-lista {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.mejora-badge {
  background: #e3f2fd;
  color: #1976d2;
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 500;
}

/* Entidades */
.entidades-lista {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
  margin-top: 15px;
}

.entidad-item-preview {
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 15px;
}

.entidad-año {
  background: #c2185b;
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 14px;
}

.entidad-nombre {
  flex: 1;
  font-weight: bold;
  color: #333;
  font-size: 14px;
}

/* Proyectos */
.proyectos-lista {
  display: grid;
  gap: 15px;
  margin-top: 15px;
}

.proyecto-preview {
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 15px;
}

.proyecto-inversion {
  background: #c2185b;
  color: white;
  padding: 12px 16px;
  border-radius: 8px;
  font-weight: bold;
  font-size: 18px;
  min-width: 150px;
  text-align: center;
}

.proyecto-info {
  flex: 1;
}

.proyecto-nombre {
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
  font-size: 16px;
}

.proyecto-fecha {
  color: #666;
  font-size: 14px;
}

/* Proyectos prioritarios */
.proyectos-prioritarios-resumen {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-top: 15px;
}

.prioritario-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.prioritario-item:last-child {
  border-bottom: none;
}

.prioritario-numero {
  background: #c2185b;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 18px;
  min-width: 120px;
  text-align: center;
}

.prioritario-label {
  flex: 1;
  margin-left: 15px;
  font-weight: 500;
  color: #333;
}

.prioritario-empleos {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 15px;
}

.empleo-item {
  text-align: center;
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
}

.empleo-numero {
  font-size: 24px;
  font-weight: bold;
  color: #c2185b;
  margin-bottom: 5px;
}

.empleo-label {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

/* Responsivo */
@media (max-width: 768px) {
  .programa-header {
    flex-direction: column;
    text-align: center;
  }
  
  .metricas-grid {
    grid-template-columns: 1fr;
  }
  
  .areas-ampliacion {
    grid-template-columns: 1fr;
  }
  
  .entidades-lista {
    grid-template-columns: 1fr;
  }
  
  .prioritario-empleos {
    grid-template-columns: 1fr;
  }
  
  .proyecto-preview {
    flex-direction: column;
    text-align: center;
  }
  
  .prioritario-item {
    flex-direction: column;
    text-align: center;
    gap: 10px;
  }
  
  .prioritario-label {
    margin-left: 0;
  }
}
</style>