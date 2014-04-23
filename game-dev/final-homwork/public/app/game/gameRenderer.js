angular.module('game')

  .factory('Renderer', ['GameManager', function (GameManager) {
    
    function renderBomb(location, img, context) {
      context.save();
      context.drawImage(
        img, 
        location.x, 
        location.y);
      
      context.restore();
    }

    function renderBombs($scope, context) {
      var location,
          img,
          bombImgs = $scope.game.bombImgs;

      $scope.game.bombs.forEach(function(bomb, index) {
        location = GameManager.getBombLocationFromIndex(index);
        img = GameManager.getBombImgFromValue(bomb, bombImgs);
        renderBomb(location, img, $scope.context);
      });
    }

    function render($scope) {
      $scope.context.clear($scope.canvas);
      renderBombs($scope);
    }

    return {
      render : render
    }
  }]);