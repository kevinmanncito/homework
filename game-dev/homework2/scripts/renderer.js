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
  
  // var canvas = document.getElementById('canvas-main');
  // var context = canvas.getContext('2d');

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
  // function clear() {
  //   context.clear();
  // }
  
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

  function Maze(size) {
    var mergeGroup = function(group1, group2, maze, size) {
      for (var row = 0; row < size; row++) {
        for (var col = 0; col < size; col++) {
          if (maze[row][col].groupId == group2) {
            maze[row][col].groupId = group1;
          }
        }
      }
      return maze;
    };
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
          groupId: id,
          cellId:  id*10
        });
        id++;
      }
    };

    // Use kruskels algorithm to create the maze
    // Each time we loop through there will be one less groupId
    // the maze is done drawing when there is only one group id

    for (var count=0; count < size*size + 1; count++) {
      console.log('merge #: ' + String(count+1));
    
      // Get two random indices for the row and column
      // and try and get a merge to happen
      var row = Math.floor(Math.random() * size);
      var col = Math.floor(Math.random() * size);


      // If not merged lets do a merge to a random adjacent cell
      // Choose a random direction to merge
      var i = Math.floor(Math.random() * 4);
      var merged = false;
      var availableMergeAttempts = 4;
      var availableMergeSpots = size*size+1;
      var done = false;
      while(!merged && !done) {
        if (directions[i] == 'up') {
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
              maze[row][col].top = true;
              merged = true;
            } else {
              i++;
            }
          }
        }
        if (directions[i] == 'right') {
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
              maze[row][col].right = true;
              merged = true;
            }
          }
        }
        if (directions[i] == 'down') {
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
              maze[row+1][col].top = true;
              merged = true;
            }
          }
        }
        if (directions[i] == 'left') {
          availableMergeAttempts--;
          if (col==0) {
            i=1
          } else {
            if (maze[row][col].groupId != maze[row][col-1].groupId) {
              // Weve got a merge cus the groupId's are different!
              maze = mergeGroup(maze[row][col].groupId,
                                maze[row][col-1].groupId,
                                maze,
                                size);
              maze[row][col-1].right = true;
              merged = true;
            }
          }
        }
        if (availableMergeAttempts == 0) {
          // We will move one to the right or if we are at the very last spot of the maze
          // we will make the row and col both equal 0
          if (row == size-1 && col == size-1) {
            row = 0;
            col = 0;
          } else if (col == size-1 && row != size-1) {
            row++;
            col=0;
          } else if (col != size-1 && row == size-1) {
            row=0;
            col++;
          } else { //col != size-1 && row != size-1
            row++;
          }
          availableMergeAttempts = 4;
          availableMergeSpots--;
          if (availableMergeSpots == 0) {
            done = true;
          }
        }
      }
    }

    // for (var row = 0; row < size; row++) {
    //   for (var col = 0; col < size; col++) {
    //     console.log(maze[row][col]);
    //   }
    // }
    
    return maze;
  }

  function drawMaze(maze, size) {
    // context.clear();
    var canvas = document.getElementById('canvas-main');
    var context = canvas.getContext('2d');

    var cellHeight = canvas.height/size;
    var cellWidth = canvas.width/size;

    // Draw a top wall: moveTo(x, y)
    // context.moveTo(0, 0);
    // context.lineTo(125, 0);

    // context.moveTo(125, 0);
    // context.lineTo(250, 0);

    // context.moveTo(250, 0);
    // context.lineTo(375, 0);

    // context.moveTo(375, 0);
    // context.lineTo(500, 0);

    // // Draw a right wall
    // context.moveTo(150, 0);
    // context.lineTo(150, 150);

    var count = 1;
    for (var y = 0; y < size; y++) {
      for (var x = 0; x < size; x++) {
        if (!maze[y][x].top) {
          // console.log('TOP WALL ' + 'row ' + String(y) + ' ' + 'col ' + String(x) + ' count ' + String(count));
          // console.log('moveTo: ' + String(x*cellWidth) + ' ' + String(y * cellHeight));
          // console.log('lineTo: ' + String((x+1)*cellWidth) + ' ' + String(y * cellHeight));
          context.moveTo(x * cellWidth, y * cellHeight);
          context.lineTo((x+1) * cellWidth, y * cellHeight);
          // console.log('Drew a top wall!!!!!')
        }
        console.log(maze[y][x]);
        if (!maze[y][x].right) {
          // console.log('RIGHT WALL' + String(maze[y][x].cellId));
          // console.log('moveTo: ' + String((x+1)*cellWidth) + ' ' + String(y * cellHeight));
          // console.log('lineTo: ' + String((x+1)*cellWidth) + ' ' + String((y+1) * cellHeight));
          context.moveTo((x+1) * cellWidth, y * cellHeight);
          context.lineTo((x+1) * cellWidth, (y+1) * cellHeight);
        }
        count++;
      }
    }

    context.lineWidth = 2;
    context.stroke();
  }

  return {
    Maze : Maze,
    drawMaze : drawMaze
  };
}());

//------------------------------------------------------------------
//
// This function performs the one-time game initialization.
//
//------------------------------------------------------------------
MYGAME.initialize = (function(graphics) {


  var maze = graphics.Maze(5);
  graphics.drawMaze(maze, 5);
  // console.log(maze[0][1]);
  
  // var myTriangle = graphics.Triangle( {
  //   center : {x : 150, y : 150 },
  //   pt1 : { x : 100, y : 100 },
  //   pt2 : { x : 200, y : 100 },
  //   pt3 : { x : 150, y : 200 },
  //   fill : 'rgba(150, 0, 0, 1)',
  //   stroke : 'rgba(255, 0, 0, 1)',
  //   lineWidth : 2,
  //   rotation : 0
  // });
  // var myBox = graphics.Rectangle( {
  //   x : 300, y : 100, width : 100, height : 100, 
  //   fill : 'rgba(255, 150, 50, 1)', 
  //   stroke : 'rgba(255, 0, 0, 1)',
  //   rotation : 0
  // });

  //------------------------------------------------------------------
  //
  // This is the Game Loop function!
  //
  //------------------------------------------------------------------
  function gameLoop(time) {

    // graphics.clear();
    // myBox.draw();
    // myBox.updateRotation(0.01);
    
    // myTriangle.draw();
    // myTriangle.updateRotation(0.015);

    requestAnimationFrame(gameLoop);
  }

  return function() {
    console.log('game initializing...');
    requestAnimationFrame(gameLoop); 
  };
}(MYGAME.graphics));
