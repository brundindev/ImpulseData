import { PDFDocument } from 'pdf-lib';
import { crearPlantillaPDF } from '../utils/PlantillaPDF';

class PDFService {
  /**
   * Genera un PDF utilizando la plantilla con la información de la empresa
   * @param {Object} empresa - Objeto con datos de la empresa
   * @returns {Promise<Uint8Array>} - Bytes del PDF generado
   */
  async generarInformeEmpresa(empresa) {
    try {
      console.log("Iniciando generación del informe de empresa:", empresa.nombre);
      
      // Verificar que la empresa tenga campos básicos
      if (!empresa || !empresa.nombre) {
        console.error("Datos de empresa insuficientes para generar el informe");
        throw new Error("Datos de empresa insuficientes");
      }
      
      // Obtener la plantilla del PDF
      console.log("Obteniendo plantilla PDF...");
      let plantillaBytes;
      try {
        plantillaBytes = await crearPlantillaPDF();
        console.log("Plantilla PDF obtenida correctamente");
      } catch (templateError) {
        console.error("Error al crear la plantilla PDF:", templateError);
        throw new Error("No se pudo crear la plantilla PDF base");
      }
      
      // Cargar el PDF para modificarlo
      console.log("Cargando PDF para modificar...");
      let pdfDoc;
      try {
        pdfDoc = await PDFDocument.load(plantillaBytes);
        console.log("PDF cargado correctamente para modificar");
      } catch (loadError) {
        console.error("Error al cargar el PDF para modificar:", loadError);
        throw new Error("No se pudo cargar el documento PDF para edición");
      }
      
      // Obtener el formulario
      console.log("Obteniendo formulario del PDF...");
      const form = pdfDoc.getForm();
      
      // Rellenar campos básicos de la empresa
      console.log("Rellenando campos básicos...");
      try {
        const campoNombre = form.getTextField('empresa.nombre');
        if (campoNombre) {
          campoNombre.setText(empresa.nombre || '');
          console.log("Campo nombre rellenado: ", empresa.nombre);
        } else {
          console.warn("Campo 'empresa.nombre' no encontrado en el PDF");
        }
        
        const campoFecha = form.getTextField('empresa.fecha');
        if (campoFecha) {
          campoFecha.setText(this.formatDate(empresa.fechaCreacion) || '');
          console.log("Campo fecha rellenado: ", this.formatDate(empresa.fechaCreacion));
        } else {
          console.warn("Campo 'empresa.fecha' no encontrado en el PDF");
        }
        
        const campoCiudad = form.getTextField('empresa.ciudad');
        if (campoCiudad) {
          campoCiudad.setText(empresa.ciudad || '');
          console.log("Campo ciudad rellenado: ", empresa.ciudad);
        } else {
          console.warn("Campo 'empresa.ciudad' no encontrado en el PDF");
        }
        
        const campoDescripcion = form.getTextField('empresa.descripcion');
        if (campoDescripcion) {
          campoDescripcion.setText(empresa.descripcion || '');
          console.log("Campo descripción rellenado");
        } else {
          console.warn("Campo 'empresa.descripcion' no encontrado en el PDF");
        }
      } catch (camposError) {
        console.error("Error al rellenar campos básicos:", camposError);
        // Continuamos aunque algunos campos fallen
      }
      
      // Rellenar departamentos
      console.log("Procesando departamentos...");
      if (empresa.departamentos && empresa.departamentos.length > 0) {
        try {
          empresa.departamentos.forEach((dept, index) => {
            if (index < 10) { // Máximo 10 departamentos en la plantilla
              try {
                const campoDept = form.getTextField(`departamento.${index}`);
                if (campoDept) {
                  campoDept.setText(dept.nombre || '');
                  console.log(`Departamento ${index} rellenado: ${dept.nombre}`);
                } else {
                  console.warn(`Campo 'departamento.${index}' no encontrado en el PDF`);
                }
              } catch (deptError) {
                console.warn(`Error al rellenar departamento ${index}:`, deptError);
              }
            }
          });
        } catch (deptsError) {
          console.error("Error al procesar departamentos:", deptsError);
        }
      } else {
        console.log("No hay departamentos para procesar");
      }
      
      // Rellenar centros
      console.log("Procesando centros...");
      if (empresa.centros && empresa.centros.length > 0) {
        try {
          empresa.centros.forEach((centro, index) => {
            if (index < 8) { // Máximo 8 centros en la plantilla
              try {
                const campoNombreCentro = form.getTextField(`centro.${index}.nombre`);
                if (campoNombreCentro) {
                  campoNombreCentro.setText(centro.nombre || '');
                  console.log(`Centro ${index} nombre rellenado: ${centro.nombre}`);
                }
                
                const campoDireccionCentro = form.getTextField(`centro.${index}.direccion`);
                if (campoDireccionCentro) {
                  campoDireccionCentro.setText(centro.direccion || '');
                  console.log(`Centro ${index} dirección rellenada`);
                }
              } catch (centroError) {
                console.warn(`Error al rellenar centro ${index}:`, centroError);
              }
            }
          });
        } catch (centrosError) {
          console.error("Error al procesar centros:", centrosError);
        }
      } else {
        console.log("No hay centros para procesar");
      }
      
      // Rellenar formaciones
      console.log("Procesando formaciones...");
      if (empresa.formaciones && empresa.formaciones.length > 0) {
        try {
          empresa.formaciones.forEach((formacion, index) => {
            if (index < 6) { // Máximo 6 formaciones en la plantilla
              try {
                const campoNombreFormacion = form.getTextField(`formacion.${index}.nombre`);
                if (campoNombreFormacion) {
                  campoNombreFormacion.setText(formacion.nombre || '');
                  console.log(`Formación ${index} nombre rellenado: ${formacion.nombre}`);
                }
                
                try {
                  const campoTipoFormacion = form.getDropdown(`formacion.${index}.tipo`);
                  if (campoTipoFormacion) {
                    // Convertir tipo a formato capitalizado
                    const tipoCapitalizado = this.formatTipoFormacion(formacion.tipo);
                    campoTipoFormacion.select(tipoCapitalizado);
                    console.log(`Formación ${index} tipo seleccionado: ${tipoCapitalizado}`);
                  }
                } catch (tipoError) {
                  console.warn(`Error al seleccionar tipo de formación ${index}:`, tipoError);
                }
                
                const campoDuracionFormacion = form.getTextField(`formacion.${index}.duracion`);
                if (campoDuracionFormacion) {
                  campoDuracionFormacion.setText(`${formacion.duracion || 0} horas`);
                  console.log(`Formación ${index} duración rellenada: ${formacion.duracion} horas`);
                }
              } catch (formacionError) {
                console.warn(`Error al rellenar formación ${index}:`, formacionError);
              }
            }
          });
        } catch (formacionesError) {
          console.error("Error al procesar formaciones:", formacionesError);
        }
      } else {
        console.log("No hay formaciones para procesar");
      }
      
      // Aplanar el formulario para que no sea editable (opcional)
      // form.flatten();
      
      // Guardar el PDF con los datos
      console.log("Guardando PDF final...");
      try {
        const pdfBytes = await pdfDoc.save();
        console.log("PDF generado correctamente con un tamaño de", pdfBytes.length, "bytes");
        return pdfBytes;
      } catch (saveError) {
        console.error("Error al guardar el PDF final:", saveError);
        throw new Error("Error al guardar el documento PDF final");
      }
    } catch (error) {
      console.error('Error al generar el informe de empresa:', error);
      throw error;
    }
  }
  
  /**
   * Formatea una fecha en formato ISO a formato legible
   * @param {string} fecha - Fecha en formato ISO o string
   * @returns {string} - Fecha formateada
   */
  formatDate(fecha) {
    if (!fecha) return 'No especificada';
    
    try {
      const date = new Date(fecha);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      return fecha.toString();
    }
  }
  
  /**
   * Formatea el tipo de formación para mostrarlo correctamente
   * @param {string} tipo - Tipo de formación (presencial, virtual, hibrida)
   * @returns {string} - Tipo formateado
   */
  formatTipoFormacion(tipo) {
    if (!tipo) return 'No especificado';
    
    const tiposFormateados = {
      'presencial': 'Presencial',
      'virtual': 'Virtual',
      'hibrida': 'Híbrida'
    };
    
    return tiposFormateados[tipo.toLowerCase()] || tipo;
  }
  
  /**
   * Guarda el PDF en el dispositivo del usuario
   * @param {Uint8Array} pdfBytes - Bytes del PDF
   * @param {string} nombreArchivo - Nombre del archivo a guardar
   */
  guardarPDF(pdfBytes, nombreArchivo) {
    try {
      console.log("Iniciando descarga de PDF...");
      
      // Verificar los datos recibidos
      if (!pdfBytes || pdfBytes.length === 0) {
        console.error("Error: PDF vacío");
        throw new Error("Los datos del PDF están vacíos");
      }
      
      // Crear un blob con los bytes del PDF
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      console.log(`Blob creado: ${blob.size} bytes`);
      
      // Crear una URL para el blob
      const url = URL.createObjectURL(blob);
      
      // Crear un enlace temporal
      const link = document.createElement('a');
      link.href = url;
      link.download = nombreArchivo || 'documento.pdf';
      
      // Añadir el enlace al DOM y hacer clic automáticamente
      document.body.appendChild(link);
      console.log("Iniciando descarga...");
      link.click();
      
      // Limpiar recursos
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        console.log("Descarga finalizada y recursos liberados");
      }, 100);
    } catch (error) {
      console.error("Error al guardar el PDF:", error);
      throw error;
    }
  }
  
  /**
   * Genera una URL para previsualizar el PDF
   * @param {Uint8Array} pdfBytes - Bytes del PDF
   * @returns {string} - URL para previsualizar el PDF
   */
  generarURLPreview(pdfBytes) {
    try {
      console.log("Generando URL para previsualización...");
      
      // Verificar los datos recibidos
      if (!pdfBytes || pdfBytes.length === 0) {
        console.error("Error: PDF vacío");
        throw new Error("Los datos del PDF están vacíos");
      }
      
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      console.log(`Blob de previsualización creado: ${blob.size} bytes`);
      
      const url = URL.createObjectURL(blob);
      console.log("URL de previsualización generada:", url);
      return url;
    } catch (error) {
      console.error("Error al generar URL para previsualización:", error);
      throw error;
    }
  }
}

export default new PDFService(); 