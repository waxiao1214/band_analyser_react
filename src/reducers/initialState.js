export const initialState = {
  uploadedImageURL: [],
  uploadedGrayImageURL: [],
  croppedImageURL: [],
  croppedGrayImageURL: [],
  pathObjectArray: {
    info: { activePath: null },
    pb1: {
      color: "black",
      path: [],
      alpha: 0,
      isActive: false,
      isClosed: false,
      isDeleted: false
    }
  },
  pathDataArray: [{ id: 0, name: "default", MW: 0, plasmid: true }],
  pencil: {
    color: "black",
    thickness: 1,
    active: true,
    eraser: false,
    x: null,
    y: null,
    onCanvas: false
  },
  zoom: 1,
  isPanning: false
};

export default initialState;
