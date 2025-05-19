// sharedStorage.js - Servicio para el almacenamiento compartido de Impulsalicante usando localStorage

// Constantes para identificar la empresa
const IMPULSALICANTE_ID = "impulsalicante";

// Claves para localStorage
const STORAGE_KEYS = {
  IMAGES: "impulsalicante_shared_images",
  FORM_DATA: "impulsalicante_shared_formdata"
};

/**
 * Comprueba si el usuario está trabajando con la empresa Impulsalicante
 * @returns {Promise<boolean>} True si está trabajando con Impulsalicante
 */
async function isImpulsalicante() {
  try {
    // Siempre devolvemos true para desarrollo
    console.log("Modo desarrollo: asumiendo que es Impulsalicante");
    return true;
  } catch (error) {
    console.error("Error verificando empresa:", error);
    return true;
  }
}

/**
 * Carga las imágenes del almacenamiento compartido de Impulsalicante
 * @returns {Promise<Object>} Un objeto con las imágenes en formato {imageId: base64Data}
 */
async function loadSharedImages() {
  try {
    // Verificar si estamos trabajando con Impulsalicante
    const isImpulsalicanteCompany = await isImpulsalicante();
    
    if (!isImpulsalicanteCompany) {
      return {}; // No es Impulsalicante, no hay imágenes compartidas
    }
    
    // Usar localStorage
    try {
      const localData = localStorage.getItem(STORAGE_KEYS.IMAGES);
      
      if (localData) {
        try {
          // Validar que es un JSON válido antes de parsearlo
          const parsedData = JSON.parse(localData);
          console.log("Imágenes cargadas desde localStorage:", Object.keys(parsedData).length);
          return parsedData;
        } catch (jsonError) {
          console.error("Error parseando JSON de localStorage:", jsonError);
          return {};
        }
      }
    } catch (storageError) {
      console.error("Error accediendo a localStorage:", storageError);
    }
    
    // Si llegamos aquí, no hay datos en localStorage
    console.log("No hay imágenes en localStorage");
    return {};
  } catch (error) {
    console.error("Error cargando imágenes compartidas:", error);
    return {};
  }
}

/**
 * Guarda una imagen en el almacenamiento compartido de Impulsalicante
 * @param {string} imageId - ID único de la imagen (ej: "img-123")
 * @param {string} base64Data - Datos de la imagen en formato base64
 * @returns {Promise<boolean>} - True si se guardó correctamente
 */
async function saveSharedImage(imageId, base64Data) {
  try {
    // Verificar si estamos trabajando con Impulsalicante
    const isImpulsalicanteCompany = await isImpulsalicante();
    
    if (!isImpulsalicanteCompany) {
      return false; // No es Impulsalicante, no guardar
    }
    
    // Usar localStorage
    try {
      // Obtenemos las imágenes existentes con manejo de errores
      let imagesData = {};
      const existingData = localStorage.getItem(STORAGE_KEYS.IMAGES);
      
      if (existingData) {
        try {
          imagesData = JSON.parse(existingData);
        } catch (jsonError) {
          console.error("Error parseando JSON de localStorage, usando objeto vacío:", jsonError);
        }
      }
      
      // Guardamos la nueva imagen
      imagesData[imageId] = base64Data;
      localStorage.setItem(STORAGE_KEYS.IMAGES, JSON.stringify(imagesData));
      console.log(`Imagen ${imageId} guardada en localStorage`);
      
      // Disparar un evento para que otros clientes sepan que hay cambios
      window.dispatchEvent(new CustomEvent('sharedStorageUpdated', {
        detail: { type: 'image', id: imageId }
      }));
      
      return true;
    } catch (storageError) {
      console.error("Error accediendo a localStorage:", storageError);
      return false;
    }
  } catch (error) {
    console.error("Error guardando imagen compartida:", error);
    return false;
  }
}

/**
 * Carga todos los datos del formulario del almacenamiento compartido de Impulsalicante
 * @returns {Promise<Object>} Un objeto con todos los datos del formulario
 */
async function loadSharedFormData() {
  try {
    // Verificar si estamos trabajando con Impulsalicante
    const isImpulsalicanteCompany = await isImpulsalicante();
    
    if (!isImpulsalicanteCompany) {
      return {}; // No es Impulsalicante, no hay datos compartidos
    }
    
    // Usar localStorage
    try {
      const formData = localStorage.getItem(STORAGE_KEYS.FORM_DATA);
      
      if (formData) {
        try {
          // Validar que es un JSON válido antes de parsearlo
          const parsedData = JSON.parse(formData);
          console.log("Datos de formulario cargados desde localStorage");
          return parsedData;
        } catch (jsonError) {
          console.error("Error parseando JSON de formulario:", jsonError);
          return {};
        }
      }
    } catch (storageError) {
      console.error("Error accediendo a localStorage para formulario:", storageError);
    }
    
    // Si llegamos aquí, no hay datos en localStorage
    return {};
  } catch (error) {
    console.error("Error cargando datos del formulario compartidos:", error);
    return {};
  }
}

/**
 * Guarda un campo del formulario en el almacenamiento compartido de Impulsalicante
 * @param {string} fieldId - ID único del campo (ej: "titulo", "year", "descripcion")
 * @param {any} value - Valor del campo
 * @returns {Promise<boolean>} - True si se guardó correctamente
 */
async function saveSharedFormField(fieldId, value) {
  try {
    // Verificar si estamos trabajando con Impulsalicante
    const isImpulsalicanteCompany = await isImpulsalicante();
    
    if (!isImpulsalicanteCompany) {
      return false; // No es Impulsalicante, no guardar
    }
    
    // Usar localStorage
    try {
      // Obtenemos los datos existentes
      let formData = {};
      const existingData = localStorage.getItem(STORAGE_KEYS.FORM_DATA);
      
      if (existingData) {
        try {
          formData = JSON.parse(existingData);
        } catch (jsonError) {
          console.error("Error parseando JSON de formulario, usando objeto vacío:", jsonError);
        }
      }
      
      // Guardamos el nuevo valor
      formData[fieldId] = value;
      formData.updatedAt = new Date().toISOString();
      
      localStorage.setItem(STORAGE_KEYS.FORM_DATA, JSON.stringify(formData));
      console.log(`Campo ${fieldId} guardado en localStorage`);
      
      // Disparar un evento para que otros clientes sepan que hay cambios
      window.dispatchEvent(new CustomEvent('sharedStorageUpdated', {
        detail: { type: 'formField', id: fieldId, value: value }
      }));
      
      return true;
    } catch (storageError) {
      console.error("Error accediendo a localStorage para formulario:", storageError);
      return false;
    }
  } catch (error) {
    console.error("Error guardando campo compartido:", error);
    return false;
  }
}

/**
 * Suscribe un componente a cambios en datos compartidos en tiempo real
 * @param {Function} callback - Función a llamar cuando los datos cambien
 * @returns {Function} - Función para cancelar la suscripción
 */
function subscribeToSharedData(callback) {
  // Crear un manejador de eventos para escuchar actualizaciones
  const handleUpdate = (event) => {
    const { type, id, value } = event.detail;
    
    if (type === 'formField') {
      callback({ fieldId: id, value: value });
    } else if (type === 'image') {
      // Para imágenes, necesitamos cargar el valor actual desde localStorage
      try {
        const imagesData = localStorage.getItem(STORAGE_KEYS.IMAGES);
        if (imagesData) {
          const images = JSON.parse(imagesData);
          if (images[id]) {
            callback({ fieldId: id, value: images[id], isImage: true });
          }
        }
      } catch (error) {
        console.error("Error obteniendo imagen actualizada:", error);
      }
    }
  };
  
  // Registrar el evento
  window.addEventListener('sharedStorageUpdated', handleUpdate);
  
  // Retornar función para cancelar la suscripción
  return () => {
    window.removeEventListener('sharedStorageUpdated', handleUpdate);
  };
}

// Función para limpiar el almacenamiento temporal si es necesario
function resetSharedStorage() {
  try {
    localStorage.removeItem(STORAGE_KEYS.IMAGES);
    localStorage.removeItem(STORAGE_KEYS.FORM_DATA);
    console.log("Almacenamiento compartido reiniciado");
    return true;
  } catch (error) {
    console.error("Error al reiniciar almacenamiento:", error);
    return false;
  }
}

// Función para inicializar datos por defecto si no existen
function initializeDefaultData() {
  try {
    // Verificar si ya existen datos de formulario
    const formData = localStorage.getItem(STORAGE_KEYS.FORM_DATA);
    if (!formData) {
      // Crear datos iniciales
      const initialData = {
        "portada-titulo": "MEMORIA<br>DE ACTIVIDAD",
        "portada-year": "20<span class=\"year-highlight\">25</span>",
        "portada-year-highlight": "25",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem(STORAGE_KEYS.FORM_DATA, JSON.stringify(initialData));
      console.log("Datos iniciales de formulario creados");
    }
    
    return true;
  } catch (error) {
    console.error("Error al inicializar datos por defecto:", error);
    return false;
  }
}

// Inicializar datos por defecto al cargar
initializeDefaultData();

export { 
  loadSharedImages, 
  saveSharedImage, 
  isImpulsalicante, 
  loadSharedFormData, 
  saveSharedFormField,
  subscribeToSharedData,
  resetSharedStorage
}; 