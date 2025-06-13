function onResults(results) {
  videoCtx.clearRect(0, 0, videoCanvas.width, videoCanvas.height);
  videoCtx.drawImage(results.image, 0, 0, videoCanvas.width, videoCanvas.height);

  overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

  if (!results.poseLandmarks) return;

  const ls = results.poseLandmarks[11]; // Hombro izq
  const rs = results.poseLandmarks[12]; // Hombro der
  const lh = results.poseLandmarks[23]; // Cadera izq
  const rh = results.poseLandmarks[24]; // Cadera der

  const centerX = (ls.x + rs.x) / 2 * overlayCanvas.width;

  const shoulderY = ((ls.y + rs.y) / 2) * overlayCanvas.height;
  const hipY = ((lh.y + rh.y) / 2) * overlayCanvas.height;

  const shoulderWidth = Math.abs(ls.x - rs.x) * overlayCanvas.width;
  const torsoHeight = hipY - shoulderY;

  const imgWidth = shoulderWidth * 1.8;
  const imgHeight = torsoHeight * 1.8;

  // Default: prenda empieza justo encima del pecho
  let drawY = shoulderY - imgHeight * 0.3;

  // En cámara frontal, bajamos más aún la imagen para evitar la cara
  if (usingFrontCamera) {
    drawY = shoulderY + imgHeight * 0.1; // 🔥 BAJAMOS MÁS
  }

  const drawX = centerX - imgWidth / 2;

  overlayCtx.drawImage(clothingImg, drawX, drawY, imgWidth, imgHeight);
}
