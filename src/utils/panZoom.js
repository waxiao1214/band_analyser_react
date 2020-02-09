class panZoom {
  constructor(getCanvas, imageWidth, imageHeight) {
    this.vcanvas = getCanvas();
    this.imgW = imageWidth;
    this.imgH = imageHeight;
    this.sx = 0;
    this.sy = 0;
    this.sw = imageWidth;
    this.sh = imageHeight;
    this.dx = 0;
    this.dy = 0;
    this.dw = this.vcanvas.width;
    this.dh = this.vcanvas.height;
    this.pan = { x: 0, y: 0, cx: 0, cy: 0 };
    this.zoom = 1;
    this.prevZoom = null;
  }

  getViewCoords(origCoordX, origCoordY) {
    var viewCoordx =
      ((origCoordX - this.sx) * (this.dw * this.zoom)) / this.imgW;
    var viewCoordy =
      ((origCoordY - this.sy) * (this.dh * this.zoom)) / this.imgH;

    return { vX: viewCoordx, vY: viewCoordy };
  }
  getOrigCoords(viewCoordX, viewCoordY) {
    var origCoordx = this.sx + (viewCoordX * this.imgW) / (this.dw * this.zoom);
    var viewCoordy = this.sy + (viewCoordY * this.imgH) / (this.dh * this.zoom);
    return { oX: origCoordx, oY: viewCoordy };
  }

  getCoords(x, y, toViewCoords = false) {
    if (toViewCoords === true) {
      var { vX, vY } = this.getViewCoords(x, y);
      x = vX;
      y = vY;
    }
    return { x, y };
  }

  setCanvasWH(w, h) {
    this.dw = w;
    this.dh = h;
  }

  canvToImg(canvasX, canvasY) {
    var imgX = (canvasX * this.imgW) / this.dw / this.zoom;
    var imgY = (canvasY * this.imgH) / this.dh / this.zoom;
    return [imgX, imgY];
  }
  mouseDownPan(mouseX, mouseY) {
    var [imgX, imgY] = this.canvToImg(mouseX, mouseY);
    this.pan.cx = imgX;
    this.pan.cy = imgY;
  }
  mouseMovePan(mouseX, mouseY) {
    if (this.zoom > 0) {
      var [imgX, imgY] = this.canvToImg(mouseX, mouseY);
      this.pan.x = imgX - this.pan.cx;
      this.pan.y = imgY - this.pan.cy;
      this.reDrawOnPan(imgX, imgY);
    }
  }
  reDrawOnPan(imgX, imgY) {
    this.pan.cx = imgX;
    this.pan.cy = imgY;
    this.sx = this.sx - this.pan.x;
    this.sy = this.sy - this.pan.y;
  }

  mouseUpPan(mouseX, mouseY) {
    this.pan.cx = 0;
    this.pan.cy = 0;
  }

  zoomInOrOut(newZoom) {
    if (newZoom !== this.zoom) {
      this.prevZoom = this.zoom;
      this.zoom = newZoom;
      this.reDrawOnZoom();
    }
  }

  reDrawOnZoom() {
    var newSx, newSy;
    var newWidth = this.imgW / this.zoom;
    var newHeight = this.imgH / this.zoom;
    newSx = this.sx + (this.sw - newWidth) / 2;
    newSy = this.sy + (this.sh - newHeight) / 2;
    this.sw = newWidth;
    this.sh = newHeight;
    this.sx = newSx;
    this.sy = newSy;
  }

  drawVParams() {
    return {
      sx: this.sx,
      sy: this.sy,
      sw: this.sw,
      sh: this.sh,
      dx: this.dx,
      dy: this.dy,
      dw: this.dw,
      dh: this.dh
    };
  }
}

export default panZoom;

// var chalk = require("chalk");
// var coords = [1, 2, 3, 4, 5];
// var args = process.argv.slice(2);
// console.log("");

// var [vcord, panx, imgW, dw, zoom] = args.map(d => {
//   var m = d.match(/\d{1,4}$/)[0];

//   console.log(d);
//   return +m;
// });
// var sx = 10;
// var imgW = 100;
// var dw = 300;
// var zoom = 5;

// var oriCord = panx + (vcord * imgW) / dw / zoom;
// console.log("");
// console.log("");
// console.log(chalk.yellow(`${panx} + (${vcord} * ${imgW}) / ${dw} / ${zoom}`));
// console.log("");
// console.log(chalk.yellow(`${vcord} turned into ${oriCord}`));
// console.log("");
