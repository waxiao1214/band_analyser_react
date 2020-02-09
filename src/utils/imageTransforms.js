//scrap imageTransforms, go to unscaledCanvas.js
//make this an object. have init function inside of it.
//contain all calculations on this object.
//function displayCroppedImageURL (in center of same-sized canvas)
//

function initImageTransforms(img, dx, dy, fitWidth, fitHeight, canvas) {
  debugger;
  return {
    origImageWidth: img.width,
    origImageHeight: img.height,
    finalImageLeftXPos: dx,
    finalImageLeftYPos: dy,
    finalImageWidth: fitWidth,
    finalImageHeight: fitHeight,
    canvasWidth: canvas.width,
    canvasHeight: canvas.height,
    rotation: 0,
    cropboxX: null,
    cropboxY: null,
    cropboxWidth: null,
    cropboxHeight: null,
    crop: false,
    cropInBounds: function() {
      var boxWidthOffset_left = this.cropboxX - this.finalImageLeftXPos;
      var boxWidthOffset_right =
        -1 *
        (this.cropboxX +
          this.cropboxWidth -
          (this.finalImageLeftXPos + this.finalImageWidth));
      var boxHeightOffset_top = this.cropboxY - this.finalImageLeftYPos;
      var boxHeightOffset_bottom =
        -1 *
        (this.cropboxY +
          this.cropboxHeight -
          (this.finalImageLeftYPos + this.finalImageHeight));
      var boxInImage =
        boxWidthOffset_left >= 0 &&
        boxWidthOffset_right >= 0 &&
        boxHeightOffset_top >= 0 &&
        boxHeightOffset_bottom >= 0
          ? true
          : false;
      return {
        boxWidthOffset_left,
        boxWidthOffset_right,
        boxHeightOffset_top,
        boxHeightOffset_bottom,
        boxInImage,
        comment: "negative number = num pixels the cropbox extends beyond image"
      };
    },
    scaleCropBoxToOriginalImage: function() {
      // var scaleRatio = it.finalImageWidth / it.origImageWidth;
      var scaleRatio = this.origImageWidth / this.finalImageWidth;
      var scaledCropboxWidth = this.cropboxWidth * scaleRatio;
      var scaledCropboxHeight = this.cropboxHeight * scaleRatio;
      var scaledCropboxX = this.cropboxX * scaleRatio;
      var scaledCropboxY = this.cropboxY * scaleRatio;
      return {
        x: scaledCropboxX,
        y: scaledCropboxY,
        width: scaledCropboxWidth,
        height: scaledCropboxHeight
      };
    }
  };
}

module.exports.initImageTransforms = initImageTransforms;
