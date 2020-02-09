function getWindowToCanvas(canvas, e) {
  //first calculate normal mouse coordinates
  e = e || window.event;
  var target = e.target || e.srcElement,
    style = target.currentStyle || window.getComputedStyle(target, null),
    borderLeftWidth = parseInt(style["borderLeftWidth"], 10),
    borderTopWidth = parseInt(style["borderTopWidth"], 10),
    rect = target.getBoundingClientRect(),
    offsetX = e.clientX - borderLeftWidth - rect.left,
    offsetY = e.clientY - borderTopWidth - rect.top;
  let x = (offsetX * target.width) / target.clientWidth;
  let y = (offsetY * target.height) / target.clientHeight;

  //then adjust coordinates for the context's transformations
  const ctx = canvas.getContext("2d");
  var transform = ctx.getTransform();
  const invMat = transform.invertSelf();
  return {
    x: x * invMat.a + y * invMat.c + invMat.e,
    y: x * invMat.b + y * invMat.d + invMat.f
  };
}

export default getWindowToCanvas;
