COINGAME.coins = (function() {
  'use strict';
  var coinsCanvas = document.getElementById('coinsCanvas');
  var coinsContext = coinsCanvas.getContext('2d');

  var shuffleCoins = function(coinArray) {
    // + Jonas Raoni Soares Silva
    // @ http://jsfromhell.com/array/shuffle [v1.0]
    // http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array-in-javascript
    for(var j, x, i = coinArray.length; i; j = Math.floor(Math.random() * i), x = coinArray[--i], coinArray[i] = coinArray[j], coinArray[j] = x);
    return coinArray;
  }

  var x = -30;
  var y = 0;

  function clear(canvas) {
    coinsContext.clear(canvas);
  };

  function CoinSystem(images, scoreKeeper) {
    var that = {};

    that.currentLevel = false;

    that.previousDropTime = 0;

    that.droppingCoins = [];

    that.coins = {
      levelOne: [],
      levelTwo: [],
      levelThree: []
    };

    that.images = images;

    that.scoreKeeper = scoreKeeper;

    that.getCurrentLevel = function() {
      return that.currentLevel;
    };

    that.setCurrentLevel = function(level) {
      that.currentLevel = level;
    };

    that.update = function(time) {
      // Loop through the dropping coins
      for (var i = 0; i < that.droppingCoins.length; i++) {
        // console.log(that.droppingCoins[i]);
        that.droppingCoins[i].verticalPosition += 1;
      }
      that.renderCoins();
    };

    that.renderCoins = function() {
      clear(coinsCanvas);
      for (var i = 0; i < that.droppingCoins.length; i++) {
        that.drawCoin(that.droppingCoins[i]);
      }
    };

    that.startLevelOne = function() {
      console.log('we just started level one!');
      that.dropCoin();
    };

    that.dropCoin = function() {
      that.previousDropTime = performance.now();
      // Add a coin to the dropping coins stack
      that.droppingCoins.push({
        speed: 1,
        img: that.images['assets/Coin-Roman.png'],
        horizontalPosition: 10,
        verticalPosition: 0,
        height: 50,
        width: 50,
        clicked: false
      });
      var coin = that.droppingCoins[that.droppingCoins.length-1];
      that.drawCoin(coin);
    };

    that.drawCoin = function(coin) {
      coinsContext.beginPath();
      coinsContext.drawImage(
        coin.img,
        coin.horizontalPosition,
        coin.verticalPosition,
        coin.height,
        coin.width
      );
      coinsContext.closePath();
    };

    that.initializeMouseClickEvents = function() {
      // Check if a click landed on a dropping coin
      $('#coinsCanvas').click(function(e) {
        var coords = coinsCanvas.relMouseCoords(e);
        var posX = coords.x;
        var posY = coords.y;
        for (var i = 0; i < that.droppingCoins.length; i++) {
          var coin = that.droppingCoins[i];
          // console.log(coin.horizontalPosition, coin.verticalPosition);
          if (posX >= coin.horizontalPosition && posX <= (coin.horizontalPosition + coin.width)) {
            if (posY >= coin.verticalPosition && posY <= (coin.verticalPosition + coin.height)) {
              that.droppingCoins[i].clicked = true;
            }
          }
        }
      });
    };

    that.reset = function() {
      coinsContext.clear(coinsCanvas);
      that.currentLevel = 1;
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

