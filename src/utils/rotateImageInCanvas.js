function rotateImageInCanvas(
  img,
  rotationArray,
  canvasRef,
  timeInterval,
  resolve
) {
  if (rotationArray === undefined) {
    console.error("rotationArray is undefined", rotationArray);
    return;
  }
  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");
  var i = 0;
  var rotationAnimation = setInterval(() => {
    i++;
    if (i === rotationArray.length - 1) {
      clearInterval(rotationAnimation);
      resolve("done rotating");
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotationArray[i].rotIncEase * Math.PI) / 180);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
    ctx.drawImage(img, 0, 0);
  }, timeInterval);
}

export default rotateImageInCanvas;
