function onResults(results) {
  videoCtx.clearRect(0, 0, videoCanvas.width, videoCanvas.height);
  videoCtx.drawImage(results.image, 0, 0, videoCanvas.width, videoCanvas.height);

  overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

  if (!results.poseLandmarks) return;

  const ls = results.poseLandmarks[11]; // hombro izquierdo
  const rs = results.poseLandmarks[12]; // hombro derecho
  const lh = results.poseLandmarks[23]; // cadera izquierda
  const rh = results.poseLandmarks[24]; // cadera derecha

  const w = overlayCanvas.width;
  const h = overlayCanvas.height;

  const centerX = ((ls.x + rs.x) / 2) * w;
  const neckY = ((ls.y + rs.y) / 2) * h;
  const shoulderWidth = Math.abs(ls.x - rs.x) * w;
  const torsoHeight = (((lh.y + rh.y) / 2) - ((ls.y + rs.y) / 2)) * h;

  const imgWidth = shoulderWidth * 1.8;
  const imgHeight = torsoHeight * 1.8;

  // Ajustamos la posición según el tipo de cámara
  let yPosition;
  if (usingFrontCamera) {
    // Cámara frontal: bajamos un poco la prenda para que empiece bajo el cuello
    yPosition = neckY + 0.05 * h; 
  } else {
    // Cámara trasera: mantenemos como estaba antes
    yPosition = neckY - imgHeight / 3;
  }

  overlayCtx.drawImage(
    clothingImg,
    centerX - imgWidth / 2,
    yPosition,
    imgWidth,
    imgHeight
  );
}
