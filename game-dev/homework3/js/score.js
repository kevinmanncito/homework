COINGAME.score = (function() {
  'use strict';

  function ScoreKeeper() {
    var that = {};

    that.currentScore = 0;

    that.levelOneScore = 0;

    that.levelTwoScore = 0;

    that.levelThreeScore = 0;

    that.hitCanada = false;

    that.incrementScore = function(amount) {
      if (amount === 0) {
        that.currentScore = 0;
        that.hitCanada = true;
      } 
      if (amount !== 0 && amount !== 'clock') {
        that.currentScore = that.currentScore + amount;
      }
    };

    that.resetCanadaFlag = function() {
      that.hitCanada = false;
    };

    that.saveLevelScore = function(level) {
      if (level === 1) {
        that.levelOneScore = that.currentScore;
      }
      if (level === 2) {
        that.levelTwoScore = that.currentScore - that.levelOneScore;
        if (that.hitCanada) {
          that.levelTwoScore = that.currentScore;
        }
      }
      if (level === 3) {
        that.levelThreeScore = that.currentScore - (that.levelOneScore + that.levelTwoScore);
        if (that.hitCanada) {
          that.levelThreeScore = that.currentScore;
        }
      }
      var value;
      var hasLevelScore = false;
      for (value in localStorage) {
        if (String(value) === String(level)) {
          hasLevelScore = true;
        }
      }
      var levelArray;
      if (!hasLevelScore) {
        levelArray = [];
        if (level === 1) {
          levelArray.push(that.levelOneScore);
        }
        if (level === 2) {
          levelArray.push(that.levelTwoScore);
        }
        if (level === 3) {
          levelArray.push(that.levelThreeScore);
        }
        localStorage[level] = JSON.stringify(levelArray);
      } else {
        levelArray = JSON.parse(localStorage[level]);
        if (level === 1) {
          levelArray.push(that.levelOneScore);
        }
        if (level === 2) {
          levelArray.push(that.levelTwoScore);
        }
        if (level === 3) {
          levelArray.push(that.levelThreeScore);
        }
        levelArray.sort(function(a,b){return b-a});
        localStorage[level] = JSON.stringify(levelArray);
      }
      // This is for the overall score only
      if (level === 3) {
        var inStorage = false;
        for (value in localStorage) {
          if (value === 'overall') {
            inStorage = true;
          }
        }
        var overallArray;
        if (!inStorage) {
          overallArray = [];
          overallArray.push(that.currentScore);
          localStorage['overall'] = JSON.stringify(overallArray);
        } else {
          overallArray = JSON.parse(localStorage['overall']);
          overallArray.push(that.currentScore);
          overallArray.sort(function(a,b){return b-a});
          localStorage['overall'] = JSON.stringify(overallArray);
        }
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

    that.getCurrentLevelScore = function(level) {
      if (level === 1) {
        return that.levelOneScore;
      }
      if (level === 2) {
        return that.levelTwoScore;
      }
      if (level === 3) {
        return that.levelThreeScore;
      }
    };

    that.getOverallHighScores = function() {
      // Check if local storage has key:
      var hasKey = false;
      for (var value in localStorage) {
        if (String(value) === 'overall') {
          hasKey = true;
        }
      }
      if (hasKey) {
        var highScoreString = "";
        var highScoreArray = JSON.parse(localStorage['overall']);
        highScoreArray.sort(function(a,b){return b-a});
        if (highScoreArray.length >= 3) {
          for (var i = 0; i < 3; i++) {
            highScoreString = highScoreString + String(highScoreArray[i]) + "<br>";
          }
        } else {
          for (var i = 0; i < highScoreArray.length; i++) {
            highScoreString = highScoreString + String(highScoreArray[i]) + "<br>";
          }
        }
        return highScoreString;
      } else {
        return "";
      }
    };

    that.getLevelThreeHighScores = function() {
      // Check if local storage has key:
      var hasKey = false;
      for (var value in localStorage) {
        if (String(value) === '3') {
          hasKey = true;
        }
      }
      if (hasKey) {
        var highScoreString = "";
        var highScoreArray = JSON.parse(localStorage[3]);
        highScoreArray.sort(function(a,b){return b-a});
        if (highScoreArray.length >= 3) {
          for (var i = 0; i < 3; i++) {
            highScoreString = highScoreString + String(highScoreArray[i]) + "<br>";
          }
        } else {
          for (var i = 0; i < highScoreArray.length; i++) {
            highScoreString = highScoreString + String(highScoreArray[i]) + "<br>";
          }
        }
        return highScoreString;
      } else {
        return "";
      }
    };

    that.getLevelTwoHighScores = function() {
      // Check if local storage has key:
      var hasKey = false;
      for (var value in localStorage) {
        if (String(value) === '2') {
          hasKey = true;
        }
      }
      if (hasKey) {
        var highScoreString = "";
        var highScoreArray = JSON.parse(localStorage[2]);
        highScoreArray.sort(function(a,b){return b-a});
        if (highScoreArray.length >= 3) {
          for (var i = 0; i < 3; i++) {
            highScoreString = highScoreString + String(highScoreArray[i]) + "<br>";
          }
        } else {
          for (var i = 0; i < highScoreArray.length; i++) {
            highScoreString = highScoreString + String(highScoreArray[i]) + "<br>";
          }
        }
        return highScoreString;
      } else {
        return "";
      }
    };

    that.getLevelOneHighScores = function() {
      // Check if local storage has key:
      var hasKey = false;
      for (var value in localStorage) {
        if (String(value) === '2') {
          hasKey = true;
        }
      }
      if (hasKey) {
        var highScoreString = "";
        var highScoreArray = JSON.parse(localStorage[1]);
        highScoreArray.sort(function(a,b){return b-a});
        if (highScoreArray.length >= 3) {
          for (var i = 0; i < 3; i++) {
            highScoreString = highScoreString + String(highScoreArray[i]) + "<br>";
          }
        } else {
          for (var i = 0; i < highScoreArray.length; i++) {
            highScoreString = highScoreString + String(highScoreArray[i]) + "<br>";
          }
        }
        return highScoreString;
      } else {
        return "";
      }
    };

    return that;
  };

  return {
    ScoreKeeper : ScoreKeeper
  };

}());