// imageSelector.js - Componente para manejar la selección y cambio de imágenes
import { saveSharedImage, isImpulsalicante } from './sharedStorage';

class ImageSelector {
  constructor() {
    this.setupEventListeners();
  }

  /**
   * Configurar los event listeners para detectar clicks en imágenes seleccionables
   */
  setupEventListeners() {
    // Al cargar el DOM, configurar los listeners
    document.addEventListener('DOMContentLoaded', () => {
      this.attachClickHandlers();
    });

    // También configurar cada vez que se actualiza el PDF para nuevas imágenes
    document.addEventListener('pdfUpdated', () => {
      this.attachClickHandlers();
    });
  }

  /**
   * Adjuntar handlers de click a todas las imágenes seleccionables
   */
  attachClickHandlers() {
    const selectableImages = document.querySelectorAll('.selectable-image');
    
    selectableImages.forEach(img => {
      // Solo adjuntar el handler si aún no tiene uno
      if (!img.hasAttribute('data-has-click-handler')) {
        img.setAttribute('data-has-click-handler', 'true');
        
        img.addEventListener('click', (e) => {
          this.handleImageClick(e.target);
        });
      }
    });
  }

  /**
   * Manejar el click en una imagen seleccionable
   * @param {HTMLImageElement} imageElement - El elemento de imagen clicado
   */
  handleImageClick(imageElement) {
    // Abrir el selector de archivos
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        this.loadImage(file, imageElement);
      }
    };
    
    fileInput.click();
  }

  /**
   * Cargar la imagen seleccionada y actualizar la imagen en el PDF
   * @param {File} file - El archivo de imagen seleccionado
   * @param {HTMLImageElement} imageElement - El elemento de imagen a actualizar
   */
  loadImage(file, imageElement) {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      const newSrc = e.target.result;
      const oldSrc = imageElement.src;
      const imageId = imageElement.getAttribute('data-image-id');
      
      // Actualizar la imagen en el DOM
      imageElement.src = newSrc;
      
      // Emitir un evento para que el componente PlantillaPDF sepa que la imagen cambió
      const updateEvent = new CustomEvent('imageUpdated', {
        detail: { 
          imageId: imageId,
          newSrc: newSrc, 
          oldSrc: oldSrc 
        }
      });
      
      imageElement.dispatchEvent(updateEvent);
      
      // Si es Impulsalicante, guardar en almacenamiento compartido
      const isImpulsalicanteCompany = await isImpulsalicante();
      if (isImpulsalicanteCompany) {
        await saveSharedImage(imageId, newSrc);
        console.log(`Imagen ${imageId} guardada en almacenamiento compartido desde imageSelector`);
      }
    };
    
    reader.readAsDataURL(file);
  }
  
  /**
   * Método público para actualizar una imagen programáticamente
   * @param {string} imageId - ID de la imagen a actualizar
   * @param {string} base64Data - Datos de la imagen en formato base64
   */
  updateImage(imageId, base64Data) {
    const imageElement = document.querySelector(`[data-image-id="${imageId}"]`);
    
    if (imageElement) {
      const oldSrc = imageElement.src;
      
      // Actualizar la imagen en el DOM
      imageElement.src = base64Data;
      
      // Emitir un evento para que el componente PlantillaPDF sepa que la imagen cambió
      const updateEvent = new CustomEvent('imageUpdated', {
        detail: { 
          imageId: imageId,
          newSrc: base64Data, 
          oldSrc: oldSrc 
        }
      });
      
      imageElement.dispatchEvent(updateEvent);
    }
  }
}

// Crear una instancia única del selector de imágenes
const imageSelector = new ImageSelector();

export default imageSelector; 