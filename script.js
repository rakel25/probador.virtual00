function onResults(results) {
  videoCtx.clearRect(0, 0, videoCanvas.width, videoCanvas.height);
  videoCtx.drawImage(results.image, 0, 0, videoCanvas.width, videoCanvas.height);

  overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

  if (!results.poseLandmarks) return;

  const ls = results.poseLandmarks[11]; // hombro izquierdo
  const rs = results.poseLandmarks[12]; // hombro derecho
  const lh = results.poseLandmarks[23]; // cadera izquierda
  const rh = results.poseLandmarks[24]; // cadera derecha
  const nose = results.poseLandmarks[0]; // nariz

  const centerX = (ls.x + rs.x) / 2 * overlayCanvas.width;
  const shoulderY = ((ls.y + rs.y) / 2) * overlayCanvas.height;
  const hipsY = ((lh.y + rh.y) / 2) * overlayCanvas.height;
  const shoulderWidth = Math.abs(ls.x - rs.x) * overlayCanvas.width;
  const torsoHeight = hipsY - shoulderY;

  let imgWidth = shoulderWidth * 1.8;
  let imgHeight = torsoHeight * 1.8;
  let drawX = centerX - imgWidth / 2;
  let drawY;

  if (usingFrontCamera) {
    // Mover la imagen más abajo para no tapar la cara (empieza desde el cuello)
    const cuelloY = (ls.y + rs.y) / 2 * overlayCanvas.height + 20; // ajustar este valor si hace falta
    drawY = cuelloY;
  } else {
    // Cámara trasera: mantener como ya estaba
    drawY = shoulderY - imgHeight / 3;
  }

  overlayCtx.drawImage(clothingImg, drawX, drawY, imgWidth, imgHeight);
}
