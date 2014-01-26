'use strict';

window.onload = function() {

  var Game1 = {

    timers: [],

    initialize: function() {
      requestAnimationFrame(Game1.gameLoop);
      // Add timer click handler
      document.getElementById('addTimer').onclick = function(e) {
        e.preventDefault();
        var name = document.getElementById('name').value;
        var interval = document.getElementById('interval').value;
        var times = document.getElementById('times').value;

        if (name == '' || interval == '' || times == '') {
          document.getElementById('errorMessage').classList.remove('hide');
        } else {
          document.getElementById('errorMessage').classList.add('hide');
          document.getElementById('name').value = '';
          document.getElementById('interval').value = '';
          document.getElementById('times').value = '';
          Game1.createTimer(name, 
                            Number(interval), 
                            parseInt(Math.round(Number(times))));
        }
      }
      // Restart game click handler
      document.getElementById('restart').onclick = function(e) {
        e.preventDefault();
        Game1.restartGame();
      }
    },
    
    gameLoop: function(time) {
      Game1.update(time);
      requestAnimationFrame(Game1.gameLoop);
    },

    update: function(time) {
      // Loop through the timers and see if any need updated
      for (var i in Game1.timers) {
        var currentInterval = Game1.timers[i].interval;
        // If a timer needs updated: render it
        if (time - Game1.timers[i].lastTimeStamp >= currentInterval) {
          if (Game1.timers[i].times >= 0) {
            Game1.render(Game1.timers[i]);
            Game1.timers[i].lastTimeStamp = performance.now();
            Game1.timers[i].times -= 1;
          }
        }
        Game1.timers[i];
      }
    },

    render: function(timer) {
      var element = document.getElementById('timers');
      element.innerHTML = "<li>"+timer.name+" ("+timer.times+" remaining)</li>"+
                    element.innerHTML;
    },

    createTimer: function(name, interval, times) {
      var timer = {'name': name, 
                   'interval': interval, 
                   'times': times,
                   'lastTimeStamp': performance.now()};
      var element = document.getElementById('timers');
      element.innerHTML = "<li>Started timer: "+timer.name+" ("+timer.times.toString()+" remaining)</li>"+
                          element.innerHTML;
      timer.times -= 1;
      Game1.timers.push(timer);
    },

    restartGame: function() {
      Game1.timers = [];
      var element = document.getElementById('timers');
      element.innerHTML = '';
    }

  };

  Game1.initialize();

}
