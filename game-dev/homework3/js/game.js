COINGAME.initialize = (function initialize(coins, images) {

  var coinSystem = undefined;

  function gameLoop(time) {
    requestAnimationFrame(gameLoop);
  }

  return function() {

    coinSystem = coins.CoinSystem(images);
    coinSystem.drawCoin();
    requestAnimationFrame(gameLoop);
  };

}(COINGAME.coins, COINGAME.images));
