angular.module('game')

  .factory('Updater', ['Particles', 'GameManager', function(Particles, GameManager) {

    function updateBombs($scope, elapsedTime) {
      var countdownRate = 3;

      if ($scope.game.secondTimer > countdownRate) {
        $scope.game.secondTimer = 0;
        $scope.game.bombs.forEach(function (bomb, index) {
          // -3 means it was diffused
          // -2 means it has already blown
          // -1 means it needs to blow up
          if ($scope.game.bombs[index] > -2)
            $scope.game.bombs[index]--;
          if (bomb === 0) {
            if ($scope.game.prevSound === 0) {
              $scope.sound1.play();
              $scope.game.prevSound = 1;
            } else {
              $scope.sound2.play();
              $scope.game.prevSound = 0;
            }
            for (var i = 0; i < 10; i++) {
              Particles.create(
                $scope.game.bombImgs.fire, 
                GameManager.getBombLocationFromIndex(index),
                $scope.game.particles);
              Particles.create(
                $scope.game.bombImgs.smoke, 
                GameManager.getBombLocationFromIndex(index),
                $scope.game.particles);
            }
          }
        });
      }
    }

    function updateTime($scope, elapsedTime) {
      if (elapsedTime > 1) {
        elapsedTime = 0.03;
      }
      $scope.game.totalTime += elapsedTime;
      $scope.game.levelTime += elapsedTime;
      $scope.game.secondTimer += elapsedTime;
    }

    function updateClick($scope, coords) {
      $scope.game.bombs.forEach(function (bomb, index) {
        if (GameManager.checkForBombClick(index, coords)) {
          if (bomb !== -1 && bomb !== -2 && bomb !== -3) {
            $scope.game.bombs[index] = -3;
            $scope.game.levelScore += bomb;
            $scope.game.updateAngular = true;
            $scope.message = "Score: " + $scope.game.levelScore + " Level: " + $scope.game.level;
          }
        }
      });
    }

    function updateLevel($scope) {
      // Check if all bombs are diffused or blown up
      var allGone = true;
      $scope.game.bombs.forEach(function (bomb, index) {
        if (bomb >= -1) {
          allGone = false;
        }
      });
      if (allGone) {
        GameManager.saveLevelScore($scope.game.levelScore, 
                                   $scope.game.level,
                                   $scope.game.player);
        $scope.game.status = false;
        // Check if any bombs exploded
        $scope.game.bombs.forEach(function (bomb, index) {
          if (bomb === -2) {
            $scope.game.continueToNextLevel = false;
          }
        });
        $scope.game.totalTime += $scope.game.levelTime;
        $scope.game.totalScore += $scope.game.levelScore;
        if ($scope.game.continueToNextLevel) {
          if ($scope.game.level !== 5) {
            $scope.message = "You completed level " + $scope.game.level + " with a score of " + $scope.game.levelScore;
            $scope.hideContinue = false;
          } else {
            $scope.message = "You have completed the game with a score of " + $scope.game.totalScore + "! Click start to play again.";
            $scope.hideInput = false;
            $scope.hideContinue = true;
          }
        // Game over
        } else {
          $scope.message = "Game over... You scored: " + $scope.game.totalScore + ". Click start to play again.";
          $scope.hideInput = false;
        }
        $scope.game.level++;
        $scope.game.totalScore += $scope.game.levelScore;
        $scope.game.levelScore = 0;
        $scope.game.totalTime += $scope.game.levelTime;
        $scope.game.levelTime = 0;
        $scope.game.updateAngular = true;
      }
    }

    function updateParticles(particles, elapsedTime) {
      Particles.update(particles, elapsedTime);
    }
    
    function update($scope, elapsedTime) {
      updateTime($scope, elapsedTime);
      updateBombs($scope, elapsedTime);
      updateLevel($scope);
      updateParticles($scope.game.particles, elapsedTime);
    }

    return {
      update : update,
      updateClick : updateClick
    }

  }]);