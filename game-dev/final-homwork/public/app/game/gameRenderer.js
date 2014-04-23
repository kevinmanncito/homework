angular.module('game')

  .factory('Renderer', ['GameManager', 'Particles', function (GameManager, Particles) {
    
    // A generic drawImage function from Dr. Mathias (for the particles)
    function drawImage(context, spec) {
      context.save();
      
      context.translate(spec.center.x, spec.center.y);
      context.rotate(spec.rotation);
      context.translate(-spec.center.x, -spec.center.y);
      
      context.drawImage(
        spec.image, 
        spec.center.x - spec.size/2, 
        spec.center.y - spec.size/2,
        spec.size, spec.size);
      
      context.restore();
    }

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

    function renderParticles(particles, context, draw) {
      Particles.render(particles, context, draw);
    }

    function render($scope) {
      $scope.context.clear($scope.canvas);

      renderBombs($scope);
      renderParticles($scope.game.particles, $scope.context, drawImage);
    }

    return {
      render : render
    }
  }]);