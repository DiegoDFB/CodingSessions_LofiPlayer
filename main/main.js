const { app, BrowserWindow } = require('electron')

const createWindow = () => {
  const path = require('path');
  const win = new BrowserWindow({
    width: 400,
    height: 750,
    autoHideMenuBar: true,
    icon: path.join(__dirname, '../assets/icon.ico'),
    maximizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  win.loadFile('./renderer/index.html')
}

app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})