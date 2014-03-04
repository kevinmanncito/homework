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
      return;
    };

    that.newGame = function() {
      // Reset the coin system
      coinSystem.reset();
      // Display the countdown then start the game!
      $(".game-mask").show();
      $("#splashMessage").html("Get Ready!");
      setTimeout(function (){
        $("#splashMessage").html("3");
      }, 1000);
      setTimeout(function (){
        $("#splashMessage").html("2");
      }, 2000);
      setTimeout(function (){
        $("#splashMessage").html("1");
      }, 3000);
      setTimeout(function (){
        $("#splashMessage").html("Go!");
      }, 4000);
      setTimeout(function (){
        $(".game-mask").hide();
        that.transitionTime = true;
        that.coinSystem.startLevel(1);
      }, 5000);
    };

    that.levelTransition = function() {
      that.scoreKeeper.saveLevelScore(that.coinSystem.getCurrentLevel());
      var level = that.coinSystem.getCurrentLevel();
      $(".game-mask").show();
      $(".splash-message").html("Level " 
            + String(level) 
            + " Score: " 
            + String(that.scoreKeeper.getCurrentLevelScore(level)));
      if (that.scoreKeeper.getCurrentLevelScore(level) < 100) {
        $(".continue-wrapper").addClass('hide');
      } else {
        $(".continue-wrapper").removeClass('hide');
      }
      if (level === 3) {
        $(".splash-message").html(String($(".splash-message").html())
            + "<br>Overall Score: "
            + String(that.scoreKeeper.getCurrentScore())
            + "<div class='sub-splash'></div>");
        $(".sub-splash").html("Choose an option from the menu...");
        $(".continue-wrapper").addClass('hide');
      }
    };

    that.continueGame = function() {
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
        if (!coinSystem.getGameStatus()) {
          $(".game-mask").show();
          $(".splash-message").html("High Scores<br><div class='sub-splash'></div>");
          $(".sub-splash").html(scoreKeeper.getOverallHighScores()
                + "Level Three<br>" 
                + scoreKeeper.getLevelThreeHighScores()
                + "Level Two<br>"
                + scoreKeeper.getLevelTwoHighScores()
                + "Level One<br>"
                + scoreKeeper.getLevelOneHighScores());
        }
      });

      $("#credits").click(function(e) {
        if (!coinSystem.getGameStatus()) {
          $(".game-mask").show();
          $(".splash-message").html("Piggy Wiggly was created by Kevin Mann");
        }
      });
    };

    return that;
  };

  return {
    Menu : Menu
  };
  
}());