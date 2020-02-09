//sd = scaled drawing
//ud = unscaled drawing (but really it is non-scaled drawing, couud be bigger or smaller)
//ui = unscaled image
//purpose of unscaledCropCanvas is to model user-image manipulations on a true-sized image
//this way when a user crops a small area of image, the corresponding image can be extracted from original size
//similar idea will be used for data analysis= no matter how big the screen or zoom on displayed scaled image, the data will be from unscaled image and thus the same all the time.

class unscaledCropCanvas {
  constructor(unscaledCanvasFunction) {
    this.getUnscaledCanvas = unscaledCanvasFunction;
  }

  init(
    unscaledImage,
    unscaledImageWidth,
    unscaledImageHeight,
    dx,
    dy,
    width,
    height,
    scCanvasW,
    scCanvasH
  ) {
    this.rotation = 0;
    if (!this.cropHistory) {
      this.cropHistory = [];
    }
    this.scaled = {
      img: null,
      drawing: {
        dx,
        dy,
        width,
        height,
        canvasWidth: scCanvasW,
        canvasHeight: scCanvasH
      },
      cropbox: { x: null, y: null, width: null, height: null }
    };
    this.unscaled = {
      img: unscaledImage,
      drawing: {
        dx: null,
        dy: null,
        width: unscaledImageWidth,
        height: unscaledImageHeight,
        canvasWidth: null,
        canvasHeight: null
      },
      cropbox: { x: null, y: null, width: null, height: null }
    };
  }

  setCanvasDims() {
    this.unscaled.drawing.canvasWidth =
      (this.scaled.drawing.canvasWidth * this.unscaled.drawing.width) /
      this.scaled.drawing.width;
    this.unscaled.drawing.canvasHeight =
      (this.scaled.drawing.canvasHeight * this.unscaled.drawing.height) /
      this.scaled.drawing.height;
  }

  setUImageOffsetXY() {
    this.unscaled.drawing.dx =
      (this.scaled.drawing.dx * this.unscaled.drawing.width) /
      this.scaled.drawing.width;
    this.unscaled.drawing.dy =
      (this.scaled.drawing.dy * this.unscaled.drawing.height) /
      this.scaled.drawing.height;
  }

  setCropbox(sCropboxX, sCropboxY, sCropboxW, sCropboxH) {
    this.scaled.cropbox.x = sCropboxX;
    this.scaled.cropbox.y = sCropboxY;
    this.scaled.cropbox.width = sCropboxW;
    this.scaled.cropbox.height = sCropboxH;
    var widthScale = this.unscaled.drawing.width / this.scaled.drawing.width;
    var heightScale = this.unscaled.drawing.height / this.scaled.drawing.height;
    this.unscaled.cropbox.x = sCropboxX * widthScale;
    this.unscaled.cropbox.y = sCropboxY * heightScale;
    this.unscaled.cropbox.width = sCropboxW * widthScale;
    this.unscaled.cropbox.height = sCropboxH * heightScale;
  }

  drawUnscaledCanvas(uCanvas, uctx, img) {
    this.setCanvasDims();
    uCanvas.width = this.unscaled.drawing.canvasWidth;
    uCanvas.height = this.unscaled.drawing.canvasHeight;
    this.setUImageOffsetXY();
    uctx.save();
    uctx.translate(
      this.unscaled.drawing.canvasWidth / 2,
      this.unscaled.drawing.canvasHeight / 2
    );

    uctx.rotate(this.rotation);
    uctx.translate(
      -this.unscaled.drawing.canvasWidth / 2,
      -this.unscaled.drawing.canvasHeight / 2
    );

    uctx.drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      this.unscaled.drawing.dx,
      this.unscaled.drawing.dy,
      img.width,
      img.height
    );

    uctx.restore();
  }

  rotate(deg) {
    this.rotation = (+deg * Math.PI) / 180;
  }

  crop(sCropboxX, sCropboxY, sCropboxW, sCropboxH) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      var uCroppedURL = null;

      img.onload = () => {
        const uCanvas = this.getUnscaledCanvas();
        const uctx = uCanvas.getContext("2d");

        this.drawUnscaledCanvas(uCanvas, uctx, img);

        this.setCropbox(sCropboxX, sCropboxY, sCropboxW, sCropboxH);
        var uCroppedImgData = uctx.getImageData(
          this.unscaled.cropbox.x,
          this.unscaled.cropbox.y,
          this.unscaled.cropbox.width,
          this.unscaled.cropbox.height
        );
        uctx.clearRect(
          0,
          0,
          this.unscaled.drawing.canvasWidth,
          this.unscaled.drawing.canvasHeight
        );
        uCanvas.width = this.unscaled.cropbox.width;
        uCanvas.height = this.unscaled.cropbox.height;
        uctx.putImageData(uCroppedImgData, 0, 0);
        //  debugger;
        uCroppedURL = uCanvas.toDataURL();
        this.cropHistory.push({
          rotation: this.rotation,
          cropHisLength: this.cropHistory.length,
          scaled: this.scaled,
          unscaled: this.unscaled,
          croppedURL: this.unscaled.img
        });
        resolve(uCroppedURL);
      };
      img.src = this.unscaled.img;
    });
  }

  undoCrop() {
    return new Promise((resolve, reject) => {
      //return canvas width and height and dx dy to previou
      var lastCrop = this.cropHistory.pop();
      resolve(lastCrop.croppedURL);
    });
  }

  initiateUnscaledAnalysis() {
    return; //good stuf
  }
}

module.exports.unscaledCropCanvas = unscaledCropCanvas;
