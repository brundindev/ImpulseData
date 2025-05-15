// Directiva personalizada para animaciones activadas por scroll
export default {
  install(app) {
    app.directive('scroll-animate', {
      mounted(el, binding) {
        // Opciones para el Intersection Observer
        const options = {
          root: null, // viewport
          rootMargin: '0px',
          threshold: 0.2 // Se activará cuando al menos el 20% del elemento sea visible
        };
        
        // Clase CSS que se añadirá cuando el elemento sea visible
        const animationClass = binding.value || 'animate-in';
        
        // Delay opcional
        const delay = binding.arg ? parseInt(binding.arg) : 0;
        
        // Por defecto, los elementos comienzan invisibles
        el.classList.add('scroll-animate-hidden');
        
        // Función callback para cuando el elemento es visible
        const onIntersect = (entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              // Si se especificó un delay, aplicarlo
              if (delay) {
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
        
        // Crear el observer
        const observer = new IntersectionObserver(onIntersect, options);
        
        // Comenzar a observar el elemento
        observer.observe(el);
      }
    });
  }
} 