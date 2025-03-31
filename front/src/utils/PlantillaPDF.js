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
function crearImagenPortada(ancho = 400, alto = 200) {
  const canvas = document.createElement('canvas');
  canvas.width = ancho;
  canvas.height = alto;
  const ctx = canvas.getContext('2d');
  
  // Gradiente de fondo
  const gradient = ctx.createLinearGradient(0, 0, 0, alto);
  gradient.addColorStop(0, "#001852");
  gradient.addColorStop(1, "#0055b8");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, ancho, alto);
  
  // Añadir texto
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Alicante', ancho / 2, alto / 2 - 20);
  ctx.fillText('Futura', ancho / 2, alto / 2 + 20);
  
  // Añadir líneas decorativas
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(50, 30);
  ctx.lineTo(ancho - 50, 30);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(50, alto - 30);
  ctx.lineTo(ancho - 50, alto - 30);
  ctx.stroke();
  
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
  const imagenPrincipal = crearImagenPortada(400, 200);
  const logoObservatorio = crearPlaceholderImagen('#333333', 120, 40, 'OBSERVATORIO');
  const logoGeneralitat = crearPlaceholderImagen('#444444', 120, 40, 'GENERALITAT');
  const logoLabora = crearPlaceholderImagen('#555555', 120, 40, 'LABORA');
  const logoMinisterio = crearPlaceholderImagen('#666666', 120, 40, 'MINISTERIO');
  const logoSepe = crearPlaceholderImagen('#777777', 120, 40, 'SEPE');

  return `
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
          font-family: Arial, sans-serif;
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
          background: #002f87;
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
      }

      .encabezado {
          display: flex;
          justify-content: space-between;
          padding: 15px;
          width: calc(100% - 30px);
      }

      .encabezado img {
          height: 60px;
      }

      .contenido {
          margin-top: 50px;
          width: 100%;
      }

      .contenido h1 {
          font-size: 32px;
          font-weight: bold;
          margin-bottom: 30px;
          width: 100%;
      }

      .año {
          font-size: 50px;
          font-weight: bold;
          background: black;
          color: white;
          display: inline-block;
          padding: 10px;
          margin: 20px 0;
      }

      .imagen-principal {
          margin: 30px 0;
          width: 100%;
          text-align: center;
      }

      .imagen-principal img {
          width: 80%;
          height: auto;
          max-height: 250px;
          object-fit: contain;
      }

      .logos-inferiores {
          display: flex;
          justify-content: space-around;
          padding: 15px;
          position: absolute;
          bottom: 20px;
          left: 0;
          right: 0;
          width: 100%;
      }

      .logos-inferiores img {
          height: 40px;
      }

      /* Índice */
      .indice {
          background: white;
          padding: 15px;
      }

      .seccion {
          display: flex;
          align-items: flex-start;
          margin-bottom: 20px;
      }

      .numero {
          background: #002f87;
          color: white;
          font-size: 24px;
          font-weight: bold;
          padding: 10px;
          width: 50px;
          text-align: center;
          margin-right: 15px;
      }

      .texto h2 {
          color: #002f87;
          font-size: 20px;
          margin-bottom: 10px;
      }

      .texto ul {
          list-style-type: none;
          padding: 0;
      }

      .texto ul ul {
          margin-left: 20px;
      }

      .texto li {
          margin-bottom: 5px;
          font-size: 16px;
      }

      /* Estilos para formularios */
      .form-field {
          background-color: #f5f5f5;
          padding: 12px;
          margin-bottom: 15px;
          border-radius: 5px;
          border-left: 3px solid #002f87;
      }

      .form-field label {
          color: #002f87;
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

      /* Estilos para departamentos, centros y formaciones */
      .departamento-item, .centro-item, .formacion-item {
          background-color: #f5f5f5;
          padding: 12px;
          margin-bottom: 12px;
          border-radius: 5px;
          border-left: 3px solid #002f87;
      }

      .centro-item p, .formacion-item p {
          margin: 8px 0;
      }

      .empty-item {
          color: #999;
          font-style: italic;
          background-color: #f9f9f9;
          border-left: 3px solid #ccc;
          padding: 15px;
          text-align: center;
          margin-bottom: 12px;
          border-radius: 5px;
      }

      h2 {
          color: #002f87;
          font-size: 24px;
          margin-bottom: 20px;
          text-align: center;
          padding: 10px;
          background-color: #f5f5f5;
          border-radius: 5px;
      }
      
      /* Contenedor para las páginas de datos */
      .pagina-contenido {
          padding: 15px;
      }
      
      /* Numeración de páginas */
      .numero-pagina {
          position: absolute;
          bottom: 15px;
          right: 20px;
          font-weight: bold;
          font-size: 16px;
          color: #002f87;
          z-index: 100;
          padding: 5px 10px;
          background-color: rgba(255, 255, 255, 0.8);
          border-radius: 15px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      /* Estilos para la nueva sección de Agencia Local de Desarrollo */
      .agencia-container {
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
          position: relative;
          overflow: hidden;
      }

      .agencia-header {
          background-color: #002d72; /* Azul oscuro */
          color: white;
          padding: 130px;
          text-align: left;
          width: 100%;
          box-sizing: border-box;
      }

      .agencia-number {
          font-size: 50px;
          font-weight: bold;
          background-color: #0071d9; /* Azul claro */
          display: inline-block;
          width: 50px;
          text-align: center;
      }

      .agencia-header h1 {
          font-size: 24px;
          margin: 10px 0;
          font-weight: bold;
      }

      .agencia-header h2 {
          font-size: 20px;
          margin: 0;
      }

      .agencia-footer {
          background-color: #e0e0e0; /* Gris claro */
          padding: 20px;
          text-align: center;
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          width: 100%;
          box-sizing: border-box;
      }

      @media print {
        body {
          width: 210mm;
          height: 297mm;
          margin: 0;
          padding: 0;
        }
        .pagina {
          margin: 0;
          padding: 0;
          border: initial;
          border-radius: initial;
          width: 210mm;
          height: 297mm;
          box-shadow: initial;
          background: initial;
          page-break-after: always;
          overflow: hidden;
          position: relative;
        }
        .portada {
          margin: 0;
          padding: 0;
          width: 210mm;
          height: 297mm;
        }
      }
    </style>
</head>
<body>

    <!-- Página 1: Portada -->
    <div class="pagina portada">
        <div class="encabezado">
            <img src="${logoImpulsa}" alt="Logo ImpulsAlicante" class="logo-impulsalicante">
            <img src="${logoAyuntamiento}" alt="Logo Ayuntamiento de Alicante" class="logo-ayuntamiento">
        </div>
        <div class="contenido">
            <h1>MEMORIA DE ACTIVIDAD</h1>
            <div class="año">
                <span>20</span><span>23</span>
            </div>
        </div>
        <div class="imagen-principal">
            <img src="${imagenPrincipal}" alt="Imagen principal">
        </div>
        <div class="logos-inferiores">
            <img src="${logoObservatorio}" alt="Observatorio Pacto">
            <img src="${logoGeneralitat}" alt="Generalitat Valenciana">
            <img src="${logoLabora}" alt="Labora">
            <img src="${logoMinisterio}" alt="Ministerio de Trabajo y Economía Social">
            <img src="${logoSepe}" alt="SEPE">
        </div>
    </div>

    <!-- Página 2: Índice -->
    <div class="pagina indice">
        <div class="seccion">
            <div class="numero">1</div>
            <div class="texto">
                <h2>AGENCIA LOCAL DE DESARROLLO ECONÓMICO Y SOCIAL</h2>
                <ul>
                    <li>1.1 LA AGENCIA LOCAL EN CIFRAS</li>
                    <li>1.2 QUÉ HACEMOS</li>
                    <li>1.3 CÓMO ESTAMOS ORGANIZADOS</li>
                    <li>1.4 DÓNDE ESTAMOS</li>
                </ul>
            </div>
        </div>
        <div class="seccion">
            <div class="numero">2</div>
            <div class="texto">
                <h2>DEPARTAMENTO DE EMPLEO Y FORMACIÓN</h2>
                <ul>
                    <li>2.1 DATOS TOTALES</li>
                    <li>2.2 NUESTROS CENTROS</li>
                    <ul>
                        <li>2.2.1 Sede Central "Puerta Ferrisa"</li>
                        <li>2.2.2 Centro de Formación Alejandrina Candela</li>
                        <li>2.2.3 Centro de Empleo y Formación "El Tossalet"</li>
                        <li>2.2.4 Servicio de Empleo, Emprendimiento y Formación "Entre dos Castillos-Las Cigarreras"</li>
                    </ul>
                    <li>2.3 NUESTROS SERVICIOS</li>
                    <ul>
                        <li>2.3.1 Orientación e Intermediación Laboral</li>
                        <li>2.3.2 Asesoramiento Empresarial y al Autoempleo</li>
                    </ul>
                    <li>2.4 FORMACIÓN</li>
                    <li>2.5 PROGRAMAS Y PROYECTOS</li>
                    <ul>
                        <li>2.5.1 Programa "Grandes Ciudades"</li>
                        <li>2.5.2 Programas de Fomento del Empleo</li>
                        <li>2.5.3 Plan de actuación en brecha digital: cursos con la Escuela de Organización Industrial – EOI</li>
                        <li>2.5.4 Programa Reinserción Mayores de 45 años</li>
                    </ul>
                    <li>2.6 SUBVENCIONES A ENTIDADES</li>
                    <ul>
                        <li>2.6.1 Subvenciones a entidades sin ánimo de lucro</li>
                        <li>2.6.2 Convenios nominativos</li>
                    </ul>
                    <li>2.7 OTROS</li>
                    <ul>
                        <li>2.7.1 IV Feria de Empleo y Formación</li>
                        <li>2.7.2 IV Encuentro de Empleo dirigido a Personas con Diversidad Funcional</li>
                        <li>2.7.3 XII Concurso de decoración navideña</li>
                        <li>2.7.4 Participación en la Red de Entidades por el Empleo</li>
                    </ul>
                </ul>
            </div>
        </div>
        <div class="numero-pagina">1</div>
    </div>

    <!-- Nueva página Agencia Local de Desarrollo -->
    <div class="pagina">
        <div class="agencia-container">
            <div class="agencia-header">
                <div class="agencia-number">1</div>
                <h1>AGENCIA LOCAL DE DESARROLLO</h1>
                <h2>ECONÓMICO Y SOCIAL</h2>
            </div>
            <div class="agencia-footer">
                <img />
            </div>
        </div>
        <div class="numero-pagina">2</div>
    </div>

    <!-- Página para datos de empresa (campos a rellenar) -->
    <div class="pagina">
        <div class="pagina-contenido">
            <div class="form-field">
                <label for="empresa-nombre">Nombre de la Empresa:</label>
                <input type="text" id="empresa-nombre" class="form-input" />
            </div>
            
            <div class="form-field">
                <label for="empresa-fecha">Fecha de Creación:</label>
                <input type="text" id="empresa-fecha" class="form-input" />
            </div>
            
            <div class="form-field">
                <label for="empresa-ciudad">Ciudad:</label>
                <input type="text" id="empresa-ciudad" class="form-input" />
            </div>
            
            <div class="form-field">
                <label for="empresa-descripcion">Descripción:</label>
                <textarea id="empresa-descripcion" class="form-input" style="min-height: 100px;"></textarea>
            </div>
            
            <div class="form-field">
                <label for="empresa-nombre-info">Nombre para informes:</label>
                <input type="text" id="empresa-nombre-info" class="form-input" />
            </div>
        </div>
        <div class="numero-pagina">3</div>
    </div>

    <!-- Página para departamentos -->
    <div class="pagina">
        <div class="pagina-contenido">
            <h2>DEPARTAMENTOS</h2>
            <div id="departamentos-container">
                <div class="departamento-item">
                    <input type="text" id="departamento-0" class="form-input" placeholder="Nombre del departamento" />
                </div>
                <div class="departamento-item">
                    <input type="text" id="departamento-1" class="form-input" placeholder="Nombre del departamento" />
                </div>
                <div class="departamento-item">
                    <input type="text" id="departamento-2" class="form-input" placeholder="Nombre del departamento" />
                </div>
                <div class="departamento-item">
                    <input type="text" id="departamento-3" class="form-input" placeholder="Nombre del departamento" />
                </div>
                <div class="departamento-item">
                    <input type="text" id="departamento-4" class="form-input" placeholder="Nombre del departamento" />
                </div>
            </div>
        </div>
        <div class="numero-pagina">4</div>
    </div>

    <!-- Página para centros -->
    <div class="pagina">
        <div class="pagina-contenido">
            <h2>CENTROS</h2>
            <div id="centros-container">
                <div class="centro-item">
                    <p>
                        <label for="centro-0-nombre">Nombre:</label>
                        <input type="text" id="centro-0-nombre" class="form-input" placeholder="Nombre del centro" />
                    </p>
                    <p>
                        <label for="centro-0-direccion">Dirección:</label>
                        <input type="text" id="centro-0-direccion" class="form-input" placeholder="Dirección del centro" />
                    </p>
                </div>
                <div class="centro-item">
                    <p>
                        <label for="centro-1-nombre">Nombre:</label>
                        <input type="text" id="centro-1-nombre" class="form-input" placeholder="Nombre del centro" />
                    </p>
                    <p>
                        <label for="centro-1-direccion">Dirección:</label>
                        <input type="text" id="centro-1-direccion" class="form-input" placeholder="Dirección del centro" />
                    </p>
                </div>
                <div class="centro-item">
                    <p>
                        <label for="centro-2-nombre">Nombre:</label>
                        <input type="text" id="centro-2-nombre" class="form-input" placeholder="Nombre del centro" />
                    </p>
                    <p>
                        <label for="centro-2-direccion">Dirección:</label>
                        <input type="text" id="centro-2-direccion" class="form-input" placeholder="Dirección del centro" />
                    </p>
                </div>
            </div>
        </div>
        <div class="numero-pagina">5</div>
    </div>

    <!-- Página para formaciones -->
    <div class="pagina">
        <div class="pagina-contenido">
            <h2>FORMACIONES</h2>
            <div id="formaciones-container">
                <div class="formacion-item">
                    <p>
                        <label for="formacion-0-nombre">Nombre:</label>
                        <input type="text" id="formacion-0-nombre" class="form-input" placeholder="Nombre de la formación" />
                    </p>
                    <p>
                        <label for="formacion-0-tipo">Tipo:</label>
                        <select id="formacion-0-tipo" class="form-input">
                            <option value="presencial">Presencial</option>
                            <option value="virtual">Virtual</option>
                            <option value="hibrida">Híbrida</option>
                        </select>
                    </p>
                    <p>
                        <label for="formacion-0-duracion">Duración (horas):</label>
                        <input type="text" id="formacion-0-duracion" class="form-input" placeholder="Duración en horas" />
                    </p>
                </div>
                <div class="formacion-item">
                    <p>
                        <label for="formacion-1-nombre">Nombre:</label>
                        <input type="text" id="formacion-1-nombre" class="form-input" placeholder="Nombre de la formación" />
                    </p>
                    <p>
                        <label for="formacion-1-tipo">Tipo:</label>
                        <select id="formacion-1-tipo" class="form-input">
                            <option value="presencial">Presencial</option>
                            <option value="virtual">Virtual</option>
                            <option value="hibrida">Híbrida</option>
                        </select>
                    </p>
                    <p>
                        <label for="formacion-1-duracion">Duración (horas):</label>
                        <input type="text" id="formacion-1-duracion" class="form-input" placeholder="Duración en horas" />
                    </p>
                </div>
                <div class="formacion-item">
                    <p>
                        <label for="formacion-2-nombre">Nombre:</label>
                        <input type="text" id="formacion-2-nombre" class="form-input" placeholder="Nombre de la formación" />
                    </p>
                    <p>
                        <label for="formacion-2-tipo">Tipo:</label>
                        <select id="formacion-2-tipo" class="form-input">
                            <option value="presencial">Presencial</option>
                            <option value="virtual">Virtual</option>
                            <option value="hibrida">Híbrida</option>
                        </select>
                    </p>
                    <p>
                        <label for="formacion-2-duracion">Duración (horas):</label>
                        <input type="text" id="formacion-2-duracion" class="form-input" placeholder="Duración en horas" />
                    </p>
                </div>
            </div>
        </div>
        <div class="numero-pagina">6</div>
    </div>
</body>
</html>
  `;
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