import { collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where, orderBy, collectionGroup, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import app, { db } from '../firebase';

// Initialize Firestore (ahora usamos db importado directamente)
// const db = getFirestore(app);
const auth = getAuth(app);

// Log para verificar que db se importó correctamente
console.log("FirestoreService: db importado:", !!db, "auth:", !!auth);

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
  esEmpresaGlobal: true,
  fechaCreacionSistema: new Date().toISOString(),
  numDepartamentos: 3,
  numCentros: 2,
  numFormaciones: 3
};

class FirestoreService {
  /**
   * Crea el documento de usuario en Firestore
   * Esta función debe ser llamada después de crear un usuario en Firebase Auth
   * @param {Object} userData - Datos del usuario (uid, email, nombre)
   * @returns {Promise<string>} - ID del usuario en Firestore
   */
  static async crearUsuario(userData) {
    try {
      console.log("🔍 Iniciando método crearUsuario en FirestoreService:", userData);
      
      if (!userData || !userData.uid) {
        console.error("Datos de usuario inválidos para crear en Firestore", userData);
        return null;
      }
      
      console.log("Creando documento de usuario en Firestore. UID:", userData.uid, "Email:", userData.email);
      
      // Verificar que tenemos conexión a Firestore
      if (!db) {
        console.error("No hay conexión a Firestore. db es:", db);
        throw new Error("No hay conexión a Firestore");
      }
      
      // Verificar que la colección usuarios existe
      try {
        console.log("Verificando acceso a la colección 'usuarios'");
        const usuariosRef = collection(db, "usuarios");
        console.log("Referencia a la colección obtenida:", usuariosRef);
      } catch (collectionError) {
        console.error("Error al acceder a la colección 'usuarios':", collectionError);
        throw collectionError;
      }
      
      // Verificar si el usuario ya existe
      try {
        console.log("Verificando si el usuario ya existe en Firestore");
        const userRef = doc(db, "usuarios", userData.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          console.log("El documento de usuario ya existe en Firestore:", userData.uid);
          return userData.uid;
        } else {
          console.log("El usuario no existe, procediendo a crearlo");
        }
      } catch (checkError) {
        console.error("Error al verificar si el usuario existe:", checkError);
        throw checkError;
      }
      
      // Crear el documento de usuario
      try {
        const userCreationDate = new Date().toISOString();
        const userDisplayName = userData.displayName || userData.nombre || userData.email.split('@')[0];
        
        const userDataToSave = {
          uid: userData.uid,
          email: userData.email,
          nombreUsuario: userDisplayName,
          fechaCreacion: userCreationDate,
          fechaUltimoAcceso: userCreationDate,
          estado: userData.emailVerified ? "verificado" : "pendiente",
          rol: "usuario"
        };
        
        console.log("Datos preparados para guardar:", userDataToSave);
        
        const userRef = doc(db, "usuarios", userData.uid);
        console.log("Referencia al documento obtenida:", userRef);
        
        await setDoc(userRef, userDataToSave);
        console.log("✅ Documento de usuario creado en Firestore con ID:", userData.uid);
        
        return userData.uid;
      } catch (createError) {
        console.error("Error específico al crear documento:", createError);
        console.error("Detalles:", createError.code, createError.message, createError.stack);
        throw createError;
      }
    } catch (error) {
      console.error("Error general al crear documento de usuario en Firestore:", error);
      console.error("Detalles:", error.code, error.message, error.stack);
      return null;
    }
  }

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
      
      console.log("Verificando si ya existe la empresa global de Impulsalicante");
      
      // Primero verificar si existe la empresa global con el ID específico
      const empresaGlobalRef = doc(db, "empresas", "impulsalicante_global");
      const empresaGlobalDoc = await getDoc(empresaGlobalRef);
      
      // Si existe la empresa global con el ID correcto, retornar su ID
      if (empresaGlobalDoc.exists()) {
        console.log("✅ La empresa global existe con el ID esperado:", empresaGlobalRef.id);
        return empresaGlobalRef.id;
      }
      
      // Como plan B, verificar si existe alguna empresa marcada como global
      const empresasRef = collection(db, "empresas");
      const q = query(
        empresasRef,
        where("esEmpresaGlobal", "==", true)
      );
      
      const querySnapshot = await getDocs(q);
      
      // Si ya existe una empresa global pero con otro ID, actualizarla
      if (!querySnapshot.empty) {
        const existingDoc = querySnapshot.docs[0];
        console.log("⚠️ La empresa global existe pero con otro ID:", existingDoc.id);
        
        // Migrar datos a la nueva ubicación con ID fijo
        await this.crearEmpresaPorDefectoGlobal();
        
        return "impulsalicante_global";
      }
      
      // Si no existe ninguna empresa global, crearla
      console.log("No se encontró ninguna empresa global, creando una nueva");
      return await this.crearEmpresaPorDefectoGlobal();
    } catch (error) {
      console.error("Error al verificar/crear empresa por defecto:", error);
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
      if (!user) throw new Error("Usuario no autenticado");
      
      // Crear referencia a una nueva empresa
      const empresaRef = doc(collection(db, "empresas"));
      
      // Preparar datos de la empresa
      const empresaData = {
        ...empresa,
        creadoPor: user.uid,
        creadorEmail: user.email,
        fechaCreacionSistema: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString()
      };
      
      // Guardar la empresa
      await setDoc(empresaRef, empresaData);
      
      // Guardar subcolecciones
      if (empresa.departamentos) {
        await this.actualizarSubcolecciones(
          empresaRef.id,
          empresa.departamentos,
          empresa.centros || [],
          empresa.formaciones || []
        );
      }
      
      // Devolver el ID de la empresa creada
      return empresaRef.id;
    } catch (error) {
      console.error("Error al guardar empresa:", error);
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
        return [];
      }

      const empresas = [];
      const empresasRef = collection(db, "empresas");

      // 1. Obtener SIEMPRE la empresa global
      const empresaGlobalRef = doc(empresasRef, "impulsalicante_global");
      const empresaGlobalDoc = await getDoc(empresaGlobalRef);

      if (empresaGlobalDoc.exists()) {
        const data = empresaGlobalDoc.data();
        const depSnapshot = await getDocs(collection(db, `empresas/impulsalicante_global/departamentos`));
        const numDepartamentos = depSnapshot.size;
        const centrosSnapshot = await getDocs(collection(db, `empresas/impulsalicante_global/centros`));
        const numCentros = centrosSnapshot.size;
        const formacionesSnapshot = await getDocs(collection(db, `empresas/impulsalicante_global/formaciones`));
        const numFormaciones = formacionesSnapshot.size;

        empresas.push({
          id: "impulsalicante_global",
          ...data,
          fechaCreacion: data.fechaCreacion,
          numDepartamentos,
          numCentros,
          numFormaciones,
          perteneceAlUsuarioActual: true, // Para que se muestre en el frontend
          esEmpresaGlobal: true,
          esCompartida: true,
          sharedByAllUsers: true
        });
      }

      // 2. Obtener las empresas personales del usuario
      const qPersonal = query(
        empresasRef,
        where("creadoPor", "==", user.uid),
        where("esEmpresaGlobal", "==", false)
      );
      const querySnapshotPersonal = await getDocs(qPersonal);

      querySnapshotPersonal.forEach((doc) => {
        const data = doc.data();
        empresas.push({
          id: doc.id,
          ...data,
          perteneceAlUsuarioActual: true
        });
      });

      return empresas;
    } catch (error) {
      console.error("Error al obtener empresas:", error);
      return [];
    }
  }

  /**
   * Obtiene una empresa específica por su ID
   * @param {string} empresaId - ID de la empresa a obtener
   * @returns {Promise<Object>} - Datos de la empresa
   */
  static async obtenerEmpresa(empresaId) {
    try {
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
      
      const empresaData = empresaDoc.data();
      
      // Si es una empresa global, permitir acceso a todos
      if (empresaData.esEmpresaGlobal) {
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
          perteneceAlUsuarioActual: true,
          esEmpresaGlobal: true
        };
      }
      
      // Para empresas no globales, verificar que pertenece al usuario
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
   * @param {Object} datos - Datos actualizados de la empresa
   * @returns {Promise<void>}
   */
  static async actualizarEmpresa(empresaId, datos) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Usuario no autenticado");
      
      // Verificar que la empresa exista
      const empresaRef = doc(db, "empresas", empresaId);
      const empresaDoc = await getDoc(empresaRef);
      
      if (!empresaDoc.exists()) throw new Error("Empresa no encontrada");
      
      // Si NO es la empresa global, verificar que el usuario tenga permisos
      if (empresaId !== "impulsalicante_global" && empresaDoc.data().creadoPor !== user.uid) {
        throw new Error("No tienes permiso para editar esta empresa");
      }
      
      // Mantener los campos que no deben cambiarse
      const datosOriginales = empresaDoc.data();
      
      // Crear objeto con los datos actualizados
      const datosActualizados = {
        ...datosOriginales,  // Mantener todos los datos originales
        ...datos,           // Sobrescribir con los nuevos datos
        fechaActualizacion: new Date().toISOString(),
        ultimaActualizacionPor: user.uid,
        ultimaActualizacionEmail: user.email
      };
      
      // Para la empresa global, asegurar que mantenga sus propiedades especiales
      if (empresaId === "impulsalicante_global") {
        datosActualizados.esEmpresaGlobal = true;
        datosActualizados.esCompartida = true;
        datosActualizados.sharedByAllUsers = true;
      } else {
        // Para empresas normales, mantener el creador original
        datosActualizados.creadoPor = datosOriginales.creadoPor;
        datosActualizados.creadorEmail = datosOriginales.creadorEmail;
        datosActualizados.fechaCreacionSistema = datosOriginales.fechaCreacionSistema;
      }
      
      console.log("Actualizando empresa con datos:", datosActualizados);
      
      // Actualizar el documento usando setDoc con merge
      await setDoc(empresaRef, datosActualizados, { merge: true });
      
      // Verificar que la actualización fue exitosa
      const empresaActualizada = await getDoc(empresaRef);
      if (!empresaActualizada.exists()) {
        throw new Error("Error al verificar la actualización");
      }
      
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
      
      // Verificar que la empresa exista
      const empresaDoc = await getDoc(doc(db, "empresas", empresaId));
      if (!empresaDoc.exists()) throw new Error("Empresa no encontrada");
      
      // Si NO es la empresa global, verificar que el usuario tenga permisos
      if (empresaId !== "impulsalicante_global" && empresaDoc.data().creadoPor !== user.uid) {
        throw new Error("No tienes permiso para editar esta empresa");
      }
      
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
              creadoPor: user.uid,
              ultimaActualizacionPor: user.uid,
              fechaActualizacion: new Date().toISOString()
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
              creadoPor: user.uid,
              ultimaActualizacionPor: user.uid,
              fechaActualizacion: new Date().toISOString()
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
              creadoPor: user.uid,
              ultimaActualizacionPor: user.uid,
              fechaActualizacion: new Date().toISOString()
            };
            
            await setDoc(formacionRef, formacionData);
          }
        }
      }
      
      // Actualizar la fecha de modificación en el documento principal de la empresa
      await updateDoc(empresaRef, { 
        fechaActualizacion: new Date().toISOString(),
        ultimaActualizacionPor: user.uid,
        ultimaActualizacionEmail: user.email
      });
      
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

  /**
   * Crea la empresa por defecto global que será compartida por todos los usuarios
   * @returns {Promise<string>} - ID de la empresa global
   */
  static async crearEmpresaPorDefectoGlobal() {
    try {
      // Verificar que hay un usuario autenticado
      const user = auth.currentUser;
      if (!user) {
        console.error("No hay usuario autenticado para crear empresa global");
        return null;
      }
      
      console.log("Creando empresa global compartida para todos los usuarios");
      
      // Crear la empresa global con ID fijo
      const empresasRef = collection(db, "empresas");
      const empresaDoc = doc(empresasRef, "impulsalicante_global");
      
      // Verificar si ya existe
      const empresaDocSnap = await getDoc(empresaDoc);
      if (empresaDocSnap.exists()) {
        console.log("✅ La empresa global ya existe, actualizando sus propiedades...");
        // Actualizar para asegurar que tiene las propiedades correctas
        await updateDoc(empresaDoc, {
          esEmpresaGlobal: true,
          esCompartida: true,
          sharedByAllUsers: true,
          updatedAt: new Date().toISOString(),
          ultimaActualizacionPor: user.uid,
          ultimaActualizacionEmail: user.email,
          creadoPor: user.uid, // Mantener el creador original
          creadorEmail: user.email
        });
        return empresaDoc.id;
      }
      
      // Preparar datos de la empresa global
      const empresaData = {
        ...EMPRESA_POR_DEFECTO,
        id: "impulsalicante_global",
        nombre: "Impulsalicante (Compartida)",
        descripcion: "Empresa compartida para todos los usuarios de la plataforma. Las modificaciones que realices serán visibles para todos.",
        creadoPor: user.uid,
        creadorEmail: user.email,
        fechaCreacionSistema: new Date().toISOString(),
        esEmpresaGlobal: true,
        esCompartida: true,
        sharedByAllUsers: true,
        ultimaActualizacionPor: user.uid,
        ultimaActualizacionEmail: user.email,
        updatedAt: new Date().toISOString(),
        usuariosCompartidos: ["*"] // Marcar como compartida con todos los usuarios
      };
      
      // Guardar la empresa global
      await setDoc(empresaDoc, empresaData);
      console.log("✅ Empresa global compartida creada con ID:", empresaDoc.id);
      
      // Crear departamentos
      for (const depto of EMPRESA_POR_DEFECTO.departamentos) {
        const deptoRef = doc(collection(empresaDoc, "departamentos"));
        await setDoc(deptoRef, {
          id: deptoRef.id,
          nombre: depto.nombre,
          creadoPor: user.uid,
          esCompartido: true,
          esGlobal: true,
          usuariosCompartidos: ["*"]
        });
      }
      
      // Crear centros
      for (const centro of EMPRESA_POR_DEFECTO.centros) {
        const centroRef = doc(collection(empresaDoc, "centros"));
        await setDoc(centroRef, {
          id: centroRef.id,
          nombre: centro.nombre,
          direccion: centro.direccion || "",
          creadoPor: user.uid,
          esCompartido: true,
          esGlobal: true,
          usuariosCompartidos: ["*"]
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
          creadoPor: user.uid,
          esCompartido: true,
          esGlobal: true,
          usuariosCompartidos: ["*"]
        });
      }
      
      return empresaDoc.id;
    } catch (error) {
      console.error("Error al crear empresa global compartida:", error);
      return null;
    }
  }
}

export default FirestoreService; 