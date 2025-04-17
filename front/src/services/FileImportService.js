import { getAuth } from "firebase/auth";
import app from '../firebase';
import FirestoreService from './FirestoreService';

class FileImportService {
  /**
   * Importa empresas desde un archivo CSV
   * @param {File} file - Archivo CSV a importar
   * @returns {Promise<Array>} - Array de empresas importadas
   */
  static async importFromCSV(file) {
    try {
      const text = await file.text();
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      const empresas = [];
      
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        const values = lines[i].split(',').map(v => v.trim());
        const empresa = {};
        
        headers.forEach((header, index) => {
          empresa[header] = values[index] || '';
        });
        
        // Validar campos requeridos
        if (!empresa.nombre || !empresa.fechaCreacion) {
          console.warn(`Fila ${i} ignorada: faltan campos requeridos`);
          continue;
        }
        
        // Formatear fecha si es necesario
        if (empresa.fechaCreacion) {
          empresa.fechaCreacion = new Date(empresa.fechaCreacion).toISOString();
        }
        
        empresas.push(empresa);
      }
      
      return empresas;
    } catch (error) {
      console.error('Error al importar CSV:', error);
      throw error;
    }
  }

  /**
   * Importa empresas desde un archivo JSON
   * @param {File} file - Archivo JSON a importar
   * @returns {Promise<Array>} - Array de empresas importadas
   */
  static async importFromJSON(file) {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      // Verificar si es un array de empresas o un objeto con empresas
      const empresas = Array.isArray(data) ? data : data.empresas || [];
      
      // Validar y formatear cada empresa
      return empresas.map(empresa => {
        // Validar campos requeridos
        if (!empresa.nombre || !empresa.fechaCreacion) {
          console.warn('Empresa ignorada: faltan campos requeridos');
          return null;
        }
        
        // Formatear fecha si es necesario
        if (empresa.fechaCreacion) {
          empresa.fechaCreacion = new Date(empresa.fechaCreacion).toISOString();
        }
        
        return empresa;
      }).filter(empresa => empresa !== null);
    } catch (error) {
      console.error('Error al importar JSON:', error);
      throw error;
    }
  }

  /**
   * Guarda las empresas importadas en Firestore
   * @param {Array} empresas - Array de empresas a guardar
   * @returns {Promise<Array>} - Array de IDs de empresas guardadas
   */
  static async guardarEmpresasImportadas(empresas) {
    try {
      const user = getAuth(app).currentUser;
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      const empresasGuardadas = [];
      
      for (const empresa of empresas) {
        try {
          const empresaId = await FirestoreService.guardarEmpresa(empresa);
          empresasGuardadas.push(empresaId);
        } catch (error) {
          console.error(`Error al guardar empresa ${empresa.nombre}:`, error);
        }
      }
      
      return empresasGuardadas;
    } catch (error) {
      console.error('Error al guardar empresas importadas:', error);
      throw error;
    }
  }
}

export default FileImportService; 