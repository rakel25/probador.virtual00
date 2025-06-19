const splash = document.getElementById("splash-screen");
const enterBtn = document.getElementById("enter-btn");
const fittingRoom = document.getElementById("fitting-room");

const video = document.getElementById("video");
const videoCanvas = document.getElementById("video-canvas");
const overlayCanvas = document.getElementById("overlay-canvas");
const videoCtx = videoCanvas.getContext("2d");
const overlayCtx = overlayCanvas.getContext("2d");

const clothingName = document.getElementById("clothing-name");

const prendas = [
  { name: "Jacket 1", file: "jacket1.png" },
  { name: "Moria 1", file: "moria1.png" },
  { name: "Nusa 1", file: "nusa1.png" },
  { name: "Peixe 1", file: "peixe1.png" }
];

let currentIndex = 0;
let currentStream = null;
let cameraInstance = null;

// Eliminar toggleCameraBtn y uso solo cámara frontal

function updatePrenda() {
  const item = prendas[currentIndex];
  clothingName.textContent = item.name;
  clothingImg.src = item.file;  // <-- Cambiar aquí para imágenes en la raíz
}

// Imagen oculta para usar en canvas overlay
const clothingImg = new Image();
clothingImg.src = prendas[0].file;

// Navegación prendas
document.getElementById("prev-btn").onclick = () => {
  currentIndex = (currentIndex - 1 + prendas.length) % prendas.length;
  updatePrenda();
};

document.getElementById("next-btn").onclick = () => {
  currentIndex = (currentIndex + 1) % prendas.length;
  updatePrenda();
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
window.addEventListener('resize', resizeCanvases);

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
      facingMode: "user"  // Solo cámara frontal
    }
  };

  const camera = new Camera(video, {
    onFrame: async () => {
      await pose.send({ image: video });
    },
    width: 640,
    height: 480,
    facingMode: "user"
  });

  if(currentStream){
    currentStream.getTracks().forEach(track => track.stop());
  }
  currentStream = camera;
  cameraInstance = camera;
  camera.start();
}

function onResults(results) {
  videoCtx.clearRect(0, 0, videoCanvas.width, videoCanvas.height);
  videoCtx.save();
  // Espejo para cámara frontal
  videoCtx.scale(-1, 1);
  videoCtx.translate(-videoCanvas.width, 0);
  videoCtx.drawImage(results.image, 0, 0, videoCanvas.width, videoCanvas.height);
  videoCtx.restore();

  overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

  if (!results.poseLandmarks) return;

  const ls = results.poseLandmarks[11];
  const rs = results.poseLandmarks[12];
  const lh = results.poseLandmarks[23];
  const rh = results.poseLandmarks[24];

   // Calculamos posición y tamaño de la prenda
  const centerX = overlayCanvas.width / 2;
  const isFrontCamera = true; // Siempre frontal en tu caso

  let imgWidth, imgHeight, posX, posY;

  if (isFrontCamera) {
    // Posicionar en la parte inferior centrada
    const screenHeight = overlayCanvas.height;
    const screenWidth = overlayCanvas.width;
    const baseHeight = screenHeight * 0.35;

    imgHeight = baseHeight;
    imgWidth = baseHeight * (clothingImg.width / clothingImg.height);
    posX = (screenWidth - imgWidth) / 2;
    posY = screenHeight - imgHeight - 40; // 40px de margen inferior
  } else {
    // (No se usa, pero mantenido por claridad)
    const shoulderY = (ls.y + rs.y) / 2 * overlayCanvas.height;
    const torsoHeight = (lh.y + rh.y) / 2 * overlayCanvas.height - shoulderY;
    const shoulderWidth = Math.abs(ls.x - rs.x) * overlayCanvas.width;

    imgWidth = shoulderWidth * 1.8;
    imgHeight = torsoHeight * 1.8;
    posX = centerX - imgWidth / 2;
    posY = shoulderY;
  }

  overlayCtx.drawImage(clothingImg, posX, posY, imgWidth, imgHeight);


// Inicializa prenda y nombre
updatePrenda();
