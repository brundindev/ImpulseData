/**
 * Configuración para la integración con Gemini API
 */

export const GEMINI_CONFIG = {
  // En un entorno de producción, siempre usar variables de entorno
  // Para desarrollo, podemos incluir la clave directamente aquí
  apiKey: 'AIzaSyCuykN1qIkiKWocsrVk_3F_77pNsv_5bs0', 
  apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
  temperature: 0.7,
  maxOutputTokens: 200,
  model: 'gemini-2.0-flash',
}; 