import html2pdf from 'html2pdf.js';
import { crearPlantillaPDF } from '../utils/PlantillaPDF';
import Chart from 'chart.js/auto';

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
      
      // Obtener la plantilla HTML
      console.log("Obteniendo plantilla HTML...");
      let plantillaHTML;
      try {
        plantillaHTML = await crearPlantillaPDF();
        console.log("Plantilla HTML obtenida correctamente");
      } catch (templateError) {
        console.error("Error al crear la plantilla HTML:", templateError);
        throw new Error("No se pudo crear la plantilla HTML base");
      }
      
      // Crear un contenedor para el HTML
      const container = document.createElement('div');
      container.innerHTML = plantillaHTML;
      
      // Rellenar datos
      this.rellenarDatosEmpresa(container, empresa);
      
      // Generar gráficos
      await this.generarGraficosEstadisticos(container, empresa);
      
      // Convertir HTML a PDF
      console.log("Convirtiendo HTML a PDF...");
      try {
        // Configuración para html2pdf
        const options = {
          margin: [15, 15, 15, 15], // top, right, bottom, left
          filename: `informe_${empresa.nombre}.pdf`,
          image: { 
            type: 'jpeg', 
            quality: 1.0 
          },
          html2canvas: { 
            scale: 2, 
            useCORS: true,
            logging: false,
            letterRendering: true,
            allowTaint: true,
            backgroundColor: '#FFFFFF',
            windowWidth: 210 * 3.78, // Para asegurar que se vea correctamente a tamaño A4
            x: 0,
            y: 0
          },
          jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait',
            compress: true,
            hotfixes: ['px_scaling'],
            precision: 16
          },
          pagebreak: { mode: ['avoid-all', 'css', 'legacy'], after: '.page' }
        };
        
        // Desactivar inputs para que html2pdf los renderice correctamente
        this.desactivarControlesFormulario(container);
        
        // Añadir el contenedor al DOM (necesario para html2pdf)
        document.body.appendChild(container);
        
        // Esperar a que las imágenes y gráficos carguen
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Generar PDF
        const pdf = await html2pdf()
          .from(container)
          .set(options)
          .toPdf()
          .output('arraybuffer');
        
        // Limpiar
        document.body.removeChild(container);
        
        // Convertir a Uint8Array
        const pdfBytes = new Uint8Array(pdf);
        console.log("PDF generado correctamente con un tamaño de", pdfBytes.length, "bytes");
        
        return pdfBytes;
      } catch (pdfError) {
        console.error("Error al generar PDF desde HTML:", pdfError);
        // Si el contenedor fue añadido al DOM, asegurarse de quitarlo
        if (container.parentNode) {
          document.body.removeChild(container);
        }
        throw new Error("Error al generar el documento PDF final");
      }
    } catch (error) {
      console.error('Error al generar el informe de empresa:', error);
      throw error;
    }
  }
  
  /**
   * Rellena los datos de la empresa en el HTML
   * @param {HTMLElement} container - Contenedor con el HTML
   * @param {Object} empresa - Datos de la empresa
   */
  rellenarDatosEmpresa(container, empresa) {
    try {
      console.log("Rellenando datos de la empresa en el HTML...");
      
      // Rellenar campos básicos
      this.establecerValorInput(container, 'empresa-nombre', empresa.nombre);
      this.establecerValorInput(container, 'empresa-nombre-info', empresa.nombre);
      this.establecerValorInput(container, 'empresa-fecha', this.formatDate(empresa.fechaCreacion));
      this.establecerValorInput(container, 'empresa-ciudad', empresa.ciudad);
      this.establecerValorInput(container, 'empresa-descripcion', empresa.descripcion || 'No se ha proporcionado una descripción para esta empresa.');
      
      // Rellenar departamentos
      if (empresa.departamentos && empresa.departamentos.length > 0) {
        empresa.departamentos.forEach((dept, index) => {
          if (index < 10) { // Máximo 10 departamentos en la plantilla
            this.establecerValorInput(container, `departamento-${index}`, dept.nombre);
          }
        });
        
        // Ocultar departamentos vacíos
        const departamentosItems = container.querySelectorAll('.departamento-item');
        for (let i = empresa.departamentos.length; i < departamentosItems.length; i++) {
          departamentosItems[i].style.display = 'none';
        }
      } else {
        // Si no hay departamentos, mostrar solo el primero con mensaje
        const departamentosItems = container.querySelectorAll('.departamento-item');
        if (departamentosItems.length > 0) {
          const primerInput = departamentosItems[0].querySelector('input');
          if (primerInput) {
            primerInput.value = 'No hay departamentos registrados';
            primerInput.style.fontStyle = 'italic';
            primerInput.style.color = '#999';
          }
          
          // Ocultar el resto
          for (let i = 1; i < departamentosItems.length; i++) {
            departamentosItems[i].style.display = 'none';
          }
        }
      }
      
      // Rellenar centros
      if (empresa.centros && empresa.centros.length > 0) {
        empresa.centros.forEach((centro, index) => {
          if (index < 8) { // Máximo 8 centros en la plantilla
            this.establecerValorInput(container, `centro-${index}-nombre`, centro.nombre);
            this.establecerValorInput(container, `centro-${index}-direccion`, centro.direccion || 'Dirección no especificada');
          }
        });
        
        // Ocultar centros vacíos
        const centrosItems = container.querySelectorAll('.centro-item');
        for (let i = empresa.centros.length; i < centrosItems.length; i++) {
          centrosItems[i].style.display = 'none';
        }
      } else {
        // Si no hay centros, mostrar mensaje
        const centrosContainer = container.querySelector('#centros-container');
        if (centrosContainer) {
          centrosContainer.innerHTML = '<div class="empty-item">No hay centros registrados</div>';
        }
      }
      
      // Rellenar formaciones
      if (empresa.formaciones && empresa.formaciones.length > 0) {
        empresa.formaciones.forEach((formacion, index) => {
          if (index < 6) { // Máximo 6 formaciones en la plantilla
            this.establecerValorInput(container, `formacion-${index}-nombre`, formacion.nombre);
            this.establecerValorSelect(container, `formacion-${index}-tipo`, this.formatTipoFormacion(formacion.tipo));
            this.establecerValorInput(container, `formacion-${index}-duracion`, `${formacion.duracion || 0} horas`);
          }
        });
        
        // Ocultar formaciones vacías
        const formacionesItems = container.querySelectorAll('.formacion-item');
        for (let i = empresa.formaciones.length; i < formacionesItems.length; i++) {
          formacionesItems[i].style.display = 'none';
        }
      } else {
        // Si no hay formaciones, mostrar mensaje
        const formacionesContainer = container.querySelector('#formaciones-container');
        if (formacionesContainer) {
          formacionesContainer.innerHTML = '<div class="empty-item">No hay formaciones registradas</div>';
        }
      }
      
      console.log("Datos de la empresa rellenados correctamente en el HTML");
    } catch (error) {
      console.error("Error al rellenar datos de la empresa:", error);
      // Continuamos a pesar del error
    }
  }
  
  /**
   * Establece el valor en un elemento de formulario por su ID
   * @param {HTMLElement} container - Elemento contenedor
   * @param {string} id - ID del elemento
   * @param {string} valor - Valor a establecer
   */
  establecerValorInput(container, id, valor) {
    const elemento = container.querySelector(`#${id}`);
    if (elemento) {
      elemento.value = valor || 'No especificado';
    } else {
      console.warn(`No se encontró el elemento con ID: ${id}`);
    }
  }
  
  /**
   * Establece el valor en un elemento select por su ID
   * @param {HTMLElement} container - Elemento contenedor
   * @param {string} id - ID del elemento select
   * @param {string} valor - Valor a seleccionar
   */
  establecerValorSelect(container, id, valor) {
    const select = container.querySelector(`#${id}`);
    if (select) {
      // Buscar la opción correspondiente
      const opciones = Array.from(select.options);
      const opcion = opciones.find(opt => opt.value === valor || opt.textContent === valor);
      
      if (opcion) {
        select.value = opcion.value;
      } else if (opciones.length > 0) {
        // Si no encontramos la opción exacta pero hay opciones, seleccionamos la primera no vacía
        const primeraOpcion = opciones.find(opt => opt.value) || opciones[0];
        select.value = primeraOpcion.value;
      }
    } else {
      console.warn(`No se encontró el select con ID: ${id}`);
    }
  }
  
  /**
   * Desactiva los controles de formulario para que html2pdf los renderice correctamente
   * @param {HTMLElement} container - Contenedor con el HTML
   */
  desactivarControlesFormulario(container) {
    // Convertir inputs a elementos con estilo de input pero que sean div
    const inputs = container.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      const valor = input.value || '';
      const placeholder = input.placeholder || '';
      
      // Crear un div con el mismo estilo
      const div = document.createElement('div');
      div.className = input.className;
      div.style.minHeight = window.getComputedStyle(input).height;
      div.style.padding = '8px 10px';
      div.style.border = '1px solid #ddd';
      div.style.borderRadius = '4px';
      div.style.backgroundColor = 'white';
      div.style.boxShadow = 'inset 0 1px 3px rgba(0,0,0,0.05)';
      div.style.width = '100%';
      div.style.fontFamily = 'inherit';
      div.style.fontSize = '14px';
      div.style.color = valor ? '#333' : '#999';
      div.style.overflow = 'hidden';
      div.textContent = valor || placeholder;
      
      // Reemplazar el input con el div
      input.parentNode.replaceChild(div, input);
    });
  }
  
  /**
   * Genera los gráficos estadísticos basados en los datos de la empresa
   * @param {HTMLElement} container - Contenedor con el HTML
   * @param {Object} empresa - Datos de la empresa
   */
  async generarGraficosEstadisticos(container, empresa) {
    try {
      // Esta función se ejecuta después de que los gráficos son generados por el script incluido
      // No hacemos nada aquí porque los gráficos ya se renderizan con datos de ejemplo
      console.log("Los gráficos se generarán con datos predefinidos");
    } catch (error) {
      console.error("Error al generar gráficos estadísticos:", error);
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
        throw new Error("El PDF generado está vacío.");
      }
      
      // Crear blob con los bytes del PDF
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      
      // Crear URL para el blob
      const url = window.URL.createObjectURL(blob);
      
      // Crear enlace para descargar
      const a = document.createElement('a');
      a.href = url;
      a.download = nombreArchivo || 'informe.pdf';
      document.body.appendChild(a);
      
      // Hacer clic en el enlace para iniciar la descarga
      a.click();
      
      // Limpiar
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      console.log("Descarga de PDF iniciada correctamente");
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
      console.log("Generando URL para previsualización de PDF...");
      
      if (!pdfBytes || pdfBytes.length === 0) {
        console.error("Error: No hay datos de PDF para previsualizar");
        throw new Error("No hay datos de PDF para previsualizar");
      }
      
      // Crear blob con los bytes del PDF
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      
      // Crear URL para el blob
      const url = window.URL.createObjectURL(blob);
      
      console.log("URL de previsualización generada correctamente");
      return url;
    } catch (error) {
      console.error("Error al generar URL de previsualización:", error);
      throw error;
    }
  }
}

export default new PDFService(); 