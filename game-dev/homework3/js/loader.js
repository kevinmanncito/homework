var COINGAME = {
  images: {},
  settings: {},

  status : {
    preloadRequest : 0,
    preloadComplete : 0
  }
};

window.addEventListener('load', function() {
  console.log('Loading resources...');
  Modernizr.load([
    {
      load : [
        // Load the vendor js files first
        'preload!js/vendor/jquery-2.0.3.min.js',
        'preload!js/vendor/bootstrap.min.js',
        // 'preload!js/sizzle.js',
        // 'preload!js/dom.js',
        'preload!js/canvasHelper.js',
        'preload!js/menu.js',
        'preload!js/score.js',
        'preload!js/Coins.js',
        'preload!js/game.js',
        'preload!assets/Coin-Roman.png',
        'preload!assets/Clock.png',
        'preload!assets/Coin-US-Dollary.png',
        'preload!assets/Dollar-Sign.png'
      ],
      complete : function() {
        console.log('All files requested for loading...');
      }
    }
  ]);
}, false);

//
// Extend yepnope with our own 'preload' prefix that...
// * Tracks how many have been requested to load
// * Tracks how many have been loaded
// * Places images into the 'images' object
yepnope.addPrefix('preload', function(resource) {
  COINGAME.status.preloadRequest += 1;
  var isImage = /.+\.(jpg|png|gif)$/i.test(resource.url);
  resource.noexec = isImage;
  resource.autoCallback = function(e) {
    if (isImage) {
      var image = new Image();
      image.src = resource.url;
      COINGAME.images[resource.url] = image;
    }
    COINGAME.status.preloadComplete += 1;
    
    //
    // When everything has finished preloading, go ahead and start the game
    if (COINGAME.status.preloadComplete === COINGAME.status.preloadRequest) {
      console.log('Preloading complete!');
      COINGAME.initialize();
    }
  };
  
  return resource;
});