var cropbox = {
  active: false,
  x: null,
  y: null,
  width: 0,
  height: 0,
  pad: 5,
  panStartX: 0,
  panStartY: 0,
  panStartRectX: 0,
  panStartRectY: 0,
  startPan: function(x, y) {
    this.panStartX = x;
    this.panStartY = y;
    this.panStartRectX = this.x;
    this.panStartRectY = this.y;
  },
  movePan: function(x, y) {
    this.x = this.panStartRectX + (x - this.panStartX);
    this.y = this.panStartRectY + (y - this.panStartY);
  },
  endPan: function(x, y) {
    console.log("pan ending x,y:", x, y);
  },
  resetUpperLeft: function(x, y) {
    var newWidth = this.width - (x - this.x);
    var newHeight = this.height - (y - this.y);
    this.x = x;
    this.y = y;
    this.width = newWidth;
    this.height = newHeight;
  },
  resetLowerRight: function(x, y) {
    var newWidth = x - this.x;
    var newHeight = y - this.y;
    this.width = newWidth;
    this.height = newHeight;
  },
  resetTop: function(x, y) {
    var newHeight = this.height - (y - this.y);
    this.y = y;
    this.height = newHeight;
  },
  resetBottom: function(x, y) {
    var newHeight = y - this.y;
    this.height = newHeight;
  },
  resetLeft: function(x, y) {
    var newWidth = this.width + this.x - x;
    this.x = x;
    this.width = newWidth;
  },
  resetRight: function(x, y) {
    var newWidth = x - this.x;
    this.width = newWidth;
  },
  setWidth: function(x) {
    this.width = x - this.x;
  },
  setHeight: function(y) {
    this.height = y - this.y;
  },
  updateWidthandHeight: function(x, y) {
    this.width = x - this.x;
    this.height = y - this.y;
  },
  erase: function() {
    this.active = false;
    this.x = null;
    this.y = null;
    this.width = 0;
    this.height = 0;
  },
  new: function(x, y) {
    this.active = true;
    this.x = x;
    this.y = y;
    this.width = 0;
    this.height = 0;
  },
  getDims: function() {
    return { x: this.x, y: this.y, width: this.width, height: this.height };
  },
  isOutside: function(x, y) {
    var xPos = x <= this.x - this.pad || x >= this.x + this.width + this.pad;
    var yPos = y <= this.y - this.pad || y >= this.y + this.height + this.pad;
    return xPos || yPos;
  },
  isUpperLeft: function(x, y) {
    var xPos = x >= this.x - this.pad && x <= this.x + this.pad;
    var yPos = y >= this.y - this.pad && y <= this.y + this.pad;
    return xPos && yPos;
  },
  isLowerRight: function(x, y) {
    var lrX = this.x + this.width;
    var lrY = this.y + this.height;
    var xPos = x >= lrX - this.pad && x <= lrX + this.pad;
    var yPos = y >= lrY - this.pad && y <= lrY + this.pad;
    return xPos && yPos;
  },
  isInside: function(x, y) {
    var xPos = x >= this.x + this.pad && x <= this.x + this.width - this.pad;
    var yPos = y >= this.y + this.pad && y <= this.y + this.height - this.pad;
    return xPos && yPos;
  },
  isOnTop: function(x, y) {
    var xPos = x >= this.x + this.pad && x <= this.x + this.width - this.pad;
    var yPos = y >= this.y - this.pad && y <= this.y + this.pad;
    return xPos && yPos;
  },
  isOnBottom: function(x, y) {
    var xPos = x >= this.x + this.pad && x <= this.x + this.width - this.pad;
    var yPos =
      y >= this.y + this.height - this.pad &&
      y <= this.y + this.height + this.pad;
    return xPos && yPos;
  },
  isOnLeft: function(x, y) {
    var xPos = x >= this.x - this.pad && x <= this.x + this.pad;
    var yPos = y >= this.y + this.pad && y <= this.y + this.height - this.pad;
    return xPos && yPos;
  },
  isOnRight: function(x, y) {
    var xPos =
      x >= this.x + this.width - this.pad &&
      x <= this.x + this.width + this.pad;
    var yPos = y >= this.y + this.pad && y <= this.y + this.height - this.pad;
    return xPos && yPos;
  },
  isTouchingCropbox: function(x, y) {
    return (
      this.isUpperLeft(x, y) ||
      this.isLowerRight(x, y) ||
      this.isOnBottom(x, y) ||
      this.isOnLeft(x, y) ||
      this.isOnRight(x, y) ||
      this.isOnTop(x, y)
    );
  }
};

export default cropbox;
