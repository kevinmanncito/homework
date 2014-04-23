angular.module('game')

  .controller('gameCtrl', [
      '$scope', 
      '$location', 
      'Updater', 
      'Renderer', 
      'Particles', 
      'GameManager', 
    function(
      $scope, 
      $location, 
      Updater,
      Renderer,
      Particles,
      GameManager
  ) {
    // CANVAS ELEMENTS
    $scope.canvas = document.getElementById('canvas');
    $scope.context = $scope.canvas.getContext('2d');

    $scope.message = 'Enter your name and click start!';
    $scope.hideInput = false;
    $scope.hideContinue = true;
    $scope.lastTimeStamp = performance.now();
    $scope.sound1 = new Audio('/sound/explosion-1.mp3');
    $scope.sound2 = new Audio('/sound/explosion-2.mp3');

    $scope.start = function() {
      $scope.game = GameManager.newGame();
      $scope.game.bombs = GameManager.getBombs($scope.game.level);

      if ($scope.game.player === '') {
        $scope.game.player = 'Guest';
      }
      $scope.hideInput = true;
      $scope.message = "Score: " + $scope.game.levelScore + " Level: " + $scope.game.level;
      
      // Development
      // $scope.game.status = true;
      // $scope.game.secondTimer = 0;
      // requestAnimationFrame(gameLoop);
      
      // Production
      $scope.message = 'Get ready!';
      setTimeout(function () {
        $scope.message = "3";
        $scope.$apply();
      }, 1000);
      setTimeout(function () {
        $scope.message = "2";
        $scope.$apply();
      }, 2000);
      setTimeout(function () {
        $scope.message = "1";
        $scope.$apply();
      }, 3000);
      setTimeout(function () {
        $scope.message = "Go!";
        $scope.$apply();
      }, 4000);
      setTimeout(function () {
        $scope.message = "Score: " + $scope.game.levelScore + " Level: " + $scope.game.level;
        $scope.game.status = true;
        $scope.game.secondTimer = 0;
        $scope.$apply();
        requestAnimationFrame(gameLoop);
      }, 5000);

      // In case this is a restart
      if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
        $scope.$apply();
      }
    };

    $scope.continueLevel = function() {
      $scope.game.secondTimer = 0;
      $scope.game.bombs.length = 0;
      $scope.game.bombs = GameManager.getBombs($scope.game.level);
      if ($scope.game.player === '') {
        $scope.game.player = 'Guest';
      }
      $scope.hideInput = true;
      $scope.message = "Score: " + $scope.game.levelScore + " Level: " + $scope.game.level;
      
      // Development
      requestAnimationFrame(gameLoop);
      $scope.game.status = true;
    };
    
    $scope.diffuseBomb = function($event) {
      Updater.updateClick($scope,
                          $scope.canvas.relMouseCoords($event));
    };

    gameLoop = function(time) {
      elapsedTime = (time - $scope.lastTimeStamp) /1000;
      $scope.lastTimeStamp = time;

      Updater.update($scope, elapsedTime);
      Renderer.render($scope);
      
      if ($scope.game.updateAngular) {
        $scope.$apply();
        $scope.game.updateAngular = false;
      }

      if ($location.url() === '/game' && $scope.game.status === true) {
        requestAnimationFrame(gameLoop);
      }
    };
    
  }]);
