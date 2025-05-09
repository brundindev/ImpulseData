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
    
    // Lista de imágenes de respaldo por si falla la API
    this.fallbackImages = [
      { publicId: 'docs/models-13', alt: 'Modelo' },
      { publicId: 'docs/models-12', alt: 'Modelo 2' },
      { publicId: 'docs/models-11', alt: 'Modelo 3' },
      { publicId: 'docs/models-10', alt: 'Modelo 4' },
      { publicId: 'docs/models-9', alt: 'Modelo 5' },
      { publicId: 'docs/models-8', alt: 'Modelo 6' }
    ];
  }

  /**
   * Genera una URL para una imagen de Cloudinary
   * @param {string} publicId - ID público de la imagen
   * @param {Object} options - Opciones de transformación
   * @returns {string} - URL de la imagen
   */
  getImageUrl(publicId, options = {}) {
    if (!publicId) return 'https://res.cloudinary.com/drqt6gd5v/image/upload/v1745577235/docs/models-13.png';
    
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
   * Obtiene todas las imágenes disponibles en Cloudinary mediante el backend
   * @param {number} maxResults - Número máximo de resultados a obtener
   * @returns {Promise<Array>} - Promise con la lista de imágenes
   */
  async getAllImages(maxResults = 100) {
    try {
      console.log("Intentando obtener imágenes de Cloudinary a través del backend...");
      
      // Usar el endpoint del backend para obtener todas las imágenes
      const response = await axios.get(`${API_PATH}/cloudinary/images`, {
        params: { maxResults },
        // Asegurarnos de que incluya el token de autenticación
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      if (response.data && Array.isArray(response.data)) {
        console.log(`Se recuperaron ${response.data.length} imágenes de Cloudinary`);
        return response.data;
      } else {
        console.warn("La respuesta del backend no es válida, usando imágenes de respaldo");
        return this.fallbackImages;
      }
    } catch (error) {
      console.error('Error al obtener imágenes de Cloudinary desde el backend:', error);
      console.log("Usando imágenes de respaldo debido al error");
      return this.fallbackImages;
    }
  }
}

export default new SimpleCloudinaryService(); 