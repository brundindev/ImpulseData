// globalStorage.js - Sistema de coordinación entre sharedStorage y FirestoreService

import FirestoreService from '../services/FirestoreService';
import { forceGlobalImpulsalicante } from './sharedStorage';
import { db } from './firebaseConfig';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

// Constantes para identificadores globales
const GLOBAL_COMPANY_ID = "impulsalicante_global";

/**
 * Verifica y sincroniza la empresa global entre sharedStorage y FirestoreService
 * @returns {Promise<string>} - ID de la empresa global sincronizada
 */
async function syncGlobalCompany() {
  try {
    console.log("Sincronizando empresa global entre sistemas...");
    
    // Forzar la existencia de la empresa global en sharedStorage
    const sharedResult = await forceGlobalImpulsalicante();
    
    // Forzar la existencia de la empresa global en FirestoreService
    const firestoreResult = await FirestoreService.crearEmpresaPorDefectoGlobal();
    
    if (sharedResult && firestoreResult) {
      console.log("✅ Empresa global sincronizada correctamente en ambos sistemas");
      return GLOBAL_COMPANY_ID;
    } else {
      console.error("⚠️ Error en la sincronización de la empresa global:", 
        "sharedStorage:", sharedResult, 
        "FirestoreService:", firestoreResult);
      return null;
    }
  } catch (error) {
    console.error("Error sincronizando empresa global:", error);
    return null;
  }
}

/**
 * Asegura que la empresa global esté disponible para todos los usuarios
 * @returns {Promise<boolean>} - True si la empresa global está disponible
 */
async function ensureGlobalCompanyForAllUsers() {
  try {
    // Verificar en FirestoreService
    const firestoreRef = doc(db, "empresas", GLOBAL_COMPANY_ID);
    const firestoreDoc = await getDoc(firestoreRef);
    
    // Verificar en sharedStorage
    const sharedRef = doc(db, "companies", GLOBAL_COMPANY_ID);
    const sharedDoc = await getDoc(sharedRef);
    
    // Si alguno no existe, sincronizar
    if (!firestoreDoc.exists() || !sharedDoc.exists()) {
      await syncGlobalCompany();
      return true;
    }
    
    // Si ambos existen, pero alguno no tiene las propiedades correctas, actualizarlos
    if (!firestoreDoc.data().sharedByAllUsers || !sharedDoc.data().sharedByAllUsers) {
      // Actualizar FirestoreService
      await updateDoc(firestoreRef, {
        esEmpresaGlobal: true,
        esCompartida: true,
        sharedByAllUsers: true,
        updatedAt: new Date().toISOString()
      });
      
      // Actualizar sharedStorage
      await updateDoc(sharedRef, {
        isGlobal: true,
        sharedByAllUsers: true,
        updatedAt: new Date().toISOString()
      });
      
      console.log("✅ Propiedades de empresa global actualizadas para ambos sistemas");
    }
    
    return true;
  } catch (error) {
    console.error("Error verificando/asegurando empresa global:", error);
    return false;
  }
}

// Inicializar la sincronización al cargar la aplicación
ensureGlobalCompanyForAllUsers()
  .then(result => {
    if (result) {
      console.log("🌍 Empresa global inicializada y disponible para todos los usuarios");
    }
  })
  .catch(error => {
    console.error("Error inicializando empresa global:", error);
  });

export {
  syncGlobalCompany,
  ensureGlobalCompanyForAllUsers,
  GLOBAL_COMPANY_ID
}; 