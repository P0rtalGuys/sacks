const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  onUpdateAvailable: (cb) =>
    ipcRenderer.on('update-available', (_event, info) => cb(info)),
  onUpdateDownloaded: (cb) =>
    ipcRenderer.on('update-downloaded', (_event, info) => cb(info)),
  onUpdateError: (cb) =>
    ipcRenderer.on('update-error', (_event, err) => cb(err)),
  installUpdate: () => ipcRenderer.send('install-update'),
  removeUpdateListeners: () => {
    ipcRenderer.removeAllListeners('update-available')
    ipcRenderer.removeAllListeners('update-downloaded')
    ipcRenderer.removeAllListeners('update-error')
  },
})
