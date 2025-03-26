// Archivo para crear una plantilla PDF con campos de formulario
import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

export async function crearPlantillaPDF() {
  try {
    console.log("Iniciando creación de plantilla PDF...");
    // Crear un nuevo documento PDF
    const pdfDoc = await PDFDocument.create();
    
    // Registrar fontkit para usar fuentes personalizadas
    try {
      pdfDoc.registerFontkit(fontkit);
      console.log("Fontkit registrado correctamente");
    } catch (fontkitError) {
      console.warn("Error al registrar fontkit, continuando sin él:", fontkitError);
      // Continuamos sin fontkit si hay error
    }
    
    // Cargar fuentes estándar
    let helveticaBold, helvetica, timesRoman;
    try {
      helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
      timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      console.log("Fuentes cargadas correctamente");
    } catch (fontError) {
      console.error("Error al cargar fuentes:", fontError);
      // Usar fuentes de fallback en caso de error
      const fallbackFont = await pdfDoc.embedFont(StandardFonts.Courier);
      helveticaBold = fallbackFont;
      helvetica = fallbackFont;
      timesRoman = fallbackFont;
    }
    
    // Definir colores corporativos
    const colorAzulPrimario = rgb(0/255, 70/255, 152/255);
    const colorAzulSecundario = rgb(0/255, 150/255, 255/255);
    const colorGrisClaro = rgb(240/255, 240/255, 240/255);
    
    console.log("Generando portada del PDF...");
    // ======================== PORTADA ========================
    const portada = pdfDoc.addPage([595.28, 841.89]); // A4
    
    // Encabezado con borde azul
    portada.drawRectangle({
      x: 50,
      y: 750,
      width: 495.28,
      height: 50,
      color: colorAzulPrimario,
    });
    
    portada.drawText('INFORME EMPRESARIAL', {
      x: 170,
      y: 775,
      size: 24,
      font: helveticaBold,
      color: rgb(1, 1, 1),
    });
    
    // Rectángulo para logo
    portada.drawRectangle({
      x: 220,
      y: 600,
      width: 150,
      height: 100,
      borderColor: colorAzulPrimario,
      borderWidth: 2,
      color: rgb(1, 1, 1, 0.05),
    });
    
    portada.drawText('LOGO', {
      x: 270,
      y: 650,
      size: 20,
      font: helveticaBold,
      color: colorAzulPrimario,
    });
    
    // Campo para el nombre de la empresa
    portada.drawRectangle({
      x: 50,
      y: 500,
      width: 495.28,
      height: 50,
      color: colorGrisClaro,
    });
    
    portada.drawText('NOMBRE DE LA EMPRESA:', {
      x: 60,
      y: 530,
      size: 14,
      font: helveticaBold,
      color: colorAzulPrimario,
    });
    
    // Campo para fecha del informe
    portada.drawText(`Fecha del informe: ${new Date().toLocaleDateString('es-ES')}`, {
      x: 50,
      y: 450,
      size: 12,
      font: helvetica,
      color: rgb(0, 0, 0),
    });
    
    // Rectángulo inferior con información
    portada.drawRectangle({
      x: 50,
      y: 100,
      width: 495.28,
      height: 100,
      borderColor: colorAzulSecundario,
      borderWidth: 1,
      color: rgb(240/255, 248/255, 255/255, 0.5),
    });
    
    portada.drawText('ImpulseData - Alicante Futura', {
      x: 220,
      y: 170,
      size: 12,
      font: helveticaBold,
      color: colorAzulPrimario,
    });
    
    portada.drawText('Plataforma digital de gestión de datos para la innovación', {
      x: 155,
      y: 150,
      size: 10,
      font: helvetica,
      color: rgb(0, 0, 0),
    });
    
    portada.drawText('y el desarrollo sostenible de Alicante', {
      x: 195,
      y: 130,
      size: 10,
      font: helvetica,
      color: rgb(0, 0, 0),
    });
    
    // ======================== INFORMACIÓN GENERAL ========================
    const infoPage = pdfDoc.addPage([595.28, 841.89]);
    
    // Encabezado con Título
    infoPage.drawRectangle({
      x: 0,
      y: 790,
      width: 595.28,
      height: 50,
      color: colorAzulPrimario,
    });
    
    infoPage.drawText('INFORMACIÓN GENERAL', {
      x: 200,
      y: 815,
      size: 18,
      font: helveticaBold,
      color: rgb(1, 1, 1),
    });
    
    // Campo para nombre de empresa
    infoPage.drawRectangle({
      x: 50,
      y: 730,
      width: 495.28,
      height: 40,
      color: colorGrisClaro,
    });
    
    infoPage.drawText('Nombre de la empresa:', {
      x: 60,
      y: 750,
      size: 12,
      font: helveticaBold,
      color: colorAzulPrimario,
    });
    
    // Crear campo de texto para el nombre
    const nombreField = pdfDoc.getForm().createTextField('empresa.nombre');
    nombreField.setText('');
    nombreField.addToPage(infoPage, {
      x: 200,
      y: 735,
      width: 335,
      height: 25,
      borderWidth: 0,
      backgroundColor: colorGrisClaro,
    });
    
    // Campo para fecha de creación
    infoPage.drawRectangle({
      x: 50,
      y: 680,
      width: 495.28,
      height: 40,
      color: colorGrisClaro,
    });
    
    infoPage.drawText('Fecha de creación:', {
      x: 60,
      y: 700,
      size: 12,
      font: helveticaBold,
      color: colorAzulPrimario,
    });
    
    // Crear campo de texto para la fecha
    const fechaField = pdfDoc.getForm().createTextField('empresa.fecha');
    fechaField.setText('');
    fechaField.addToPage(infoPage, {
      x: 200,
      y: 685,
      width: 335,
      height: 25,
      borderWidth: 0,
      backgroundColor: colorGrisClaro,
    });
    
    // Campo para ciudad
    infoPage.drawRectangle({
      x: 50,
      y: 630,
      width: 495.28,
      height: 40,
      color: colorGrisClaro,
    });
    
    infoPage.drawText('Ciudad:', {
      x: 60,
      y: 650,
      size: 12,
      font: helveticaBold,
      color: colorAzulPrimario,
    });
    
    // Crear campo de texto para la ciudad
    const ciudadField = pdfDoc.getForm().createTextField('empresa.ciudad');
    ciudadField.setText('');
    ciudadField.addToPage(infoPage, {
      x: 200,
      y: 635,
      width: 335,
      height: 25,
      borderWidth: 0,
      backgroundColor: colorGrisClaro,
    });
    
    // Campo para descripción
    infoPage.drawRectangle({
      x: 50,
      y: 470,
      width: 495.28,
      height: 150,
      color: colorGrisClaro,
    });
    
    infoPage.drawText('Descripción:', {
      x: 60,
      y: 600,
      size: 12,
      font: helveticaBold,
      color: colorAzulPrimario,
    });
    
    // Crear campo de texto para la descripción (multilinea)
    const descripcionField = pdfDoc.getForm().createTextField('empresa.descripcion');
    descripcionField.setText('');
    descripcionField.addToPage(infoPage, {
      x: 60,
      y: 480,
      width: 475,
      height: 110,
      borderWidth: 0,
      backgroundColor: colorGrisClaro,
      multiline: true,
    });
    
    // Gráfico decorativo - Círculos conectados
    drawConnectedCircles(infoPage, 150, 350, colorAzulPrimario, colorAzulSecundario);
    
    // Texto informativo
    infoPage.drawText('Este documento contiene información detallada sobre la empresa,', {
      x: 50,
      y: 250,
      size: 12,
      font: helvetica,
      color: rgb(0, 0, 0),
    });
    
    infoPage.drawText('sus departamentos, centros y formaciones ofrecidas.', {
      x: 50,
      y: 230,
      size: 12,
      font: helvetica,
      color: rgb(0, 0, 0),
    });
    
    // ======================== DEPARTAMENTOS ========================
    const deptPage = pdfDoc.addPage([595.28, 841.89]);
    
    // Diseño moderno con barra lateral
    deptPage.drawRectangle({
      x: 0,
      y: 0,
      width: 100,
      height: 841.89,
      color: colorAzulPrimario,
    });
    
    // Título rotado en la barra lateral
    deptPage.drawText('DEPARTAMENTOS', {
      x: 30,
      y: 400,
      size: 14,
      font: helveticaBold,
      color: rgb(1, 1, 1),
      rotate: degrees(90),
    });
    
    // Encabezado
    deptPage.drawRectangle({
      x: 100,
      y: 790,
      width: 495.28,
      height: 50,
      color: colorAzulSecundario,
    });
    
    deptPage.drawText('LISTADO DE DEPARTAMENTOS', {
      x: 230,
      y: 815,
      size: 16,
      font: helveticaBold,
      color: rgb(1, 1, 1),
    });
    
    // Instrucciones
    deptPage.drawText('Esta sección muestra los departamentos de la empresa.', {
      x: 120,
      y: 760,
      size: 12,
      font: helvetica,
      color: rgb(0, 0, 0),
    });
    
    // Tabla para departamentos (cabecera)
    deptPage.drawRectangle({
      x: 120,
      y: 720,
      width: 400,
      height: 30,
      color: colorAzulPrimario,
    });
    
    deptPage.drawText('NOMBRE DEL DEPARTAMENTO', {
      x: 250,
      y: 735,
      size: 12,
      font: helveticaBold,
      color: rgb(1, 1, 1),
    });
    
    // Espacios para 10 departamentos
    for (let i = 0; i < 10; i++) {
      deptPage.drawRectangle({
        x: 120,
        y: 720 - (i + 1) * 40,
        width: 400,
        height: 30,
        color: i % 2 === 0 ? rgb(0.95, 0.95, 0.95) : rgb(0.9, 0.9, 0.9),
        borderColor: rgb(0.8, 0.8, 0.8),
        borderWidth: 0.5,
      });
      
      // Crear campo de texto para cada departamento
      const deptField = pdfDoc.getForm().createTextField(`departamento.${i}`);
      deptField.setText('');
      deptField.addToPage(deptPage, {
        x: 130,
        y: 723 - (i + 1) * 40,
        width: 380,
        height: 25,
        borderWidth: 0,
        backgroundColor: i % 2 === 0 ? rgb(0.95, 0.95, 0.95) : rgb(0.9, 0.9, 0.9),
      });
    }
    
    // Pie de página
    deptPage.drawText('ImpulseData - Información Confidencial', {
      x: 230,
      y: 50,
      size: 10,
      font: helvetica,
      color: rgb(0.5, 0.5, 0.5),
    });
    
    // ======================== CENTROS ========================
    const centrosPage = pdfDoc.addPage([595.28, 841.89]);
    
    // Diseño con header de color superior
    centrosPage.drawRectangle({
      x: 0,
      y: 741.89,
      width: 595.28,
      height: 100,
      color: colorAzulSecundario,
    });
    
    // Líneas decorativas
    for (let i = 0; i < 5; i++) {
      centrosPage.drawLine({
        start: { x: 0, y: 741.89 - i * 5 },
        end: { x: 595.28, y: 741.89 - i * 5 },
        thickness: 2,
        color: rgb(1, 1, 1, 0.1),
      });
    }
    
    centrosPage.drawText('CENTROS', {
      x: 260,
      y: 790,
      size: 24,
      font: helveticaBold,
      color: rgb(1, 1, 1),
    });
    
    // Tabla para centros (cabecera)
    centrosPage.drawRectangle({
      x: 50,
      y: 700,
      width: 495.28,
      height: 30,
      color: colorAzulPrimario,
    });
    
    centrosPage.drawText('NOMBRE DEL CENTRO', {
      x: 100,
      y: 715,
      size: 12,
      font: helveticaBold,
      color: rgb(1, 1, 1),
    });
    
    centrosPage.drawText('DIRECCIÓN', {
      x: 350,
      y: 715,
      size: 12,
      font: helveticaBold,
      color: rgb(1, 1, 1),
    });
    
    // Espacios para 8 centros
    for (let i = 0; i < 8; i++) {
      // Fondo de fila
      centrosPage.drawRectangle({
        x: 50,
        y: 670 - i * 50,
        width: 495.28,
        height: 40,
        color: i % 2 === 0 ? rgb(0.95, 0.95, 0.95) : rgb(0.9, 0.9, 0.9),
      });
      
      // Crear campo de texto para el nombre del centro
      const centroNombreField = pdfDoc.getForm().createTextField(`centro.${i}.nombre`);
      centroNombreField.setText('');
      centroNombreField.addToPage(centrosPage, {
        x: 60,
        y: 676 - i * 50,
        width: 200,
        height: 25,
        borderWidth: 0,
        backgroundColor: i % 2 === 0 ? rgb(0.95, 0.95, 0.95) : rgb(0.9, 0.9, 0.9),
      });
      
      // Crear campo de texto para la dirección
      const centroDireccionField = pdfDoc.getForm().createTextField(`centro.${i}.direccion`);
      centroDireccionField.setText('');
      centroDireccionField.addToPage(centrosPage, {
        x: 280,
        y: 676 - i * 50,
        width: 255,
        height: 25,
        borderWidth: 0,
        backgroundColor: i % 2 === 0 ? rgb(0.95, 0.95, 0.95) : rgb(0.9, 0.9, 0.9),
      });
    }
    
    // Icono decorativo: edificio ilustrado
    drawBuildingIcon(centrosPage, 300, 200, colorAzulPrimario);
    
    // ======================== FORMACIONES ========================
    const formacionesPage = pdfDoc.addPage([595.28, 841.89]);
    
    // Diseño con diagonal de color
    formacionesPage.drawRectangle({
      x: 0,
      y: 0,
      width: 595.28,
      height: 841.89,
      color: rgb(0.98, 0.98, 0.98),
    });
    
    // Rectángulo diagonal
    drawDiagonalRectangle(formacionesPage, colorAzulSecundario);
    
    // Título en un cuadro
    formacionesPage.drawRectangle({
      x: 100,
      y: 760,
      width: 400,
      height: 60,
      color: colorAzulPrimario,
      borderColor: rgb(1, 1, 1),
      borderWidth: 1,
    });
    
    formacionesPage.drawText('FORMACIONES', {
      x: 240,
      y: 790,
      size: 24,
      font: helveticaBold,
      color: rgb(1, 1, 1),
    });
    
    // Tabla para formaciones (cabecera)
    formacionesPage.drawRectangle({
      x: 50,
      y: 700,
      width: 495.28,
      height: 30,
      color: rgb(1, 1, 1, 0.8),
    });
    
    formacionesPage.drawText('NOMBRE', {
      x: 70,
      y: 715,
      size: 12,
      font: helveticaBold,
      color: rgb(1, 1, 1),
    });
    
    formacionesPage.drawText('TIPO', {
      x: 300,
      y: 715,
      size: 12,
      font: helveticaBold,
      color: rgb(1, 1, 1),
    });
    
    formacionesPage.drawText('DURACIÓN', {
      x: 430,
      y: 715,
      size: 12,
      font: helveticaBold,
      color: rgb(1, 1, 1),
    });
    
    // Espacios para 6 formaciones
    for (let i = 0; i < 6; i++) {
      // Fondo de fila
      formacionesPage.drawRectangle({
        x: 50,
        y: 670 - i * 55,
        width: 495.28,
        height: 45,
        color: i % 2 === 0 ? rgb(1, 1, 1, 0.05) : rgb(1, 1, 1, 0.1),
        borderColor: rgb(0.8, 0.8, 0.8),
        borderWidth: 0.5,
      });
      
      // Crear campo de texto para el nombre de la formación
      const formacionNombreField = pdfDoc.getForm().createTextField(`formacion.${i}.nombre`);
      formacionNombreField.setText('');
      formacionNombreField.addToPage(formacionesPage, {
        x: 60,
        y: 678 - i * 55,
        width: 220,
        height: 30,
        borderWidth: 0,
        backgroundColor: i % 2 === 0 ? rgb(1, 1, 1, 0.05) : rgb(1, 1, 1, 0.1),
      });
      
      // Crear dropdown para el tipo
      const tipoField = pdfDoc.getForm().createDropdown(`formacion.${i}.tipo`);
      tipoField.addOptions(['Presencial', 'Virtual', 'Híbrida']);
      tipoField.addToPage(formacionesPage, {
        x: 290,
        y: 678 - i * 55,
        width: 120,
        height: 30,
        borderWidth: 0,
        backgroundColor: i % 2 === 0 ? rgb(1, 1, 1, 0.05) : rgb(1, 1, 1, 0.1),
      });
      
      // Crear campo de texto para la duración
      const duracionField = pdfDoc.getForm().createTextField(`formacion.${i}.duracion`);
      duracionField.setText('');
      duracionField.addToPage(formacionesPage, {
        x: 420,
        y: 678 - i * 55,
        width: 115,
        height: 30,
        borderWidth: 0,
        backgroundColor: i % 2 === 0 ? rgb(1, 1, 1, 0.05) : rgb(1, 1, 1, 0.1),
      });
    }
    
    // Decoración: Iconos educativos
    drawEducationIcons(formacionesPage, 300, 350, colorAzulPrimario);
    
    // Dibujar elementos adicionales
    drawBuildingIcon(formacionesPage, 500, 40, colorAzulSecundario);
    drawEducationIcons(formacionesPage, 70, 40, colorAzulSecundario);
    
    console.log("Guardando documento PDF generado...");
    // Guardar el PDF
    try {
      const pdfBytes = await pdfDoc.save();
      console.log("PDF generado correctamente con un tamaño de", pdfBytes.length, "bytes");
      return pdfBytes;
    } catch (saveError) {
      console.error("Error al guardar el PDF:", saveError);
      // Intentar generar un PDF mínimo como fallback
      try {
        console.log("Intentando generar un PDF mínimo de emergencia...");
        const fallbackDoc = await PDFDocument.create();
        const page = fallbackDoc.addPage([595.28, 841.89]);
        
        // Añadir texto explicativo del error
        page.drawText('Error al generar el PDF completo.', {
          x: 50,
          y: 750,
          size: 16,
        });
        
        page.drawText('Se ha generado un PDF básico como alternativa.', {
          x: 50,
          y: 730,
          size: 14,
        });
        
        page.drawText('Por favor, intente de nuevo más tarde o contacte con soporte.', {
          x: 50,
          y: 710,
          size: 14,
        });
        
        // Guardar PDF de emergencia
        const fallbackBytes = await fallbackDoc.save();
        console.log("PDF de emergencia generado correctamente");
        return fallbackBytes;
      } catch (fallbackError) {
        console.error("Error fatal, no se pudo generar ni siquiera el PDF de emergencia:", fallbackError);
        throw new Error("No se pudo generar el PDF. Error crítico.");
      }
    }
  } catch (error) {
    console.error("Error al crear la plantilla PDF:", error);
    throw error;
  }
}

// Función para dibujar círculos conectados (decoración)
function drawConnectedCircles(page, x, y, color1, color2) {
  // Círculo 1
  page.drawCircle({
    x: x,
    y,
    size: 40,
    color: color1,
  });
  
  // Círculo 2
  page.drawCircle({
    x: x + 100,
    y,
    size: 30,
    color: color2,
  });
  
  // Círculo 3
  page.drawCircle({
    x: x + 180,
    y,
    size: 20,
    color: color1,
  });
  
  // Línea conectora
  page.drawLine({
    start: { x: x + 40, y },
    end: { x: x + 70, y },
    thickness: 2,
    color: color2,
  });
  
  page.drawLine({
    start: { x: x + 130, y },
    end: { x: x + 160, y },
    thickness: 2,
    color: color1,
  });
}

// Función para dibujar icono de edificio (decoración)
function drawBuildingIcon(page, x, y, color) {
  // Base del edificio
  page.drawRectangle({
    x: x - 40,
    y: y - 40,
    width: 80,
    height: 100,
    color,
  });
  
  // Ventanas
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 2; j++) {
      page.drawRectangle({
        x: x - 30 + j * 40,
        y: y - 30 + i * 30,
        width: 20,
        height: 20,
        color: rgb(1, 1, 1),
      });
    }
  }
  
  // Techo
  page.drawRectangle({
    x: x - 50,
    y: y + 60,
    width: 100,
    height: 10,
    color: rgb(0.3, 0.3, 0.3),
  });
}

// Función para dibujar un rectángulo diagonal (decoración)
function drawDiagonalRectangle(page, color) {
  // Crear un polígono para el rectángulo diagonal
  page.drawRectangle({
    x: -100,
    y: 500,
    width: 800,
    height: 400,
    rotate: degrees(-10),
    color: color,
  });
}

// Función para dibujar iconos educativos (decoración)
function drawEducationIcons(page, x, y, color) {
  // Libro
  page.drawRectangle({
    x: x - 50,
    y: y - 30,
    width: 60,
    height: 80,
    color,
  });
  
  page.drawRectangle({
    x: x - 45,
    y: y - 25,
    width: 50,
    height: 70,
    color: rgb(1, 1, 1),
  });
  
  // Lápiz
  page.drawRectangle({
    x: x + 20,
    y: y - 40,
    width: 10,
    height: 70,
    color: rgb(0.9, 0.7, 0.3),
    rotate: degrees(30),
  });
  
  // Punta del lápiz
  page.drawRectangle({
    x: x + 40,
    y: y - 50,
    width: 10,
    height: 15,
    color: rgb(0.3, 0.3, 0.3),
    rotate: degrees(30),
  });
} 