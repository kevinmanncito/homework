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
    $scope.lastTimeStamp = performance.now();

    $scope.game = GameManager.newGame();
    $scope.game.bombs = GameManager.getBombs($scope.game.level);

    $scope.start = function() {
      if ($scope.game.player === '') {
        $scope.game.player = 'Guest';
      }
      $scope.hideInput = true;
      $scope.message = "Score: " + $scope.game.score;
      
      // Development
      requestAnimationFrame(gameLoop);
      $scope.game.status = true;
      
      // Production
      // $scope.message = 'Get ready!';
      // setTimeout(function () {
      //   $scope.message = "3";
      //   $scope.$apply();
      // }, 1000);
      // setTimeout(function () {
      //   $scope.message = "2";
      //   $scope.$apply();
      // }, 2000);
      // setTimeout(function () {
      //   $scope.message = "1";
      //   $scope.$apply();
      // }, 3000);
      // setTimeout(function () {
      //   $scope.message = "Go!";
      //   $scope.$apply();
      // }, 4000);
      // setTimeout(function () {
      //   $scope.message = "Score: " + $scope.game.score;
      //   $scope.$apply();
      //   requestAnimationFrame(gameLoop);
      //   $scope.game.status = true;
      // }, 5000);
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
      
      if ($location.url() === '/game')
        requestAnimationFrame(gameLoop);
      // console.log($scope.game.totalTime);
    };
    
  }]);
