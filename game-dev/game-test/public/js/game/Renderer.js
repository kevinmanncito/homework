var Renderer = (function() {

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

  function renderMarker(context, canvas, spec) {
    context.beginPath();
    context.fillStyle="#FFE100";
    context.fillRect(spec,0,5,75);
    context.closePath();

    context.beginPath();
    context.fillStyle="#000000";
    context.rect(spec,0,5,75);
    context.closePath();
    context.stroke();
  }

  function renderShadedRegion(context, canvas, spec) {
    context.beginPath();
    context.fillStyle="#3DE200";
    context.fillRect(spec.x,0,spec.width,75);
    context.closePath();

    context.beginPath();
    context.fillStyle="#000000";
    context.rect(spec.x,0,spec.width,75);
    context.closePath();
    context.stroke();
  }

  function render($scope) {
    $scope.context.clear($scope.canvas);

    
    renderShadedRegion($scope.context, $scope.canvas, $scope.game.shadedRegion);
    Particles.render($scope.game.particles, $scope.context, drawImage);
    renderMarker($scope.context, $scope.canvas, $scope.game.marker.pos);
  }

  return {
    render : render,
    drawImage: drawImage
  };

})();