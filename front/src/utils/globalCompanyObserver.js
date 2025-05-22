import { db } from '../firebase';
import { doc, onSnapshot, collection } from 'firebase/firestore';
import { ref } from 'vue';

// ID fijo de la empresa global
const GLOBAL_COMPANY_ID = "impulsalicante_global";

// Referencias reactivas para los datos
export const globalCompany = ref(null);
export const globalDepartments = ref([]);
export const globalCenters = ref([]);
export const globalTrainings = ref([]);

// Almacenar los observers para limpiarlos cuando sea necesario
let observers = [];

/**
 * Iniciar la observación de cambios en la empresa global
 * Esta función debe llamarse cuando el usuario se autentique
 * @returns {function} - Función para detener la observación
 */
export function startGlobalCompanyObserver() {
  // Limpiar observadores previos si existen
  stopGlobalCompanyObserver();

  console.log("🔍 Iniciando observación de la empresa global");

  // Observar documento principal de la empresa
  const companyRef = doc(db, "empresas", GLOBAL_COMPANY_ID);
  const companyObserver = onSnapshot(companyRef, (snapshot) => {
    if (snapshot.exists()) {
      globalCompany.value = {
        id: snapshot.id,
        ...snapshot.data()
      };
      console.log("✅ Empresa global actualizada:", globalCompany.value.nombre);
    } else {
      console.warn("⚠️ La empresa global no existe en Firestore");
      globalCompany.value = null;
    }
  }, (error) => {
    console.error("Error observando empresa global:", error);
  });
  
  observers.push(companyObserver);

  // Observar departamentos
  const deptsRef = collection(db, `empresas/${GLOBAL_COMPANY_ID}/departamentos`);
  const deptsObserver = onSnapshot(deptsRef, (snapshot) => {
    const departments = [];
    snapshot.forEach((doc) => {
      departments.push({
        id: doc.id,
        ...doc.data()
      });
    });
    globalDepartments.value = departments;
    console.log("✅ Departamentos de empresa global actualizados:", departments.length);
  }, (error) => {
    console.error("Error observando departamentos:", error);
  });
  
  observers.push(deptsObserver);

  // Observar centros
  const centersRef = collection(db, `empresas/${GLOBAL_COMPANY_ID}/centros`);
  const centersObserver = onSnapshot(centersRef, (snapshot) => {
    const centers = [];
    snapshot.forEach((doc) => {
      centers.push({
        id: doc.id,
        ...doc.data()
      });
    });
    globalCenters.value = centers;
    console.log("✅ Centros de empresa global actualizados:", centers.length);
  }, (error) => {
    console.error("Error observando centros:", error);
  });
  
  observers.push(centersObserver);

  // Observar formaciones
  const trainingsRef = collection(db, `empresas/${GLOBAL_COMPANY_ID}/formaciones`);
  const trainingsObserver = onSnapshot(trainingsRef, (snapshot) => {
    const trainings = [];
    snapshot.forEach((doc) => {
      trainings.push({
        id: doc.id,
        ...doc.data()
      });
    });
    globalTrainings.value = trainings;
    console.log("✅ Formaciones de empresa global actualizadas:", trainings.length);
  }, (error) => {
    console.error("Error observando formaciones:", error);
  });
  
  observers.push(trainingsObserver);

  // Devolver función para detener la observación
  return stopGlobalCompanyObserver;
}

/**
 * Detener la observación de cambios en la empresa global
 * Esta función debe llamarse cuando el usuario cierre sesión
 */
export function stopGlobalCompanyObserver() {
  observers.forEach(unsubscribe => unsubscribe());
  observers = [];
  
  // Limpiar datos
  globalCompany.value = null;
  globalDepartments.value = [];
  globalCenters.value = [];
  globalTrainings.value = [];
  
  console.log("🛑 Observación de empresa global detenida");
}

/**
 * Obtener el estado actual de la empresa global y sus subcolecciones
 * @returns {Object} - Datos actuales de la empresa global
 */
export function getGlobalCompanyData() {
  return {
    empresa: globalCompany.value,
    departamentos: globalDepartments.value,
    centros: globalCenters.value,
    formaciones: globalTrainings.value
  };
} 