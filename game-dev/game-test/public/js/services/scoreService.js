angular.module('game')

  .factory('Scores', function() {
    return {
      get: function() {
        var scores = localStorage;
        delete scores["ruulzIndex"];
        var scoresArray = [];
        var value;
        for (value in scores) {
          scoresArray.push({
            name: value,
            score: parseInt(scores[value])
          });
        }
        return scoresArray;
      }
    }
  });