var Particles = (function() {

  var nextName = 1;

  function create(spec, center, particles) {
    var p = {
        image: spec.image,
        size: Calc.nextGaussian(11, 4),
        center: {x: center.x, y: center.y},
        direction: Calc.nextCircleVector(),
        speed: Calc.nextGaussian(50, 25), // pixels per second
        rotation: 0,
        lifetime: Calc.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev), // How long the particle should live, in seconds
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
    particles[nextName++] = p;
  }

  function update(particles, elapsedTime) {

    var removeMe = [],
      value,
      particle;

    for (value in particles) {
      if (particles.hasOwnProperty(value)) {
        particle = particles[value];
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
      delete particles[removeMe[particle]];
    }
    removeMe.length = 0;
  }

  function render(particles, context, draw) {
    var value,
      particle;
    
    for (value in particles) {
      if (particles.hasOwnProperty(value)) {
        particle = particles[value];
        draw(context, particle);
      }
    }
  }

  return {
    create : create,
    update : update,
    render : render
  }

})();
