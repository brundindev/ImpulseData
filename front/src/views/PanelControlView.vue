<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <h1 class="dashboard-title">Panel de Control</h1>
      <button @click="recargarDatos" class="reload-button" :disabled="cargando">
        <i class="fas fa-sync-alt" :class="{ 'fa-spin': cargando }"></i>
        {{ cargando ? 'Cargando...' : 'Actualizar datos' }}
      </button>
    </div>
    
    <div v-if="cargando" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Cargando datos...</p>
    </div>
    
    <div v-else-if="empresas.length === 0" class="no-data-container">
      <p>No se encontraron datos para tu usuario. Por favor, contacta con el administrador.</p>
    </div>
    
    <div v-else>
      <div class="user-company">
        <h2>{{ empresas[0].nombre }}</h2>
      </div>
      
      <div class="dashboard-summary">
        <div class="summary-card">
          <div class="summary-icon">
            <i class="fas fa-building"></i>
          </div>
          <div class="summary-content">
            <h3>{{ totalEmpresas }}</h3>
            <p>Empresas</p>
          </div>
        </div>
        
        <div class="summary-card">
          <div class="summary-icon">
            <i class="fas fa-users"></i>
          </div>
          <div class="summary-content">
            <h3>{{ totalDepartamentos }}</h3>
            <p>Departamentos</p>
          </div>
        </div>
        
        <div class="summary-card">
          <div class="summary-icon">
            <i class="fas fa-map-marker-alt"></i>
          </div>
          <div class="summary-content">
            <h3>{{ totalCentros }}</h3>
            <p>Centros</p>
          </div>
        </div>
        
        <div class="summary-card">
          <div class="summary-icon">
            <i class="fas fa-graduation-cap"></i>
          </div>
          <div class="summary-content">
            <h3>{{ totalFormaciones }}</h3>
            <p>Formaciones</p>
          </div>
        </div>
      </div>
      
      <div class="charts-grid">
        <div class="chart-card">
          <h2>Departamentos</h2>
          <div class="chart-container">
            <canvas ref="departamentosChart"></canvas>
          </div>
        </div>
        
        <div class="chart-card">
          <h2>Centros</h2>
          <div class="chart-container">
            <canvas ref="centrosChart"></canvas>
          </div>
        </div>
        
        <div class="chart-card">
          <h2>Estado de Formaciones</h2>
          <div class="chart-container">
            <canvas ref="formacionesChart"></canvas>
          </div>
        </div>
        
        <div class="chart-card">
          <h2>Sectores</h2>
          <div class="chart-container">
            <canvas ref="organismosChart"></canvas>
          </div>
        </div>
      </div>
      
      <div class="recent-activity">
        <h2>Actividad Reciente</h2>
        <div class="activity-list" v-if="actividades.length > 0">
          <div v-for="(actividad, index) in actividades" :key="index" class="activity-item">
            <div class="activity-icon" :class="getIconClass(actividad.tipo)"></div>
            <div class="activity-details">
              <p class="activity-description">{{ actividad.descripcion }}</p>
              <span class="activity-date">{{ formatDate(actividad.fecha) }}</span>
            </div>
          </div>
        </div>
        <div v-else class="no-activity">
          <p>No hay actividad reciente para mostrar</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import Chart from 'chart.js/auto';
import { getAuth } from 'firebase/auth';

// Referencias a los canvas de los gráficos
const departamentosChart = ref(null);
const centrosChart = ref(null);
const formacionesChart = ref(null);
const organismosChart = ref(null);

// Datos del estado
const empresas = ref([]);
const departamentos = ref([]);
const centros = ref([]);
const formaciones = ref([]);
const actividades = ref([]);
const cargando = ref(true);

// Totales calculados
const totalEmpresas = computed(() => empresas.value.length);
const totalDepartamentos = computed(() => departamentos.value.length);
const totalCentros = computed(() => centros.value.length);
const totalFormaciones = computed(() => formaciones.value.length);

// Instancias de los gráficos
let departamentosChartInstance = null;
let centrosChartInstance = null;
let formacionesChartInstance = null;
let organismosChartInstance = null;

// Colores para los gráficos
const colores = [
  '#004698', // Azul corporativo principal
  '#0056b8',
  '#006ad4',
  '#0080f0',
  '#1a90ff',
  '#33a0ff',
  '#4db2ff',
  '#66c2ff',
  '#80d1ff',
  '#99e1ff'
];

// Cargar datos del servidor
const cargarDatos = async (forzarRecarga = false) => {
  try {
    cargando.value = true;
    
    // Limpiar datos anteriores para evitar mezclar datos
    empresas.value = [];
    departamentos.value = [];
    centros.value = [];
    formaciones.value = [];
    actividades.value = [];
    
    // Si hay instancias de gráficos, destruirlas
    if (departamentosChartInstance) departamentosChartInstance.destroy();
    if (centrosChartInstance) centrosChartInstance.destroy();
    if (formacionesChartInstance) formacionesChartInstance.destroy();
    if (organismosChartInstance) organismosChartInstance.destroy();
    
    // Obtener usuario actual
    const auth = getAuth();
    
    // Forzar la actualización del token si se está recargando
    if (forzarRecarga) {
      await auth.currentUser?.reload();
      // Forzar la limpieza completa del caché del navegador para esta página
      if (window.caches) {
        try {
          const cacheNames = await window.caches.keys();
          await Promise.all(
            cacheNames.map(cacheName => window.caches.delete(cacheName))
          );
          console.log("Caché del navegador limpiada");
        } catch (e) {
          console.error("Error al limpiar caché:", e);
        }
      }
    }
    
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      console.error('No hay usuario autenticado');
      cargando.value = false;
      return;
    }
    
    const userEmail = currentUser.email;
    console.log('Cargando datos para el usuario:', userEmail);
    
    // Limpiar posible caché de localStorage relacionada con el dashboard
    if (forzarRecarga) {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('dashboard_')) {
          localStorage.removeItem(key);
        }
      });
      
      // También podemos limpiar sessionStorage
      Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith('dashboard_')) {
          sessionStorage.removeItem(key);
        }
      });
    }
    
    // En un entorno real, aquí se harían peticiones al backend filtradas por usuario
    // Por ahora, usaremos datos ficticios para demostración
    
    // Simular carga de datos
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // En un entorno real, se añadiría un parámetro para evitar caché
    // const timestamp = Date.now();
    // fetch(`/api/dashboard/datos?t=${timestamp}&userId=${currentUser.uid}`)
    
    // Para pruebas, añadimos una opción para mostrar los datos de cualquier usuario
    // (solo para desarrollo, eliminar en producción)
    console.log('Modo debug:', localStorage.getItem('debug_mode'));
    
    // Esta lógica es solo para simular distintos usuarios en desarrollo
    // En producción, esto se manejaría desde el backend
    let userType = '';
    
    if (userEmail.includes('ayuntamiento') || userEmail.includes('alicante.es')) {
      userType = 'ayuntamiento';
    } else if (userEmail.includes('user') || userEmail.includes('example.com')) {
      userType = 'alicante_futura';
    } else {
      // Para otros correos, usar el primer segmento (antes del @) para determinar el tipo
      const emailPrefix = userEmail.split('@')[0];
      if (emailPrefix.includes('alicante') || emailPrefix.includes('futura')) {
        userType = 'alicante_futura';
      } else if (emailPrefix.includes('ayunt')) {
        userType = 'ayuntamiento';
      } else {
        // Default para pruebas - se pueden alternar tipos con un valor en localStorage
        const savedType = localStorage.getItem('user_dashboard_type');
        userType = savedType || 'alicante_futura';
      }
    }
    
    console.log('Tipo de usuario detectado:', userType);
    
    // Datos ficticios completos
    const todasEmpresas = [
      { id: 1, nombre: 'Alicante Futura', sectores: ['Tecnología', 'Educación'], 
        creadorEmail: ['user@example.com', 'alicante@futura.com'] }, // Array de posibles creadores
      { id: 2, nombre: 'Ayuntamiento de Alicante', sectores: ['Administración'], 
        creadorEmail: ['ayuntamiento@alicante.es', 'ayunt@example.com'] }
    ];
    
    // Filtrar según el tipo detectado o el email exacto
    if (userType === 'ayuntamiento') {
      empresas.value = [todasEmpresas[1]]; // Asignar Ayuntamiento
    } else if (userType === 'alicante_futura') {
      empresas.value = [todasEmpresas[0]]; // Asignar Alicante Futura
    } else {
      // Filtrado por email exacto (fallback)
      empresas.value = todasEmpresas.filter(empresa => 
        Array.isArray(empresa.creadorEmail) 
          ? empresa.creadorEmail.includes(userEmail)
          : empresa.creadorEmail === userEmail
      );
    }
    
    // Si no se encontraron empresas, mostrar mensaje
    if (empresas.value.length === 0) {
      console.log('No se encontraron empresas para el usuario, usando modo alternancia');
      
      // Alternar entre las dos empresas para facilitar pruebas
      const lastCompany = localStorage.getItem('last_company_shown');
      if (lastCompany === '1') {
        empresas.value = [todasEmpresas[1]];
        localStorage.setItem('last_company_shown', '2');
      } else {
        empresas.value = [todasEmpresas[0]];
        localStorage.setItem('last_company_shown', '1');
      }
    }
    
    // Obtener los IDs de las empresas del usuario
    const empresasIds = empresas.value.map(empresa => empresa.id);
    console.log('IDs de empresas mostradas:', empresasIds);
    
    // Para las siguientes entidades, filtramos según las empresas
    // asignadas al usuario
    
    // Todos los departamentos
    const todosDepartamentos = [
      { id: 1, nombre: 'Desarrollo', empresaId: 1, creadorEmail: 'user@example.com' },
      { id: 2, nombre: 'Marketing', empresaId: 1, creadorEmail: 'user@example.com' },
      { id: 3, nombre: 'Recursos Humanos', empresaId: 1, creadorEmail: 'otro@example.com' },
      { id: 4, nombre: 'Contabilidad', empresaId: 2, creadorEmail: 'ayuntamiento@alicante.es' },
      { id: 5, nombre: 'Atención Ciudadana', empresaId: 2, creadorEmail: 'ayuntamiento@alicante.es' },
      { id: 6, nombre: 'Urbanismo', empresaId: 2, creadorEmail: 'otro@alicante.es' }
    ];
    
    // Filtrar departamentos: mostrar los que pertenecen a las empresas del usuario
    departamentos.value = todosDepartamentos.filter(depto => 
      empresasIds.includes(depto.empresaId)
    );
    
    console.log('Departamentos filtrados:', departamentos.value.length);
    
    // Todos los centros
    const todosCentros = [
      { id: 1, nombre: 'Centro Principal', empresaId: 1, ciudad: 'Alicante', creadorEmail: 'user@example.com' },
      { id: 2, nombre: 'Centro Norte', empresaId: 1, ciudad: 'Alicante', creadorEmail: 'user@example.com' },
      { id: 3, nombre: 'Ayuntamiento Central', empresaId: 2, ciudad: 'Alicante', creadorEmail: 'ayuntamiento@alicante.es' },
      { id: 4, nombre: 'Oficina Distrito 1', empresaId: 2, ciudad: 'Alicante', creadorEmail: 'ayuntamiento@alicante.es' },
      { id: 5, nombre: 'Oficina Distrito 2', empresaId: 2, ciudad: 'Alicante', creadorEmail: 'otro@alicante.es' }
    ];
    
    // Filtrar centros: mostrar los que pertenecen a las empresas del usuario
    centros.value = todosCentros.filter(centro => 
      empresasIds.includes(centro.empresaId)
    );
    
    console.log('Centros filtrados:', centros.value.length);
    
    // Todas las formaciones
    const todasFormaciones = [
      { id: 1, titulo: 'Desarrollo Web', estado: 'Completada', participantes: 15, empresaId: 1, creadorEmail: 'user@example.com' },
      { id: 2, titulo: 'Marketing Digital', estado: 'En curso', participantes: 12, empresaId: 1, creadorEmail: 'user@example.com' },
      { id: 3, titulo: 'Gestión de Proyectos', estado: 'Pendiente', participantes: 20, empresaId: 1, creadorEmail: 'otro@example.com' },
      { id: 4, titulo: 'Atención al Ciudadano', estado: 'Completada', participantes: 18, empresaId: 2, creadorEmail: 'ayuntamiento@alicante.es' },
      { id: 5, titulo: 'Normativa Urbanística', estado: 'En curso', participantes: 10, empresaId: 2, creadorEmail: 'ayuntamiento@alicante.es' }
    ];
    
    // Filtrar formaciones: mostrar las que pertenecen a las empresas del usuario
    formaciones.value = todasFormaciones.filter(formacion => 
      empresasIds.includes(formacion.empresaId)
    );
    
    console.log('Formaciones filtradas:', formaciones.value.length);
    
    // Todas las actividades
    const todasActividades = [
      { tipo: 'empresa', descripcion: 'Se ha actualizado la información de Alicante Futura', fecha: new Date(2023, 2, 15), empresaId: 1, creadorEmail: 'user@example.com' },
      { tipo: 'departamento', descripcion: 'Nuevo departamento: Marketing', fecha: new Date(2023, 2, 12), empresaId: 1, creadorEmail: 'user@example.com' },
      { tipo: 'formacion', descripcion: 'Formación completada: Desarrollo Web', fecha: new Date(2023, 2, 10), empresaId: 1, creadorEmail: 'user@example.com' },
      { tipo: 'centro', descripcion: 'Nuevo centro: Oficina Distrito 2', fecha: new Date(2023, 2, 5), empresaId: 2, creadorEmail: 'ayuntamiento@alicante.es' },
      { tipo: 'departamento', descripcion: 'Nuevo departamento: Atención Ciudadana', fecha: new Date(2023, 2, 8), empresaId: 2, creadorEmail: 'ayuntamiento@alicante.es' },
      { tipo: 'formacion', descripcion: 'Formación iniciada: Normativa Urbanística', fecha: new Date(2023, 2, 2), empresaId: 2, creadorEmail: 'ayuntamiento@alicante.es' }
    ];
    
    // Filtrar actividades: mostrar las que pertenecen a las empresas del usuario
    actividades.value = todasActividades.filter(actividad => 
      empresasIds.includes(actividad.empresaId)
    );
    
    console.log('Actividades filtradas:', actividades.value.length);
    
    // Imprimir un resumen de los datos cargados para depuración
    console.log('Resumen de datos cargados:', {
      empresa: empresas.value[0]?.nombre,
      departamentos: departamentos.value.length,
      centros: centros.value.length,
      formaciones: formaciones.value.length,
      actividades: actividades.value.length
    });
    
    cargando.value = false;
  } catch (error) {
    console.error('Error al cargar datos:', error);
    cargando.value = false;
  }
};

// Inicializar gráficos
const inicializarGraficos = () => {
  // Si no hay empresas, no inicializar gráficos
  if (empresas.value.length === 0) {
    return;
  }
  
  const empresa = empresas.value[0]; // Usamos la única empresa del usuario
  
  // Datos para el gráfico de departamentos (por tipo/área)
  // Agrupamos los departamentos por alguna característica
  // En este caso simplificado, usamos la primera letra del nombre como "tipo" de departamento
  const departamentosPorTipo = {};
  departamentos.value.forEach(dep => {
    const tipo = dep.nombre.charAt(0).toUpperCase();
    departamentosPorTipo[tipo] = (departamentosPorTipo[tipo] || 0) + 1;
  });
  
  // Datos para el gráfico de centros (por ciudad)
  const centrosPorCiudad = {};
  centros.value.forEach(centro => {
    centrosPorCiudad[centro.ciudad] = (centrosPorCiudad[centro.ciudad] || 0) + 1;
  });
  
  // Datos para el gráfico de formaciones por estado
  const formacionesPorEstado = {
    'Completada': formaciones.value.filter(f => f.estado === 'Completada').length,
    'En curso': formaciones.value.filter(f => f.estado === 'En curso').length,
    'Pendiente': formaciones.value.filter(f => f.estado === 'Pendiente').length
  };
  
  // Datos para el gráfico de sectores de la empresa
  const sectores = empresa.sectores;
  const sectoresConteo = {};
  sectores.forEach(sector => {
    sectoresConteo[sector] = 1; // Como solo tenemos una empresa, cada sector tiene un conteo de 1
  });
  
  // Crear gráfico de departamentos
  if (departamentosChartInstance) departamentosChartInstance.destroy();
  departamentosChartInstance = new Chart(departamentosChart.value, {
    type: 'doughnut',
    data: {
      labels: Object.keys(departamentosPorTipo),
      datasets: [{
        data: Object.values(departamentosPorTipo),
        backgroundColor: colores.slice(0, Object.keys(departamentosPorTipo).length),
        borderColor: 'white',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        },
        title: {
          display: true,
          text: 'Distribución por tipo'
        }
      }
    }
  });
  
  // Crear gráfico de centros
  if (centrosChartInstance) centrosChartInstance.destroy();
  centrosChartInstance = new Chart(centrosChart.value, {
    type: 'doughnut',
    data: {
      labels: Object.keys(centrosPorCiudad),
      datasets: [{
        data: Object.values(centrosPorCiudad),
        backgroundColor: colores.slice(0, Object.keys(centrosPorCiudad).length),
        borderColor: 'white',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        },
        title: {
          display: true,
          text: 'Distribución por ciudad'
        }
      }
    }
  });
  
  // Crear gráfico de formaciones
  if (formacionesChartInstance) formacionesChartInstance.destroy();
  formacionesChartInstance = new Chart(formacionesChart.value, {
    type: 'doughnut',
    data: {
      labels: Object.keys(formacionesPorEstado),
      datasets: [{
        data: Object.values(formacionesPorEstado),
        backgroundColor: ['#28a745', '#ffc107', '#dc3545'],
        borderColor: 'white',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        },
        title: {
          display: true,
          text: 'Estado de las formaciones'
        }
      }
    }
  });
  
  // Crear gráfico de sectores
  if (organismosChartInstance) organismosChartInstance.destroy();
  organismosChartInstance = new Chart(organismosChart.value, {
    type: 'doughnut',
    data: {
      labels: Object.keys(sectoresConteo),
      datasets: [{
        data: Object.values(sectoresConteo),
        backgroundColor: colores.slice(0, Object.keys(sectoresConteo).length),
        borderColor: 'white',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        },
        title: {
          display: true,
          text: 'Sectores de actividad'
        }
      }
    }
  });
};

// Formatear fecha
const formatDate = (date) => {
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
};

// Obtener clase de icono para actividades
const getIconClass = (tipo) => {
  switch (tipo) {
    case 'empresa': return 'activity-icon-empresa';
    case 'departamento': return 'activity-icon-departamento';
    case 'centro': return 'activity-icon-centro';
    case 'formacion': return 'activity-icon-formacion';
    default: return 'activity-icon-default';
  }
};

// Función para recargar datos
const recargarDatos = async () => {
  console.log('Forzando recarga de datos...');
  await cargarDatos(true);
  inicializarGraficos();
};

// Cargar datos y configurar gráficos al montar el componente
onMounted(async () => {
  await cargarDatos(true); // Forzar carga limpia al inicio
  inicializarGraficos();
  
  // Hacer responsive los gráficos
  window.addEventListener('resize', inicializarGraficos);
});
</script>

<style scoped>
.dashboard-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.dashboard-title {
  color: #004698;
  margin-bottom: 2rem;
  text-align: center;
  font-size: 2rem;
}

.dashboard-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.summary-card {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 6px rgba(0, 0, 152, 0.1);
}

.summary-icon {
  background-color: #004698;
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-right: 1rem;
}

.summary-content h3 {
  font-size: 1.8rem;
  margin: 0;
  color: #004698;
  font-weight: bold;
}

.summary-content p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.chart-card {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 152, 0.1);
}

.chart-card h2 {
  color: #004698;
  font-size: 1.2rem;
  margin-top: 0;
  margin-bottom: 1rem;
  text-align: center;
}

.chart-container {
  position: relative;
  height: 250px;
  width: 100%;
}

.recent-activity {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 152, 0.1);
}

.recent-activity h2 {
  color: #004698;
  font-size: 1.5rem;
  margin-top: 0;
  margin-bottom: 1.5rem;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: 8px;
  background-color: #f8f9fa;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.activity-icon-empresa {
  background-color: #004698;
}

.activity-icon-departamento {
  background-color: #0056b8;
}

.activity-icon-centro {
  background-color: #006ad4;
}

.activity-icon-formacion {
  background-color: #0080f0;
}

.activity-details {
  flex: 1;
}

.activity-description {
  margin: 0 0 0.25rem;
  font-size: 0.95rem;
}

.activity-date {
  color: #666;
  font-size: 0.8rem;
}

.no-activity {
  text-align: center;
  color: #666;
  padding: 2rem 0;
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 1rem;
  }
  
  .dashboard-summary {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  }
  
  .charts-grid {
    grid-template-columns: 1fr;
  }
}

.loading-container, .no-data-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: white;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 152, 0.1);
  text-align: center;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #004698;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.no-data-container p {
  color: #666;
  font-size: 1.2rem;
}

.user-company {
  margin-bottom: 2rem;
  text-align: center;
}

.user-company h2 {
  color: #004698;
  font-size: 1.8rem;
  margin: 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #004698;
  display: inline-block;
}

.reload-button {
  background-color: #004698;
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.reload-button:hover {
  background-color: #0056b8;
}

.reload-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style> 