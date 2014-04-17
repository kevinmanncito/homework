var Updater = (function() {

  function updateMarker (marker, level) {
    var markerSpeed = 8;
    if (marker.direction === 'left') {
      marker.pos -= markerSpeed;
    }
    if (marker.direction === 'right') {
      marker.pos += markerSpeed;
    }
    if (marker.pos > 395 && marker.direction === 'right') {
      marker.direction = 'left';
    }
    if (marker.pos < 0 && marker.direction === 'left') {
      marker.direction = 'right';
    }
  }

  function updateShadedRegion(game) {
    if (game.level === 1) {
      game.shadedRegion.width = 240;
      game.shadedRegion.x = 80;
    }
    if (game.level === 2) {
      game.shadedRegion.width = 200;
      game.shadedRegion.x = 100;
    }
    if (game.level === 3) {
      game.shadedRegion.width = 160;
      game.shadedRegion.x = 120;
    }
    if (game.level === 4) {
      game.shadedRegion.width = 120;
      game.shadedRegion.x = 140;
    }
    if (game.level === 5) {
      game.shadedRegion.width = 80;
      game.shadedRegion.x = 160;
    }
    if (game.level === 6) {
      game.shadedRegion.width = 40;
      game.shadedRegion.x = 180;
    }
  }

  function updateParticles(particles, elapsedTime) {
    Particles.update(particles, elapsedTime);
  }

  function update ($scope, elapsedTime) {
    updateParticles($scope.game.particles, elapsedTime);
    updateMarker($scope.game.marker, $scope.game.level);
    updateShadedRegion($scope.game);
  }

  return {
    update : update
  };

})();