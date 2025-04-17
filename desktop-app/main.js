const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');
const Store = require('electron-store');

// Configuración de almacenamiento
const store = new Store();

// URL de la aplicación desplegada en Vercel
const VERCEL_URL = 'https://impulsedata.vercel.app'; // Reemplazar con tu URL real

function createWindow() {
  // Crear ventana del navegador
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'assets', 'icon.png')
  });

  // Cargar la URL de Vercel
  mainWindow.loadURL(VERCEL_URL);

  // Abrir DevTools en modo desarrollo
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
  
  // Gestionar enlaces que deben abrirse en el navegador externo
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    // Abrir enlaces externos en el navegador predeterminado
    if (!url.startsWith(VERCEL_URL)) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });
  
  // Crear menú personalizado
  const template = [
    {
      label: 'Archivo',
      submenu: [
        { role: 'quit', label: 'Salir' }
      ]
    },
    {
      label: 'Ver',
      submenu: [
        { role: 'reload', label: 'Recargar' },
        { role: 'forceReload', label: 'Forzar recarga' },
        { type: 'separator' },
        { role: 'resetZoom', label: 'Restablecer zoom' },
        { role: 'zoomIn', label: 'Acercar' },
        { role: 'zoomOut', label: 'Alejar' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'Pantalla completa' }
      ]
    },
    {
      label: 'Ayuda',
      submenu: [
        {
          label: 'Sitio web',
          click: async () => {
            await shell.openExternal('https://impulsedata.vercel.app');
          }
        },
        {
          label: 'Acerca de',
          click: () => {
            const aboutWindow = new BrowserWindow({
              width: 300,
              height: 200,
              resizable: false,
              minimizable: false,
              maximizable: false
            });
            aboutWindow.loadURL(`data:text/html;charset=utf-8,
              <html>
                <head>
                  <style>
                    body { font-family: Arial; text-align: center; padding: 20px; }
                  </style>
                </head>
                <body>
                  <h2>ImpulseData</h2>
                  <p>Versión 1.0.0</p>
                </body>
              </html>
            `);
          }
        }
      ]
    }
  ];
  
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
  createWindow();
  
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
}); 