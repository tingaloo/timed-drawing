const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  onUpdateImg: (callback) => ipcRenderer.on('update-img', (_event, value) => callback(value)),
  getNewRandomImage: () => ipcRenderer.send('get-random-img'),
  getNextImage: () => ipcRenderer.send('get-next-img'),
  getPrevImage: ()=>  ipcRenderer.send('get-prev-img'),
  favoriteImage: () => ipcRenderer.send('favorite-img'),
  openDirectory: () => ipcRenderer.send('open-directory'),
  setInterval: () => ipcRenderer.invoke('set-interval'),
  toggleAlwaysOnTop: () => ipcRenderer.send('toggle-always-on-top')

})

