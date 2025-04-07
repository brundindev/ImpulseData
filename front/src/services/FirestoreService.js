// Import Firebase
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where, orderBy, collectionGroup, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import app from '../firebase';

// Initialize Firestore
const db = getFirestore(app);
const auth = getAuth(app);

// Definir una empresa por defecto para todos los usuarios
const EMPRESA_POR_DEFECTO = {
  id: "empresa-default-universal",
  nombre: "Impulsalicante",
  descripcion: "Esta es una empresa que se encarga de impulsar la actividad empresarial en la provincia de Alicante.",
  fechaCreacion: new Date().toISOString(),
  ciudad: "Alicante",
  departamentos: [
    { id: "dep-1", nombre: "Innovación" },
    { id: "dep-2", nombre: "Desarrollo Digital" },
    { id: "dep-3", nombre: "Emprendimiento" }
  ],
  centros: [
    { id: "centro-1", nombre: "Centro de Emprendimiento", direccion: "Av. de Elche, 3, 03008 Alicante" },
    { id: "centro-2", nombre: "Digital Hub", direccion: "Plaza Seneca, 2, 03001 Alicante" }
  ],
  formaciones: [
    { id: "form-1", nombre: "Taller de Marketing Digital", tipo: "presencial", duracion: 20 },
    { id: "form-2", nombre: "Desarrollo Web para Empresas", tipo: "virtual", duracion: 40 },
    { id: "form-3", nombre: "Gestión de Proyectos Tecnológicos", tipo: "hibrida", duracion: 30 }
  ],
  // Metadatos adicionales
  esEmpresaPorDefecto: true,
  fechaCreacionSistema: new Date().toISOString(),
  numDepartamentos: 3,
  numCentros: 2,
  numFormaciones: 3
};

class FirestoreService {
  /**
   * Crea la empresa por defecto para un usuario específico si no existe ya
   * Esta función se debe llamar después de que un usuario se autentique
   * @returns {Promise<string>} - ID de la empresa por defecto
   */
  static async crearEmpresaPorDefecto() {
    try {
      // Verificar que hay un usuario autenticado
      const user = auth.currentUser;
      if (!user) {
        console.error("No hay usuario autenticado para crear empresa por defecto");
        return null;
      }
      
      console.log("Verificando si ya existe la empresa por defecto para:", user.email);
      
      // Verificar si ya existe la empresa por defecto para este usuario
      const empresasRef = collection(db, "empresas");
      const q = query(
        empresasRef,
        where("creadoPor", "==", user.uid),
        where("esEmpresaPorDefecto", "==", true)
      );
      
      const querySnapshot = await getDocs(q);
      
      // Si ya existe, retornar su ID
      if (!querySnapshot.empty) {
        const existingDoc = querySnapshot.docs[0];
        console.log("La empresa por defecto ya existe con ID:", existingDoc.id);
        return existingDoc.id;
      }
      
      // Si no existe, crear la empresa por defecto
      console.log("Creando empresa por defecto para:", user.email);
      const empresaDoc = doc(empresasRef);
      const empresaId = empresaDoc.id;
      
      // Preparar datos de la empresa por defecto con el ID y usuario actual
      const empresaData = {
        ...EMPRESA_POR_DEFECTO,
        id: empresaId,
        nombre: "Impulsalicante",
        creadoPor: user.uid,
        creadorEmail: user.email,
        fechaCreacionSistema: new Date().toISOString(),
        esEmpresaPorDefecto: true
      };
      
      // Guardar la empresa por defecto
      await setDoc(empresaDoc, empresaData);
      console.log("✅ Empresa por defecto creada con ID:", empresaId);
      
      // Crear departamentos
      for (const depto of EMPRESA_POR_DEFECTO.departamentos) {
        const deptoRef = doc(collection(empresaDoc, "departamentos"));
        await setDoc(deptoRef, {
          id: deptoRef.id,
          nombre: depto.nombre,
          creadoPor: user.uid
        });
      }
      
      // Crear centros
      for (const centro of EMPRESA_POR_DEFECTO.centros) {
        const centroRef = doc(collection(empresaDoc, "centros"));
        await setDoc(centroRef, {
          id: centroRef.id,
          nombre: centro.nombre,
          direccion: centro.direccion || "",
          creadoPor: user.uid
        });
      }
      
      // Crear formaciones
      for (const formacion of EMPRESA_POR_DEFECTO.formaciones) {
        const formacionRef = doc(collection(empresaDoc, "formaciones"));
        await setDoc(formacionRef, {
          id: formacionRef.id,
          nombre: formacion.nombre,
          tipo: formacion.tipo || "presencial",
          duracion: formacion.duracion || 0,
          creadoPor: user.uid
        });
      }
      
      console.log("✅ Todos los datos de la empresa por defecto creados correctamente");
      return empresaId;
    } catch (error) {
      console.error("Error al crear empresa por defecto:", error);
      return null;
    }
  }

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
      // Verificar si hay usuario autenticado
      let user = auth.currentUser;
      
      // Si no hay usuario pero hay token JWT y UID almacenado, intentar usar el UID directamente
      if (!user) {
        console.warn("No hay usuario de Firebase en obtenerEmpresas, verificando alternativas");
        const jwtToken = localStorage.getItem('authToken');
        const storedUid = sessionStorage.getItem('firebaseUid');
        
        if (jwtToken && storedUid) {
          
          try {
            // Primera consulta: verificar y obtener la colección de empresas usando el UID almacenado
            const empresasRef = collection(db, "empresas");
            
            // Asegurar que estamos filtrando por el UID almacenado
            const q = query(
              empresasRef, 
              where("creadoPor", "==", storedUid)
            );
            
            const querySnapshot = await getDocs(q);
            console.log(`Consulta completada usando UID almacenado. Documentos encontrados: ${querySnapshot.size}`);
            
            if (querySnapshot.size > 0) {
              const empresas = [];
              const empresasIds = [];
              
              // Filtrar estrictamente los documentos que pertenecen al usuario
              for (const empresaDoc of querySnapshot.docs) {
                const data = empresaDoc.data();
                
                if (data.creadoPor === storedUid) {
                  console.log(`Empresa encontrada: ${data.nombre} (ID: ${empresaDoc.id}) - Creada por: ${data.creadoPor}`);
                  
                  // Verificar si ya hemos procesado esta empresa (evitar duplicados)
                  if (empresasIds.includes(empresaDoc.id)) {
                    console.warn(`Empresa duplicada detectada y omitida: ${empresaDoc.id}`);
                    continue;
                  }
                  
                  empresasIds.push(empresaDoc.id);
                  
                  // Contar departamentos
                  const depSnapshot = await getDocs(collection(db, `empresas/${empresaDoc.id}/departamentos`));
                  const numDepartamentos = depSnapshot.size;
                  
                  // Contar centros
                  const centrosSnapshot = await getDocs(collection(db, `empresas/${empresaDoc.id}/centros`));
                  const numCentros = centrosSnapshot.size;
                  
                  // Contar formaciones
                  const formacionesSnapshot = await getDocs(collection(db, `empresas/${empresaDoc.id}/formaciones`));
                  const numFormaciones = formacionesSnapshot.size;
                  
                  // Agregar empresa
                  empresas.push({
                    id: empresaDoc.id,
                    ...data,
                    fechaCreacion: data.fechaCreacion,
                    numDepartamentos, 
                    numCentros,
                    numFormaciones,
                    // Marcar explícitamente como propiedad del usuario actual
                    perteneceAlUsuarioActual: true
                  });
                }
              }
              
              // Añadir la empresa por defecto al inicio del arreglo
              empresas.unshift({...EMPRESA_POR_DEFECTO, perteneceAlUsuarioActual: true});
              
              return empresas;
            } else {
              console.log("No se encontraron empresas usando el UID almacenado");
              // Retornar solo la empresa por defecto si no hay otras
              return [{ ...EMPRESA_POR_DEFECTO, perteneceAlUsuarioActual: true }];
            }
          } catch (error) {
            console.error("Error al intentar obtener empresas usando UID almacenado:", error);
          }
          
          // Si llegamos aquí, falló el intento con UID almacenado, intentar recuperar la sesión
          try {
            // Importar FirebaseAuthService para usar reautenticar
            const FirebaseAuthService = await import('./FirebaseAuthService').then(module => module.default);
            await FirebaseAuthService.reautenticar();
            
            // Verificar si se recuperó el usuario
            user = auth.currentUser;
            if (user) {
              console.log("Sesión de Firebase recuperada exitosamente:", user.email);
            } else {
              console.warn("No se pudo recuperar sesión de Firebase tras reautenticación");
            }
          } catch (authError) {
            console.error("Error al intentar recuperar sesión:", authError);
          }
        }
      }
      
      // Si después de intentar recuperar todavía no hay usuario, retornar la empresa por defecto
      if (!user) {
        console.error("No hay usuario autenticado en obtenerEmpresas");
        
        // En lugar de fallar, retornamos la empresa por defecto
        return [{ ...EMPRESA_POR_DEFECTO, perteneceAlUsuarioActual: true }];
      }
      
      try {
        // Primera consulta: verificar y obtener la colección de empresas
        const empresasRef = collection(db, "empresas");
        
        // Asegurar que estamos filtrando por el usuario actual
        const q = query(
          empresasRef, 
          where("creadoPor", "==", user.uid)
        );
        
        const querySnapshot = await getDocs(q);
        
        const empresas = [];
        const empresasIds = [];
        
        // Filtrar estrictamente los documentos que pertenecen al usuario actual
        for (const empresaDoc of querySnapshot.docs) {
          const data = empresaDoc.data();
          
          if (data.creadoPor === user.uid) {
            console.log(`Empresa encontrada: ${data.nombre} (ID: ${empresaDoc.id}) - Creada por: ${data.creadoPor}`);
            
            // Verificar si ya hemos procesado esta empresa (evitar duplicados)
            if (empresasIds.includes(empresaDoc.id)) {
              console.warn(`Empresa duplicada detectada y omitida: ${empresaDoc.id}`);
              continue;
            }
            
            empresasIds.push(empresaDoc.id);
            
            // Contar departamentos, centros y formaciones
            const depSnapshot = await getDocs(collection(db, `empresas/${empresaDoc.id}/departamentos`));
            const numDepartamentos = depSnapshot.size;
            
            const centrosSnapshot = await getDocs(collection(db, `empresas/${empresaDoc.id}/centros`));
            const numCentros = centrosSnapshot.size;
            
            const formacionesSnapshot = await getDocs(collection(db, `empresas/${empresaDoc.id}/formaciones`));
            const numFormaciones = formacionesSnapshot.size;
            
            // Agregar empresa
            empresas.push({
              id: empresaDoc.id,
              ...data,
              fechaCreacion: data.fechaCreacion,
              numDepartamentos, 
              numCentros,
              numFormaciones,
              // Marcar explícitamente como propiedad del usuario actual
              perteneceAlUsuarioActual: true
            });
          }
        }
        
        // Añadir la empresa por defecto al inicio del arreglo
        empresas.unshift({...EMPRESA_POR_DEFECTO, perteneceAlUsuarioActual: true});
        
        return empresas;
      } catch (error) {
        console.error("Error al obtener empresas:", error);
        
        // Si hay un error, al menos retornamos la empresa por defecto
        return [{ ...EMPRESA_POR_DEFECTO, perteneceAlUsuarioActual: true }];
      }
    } catch (error) {
      console.error("Error general en obtenerEmpresas:", error);
      
      // Si hay un error general, retornamos la empresa por defecto
      return [{ ...EMPRESA_POR_DEFECTO, perteneceAlUsuarioActual: true }];
    }
  }

  /**
   * Obtiene una empresa específica por su ID
   * @param {string} empresaId - ID de la empresa a obtener
   * @returns {Promise<Object>} - Datos de la empresa
   */
  static async obtenerEmpresa(empresaId) {
    try {
      // Si se solicita la empresa por defecto, retornarla directamente
      if (empresaId === EMPRESA_POR_DEFECTO.id) {
        return { ...EMPRESA_POR_DEFECTO };
      }
      
      // Verificar usuario autenticado
      const user = auth.currentUser;
      if (!user) {
        throw new Error("Usuario no autenticado");
      }
      
      // Obtener documento de la empresa
      const empresaDoc = await getDoc(doc(db, "empresas", empresaId));
      
      if (!empresaDoc.exists()) {
        throw new Error(`No se encontró la empresa con ID: ${empresaId}`);
      }
      
      // Verificar que la empresa pertenece al usuario
      const empresaData = empresaDoc.data();
      if (empresaData.creadoPor !== user.uid) {
        throw new Error("No tienes permiso para acceder a esta empresa");
      }
      
      // Obtener departamentos de la empresa
      const departamentos = await this.obtenerDepartamentos(empresaId);
      
      // Obtener centros de la empresa
      const centros = await this.obtenerCentros(empresaId);
      
      // Obtener formaciones de la empresa
      const formaciones = await this.obtenerFormaciones(empresaId);
      
      // Retornar todos los datos
      return {
        id: empresaDoc.id,
        ...empresaData,
        departamentos,
        centros,
        formaciones,
        perteneceAlUsuarioActual: true
      };
    } catch (error) {
      console.error(`Error al obtener empresa ${empresaId}:`, error);
      throw error;
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
          const data = empresaDoc.data();
          
          // Verificar que la empresa realmente pertenece al usuario actual
          if (data.creadoPor === user.uid) {
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
      const depPromises = [];
      depSnapshot.forEach((depDoc) => {
        depPromises.push(deleteDoc(doc(db, `empresas/${empresaId}/departamentos/${depDoc.id}`)));
      });
      await Promise.all(depPromises);
      
      // Eliminar centros (subcolección)
      const centrosSnapshot = await getDocs(collection(db, `empresas/${empresaId}/centros`));
      const centrosPromises = [];
      centrosSnapshot.forEach((centroDoc) => {
        centrosPromises.push(deleteDoc(doc(db, `empresas/${empresaId}/centros/${centroDoc.id}`)));
      });
      await Promise.all(centrosPromises);
      
      // Eliminar formaciones (subcolección)
      const formacionesSnapshot = await getDocs(collection(db, `empresas/${empresaId}/formaciones`));
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
      
      await updateDoc(empresaRef, datosActualizados);
      
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
          }
        }
      }
      
      // Actualizar centros
      if (centros && centros.length > 0) {
        
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
          }
        }
      }
      
      // Actualizar formaciones
      if (formaciones && formaciones.length > 0) {
        
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
      const departamentosRef = collection(db, `empresas/${empresaId}/departamentos`);
      const snapshot = await getDocs(departamentosRef);
      
      const departamentos = [];
      snapshot.forEach(doc => {
        departamentos.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
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
      const centrosRef = collection(db, `empresas/${empresaId}/centros`);
      const snapshot = await getDocs(centrosRef);
      
      const centros = [];
      snapshot.forEach(doc => {
        centros.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
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
      const formacionesRef = collection(db, `empresas/${empresaId}/formaciones`);
      const snapshot = await getDocs(formacionesRef);
      
      const formaciones = [];
      snapshot.forEach(doc => {
        formaciones.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return formaciones;
    } catch (error) {
      console.error("Error al obtener formaciones:", error);
      return [];
    }
  }
}

export default FirestoreService; 