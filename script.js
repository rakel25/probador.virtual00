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

  const offsetY = 0.05 * h; // pequeño desplazamiento hacia abajo para que no tape el cuello

  // 👇 Esta es la única parte modificada: ajustamos Y para que empiece justo bajo el cuello
  overlayCtx.drawImage(
    clothingImg,
    centerX - imgWidth / 2,
    neckY + offsetY,
    imgWidth,
    imgHeight
  );
}
