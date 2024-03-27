// Modules to control application life and create native browser window
const { app, BrowserWindow, dialog, session, Menu, Tray, ipcMain, webContents} = require('electron')
const path = require('node:path')
let mainWindow, mainWindow2, mainWindow3;
let opcionJugador1, opcionJugador2, winner, jugadoresListos;
let mainTemplate = [
  {
  label:'menu1',
  click() {console.log('menu1')},
  submenu:[
    {
      label:'menu11',
      accelerator:"CommandOrControl+T",
      click(){console.log('menu11')}
    },
    {
      label:'menu12',
      click(){console.log('menu12')}
    }
  ]
  },
  {
    label:'menu2',
    click() {console.log('menu2')},
    submenu:[
      {
        label:'quit',
        role:'quit'
      }
    ]
  }
]

let menu = Menu.buildFromTemplate(mainTemplate);
let tray = null;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 450,
    minHeight: 650,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true, 
      contextIsolation: false,
    },
  })
  
  mainWindow2 = new BrowserWindow({
    width: 650,
    height: 450,
    minWidth: 450,
    minHeight: 650,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true, 
      contextIsolation: false,
    },
    show:false
  })
  mainWindow3 = new BrowserWindow({
    width: 650,
    height: 450,
    minWidth: 450,
    minHeight: 650,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true, 
      contextIsolation: false,
    },
    show:false
  })

  Menu.setApplicationMenu(menu);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow2.show();
    mainWindow3.show();
    mainWindow.webContents.openDevTools();
    mainWindow2.webContents.openDevTools();
    mainWindow3.webContents.openDevTools();
  });

  mainWindow.loadFile('index.html')
  mainWindow2.loadFile('index2.html')
  mainWindow3.loadFile('index3.html')

  // mainWindow.webContents.on('did-finish-load', () => {
  //   mainWindow.webContents.send('elcanal','prueba desde el proceso a renderers')
  // });

  // mainWindow.setAlwaysOnTop(true);
  
  // mainWindow.webContents.on('new-window', (e,url)=>{
  //   e.preventDefault();
  //   let modalWindow = new BrowserWindow({
  //     width: 800,
  //     height: 600,
  //     minWidth: 450,
  //     minHeight: 650,
  //     parent: mainWindow,
  //     modal:true, 
  //   })
  //   modalWindow.loadURL(url);
  //   console.log(url);
  // })
  // mainWindow.webContents.on('context-menu', (e,args)=>{
  //   menu.popup(mainWindow);
  // })

  // let file = dialog.showOpenDialog(mainWindow, {})
  // .then((result) => {
  //   console.log(result.filePaths);
  // })
  // .catch((error) => {
  //   console.log(error);
  // });
}

function waitForPlayers(arg) {
  return new Promise((resolve, reject) => {
      if (!opcionJugador1) {
        opcionJugador1 = arg;
      } else if (!opcionJugador2) {
        opcionJugador2 = arg;
      }

      if (opcionJugador1 && opcionJugador2) {
        resolve({ opcionJugador1, opcionJugador2 });
      }
  });
}

ipcMain.on('elcanalasincrono', async (event, arg) => {
  
  let { opcionJugador1, opcionJugador2 } = await waitForPlayers(arg);
  winner = checkWinner(opcionJugador1, opcionJugador2);
  opcionJugador1 = null;
  opcionJugador2 = null;

  if (winner === null) {
    mainWindow3.webContents.send('canal_respuesta3', 'empate');
  } else {
    mainWindow3.webContents.send('canal_respuesta3', 'El ganador es ' + winner);
  }
});

function checkWinner(opcionJugador1,opcionJugador2){
  let ganador;
  if (opcionJugador1 === opcionJugador2) {
    return null;
  } else if (
      (opcionJugador1 === 'piedra' && opcionJugador2 === 'tijera') ||
      (opcionJugador1 === 'papel' && opcionJugador2 === 'piedra') ||
      (opcionJugador1 === 'tijera' && opcionJugador2 === 'papel')
  ) {
      ganador = 'jugador1';
  } else {
      ganador = 'jugador2';
  }
  return ganador;
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  app.on('before-quit', function (e) {
    const choice = dialog.showMessageBoxSync(mainWindow, {
      type: 'question',
      buttons: ['Sí', 'Cancelar'],
      defaultId: 0,
      message: '¿Estás seguro que quieres salir?'
    });

    if (choice === 1) {
      e.preventDefault();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
