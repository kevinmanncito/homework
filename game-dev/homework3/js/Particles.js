COINGAME.particles = (function() {
  'use strict';

  var particleCanvas = document.getElementById('particlesCanvas');
  var particleContext = particleCanvas.getContext('2d');

  function ParticleSystem(spec) {
    var that = {};
    
    that.spec = spec;
    that.nextName = 1;
    that.particles = {};

    that.create = function(coords) {
      var p = {
          image: that.spec.image,
          size: Random.nextGaussian(20, 5),
          center: {x: coords.x, y: coords.y},
          direction: Random.nextCircleVector(),
          speed: Random.nextGaussian(that.spec.speed.mean, that.spec.speed.stdev), // pixels per second
          rotation: 0,
          lifetime: Random.nextGaussian(that.spec.lifetime.mean, that.spec.lifetime.stdev), // How long the particle should live, in seconds
          alive: 0  // How long the particle has been alive, in seconds
        };
      
      //
      // Ensure we have a valid size - gaussian numbers can be negative
      p.size = Math.max(1, p.size);
      //
      // Same thing with lifetime
      p.lifetime = Math.max(0.01, p.lifetime);

      //
      // Assign a unique name to each particle
      that.particles[that.nextName++] = p;
    };

    that.update = function(elapsedTime) {
      var removeMe = [],
        value,
        particle;
      
      // console.log(that.particles);
      for (value in that.particles) {
        if (that.particles.hasOwnProperty(value)) {
          particle = that.particles[value];
          //
          // Update how long it has been alive
          particle.alive += elapsedTime;
          
          //
          // Update its position
          particle.center.x += (elapsedTime * particle.speed * particle.direction.x);
          particle.center.y += (elapsedTime * particle.speed * particle.direction.y);
          
          //
          // Rotate proportional to its speed
          particle.rotation += particle.speed / 500;
          
          //
          // If the lifetime has expired, identify it for removal
          if (particle.alive > particle.lifetime) {
            removeMe.push(value);
          }
        }
      }

      //
      // Remove all of the expired particles
      for (particle = 0; particle < removeMe.length; particle++) {
        delete that.particles[removeMe[particle]];
      }
      removeMe.length = 0;

      that.render();
    };

    //------------------------------------------------------------------
    //
    // Render all particles
    //
    //------------------------------------------------------------------
    that.render = function() {
      particleContext.clear(particleCanvas);
      var value,
        particle;
      for (value in that.particles) {
        if (that.particles.hasOwnProperty(value)) {
          particle = that.particles[value];
          that.drawImage(particle);
        }
      }
    };

    that.drawImage = function(spec) {
      particleContext.save();
      particleContext.beginPath();
      particleContext.translate(spec.center.x, spec.center.y);
      particleContext.rotate(spec.rotation);
      particleContext.translate(-spec.center.x, -spec.center.y);
      
      particleContext.drawImage(
        spec.image,
        spec.center.x - spec.size/2, 
        spec.center.y - spec.size/2,
        spec.size, spec.size
        );

      particleContext.closePath();
      particleContext.restore();
    };

    that.coinClicked = function(coords) {
      for (var i = 0; i < 5; i++) {
        that.create(coords);
      }
    };

    return that;
  }

  return {
    ParticleSystem : ParticleSystem
  };

}());