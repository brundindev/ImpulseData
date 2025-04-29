import { Cloudinary } from '@cloudinary/url-gen';

// Configuración de Cloudinary
const cloudinary = new Cloudinary({
  cloud: {
    cloudName: 'drqt6gd5v'
  },
  url: {
    secure: true // Usar HTTPS
  }
});

// Credenciales para autenticación (necesarias para subir imágenes)
export const cloudinaryConfig = {
  cloudName: 'drqt6gd5v',
  apiKey: '526484494966574',
  apiSecret: 't04f4oTOoaQtm2U286AopfRta0k'
};

export default cloudinary; 