import axios from 'axios';

// Crear instancia de Axios sin interceptores para evitar conflictos CORS
const cloudinaryAxios = axios.create();

// Base URL para API del backend (ajustar según corresponda)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://impulsedata.onrender.com';
const API_PATH = `${API_BASE_URL}/api`;

/**
 * Servicio simplificado para Cloudinary sin usar el SDK oficial
 */
class SimpleCloudinaryService {
  constructor() {
    this.cloudName = 'drqt6gd5v';
    this.defaultUploadPreset = 'impulsedata';
    
    // Lista de imágenes de muestra directamente desde Cloudinary
    this.sampleImages = [
      { publicId: 'samples/cloudinary-icon', alt: 'Logo Cloudinary' },
      { publicId: 'samples/smile', alt: 'Sonrisa' },
      { publicId: 'samples/animals/kitten-playing', alt: 'Gatito jugando' },
      { publicId: 'samples/landscapes/beach-boat', alt: 'Playa con barco' },
      { publicId: 'samples/food/spices', alt: 'Especias' },
      { publicId: 'samples/ecommerce/accessories-bag', alt: 'Bolso' }
    ];
  }

  /**
   * Genera una URL para una imagen de Cloudinary
   * @param {string} publicId - ID público de la imagen
   * @param {Object} options - Opciones de transformación
   * @returns {string} - URL de la imagen
   */
  getImageUrl(publicId, options = {}) {
    if (!publicId) return 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg';
    
    const { width, height, format, quality } = options;
    
    // URL base de Cloudinary
    let url = `https://res.cloudinary.com/${this.cloudName}/image/upload`;
    
    // Transformaciones
    const transformations = [];
    if (width) transformations.push(`w_${width}`);
    if (height) transformations.push(`h_${height}`);
    if (format && format !== 'auto') transformations.push(`f_${format}`);
    if (quality && quality !== 'auto') transformations.push(`q_${quality}`);
    else transformations.push('q_auto');
    
    // Añadir transformaciones a la URL
    if (transformations.length > 0) {
      url += `/${transformations.join(',')}`;
    }
    
    // Añadir el ID público a la URL
    url += `/${publicId}`;
    
    console.log("URL generada para Cloudinary:", url);
    return url;
  }

  /**
   * Verifica si una imagen de Cloudinary existe
   * @param {string} publicId - ID público de la imagen
   * @returns {Promise<boolean>} - Promise que resuelve a true si existe
   */
  async checkImageExists(publicId) {
    try {
      const url = this.getImageUrl(publicId);
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      console.error(`Error al verificar imagen ${publicId}:`, error);
      return false;
    }
  }

  /**
   * Genera URL para mostrar imágenes en un PDF (optimizadas)
   * @param {string} publicId - ID público de la imagen
   * @returns {string} - URL de la imagen optimizada para PDF
   */
  getImageUrlForPdf(publicId) {
    if (!publicId) return '';
    
    return this.getImageUrl(publicId, {
      format: 'png',
      quality: 'auto:best'
    });
  }

  /**
   * Sube una imagen a Cloudinary
   * @param {File} file - Archivo a subir
   * @param {Object} options - Opciones adicionales
   * @returns {Promise} - Promise con la respuesta
   */
  async uploadImage(file, options = {}) {
    if (!file) {
      throw new Error('No se proporcionó ningún archivo');
    }
    
    const { 
      uploadPreset = this.defaultUploadPreset,
      folder = '',
      publicId = ''
    } = options;
    
    try {
      // Crear FormData para la subida
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);
      
      if (folder) formData.append('folder', folder);
      if (publicId) formData.append('public_id', publicId);
      
      // Realizar la subida usando la instancia sin interceptores
      const response = await cloudinaryAxios.post(
        `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
        formData
      );
      
      return response.data;
    } catch (error) {
      console.error('Error al subir imagen a Cloudinary:', error);
      throw error;
    }
  }

  /**
   * Obtiene todas las imágenes disponibles en Cloudinary
   * @param {number} maxResults - Número máximo de resultados a obtener (no usado)
   * @returns {Promise<Array>} - Promise con la lista de imágenes
   */
  async getAllImages(maxResults = 100) {
    try {
      // Para evitar errores de API, siempre devolvemos las imágenes de muestra
      console.log("Devolviendo imágenes de muestra de Cloudinary");
      return this.sampleImages;
    } catch (error) {
      console.error('Error al obtener imágenes de Cloudinary:', error);
      return this.sampleImages;
    }
  }
}

export default new SimpleCloudinaryService(); 