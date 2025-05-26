<template>
  <div class="form-step">
    <h3>Alicante Futura</h3>
    
    <div class="form-group">
      <label>Descripción General</label>
      <textarea
        v-model="datos.descripcionGeneral"
        class="form-control"
        rows="4"
        placeholder="Descripción general de la estrategia Alicante Futura destinada a vertebrar las líneas maestras del futuro de la ciudad de Alicante..."
      ></textarea>
    </div>

    <!-- Sección de Clusters/Hubs -->
    <div class="cluster-section">
      <h4>Clusters o Hubs</h4>
      <div class="cluster-grid">
        <div 
          v-for="(cluster, index) in datos.clusters" 
          :key="index" 
          class="cluster-item"
        >
          <div class="cluster-header">
            <span class="cluster-number">{{ index + 1 }}</span>
            <button 
              v-if="datos.clusters.length > 1" 
              @click="eliminarCluster(index)" 
              class="btn btn-sm btn-danger"
              type="button"
            >
              ×
            </button>
          </div>
          <div class="form-group">
            <input 
              v-model="cluster.nombre" 
              class="form-control"
              placeholder="Nombre del Cluster o Hub (ej: Cluster Blue Economy, HUB Agroalimentario...)"
            >
          </div>
        </div>
      </div>
      <button @click="agregarCluster" class="btn btn-secondary" type="button">
        + Agregar Cluster o Hub
      </button>
    </div>

    <!-- Vista previa de Clusters -->
    <div class="preview-section" v-if="datos.clusters.length > 0">
      <h4>Vista previa de los Clusters o Hubs</h4>
      <div class="report-section">
        <div class="report-header">
          <div class="report-number">4.3</div>
          <div class="report-title">ALICANTE FUTURA</div>
        </div>
        
        <div class="report-content">
          <div class="clusters-display">
            <div class="clusters-grid">
              <div 
                v-for="(cluster, index) in datos.clusters" 
                :key="'preview-'+index" 
                class="cluster-preview-item"
              >
                <div class="cluster-preview-number">{{ index + 1 }}</div>
                <div class="cluster-preview-name">{{ cluster.nombre || 'Cluster/Hub ' + (index + 1) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Líneas de Trabajo -->
    <div class="lineas-trabajo-section">
      <h4>4 Líneas de Trabajo</h4>
      
      <!-- Línea 1: Lab de excelencia tecnológica -->
      <div class="linea-item">
        <div class="linea-header">
          <div class="linea-number">1</div>
          <div class="linea-title">
            <input 
              v-model="datos.linea1.nombre" 
              class="form-control linea-title-input"
              placeholder="Lab de excelencia tecnológica, digital e innovador internacional"
            >
          </div>
        </div>

        <div class="metricas-section">
          <div class="metricas-grid">
            <div class="metrica-item">
              <label>Talleres AFKids</label>
              <input
                v-model.number="datos.linea1.talleresAFKids"
                type="number"
                class="form-control metric-input"
                placeholder="18"
                min="0"
              >
            </div>
            
            <div class="metrica-item">
              <label>Talleres Lab Senior</label>
              <input
                v-model.number="datos.linea1.talleresLabSenior"
                type="number"
                class="form-control metric-input"
                placeholder="8"
                min="0"
              >
            </div>
            
            <div class="metrica-item">
              <label>Talleres "Emprende en las aulas"</label>
              <input
                v-model.number="datos.linea1.talleresEmprende"
                type="number"
                class="form-control metric-input"
                placeholder="3"
                min="0"
              >
            </div>
            
            <div class="metrica-item">
              <label>Ediciones Lab Alicante Futura</label>
              <input
                v-model.number="datos.linea1.edicionesLab"
                type="number"
                class="form-control metric-input"
                placeholder="2"
                min="0"
              >
            </div>
          </div>

          <!-- Evento específico para línea 1 -->
          <div class="evento-section">
            <h5>7ª edición Un Mar de Cine</h5>
            <div class="form-group">
              <label>Fechas del evento</label>
              <input 
                v-model="datos.linea1.eventoFechas" 
                class="form-control"
                placeholder="25-29 de septiembre"
              >
            </div>
            <div class="evento-metricas">
              <div class="metrica-item">
                <label>Personas (Auditorio de Puerta Ferrisa)</label>
                <input
                  v-model.number="datos.linea1.eventoPersonas"
                  type="number"
                  class="form-control metric-input"
                  placeholder="150"
                  min="0"
                >
              </div>
              <div class="metrica-item">
                <label>Talleres</label>
                <input
                  v-model.number="datos.linea1.eventoTalleres"
                  type="number"
                  class="form-control metric-input"
                  placeholder="18"
                  min="0"
                >
              </div>
            </div>
            <div class="form-group">
              <label>Anexo 41 - Memoria</label>
              <input 
                v-model="datos.linea1.eventoAnexo" 
                class="form-control"
                placeholder='Memoria "Un Mar de Cine 2023"'
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Línea 2: II Congreso Internacional -->
      <div class="linea-item">
        <div class="linea-header">
          <div class="linea-number">2</div>
          <div class="linea-title">
            <input 
              v-model="datos.linea2.nombre" 
              class="form-control linea-title-input"
              placeholder="II Congreso Internacional Alicante Futura"
            >
          </div>
        </div>

        <div class="metricas-section">
          <div class="form-group">
            <label>Descripción del evento</label>
            <input 
              v-model="datos.linea2.descripcion" 
              class="form-control"
              placeholder="'Embajadores de lo que viene' se celebró el día 23 de noviembre."
            >
          </div>
          
          <div class="congreso-metricas">
            <div class="metrica-item">
              <label>Participantes</label>
              <input
                v-model.number="datos.linea2.participantes"
                type="number"
                class="form-control metric-input"
                placeholder="390"
                min="0"
              >
            </div>
            <div class="metrica-item">
              <label>Startups alicantinas participantes</label>
              <input
                v-model.number="datos.linea2.startups"
                type="number"
                class="form-control metric-input"
                placeholder="7"
                min="0"
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Línea 3: Impulso a la creación de Hubs -->
      <div class="linea-item">
        <div class="linea-header">
          <div class="linea-number">3</div>
          <div class="linea-title">
            <input 
              v-model="datos.linea3.nombre" 
              class="form-control linea-title-input"
              placeholder="Impulso a la creación de Hubs en sectores estratégicos claves para el futuro desarrollo de la ciudad"
            >
          </div>
        </div>

        <div class="metricas-section">
          <h5>Acciones de promoción y dinamización:</h5>
          <div class="hubs-grid">
            <div class="hub-item">
              <label>Hub Agrotech:</label>
              <input
                v-model.number="datos.linea3.hubAgrotech"
                type="number"
                class="form-control metric-input"
                placeholder="9"
                min="0"
              >
            </div>
            <div class="hub-item">
              <label>Hub Govtech:</label>
              <input
                v-model.number="datos.linea3.hubGovtech"
                type="number"
                class="form-control metric-input"
                placeholder="4"
                min="0"
              >
            </div>
            <div class="hub-item">
              <label>Fomento de comunidades de interés en Alicante:</label>
              <input
                v-model.number="datos.linea3.comunidades"
                type="number"
                class="form-control metric-input"
                placeholder="7"
                min="0"
              >
            </div>
            <div class="hub-item">
              <label>Hub Blue Economy:</label>
              <input
                v-model.number="datos.linea3.hubBlueEconomy"
                type="number"
                class="form-control metric-input"
                placeholder="9"
                min="0"
              >
            </div>
            <div class="hub-item">
              <label>Cluster Industrias Tradicionales:</label>
              <input
                v-model.number="datos.linea3.clusterIndustrias"
                type="number"
                class="form-control metric-input"
                placeholder="14"
                min="0"
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Línea 4: Alicante, capital mediterránea -->
      <div class="linea-item">
        <div class="linea-header">
          <div class="linea-number">4</div>
          <div class="linea-title">
            <input 
              v-model="datos.linea4.nombre" 
              class="form-control linea-title-input"
              placeholder="Alicante, capital mediterránea de la Industria Tecnológica, el Emprendimiento Digital y la Nueva Economía Urbana"
            >
          </div>
        </div>

        <div class="metricas-section">
          <div class="metrica-item">
            <label>Visitas, reuniones y participación en eventos</label>
            <input
              v-model.number="datos.linea4.visitasReuniones"
              type="number"
              class="form-control metric-input"
              placeholder="57"
              min="0"
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Puntos Terciarios 4.3.1 y 4.3.2 -->
    <div class="puntos-terciarios-section">
      <!-- 4.3.1 II Alicante Smartphone Film Festival -->
      <div class="punto-terciario">
        <div class="punto-header">
          <div class="punto-number">4.3.1</div>
          <div class="punto-title">
            <input 
              v-model="datos.punto431.nombre" 
              class="form-control"
              placeholder="II Alicante Smartphone Film Festival"
            >
          </div>
        </div>

        <div class="punto-content">
          <div class="smartphone-metricas">
            <div class="metrica-item">
              <label>Cortometrajes</label>
              <input
                v-model.number="datos.punto431.cortometrajes"
                type="number"
                class="form-control metric-input"
                placeholder="150"
                min="0"
              >
            </div>
            <div class="metrica-item">
              <label>Categorías</label>
              <input
                v-model.number="datos.punto431.categorias"
                type="number"
                class="form-control metric-input"
                placeholder="7"
                min="0"
              >
            </div>
            <div class="metrica-item">
              <label>Finalistas</label>
              <input
                v-model.number="datos.punto431.finalistas"
                type="number"
                class="form-control metric-input"
                placeholder="35"
                min="0"
              >
            </div>
            <div class="metrica-item">
              <label>Premios (€)</label>
              <input
                v-model.number="datos.punto431.premios"
                type="number"
                class="form-control metric-input"
                placeholder="3000"
                min="0"
              >
            </div>
          </div>

          <div class="form-group">
            <label>Fechas del festival</label>
            <input 
              v-model="datos.punto431.fechas" 
              class="form-control"
              placeholder="Del 21 al 25 de noviembre"
            >
          </div>

          <div class="form-group">
            <label>Descripción</label>
            <textarea 
              v-model="datos.punto431.descripcion" 
              class="form-control"
              rows="3"
              placeholder="Se celebró la segunda edición del Alicante Smartphone Festival, el único festival de cortometrajes realizados con móvil de la Comunidad Valenciana..."
            ></textarea>
          </div>

          <div class="form-group">
            <label>Categorías específicas</label>
            <textarea 
              v-model="datos.punto431.categoriasDetalle" 
              class="form-control"
              rows="2"
              placeholder="Ficción, Animación, Cortos de la provincia de Alicante, Hospital de Cine, Comedia, Internacional, Lucha contra el cambio climático"
            ></textarea>
          </div>

          <div class="form-group">
            <label>Anexo 43</label>
            <input 
              v-model="datos.punto431.anexo" 
              class="form-control"
              placeholder="Memoria II Alicante Smartphone Film Festival"
            >
          </div>
        </div>
      </div>

      <!-- 4.3.2 III Copa Robotikid Alicante Futura -->
      <div class="punto-terciario">
        <div class="punto-header">
          <div class="punto-number">4.3.2</div>
          <div class="punto-title">
            <input 
              v-model="datos.punto432.nombre" 
              class="form-control"
              placeholder="III Copa Robotikid Alicante Futura"
            >
          </div>
        </div>

        <div class="punto-content">
          <div class="form-group">
            <label>Fecha del evento</label>
            <input 
              v-model="datos.punto432.fecha" 
              class="form-control"
              placeholder="El 10 de junio"
            >
          </div>

          <div class="form-group">
            <label>Lugar</label>
            <input 
              v-model="datos.punto432.lugar" 
              class="form-control"
              placeholder="Centro de Tecnificación de Alicante III Copa Robotikid Alicante Futura"
            >
          </div>

          <div class="form-group">
            <label>Descripción</label>
            <textarea 
              v-model="datos.punto432.descripcion" 
              class="form-control"
              rows="3"
              placeholder="Se trata de una competición destinada a la infancia de toda la provincia de Alicante que han participado durante el curso en los centros participantes..."
            ></textarea>
          </div>

          <div class="robotikid-metricas">
            <div class="metrica-item">
              <label>Asistentes</label>
              <input
                v-model.number="datos.punto432.asistentes"
                type="number"
                class="form-control metric-input"
                placeholder="1500"
                min="0"
              >
            </div>
            <div class="metrica-item">
              <label>Niños/as participantes</label>
              <input
                v-model.number="datos.punto432.participantes"
                type="number"
                class="form-control metric-input"
                placeholder="300"
                min="0"
              >
            </div>
            <div class="metrica-item">
              <label>Centros educativos</label>
              <input
                v-model.number="datos.punto432.centros"
                type="number"
                class="form-control metric-input"
                placeholder="52"
                min="0"
              >
            </div>
          </div>

          <div class="form-group">
            <label>Categorías de competición</label>
            <input 
              v-model="datos.punto432.categorias" 
              class="form-control"
              placeholder="Nano Bots (de 3 a 5 años), Byte Bots (de 6 a 8 años) y Mega Bots (de 9 a 14 años)"
            >
          </div>
        </div>
      </div>
    </div>

<!-- Vista Previa Final Completa -->
<div class="preview-final-section">
      <h4>Vista Previa del Informe Final</h4>
      
      <!-- Sección Principal 4.3 -->
      <div class="report-section-main">
        <div class="report-header-main">
          <div class="report-number-main">4.3</div>
          <div class="report-title-main">
            <div class="title-alicante">ALICANTE</div>
            <div class="title-futura">FUTURA</div>
          </div>
        </div>
        
        <div class="main-content">
          <div class="main-description" v-if="datos.descripcionGeneral">
            {{ datos.descripcionGeneral }}
          </div>
          
          <!-- Grid de Clusters/Hubs -->
          <div class="clusters-main-grid" v-if="datos.clusters && datos.clusters.length > 0">
            <div class="alicante-futura-logo">
              <div class="logo-af">af</div>
              <div class="logo-text">ALICANTE<br>FUTURA</div>
            </div>
            <div 
              v-for="(cluster, index) in datos.clusters.slice(0, 6)" 
              :key="'main-'+index" 
              class="cluster-main-item"
            >
              <div class="cluster-main-number">{{ index + 1 }}</div>
              <div class="cluster-main-content">
                <div class="cluster-main-type">
                  {{ cluster.nombre.includes('Cluster') ? 'Cluster' : cluster.nombre.includes('HUB') || cluster.nombre.includes('Hub') ? 'HUB' : 'Cluster' }}
                </div>
                <div class="cluster-main-name">
                  {{ cluster.nombre.replace(/^(Cluster|HUB|Hub)\s*/i, '') || 'Área ' + (index + 1) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sección de 4 Líneas de Trabajo -->
      <div class="lineas-preview-section">
        <div class="lineas-header">
          <h4>4 líneas de trabajo</h4>
        </div>

        <!-- Línea 1 -->
        <div class="linea-preview-item">
          <div class="linea-preview-header">
            <div class="linea-preview-number">1</div>
            <div class="linea-preview-title">
              {{ datos.linea1?.nombre || 'Lab de excelencia tecnológica, digital e innovador internacional' }}
            </div>
          </div>
          
          <div class="linea-preview-metrics">
            <div class="metric-box" v-if="datos.linea1?.talleresAFKids">
              <div class="metric-number">{{ datos.linea1.talleresAFKids }}</div>
              <div class="metric-label">Talleres AF Kids</div>
            </div>
            <div class="metric-box" v-if="datos.linea1?.talleresEmprende">
              <div class="metric-number">{{ datos.linea1.talleresEmprende }}</div>
              <div class="metric-label">Talleres "Emprende en las aulas" en centros de secundaria</div>
            </div>
            <div class="metric-box" v-if="datos.linea1?.talleresLabSenior">
              <div class="metric-number">{{ datos.linea1.talleresLabSenior }}</div>
              <div class="metric-label">Talleres Lab Senior</div>
            </div>
            <div class="metric-box" v-if="datos.linea1?.edicionesLab">
              <div class="metric-number">{{ datos.linea1.edicionesLab }}</div>
              <div class="metric-label">ediciones Lab Alicante Futura Emprende</div>
            </div>
          </div>

          <!-- Evento Un Mar de Cine -->
          <div class="evento-preview" v-if="datos.linea1?.eventoFechas || datos.linea1?.eventoPersonas">
            <div class="evento-title">7ª edición Un Mar de Cine ({{ datos.linea1.eventoFechas || '25-29 de septiembre' }})</div>
            <div class="evento-metrics">
              <div class="evento-metric">
                <span class="evento-location">Auditorio de Puerto Ferrisa</span>
                <span class="evento-number">{{ datos.linea1.eventoPersonas || 150 }}</span>
                <span class="evento-label">personas</span>
              </div>
              <div class="evento-metric">
                <span class="evento-number">{{ datos.linea1.eventoTalleres || 18 }}</span>
                <span class="evento-label">talleres</span>
              </div>
            </div>
            <div class="anexo-reference" v-if="datos.linea1?.eventoAnexo">
              <strong>Anexo 41.</strong> {{ datos.linea1.eventoAnexo }}
            </div>
          </div>
        </div>

        <!-- Línea 2 -->
        <div class="linea-preview-item">
          <div class="linea-preview-header">
            <div class="linea-preview-number">2</div>
            <div class="linea-preview-title">
              {{ datos.linea2?.nombre || 'II Congreso Internacional Alicante Futura' }}
            </div>
          </div>
          
          <div class="congreso-content">
            <div class="congreso-description" v-if="datos.linea2?.descripcion">
              {{ datos.linea2.descripcion }}
            </div>
            <div class="congreso-metrics">
              <div class="congreso-metric" v-if="datos.linea2?.participantes">
                <div class="congreso-number">{{ datos.linea2.participantes }}</div>
                <div class="congreso-label">participantes</div>
              </div>
              <div class="congreso-metric" v-if="datos.linea2?.startups">
                <div class="congreso-number">{{ datos.linea2.startups }}</div>
                <div class="congreso-label">startup alicantinas participantes</div>
              </div>
            </div>
            <div class="anexo-reference">
              <strong>Anexo 42.</strong> Memoria II Congreso Internacional Alicante Futura.
            </div>
          </div>
        </div>

        <!-- Línea 3 -->
        <div class="linea-preview-item">
          <div class="linea-preview-header">
            <div class="linea-preview-number">3</div>
            <div class="linea-preview-title">
              {{ datos.linea3?.nombre || 'Impulso a la creación de Hubs en sectores estratégicos claves para el futuro desarrollo de la ciudad' }}
            </div>
          </div>
          
          <div class="hubs-preview-content">
            <div class="hubs-subtitle">Acciones de promoción y dinamización:</div>
            <div class="hubs-metrics-grid">
              <div class="hub-metric" v-if="datos.linea3?.hubAgrotech">
                <span class="hub-label">Hub Agrotech:</span>
                <span class="hub-number">{{ datos.linea3.hubAgrotech }}</span>
              </div>
              <div class="hub-metric" v-if="datos.linea3?.hubBlueEconomy">
                <span class="hub-label">Hub Blue Economy:</span>
                <span class="hub-number">{{ datos.linea3.hubBlueEconomy }}</span>
              </div>
              <div class="hub-metric" v-if="datos.linea3?.hubGovtech">
                <span class="hub-label">Hub Govtech:</span>
                <span class="hub-number">{{ datos.linea3.hubGovtech }}</span>
              </div>
              <div class="hub-metric" v-if="datos.linea3?.clusterIndustrias">
                <span class="hub-label">Cluster Industrias Tradicionales:</span>
                <span class="hub-number">{{ datos.linea3.clusterIndustrias }}</span>
              </div>
              <div class="hub-metric" v-if="datos.linea3?.comunidades">
                <span class="hub-label">Fomento de comunidades de interés en Alicante:</span>
                <span class="hub-number">{{ datos.linea3.comunidades }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Línea 4 -->
        <div class="linea-preview-item">
          <div class="linea-preview-header">
            <div class="linea-preview-number">4</div>
            <div class="linea-preview-title">
              {{ datos.linea4?.nombre || 'Alicante, capital mediterránea de la Industria Tecnológica, el Emprendimiento Digital y la Nueva Economía Urbana' }}
            </div>
          </div>
          
          <div class="capital-metric" v-if="datos.linea4?.visitasReuniones">
            <div class="capital-number">{{ datos.linea4.visitasReuniones }}</div>
            <div class="capital-label">visitas, reuniones y participación en eventos</div>
          </div>
        </div>
      </div>

      <!-- Secciones 4.3.1 y 4.3.2 -->
      <div class="subsecciones-preview">
        <!-- 4.3.1 Smartphone Film Festival -->
        <div class="subseccion-preview">
          <div class="subseccion-header">
            <div class="subseccion-number">4.3.1</div>
            <div class="subseccion-title">
              {{ datos.punto431?.nombre || 'II Alicante Smartphone Film Festival' }}
            </div>
          </div>
          
          <div class="smartphone-metrics">
            <div class="smartphone-stat" v-if="datos.punto431?.cortometrajes">
              <div class="stat-number">{{ datos.punto431.cortometrajes }}</div>
              <div class="stat-label">cortometrajes</div>
            </div>
            <div class="smartphone-stat" v-if="datos.punto431?.categorias">
              <div class="stat-number">{{ datos.punto431.categorias }}</div>
              <div class="stat-label">categorías</div>
            </div>
            <div class="smartphone-stat" v-if="datos.punto431?.finalistas">
              <div class="stat-number">{{ datos.punto431.finalistas }}</div>
              <div class="stat-label">finalistas</div>
            </div>
            <div class="smartphone-stat" v-if="datos.punto431?.premios">
              <div class="stat-number">{{ datos.punto431.premios }} €</div>
              <div class="stat-label">premios</div>
            </div>
          </div>
          
          <div class="smartphone-details" v-if="datos.punto431?.fechas || datos.punto431?.descripcion">
            <div class="festival-dates" v-if="datos.punto431.fechas">
              Del {{ datos.punto431.fechas }} se celebró la segunda edición del Alicante Smartphone Festival.
            </div>
            <div class="festival-description" v-if="datos.punto431.descripcion">
              {{ datos.punto431.descripcion }}
            </div>
            <div class="festival-categories" v-if="datos.punto431.categoriasDetalle">
              <strong>Categorías:</strong> {{ datos.punto431.categoriasDetalle }}
            </div>
          </div>
          
          <div class="anexo-reference" v-if="datos.punto431?.anexo">
            <strong>Anexo 43.</strong> {{ datos.punto431.anexo }}
          </div>
        </div>

        <!-- 4.3.2 Copa Robotikid -->
        <div class="subseccion-preview">
          <div class="subseccion-header">
            <div class="subseccion-number">4.3.2</div>
            <div class="subseccion-title">
              {{ datos.punto432?.nombre || 'III Copa Robotikid Alicante Futura' }}
            </div>
          </div>
          
          <div class="robotikid-details">
            <div class="robotikid-info" v-if="datos.punto432?.fecha">
              El {{ datos.punto432.fecha }} se celebró en el {{ datos.punto432.lugar || 'Centro de Tecnificación de Alicante' }} la III Copa Robotikid Alicante Futura.
            </div>
            <div class="robotikid-description" v-if="datos.punto432?.descripcion">
              {{ datos.punto432.descripcion }}
            </div>
          </div>
          
          <div class="robotikid-metrics">
            <div class="robotikid-stat" v-if="datos.punto432?.asistentes">
              <div class="stat-number">{{ datos.punto432.asistentes }}</div>
              <div class="stat-label">asistentes</div>
            </div>
            <div class="robotikid-stat" v-if="datos.punto432?.participantes">
              <div class="stat-number">{{ datos.punto432.participantes }}</div>
              <div class="stat-label">niños/as participantes</div>
            </div>
            <div class="robotikid-stat" v-if="datos.punto432?.centros">
              <div class="stat-number">{{ datos.punto432.centros }}</div>
              <div class="stat-label">centros educativos</div>
            </div>
          </div>
          
          <div class="robotikid-categories" v-if="datos.punto432?.categorias">
            <strong>Categorías:</strong> {{ datos.punto432.categorias }}
          </div>
        </div>
      </div>
    </div>

    <!-- Navegación -->
    <div class="form-actions">
      <button 
        @click="$emit('anterior')" 
        class="btn btn-secondary"
        type="button"
      >
        Anterior
      </button>
      <button 
        @click="$emit('siguiente')" 
        class="btn btn-primary"
        :disabled="!esValido"
      >
        Siguiente
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update:modelValue', 'siguiente', 'anterior']);

const datos = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// Inicializar estructura completa de datos
if (!datos.value.descripcionGeneral) {
  datos.value.descripcionGeneral = '';
}

if (!datos.value.clusters) {
  datos.value.clusters = [{ nombre: '' }];
}

// Línea 1: Lab de excelencia tecnológica
if (!datos.value.linea1) {
  datos.value.linea1 = {
    nombre: '',
    talleresAFKids: null,
    talleresLabSenior: null,
    talleresEmprende: null,
    edicionesLab: null,
    eventoFechas: '',
    eventoPersonas: null,
    eventoTalleres: null,
    eventoAnexo: ''
  };
}

// Línea 2: II Congreso Internacional
if (!datos.value.linea2) {
  datos.value.linea2 = {
    nombre: '',
    descripcion: '',
    participantes: null,
    startups: null
  };
}

// Línea 3: Impulso a la creación de Hubs
if (!datos.value.linea3) {
  datos.value.linea3 = {
    nombre: '',
    hubAgrotech: null,
    hubGovtech: null,
    comunidades: null,
    hubBlueEconomy: null,
    clusterIndustrias: null
  };
}

// Línea 4: Alicante, capital mediterránea
if (!datos.value.linea4) {
  datos.value.linea4 = {
    nombre: '',
    visitasReuniones: null
  };
}

// Punto 4.3.1: II Alicante Smartphone Film Festival
if (!datos.value.punto431) {
  datos.value.punto431 = {
    nombre: '',
    cortometrajes: null,
    categorias: null,
    finalistas: null,
    premios: null,
    fechas: '',
    descripcion: '',
    categoriasDetalle: '',
    anexo: ''
  };
}

// Punto 4.3.2: III Copa Robotikid
if (!datos.value.punto432) {
  datos.value.punto432 = {
    nombre: '',
    fecha: '',
    lugar: '',
    descripcion: '',
    asistentes: null,
    participantes: null,
    centros: null,
    categorias: ''
  };
}

// Funciones para Clusters
const agregarCluster = () => {
  datos.value.clusters.push({ nombre: '' });
};

const eliminarCluster = (index) => {
  if (datos.value.clusters.length > 1) {
    datos.value.clusters.splice(index, 1);
  }
};

// Validación básica
const esValido = computed(() => {
  return datos.value.descripcionGeneral && 
         datos.value.clusters.some(cluster => cluster.nombre);
});
</script>

<style scoped>
.form-step {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

/* Estilos para Clusters */
.cluster-section {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.cluster-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.cluster-item {
  background: white;
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid #ddd;
}

.cluster-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.cluster-number {
  background: #B91372;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

/* Vista previa */
.preview-section {
  margin: 2rem 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.report-header {
  background: #f8f9fa;
  padding: 1rem;
  border-bottom: 1px solid #ddd;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.report-number {
  background: #B91372;
  color: white;
  padding: 0.5rem 1rem;
  font-weight: bold;
  font-size: 1.2rem;
}

.report-title {
  font-weight: bold;
  font-size: 1.2rem;
  color: #B91372;
}

.report-content {
  padding: 1.5rem;
}

.clusters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.cluster-preview-item {
  background: #f8d7da;
  padding: 1rem;
  border-radius: 6px;
  text-align: center;
}

.cluster-preview-number {
  background: #B91372;
  color: white;
  font-size: 2rem;
  font-weight: bold;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 0.5rem;
}

.cluster-preview-name {
  font-weight: bold;
  color: #B91372;
  font-size: 0.9rem;
}

/* Líneas de trabajo */
.lineas-trabajo-section {
  margin: 2rem 0;
}

.linea-item {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  border-left: 4px solid #B91372;
}

.linea-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.linea-number {
  background: #B91372;
  color: white;
  font-weight: bold;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.linea-title {
  flex: 1;
}

.linea-title-input {
  font-weight: bold;
  font-size: 1.1rem;
}

/* Métricas */
.metricas-section {
  background: white;
  padding: 1.5rem;
  border-radius: 6px;
}

.metricas-grid, .congreso-metricas, .hubs-grid, .smartphone-metricas, .robotikid-metricas {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.metrica-item, .hub-item {
  text-align: center;
}

.metric-input {
  text-align: center;
  font-weight: bold;
  font-size: 1.2rem;
  color: #B91372;
}

/* Evento específico */
.evento-section {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #ddd;
}

.evento-metricas {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
}

/* Puntos terciarios */
.puntos-terciarios-section {
  margin: 3rem 0;
}

.punto-terciario {
  background: #e8f4f8;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  border-left: 4px solid #17a2b8;
}

.punto-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.punto-number {
  background: #17a2b8;
  color: white;
  font-weight: bold;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 1.1rem;
}

.punto-title {
  flex: 1;
}

.punto-content {
  background: white;
  padding: 1.5rem;
  border-radius: 6px;
}

/* Estilos generales */
label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-control:focus {
  outline: none;
  border-color: #B91372;
  box-shadow: 0 0 0 2px rgba(185, 19, 114, 0.1);
}

textarea.form-control {
  resize: vertical;
  min-height: 100px;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.btn-primary {
  background: #B91372;
  color: white;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
}

.btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

.form-actions {
  margin-top: 3rem;
  display: flex;
  justify-content: space-between;
  padding-top: 2rem;
  border-top: 1px solid #ddd;
}

h3 {
  color: #B91372;
  font-size: 1.8rem;
  margin-bottom: 2rem;
  text-align: center;
}

h4 {
  color: #B91372;
  font-size: 1.3rem;
  margin-bottom: 1rem;
}

h5 {
  color: #333;
  font-size: 1.1rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

/* Responsividad */
@media (max-width: 768px) {
  .cluster-grid,
  .clusters-grid,
  .metricas-grid,
  .congreso-metricas,
  .hubs-grid,
  .smartphone-metricas,
  .robotikid-metricas,
  .evento-metricas {
    grid-template-columns: 1fr;
  }
  
  .linea-header,
  .punto-header {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }
  
  .form-actions {
    flex-direction: column;
    gap: 1rem;
  }
}

/* Estilos específicos para diferentes tipos de métricas */
.hubs-grid .hub-item {
  background: #f1f8ff;
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid #bee5eb;
}

.smartphone-metricas .metrica-item {
  background: #fff3cd;
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid #ffeaa7;
}

.robotikid-metricas .metrica-item {
  background: #d1ecf1;
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid #bee5eb;
}

/* Indicadores visuales para campos requeridos */
.form-control:invalid {
  border-color: #dc3545;
}

.form-control:valid {
  border-color: #28a745;
}

/* Mejoras de accesibilidad */
.btn:focus,
.form-control:focus {
  outline: 2px solid #B91372;
  outline-offset: 2px;
}

/* Animaciones suaves */
.linea-item,
.punto-terciario,
.cluster-item {
  transition: all 0.3s ease;
}

.linea-item:hover,
.punto-terciario:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

/* Estilos para inputs numéricos */
input[type="number"] {
  -moz-appearance: textfield;
  appearance: textfield;
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Separadores visuales */
.lineas-trabajo-section::before {
  content: '';
  display: block;
  width: 100%;
  height: 2px;
  background: linear-gradient(to right, #B91372, transparent);
  margin-bottom: 2rem;
}

.puntos-terciarios-section::before {
  content: '';
  display: block;
  width: 100%;
  height: 2px;
  background: linear-gradient(to right, #17a2b8, transparent);
  margin-bottom: 2rem;
}

/* Agrega este estilo para mejorar la visibilidad del placeholder */
input::placeholder {
  color: #B91372; /* Cambia este color según tus necesidades */
  opacity: 1; /* Asegúrate de que el placeholder sea completamente opaco */
}

.preview-final-section {
  margin: 3rem 0;
  background: white;
  border: 2px solid #B91372;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(185, 19, 114, 0.1);
}

.preview-final-section h4 {
  text-align: center;
  background: #B91372;
  color: white;
  margin: 0;
  padding: 1rem;
  font-size: 1.4rem;
}

/* Sección Principal 4.3 */
.report-section-main {
  background: white;
}

.report-header-main {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 2rem;
  border-bottom: 3px solid #B91372;
}

.report-number-main {
  background: #B91372;
  color: white;
  padding: 1rem 2rem;
  font-weight: bold;
  font-size: 2rem;
  border-radius: 8px;
  min-width: 80px;
  text-align: center;
}

.report-title-main {
  flex: 1;
}

.title-alicante {
  font-size: 2.5rem;
  font-weight: bold;
  color: #333;
  line-height: 1.1;
}

.title-futura {
  font-size: 2.5rem;
  font-weight: bold;
  color: #B91372;
  line-height: 1.1;
}

.main-content {
  padding: 2rem;
}

.main-description {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #333;
  margin-bottom: 2rem;
  text-align: justify;
}

/* Grid de Clusters Principal */
.clusters-main-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-top: 2rem;
}

.alicante-futura-logo {
  grid-column: 1;
  grid-row: 1 / 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #B91372, #8B0A4A);
  color: white;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
}

.logo-af {
  background: white;
  color: #B91372;
  font-size: 2.5rem;
  font-weight: bold;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.logo-text {
  font-weight: bold;
  font-size: 1.2rem;
  line-height: 1.2;
}

.cluster-main-item {
  background: linear-gradient(135deg, #f8d7da, #f5c6cb);
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  border: 2px solid rgba(185, 19, 114, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.cluster-main-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(185, 19, 114, 0.2);
}

.cluster-main-number {
  background: #B91372;
  color: white;
  font-size: 2rem;
  font-weight: bold;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}

.cluster-main-content {
  text-align: center;
}

.cluster-main-type {
  color: #B91372;
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.cluster-main-name {
  color: #333;
  font-weight: 600;
  font-size: 0.95rem;
  line-height: 1.3;
}

/* Líneas de Trabajo Preview */
.lineas-preview-section {
  background: #f8f9fa;
  padding: 2rem;
  border-top: 3px solid #B91372;
}

.lineas-header h4 {
  color: #B91372;
  font-size: 1.8rem;
  text-align: center;
  margin-bottom: 2rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.linea-preview-item {
  background: white;
  margin-bottom: 2rem;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.linea-preview-header {
  background: linear-gradient(135deg, #B91372, #8B0A4A);
  color: white;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.linea-preview-number {
  background: white;
  color: #B91372;
  font-weight: bold;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.linea-preview-title {
  font-weight: bold;
  font-size: 1.2rem;
  line-height: 1.3;
}

/* Métricas de líneas */
.linea-preview-metrics {
  padding: 1.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.metric-box {
  background: linear-gradient(135deg, #f8d7da, #f5c6cb);
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  border: 2px solid rgba(185, 19, 114, 0.2);
}

.metric-number {
  font-size: 2rem;
  font-weight: bold;
  color: #B91372;
  margin-bottom: 0.5rem;
}

.metric-label {
  font-size: 0.9rem;
  color: #333;
  font-weight: 500;
  line-height: 1.2;
}

/* Evento Un Mar de Cine */
.evento-preview {
  padding: 1.5rem;
  background: #fff3cd;
  border-top: 1px solid #ddd;
}

.evento-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #856404;
  margin-bottom: 1rem;
}

.evento-metrics {
  display: flex;
  gap: 2rem;
  margin-bottom: 1rem;
}

.evento-metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.evento-location {
  font-size: 0.9rem;
  color: #856404;
  font-weight: 500;
}

.evento-number {
  font-size: 1.8rem;
  font-weight: bold;
  color: #B91372;
}

.evento-label {
  font-size: 0.9rem;
  color: #333;
}

/* Congreso */
.congreso-content {
  padding: 1.5rem;
}

.congreso-description {
  margin-bottom: 1.5rem;
  font-style: italic;
  color: #555;
}

.congreso-metrics {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.congreso-metric {
  text-align: center;
  background: linear-gradient(135deg, #d1ecf1, #bee5eb);
  padding: 1.5rem;
  border-radius: 8px;
}

.congreso-number {
  font-size: 2.5rem;
  font-weight: bold;
  color: #B91372;
  margin-bottom: 0.5rem;
}

.congreso-label {
  font-size: 0.9rem;
  color: #333;
  font-weight: 500;
}

/* Hubs Preview */
.hubs-preview-content {
  padding: 1.5rem;
}

.hubs-subtitle {
  font-weight: bold;
  margin-bottom: 1rem;
  color: #333;
  text-align: center;
}

.hubs-metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.hub-metric {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #f1f8ff, #e3f2fd);
  border-radius: 6px;
  border-left: 4px solid #B91372;
}

.hub-label {
  font-weight: 500;
  color: #333;
  flex: 1;
}

.hub-number {
  background: #B91372;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-weight: bold;
  font-size: 1.1rem;
}

/* Capital Mediterránea */
.capital-metric {
  padding: 2rem;
  text-align: center;
  background: linear-gradient(135deg, #e8f5e8, #d4edda);
}

.capital-number {
  font-size: 3rem;
  font-weight: bold;
  color: #B91372;
  margin-bottom: 1rem;
}

.capital-label {
  font-size: 1.1rem;
  color: #333;
  font-weight: 500;
}

/* Subsecciones 4.3.1 y 4.3.2 */
.subsecciones-preview {
  padding: 2rem;
  background: #f1f8ff;
}

.subseccion-preview {
  background: white;
  margin-bottom: 2rem;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.subseccion-header {
  background: linear-gradient(135deg, #17a2b8, #138496);
  color: white;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.subseccion-number {
  background: white;
  color: #17a2b8;
  font-weight: bold;
  padding: 0.75rem 1.25rem;
  border-radius: 6px;
  font-size: 1.3rem;
  flex-shrink: 0;
}

.subseccion-title {
  font-weight: bold;
  font-size: 1.2rem;
  line-height: 1.3;
}

/* Smartphone Festival */
.smartphone-metrics {
  padding: 1.5rem;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.smartphone-stat {
  text-align: center;
  background: linear-gradient(135deg, #fff3cd, #ffeaa7);
  padding: 1rem;
  border-radius: 8px;
  border: 2px solid rgba(255, 193, 7, 0.3);
}

.smartphone-details {
  padding: 1.5rem;
  background: #f8f9fa;
  border-top: 1px solid #ddd;
}

.festival-dates,
.festival-description,
.festival-categories {
  margin-bottom: 1rem;
  line-height: 1.5;
}

/* Robotikid */
.robotikid-details {
  padding: 1.5rem;
}

.robotikid-info,
.robotikid-description {
  margin-bottom: 1rem;
  line-height: 1.5;
}

.robotikid-metrics {
  padding: 1.5rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  background: #f8f9fa;
  border-top: 1px solid #ddd;
}

.robotikid-stat {
  text-align: center;
  background: linear-gradient(135deg, #d1ecf1, #bee5eb);
  padding: 1rem;
  border-radius: 8px;
  border: 2px solid rgba(23, 162, 184, 0.3);
}

.robotikid-categories {
  padding: 1rem 1.5rem;
  font-weight: 500;
  line-height: 1.5;
}

.stat-number {
  font-size: 1.8rem;
  font-weight: bold;
  color: #B91372;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  color: #333;
  font-weight: 500;
}

/* Referencias de anexos */
.anexo-reference {
  padding: 1rem 1.5rem;
  background: #e9ecef;
  font-size: 0.9rem;
  color: #666;
  border-top: 1px solid #ddd;
}

/* Responsividad para vista previa */
@media (max-width: 1024px) {
  .clusters-main-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .alicante-futura-logo {
    grid-column: span 2;
    grid-row: auto;
  }
}

@media (max-width: 768px) {
  .clusters-main-grid {
    grid-template-columns: 1fr;
  }
  
  .alicante-futura-logo {
    grid-column: 1;
    grid-row: auto;
  }
  
  .linea-preview-metrics,
  .smartphone-metrics,
  .robotikid-metrics {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>