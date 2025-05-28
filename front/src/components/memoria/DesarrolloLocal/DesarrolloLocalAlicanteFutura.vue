<template>
  <div class="form-step">
    <h3 class="program-title">
      <span class="version-badge">4.3</span>
      Alicante Futura
    </h3>
    
    <!-- Descripción General -->
    <div class="form-group">
      <label>Descripción General del Proyecto</label>
      <textarea
        v-model="datos.descripcionGeneral"
        class="form-control"
        rows="5"
        placeholder="Describe la iniciativa estratégica municipal destinada a vertebrar las líneas maestras del futuro de la ciudad de Alicante..."
      ></textarea>
    </div>

    <!-- Clusters/Hubs -->
    <div class="cluster-section">
      <h4>Clusters o Hubs Estratégicos</h4>
      <div class="cluster-grid">
        <div v-for="(cluster, index) in datos.clusters" :key="index" class="cluster-item">
          <div class="cluster-header">
            <span class="cluster-number">{{ index + 1 }}</span>
            <button 
              v-if="datos.clusters.length > 1" 
              @click="eliminarCluster(index)" 
              class="btn btn-sm btn-danger"
              title="Eliminar cluster"
            >×</button>
          </div>
          <div class="form-group">
            <label>Nombre del Cluster/Hub</label>
            <input 
              v-model="cluster.nombre" 
              class="form-control" 
              :placeholder="getClusterPlaceholder(index)"
            >
          </div>
          <div class="form-group">
            <label>Tipo</label>
            <select v-model="cluster.tipo" class="form-control">
              <option value="Cluster">Cluster</option>
              <option value="HUB">HUB</option>
            </select>
          </div>
        </div>
      </div>
      <button @click="agregarCluster" class="btn btn-success add-btn">
        ➕ Agregar Cluster o Hub
      </button>
    </div>

    <!-- Líneas de Trabajo -->
    <div class="lineas-trabajo-section">
      <h4>4 Líneas de Trabajo</h4>
      
      <div v-for="(linea, lineaIndex) in datos.lineasTrabajo" :key="lineaIndex" class="linea-item">
        <div class="linea-header">
          <div class="linea-number">{{ lineaIndex + 1 }}</div>
          <div class="linea-title-group">
            <label>Nombre de la línea de trabajo</label>
            <input 
              v-model="linea.nombre" 
              class="form-control linea-title-input" 
              :placeholder="getLineaPlaceholder(lineaIndex)"
            >
          </div>
        </div>
        
        <div class="form-group">
          <label>Descripción de la línea</label>
          <textarea 
            v-model="linea.descripcion" 
            class="form-control" 
            rows="2"
            placeholder="Describe los objetivos y actividades de esta línea de trabajo..."
          ></textarea>
        </div>

        <div class="metricas-header">
          <h5>Métricas y Resultados</h5>
          <button @click="agregarMetrica(lineaIndex)" class="btn btn-sm btn-success">
            ➕ Agregar Métrica
          </button>
        </div>
        
        <div class="metricas-grid">
          <div v-for="(metrica, metricaIndex) in linea.metricas" :key="metricaIndex" class="metrica-item">
            <button 
              @click="eliminarMetrica(lineaIndex, metricaIndex)" 
              class="btn btn-sm btn-danger metrica-remove"
              title="Eliminar métrica"
            >×</button>
            
            <div class="form-group">
              <label>Nombre de la métrica</label>
              <input 
                v-model="metrica.nombre" 
                class="form-control" 
                placeholder="Ej: Talleres realizados"
              >
            </div>
            
            <div class="form-group">
              <label>Valor</label>
              <input 
                v-model.number="metrica.valor" 
                type="number" 
                class="form-control" 
                placeholder="0"
                min="0"
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- VISTA PREVIA -->
    <div class="preview-section">
      <h4 style="margin-bottom: 20px; color: #b71c50;">📋 Vista Previa del Documento</h4>
      
      <div class="preview-container">
        <!-- Header de la previsualización -->
        <div class="preview-header">
          <div class="preview-version">4.3</div>
          <div class="preview-title-section">
            <h3 class="preview-title">ALICANTE</h3>
            <h1 class="preview-title preview-title-futura">FUTURA</h1>
          </div>
        </div>
        
        <!-- Contenido de la previsualización -->
        <div class="preview-content">
          <p class="preview-description">
            {{ datos.descripcionGeneral || 'Alicante Futura es la iniciativa estratégica municipal destinada a vertebrar las líneas maestras del futuro de la ciudad de Alicante. A través de diversos ejes temáticos de diplomacia económica competencial, impulsa y aprovecha globalmente las ventajas competitivas de nuestro territorio en el campo del emprendimiento digital y tecnológico al tiempo que se desarrollan e impulsan iniciativas, espacios especializados, talleres y encuentros vertebrados o 6 ámbitos estratégicos principales, denominados Clúster o Hubs.' }}
          </p>
          
          <!-- Clusters Preview -->
          <div class="clusters-preview">
            <div v-for="(cluster, index) in datos.clusters" :key="index" class="cluster-preview">
              <div class="cluster-preview-number">{{ index + 1 }}</div>
              <div class="cluster-preview-content">
                <div class="cluster-preview-type">{{ cluster.tipo || 'Cluster' }}</div>
                <div class="cluster-preview-name">{{ cluster.nombre || `${cluster.tipo || 'Cluster'} ${index + 1}` }}</div>
              </div>
            </div>
          </div>

          <!-- Líneas de Trabajo Preview -->
          <div class="lineas-preview-title">4 líneas de trabajo</div>
          
          <div v-for="(linea, index) in datos.lineasTrabajo" :key="index" class="linea-preview">
            <div class="linea-preview-header">
              <div class="linea-preview-number">{{ index + 1 }}</div>
              <div class="linea-preview-title">{{ linea.nombre || `Línea ${index + 1}` }}</div>
            </div>
            
            <div v-if="linea.metricas && linea.metricas.length > 0" class="metrics-preview">
              <div v-for="metrica in linea.metricas.filter(m => m.nombre && m.valor !== null && m.valor !== '')" 
                   :key="metrica.nombre" 
                   class="metric-preview">
                <div class="metric-preview-value">{{ metrica.valor }}</div>
                <div class="metric-preview-label">{{ metrica.nombre }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Navegación -->
    <div class="form-actions">
      <button @click="$emit('anterior')" class="btn btn-secondary">Anterior</button>
      <button @click="$emit('siguiente')" class="btn btn-primary" :disabled="!esValido">Siguiente</button>
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

// Inicialización de datos
const initData = () => {
  if (!datos.value.descripcionGeneral) {
    datos.value.descripcionGeneral = 'Alicante Futura es la iniciativa estratégica municipal destinada a vertebrar las líneas maestras del futuro de la ciudad de Alicante. A través de diversos ejes temáticos de diplomacia económica competencial, impulsa y aprovecha globalmente las ventajas competitivas de nuestro territorio en el campo del emprendimiento digital y tecnológico al tiempo que se desarrollan e impulsan iniciativas, espacios especializados, talleres y encuentros vertebrados o 6 ámbitos estratégicos principales, denominados Clúster o Hubs.';
  }
  
  if (!datos.value.clusters) {
    datos.value.clusters = [
      { nombre: 'Blue Economy', tipo: 'Cluster' },
      { nombre: 'Biotecnológico', tipo: 'Cluster' },
      { nombre: 'Agroalimentario', tipo: 'HUB' },
      { nombre: 'GovTech', tipo: 'HUB' },
      { nombre: 'Industrias Creativas & Innovación', tipo: 'Cluster' },
      { nombre: 'Sectores Tradicionales & Innovación', tipo: 'Cluster' }
    ];
  }
  
  if (!datos.value.lineasTrabajo) {
    datos.value.lineasTrabajo = [
      {
        nombre: 'Lab de excelencia tecnológica, digital e innovador internacional',
        descripcion: '',
        metricas: [
          { nombre: 'Talleres AFKids', valor: 18 },
          { nombre: 'Talleres Lab Senior', valor: 8 },
          { nombre: 'Talleres "Emprende en las aulas" en centros de secundaria', valor: 3 },
          { nombre: 'Ediciones Lab Alicante Futura Emprende', valor: 2 }
        ]
      },
      {
        nombre: 'II Congreso Internacional Alicante Futura',
        descripcion: '',
        metricas: [
          { nombre: 'Participantes', valor: 390 },
          { nombre: 'Startups alicantinas participantes', valor: 7 }
        ]
      },
      {
        nombre: 'Impulso a la creación de Hubs en sectores estratégicos claves para el futuro desarrollo de la ciudad',
        descripción: '',
        metricas: [
          { nombre: 'Hub Agrotech', valor: 9 },
          { nombre: 'Hub Govtech', valor: 4 },
          { nombre: 'Hub Blue Economy', valor: 9 },
          { nombre: 'Cluster Industrias Tradicionales', valor: 14 },
          { nombre: 'Fomento de comunidades de interés en Alicante', valor: 7 }
        ]
      },
      {
        nombre: 'Alicante, capital mediterránea de la Industria Tecnológica, el Emprendimiento Digital y la Nueva Economía Urbana',
        descripcion: '',
        metricas: [
          { nombre: 'Visitas, reuniones y participación en eventos', valor: 57 }
        ]
      }
    ];
  }
};

initData();

// Funciones
const agregarCluster = () => {
  datos.value.clusters.push({ nombre: '', tipo: 'Cluster' });
};

const eliminarCluster = (index) => {
  if (datos.value.clusters.length > 1) {
    datos.value.clusters.splice(index, 1);
  }
};

const agregarMetrica = (lineaIndex) => {
  if (!datos.value.lineasTrabajo[lineaIndex].metricas) {
    datos.value.lineasTrabajo[lineaIndex].metricas = [];
  }
  datos.value.lineasTrabajo[lineaIndex].metricas.push({ nombre: '', valor: null });
};

const eliminarMetrica = (lineaIndex, metricaIndex) => {
  datos.value.lineasTrabajo[lineaIndex].metricas.splice(metricaIndex, 1);
};

const getClusterPlaceholder = (index) => {
  const placeholders = [
    'Blue Economy',
    'Biotecnológico', 
    'Agroalimentario',
    'GovTech',
    'Industrias Creativas & Innovación',
    'Sectores Tradicionales & Innovación'
  ];
  return placeholders[index] || `Cluster ${index + 1}`;
};

const getLineaPlaceholder = (index) => {
  const placeholders = [
    'Lab de excelencia tecnológica, digital e innovador internacional',
    'II Congreso Internacional Alicante Futura',
    'Impulso a la creación de Hubs en sectores estratégicos claves',
    'Alicante, capital mediterránea de la Industria Tecnológica'
  ];
  return placeholders[index] || `Línea de trabajo ${index + 1}`;
};

const esValido = computed(() => {
  return datos.value.descripcionGeneral && 
         datos.value.clusters.some(cluster => cluster.nombre) &&
         datos.value.lineasTrabajo.some(linea => linea.nombre);
});
</script>

<style scoped>
.form-step {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.program-title {
  display: flex;
  align-items: center;
  gap: 15px;
  color: #b71c50;
  font-weight: bold;
  font-size: 1.8rem;
  margin-bottom: 2rem;
}

.version-badge {
  background: #b71c50;
  color: white;
  padding: 8px 15px;
  border-radius: 8px;
  font-size: 1.2rem;
  font-weight: bold;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.form-control {
  width: 100%;
  padding: 12px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.form-control:focus {
  outline: none;
  border-color: #b71c50;
  box-shadow: 0 0 0 3px rgba(183, 28, 80, 0.1);
}

.cluster-section, .lineas-trabajo-section {
  margin-bottom: 3rem;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;
}

.cluster-section h4, .lineas-trabajo-section h4 {
  color: #b71c50;
  font-size: 1.4rem;
  margin-bottom: 1.5rem;
  font-weight: bold;
}

.cluster-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.cluster-item {
  background: white;
  padding: 20px;
  border-radius: 12px;
  border: 2px solid #e9ecef;
  position: relative;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.cluster-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.cluster-number {
  background: #b71c50;
  color: white;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
}

.linea-item {
  background: white;
  padding: 25px;
  border-radius: 12px;
  margin-bottom: 25px;
  border: 2px solid #e9ecef;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.linea-header {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 20px;
}

.linea-number {
  background: #b71c50;
  color: white;
  width: 45px;
  height: 45px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.3rem;
  flex-shrink: 0;
  margin-top: 25px;
}

.linea-title-group {
  flex: 1;
}

.linea-title-input {
  font-weight: 600;
  font-size: 1.1rem;
}

.metricas-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.metricas-header h5 {
  color: #b71c50;
  font-weight: bold;
  margin: 0;
}

.metricas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.metrica-item {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #dee2e6;
  position: relative;
}

.metrica-remove {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 25px;
  height: 25px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.add-btn {
  padding: 12px 20px;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-success {
  background: #28a745;
  color: white;
}

.btn-success:hover {
  background: #218838;
  transform: translateY(-2px);
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover {
  background: #c82333;
}

/* PREVISUALIZACIÓN */
.preview-section {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 3px solid #b71c50;
}

.preview-container {
  font-family: Arial, sans-serif;
  max-width: 900px;
  margin: 0 auto;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  border-radius: 12px;
  overflow: hidden;
}

.preview-header {
  color: white;
  padding: 30px;
  display: flex;
  align-items: center;
  gap: 25px;
}

.preview-version {
  background: #B45E82;
  padding: 8px 12px;
  font-size: 1.8rem;
  font-weight: bold;
}

.preview-title {
  font-weight: bold;
  margin: 0;
  line-height: 1.1;
  color: black;
}

.preview-title-futura {
  color: #A71946;
  border-bottom: 2px solid #A71946;
}

.preview-content {
  background: white;
  padding: 30px;
}

.preview-description {
  font-size: 14px;
  line-height: 1.7;
  color: #333;
  margin-bottom: 30px;
  text-align: justify;
}

.clusters-preview {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 40px;
}

.cluster-preview {
  background: linear-gradient(135deg, #f8d7da, #f1c0c7);
  padding: 25px 15px;
  border-radius: 12px;
  text-align: center;
  position: relative;
  min-height: 130px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.cluster-preview-number {
  position: absolute;
  top: -12px;
  left: 20px;
  background: #b71c50;
  color: white;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.3rem;
}

.cluster-preview-content {
  margin-top: 15px;
}

.cluster-preview-type {
  font-size: 12px;
  color: #b71c50;
  font-weight: bold;
  margin-bottom: 5px;
}

.cluster-preview-name {
  font-weight: bold;
  color: #b71c50;
  font-size: 15px;
  line-height: 1.3;
}

.lineas-preview-title {
  color: #b71c50;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 25px;
}

.linea-preview {
  background: #f8f9fa;
  padding: 25px;
  border-radius: 12px;
  margin-bottom: 20px;
  border-left: 6px solid #b71c50;
}

.linea-preview-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.linea-preview-number {
  background: #b71c50;
  color: white;
  width: 35px;
  height: 35px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
}

.linea-preview-title {
  font-weight: bold;
  color: #333;
  font-size: 1rem;
  line-height: 1.3;
}

.metrics-preview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
}

.metric-preview {
  background: white;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  border: 1px solid #dee2e6;
}

.metric-preview-value {
  background: #b71c50;
  color: white;
  padding: 6px 10px;
  border-radius: 6px;
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 6px;
  display: inline-block;
}

.metric-preview-label {
  font-size: 11px;
  color: #666;
  font-weight: 500;
  line-height: 1.2;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #e9ecef;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-primary {
  background: #b71c50;
  color: white;
}

.btn-primary:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .cluster-grid {
    grid-template-columns: 1fr;
  }
  
  .clusters-preview {
    grid-template-columns: 1fr;
  }
  
  .metricas-grid {
    grid-template-columns: 1fr;
  }
  
  .metrics-preview {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .linea-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .linea-number {
    margin-top: 0;
  }
}
</style>