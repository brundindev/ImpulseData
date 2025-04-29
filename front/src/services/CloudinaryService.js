import cloudinary, { cloudinaryConfig } from '../config/cloudinary';
import axios from 'axios';

/**
 * Servicio para interactuar con Cloudinary
 */
class CloudinaryService {
  /**
   * Obtiene la URL de una imagen de Cloudinary
   * @param {string} publicId - El ID público de la imagen
   * @param {Object} options - Opciones de transformación
   * @returns {string} - URL de la imagen
   */
  getImageUrl(publicId, options = {}) {
    if (!publicId) return '';
    
    const { width, height, format, quality } = options;
    
    try {
      let imageUrl = cloudinary.image(publicId);
      
      if (width) imageUrl = imageUrl.resize(`w_${width}`);
      if (height) imageUrl = imageUrl.resize(`h_${height}`);
      if (format) imageUrl = imageUrl.format(format);
      if (quality) imageUrl = imageUrl.quality(quality);
      
      return imageUrl.toURL();
    } catch (error) {
      console.error('Error al generar URL de Cloudinary:', error);
      // Fallback: generar la URL manualmente
      let url = `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload`;
      
      const transformations = [];
      if (width) transformations.push(`w_${width}`);
      if (height) transformations.push(`h_${height}`);
      if (format) transformations.push(`f_${format}`);
      if (quality) transformations.push(`q_${quality}`);
      
      if (transformations.length > 0) {
        url += `/${transformations.join(',')}`;
      }
      
      url += `/${publicId}`;
      return url;
    }
  }

  /**
   * Sube una imagen a Cloudinary (a través del backend)
   * @param {File} file - El archivo a subir
   * @param {string} folder - Carpeta donde guardar la imagen (opcional)
   * @returns {Promise} - Promise con la respuesta
   */
  async uploadImage(file, folder = '') {
    // En producción, lo recomendable es usar un endpoint de backend para subir imágenes
    // para no exponer las credenciales en el frontend
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default'); // Crear un upload preset en Cloudinary dashboard
    if (folder) formData.append('folder', folder);
    
    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
        formData
      );
      return response.data;
    } catch (error) {
      console.error('Error al subir imagen a Cloudinary:', error);
      throw error;
    }
  }

  /**
   * Genera URL para mostrar imágenes en un PDF
   * @param {string} publicId - ID público de la imagen
   * @returns {string} - URL absoluta de la imagen
   */
  getImageUrlForPdf(publicId) {
    if (!publicId) return '';
    
    // Para PDFs necesitamos URLs absolutas y optimizadas
    return this.getImageUrl(publicId, {
      format: 'png',
      quality: 'auto:best',
    });
  }
}

export default new CloudinaryService(); 