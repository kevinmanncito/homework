COINGAME.menu = (function() {
  'use strict';

  function Menu(coinSystem, scoreKeeper) {
    var that = {};

    that.coinSystem = coinSystem;

    that.scoreKeeper = scoreKeeper;

    that.transitionTime = true;

    that.isTransitionTime = function() {
      return that.transitionTime;
    };

    that.toggleTransitionTime = function() {
      if (that.transitionTime === false) {
        that.transitionTime = true;
      } else {
        that.transitionTime = false;
      }
    };

    that.update = function(time) {
      that.render();
    };

    that.render = function() {

    };

    that.newGame = function() {
      // Reset the coin system
      coinSystem.reset();
      // Display the countdown then start the game!
      // $(".game-mask").show();
      // $("#splashMessage").html("Get Ready!");
      // setTimeout(function (){
      //   $("#splashMessage").html("3");
      // }, 1000);
      // setTimeout(function (){
      //   $("#splashMessage").html("2");
      // }, 2000);
      // setTimeout(function (){
      //   $("#splashMessage").html("1");
      // }, 3000);
      // setTimeout(function (){
      //   $("#splashMessage").html("Go!");
      // }, 4000);
      // setTimeout(function (){
      //   $(".game-mask").hide();
      //   that.coinSystem.startLevel(1);
      // }, 5000);
      $(".game-mask").show();
      $("#splashMessage").html("Get Ready!");
      setTimeout(function (){
        $("#splashMessage").html("Go!");
        $(".game-mask").hide();
        that.coinSystem.startLevel();
      }, 1000);
    };

    that.levelTransition = function() {
      $(".game-mask").show();
      $(".splash-message").html("Level " 
            + String(that.coinSystem.getCurrentLevel()) 
            + " Score: " 
            + String(that.scoreKeeper.getCurrentScore()));
      $(".continue-wrapper").removeClass('hide');
    };

    that.continueGame = function() {
      console.log('continuing game apparently...');
      $(".game-mask").show();
      $(".continue-wrapper").addClass('hide');
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
        var nextLevel = that.coinSystem.getNextLevel();
        console.log(nextLevel);
        that.transitionTime = true;
        that.coinSystem.startLevel(nextLevel);
      }, 5000);
    };

    that.initializeMenuEvents = function() {

      $("#newGame").click(function(e) {
        that.newGame();
      });

      $("#continue").click(function(e) {
        that.continueGame();
      });

      $("#highScores").click(function(e) {
        $(".game-mask").show();
        $(".splash-message").html("High Scores: ");
      });

      $("#credits").click(function(e) {
        $(".game-mask").show();
        $(".splash-message").html("Piggy Wiggly was created by Kevin Mann");
      });
    };

    return that;
  };

  return {
    Menu : Menu
  };
  
}());