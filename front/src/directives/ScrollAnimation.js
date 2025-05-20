// Directiva personalizada para animaciones activadas por scroll
export default {
  install(app) {
    app.directive('scroll-animate', {
      mounted(el, binding) {
        // Opciones para el Intersection Observer - modificadas para mejorar rendimiento
        const options = {
          root: null, // viewport
          rootMargin: '0px',
          threshold: 0.05 // Se activará cuando solo el 5% del elemento sea visible (más rápido)
        };
        
        // Clase CSS que se añadirá cuando el elemento sea visible
        const animationClass = binding.value || 'animate-in';
        
        // Delay opcional (limitado para evitar bloqueos)
        const delay = binding.arg ? Math.min(parseInt(binding.arg), 300) : 0;
        
        // Por defecto, los elementos comienzan invisibles pero con opacidad no tan baja
        // Evitamos que los elementos inicialmente invisibles bloqueen el scroll
        el.classList.add('scroll-animate-hidden');
        el.style.visibility = 'visible'; // Aseguramos que sea visible para interacción
        el.style.pointerEvents = 'auto'; // Permitimos interacción con el elemento
        
        // Función callback para cuando el elemento es visible
        const onIntersect = (entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              // Agregar clase inmediatamente para evitar bloqueos en scroll rápido
              if (delay && delay > 0) {
                setTimeout(() => {
                  el.classList.add(animationClass);
                }, delay);
              } else {
                el.classList.add(animationClass);
              }
              // Ya no necesitamos observar este elemento
              observer.unobserve(el);
            }
          });
        };
        
        // Crear el observer con opciones de rendimiento mejoradas
        const observer = new IntersectionObserver(onIntersect, options);
        
        // Comenzar a observar el elemento
        observer.observe(el);
      }
    });
  }
} 