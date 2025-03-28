import html2pdf from 'html2pdf.js';
import { crearPlantillaPDF } from '../utils/PlantillaPDF';
import Chart from 'chart.js/auto';

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
   * Genera un PDF utilizando la plantilla con la información de la empresa
   * @param {Object} empresa - Objeto con datos de la empresa
   * @returns {Promise<Uint8Array>} - Bytes del PDF generado
   */
  async generarInformeEmpresa(empresa) {
    try {
      // Mostrar overlay durante la generación
      this.mostrarOverlayGeneracion();
      
      console.log("Iniciando generación del informe de empresa:", empresa.nombre);
      
      // Verificar que la empresa tenga campos básicos
      if (!empresa || !empresa.nombre) {
        console.error("Datos de empresa insuficientes para generar el informe");
        this.ocultarOverlayGeneracion();
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
        this.ocultarOverlayGeneracion();
        throw new Error("No se pudo crear la plantilla HTML base");
      }
      
      // Crear un contenedor para el HTML pero sin añadirlo al DOM todavía
      const container = document.createElement('div');
      container.innerHTML = plantillaHTML;
      
      // Rellenar datos
      this.rellenarDatosEmpresa(container, empresa);
      
      // Crear un iframe oculto para no desestructurar la página
      const iframe = document.createElement('iframe');
      iframe.style.visibility = 'hidden';
      iframe.style.position = 'absolute';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      
      // Preparar el PDF utilizando un Worker
      try {
        // Desactivar inputs para que html2pdf los renderice correctamente
        this.desactivarControlesFormulario(container);
        
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
            windowWidth: 210 * 3.78 // Para asegurar que se vea correctamente a tamaño A4
          },
          jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait',
            compress: true,
            hotfixes: ['px_scaling'],
            precision: 16
          },
          pagebreak: { mode: ['avoid-all', 'css', 'legacy'], after: '.page' },
          enableLinks: false
        };
        
        // Añadir el iframe al DOM
        document.body.appendChild(iframe);
        
        // Generar el contenido del iframe
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Generando PDF...</title>
            <style>
              body { 
                margin: 0; 
                padding: 0; 
                background-color: white;
                visibility: hidden;
              }
            </style>
          </head>
          <body>
            <div id="pdf-container"></div>
          </body>
          </html>
        `);
        iframeDoc.close();
        
        // Esperar a que el iframe esté cargado
        await new Promise(resolve => {
          iframe.onload = resolve;
          setTimeout(resolve, 100); // Fallback
        });
        
        // Añadir el contenedor al iframe
        const pdfContainer = iframeDoc.getElementById('pdf-container');
        pdfContainer.appendChild(container.cloneNode(true));
        
        // Dar tiempo para que se carguen los recursos
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Generar PDF
        const pdf = await html2pdf()
          .from(pdfContainer)
          .set(options)
          .toPdf()
          .output('arraybuffer');
        
        // Limpiar
        document.body.removeChild(iframe);
        
        // Convertir a Uint8Array
        const pdfBytes = new Uint8Array(pdf);
        console.log("PDF generado correctamente con un tamaño de", pdfBytes.length, "bytes");
        
        // Ocultar overlay después de completar
        this.ocultarOverlayGeneracion();
        
        return pdfBytes;
      } catch (pdfError) {
        console.error("Error al generar PDF desde HTML:", pdfError);
        // Limpiar el iframe si existe
        if (iframe.parentNode) {
          document.body.removeChild(iframe);
        }
        // Ocultar overlay en caso de error
        this.ocultarOverlayGeneracion();
        throw new Error("Error al generar el documento PDF final");
      }
    } catch (error) {
      console.error('Error al generar el informe de empresa:', error);
      // Asegurarnos de ocultar el overlay en cualquier caso de error
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
      
      // Preparar los datos para los gráficos
      this.prepararDatosGraficos(container, empresa);
      
      console.log("Datos de la empresa rellenados correctamente en el HTML");
    } catch (error) {
      console.error("Error al rellenar datos de la empresa:", error);
      // Continuamos a pesar del error
    }
  }
  
  /**
   * Prepara los datos para los gráficos en el HTML
   * @param {HTMLElement} container - Contenedor con el HTML
   * @param {Object} empresa - Datos de la empresa
   */
  prepararDatosGraficos(container, empresa) {
    try {
      // Modificar el script de Chart.js para usar datos reales de la empresa
      const script = container.querySelector('script');
      if (script) {
        // Construir los datos para los gráficos basados en la empresa
        
        // 1. Datos para el gráfico de departamentos
        let deptsLabels = [];
        let deptsData = [];
        
        if (empresa.departamentos && empresa.departamentos.length > 0) {
          // Agrupar los departamentos por tipo para el gráfico de sectores
          const deptCounts = {};
          empresa.departamentos.forEach(dept => {
            const tipo = dept.tipo || 'Otros';
            deptCounts[tipo] = (deptCounts[tipo] || 0) + 1;
          });
          
          // Convertir a arrays para el gráfico
          deptsLabels = Object.keys(deptCounts);
          deptsData = Object.values(deptCounts);
        } else {
          deptsLabels = ['Sin departamentos'];
          deptsData = [1];
        }
        
        // 2. Datos para el gráfico de centros
        let centrosLabels = [];
        let centrosData = [];
        
        if (empresa.centros && empresa.centros.length > 0) {
          // Agrupar los centros por ciudad
          const centroCounts = {};
          empresa.centros.forEach(centro => {
            const ciudad = centro.ciudad || centro.direccion?.split(',').pop()?.trim() || 'Desconocida';
            centroCounts[ciudad] = (centroCounts[ciudad] || 0) + 1;
          });
          
          // Convertir a arrays para el gráfico
          centrosLabels = Object.keys(centroCounts);
          centrosData = Object.values(centroCounts);
        } else {
          centrosLabels = ['Sin centros'];
          centrosData = [0];
        }
        
        // 3. Datos para el gráfico de formaciones por tipo
        let formacionesLabels = ['Presencial', 'Virtual', 'Híbrida'];
        let formacionesData = [0, 0, 0];
        
        if (empresa.formaciones && empresa.formaciones.length > 0) {
          // Contar las formaciones por tipo
          empresa.formaciones.forEach(formacion => {
            const tipo = this.formatTipoFormacion(formacion.tipo).toLowerCase();
            if (tipo === 'presencial') formacionesData[0]++;
            else if (tipo === 'virtual') formacionesData[1]++;
            else if (tipo === 'híbrida') formacionesData[2]++;
          });
        }
        
        // 4. Datos para el gráfico de horas de formación
        // Usamos datos de ejemplo porque normalmente no tendríamos esta información
        const horasLabels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
        const horasData = [12, 19, 8, 15, 25, 18];
        
        // Actualizar el script con los datos reales
        const scriptContent = `
          // Función para generar los gráficos después de que se haya cargado el documento
          function generarGraficos() {
            // Datos para los gráficos
            const colorPalette = [
              'rgba(0, 70, 152, 0.7)',
              'rgba(0, 150, 255, 0.7)',
              'rgba(75, 192, 192, 0.7)',
              'rgba(153, 102, 255, 0.7)',
              'rgba(255, 159, 64, 0.7)',
              'rgba(255, 99, 132, 0.7)'
            ];
            
            // Gráfico 1: Distribución de departamentos
            const ctx1 = document.getElementById('chart-departamentos');
            if (ctx1) {
              new Chart(ctx1, {
                type: 'pie',
                data: {
                  labels: ${JSON.stringify(deptsLabels)},
                  datasets: [{
                    data: ${JSON.stringify(deptsData)},
                    backgroundColor: colorPalette,
                    borderWidth: 1
                  }]
                },
                options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        boxWidth: 12,
                        padding: 10,
                        font: {
                          size: 10
                        }
                      }
                    },
                    title: {
                      display: false
                    }
                  }
                }
              });
            }
            
            // Gráfico 2: Centros por ubicación
            const ctx2 = document.getElementById('chart-centros');
            if (ctx2) {
              new Chart(ctx2, {
                type: 'bar',
                data: {
                  labels: ${JSON.stringify(centrosLabels)},
                  datasets: [{
                    label: 'Número de centros',
                    data: ${JSON.stringify(centrosData)},
                    backgroundColor: colorPalette[1],
                    borderWidth: 1
                  }]
                },
                options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        stepSize: 1,
                        font: {
                          size: 10
                        }
                      }
                    },
                    x: {
                      ticks: {
                        font: {
                          size: 10
                        }
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      display: false
                    }
                  }
                }
              });
            }
            
            // Gráfico 3: Formaciones por tipo
            const ctx3 = document.getElementById('chart-formaciones');
            if (ctx3) {
              new Chart(ctx3, {
                type: 'doughnut',
                data: {
                  labels: ${JSON.stringify(formacionesLabels)},
                  datasets: [{
                    data: ${JSON.stringify(formacionesData)},
                    backgroundColor: [colorPalette[0], colorPalette[1], colorPalette[2]],
                    borderWidth: 1
                  }]
                },
                options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        boxWidth: 12,
                        padding: 10,
                        font: {
                          size: 10
                        }
                      }
                    }
                  }
                }
              });
            }
            
            // Gráfico 4: Horas de formación
            const ctx4 = document.getElementById('chart-horas');
            if (ctx4) {
              new Chart(ctx4, {
                type: 'line',
                data: {
                  labels: ${JSON.stringify(horasLabels)},
                  datasets: [{
                    label: 'Horas',
                    data: ${JSON.stringify(horasData)},
                    borderColor: colorPalette[1],
                    backgroundColor: 'rgba(0, 150, 255, 0.2)',
                    tension: 0.3,
                    fill: true
                  }]
                },
                options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        font: {
                          size: 10
                        }
                      }
                    },
                    x: {
                      ticks: {
                        font: {
                          size: 10
                        }
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      display: false
                    }
                  }
                }
              });
            }
          }
          
          // Llamar a la función inmediatamente para el PDF
          generarGraficos();
        `;
        
        // Reemplazar el contenido del script
        script.innerHTML = scriptContent;
      }
    } catch (error) {
      console.error("Error al preparar datos para gráficos:", error);
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
        // Asegurarnos de ocultar el overlay
        this.ocultarOverlayGeneracion();
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
      a.style.display = 'none';
      document.body.appendChild(a);
      
      // Hacer clic en el enlace para iniciar la descarga
      a.click();
      
      // Limpiar
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);
      
      // Ocultar el overlay una vez completada la descarga
      this.ocultarOverlayGeneracion();
      
      console.log("Descarga de PDF iniciada correctamente");
    } catch (error) {
      console.error("Error al guardar el PDF:", error);
      // Asegurarnos de ocultar el overlay en caso de error
      this.ocultarOverlayGeneracion();
      throw error;
    }
  }
  
  /**
   * Genera una URL para previsualizar el PDF
   * @param {Uint8Array} pdfBytes - Bytes del PDF
   * @returns {object} - Objeto con la URL y parámetros para visualización
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
      const url = window.URL.createObjectURL(blob);
      
      // Ocultar el overlay una vez generada la URL
      this.ocultarOverlayGeneracion();
      
      console.log("URL de previsualización generada correctamente");
      return {
        url,
        params: {
          zoom: "page-fit",
          view: "FitH",
          scrollbar: "1",
          toolbar: "1",
          navpanes: "1"
        }
      };
    } catch (error) {
      console.error("Error al generar URL de previsualización:", error);
      // Asegurarnos de ocultar el overlay en caso de error
      this.ocultarOverlayGeneracion();
      throw error;
    }
  }
}

export default new PDFService(); 