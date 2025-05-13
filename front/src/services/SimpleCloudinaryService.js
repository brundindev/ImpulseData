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
    
    // Nueva lista de imágenes de respaldo (verificadas que existen)
    this.fallbackImages = [
      { publicId: 'v1745577235/docs/models-13', alt: 'Modelo' },
      { publicId: 'v1745577235/docs/models-12', alt: 'Modelo Trabajo' },
      { publicId: 'v1745577235/docs/models-11', alt: 'Modelo Reunión' },
      { publicId: 'v1745577235/docs/models-10', alt: 'Modelo Colaboración' },
      { publicId: 'v1745577235/docs/models-9', alt: 'Modelo Técnico' },
      { publicId: 'v1745577235/docs/models-8', alt: 'Modelo Presentación' }
    ];
    
    // URL de imagen por defecto para cuando falla todo lo demás
    this.defaultImageUrl = 'https://res.cloudinary.com/drqt6gd5v/image/upload/v1745577235/docs/models-13.png';
    
    // Rutas conocidas de carpetas para buscar imágenes
    this.knownFolders = ['docs', 'samples', 'logos', 'uploads'];
  }

  /**
   * Genera una URL para una imagen de Cloudinary
   * @param {string} publicId - ID público de la imagen
   * @param {Object} options - Opciones de transformación
   * @returns {string} - URL de la imagen
   */
  getImageUrl(publicId, options = {}) {
    if (!publicId) return this.defaultImageUrl;
    
    try {
      const { width, height, format, quality } = options;
      
      // Si el publicId ya es una URL completa, devolverlo directamente
      if (publicId.startsWith('http')) {
        return publicId;
      }
      
      // Si ya incluye versión (v12345), usarlo tal cual
      if (publicId.match(/^v\d+\//)) {
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
      } else {
        // Para IDs sin versión, usar la versión predeterminada
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
        
        // Añadir el ID público a la URL (con versión predeterminada)
        url += `/v1745577235/${publicId}`;
        
        return url;
      }
    } catch (error) {
      console.error(`Error al generar URL para imagen ${publicId}:`, error);
      return this.defaultImageUrl;
    }
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
      // En lugar de acceder a los archivos JSON directamente, usemos el backend como intermediario
      console.log(`Intentando obtener recursos de carpeta '${prefix}' a través del backend`);
      
      // Endpoints públicos, no necesitamos enviar token
      // const token = localStorage.getItem('authToken');
      // const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      
      // Usar el endpoint del backend para obtener imágenes
      const response = await axios.get(`${API_PATH}/cloudinary/images`, {
        // headers,
        params: { folder: prefix },
        timeout: 15000
      });
      
      if (response.data && Array.isArray(response.data)) {
        return response.data.map(res => ({
          publicId: res.publicId,
          alt: res.alt || this.formatPublicIdToAlt(res.publicId),
          format: res.format,
          width: res.width,
          height: res.height,
          url: res.secureUrl || this.getImageUrl(res.publicId)
        }));
      }
      
      return [];
    } catch (error) {
      console.error(`Error al obtener recursos de carpeta '${prefix}':`, error);
      // Si falla, devolver un array vacío
      return [];
    }
  }

  /**
   * Obtiene todas las imágenes disponibles para la aplicación
   * @returns {Promise<Array>} - Promise con la lista de imágenes
   */
  async getAllImages() {
    try {
      console.log("Obteniendo imágenes de Cloudinary...");
      
      // Iniciar con imágenes de respaldo (funcionamiento offline)
      const allImages = [...this.fallbackImages];
      
      // Verificar si hay red y conexión con el backend
      try {
        // Detectar si estamos offline
        if (!navigator.onLine) {
          console.log("Navegador offline. Usando imágenes de respaldo.");
          return allImages;
        }
        
        // Verificar si podemos acceder al backend
        try {
          // Ping rápido al endpoint de health (público)
          await axios.get(`${API_PATH}/cloudinary/health`, { 
            timeout: 3000,
            validateStatus: (status) => status === 200
          });
        } catch (pingError) {
          console.log("Backend no disponible. Usando imágenes de respaldo.");
          return allImages;
        }
        
        // Si llegamos aquí, el backend está disponible
        // Ahora intentamos obtener las imágenes
        console.log("Backend disponible. Intentando obtener imágenes...");
        
        const response = await axios.get(`${API_PATH}/cloudinary/images`, {
          timeout: 15000
        });
        
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          console.log(`Obtenidas ${response.data.length} imágenes del backend`);
          
          const backendImages = response.data.map(img => ({
            publicId: img.publicId,
            alt: img.alt || this.formatPublicIdToAlt(img.publicId),
            url: img.secureUrl || this.getImageUrl(img.publicId),
            width: img.width,
            height: img.height
          }));
          
          // Limpiar y añadir imágenes únicas del backend
          const uniqueImages = [...allImages];
          backendImages.forEach(img => {
            if (!uniqueImages.some(existing => 
                existing.publicId === img.publicId || 
                (existing.url && img.url && existing.url === img.url)
            )) {
              uniqueImages.push(img);
            }
          });
          
          return uniqueImages;
        }
      } catch (backendError) {
        console.warn("Error al obtener imágenes del backend:", backendError.message);
      }
      
      // Si llegamos aquí, hubo un problema o no se pudieron obtener imágenes del backend
      console.log("Usando imágenes de respaldo (fallback)");
      return allImages;
    } catch (error) {
      console.error('Error global al obtener imágenes:', error);
      return this.fallbackImages;
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