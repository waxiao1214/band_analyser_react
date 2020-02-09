import React, { useRef } from "react";
import { connect } from "react-redux";

import "../App.css";
import PencilColors from "./PencilColors";
import {
  setPencilThickness,
  setPencilOrEraser,
  setZoom,
  setIsPanning
} from "../actions/actionTypes";

function Tools({
  dispatchPencilThickness,
  dispatchSelTool,
  dispatchZoom,
  zoom,
  pencil,
  dispatchIsPanning,
  isPanning
}) {
  const colors = ["red", "blue", "orange", "green", "purple", "yellow"];
  const zoomRangeRef = useRef();

  // const [zoomRange, setZoomRange] = useState(1);
  const pencilThicknessHandler = thickness => {
    dispatchPencilThickness(+thickness);
  };

  const pencilVsEraserHandler = selectedTool => {
    var pencilSelected = selectedTool === "pencil" ? true : false;
    var eraserSelected = selectedTool === "eraser" ? true : false;
    var isPanningSelected = selectedTool === "isPanning" ? true : false;
    dispatchSelTool({ active: pencilSelected, eraser: eraserSelected });
    dispatchIsPanning(isPanningSelected);
  };

  const zoomRangeHandler = () => {
    dispatchZoom(+zoomRangeRef.current.value);
    console.log("zooming");
  };

  return (
    <div className="ToolBox" style={{ backgroundColor: "#f6dd43" }}>
      <div className="pencilOnDiv" style={{ backgroundColor: "#e5e3e4" }}>
        <label>
          <input
            type="radio"
            name="selectedTool"
            value="pencil"
            onClick={e => pencilVsEraserHandler(e.target.value)}
            defaultChecked
          />{" "}
          Pencil
        </label>
        <PencilColors colors={colors}></PencilColors>
        <label>
          Line Thickness{" "}
          <input
            type="number"
            min={1}
            max={10}
            value={pencil.thickness}
            onChange={e => pencilThicknessHandler(e.target.value)}
          />
        </label>
      </div>
      <div className="eraserOnDiv">
        <label>
          <input
            type="radio"
            name="selectedTool"
            value="eraser"
            onClick={e => pencilVsEraserHandler(e.target.value)}
          />{" "}
          Eraser
        </label>
      </div>
      <div className="ZoomDiv" style={{ backgroundColor: "#3caea2" }}>
        <label htmlFor={zoomRangeRef}>Zoom</label>
        <br></br>
        <input
          ref={zoomRangeRef}
          type="range"
          min={1}
          max={10}
          step={0.1}
          value={zoom}
          onChange={zoomRangeHandler}
        ></input>
        <br></br>
        <output htmlFor={zoomRangeRef}>{zoom}</output>
      </div>
      <div className="panDiv" style={{ backgroundColor: "#e177b3" }}>
        <label>
          <input
            type="radio"
            name="selectedTool"
            value="isPanning"
            onClick={e => pencilVsEraserHandler(e.target.value)}
          ></input>
          Pan
        </label>
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  pencil: state.pencil,
  zoom: state.zoom,
  isPanning: state.isPanning
});

const mapDispatchToProps = dispatch => ({
  dispatchPencilThickness: thickness => dispatch(setPencilThickness(thickness)),
  dispatchSelTool: selectedTool => dispatch(setPencilOrEraser(selectedTool)),
  dispatchZoom: zoom => dispatch(setZoom(zoom)),
  dispatchIsPanning: isPanning => dispatch(setIsPanning(isPanning))
});
export default connect(mapStateToProps, mapDispatchToProps)(Tools);
