export const Config = {
  closeCut: 10,
  getNewID: state => {
    let newID = `${Object.keys(state).length}`;
    if (!Object.keys(state).includes(newID)) {
      return newID;
    } else {
      throw new Error("Error newID is already taken");
    }
  },
  isCloseEnoughToClose: function(sX, sY, eX, eY) {
    var xDiff = Math.pow(eX - sX, 2);
    var yDiff = Math.pow(eY - sY, 2);
    var dist = Math.sqrt(xDiff + yDiff);
    return dist;
  }
};
