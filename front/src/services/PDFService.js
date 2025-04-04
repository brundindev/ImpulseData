import { crearPlantillaPDF } from '../utils/PlantillaPDF';
import html2pdf from 'html2pdf.js';

class PDFService {
  constructor() {
    // Creamos un elemento para mostrar un spinner durante la generación
    this.overlay = null;
  }

  /**
   * Muestra un overlay con un spinner mientras se genera el PDF
   */
  mostrarOverlayGeneracion() {
    // Crear overlay si no existe
    if (!this.overlay) {
      this.overlay = document.createElement('div');
      this.overlay.style.position = 'fixed';
      this.overlay.style.top = '0';
      this.overlay.style.left = '0';
      this.overlay.style.width = '100%';
      this.overlay.style.height = '100%';
      this.overlay.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
      this.overlay.style.display = 'flex';
      this.overlay.style.justifyContent = 'center';
      this.overlay.style.alignItems = 'center';
      this.overlay.style.zIndex = '9999';
      
      // Crear spinner
      const spinner = document.createElement('div');
      spinner.style.width = '40px';
      spinner.style.height = '40px';
      spinner.style.border = '4px solid rgba(0, 70, 152, 0.2)';
      spinner.style.borderTop = '4px solid rgba(0, 70, 152, 0.8)';
      spinner.style.borderRadius = '50%';
      spinner.style.animation = 'spin 1s linear infinite';
      
      // Añadir estilo para la animación
      const style = document.createElement('style');
      style.textContent = `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
      
      this.overlay.appendChild(spinner);
      
      // Mensaje de generación
      const mensaje = document.createElement('div');
      mensaje.textContent = 'Generando PDF...';
      mensaje.style.marginLeft = '15px';
      mensaje.style.fontFamily = 'Arial, sans-serif';
      mensaje.style.color = '#004698';
      mensaje.style.fontWeight = 'bold';
      
      this.overlay.appendChild(mensaje);
    }
    
    // Añadir al DOM
    document.body.appendChild(this.overlay);
    
    // Bloquear scroll
    document.body.style.overflow = 'hidden';
  }
  
  /**
   * Oculta el overlay de generación
   */
  ocultarOverlayGeneracion() {
    if (this.overlay && this.overlay.parentNode) {
      document.body.removeChild(this.overlay);
      document.body.style.overflow = '';
    }
  }

  /**
   * Genera un PDF utilizando html2pdf con la información de la empresa
   * @param {Object} empresa - Objeto con datos de la empresa
   * @returns {Promise<Uint8Array>} - Bytes del PDF generado
   */
  async generarInformeEmpresa(empresa) {
    try {
      // Mostrar overlay durante la generación
      this.mostrarOverlayGeneracion();
      
      console.log("Iniciando generación del informe de empresa:", empresa.nombre);
      
      // Obtener la plantilla HTML
      console.log("Obteniendo plantilla HTML...");
      let plantillaHTML;
      try {
        plantillaHTML = await crearPlantillaPDF();
        console.log("Plantilla HTML obtenida correctamente");
      } catch (templateError) {
        console.error("Error al crear la plantilla HTML:", templateError);
        this.ocultarOverlayGeneracion();
        throw new Error("No se pudo crear la plantilla HTML base");
      }

      // SOLUCIÓN FINAL: USAR HTML2PDF DIRECTAMENTE CON OUTPUTPDF
      console.log("Usando método directo con outputPdf");
      
      // Crear un iframe para aislar el renderizado
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.top = '0';
      iframe.style.left = '0';
      iframe.style.width = '793px'; // Ancho A4 en px
      iframe.style.height = '1122px'; // Alto A4 en px
      iframe.style.border = 'none';
      iframe.style.zIndex = '10000';
      
      // Hacerlo visible para debugging si es necesario
      // Normalmente debería estar oculto, pero esto puede ayudar a ver qué sucede
      // iframe.style.opacity = '0.2'; 
      iframe.style.visibility = 'hidden';
      
      // Añadir al DOM
      document.body.appendChild(iframe);
      
      // Acceder al documento del iframe
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      
      // Escribir el HTML directamente
      iframeDoc.open();
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <title>PDF</title>
            <style>
              body { 
                margin: 15mm; 
                padding: 0; 
                background: white; 
                width: 793px;
                font-family: Arial, sans-serif;
                color: #000;
              }
              * {
                box-sizing: border-box;
              }
              .page { 
                page-break-after: always; 
                break-after: page;
                margin: 0;
                padding: 0;
                width: 100%;
                background: white;
                border: none;
                box-shadow: none;
                min-height: 1122px; /* Altura mínima de página A4 */
                height: auto;
                position: relative;
                overflow: hidden;
              }
              .page:first-child {
                margin-top: 10mm;
              }
              .page:last-child {
                page-break-after: auto;
                break-after: auto;
              }
              img {
                max-width: 100%;
                height: auto;
                display: block;
              }
              /* Evitar elementos huérfanos al final de una página */
              p, h1, h2, h3, h4, h5, h6 {
                page-break-inside: avoid;
                break-inside: avoid;
                margin-top: 5mm;
                margin-bottom: 5mm;
              }
              /* Evitar saltos de página dentro de secciones críticas */
              .no-break {
                page-break-inside: avoid;
                break-inside: avoid;
              }
            </style>
          </head>
          <body>${plantillaHTML}</body>
        </html>
      `);
      iframeDoc.close();
      
      // Esperar a que todo se cargue
      await new Promise(resolve => {
        iframe.onload = resolve;
        setTimeout(resolve, 1000); // Timeout como respaldo
      });
      
      // Reemplazar imágenes problemáticas
      const imagenes = iframeDoc.querySelectorAll('img');
      imagenes.forEach(img => {
        if (!img.src || 
            img.src === '' || 
            img.src === 'about:blank' || 
            img.src.startsWith('http://localhost/') || 
            img.src.startsWith('/')) {
          img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
        }
      });
      
      // Dar tiempo para que se carguen las imágenes
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Configuración mínima para html2pdf
      const opciones = {
        margin: 0,
        filename: `informe_${empresa.nombre}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 1, 
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#FFFFFF',
          removeContainer: false
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait',
          compress: true,
          hotfixes: ["px_scaling"]
        },
        pagebreak: { 
          mode: 'avoid-all', 
          before: '.page', 
          avoid: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', '.no-break']
        }
      };
      
      // Usar el método outputPdf directamente
      try {
        console.log("Generando PDF con outputPdf...");
        
        // Utilizar outputPdf directamente con el body del iframe
        const pdfData = await html2pdf()
          .from(iframeDoc.body)
          .set(opciones)
          .outputPdf('arraybuffer');
        
        if (!pdfData) {
          throw new Error("No se generaron datos PDF");
        }
        
        console.log("PDF generado correctamente con outputPdf");
        
        // Convertir a Uint8Array
        const pdfBytes = new Uint8Array(pdfData);
        
        // Limpiar iframe
        document.body.removeChild(iframe);
        
        // Ocultar overlay
        this.ocultarOverlayGeneracion();
        
        return pdfBytes;
      } catch (pdfError) {
        console.error("Error al generar PDF con outputPdf:", pdfError);
        
        // ÚLTIMO RECURSO: Descargar directamente
        try {
          console.log("Intentando guardar directamente el PDF...");
          
          // Usar el método save() directamente
          await html2pdf()
            .from(iframeDoc.body)
            .set(opciones)
            .save();
          
          console.log("PDF guardado directamente");
          
          // Para la vista previa, devolvemos un PDF vacío pequeño
          const emptyPdf = new Uint8Array(100);
          
          // Limpiar iframe
          document.body.removeChild(iframe);
          
          // Ocultar overlay
          this.ocultarOverlayGeneracion();
          
          return emptyPdf;
        } catch (saveError) {
          console.error("Error también al guardar directamente:", saveError);
          
          // ÚLTIMO RECURSO EXTREMO: Abrir ventana de impresión
          const printWindow = window.open('', '_blank');
          if (printWindow) {
            printWindow.document.write(`
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="UTF-8">
                  <title>Memoria de Actividad - Impulsalicante</title>
                  <style>
                    @media print {
                      body { margin: 0; padding: 0; }
                      .page { page-break-after: always; }
                    }
                  </style>
                </head>
                <body>${plantillaHTML}</body>
              </html>
            `);
            printWindow.document.close();
            
            // Esperar y mostrar el diálogo de impresión
            setTimeout(() => {
              printWindow.print();
            }, 1000);
            
            // Limpiar iframe
            document.body.removeChild(iframe);
            
            // Ocultar overlay
            this.ocultarOverlayGeneracion();
            
            return new Uint8Array(100); // PDF vacío para la vista previa
          }
          
          // Si todo falla, limpiamos y lanzamos el error
          document.body.removeChild(iframe);
          this.ocultarOverlayGeneracion();
          throw new Error("No se pudo generar el PDF con ningún método");
        }
      }
    } catch (error) {
      console.error('Error general al generar el informe:', error);
      this.ocultarOverlayGeneracion();
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
            if (index < 5) { // Máximo 5 departamentos en la nueva plantilla
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
            if (index < 3) { // Máximo 3 centros en la nueva plantilla
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
            if (index < 3) { // Máximo 3 formaciones en la nueva plantilla
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
   * Genera una URL para previsualizar el PDF
   * @param {Uint8Array} pdfBytes - Bytes del PDF
   * @returns {string} - URL para visualizar el PDF
   */
  generarURLPreview(pdfBytes) {
    try {
      console.log("Generando URL para previsualización de PDF...");
      
      if (!pdfBytes || pdfBytes.length === 0) {
        console.error("Error: No hay datos de PDF para previsualizar");
        // Asegurarnos de ocultar el overlay
        this.ocultarOverlayGeneracion();
        throw new Error("No hay datos de PDF para previsualizar");
      }
      
      // Crear blob con los bytes del PDF
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      
      // Crear URL para el blob
      const url = URL.createObjectURL(blob);
      
      // Ocultar el overlay una vez generada la URL
      this.ocultarOverlayGeneracion();
      
      console.log("URL de previsualización generada correctamente");
      return url;
    } catch (error) {
      console.error("Error al generar URL de previsualización:", error);
      // Asegurarnos de ocultar el overlay en caso de error
      this.ocultarOverlayGeneracion();
      throw error;
    }
  }
  
  /**
   * Guarda el PDF en el dispositivo del usuario
   * @param {Uint8Array} pdfBytes - Bytes del PDF
   * @param {string} nombreArchivo - Nombre del archivo a guardar
   */
  guardarPDF(pdfBytes, nombreArchivo) {
    try {
      console.log("Iniciando descarga de PDF...", nombreArchivo);
      
      // Verificar los datos recibidos
      if (!pdfBytes) {
        console.error("Error: No hay datos de PDF para descargar");
        this.ocultarOverlayGeneracion();
        throw new Error("No hay datos de PDF para descargar");
      }
      
      if (pdfBytes.length === 0) {
        console.error("Error: PDF vacío (0 bytes)");
        this.ocultarOverlayGeneracion();
        throw new Error("El PDF generado está vacío.");
      }
      
      // Crear blob con los bytes del PDF
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      
      // Verificar que el blob tenga contenido
      if (blob.size === 0) {
        console.error("Error: Blob del PDF vacío");
        this.ocultarOverlayGeneracion();
        throw new Error("Error al procesar el PDF para descarga.");
      }
      
      // Crear URL para el blob
      const url = URL.createObjectURL(blob);
      
      // Crear enlace para descargar
      const a = document.createElement('a');
      a.href = url;
      a.download = nombreArchivo || 'informe.pdf';
      a.style.display = 'none';
      document.body.appendChild(a);
      
      console.log("Enlace de descarga creado, iniciando descarga...");
      
      // Hacer clic en el enlace para iniciar la descarga
      a.click();
      
      // Limpiar
      setTimeout(() => {
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
        console.log("Descarga de PDF completada y recursos limpiados");
      }, 500); // Aumentamos el tiempo para asegurar que se complete la descarga
      
      // Ocultar el overlay una vez completada la descarga
      this.ocultarOverlayGeneracion();
      
      return true; // Indicar éxito
    } catch (error) {
      console.error("Error al guardar el PDF:", error);
      // Asegurarnos de ocultar el overlay en caso de error
      this.ocultarOverlayGeneracion();
      throw error;
    }
  }
}

export default new PDFService(); 