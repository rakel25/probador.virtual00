function onResults(results) {
  overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

  if (!results.poseLandmarks) return;

  // Coordenadas claves de los landmarks
  const ls = results.poseLandmarks[11]; // hombro izquierdo
  const rs = results.poseLandmarks[12]; // hombro derecho
  const lh = results.poseLandmarks[23]; // cadera izquierda
  const rh = results.poseLandmarks[24]; // cadera derecha
  const nose = results.poseLandmarks[0]; // nariz, para la cara

  // Dimensiones canvas
  const w = overlayCanvas.width;
  const h = overlayCanvas.height;

  if(usingFrontCamera) {
    // --- Parte superior: dibujar solo la cara ---
    // Definimos rectángulo cara (por ejemplo, del centro nariz hacia arriba y algo de ancho)
    const faceCenterX = nose.x * w;
    const faceCenterY = nose.y * h;
    const faceWidth = (Math.abs(ls.x - rs.x) * w) * 1.2;
    const faceHeight = faceWidth * 1.2;

    // Calculamos el área del video a recortar (cara)
    const sx = Math.max(0, faceCenterX - faceWidth / 2);
    const sy = Math.max(0, faceCenterY - faceHeight * 0.8); // un poco más arriba para cubrir frente
    const sWidth = Math.min(w - sx, faceWidth);
    const sHeight = Math.min(h - sy, faceHeight);

    // Dibujamos solo la cara recortada en la parte superior del canvas
    overlayCtx.drawImage(
      results.image,
      sx, sy, sWidth, sHeight, // parte origen del video
      0, 0, w, h / 2 // parte destino canvas (mitad superior)
    );

    // --- Parte inferior: dibujar la prenda ---
    const centerX = ((ls.x + rs.x) / 2) * w;
    const neckY = ((ls.y + rs.y) / 2) * h;
    const torsoHeight = (((lh.y + rh.y) / 2) - ((ls.y + rs.y) / 2)) * h;
    const shoulderWidth = Math.abs(ls.x - rs.x) * w;

    const imgWidth = shoulderWidth * 1.8;
    const imgHeight = torsoHeight * 1.8;

    // Dibujamos la prenda en la mitad inferior del canvas (desde mitad canvas hacia abajo)
    // Ajustamos la Y para que esté dentro de la mitad inferior
    const destX = centerX - imgWidth / 2;
    const destY = h / 2 + (neckY - h / 2);

    overlayCtx.drawImage(
      clothingImg,
      destX,
      destY,
      imgWidth,
      imgHeight
    );

  } else {
    // Cámara trasera: pantalla completa, prenda normal
    videoCtx.clearRect(0, 0, videoCanvas.width, videoCanvas.height);
    videoCtx.drawImage(results.image, 0, 0, videoCanvas.width, videoCanvas.height);

    const centerX = ((ls.x + rs.x) / 2) * w;
    const neckY = ((ls.y + rs.y) / 2) * h;
    const torsoHeight = (((lh.y + rh.y) / 2) - ((ls.y + rs.y) / 2)) * h;
    const shoulderWidth = Math.abs(ls.x - rs.x) * w;

    const imgWidth = shoulderWidth * 1.8;
    const imgHeight = torsoHeight * 1.8;

    overlayCtx.drawImage(
      clothingImg,
      centerX - imgWidth / 2,
      neckY - imgHeight / 3,
      imgWidth,
      imgHeight
    );
  }
}
