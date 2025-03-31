// Archivo para crear una plantilla HTML que se convertirá a PDF con html2pdf
import Chart from 'chart.js/auto';

export async function crearPlantillaPDF() {
  try {
    console.log("Iniciando creación de plantilla HTML para PDF...");
    
    // Crear contenido HTML
    const htmlContent = createHTMLContent();
    
    return htmlContent;
  } catch (error) {
    console.error("Error al crear la plantilla PDF:", error);
    throw error;
  }
}

/**
 * Crea el contenido HTML para el PDF
 * @returns {string} Contenido HTML
 */
function createHTMLContent() {
  // Fecha actual en formato español
  const fechaActual = new Date().toLocaleDateString('es-ES');
  
  // Estilos CSS inline para el documento
  const styles = `
    <style>
      @page {
        size: A4;
        margin: 0;
      }
      * {
        box-sizing: border-box;
      }
      body {
        font-family: 'Helvetica', Arial, sans-serif;
        margin: 0;
        padding: 0;
        color: #333;
        background-color: white;
        width: 100%;
      }
      .page {
        width: 210mm;
        height: 297mm;
        padding: 15mm;
        page-break-after: always;
        position: relative;
        background-color: white;
        margin: 0 auto;
        overflow: hidden;
      }
      .header {
        background-color: #004698;
        padding: 15px;
        text-align: center;
        margin-bottom: 20px;
        border-radius: 5px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      }
      .header h1 {
        margin: 0;
        font-size: 24px;
        color: white;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      .logo-container {
        border: 2px solid #004698;
        height: 100px;
        width: 150px;
        margin: 20px auto;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: white;
        border-radius: 5px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      }
      .logo-text {
        color: #004698;
        font-weight: bold;
        font-size: 20px;
      }
      .form-field {
        background-color: #f5f5f5;
        padding: 12px;
        margin-bottom: 15px;
        border-radius: 5px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        border-left: 3px solid #004698;
      }
      .form-field label {
        color: #004698;
        font-weight: bold;
        display: block;
        margin-bottom: 8px;
        font-size: 14px;
      }
      .form-input {
        display: block;
        width: 100%;
        min-height: 30px;
        padding: 8px 10px;
        background-color: white;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-family: inherit;
        font-size: 14px;
        color: #333;
        box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);
      }
      .form-textarea {
        min-height: 80px;
        resize: vertical;
      }
      .footer {
        border: 1px solid #0096ff;
        padding: 15px;
        text-align: center;
        margin-top: 30px;
        background-color: rgba(240, 248, 255, 0.7);
        border-radius: 5px;
      }
      .footer p {
        margin: 5px 0;
        color: #333;
      }
      .section-title {
        background-color: #004698;
        padding: 12px;
        text-align: center;
        margin-bottom: 20px;
        border-radius: 5px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      .section-title h2 {
        margin: 0;
        font-size: 20px;
        color: white;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      .departamento-item {
        background-color: #f5f5f5;
        padding: 12px;
        margin-bottom: 12px;
        border-radius: 5px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        border-left: 3px solid #0096ff;
      }
      .departamento-input {
        width: 100%;
        padding: 8px 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-family: inherit;
        font-size: 14px;
        background-color: white;
        box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);
      }
      .centro-item, .formacion-item {
        background-color: #f5f5f5;
        padding: 12px 15px;
        margin-bottom: 12px;
        border-radius: 5px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        border-left: 3px solid #0096ff;
      }
      .centro-item p, .formacion-item p {
        margin: 8px 0;
        display: flex;
        flex-direction: column;
      }
      .centro-item label, .formacion-item label {
        font-weight: bold;
        color: #004698;
        margin-bottom: 5px;
        font-size: 14px;
      }
      .centro-input, .formacion-input {
        width: 100%;
        padding: 8px 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-family: inherit;
        font-size: 14px;
        background-color: white;
        box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);
      }
      .empty-item {
        color: #999;
        font-style: italic;
        background-color: #f9f9f9;
        border-left-color: #ccc;
        padding: 15px;
        text-align: center;
      }
      .charts-section {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
        margin: 20px 0;
      }
      .chart-container {
        border: 1px solid #ddd;
        padding: 15px;
        background-color: white;
        border-radius: 5px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .chart-container h3 {
        margin-top: 0;
        margin-bottom: 15px;
        color: #004698;
        border-bottom: 2px solid #0096ff;
        padding-bottom: 8px;
        width: 100%;
        text-align: center;
        font-size: 16px;
      }
      .chart-wrapper {
        width: 100%;
        height: 180px;
        position: relative;
      }
      .chart-canvas {
        width: 100% !important;
        height: 100% !important;
      }
      .fecha-informe {
        text-align: right;
        font-style: italic;
        color: #666;
        margin: 15px 0;
      }
      strong {
        color: #333;
      }
      
      @media print {
        body {
          width: 210mm;
          height: 297mm;
        }
        .page {
          margin: 0;
          border: initial;
          border-radius: initial;
          width: initial;
          min-height: initial;
          box-shadow: initial;
          background: initial;
          page-break-after: always;
        }
      }
    </style>
  `;
  
  // Scripts para generar los gráficos
  const chartScripts = `
    <script>
      // Función para generar los gráficos después de que se haya cargado el documento
      function generarGraficos() {
        // Datos de ejemplo para los gráficos
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
              labels: ['Administración', 'Ventas', 'Marketing', 'Producción', 'Recursos Humanos'],
              datasets: [{
                data: [3, 5, 2, 8, 4],
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
              labels: ['Alicante', 'Valencia', 'Madrid', 'Barcelona'],
              datasets: [{
                label: 'Número de centros',
                data: [4, 2, 1, 3],
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
              labels: ['Presencial', 'Virtual', 'Híbrida'],
              datasets: [{
                data: [8, 15, 5],
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
              labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
              datasets: [{
                label: 'Horas',
                data: [12, 19, 8, 15, 25, 18],
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
      
      // Ejecutar después de que se cargue el documento
      document.addEventListener('DOMContentLoaded', generarGraficos);
    </script>
  `;
  
  // Portada
  const portada = `
    <div class="page">
      <div class="header">
        <h1>Informe Empresarial</h1>
      </div>
      
      <div class="logo-container">
        <span class="logo-text">LOGO</span>
      </div>
      
      <div class="form-field">
        <label>NOMBRE DE LA EMPRESA:</label>
        <input type="text" class="form-input" id="empresa-nombre" placeholder="Nombre de la empresa" />
      </div>
      
      <p class="fecha-informe">Fecha del informe: ${fechaActual}</p>
      
      <div class="footer">
        <p><strong>ImpulseData - Alicante Futura</strong></p>
        <p>Plataforma digital de gestión de datos para la innovación</p>
        <p>y el desarrollo sostenible de Alicante</p>
      </div>
    </div>
  `;
  
  // Información general
  const infoGeneral = `
    <div class="page">
      <div class="section-title">
        <h2>Información General</h2>
      </div>
      
      <div class="form-field">
        <label>Nombre de la empresa:</label>
        <input type="text" class="form-input" id="empresa-nombre-info" placeholder="Nombre completo de la empresa" />
      </div>
      
      <div class="form-field">
        <label>Fecha de creación:</label>
        <input type="text" class="form-input" id="empresa-fecha" placeholder="Fecha de constitución" />
      </div>
      
      <div class="form-field">
        <label>Ciudad:</label>
        <input type="text" class="form-input" id="empresa-ciudad" placeholder="Ciudad sede principal" />
      </div>
      
      <div class="form-field">
        <label>Descripción:</label>
        <textarea class="form-input form-textarea" id="empresa-descripcion" placeholder="Breve descripción de la actividad de la empresa"></textarea>
      </div>
    </div>
  `;
  
  // Departamentos
  const departamentos = `
    <div class="page">
      <div class="section-title">
        <h2>Departamentos</h2>
      </div>
      
      <div id="departamentos-container">
        <div class="departamento-item">
          <input type="text" class="departamento-input" id="departamento-0" placeholder="Nombre del departamento" />
        </div>
        <div class="departamento-item">
          <input type="text" class="departamento-input" id="departamento-1" placeholder="Nombre del departamento" />
        </div>
        <div class="departamento-item">
          <input type="text" class="departamento-input" id="departamento-2" placeholder="Nombre del departamento" />
        </div>
        <div class="departamento-item">
          <input type="text" class="departamento-input" id="departamento-3" placeholder="Nombre del departamento" />
        </div>
        <div class="departamento-item">
          <input type="text" class="departamento-input" id="departamento-4" placeholder="Nombre del departamento" />
        </div>
        <div class="departamento-item">
          <input type="text" class="departamento-input" id="departamento-5" placeholder="Nombre del departamento" />
        </div>
        <div class="departamento-item">
          <input type="text" class="departamento-input" id="departamento-6" placeholder="Nombre del departamento" />
        </div>
        <div class="departamento-item">
          <input type="text" class="departamento-input" id="departamento-7" placeholder="Nombre del departamento" />
        </div>
        <div class="departamento-item">
          <input type="text" class="departamento-input" id="departamento-8" placeholder="Nombre del departamento" />
        </div>
        <div class="departamento-item">
          <input type="text" class="departamento-input" id="departamento-9" placeholder="Nombre del departamento" />
        </div>
      </div>
    </div>
  `;
  
  // Centros
  const centros = `
    <div class="page">
      <div class="section-title">
        <h2>Centros de Trabajo</h2>
      </div>
      
      <div id="centros-container">
        <div class="centro-item">
          <p>
            <label>Nombre:</label>
            <input type="text" class="centro-input" id="centro-0-nombre" placeholder="Nombre del centro" />
          </p>
          <p>
            <label>Dirección:</label>
            <input type="text" class="centro-input" id="centro-0-direccion" placeholder="Dirección completa" />
          </p>
        </div>
        <div class="centro-item">
          <p>
            <label>Nombre:</label>
            <input type="text" class="centro-input" id="centro-1-nombre" placeholder="Nombre del centro" />
          </p>
          <p>
            <label>Dirección:</label>
            <input type="text" class="centro-input" id="centro-1-direccion" placeholder="Dirección completa" />
          </p>
        </div>
        <div class="centro-item">
          <p>
            <label>Nombre:</label>
            <input type="text" class="centro-input" id="centro-2-nombre" placeholder="Nombre del centro" />
          </p>
          <p>
            <label>Dirección:</label>
            <input type="text" class="centro-input" id="centro-2-direccion" placeholder="Dirección completa" />
          </p>
        </div>
        <div class="centro-item">
          <p>
            <label>Nombre:</label>
            <input type="text" class="centro-input" id="centro-3-nombre" placeholder="Nombre del centro" />
          </p>
          <p>
            <label>Dirección:</label>
            <input type="text" class="centro-input" id="centro-3-direccion" placeholder="Dirección completa" />
          </p>
        </div>
      </div>
    </div>
  `;
  
  // Formaciones
  const formaciones = `
    <div class="page">
      <div class="section-title">
        <h2>Formaciones</h2>
      </div>
      
      <div id="formaciones-container">
        <div class="formacion-item">
          <p>
            <label>Nombre:</label>
            <input type="text" class="formacion-input" id="formacion-0-nombre" placeholder="Nombre de la formación" />
          </p>
          <p>
            <label>Tipo:</label>
            <select class="formacion-input" id="formacion-0-tipo">
              <option value="">Seleccionar tipo</option>
              <option value="Presencial">Presencial</option>
              <option value="Virtual">Virtual</option>
              <option value="Híbrida">Híbrida</option>
            </select>
          </p>
          <p>
            <label>Duración:</label>
            <input type="text" class="formacion-input" id="formacion-0-duracion" placeholder="Duración en horas" />
          </p>
        </div>
        <div class="formacion-item">
          <p>
            <label>Nombre:</label>
            <input type="text" class="formacion-input" id="formacion-1-nombre" placeholder="Nombre de la formación" />
          </p>
          <p>
            <label>Tipo:</label>
            <select class="formacion-input" id="formacion-1-tipo">
              <option value="">Seleccionar tipo</option>
              <option value="Presencial">Presencial</option>
              <option value="Virtual">Virtual</option>
              <option value="Híbrida">Híbrida</option>
            </select>
          </p>
          <p>
            <label>Duración:</label>
            <input type="text" class="formacion-input" id="formacion-1-duracion" placeholder="Duración en horas" />
          </p>
        </div>
        <div class="formacion-item">
          <p>
            <label>Nombre:</label>
            <input type="text" class="formacion-input" id="formacion-2-nombre" placeholder="Nombre de la formación" />
          </p>
          <p>
            <label>Tipo:</label>
            <select class="formacion-input" id="formacion-2-tipo">
              <option value="">Seleccionar tipo</option>
              <option value="Presencial">Presencial</option>
              <option value="Virtual">Virtual</option>
              <option value="Híbrida">Híbrida</option>
            </select>
          </p>
          <p>
            <label>Duración:</label>
            <input type="text" class="formacion-input" id="formacion-2-duracion" placeholder="Duración en horas" />
          </p>
        </div>
      </div>
    </div>
  `;
  
  // Estadísticas y gráficos
  const estadisticas = `
    <div class="page">
      <div class="section-title">
        <h2>Estadísticas y Gráficos</h2>
      </div>
      
      <div class="charts-section">
        <div class="chart-container">
          <h3>Distribución de departamentos</h3>
          <div class="chart-wrapper">
            <canvas id="chart-departamentos" class="chart-canvas"></canvas>
          </div>
        </div>
        
        <div class="chart-container">
          <h3>Centros por ubicación</h3>
          <div class="chart-wrapper">
            <canvas id="chart-centros" class="chart-canvas"></canvas>
          </div>
        </div>
        
        <div class="chart-container">
          <h3>Formaciones por tipo</h3>
          <div class="chart-wrapper">
            <canvas id="chart-formaciones" class="chart-canvas"></canvas>
          </div>
        </div>
        
        <div class="chart-container">
          <h3>Horas de formación</h3>
          <div class="chart-wrapper">
            <canvas id="chart-horas" class="chart-canvas"></canvas>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Juntar todas las páginas en un único documento HTML
  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Informe Empresarial</title>
      ${styles}
    </head>
    <body>
      ${portada}
      ${infoGeneral}
      ${departamentos}
      ${centros}
      ${formaciones}
      ${estadisticas}
      ${chartScripts}
    </body>
    </html>
  `;
  
  return htmlTemplate;
}

/**
 * Convierte el HTML a PDF usando html2pdf
 * @param {string} htmlContent - Contenido HTML
 * @returns {Promise<Uint8Array>} - Bytes del PDF generado
 */
async function html2PDFConverter(htmlContent) {
  return new Promise((resolve, reject) => {
    try {
      // Crear un elemento contenedor temporal
      const element = document.createElement('div');
      element.innerHTML = htmlContent;
      document.body.appendChild(element);
      
      // Configuración para html2pdf
      const options = {
        margin: 10,
        filename: 'plantilla.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'] }
      };
      
      // Generar PDF
      html2pdf()
        .from(element)
        .set(options)
        .outputPdf('arraybuffer')
        .then(pdfBuffer => {
          // Limpiar el elemento temporal
          document.body.removeChild(element);
          
          // Convertir ArrayBuffer a Uint8Array
          const pdfBytes = new Uint8Array(pdfBuffer);
          resolve(pdfBytes);
        })
        .catch(error => {
          document.body.removeChild(element);
          reject(error);
        });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Ajusta las dimensiones de los canvas de los gráficos para una correcta visualización
 * @param {HTMLElement} container - Contenedor con el HTML
 */
function ajustarDimensionesGraficos(container) {
  const chartContainers = container.querySelectorAll('.chart-container');
  
  chartContainers.forEach(chartContainer => {
    // Establecer dimensiones explícitas para el canvas
    const canvas = chartContainer.querySelector('canvas');
    if (canvas) {
      canvas.style.width = '100%';
      canvas.style.maxWidth = '500px';
      canvas.style.height = '250px';
      canvas.style.margin = '0 auto';
    }
    
    // Establecer dimensiones explícitas para el contenedor
    chartContainer.style.width = '100%';
    chartContainer.style.maxWidth = '500px';
    chartContainer.style.height = '280px';
    chartContainer.style.margin = '0 auto 20px auto';
  });
}

/**
 * Añade meta tags y estilos adicionales para asegurar que el PDF se visualice correctamente
 * @param {HTMLElement} container - Contenedor con el HTML
 */
function optimizarVisualizacion(container) {
  // Añadir metas para optimizar la visualización
  const head = container.querySelector('head');
  if (head) {
    // Meta viewport para escala inicial
    const metaViewport = document.createElement('meta');
    metaViewport.name = 'viewport';
    metaViewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=2.0, user-scalable=yes';
    head.appendChild(metaViewport);
    
    // Estilo para optimizar visualización PDF
    const optimizationStyle = document.createElement('style');
    optimizationStyle.textContent = `
      @page {
        size: A4;
        margin: 0;
      }
      
      @media print {
        html, body {
          width: 210mm;
          height: 297mm;
          margin: 0;
          padding: 0;
        }
      }
      
      html, body {
        font-size: 12pt;
      }
    `;
    head.appendChild(optimizationStyle);
  }
  
  // Ajustar gráficos
  ajustarDimensionesGraficos(container);
} 