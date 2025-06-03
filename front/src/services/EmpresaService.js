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
          fechaActualizacion: new Date().toISOString(),
          memoriaAnual: empresaData.memoriaAnual || {}
        };
        await FirestoreService.actualizarEmpresa(empresaEditandoId, datosActualizados);
        await FirestoreService.actualizarSubcolecciones(
          empresaEditandoId,
          empresaData.departamentos,
          empresaData.centros,
          empresaData.formaciones
        );
        return empresaEditandoId;
      } else {
        // Crear nueva empresa
        const nuevaEmpresaData = {
          nombre: empresaData.nombre,
          fechaCreacion: empresaData.fechaCreacion,
          descripcion: empresaData.descripcion || "",
          ciudad: empresaData.ciudad || "",
          fechaCreacionSistema: new Date().toISOString(),
          fechaActualizacion: new Date().toISOString(),
          esEmpresaGlobal: false,
          memoriaAnual: {
            agenciaLocal: {
              estado: 'pendiente',
              general: {
                cifras: {
                  presupuestoInicial: 0,
                  presupuestoAjustado: 0,
                  presupuestoEjecutado: 0,
                  porcentajeEjecucion: 0,
                  totalUsuarios: 0,
                  nuevosUsuarios: 0,
                  personasOrientacion: 0,
                  actividadesFormativas: 0,
                  horasOrientacion: 0,
                  horasFormacion: 0,
                  ofertasEmpleo: 0,
                  participantesFormacion: 0,
                  puestosGenerados: 0,
                  asesoramientos: 0,
                  personasContratadas: 0,
                  empresasCreadas: 0,
                  empresasViveros: 0,
                  ayudasEmpresas: 0,
                  ayudasEntidades: 0
                }
              },
              queHacemos: {},
              estructura: {},
              sedes: {
                recursosHumanos: [],
                recursosMateriales: [],
                recursosFinancieros: {
                  presupuestoTotal: 0,
                  fuentes: []
                }
              }
            },
            empleoFormacion: {
              estado: 'pendiente',
              datos: {
                programasOrientacion: [],
                programasInsercion: [],
                colaboracionesEmpresas: []
              },
              centros: {
                cursos: [],
                talleres: []
              },
              servicios: {
                totalPersonasAtendidas: 0,
                totalPersonasInsertadas: 0,
                totalCursosImpartidos: 0,
                totalTalleresImpartidos: 0,
                totalHorasFormacion: 0,
                personasMenores25: 0,
                personasEntre25y45: 0,
                personasMayores45: 0,
                contratosIndefinidos: 0,
                contratosTemporales: 0,
                contratosFormacion: 0,
                otrosContratos: 0
              },
              formacion: {},
              programas: {},
              subvenciones: {},
              otros: {}
            },
            promocionEconomica: {
              estado: 'pendiente',
              programas: {
                programas: [],
                proyectos: []
              },
              viveros: {},
              ayudasEconomicas: {
                empresas: [],
                emprendedores: []
              },
              colaboracion: {
                numeroEmpresas: 0,
                numeroEmprendedores: 0,
                inversionTotal: 0,
                empleosCreados: 0,
                sectores: [],
                logros: '',
                dificultades: '',
                lecciones: ''
              }
            },
            desarrolloLocal: {
              estado: 'pendiente',
              programa: {
                descripcionGeneral: '',
                periodoInversion: '',
                importeInversion: '',
                areasAmpliacion: [],
                mejoras: [],
                entidades: [],
                proyectos: [],
                proyectosTramitados: '',
                presupuestoEjecucion: '',
                puestosEjecucion: '',
                puestosFinalizacion: ''
              },
              observatorio: {},
              alicanteFutura: {
                lineasTrabajo: []
              },
              alia: {
                nProyectos: 0,
                nEmpleos: 0,
                nEmpleosDirectos: 0,
                inversionPotencial: 0,
                notasDinamicas: 0,
                informeBimensual: 0,
                radarInversiones: 0,
                participacion: [],
                actividades: 0
              },
              cilab: {},
              oficinaProyEuropeos: {
                indicadores: [],
                logrosAlcanzados: '',
                dificultades: '',
                leccionesAprendidas: '',
                impactoSocial: '',
                impactoEconomico: '',
                impactoAmbiental: ''
              },
              participacion: {}
            },
            gestion: {
              estado: 'pendiente',
              auditorio: {},
              juridica: {
                contratos: []
              }
            },
            marketing: {
              estado: 'pendiente',
              webRRSS: {
                seguidoresInstagram: 0,
                publicacionesInstagram: 0,
                seguidoresYoutube: 0,
                publicacionesYoutube: 0,
                seguidoresLinkedin: 0,
                publicacionesLinkedin: 0
              },
              canales: {},
              campanas: {}
            }
          }
        };
        const empresaId = await FirestoreService.guardarEmpresa(nuevaEmpresaData);
        await FirestoreService.actualizarSubcolecciones(
          empresaId,
          empresaData.departamentos,
          empresaData.centros,
          empresaData.formaciones
        );
        return empresaId;
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