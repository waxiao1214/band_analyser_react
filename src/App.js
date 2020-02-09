import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import { connect } from "react-redux";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import CropPage from "./components/CropPage";
import UploadImage from "./components/UploadImage";
import Analyze from "./components/Analyze";
import Figures from "./components/Figures";

function App({ uploadedImage }) {
  return (
    <Router>
      <div>
        <ul>
          <li>
            <Link to="/upload">UploadImage</Link>
          </li>
          <li>
            <Link to="/crop">Crop</Link>
          </li>
          <li>
            <Link to="/analyze">Analyze</Link>
          </li>
          <li>
            <Link to="/figures">Figures</Link>
          </li>
        </ul>

        <Switch>
          <Route exact path="/">
            <UploadImage />
          </Route>
          <Route path="/upload">
            <UploadImage />
          </Route>
          <Route path="/crop">
            {uploadedImage ? <CropPage /> : <UploadImage />}
          </Route>
          <Route path="/analyze">
            {uploadedImage ? <Analyze /> : <UploadImage />}
          </Route>
          <Route path="/figures">
            {uploadedImage ? <Figures /> : <UploadImage />}
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

const mapStateToProps = state => ({
  uploadedImage: state.uploadedImageURL[0],
  croppedImageURL: state.croppedImageURL
});

export default connect(mapStateToProps)(App);
