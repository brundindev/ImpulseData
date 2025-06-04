<template>
  <div class="stats-section">
    <div class="stat-card" v-scroll-animate:100="'animate-in'">
      <h3>Empresas</h3>
      <div class="stat-value"><AnimatedNumber :number="empresasCount" /></div>
    </div>
    <div class="stat-card" v-scroll-animate:200="'animate-in'">
      <h3>Departamentos</h3>
      <div class="stat-value"><AnimatedNumber :number="departamentosCount" /></div>
    </div>
    <div class="stat-card" v-scroll-animate:300="'animate-in'">
      <h3>Centros</h3>
      <div class="stat-value"><AnimatedNumber :number="centrosCount" /></div>
    </div>
    <div class="stat-card" v-scroll-animate:400="'animate-in'">
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

<style src="../home/css/StatsPanel.css">

</style> 
