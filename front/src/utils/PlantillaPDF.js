const html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Memoria de Actividad 2024 - Documento Completo</title>
    <style>
        /* A4 dimensions for PDF printing */
        @page {
            size: A4;
            margin: 0; /* Remove default margins for printing */
        }

        body {
            margin: 0;
            font-family: Arial, sans-serif; /* Adjust font to match original documents if needed */
            line-height: 1.4;
            color: #333; /* Default text color for the index */
            background-color: #f0f0f0; /* For browser view, not PDF */
        }

        /* --- Page Base Styles --- */
        .a4-page {
            width: 210mm;
            height: 297mm;
            background-color: white;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Visible in browser, not print */
            display: flex;
            flex-direction: column;
            overflow: hidden; /* Important for background images/colors */
            position: relative;
            box-sizing: border-box; /* Include padding in element's total width and height */
            page-break-after: always; /* Default for most pages to force new page */
        }

        /* Ensure the very last page does not have a page break after it */
        .a4-page:last-of-type {
            page-break-after: auto;
        }

        /* --- Cover Page (IMG_4831.jpg) Styles --- */
        .a4-page.main-cover-page {
            /* Specific padding for the cover page to match image */
            padding: 0; /* Content sections handle their own padding */
        }

        .main-cover-page .header-section {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20mm 15mm 10mm;
            background-color: #003366; /* Dark blue, approximate */
            color: white;
            height: 60mm;
        }

        .main-cover-page .header-left, .main-cover-page .header-right {
            display: flex;
            align-items: center;
        }

        .main-cover-page .logo {
            height: 20mm;
            margin-right: 5mm;
        }

        .main-cover-page .text-logo {
            font-size: 10pt;
            line-height: 1.2;
        }

        .main-cover-page .title-section {
            display: flex;
            align-items: flex-end;
            padding: 10mm 15mm;
            background-color: #00509e; /* Lighter blue, approximate */
            color: white;
            flex-grow: 1;
        }

        .main-cover-page .main-title {
            font-size: 36pt;
            font-weight: bold;
            margin-right: 15mm;
        }

        .main-cover-page .year {
            font-size: 60pt;
            font-weight: bold;
            color: black;
            background-color: white;
            padding: 0 10mm;
            margin-bottom: 5mm;
        }

        .main-cover-page .image-section {
            flex-grow: 3;
            background-color: #f8f8f8; /* Fallback background for missing image */
            /* background-image: url('path/to/your/cover-background-image.jpg'); /* Replace with your main background image path for the cover */
            background-size: cover;
            background-position: center bottom;
            position: relative;
            z-index: 1;
        }
        .main-cover-page .image-section img {
            display: block; /* Ensure the image takes up the space */
            width: 100%;
            height: 100%;
            object-fit: cover;
        }


        .main-cover-page .footer-section {
            display: flex;
            justify-content: space-around;
            align-items: center;
            padding: 10mm 15mm;
            background-color: white;
            height: 30mm;
            border-top: 1px solid #eee;
        }

        .main-cover-page .footer-logo-group {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
        }

        .main-cover-page .footer-logo {
            height: 15mm;
            margin-bottom: 2mm;
        }

        .main-cover-page .footer-text {
            font-size: 7pt;
            color: #555;
        }

        /* --- Index Page Styles --- */
        .a4-page.index-page {
            padding: 20mm 15mm; /* General page padding for index */
        }

        .content-area {
            display: grid;
            grid-template-columns: 30mm 1fr; /* Number column and content column */
            gap: 10mm;
            flex-grow: 1;
        }

        .main-section-number {
            font-size: 80pt;
            font-weight: bold;
            color: #00509e; /* Blue */
            text-align: center;
            line-height: 1;
            padding-top: 5mm;
            transform: translateY(-20mm); /* Adjust to align with text. May need fine-tuning */
            position: sticky;
            top: 0;
            align-self: flex-start;
        }

        .section-content {
            padding-top: 10mm;
            border-bottom: 1px solid #eee; /* Subtle separator line */
            padding-bottom: 5mm;
            margin-bottom: 10mm;
        }

        .section-content:last-of-type {
            border-bottom: none; /* No line under the last section on a page */
        }

        .section-title {
            font-size: 14pt;
            font-weight: bold;
            color: #003366; /* Darker blue */
            margin-bottom: 5mm;
        }

        .index-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .index-list li {
            margin-bottom: 3mm;
            font-size: 9pt;
            color: black; /* All index list items are black by default */
        }

        .index-list ul {
            list-style: none;
            padding-left: 10mm; /* Indent sub-levels */
            margin-top: 3mm;
            margin-bottom: 0;
        }

        .index-list ul li {
            margin-bottom: 2mm;
        }

        /* Adjust padding for the first section number if needed */
        #section1-number {
             margin-top: -10mm; /* Pull up to align with the very top of the content */
        }

        /* --- Generic Section Cover Page Styles --- */
        .a4-page.section-cover {
            padding: 0; /* No general padding, content takes over */
            display: block; /* Override flex for a more direct layout */
            /* Common styles for elements within section covers */
        }

        .section-cover .section-number-overlay {
            position: absolute;
            font-size: 80pt;
            font-weight: bold;
            color: white;
            padding: 0 15mm;
            line-height: 1;
            display: inline-block;
            box-sizing: border-box;
        }

        .section-cover .section-main-title {
            color: white;
            padding: 15mm 15mm 10mm 50mm; /* Adjust padding, especially left to align with number */
            font-size: 24pt;
            font-weight: bold;
            line-height: 1.2;
            text-transform: uppercase;
        }

        .section-cover .background-image-content {
            flex-grow: 1;
            background-color: #f8f8f8; /* Fallback background for missing image */
            background-size: cover;
            background-position: center;
            position: relative;
            z-index: 1;
        }
        .section-cover .background-image-content img {
            display: block; /* Ensure the image takes up the space */
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        /* --- Specific Styles for Section 1 Cover (IMG_4835.jpg) --- */
        .a4-page.section-cover.section-1 {
            /* Specific padding for this cover if needed, currently using generic .section-cover padding: 0 */
        }
        .section-cover.section-1 .top-color-bar {
            height: 40mm; /* Approximate height of the solid blue bar */
            background-color: #00509e; /* Lighter blue */
            position: relative;
        }
        .section-cover.section-1 .section-number-overlay {
            top: 15mm; /* Adjust vertical position */
            left: 15mm; /* Adjust horizontal position */
            background-color: #003366; /* Dark blue background for the number */
        }
        .section-cover.section-1 .section-main-title {
            background-color: #00509e; /* Lighter blue */
        }


        /* --- Specific Styles for Section 2 Cover (IMG_4836.jpg) --- */
        .a4-page.section-cover.section-2 {
            /* Specific padding for this cover if needed, currently using generic .section-cover padding: 0 */
        }
        .section-cover.section-2 .top-color-bar {
            height: 60mm; /* Approximate height of the two-tone top section */
            background: linear-gradient(to bottom, #98d1c6 50%, #008f82 50%); /* Top: light green, Bottom: dark green */
            position: relative;
        }
        .section-cover.section-2 .section-number-overlay {
            top: 15mm; /* Adjust vertical position */
            left: 15mm; /* Adjust horizontal position */
            background-color: #008f82; /* Dark green background for the number */
        }
        .section-cover.section-2 .section-main-title {
            background-color: #000000; /* Black background for the title */
            padding: 15mm 15mm 10mm 50mm; /* Consistent padding */
        }


        /* --- Specific Styles for Section 3 Cover (IMG_4837.jpg) --- */
        .a4-page.section-cover.section-3 {
            /* Specific padding for this cover if needed, currently using generic .section-cover padding: 0 */
        }
        .section-cover.section-3 .top-color-bar {
            height: 60mm; /* Approximate height of the two-tone top section */
            background: linear-gradient(to bottom, #ff9900 50%, #cc6600 50%); /* Top: orange, Bottom: dark orange */
            position: relative;
        }
        .section-cover.section-3 .section-number-overlay {
            top: 15mm; /* Adjust vertical position */
            left: 15mm; /* Adjust horizontal position */
            background-color: #cc6600; /* Dark orange background for the number */
        }
        .section-cover.section-3 .section-main-title {
            background-color: #000000; /* Black background for the title */
            padding: 15mm 15mm 10mm 50mm; /* Consistent padding */
        }

        /* --- Specific Styles for Section 4 Cover (IMG_4838.jpg) --- */
        .a4-page.section-cover.section-4 {
            /* Specific padding for this cover if needed, currently using generic .section-cover padding: 0 */
        }
        .section-cover.section-4 .top-color-bar {
            height: 60mm; /* Approximate height of the two-tone top section */
            background: linear-gradient(to bottom, #d62f4e 50%, #8b0000 50%); /* Top: red, Bottom: dark red */
            position: relative;
        }
        .section-cover.section-4 .section-number-overlay {
            top: 15mm; /* Adjust vertical position */
            left: 15mm; /* Adjust horizontal position */
            background-color: #8b0000; /* Dark red background for the number */
        }
        .section-cover.section-4 .section-main-title {
            background-color: #000000; /* Black background for the title */
            padding: 15mm 15mm 10mm 50mm; /* Consistent padding */
        }


        /* --- Page Footer (common to all pages with page number) --- */
        .page-footer {
            position: absolute;
            bottom: 15mm;
            right: 15mm;
            display: flex;
            align-items: flex-end;
            font-size: 10pt;
            color: #333;
        }

        .page-footer .title {
            font-size: 10pt;
            font-weight: normal;
            margin-right: 5mm;
        }

        .page-footer .year {
            font-size: 16pt;
            font-weight: bold;
            color: black;
            background-color: white;
            padding: 0 5mm;
        }

        .page-footer .page-number {
            font-size: 18pt;
            font-weight: bold;
            color: #333;
            margin-left: 5mm;
        }

        /* Print-specific adjustments */
        @media print {
            body {
                min-height: auto;
            }
            .a4-page {
                box-shadow: none;
                margin: 0;
            }
            /* Specific padding for index pages during print */
            .a4-page.index-page {
                padding: 20mm 15mm;
            }
        }
    </style>
</head>
<body>
    <div class="a4-page main-cover-page">
        <div class="header-section">
            <div class="header-left">
                <img src="path/to/impulsalicante-logo.png" alt="Impulsalicante Logo" class="logo">
                <div class="text-logo">
                    IMPULS ALICANTE<br>AGENCIA LOCAL DE DESARROLLO
                </div>
            </div>
            <div class="header-right">
                <img src="path/to/ayuntamiento-alicante-logo.png" alt="Ayuntamiento de Alicante Logo" class="logo">
                <div class="text-logo">
                    AYUNTAMIENTO DE ALICANTE
                </div>
            </div>
        </div>

        <div class="title-section">
            <div class="main-title">
                MEMORIA<br>DE ACTIVIDAD
            </div>
            <div class="year">
                20<br>24
            </div>
        </div>

        <div class="image-section">
            <img src="path/to/your/cover-background-image.jpg" alt="Cityscape with palm trees" style="width: 100%; height: 100%; object-fit: cover;">
        </div>

        <div class="footer-section">
            <div class="footer-logo-group">
                <img src="path/to/observatorio-logo.png" alt="Observatorio Pacto Logo" class="footer-logo">
                <div class="footer-text">OBSERVATORIO<br>PACTO</div>
            </div>
            <div class="footer-logo-group">
                <img src="path/to/generalitat-valenciana-logo.png" alt="Generalitat Valenciana Logo" class="footer-logo">
                <div class="footer-text">GENERALITAT<br>VALENCIANA</div>
            </div>
            <div class="footer-logo-group">
                <img src="path/to/labora-logo.png" alt="Labora Logo" class="footer-logo">
                <div class="footer-text">LABORA<br><small>Servei Valencià d'Ocupació i Formación</small></div>
            </div>
            <div class="footer-logo-group">
                <img src="path/to/sepe-logo.png" alt="SEPE Logo" class="footer-logo">
                <div class="footer-text">SEPE</div>
            </div>
        </div>
    </div>

    <div class="a4-page index-page">
        <div class="content-area">
            <div class="number-col">
                <div class="main-section-number" id="section1-number">1</div>
            </div>
            <div class="section-content">
                <div class="section-title">AGENCIA LOCAL<br>DE DESARROLLO ECONÓMICO Y SOCIAL</div>
                <ul class="index-list">
                    <li>1.1 LA AGENCIA LOCAL EN CIFRAS</li>
                    <li>1.2 QUÉ HACEMOS</li>
                    <li>1.3 CÓMO ESTAMOS ORGANIZADOS</li>
                    <li>1.4 DÓNDE ESTAMOS</li>
                </ul>
            </div>

            <div class="number-col">
                <div class="main-section-number">2</div>
            </div>
            <div class="section-content">
                <div class="section-title">DEPARTAMENTO DE EMPLEO Y FORMACIÓN</div>
                <ul class="index-list">
                    <li>2.1 DATOS TOTALES</li>
                    <li>2.2 NUESTROS CENTROS
                        <ul>
                            <li>2.2.1 Sede Central "Puerto Ferris"</li>
                            <li>2.2.2 Centro de Formación de la Agencia Local "Nazaret"</li>
                            <li>2.2.3 Centro de Empleo y Formación "El Tossalet"</li>
                            <li>2.2.4 Espacio de Empleo, Emprendimiento y Formación<br><small>"Entreplanta" (Antiguas Casas Consistoriales)</small></li>
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
                            <li>2.5.3 Plan de actuación en brecha digital<br><small>Cursos con la Escuela de Organización Industrial - EOI</small></li>
                            <li>2.5.4 Programa Reinserción Mayores de 45 años</li>
                        </ul>
                    </li>
                    <li>2.6 SUBVENCIONES A ENTIDADES
                        <ul>
                            <li>2.6.1 Subvenciones a entidades sin ánimo de lucro para el fomento de la<br>inserción laboral, la innovación social y el emprendimiento en la ciudad<br>de Alicante 2024</li>
                            <li>2.6.2 Convenios nominativos</li>
                        </ul>
                    </li>
                    <li>2.7 OTROS
                        <ul>
                            <li>2.7.1 IV Feria de Empleo y Formación</li>
                            <li>2.7.2 V Encuentro de Empleo Dirigido a Personas con Diversidad Funcional</li>
                            <li>2.7.3 XII Concurso de decoración navideña de comercios y escaparates de<br>la Zona Norte de Alicante - Navidad 2024</li>
                            <li>2.7.4 Participación en la Red de Entidades por el Empleo de la ciudad de Alicante</li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
        <div class="page-footer">
            <span class="title">MEMORIA</span>
            <span class="year">20<br>24</span>
            <span class="page-number">3</span>
        </div>
    </div>

    <div class="a4-page index-page">
        <div class="content-area">
            <div class="number-col">
                <div class="main-section-number">3</div>
            </div>
            <div class="section-content">
                <div class="section-title">DEPARTAMENTO DE PROMOCIÓN ECONÓMICA</div>
                <ul class="index-list">
                    <li>3.1 PROGRAMAS DE FOMENTO DE EMPRENDIMIENTO
                        <ul>
                            <li>3.1.1 Oficina de asesoramiento a personas emprendedoras (Punto PAE)</li>
                            <li>3.1.2 Operación Centro de Emprendedores</li>
                            <li>3.1.3 Escuela de Talento Femenino</li>
                            <li>3.1.4 IV Edición Impulsacultura proyecto</li>
                            <li>3.1.5 Programa de emprendimiento sostenible - LLAMP</li>
                            <li>3.1.6 Actividades en colaboración con otras entidades
                                <ul>
                                    <li>3.1.6.1 Colaboración con la Universidad de Alicante</li>
                                    <li>3.1.6.2 V Laboratorio de proyectos y presentación de proyectos de <small>I+D+I</small></li>
                                </ul>
                            </li>
                            <li>3.1.6.3 Microcréditos Rotary Club Alicante Puerto</li>
                        </ul>
                    </li>
                    <li>3.2 VIVEROS EMPRESARIALES</li>
                    <li>3.3 AYUDAS ECONÓMICAS A EMPRESAS DE LA CIUDAD DE ALICANTE</li>
                    <li>3.4 COLABORACIÓN EN EVENTOS DE EMPRENDIMIENTO Y PROMOCIÓN EMPRESARIAL</li>
                </ul>
            </div>

            <div class="number-col">
                <div class="main-section-number">4</div>
            </div>
            <div class="section-content">
                <div class="section-title">PROGRAMAS DE DESARROLLO LOCAL ESTRATÉGICO</div>
                <ul class="index-list">
                    <li>4.1 PROGRAMA DE DINAMIZACIÓN DE POLÍGONOS INDUSTRIALES Y NUEVOS ESPACIOS PRODUCTIVOS
                        <ul>
                            <li>4.1.1 Observatorio de suelo industrial en Alicante</li>
                            <li>4.1.2 Impulso a la creación de Áreas Industriales Avanzadas</li>
                            <li>4.1.3 Creación de Entidades de Gestión y Modernización en las áreas industriales</li>
                            <li>4.1.4 Proyecto de Nodo de Apoyo Táctico en Atalayas, ciudad industrial</li>
                            <li>4.1.5 Declaración de proyectos prioritarios</li>
                        </ul>
                    </li>
                    <li>4.2 OBSERVATORIO DE ESTRATEGIA DEL PACTO TERRITORIAL POR EL EMPLEO DE LA CIUDAD DE ALICANTE
                        <ul>
                            <li>4.2.1 Laboratorio de Nuevas Estrategias de Futuro</li>
                            <li>4.2.2 Análisis socioeconómico de la ciudad de Alicante</li>
                        </ul>
                    </li>
                    <li>4.3 ALICANTE FUTURA
                        <ul>
                            <li>4.3.1 II Congreso Internacional Alicante Futura</li>
                            <li>4.3.2 II Alicante Smartphone Film Festival</li>
                            <li>4.3.3 III Copa Robotikid Alicante Futura</li>
                            <li>4.3.4 <small>7ª</small> Edición Un Mar de Cine</li>
                        </ul>
                    </li>
                    <li>4.4 OFICINA DE ATRACCIÓN DE INVERSIONES - ALIA</li>
                    <li>4.5 PROYECTO CILAB ALICANTE FASE II</li>
                    <li>4.6 OFICINA DE PROYECTOS EUROPEOS</li>
                    <li>4.7 PARTICIPACIÓN EN EVENTOS Y CONGRESOS</li>
                </ul>
            </div>
        </div>
        <div class="page-footer">
            <span class="title">MEMORIA</span>
            <span class="year">20<br>24</span>
            <span class="page-number">4</span>
        </div>
    </div>

    <div class="a4-page index-page">
        <div class="content-area">
            <div class="number-col">
                <div class="main-section-number">5</div>
            </div>
            <div class="section-content">
                <div class="section-title">ÁREA DE GESTIÓN</div>
                <ul class="index-list">
                    <li>5.1 AUDITORIO</li>
                    <li>5.2 DEPARTAMENTO JURÍDICO ADMINISTRATIVO</li>
                </ul>
            </div>

            <div class="number-col">
                <div class="main-section-number">6</div>
            </div>
            <div class="section-content">
                <div class="section-title">DEPARTAMENTO DE MARKETING Y COMUNICACIÓN</div>
                <ul class="index-list">
                    <li>6.1 WEB Y REDES SOCIALES</li>
                    <li>6.2 OTROS CANALES ONLINE</li>
                    <li>6.4 CAMPAÑAS DE MARKETING Y PUBLICIDAD</li>
                </ul>
            </div>
        </div>
        <div class="page-footer">
            <span class="title">MEMORIA</span>
            <span class="year">20<br>24</span>
            <span class="page-number">5</span>
        </div>
    </div>

    <div class="a4-page section-cover section-1">
        <div class="top-color-bar">
            <span class="section-number-overlay">1</span>
        </div>
        <div class="section-main-title">
            AGENCIA LOCAL DE DESARROLLO<br>ECONÓMICO Y SOCIAL
        </div>
        <div class="background-image-content">
            <img src="path/to/your/section1-background-text-image.jpg" alt="Impulsalicante building and text" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        </div>

    <div class="a4-page section-cover section-2">
        <div class="top-color-bar">
            <span class="section-number-overlay">2</span>
        </div>
        <div class="section-main-title">
            DEPARTAMENTO DE<br>EMPLEO Y FORMACIÓN
        </div>
        <div class="background-image-content">
            <img src="path/to/your/section2-classroom-image.jpg" alt="Classroom with students and instructor" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        </div>

    <div class="a4-page section-cover section-3">
        <div class="top-color-bar">
            <span class="section-number-overlay">3</span>
        </div>
        <div class="section-main-title">
            DEPARTAMENTO DE<br>PROMOCIÓN ECONÓMICA
        </div>
        <div class="background-image-content">
            <img src="path/to/your/section3-promotion-image.jpg" alt="People at a presentation or meeting" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        </div>

    <div class="a4-page section-cover section-4">
        <div class="top-color-bar">
            <span class="section-number-overlay">4</span>
        </div>
        <div class="section-main-title">
            PROGRAMAS DE<br>DESARROLLO LOCAL<br>ESTRATÉGICO
        </div>
        <div class="background-image-content">
            <img src="path/to/your/section4-strategic-dev-image.jpg" alt="Outdoor event with a large screen and audience" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        </div>

    </body>
</html>
`

// Importar el servicio de almacenamiento compartido
import { loadSharedImages, saveSharedImage, isImpulsalicante } from './sharedStorage';

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

        // Verificar si estamos trabajando con Impulsalicante para cargar imágenes compartidas
        const isImpulsalicanteCompany = await isImpulsalicante();
        let sharedImages = {};
        
        if (isImpulsalicanteCompany) {
            console.log("Trabajando con Impulsalicante - Cargando imágenes compartidas");
            sharedImages = await loadSharedImages();
        }

        // Reemplazar todas las imágenes placeholder vacías o con URLs inválidas
        // y hacer que todas las imágenes sean seleccionables
        const imagenes = tempDiv.querySelectorAll('img');
        imagenes.forEach((img, index) => {
            const imageId = `img-${index}`;
            
            // Añadir clases y atributos para hacer todas las imágenes seleccionables
            img.classList.add('selectable-image');
            img.setAttribute('data-image-id', imageId);
            img.style.cursor = 'pointer';

            // Si estamos en Impulsalicante y la imagen existe en el almacenamiento compartido, usarla
            if (isImpulsalicanteCompany && sharedImages[imageId]) {
                console.log(`Usando imagen compartida para ${imageId}`);
                img.src = sharedImages[imageId];
                
                // Si la imagen no es un placeholder, quitar los estilos decorativos
                if (!img.src.startsWith('data:image/png;base64')) {
                    img.style.background = "none";
                    img.style.backgroundColor = "transparent";
                    img.style.boxShadow = "none";
                    img.style.border = "none";
                    img.style.padding = "0";
                }
            }
            // Si la imagen no tiene src, está vacía o intenta cargar desde localhost
            // Pero NO reemplazar imágenes que ya tienen formato base64
            else if ((!img.src ||
                img.src === '' ||
                img.src === 'about:blank' ||
                img.src.startsWith('http://localhost/') ||
                img.src.startsWith('/')) &&
                !img.src.startsWith('data:image')) {

                console.log(`Corrigiendo imagen con src: ${img.src}`);
                img.src = placeholderImg;

                // Asegurarnos de que no se intente cargar desde una ruta relativa
                img.removeAttribute('srcset');
                img.removeAttribute('data-src');
            }
            // Si la imagen ya tiene un src real (no placeholder), quitar estilos decorativos
            else if (img.src && !img.src.startsWith('data:image')) {
                img.style.background = "none";
                img.style.backgroundColor = "transparent";
                img.style.boxShadow = "none";
                img.style.border = "none";
                img.style.padding = "0";
            }

            // Añadir un título para mejorar la UX
            img.title = "Haz clic para cambiar esta imagen";

            // Asegurarse de que la imagen sea visible
            img.style.opacity = "1";
            img.style.visibility = "visible";
            img.style.display = "inline-block";
            
            // Añadir un atributo de data para saber si la imagen está en el almacenamiento compartido
            if (isImpulsalicanteCompany && sharedImages[imageId]) {
                img.setAttribute('data-from-shared', 'true');
            }
            
            // Añadir listener para guardar en almacenamiento compartido cuando se cambia la imagen
            img.addEventListener('imageUpdated', async function(e) {
                if (isImpulsalicanteCompany) {
                    const newSrc = e.detail.newSrc;
                    await saveSharedImage(imageId, newSrc);
                    console.log(`Imagen ${imageId} guardada en almacenamiento compartido`);
                    
                    // Cuando se actualiza la imagen, quitar estilos de placeholder
                    if (newSrc && !newSrc.startsWith('data:image/png;base64')) {
                        // Quitar el fondo y estilos decorativos para imágenes reales
                        img.style.background = "none";
                        img.style.backgroundColor = "transparent";
                        img.style.boxShadow = "none";
                        img.style.border = "none";
                        img.style.padding = "0";
                    }
                    
                    // Mantener propiedades responsivas después del cambio de imagen
                    if (img.classList.contains('logo-small')) {
                        img.style.width = "auto";
                        img.style.height = "55px";
                    } else if (img.classList.contains('logo')) {
                        img.style.width = "auto";
                        img.style.height = "80px";
                    }
                }
            });
        });

        // Tratamiento especial para la sección de logos en la parte inferior de la portada
        const logosPortadaBottom = tempDiv.querySelector('.logos-portada-bottom');
        if (logosPortadaBottom) {
            const logosImg = logosPortadaBottom.querySelectorAll('img');
            logosImg.forEach((img, idx) => {
                // Asegurar que estas imágenes específicas se muestren correctamente
                img.style.display = "inline-block";
                img.style.margin = "5px 10px";
                img.style.maxWidth = "90px";
                img.style.width = "auto";
                img.style.height = "55px";
                img.style.opacity = "1";

                // Añadir z-index para asegurarse de que estén por encima de otros elementos
                img.style.position = "relative";
                img.style.zIndex = "5";

                console.log(`Ajustando imagen responsiva de logos-portada-bottom ${idx}: ${img.alt}`);
            });
        }

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