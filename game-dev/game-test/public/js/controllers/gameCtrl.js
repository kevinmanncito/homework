angular.module('game')

.controller('gameCtrl', ['$scope', '$http', '$window', function($scope, $http, $window) {
  // $window.location.reload();
  $scope.canvas = document.getElementById('canvas');
  $scope.context = $scope.canvas.getContext('2d');
  
  $scope.title = 'Enter name then click start';
  $scope.hideReset = true;
  $scope.hideStart = false;
  $scope.hideMessage = true;

  $scope.game = {
    player: '',
    level: 1,
    score: 0,
    scoreSaved: false,
    status: false,
    shadedRegion: {
      width: 300,
      x: 50
    },
    marker: {
      direction: 'right',
      pos: 0
    },
    particles: []
  }

  // PARTICLE OBJECTS
  var money = new Image();
  money.src = '/img/yellow.png';
  $scope.money = {
    image: money,
    speed: {mean: 50, stdev: 25},
    lifetime: {mean: 3, stdev: 1}
  };

  $scope.sound = new Audio('/sound/laser-1.mp3');

  // Event handlers
  angular.element($window).on('keydown', function(e) {
    // Space bar event
    if (e.keyCode === 32) {
      var mark = $scope.game.marker.pos,
          shade = $scope.game.shadedRegion.x,
          shadeWidth = $scope.game.shadedRegion.width;

      // Successfull hit
      if (mark >= shade && mark <= (shade+shadeWidth - 5)) {
        $scope.game.level ++;
        if ($scope.game.level > 6)
          $scope.game.level = 6;
        
        for (var i = 0; i < 10; i++) {
          Particles.create(
            $scope.money, 
            {x: $scope.game.marker.pos, y: 35},
            $scope.game.particles
          );
        }

        var multiplier;
        if ($scope.game.level === 1)
          multiplier = 1;
        if ($scope.game.level === 2)
          multiplier = 1.2;
        if ($scope.game.level === 3)
          multiplier = 1.4;
        if ($scope.game.level === 4)
          multiplier = 1.6;
        if ($scope.game.level === 5)
          multiplier = 1.8;
        if ($scope.game.level === 6)
          multiplier = 2;

        $scope.sound.play();
        $scope.game.score += 10 * multiplier;
        $scope.title = 'Level ' + $scope.game.level + ' - Score: ' + $scope.game.score;
        $scope.$apply();
      // Bad hit
      } else {
        $scope.title = "Game over... Hit the enter key to restart";
        $scope.game.status = false;
        $scope.$apply();
        if (!$scope.game.scoreSaved) {
          $scope.saveScore();
        }
        $scope.game.scoreSaved = true;
      }
    }
    // Enter event
    if (e.keyCode === 13) {
      if (!$scope.game.status) {
        $scope.restart();
        $scope.$apply();
      }
    }
  });

  $scope.saveScore = function() {
    var value;
    var hasScore = false;
    for (value in localStorage) {
      if (String(value) === String($scope.game.player)) {
        if (parseInt(localStorage[String(value)]) < parseInt($scope.game.score)) {
          localStorage[String(value)] = $scope.game.score;
        }
        hasScore = true;
      }
    }
    if (!hasScore) {
      localStorage[String($scope.game.player)] = $scope.game.score;
    }
  }

  $scope.restart = function() {
    $scope.game.scoreSaved = false;
    if (!$scope.game.status){
      requestAnimationFrame(gameLoop);
    }
    $scope.hideReset = false;
    $scope.hideStart = true;
    $scope.game.level = 1;
    $scope.game.score = 0;
    $scope.game.status = true;
    $scope.game.marker.direction = 'right';
    $scope.game.marker.pos = 0;
    $scope.game.particles.length = 0;
    $scope.title = 'Level 1 - Score: '+$scope.game.score;
  }

  $scope.start = function(firstTime) {
    $scope.game.scoreSaved = false;
    if ($scope.game.player === '') {
      $scope.game.player = 'Guest';
    }
    $scope.hideReset = false;
    $scope.hideStart = true;
    $scope.hideMessage = false;
    $scope.title = 'Level 1 - Score: '+$scope.game.score;
    $scope.game.status = true;
    if (firstTime) {
      requestAnimationFrame(gameLoop);
    }
  }

  $scope.lastTimeStamp = performance.now();
  
  gameLoop = function(time) {
    elapsedTime = (time - $scope.lastTimeStamp) /1000;
    $scope.lastTimeStamp = time;

    Updater.update($scope, elapsedTime);
    Renderer.render($scope);
    
    if ($scope.game.status)
      requestAnimationFrame(gameLoop);
  }

}]);
