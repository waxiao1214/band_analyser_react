import React, { useState, useEffect, useRef } from "react";
import "../App.css";
import { connect } from "react-redux";
import { selectPencilColor } from "../actions/actionTypes";

function PencilColors({ colors, dispatchPencilColor, pencilColor }) {
  const selectColor = selectedColor => {
    console.log("the pencil color used to be", pencilColor);
    console.log(`${selectedColor} was selected!`);
    dispatchPencilColor(selectedColor);
  };

  return (
    <div className="ToolBox">
      <ul>
        {colors.map((col, index) => (
          <li
            className={`${col}Text`}
            key={index}
            style={{ color: col }}
            onClick={() => selectColor(col)}
          >
            {col}
          </li>
        ))}
      </ul>
    </div>
  );
}
const mapStateToProps = state => ({
  pencilColor: state.pencil.color
});

const mapDispatchToProps = dispatch => ({
  dispatchPencilColor: col => dispatch(selectPencilColor(col))
});

export default connect(mapStateToProps, mapDispatchToProps)(PencilColors);
