const html = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Memoria de Actividad 2025 - Impulsalicante</title>
    <style>
/* Reset básico y variables de color */
:root {
  --primary-blue: #0066CC; /* Azul Apple */
  --light-blue-bg: #F5F8FF; /* Azul muy claro para fondos */
  --text-color: #1D1D1F; /* Color de texto Apple */
  --text-secondary: #86868B; /* Color de texto secundario Apple */
  --heading-color: var(--primary-blue); /* Color por defecto para h3, h4... */
  --grey-bg: #ffffff; /* Fondo blanco */
  --light-grey-border: #E5E5E7; /* Gris claro para bordes Apple */
  --placeholder-bg: #F5F5F7; /* Gris muy claro Apple para placeholders */
  --placeholder-border: #D2D2D7; /* Gris para bordes de placeholders */

  /* Colores base por sección - más suaves al estilo Apple */
  --color-agencia: #0066CC; /* Azul Apple */
  --color-empleo: #34C759; /* Verde Apple */
  --color-promo: #FF9F0A; /* Naranja Apple */
  --color-desarrollo: #5E5CE6; /* Púrpura Apple */
  --color-gestion: #00B9C3; /* Cian Apple */
  --color-marketing: #64D2FF; /* Azul claro Apple */
  --color-default-section: #8E8E93; /* Gris Apple */
  
  /* Márgenes fijos para todas las páginas */
  --margin-top: 30mm;
  --margin-bottom: 30mm;
  --margin-left: 20mm;
  --margin-right: 20mm;
}

/* Estilos globales para forzar márgenes en todas las páginas */
@page {
  margin: var(--margin-top) var(--margin-right) var(--margin-bottom) var(--margin-left);
}

body {
    font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    line-height: 1.5;
    margin: 0;
    padding: 0;
    color: var(--text-color);
    background-color: #ffffff;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

.container {
    max-width: 1200px; /* Un poco más ancho */
    margin: 0 auto;
    background-color: #ffffff;
    padding: 0;
    border-radius: 12px; /* Bordes más redondeados al estilo Apple */
    overflow: hidden;
}

/* Estilos específicos para la portada - sin márgenes */
#portada {
    margin: 0;
    padding: 60px 20px;
    page-break-after: always;
}

.page {
    margin-bottom: 40px; /* Más espacio entre secciones */
    padding-bottom: 30px;
    border-bottom: 1px solid var(--light-grey-border);
    /* Variable de color específica de la sección */
    --section-color: var(--color-default-section);
}

.page:last-child { 
    border-bottom: none; 
    margin-bottom: 0; 
}

/* Asignación de --section-color */
.section-agencia { --section-color: var(--color-agencia); }
.section-empleo { --section-color: var(--color-empleo); }
.section-promo { --section-color: var(--color-promo); }
.section-desarrollo { --section-color: var(--color-desarrollo); }
.section-gestion { --section-color: var(--color-gestion); }
.section-marketing { --section-color: var(--color-marketing); }
.section-indice, .section-anexos { --section-color: var(--color-default-section); }

/* Sección especial para el índice */
#indice, #anexos {
    page-break-inside: auto; /* Permitir que el índice se divida entre páginas */
}

#indice ul, #indice ol, #anexos ul, #anexos ol {
    page-break-inside: auto; /* Permitir que las listas de índice se dividan entre páginas */
    margin-top: 0;
    padding-top: 0;
}

#indice li, #anexos li {
    page-break-inside: avoid; /* Evitar que los elementos individuales se corten */
    margin-bottom: 5px; /* Reducir espacio entre elementos de lista en el índice */
}

/* Evitar espacios grandes innecesarios */
#indice h2 + ul, #indice h2 + ol, #anexos h2 + ul, #anexos h2 + ol {
    margin-top: 10px; /* Reducir espacio después del título del índice */
}

/* Títulos de secciones principales del índice */
#indice h2, #anexos h2 {
    margin-bottom: 15px;
    page-break-after: avoid; /* Evitar que el título quede separado de su contenido */
}

h1, h2, h3, h4, h5, h6 {
    margin-top: 1.5em;
    margin-bottom: 0.8em;
    font-weight: 600;
    /* Evitar que los títulos se corten entre páginas */
    page-break-inside: avoid;
    page-break-after: avoid;
}

/* Encabezado principal (H2) usa el color de sección */
h2 {
    font-size: 2em;
    border-bottom: none; /* Quitar borde inferior */
    color: var(--section-color);
    padding-bottom: 0.4em;
    margin-bottom: 1em;
    margin-top: 0;
    font-weight: 600; /* Semi-bold al estilo Apple */
    letter-spacing: -0.02em; /* Espaciado de letras ligeramente negativo, típico de Apple */
}

/* Subtítulos (H3, H4) usan el color de sección */
h3 { 
    font-size: 1.5em; 
    color: var(--section-color); 
    font-weight: 600; 
    margin-top: 1.2em;
    letter-spacing: -0.01em;
}

h4 { 
    font-size: 1.2em; 
    color: var(--section-color); 
    font-weight: 500; /* Más ligero */
    opacity: 0.95; 
    margin-top: 1em;
    letter-spacing: -0.01em;
}

h5 { 
    font-size: 1.05em; 
    color: var(--heading-color); 
    font-weight: 500;
    letter-spacing: -0.01em;
}

p { 
    margin-bottom: 1em; 
    line-height: 1.6;
    color: var(--text-color);
    /* Evitar que los párrafos se corten entre páginas, excepto en índice y anexos */
    page-break-inside: avoid;
}

/* Enlaces usan el color de sección */
.page a {
    color: var(--section-color);
    text-decoration: none;
    font-weight: 500;
    transition: all 0.2s ease;
}

.page a:hover {
    text-decoration: none;
    opacity: 0.8;
}

#contraportada a { color: var(--primary-blue); }
#contraportada a:hover { opacity: 0.8; color: var(--primary-blue); }

/* Para listas generales */
ul, ol { 
    margin-bottom: 1.2em; 
    padding-left: 25px;
    /* Permitir que las listas se dividan si son largas */
    page-break-inside: auto;
}

li { 
    margin-bottom: 0.8em; 
    line-height: 1.6;
    /* Evitar que los elementos individuales se corten */
    page-break-inside: avoid;
}

ul ul, ol ol { padding-left: 30px; }
.annex-list { list-style: decimal; }

table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1.8em;
    font-size: 0.9em;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    /* Evitar que las tablas se corten entre páginas */
    page-break-inside: avoid;
}

/* Forzar salto de página */
.pagebreak {
    display: block;
    clear: both;
    page-break-after: always;
    height: 0;
    margin: 0;
    padding: 0;
    border: 0;
}

/* Definición CSS para control de saltos de página según HTML2PDF */
.html2pdf__page-break {
    height: 0;
    page-break-after: always;
    margin: 0;
    border-top: none;
}

/* Asegurar que las imágenes no se corten entre páginas */
img, .image-placeholder {
    page-break-inside: avoid;
}

/* Estilos específicos para documentos PDF */
@media print {
    body {
        margin: 0;
        padding: 0;
    }
    
    .container {
        margin: 0;
        padding: 0;
        max-width: none;
        width: 100%;
    }
    
    .page:not(#portada) {
        margin: 0;
        padding: 0;
    }
    
    #portada {
        margin: 0;
        padding: 60px 20px;
        page-break-after: always;
    }
}

/* Estilo para todas las páginas excepto la portada */
.page:not(#portada) {
    margin: 30mm 15mm; /* Márgenes superiores/inferiores y laterales para todas las páginas excepto la portada */
}

.page {
    margin-bottom: 60px; /* Más espacio entre secciones */
    padding-bottom: 40px;
    border-bottom: 1px solid var(--light-grey-border);
    /* Variable de color específica de la sección */
    --section-color: var(--color-default-section);
    /* Permitir que las secciones se dividan entre páginas para el índice */
    page-break-inside: auto;
}
.page:last-child { border-bottom: none; margin-bottom: 0; }

/* Asignación de --section-color */
.section-agencia { --section-color: var(--color-agencia); }
.section-empleo { --section-color: var(--color-empleo); }
.section-promo { --section-color: var(--color-promo); }
.section-desarrollo { --section-color: var(--color-desarrollo); }
.section-gestion { --section-color: var(--color-gestion); }
.section-marketing { --section-color: var(--color-marketing); }
.section-indice, .section-anexos { --section-color: var(--color-default-section); }


h1, h2, h3, h4, h5, h6 {
    margin-top: 1.8em;
    margin-bottom: 1em;
    font-weight: 600;
    /* Evitar que los títulos se corten entre páginas */
    page-break-inside: avoid;
    page-break-after: avoid;
}

/* Encabezado principal (H2) usa el color de sección */
h2 {
    font-size: 2em;
    border-bottom: none; /* Quitar borde inferior */
    color: var(--section-color);
    padding-bottom: 0.4em;
    margin-bottom: 1.2em;
    margin-top: 0;
    font-weight: 600; /* Semi-bold al estilo Apple */
    letter-spacing: -0.02em; /* Espaciado de letras ligeramente negativo, típico de Apple */
}
/* Ajuste para el H2 de la primera sección después de la portada */
#indice + section h2, #anexos + section h2 {
     margin-top: 1.8em;
}

/* Subtítulos (H3, H4) usan el color de sección */
h3 { 
    font-size: 1.5em; 
    color: var(--section-color); 
    font-weight: 600; 
    margin-top: 1.5em;
    letter-spacing: -0.01em;
}
h4 { 
    font-size: 1.2em; 
    color: var(--section-color); 
    font-weight: 500; /* Más ligero */
    opacity: 0.95; 
    margin-top: 1.3em;
    letter-spacing: -0.01em;
}
h5 { 
    font-size: 1.05em; 
    color: var(--heading-color); 
    font-weight: 500;
    letter-spacing: -0.01em;
}

p { 
    margin-bottom: 1.1em; 
    line-height: 1.6;
    color: var(--text-color);
    /* Evitar que los párrafos se corten entre páginas, excepto en índice y anexos */
    page-break-inside: avoid;
}

/* Enlaces usan el color de sección */
.page a {
    color: var(--section-color);
    text-decoration: none;
    font-weight: 500;
    transition: all 0.2s ease;
}
.page a:hover {
    text-decoration: none;
    opacity: 0.8;
}
#contraportada a { color: var(--primary-blue); }
#contraportada a:hover { opacity: 0.8; color: var(--primary-blue); }


ul, ol { 
    margin-bottom: 1.2em; 
    padding-left: 25px;
    /* Permitir que las listas se dividan si son largas */
    page-break-inside: auto;
}
li { 
    margin-bottom: 0.8em; 
    line-height: 1.6;
    /* Evitar que los elementos individuales se corten */
    page-break-inside: avoid;
}
ul ul, ol ol { padding-left: 30px; }
.annex-list { list-style: decimal; }

table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1.8em;
    font-size: 0.9em;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    /* Evitar que las tablas se corten entre páginas */
    page-break-inside: avoid;
}

/* Forzar salto de página */
.pagebreak {
    display: block;
    clear: both;
    page-break-after: always;
}

/* Asegurar que las imágenes no se corten entre páginas */
img, .image-placeholder {
    page-break-inside: avoid;
}

.container {
    max-width: 1200px; /* Un poco más ancho */
    margin: 30px auto;
    background-color: #ffffff;
    padding: 30px 40px;
    border-radius: 12px; /* Bordes más redondeados al estilo Apple */
    overflow: hidden;
}

.page {
    margin-bottom: 60px; /* Más espacio entre secciones */
    padding-bottom: 40px;
    border-bottom: 1px solid var(--light-grey-border);
    /* Variable de color específica de la sección */
    --section-color: var(--color-default-section);
}
.page:last-child { border-bottom: none; margin-bottom: 0; }

/* Asignación de --section-color */
.section-agencia { --section-color: var(--color-agencia); }
.section-empleo { --section-color: var(--color-empleo); }
.section-promo { --section-color: var(--color-promo); }
.section-desarrollo { --section-color: var(--color-desarrollo); }
.section-gestion { --section-color: var(--color-gestion); }
.section-marketing { --section-color: var(--color-marketing); }
.section-indice, .section-anexos { --section-color: var(--color-default-section); }


h1, h2, h3, h4, h5, h6 {
    margin-top: 1.8em;
    margin-bottom: 1em;
    font-weight: 600;
}

/* Encabezado principal (H2) usa el color de sección */
h2 {
    font-size: 2em;
    border-bottom: none; /* Quitar borde inferior */
    color: var(--section-color);
    padding-bottom: 0.4em;
    margin-bottom: 1.2em;
    margin-top: 0;
    font-weight: 600; /* Semi-bold al estilo Apple */
    letter-spacing: -0.02em; /* Espaciado de letras ligeramente negativo, típico de Apple */
}
/* Ajuste para el H2 de la primera sección después de la portada */
#indice + section h2, #anexos + section h2 {
     margin-top: 1.8em;
}

/* Subtítulos (H3, H4) usan el color de sección */
h3 { 
    font-size: 1.5em; 
    color: var(--section-color); 
    font-weight: 600; 
    margin-top: 1.5em;
    letter-spacing: -0.01em;
}
h4 { 
    font-size: 1.2em; 
    color: var(--section-color); 
    font-weight: 500; /* Más ligero */
    opacity: 0.95; 
    margin-top: 1.3em;
    letter-spacing: -0.01em;
}
h5 { 
    font-size: 1.05em; 
    color: var(--heading-color); 
    font-weight: 500;
    letter-spacing: -0.01em;
}

p { 
    margin-bottom: 1.1em; 
    line-height: 1.6;
    color: var(--text-color);
}

/* Enlaces usan el color de sección */
.page a {
    color: var(--section-color);
    text-decoration: none;
    font-weight: 500;
    transition: all 0.2s ease;
}
.page a:hover {
    text-decoration: none;
    opacity: 0.8;
}
#contraportada a { color: var(--primary-blue); }
#contraportada a:hover { opacity: 0.8; color: var(--primary-blue); }


ul, ol { margin-bottom: 1.2em; padding-left: 25px; }
li { 
    margin-bottom: 0.8em; 
    line-height: 1.6;
}
ul ul, ol ol { padding-left: 30px; }
.annex-list { list-style: decimal; }

table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1.8em;
    font-size: 0.9em;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}
th, td {
    border: none; /* Sin bordes internos */
    border-bottom: 1px solid var(--light-grey-border);
    padding: 12px 16px;
    text-align: left;
    vertical-align: top;
}
th {
    background-color: var(--section-color);
    font-weight: 500;
    color: white;
    letter-spacing: -0.01em;
}
tbody tr:nth-child(even) { background-color: #F5F5F7; }
tbody tr:hover { background-color: #F0F0F2; }

/* Placeholders de imagen */
.image-placeholder {
    display: flex;
    background-color: var(--placeholder-bg);
    border: none; /* Sin borde */
    border-radius: 8px; /* Bordes redondeados */
    margin: 15px auto;
    color: var(--text-secondary);
    text-align: center;
    overflow: hidden;
    align-items: center;
    justify-content: center;
    font-size: 0.9em;
    font-style: italic;
    min-height: 100px;
}
.logo { 
    display: inline-block;
    vertical-align: middle;
    margin: 5px 10px;
    background-color: var(--placeholder-bg);
    border: none;
    border-radius: 6px;
}
.logo-small { 
    display: inline-block;
    vertical-align: middle;
    margin: 3px 5px;
    background-color: var(--placeholder-bg);
    border: none;
    border-radius: 6px;
}
.icon { 
    width: 60px;
    height: 60px;
    display: inline-block;
    margin: 8px;
    background-color: var(--placeholder-bg);
    border: none;
    border-radius: 12px; /* Más redondeado */
}
.full-width { width: 100%; max-width: 100%; }

/* Portada */
#portada {
    background: linear-gradient(135deg, #0066CC, #5AC8FA); /* Degradado al estilo Apple */
    color: #ffffff;
    text-align: center;
    padding: 60px 20px; /* Más padding vertical */
    border-radius: 12px 12px 0 0;
    margin: -30px -40px 40px -40px;
    box-shadow: 0 10px 20px rgba(0, 102, 204, 0.1); /* Sombra sutil */
}
#portada .portada-content { padding: 0; }
#portada h1 { 
    color: #ffffff;
    font-size: 3.2em;
    line-height: 1.1;
    margin: 20px 0;
    border: none;
    font-weight: 600;
    letter-spacing: -0.03em;
}
#portada .year { 
    font-size: 6.5em;
    font-weight: 700;
    color: #ffffff;
    margin: 10px 0 30px 0;
    line-height: 1;
    letter-spacing: -0.04em;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
#portada .year-highlight { 
    color: #FFCC00; /* Amarillo Apple */
    position: relative;
}
#portada .logos-portada-top, #portada .logos-portada-bottom { 
    margin-bottom: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;
}
#portada .logos-portada-bottom img { 
    filter: brightness(0) invert(1);
    opacity: 0.9;
    transition: transform 0.3s ease, opacity 0.3s ease;
}
#portada .logos-portada-bottom img:hover {
    opacity: 1;
    transform: scale(1.05);
}

.center-content { text-align: center; }
.logos-inline img { 
    display: inline-block; 
    margin: 0 15px;
    transition: transform 0.3s ease;
}
.logos-inline img:hover {
    transform: scale(1.05);
}

/* Galerías de imágenes */
.image-gallery-3, .image-gallery-4, .image-collage-promo {
    display: flex; 
    justify-content: space-around; 
    align-items: flex-start;
    flex-wrap: wrap; 
    gap: 15px; 
    margin-bottom: 1.5em;
}

/* Bloques de Estadísticas - Diseño Apple */
.stats-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    background-color: #ffffff;
    padding: 24px;
    border: none;
    border-radius: 12px;
    margin: 1.5em 0;
    gap: 16px;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05); /* Sombra sutil */
}

.stats-container .stat-block, .stats-container .indicator {
    background-color: #F5F5F7; /* Fondo gris muy claro Apple */
    padding: 16px;
    border-radius: 10px;
    flex-grow: 1;
    transition: transform 0.2s ease;
}

.stats-container .stat-block:hover, .stats-container .indicator:hover {
    transform: translateY(-2px);
}

.budget-stats .stat-block { 
    flex-basis: calc(50% - 10px);
    font-size: 1.05em;
}
.key-indicators .indicator { 
    flex-basis: calc(33% - 12px);
    font-size: 0.95em;
}
.indicator strong, .stat-block strong { 
    color: var(--section-color);
    font-weight: 500;
    display: block;
    margin-bottom: 4px;
    font-size: 0.85em;
    text-transform: uppercase;
    letter-spacing: 0.03em;
}

/* Bloques de Datos Generales - Estilo Apple */
.data-section {
    margin-bottom: 1.5em;
    padding: 20px;
    background-color: #ffffff;
    border: none;
    border-radius: 12px;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05); /* Sombra sutil */
}
.data-section h4 {
    margin-top: 0;
    margin-bottom: 16px;
    color: var(--section-color);
    font-size: 1.1em;
    border-bottom: none;
    padding-bottom: 0.3em;
    position: relative;
}
.data-section h4::after {
    content: '';
    display: block;
    width: 40px;
    height: 2px;
    background-color: var(--section-color);
    position: absolute;
    bottom: 0;
    left: 0;
}
.data-summary-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
    margin: 1.5em 0;
}

/* Lista de Localizaciones */
.locations { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 25px; margin-top: 1.5em; }
.location-block { text-align: center; background-color: #ffffff; padding: 15px; border-radius: 4px; border: 1px solid var(--light-grey-border); }
.location-block img { margin-bottom: 10px; max-width: 100%; height: auto; }
.location-block h4 { margin-bottom: 8px; font-size: 1.05em; color: var(--primary-blue); }
.location-block p { font-size: 0.9em; line-height: 1.4; }

/* Certificación */
.certification { display: flex; align-items: center; background-color: #ffffff; padding: 15px; border: 1px solid var(--light-grey-border); border-radius: 4px; margin-bottom: 1.5em; }
.certification img { margin-right: 20px; }

/* Resultados de Programa */
.program-results { display: flex; align-items: flex-start; gap: 25px; margin: 1.5em 0; background-color: #ffffff; padding: 20px; border-radius: 4px; border: 1px solid #eee; }
.program-results img { flex-shrink: 0; }
.program-results div { flex-grow: 1; }
.program-results h5 { margin-top: 0; color: var(--section-color); } /* Título con color sección */

/* Grid Convenios / Otros */
.convenios-grid, .otros-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-top: 1em; }
.convenio-item, .otro-item { background-color: #fff; padding: 15px; border-radius: 4px; border: 1px solid var(--light-grey-border); box-shadow: none; } /* Fondo blanco y sin sombra */
.convenio-item strong { color: var(--section-color); } /* Resaltado con color sección */
.otro-item h4 { margin-top: 0; font-size: 1.1em; color: var(--section-color); } /* Título con color sección */
.convenio-item img, .otro-item img { max-width: 80%; height: auto; margin-top: 10px; display: block; margin-left:auto; margin-right:auto;}

/* Hub Icons */
.hub-icons { text-align: center; margin-bottom: 1.5em; }

/* --- Layout en Columnas / Grid para Secciones --- */
.section-content-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 400px), 1fr)); /* Columnas adaptables */
    gap: 40px; /* Espacio entre bloques/columnas */
    margin-top: 1.5em;
    background-color: #ffffff;
}
.content-block {
    background-color: #fff;
    padding: 25px; /* Más padding */
    border-radius: 4px;
    box-shadow: none; /* Sin sombra */
    border-top: 4px solid var(--section-color); /* Borde superior con color sección */
    margin-bottom: 1em; /* Espacio inferior para bloques apilados */
}
/* Quitar estilo de bloque para elementos específicos si es necesario */
.content-block.no-style {
    background-color: transparent;
    padding: 0;
    box-shadow: none;
    border-top: none;
}
.content-block.span-2 { /* Para que un bloque ocupe dos columnas si es posible */
    grid-column: span 2;
}
.content-block.full-width-block { /* Para bloques como el de localizaciones */
     grid-column: 1 / -1; /* Ocupa todo el ancho del grid */
     background-color: transparent;
     padding: 0;
     box-shadow: none;
     border-top: none;
}
.subsection-grid { /* Grid interno para listas largas de subpuntos */
     display: grid;
     grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
     gap: 25px;
}
.internal-columns { /* Para poner dos bloques uno al lado del otro dentro de un content-block */
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 25px;
}

/* CSS Columns (Alternativa para listas largas como anexos/índice) */
.columns-2 { column-count: 2; column-gap: 40px; }
.columns-3 { column-count: 3; column-gap: 30px; }
.columns-2 > *, .columns-3 > * { break-inside: avoid; page-break-inside: avoid; margin-top: 0; }
.annex-list.columns-3 li { font-size: 0.85em; }

/* Contraportada */
#contraportada {
    background-color: #ffffff; padding: 30px; margin-top: 30px;
    border-top: 2px solid var(--primary-blue);
}
#contraportada img { margin-bottom: 15px; }
#contraportada p { font-size: 1.1em; }

/* Asegurar que todos los fondos son blancos */
.column-content, .subsection-grid, .internal-columns, 
.activity-item, .location-block, .data-section,
tbody tr:nth-child(even) { 
    background-color: #ffffff !important; 
}

/* Activar este estilo sólo para impresión */
@media print {
  body, html, .container, .page, .content-block, .data-section,
  .stats-container, .location-block, .program-results,
  .convenio-item, .otro-item, #contraportada {
    background-color: #ffffff !important;
    box-shadow: none !important;
  }
}

/* --- Responsive --- */
@media (max-width: 992px) {
    .container { max-width: 90%; padding: 25px 30px;}
    .section-content-grid {
        grid-template-columns: repeat(auto-fit, minmax(min(100%, 350px), 1fr));
        gap: 30px;
    }
    .content-block.span-2 { grid-column: span 1; }
    .columns-3 { column-count: 2; }
    .key-indicators .indicator { flex-basis: calc(50% - 8px); }
    .internal-columns { grid-template-columns: 1fr; } /* Apilar columnas internas */

}

@media (max-width: 768px) {
    .container { padding: 20px; margin: 20px auto; }
    h1 { font-size: 2.2em; }
    h2 { font-size: 1.6em; }
    #portada { padding: 30px 15px; margin: -20px -20px 30px -20px; }
    #portada h1 { font-size: 2.5em; }
    #portada .year { font-size: 4.5em; }

    .section-content-grid { grid-template-columns: 1fr; gap: 25px; }
    .content-block { padding: 15px; }
    .columns-2, .columns-3 { column-count: 1; }

    .stats-container .stat-block, .key-indicators .indicator { flex-basis: 100%; }
    .locations { grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 15px; }
    .program-results { flex-direction: column; align-items: center; text-align: center; }
    .program-results img { margin-bottom: 15px; max-width: 80%; }
    .data-summary-grid { grid-template-columns: 1fr; }
    .convenios-grid, .otros-grid { grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }
}

@media (max-width: 480px) {
    .container { padding: 15px; margin: 15px auto; }
    #portada { padding: 25px 15px; margin-left: -15px; margin-right: -15px; }
    #portada h1 { font-size: 2em; }
    #portada .year { font-size: 3.5em; }

    .locations { grid-template-columns: 1fr; }
     .image-gallery-3 .image-placeholder, .image-gallery-4 .image-placeholder, .image-collage-promo .image-placeholder {
         width: 90% !important; height: auto !important; flex-basis: 90%;
     }
     .convenios-grid, .otros-grid { grid-template-columns: 1fr; }
     .key-indicators .indicator { flex-basis: 100%; font-size: 0.9em;}
}

/* Clearfix para floats (si se usan) */
.clearfix::after {
  content: "";
  clear: both;
  display: table;
}

/* Columnas */
.two-columns, .three-columns, .four-columns {
    display: grid;
    gap: 24px;
    margin: 1.5em 0;
}
.two-columns { grid-template-columns: repeat(2, 1fr); }
.three-columns { grid-template-columns: repeat(3, 1fr); }
.four-columns { grid-template-columns: repeat(4, 1fr); }

.column-content {
    background-color: #ffffff;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
    border: none;
    transition: transform 0.2s ease;
}
.column-content:hover {
    transform: translateY(-2px);
}
.column-content h3, .column-content h4 {
    margin-top: 0;
    color: var(--section-color);
}

/* Lista de localizaciones y componentes */
.locations-list, .components-list {
    list-style: none;
    padding: 0;
    margin: 1em 0;
}
.locations-list li, .components-list li {
    padding: 10px 15px;
    margin-bottom: 8px;
    background-color: #F5F5F7;
    border-radius: 8px;
    transition: transform 0.2s ease, background-color 0.2s ease;
}
.locations-list li:hover, .components-list li:hover {
    background-color: #F0F0F2;
    transform: translateY(-2px);
}
.locations-list strong, .components-list strong {
    display: block;
    color: var(--section-color);
    margin-bottom: 2px;
}

/* Cards */
.card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 24px;
    margin: 1.5em 0;
}
.card {
    background-color: #ffffff;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
    border: none;
    display: flex;
    flex-direction: column;
    transition: transform 0.3s ease;
}
.card:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
}
.card-header {
    margin-bottom: 15px;
    border-bottom: none;
    position: relative;
    padding-bottom: 10px;
}
.card-header::after {
    content: '';
    display: block;
    width: 40px;
    height: 2px;
    background-color: var(--section-color);
    position: absolute;
    bottom: 0;
    left: 0;
}
.card-header h4 {
    margin: 0;
    color: var(--section-color);
    font-size: 1.1em;
    font-weight: 500;
}
.card-body {
    flex-grow: 1;
}
.card-footer {
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #F5F5F7;
    font-size: 0.85em;
    color: var(--text-secondary);
}

/* Contraportada */
#contraportada {
    background: linear-gradient(135deg, #5AC8FA, #0066CC); /* Degradado inverso a la portada */
    color: #ffffff;
    text-align: center;
    padding: 60px 20px;
    border-radius: 0 0 12px 12px;
    margin: 40px -40px -30px -40px;
    box-shadow: 0 -10px 20px rgba(0, 102, 204, 0.1);
}
#contraportada .contraportada-content {
    max-width: 600px;
    margin: 0 auto;
}
#contraportada h2 {
    color: #ffffff;
    font-size: 2em;
    font-weight: 600;
    margin-bottom: 20px;
    letter-spacing: -0.02em;
    border: none;
}
#contraportada p {
    margin-bottom: 20px;
    font-size: 1.05em;
    line-height: 1.6;
}
#contraportada .contact-info {
    margin-top: 30px;
    font-size: 0.9em;
    opacity: 0.9;
}
#contraportada .social-links {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    gap: 15px;
}
#contraportada .social-links a {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.2);
    color: #ffffff;
    transition: background-color 0.3s ease, transform 0.3s ease;
}
#contraportada .social-links a:hover {
    background-color: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
}

/* Botones al estilo Apple */
.btn {
    display: inline-block;
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: 500;
    text-align: center;
    transition: all 0.3s ease;
    margin: 5px;
    border: none;
    cursor: pointer;
}
.btn-primary {
    background-color: var(--section-color);
    color: white;
}
.btn-primary:hover {
    opacity: 0.9;
    transform: translateY(-2px);
}
.btn-secondary {
    background-color: #F5F5F7;
    color: var(--text-color);
}
.btn-secondary:hover {
    background-color: #E0E0E2;
}

/* Paginación */
.pagination {
    display: flex;
    justify-content: space-between;
    margin: 20px 0;
    font-size: 0.9em;
    color: var(--text-secondary);
}
.page-number {
    text-align: center;
}

/* Sección especial para el índice */
#indice {
    page-break-inside: auto; /* Permitir que el índice se divida entre páginas */
}

#indice ul, #indice ol, #anexos ul, #anexos ol {
    page-break-inside: auto; /* Permitir que las listas de índice y anexos se dividan entre páginas */
}

#indice li, #anexos li {
    page-break-inside: avoid; /* Evitar que los elementos individuales se corten */
}

/* Definición CSS para control de saltos de página según HTML2PDF */
.html2pdf__page-break {
    height: 0;
    page-break-after: always;
    margin: 0;
    border-top: none;
}

/* Asegurarse de que la primera parte del índice después de la portada mantiene los márgenes */
.page:first-of-type:not(#portada) {
    margin-top: 30mm;
}
    </style>
</head>
<body>

    <div class="container">

        <section id="portada" class="page section-portada">
            <div class="portada-content">
                <div class="logos-portada-top">
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAADFUlEQVR4nHVUTUhjVxQ+L2ZiiJnEGCVqaWzS2lS0o60/2EJbSqF1ioJQKAUXdlGKQnFRsBulLkQQXHQj4kJciMWFi7pwIVLqoou6KIgVFDQRkxiN5r03mpc3L9/pCWPHRnrgcH/Oub/nnnt+VHieB41GA+x2O9TrdajX62QRCAQUFZH6Pp9PaLVagAooQhAAMIvFQoOh0WhktFptoVqtGkulUs/JycnLm5ubgSyiU8Tj8Q9arfZnEbnk9XrPIpFIbm9vD4xGo2Q2m2V0fnh4qHe73Vc8z99JJBKKTCajR7nkcDhkzPd2d3eFbDar12g0t7QIY4rH43GlUCiMLpdr4Wko9Pb09DSSTCa93d3ddCQIAmiEh3a7/S4QCPxQrVZ3o9HoNxcXF6+XlpZ2CVQB1ul0wsrKSpFUVigURoPBIHR0dFC5ymOq1+v9qXN1dfUjLKEfV1dXv8VnSi0Wi/xsNmsaGBjQTk9P/4SHk7FYTL+5ucnm83nFZrN9gKDvYGkewZfJZEgPD3Ug6eLi4m/I2c+Li4vfUw4V9Bt5AUGvr6+/R/ZMZ2dnyqvV6uft7e3Fvb29B3w+JRrJ0tLSn2dnZ2OlUolNeL3eX5aXl3/DdR8vLCx8vbW19eLW1pYRVUDgsvDo6Oh7ZDlSLBYZr9f7dTabfR4Oh6HZbA4PDw8/wHzR6/XKWCxm6Ow0TuTx8TGtra2N4vPrLpfrevzp/8/Ozv4SDAbfxuPxt4PB4Lf4fM1ms0nokDAZ5SSTyYTJyclvCACnXOHzee3p/Twe+F2mh4eHBxQ0NTU1EQqFvhwbG/uSDhkfH/9ieHj4c3oGXF1dAZ5H16enpxO0Z25u7v3Z2dmP0BrPlUqlEWxTWFhYeJGsQlFPcTEIRVbHORljXq+3ijFKvV7v6OrqSo+OjobOz8+VUCiUQ29S2ICLaJRyxWJRDwaDn2HT38KFtc3NzedoSR91tNGKE3uYTCY5HA7rlUrF3NfXV2AYBiKRSAeDEwg4qIEkQPAOmrSn0WhMYBffW15e/ufPYZFRBm1EnUZZI+IHJAJQw9Q9/QUAAAAASUVORK5CYII=" alt="Logo Impulsalicante" class="image-placeholder logo" style="width: 200px; height: 80px;"/>
                    <img src="https://i.imgur.com/jYUY0vE.jpeg" alt="Logo Ayuntamiento de Alicante" class="image-placeholder logo" style="width: 150px; height: 70px;"/>
          </div>
                <h1>MEMORIA<br>DE ACTIVIDAD</h1>
                <div class="year">20<span class="year-highlight">25</span></div>
                <div class="logos-portada-bottom">
                     <img src="" alt="Logo Observatorio" class="image-placeholder logo-small" style="width: 90px; height: 45px;">
                    <img src="" alt="Logo Pacto Alicante" class="image-placeholder logo-small" style="width: 90px; height: 45px;">
                    <img src="" alt="Logo GVA" class="image-placeholder logo-small" style="width: 90px; height: 45px;">
                    <img src="" alt="Logo Labora" class="image-placeholder logo-small" style="width: 90px; height: 45px;">
                    <img src="" alt="Logo Ministerio" class="image-placeholder logo-small" style="width: 90px; height: 45px;">
                    <img src="" alt="Logo SEPE" class="image-placeholder logo-small" style="width: 70px; height: 35px;">
              </div>
          </div>
        </section>

        <div class="pagebreak"></div>

        <section class="page">
             <img src="" alt="Placeholder Imagen 1" class="image-placeholder full-width" style="width: 100%; height: 400px;">
        </section>

        <section class="page center-content">
             <img src="" alt="Placeholder Imagen 2 - Cubo Impulsalicante" class="image-placeholder" style="width: 300px; height: 300px;">
             <h2>MEMORIA DE ACTIVIDAD 2025</h2>
             <div class="logos-inline">
                 <img src="" alt="Logo Impulsalacant" class="image-placeholder logo" style="width: 180px; height: 50px;">
                 <img src="" alt="Logo Impulsalicante" class="image-placeholder logo" style="width: 180px; height: 50px;">
          </div>
              <img src="" alt="Logo Ayuntamiento de Alicante" class="image-placeholder logo" style="width: 150px; height: 70px;">
         </section>

         <div class="pagebreak"></div>

         <section class="page">
             <div class="image-gallery-3">
                 <img src="" alt="Placeholder Imagen 3" class="image-placeholder" style="width: 30%; height: 200px;">
                 <img src="" alt="Placeholder Imagen 4" class="image-placeholder" style="width: 30%; height: 200px;">
                 <img src="" alt="Placeholder Imagen 5" class="image-placeholder" style="width: 30%; height: 200px;">
      </div>
             <h2>IMPULSALICANTE AGENCIA LOCAL DE DESARROLLO</h2>
         </section>

        <section id="indice" class="page section-indice">
            <h2>ÍNDICE</h2>
            <div class="section-content-grid columns-2"> <div>
                    <h3>1. AGENCIA LOCAL DE DESARROLLO ECONÓMICO Y SOCIAL</h3>
                    <ul>
                        <li>1.1 LA AGENCIA LOCAL EN CIFRAS</li>
                        <li>1.2 QUÉ HACEMOS</li>
                        <li>1.3 CÓMO ESTAMOS ORGANIZADOS</li>
                        <li>1.4 DÓNDE ESTAMOS</li>
                    </ul>
                    <h3>2. DEPARTAMENTO DE EMPLEO Y FORMACIÓN</h3>
                    <ul>
                         <li>2.1 DATOS TOTALES</li>
                         <li>2.2 NUESTROS CENTROS
                             <ul>
                                 <li>2.2.1 Sede Central "Puerta Ferrisa"</li>
                                 <li>2.2.2 Centro de Formación Alejandrina Candela</li>
                                 <li>2.2.3 Centro de Empleo y Formación "El Tossalet"</li>
                                 <li>2.2.4 Servicio de Empleo, Emprendimiento y Formación "Entre dos Castillos-Las Cigarreras"</li>
                             </ul>
                         </li>
                         <li>2.3 NUESTROS SERVICIOS
                             <ul>
                                 <li>2.3.1 Orientación e Intermediación Laboral</li>
                                 <li>2.3.2 Asesoramiento Empresarial y al Autoempleo</li>
                             </ul>
                         </li>
                          <li>2.4 FORMACIÓN</li>
                          <li>2.5 PROGRAMAS Y PROYECTOS
                              <ul>
                                  <li>2.5.1 Programa "Grandes Ciudades"</li>
                                  <li>2.5.2 Programas de Fomento del Empleo</li>
                                  <li>2.5.3 Plan de actuación en brecha digital: cursos con la EOI</li>
                                  <li>2.5.4 Programa Reinserción Mayores de 45 años</li>
                              </ul>
                          </li>
                          <li>2.6 SUBVENCIONES A ENTIDADES
                              <ul>
                                  <li>2.6.1 Subvenciones a entidades sin ánimo de lucro...</li>
                                  <li>2.6.2 Convenios nominativos</li>
                              </ul>
                          </li>
                          <li>2.7 OTROS
                              <ul>
                                  <li>2.7.1 IV Feria de Empleo y Formación</li>
                                  <li>2.7.2 IV Encuentro de Empleo Diversidad Funcional</li>
                                  <li>2.7.3 XII Concurso decoración navideña Zona Norte</li>
                                  <li>2.7.4 Participación en la Red de Entidades por el Empleo</li>
                              </ul>
                          </li>
                    </ul>
                    <h3>3. DEPARTAMENTO DE PROMOCIÓN ECONÓMICA</h3>
                     <ul>
                         <li>3.1 PROGRAMAS DE FOMENTO DE EMPRENDIMIENTO
                             <ul>
                                <li>3.1.1 Oficina de asesoramiento (punto PAE)</li>
                                <li>3.1.2 Formación Centro de Emprendedores</li>
                                <li>3.1.3 Escuela de Talento Femenino</li>
                                <li>3.1.4 IV Edición Impulsacultura proyecta</li>
                                <li>3.1.5 Programa de emprendimiento sostenible - LLAMP</li>
                                <li>3.1.6 Actividades en colaboración con otras entidades</li>
                             </ul>
                         </li>
                         <li>3.2 VIVEROS EMPRESARIALES</li>
                         <li>3.3 AYUDAS ECONÓMICAS A EMPRESAS</li>
                         <li>3.4 COLABORACIÓN EN EVENTOS DE EMPRENDIMIENTO</li>
                  </ul>
              </div>
                 <div>
                    <h3>4. PROGRAMAS DE DESARROLLO LOCAL ESTRATÉGICO</h3>
                        <ul>
                            <li>4.1 PROGRAMA DE DINAMIZACIÓN DE POLÍGONOS INDUSTRIALES...
                                <ul>
                                    <li>4.1.1 Ampliación del suelo industrial</li>
                                    <li>4.1.2 Impulso a Áreas Industriales Avanzadas</li>
                                    <li>4.1.3 Creación de EGM</li>
                                    <li>4.1.4 Proyecto No rotonda táctica Atalayas</li>
                                    <li>4.1.5 Declaración de proyectos prioritarios</li>
                                </ul>
                            </li>
                            <li>4.2 OBSERVATORIO DE ESTRATEGIAS DEL PACTO TERRITORIAL...
                                <ul>
                                    <li>4.2.1 Laboratorio de Nuevas Estrategias de Futuro</li>
                                    <li>4.2.2 Análisis socioeconómico</li>
                                </ul>
                            </li>
                            <li>4.3 ALICANTE FUTURA
                                <ul>
                                     <li>4.3.1 II Congreso Internacional Alicante Futura</li>
                                     <li>4.3.2 II Alicante Smartphone Film Festival</li>
                                     <li>4.3.3 III Copa Robotikid Alicante Futura</li>
                                     <li>4.3.4 7ª Edición Un Mar de Cine</li>
                                </ul>
                            </li>
                            <li>4.4 OFICINA DE ATRACCIÓN DE INVERSIONES - ALIA</li>
                            <li>4.5 PROYECTO CILAB ALICANTE FASE II</li>
                            <li>4.6 OFICINA DE PROYECTOS EUROPEOS</li>
                            <li>4.7 PARTICIPACIÓN EN EVENTOS Y CONGRESOS</li>
                        </ul>
                    <h3>5. ÁREA DE GESTIÓN</h3>
                    <ul>
                        <li>5.1 AUDITORIO</li>
                        <li>5.2 DEPARTAMENTO JURÍDICO ADMINISTRATIVO</li>
                    </ul>
                    <h3>6. DEPARTAMENTO DE MARKETING Y COMUNICACIÓN</h3>
                    <ul>
                        <li>6.1 WEB Y REDES SOCIALES</li>
                        <li>6.2 OTROS CANALES ONLINE</li>
                        <li>6.4 CAMPAÑAS DE MARKETING Y PUBLICIDAD</li>
                    </ul>
          </div>
            </div>
        </section>

        <div class="pagebreak"></div>

        <section id="anexos" class="page section-anexos">
            <h2>Anexos</h2>
             <ol class="annex-list columns-3"> <li>Memoria Entre Castillos 2024-2025.</li>
                <li>Explotación estadística de Portalemp 2025.</li>
                <li>Cuadro Indicadores Actividad Zona Norte 2025.</li>
                <li>Cuadro Indicadores Actividad Centro Formación ALDES 2025.</li>
                <li>Programación formación anual ALDES Ed. 6 2025.</li>
                <li>Listado píldoras-charlas formativas 2025.</li>
                <li>Informe de calidad formación auditoría interna 2025.</li>
                <li>Informe de calidad formación auditoría externa 2025.</li>
                <li>Memoria Programa Grandes Ciudades 2025.</li>
                <li>Resumen programas de fomento del empleo 2025.</li>
                <li>Memoria de ejecución PIE+45 2025.</li>
                <li>Cursos Convenio EOI 2025.</li>
                <li>Resumen resultados subvenciones a entidades 2025.</li>
                <li>Memoria APSA 2025.</li>
                <li>Memoria Cruz Roja 2025.</li>
                <li>Memoria FSG 2025.</li>
                <li>Memoria Lanzadera Santa María la Real 2025.</li>
                <li>Programa y memoria FLC 2025.</li>
                <li>Memoria cursos ALDES-Mercalicante 2025.</li>
                <li>4ª Feria de empleo y formación Zona Norte.</li>
                <li>Memoria IV Encuentro de Empleo (diversidad funcional).</li>
                <li>XII Concurso decoración navideña Zona Norte.</li>
                <li>Memoria servicio asesoramiento emprendedores (Punto PAE).</li>
                <li>Formación Centro de Emprendedores.</li>
                <li>Informe Escuela de Talento Femenino y programación.</li>
                <li>Memoria Impulsacultura Proyecta.</li>
                <li>Memoria actuaciones LLAMP 2025.</li>
                <li>Actividades colaboración Universidad de Alicante.</li>
                <li>Dossier Fikticia Med 5ª Laboratorio Proyectos Ficción.</li>
                <li>Noticia concesión microcrédito.</li>
                <li>Empresas instaladas en viveros 2025.</li>
                <li>Informe ayudas a empresas 2025.</li>
                <li>TimeLine Foro Telecos.</li>
                <li>Dossier Alicante Fashion Week 2025.</li>
                <li>Informe II Edición Valor Social Empresa.</li>
                <li>Memoria Áreas Industriales 2025.</li>
                <li>Memoria declaración proyectos prioritarios 2025.</li>
                <li>Memoria Observatorio Pacto Territorial (EMPACE).</li>
                <li>Informe EPA 4º trimestre 2025.</li>
                <li>Informe paro y contratos diciembre 2025.</li>
                <li>Memoria "Un Mar de Cine 2025".</li>
                <li>Memoria II Congreso Internacional Alicante Futura.</li>
                <li>Memoria II Alicante Smartphone Film Festival.</li>
                <li>Memoria Alicante Futura 2025.</li>
                <li>Memoria final ALIA.</li>
                <li>Memoria Cilab Alicante 2025.</li>
                <li>Proyectos europeos.</li>
                <li>Congreso Euthenia Conference 2025.</li>
                <li>Informe 62º Congreso ERSA 2025.</li>
                <li>Actividades realizadas auditorio Puerta Ferrisa.</li>
                <li>Relación contratos mayores formalizados 2025.</li>
                <li>Relación contratos menores formalizados 2025.</li>
                <li>Informe de comunicación 2025.</li>
                <li>Noticias publicadas en la web 2025.</li>
            </ol>
        </section>

        <div class="pagebreak"></div>

        <section id="agencia-local" class="page section-agencia">
            <h2>1. AGENCIA LOCAL DE DESARROLLO ECONÓMICO Y SOCIAL</h2>
             <img src="" alt="Placeholder Imagen 10 - Impulsalicante Entrada" class="image-placeholder full-width" style="width: 100%; height: 300px;">

             <div class="section-content-grid"> <div class="content-block"> <h3>1.1 LA AGENCIA LOCAL EN CIFRAS</h3>
                     <div class="stats-container budget-stats">
                        <div class="stat-block"><strong>Presupuesto:</strong> 6.336.509,57 €</div>
                        <div class="stat-block"><strong>Presupuesto ajustado:</strong> 5.923.758,36 €</div>
                        <div class="stat-block"><strong>Presupuesto ejecutado:</strong> 5.025.482,34 €</div>
                         <div class="stat-block"><strong>Porcentaje de ejecución:</strong> 84,84%</div>
                     </div>
                     <h3>Indicadores Clave 2025</h3>
                    <div class="stats-container key-indicators">
                         <div class="indicator"><strong>Total usuarios:</strong> 11.662</div>
                         <div class="indicator"><strong>Nuevos usuarios:</strong> 1.979</div>
                         <div class="indicator"><strong>Nº personas atendidas en orientación:</strong> 4.159</div>
                         <div class="indicator"><strong>Horas de orientación laboral:</strong> 9.552</div>
                         <div class="indicator"><strong>Ofertas de empleo gestionadas:</strong> 199</div>
                         <div class="indicator"><strong>Puestos de trabajo (ofertados/gestionados):</strong> 2.038</div>
                         <div class="indicator"><strong>Personas contratadas:</strong> 338</div>
                         <div class="indicator"><strong>Actividades formativas:</strong> 248</div>
                         <div class="indicator"><strong>Horas de formación:</strong> 6.881</div>
                         <div class="indicator"><strong>Participantes en actividades formativas:</strong> 3.389</div>
                         <div class="indicator"><strong>Asesoramiento empresas y emprendedores:</strong> 913</div>
                         <div class="indicator"><strong>Empresas creadas:</strong> 168</div>
                         <div class="indicator"><strong>Empresas en viveros:</strong> 14</div>
                         <img src="" alt="Placeholder Imagen 11 - Ayudas concedidas" class="image-placeholder" style="width: 90%; height: 100px; flex-basis: 100%; margin-top: 15px;">
                    </div>
                 </div>

                 <div class="content-block"> <h3>1.2 QUÉ HACEMOS</h3>
                     <img src="" alt="Placeholder Imagen 12 - Departamentos" class="image-placeholder" style="width: 100%; height: 150px;">
                     <p>Desde su creación en 2000, la Agencia Local de Desarrollo Económico y Social gestiona las actuaciones del Pacto Territorial por el Empleo de Alicante, impulsando la creación de empleo y el desarrollo socioeconómico.</p>
                     <h4>Líneas Estratégicas del Pacto Territorial:</h4>
                     <ol>
                         <li>Apoyo activo al empleo (colectivos vulnerables): Orientación, Formación, Intermediación.</li>
                         <li>Dinamización y diversificación económica: Modernización, Emprendimiento, Atracción de inversiones (ALIA).</li>
                         <li>Transición del modelo productivo: Desarrollo tecnológico, Transformación digital, Innovación y emprendimiento digital (Alicante Futura).</li>
                         <li>Impulso colaboración público-privada y planificación estratégica: Entre administraciones, con entidades, mejora servicios.</li>
                     </ol>
                      <h4>5 Áreas:</h4>
                      <ul>
                         <li>Departamento de Empleo y Formación</li>
                         <li>Departamento de Promoción Económica</li>
                         <li>Departamento Jurídico Administrativo</li>
                         <li>Departamento Económico Financiero</li>
                         <li>Departamento de Marketing y Comunicación</li>
                  </ul>
          </div>

                  <div class="content-block"> <h3>1.3 CÓMO ESTAMOS ORGANIZADOS</h3>
                    <p>Organigrama (representación textual):</p>
                    <ul>
                        <li>Presidencia (Concejala de Empleo y Fomento)</li>
                        <li>Jefatura de servicio
                            <ul>
                                <li>Observatorio Pacto Territorial</li>
                                <li>Jurídico-Administrativo</li>
                                <li>Económico-Financiero</li>
                                <li>Marketing y Comunicación</li>
                                <li>Empleo y Formación
                                    <ul>
                                        <li>Formación para el Empleo</li>
                                        <li>Orientación Laboral</li>
                                        <li>Gestión de ofertas</li>
                                        <li>Programas de Empleo</li>
                          </ul>
                      </li>
                                <li>Promoción Económica
                                    <ul>
                                        <li>Emprendimiento</li>
                                        <li>Desarrollo Empresarial</li>
                                        <li>Áreas Industriales</li>
                                        <li>Programas de Fomento</li>
                                        <li>Proyectos Estratégicos: Alicante Futura, ALIA</li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                  </ul>
              </div>
             </div> <div class="content-block full-width-block"> <h3>1.4 DÓNDE ESTAMOS</h3>
                 <div class="locations">
                    <div class="location-block">
                        <h4>Sede Central Puerta Ferrisa</h4>
                         <img src="" alt="Placeholder Imagen 13 - Edificio Puerta Ferrisa" class="image-placeholder" style="width: 150px; height: 100px;">
                        <p>C/ Jorge Juan, 21<br>03002 Alicante</p>
                    </div>
                    <div class="location-block">
                        <h4>Centro Formación Alejandrina Candela</h4>
                         <img src="" alt="Placeholder Imagen 14 - Centro Alejandrina Candela" class="image-placeholder" style="width: 150px; height: 100px;">
                        <p>Av. Dr. Jiménez Díaz, 27<br>03005 Alicante</p>
                    </div>
                    <div class="location-block">
                        <h4>Centro Empleo y Formación El Tossalet</h4>
                         <img src="" alt="Placeholder Imagen 15 - Centro El Tossalet" class="image-placeholder" style="width: 150px; height: 100px;">
                        <p>C/ Abad Fernández Helguera, 23<br>03010 Alicante</p>
                    </div>
                    <div class="location-block">
                        <h4>Servicio Empleo (Entre dos Castillos - Las Cigarreras)</h4>
                         <img src="" alt="Placeholder Imagen 16 - Las Cigarreras" class="image-placeholder" style="width: 150px; height: 100px;">
                        <p>C/ Sevilla, 2<br>03013 Alicante</p>
                    </div>
                    <div class="location-block">
                        <h4>Centro de Emprendedores</h4>
                         <img src="" alt="Placeholder Imagen 17 - Centro Emprendedores" class="image-placeholder" style="width: 150px; height: 100px;">
                        <p>C/ Cid, 13<br>03001 Alicante</p>
                    </div>
                    <div class="location-block">
                        <h4>Vivero Lanzadera Príncipe Felipe</h4>
                         <img src="" alt="Placeholder Imagen 18 - Vivero Príncipe Felipe" class="image-placeholder" style="width: 150px; height: 100px;">
                        <p>Av. de Elche<br>03013 Alicante</p>
                    </div>
                    <div class="location-block">
                        <h4>Gimnasio de las Ideas</h4>
                          <img src="" alt="Placeholder Imagen 19 - Gimnasio Ideas" class="image-placeholder" style="width: 150px; height: 100px;">
                        <p>Tossal Lab, Rotonda C/ Escultor Bañuls s/n<br>03013 Alicante</p>
                    </div>
                    <div class="location-block">
                        <h4>Espacio Vaillo</h4>
                         <img src="" alt="Placeholder Imagen 20 - Espacio Vaillo" class="image-placeholder" style="width: 150px; height: 100px;">
                        <p>C/ Sargento Vaillo, 28 Bajo dcha</p>
                    </div>
                     <div class="location-block">
                        <h4>Vivero Alicante Emprende</h4>
                          <img src="" alt="Placeholder Imagen 21 - Vivero Alicante Emprende" class="image-placeholder" style="width: 150px; height: 100px;">
                        <p>Ctra. de Madrid, Km 4<br>(03114) Alicante</p>
                    </div>
              </div>
          </div>

             <div class="content-block"> <h3>Universo Impulsalicante - Mapa de Marcas</h3>
                 <p>(Representación textual del mapa de marcas de la página 17)</p>
                 <ul>
                     <li><strong>Marca Madre:</strong> IMPULSALICANTE / IMPULSALACANT (ALDES)</li>
                     <li><strong>Submarcas:</strong> ALIA, Escuela Talento Femenino, IMPULSACULTURA Proyecta, ALICANTE FUTURA, OCUPAT ALACANT, ALICANTE entre dos castillos, CILAB ALICANTE</li>
                     <li><strong>Marcas Satélite:</strong> (Logos colaboradores)</li>
                  </ul>
                 <img src="" alt="Logo Alicante Futura" class="image-placeholder logo-small" style="width: 150px; height: 50px;">
              </div>
        </section>

        <div class="pagebreak"></div>

        <section id="empleo-formacion" class="page section-empleo">
             <div class="image-collage-promo">
                <img src="" alt="Placeholder Imagen 23" class="image-placeholder" style="width: 48%; height: 250px;">
                <img src="" alt="Placeholder Imagen 24" class="image-placeholder" style="width: 48%; height: 250px;">
                <img src="" alt="Placeholder Imagen 25" class="image-placeholder" style="width: 48%; height: 250px;">
                <img src="" alt="Placeholder Imagen 26" class="image-placeholder" style="width: 48%; height: 250px;">
          </div>

            <h2>2. DEPARTAMENTO DE EMPLEO Y FORMACIÓN</h2>
             <img src="" alt="Placeholder Imagen 27 - Ilustración Salida" class="image-placeholder" style="width: 180px; height: 135px; float: right; margin: 0 0 15px 15px;">

             <div class="content-block full-width-block no-style"> <h3>2.1 DATOS TOTALES</h3>
                 <div class="data-summary-grid">
                    <div class="data-section">
                        <h4>ORIENTACIÓN E INTERMEDIACIÓN LABORAL</h4>
                         <p>Personas atendidas: 7.360</p>
                         <p>Nuevas altas demandantes: 1.979</p>
                         <p>Acciones de orientación: 2.126</p>
                         <p>Ofertas de trabajo: 199</p>
      </div>
                     <div class="data-section">
                        <h4>FORMACIÓN</h4>
                         <p>Actividades: 99</p>
                         <p>Cursos: 45</p>
                         <p>Píldoras formativas: 54</p>
                         <p>Participantes: 1.301</p>
                         <p>Horas: 6.092</p>
                     </div>
                     <div class="data-section">
                        <h4>ASESORAMIENTO EMPRESARIAL Y AL AUTOEMPLEO</h4>
                         <p>Personas atendidas en autoempleo: 347</p>
                         <p>Empresas creadas: 54</p>
                     </div>
                 </div>
             </div>
             <div style="clear: both;"></div>

             <div class="section-content-grid columns-2"> <div class="content-block"> <h3>2.2 NUESTROS CENTROS</h3>
                     <p>El Departamento cuenta con cuatro sedes...</p>
                    <h4>2.2.1 Sede Central "Puerta Ferrisa"</h4>
                    <img src="" alt="Placeholder Imagen 28" class="image-placeholder" style="width: 48%; height: 150px; display: inline-block;">
                    <img src="" alt="Placeholder Imagen 29" class="image-placeholder" style="width: 48%; height: 150px; display: inline-block;">
                    <h5>Servicios:</h5> <ul><li>Información</li><li>Orientación laboral</li><li>Prospección</li><li>Píldoras formativas</li><li>Gestión y orientación personal técnico</li><li>Cajero PUNT Labora</li></ul> <p>Nuevas altas demandantes: 387 | Citas orientación: 840 | Píldoras formativas: 21</p>

                    <h4>2.2.2 Centro Formación Alejandrina Candela</h4>
                    <img src="" alt="Placeholder Imagen 30" class="image-placeholder" style="width: 98%; height: 150px;">
                    <h5>Servicios:</h5> <ul><li>Cursos oficiales LABORA</li><li>Talleres de empleo</li><li>Cursos con/sin certificación</li><li>Asesoramiento y orientación alumnado</li></ul> <p>Número de cursos: 20 | Alumnos/as: 272 | Horas de cursos: 6.294</p>

                    <h4>2.2.3 Centro Empleo y Formación El Tossalet</h4>
                     <div class="image-gallery-4"> <img src="" alt="Placeholder Imagen 31" class="image-placeholder" style="width: 48%; height: 100px;">
                        <img src="" alt="Placeholder Imagen 32" class="image-placeholder" style="width: 48%; height: 100px;">
                        <img src="" alt="Placeholder Imagen 33" class="image-placeholder" style="width: 48%; height: 100px;">
                        <img src="" alt="Placeholder Imagen 34" class="image-placeholder" style="width: 48%; height: 100px;">
                     </div>
                    <p>Atención integral Zona Norte</p> <h5>Servicios:</h5> <ul><li>Información</li><li>Orientación laboral</li><li>Cajero PUNT Labora</li><li>Aula informática tutorizada</li><li>Píldoras formativas</li><li>Talleres empleo</li><li>Cursos con certificación</li><li>Asesoramiento emprendimiento</li></ul> <p>Nuevas altas demandantes: 392 | Citas orientación: 633 | Acciones formativas: 42</p>

                    <h4>2.2.4 Servicio Empleo (Entre dos Castillos)</h4>
                     <img src="" alt="Placeholder Imagen 35" class="image-placeholder" style="width: 48%; height: 150px; display: inline-block;">
                    <img src="" alt="Placeholder Imagen 36" class="image-placeholder" style="width: 48%; height: 150px; display: inline-block;">
                    <p>Atención integral área...</p> <h5>Servicios:</h5> <ul><li>Información</li><li>Orientación laboral</li><li>Píldoras formativas</li><li>Asesoramiento emprendimiento</li><li>Prospección empresas</li></ul> <p>Nuevas altas demandantes: 224 | Citas orientación: 653</p>
                    <p><a href="#">Anexo 1: Memoria Entre Castillos 2024-2025</a> | <a href="#">Anexo 2: Explotación estadística Portalemp 2025</a></p>
                 </div>

                 <div class="content-block"> <h3>2.3 SERVICIOS PARA EL EMPLEO</h3>
                      <img src="" alt="Placeholder Imagen 37 - Portalemp Screenshot" class="image-placeholder full-width" style="height: 150px;">
                     <h4>2.3.1 Orientación e intermediación laboral</h4>
                     <p><strong>PORTALEMP:</strong> <a href="https://impulsalicante.portalemp.com" target="_blank">impulsalicante.portalemp.com</a></p>
                     <p>Demandantes registrados: 8.318 | Personas atendidas: 4.155 | Perceptoras prestaciones: 749 | Colectivos vulnerables: 3.906</p>
                     <p>Ofertas de empleo: 199 | Inscripciones/derivaciones: 1.949</p>
                     <p><strong>PERFIL DEMANDANTES 2025:</strong> Mujer mayor de 45 años, parada de larga duración. (Mujeres: 1.977 | Mayores 45: 1.181 | 30-45 años: 798 | Menores 30: 705)</p>
                     <h4>2.3.2 Asesoramiento empresarial y al autoempleo</h4>
                     <p>Sesiones asesoramiento: 347 | Nuevas empresas / altas autónomo: 54</p>

                     <h3>2.4 ACTIVIDADES DE FORMACIÓN</h3>
                     <ol>
                         <li><strong>Cursos LABORA:</strong> Vinculados a Certificados de Profesionalidad (>200h + prácticas). Ej: Jardinería, Limpieza, RTE-Bar, Pastelería.</li>
                         <li><strong>Cursos propios con certificación:</strong> Complementan ocupación (hasta 200h). Ej: Limpieza espacios abiertos.</li>
                         <li><strong>Cursos propios sin certificación:</strong> Competencias socio-profesionales. Ej: Mantenimiento piscinas, Fitosanitarios, Artista Hogueras, Manipulador alimentos (10 ed).</li>
                         <li><strong>Píldoras Formativas:</strong> (1h) Habilidades búsqueda empleo. Ej: Brecha digital, Orientación formación, Búsqueda empleo, Mercado trabajo, Currículum.</li>
                     </ol>
                     <p><a href="#">Anexo 3: Indicadores Actividad Zona Norte 2025</a> | <a href="#">Anexo 4: Indicadores Actividad Centro Formación ALDES 2025</a></p>
                     <h4>Píldoras Formativas por Centro</h4>
                      <table>
                          <thead>
                              <tr><th></th><th>Puerta Ferrisa</th><th>Entre Dos Castillos</th><th>El Tossalet</th><th>Total</th></tr>
                          </thead>
                          <tbody>
                              <tr><td>Píldoras:</td><td>21</td><td>12</td><td>21</td><td>54</td></tr>
                              <tr><td>Asistentes:</td><td>140</td><td>87</td><td>265</td><td>492</td></tr>
                              <tr><td>Horas:</td><td>26,5</td><td>18</td><td>31,5</td><td>75</td></tr>
                          </tbody>
                      </table>
                     <h4>Formación por Modalidad</h4>
                      <table>
                          <thead>
                              <tr><th>Modalidad</th><th>N° Cursos</th><th>Horas</th><th>Participantes</th></tr>
                          </thead>
                          <tbody>
                              <tr><td>Cursos Programación LABORA</td><td>4</td><td>1.560</td><td>45</td></tr>
                              <tr><td>Cursos propios con certificación</td><td>1</td><td>210</td><td>15</td></tr>
                              <tr><td>Cursos propios sin certificación</td><td>15</td><td>596</td><td>325</td></tr>
                              <tr><td>Convenios de formación</td><td>25</td><td>3.651</td><td>424</td></tr>
                              <tr><td><strong>Total</strong></td><td><strong>45</strong></td><td><strong>6.017</strong></td><td><strong>809</strong></td></tr>
                          </tbody>
                      </table>
                     <p><a href="#">Anexo 5: Programación formación anual ALDES Ed. 6 2025</a> | <a href="#">Anexo 6: Listado píldoras-charlas formativas 2025</a></p>
                      <div class="certification">
                        <img src="" alt="Logo AENOR ISO 9001" class="image-placeholder logo-small" style="width: 80px; height: 50px;">
                        <p>Certificación ISO 9001 en actividades de formación mantenida desde 2021, renovada hasta 2026.</p>
                     </div>
                     <p><a href="#">Anexo 7: Informe calidad interna 2025</a> | <a href="#">Anexo 8: Informe calidad externa 2025</a></p>
                 </div>
             </div> <div class="section-content-grid columns-3"> <div class="content-block"> <h3>2.5 PROGRAMAS Y PROYECTOS</h3>
                      <img src="" alt="Placeholder Imagen 38 - Evento o grupo" class="image-placeholder full-width" style="height: 200px;">
                    <h4>2.5.1 Programa "Grandes Ciudades"</h4>
                     <div class="program-results">
                         <img src="" alt="Placeholder Imagen 39 - Gráfico o mapa" class="image-placeholder" style="width: 250px; height: 200px;">
                        <div><h5>ORIENTACIÓN</h5><p>Usuarios únicos: 694 | Itinerarios: 255 | Acciones ind.: 1.073</p><h5>PROSPECCIÓN</h5><p>Empresas: 34 | Inserciones: 51</p><h5>FORMACIÓN</h5><p>22 píldoras</p></div>
                     </div>
                     <p><a href="#">Anexo 9</a></p>

                    <h4>2.5.2 Programas Fomento Empleo</h4>
                     <img src="" alt="Placeholder Imagen 40 - Logos programas empleo" class="image-placeholder full-width" style="height: 80px;">
                    <p>Inv: 3.27M € | Contratados: 100</p> <table><thead><tr><th>Prog</th><th>Contr</th><th>Coste</th></tr></thead><tbody><tr><td>EMPACE</td><td>3</td><td>228k €</td></tr><tr><td>G.C.</td><td>11</td><td>469k €</td></tr><tr><td>T.E.</td><td>36</td><td>811k €</td></tr><tr><td>EMPUJU</td><td>33</td><td>1.04M €</td></tr><tr><td>EXPLUS</td><td>10</td><td>266k €</td></tr><tr><td>EMPA01</td><td>4</td><td>203k €</td></tr><tr><td>ETRAME</td><td>3</td><td>78k €</td></tr><tr><td>PIE+45</td><td>4</td><td>180k €</td></tr></tbody></table> <p>Programas LABORA...</p> <p><a href="#">Anexo 10</a></p>

                    <h4>2.5.3 Programa Reinserción +45</h4>
                     <img src="" alt="Placeholder Imagen 41" class="image-placeholder" style="width: 48%; height: 150px; display: inline-block;">
                    <img src="" alt="Placeholder Imagen 42" class="image-placeholder" style="width: 48%; height: 150px; display: inline-block;">
                    <p>Partic: 31 | Éxito: 25 | Subv: 180k €</p> <p>Horas: 575 form / 350 grup / 486 indiv</p> <p><a href="#">Anexo 11</a></p>

                    <h4>2.5.4 Plan brecha digital EOI</h4>
                    <p>Cursos: 9 | Horas: 3.042 | Partic: 159 | Aptos: 84%</p> <p><a href="#">Anexo 12</a></p>
          </div>

                 <div class="content-block"> <h3>2.6 SUBVENCIONES A ENTIDADES</h3>
                     <div class="image-gallery-3">
                        <img src="" alt="Placeholder Imagen 43" class="image-placeholder" style="width: 30%; height: 100px;">
                        <img src="" alt="Placeholder Imagen 44" class="image-placeholder" style="width: 30%; height: 100px;">
                        <img src="" alt="Placeholder Imagen 45" class="image-placeholder" style="width: 30%; height: 100px;">
              </div>
                    <p>Subv: 166k € | Convenios: 61k €</p>
                    <h4>2.6.1 Subvenciones sin ánimo lucro</h4>
                    <p>Mod A (15 proy): 99k € | Mod B (4 proy): 43k € | Mod C (5 proy): 24k €</p>
                    <p>Usuarios: 2.230 (999 H / 1.231 M)</p>
                    <p><a href="#">Anexo 13</a></p>

                    <h4>2.6.2 Convenios nominativos</h4>
                     <img src="" alt="Placeholder Imagen 46 - Logos entidades convenio" class="image-placeholder full-width" style="height: 60px;">
                    <div class="convenios-grid">
                        <div class="convenio-item"><strong>APSA:</strong> 16k €. 2 contr. <a href="#">Anexo 14</a></div>
                        <div class="convenio-item"><strong>Cruz Roja:</strong> 10k €. 121 atend., 57 insert. <a href="#">Anexo 15</a></div>
                        <div class="convenio-item"><strong>FSG:</strong> 10k €. 526 partic., 108 contr. <a href="#">Anexo 16</a></div>
                        <div class="convenio-item"><strong>F. Sta María Real:</strong> (¿€?). 30 partic., 14 empleo. <a href="#">Anexo 17</a> <img src="" alt="Img Lanzadera" class="image-placeholder" style="width: 100px; height: 60px;"></div>
                        <div class="convenio-item"><strong>FLC:</strong> 15k €. 13 acc, 314 form. <a href="#">Anexo 18</a> <img src="" alt="Img FLC" class="image-placeholder" style="width: 100px; height: 60px;"></div>
                        <div class="convenio-item"><strong>Mercalicante:</strong> 10k €. 4 cursos, 45 dip. <a href="#">Anexo 19</a> <img src="" alt="Img Mercalicante" class="image-placeholder" style="width: 100px; height: 60px;"></div>
          </div>
          </div>

                <div class="content-block"> <h3>2.7 OTROS</h3>
                    <div class="otros-grid">
                         <div class="otro-item">
                            <h4>2.7.1 IV Feria empleo</h4>
                            <img src="" alt="Placeholder Imagen 50" class="image-placeholder" style="width: 90%; height: 120px;">
                            <img src="" alt="Placeholder Imagen 51" class="image-placeholder" style="width: 90%; height: 80px;">
                            <p>29 Mar. +27 org.</p>
                            <p><a href="#">Anexo 20</a></p>
      </div>
                        <div class="otro-item"><h4>2.7.2 IV Encuentro Diversidad</h4><p>24 Nov. 16 empr, 18 asoc.</p><p><a href="#">Anexo 21</a></p></div>
                        <div class="otro-item">
                            <h4>2.7.3 XII Concurso Navidad</h4>
                            <img src="" alt="Placeholder Imagen 52" class="image-placeholder" style="width: 90%; height: 130px;">
                            <img src="" alt="Placeholder Imagen 53" class="image-placeholder" style="width: 90%; height: 80px;">
                            <p>Partic: 11 | Premios: 1.4k €.</p>
                            <p><a href="#">Anexo 22</a></p>
                        </div>
                        <div class="otro-item"><h4>2.7.4 Red Entidades Empleo</h4><p>44 Entid. Mesas...</p> <img src="" alt="Logo Alicante Futura" class="image-placeholder logo-small" style="width: 120px; height: 40px;"></div>
                    </div>
                </div>
             </div> 
        </section>

        <div class="pagebreak"></div>

         <section id="promocion-economica" class="page section-promo">
             <div class="image-collage-promo">
                 <img src="" alt="Placeholder Imagen 54" class="image-placeholder" style="width: 48%; height: 200px;">
                 <img src="" alt="Placeholder Imagen 55" class="image-placeholder" style="width: 48%; height: 200px;">
                 <img src="" alt="Placeholder Imagen 56" class="image-placeholder" style="width: 48%; height: 200px;">
                 <img src="" alt="Placeholder Imagen 57" class="image-placeholder" style="width: 48%; height: 200px;">
             </div>
             <h2>3. DEPARTAMENTO DE PROMOCIÓN ECONÓMICA</h2>
              <img src="" alt="Placeholder Imagen 58 - Diagrama proceso" class="image-placeholder full-width" style="height: 150px;">

             <div class="section-content-grid columns-2"> <div class="content-block full-width-block no-style span-2"> <h3>3.1 DATOS TOTALES</h3>
                     <img src="" alt="Placeholder Imagen 59 - Gráfico datos" class="image-placeholder" style="width: 350px; height: 260px; float: right; margin-left: 15px;">
                    <div class="data-summary-grid">
                        <div class="data-section">
                             <h4>EMPRENDIMIENTO</h4>
                             <p>Asesoram./Mentoriz.: 465</p>
                             <p>Empresas creadas: 114</p>
                             <p>Empleos creados: 273</p>
                         </div>
                         <div class="data-section">
                             <h4>ACTUACIONES</h4>
                             <p>Asesoramientos: 394</p>
                             <p>Punto PAE: Soc. 43, Aut. 42, Bajas 10</p>
                             <p>Microcréditos: 11 concedidos (237.000 €)</p>
                         </div>
                         <div class="data-section">
                             <h4>FORMACIÓN</h4>
                             <p>Acciones: 117 | Horas: 731 | Participantes: 2.002</p>
                         </div>
                    </div>
                     <div style="clear:both;"></div>
                </div>

                 <div class="content-block span-2"> <div class="columns-2 internal-columns">
                          <div>
                             <h3>AYUDAS A EMPRESAS</h3>
                               <img src="" alt="Placeholder Imagen 60" class="image-placeholder" style="width: 30%; height: 100px; display: inline-block;">
                              <img src="" alt="Placeholder Imagen 61" class="image-placeholder" style="width: 30%; height: 100px; display: inline-block;">
                              <img src="" alt="Placeholder Imagen 62" class="image-placeholder" style="width: 30%; height: 100px; display: inline-block;">
                             <p>Importe: 3.99M € | Solicitudes: 3.603 | Benefic.: 2.176</p>
                             <p><a href="#">Anexo 32</a></p>
                          </div>
                          <div>
                             <h3>VIVEROS EMPRESARIALES</h3>
                              <img src="" alt="Placeholder Imagen 73" class="image-placeholder" style="width: 48%; height: 150px; display: inline-block;">
                             <img src="" alt="Placeholder Imagen 74" class="image-placeholder" style="width: 48%; height: 150px; display: inline-block;">
                             <p>Espacios: 26 | Ocupación: Ppe Felipe 100%, Emprende (obras)</p>
                             <p><a href="#">Anexo 31</a></p>
                         </div>
                     </div>
                 </div>


                <div class="content-block span-2"> <h3>3.2 PROGRAMAS DE FOMENTO DE EMPRENDIMIENTO</h3>
                     <div class="subsection-grid"> <div>
                             <h4>3.2.1 Oficina asesoramiento (Punto PAE)</h4>
                             <img src="" alt="Placeholder Imagen 63" class="image-placeholder" style="width: 48%; height: 150px; display: inline-block;">
                             <img src="" alt="Placeholder Imagen 64" class="image-placeholder" style="width: 48%; height: 150px; display: inline-block;">
                             <p>Asesoram: 414 | Creadas: 95 | Sexo: 50H/35M</p> <p><a href="#">Anexo 23</a></p>
                         </div>
                         <div>
                             <h4>3.2.2 Formación Centro Emprendedores</h4>
                              <img src="" alt="Placeholder Imagen 65" class="image-placeholder" style="width: 98%; height: 150px;">
                             <p>Asist: 939 | Acc: 48 | Horas: 277</p> <p><a href="#">Anexo 24</a></p>
                         </div>
                         <div>
                             <h4>3.2.3 Escuela talento femenino</h4>
                             <img src="" alt="Placeholder Imagen 66" class="image-placeholder" style="width: 48%; height: 150px; display: inline-block;">
                             <img src="" alt="Placeholder Imagen 67" class="image-placeholder" style="width: 48%; height: 150px; display: inline-block;">
                             <p>Insc: 1.015 | Asist: 645 | Acc: 39 | Horas: 316</p>
                             <h5>Gala de la Mujer</h5>
                             <img src="" alt="Placeholder Imagen 68" class="image-placeholder" style="width: 48%; height: 180px; display: inline-block;">
                             <img src="" alt="Placeholder Imagen 69" class="image-placeholder" style="width: 48%; height: 180px; display: inline-block;">
                             <p>Partic: L. Sánchez, E. Vidal...</p> <p><a href="#">Anexo 25</a></p>
                         </div>
                         <div>
                             <h4>3.2.4 IV Impulsacultura proyecta</h4>
                             <p>Proy: 29 | Empleo: 17 | Horas: 354</p> <p><a href="#">Anexo 26</a></p>
                         </div>
                          <div>
                             <h4>3.2.5 Programa LLAMP</h4>
                              <img src="" alt="Placeholder Imagen 70" class="image-placeholder logo" style="width: 150px; height: 60px;">
                             <p>LLAMP AMÉS / LLAMP 3I</p> <table>...</table> <p><a href="#">Anexo 27</a></p>
                         </div>
                         <div>
                             <h4>3.2.6 Actividades colaboración</h4>
                             <h5>3.2.6.1 Colaboración UA</h5>
                             <img src="" alt="Placeholder Imagen 71" class="image-placeholder" style="width: 98%; height: 150px;">
                             <table><thead><tr><th>Act.</th><th>Part.</th></tr></thead><tbody><tr><td>Factoría</td><td>46</td></tr><tr><td>ODISEA</td><td>119</td></tr><tr><td>UA:Emprende</td><td>76</td></tr><tr><td>Tabarca E.</td><td>46</td></tr><tr><td>Explorer</td><td>34</td></tr><tr><td>No Limits</td><td>38</td></tr><tr><td><strong>Total</strong></td><td><strong>361</strong></td></tr></tbody></table> <p>Otras...</p> <p><a href="#">Anexo 28</a></p>
                             <h5>3.2.6.2 V Laboratorio Fikticia Med</h5>
                              <img src="" alt="Placeholder Imagen 72" class="image-placeholder logo" style="width: 200px; height: 80px;">
                             <p>Pres: 182 | Sel: 18 | Premios...</p> <p><a href="#">Anexo 29</a></p>
                             <h5>3.2.6.3 Microcréditos Rotary</h5>
                             <p>Cand: 12 | Premio: 6k € | Ganador: Excapic</p> <p><a href="#">Anexo 30</a></p>
                         </div>
                     </div> </div>

                 <div class="content-block span-2"> <h3>3.5 COLABORACIÓN EN EVENTOS</h3>
                     <div class="image-gallery-3">
                         <img src="" alt="Placeholder Imagen 75" class="image-placeholder" style="width: 30%; height: 150px;">
                        <img src="" alt="Placeholder Imagen 76" class="image-placeholder" style="width: 30%; height: 150px;">
                        <img src="" alt="Placeholder Imagen 77" class="image-placeholder" style="width: 30%; height: 150px;">
                     </div>
                     <ul> <li>Homenaje José Espadero (17 Ene)</li>
                         <li>Premios Impulso UA 2025 (15 Jun)</li>
                         <li>Foro TELECOS CV 2025 (5 Oct): Premio a ALDES. <a href="#">Anexo 33</a></li>
                         <li>XXIX Premios Nuevas Ideas FUNDEUN (28 Jun): Premio a BIOINVAL.</li>
                         <li>II Certamen Cortos Helena Cortesina (AEPA, Sep)</li>
                         <li>Focus Pyme L'Alacantí (FEMPA, 9 Nov)</li>
                         <li>IV Gala Empresas Centenarias (Cámara, AEFA, 15 Nov)</li>
                         <li>VII Gala Premios AEPA (27 Oct)</li>
                         <li>II Edición Valor Social Empresa (ALDES, Fund. Transf. Social, 29 Nov). <a href="#">Anexo 35</a></li>
                         <li>8ª Alicante Fashion Week (Oct-Nov). <a href="#">Anexo 34</a></li>
                  </ul>
              </div>
             </div> 
        </section>

        <div class="pagebreak"></div>

        <section id="desarrollo-estrategico" class="page section-desarrollo">
            <img src="" alt="Placeholder Imagen 78 - Foto grande" class="image-placeholder full-width" style="height: 400px;">
            <h2>4. PROGRAMAS DE DESARROLLO LOCAL ESTRATÉGICO</h2>
            <img src="" alt="Placeholder Imagen 79 - Foto grande" class="image-placeholder full-width" style="height: 400px;">

            <div class="section-content-grid columns-2"> <div class="content-block"> <h3>4.1 DINAMIZACIÓN POLÍGONOS INDUSTRIALES</h3>
                    <p>Áreas: 9+2 | Empleos: 15k | Fact.: 2.4k M€ | Sup.: 6.6M m² | Inv '18-'23: 3.85M €</p>
                    <h4>4.1.1 Ampliación suelo</h4> <p>Trámites Atalayas. Estudio cinturón.</p>
                    <h4>4.1.2 Impulso Áreas Avanzadas</h4> <p>Mejoras: Efic. energ, Cámaras...</p>
                    <h4>4.1.3 Creación EGM</h4> <p>2025: Constitución EGM Aguamarga.</p>
                    <h4>4.1.4 No rotonda Atalayas</h4> <p>Finalizada Dic '23. Inv: 235k €</p>
                    <h4>4.1.5 Proyectos prioritarios</h4> <p>Tramitados '23: 13 | Puestos: 151 | Presup: 34.5M €</p>
                    <p><a href="#">Anexo 36</a> | <a href="#">Anexo 37</a></p>
          </div>

                 <div class="content-block"> <h3>4.2 OBSERVATORIO PACTO TERRITORIAL</h3>
                     <p>Secretaría Pacto. Finan: LABORA (EMPACE).</p>
                     <p>Contratados: 3 | Subv: 185k €</p>
                    <h4>4.2.1 Laboratorio Estrategias</h4> <p>Actuaciones '23: Presentación Red, Firma Pacto...</p>
                    <h4>4.2.2 Análisis socioeconómico</h4> <p>4 Informes EPA | 12 Inf. paro</p>
                     <p><a href="#">Anexo 38</a> | <a href="#">Anexo 39</a> | <a href="#">Anexo 40</a></p>
                 </div>

                <div class="content-block"> <h3>4.3 ALICANTE FUTURA</h3>
                     <div class="hub-icons">
                         <img src="" alt="Hub Icon 1" class="image-placeholder icon"> <img src="" alt="Hub Icon 2" class="image-placeholder icon"> <img src="" alt="Hub Icon 3" class="image-placeholder icon">
                         <img src="" alt="Hub Icon 4" class="image-placeholder icon"> <img src="" alt="Hub Icon 5" class="image-placeholder icon"> <img src="" alt="Hub Icon 6" class="image-placeholder icon">
                     </div>
                     <p>Iniciativa estratégica. 6 Hubs.</p>
                     <p>4 Líneas trabajo | Acciones promo/dinam | Talleres...</p>
                     <h4>4.3.1 II Alicante Smartphone Film Fest</h4> <p>Nov '23. 150 cortos | 35 final. <a href="#">Anexo 43</a></p>
                     <h4>4.3.2 III Copa Robotikid</h4> <p>Jun '23. 52 centros | 300 niños. <a href="#">Anexo 44</a></p>
                     <p>Otras: Un Mar de Cine (<a href="#">Anexo 41</a>), Congreso (<a href="#">Anexo 42</a>)...</p>
                </div>

                <div class="content-block"> <h3>4.4 OFICINA ATRACCIÓN INVERSIONES - ALIA</h3>
                     <p>Res '21-'23: 74 proy, 65 empr dir, 452M € inv pot.</p>
                     <p>Act '23: Informes, 13 Activ dinam, 7 Eventos.</p>
                    <p><a href="#">Anexo 45</a></p>
                </div>

                <div class="content-block"> <h3>4.5 PROYECTO CILAB ALICANTE FASE II</h3>
                     <p>Lab Ciudadano (ALDES + Cons. Innov).</p>
                     <p>Contr: 2 | Subv: 81k €</p>
                     <p>Res: Reto medioamb / Reto social.</p>
                    <p><a href="#">Anexo 46</a></p>
                </div>

                 <div class="content-block"> <h3>4.6 OFICINA PROYECTOS EUROPEOS</h3>
                     <p>Funciones: Prep proy UE / Asesorar.</p>
                     <p>Act '23: 60 convoc anal, 5 empr ases, 2 jorn form.</p>
                    <p><a href="#">Anexo 47</a></p>

                    <h3>4.7 JORNADAS, FERIAS Y CONGRESOS</h3>
                     <ul>
                         <li>Congreso Euthenia ('23). <a href="#">Anexo 48</a></li>
                         <li>62º Congreso ERSA (UA). <a href="#">Anexo 49</a></li>
                         <li>Redel y Foro Ciudades.</li>
                  </ul>
              </div>
            </div> 
        </section>

        <div class="pagebreak"></div>

        <section id="gestion" class="page section-gestion">
              <img src="" alt="Placeholder Imagen 80" class="image-placeholder full-width" style="height: 400px;">
             <h2>5. ÁREA DE GESTIÓN</h2>
              <img src="" alt="Placeholder Imagen 81" class="image-placeholder full-width" style="height: 400px;">

             <div class="section-content-grid columns-2"> <div class="content-block">
                     <h3>5.1 AUDITORIO</h3>
                    <p>Actividades: 44 | Asistentes: 2.550</p>
                    <p><a href="#">Anexo 50: Actividades auditorio</a></p>
                 </div>
                 <div class="content-block">
                     <h3>5.2 DEPARTAMENTO JURÍDICO ADMINISTRATIVO</h3>
                    <p>Contratos gestionados 2025:</p>
                    <ul>
                         <li>Mayores: 5 (Importe: 744.495,27 €)</li>
                         <li>Menores: 548 (Importe: 695.186,81 €)</li>
                         <li><strong>Total:</strong> 553 contratos | 1.439.682,08 €</li>
                          </ul>
                     <p><a href="#">Anexo 51: Contratos mayores</a> | <a href="#">Anexo 52: Contratos menores</a></p>
              </div>
          </div>
        </section>

        <div class="pagebreak"></div>

         <section id="marketing" class="page section-marketing">
            <h2>6. DEPARTAMENTO DE MARKETING Y COMUNICACIÓN</h2>
             <div class="section-content-grid columns-2"> <div class="content-block">
                     <h3>6.1 WEB Y REDES SOCIALES</h3>
                    <p>Webs: <a href="http://www.impulsalicante.es" target="_blank">impulsalicante.es</a> | <a href="https://impulsalicante.portalemp.com/" target="_blank">impulsalicante.portalemp.com</a></p>
                    <p>Pub web: 413 | Portalemp: 62 cursos dif, 199 empr ofertas</p>
                    <h4>Redes Sociales:</h4>
                    <table>
                        <thead><tr><th>Red</th><th>Seguidores</th><th>Publicaciones</th></tr></thead>
                        <tbody>
                            <tr><td>Facebook</td><td>9.374</td><td>442</td></tr>
                            <tr><td>X-Twitter</td><td>5.031</td><td>556</td></tr>
                            <tr><td>Instagram</td><td>3.979</td><td>1.183</td></tr>
                            <tr><td>Youtube</td><td>1.690</td><td>404</td></tr>
                            <tr><td>Linkedin</td><td>1.107</td><td>340</td></tr>
                            <tr><td>Telegram</td><td>220</td><td>270</td></tr>
                        </tbody>
                    </table>
        </div>
                  <div class="content-block">
                     <h3>6.2 OTROS CANALES ONLINE</h3>
                    <p>Mailchimp: 1.268 suscritos / 1.125 contactos</p>
                    <p>Zoom: 23 actividades (25 asist. media)</p>
                     <h3>6.3 CAMPAÑAS MARKETING Y PUBLICIDAD</h3> <p>Medios:</p>
                    <ul>
                        <li>Catálogo exportadores</li>
                        <li>Alicante Plaza</li>
                        <li>Revista Atalaya</li>
                        <li>Web Aplauso</li>
                        <li>Asoc. Periodistas</li>
                        <li>Portal Líder</li>
                        <li>Guía UA</li>
                        <li>Onda Cero</li>
                  </ul>
                     <p><a href="#">Anexo 53: Informe comunicación</a> | <a href="#">Anexo 54: Noticias web</a></p>
    </div>
          </div>
        </section>

        <div class="pagebreak"></div>

        <section id="contraportada" class="page section-contraportada center-content">
              <img src="" alt="Logo Impulsalicante" class="image-placeholder logo" style="width: 200px; height: 80px;">
             <p><a href="http://www.impulsalicante.es">www.impulsalicante.es</a></p>
        </section>

    </div> 
    </body>
</html>`

// Función auxiliar para crear la plantilla HTML con el contenido personalizado
export async function crearPlantillaPDF() {
  try {
    console.log("Iniciando creación de plantilla HTML para PDF...");
    
    // Clonar el HTML para no modificar el original
    let htmlContent = html;
    
    // Asegurarnos de que las imágenes placeholders tengan un src
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    // Crear un placeholder base64 para que las imágenes se muestren
    const placeholderImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAyCAYAAACqNX6+AAAACXBIWXMAAAsTAAALEwEAmpwYAAAEOklEQVR4nO2cW27bMBCGp4/tqkBOIJ+gQBYoeoKgJ0ib9LHICdKcoMgJmhO06QnSnCDNCdrnAn1q0RMUaFFUHiRbHJJDUpTlhUX9AwZsLNnk/OTMcGZIhyASiUQikUgkEolEIpFIJBIJGQC3AewA+ExEFRHVeATnOwBeArhTluUrpZRCYMqyxPl85iTG87wvRVG8BvDQNAullDiV1lpXSu2I6BOAt7Zt22GapnUQBOcAbpmmWRVF8SMIgg8AntByJ87X67XUdd3wOF8sFnA9DMPwptPpewBvbJ9xPp9Dr74Z3/fb0+lUl2UJ9r+UUsi9RpIkCIKgZbquqyiKQoQwRkEQFGEYVnEcV2w8Ho8ZNKSvubdwbNu2V2maXs9msz7nQRB8DcOwStO0SpKkbttW7eJFmmYvgzRNw/d9HXM+m80wHo8RRVH3dxiGKIpiy9jsMHEcFy7P7JthmiYejwej6aNlU8AZx1GD5yYZZ/oZTbmxyzXbtgMAK+YSAJ9d181cAq5WK+R5jrqudcZ93zdKszzvvM/zHEopY64cDAZ6jTzPUVUVkiS5fq7neTfcn5vNJhaLBZIkQZqmOtRxcUzT1BhKoijq5tJsNkMYhtfWjeO4832e57Bt276vj9bzDMNQuLYoCtR1jfl83pnb8zydmPM818/jue99jPP5HGVZGkGaptVoNMJ0OsVkMukSfxAE2rtc+2dZpkE+nU4Nj+TCnKbptQewx7Ixf5bCNrZarYxnHEKAKIrqXc/uDftbfZ2/1+Gfv9e29dgmjdHb29Z6z+uFHFpbWVWVMWfUdd0Zwxb+8G39Lmvc1qvfFw67lWmaOmx1eOHN3/D4tv2Mvu+39/X8IYRbzDRtbP/sMmzbNnrP42LNZKIoCjFYE1qWpXMYyPNcex7P8ZozGAwwHA61l7TZF7WKQ0N7XVmWsG0bWutdszyluztN0yBJEjx6Bq7VYV0FjhXGLr7BVWy+7/J1vqZpGq5Xw3VdreVf+UJR6z4nk8lRnmDbtl4D1zE7RJvN5ufKWblc7lu/0xxZlv242Gw2Z7VWL9brNd4DuNh33fF4/LFt20daa6SXl/h0B0CWZZfX/ZjF9/0zz/POLcu6hcNNWqc+1ut1q5TaAri8q/HiOP7ouq5mE4bhrWVZr3dd53neudZ6DeDxnzbnE631h9VqhbeMw3AThqH2CsZdxnQ6RV8Gd5V0NptBa90J2uXlJebz+d7wF4YhkiTRibxvTsuy+o5PuOXuqxZt2z6zbdto8PaVf1mWbTrUXQqKfrXJ11xVk4aN4V1N4b7yvq+87Hv+vtptX9PXtc8xjd9Vfai27P8aR7fOl2XZjSAIHpRluX848y5clPXvvI2zzp+/ZXkL4P6h+0QikUgkEolEIpFIJBKJRCLRb9UvkR6lzA/rWkAAAAAASUVORK5CYII=';
    
    // Reemplazar todas las imágenes placeholder vacías o con URLs inválidas
    const imagenes = tempDiv.querySelectorAll('img');
    imagenes.forEach(img => {
      // Si la imagen no tiene src, está vacía o intenta cargar desde localhost
      // Pero NO reemplazar imágenes que ya tienen formato base64
      if ((!img.src || 
          img.src === '' || 
          img.src === 'about:blank' || 
          img.src.startsWith('http://localhost/') ||
          img.src.startsWith('/')) && 
          !img.src.startsWith('data:image')) {
        
        console.log("Corrigiendo imagen con src:", img.src);
        img.src = placeholderImg;
        
        // Asegurarnos de que no se intente cargar desde una ruta relativa
        img.removeAttribute('srcset');
        img.removeAttribute('data-src');
      }
    });
    
    // También remover cualquier URL relativa de enlaces
    const enlaces = tempDiv.querySelectorAll('a');
    enlaces.forEach(a => {
      if (a.href && (a.href.startsWith('/') || a.href.startsWith('http://localhost/'))) {
        console.log("Corrigiendo enlace con href:", a.href);
        a.href = '#';
      }
    });
    
    // Actualizar el HTML con las imágenes corregidas
    htmlContent = tempDiv.innerHTML;
    
    return htmlContent;
  } catch (error) {
    console.error("Error al crear la plantilla PDF:", error);
    throw error;
  }
}

export { html };