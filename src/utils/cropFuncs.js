function scaleCropBoxToOriginalImage(imageTransforms) {
  const it = imageTransforms;
  // var scaleRatio = it.finalImageWidth / it.origImageWidth;
  var scaleRatio = it.origImageWidth / it.finalImageWidth;
  var scaledCropboxWidth = it.cropboxWidth * scaleRatio;
  var scaledCropboxHeight = it.cropboxHeight * scaleRatio;
  var scaledCropboxX = it.cropboxX * scaleRatio;
  var scaledCropboxY = it.cropboxY * scaleRatio;
  return {
    x: scaledCropboxX,
    y: scaledCropboxY,
    width: scaledCropboxWidth,
    height: scaledCropboxHeight
  };
}

function getCropCoordsOnOrigninalImage(imageTransforms) {
  var it = imageTransforms;
  if (it.cropInBounds().boxInImage) {
    var simpleRotation = ["0", "90", "180", "270", "360"].includes(
      it.rotation.toString()
    );
    if (simpleRotation) {
      var scaled = scaleCropBoxToOriginalImage(imageTransforms);
      return scaled;
    } else {
      console.error(
        "not simple rotation, getOrigCropCoords calculation not accurate"
      );
      return { comment: "not simple rotation" };
    }
  } else {
    console.error(
      "cropbox no in bounds of image, getOrigCropCoords calculation not accurate"
    );
    return { comment: "cropbox is out of bounds" };
  }
}

module.exports.getOrigCropCoords = getCropCoordsOnOrigninalImage;
