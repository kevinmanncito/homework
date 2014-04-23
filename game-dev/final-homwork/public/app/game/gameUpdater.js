angular.module('game')

  .factory('Updater', ['Particles', function(Particles) {

    function updateBombs($scope, elapsedTime) {
      var countdownRate = 2;

      if ($scope.game.secondTimer > countdownRate) {
        $scope.game.secondTimer = 0;
        console.log($scope.game.bombs);
        $scope.game.bombs.forEach(function (bomb, index) {
          // -3 means it was diffused
          // -2 means it has already blown
          // -1 means it needs to blow up
          if ($scope.game.bombs[index] > -2)
            $scope.game.bombs[index]--;
          if (bomb === -1) {
            console.log('bomb blew up', index);
          }
        });
      }
    }

    function updateTime($scope, elapsedTime) {
      $scope.game.totalTime += elapsedTime;
      $scope.game.levelTime += elapsedTime;
      $scope.game.secondTimer += elapsedTime;
    }

    function updateClick($scope, coords) {
      console.log(coords);
    }
    
    function update($scope, elapsedTime) {
      updateTime($scope, elapsedTime);
      updateBombs($scope, elapsedTime);
    }

    return {
      update : update,
      updateClick : updateClick
    }

  }]);