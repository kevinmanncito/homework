COINGAME.coins = (function() {
  'use strict';
  var coinsCanvas = document.getElementById('coinsCanvas');
  var coinsContext = coinsCanvas.getContext('2d');

  var y2;

  function clear(canvas) {
    coinsContext.clear(canvas);
  };

  // Private methods used in the CoinSystem
  function shuffleCoins(coinArray) {
    // + Jonas Raoni Soares Silva
    // @ http://jsfromhell.com/array/shuffle [v1.0]
    // http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array-in-javascript
    for(var j, x, i = coinArray.length; i; j = Math.floor(Math.random() * i), x = coinArray[--i], coinArray[i] = coinArray[j], coinArray[j] = x);
    return coinArray;
  };

  function newHorizontalPosition() {
    // The range for the coins to drop is 0 - 325 "canvas pixels"
    return Math.floor((Math.random()*325)+1);
  };

  function nextGaussian(mean, stdDev) {
    var x1 = 0,
      x2 = 0,
      y1 = 0,
      z = 0;
    
    do {
      x1 = 2 * Math.random() - 1;
      x2 = 2 * Math.random() - 1;
      z = (x1 * x1) + (x2 * x2);
    } while (z >= 1);
    
    z = Math.sqrt((-2 * Math.log(z)) / z);
    y1 = x1 * z;
    y2 = x2 * z;
    
    return mean + y1 * stdDev;
  };

  function newDropTime() {
    var dropTime = nextGaussian(800, 400);
    return dropTime;
  };

  function newSpeed() {
    var speed = nextGaussian(1.5, .5);
    return speed;
  };

  function CoinSystem(images, scoreKeeper) {
    var that = {};

    that.images = images;

    that.scoreKeeper = scoreKeeper;

    that.currentLevel = false;

    that.nextDropTime = performance.now();

    that.droppingCoins = [];

    that.particles = {};

    that.nextName = 1;

    that.coins = {
      levelOne: [],
      levelTwo: [],
      levelThree: []
    };

    that.getCurrentLevel = function() {
      return that.currentLevel;
    };

    that.setCurrentLevel = function(level) {
      that.currentLevel = level;
    };

    that.update = function(time) {
      // Loop through the dropping coins and update their position
      // by their speed
      for (var i = 0; i < that.droppingCoins.length; i++) {
        if (!that.droppingCoins[i].clicked) {
          that.droppingCoins[i].verticalPosition += that.droppingCoins[i].speed;
        }
      }
      var visibleCoins = false;
      for (var i = 0; i < that.droppingCoins.length; i++) {
        if (that.droppingCoins[i].verticalPosition < 600 && !that.droppingCoins[i].clicked) {
          visibleCoins = true;
        }
      }
      if (!visibleCoins) {
        that.currentLevel = false;
      }
      if (time - that.nextDropTime > 0 && visibleCoins) {
        that.dropCoin();
      }

      that.renderCoins();
    };

    that.renderCoins = function() {
      clear(coinsCanvas);
      for (var i = 0; i < that.droppingCoins.length; i++) {
        if (!that.droppingCoins[i].clicked) {
          that.drawCoin(that.droppingCoins[i]);
        }
      }
    };

    that.startLevelOne = function() {
      console.log('we just started level one!');
      that.currentLevel = 1;
      that.dropCoin();
    };

    that.dropCoin = function() {
      that.nextDropTime = performance.now() + newDropTime();
      // Add a coin to the dropping coins stack
      if (that.coins.levelOne.length !== 0) {
        var posX = newHorizontalPosition();
        var speed = newSpeed();
        var coinToDrop;
        if (that.currentLevel === 1) {
          coinToDrop = that.coins.levelOne.pop();
        }
        if (that.currentLevel === 2) {
          coinToDrop = that.coins.levelTwo.pop();
        }
        if (that.currentLevel === 3) {
          coinToDrop = that.coins.levelThree.pop();
        }
        if (coinToDrop === 'us') {
          that.droppingCoins.push({
            speed: speed,
            img: that.images['assets/Coin-US-Dollary.png'],
            horizontalPosition: posX,
            verticalPosition: -50,
            height: 55,
            width: 55,
            clicked: false,
            value: 10
          });
        } else if (coinToDrop === 'ca') {
          that.droppingCoins.push({
            speed: speed,
            img: that.images['assets/Coin-Canadian-Dollar.png'],
            horizontalPosition: posX,
            verticalPosition: -50,
            height: 120,
            width: 120,
            clicked: false,
            value: 0
          });
        } else if (coinToDrop === 'roman') {
          that.droppingCoins.push({
            speed: speed,
            img: that.images['assets/Coin-Roman.png'],
            horizontalPosition: posX,
            verticalPosition: -50,
            height: 45,
            width: 45,
            clicked: false,
            value: 50
          });
        } else {
          that.droppingCoins.push({
            speed: speed,
            img: that.images['assets/Clock.png'],
            horizontalPosition: posX,
            verticalPosition: -50,
            height: 50,
            width: 50,
            clicked: false,
            value: 'clock'
          });
        }
        var coin = that.droppingCoins[that.droppingCoins.length-1];
        that.drawCoin(coin);
      }
    };

    that.drawCoin = function(coin) {
      coinsContext.save();
      coinsContext.beginPath();
      coinsContext.drawImage(
        coin.img,
        coin.horizontalPosition,
        coin.verticalPosition,
        coin.height,
        coin.width
      );
      coinsContext.closePath();
      coinsContext.restore();
    };

    that.addBonusCoins = function() {
      if (that.currentLevel === 1) {
        
      }
    };

    that.initializeCoinClickEvents = function() {
      // Check if a click landed on a dropping coin
      $('#coinsCanvas').click(function(e) {
        var coords = coinsCanvas.relMouseCoords(e);
        var posX = coords.x;
        var posY = coords.y;
        // We want to count from the most recently added coins (back of array)
        // so that if they are overlapping we get the top one
        // and only one coin can be clicked at a time
        var i = that.droppingCoins.length-1;
        var clicked = false;
        while (i >= 0 && !clicked) {
          var coin = that.droppingCoins[i];
          if (!coin.clicked) {
            if (posX > coin.horizontalPosition && posX < (coin.horizontalPosition + coin.height)) {
              if (posY > coin.verticalPosition && posY < (coin.verticalPosition + coin.width)) {
                that.droppingCoins[i].clicked = true;
                clicked = true;
                scoreKeeper.incrementScore(coin.value);
                if (coin.value === 'clock') {
                  that.addBonusCoins();
                }
              }
            }
          }
          i--;
        }
      });
    };

    that.reset = function() {
      coinsContext.clear(coinsCanvas);
      that.scoreKeeper.setScore(0);
      console.log('reset all coins');
      that.coins = {
        levelOne: [],
        levelTwo: [],
        levelThree: []
      }
      that.droppingCoins = [];
      // Initialize the level one coins
      for (var i = 0; i < 10; i++) {
        that.coins.levelOne.push('us');
      }
      for (var i = 0; i < 3; i++) {
        that.coins.levelOne.push('roman');
      }
      for (var i = 0; i < 5; i++) {
        that.coins.levelOne.push('ca');
      }
      // Shuffle the array
      that.coins.levelOne = shuffleCoins(that.coins.levelOne);
      // Insert the clock into the middle
      var middle = Math.floor(that.coins.levelOne.length/2);
      that.coins.levelOne.splice(that.coins.levelOne.length/2, 0, 'clock');
      // Initialize the level two coins
      for (var i = 0; i < 15; i++) {
        that.coins.levelTwo.push('us');
      }
      for (var i = 0; i < 4; i++) {
        that.coins.levelTwo.push('roman');
      }
      for (var i = 0; i < 10; i++) {
        that.coins.levelTwo.push('ca');
      }
      // Shuffle the array
      that.coins.levelTwo = shuffleCoins(that.coins.levelTwo);
      // Insert the clock into the middle
      var middle = Math.floor(that.coins.levelTwo.length/2);
      that.coins.levelTwo.splice(that.coins.levelTwo.length/2, 0, 'clock');
      // Initialize the level three coins
      for (var i = 0; i < 20; i++) {
        that.coins.levelThree.push('us');
      }
      for (var i = 0; i < 5; i++) {
        that.coins.levelThree.push('roman');
      }
      for (var i = 0; i < 12; i++) {
        that.coins.levelThree.push('ca');
      }
      // Shuffle the array
      that.coins.levelThree = shuffleCoins(that.coins.levelThree);
      // Insert the clock into the middle
      var middle = Math.floor(that.coins.levelThree.length/2);
      that.coins.levelThree.splice(that.coins.levelThree.length/2, 0, 'clock');
      console.log(that.coins);
    };

    return that;
  };

  return {
    CoinSystem : CoinSystem
  };

}());

