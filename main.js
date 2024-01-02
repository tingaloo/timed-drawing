const { app, protocol, net, BrowserWindow, dialog, shell, ipcMain } = require('electron')
const path = require('path');
const fs = require('fs');
const CONSTS = require('./consts')
const prompt = require('electron-prompt');


let mainWindow;
let imgArr = [];
let prevImgIdx = 0;
let currentImgIdx = 0;
let historyArr = [];
let favoritesArr = [];
let directory = CONSTS.USER_DEFINED_LIBRARY;
let alwaysOnTop = true;

const {
    glob,
    Glob,
  } = require('glob')




  function addFileToFavorites() {
    let filename = historyArr[currentImgIdx];

    // fs.writeFile('favorites.txt', `${filename}\r\n`, { flag: "a+" }, (err) => {
    //   if (err) throw err;
    //   console.log('The file is created if not existing!!');
    // }); 
    // console.log(filename)
    shell.showItemInFolder(filename)
  }

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }

  async function getPrompt() {
    
   const interval = await prompt({
      title: 'Set Interval',
      label: 'Type in Interval in seconds',
      value: 'http://example.org',
      inputAttrs: {
          type: 'number'
      },
      alwaysOnTop: true,
      type: 'input'
  })
  .then( (r) => {
      if(r === null) {
          console.log('user cancelled');
      } else {
        return  r;
      }
  })
  .catch(console.error);

  return interval;

  }

 

   async function getImages(directory) {
    const images = await glob(`${directory}/**/*.{${CONSTS.IMG_FILE_TYPES}}`, { ignore: CONSTS.EXCLUSION_PATTERN })
    return images;
  }

  async function setImagesLocally() {
    imgArr =await getImages(directory)
    return imgArr;
  }

// getRandomImageFilePath returns a filepath from a random jpeg file in the assets/images folder
 function getRandomImageFilePath() {
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




    ipcMain.on('toggle-always-on-top', async () => {
         toggleAlwaysOnTop();
      })

      ipcMain.on('get-random-img', async () => {
        handleNextImage();
     })


      ipcMain.on('get-prev-img', async () => {
        handlePrevImage();
      })

      ipcMain.on('favorite-img', async () => {
        addFileToFavorites();
      })

      ipcMain.on('open-directory', async () => {
        dialog.showOpenDialog(mainWindow, {
          properties: ['openFile', 'openDirectory']
        }).then(result => {
          resetToDefault();
          // if (fs.stat(result).isDirectory()) {
          //   console.log('directory!')
          // }
          // console.log(result)

          directory = result.filePaths;
          console.log(directory)
          // console.log(, 'isdirectyry' )
          if (!fs.lstatSync(directory[0]).isDirectory()) {
            mainWindow.webContents.send('update-img',directory[0])

          } else {
            setImagesLocally().then(() => handleNextImage());

          }


        }).catch(err => {
          console.log(err)
        })      })



    mainWindow.loadFile('index.html');
}

function resetToDefault() {
  historyArr = [];
  currentImgIdx = 0;
  directory = CONSTS.USER_DEFINED_LIBRARY;
}


app.whenReady().then(() => {
    createWindow()
    mainWindow.once('ready-to-show', () => {
      mainWindow.show();
      if (alwaysOnTop) {
        mainWindow.setAlwaysOnTop(true, "screen-saver");
  
      }
    })


  mainWindow.webContents.on('did-finish-load', async function () {
    await setImagesLocally();
    handleNextImage();
});
  ipcMain.handle('set-interval', getPrompt)


  })


  // toggleAlwaysOnTop will be invoked from the clientside. 
  async function toggleAlwaysOnTop() {
    if (alwaysOnTop) {
      mainWindow.setAlwaysOnTop(false);
      alwaysOnTop = false;
    } else {
      mainWindow.setAlwaysOnTop(true, 'screen-saver')
      alwaysOnTop = true;
    }
  }

  //handleNextImage will return a random image if we are at the end of the historyArr. If currPosition = historyArr.length-1
  // if not, then it will 
async function handleNextImage() {
    // if end of historyArr, get random img
    // 0  -1
    let j = getRandomImageFilePath();

    // base case, no repeating images
    if (!historyArr.includes( j)) {
      if (currentImgIdx >= historyArr.length-1) {
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
    return;
    }
    handleNextImage();
    // init status


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

