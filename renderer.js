

let INTERVAL_IN_SECONDS = 2
let nIntervId;
let warningInterval;
let timerStatus = "stopped"


const imgDiv = document.getElementById('imgFrame')


window.electronAPI.onUpdateImg((value) => {
    imgDiv.src=value
})

function myEventHandler(e) {
    console.log(e.keyCode);
    switch (e.keyCode) {
    //   case 108:
    //     nextImage();
    //     break;
    //   case 106:
    //     prevImage();
    //     break;

      case 37:
        // left arrow
        getPrevImage();
        break;
      case 39:
        // right arrow
        newRandomImage();
        break;
    case 32:
        // space
        toggleInterval(e);
        break;
      case 114:
        // r
        newRandomImage();
        break;
      default:
        
    }
  }

  function newRandomImage() {
    window.electronAPI.getNewRandomImage()
  }

  function getPrevImage() {
    window.electronAPI.getPrevImage()

  }

  function favoriteImage() {
    window.electronAPI.favoriteImage();
  }

  function openDirectory() {
    window.electronAPI.openDirectory();
  }




//   function displayTimeWarning() {
//     setTimeout(() => {
//         console.log("3 sec left");
//       }, (INTERVAL_IN_SECONDS * 1000) - 3000);
//   }

  function toggleInterval() {
    console.log('toggle interval')
    if (timerStatus == "stopped") {
        startInterval();
    } else {
        stopInterval();
    }
  }

  function startInterval() {
    console.log('start interval')
    if (!nIntervId) {
    //   document.getElementById("status").innerText="Running!"
    //   warningInterval = setInterval(() => displayTimeWarning(), (INTERVAL_IN_SECONDS * 1000)- 3000)
    document.getElementById("toggleInterval").src="assets/icons/stop.svg";
    timerStatus = "running";

      nIntervId= setInterval(() => newRandomImage(), INTERVAL_IN_SECONDS * 1000)
    }
  }

  function stopInterval(e) {
    clearInterval(nIntervId);
    clearInterval(warningInterval);
    nIntervId = null;
    warningInterval = null;
    document.getElementById("toggleInterval").src="assets/icons/play.svg";
    timerStatus="stopped";
    e.preventDefault();
  }


  document.getElementById("toggleInterval").addEventListener("click", toggleInterval);
  document.getElementById("nextImage").addEventListener("click", newRandomImage);
  document.getElementById("prevImage").addEventListener("click", getPrevImage);
  document.getElementById("favoriteImage").addEventListener("click", favoriteImage);
  document.getElementById("openDirectory").addEventListener("click", openDirectory);
  document.getElementById("setInterval").addEventListener("click",   async() => {
    console.log('open interval prompt')
    const interval = await window.electronAPI.setInterval();
    if (interval == undefined) {
      console.log('return early')
      return;
    }
    console.log('get here')
    INTERVAL_IN_SECONDS=interval;
    stopInterval();
    // startInterval();
  });



  window.addEventListener("keydown", myEventHandler, false);