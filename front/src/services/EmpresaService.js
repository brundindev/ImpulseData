import { ref, reactive } from 'vue';
import FirestoreService from './FirestoreService';
import PDFService from './PDFService';

class EmpresaService {
  static nuevaEmpresa = reactive({
    nombre: '',
    fechaCreacion: '',
    descripcion: '',
    ciudad: '',
    departamentos: [],
    centros: [],
    formaciones: []
  });

  static empresaActual = reactive({
    id: '',
    nombre: '',
    fechaCreacion: '',
    descripcion: '',
    ciudad: '',
    departamentos: [],
    centros: [],
    formaciones: []
  });

  static resetearFormulario() {
    Object.assign(this.nuevaEmpresa, {
      nombre: '',
      fechaCreacion: '',
      descripcion: '',
      ciudad: '',
      departamentos: [],
      centros: [],
      formaciones: []
    });
  }

  static async guardarEmpresa(empresaData, modoEdicion, empresaEditandoId) {
    try {
      if (modoEdicion && empresaEditandoId) {
        // Actualizar empresa existente
        const datosActualizados = {
          nombre: empresaData.nombre,
          descripcion: empresaData.descripcion || "",
          fechaCreacion: empresaData.fechaCreacion,
          ciudad: empresaData.ciudad || "",
          fechaActualizacion: new Date().toISOString()
        };
        
        await FirestoreService.actualizarEmpresa(empresaEditandoId, datosActualizados);
        await FirestoreService.actualizarSubcolecciones(
          empresaEditandoId,
          empresaData.departamentos,
          empresaData.centros,
          empresaData.formaciones
        );
      } else {
        // Crear nueva empresa
        const nuevaEmpresaData = {
          nombre: empresaData.nombre,
          fechaCreacion: empresaData.fechaCreacion,
          descripcion: empresaData.descripcion || "",
          ciudad: empresaData.ciudad || "",
          fechaCreacionSistema: new Date().toISOString(),
          fechaActualizacion: new Date().toISOString()
        };

        const empresaId = await FirestoreService.guardarEmpresa(nuevaEmpresaData);
        await FirestoreService.actualizarSubcolecciones(
          empresaId,
          empresaData.departamentos,
          empresaData.centros,
          empresaData.formaciones
        );
      }
    } catch (error) {
      console.error('Error al guardar empresa:', error);
      throw error;
    }
  }

  static async cargarSubcolecciones(empresaId) {
    try {
      // Cargar departamentos
      const departamentos = await FirestoreService.obtenerDepartamentos(empresaId);
      this.nuevaEmpresa.departamentos = departamentos.length > 0 ? departamentos : [];

      // Cargar centros
      const centros = await FirestoreService.obtenerCentros(empresaId);
      this.nuevaEmpresa.centros = centros.length > 0 ? centros : [];

      // Cargar formaciones
      const formaciones = await FirestoreService.obtenerFormaciones(empresaId);
      this.nuevaEmpresa.formaciones = formaciones.length > 0 ? formaciones : [];
    } catch (error) {
      console.error('Error al cargar subcolecciones:', error);
      throw error;
    }
  }

  static async cargarSubcoleccionesParaVista(empresaId) {
    try {
      // Cargar departamentos
      const departamentos = await FirestoreService.obtenerDepartamentos(empresaId);
      this.empresaActual.departamentos = departamentos;

      // Cargar centros
      const centros = await FirestoreService.obtenerCentros(empresaId);
      this.empresaActual.centros = centros;

      // Cargar formaciones
      const formaciones = await FirestoreService.obtenerFormaciones(empresaId);
      this.empresaActual.formaciones = formaciones;
    } catch (error) {
      console.error('Error al cargar subcolecciones para vista:', error);
      throw error;
    }
  }

  static async eliminarEmpresa(empresaId) {
    try {
      await FirestoreService.eliminarEmpresa(empresaId);
    } catch (error) {
      console.error('Error al eliminar empresa:', error);
      throw error;
    }
  }

  static formatTipoFormacion(tipo) {
    switch (tipo) {
      case 'presencial':
        return 'Presencial';
      case 'virtual':
        return 'Virtual';
      case 'hibrida':
        return 'Híbrida';
      default:
        return tipo;
    }
  }

  static formatDate(date) {
    if (!date) return 'N/A';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    return dateObj.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}

export default EmpresaService; 