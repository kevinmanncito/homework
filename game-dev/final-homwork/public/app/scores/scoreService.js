angular.module('game')

  .factory('Scores', ['$http', function($http) {
    function get() {
      var value,
          overallScores,
          overallTimes,
          level1Scores,
          level2Scores,
          level3Scores,
          level4Scores,
          level5Scores,
          level1Times,
          level2Times,
          level3Times,
          level4Times,
          level5Times;
      for (value in localStorage) {
        if (value === 'overallScore') {
          overallScores = JSON.parse(localStorage['overallScore']);
        }
        if (value === 'overallTime') {
          overallTimes = JSON.parse(localStorage['overallTime']);
        }
        if (value === 'score1') {
          level1Scores = JSON.parse(localStorage['score1']);
        }
        if (value === 'score2') {
          level2Scores = JSON.parse(localStorage['score2']);
        }
        if (value === 'score3') {
          level3Scores = JSON.parse(localStorage['score3']);
        }
        if (value === 'score4') {
          level4Scores = JSON.parse(localStorage['score4']);
        }
        if (value === 'score5') {
          level5Scores = JSON.parse(localStorage['score5']);
        }
        if (value === 'time1') {
          level1Times = JSON.parse(localStorage['time1']);
        }
        if (value === 'time2') {
          level2Times = JSON.parse(localStorage['time2']);
        }
        if (value === 'time3') {
          level3Times = JSON.parse(localStorage['time3']);
        }
        if (value === 'time4') {
          level4Times = JSON.parse(localStorage['time4']);
        }
        if (value === 'time5') {
          level5Times = JSON.parse(localStorage['time5']);
        }
      }
      return {
        overallTimes : overallTimes,
        overallScores : overallScores,
        level1Scores : level1Scores,
        level2Scores : level2Scores,
        level3Scores : level3Scores,
        level4Scores : level4Scores,
        level5Scores : level5Scores,
        level1Times : level1Times,
        level2Times : level2Times,
        level3Times : level3Times,
        level4Times : level4Times,
        level5Times : level5Times
      };
    }
    return {
      get : get
    }
  }]);