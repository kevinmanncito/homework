COINGAME.initialize = (function initialize(coins, images, menu, score) {

  var coinSystem = undefined;
  var gameMenu = undefined;
  var scoreKeeper = undefined;

  function gameLoop(time) {
    
    if (coinSystem.getGameStatus() && !coinSystem.findOutIfCoinsAreFalling()) {
      coinSystem.prepareForNextLevel();
      gameMenu.levelTransition();
    }

    // If we are currently playing the game (on a level)
    // lets update the coin system
    if (coinSystem.findOutIfCoinsAreFalling()) {
      coinSystem.update(time);
      scoreKeeper.update(time);
    }
      

    requestAnimationFrame(gameLoop);
  }

  return function() {
    scoreKeeper = score.ScoreKeeper();
    
    coinSystem = coins.CoinSystem(images, scoreKeeper);
    coinSystem.initializeCoinClickEvents();

    gameMenu = menu.Menu(coinSystem, scoreKeeper);
    gameMenu.initializeMenuEvents();

    requestAnimationFrame(gameLoop);
  };

}(COINGAME.coins,
  COINGAME.images,
  COINGAME.menu,
  COINGAME.score));
