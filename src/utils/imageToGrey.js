function imageDataToGrey(coloredImageData, emptyImageData) {
  var d = coloredImageData.data;
  var imgData = emptyImageData;
  for (var i = 0; i < d.length; i += 4) {
    if (
      d[i] === 0 &&
      d[i + 1] === 0 &&
      d[i + 2] === 0 &&
      d[i + 3] === 0 &&
      d[i + 4] === 0
    ) {
      //if it is transparent black, make it opaque white
      imgData.data[i] = 255;
      imgData.data[i + 1] = 255;
      imgData.data[i + 2] = 255;
      imgData.data[i + 3] = 255;
    } else if (d[i] === d[i + 1] && d[i + 1] === d[i + 2]) {
      //if there is grey image, keep it
      imgData.data[i] = d[i];
      imgData.data[i + 1] = d[i];
      imgData.data[i + 2] = d[i];
      imgData.data[i + 3] = 255;
    } else {
      //if not grey, make grey
      var greyPixValue = 0.16 * d[i] + 0.34 * d[i + 1] + 0.5 * d[i + 2];
      imgData.data[i] = imgData.data[i + 1] = imgData.data[
        i + 2
      ] = greyPixValue;
      imgData.data[i + 3] = 255;
    }
  }
  return imgData;
}

function imageURLToGrey(img, canvas) {
  var canvasOrigWidth = canvas.width;
  var canvasOrigHeight = canvas.height;
  const ctx = canvas.getContext("2d");
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
  const coloredImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  var forGreyImageData = ctx.createImageData(coloredImageData);
  const fullSizedGreyImageData = imageDataToGrey(
    coloredImageData,
    forGreyImageData
  );
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.putImageData(fullSizedGreyImageData, 0, 0);
  const greyFullImageURL = canvas.toDataURL();
  return greyFullImageURL;
}

module.exports.imageDataToGrey = imageDataToGrey;
module.exports.imageURLToGrey = imageURLToGrey;
