function onResults(results) {
  videoCtx.clearRect(0, 0, videoCanvas.width, videoCanvas.height);
  videoCtx.drawImage(results.image, 0, 0, videoCanvas.width, videoCanvas.height);

  overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

  if (!results.poseLandmarks) return;

  const ls = results.poseLandmarks[11]; // hombro izq
  const rs = results.poseLandmarks[12]; // hombro der
  const lh = results.poseLandmarks[23]; // cadera izq
  const rh = results.poseLandmarks[24]; // cadera der

  const centerX = (ls.x + rs.x) / 2 * overlayCanvas.width;
  const shoulderWidth = Math.abs(ls.x - rs.x) * overlayCanvas.width;
  const torsoHeight = Math.abs(((lh.y + rh.y) / 2 - (ls.y + rs.y) / 2)) * overlayCanvas.height;

  const imgWidth = shoulderWidth * 1.8;
  const imgHeight = torsoHeight * 2;

  let drawX = centerX - imgWidth / 2;
  let drawY;

  if (usingFrontCamera) {
    // 📌 Fuerza la imagen en la parte inferior del canvas
    drawY = overlayCanvas.height * 0.5; // zona debajo de la cara
  } else {
    // Cámara trasera normal
    const shoulderY = ((ls.y + rs.y) / 2) * overlayCanvas.height;
    drawY = shoulderY - imgHeight * 0.3;
  }

  overlayCtx.drawImage(clothingImg, drawX, drawY, imgWidth, imgHeight);
}
