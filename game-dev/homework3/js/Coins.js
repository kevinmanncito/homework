COINGAME.coins = (function() {
  'use strict';
  var coinsCanvas = document.getElementById('coins-canvas');
  var coinsContext = coinsCanvas.getContext('2d');

  var x = 0;
  var y = 0;

  function clear(canvas) {
    context.clear(canvas);
  };

  function CoinSystem(images) {
    coinsContext.clear(coinsCanvas);
    var that = {};

    that.images = images;

    that.startLevelOne = function() {

    }

    that.drawCoin = function() {
      coinsContext.drawImage(
        that.images['assets/Coin-Roman.png'],
        x,
        y,
        50,
        50
      )
    };
    return that;
  };

  return {
    CoinSystem : CoinSystem
  };

}());