const { app, protocol, net, BrowserWindow, dialog, shell, ipcMain } = require('electron')
const path = require('path')
let mainWindow;
let imgArr = [];
let prevImgIdx = 0;
let currentImgIdx = 0;
let historyArr = [];
let favoritesArr = [];
const IMG_FILE_TYPES = "jpg,png,jpeg"

const {
    glob,
    Glob,
  } = require('glob')

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }
 

   async function getImages() {
    const images = await glob(`**/*.{${IMG_FILE_TYPES}}`, { ignore: 'assets/icons/**' })
    return images;
  }

  async function setImagesLocally() {
    imgArr =await getImages();
  }

// getRandomImageFilePath returns a filepath from a random jpeg file in the assets/images folder
  async function getRandomImageFilePath() {
    let randomIdx = getRandomInt(0, imgArr.length-1)
    let randomImageSrc = imgArr[randomIdx]

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
      show: false,
      alwaysOnTop: true
    }
    })

    ipcMain.on('get-random-img', async () => {
         handleNextImage();

      })

      ipcMain.on('get-prev-img', async () => {
        handlePrevImage();
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
    handleNextImage();
});

  })

  //handleNextImage will return a random image if we are at the end of the historyArr. If currPosition = historyArr.length-1
  // if not, then it will 
async function handleNextImage() {
    // if end of historyArr, get random img
    // 0  -1
    // init status
    if (currentImgIdx >= historyArr.length-1) {
        let j = await getRandomImageFilePath();
        historyArr.push(j)
        if (historyArr.length != 1) {
            currentImgIdx++;
        }
        mainWindow.webContents.send('update-img',j)
    } else {
        let nextImgSrc = historyArr[currentImgIdx+1];
        currentImgIdx++;
        mainWindow.webContents.send('update-img',nextImgSrc)

    }

}

function handlePrevImage() {
    let newIndex = currentImgIdx-1;
    let prevImgSrc = historyArr[newIndex];

    if (newIndex < 0) {
        return;
    }
    currentImgIdx = newIndex;
    mainWindow.webContents.send('update-img', prevImgSrc)

}

//   ipcMain.on('select-dirs', async (event, arg) => {
//     const result = await dialog.showOpenDialog(mainWindow, {
//       properties: ['openDirectory', 'multiSelections'],
//       filters: [
//         { name: 'Images', extensions: ['jpg', 'png', 'gif'] }
//       ]
//     })
//     console.log('directories selected', result.filePaths)
//   })


  


