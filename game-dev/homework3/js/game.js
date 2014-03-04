COINGAME.initialize = (function initialize(coins, images, menu, score, particles) {

  var coinSystem = undefined;
  var particleSystem = undefined;
  var gameMenu = undefined;
  var scoreKeeper = undefined;

  function gameLoop(time) {
    
    scoreKeeper.update(time);
    gameMenu.update(time);
    
    if (coinSystem.getGameStatus() && !coinSystem.findOutIfCoinsAreFalling()) {
      
      if (gameMenu.isTransitionTime()) {
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

    //
    // Compute elapsed time in seconds
    var elapsedTime = (time - COINGAME.lastTimeStamp) / 1000;
    COINGAME.lastTimeStamp = time;

    // Always update the particle system
    particleSystem.update(elapsedTime);

    requestAnimationFrame(gameLoop);
  }

  return function() {
    scoreKeeper = score.ScoreKeeper();

    particleSystem = particles.ParticleSystem( {
      image: images['assets/Dollar-Sign.png'],
      speed: {mean: 60, stdev: 20},
      lifetime: {mean: 1.75, stdev: 0.5}
    });

    coinSystem = coins.CoinSystem(images, scoreKeeper, particleSystem);
    coinSystem.initializeCoinClickEvents();

    gameMenu = menu.Menu(coinSystem, scoreKeeper);
    gameMenu.initializeMenuEvents();

    requestAnimationFrame(gameLoop);
  };

}(COINGAME.coins,
  COINGAME.images,
  COINGAME.menu,
  COINGAME.score,
  COINGAME.particles));
