<template>
  <!-- Este es un componente sin renderizado, solo maneja la lógica de animaciones al hacer scroll -->
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// Lista de selectores de elementos a los que queremos aplicar la animación
const animatedElements = [
  '.dashboard-header', 
  '.alicante-banner-showcase',
  '.stats-section',
  '.stat-card',
  '.forms-section h2',
  '.form-card',
  '.app-footer',
  '.footer-column',
  '.footer-bottom'
];

// Observador de intersección para detectar cuando los elementos son visibles
let observer = null;

onMounted(() => {
  // Configurar el observador con un margen para que la animación comience un poco antes
  const options = {
    root: null, // viewport
    rootMargin: '0px 0px -100px 0px', // cuando el elemento está a 100px de entrar en el viewport
    threshold: 0.1 // 10% del elemento visible
  };

  // Crear el observador
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Si el elemento es visible, añadir la clase para mostrar
        entry.target.classList.add('visible');
        // Dejar de observar este elemento una vez que ya se ha mostrado
        observer.unobserve(entry.target);
      }
    });
  }, options);

  // Primero aplicamos las clases fade-up-element a todos los elementos
  setTimeout(() => {
    animatedElements.forEach(selector => {
      document.querySelectorAll(selector).forEach((element, index) => {
        // Añadir la clase base de animación
        element.classList.add('fade-up-element');
        
        // Añadir retardos diferentes según el tipo y posición
        if (selector === '.stat-card' || selector === '.form-card' || selector === '.footer-column') {
          element.classList.add(`fade-delay-${(index % 5) + 1}`);
        }
        
        // Observar el elemento
        observer.observe(element);
      });
    });
    
    // Observar elementos específicos adicionales con selectores más complejos
    document.querySelectorAll('.forms-list > div').forEach((element, index) => {
      element.classList.add('fade-up-element');
      element.classList.add(`fade-delay-${(index % 5) + 1}`);
      observer.observe(element);
    });
  }, 100);
});

onUnmounted(() => {
  // Limpiar el observador cuando el componente se desmonta
  if (observer) {
    observer.disconnect();
  }
});
</script> 