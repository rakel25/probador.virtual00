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
  let centerY = (ls.y + rs.y) / 2 * overlayCanvas.height;
  const shoulderWidth = Math.abs(ls.x - rs.x) * overlayCanvas.width;
  const torsoHeight = Math.abs(((lh.y + rh.y) / 2 - (ls.y + rs.y) / 2)) * overlayCanvas.height;

  // 🔧 Ajustar prenda solo en cámara frontal
  if (usingFrontCamera) {
    centerY += 40; // Ajusta este valor si quieres moverlo más o menos
  }

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
