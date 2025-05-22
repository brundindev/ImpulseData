# Documentación ImpulseData - https://impulsedata.vercel.app

## Índice
1. [Introducción](#introducción)
2. [Despliegue](#despliegue)
3. [Arquitectura](#arquitectura)
4. [Tecnologías y Frameworks](#tecnologías-y-frameworks)
5. [Estructura del Proyecto](#estructura-del-proyecto)
6. [Características Principales](#características-principales)
7. [Instalación y Despliegue](#instalación-y-despliegue)
8. [Configuración](#configuración)
9. [Guía de Desarrollo](#guía-de-desarrollo)
10. [Mantenimiento](#mantenimiento)
11. [Seguridad](#seguridad)

## Introducción

ImpulseData es una plataforma web desarrollada para Alicante Futura que facilita la gestión de información empresarial. El sistema permite registrar, visualizar y gestionar empresas junto con sus departamentos, centros de trabajo y formaciones asociadas. La plataforma está diseñada con una interfaz moderna y animaciones fluidas que mejoran la experiencia de usuario.

La aplicación ofrece funcionalidades como:
- Gestión completa de empresas, departamentos, centros y formaciones
- Panel de estadísticas en tiempo real
- Generación de informes en PDF y Word
- Importación de datos desde archivos CSV y JSON
- Interfaz adaptativa con animaciones y efectos visuales
- Autenticación y gestión de usuarios

## Despliegue

El proyecto está desplegado en: https://impulsedata.vercel.app donde podréis ver el proyecto desplegado y totalmente funcional.

## Arquitectura

ImpulseData sigue una arquitectura de aplicación de una sola página (SPA) con el frontend desarrollado en Vue.js y el backend basado en servicios de Firebase y gestión con Java Springboot. Esta separación permite un desarrollo ágil y una experiencia de usuario fluida.

### Diagrama de Arquitectura

```
┌─────────────┐     ┌─────────────────────┐     ┌──────────────────┐
│             │     │                     │     │  Springboot,     │
│  Cliente    │────►│  Frontend (Vue.js)  │────►│  Firebase        │
│  (Navegador)│     │                     │     │  (Autenticación, │
│             │◄────│                     │◄────│  Firestore, etc) │
└─────────────┘     └─────────────────────┘     └──────────────────┘
```

## Tecnologías y Frameworks

### Frontend
- **Vue.js 3**: Framework progresivo de JavaScript para construir interfaces de usuario
- **Vue Router**: Gestión de rutas para la SPA
- **Pinia/Vuex**: Gestión de estado de la aplicación
- **Vite**: Bundler y entorno de desarrollo
- **HTML5/CSS3**: Maquetación y estilos
- **JavaScript ES6+**: Lenguaje de programación principal

### Backend y Servicios
- **Java**: Plataforma de desarrollo
- **Firebase**: Base de datos
  - **Firebase Authentication**: Sistema de autenticación
  - **Firestore**: Base de datos NoSQL para almacenamiento

### Librerías Adicionales
- **Intersection Observer API**: Para animaciones activadas por scroll
- **PDF Service**: Generación de documentos PDF
- **File Import Service**: Importación de datos desde archivos
- **Axios**: Cliente HTTP para peticiones a API
- **html2canva**: Conversión de HTML & CSS a PDF
- **JSPDF**: Manejador de HTML a PDF

### Estilos y Diseño
- **CSS Personalizado**: Estilos específicos para componentes
- **Animaciones CSS**: Efectos visuales y transiciones
- **Diseño Responsivo**: Adaptable a diferentes dispositivos

## Estructura del Proyecto

```
ImpulseData/
├── front/                      # Código fuente del frontend
│   ├── public/                 # Archivos públicos estáticos
│   │   ├── assets/             # Recursos estáticos (imágenes, estilos)
│   │   ├── components/         # Componentes Vue reutilizables
│   │   ├── directives/         # Directivas Vue personalizadas
│   │   ├── router/             # Configuración de rutas
│   │   ├── services/           # Servicios (Firebase, PDF, etc.)
│   │   ├── stores/             # Almacenes de estado (Pinia/Vuex)
│   │   ├── views/              # Componentes de página
│   │   ├── App.vue             # Componente raíz
│   │   ├── main.js             # Punto de entrada de la aplicación
│   │   └── firebase.js         # Configuración de Firebase
│   ├── index.html              # Archivo HTML principal
│   ├── vite.config.js          # Configuración de Vite
│   └── package.json            # Dependencias del proyecto
├── desktop-app/                # Aplicación de escritorio (si existe)
├── docs/                       # Documentación
└── ...                         # Otros archivos de configuración
```

## Características Principales

### Gestión de Empresas
El sistema permite el registro completo de empresas con información detallada como:
- Nombre y descripción
- Ciudad y fecha de creación
- Departamentos asociados
- Centros de trabajo
- Formaciones impartidas

### Sistema de Animaciones
ImpulseData cuenta con un avanzado sistema de animaciones al hacer scroll que mejora la experiencia de usuario:

- **Directiva `v-scroll-animate`**: Activa animaciones cuando los elementos entran en el viewport
- **Componentes animados**: Tarjetas, estadísticas y secciones con efectos de entrada
- **Optimización de rendimiento**: Las animaciones están optimizadas para no bloquear el scroll
- **Soporte para preferencias de reducción de movimiento**: Respeta las preferencias de accesibilidad

### Panel de Estadísticas
Dashboard interactivo que muestra información relevante:
- Contador de empresas registradas
- Total de departamentos
- Total de centros de trabajo
- Formaciones disponibles

### Generación de Informes
Sistema de generación de documentos para exportar información:
- Informes en PDF con diseño profesional
- Exportación a formato Word
- Visualización previa antes de descarga

### Importación de Datos
Funcionalidad para importar datos desde diferentes formatos:
- Soporte para archivos CSV
- Soporte para archivos JSON
- Validación de datos importados

## Instalación y Despliegue

### Requisitos Previos
- Node.js (v14.0.0 o superior)
- npm (v6.0.0 o superior) o pnpm
- Cuenta en Firebase

### Instalación Local

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/ImpulseData.git
   cd ImpulseData
   ```

2. **Instalar dependencias del frontend**
   ```bash
   cd front
   pnpm install
   ```

3. **Descargar Docker**
   ```
   https://www.docker.com/products/docker-desktop/
   ```

4. **Ejecución en MAC**
    En la carpeta raíz ``ImpulseData``
    ```
    cd impulsedata
    ./run.sh
    ```

5. **Ejecución en Windows**
    En la carpeta raíz ``ImpulseData``
    ```
    cd impulsedata
    .\run.bat
    ```

## Configuración

### Firebase

1. **Crear proyecto en Firebase**
   - Acceder a [Firebase Console](https://console.firebase.google.com/)
   - Crear un nuevo proyecto
   - Activar Authentication, Firestore y Storage

2. **Configurar reglas de seguridad en Firestore**
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /empresas/{document=**} {
         allow read, write: if request.auth != null;
       }
       // Otras reglas según necesidades
     }
   }
   ```

3. **Configurar Authentication**
   - Activar los métodos de autenticación deseados (Email/Password, Google, etc.)

### Personalización de Estilos

Los estilos principales se encuentran en los siguientes archivos:
- `front/src/assets/ScrollAnimations.css`: Animaciones de scroll
- `front/src/assets/Home.css`: Estilos de la página principal
- Componentes individuales con estilos scoped en cada archivo `.vue`

## Guía de Desarrollo

### Agregar un Nuevo Componente

1. **Crear archivo de componente**
   ```bash
   touch front/src/components/NuevoComponente.vue
   ```

2. **Estructura básica del componente**
   ```vue
   <template>
     <!-- Contenido HTML -->
   </template>

   <script setup>
   import { ref, onMounted } from 'vue';
   // Lógica del componente
   </script>

   <style>
   /* Estilos del componente */
   </style>
   ```

3. **Registrar el componente** (si es necesario)
   En `main.js` para componentes globales o importar directamente donde se use.

### Trabajar con Animaciones

Para agregar animaciones a un nuevo elemento:

1. **Usando la directiva scroll-animate**
   ```html
   <div v-scroll-animate="'animate-up'">
     <!-- Contenido animado -->
   </div>
   ```

2. **Opciones disponibles para animaciones**
   - `animate-up`: Animación desde abajo
   - `animate-left`: Animación desde la izquierda
   - `animate-right`: Animación desde la derecha
   - `animate-zoom`: Efecto de zoom
   - `animate-rotate`: Efecto de rotación

### Interacción con Firebase

1. **Leer datos**
   ```javascript
   import { collection, getDocs } from 'firebase/firestore';
   import { db } from '../firebase';

   const getEmpresas = async () => {
     const empresasRef = collection(db, 'empresas');
     const snapshot = await getDocs(empresasRef);
     return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
   };
   ```

2. **Escribir datos**
   ```javascript
   import { collection, addDoc } from 'firebase/firestore';
   import { db } from '../firebase';

   const agregarEmpresa = async (empresa) => {
     const empresasRef = collection(db, 'empresas');
     const docRef = await addDoc(empresasRef, empresa);
     return docRef.id;
   };
   ```

## Mantenimiento

### Actualizaciones de Dependencias

Regularmente revisar y actualizar las dependencias:
```bash
cd front
pnpm outdated
pnpm update
```

### Solución de Problemas Comunes

#### Problemas con Animaciones
- **Problema**: Las animaciones bloquean el scroll
- **Solución**: Verificar que se apliquen correctamente las propiedades CSS que permiten el scroll (visibility: visible, pointer-events: auto) a los elementos animados

#### Errores de Firebase
- **Problema**: Error de permisos al acceder a Firestore
- **Solución**: Verificar reglas de seguridad y estado de autenticación del usuario

#### Problemas de Rendimiento
- **Problema**: Lentitud al cargar muchas empresas
- **Solución**: Implementar paginación o carga bajo demanda

## Seguridad

### Autenticación
El sistema utiliza Firebase Authentication para gestionar usuarios. Cada operación en la base de datos comprueba que el usuario esté autenticado.

### Protección de Rutas
Las rutas protegidas verifican el estado de autenticación antes de permitir el acceso:
```javascript
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const currentUser = auth.currentUser;
  
  if (requiresAuth && !currentUser) {
    next('/login');
  } else {
    next();
  }
});
```

---

## Recursos Adicionales

- [Documentación de Vue.js](https://vuejs.org/guide/introduction.html)
- [Documentación de Firebase](https://firebase.google.com/docs)
- [Guía de Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [Repositorio del Proyecto](https://github.com/brundindev/ImpulseData)

---

Documentación creada para Alicante Futura [ ImpulseData ] © 2025
