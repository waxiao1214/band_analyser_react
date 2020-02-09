import React, { useState, useEffect, useRef } from "react";
import {
  storeCroppedImageURL,
  removeLastCroppedImageURL
} from "../actions/actionTypes";
import { connect } from "react-redux";
import "../App.css";
import _ from "lodash";

import { imageURLToGrey } from "../utils/imageToGrey";
import next90 from "../utils/next90";
import incrementToNextAngle from "../utils/incrementToNextAngle";
import cropbox from "../utils/cropBox";

import { drawImgParams } from "../utils/windowImgCanvasDims";
import { unscaledCropCanvas } from "../utils/unscaledCanvas";

function CropPage({
  uploadedImage,
  croppedImageURLArray,
  storeCroppedImage,
  undoCrop
}) {
  const [rotateTo, setRotateTo] = useState([0]);
  const [userInputRotation, setUserInputRotation] = useState(0);
  const canRef = useRef();
  const uCanvasRef = useRef();
  const inputRef = useRef();
  const cropRef = useRef();
  const cropAnimRef = useRef();
  const undoButton = useRef();
  const uCanvasClass = useRef();
  //initiate object to control unscaled canvas image

  useEffect(() => {
    console.log("called init useEffect");
    return () => {
      console.log("return called");
      cancelAnimationFrame(cropAnimRef.current);
    };
  }, []);

  useEffect(() => {
    //make full length image grey
    if (uploadedImage) {
      cropbox.erase();
      const canvas = canRef.current;
      const img = new Image();
      img.onload = () => {
        var greyFullImageURL = imageURLToGrey(img, canvas);
        storeCroppedImage(greyFullImageURL);
        uCanvasClass.current = new unscaledCropCanvas(() => {
          return uCanvasRef.current;
        });
        //
      };
      img.src = uploadedImage;
    }
  }, [uploadedImage]);

  useEffect(() => {
    //place grey image inside cropbox canvas
    if (croppedImageURLArray[0] !== null) {
      const img = new Image();

      img.onload = () => {
        //get canvas and image parameters from window size
        //set angle to zero
        setUserInputRotation(0);
        const canvas = canRef.current;
        const ctx = canvas.getContext("2d");
        var [x, y, imgW, imgH, dx, dy, fitWidth, fitHeight] = drawImgParams(
          window,
          img,
          canvas,
          0.6
        );
        //draw the image for cropping

        ctx.drawImage(img, x, y, imgW, imgH, dx, dy, fitWidth, fitHeight);
        var url = canvas.toDataURL();

        uCanvasClass.current.init(
          croppedImageURLArray[0],
          imgW,
          imgH,
          dx,
          dy,
          fitWidth,
          fitHeight,
          canvas.width,
          canvas.height
        );

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const img2 = new Image();
        img2.onload = () => {
          cropAnimation();
        };
        img2.src = url;
        function cropAnimation() {
          drawImage(img2);
          drawCropRect();
          cropAnimRef.current = requestAnimationFrame(cropAnimation);
        }
      };
      img.src = croppedImageURLArray[0];
    }
    return () => {
      cancelAnimationFrame(cropAnimRef.current);
    };
  }, [croppedImageURLArray[0]]);

  const cropHandler = e => {
    if (cropbox.active) {
      uCanvasClass.current.rotate(userInputRotation);
      var { x, y, width, height } = cropbox.getDims();
      cropbox.erase();
      uCanvasClass.current
        .crop(x, y, width, height)
        .then(durl => {
          storeCroppedImage(durl);
        })
        .catch(caught => {
          console.log("crop error caught");
        });
    }
  };

  const undoCropHandler = e => {
    uCanvasClass.current.undoCrop().then(url => {
      console.log("undocrp url", url);
      undoCrop();
    });
  };

  useEffect(() => {
    if (Math.abs(userInputRotation) <= 360) {
      const timeout = setTimeout(() => {
        setRotateTo([...rotateTo, userInputRotation]);
      }, 10);
      return () => clearTimeout(timeout);
    }
  }, [userInputRotation]);

  const updateRotation = () => {
    setUserInputRotation(+inputRef.current.value);
  };

  const block90rotate = e => {
    var curAng = userInputRotation;
    var right = +e.currentTarget.value === 1;
    var nextAngle = next90(curAng, right);
    incrementToNextAngle(curAng, nextAngle, setUserInputRotation, 15, right);
  };

  const drawCropRect = () => {
    if (cropbox.active && canRef.current) {
      const canvas = canRef.current;
      const ctx = canvas.getContext("2d");
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      const { x, y, width, height } = cropbox.getDims();
      if (width > 0 && height > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = "#777777";
        ctx.globalAlpha = 0.5;
        ctx.strokeStyle = "none";
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.moveTo(x, y);
        //  ctx.strokeStyle = "black";
        ctx.lineTo(x, y + height);
        ctx.lineTo(width + x, y + height);
        ctx.lineTo(width + x, y);
        ctx.lineTo(x, y);
        ctx.fill();
        //ctx.stroke();
        ctx.restore();
      }
    }
  };

  function drawImage(img) {
    if (inputRef.current) {
      const angle = (inputRef.current.value * Math.PI) / 180;
      // console.log("angle", angle);
      const canvas = canRef.current;
      const ctx = canvas.getContext("2d");
      const width = canvas.width;
      const height = canvas.height;
      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(1, 0, 0, 1, width / 2, height / 2);
      ctx.rotate(angle);
      ctx.translate(-width / 2, -height / 2);
      ctx.drawImage(img, 0, 0);
      ctx.restore();
    }
  }

  var mouse = {
    down: false,
    x: null,
    y: null,
    isCropping: false,
    isPanningCropBox: false,
    isDeletingCropBox: false
  };

  function getSimpleWindowToCanvas(canvas, x, y) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: Math.round((x - rect.left) * (canvas.width / rect.width)),
      y: Math.round((y - rect.top) * (canvas.height / rect.height))
    };
  }

  const handleMouseDown = e => {
    var { x, y } = getSimpleWindowToCanvas(
      canRef.current,
      e.clientX,
      e.clientY
    );
    mouse.down = true;
    if (!cropbox.active) {
      //
      //    console.log("cropbox.new(x,y) in handleMouseDown if !cropbox.active");
      cropbox.new(x, y);
    } else if (cropbox.active && cropbox.isOutside(x, y)) {
      cropbox.erase();
    } else if (cropbox.active && cropbox.isInside(x, y)) {
      mouse.isAdjustingCropbox = true; //probably good idea to include here.
      mouse.isPanningCropBox = true; // mouse.isPanningCropBox done
      cropbox.startPan(x, y); // panCropBox.start done
    } else if (cropbox.active && cropbox.isTouchingCropbox(x, y)) {
      mouse.isAdjustingCropbox = true;
    }
  };

  const handleMouseMove = e => {
    var { x, y } = getSimpleWindowToCanvas(
      canRef.current,
      e.clientX,
      e.clientY
    );
    if (mouse.down && cropbox.active) {
      if (mouse.isPanningCropBox) {
        cropbox.movePan(x, y);
      } else if (!mouse.isDeletingCropBox && !mouse.isAdjustingCropbox) {
        // console.log(
        //   "cropbox.updateWidthandHeight(x, y) in handleMouseMove if mouse.down && cropbox.active"
        // );
        cropbox.updateWidthandHeight(x, y);
      } else if (mouse.isAdjustingCropbox) {
        if (cropbox.isUpperLeft(x, y)) {
          cropbox.resetUpperLeft(x, y);
        } else if (cropbox.isLowerRight(x, y)) {
          cropbox.resetLowerRight(x, y);
        } else if (cropbox.isOnTop(x, y)) {
          cropbox.resetTop(x, y);
        } else if (cropbox.isOnBottom(x, y)) {
          cropbox.resetBottom(x, y);
        } else if (cropbox.isOnLeft(x, y)) {
          cropbox.resetLeft(x, y);
        } else if (cropbox.isOnRight(x, y)) {
          cropbox.resetRight(x, y);
        }
      }
    }
  };

  const handleMouseUp = e => {
    mouse.down = false;
    mouse.isPanningCropBox = false;
    mouse.isDeletingCropBox = false;
    mouse.isAdjustingCropbox = false;
    if (cropbox.width <= 0 || cropbox.heigh <= 0) {
      cropbox.active = false;
    }
  };

  return (
    <div className="App">
      <div>
        <h1>Crop & Rotate!</h1>
        <div>
          <button type="button" onClick={block90rotate} value={-1}>
            Rotate Left
          </button>
          <button type="button" onClick={block90rotate} value={1}>
            Rotate Right
          </button>
          <button ref={cropRef} onClick={cropHandler}>
            Crop
          </button>
          {croppedImageURLArray.length > 1 && (
            <button ref={undoButton} onClick={undoCropHandler}>
              Undo
            </button>
          )}
        </div>
        <div>
          Rotate:
          <input
            ref={inputRef}
            value={userInputRotation}
            min={-360}
            max={360}
            type="number"
            onChange={updateRotation}
            style={{ border: "none", fontSize: 16, color: "#235788" }}
          ></input>
        </div>
      </div>
      <div>
        <canvas
          ref={canRef}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          //  style={{ border: "3px solid #000000" }}
        >
          Canvas should be here
        </canvas>
        <canvas
          ref={uCanvasRef}
          style={{ border: "3px solid #eb5d02", display: "none" }}
        ></canvas>
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  uploadedImage: state.uploadedImageURL[0],
  croppedImageURLArray: state.croppedImageURL
});

const mapDispatchToProps = dispatch => ({
  storeCroppedImage: url => dispatch(storeCroppedImageURL(url)),
  undoCrop: () => dispatch(removeLastCroppedImageURL())
});

export default connect(mapStateToProps, mapDispatchToProps)(CropPage);
