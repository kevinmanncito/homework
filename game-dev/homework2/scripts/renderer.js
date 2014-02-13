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
    var mergeGroup = function(group1, group2, maze, size) {
      console.log(group1);
      console.log(group2);
      for (var row = 0; row < size; row++) {
        for (var col = 0; col < size; col++) {
          if (maze[row][col].groupId == group2) {
            maze[row][col].groupId = group1;
          }
        }
      }
      return maze;
    };
    var size = 3;
    var maze = [];
    var directions = ['up', 'right', 'down', 'left'];
    // directions[0] = up
    // directions[1] = right
    // directions[2] = down
    // directions[3] = left
    var id = 1;

    // Initialize the maze array
    // false means there is a wall there
    for (var i = 0; i < size; i++) {
      maze.push([]);
    };
    for (var row = 0; row < size; row++) {
      for (var col = 0; col < size; col++) {
        maze[row].push({
          top:     false,
          right:   false,
          groupId: id
        });
        id++;
      }
    };

    // Use kruskels algorithm to create the maze
    // Each time we loop through there will be one less groupId
    // the maze is done drawing when there is only one group id

    for (var count=0; count < 3; count++) {
    
      // Get two random indices for the row and column
      // and try and get a merge to happen
      var row = Math.floor(Math.random() * size);
      var col = Math.floor(Math.random() * size);

      // If not merged lets do a merge to a random adjacent cell
      // Choose a random direction to merge
      var i = Math.floor(Math.random() * 4);
      var merged = false;
      var availableMergeAttempts = 4;
      while(!merged) {
        if (directions[i] == 'up') {
          console.log('tried to merge up');
          availableMergeAttempts--;

          // Check to make sure were not merging out of the upper wall
          if (row==0) {
            i = 2;
          } else { // If not, check if a merge is available
            if (maze[row][col].groupId != maze[row-1][col].groupId) {
              // Weve got a merge cus the groupId's are different!
              maze = mergeGroup(maze[row][col].groupId,
                                maze[row-1][col].groupId,
                                maze,
                                size);
              console.log('merged up');
              merged = true;
            } else {
              i++;
            }
          }
        }
        if (directions[i] == 'right') {
          console.log('tried to merge right');
          availableMergeAttempts--;
          // Check to make sure were not merging out of the right wall
          if (col==size-1) {
            i = 3;
          } else {
            if (maze[row][col].groupId != maze[row][col+1].groupId) {
              // Weve got a merge cus the groupId's are different!
              maze = mergeGroup(maze[row][col].groupId,
                                maze[row][col+1].groupId,
                                maze,
                                size);
              console.log('merged right');
              merged = true;
            }
          }
        }
        if (directions[i] == 'down') {
          console.log('tried to merge down');
          availableMergeAttempts--;
          if (row==size-1) {
            i=0
          } else {
            if (maze[row][col].groupId != maze[row+1][col].groupId) {
              // Weve got a merge cus the groupId's are different!
              maze = mergeGroup(maze[row][col].groupId,
                                maze[row+1][col].groupId,
                                maze,
                                size);
              console.log('merged up');
              merged = true;
            }
          }
        }
        if (directions[i] == 'left') {
          console.log('tried to merge left');
          availableMergeAttempts--;
          if (col==0) {
            i=1
          } else {
            if (maze[row][col].groupId != maze[row][col+1].groupId) {
              // Weve got a merge cus the groupId's are different!
              maze = mergeGroup(maze[row][col].groupId,
                                maze[row][col+1].groupId,
                                maze,
                                size);
              console.log('merged left');
              merged = true;
            }
          }
        }
        if (availableMergeAttempts == 0) {
          console.log('no available merge attempts for this guy... lets get a new vertex to try merging');
        }
      }
    }

    for (var row = 0; row < size; row++) {
      for (var col = 0; col < size; col++) {
        console.log(maze[row][col]);
      }
    }
    
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


  var maze = graphics.Maze();
  // console.log(maze[0][1]);
  
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
