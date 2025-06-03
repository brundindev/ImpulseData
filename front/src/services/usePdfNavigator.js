import { useRouter } from 'vue-router';

export function usePdfNavigator(showViewModal, empresaActual) {
  const router = useRouter();
  const irAPaginaPDF = () => {
    // Cerrar el modal de vista
    showViewModal.value = false;

    // Almacenar los datos de la empresa actual en localStorage para la página PDF
    localStorage.setItem('empresa_pdf', JSON.stringify(empresaActual));

    // Redirigir a la página /memoria-anual
    router.push('/memoria-anual');
  };

  return { irAPaginaPDF };
}
