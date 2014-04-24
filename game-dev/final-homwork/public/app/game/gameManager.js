angular.module('game')

  .factory('GameManager', [function () {
    
    function newGame() {
      // Getting all the images loaded
      var bomb = new Image();
      bomb.src = '../img/Bomb.png';
      
      var check = new Image();
      check.src = '../img/checkmark.png';

      var explode = new Image();
      explode.src = '../img/Explosion.png';
      
      var zero = new Image();
      zero.src = '../img/glass_numbers_0.png';
      
      var one = new Image();
      one.src = '../img/glass_numbers_1.png';
      
      var two = new Image();
      two.src = '../img/glass_numbers_2.png';
      
      var three = new Image();
      three.src = '../img/glass_numbers_3.png';
      
      var four = new Image();
      four.src = '../img/glass_numbers_4.png';
      
      var five = new Image();
      five.src = '../img/glass_numbers_5.png';
      
      var six = new Image();
      six.src = '../img/glass_numbers_6.png';
      
      var seven = new Image();
      seven.src = '../img/glass_numbers_7.png';
      
      var eight = new Image();
      eight.src = '../img/glass_numbers_8.png';

      var nine = new Image();
      nine.src = '../img/glass_numbers_9.png';

      var smoke = new Image();
      smoke.src = '../img/smoke.png';

      var fire = new Image();
      fire.src = '../img/fire.png';
      
      // Returning the game object
      return {
        player: '',
        level: 1,
        totalScore: 0,
        levelScore: 0,
        totalTime: 0,
        levelTime: 0,
        secondTimer: 0,
        scoreSaved: false,
        status: false,
        continueToNextLevel: true,
        updateAngular: false,
        particles: [],
        bombs: [],
        bombImgs: {
          bomb: bomb,
          check: check,
          explode: explode,
          zero: zero,
          one: one,
          two: two,
          three: three,
          four: four,
          five: five,
          six: six,
          seven: seven,
          eight: eight,
          nine: nine,
          smoke: smoke,
          fire: fire
        },
        prevSound: 0
      }
    }

    function getBombs(level) {
      var bombArray = [];
      if (level > 0) { // Level 1
        bombArray.push(3);
        bombArray.push(3);
        bombArray.push(2);
        bombArray.push(2);
        bombArray.push(1);
        bombArray.push(1);
      }
      if (level > 1) { // Level 2
        bombArray.push(4);
        bombArray.push(3);
        bombArray.push(2);
      }
      if (level > 2) { // Level 3
        bombArray.push(5);
        bombArray.push(4);
        bombArray.push(3);
      }
      if (level > 3) { // Level 4
        bombArray.push(6);
        bombArray.push(5);
        bombArray.push(4);
      }
      if (level > 4) { // Level 5
        bombArray.push(7);
        bombArray.push(6);
        bombArray.push(5);
      }
      bombArray.shuffle();
      return bombArray;
    }

    function getBombLocationFromIndex(index) {
      var col1 = 300,
          col2 = 400,
          col3 = 500,
          row1 = 50,
          row2 = 150,
          row3 = 250,
          row4 = 350,
          row5 = 450,
          row6 = 550;

      // Row one
      if (index === 0) {
        return {
          x: col1,
          y: row1
        }
      }
      if (index === 1) {
        return {
          x: col2,
          y: row1
        }
      }
      if (index === 2) {
        return {
          x: col3,
          y: row1
        }
      }
      // Row two
      if (index === 3) {
        return {
          x: col1,
          y: row2
        }
      }
      if (index === 4) {
        return {
          x: col2,
          y: row2
        }
      }
      if (index === 5) {
        return {
          x: col3,
          y: row2
        }
      }
      // Row three
      if (index === 6) {
        return {
          x: col1,
          y: row3
        }
      }
      if (index === 7) {
        return {
          x: col2,
          y: row3
        }
      }
      if (index === 8) {
        return {
          x: col3,
          y: row3
        }
      }
      // Row four
      if (index === 9) {
        return {
          x: col1,
          y: row4
        }
      }
      if (index === 10) {
        return {
          x: col2,
          y: row4
        }
      }
      if (index === 11) {
        return {
          x: col3,
          y: row4
        }
      }
      // Row five
      if (index === 12) {
        return {
          x: col1,
          y: row5
        }
      }
      if (index === 13) {
        return {
          x: col2,
          y: row5
        }
      }
      if (index === 14) {
        return {
          x: col3,
          y: row5
        }
      }
      // Row six
      if (index === 15) {
        return {
          x: col1,
          y: row6
        }
      }
      if (index === 16) {
        return {
          x: col2,
          y: row6
        }
      }
      if (index === 17) {
        return {
          x: col3,
          y: row6
        }
      } else {
        return {
          x: 0,
          y: 0
        }
      }
    }

    function getBombImgFromValue(value, imgs) {
      if (value === 0) {
        return imgs.zero;
      }
      if (value === 1) {
        return imgs.one;
      }
      if (value === 2) {
        return imgs.two;
      }
      if (value === 3) {
        return imgs.three;
      }
      if (value === 4) {
        return imgs.four;
      }
      if (value === 5) {
        return imgs.five;
      }
      if (value === 6) {
        return imgs.six;
      }
      if (value === 7) {
        return imgs.seven;
      }
      if (value === 8) {
        return imgs.eight;
      }
      if (value === 9) {
        return imgs.nine;
      }
      if (value === -1) {
        return imgs.bomb;
      }
      if (value === -2) {
        return imgs.explode;
      }
      if (value === -3) {
        return imgs.check;
      }
    }

    function checkForBombClick(index, coords) {
      var location = getBombLocationFromIndex(index);
      if (coords.x > location.x + 10 && coords.x < location.x + 100) {
        if (coords.y > location.y + 10 && coords.y < location.y + 98) {
          return true;
        }
      }
      return false;
    }

    function saveLevelScore(score, level, player) {
      var value,
          scores = [],
          hasScore = false;
      for (value in localStorage) {
        if (String(value) === 'score'+String(level)) {
          hasScore = true;
        }
      }
      if (hasScore) { // Score for this level has already been added
        scores = JSON.parse(localStorage['score'+String(level)]);
        hasScore = false;
        scores.forEach(function (s, index) {
          if (s.name === player) {
            hasScore = true;
            if (score > s.score) {
              scores[index].score = score;
            }
          }
        });
        if (!hasScore) {
          scores.push({score:score,
                       name:player});
        }
        
      } else { // First time a score for this level has been added
        scores.push({score:score,
                     name:player});
      }
      console.log(localStorage);
      localStorage['score'+String(level)] = JSON.stringify(scores);
    }

    function saveOverallScore(score, player) {
      var value,
          scores = [],
          hasScore = false;
      for (value in localStorage) {
        if (String(value) === 'overallScore') {
          hasScore = true;
        }
      }
      if (hasScore) {
        scores = JSON.parse(localStorage['overallScore']);
        hasScore = false;
        scores.forEach(function (s, index) {
          if (s.name === player) {
            hasScore = true;
            if (score > s.score) {
              scores[index].score = s.score;
            }
          }
          if (!hasScore) {
            scores.push({score:score, name:player});
          }
        });
      } else {
        scores.push({name:player,
                     score:score});
      }
      localStorage['overallScore'] = JSON.stringify(scores);
    }

    function saveLevelTime(time, level, player) {
      var value,
          times = [],
          hasTime = false;
      for (value in localStorage) {
        if (String(value) === 'time'+String(level)) {
          hasTime = true;
        }
      }
      if (hasTime) { // Score for this level has already been added
        times = JSON.parse(localStorage['time'+String(level)]);
        hasTime = false;
        times.forEach(function (t, index) {
          if (t.name === player) {
            hasTime = true;
            if (time < t.time) {
              times[index].time = time;
            }
          }
        });
        if (!hasTime) {
          times.push({time:time,
                       name:player});
        }
        
      } else { // First time a score for this level has been added
        times.push({time:time,
                    name:player});
      }
      localStorage['time'+String(level)] = JSON.stringify(times);
    }

    function saveOverallTime(time, player) {
      var value,
          times = [],
          hasTime = false;
      for (value in localStorage) {
        if (String(value) === 'overallTime') {
          hasTime = true;
        }
      }
      if (hasTime) {
        times = JSON.parse(localStorage['overallTime']);
        hasTime = false;
        times.forEach(function (t, index) {
          if (t.name === player) {
            hasTime = true;
            if (time > t.time) {
              times[index].time = t.time;
            }
          }
          if (!hasTime) {
            times.push({time:time, name:player});
          }
        });
      } else {
        times.push({name:player,
                    time:time});
      }
      localStorage['overallTime'] = JSON.stringify(times);
    }

    return {
      newGame : newGame,
      getBombs : getBombs,
      getBombLocationFromIndex : getBombLocationFromIndex,
      getBombImgFromValue : getBombImgFromValue,
      checkForBombClick : checkForBombClick,
      saveLevelScore : saveLevelScore,
      saveOverallScore : saveOverallScore,
      saveLevelTime : saveLevelTime,
      saveOverallTime : saveOverallTime
    }

  }]);
