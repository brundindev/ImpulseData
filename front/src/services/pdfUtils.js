
export function crearPortadaSeccion(texto, doc, empresaActual) {
  // Añadir nueva página para portada
  doc.addPage();

  // Fondo decorativo para toda la página
  doc.setFillColor(240, 245, 255);
  doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');

  // Borde decorativo
  doc.setDrawColor(0, 70, 152);
  doc.setLineWidth(1.5);
  doc.rect(
    15,
    15,
    doc.internal.pageSize.width - 30,
    doc.internal.pageSize.height - 30,
    'S'
  );

  // Marco interior
  doc.setDrawColor(0, 100, 200);
  doc.setLineWidth(0.5);
  doc.rect(
    20,
    20,
    doc.internal.pageSize.width - 40,
    doc.internal.pageSize.height - 40,
    'S'
  );

  // Círculo exterior centrado para decoración
  doc.setFillColor(255, 255, 255);
  doc.circle(
    doc.internal.pageSize.width / 2,
    70,
    24,
    'S'
  );
  // Círculo interior relleno
  doc.setFillColor(0, 70, 152);
  doc.circle(
    doc.internal.pageSize.width / 2,
    70,
    20,
    'F'
  );

  // Título grande y centrado
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(0, 70, 152);
  const titleWidth = doc.getStringUnitWidth(texto) * doc.getFontSize() / doc.internal.scaleFactor;
  const titleX = (doc.internal.pageSize.width - titleWidth) / 2;
  doc.text(texto, titleX, 120);

  // Línea decorativa bajo el título
  doc.setLineWidth(1);
  doc.line(
    doc.internal.pageSize.width / 2 - 50,
    130,
    doc.internal.pageSize.width / 2 + 50,
    130
  );

  // Subtítulo o descripción
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(14);
  doc.setTextColor(100, 100, 100);
  const subtitulo = `Informe detallado de ${empresaActual.nombre}`;
  const subtitleWidth = doc.getStringUnitWidth(subtitulo) * doc.getFontSize() / doc.internal.scaleFactor;
  const subtitleX = (doc.internal.pageSize.width - subtitleWidth) / 2;
  doc.text(subtitulo, subtitleX, 150);

  // Fecha del informe
  const fechaGeneracion = new Date().toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  doc.setFontSize(12);
  const fechaWidth = doc.getStringUnitWidth(fechaGeneracion) * doc.getFontSize() / doc.internal.scaleFactor;
  const fechaX = (doc.internal.pageSize.width - fechaWidth) / doc.internal.scaleFactor;
  doc.text(fechaGeneracion, fechaX, 170);

  // Añadir paginación al pie de página
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('ImpulseData - Alicante Futura', doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 20, { align: 'center' });

  // Añadir una nueva página para comenzar la sección
  doc.addPage();

  return 20; // Posición Y inicial para la siguiente sección
}
