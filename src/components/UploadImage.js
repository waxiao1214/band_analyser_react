import React, { useState, useEffect, useRef } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import {
  storeUploadedImageURL,
  resetCropURLArray
} from "../actions/actionTypes";
import { compressImage } from "../utils/compressImage";
import "../App.css";

const Upload = ({ storeUploadedImage, uploadedImage, resetCropURLArray }) => {
  const [imgFile, setImgFile] = useState(null);
  const maxImageDim = 4000;

  useEffect(() => {
    if (imgFile !== null) {
    }
  }, [imgFile]);

  const getImage = event => {
    var reader = new FileReader();
    resetCropURLArray();
    reader.onload = event => {
      var img = new Image();
      img.onload = () => {
        storeUploadedImage(event.target.result);
        if (img.width > maxImageDim || img.width > maxImageDim) {
          img = compressImage(img);
        }
        setImgFile(img);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(event.target.files[0]);
  };

  return (
    <div className="App">
      <h1>Upload your image!</h1>
      {imgFile === null ? (
        <input type="file" onChange={getImage} />
      ) : (
        <Redirect to="/crop" />
      )}
    </div>
  );
};

const mapStateToProps = state => ({
  uploadedImage: state.uploadedImageURL
});

const mapDispatchToProps = dispatch => ({
  storeUploadedImage: url => dispatch(storeUploadedImageURL(url)),
  resetCropURLArray: url => dispatch(resetCropURLArray(url))
});

export default connect(mapStateToProps, mapDispatchToProps)(Upload);
