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
      
      // Returning the game object
      return {
        player: '',
        level: 1,
        score: 0,
        totalTime: 0,
        levelTime: 0,
        secondTimer: 0,
        scoreSaved: false,
        status: false,
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
          nine: nine
        } 
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
      var col1 = 200,
          col2 = 300,
          col3 = 400,
          row1 = 100,
          row2 = 200,
          row3 = 300,
          row4 = 400,
          row5 = 500,
          row6 = 600;

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
      if (value === 0)
        return imgs.zero;
      if (value === 1)
        return imgs.one;
      if (value === 2)
        return imgs.two;
      if (value === 3)
        return imgs.three;
      if (value === 4)
        return imgs.four;
      if (value === 5)
        return imgs.five;
      if (value === 6)
        return imgs.six;
      if (value === 7)
        return imgs.seven;
      if (value === 8)
        return imgs.eight;
      if (value === 9)
        return imgs.nine;
      if (value === -1)
        return imgs.bomb;
      if (value === -2)
        return imgs.explode;
      if (value === -3)
        return imgs.check;
    }

    return {
      newGame : newGame,
      getBombs : getBombs,
      getBombLocationFromIndex : getBombLocationFromIndex,
      getBombImgFromValue : getBombImgFromValue
    }

  }]);
