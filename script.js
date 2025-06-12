const splash = document.getElementById("splash-screen");
const enterBtn = document.getElementById("enter-btn");
const fittingRoom = document.getElementById("fitting-room");

const video = document.getElementById("video");
const videoCanvas = document.getElementById("video-canvas");
const overlayCanvas = document.getElementById("overlay-canvas");
const videoCtx = videoCanvas.getContext("2d");
const overlayCtx = overlayCanvas.getContext("2d");

const clothingImg = document.getElementById("clothing-img");
const clothingName = document.getElementById("clothing-name");

const prendas = [
  { name: "Jacket 1", file: "jacket1.png" },
  { name: "Moria 1", file: "moria1.png" },
  { name: "Nusa 1", file: "nusa1.png" },
  { name: "Peixe 1", file: "peixe1.png" }
];

let currentIndex = 0;

function updatePrenda() {
  const item = prendas[currentIndex];
  clothingImg.src = `clothes/${item.file}`;
  clothingName.textContent = item.name;
}

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

  const camera = new Camera(video, {
    onFrame: async () => {
      await pose.send({ image: video });
    },
    width: 640,
    height: 480
  });

  camera.start();
}

function onResults(results) {
  videoCtx.clearRect(0, 0, videoCanvas.width, videoCanvas.height);
  videoCtx.drawImage(results.image, 0, 0, videoCanvas.width, videoCanvas.height);

  overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

  if (!results.poseLandmarks) return;

  const ls = results.poseLandmarks[11];
  const rs = results.poseLandmarks[12];
  const lh = results.poseLandmarks[23];
  const rh = results.poseLandmarks[24];

  const centerX = (ls.x + rs.x) / 2 * overlayCanvas.width;
  const centerY = (ls.y + rs.y) / 2 * overlayCanvas.height;
  const shoulderWidth = Math.abs(ls.x - rs.x) * overlayCanvas.width;
  const torsoHeight = Math.abs(((lh.y + rh.y) / 2 - (ls.y + rs.y) / 2)) * overlayCanvas.height;

  const imgWidth = shoulderWidth * 1.8;
  const imgHeight = torsoHeight * 1.8;

  overlayCtx.drawImage(
    clothingImg,
    centerX - imgWidth / 2,
    centerY - imgHeight / 3,
    imgWidth,
    imgHeight
  );
}

updatePrenda(); // Inicializa
