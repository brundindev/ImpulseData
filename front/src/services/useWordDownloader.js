export function useWordDownloader(empresaActual) {
    const descargarWord = () => {
        try {
          // Crear un elemento de texto HTML que servirá como fuente para el documento Word
          const contenido = document.createElement('div');
          contenido.className = 'word-export-content';
          
          // Estilos para la exportación (se incluirán en el documento)
          const estilos = `
            <style>
              @page { size: A4; margin: 2cm; }
              body { font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0; }
              h1 { color: #004698; font-size: 20pt; margin-bottom: 15px; }
              h2 { color: #004698; font-size: 16pt; margin-top: 25px; margin-bottom: 10px; }
              h3 { color: #004698; font-size: 14pt; margin-top: 20px; }
              p { margin: 5px 0; }
              table { border-collapse: collapse; width: 100%; margin: 15px 0; }
              th { background-color: #004698; color: white; padding: 8px; text-align: left; border: 1px solid #ddd; }
              td { padding: 8px; border: 1px solid #ddd; }
              .portada { text-align: center; padding: 40px 20px; margin-bottom: 40px; }
              .portada-borde { border: 2px solid #004698; padding: 20px; margin: 0 auto; height: 90%; }
              .logos { margin-bottom: 40px; }
              .logo { max-width: 200px; max-height: 70px; margin: 10px; }
              .portada h1 { font-size: 28pt; margin: 40px 0 10px 0; }
              .portada h2 { font-size: 18pt; margin: 10px 0 40px 0; }
              .info-empresa { margin-bottom: 30px; }
              .info-item { margin-bottom: 10px; }
              .info-label { font-weight: bold; display: inline-block; width: 150px; }
              .seccion { margin-top: 30px; page-break-before: always; padding: 20px; }
              .seccion-titulo { 
                background-color: #f0f5ff; 
                color: #004698; 
                text-align: center; 
                padding: 15px 0;
                margin-bottom: 20px;
                font-size: 24pt;
                border: 1px solid #004698;
                border-radius: 5px;
              }
              .seccion-borde { border: 1px solid #004698; padding: 15px; margin-bottom: 15px; border-radius: 5px; }
              .footer { text-align: center; font-size: 9pt; color: #666; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 10px; }
              .header { border-bottom: 2px solid #004698; padding-bottom: 10px; margin-bottom: 20px; }
              .resumen-box { background-color: #f9f9f9; border: 1px solid #ddd; padding: 15px; margin: 20px 0; }
            </style>
          `;
          
          // Portada principal
          const portada = `
            <div class="portada">
              <div class="portada-borde">
                <div class="logos">
                  <img src="${logoUrl}" alt="Logo ImpulseData" class="logo" />
                  <br/>
                  <img src="${impulsaAlicanteLogo}" alt="Impulsa Alicante" class="logo" />
                  <br/>
                  <img src="${ayuntamientoLogo}" alt="Ayuntamiento Alicante" class="logo" />
                </div>
                <h1>INFORME EMPRESARIAL</h1>
                <h2>${empresaActual.nombre}</h2>
                <p style="margin-top: 50px; font-size: 12pt;">Memoria de actividad</p>
                <p style="margin-top: 100px; font-size: 12pt;">Informe generado el ${new Date().toLocaleDateString('es-ES', {day: '2-digit', month: 'long', year: 'numeric'})}</p>
              </div>
            </div>
          `;
          
          // Sección de información general
          const infoEmpresa = `
            <div class="seccion">
              <div class="seccion-titulo">
                Información General
              </div>
              <div class="seccion-borde">
                <div class="info-empresa">
                  <div class="info-item"><span class="info-label">Nombre:</span> ${empresaActual.nombre}</div>
                  <div class="info-item"><span class="info-label">Fecha de creación:</span> ${formatDate(empresaActual.fechaCreacion)}</div>
                  <div class="info-item"><span class="info-label">Ciudad:</span> ${empresaActual.ciudad || 'No especificada'}</div>
                  <div class="info-item"><span class="info-label">Descripción:</span> ${empresaActual.descripcion || 'Sin descripción'}</div>
                </div>
              </div>
            </div>
          `;
          
          // Sección de departamentos
          let departamentosHTML = `
            <div class="seccion">
              <div class="seccion-titulo">
                Departamentos
              </div>
              <div class="seccion-borde">
          `;
          
          if (empresaActual.departamentos && empresaActual.departamentos.length > 0) {
            departamentosHTML += `<table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nombre del Departamento</th>
                </tr>
              </thead>
              <tbody>`;
            
            empresaActual.departamentos.forEach((dep, index) => {
              departamentosHTML += `
                <tr>
                  <td>${index + 1}</td>
                  <td>${dep.nombre}</td>
                </tr>
              `;
            });
            
            departamentosHTML += `</tbody></table>`;
                    } else {
            departamentosHTML += `<p>No hay departamentos registrados.</p>`;
          }
          
          departamentosHTML += `</div></div>`;
          
          // Sección de centros
          let centrosHTML = `
            <div class="seccion">
              <div class="seccion-titulo">
                Centros
              </div>
              <div class="seccion-borde">
          `;
          
          if (empresaActual.centros && empresaActual.centros.length > 0) {
            centrosHTML += `<table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nombre del Centro</th>
                  <th>Dirección</th>
                </tr>
              </thead>
              <tbody>`;
            
            empresaActual.centros.forEach((centro, index) => {
              centrosHTML += `
                <tr>
                  <td>${index + 1}</td>
                  <td>${centro.nombre}</td>
                  <td>${centro.direccion || 'No especificada'}</td>
                </tr>
              `;
            });
            
            centrosHTML += `</tbody></table>`;
          } else {
            centrosHTML += `<p>No hay centros registrados.</p>`;
          }
          
          centrosHTML += `</div></div>`;
          
          // Sección de formaciones
          let formacionesHTML = `
            <div class="seccion">
              <div class="seccion-titulo">
                Formaciones
              </div>
              <div class="seccion-borde">
          `;
          
          if (empresaActual.formaciones && empresaActual.formaciones.length > 0) {
            // Tabla principal de formaciones
            formacionesHTML += `
              <h2>Listado completo de formaciones</h2>
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nombre de la Formación</th>
                    <th>Tipo</th>
                    <th>Duración</th>
                  </tr>
                </thead>
                <tbody>
            `;
            
            empresaActual.formaciones.forEach((formacion, index) => {
              formacionesHTML += `
                <tr>
                  <td>${index + 1}</td>
                  <td>${formacion.nombre}</td>
                  <td>${formatTipoFormacion(formacion.tipo)}</td>
                  <td>${formacion.duracion} horas</td>
                </tr>
              `;
            });
            
            formacionesHTML += `</tbody></table>`;
            
            // Distribucion por tipo
            const tiposCounts = {
              presencial: 0,
              virtual: 0,
              hibrida: 0
            };
            
            empresaActual.formaciones.forEach(formacion => {
              if (tiposCounts[formacion.tipo] !== undefined) {
                tiposCounts[formacion.tipo]++;
              }
            });
            
            // Horas por tipo
            const horasPorTipo = {
              presencial: 0,
              virtual: 0,
              hibrida: 0
            };
            
            empresaActual.formaciones.forEach(formacion => {
              if (horasPorTipo[formacion.tipo] !== undefined) {
                horasPorTipo[formacion.tipo] += parseInt(formacion.duracion) || 0;
              }
            });
            
            // Total horas
            const totalHoras = Object.values(horasPorTipo).reduce((sum, curr) => sum + curr, 0);
            
            // Resumen por tipo de formación
            formacionesHTML += `
              <div class="resumen-box">
                <h2>Resumen por tipo de formación</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Tipo de Formación</th>
                      <th>Cantidad</th>
                      <th>Porcentaje</th>
                    </tr>
                  </thead>
                  <tbody>
            `;
            
            const total = Object.values(tiposCounts).reduce((sum, count) => sum + count, 0);
            
            Object.entries(tiposCounts).forEach(([tipo, count]) => {
              const porcentaje = total > 0 ? Math.round((count / total) * 100) : 0;
              formacionesHTML += `
                <tr>
                  <td>${formatTipoFormacion(tipo)}</td>
                  <td>${count}</td>
                  <td>${porcentaje}%</td>
                </tr>
              `;
            });
            
            formacionesHTML += `
              <tr style="font-weight: bold;">
                <td>Total</td>
                <td>${total}</td>
                <td>100%</td>
              </tr>
            `;
            
            formacionesHTML += `</tbody></table>`;
            
            // Lista de formaciones ordenadas por duración
            const formacionesOrdenadas = [...empresaActual.formaciones].sort((a, b) => 
              (parseInt(b.duracion) || 0) - (parseInt(a.duracion) || 0)
            );
            
            formacionesHTML += `
              <h2>Formaciones ordenadas por duración</h2>
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nombre</th>
                    <th>Tipo</th>
                    <th>Duración</th>
                  </tr>
                </thead>
                <tbody>
            `;
            
            formacionesOrdenadas.forEach((formacion, index) => {
              formacionesHTML += `
                <tr>
                  <td>${index + 1}</td>
                  <td>${formacion.nombre}</td>
                  <td>${formatTipoFormacion(formacion.tipo)}</td>
                  <td>${formacion.duracion} horas</td>
                </tr>
              `;
            });
            
            formacionesHTML += `</tbody></table>`;
            
            // Añadir gráficos representativos
            formacionesHTML += `
              <div style="margin-top: 30px; border: 1px solid #ddd; padding: 15px; background-color: #f9f9f9;">
                <h2>Representación gráfica</h2>
                
                <!-- Gráfico de barras para tipos de formación -->
                <div style="margin: 20px 0;">
                  <h3>Distribución por tipo de formación</h3>
                  <div style="display: flex; height: 200px; align-items: flex-end; margin-top: 20px; border-bottom: 2px solid #004698; border-left: 2px solid #004698; padding-left: 40px;">
            `;
            
            // Calculamos el porcentaje para cada tipo y creamos barras
            Object.entries(tiposCounts).forEach(([tipo, count], index) => {
              const porcentaje = total > 0 ? Math.round((count / total) * 100) : 0;
              const altura = Math.max(porcentaje * 1.8, 10); // Altura mínima de 10px
              
              // Determinamos color según el tipo
              let color;
              switch(tipo) {
                case 'presencial':
                  color = '#3366cc';
                  break;
                case 'virtual':
                  color = '#dc3912';
                  break;
                case 'hibrida':
                  color = '#ff9900';
                  break;
                default:
                  color = '#109618';
              }
              
              formacionesHTML += `
                <div style="display: flex; flex-direction: column; align-items: center; margin-right: 40px;">
                  <div style="height: ${altura}px; width: 60px; background-color: ${color}; margin-bottom: 5px;"></div>
                  <div style="font-weight: bold;">${formatTipoFormacion(tipo)}</div>
                  <div>${porcentaje}%</div>
                </div>
              `;
            });
            
            formacionesHTML += `
                  </div>
                </div>
                
                <!-- Gráfico circular para horas totales -->
                <div style="margin: 30px 0;">
                  <h3>Horas por tipo de formación</h3>
                  <div style="display: flex; justify-content: space-around; margin-top: 20px;">
                    <div style="width: 220px; height: 220px; border-radius: 50%; background: conic-gradient(
            `;
            
            // Calculamos los ángulos para el gráfico circular
            let startAngle = 0;
            const colors = ['#3366cc', '#dc3912', '#ff9900', '#109618'];
            let colorSegments = [];
            
            Object.entries(horasPorTipo).forEach(([tipo, horas], index) => {
              if (totalHoras > 0) {
                const porcentaje = (horas / totalHoras);
                const endAngle = startAngle + (porcentaje * 360);
                
                colorSegments.push(`${colors[index % colors.length]} ${startAngle}deg ${endAngle}deg`);
                startAngle = endAngle;
              }
            });
            
            formacionesHTML += colorSegments.join(', ');
            formacionesHTML += `
                    )"></div>
                    
                    <!-- Leyenda del gráfico -->
                    <div style="margin-left: 20px;">
            `;
            
            Object.entries(horasPorTipo).forEach(([tipo, horas], index) => {
              const porcentaje = totalHoras > 0 ? Math.round((horas / totalHoras) * 100) : 0;
              
              formacionesHTML += `
                <div style="display: flex; align-items: center; margin-bottom: 10px;">
                  <div style="width: 20px; height: 20px; background-color: ${colors[index % colors.length]}; margin-right: 10px;"></div>
                  <div>${formatTipoFormacion(tipo)}: ${horas} horas (${porcentaje}%)</div>
                </div>
              `;
            });
            
            formacionesHTML += `
                    </div>
                  </div>
                </div>
              </div>
            `;
            
          } else {
            formacionesHTML += `<p>No hay formaciones registradas.</p>`;
          }
          
          formacionesHTML += `</div></div>`;
          
          // Pie de página
          const footer = `
            <div class="footer">
              <p>ImpulseData - Alicante Futura</p>
              <p>Documento generado el ${new Date().toLocaleDateString('es-ES')} a las ${new Date().toLocaleTimeString('es-ES')}</p>
            </div>
          `;
          
          // Combinar todo el contenido
          contenido.innerHTML = estilos + portada + infoEmpresa + departamentosHTML + centrosHTML + formacionesHTML + footer;
          
          // Convertir a Blob
          const blob = new Blob([contenido.outerHTML], { type: 'application/msword' });
          
          // Crear elemento de descarga
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = `informe_${empresaActual.nombre.replace(/\s+/g, '_')}.doc`;
          
          // Añadir a la página, hacer clic y eliminar
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
        } catch (error) {
          console.error("Error al generar el documento Word:", error);
          alert("Error al generar el documento Word. Por favor, inténtelo de nuevo.");
        }
    };
  
    return { descargarWord };
  }
