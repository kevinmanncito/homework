/*jslint browser: true, white: true */
/*global CanvasRenderingContext2D, requestAnimationFrame, console, MYGAME */
// ------------------------------------------------------------------
// 
// This is the game object.  Everything about the game is located in 
// this object.
//
// ------------------------------------------------------------------
MYGAME.graphics = (function() {
  'use strict';
  
  var canvas = document.getElementById('canvas-main');
  var context = canvas.getContext('2d');

  //------------------------------------------------------------------
  //
  // Place a 'clear' function on the Canvas prototype, this makes it a part
  // of the canvas, rather than making a function that calls and does it.
  //
  //------------------------------------------------------------------
  CanvasRenderingContext2D.prototype.clear = function() {
    this.save();
    this.setTransform(1, 0, 0, 1, 0, 0);
    this.clearRect(0, 0, canvas.width, canvas.height);
    this.restore();
  };
  
  //------------------------------------------------------------------
  //
  // Public function that allows the client code to clear the canvas.
  //
  //------------------------------------------------------------------
  function clear() {
    context.clear();
  }
  
  //------------------------------------------------------------------
  //
  // This is used to create a triangle function that can be used by client
  // code for rendering.
  //
  //------------------------------------------------------------------
  function Triangle(spec) {
    var that = {};
    
    that.updateRotation = function(angle) {
      spec.rotation += angle;
    };
    
    that.draw = function() {
      context.save();
      
      context.translate(spec.center.x, spec.center.y);
      context.rotate(spec.rotation);
      context.translate(-spec.center.x, -spec.center.y);
      
      context.beginPath();
      context.moveTo(spec.pt1.x, spec.pt1.y);
      context.lineTo(spec.pt2.x, spec.pt2.y);
      context.lineTo(spec.pt3.x, spec.pt3.y);
      context.closePath();
      
      context.fillStyle = spec.fill;
      context.fill();
      
      context.strokeStyle = spec.stroke;
      context.lineWidth = spec.lineWidth;
      context.stroke();
      
      context.restore();
    };
    
    return that;
  }

  //------------------------------------------------------------------
  //
  // This is used to create a rectange function that can be used by client
  // code for rendering.
  //
  //------------------------------------------------------------------
  function Rectangle(spec) {
    var that = {};

    that.updateRotation = function(angle) {
      spec.rotation += angle;
    };
    
    that.draw = function() {
      context.save();
      context.translate(spec.x + spec.width / 2, spec.y + spec.height / 2);
      context.rotate(spec.rotation);
      context.translate(-(spec.x + spec.width / 2), -(spec.y + spec.height / 2));
      
      context.fillStyle = spec.fill;
      context.fillRect(spec.x, spec.y, spec.width, spec.height);
      
      context.strokeStyle = spec.stroke;
      context.strokeRect(spec.x, spec.y, spec.width, spec.height);

      context.restore();
    };

    return that;
  }

  function Maze() {
    var size = 10;
    var maze = [];

    for (var i = 0; i < size; i++) {
      maze.push([]);
    }

    for (var row = 0; row < size; row++) {
      for (var col = 0; col < size; col++) {
        maze[row].push({
          'left':   1,
          'top':    1,
          'right':  1,
          'bottom': 1
        });
      }
    }

    // console.log(maze);
    
    return maze;
  }

  return {
    clear : clear,
    Triangle : Triangle,
    Rectangle : Rectangle,
    Maze : Maze
  };
}());

//------------------------------------------------------------------
//
// This function performs the one-time game initialization.
//
//------------------------------------------------------------------
MYGAME.initialize = (function(graphics) {

  console.log(graphics.Maze());
  
  var myTriangle = graphics.Triangle( {
    center : {x : 150, y : 150 },
    pt1 : { x : 100, y : 100 },
    pt2 : { x : 200, y : 100 },
    pt3 : { x : 150, y : 200 },
    fill : 'rgba(150, 0, 0, 1)',
    stroke : 'rgba(255, 0, 0, 1)',
    lineWidth : 2,
    rotation : 0
  });
  var myBox = graphics.Rectangle( {
    x : 300, y : 100, width : 100, height : 100, 
    fill : 'rgba(255, 150, 50, 1)', 
    stroke : 'rgba(255, 0, 0, 1)',
    rotation : 0
  });

  //------------------------------------------------------------------
  //
  // This is the Game Loop function!
  //
  //------------------------------------------------------------------
  function gameLoop(time) {

    graphics.clear();
    myBox.draw();
    myBox.updateRotation(0.01);
    
    myTriangle.draw();
    myTriangle.updateRotation(0.015);

    requestAnimationFrame(gameLoop);
  }

  return function() {
    console.log('game initializing...');
    requestAnimationFrame(gameLoop); 
  };
}(MYGAME.graphics));
