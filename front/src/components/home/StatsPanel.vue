<template>
  <div class="stats-section">
    <div class="stat-card">
      <h3>Empresas</h3>
      <div class="stat-value"><AnimatedNumber :number="empresasCount" /></div>
    </div>
    <div class="stat-card">
      <h3>Departamentos</h3>
      <div class="stat-value"><AnimatedNumber :number="departamentosCount" /></div>
    </div>
    <div class="stat-card">
      <h3>Centros</h3>
      <div class="stat-value"><AnimatedNumber :number="centrosCount" /></div>
    </div>
    <div class="stat-card">
      <h3>Formaciones</h3>
      <div class="stat-value"><AnimatedNumber :number="formacionesCount" /></div>
    </div>
  </div>
</template>

<script setup>
import AnimatedNumber from '../AnimatedNumber.vue';

defineProps({
  empresasCount: {
    type: Number,
    default: 0
  },
  departamentosCount: {
    type: Number,
    default: 0
  },
  centrosCount: {
    type: Number,
    default: 0
  },
  formacionesCount: {
    type: Number,
    default: 0
  }
});
</script>

<style>
.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.stat-card {
  background-color: var(--card-background);
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: var(--shadow);
  text-align: center;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-card h3 {
  color: white;
  margin-bottom: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

@media (max-width: 768px) {
  .stats-section {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .stats-section {
    grid-template-columns: 1fr;
  }
}
</style> 