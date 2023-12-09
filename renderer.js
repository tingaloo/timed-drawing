

const INTERVAL_IN_SECONDS = 3
let nIntervId;
let warningInterval;


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

    //   case 37:
    //     prevImage();
    //     break;
    //   case 39:
    //     nextImage();
    //     break;
      case 114:
        // r
        window.electronAPI.getNewRandomImage();
        break;
      default:
        
    }
  }

  function intervalHandler() {
    window.electronAPI.getNewRandomImage()
  }

//   function displayTimeWarning() {
//     setTimeout(() => {
//         console.log("3 sec left");
//       }, (INTERVAL_IN_SECONDS * 1000) - 3000);
//   }

  function startInterval() {
    if (!nIntervId) {
      document.getElementById("status").innerText="Running!"
    //   warningInterval = setInterval(() => displayTimeWarning(), (INTERVAL_IN_SECONDS * 1000)- 3000)
      nIntervId= setInterval(() => intervalHandler(), INTERVAL_IN_SECONDS * 1000)
    }
  }

  function myStopFunction(e) {
    clearInterval(nIntervId);
    clearInterval(warningInterval);
    nIntervId = null;
    warningInterval = null;
    document.getElementById("status").innerText="Stopped"
    e.preventDefault();
  }


  document.getElementById("stopButton").addEventListener("click", myStopFunction);
  document.getElementById("startButton").addEventListener("click", startInterval);
  window.addEventListener("keypress", myEventHandler, false);
  window.addEventListener("keydown", myEventHandler, false);