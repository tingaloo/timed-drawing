const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  onUpdateImg: (callback) => ipcRenderer.on('update-img', (_event, value) => callback(value)),
  getNewRandomImage: () => ipcRenderer.send('get-random-img')

})

