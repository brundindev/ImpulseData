import { ref, reactive } from 'vue';
import FirestoreService from './FirestoreService';
import PDFService from './PDFService';

class EmpresaService {
  constructor() {
    this.nuevaEmpresa = reactive({
      nombre: '',
      fechaCreacion: '',
      descripcion: '',
      ciudad: '',
      departamentos: [{ nombre: '' }],
      centros: [{ nombre: '', direccion: '' }],
      formaciones: [{ nombre: '', tipo: 'presencial', duracion: 8 }],
      contratos: [{ nombre: '', fechaInicio: '', fechaFin: '', tipo: 'presencial', duracion: 8 }]
    });

    this.empresaActual = reactive({
      id: '',
      nombre: '',
      fechaCreacion: '',
      descripcion: '',
      ciudad: '',
      departamentos: [],
      centros: [],
      formaciones: []
    });
  }

  resetearFormulario() {
    this.nuevaEmpresa.nombre = '';
    this.nuevaEmpresa.fechaCreacion = '';
    this.nuevaEmpresa.descripcion = '';
    this.nuevaEmpresa.ciudad = '';
    this.nuevaEmpresa.departamentos = [{ nombre: '' }];
    this.nuevaEmpresa.centros = [{ nombre: '', direccion: '' }];
    this.nuevaEmpresa.formaciones = [{ nombre: '', tipo: 'presencial', duracion: 8 }];
  }

  async guardarEmpresa(empresaData, modoEdicion, empresaEditandoId) {
    try {
      if (modoEdicion && empresaEditandoId) {
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
        const nuevaEmpresaData = {
          nombre: empresaData.nombre,
          fechaCreacion: empresaData.fechaCreacion,
          descripcion: empresaData.descripcion || "",
          ciudad: empresaData.ciudad || "",
          fechaCreacionSistema: new Date().toISOString(),
          fechaActualizacion: new Date().toISOString(),
          departamentos: empresaData.departamentos || [{ nombre: '' }],
          centros: empresaData.centros || [{ nombre: '', direccion: '' }],
          formaciones: empresaData.formaciones || [{ nombre: '', tipo: 'presencial', duracion: 8 }]
        };

        return await FirestoreService.guardarEmpresa(nuevaEmpresaData);
      }
    } catch (err) {
      console.error('Error al guardar empresa:', err);
      throw err;
    }
  }

  async cargarSubcolecciones(empresaId) {
    try {
      const [departamentos, centros, formaciones] = await Promise.all([
        FirestoreService.obtenerDepartamentos(empresaId),
        FirestoreService.obtenerCentros(empresaId),
        FirestoreService.obtenerFormaciones(empresaId)
      ]);

      this.nuevaEmpresa.departamentos = departamentos.length ? departamentos : [{ nombre: '' }];
      this.nuevaEmpresa.centros = centros.length ? centros : [{ nombre: '', direccion: '' }];
      this.nuevaEmpresa.formaciones = formaciones.length ? formaciones : [{ nombre: '', tipo: 'presencial', duracion: 8 }];
    } catch (error) {
      console.error("Error al cargar subcolecciones:", error);
      throw error;
    }
  }

  async cargarSubcoleccionesParaVista(empresaId) {
    try {
      const [departamentos, centros, formaciones] = await Promise.all([
        FirestoreService.obtenerDepartamentos(empresaId),
        FirestoreService.obtenerCentros(empresaId),
        FirestoreService.obtenerFormaciones(empresaId)
      ]);

      this.empresaActual.departamentos = departamentos;
      this.empresaActual.centros = centros;
      this.empresaActual.formaciones = formaciones;
    } catch (error) {
      console.error("Error al cargar subcolecciones para vista:", error);
      throw error;
    }
  }

  async eliminarEmpresa(empresaId) {
    try {
      await FirestoreService.eliminarEmpresa(empresaId);
    } catch (err) {
      console.error('Error al eliminar empresa:', err);
      throw err;
    }
  }

  formatTipoFormacion(tipo) {
    const tipos = {
      presencial: 'Presencial',
      virtual: 'Virtual',
      hibrida: 'Híbrida'
    };
    return tipos[tipo] || tipo;
  }

  formatDate(date) {
    if (!date) return 'N/A';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}

export default new EmpresaService(); 