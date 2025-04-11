/**
 * Servicio para integrar la API de Gemini de Google AI
 * Este servicio se utiliza para autocompletar campos en formularios
 */

import { GEMINI_CONFIG } from '../config/gemini.config';

class GeminiService {
  /**
   * Obtiene sugerencias de autocompletado utilizando Gemini API
   * @param {string} campo - El nombre del campo a completar (ej: "descripción", "nombre de empresa")
   * @param {string} contexto - Información de contexto para mejorar la sugerencia
   * @param {string} valorActual - Valor actual del campo que ha escrito el usuario
   * @returns {Promise<string>} - Texto sugerido por Gemini
   */
  async obtenerSugerencia(campo, contexto = '', valorActual = '') {
    try {
      // Verificar si la API key está configurada
      console.log('Config cargada:', !!GEMINI_CONFIG);
      console.log('API key disponible:', !!GEMINI_CONFIG.apiKey);
      
      if (!GEMINI_CONFIG.apiKey) {
        console.error('API key de Gemini no configurada. Por favor añade tu API key en el archivo .env');
        throw new Error('API key de Gemini no configurada');
      }
      
      console.log(`Solicitando sugerencia para: ${campo}`);
      console.log(`Contexto proporcionado: ${contexto}`);
      console.log(`Valor actual del campo: ${valorActual}`);
      
      // Construir la URL completa de la API
      const apiUrl = `${GEMINI_CONFIG.apiUrl}?key=${GEMINI_CONFIG.apiKey}`;
      console.log('URL base de la API:', GEMINI_CONFIG.apiUrl);
      
      // Construir un prompt específico para cada tipo de campo
      let prompt = this.construirPrompt(campo, contexto, valorActual);
      console.log('Prompt generado:', prompt.substring(0, 50) + '...');
      
      // Preparar los datos para la solicitud
      const requestData = {
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ],
        generationConfig: {
          temperature: GEMINI_CONFIG.temperature,
          maxOutputTokens: GEMINI_CONFIG.maxOutputTokens,
          topP: 0.8,
          topK: 40
        }
      };
      
      // Realizar la solicitud a la API de Gemini
      console.log('Enviando solicitud a Gemini API...');
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });
      
      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error en la respuesta de Gemini (texto completo):', errorText);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { error: { message: 'Error no estructurado: ' + errorText.substring(0, 100) } };
        }
        
        console.error('Error en la respuesta de Gemini (procesado):', errorData);
        throw new Error(`Error en la API de Gemini: ${errorData.error?.message || 'Error desconocido'}`);
      }
      
      // Procesar la respuesta
      console.log('Respuesta recibida, procesando...');
      const data = await response.json();
      
      // Extraer el texto de la respuesta de Gemini
      if (data.candidates && data.candidates.length > 0 && 
          data.candidates[0].content && 
          data.candidates[0].content.parts && 
          data.candidates[0].content.parts.length > 0) {
        
        const respuesta = data.candidates[0].content.parts[0].text.trim();
        console.log('Respuesta de Gemini:', respuesta.substring(0, 50) + '...');
        return respuesta;
      } else {
        // Si no hay una respuesta válida, usar el modo de fallback
        console.warn('No se recibió una respuesta válida de Gemini, usando modo de fallback');
        return this.obtenerRespuestaFallback(campo, contexto, valorActual);
      }
    } catch (error) {
      console.error('Error al obtener sugerencia de Gemini:', error);
      
      // Si hay un error, usamos el modo de fallback
      console.log('Usando modo de fallback debido al error');
      return this.obtenerRespuestaFallback(campo, contexto, valorActual);
    }
  }
  
  /**
   * Construye un prompt específico para el tipo de campo
   * @param {string} campo - El nombre del campo
   * @param {string} contexto - Información adicional de contexto
   * @param {string} valorActual - Valor actual del campo
   * @returns {string} - El prompt para Gemini
   */
  construirPrompt(campo, contexto, valorActual = '') {
    let promptBase = '';
    
    // Parte común que indica que debe usarse el texto del usuario
    const textoUsuario = valorActual && valorActual.trim() !== '' 
      ? `\n\nEl usuario ya ha empezado a escribir: "${valorActual}". Usa este texto como punto de partida y expándelo o mejóralo manteniendo el mismo estilo y tono.`
      : '';
    
    switch (campo.toLowerCase()) {
      case 'descripción de empresa':
      case 'descripcion de empresa':
      case 'descripción empresa':
      case 'descripcion empresa':
        promptBase = `Genera una descripción breve y profesional para una empresa${contexto ? ' llamada ' + contexto : ''}. 
        La descripción debe ser concisa (máximo 2 frases), destacar la innovación y el valor añadido, y estar en español.
        Evita frases genéricas y céntrate en lo que hace única a la empresa.${textoUsuario}`;
        break;
        
      case 'nombre de empresa':
      case 'nombre empresa':
        promptBase = `Genera un nombre creativo y memorable para una empresa${contexto ? ' relacionada con ' + contexto : ''}.
        El nombre debe ser corto (máximo 2-3 palabras), fácil de recordar, y sugerir innovación.
        No uses palabras como "Solutions", "Tech", "Innovate" a menos que sea realmente necesario.${valorActual ? '\n\nEl usuario sugiere algo como: "' + valorActual + '". Usa esto como inspiración.' : ''}`;
        break;
        
      case 'dirección':
      case 'direccion':
        promptBase = `Genera una dirección realista en ${contexto || 'Alicante, España'}.
        Debe incluir calle, número y código postal. La dirección debe parecer auténtica.${textoUsuario}`;
        break;
        
      case 'nombre de departamento':
      case 'nombre departamento':
        promptBase = `Genera un nombre profesional para un departamento de una empresa${contexto ? ' llamada ' + contexto : ''}.
        El nombre debe ser claro, conciso y reflejar una función específica dentro de la organización.${textoUsuario}`;
        break;
        
      case 'nombre de centro':
      case 'nombre centro':
        promptBase = `Genera un nombre para un centro o sede de una empresa${contexto ? ' llamada ' + contexto : ''}.
        El nombre debe ser descriptivo y profesional, puede incluir una referencia a su ubicación o función.${textoUsuario}`;
        break;
        
      case 'nombre de formación':
      case 'nombre formacion':
        promptBase = `Genera un título para un curso de formación profesional${contexto ? ' para la empresa ' + contexto : ''}.
        El título debe ser profesional, específico y atractivo, indicando claramente el área de conocimiento.${textoUsuario}`;
        break;
        
      default:
        promptBase = `Genera una sugerencia para el campo "${campo}"${contexto ? ' en el contexto de ' + contexto : ''}.
        La respuesta debe ser concisa, profesional y útil para un formulario de empresa.${textoUsuario}`;
    }
    
    // Añadir instrucciones generales
    return `${promptBase}
      
      Responde SOLO con el texto sugerido, sin introducción, explicación ni formato adicional.`;
  }
  
  /**
   * Método de fallback en caso de error con la API
   * @param {string} campo - El nombre del campo
   * @param {string} contexto - Información adicional de contexto
   * @param {string} valorActual - Valor actual del campo
   * @returns {string} - Respuesta predeterminada
   */
  obtenerRespuestaFallback(campo, contexto = '', valorActual = '') {
    console.log('Usando respuestas predefinidas para:', campo);
    
    // Si hay valor actual, lo usamos como base y añadimos un texto
    if (valorActual && valorActual.trim() !== '') {
      return `${valorActual} [Texto generado automáticamente a partir de tu entrada]`;
    }
    
    // Respuestas predefinidas para cada tipo de campo
    switch (campo.toLowerCase()) {
      case 'descripción de empresa':
      case 'descripcion de empresa':
      case 'descripción empresa':
      case 'descripcion empresa':
        return `Empresa líder en el sector que ofrece soluciones innovadoras y servicios de alta calidad. Nos destacamos por nuestro compromiso con la excelencia y la satisfacción del cliente.`;
          
      case 'nombre de empresa':
      case 'nombre empresa':
        return contexto ? 
          `${contexto} Solutions` : 
          'Innovate Tech';
          
      case 'dirección':
      case 'direccion':
        return 'Avenida de Denia 47, 03013 Alicante';
          
      case 'nombre de departamento':
      case 'nombre departamento':
        return 'Investigación y Desarrollo';
          
      case 'nombre de centro':
      case 'nombre centro':
        return 'Centro de Innovación Digital';
          
      case 'nombre de formación':
      case 'nombre formacion':
        return 'Desarrollo de Competencias Digitales Avanzadas';
          
      default:
        return 'Sugerencia generada para el campo ' + campo;
    }
  }

  /**
   * Obtiene sugerencias personalizadas usando un prompt definido por el usuario
   * @param {string} promptUsuario - El prompt personalizado definido por el usuario
   * @param {string} contexto - Información de contexto para enriquecer la respuesta
   * @param {string} valorActual - Valor actual del campo
   * @returns {Promise<string>} - Texto sugerido por Gemini
   */
  async obtenerSugerenciaPersonalizada(promptUsuario, contexto = '', valorActual = '') {
    try {
      // Verificar si la API key está configurada
      if (!GEMINI_CONFIG.apiKey) {
        console.error('API key de Gemini no configurada. Por favor añade tu API key en el archivo .env');
        throw new Error('API key de Gemini no configurada');
      }
      
      console.log(`Prompt personalizado del usuario: ${promptUsuario}`);
      console.log(`Contexto proporcionado: ${contexto}`);
      console.log(`Valor actual del campo: ${valorActual}`);
      
      // Construir la URL completa de la API
      const apiUrl = `${GEMINI_CONFIG.apiUrl}?key=${GEMINI_CONFIG.apiKey}`;
      
      // Construir el prompt completo
      let promptCompleto = promptUsuario;
      
      // Añadir contexto si existe
      if (contexto && contexto.trim() !== '') {
        promptCompleto += `\n\nContexto adicional: ${contexto}`;
      }
      
      // Añadir valor actual si existe
      if (valorActual && valorActual.trim() !== '') {
        promptCompleto += `\n\nValor actual: ${valorActual}`;
      }
      
      // Añadir instrucciones para que la respuesta sea directa
      promptCompleto += `\n\nResponde SOLO con el texto sugerido, sin introducción, explicación ni formato adicional.`;
      
      console.log('Prompt completo generado:', promptCompleto.substring(0, 50) + '...');
      
      // Preparar los datos para la solicitud
      const requestData = {
        contents: [
          {
            parts: [
              { text: promptCompleto }
            ]
          }
        ],
        generationConfig: {
          temperature: GEMINI_CONFIG.temperature,
          maxOutputTokens: GEMINI_CONFIG.maxOutputTokens,
          topP: 0.8,
          topK: 40
        }
      };
      
      // Realizar la solicitud a la API de Gemini
      console.log('Enviando solicitud personalizada a Gemini API...');
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });
      
      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error en la respuesta de Gemini (texto completo):', errorText);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { error: { message: 'Error no estructurado: ' + errorText.substring(0, 100) } };
        }
        
        console.error('Error en la respuesta de Gemini (procesado):', errorData);
        throw new Error(`Error en la API de Gemini: ${errorData.error?.message || 'Error desconocido'}`);
      }
      
      // Procesar la respuesta
      console.log('Respuesta recibida para prompt personalizado, procesando...');
      const data = await response.json();
      
      // Extraer el texto de la respuesta de Gemini
      if (data.candidates && data.candidates.length > 0 && 
          data.candidates[0].content && 
          data.candidates[0].content.parts && 
          data.candidates[0].content.parts.length > 0) {
        
        const respuesta = data.candidates[0].content.parts[0].text.trim();
        console.log('Respuesta personalizada de Gemini:', respuesta.substring(0, 50) + '...');
        return respuesta;
      } else {
        // Si no hay una respuesta válida, usar el modo de fallback
        console.warn('No se recibió una respuesta válida de Gemini para el prompt personalizado');
        return valorActual ? `${valorActual} [No se pudo generar contenido adicional]` : promptUsuario;
      }
    } catch (error) {
      console.error('Error al obtener sugerencia personalizada de Gemini:', error);
      
      // Fallback sencillo para sugerencias personalizadas
      return valorActual ? 
        `${valorActual} [No se pudo procesar tu solicitud]` : 
        'No se pudo generar el texto solicitado';
    }
  }
}

export default new GeminiService(); 