<template>
  <div class="welcome-page">
    <!-- Nuevos efectos visuales -->
    <div class="animated-background">
      <div class="gradient-sphere sphere-1"></div>
      <div class="gradient-sphere sphere-2"></div>
      <div class="gradient-sphere sphere-3"></div>
    </div>
    
    <!-- Partículas flotantes -->
    <div class="floating-particles welcome-particles">
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
    </div>
    
    <!-- Efecto de ondas -->
    <div class="wave-background welcome-waves">
      <div class="wave"></div>
      <div class="wave"></div>
      <div class="wave"></div>
    </div>
    
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1 class="dashboard-title">Panel de Control</h1>
        <button @click="recargarDatos" class="reload-button" :disabled="cargando">
          <i class="fas fa-sync-alt" :class="{ 'fa-spin': cargando }"></i>
          {{ cargando ? 'Cargando...' : 'Actualizar datos' }}
        </button>
      </div>
      
      <div v-if="cargando" class="panel-loading-container">
        <div class="panel-loading-spinner"></div>
        <p>Cargando datos...</p>
      </div>
      
      <div v-else-if="empresas.length === 0" class="no-data-container">
        <p>No se encontraron datos para tu usuario. Por favor, contacta con el administrador.</p>
      </div>
      
      <div v-else>
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
        
        <div class="recent-activity actividad-reciente">
          <h2>Actividad Reciente</h2>
          <div class="activity-list" v-if="actividades.length > 0">
            <div v-for="(actividad, index) in actividades" :key="index" 
                 class="activity-item actividad-item" 
                 :class="{'formacion-item': actividad.tipo === 'formacion'}">
              <div class="activity-icon actividad-icon" :class="getIconClass(actividad.tipo)">
                <i :class="getIconForType(actividad.tipo)"></i>
              </div>
              <div class="activity-details actividad-info">
                <p class="activity-description actividad-title">{{ actividad.descripcion }}</p>
                <span class="activity-date actividad-date">{{ formatDate(actividad.fecha) }}</span>
              </div>
            </div>
          </div>
          <div v-else class="no-activity">
            <p>No hay actividad reciente para mostrar</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import Chart from 'chart.js/auto';
import { getAuth } from 'firebase/auth';
import FirestoreService from '../services/FirestoreService';

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
    
    try {
      // Obtener las empresas del usuario desde Firestore
      const empresasData = await FirestoreService.obtenerEmpresas();
      
      if (empresasData && empresasData.length > 0) {
        empresas.value = empresasData;
        
        // Obtener IDs de las empresas del usuario
        const empresasIds = empresas.value.map(empresa => empresa.id);
        
        // Para cada empresa, obtener sus departamentos, centros y formaciones
        for (const empresa of empresas.value) {
          // Obtener departamentos
          const departamentosData = await FirestoreService.obtenerDepartamentos(empresa.id);
          departamentos.value = [...departamentos.value, ...departamentosData];
          
          // Obtener centros
          const centrosData = await FirestoreService.obtenerCentros(empresa.id);
          centros.value = [...centros.value, ...centrosData];
          
          // Obtener formaciones
          const formacionesData = await FirestoreService.obtenerFormaciones(empresa.id);
          formaciones.value = [...formaciones.value, ...formacionesData];
        }
        
        // Obtener actividades recientes (si existe este método)
        try {
          const actividadesData = await FirestoreService.obtenerActividades(10); // Obtener las 10 más recientes
          actividades.value = actividadesData || [];
        } catch (actError) {
          console.warn('No se pudieron cargar las actividades:', actError);
          // Crear algunas actividades simuladas basadas en los datos reales
          actividades.value = [];
          
          // Agregar actividades simuladas para empresas
          empresas.value.forEach(empresa => {
            actividades.value.push({
              tipo: 'empresa',
              descripcion: `Empresa: ${empresa.nombre}`,
              fecha: new Date(empresa.fechaCreacion || Date.now()),
              empresaId: empresa.id
            });
          });
          
          // Agregar actividades simuladas para departamentos (limitadas a 3)
          departamentos.value.slice(0, 3).forEach(dep => {
            actividades.value.push({
              tipo: 'departamento',
              descripcion: `Departamento: ${dep.nombre}`,
              fecha: new Date(dep.fechaCreacion || Date.now()),
              empresaId: dep.empresaId
            });
          });
          
          // Agregar actividades simuladas para formaciones (limitadas a 3)
          formaciones.value.slice(0, 3).forEach(form => {
            actividades.value.push({
              tipo: 'formacion',
              descripcion: `Formación: ${form.nombre || form.titulo}`,
              fecha: new Date(form.fechaCreacion || Date.now()),
              empresaId: form.empresaId
            });
          });
          
          // Ordenar actividades por fecha (más recientes primero)
          actividades.value.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
          
          // Limitar a 10 actividades
          actividades.value = actividades.value.slice(0, 10);
        }
        
        console.log('Resumen de datos reales cargados:', {
          empresas: empresas.value.length,
          departamentos: departamentos.value.length,
          centros: centros.value.length,
          formaciones: formaciones.value.length,
          actividades: actividades.value.length
        });
      } else {
        console.error('No se encontraron empresas para este usuario');
      }
    } catch (error) {
      console.error('Error al cargar datos desde Firestore:', error);
      
      // Si hay un error al cargar desde Firestore, cargar datos ficticios para desarrollo/pruebas
      // Esto debería eliminarse en producción
      console.warn('Cargando datos ficticios como fallback...');
      
      // Datos ficticios completos
      const todasEmpresas = [
        { id: 1, nombre: 'Alicante Futura', sectores: ['Tecnología', 'Educación'], 
          creadorEmail: ['user@example.com', 'alicante@futura.com'] }, // Array de posibles creadores
        { id: 2, nombre: 'Ayuntamiento de Alicante', sectores: ['Administración'], 
          creadorEmail: ['ayuntamiento@alicante.es', 'ayunt@example.com'] }
      ];
      
      // Determinar el tipo de usuario basado en su email
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
      
      console.log('Tipo de usuario detectado (modo fallback):', userType);
      
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
      console.log('IDs de empresas mostradas (fallback):', empresasIds);
      
      // Para las siguientes entidades, filtramos según las empresas asignadas al usuario
      
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
      
      console.log('Resumen de datos ficticios cargados (fallback):', {
        empresa: empresas.value[0]?.nombre,
        departamentos: departamentos.value.length,
        centros: centros.value.length,
        formaciones: formaciones.value.length,
        actividades: actividades.value.length
      });
    }
    
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
  
  const empresa = empresas.value[0]; // Usamos la primera empresa del usuario
  
  // Datos para el gráfico de departamentos (por tipo/área)
  // Vamos a agrupar por primera letra del nombre como antes, 
  // pero si tienes un campo real de tipo/categoría en tus datos, úsalo
  const departamentosPorTipo = {};
  departamentos.value.forEach(dep => {
    // Si hay un campo tipo/categoría, úsalo; sino usa la primera letra
    const tipo = dep.tipo || dep.categoria || dep.nombre.charAt(0).toUpperCase();
    departamentosPorTipo[tipo] = (departamentosPorTipo[tipo] || 0) + 1;
  });
  
  // Datos para el gráfico de centros (por ciudad)
  const centrosPorCiudad = {};
  centros.value.forEach(centro => {
    const ciudad = centro.ciudad || 'No especificada';
    centrosPorCiudad[ciudad] = (centrosPorCiudad[ciudad] || 0) + 1;
  });
  
  // Datos para el gráfico de formaciones por estado
  const formacionesPorEstado = {
    'Completada': 0,
    'En curso': 0,
    'Pendiente': 0
  };
  
  formaciones.value.forEach(formacion => {
    // Normalizar el estado para asegurar consistencia
    const estado = formacion.estado || 'Pendiente';
    if (formacionesPorEstado.hasOwnProperty(estado)) {
      formacionesPorEstado[estado]++;
    } else {
      // Si encontramos un estado no reconocido, agregarlo
      formacionesPorEstado[estado] = 1;
    }
  });
  
  // Datos para el gráfico de sectores de la empresa
  const sectoresConteo = {};
  
  if (empresa && empresa.sectores && Array.isArray(empresa.sectores)) {
    empresa.sectores.forEach(sector => {
      sectoresConteo[sector] = (sectoresConteo[sector] || 0) + 1;
    });
  } else {
    // Si no hay sectores definidos, usar un valor por defecto
    sectoresConteo['General'] = 1;
  }
  
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

// Obtenemos la clase de icono según el tipo de actividad
const getIconClass = (tipo) => {
  switch (tipo) {
    case 'empresa': return 'empresa-icon';
    case 'departamento': return 'departamento-icon';
    case 'centro': return 'centro-icon';
    case 'formacion': return 'formacion-icon';
    default: return 'default-icon';
  }
};

// Obtener clase de icono para actividades
const getIconForType = (tipo) => {
  switch (tipo) {
    case 'empresa': return 'fas fa-building';
    case 'departamento': return 'fas fa-users';
    case 'centro': return 'fas fa-map-marker-alt';
    case 'formacion': return 'fas fa-graduation-cap';
    default: return 'fas fa-info-circle';
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

<style src="../assets/PanelControl.css"></style> 