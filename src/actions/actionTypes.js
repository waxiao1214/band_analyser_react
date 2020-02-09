export const types = {
  UPLOADED_IMAGE_URL: "UPLOADED_IMAGE",
  CROPPED_IMAGE_URL: "CROPPED_IMAGE_URL",
  REMOVE_LAST_CROPPED_IMAGE_URL: "REMOVE_LAST_CROPPED_IMAGE_URL",
  REMOVE_ALL_CROPPED_IMAGE_URL: "REMOVE_ALL_CROPPED_IMAGE_URL",
  NEW_PATH: "NEW_PATH",
  REMOVE_PATH: "REMOVE_PATH",
  SET_CURRENT_PENCIL_COLOR: "SET_CURRENT_PENCIL_COLOR",
  SET_CURRENT_PENCIL_THICKNESS: "SET_CURRENT_PENCIL_THICKNESS",
  SET_PENCIL_ERASER_STATUS: "SET_PENCIL_ERASER_STATUS",
  SET_ZOOM: "SET_ZOOM",
  SET_IS_PANNING: "SET_IS_PANNING",
  SET_PENCIL_XY: "SET_PENCIL_XY",
  ADD_BANDPATH_POINT: "ADD_BANDPATH_POINT",
  ENDING_BANDPATH_EXTENSION: "ENDING_BANDPATH_EXTENSION"
  // SET_ACTIVE_PATHID: "SET_ACTIVE_PATHID"
};

// export function setActivePath(id) {

// }

export function endPathAddition({ x, y }) {
  return {
    type: types.ENDING_BANDPATH_EXTENSION,
    value: { x, y }
  };
}

export function appendPointToBandpath({ x, y }) {
  return {
    type: types.ADD_BANDPATH_POINT,
    value: { x, y }
  };
}

export function addNewPath(path) {
  return {
    type: types.NEW_PATH,
    value: { color: path.color, initXY: { x: path.initXY.x, y: path.initXY.y } }
  };
}

export function setPencilXY(x, y) {
  return {
    type: types.SET_PENCIL_XY,
    value: { x, y }
  };
}

export function setIsPanning(isPanning) {
  return {
    type: types.SET_IS_PANNING,
    value: isPanning
  };
}
export function setZoom(zoom) {
  return {
    type: types.SET_ZOOM,
    value: zoom
  };
}

export function storeUploadedImageURL(url) {
  return {
    type: types.UPLOADED_IMAGE_URL,
    url
  };
}

export function storeCroppedImageURL(url) {
  return {
    type: types.CROPPED_IMAGE_URL,
    url
  };
}

export function removeLastCroppedImageURL(url) {
  return {
    type: types.REMOVE_LAST_CROPPED_IMAGE_URL,
    url
  };
}

export function resetCropURLArray(url) {
  return {
    type: types.REMOVE_ALL_CROPPED_IMAGE_URL,
    url: null
  };
}

export function deletePath(pathID) {
  return {
    type: types.REMOVE_PATH,
    id: pathID
  };
}

export function selectPencilColor(color) {
  return {
    type: types.SET_CURRENT_PENCIL_COLOR,
    value: color
  };
}

export function setPencilThickness(thickness) {
  return {
    type: types.SET_CURRENT_PENCIL_THICKNESS,
    value: thickness
  };
}
export function setPencilOrEraser(pencil) {
  return {
    type: types.SET_PENCIL_ERASER_STATUS,
    active: pencil.active,
    eraser: pencil.eraser
  };
}
