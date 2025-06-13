const splash = document.getElementById("splash-screen");
const enterBtn = document.getElementById("enter-btn");
const fittingRoom = document.getElementById("fitting-room");

const video = document.getElementById("video");
const videoCanvas = document.getElementById("video-canvas");
const overlayCanvas = document.getElementById("overlay-canvas");
const videoCtx = videoCanvas.getContext("2d");
const overlayCtx = overlayCanvas.getContext("2d");

const clothingName = document.getElementById("clothing-name");

const toggleCameraBtn = document.getElementById("toggle-camera-btn");

const prendas = [
  { name: "Jacket 1", file: "jacket1.png" },
  { name: "Moria 1", file: "moria1.png" },
  { name: "Nusa 1", file: "nusa1.png" },
  { name: "Peixe 1", file: "peixe1.png" }
];

let currentIndex = 0;
let currentStream = null;
let usingFrontCamera = true;
let cameraInstance = null;

function updatePrenda() {
  const item = prendas[currentIndex];
  clothingName.textContent = item.name;
  clothingImg.src = `clothes/${item.file}`;
}

// Imagen oculta para usar en canvas overlay
const clothingImg = new Image();
clothingImg.src = `clothes/${prendas[0].file}`;

// Navegación prendas
document.getElementById("prev-btn").onclick = () => {
  currentIndex = (currentIndex - 1 + prendas.length) % prendas.length;
  updatePrenda();
};

document.getElementById("next-btn").onclick = () => {
  currentIndex = (currentIndex + 1) % prendas.length;
  updatePrenda();
};

// Cambiar cámara (frontal / trasera)
toggleCameraBtn.onclick = () => {
  usingFrontCamera = !usingFrontCamera;
  if (cameraInstance) {
    cameraInstance.stop();
    startPose();
  }
};

enterBtn.onclick = () => {
  splash.style.display = "none";
  fittingRoom.style.display = "block";
  startPose();
};

function resizeCanvases() {
  videoCanvas.width = window.innerWidth;
  videoCanvas.height = window.innerHeight;
  overlayCanvas.width = window.innerWidth;
  overlayCanvas.height = window.innerHeight;
}
resizeCanvases();
window.addEventListener("resize", resizeCanvases);

function startPose() {
  const pose = new Pose({
    locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
  });

  pose.setOptions({
    modelComplexity: 1,
    smoothLandmarks: true,
    enableSegmentation: false,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
  });

  pose.onResults(onResults);

  let constraints = {
    audio: false,
    video: {
      width: 640,
      height: 480,
      facingMode: usingFrontCamera ? "user" : "environment"
    }
  };

  const camera = new Camera(video, {
    onFrame: async () => {
      await pose.send({ image: video });
    },
    width: 640,
    height: 480,
    facingMode: constraints.video.facingMode
  });

  if (currentStream) {
    currentStream.getTracks().forEach(track => track.stop());
  }
  currentStream = camera;
  cameraInstance = camera;
  camera.start();
}

function onResults(results) {
  videoCtx.clearRect(0, 0, videoCanvas.width, videoCanvas.height);
  videoCtx.drawImage(results.image, 0, 0, videoCanvas.width, videoCanvas.height);

  overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

  if (!results.poseLandmarks) return;

  const ls = results.poseLandmarks[11]; // hombro izquierdo
  const rs = results.poseLandmarks[12]; // hombro derecho
  const lh = results.poseLandmarks[23]; // cadera izquierda
  const rh = results.poseLandmarks[24]; // cadera derecha

  const centerX = (ls.x + rs.x) / 2 * overlayCanvas.width;
  const centerY = (ls.y + rs.y) / 2 * overlayCanvas.height;
  const shoulderWidth = Math.abs(ls.x - rs.x) * overlayCanvas.width;
  const torsoHeight = Math.abs(((lh.y + rh.y) / 2 - (ls.y + rs.y) / 2)) * overlayCanvas.height;

  const imgWidth = shoulderWidth * 1.8;
  const imgHeight = torsoHeight * 1.8;

  // Ajuste según cámara frontal o trasera
  let offsetY;
  if (usingFrontCamera) {
    // En cámara frontal, bajar más la prenda para que no tape la cara
    offsetY = imgHeight * 0.2; // Mueve la imagen hacia abajo desde el centro de los hombros
  } else {
    // En trasera, mantener como estaba
    offsetY = imgHeight / 3;
  }

  overlayCtx.drawImage(
    clothingImg,
    centerX - imgWidth / 2,
    centerY - offsetY,
    imgWidth,
    imgHeight
  );
}

// Inicializa prenda y nombre
updatePrenda();
