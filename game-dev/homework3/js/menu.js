COINGAME.menu = (function() {
  'use strict';

  function Menu(coinSystem) {
    var that = {};

    that.coinSystem = coinSystem;

    that.newGame = function() {
      coinSystem.startLevelOne();
    }

    that.initializeMenuEvents = function() {

      $("#newGame").click(function(e) {
        // Reset the coin system
        coinSystem.reset();
        // Display the countdown then start the game!
        $(".game-mask").show();
        $(".splash-message").html("Get Ready!");
        setTimeout(function (){
          $(".splash-message").html("3");
        }, 1000);
        setTimeout(function (){
          $(".splash-message").html("2");
        }, 2000);
        setTimeout(function (){
          $(".splash-message").html("1");
        }, 3000);
        setTimeout(function (){
          $(".splash-message").html("Go!");
        }, 4000);
        setTimeout(function (){
          $(".game-mask").hide();
          that.coinSystem.startLevelOne();
        }, 5000);
      });

      $("#highScores").click(function(e) {
        $(".game-mask").show();
        $(".splash-message").html("High Scores: ");
      });

      $("#credits").click(function(e) {
        $(".game-mask").show();
        $(".splash-message").html("Piggy Wiggly was created by Kevin Mann");
      });
    }

    return that;
  };



  return {
    Menu : Menu
  };
}());