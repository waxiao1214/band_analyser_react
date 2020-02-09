import { combineReducers } from "redux";
import { types } from "../actions/actionTypes";
import initialState from "./initialState";
import { Config } from "./ReduxConfig";

import _ from "lodash";
//make uploadedImageURL reducer

const uploadedImageURL = (state = initialState.uploadedImageURL, action) => {
  switch (action.type) {
    case types.UPLOADED_IMAGE_URL:
      return [action.url];
    default:
      return state;
  }
};

const croppedImageURL = (state = initialState.croppedImageURL, action) => {
  switch (action.type) {
    case types.CROPPED_IMAGE_URL:
      return [action.url, ...state];
    case types.REMOVE_LAST_CROPPED_IMAGE_URL:
      var croppedImageArray = [...state];
      croppedImageArray.shift();
      return croppedImageArray;
    case types.REMOVE_ALL_CROPPED_IMAGE_URL:
      return [];
    default:
      return state;
  }
};

const pathObjectArray = (state = initialState.pathObjectArray, action) => {
  switch (action.type) {
    case types.NEW_PATH:
      console.log("called new_path");

      const newID = Config.getNewID(state);
      const newState = {
        ...state,
        info: { activePath: newID },
        [newID]: {
          color: action.value.color,
          path: [action.value.initXY],
          alpha: 0,
          isActive: true,
          isClosed: false,
          isDeleted: false
        }
      };
      console.log(newState)
      return newState;
    case types.REMOVE_PATH:
      return _.filter(state, path => {
        return path.id !== action.id;
      });
    case types.ADD_BANDPATH_POINT:
      const extID = state.info.activePath;
      const extPath = state[extID].path.concat(action.value);
      const extState = {
        ...state,
        [extID]: { ...state[extID], path: extPath }
      };
      return extState;

    case types.ENDING_BANDPATH_EXTENSION:
      const endID = state.info.activePath;
      const endPath = state[endID].path;
      const [sX, sY] = [endPath[0].x, endPath[0].y];

      const endPathIsClosed =
        Config.closeCut >=
        Config.isCloseEnoughToClose(sX, sY, action.value.x, action.value.y)
          ? true
          : false;
      return {
        ...state,
        info: { activePath: null },
        [endID]: {
          ...state[endID],
          path: endPath.concat(action.value),
          alpha: endPathIsClosed ? 0.5 : 1,
          isClosed: endPathIsClosed,
          isActive: false
        }
      };
    default:
      return state;
  }
};

const pencil = (state = initialState.pencil, action) => {
  switch (action.type) {
    case types.SET_CURRENT_PENCIL_COLOR:
      return { ...state, color: action.value };
    case types.SET_CURRENT_PENCIL_THICKNESS:
      return { ...state, thickness: action.value };
    case types.SET_PENCIL_ERASER_STATUS:
      return { ...state, active: action.active, eraser: action.eraser };
    case types.SET_PENCIL_XY:
      return { ...state, x: action.value.x, y: action.value.y };
    default:
      return state;
  }
};

const zoom = (state = initialState.zoom, action) => {
  switch (action.type) {
    case types.SET_ZOOM:
      return action.value;
    default:
      return state;
  }
};

const isPanning = (state = initialState.isPanning, action) => {
  switch (action.type) {
    case types.SET_IS_PANNING:
      return action.value;
    default:
      return state;
  }
};

export default combineReducers({
  uploadedImageURL,
  croppedImageURL,
  pathObjectArray,
  pencil,
  zoom,
  isPanning
});
