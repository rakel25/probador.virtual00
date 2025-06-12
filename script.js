function onResults(results) {
  videoCtx.clearRect(0, 0, videoCanvas.width, videoCanvas.height);
  videoCtx.drawImage(results.image, 0, 0, videoCanvas.width, videoCanvas.height);

  overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

  if (!results.poseLandmarks) return;

  const ls = results.poseLandmarks[11]; // hombro izquierdo
  const rs = results.poseLandmarks[12]; // hombro derecho
  const lh = results.poseLandmarks[23]; // cadera izquierda
  const rh = results.poseLandmarks[24]; // cadera derecha
  const nose = results.poseLandmarks[0]; // nariz (para cámara frontal)

  const centerX = (ls.x + rs.x) / 2 * overlayCanvas.width;
  const shouldersY = ((ls.y + rs.y) / 2) * overlayCanvas.height;
  const hipsY = ((lh.y + rh.y) / 2) * overlayCanvas.height;
  const shoulderWidth = Math.abs(ls.x - rs.x) * overlayCanvas.width;
  const torsoHeight = hipsY - shouldersY;

  let imgWidth, imgHeight, drawX, drawY;

  if (usingFrontCamera) {
    // Ajuste para cámara frontal: más bajo para no tapar cara
    imgWidth = shoulderWidth * 1.8;
    imgHeight = torsoHeight * 1.8;

    // Desplazar hacia abajo para no tapar la cara
    const cuelloY = nose.y * overlayCanvas.height + 30; // 30 píxeles debajo de nariz aprox

    drawX = centerX - imgWidth / 2;
    drawY = cuelloY;

  } else {
    // Cámara trasera: mantenemos como estaba
    imgWidth = shoulderWidth * 1.8;
    imgHeight = torsoHeight * 1.8;
    drawX = centerX - imgWidth / 2;
    drawY = shouldersY - imgHeight / 3;
  }

  overlayCtx.drawImage(clothingImg, drawX, drawY, imgWidth, imgHeight);
}
