import EmpresaService from './EmpresaService';

/**
 * Composable para manejar la visualización de detalles de una empresa.
 * @param {Ref<boolean>} showViewModal - Ref que controla la visibilidad del modal de vista.
 */
export function useEmpresaViewer(showViewModal) {
  /**
   * Carga los datos de la empresa en EmpresaService.empresaActual,
   * obtiene las subcolecciones y muestra el modal de vista.
   * @param {Object} empresa - Objeto empresa con al menos la propiedad id.
   */
  const verEmpresa = async (empresa) => {
    try {
      // Limpiar datos previos
      Object.assign(EmpresaService.empresaActual, {
        id: '',
        nombre: '',
        fechaCreacion: '',
        descripcion: '',
        ciudad: '',
        departamentos: [],
        centros: [],
        formaciones: []
      });

      // Asignar propiedades básicas
      Object.assign(EmpresaService.empresaActual, {
        id: empresa.id,
        nombre: empresa.nombre,
        fechaCreacion: empresa.fechaCreacion,
        descripcion: empresa.descripcion || '',
        ciudad: empresa.ciudad || ''
      });

      // Cargar subcolecciones para vista
      await EmpresaService.cargarSubcoleccionesParaVista(empresa.id);

      // Mostrar el modal de vista
      showViewModal.value = true;
    } catch (error) {
      console.error('Error al cargar detalles de la empresa:', error);
      EmpresaService.error = 'No se pudieron cargar los detalles de la empresa. Por favor, inténtalo de nuevo.';
    }
  };

  return { verEmpresa };
}
