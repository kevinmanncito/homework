COINGAME.initialize = (function initialize(coins, images, menu, score) {

  var coinSystem = undefined;
  var gameMenu = undefined;
  var scoreKeeper = undefined;

  function gameLoop(time) {
    
    scoreKeeper.update(time);
    gameMenu.update(time);
    
    console.log(coinSystem.getGameStatus(), coinSystem.findOutIfCoinsAreFalling(), gameMenu.isTransitionTime());

    if (coinSystem.getGameStatus() && !coinSystem.findOutIfCoinsAreFalling()) {
      
      if (gameMenu.isTransitionTime()) {
        console.log('transitioning');
        gameMenu.levelTransition();
        gameMenu.toggleTransitionTime();
        coinSystem.prepareForNextLevel();
      }
    }

    // If we are currently playing the game (on a level)
    // lets update the coin system
    if (coinSystem.findOutIfCoinsAreFalling()) {
      coinSystem.update(time);
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
