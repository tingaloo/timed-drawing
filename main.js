const { app, protocol, net, BrowserWindow, dialog, shell, ipcMain } = require('electron')
const path = require('path')
let mainWindow;
let imgArr = [];

const testFolder = './assets/';
const fs = require('fs');
const {
    glob,
    globSync,
    globStream,
    globStreamSync,
    Glob,
  } = require('glob')

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }
 
   async function getImages() {
    const images = await glob("**/*.jpg")
    return images;
  }

  async function setImagesLocally() {
    imgArr =await getImages();
  }


  async function getRandomImageSrc() {
    let randomImageSrc = imgArr[getRandomInt(0, imgArr.length-1)]

    return randomImageSrc;
}

function createWindow(){
     mainWindow = new BrowserWindow({
        webPreferences: {
          preload: path.join(__dirname, './preload.js'),
      nodeIntegration: true,
      enableRemoteModule: false,
      contextIsolation: true,
      webSecurity: false,
      sandbox: true,
      transparent:true,
      frame: false,
      opacity: 0,
      show: false
    }
    })

    ipcMain.on('get-random-img', async () => {
        let randomImgSrc = await getRandomImageSrc();
        mainWindow.webContents.send('update-img', randomImgSrc)
      })

    mainWindow.loadFile('index.html');
}


app.whenReady().then(() => {
    createWindow()
    mainWindow.once('ready-to-show', () => {
      mainWindow.show();
    })

    

  mainWindow.webContents.on('did-finish-load', async function () {
    await setImagesLocally();
    let j = await getRandomImageSrc();
    mainWindow.webContents.send('update-img',j)
});

  })

//   ipcMain.on('select-dirs', async (event, arg) => {
//     const result = await dialog.showOpenDialog(mainWindow, {
//       properties: ['openDirectory', 'multiSelections'],
//       filters: [
//         { name: 'Images', extensions: ['jpg', 'png', 'gif'] }
//       ]
//     })
//     console.log('directories selected', result.filePaths)
//   })


  


