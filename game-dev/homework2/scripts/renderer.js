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

  var canvasExplorer = document.getElementById('canvas-explorer');
  var contextExplorer = canvasExplorer.getContext('2d');

  var canvasPath = document.getElementById('canvas-path');
  var contextPath = canvasPath.getContext('2d');

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
  // The Path object
  //
  //------------------------------------------------------------------
  function Path(maze, size, correctPath) {
    contextPath.clear(canvasPath);
    var that = {};

    that.maze = maze;
    that.size = size;

    that.correctPath = correctPath;

    that.visitedStack = [];
    that.visitedStack.push({row: 0, col: 0});
    that.cellHeight = canvasExplorer.height/size;
    that.cellWidth = canvasExplorer.width/size;

    that.highlightCell = function(color, currentCellIndices) {
      if (color === 'blue') {
        contextPath.fillStyle="#839FC6";
        contextPath.beginPath();
        contextPath.fillRect(currentCellIndices.col*that.cellWidth, currentCellIndices.row*that.cellHeight, that.cellWidth, that.cellHeight);
        contextPath.closePath();
      }
      if (color === 'green') {
        contextPath.fillStyle="#A1DD88";
        contextPath.beginPath();
        contextPath.fillRect(currentCellIndices.col*that.cellWidth, currentCellIndices.row*that.cellHeight, that.cellWidth, that.cellHeight);
        contextPath.closePath();
      }
    };

    that.updateBreadcrumb = function(currentCellIndices) {
      // Check if the current cell indices are in the visited stack
      var inStack = false;
      for (var i = 0; i < that.visitedStack.length; i++) {
        if (that.visitedStack[i].row === currentCellIndices.row && that.visitedStack[i].col === currentCellIndices.col) {
          inStack = true;
        }
      }
      if (!inStack) {
        that.visitedStack.push(currentCellIndices);
      }
    };

    that.updateCorrectPath = function(currentCellIndices) {
      if (that.maze[currentCellIndices.row][currentCellIndices.col].cellId !== size*size*10) {
        if (that.maze[currentCellIndices.row][currentCellIndices.col].cellId === that.correctPath[0].cellId) {
          that.correctPath.shift();
        }
      }
    };

    that.showCorrectPath = function(elapsedTime) {
      var indices = {row: correctPath[0].row, col: correctPath[0].col};
      that.highlightCell('green', indices);
    };

    that.renderPath = function() {
      for (var i = 0; i < that.visitedStack.length; i++) {
        that.highlightCell('blue', that.visitedStack[i]);
      }
      that.highlightCell('green', {row: that.size-1, col: that.size-1})
    };

    return that;
  }
  
  //------------------------------------------------------------------
  //
  // The Explorer object
  //
  //------------------------------------------------------------------
  function Explorer(maze, size) {
    var that = {};

    that.currentX = 0;
    that.currentY = 0;
    that.cellHeight = canvasExplorer.height/size;
    that.cellWidth = canvasExplorer.width/size;
    that.radius = (that.cellWidth/2)-(0.75*(that.cellWidth/2));
    // Reset the visited flag for the score count
    for (var row = 0; row < size-1; row++) {
      for (var col = 0; col < size-1; col++) {
        maze[row][col].visited = false;
      }
    }
    that.maze = maze;
    console.log(that.maze);
    that.score = 0;

    that.findFutureCell = function(direction) {
      // The idea here is that if any part of the circle will be in a different cell we 
      // consider that we are in the new cell
      if (direction === 'left') {
        var yIndex = Math.floor((that.currentX-1-that.radius) / that.cellWidth);
        var xIndex = Math.floor((that.currentY+1+that.radius) / that.cellHeight);
      } else if (direction === 'right') {
        var yIndex = Math.floor((that.currentX+1+that.radius) / that.cellWidth);
        var xIndex = Math.floor((that.currentY+1+that.radius) / that.cellHeight);
      } else if (direction === 'up') {
        var yIndex = Math.floor((that.currentX+1+that.radius) / that.cellWidth);
        var xIndex = Math.floor((that.currentY-1-that.radius) / that.cellHeight);
      } else if (direction === 'down') {
        var yIndex = Math.floor((that.currentX+1+that.radius) / that.cellWidth);
        var xIndex = Math.floor((that.currentY+1+that.radius) / that.cellHeight);
      } else {
        var yIndex = Math.floor((that.currentX+1+that.radius) / that.cellWidth);
        var xIndex = Math.floor((that.currentY+1+that.radius) / that.cellHeight);
      }
      return {row: xIndex, col: yIndex};
    };

    that.findCurrentCell = function() {
      var col = Math.floor((that.currentX) / that.cellWidth);
      var row = Math.floor((that.currentY) / that.cellHeight);
      // Calculate the score
      if (that.maze[row][col].inPath && !that.maze[row][col].visited) {
        console.log('adding 3');
        that.score = that.score + 3;
      }
      if (!that.maze[row][col].inPath && !that.maze[row][col].visited){
        console.log('removing 1');
        that.score = that.score - 1
      }
      that.maze[row][col].visited = true;
      return {row: row, col: col};
    };

    that.checkMove = function(direction) {
      var canMove = true;
      var futureCellIndices = that.findFutureCell(direction);
      var currentCellIndices = that.findCurrentCell();

      // This forces the explorer to respect the entire perimiter
      if (futureCellIndices.row < 0 || futureCellIndices.col < 0) {
        return false;
      }
      if (futureCellIndices.row > size-1 || futureCellIndices.col > size-1) {
        return false;
      }
      if (direction === 'right') {
        if (currentCellIndices.col === futureCellIndices.col) {
          canMove = true;
        } else {
          if (that.maze[currentCellIndices.row][currentCellIndices.col].right) {
            canMove = true;
          } else {
            canMove = false;
          }
        }
      } else if (direction === 'left') {
        if (currentCellIndices.col === futureCellIndices.col) {
          canMove = true;
        } else {
          if (that.maze[futureCellIndices.row][futureCellIndices.col].right) {
            canMove = true;
          } else {
            canMove = false;
          }
        }
      } else if (direction === 'up') {
        if (currentCellIndices.row === futureCellIndices.row) {
          canMove = true;
        } else {
          if (that.maze[currentCellIndices.row][currentCellIndices.col].top) {
            canMove = true;
          } else {
            canMove = false;
          }
        }
      } else if (direction === 'down') {
        if (currentCellIndices.row === futureCellIndices.row) {
          canMove = true;
        } else {
          if (that.maze[futureCellIndices.row][futureCellIndices.col].top) {
            canMove = true;
          } else {
            canMove = false;
          }
        }
      }

      return canMove;
    };

    that.createAndDrawExplorer = function() {
      contextExplorer.clear(canvasExplorer);
      that.currentX = that.cellHeight/2;
      that.currentY = that.cellHeight/2;
      contextExplorer.fillStyle="#DBB141";
      contextExplorer.beginPath();
      contextExplorer.arc(that.currentX, that.currentY, that.radius, 0, 2*Math.PI);
      contextExplorer.closePath();
      contextExplorer.fill();
      contextExplorer.stroke();
    };

    that.moveRight = function(elapsedTime) {
      if (that.checkMove('right')) {
        contextExplorer.clear(canvasExplorer);
        contextExplorer.fillStyle="#DBB141";
        contextExplorer.beginPath();
        that.currentX = that.currentX + 2;
        contextExplorer.arc(that.currentX, that.currentY, that.radius, 0, 2*Math.PI);
        contextExplorer.closePath();
        contextExplorer.fill();
        contextExplorer.stroke();
      }
    };

    that.moveLeft = function(elapsedTime) {
      if (that.checkMove('left')) {
        contextExplorer.clear(canvasExplorer);
        contextExplorer.fillStyle="#DBB141";
        contextExplorer.beginPath();
        that.currentX = that.currentX - 2;
        contextExplorer.arc(that.currentX, that.currentY, that.radius, 0, 2*Math.PI);
        contextExplorer.closePath();
        contextExplorer.fill();
        contextExplorer.stroke();
      }
    };

    that.moveUp = function(elapsedTime) {
      if (that.checkMove('up')) {
        contextExplorer.clear(canvasExplorer);
        contextExplorer.fillStyle="#DBB141";
        contextExplorer.beginPath();
        that.currentY = that.currentY - 2;
        contextExplorer.arc(that.currentX, that.currentY, that.radius, 0, 2*Math.PI);
        contextExplorer.closePath();
        contextExplorer.fill();
        contextExplorer.stroke();
      }
    };

    that.moveDown = function(elapsedTime) {
      if (that.checkMove('down')) {
        contextExplorer.clear(canvasExplorer);
        contextExplorer.fillStyle="#DBB141";
        contextExplorer.beginPath();
        that.currentY = that.currentY + 2;
        contextExplorer.arc(that.currentX, that.currentY, that.radius, 0, 2*Math.PI);
        contextExplorer.closePath();
        contextExplorer.fill();
        contextExplorer.stroke();
      }
    };

    that.getScore = function() {
      return that.score;
    };

    return that;
  }

  //------------------------------------------------------------------
  //
  // The maze object
  //
  //------------------------------------------------------------------
  function Maze() {
    var that = {};

    //------------------------------------------------------------------
    //
    // Method that creates and returns the 2D maze array (array filled with
    // cell objects)
    //
    //------------------------------------------------------------------
    that.createMaze = function(size) {
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
            inPath:  false,
            row:     row,
            col:     col 
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
    };

    //------------------------------------------------------------------
    //
    // Method that draws the maze to the canvas
    //
    //------------------------------------------------------------------
    that.drawMaze = function(maze, size) {
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
    };

    //------------------------------------------------------------------
    //
    // Method that returns a list of cell objects in the correct path
    //
    //------------------------------------------------------------------
    that.solveMaze = function(maze, size) {
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
      
    };


    return that;
  }

  return {
    Maze : Maze,
    Explorer : Explorer,
    Path : Path
  };
}());

//------------------------------------------------------------------
//
// This function performs the one-time game initialization.
//
//------------------------------------------------------------------
MYGAME.initialize = (function initialize(graphics, images, input, size) {

  var size = size;
  var lastTimeStamp = performance.now();
  var done = false;

  // Maze stuff
  var maze = graphics.Maze();
  var mazeArray = maze.createMaze(size);
  maze.drawMaze(mazeArray, size);
  var solution = maze.solveMaze(mazeArray, size);

  // Explorer stuff
  var explorer = graphics.Explorer(mazeArray, size);
  explorer.createAndDrawExplorer();

  // Path stuff
  var path = graphics.Path(mazeArray, size, solution);

  // Input stuff
  var keyboard = input.Keyboard();

  document.getElementById('credits').onclick = function(e) {
    alert('This game was made by Kevin Mann');
  }

  document.getElementById('highScores').onclick = function(e) {
    alert('This game was made by Kevin Mann');
  }

  // function resetGame(newSize) {
  //   lastTimeStamp = performance.now();
  //   done = false;
  //   maze = graphics.Maze();
  //   mazeArray = maze.createMaze(newSize);
  //   maze.drawMaze(mazeArray, newSize);
  //   solution = maze.solveMaze(mazeArray, newSize);
  //   explorer = graphics.Explorer(mazeArray, newSize);
  //   explorer.createAndDrawExplorer();
  //   path = graphics.Path(mazeArray, newSize, solution);
  // }
  document.getElementById('newGame').onclick = function(e) {
    e.preventDefault();
    var radios = document.getElementsByName('difficulty');
    var difficulty = "";
    for (var i = 0, length = radios.length; i < length; i++) {
      if (radios[i].checked) {
        difficulty = radios[i].value;
        break;
      }
    }
    MYGAME.initialize();
  }

  //------------------------------------------------------------------
  //
  // This is the Game Loop function!
  //
  //------------------------------------------------------------------
  function gameLoop(time) {

    elapsedTime = time - lastTimeStamp;
    lastTimeStamp = time;

    keyboard.update(elapsedTime);

    var currentIndices = explorer.findCurrentCell();
    if (currentIndices.row === size-1 && currentIndices.col === size-1 && !done) {
      done = true;
      alert("You finished! Your score was: " + explorer.getScore());
      window.location.reload(true);
    }
    path.updateBreadcrumb(currentIndices);
    path.updateCorrectPath(currentIndices);
    path.renderPath();

    if (!done) {
      requestAnimationFrame(gameLoop);
    }
  }

  return function() {
    console.log('game initializing...');

    keyboard.registerCommand(KeyEvent.DOM_VK_LEFT, explorer.moveLeft);
    keyboard.registerCommand(KeyEvent.DOM_VK_RIGHT, explorer.moveRight);
    keyboard.registerCommand(KeyEvent.DOM_VK_UP, explorer.moveUp);
    keyboard.registerCommand(KeyEvent.DOM_VK_DOWN, explorer.moveDown);
    keyboard.registerCommand(KeyEvent.DOM_VK_H, path.showCorrectPath);

    requestAnimationFrame(gameLoop); 
  };
}(MYGAME.graphics, MYGAME.images, MYGAME.input, 10));
