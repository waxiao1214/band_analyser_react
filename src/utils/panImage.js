var panImage = {
  offsetX: 0,
  offsetY: 0,
  startX: 0,
  startY: 0,
  pastPanX: 0,
  pastPanY: 0,
  start: function(x, y) {
    this.startX = x - this.pastPanX;
    this.startY = y - this.pastPanY;
  },
  move: function(x, y) {
    this.offsetX = x - this.startX;
    this.offsetY = y - this.startY;
  },
  end: function(x, y) {
    this.pastPanX = this.offsetX;
    this.pastPanY = this.offsetY;
  }
};

export default panImage;
