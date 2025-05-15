<template>
  <footer class="app-footer" style="position: relative; z-index: 10;">
      <div class="footer-difuminado" style="position: absolute; top: -150px; left: 0; right: 0; height: 150px; background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.3) 40%, rgba(0, 0, 0, 0.6) 70%, rgba(0, 0, 0, 0.85) 100%); z-index: -1; pointer-events: none;"></div>
      <div class="footer-container">
        <div class="footer-column logo-column" v-scroll-animate="'animate-up'">
          <img src="@/assets/img/logo_impulsedata.jpg" alt="ImpulseData Logo" class="footer-logo" />
          <h3>ImpulseData</h3>
          <p>✨ Transformando datos en conocimiento, donde la excelencia se hace realidad.</p>
        </div>
        
        <div class="footer-column links-column" v-scroll-animate:100="'animate-left'">
          <h4>Enlaces</h4>
          <ul>
            <li><a href="/home">Inicio</a></li>
            <li><a href="/perfil">Mi Perfil</a></li>
            <li><a href="/panel-control">Panel de Control</a></li>
          </ul>
        </div>
        
        <div class="footer-column contact-column" v-scroll-animate:200="'animate-up'">
          <h4>Contacto</h4>
          <p><i class="location-icon">📍</i> Plaza del Ayuntamiento, Alicante</p>
          <p><i class="phone-icon">📞</i> +34 965 123 456</p>
          <p><i class="email-icon">✉️</i> info@impulsedata.es</p>
        </div>
        
        <div class="footer-column social-column" v-scroll-animate:300="'animate-right'">
          <h4>Síguenos</h4>
          <div class="social-icons">
            <a href="https://www.facebook.com/impulsedata" target="_blank" class="social-icon" v-scroll-animate:400="'animate-zoom'">
              <svg viewBox="0 0 24 24" class="facebook-icon">
                <path d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z"></path>
              </svg>
            </a>
            <a href="https://twitter.com/impulsedata" target="_blank" class="social-icon" v-scroll-animate:450="'animate-zoom'">
              <svg viewBox="0 0 24 24" class="twitter-icon">
                <path d="M22.162 5.65593C21.3986 5.99362 20.589 6.2154 19.76 6.31393C20.6337 5.79136 21.2877 4.96894 21.6 3.99993C20.78 4.48793 19.881 4.82993 18.944 5.01493C18.3146 4.34151 17.4804 3.89489 16.5709 3.74451C15.6615 3.59413 14.7279 3.74842 13.9153 4.18338C13.1026 4.61834 12.4564 5.30961 12.0771 6.14972C11.6978 6.98983 11.6067 7.93171 11.818 8.82893C10.1551 8.74558 8.52832 8.31345 7.04328 7.56059C5.55823 6.80773 4.24812 5.75097 3.198 4.45893C2.82629 5.09738 2.63095 5.82315 2.631 6.56193C2.631 8.01193 3.37 9.29293 4.492 10.0429C3.82801 10.022 3.17863 9.84271 2.598 9.51993V9.57193C2.5982 10.5376 2.93237 11.4735 3.54385 12.221C4.15533 12.9684 5.00647 13.4814 5.953 13.6729C5.33661 13.84 4.69031 13.8646 4.063 13.7449C4.32987 14.5762 4.85001 15.3031 5.55059 15.824C6.25118 16.345 7.09712 16.6337 7.97 16.6499C7.10249 17.3313 6.10917 17.8349 5.04680 18.1321C3.98442 18.4293 2.87412 18.5142 1.779 18.3819C3.6907 19.6114 5.91599 20.264 8.189 20.2619C15.882 20.2619 20.089 13.889 20.089 8.36193C20.089 8.18193 20.084 7.99993 20.076 7.82193C20.8949 7.2301 21.6016 6.49695 22.163 5.65693L22.162 5.65593Z"></path>
              </svg>
            </a>
            <a href="https://www.instagram.com/impulsedata/" target="_blank" class="social-icon" v-scroll-animate:500="'animate-zoom'">
              <svg viewBox="0 0 24 24" class="instagram-icon">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
              </svg>
            </a>
            <a href="https://www.linkedin.com/company/impulsedata" target="_blank" class="social-icon" v-scroll-animate:550="'animate-zoom'">
              <svg viewBox="0 0 24 24" class="linkedin-icon">
                <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom" v-scroll-animate:600="'animate-up'">
        <p>&copy; 2025 ImpulseData - Alicante Futura. Todos los derechos reservados.</p>
        <div class="footer-bottom-links">
          <a href="#">Políticas de Privacidad</a>
          <a href="#">Términos de Servicio</a>
          <a href="#">Mapa del Sitio</a>
        </div>
      </div>
    </footer>
</template>

<script setup>
defineEmits(['scroll-to-top', 'open-chatbot', 'create-company']);
</script>

<style>
.app-footer {
  position: relative;
  width: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  color: white;
  padding: 3rem 0 0;
  margin-top: 3rem;
  z-index: 1;
}

/* Efecto de difuminado para la transición entre home y footer */
.app-footer::before {
  display: none; /* Ocultar el pseudo-elemento para que no bloquee los eventos */
}

/* Estilo para el nuevo div de difuminado */
.footer-difuminado {
  position: absolute;
  left: 0;
  right: 0;
  top: -150px;
  height: 150px;
  background: linear-gradient(to bottom, 
    rgba(0, 0, 0, 0) 0%, 
    rgba(0, 0, 0, 0.3) 30%, 
    rgba(0, 0, 0, 0.6) 60%, 
    rgba(0, 0, 0, 0.85) 100%);
  z-index: -1;
  pointer-events: none !important; /* Importante: asegura que los eventos pasen a través */
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.footer-column {
  display: flex;
  flex-direction: column;
}

.logo-column {
  align-items: center;
  text-align: center;
}

.footer-logo {
  width: 120px;
  height: auto;
  margin-bottom: 1rem;
  filter: drop-shadow(0 0 10px rgba(0, 176, 255, 0.5));
}

.logo-column h3 {
  font-size: 1.5rem;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
}

.logo-column p {
  font-size: 0.9rem;
  opacity: 0.8;
  line-height: 1.6;
}

.footer-column h4 {
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1.2rem;
  font-size: 1.2rem;
  position: relative;
}

.footer-column h4::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 40px;
  height: 2px;
  background: var(--primary-gradient);
}

.links-column ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.links-column li {
  margin-bottom: 0.8rem;
}

.links-column a, .contact-column a {
  color: white;
  text-decoration: none;
  opacity: 0.7;
  transition: all 0.3s ease;
  display: inline-block;
}

.links-column a:hover, .contact-column a:hover {
  opacity: 1;
  transform: translateX(5px);
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.contact-column p {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  opacity: 0.7;
}

.contact-column i {
  margin-right: 10px;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.social-icons {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.social-icon svg {
  width: 20px;
  height: 20px;
  fill: white;
}

.social-icon:hover {
  transform: translateY(-5px);
  background: var(--primary-gradient);
}

.footer-bottom {
  max-width: 1200px;
  margin: 3rem auto 0;
  padding: 1.5rem 1.5rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.footer-bottom p {
  opacity: 0.6;
  font-size: 0.9rem;
}

.footer-bottom-links {
  display: flex;
  gap: 1.5rem;
}

.footer-bottom-links a {
  color: white;
  text-decoration: none;
  font-size: 0.85rem;
  opacity: 0.6;
  transition: opacity 0.3s ease;
}

.footer-bottom-links a:hover {
  opacity: 1;
}

/* Responsive para el footer */
@media (max-width: 768px) {
  .footer-container {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .footer-column h4::after {
    left: 50%;
    transform: translateX(-50%);
  }
  
  .social-icons {
    justify-content: center;
  }
  
  .footer-bottom {
    flex-direction: column;
    text-align: center;
  }
  
  .footer-bottom-links {
    justify-content: center;
  }
  
  .contact-column p {
    justify-content: center;
  }
}
/* Ajustes para el footer */
.app-footer {
  width: 100%;
  position: relative;
  margin-top: 3rem; /* Empuja el footer al final del contenedor */
  z-index: 10;
}

/* Elimina cualquier espacio adicional después del footer */
.app-footer::after {
  content: none;
}

.footer-container {
  padding-bottom: 0;
}

.footer-bottom {
  margin-bottom: 0;
  padding-bottom: 1rem;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .footer-section {
    text-align: center;
  }
  
  .footer-section ul li a {
    justify-content: center;
  }
}
</style> 