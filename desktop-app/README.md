# ImpulseData - Aplicación de Escritorio

Esta es una aplicación de escritorio para ImpulseData, que permite acceder a la aplicación web alojada en Vercel desde una aplicación nativa.

## Prerrequisitos

- Node.js (versión 18 o superior)
- npm o yarn

## Instalación para desarrollo

1. Clona este repositorio o descarga los archivos
2. Instala las dependencias:

```bash
cd desktop-app
npm install
# o
yarn install
```

3. Inicia la aplicación en modo desarrollo:

```bash
npm start
# o
yarn start
```

## Compilación para distribución

### Para Windows:

```bash
npm run build:win
# o
yarn build:win
```

### Para macOS:

```bash
npm run build:mac
# o
yarn build:mac
```

### Para Linux:

```bash
npm run build:linux
# o
yarn build:linux
```

Los archivos compilados se encontrarán en la carpeta `dist/`.

## Notas importantes

- Esta aplicación es simplemente un contenedor que muestra el frontend desplegado en Vercel.
- Asegúrate de actualizar la URL de Vercel en el archivo `main.js` si cambia la dirección de despliegue.
- Para personalizar el icono de la aplicación, reemplaza el archivo `icon.png` con tu propio icono.

## Personalización

Puedes personalizar varios aspectos de la aplicación:

- Tamaño inicial de la ventana: modifica las propiedades `width` y `height` en `main.js`
- Menús: edita la sección `template` en `main.js`
- Comportamiento de enlaces externos: ajusta la función `setWindowOpenHandler` 