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

  // Ajuste diferente si se usa cámara frontal
  let offsetY;
  if (usingFrontCamera) {
    offsetY = imgHeight * 0.25; // Baja la imagen para no tapar la cara
  } else {
    offsetY = imgHeight / 3; // Mantiene como estaba
  }

  overlayCtx.drawImage(
    clothingImg,
    centerX - imgWidth / 2,
    centerY - offsetY,
    imgWidth,
    imgHeight
  );
}
