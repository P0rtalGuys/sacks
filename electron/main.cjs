const { app, BrowserWindow, ipcMain } = require('electron')
const { autoUpdater } = require('electron-updater')
const path = require('path')

autoUpdater.autoDownload = true
autoUpdater.autoInstallOnAppQuit = true

let win = null

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs'),
    },
  })

  win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'))

  win.on('closed', () => { win = null })
}

function setupAutoUpdater() {
  autoUpdater.on('update-available', (info) => {
    win?.webContents.send('update-available', info)
  })

  autoUpdater.on('update-downloaded', (info) => {
    win?.webContents.send('update-downloaded', info)
  })

  autoUpdater.on('error', (err) => {
    win?.webContents.send('update-error', err?.message ?? String(err))
  })

  // Check 5 seconds after launch so the window is ready
  setTimeout(() => {
    autoUpdater.checkForUpdatesAndNotify().catch(() => {})
  }, 5000)
}

ipcMain.on('install-update', () => {
  autoUpdater.quitAndInstall()
})

app.whenReady().then(() => {
  createWindow()
  setupAutoUpdater()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
