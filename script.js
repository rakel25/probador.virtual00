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

  const shoulderY = ((ls.y + rs.y) / 2) * overlayCanvas.height;
  const hipY = ((lh.y + rh.y) / 2) * overlayCanvas.height;

  const shoulderWidth = Math.abs(ls.x - rs.x) * overlayCanvas.width;
  const torsoHeight = hipY - shoulderY;

  const imgWidth = shoulderWidth * 1.8;
  const imgHeight = torsoHeight * 1.8;

  let drawY;

  if (usingFrontCamera) {
    // 🟢 Frontal: divide pantalla. Dibuja prenda en mitad inferior
    const midScreen = overlayCanvas.height / 2;
    drawY = midScreen; // empezar desde mitad hacia abajo
  } else {
    // 🟡 Trasera: mantenemos como estaba
    drawY = shoulderY - imgHeight * 0.3;
  }

  overlayCtx.drawImage(
    clothingImg,
    centerX - imgWidth / 2,
    drawY,
    imgWidth,
    imgHeight
  );
}
