import { getFirestore, collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where, orderBy, collectionGroup } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import app from '../firebase';

// Initialize Firestore
const db = getFirestore(app);
const auth = getAuth(app);

class FirestoreService {
  /**
   * Guarda una nueva empresa en Firestore con todos sus datos relacionados
   * @param {Object} empresa - Datos de la empresa a guardar
   * @returns {Promise<string>} - ID de la empresa creada
   */
  static async guardarEmpresa(empresa) {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("No hay usuario autenticado para guardar empresa");
        throw new Error("Usuario no autenticado");
      }
      console.log("Usuario autenticado:", user.uid, user.email);
      
      // Crear un ID para la empresa
      const empresasRef = collection(db, "empresas");
      const empresaDoc = doc(empresasRef);
      const empresaId = empresaDoc.id;
      console.log("ID generado para la empresa:", empresaId);
      
      // Preparar datos de la empresa
      const empresaData = {
        id: empresaId,
        nombre: empresa.nombre,
        descripcion: empresa.descripcion || "",
        fechaCreacion: empresa.fechaCreacion,
        ciudad: empresa.ciudad || "",
        creadoPor: user.uid,
        creadorEmail: user.email,
        fechaCreacionSistema: new Date().toISOString()
      };
      console.log("Datos de empresa a guardar:", JSON.stringify(empresaData));
      
      // Guardar la empresa
      console.log("Guardando empresa en Firestore...");
      await setDoc(empresaDoc, empresaData);
      console.log("Empresa guardada correctamente con ID:", empresaId);
      
      // Guardar departamentos como subcolección
      if (empresa.departamentos && empresa.departamentos.length > 0) {
        console.log(`Guardando ${empresa.departamentos.length} departamentos como subcolección...`);
        for (const departamento of empresa.departamentos) {
          if (departamento.nombre && departamento.nombre.trim()) {
            // Crear referencia a la subcolección de departamentos
            const depRef = doc(collection(empresaDoc, "departamentos"));
            const depData = {
              id: depRef.id,
              nombre: departamento.nombre,
              creadoPor: user.uid
            };
            await setDoc(depRef, depData);
            console.log(`Departamento guardado: ${depData.nombre} con ID: ${depData.id}`);
          } else {
            console.log("Saltando departamento sin nombre");
          }
        }
      }
      
      // Guardar centros como subcolección
      if (empresa.centros && empresa.centros.length > 0) {
        console.log(`Guardando ${empresa.centros.length} centros como subcolección...`);
        for (const centro of empresa.centros) {
          if (centro.nombre && centro.nombre.trim()) {
            // Crear referencia a la subcolección de centros
            const centroRef = doc(collection(empresaDoc, "centros"));
            const centroData = {
              id: centroRef.id,
              nombre: centro.nombre,
              direccion: centro.direccion || "",
              creadoPor: user.uid
            };
            await setDoc(centroRef, centroData);
            console.log(`Centro guardado: ${centroData.nombre} con ID: ${centroData.id}`);
          } else {
            console.log("Saltando centro sin nombre");
          }
        }
      }
      
      // Guardar formaciones como subcolección
      if (empresa.formaciones && empresa.formaciones.length > 0) {
        console.log(`Guardando ${empresa.formaciones.length} formaciones como subcolección...`);
        for (const formacion of empresa.formaciones) {
          if (formacion.nombre && formacion.nombre.trim()) {
            // Crear referencia a la subcolección de formaciones
            const formacionRef = doc(collection(empresaDoc, "formaciones"));
            const formacionData = {
              id: formacionRef.id,
              nombre: formacion.nombre,
              tipo: formacion.tipo || "presencial",
              duracion: formacion.duracion || 0,
              creadoPor: user.uid
            };
            await setDoc(formacionRef, formacionData);
            console.log(`Formación guardada: ${formacionData.nombre} con ID: ${formacionData.id}`);
          } else {
            console.log("Saltando formación sin nombre");
          }
        }
      }
      
      return empresaId;
    } catch (error) {
      console.error("Error al guardar empresa:", error);
      if (error.code) {
        console.error("Código de error Firebase:", error.code);
      }
      throw error;
    }
  }

  /**
   * Obtiene todas las empresas del usuario actual
   * @returns {Promise<Array>} - Lista de empresas
   */
  static async obtenerEmpresas() {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("No hay usuario autenticado en obtenerEmpresas");
        throw new Error("Usuario no autenticado");
      }
      
      try {
        // Primero verificamos si podemos obtener algún documento de la colección
        const empresasRef = collection(db, "empresas");
        const q = query(
          empresasRef, 
          where("creadoPor", "==", user.uid),
          orderBy("fechaCreacionSistema", "desc")
        );
        
        const querySnapshot = await getDocs(q);
        
        const empresas = [];
        
        // Para cada empresa, obtener también el número de departamentos, centros y formaciones
        for (const empresaDoc of querySnapshot.docs) {
          const data = empresaDoc.data();
          
          // Contar departamentos
          const depSnapshot = await getDocs(collection(db, `empresas/${empresaDoc.id}/departamentos`));
          const numDepartamentos = depSnapshot.size;
          
          // Contar centros
          const centrosSnapshot = await getDocs(collection(db, `empresas/${empresaDoc.id}/centros`));
          const numCentros = centrosSnapshot.size;
          
          // Contar formaciones
          const formacionesSnapshot = await getDocs(collection(db, `empresas/${empresaDoc.id}/formaciones`));
          const numFormaciones = formacionesSnapshot.size;
          
          
          empresas.push({
            id: empresaDoc.id,
            ...data,
            fechaCreacion: data.fechaCreacion,
            numDepartamentos, 
            numCentros,
            numFormaciones
          });
        }
        

        return empresas;
      } catch (error) {
        console.error("Error específico al obtener empresas:", error);
        if (error.code) {
          console.error("Código de error Firebase:", error.code);
        }
        console.log("La colección 'empresas' aún no existe o hay un problema de permisos");
        return []; // Retornar array vacío en lugar de fallar
      }
    } catch (error) {
      console.error("Error general al obtener empresas:", error);
      return []; // Retornar array vacío en caso de error
    }
  }

  /**
   * Obtiene los contadores de elementos para el dashboard
   * @returns {Promise<Object>} - Objeto con los contadores
   */
  static async obtenerContadores() {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Usuario no autenticado");
      
      let empresasCount = 0;
      let departamentosCount = 0;
      let centrosCount = 0;
      let formacionesCount = 0;

      try {
        // Contar empresas
        const empresasRef = collection(db, "empresas");
        const empresasQuery = query(empresasRef, where("creadoPor", "==", user.uid));
        const empresasSnapshot = await getDocs(empresasQuery);
        empresasCount = empresasSnapshot.size;
        
        // Para cada empresa, contar sus subcolecciones
        for (const empresaDoc of empresasSnapshot.docs) {
          const empresaId = empresaDoc.id;
          
          // Contar departamentos de esta empresa
          const depSnapshot = await getDocs(collection(db, `empresas/${empresaId}/departamentos`));
          departamentosCount += depSnapshot.size;
          
          // Contar centros de esta empresa
          const centrosSnapshot = await getDocs(collection(db, `empresas/${empresaId}/centros`));
          centrosCount += centrosSnapshot.size;
          
          // Contar formaciones de esta empresa
          const formacionesSnapshot = await getDocs(collection(db, `empresas/${empresaId}/formaciones`));
          formacionesCount += formacionesSnapshot.size;
        }
        
      } catch (error) {
        console.error("Error al contar elementos:", error);
        // No lanzamos error, simplemente dejamos los contadores en 0
      }
      
      return {
        empresasCount,
        departamentosCount,
        centrosCount,
        formacionesCount
      };
    } catch (error) {
      console.error("Error al obtener contadores:", error);
      // Retornar valores por defecto en caso de error
      return {
        empresasCount: 0,
        departamentosCount: 0,
        centrosCount: 0,
        formacionesCount: 0
      };
    }
  }

  /**
   * Elimina una empresa y todas sus subcolecciones
   * @param {string} empresaId - ID de la empresa a eliminar
   * @returns {Promise<void>}
   */
  static async eliminarEmpresa(empresaId) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Usuario no autenticado");
      
      // Verificar que la empresa pertenezca al usuario
      const empresaDoc = await getDoc(doc(db, "empresas", empresaId));
      if (!empresaDoc.exists()) throw new Error("Empresa no encontrada");
      if (empresaDoc.data().creadoPor !== user.uid) throw new Error("No tienes permiso para eliminar esta empresa");
      
      // Eliminar departamentos (subcolección)
      const depSnapshot = await getDocs(collection(db, `empresas/${empresaId}/departamentos`));
      console.log(`Eliminando ${depSnapshot.size} departamentos...`);
      const depPromises = [];
      depSnapshot.forEach((depDoc) => {
        depPromises.push(deleteDoc(doc(db, `empresas/${empresaId}/departamentos/${depDoc.id}`)));
      });
      await Promise.all(depPromises);
      
      // Eliminar centros (subcolección)
      const centrosSnapshot = await getDocs(collection(db, `empresas/${empresaId}/centros`));
      console.log(`Eliminando ${centrosSnapshot.size} centros...`);
      const centrosPromises = [];
      centrosSnapshot.forEach((centroDoc) => {
        centrosPromises.push(deleteDoc(doc(db, `empresas/${empresaId}/centros/${centroDoc.id}`)));
      });
      await Promise.all(centrosPromises);
      
      // Eliminar formaciones (subcolección)
      const formacionesSnapshot = await getDocs(collection(db, `empresas/${empresaId}/formaciones`));
      console.log(`Eliminando ${formacionesSnapshot.size} formaciones...`);
      const formacionesPromises = [];
      formacionesSnapshot.forEach((formacionDoc) => {
        formacionesPromises.push(deleteDoc(doc(db, `empresas/${empresaId}/formaciones/${formacionDoc.id}`)));
      });
      await Promise.all(formacionesPromises);
      
      // Finalmente eliminar la empresa
      console.log(`Eliminando empresa ${empresaId}...`);
      await deleteDoc(doc(db, "empresas", empresaId));
      console.log(`Empresa ${empresaId} eliminada correctamente`);
    } catch (error) {
      console.error("Error al eliminar empresa:", error);
      throw error;
    }
  }

  /**
   * Actualiza una empresa existente
   * @param {string} empresaId - ID de la empresa a actualizar
   * @param {Object} empresaData - Datos actualizados de la empresa
   * @returns {Promise<void>}
   */
  static async actualizarEmpresa(empresaId, empresaData) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Usuario no autenticado");
      
      // Verificar que la empresa pertenezca al usuario
      const empresaDoc = await getDoc(doc(db, "empresas", empresaId));
      if (!empresaDoc.exists()) throw new Error("Empresa no encontrada");
      if (empresaDoc.data().creadoPor !== user.uid) throw new Error("No tienes permiso para editar esta empresa");
      
      // Actualizar datos básicos de la empresa
      const empresaRef = doc(db, "empresas", empresaId);
      
      // Mantener los campos que no deben cambiarse
      const datosOriginales = empresaDoc.data();
      
      const datosActualizados = {
        ...empresaData,
        creadoPor: datosOriginales.creadoPor,
        creadorEmail: datosOriginales.creadorEmail,
        fechaCreacionSistema: datosOriginales.fechaCreacionSistema,
        fechaActualizacion: new Date().toISOString()
      };
      
      console.log("Actualizando empresa con datos:", datosActualizados);
      await updateDoc(empresaRef, datosActualizados);
      console.log(`Empresa ${empresaId} actualizada correctamente`);
      
      return true;
    } catch (error) {
      console.error("Error al actualizar empresa:", error);
      throw error;
    }
  }
  
  /**
   * Actualiza las subcolecciones de una empresa
   * @param {string} empresaId - ID de la empresa
   * @param {Array} departamentos - Lista de departamentos
   * @param {Array} centros - Lista de centros
   * @param {Array} formaciones - Lista de formaciones
   * @returns {Promise<void>}
   */
  static async actualizarSubcolecciones(empresaId, departamentos, centros, formaciones) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Usuario no autenticado");
      
      // Verificar que la empresa pertenezca al usuario
      const empresaDoc = await getDoc(doc(db, "empresas", empresaId));
      if (!empresaDoc.exists()) throw new Error("Empresa no encontrada");
      if (empresaDoc.data().creadoPor !== user.uid) throw new Error("No tienes permiso para editar esta empresa");
      
      const empresaRef = doc(db, "empresas", empresaId);
      
      // Actualizar departamentos
      if (departamentos && departamentos.length > 0) {
        console.log(`Actualizando ${departamentos.length} departamentos...`);
        
        // Primero eliminamos los departamentos existentes
        const depsExistentes = await getDocs(collection(db, `empresas/${empresaId}/departamentos`));
        const eliminacionDeps = [];
        depsExistentes.forEach((depDoc) => {
          eliminacionDeps.push(deleteDoc(doc(db, `empresas/${empresaId}/departamentos/${depDoc.id}`)));
        });
        await Promise.all(eliminacionDeps);
        
        // Luego añadimos los nuevos departamentos
        for (const departamento of departamentos) {
          if (departamento.nombre && departamento.nombre.trim()) {
            const depRef = departamento.id ? 
              doc(db, `empresas/${empresaId}/departamentos/${departamento.id}`) : 
              doc(collection(empresaRef, "departamentos"));
            
            const depData = {
              id: depRef.id,
              nombre: departamento.nombre,
              creadoPor: user.uid
            };
            
            await setDoc(depRef, depData);
            console.log(`Departamento guardado/actualizado: ${depData.nombre} con ID: ${depData.id}`);
          }
        }
      }
      
      // Actualizar centros
      if (centros && centros.length > 0) {
        console.log(`Actualizando ${centros.length} centros...`);
        
        // Primero eliminamos los centros existentes
        const centrosExistentes = await getDocs(collection(db, `empresas/${empresaId}/centros`));
        const eliminacionCentros = [];
        centrosExistentes.forEach((centroDoc) => {
          eliminacionCentros.push(deleteDoc(doc(db, `empresas/${empresaId}/centros/${centroDoc.id}`)));
        });
        await Promise.all(eliminacionCentros);
        
        // Luego añadimos los nuevos centros
        for (const centro of centros) {
          if (centro.nombre && centro.nombre.trim()) {
            const centroRef = centro.id ? 
              doc(db, `empresas/${empresaId}/centros/${centro.id}`) : 
              doc(collection(empresaRef, "centros"));
            
            const centroData = {
              id: centroRef.id,
              nombre: centro.nombre,
              direccion: centro.direccion || "",
              creadoPor: user.uid
            };
            
            await setDoc(centroRef, centroData);
            console.log(`Centro guardado/actualizado: ${centroData.nombre} con ID: ${centroData.id}`);
          }
        }
      }
      
      // Actualizar formaciones
      if (formaciones && formaciones.length > 0) {
        console.log(`Actualizando ${formaciones.length} formaciones...`);
        
        // Primero eliminamos las formaciones existentes
        const formacionesExistentes = await getDocs(collection(db, `empresas/${empresaId}/formaciones`));
        const eliminacionFormaciones = [];
        formacionesExistentes.forEach((formacionDoc) => {
          eliminacionFormaciones.push(deleteDoc(doc(db, `empresas/${empresaId}/formaciones/${formacionDoc.id}`)));
        });
        await Promise.all(eliminacionFormaciones);
        
        // Luego añadimos las nuevas formaciones
        for (const formacion of formaciones) {
          if (formacion.nombre && formacion.nombre.trim()) {
            const formacionRef = formacion.id ? 
              doc(db, `empresas/${empresaId}/formaciones/${formacion.id}`) : 
              doc(collection(empresaRef, "formaciones"));
            
            const formacionData = {
              id: formacionRef.id,
              nombre: formacion.nombre,
              tipo: formacion.tipo || "presencial",
              duracion: formacion.duracion || 0,
              creadoPor: user.uid
            };
            
            await setDoc(formacionRef, formacionData);
            console.log(`Formación guardada/actualizada: ${formacionData.nombre} con ID: ${formacionData.id}`);
          }
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error al actualizar subcolecciones:", error);
      throw error;
    }
  }
  
  /**
   * Obtiene los departamentos de una empresa
   * @param {string} empresaId - ID de la empresa
   * @returns {Promise<Array>} - Lista de departamentos
   */
  static async obtenerDepartamentos(empresaId) {
    try {
      console.log(`Obteniendo departamentos para empresa ${empresaId}`);
      const departamentosRef = collection(db, `empresas/${empresaId}/departamentos`);
      const snapshot = await getDocs(departamentosRef);
      
      const departamentos = [];
      snapshot.forEach(doc => {
        departamentos.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      console.log(`Se encontraron ${departamentos.length} departamentos`);
      return departamentos;
    } catch (error) {
      console.error("Error al obtener departamentos:", error);
      return [];
    }
  }
  
  /**
   * Obtiene los centros de una empresa
   * @param {string} empresaId - ID de la empresa
   * @returns {Promise<Array>} - Lista de centros
   */
  static async obtenerCentros(empresaId) {
    try {
      console.log(`Obteniendo centros para empresa ${empresaId}`);
      const centrosRef = collection(db, `empresas/${empresaId}/centros`);
      const snapshot = await getDocs(centrosRef);
      
      const centros = [];
      snapshot.forEach(doc => {
        centros.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      console.log(`Se encontraron ${centros.length} centros`);
      return centros;
    } catch (error) {
      console.error("Error al obtener centros:", error);
      return [];
    }
  }
  
  /**
   * Obtiene las formaciones de una empresa
   * @param {string} empresaId - ID de la empresa
   * @returns {Promise<Array>} - Lista de formaciones
   */
  static async obtenerFormaciones(empresaId) {
    try {
      console.log(`Obteniendo formaciones para empresa ${empresaId}`);
      const formacionesRef = collection(db, `empresas/${empresaId}/formaciones`);
      const snapshot = await getDocs(formacionesRef);
      
      const formaciones = [];
      snapshot.forEach(doc => {
        formaciones.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      console.log(`Se encontraron ${formaciones.length} formaciones`);
      return formaciones;
    } catch (error) {
      console.error("Error al obtener formaciones:", error);
      return [];
    }
  }
}

export default FirestoreService; 