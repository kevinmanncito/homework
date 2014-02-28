COINGAME.initialize = (function initialize(coins, images, menu) {

  var coinSystem = undefined;
  var gameMenu = undefined;

  function gameLoop(time) {
    // If we are currently playing the game lets update the coin system
    if (coinSystem.getCurrentLevel()) {
      console.log('gameLoop', coinSystem.getCurrentLevel());
      coinSystem.update(time);
    }
    requestAnimationFrame(gameLoop);
  }

  return function() {
    coinSystem = coins.CoinSystem(images);
    coinSystem.initializeMouseClickEvents();
    gameMenu = menu.Menu(coinSystem);
    gameMenu.initializeMenuEvents();
    requestAnimationFrame(gameLoop);
  };

}(COINGAME.coins,
  COINGAME.images,
  COINGAME.menu));
