Game1 = {
  lastTimeStamp: performance.now(),
  gameLoop: function(time) {
    console.log(time);
    requestAnimationFrame(Game1.gameLoop);
  }
};

Game1.initialize = function() {
  requestAnimationFrame(Game1.gameLoop);
};

Game1.initialize();