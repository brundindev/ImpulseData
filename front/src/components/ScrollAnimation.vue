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
  // Permitir scroll inmediato antes de inicializar las animaciones
  document.body.style.overflowY = 'auto';
  document.documentElement.style.overflowY = 'auto';
  
  // Asegurarnos que el usuario pueda interactuar con la página inmediatamente
  animatedElements.forEach(selector => {
    document.querySelectorAll(selector).forEach(element => {
      element.style.visibility = 'visible';
      element.style.pointerEvents = 'auto';
    });
  });
  
  // Esperar un momento antes de inicializar para evitar problemas con el scroll
  setTimeout(() => {
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

    // Aplicamos las clases fade-up-element a todos los elementos que queremos animar
    animatedElements.forEach(selector => {
      document.querySelectorAll(selector).forEach((element, index) => {
        // Añadir la clase base de animación pero mantener la visibilidad
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
  }, 300); // Aumentamos el retraso para asegurar que los elementos estén renderizados
});

onUnmounted(() => {
  // Limpiar el observador cuando el componente se desmonta
  if (observer) {
    observer.disconnect();
  }
});
</script>

<style>
/* Estilos para las animaciones de entrada */
.fade-up-element {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
  will-change: opacity, transform;
  pointer-events: auto !important; /* Permite interacción con el elemento aunque esté invisible */
  visibility: visible !important; /* Mantiene visibilidad para interacción */
}

.fade-up-element.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Retardos para escalonar las animaciones */
.fade-delay-1 { transition-delay: 0.1s; }
.fade-delay-2 { transition-delay: 0.2s; }
.fade-delay-3 { transition-delay: 0.3s; }
.fade-delay-4 { transition-delay: 0.4s; }
.fade-delay-5 { transition-delay: 0.5s; }
</style> 