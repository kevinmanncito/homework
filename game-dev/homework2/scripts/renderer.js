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
  
  var canvasMaze = document.getElementById('canvas-maze');
  var contextMaze = canvasMaze.getContext('2d');

  var canvasExplorer = document.getElementById('canvas-maze');
  var contextExplorer = canvasExplorer.getContext('2d');

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
  // Public function that allows the client code to clear the canvas.
  //
  //------------------------------------------------------------------
  function clear(canvas) {
    context.clear(canvas);
  }
  
  //------------------------------------------------------------------
  //
  // The explorer object
  //
  //------------------------------------------------------------------
  function Explorer(maze, size) {
    var that = {};

    that.move = function(direction, currentX, currentY) {

    };

    return that;
  }

  //------------------------------------------------------------------
  //
  // The maze object
  //
  //------------------------------------------------------------------

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
          cellId:  id*10,
          visited: false,
          inPath:  false
        });
        id++;
      }
    };

    // Use kruskels algorithm to create the maze
    // Each time we loop through there will be one less groupId
    // the maze is done drawing when there is only one group id
    var mergeCount = 0;
    while (mergeCount < size*size-1) {
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
              mergeCount++;
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
              mergeCount++;
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
              mergeCount++;
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
              mergeCount++;
            }
          }
        }
        if (availableMergeAttempts == 0) {
          // We will move one to the right or if we are at the very last spot of the maze
          // we will make the row and col both equal 0
          if (col != size-1) {
            col++;
          } else if (row != size-1 && col == size-1) {
            row++;
            col=0;
          } else if (row == size-1 && col == size-1) {
            col=0;
            row=0;
          }

          availableMergeAttempts = 4;
          availableMergeSpots--;
          if (availableMergeSpots == 0) {
            done = true;
          }
        }
      }
    }
    
    return maze;
  }

  function drawMaze(maze, size) {
    contextMaze.clear(canvasMaze);
    var cellHeight = canvasMaze.height/size;
    var cellWidth = canvasMaze.width/size;

    for (var y = 0; y < size; y++) {
      for (var x = 0; x < size; x++) {
        // If we are on a far left column cell lets draw a left wall
        if (x == 0) {
          contextMaze.moveTo(x * cellWidth, y * cellHeight);
          contextMaze.lineTo(x * cellWidth, (y+1) * cellHeight);
        }
        // If we are on the bottom row lets draw a bottom wall
        if (y == size-1) {
          contextMaze.moveTo(x * cellWidth, (y+1) * cellHeight);
          contextMaze.lineTo((x+1) * cellWidth, (y+1) * cellHeight);
        }
        if (!maze[y][x].top) {
          contextMaze.moveTo(x * cellWidth, y * cellHeight);
          contextMaze.lineTo((x+1) * cellWidth, y * cellHeight);
        }
        if (!maze[y][x].right) {
          contextMaze.moveTo((x+1) * cellWidth, y * cellHeight);
          contextMaze.lineTo((x+1) * cellWidth, (y+1) * cellHeight);
        }
      }
    }
    contextMaze.lineWidth = 2;
    contextMaze.stroke();
  }

  function solveMaze(maze, size) {
    var solutionQueue = [];

    var findEndCell = function(row, col) {

      var inPath = false;
      maze[row][col].visited = true;
      if (row==size-1 && col==size-1) {
        maze[row][col].inPath = true;
        inPath = true;
      }
      // Explore up
      if (row != 0) {
        if (maze[row][col].top) {
          if (!maze[row-1][col].visited) {
            if (findEndCell(row-1, col)) {
              inPath = true;
            }
          }
        }
      }
      // Explore right
      if (col != size-1) {
        if (maze[row][col].right) {
          if (!maze[row][col+1].visited) {
            if(findEndCell(row, col+1)) {
              inPath = true;
            }
          }
        }
      }
      // Explore down
      if (row != size-1) {
        if (maze[row+1][col].top) {
          if (!maze[row+1][col].visited) {
            if (findEndCell(row+1, col)) {
              inPath = true;
            }
          }
        }
      }
      // Explore left
      if (col != 0) {
        if (maze[row][col-1].right) {
          if (!maze[row][col-1].visited) {
            if (findEndCell(row, col-1)) {
              inPath = true;
            }
          }
        }
      }
      if (inPath) {
        maze[row][col].inPath = true;
        solutionQueue.unshift(maze[row][col]);
      }

      return inPath;

    };

    findEndCell(0, 0);

    return solutionQueue;

  }

  return {
    Maze : Maze,
    Explorer : Explorer,
    drawMaze : drawMaze,
    solveMaze : solveMaze
  };
}());

//------------------------------------------------------------------
//
// This function performs the one-time game initialization.
//
//------------------------------------------------------------------
MYGAME.initialize = (function initialize(graphics, images, input) {


  var maze = graphics.Maze(10);
  graphics.drawMaze(maze, 10);

  var explorer = graphics.Explorer(maze, 10);

  var solution = graphics.solveMaze(maze, 10);

  var keyboard = input.Keyboard();

  var lastTimeStamp = performance.now();


  //------------------------------------------------------------------
  //
  // This is the Game Loop function!
  //
  //------------------------------------------------------------------
  function gameLoop(time) {

    elapsedTime = time - lastTimeStamp;
    lastTimeStamp = time;

    keyboard.update(elapsedTime);
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
}(MYGAME.graphics, MYGAME.images, MYGAME.input));
