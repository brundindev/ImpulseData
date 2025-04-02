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

// Función auxiliar para crear un placeholder de imagen de color sólido con texto
function crearPlaceholderImagen(color = '#002f87', ancho = 300, alto = 100, texto = '') {
  const canvas = document.createElement('canvas');
  canvas.width = ancho;
  canvas.height = alto;
  const ctx = canvas.getContext('2d');
  
  // Dibujar un rectángulo del color especificado
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, ancho, alto);
  
  // Añadir texto si se proporciona
  if (texto) {
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(texto, ancho / 2, alto / 2);
  }
  
  // Convertir a base64
  return canvas.toDataURL('image/png');
}

// Función para crear una imagen para la portada principal
function crearImagenPortada(ancho = 600, alto = 300) {
  const canvas = document.createElement('canvas');
  canvas.width = ancho;
  canvas.height = alto;
  const ctx = canvas.getContext('2d');
  
  // Gradiente radial de fondo moderno
  const gradient = ctx.createRadialGradient(ancho/2, alto/2, 10, ancho/2, alto/2, ancho*0.8);
  gradient.addColorStop(0, "#0066cc");
  gradient.addColorStop(0.5, "#004698");
  gradient.addColorStop(1, "#001f42");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, ancho, alto);
  
  // Patrón de cuadrícula moderna (puntos)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  const dotSize = 2;
  const spacing = 20;
  for (let x = 0; x < ancho; x += spacing) {
    for (let y = 0; y < alto; y += spacing) {
      ctx.beginPath();
      ctx.arc(x, y, dotSize, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  // Elementos decorativos - líneas curvas
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 3;
  
  // Curva superior
  ctx.beginPath();
  ctx.moveTo(0, alto * 0.2);
  ctx.bezierCurveTo(ancho * 0.3, alto * 0.1, ancho * 0.7, alto * 0.3, ancho, alto * 0.15);
  ctx.stroke();
  
  // Curva inferior
  ctx.beginPath();
  ctx.moveTo(0, alto * 0.8);
  ctx.bezierCurveTo(ancho * 0.3, alto * 0.9, ancho * 0.7, alto * 0.7, ancho, alto * 0.85);
  ctx.stroke();
  
  // Círculo decorativo
  ctx.beginPath();
  ctx.arc(ancho * 0.85, alto * 0.2, 40, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.stroke();
  
  // Texto principal con sombra
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 15;
  ctx.shadowOffsetX = 5;
  ctx.shadowOffsetY = 5;
  ctx.fillStyle = '#ffffff';
  
  // Título "Alicante Futura"
  ctx.font = 'bold 42px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('ALICANTE', ancho / 2, alto / 2 - 30);
  
  ctx.font = 'bold 50px Arial, sans-serif';
  ctx.fillText('FUTURA', ancho / 2, alto / 2 + 30);
  
  // Quitar sombra para el subtítulo
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  
  // Subtítulo
  ctx.font = '20px Arial, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.fillText('IMPULSEDATA', ancho / 2, alto / 2 + 80);
  
  // Convertir a base64
  return canvas.toDataURL('image/png');
}

/**
 * Crea el contenido HTML para el PDF
 * @returns {string} Contenido HTML
 */
function createHTMLContent() {
  // Crear placeholders de imágenes para la portada
  const logoImpulsa = crearPlaceholderImagen('#002f87', 150, 60, 'IMPULSA ALICANTE');
  const logoAyuntamiento = crearPlaceholderImagen('#003366', 150, 60, 'AYUNTAMIENTO');
  const imagenPrincipal = crearImagenPortada(600, 300);
  const logoObservatorio = crearPlaceholderImagen('#333333', 120, 40, 'OBSERVATORIO');
  const logoGeneralitat = crearPlaceholderImagen('#444444', 120, 40, 'GENERALITAT');
  const logoLabora = crearPlaceholderImagen('#555555', 120, 40, 'LABORA');
  const logoMinisterio = crearPlaceholderImagen('#666666', 120, 40, 'MINISTERIO');
  const logoSepe = crearPlaceholderImagen('#777777', 120, 40, 'SEPE');

  // Portada
  const portada = `
      <div class="pagina portada">
          <div class="encabezado">
              <img src="${logoImpulsa}" alt="Impulsa Alicante Logo">
              <img src="${logoAyuntamiento}" alt="Ayuntamiento Logo">
          </div>
          <div class="contenido">
              <div class="titulo-documento">Memoria de Actividad</div>
              <div class="imagen-principal">
                  <img src="${imagenPrincipal}" alt="Alicante Futura">
              </div>
              <div class="año">2023</div>
          </div>
          <div class="logos-inferiores">
              <img src="${logoObservatorio}" alt="Observatorio">
              <img src="${logoGeneralitat}" alt="Generalitat">
              <img src="${logoLabora}" alt="Labora">
              <img src="${logoMinisterio}" alt="Ministerio">
              <img src="${logoSepe}" alt="SEPE">
          </div>
      </div>
  `;

  // Índice
  const indice = `
      <div class="pagina indice">
          <h1 style="color: #004698; font-size: 28px; margin-bottom: 30px; text-align: center; text-transform: uppercase; letter-spacing: 2px;">Índice</h1>
          
          <div class="seccion">
              <div class="numero">1</div>
              <div class="texto">
                  <h2>Introducción</h2>
                  <ul>
                      <li>Objetivos y alcance</li>
                      <li>Metodología</li>
                  </ul>
              </div>
          </div>

          <div class="seccion">
              <div class="numero">2</div>
              <div class="texto">
                  <h2>Análisis del mercado laboral</h2>
                  <ul>
                      <li>Evolución de la demanda</li>
                      <li>Perfiles más solicitados</li>
                      <li>Competencias demandadas</li>
                  </ul>
              </div>
          </div>

          <div class="seccion">
              <div class="numero">3</div>
              <div class="texto">
                  <h2>Resultados por sectores</h2>
                  <ul>
                      <li>Tecnología
                          <ul>
                              <li>Software y desarrollo</li>
                              <li>Infraestructura IT</li>
                          </ul>
                      </li>
                      <li>Turismo</li>
                      <li>Comercio</li>
                  </ul>
              </div>
          </div>

          <div class="seccion">
              <div class="numero">4</div>
              <div class="texto">
                  <h2>Conclusiones</h2>
                  <ul>
                      <li>Hallazgos principales</li>
                      <li>Recomendaciones</li>
                  </ul>
              </div>
          </div>
      </div>
  `;

  // Crear el contenido HTML completo
  const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Memoria de Actividad 2023</title>
    <style>
      @page {
        size: A4;
        margin: 0;
      }
      body {
          font-family: 'Segoe UI', Roboto, Arial, sans-serif;
          margin: 0;
          padding: 0;
          background-color: white;
          width: 100%;
          height: 100%;
      }

      /* Estilos generales */
      .pagina {
          width: 210mm;
          height: 297mm;
          padding: 0;
          margin: 0;
          box-sizing: border-box;
          page-break-after: always;
          position: relative;
          overflow: hidden;
      }

      /* Portada */
      .portada {
          background: linear-gradient(135deg, #004698 0%, #001f42 100%);
          color: white;
          text-align: center;
          padding: 0;
          width: 100%;
          height: 100%;
          position: relative;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
      }
      
      /* Elementos decorativos para la portada */
      .portada::before {
          content: "";
          position: absolute;
          top: -50px;
          right: -50px;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          z-index: 1;
      }
      
      .portada::after {
          content: "";
          position: absolute;
          bottom: -100px;
          left: -100px;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.03);
          z-index: 1;
      }

      .encabezado {
          display: flex;
          justify-content: space-between;
          padding: 20px;
          width: calc(100% - 40px);
          background: rgba(0, 0, 0, 0.2);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      .encabezado img {
          height: 60px;
          filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.3));
      }

      .contenido {
          margin-top: 30px;
          width: 100%;
          position: relative;
          z-index: 2;
      }

      .contenido h1 {
          font-size: 36px;
          font-weight: 800;
          margin-bottom: 30px;
          width: 100%;
          text-transform: uppercase;
          letter-spacing: 2px;
          text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
      }

      .año {
          font-size: 60px;
          font-weight: 900;
          background: rgba(0, 0, 0, 0.6);
          color: white;
          display: inline-block;
          padding: 10px 30px;
          margin: 25px 0;
          position: relative;
          border-radius: 5px;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
      }
      
      .año::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, transparent 49%, rgba(255, 255, 255, 0.1) 50%, transparent 51%);
          background-size: 10px 10px;
      }

      .imagen-principal {
          margin: 20px auto;
          width: 90%;
          text-align: center;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
      }

      .imagen-principal img {
          width: 100%;
          height: auto;
          max-height: 300px;
          object-fit: contain;
          display: block;
      }

      .logos-inferiores {
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding: 15px;
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          width: 100%;
          background: rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(5px);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
      }

      .logos-inferiores img {
          height: 40px;
          opacity: 0.9;
          filter: grayscale(30%) drop-shadow(0 2px 3px rgba(0, 0, 0, 0.2));
          transition: all 0.3s ease;
      }

      /* Índice */
      .indice {
          background: white;
          padding: 30px;
          position: relative;
      }
      
      .indice::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 10px;
          background: linear-gradient(90deg, #004698, #0066cc);
      }

      .seccion {
          display: flex;
          align-items: flex-start;
          margin-bottom: 30px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          border-radius: 8px;
          overflow: hidden;
          transition: all 0.3s ease;
      }

      .numero {
          background: linear-gradient(135deg, #004698 0%, #0066cc 100%);
          color: white;
          font-size: 28px;
          font-weight: bold;
          padding: 15px;
          width: 60px;
          text-align: center;
          margin-right: 0;
          box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
      }

      .texto {
          padding: 15px 20px;
          flex: 1;
      }
      
      .texto h2 {
          color: #004698;
          font-size: 22px;
          margin-top: 0;
          margin-bottom: 15px;
          border-bottom: 2px solid #f0f0f0;
          padding-bottom: 8px;
      }

      .texto ul {
          list-style-type: none;
          padding: 0;
          margin: 0;
      }

      .texto ul ul {
          margin-left: 25px;
          margin-top: 5px;
          border-left: 2px solid #f0f0f0;
          padding-left: 15px;
      }

      .texto li {
          margin-bottom: 10px;
          font-size: 16px;
          color: #333;
          position: relative;
          padding-left: 20px;
      }
      
      .texto li::before {
          content: "•";
          color: #0066cc;
          position: absolute;
          left: 0;
          font-size: 18px;
          font-weight: bold;
      }
      
      .texto ul ul li::before {
          content: "◦";
      }
      
      /* Título del documento en la portada */
      .titulo-documento {
          font-size: 24px;
          font-weight: 300;
          color: rgba(255, 255, 255, 0.9);
          text-transform: uppercase;
          letter-spacing: 3px;
          margin-bottom: 30px;
          padding: 0 30px;
          line-height: 1.4;
      }
      
      /* Páginas de contenido */
      .contenido-pagina {
          padding: 30px;
      }
      
      .contenido-pagina h1 {
          color: #004698;
          font-size: 28px;
          margin-bottom: 20px;
          border-bottom: 3px solid #004698;
          padding-bottom: 10px;
      }
      
      .contenido-pagina p {
          line-height: 1.6;
          color: #333;
          margin-bottom: 15px;
          text-align: justify;
      }
    </style>
</head>
<body>
    ${portada}
    ${indice}

    <!-- Contenido del informe (páginas adicionales) -->
    <div class="pagina">
        <div class="contenido-pagina">
            <h1>Introducción</h1>
            <p>Este informe presenta un análisis detallado del mercado laboral en Alicante durante el año 2023, con especial énfasis en los sectores estratégicos para la economía local.</p>
            <p>Los datos analizados provienen de diversas fuentes oficiales, así como de encuestas y entrevistas realizadas a empresas y trabajadores de la región.</p>
            <p>El objetivo principal es proporcionar una visión clara y actualizada de las tendencias del mercado laboral, identificando oportunidades y desafíos para el desarrollo económico y social de Alicante.</p>
            <!-- Resto del contenido... -->
        </div>
    </div>
</body>
</html>
  `;
  
  return htmlContent;
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