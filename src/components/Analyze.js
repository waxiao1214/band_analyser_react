import "../App.css";
import { connect } from "react-redux";
import React from "react";
import Tools from "./Tools";
import AnalysisCanvases from "./AnalysisCanvases";

function Analyze({ imageURL, pencil }) {
  return (
    <div className="App">
      <h1>Analyze your image!</h1>
      <div style={{ float: "left", width: "15%" }}>
        <Tools />
      </div>
      <div style={{ float: "left", width: "30%" }}>
        <AnalysisCanvases />
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  imageURL: state.croppedImageURL[0],
  pencil: state.pencil
});

const mapDispatchToProps = dispatch => ({
  none: null
});

export default connect(mapStateToProps, mapDispatchToProps)(Analyze);
