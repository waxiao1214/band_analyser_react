import "../App.css";
import { connect } from "react-redux";
import React, { useState, useEffect, useRef } from "react";
import {
  addNewPath,
  deletePath,
  setPencilXY,
  appendPointToBandpath,
  endPathAddition
} from "../actions/actionTypes";
import panZoomClass from "../utils/panZoom";
import { getVCanvasDims } from "../utils/windowImgCanvasDims";
import { drawScaleCanvasMarker } from "../utils/drawScaleCanvasMarker";

function AnalysisCanvases({
  imageURL,
  pencil,
  dispAddPath, //start new path
  dispRemovePath, //remove old path - did not build yet
  bPO, //band path object in redux
  dispBPO, //dispatch band path object to redux
  reduxZoom,
  isPanning,
  dispPencilXY,
  dispAppendPoint,
  dispEndPathAddition
}) {
  const vCanvasRef = useRef();
  const oriCanvasRef = useRef();
  const oAnimRef = useRef();
  const vAnimRef = useRef();
  const pzRef = useRef();
  const [scaleMark, setScaleMark] = useState({ long: 15, short: 4 });
  const [oriCanvasXY, setOriCanvasXY] = useState([{ x: 0, y: 0 }]);
  const mouse = useRef({
    down: false,
    isPanning: false,
    isDrawing: false,
    isErasing: false,
    isAdjustingCanvasSize: false,
    isScalingCanvas: false
  });
  function getVCanvas() {
    return vCanvasRef.current;
  }
  function getOCanvas() {
    return oriCanvasRef.current;
  }

  useEffect(() => {
    const ocanvas = oriCanvasRef.current;
    const vcanvas = vCanvasRef.current;
    var img = new Image();

    img.onload = () => {
      const iw = img.width;
      const ih = img.height;
      ocanvas.width = iw;
      ocanvas.height = ih;
      if (pzRef.current === undefined) {
        [vcanvas.width, vcanvas.height] = getVCanvasDims(window, img, 0.4, 0.5);
        pzRef.current = new panZoomClass(getVCanvas, iw, ih); // will control zoom pan of vcanvas
      }
      vAnimation(img);
      oAnimation(img);
    };
    img.src = imageURL;

    function vAnimation() {
      const vcanvas = getVCanvas();
      const vctx = vcanvas.getContext("2d");
      vctx.clearRect(0, 0, pzRef.current.dw, pzRef.current.dh);
      pzRef.current.zoomInOrOut(reduxZoom);
      var { sx, sy, sw, sh, dx, dy, dw, dh } = pzRef.current.drawVParams();
      vctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
      drawScaleCanvasMarker(getVCanvas, scaleMark);
      drawPencil(getVCanvas, pencil, true);
      drawPaths(getVCanvas, bPO, true);
      vAnimRef.current = requestAnimationFrame(vAnimation);
    }

    function oAnimation() {
      const ocanvas = oriCanvasRef.current;
      const octx = ocanvas.getContext("2d");
      octx.clearRect(0, 0, ocanvas.width, ocanvas.height);
      octx.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        0,
        0,
        img.width,
        img.height
      );
      octx.fillStyle = "red";
      octx.fillRect(oriCanvasXY.x, oriCanvasXY.y, 4, 4);
      drawPencil(getOCanvas, pencil, false);
      drawPaths(getOCanvas, bPO, false);
      oAnimRef.current = requestAnimationFrame(oAnimation);
    }

    return () => {
      cancelAnimationFrame(vAnimRef.current);
      cancelAnimationFrame(oAnimRef.current);
    };
  }, [imageURL, reduxZoom, oriCanvasXY, pencil, bPO, scaleMark]);

  function drawPencil(getCanvasFunc, pencil, isViewCanvas) {
    const canvas = getCanvasFunc();
    const ctx = canvas.getContext("2d");
    var { x, y } = pzRef.current.getCoords(pencil.x, pencil.y, isViewCanvas);
    ctx.fillStyle = pencil.color;
    ctx.beginPath();
    ctx.arc(x, y, pencil.thickness, 0, 2 * Math.PI, false);
    ctx.fill();
  }

  function drawPaths(getCanvasFunc, bPO, isViewCanvas) {
    var canvas = getCanvasFunc();
    var ctx = canvas.getContext("2d");
    var pBPKeys = Object.keys(bPO).filter(d => {
      return d !== "info" && d !== "pb1";
    });
    if (pBPKeys.length >= 1) {
      pBPKeys.forEach(key => {
        ctx.save();
        var pathDesc = bPO[key];
        ctx.strokeStyle = pathDesc.color;
        //ctx.globalAlpha = pathDesc.alpha;
        var { x: startX, y: startY } = pzRef.current.getCoords(
          pathDesc.path[0].x,
          pathDesc.path[0].y,
          isViewCanvas
        );
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        pathDesc.path.forEach(point => {
          var { x, y } = pzRef.current.getCoords(
            point.x,
            point.y,
            isViewCanvas
          );
          ctx.lineTo(x, y);
          ctx.stroke();
        });
        ctx.restore();
      });
    }
  }

  function getSimpleWindowToCanvas(canvas, x, y) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: Math.round((x - rect.left) * (canvas.width / rect.width)),
      y: Math.round((y - rect.top) * (canvas.height / rect.height))
    };
  }

  function isOnScaleMark(mouseX, mouseY, cw, ch, smShort, smLong) {
    return mouseX >= cw - smLong && mouseY >= ch - smLong ? true : false;
  }
  const handleMouseDown = e => {
    var cw = vCanvasRef.current.width;
    var ch = vCanvasRef.current.height;
    var { x, y } = getSimpleWindowToCanvas(
      vCanvasRef.current,
      e.clientX,
      e.clientY
    );
    mouse.current.down = true;
    if (isOnScaleMark(x, y, cw, ch, scaleMark.short, scaleMark.long)) {
      console.log("...scaling canvas");
      mouse.current.isScalingCanvas = true;
    } else if (isPanning) {
      mouse.current.isPanning = isPanning;
      pzRef.current.mouseDownPan(x, y);
    } else if (pencil.active) {
      mouse.current.isDrawing = true;
      var { oX, oY } = pzRef.current.getOrigCoords(x, y);
      dispAddPath({ color: pencil.color, initXY: { x: oX, y: oY } });
      setOriCanvasXY({ x: oX, y: oY });
    }
    mouse.current.isErasing = pencil.eraser;
  };

  const handleMouseMove = e => {
    var cw = vCanvasRef.current.width;
    var ch = vCanvasRef.current.height;
    var { x, y } = getSimpleWindowToCanvas(
      vCanvasRef.current,
      e.clientX,
      e.clientY
    );
    if (!mouse.down && pencil.active) {
      let { oX, oY } = pzRef.current.getOrigCoords(x, y);
      dispPencilXY(oX, oY);
    }
    if (mouse.current.down) {
      if (mouse.current.isScalingCanvas) {
        vCanvasRef.current.width = x + 10;
        vCanvasRef.current.height = y + 10;
        pzRef.current.setCanvasWH(x + 10, y + 10);
      } else if (mouse.current.isPanning) {
        pzRef.current.mouseMovePan(x, y);
        if (x < 6 || x > cw - 6 || y < 6 || y > ch - 6) {
          mouse.current.down = false;
          mouse.current.isPanning = false;
        }
      } else if (mouse.current.isDrawing) {
        let { oX, oY } = pzRef.current.getOrigCoords(x, y);
        dispAppendPoint({ x: oX, y: oY });
      }
    }
  };

  const handleMouseUp = e => {
    var { x, y } = getSimpleWindowToCanvas(
      vCanvasRef.current,
      e.clientX,
      e.clientY
    );
    if (mouse.current.isDrawing) {
      mouse.current.isDrawing = false;
      var { oX, oY } = pzRef.current.getOrigCoords(x, y);
      dispEndPathAddition({ x: oX, y: oY });
    }
    mouse.current.down = false;
    mouse.current.isPanning = false;
    mouse.current.isScalingCanvas = false;
  };

  return (
    <div>
      <canvas
        ref={vCanvasRef}
        // style={{ border: "1px solid black" }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        Canvas Here
      </canvas>
      <canvas ref={oriCanvasRef} style={{ border: "1px solid orange" }}>
        Original Canvas Here
      </canvas>
    </div>
  );
}

const mapStateToProps = state => ({
  imageURL: state.croppedImageURL[0],
  pencil: state.pencil,
  reduxZoom: state.zoom,
  isPanning: state.isPanning,
  bPO: state.pathObjectArray
});

const mapDispatchToProps = dispatch => ({
  dispAddPath: path => dispatch(addNewPath(path)),
  dispRemovePath: path => dispatch(deletePath(path)),
  dispPencilXY: (x, y) => dispatch(setPencilXY(x, y)),
  dispAppendPoint: (x, y) => dispatch(appendPointToBandpath(x, y)),
  dispEndPathAddition: (x, y) => dispatch(endPathAddition(x, y))
});

export default connect(mapStateToProps, mapDispatchToProps)(AnalysisCanvases);
