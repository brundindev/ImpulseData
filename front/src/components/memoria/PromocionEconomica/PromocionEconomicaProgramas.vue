<template>
  <div class="form-step">
    <h3>DATOS TOTALES</h3>

    <!-- EMPRENDIMIENTO -->
    <div class="form-section">
      <h4>EMPRENDIMIENTO</h4>
      <div class="section-content">
        <div class="main-box">
          <label>Asesoramientos mentorizaciones</label>
          <input
            type="number"
            v-model="datos.emprendimiento.asesoramientosMentorizaciones"
            class="form-control main-number"
            min="0"
          >
        </div>
        <div class="side-boxes">
          <div class="side-box">
            <i class="icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M19 20H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v10a1 0 0 1-1 1ZM5 8V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3h8V5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3H6a1 1 0 0 0-1 1v10Zm7.25 5.75a.75.75 0 0 0-1.5 0v2.5a.75.75 0 0 0 1.5 0v-2.5Z"></path></svg></i>
            <input
              type="number"
              v-model="datos.emprendimiento.empresasCreadas"
              class="form-control small-number"
              min="0"
            >
            <span>Empresas creadas</span>
          </div>
          <div class="side-box">
            <i class="icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M12 2A10 10 0 1 0 12 22A10 10 0 1 0 12 2ZM9 12a3 3 0 1 1 6 0a3 3 0 1 1-6 0ZM12 19.75a7.92 7.92 0 0 1-5.5-2.42a6.67 6.67 0 0 1 11 0a7.92 7.92 0 0 1-5.5 2.42Z"></path></svg></i>
            <input
              type="number"
              v-model="datos.emprendimiento.empleosCreados"
              class="form-control small-number"
              min="0"
            >
            <span>Empleos creados</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ACTUACIONES -->
    <div class="form-section">
      <h4>ACTUACIONES</h4>
      <div class="section-content">
        <div class="main-box">
          <label>Asesoramientos realizados</label>
          <input
            type="number"
            v-model="datos.actuaciones.asesoramientosRealizados"
            class="form-control main-number"
            min="0"
          >
        </div>
        <div class="side-boxes">
          <div class="side-box">
            <i class="icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M19 20H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v10a1 0 0 1-1 1ZM5 8V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3h8V5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3H6a1 1 0 0 0-1 1v10Zm7.25 5.75a.75.75 0 0 0-1.5 0v2.5a.75.75 0 0 0 1.5 0v-2.5Z"></path></svg></i>
            <input
              type="number"
              v-model="datos.actuaciones.puntoPae.regAutonomos"
              class="form-control small-number"
              min="0"
            >
            <span>Rég. Autónomos</span>
          </div>
          <div class="side-box">
            <i class="icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M19 20H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v10a1 0 0 1-1 1ZM5 8V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3h8V5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3H6a1 1 0 0 0-1 1v10Zm7.25 5.75a.75.75 0 0 0-1.5 0v2.5a.75.75 0 0 0 1.5 0v-2.5Z"></path></svg></i>
            <input
              type="number"
              v-model="datos.actuaciones.puntoPae.sociedades"
              class="form-control small-number"
              min="0"
            >
            <span>Sociedades</span>
          </div>
          <div class="side-box">
            <i class="icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M19 20H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v10a1 0 0 1-1 1ZM5 8V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3h8V5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3H6a1 1 0 0 0-1 1v10Zm7.25 5.75a.75.75 0 0 0-1.5 0v2.5a.75.75 0 0 0 1.5 0v-2.5Z"></path></svg></i>
            <input
              type="number"
              v-model="datos.actuaciones.puntoPae.bajasAutonomos"
              class="form-control small-number"
              min="0"
            >
            <span>Bajas Autónomos</span>
          </div>
        </div>

        <h5>Financiación (Microcréditos Microbank)</h5>
        <div class="section-content">
          <div class="main-box">
            <label>Créditos tramitados</label>
            <input
              type="number"
              v-model="datos.actuaciones.financiacion.creditosTramitados"
              class="form-control main-number"
              min="0"
            >
          </div>
          <div class="side-boxes">
            <div class="side-box">
              <i class="icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M19 20H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v10a1 0 0 1-1 1ZM5 8V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3h8V5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3H6a1 1 0 0 0-1 1v10Zm7.25 5.75a.75.75 0 0 0-1.5 0v2.5a.75.75 0 0 0 1.5 0v-2.5Z"></path></svg></i>
              <input
                type="number"
                v-model="datos.actuaciones.financiacion.creditosConcedidos"
                class="form-control small-number"
                min="0"
              >
              <span>Créditos concedidos</span>
            </div>
            <div class="side-box">
              <i class="icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M19 20H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v10a1 0 0 1-1 1ZM5 8V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3h8V5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3H6a1 1 0 0 0-1 1v10Zm7.25 5.75a.75.75 0 0 0-1.5 0v2.5a.75.75 0 0 0 1.5 0v-2.5Z"></path></svg></i>
              <input
                type="number"
                v-model="datos.actuaciones.financiacion.importeConcedido"
                class="form-control small-number"
                min="0"
                step="0.01"
              >
              <span>Importe concedido</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- FORMACIÓN -->
    <div class="form-section">
      <h4>FORMACIÓN</h4>
      <div class="section-content">
        <div class="main-box">
          <label>Acciones formativas</label>
          <input
            type="number"
            v-model="datos.formacion.accionesFormativas"
            class="form-control main-number"
            min="0"
          >
        </div>
        <div class="side-boxes">
          <div class="side-box">
            <i class="icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M19 20H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v10a1 0 0 1-1 1ZM5 8V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3h8V5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3H6a1 1 0 0 0-1 1v10Zm7.25 5.75a.75.75 0 0 0-1.5 0v2.5a.75.75 0 0 0 1.5 0v-2.5Z"></path></svg></i>
            <input
              type="number"
              v-model="datos.formacion.horas"
              class="form-control small-number"
              min="0"
            >
            <span>Horas</span>
          </div>
          <div class="side-box">
            <i class="icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M19 20H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v10a1 0 0 1-1 1ZM5 8V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3h8V5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3H6a1 1 0 0 0-1 1v10Zm7.25 5.75a.75.75 0 0 0-1.5 0v2.5a.75.75 0 0 0 1.5 0v-2.5Z"></path></svg></i>
            <input
              type="number"
              v-model="datos.formacion.participantes"
              class="form-control small-number"
              min="0"
            >
            <span>Participantes</span>
          </div>
        </div>
      </div>
    </div>

    <!-- AYUDAS A EMPRESAS -->
    <div class="form-section">
      <h4>AYUDAS A EMPRESAS</h4>
      <div class="section-content">
        <div class="main-box">
          <label>Importe concedido</label>
          <input
            type="number"
            v-model="datos.ayudasEmpresas.importeConcedido"
            class="form-control main-number"
            min="0"
            step="0.01"
          >
        </div>
        <div class="side-boxes">
          <div class="side-box">
            <i class="icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M19 20H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v10a1 0 0 1-1 1ZM5 8V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3h8V5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3H6a1 1 0 0 0-1 1v10Zm7.25 5.75a.75.75 0 0 0-1.5 0v2.5a.75.75 0 0 0 1.5 0v-2.5Z"></path></svg></i>
            <input
              type="number"
              v-model="datos.ayudasEmpresas.solicitudes"
              class="form-control small-number"
              min="0"
            >
            <span>Solicitudes</span>
          </div>
          <div class="side-box">
            <i class="icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M19 20H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v10a1 0 0 1-1 1ZM5 8V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3h8V5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3H6a1 1 0 0 0-1 1v10Zm7.25 5.75a.75.75 0 0 0-1.5 0v2.5a.75.75 0 0 0 1.5 0v-2.5Z"></path></svg></i>
            <input
              type="number"
              v-model="datos.ayudasEmpresas.empresasBeneficiarias"
              class="form-control small-number"
              min="0"
            >
            <span>Empresas beneficiarias</span>
          </div>
        </div>
      </div>
    </div>

    <!-- VIVEROS -->
    <div class="form-section">
      <h4>VIVEROS</h4>
      <div class="section-content">
        <div class="main-box">
          <label>Espacios disponibles</label>
          <input
            type="number"
            v-model="datos.viveros.espaciosDisponibles"
            class="form-control main-number"
            min="0"
          >
        </div>
        <div class="side-boxes">
          <div class="side-box">
            <i class="icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M19 20H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v10a1 0 0 1-1 1ZM5 8V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3h8V5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3H6a1 1 0 0 0-1 1v10Zm7.25 5.75a.75.75 0 0 0-1.5 0v2.5a.75.75 0 0 0 1.5 0v-2.5Z"></path></svg></i>
            <input
              type="number"
              v-model="datos.viveros.ocupacionViveroEmprende"
              class="form-control small-number"
              min="0"
              max="100"
              step="0.1"
            >
            <span>Vivero Emprende (%)</span>
          </div>
          <div class="side-box">
            <i class="icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M19 20H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v10a1 0 0 1-1 1ZM5 8V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3h8V5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3H6a1 1 0 0 0-1 1v10Zm7.25 5.75a.75.75 0 0 0-1.5 0v2.5a.75.75 0 0 0 1.5 0v-2.5Z"></path></svg></i>
            <input
              type="number"
              v-model="datos.viveros.ocupacionViveroLanzadera"
              class="form-control small-number"
              min="0"
              max="100"
              step="0.1"
            >
            <span>V.Lanzadera Príncipe Felipe (%)</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Imagen -->
    <div class="form-group center-image-upload">
      <label>Foto</label>
      <img
        :src="datos.imageUrl || '/placeholder-image.png'"
        alt="Imagen de promoción económica"
        class="image-placeholder clickable-image"
        @click="openCloudinaryModal"
        style="width: 100%; max-height: 250px; object-fit: cover; cursor: pointer; border: 1px dashed #ccc; border-radius: 8px;"
      />
      <p class="image-upload-hint">Haz clic en la imagen para subir o cambiar la foto.</p>
    </div>

    <div class="form-actions">
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
        title="Seleccionar imagen para Promoción Económica"
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

const emit = defineEmits(['update:modelValue', 'siguiente']);

const datos = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// Inicializar datos si no existen
if (!datos.value.emprendimiento) {
  datos.value.emprendimiento = {
    asesoramientosMentorizaciones: 0,
    empresasCreadas: 0,
    empleosCreados: 0,
  };
}

if (!datos.value.actuaciones) {
  datos.value.actuaciones = {
    asesoramientosRealizados: 0,
    puntoPae: { regAutonomos: 0, sociedades: 0, bajasAutonomos: 0 },
    financiacion: { creditosTramitados: 0, creditosConcedidos: 0, importeConcedido: 0 },
  };
}

if (!datos.value.formacion) {
  datos.value.formacion = {
    accionesFormativas: 0,
    horas: 0,
    participantes: 0,
  };
}

if (!datos.value.ayudasEmpresas) {
  datos.value.ayudasEmpresas = {
    importeConcedido: 0,
    solicitudes: 0,
    empresasBeneficiarias: 0,
  };
}

if (!datos.value.viveros) {
  datos.value.viveros = {
    espaciosDisponibles: 0,
    ocupacionViveroEmprende: 0,
    ocupacionViveroLanzadera: 0,
  };
}

if (!datos.value.imageUrl) datos.value.imageUrl = '';

// Estado del modal de imágenes
const showImageModal = ref(false);

// Método para abrir el modal de imágenes
const openCloudinaryModal = () => {
  showImageModal.value = true;
};

// Método para cerrar el modal
const closeImageModal = () => {
  showImageModal.value = false;
};

// Método para manejar la selección de una imagen
const handleImageSelect = (selectedImage) => {
  datos.value.imageUrl = selectedImage.url;
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

const esValido = computed(() => {
  // Simple validación para asegurar que los campos numéricos no sean negativos
  const emprendimientoValido = datos.value.emprendimiento.asesoramientosMentorizaciones >= 0 &&
                               datos.value.emprendimiento.empresasCreadas >= 0 &&
                               datos.value.emprendimiento.empleosCreados >= 0;

  const actuacionesValido = datos.value.actuaciones.asesoramientosRealizados >= 0 &&
                            datos.value.actuaciones.puntoPae.regAutonomos >= 0 &&
                            datos.value.actuaciones.puntoPae.sociedades >= 0 &&
                            datos.value.actuaciones.puntoPae.bajasAutonomos >= 0 &&
                            datos.value.actuaciones.financiacion.creditosTramitados >= 0 &&
                            datos.value.actuaciones.financiacion.creditosConcedidos >= 0 &&
                            datos.value.actuaciones.financiacion.importeConcedido >= 0;

  const formacionValido = datos.value.formacion.accionesFormativas >= 0 &&
                          datos.value.formacion.horas >= 0 &&
                          datos.value.formacion.participantes >= 0;

  const ayudasEmpresasValido = datos.value.ayudasEmpresas.importeConcedido >= 0 &&
                               datos.value.ayudasEmpresas.solicitudes >= 0 &&
                               datos.value.ayudasEmpresas.empresasBeneficiarias >= 0;

  const viverosValido = datos.value.viveros.espaciosDisponibles >= 0 &&
                        datos.value.viveros.ocupacionViveroEmprende >= 0 && datos.value.viveros.ocupacionViveroEmprende <= 100 &&
                        datos.value.viveros.ocupacionViveroLanzadera >= 0 && datos.value.viveros.ocupacionViveroLanzadera <= 100;

  return emprendimientoValido && actuacionesValido && formacionValido && ayudasEmpresasValido && viverosValido;
});
</script>

<style scoped>
.form-step {
  max-width: 800px;
  margin: 0 auto;
}

.form-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 5px solid #004698;
}

.form-section h4 {
  margin-top: 0;
  color: #004698;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
}

.form-section h5 {
  color: #004698;
  margin: 1.5rem 0 1rem;
  font-size: 1.1rem;
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
  justify-content: flex-end;
}

.center-image-upload {
  text-align: center;
  margin-bottom: 1.5rem;
}

.image-placeholder {
  display: block;
  margin: 0.5rem auto 0.8rem auto;
  max-width: 100%;
  height: auto;
}

.image-placeholder[src$="/placeholder-image.png"] {
  background-color: #e9ecef;
  color: #6c757d;
  display: flex;
  align-items: center;
  justify-content: center;
  font-style: italic;
  min-height: 150px;
  object-fit: contain;
}

.image-upload-hint {
  font-size: 0.875rem;
  color: #6c757d;
  margin-top: 0.5rem;
}

.clickable-image {
  cursor: pointer;
  transition: all 0.3s ease;
}

.clickable-image:hover {
  border-color: #004698;
  box-shadow: 0 0 10px rgba(0, 70, 152, 0.2);
  transform: scale(1.02);
}

/* Nuevos estilos para el layout de cajas */
.section-content {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap; /* Permite que las cajas se envuelvan en pantallas pequeñas */
}

.main-box {
  flex: 1; /* Ocupa el espacio disponible */
  min-width: 180px; /* Ancho mínimo para evitar que se vuelvan demasiado estrechas */
  background-color: #f0803b; /* Color naranja */
  color: white;
  padding: 1.5rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.main-box label {
  color: white;
  margin-bottom: 0.5rem;
}

.main-number {
  font-size: 2rem;
  font-weight: bold;
  color: white;
  background: none;
  border: none;
  padding: 0;
  margin-top: 0.5rem;
  /* Estilo para el placeholder */
  color: rgba(255, 255, 255, 0.8); /* Un blanco ligeramente transparente para el placeholder */
}

.main-number::placeholder {
   color: rgba(255, 255, 255, 0.8);
}

.side-boxes {
  flex: 2; /* Ocupa más espacio que la caja principal */
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); /* Columnas flexibles */
  gap: 1rem;
}

.side-box {
  background-color: #fff3e0; /* Color naranja claro */
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.side-box .icon svg {
  width: 24px;
  height: 24px;
  fill: #f0803b; /* Color naranja para los iconos */
  margin-bottom: 0.5rem;
}

.small-number {
  font-size: 1.5rem;
  font-weight: bold;
  color: #f0803b; /* Color naranja para los números */
  background: none;
  border: none;
  padding: 0;
  margin-bottom: 0.5rem;
}

.side-box span {
  font-size: 0.9rem;
  color: #333;
}

/* Estilos específicos para la sección de Actuaciones (más cajas) */
.actuaciones .section-content {
  flex-direction: column; /* Apila la caja principal y las cajas secundarias */
}

.actuaciones .side-boxes {
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); /* Ajuste para más cajas */
}

.actuaciones .side-box {
   background-color: #fff3e0; /* Color naranja claro */
}

/* Estilos específicos para la sección de Formación */
.formacion .main-box {
   background-color: #f0803b; /* Color naranja */
}

.formacion .side-boxes {
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); /* Columnas flexibles */
}

.formacion .side-box {
   background-color: #fff3e0; /* Color naranja claro */
}

/* Estilos específicos para Ayudas a Empresas */
.ayudas-empresas .main-box {
   background-color: #f0803b; /* Color naranja */
}

.ayudas-empresas .side-boxes {
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); /* Columnas flexibles */
}

.ayudas-empresas .side-box {
   background-color: #fff3e0; /* Color naranja claro */
}

/* Estilos específicos para Viveros */
.viveros .main-box {
   background-color: #f0803b; /* Color naranja */
}

.viveros .side-boxes {
  grid-template-columns: repeat(2, 1fr); /* Dos columnas para ocupación */
  align-items: center;
}

.viveros .occupacion-box {
  background-color: #fff3e0; /* Color naranja claro */
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.viveros .occupacion-box h5 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #004698; /* Color azul */
  font-size: 1.1rem;
}

.viveros .occupacion-content {
  display: flex;
  width: 100%;
  gap: 1rem;
  align-items: center;
}

.viveros .vivero-emprende-details {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.viveros .vivero-emprende-details input, .viveros .vivero-emprende-details span {
  margin-bottom: 0.5rem;
}

.viveros .vivero-lanzadera-percentage {
  width: 80px; /* Tamaño del círculo */
  height: 80px;
  border-radius: 50%;
  background-color: #f0803b; /* Color naranja para el círculo */
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: bold;
  text-align: center;
  flex-shrink: 0; /* Evita que se achique */
}

.viveros .vivero-lanzadera-percentage input {
   font-size: 1rem;
   font-weight: bold;
   color: white;
   background: none;
   border: none;
   padding: 0;
   width: 60px; /* Ajustar tamaño del input dentro del círculo */
   text-align: center;
}

.viveros .vivero-lanzadera-percentage input::placeholder {
   color: rgba(255, 255, 255, 0.8);
}

.viveros .vivero-lanzadera-percentage span {
    font-size: 0.8rem;
}

/* Ajustes para campos de importe con € */
.currency-input-group {
  display: flex;
  align-items: center;
}

.currency-input-group .form-control {
  flex: 1;
  padding-right: 5px; /* Espacio antes del símbolo € */
}

.currency-input-group span {
  margin-left: 5px;
  font-size: 1.5rem;
  font-weight: bold;
  color: #f0803b; /* Color naranja */
}

/* Ajuste para los números grandes en las cajas principales */
.main-box .form-control.main-number {
    font-size: 2.5rem; /* Hacer los números más grandes */
}

/* Ajuste para los números en las cajas secundarias */
.side-box .form-control.small-number {
    font-size: 1.2rem; /* Ajustar tamaño de los números pequeños */
}

/* Ajuste para los inputs dentro de las cajas */
.section-content input.form-control {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
}

.viveros .occupacion-box input.form-control {
     margin-top: 0;
     margin-bottom: 0;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .section-content {
    flex-direction: column;
  }
  .side-boxes {
    grid-template-columns: 1fr;
  }
  .viveros .side-boxes {
    grid-template-columns: 1fr;
  }
  .viveros .occupacion-content {
    flex-direction: column;
  }
}
</style> 