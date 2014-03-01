COINGAME.score = (function() {
  'use strict';

  function ScoreKeeper() {
    var that = {};

    that.currentScore = 0;

    that.incrementScore = function(amount) {
      if (amount === 0) {
        that.currentScore = 0;
      } 
      if (amount !== 0 && amount !== 'clock') {
        that.currentScore = that.currentScore + amount;
      }
    };

    that.update = function(time) {
      that.render();
    };

    that.render = function() {
      $(".score-caption").html(String(that.currentScore));
    };
    
    that.setScore = function(score) {
      that.currentScore = score;
    };

    that.getCurrentScore = function() {
      return that.currentScore;
    };

    return that;
  };

  return {
    ScoreKeeper : ScoreKeeper
  };

}());