// sharedStorage.js - Servicio para el almacenamiento compartido de Impulsalicante con Firebase

import { db, storage } from './firebaseConfig';
import { 
  collection, doc, getDoc, setDoc, getDocs, updateDoc, query, where, onSnapshot, deleteDoc 
} from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';

// Constantes para identificar la empresa
const IMPULSALICANTE_ID = "impulsalicante";

// Colecciones de Firestore
const COMPANIES_COLLECTION = "companies";
const FORM_DATA_COLLECTION = "formData";
const IMAGES_COLLECTION = "images";

// Listeners activos para limpieza
let activeListeners = [];

/**
 * Comprueba si el usuario está trabajando con la empresa Impulsalicante
 * @returns {Promise<boolean>} True si está trabajando con Impulsalicante
 */
async function isImpulsalicante() {
  try {
    // En un entorno real, esto vendría de la autenticación del usuario
    // pero para este ejemplo asumiremos que siempre es Impulsalicante
    return true;
  } catch (error) {
    console.error("Error verificando empresa:", error);
    return true; // Para desarrollo, forzamos que sí
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
    
    // Obtener las imágenes de Firebase
    const imagesRef = collection(db, COMPANIES_COLLECTION, IMPULSALICANTE_ID, IMAGES_COLLECTION);
    const querySnapshot = await getDocs(imagesRef);
    
    const images = {};
    querySnapshot.forEach((doc) => {
      const imageId = doc.id;
      const imageData = doc.data();
      images[imageId] = imageData.base64Data;
    });
    
    return images;
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
    
    // Guardar la imagen en Firestore
    const imageRef = doc(db, COMPANIES_COLLECTION, IMPULSALICANTE_ID, IMAGES_COLLECTION, imageId);
    await setDoc(imageRef, {
      base64Data: base64Data,
      updatedAt: new Date().toISOString()
    });
    
    console.log(`Imagen ${imageId} guardada en Firebase`);
    return true;
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
    
    // Obtener los datos del formulario de Firebase
    const formDataRef = doc(db, COMPANIES_COLLECTION, IMPULSALICANTE_ID, FORM_DATA_COLLECTION, "mainForm");
    const docSnap = await getDoc(formDataRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    }
    
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
    
    // Guardar el campo en Firestore
    const formDataRef = doc(db, COMPANIES_COLLECTION, IMPULSALICANTE_ID, FORM_DATA_COLLECTION, "mainForm");
    
    // Comprobar si el documento existe
    const docSnap = await getDoc(formDataRef);
    
    if (docSnap.exists()) {
      // Actualizar campo existente
      await updateDoc(formDataRef, {
        [fieldId]: value,
        updatedAt: new Date().toISOString()
      });
    } else {
      // Crear documento nuevo
      await setDoc(formDataRef, {
        [fieldId]: value,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    
    console.log(`Campo ${fieldId} guardado en Firebase`);
    return true;
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
  // Verificar si estamos en Impulsalicante
  isImpulsalicante().then(isImpulsalicanteCompany => {
    if (!isImpulsalicanteCompany) return;
    
    // Suscribirse a cambios en el documento principal de formulario
    const formDataRef = doc(db, COMPANIES_COLLECTION, IMPULSALICANTE_ID, FORM_DATA_COLLECTION, "mainForm");
    
    const unsubscribe = onSnapshot(formDataRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        
        // Para cada campo, notificar el cambio
        Object.entries(data).forEach(([fieldId, value]) => {
          // No notificar timestamps
          if (fieldId !== 'createdAt' && fieldId !== 'updatedAt') {
            callback({ fieldId, value });
          }
        });
      }
    }, (error) => {
      console.error("Error en suscripción a datos compartidos:", error);
    });
    
    // Guardar referencia para limpieza
    activeListeners.push(unsubscribe);
    
    // También suscribirse a cambios en imágenes
    const imagesRef = collection(db, COMPANIES_COLLECTION, IMPULSALICANTE_ID, IMAGES_COLLECTION);
    
    const imagesUnsubscribe = onSnapshot(imagesRef, (querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        if (change.type === "added" || change.type === "modified") {
          const imageId = change.doc.id;
          const imageData = change.doc.data();
          
          // Notificar el cambio de imagen
          callback({ 
            fieldId: imageId, 
            value: imageData.base64Data, 
            isImage: true 
          });
        }
      });
    }, (error) => {
      console.error("Error en suscripción a imágenes compartidas:", error);
    });
    
    // Guardar referencia para limpieza
    activeListeners.push(imagesUnsubscribe);
  });
  
  // Retornar función para cancelar todas las suscripciones
  return () => {
    activeListeners.forEach(unsub => unsub());
    activeListeners = [];
  };
}

/**
 * Función para inicializar la base de datos para la empresa Impulsalicante si no existe
 * @returns {Promise<void>}
 */
async function initializeDatabase() {
  try {
    // Verificar si ya existe el documento de la empresa
    const companyRef = doc(db, COMPANIES_COLLECTION, IMPULSALICANTE_ID);
    const companyDoc = await getDoc(companyRef);
    
    if (!companyDoc.exists()) {
      // Crear documento para la empresa
      await setDoc(companyRef, {
        name: "Impulsalicante",
        createdAt: new Date().toISOString()
      });
      
      // Crear documento inicial para el formulario
      const formDataRef = doc(db, COMPANIES_COLLECTION, IMPULSALICANTE_ID, FORM_DATA_COLLECTION, "mainForm");
      await setDoc(formDataRef, {
        "portada-titulo": "MEMORIA<br>DE ACTIVIDAD",
        "portada-year": "20<span class=\"year-highlight\">25</span>",
        "portada-year-highlight": "25",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      console.log("Base de datos inicializada para Impulsalicante");
    }
  } catch (error) {
    console.error("Error inicializando base de datos:", error);
  }
}

// Función para limpiar el almacenamiento si es necesario
async function resetSharedStorage() {
  try {
    const isImpulsalicanteCompany = await isImpulsalicante();
    if (!isImpulsalicanteCompany) return false;
    
    // Borrar colección de imágenes
    const imagesRef = collection(db, COMPANIES_COLLECTION, IMPULSALICANTE_ID, IMAGES_COLLECTION);
    const imagesSnapshot = await getDocs(imagesRef);
    
    const deletePromises = imagesSnapshot.docs.map(doc => 
      deleteDoc(doc.ref)
    );
    
    await Promise.all(deletePromises);
    
    // Reiniciar documento de formulario principal
    const formDataRef = doc(db, COMPANIES_COLLECTION, IMPULSALICANTE_ID, FORM_DATA_COLLECTION, "mainForm");
    await setDoc(formDataRef, {
      "portada-titulo": "MEMORIA<br>DE ACTIVIDAD",
      "portada-year": "20<span class=\"year-highlight\">25</span>",
      "portada-year-highlight": "25",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    console.log("Almacenamiento compartido reiniciado en Firebase");
    return true;
  } catch (error) {
    console.error("Error al reiniciar almacenamiento:", error);
    return false;
  }
}

// Inicializar la base de datos al cargar
initializeDatabase();

export { 
  loadSharedImages, 
  saveSharedImage, 
  isImpulsalicante, 
  loadSharedFormData, 
  saveSharedFormField,
  subscribeToSharedData,
  resetSharedStorage
}; 