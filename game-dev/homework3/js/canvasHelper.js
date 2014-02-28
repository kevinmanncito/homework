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

//------------------------------------------------------------------
// 
// This is used to get the mouse coordinates relative to the canvas 
// element and not the pixels of the element
// Thanks to this guy: http://stackoverflow.com/questions/55677/how-do-i-get-the-coordinates-of-a-mouse-click-on-a-canvas-element
// 
//------------------------------------------------------------------
HTMLCanvasElement.prototype.relMouseCoords = function(event) {
    
    // This seems to work better than the method below
    // I divice the x pixel location by 1.6 and the y pixel
    // location by 1.2 to convert to the rectangular "canvas" pixels
    // because the canvas is styled width: 800px and height: 600px
    if (event.offsetX !== undefined && event.offsetY !== undefined) { 
      return {x:event.offsetX/1.6, y:event.offsetY/1.2};
    }

    // This is the method from the stack overflow question
    // not as good as the code above
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var canvasX = 0;
    var canvasY = 0;
    var currentElement = this;

    do {
        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
        totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    }
    while (currentElement = currentElement.offsetParent)

    canvasX = event.pageX - totalOffsetX;
    canvasY = event.pageY - totalOffsetY;

    return {x:canvasX, y:canvasY}
};
