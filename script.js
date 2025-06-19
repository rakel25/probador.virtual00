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

  if (clothingImg.complete && clothingImg.naturalWidth !== 0) {
    const screenWidth = overlayCanvas.width;
    const screenHeight = overlayCanvas.height;

    // Usa landmarks para calcular la altura del torso
    const leftShoulder = results.poseLandmarks[11];
    const rightShoulder = results.poseLandmarks[12];
    const leftHip = results.poseLandmarks[23];
    const rightHip = results.poseLandmarks[24];

    // Promedio en pantalla de hombros y caderas
    const shoulderY = (leftShoulder.y + rightShoulder.y) / 2;
    const hipY = (leftHip.y + rightHip.y) / 2;

    // Altura del torso en coordenadas relativas (0 a 1)
    let torsoHeightRel = hipY - shoulderY;

    // Aumentamos la altura un 50% para que sea más grande
    torsoHeightRel *= 5;

    // Convertir a píxeles
    const torsoHeightPx = torsoHeightRel * screenHeight;

    // Calculamos el ancho manteniendo proporción de la imagen
    const imgWidth = torsoHeightPx * (clothingImg.naturalWidth / clothingImg.naturalHeight);

    // Posición X centrada
    const posX = (screenWidth - imgWidth) / 2;

    // Posición Y basada en el hombro (subiendo un poco para que no quede muy abajo)
    const posY = shoulderY * screenHeight - torsoHeightPx * 0.1;

    overlayCtx.drawImage(clothingImg, posX, posY, imgWidth, torsoHeightPx);
  }
}


// Inicializa prenda y nombre
updatePrenda();
