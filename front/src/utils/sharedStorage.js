// sharedStorage.js - Servicio para el almacenamiento compartido de Impulsalicante

// Constantes para identificar la empresa
const IMPULSALICANTE_ID = "impulsalicante";

// URLs de las APIs para almacenamiento compartido
const API_URL = {
  GET_IMAGES: "/api/shared-storage/images",
  SAVE_IMAGE: "/api/shared-storage/image",
  CHECK_COMPANY: "/api/company/check"
};

/**
 * Comprueba si el usuario está trabajando con la empresa Impulsalicante
 * @returns {Promise<boolean>} True si está trabajando con Impulsalicante
 */
async function isImpulsalicante() {
  try {
    // En un entorno real, esto sería una llamada a la API
    // para verificar la empresa del usuario actual
    const response = await fetch(API_URL.CHECK_COMPANY);
    const data = await response.json();
    return data.companyId === IMPULSALICANTE_ID;
  } catch (error) {
    console.error("Error verificando empresa:", error);
    
    // Para desarrollo, puedes forzar que siempre retorne true
    // para probar la funcionalidad de almacenamiento compartido
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
    
    // En un entorno real, esto sería una llamada a la API
    const response = await fetch(API_URL.GET_IMAGES);
    const data = await response.json();
    
    // Para desarrollo, puedes usar localStorage
    // Al migrar a producción, se debe reemplazar por una llamada a la API real
    const localData = localStorage.getItem("impulsalicante_shared_images");
    
    if (localData) {
      return JSON.parse(localData);
    }
    
    return data.images || {};
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
    
    // En un entorno real, esto sería una llamada POST a la API
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageId, base64Data })
    };
    
    // Para desarrollo, usa localStorage
    const existingData = localStorage.getItem("impulsalicante_shared_images");
    const imagesData = existingData ? JSON.parse(existingData) : {};
    
    imagesData[imageId] = base64Data;
    localStorage.setItem("impulsalicante_shared_images", JSON.stringify(imagesData));
    
    // En entorno real, descomenta esto:
    /*
    const response = await fetch(API_URL.SAVE_IMAGE, requestOptions);
    const data = await response.json();
    return data.success;
    */
    
    return true;
  } catch (error) {
    console.error("Error guardando imagen compartida:", error);
    return false;
  }
}

export { loadSharedImages, saveSharedImage, isImpulsalicante }; 