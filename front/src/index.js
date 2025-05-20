// Importar la función desde el módulo
import { forceGlobalImpulsalicante } from './utils/sharedStorage';

// Hacer la función disponible globalmente para depuración
window.forceGlobalImpulsalicante = forceGlobalImpulsalicante;

// Ejecutar automáticamente al cargar para asegurar que existe la instancia global
(async function() {
  try {
    console.log("Inicializando instancia global de Impulsalicante...");
    const result = await forceGlobalImpulsalicante();
    if (result) {
      console.log("✅ Instancia global de Impulsalicante inicializada correctamente");
    } else {
      console.error("❌ Error al inicializar instancia global de Impulsalicante");
    }
  } catch (error) {
    console.error("Error al inicializar:", error);
  }
})(); 