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
  const shoulderWidth = Math.abs(ls.x - rs.x) * overlayCanvas.width;
  const torsoHeight = Math.abs(((lh.y + rh.y) / 2 - (ls.y + rs.y) / 2)) * overlayCanvas.height;

  const imgWidth = shoulderWidth * 1.8;
  const imgHeight = torsoHeight * 2;

  let drawX = centerX - imgWidth / 2;
  let drawY;

  if (usingFrontCamera) {
    // 🎯 Posición fija para evitar tapar cara
    drawY = overlayCanvas.height * 2.55; // más abajo de la mitad
  } else {
    const shoulderY = ((ls.y + rs.y) / 2) * overlayCanvas.height;
    drawY = shoulderY - imgHeight * 0.3;
  }

  overlayCtx.drawImage(clothingImg, drawX, drawY, imgWidth, imgHeight);
}
