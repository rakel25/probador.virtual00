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

  const shoulderY = ((ls.y + rs.y) / 2) * overlayCanvas.height;
  const hipY = ((lh.y + rh.y) / 2) * overlayCanvas.height;

  const shoulderWidth = Math.abs(ls.x - rs.x) * overlayCanvas.width;
  const torsoHeight = hipY - shoulderY;

  const imgWidth = shoulderWidth * 1.8;
  const imgHeight = torsoHeight * 1.8;

  // Corrección para evitar que tape la cara en cámara frontal
  let drawY = shoulderY;

  if (usingFrontCamera) {
    drawY += imgHeight * 0.25; // Bajar la prenda en cámara frontal
  } else {
    drawY -= imgHeight * 0.3; // Dejar como estaba antes en trasera
  }

  overlayCtx.drawImage(
    clothingImg,
    centerX - imgWidth / 2,
    drawY,
    imgWidth,
    imgHeight
  );
}

