<template>
  <div class="form-step">
    <h3>ALIA - Oficina de Atracción de Inversiones</h3>
    <p class="subtitulo">
      Oficina de atracción de inversiones impulsada por la Agencia Local de Desarrollo. Servicio municipal de diplomacia económica para la búsqueda y captación de inversiones nacionales e internacionales, tanto de potenciales nuevos inversores, como de empresas que ya operen en España o en territorio alicantino.
    </p>

      <!-- Formulario de entrada de datos -->
    <section class="bloque">
      <h4>Resultados del año</h4>
      <div class="fila">
        <div class="campo">
          <label>Proyectos de inversión</label>
          <input type="number" v-model="datos.nProyectos" class="form-control" min="0" placeholder="Nº proyectos de inversión">
        </div>
        <div class="campo">
          <label>Empleos a medio plazo</label>
          <input type="number" v-model="datos.nEmpleos" class="form-control" min="0" placeholder="Nº empleos a medio plazo">
        </div>
        <div class="campo">
          <label>Empleos directos</label>
          <input type="number" v-model="datos.nEmpleosDirectos" class="form-control" min="0" placeholder="Nº empleos directos">
        </div>
        <div class="campo">
          <label>Millones de euros en inversión potencial</label>
          <input type="number" v-model="datos.inversionPotencial" class="form-control" min="0" step="0.01" placeholder="Nº millones de euros en inversión potencial">
        </div>
      </div>
    </section>

    <!-- Informes de inteligencia económica -->
    <section class="bloque">
      <h4>Informes de inteligencia económica</h4>
      <div class="fila">
        <div class="campo">
          <label>Notas dinámicas mensuales</label>
          <input type="number" v-model="datos.notasDinamicas" class="form-control" min="0" placeholder="Nº notas dinámicas mensuales">
        </div>
        <div class="campo">
          <label>Informe Bimensual</label>
          <input type="number" v-model="datos.informeBimensual" class="form-control" min="0" placeholder="Nº informe bimensual">
        </div>
        <div class="campo">
          <label>Radar de inversiones</label>
          <input type="number" v-model="datos.radarInversiones" class="form-control" min="0" placeholder="Nº radar de inversiones">
        </div>
      </div>
    </section>

    <!-- Participación en eventos empresariales -->
    <section class="bloque">
      <h4>Participación en eventos empresariales</h4>
      <div v-for="(participacion, index) in datos.participacion" :key="index" class="evento">
        <div class="fila">
          <div class="campo">
            <label>Nombre del evento</label>
            <input type="text" v-model="participacion.nombreEvento" class="form-control" placeholder="Nombre del evento">
          </div>
          <div class="campo">
            <label>Fechas</label>
            <input type="text" v-model="participacion.fechas" class="form-control" placeholder="Fechas">
          </div>
          <button @click="eliminarParticipacion(index)" class="btn btn-danger" v-if="datos.participacion && datos.participacion.length > 1">Eliminar</button>
        </div>
      </div>
      <button @click="agregarParticipacion" class="btn btn-secondary" type="button">Agregar evento</button>
    </section>

    <!-- Actividades de dinamización y focus group -->
    <section class="bloque">
      <h4>Actividades de dinamización y focus group</h4>
      <input type="number" v-model="datos.actividades" class="form-control" min="0" placeholder="Nº actividades">
    </section>


      <!-- Vista previa visual -->
      <section class="bloque vista-previa">
      <h4>Vista Previa</h4>
      <div class="alia-card">
        <div class="alia-header">
          <div class="numero-seccion">4.4</div>
          <div class="titulo-seccion">
            <h5>ALIA</h5>
            <h6>OFICINA DE ATRACCIÓN DE INVERSIONES</h6>
          </div>
        </div>
        
        <p class="descripcion-card">
          ALIA – Alicante Investment Agency es la oficina de atracción de inversiones impulsada por la Agencia Local de Desarrollo. Un servicio municipal de diplomacia económica para la búsqueda y captación de inversiones nacionales e internacionales, tanto de potenciales nuevos inversores, como de empresas que ya operen en España o en territorio alicantino, y que contemplen posibles reinversiones o ampliación de su actividad.
        </p>

        <div class="resultados-section">
          <h5>Resultados del año:</h5>
          <h6>Empresas atendidas:</h6>
          
          <div class="metricas-grid">
            <div class="metrica">
              <div class="metrica-numero">{{ datos.nProyectos || 0 }}</div>
              <div class="metrica-label">proyectos de inversión</div>
            </div>
            <div class="metrica">
              <div class="metrica-numero">{{ formatearNumero(datos.nEmpleos) || '0' }}</div>
              <div class="metrica-label">empleos a medio plazo</div>
            </div>
            <div class="metrica">
              <div class="metrica-numero">{{ datos.nEmpleosDirectos || 0 }}</div>
              <div class="metrica-label">empleos directos</div>
            </div>
            <div class="metrica">
              <div class="metrica-numero">{{ datos.inversionPotencial || 0 }}</div>
              <div class="metrica-label">millones de euros en inversión potencial</div>
            </div>
          </div>
        </div>

        <div class="informes-section">
          <h6>Informes de inteligencia económica:</h6>
          <div class="informes-grid">
            <div class="informe-item">
              <div class="informe-numero">{{ datos.notasDinamicas || 0 }}</div>
              <div class="informe-label">Notas dinámicas mensuales</div>
            </div>
            <div class="informe-item">
              <div class="informe-numero">{{ datos.informeBimensual || 0 }}</div>
              <div class="informe-label">Informe Bimensual</div>
            </div>
            <div class="informe-item">
              <div class="informe-numero">{{ datos.radarInversiones || 0 }}</div>
              <div class="informe-label">Radar de inversiones</div>
            </div>
          </div>
        </div>

        <div class="eventos-section">
          <div class="eventos-header">
            <div class="eventos-box">
              <h6>Participación en eventos empresariales</h6>
              <div class="eventos-numero">{{ datos.participacion ? datos.participacion.length : 0 }}</div>
            </div>
          </div>
          
          <div class="eventos-lista" v-if="datos.participacion && datos.participacion.length > 0">
            <div v-for="(evento, index) in datos.participacion" :key="index" class="evento-item">
              <strong style="color: #CA425C">{{ evento.fechas || 'Sin fecha' }}:</strong> {{ evento.nombreEvento || 'Sin nombre' }}
            </div>
          </div>
          <div v-else class="eventos-vacia">
            No hay eventos registrados
          </div>
        </div>

        <div class="actividades-section">
          <span class="actividades-label">Actividades de dinamización y focus group durante 2023:</span>
          <span class="actividades-numero">{{ datos.actividades || 0 }}</span>
        </div>
      </div>
    </section>



    <!-- Botón para ver resumen -->
    <div class="form-actions">
      <button @click="$emit('anterior')" class="btn btn-secondary" type="button">Anterior</button>
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

const formatearNumero = (numero) => {
  if (!numero) return '0';
  return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const agregarParticipacion = () => {
  if (!datos.value.participacion) datos.value.participacion = [];
  datos.value.participacion.push({
    nombreEvento: '',
    fechas: '',
  });
};

const eliminarParticipacion = (index) => {
  if (datos.value.participacion && datos.value.participacion.length > 1) {
    datos.value.participacion.splice(index, 1);
  }
};

const esValido = computed(() => {
  return (
    datos.value.nProyectos !== undefined &&
    datos.value.nEmpleos !== undefined &&
    datos.value.nEmpleosDirectos !== undefined &&
    datos.value.inversionPotencial !== undefined &&
    datos.value.notasDinamicas !== undefined &&
    datos.value.informeBimensual !== undefined &&
    datos.value.radarInversiones !== undefined &&
    datos.value.actividades !== undefined &&
    Array.isArray(datos.value.participacion) &&
    datos.value.participacion.length > 0 &&
    datos.value.participacion.every(
      p => p.nombreEvento && p.fechas
    )
  );
});
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


.subtitulo {
  color: #6c757d;
  font-size: 1rem;
  margin-bottom: 2rem;
}

.bloque {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.bloque h4 {
  color: #b71c50;
  margin-bottom: 1rem;
}

.vista-previa {
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 1.5rem;
  background: #f8f9fa;
}

/* Estilos para la vista previa tipo tarjeta */
.alia-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.alia-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #b71c50;
}

.btn-secondary{
  background: #c26685b2;
}

.numero-seccion {
  background: #b71c50;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  margin-right: 1rem;
}

.titulo-seccion h5 {
  color: #b71c50;
  font-size: 1.8rem;
  font-weight: bold;
  margin: 0;
  line-height: 1;
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
  color:black;
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
</style>