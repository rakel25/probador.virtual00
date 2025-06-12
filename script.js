function onResults(results) {
  videoCtx.clearRect(0, 0, videoCanvas.width, videoCanvas.height);
  videoCtx.drawImage(results.image, 0, 0, videoCanvas.width, videoCanvas.height);
  overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

  if (!results.poseLandmarks) return;

  const landmarks = results.poseLandmarks;

  const leftShoulder = landmarks[11];
  const rightShoulder = landmarks[12];
  const leftHip = landmarks[23];
  const rightHip = landmarks[24];

  const centerX = ((leftShoulder.x + rightShoulder.x) / 2) * overlayCanvas.width;
  const shouldersY = ((leftShoulder.y + rightShoulder.y) / 2) * overlayCanvas.height;
  const hipsY = ((leftHip.y + rightHip.y) / 2) * overlayCanvas.height;

  const shoulderWidth = Math.abs(leftShoulder.x - rightShoulder.x) * overlayCanvas.width;
  const torsoHeight = Math.abs(hipsY - shouldersY);

  const imgWidth = shoulderWidth * 1.8;
  const imgHeight = torsoHeight * 1.8;

  let drawY;

  if (usingFrontCamera) {
    // En cámara frontal: ajustar para que empiece justo debajo de la barbilla
    const neckY = landmarks[0].y * overlayCanvas.height + 40; // Punto de la nariz + desplazamiento
    drawY = neckY;
  } else {
    // En cámara trasera: mantener como estaba
    drawY = shouldersY - imgHeight / 3;
  }

  overlayCtx.drawImage(
    clothingImg,
    centerX - imgWidth / 2,
    drawY,
    imgWidth,
    imgHeight
  );
}
