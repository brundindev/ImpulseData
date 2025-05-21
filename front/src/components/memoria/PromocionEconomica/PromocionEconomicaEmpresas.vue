<template>
  <div class="form-step">
    <h3>Empresas y Emprendedores</h3>
    
    <div class="form-group">
      <label>Empresas Atendidas</label>
      <div class="empresas">
        <div v-for="(empresa, index) in datos.empresas" :key="index" class="empresa-item">
          <div class="empresa-header">
            <h4>Empresa {{ index + 1 }}</h4>
            <button 
              @click="eliminarEmpresa(index)" 
              class="btn btn-danger"
              type="button"
              v-if="datos.empresas.length > 1"
            >
              Eliminar
            </button>
          </div>
          
          <div class="form-group">
            <label>Nombre de la Empresa</label>
            <input 
              type="text" 
              v-model="empresa.nombre" 
              class="form-control"
              placeholder="Nombre de la empresa"
            >
          </div>
          
          <div class="form-group">
            <label>Sector</label>
            <select v-model="empresa.sector" class="form-control">
              <option value="">Seleccione un sector</option>
              <option value="industrial">Industrial</option>
              <option value="servicios">Servicios</option>
              <option value="comercio">Comercio</option>
              <option value="tecnologia">Tecnología</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Tamaño</label>
            <select v-model="empresa.tamano" class="form-control">
              <option value="">Seleccione un tamaño</option>
              <option value="micro">Micro (1-9 empleados)</option>
              <option value="pequena">Pequeña (10-49 empleados)</option>
              <option value="mediana">Mediana (50-249 empleados)</option>
              <option value="grande">Grande (250+ empleados)</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Servicios Prestados</label>
            <div class="servicios">
              <div v-for="(servicio, sIndex) in empresa.servicios" :key="sIndex" class="servicio-item">
                <div class="servicio-header">
                  <h5>Servicio {{ sIndex + 1 }}</h5>
                  <button 
                    @click="eliminarServicio(index, sIndex)" 
                    class="btn btn-danger btn-sm"
                    type="button"
                    v-if="empresa.servicios.length > 1"
                  >
                    Eliminar
                  </button>
                </div>
                
                <div class="form-group">
                  <label>Tipo de Servicio</label>
                  <select v-model="servicio.tipo" class="form-control">
                    <option value="">Seleccione un tipo</option>
                    <option value="asesoramiento">Asesoramiento</option>
                    <option value="financiacion">Financiación</option>
                    <option value="formacion">Formación</option>
                    <option value="networking">Networking</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                
                <div class="form-group">
                  <label>Descripción</label>
                  <textarea 
                    v-model="servicio.descripcion" 
                    class="form-control"
                    rows="2"
                    placeholder="Describa el servicio prestado"
                  ></textarea>
                </div>
                
                <div class="form-group">
                  <label>Fecha</label>
                  <input 
                    type="date" 
                    v-model="servicio.fecha" 
                    class="form-control"
                  >
                </div>
              </div>
              
              <button 
                @click="agregarServicio(index)" 
                class="btn btn-secondary btn-sm"
                type="button"
              >
                Agregar Servicio
              </button>
            </div>
          </div>
        </div>
        
        <button 
          @click="agregarEmpresa" 
          class="btn btn-secondary"
          type="button"
        >
          Agregar Empresa
        </button>
      </div>
    </div>

    <div class="form-group">
      <label>Emprendedores Atendidos</label>
      <div class="emprendedores">
        <div v-for="(emprendedor, index) in datos.emprendedores" :key="index" class="emprendedor-item">
          <div class="emprendedor-header">
            <h4>Emprendedor {{ index + 1 }}</h4>
            <button 
              @click="eliminarEmprendedor(index)" 
              class="btn btn-danger"
              type="button"
              v-if="datos.emprendedores.length > 1"
            >
              Eliminar
            </button>
          </div>
          
          <div class="form-group">
            <label>Nombre del Emprendedor</label>
            <input 
              type="text" 
              v-model="emprendedor.nombre" 
              class="form-control"
              placeholder="Nombre del emprendedor"
            >
          </div>
          
          <div class="form-group">
            <label>Sector</label>
            <select v-model="emprendedor.sector" class="form-control">
              <option value="">Seleccione un sector</option>
              <option value="industrial">Industrial</option>
              <option value="servicios">Servicios</option>
              <option value="comercio">Comercio</option>
              <option value="tecnologia">Tecnología</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Estado del Proyecto</label>
            <select v-model="emprendedor.estado" class="form-control">
              <option value="">Seleccione un estado</option>
              <option value="idea">Idea</option>
              <option value="planificacion">Planificación</option>
              <option value="inicio">Inicio</option>
              <option value="consolidacion">Consolidación</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Servicios Prestados</label>
            <div class="servicios">
              <div v-for="(servicio, sIndex) in emprendedor.servicios" :key="sIndex" class="servicio-item">
                <div class="servicio-header">
                  <h5>Servicio {{ sIndex + 1 }}</h5>
                  <button 
                    @click="eliminarServicioEmprendedor(index, sIndex)" 
                    class="btn btn-danger btn-sm"
                    type="button"
                    v-if="emprendedor.servicios.length > 1"
                  >
                    Eliminar
                  </button>
                </div>
                
                <div class="form-group">
                  <label>Tipo de Servicio</label>
                  <select v-model="servicio.tipo" class="form-control">
                    <option value="">Seleccione un tipo</option>
                    <option value="asesoramiento">Asesoramiento</option>
                    <option value="financiacion">Financiación</option>
                    <option value="formacion">Formación</option>
                    <option value="networking">Networking</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                
                <div class="form-group">
                  <label>Descripción</label>
                  <textarea 
                    v-model="servicio.descripcion" 
                    class="form-control"
                    rows="2"
                    placeholder="Describa el servicio prestado"
                  ></textarea>
                </div>
                
                <div class="form-group">
                  <label>Fecha</label>
                  <input 
                    type="date" 
                    v-model="servicio.fecha" 
                    class="form-control"
                  >
                </div>
              </div>
              
              <button 
                @click="agregarServicioEmprendedor(index)" 
                class="btn btn-secondary btn-sm"
                type="button"
              >
                Agregar Servicio
              </button>
            </div>
          </div>
        </div>
        
        <button 
          @click="agregarEmprendedor" 
          class="btn btn-secondary"
          type="button"
        >
          Agregar Emprendedor
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
if (!datos.value.empresas) {
  datos.value.empresas = [{
    nombre: '',
    sector: '',
    tamano: '',
    servicios: [{
      tipo: '',
      descripcion: '',
      fecha: ''
    }]
  }];
}

if (!datos.value.emprendedores) {
  datos.value.emprendedores = [{
    nombre: '',
    sector: '',
    estado: '',
    servicios: [{
      tipo: '',
      descripcion: '',
      fecha: ''
    }]
  }];
}

const agregarEmpresa = () => {
  datos.value.empresas.push({
    nombre: '',
    sector: '',
    tamano: '',
    servicios: [{
      tipo: '',
      descripcion: '',
      fecha: ''
    }]
  });
};

const eliminarEmpresa = (index) => {
  if (datos.value.empresas.length > 1) {
    datos.value.empresas.splice(index, 1);
  }
};

const agregarServicio = (empresaIndex) => {
  datos.value.empresas[empresaIndex].servicios.push({
    tipo: '',
    descripcion: '',
    fecha: ''
  });
};

const eliminarServicio = (empresaIndex, servicioIndex) => {
  if (datos.value.empresas[empresaIndex].servicios.length > 1) {
    datos.value.empresas[empresaIndex].servicios.splice(servicioIndex, 1);
  }
};

const agregarEmprendedor = () => {
  datos.value.emprendedores.push({
    nombre: '',
    sector: '',
    estado: '',
    servicios: [{
      tipo: '',
      descripcion: '',
      fecha: ''
    }]
  });
};

const eliminarEmprendedor = (index) => {
  if (datos.value.emprendedores.length > 1) {
    datos.value.emprendedores.splice(index, 1);
  }
};

const agregarServicioEmprendedor = (emprendedorIndex) => {
  datos.value.emprendedores[emprendedorIndex].servicios.push({
    tipo: '',
    descripcion: '',
    fecha: ''
  });
};

const eliminarServicioEmprendedor = (emprendedorIndex, servicioIndex) => {
  if (datos.value.emprendedores[emprendedorIndex].servicios.length > 1) {
    datos.value.emprendedores[emprendedorIndex].servicios.splice(servicioIndex, 1);
  }
};

const esValido = computed(() => {
  return datos.value.empresas.every(empresa => 
    empresa.nombre && 
    empresa.sector && 
    empresa.tamano &&
    empresa.servicios.every(servicio => 
      servicio.tipo && 
      servicio.descripcion && 
      servicio.fecha
    )
  ) &&
  datos.value.emprendedores.every(emprendedor => 
    emprendedor.nombre && 
    emprendedor.sector && 
    emprendedor.estado &&
    emprendedor.servicios.every(servicio => 
      servicio.tipo && 
      servicio.descripcion && 
      servicio.fecha
    )
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

.empresa-item,
.emprendedor-item {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.empresa-header,
.emprendedor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.empresa-header h4,
.emprendedor-header h4 {
  margin: 0;
  color: #004698;
  font-size: 1.2rem;
}

.servicio-item {
  background: white;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.servicio-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.servicio-header h5 {
  margin: 0;
  color: #004698;
  font-size: 1rem;
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

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
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