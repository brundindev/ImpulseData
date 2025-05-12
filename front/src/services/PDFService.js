import { crearPlantillaPDF } from '../utils/PlantillaPDF';
import html2pdf from 'html2pdf.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import CloudinaryService from './CloudinaryService';

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

      // Crear un iframe para aislar el renderizado
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.top = '0';
      iframe.style.left = '0';
      iframe.style.width = '793px'; // Ancho A4 en px
      iframe.style.height = '1122px'; // Alto A4 en px
      iframe.style.border = 'none';
      iframe.style.zIndex = '10000';
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
              /* Forzar saltos de página en títulos principales */
              h1, h2, section, .section {
                page-break-before: always;
                break-before: page;
              }
              /* Primera sección sin salto de página */
              body > h1:first-child, 
              body > h2:first-child, 
              body > section:first-child, 
              body > .section:first-child {
                page-break-before: auto;
                break-before: auto;
              }
              /* Evitar saltos de página dentro de secciones críticas */
              .no-break {
                page-break-inside: avoid;
                break-inside: avoid;
              }
              /* Forzar que cada elemento con ID propio comience en una nueva página */
              [id] {
                page-break-before: always;
                break-before: page;
              }
              /* Excepto los primeros elementos con ID */
              body > [id]:first-child {
                page-break-before: auto;
                break-before: auto;
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

      try {
        console.log("Generando PDF con método directo html2canvas + jsPDF...");
        
        // Crear un nuevo iframe para la captura final
        const captureIframe = document.createElement('iframe');
        captureIframe.style.position = 'fixed';
        captureIframe.style.top = '0';
        captureIframe.style.left = '0';
        captureIframe.style.width = '100%';
        captureIframe.style.height = '100%';
        captureIframe.style.border = 'none';
        captureIframe.style.zIndex = '10001';
        captureIframe.style.visibility = 'hidden';
        
        // Añadir al DOM
        document.body.appendChild(captureIframe);
        
        // Acceder al documento del iframe
        const captureDoc = captureIframe.contentDocument || captureIframe.contentWindow.document;
        
        // Copiar el contenido exacto
        captureDoc.open();
        captureDoc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <title>PDF</title>
              <style>
                @page { size: A4; margin: 0; }
                body { 
                  margin: 0; 
                  padding: 0; 
                  background: white; 
                  font-family: Arial, sans-serif;
                }
                .pdf-page {
                  width: 210mm;
                  height: 297mm;
                  margin: 0 auto;
                  background: white;
                  position: relative;
                  page-break-after: always;
                  overflow: hidden;
                }
                /* Ocultar inicialmente todas las páginas */
                .page {
                  display: none;
                }
                /* Mostrar solo la página actual */
                .page.active {
                  display: block;
                }
              </style>
            </head>
            <body>
              ${plantillaHTML}
            </body>
          </html>
        `);
        captureDoc.close();
        
        // Esperar a que todo se cargue
        await new Promise(resolve => {
          captureIframe.onload = resolve;
          setTimeout(resolve, 1000);
        });
        
        // Corregir imágenes
        const allImages = captureDoc.querySelectorAll('img');
        allImages.forEach(img => {
          if (!img.src || 
              img.src === '' || 
              img.src === 'about:blank' || 
              img.src.startsWith('http://localhost/') || 
              img.src.startsWith('/')) {
            img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
          }
        });
        
        // Esperar a que se carguen las imágenes
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Crear el PDF exactamente como se ve la plantilla
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
          compress: true
        });
        
        // Capturar exactamente lo que se ve en la vista previa
        const viewportWidth = 793; // Ancho A4 en px
        const viewportHeight = 1122; // Alto A4 en px
        
        // Obtener todas las páginas tal como se ven en la vista previa
        const previewPages = captureDoc.querySelectorAll('.page');
        
        // Si no hay páginas definidas, tratar el documento completo como una sola página
        if (previewPages.length === 0) {
          try {
            const canvas = await html2canvas(captureDoc.body, {
              scale: 2,
              useCORS: true,
              allowTaint: true,
              backgroundColor: 'white',
              width: viewportWidth,
              height: viewportHeight
            });
            
            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            
            pdf.addImage(imgData, 'JPEG', 0, 0, pageWidth, pageHeight);
          } catch (error) {
            console.error('Error al capturar el documento completo:', error);
          }
        } else {
          // Procesar cada página tal como se ve en la vista previa
          for (let i = 0; i < previewPages.length; i++) {
            const page = previewPages[i];
            
            try {
              // Mostrar solo esta página y ocultar el resto
              previewPages.forEach(p => {
                p.style.display = 'none';
              });
              page.style.display = 'block';
              
              // Capturar la página exactamente como se ve
              const canvas = await html2canvas(page, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: 'white',
                width: viewportWidth,
                height: viewportHeight
              });
              
              // Si no es la primera página, añadir una nueva página al PDF
              if (i > 0) {
                pdf.addPage();
              }
              
              // Añadir la imagen al PDF
              const imgData = canvas.toDataURL('image/jpeg', 1.0);
              const pageWidth = pdf.internal.pageSize.getWidth();
              const pageHeight = pdf.internal.pageSize.getHeight();
              
              pdf.addImage(imgData, 'JPEG', 0, 0, pageWidth, pageHeight);
            } catch (pageError) {
              console.error(`Error al procesar página ${i + 1}:`, pageError);
            }
          }
        }
        
        // Obtener los bytes del PDF
        const pdfBytes = new Uint8Array(pdf.output('arraybuffer'));
        
        // Limpiar iframes
        document.body.removeChild(iframe);
        document.body.removeChild(captureIframe);
        
        // Ocultar overlay
        this.ocultarOverlayGeneracion();
        
        return pdfBytes;
      } catch (pdfError) {
        console.error("Error al generar PDF con método directo:", pdfError);
        
        // ÚLTIMO RECURSO: Intentar con método legacy (solo para documentos pequeños)
        try {
          console.log("Intentando con método legacy...");
          const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
          });
          
          // Capturar todo el body de una vez
          const canvas = await html2canvas(iframeDoc.body, {
            scale: 1.5,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#FFFFFF'
          });
          
          const imgData = canvas.toDataURL('image/jpeg');
          
          // Calcular dimensiones
          const pageWidth = pdf.internal.pageSize.getWidth();
          const pageHeight = pdf.internal.pageSize.getHeight();
          
          // Ajustar proporciones
          const canvasWidth = canvas.width;
          const canvasHeight = canvas.height;
          
          const ratio = canvasWidth / canvasHeight;
          const pageRatio = pageWidth / pageHeight;
          
          let finalWidth, finalHeight;
          if (ratio >= pageRatio) {
            finalWidth = pageWidth;
            finalHeight = finalWidth / ratio;
          } else {
            finalHeight = pageHeight;
            finalWidth = finalHeight * ratio;
          }
          
          // Centrar en la página
          const xOffset = (pageWidth - finalWidth) / 2;
          const yOffset = (pageHeight - finalHeight) / 2;
          
          pdf.addImage(imgData, 'JPEG', xOffset, yOffset, finalWidth, finalHeight);
          
          // Obtener los bytes
          const pdfBytes = new Uint8Array(pdf.output('arraybuffer'));
          
          // Limpiar
          document.body.removeChild(iframe);
          this.ocultarOverlayGeneracion();
          
          return pdfBytes;
        } catch (legacyError) {
          console.error("Error también con método legacy:", legacyError);
          
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

  /**
   * Genera un PDF a partir de una plantilla HTML
   * @param {HTMLElement} element - Elemento HTML a convertir en PDF
   * @param {Object} options - Opciones del PDF
   * @returns {Promise<Blob>} - El PDF generado como Blob
   */
  async generatePdfFromTemplate(element, options = {}) {
    const { 
      filename = 'documento.pdf', 
      format = 'a4', 
      orientation = 'portrait',
      margin = 10
    } = options;

    try {
      // Crear el PDF
      const pdf = new jsPDF({
        orientation,
        unit: 'mm',
        format,
        compress: true
      });
      
      // Convertir el HTML a un canvas
      const canvas = await html2canvas(element, {
        scale: 2, // Mejor resolución
        useCORS: true, // Permitir cargar imágenes de otros dominios
        allowTaint: true,
        backgroundColor: '#FFFFFF'
      });
      
      // Obtener dimensiones
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Calcular proporción para mantener el aspecto
      const canvasAspectRatio = canvas.width / canvas.height;
      const pageAspectRatio = pageWidth / pageHeight;
      
      let imgWidth = pageWidth - (margin * 2);
      let imgHeight = imgWidth / canvasAspectRatio;
      
      // Si la imagen es más alta que la página, ajustar altura
      if (imgHeight > pageHeight - (margin * 2)) {
        imgHeight = pageHeight - (margin * 2);
        imgWidth = imgHeight * canvasAspectRatio;
      }
      
      // Centrar imagen si no ocupa todo el ancho disponible
      const xOffset = margin + (pageWidth - margin * 2 - imgWidth) / 2;
      const yOffset = margin;
      
      // Añadir la imagen al PDF
      pdf.addImage(imgData, 'JPEG', xOffset, yOffset, imgWidth, imgHeight);
      
      // Guardar el PDF
      pdf.save(filename);
      
      // También devolver el blob para otros usos
      return new Blob([pdf.output('arraybuffer')], { type: 'application/pdf' });
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      throw error;
    }
  }

  /**
   * Prepara una imagen de Cloudinary para su uso en un PDF
   * @param {string} publicId - ID público de la imagen en Cloudinary
   * @returns {string} - URL de la imagen optimizada para PDF
   */
  getImageForPdf(publicId) {
    return CloudinaryService.getImageUrlForPdf(publicId);
  }

  /**
   * Genera un PDF con múltiples imágenes de Cloudinary
   * @param {Array<string>} imagePublicIds - Array de IDs públicos de imágenes
   * @param {Object} options - Opciones del PDF
   * @returns {Promise<Blob>} - El PDF generado como Blob
   */
  async generatePdfWithImages(imagePublicIds, options = {}) {
    const { 
      filename = 'imagenes.pdf', 
      format = 'a4', 
      orientation = 'portrait',
      margin = 10,
      title = ''
    } = options;

    try {
      // Crear un contenedor HTML para las imágenes
      const container = document.createElement('div');
      container.style.width = '210mm';
      container.style.padding = `${margin}mm`;
      container.style.backgroundColor = 'white';
      
      // Añadir título si se proporciona
      if (title) {
        const titleElement = document.createElement('h1');
        titleElement.style.fontSize = '16pt';
        titleElement.style.fontFamily = 'Arial, sans-serif';
        titleElement.style.marginBottom = '20px';
        titleElement.textContent = title;
        container.appendChild(titleElement);
      }
      
      // Añadir cada imagen al contenedor
      for (let i = 0; i < imagePublicIds.length; i++) {
        const publicId = imagePublicIds[i];
        const imageUrl = CloudinaryService.getImageUrlForPdf(publicId);
        
        const imgContainer = document.createElement('div');
        imgContainer.style.marginBottom = '20px';
        imgContainer.style.pageBreakInside = 'avoid';
        imgContainer.style.breakInside = 'avoid';
        
        const img = document.createElement('img');
        img.src = imageUrl;
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.style.display = 'block';
        img.style.margin = '0 auto';
        
        imgContainer.appendChild(img);
        container.appendChild(imgContainer);
        
        // Añadir un separador si no es la última imagen
        if (i < imagePublicIds.length - 1) {
          const separator = document.createElement('hr');
          separator.style.border = 'none';
          separator.style.height = '1px';
          separator.style.backgroundColor = '#eee';
          separator.style.margin = '30px 0';
          container.appendChild(separator);
        }
      }
      
      // Añadir el contenedor temporalmente al documento para procesarlo
      document.body.appendChild(container);
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      
      // Crear el PDF
      const pdf = new jsPDF({
        orientation,
        unit: 'mm',
        format,
        compress: true
      });
      
      // Esperar a que las imágenes se carguen
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Obtener el tamaño total del contenedor
      const containerHeight = container.offsetHeight;
      const containerWidth = container.offsetWidth;
      
      // Calcular el número de páginas necesarias
      const pageHeight = pdf.internal.pageSize.getHeight() - (margin * 2);
      const pageWidth = pdf.internal.pageSize.getWidth() - (margin * 2);
      
      const numPages = Math.ceil(containerHeight / (pageHeight * 3.779527559)); // Factor de conversión px a mm
      
      // Capturar una imagen del contenedor completo
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: 'white',
        height: containerHeight,
        width: containerWidth
      });
      
      // Cortar la imagen en páginas
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      
      // Añadir la imagen al PDF, posiblemente en múltiples páginas
      if (numPages <= 1) {
        // Si cabe en una sola página, centrar
        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        const xOffset = margin;
        const yOffset = margin;
        
        pdf.addImage(imgData, 'JPEG', xOffset, yOffset, imgWidth, imgHeight);
      } else {
        // Si no cabe en una página, dividir en múltiples páginas
        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        const pageHeightPx = (pageHeight * canvas.width) / imgWidth; // altura de página en px
        
        for (let i = 0; i < numPages; i++) {
          if (i > 0) {
            pdf.addPage();
          }
          
          const srcY = i * pageHeightPx;
          const srcHeight = Math.min(pageHeightPx, canvas.height - srcY);
          const destHeight = (srcHeight * imgWidth) / canvas.width;
          
          pdf.addImage(
            imgData, 'JPEG',
            margin, margin, // x, y destino
            imgWidth, destHeight, // ancho y alto destino
            0, srcY, // x, y origen
            canvas.width, srcHeight // ancho y alto origen
          );
        }
      }
      
      // Guardar el PDF
      pdf.save(filename);
      
      // Limpiar el DOM
      document.body.removeChild(container);
      
      // Devolver el blob para otros usos
      return new Blob([pdf.output('arraybuffer')], { type: 'application/pdf' });
    } catch (error) {
      console.error('Error al generar el PDF con imágenes:', error);
      throw error;
    }
  }
}

export default new PDFService(); 