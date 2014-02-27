//------------------------------------------------------------------
//
// Place a 'clear' function on the Canvas prototype, this makes it a part
// of the canvas, rather than making a function that calls and does it.
//
//------------------------------------------------------------------
CanvasRenderingContext2D.prototype.clear = function(canvas) {
  this.save();
  this.setTransform(1, 0, 0, 1, 0, 0);
  this.clearRect(0, 0, canvas.width, canvas.height);
  this.restore();
};