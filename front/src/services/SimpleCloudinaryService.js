import axios from 'axios';

// Crear instancia de Axios sin interceptores para evitar conflictos CORS con timeout más largo
const cloudinaryAxios = axios.create({
  timeout: 30000 // 30 segundos
});

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
    this.apiKey = '526484494966574'; // Clave API pública (solo para operaciones de lectura)
    
    // Lista de imágenes de respaldo por si falla la conexión al backend
    this.fallbackImages = [
      { publicId: 'docs/models-13', alt: 'Modelo' },
      { publicId: 'docs/models-12', alt: 'Modelo 2' },
      { publicId: 'docs/models-11', alt: 'Modelo 3' },
      { publicId: 'docs/models-10', alt: 'Modelo 4' },
      { publicId: 'docs/models-9', alt: 'Modelo 5' },
      { publicId: 'docs/models-8', alt: 'Modelo 6' }
    ];
    
    // Rutas conocidas de carpetas para buscar imágenes (ampliadas)
    this.knownFolders = ['docs', 'samples', 'logos', 'uploads', 'images', 'icons', 'banners', 'products'];
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
   * Obtiene recursos de Cloudinary de una carpeta específica
   * @param {string} prefix - Prefijo de carpeta (opcional)
   * @returns {Promise<Array>} - Promise con la lista de imágenes
   */
  async getResourcesByFolder(prefix = '') {
    try {
      // Intento 1: Usar el endpoint de lista JSON (funciona si está configurado)
      const cloudinaryBrowseURL = `https://res.cloudinary.com/${this.cloudName}/image/list/${prefix || 'all_images'}.json`;
      
      console.log(`Consultando recursos de carpeta '${prefix}':`, cloudinaryBrowseURL);
      
      try {
        const response = await axios.get(cloudinaryBrowseURL, {
          timeout: 10000
        });
        
        if (response.data && response.data.resources && response.data.resources.length > 0) {
          console.log(`Encontradas ${response.data.resources.length} imágenes en la carpeta '${prefix}'`);
          return response.data.resources.map(res => ({
            publicId: res.public_id,
            alt: this.formatPublicIdToAlt(res.public_id),
            format: res.format,
            width: res.width,
            height: res.height,
            url: this.getImageUrl(res.public_id)
          }));
        }
      } catch (listError) {
        console.warn(`Error al obtener lista JSON para carpeta '${prefix}':`, listError.message);
      }
      
      // Intento 2: Usar la API Admin de Cloudinary a través del Backend
      try {
        const token = localStorage.getItem('authToken');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        
        const response = await axios.get(`${API_PATH}/cloudinary/folder/${prefix}`, {
          headers,
          timeout: 8000
        });
        
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          console.log(`Obtenidas ${response.data.length} imágenes de carpeta '${prefix}' desde el backend`);
          return response.data.map(img => ({
            publicId: img.publicId,
            alt: img.alt || this.formatPublicIdToAlt(img.publicId),
            format: img.format,
            url: img.url || img.secureUrl,
            width: img.width,
            height: img.height
          }));
        }
      } catch (backendError) {
        console.warn(`Error al obtener imágenes de carpeta '${prefix}' desde el backend:`, backendError.message);
      }
      
      // Si no se encuentran imágenes en esta carpeta
      return [];
    } catch (error) {
      console.error(`Error general al obtener recursos de carpeta '${prefix}':`, error);
      return [];
    }
  }

  /**
   * Obtiene todas las imágenes disponibles de forma recursiva explorando carpetas conocidas
   * @returns {Promise<Array>} - Promise con la lista de imágenes
   */
  async getAllImages() {
    try {
      console.log("Obteniendo imágenes de Cloudinary mediante múltiples fuentes...");
      
      // Iniciar con las imágenes de respaldo como fallback
      const allImages = [...this.fallbackImages];
      const processedFolders = new Set();
      
      // Método 1: Explorar todas las carpetas conocidas
      console.log("Método 1: Explorando carpetas conocidas...");
      const folderPromises = this.knownFolders.map(folder => this.exploreFolder(folder, processedFolders, allImages));
      await Promise.allSettled(folderPromises);
      
      // Método 2: Intentar obtener todas las imágenes desde el backend
      console.log("Método 2: Obteniendo imágenes desde la API del backend...");
      try {
        const token = localStorage.getItem('authToken');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        
        const response = await axios.get(`${API_PATH}/cloudinary/images?maxResults=500`, {
          headers,
          timeout: 15000 // Timeout más largo para permitir cargar más imágenes
        });
        
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          console.log(`Obtenidas ${response.data.length} imágenes del backend`);
          
          const backendImages = response.data.map(img => ({
            publicId: img.publicId,
            alt: img.alt || this.formatPublicIdToAlt(img.publicId),
            url: img.url || img.secureUrl,
            width: img.width,
            height: img.height
          }));
          
          // Añadir imágenes únicas del backend
          backendImages.forEach(img => {
            if (!allImages.some(existing => existing.publicId === img.publicId)) {
              allImages.push(img);
            }
          });
        }
      } catch (backendError) {
        console.warn("No se pudieron obtener imágenes del backend:", backendError.message);
      }
      
      // Método 3: Explorar la raíz
      console.log("Método 3: Explorando la raíz...");
      try {
        const rootImages = await this.getResourcesByFolder('');
        
        rootImages.forEach(img => {
          if (!allImages.some(existing => existing.publicId === img.publicId)) {
            allImages.push(img);
          }
        });
      } catch (rootError) {
        console.warn("Error al explorar la raíz:", rootError.message);
      }
      
      // Método 4: Añadir algunas imágenes públicas conocidas
      const sampleImages = [
        { publicId: 'sample', alt: 'Muestra general' },
        { publicId: 'samples/landscapes/nature-mountains', alt: 'Montañas' },
        { publicId: 'samples/food/pot-mussels', alt: 'Comida' },
        { publicId: 'samples/ecommerce/accessories-bag', alt: 'Producto' },
        { publicId: 'samples/animals/cat', alt: 'Gato' },
        { publicId: 'samples/animals/kitten', alt: 'Gatito' },
        { publicId: 'samples/landscapes/beach-boat', alt: 'Playa con bote' },
        { publicId: 'samples/landscapes/nature-flowers', alt: 'Flores' }
      ];
      
      sampleImages.forEach(img => {
        if (!allImages.some(existing => existing.publicId === img.publicId)) {
          allImages.push(img);
        }
      });
      
      console.log(`Finalmente, se encontraron ${allImages.length} imágenes en total`);
      return allImages;
    } catch (error) {
      console.error('Error al obtener imágenes:', error);
      return [...this.fallbackImages];
    }
  }
  
  // Método auxiliar para explorar una carpeta
  async exploreFolder(prefix, processedFolders, allImages) {
    if (processedFolders.has(prefix)) return;
    processedFolders.add(prefix);
    
    try {
      const folderImages = await this.getResourcesByFolder(prefix);
      
      // Añadir imágenes únicas (evitar duplicados por publicId)
      folderImages.forEach(img => {
        if (!allImages.some(existing => existing.publicId === img.publicId)) {
          allImages.push(img);
        }
      });
    } catch (error) {
      console.error(`Error al explorar carpeta '${prefix}':`, error);
    }
  }
  
  /**
   * Formatea un publicId para usarlo como texto alternativo
   * @param {string} publicId - ID público de la imagen
   * @returns {string} - Texto formateado para alt
   */
  formatPublicIdToAlt(publicId) {
    if (!publicId) return 'Imagen';
    
    // Extraer el nombre del archivo sin la ruta
    const fileName = publicId.split('/').pop();
    
    // Reemplazar guiones y guiones bajos por espacios
    const formatted = fileName
      .replace(/[-_]/g, ' ')
      .replace(/\.\w+$/, ''); // Eliminar extensión si existe
    
    // Capitalizar primera letra de cada palabra
    return formatted
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
}

export default new SimpleCloudinaryService(); 