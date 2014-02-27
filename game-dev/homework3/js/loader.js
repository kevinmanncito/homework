var COINGAME = {};

window.addEventListener('load', function() {
  console.log('Loading resources...');
  Modernizr.load([
    {
      load : [
        'scripts/sizzle.js',
        'scripts/dom.js',
        'scripts/game.js'
      ],
      complete : function() {
        console.log('All files requested for loading...');
      }
    }
  ]);
}, false);