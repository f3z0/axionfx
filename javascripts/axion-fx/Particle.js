define(['axion-fx/Util'], function(Util) {
	/**
	 * Particle is a Sprite is used to hold the state
	 * of an individual particle during emission.
	 *
	 * @author      Gregory Ray <gregory@everadventure.com>
	 * @version     0.1
	 * @since       2014-11-03
	 */
	var Particle = function() {
		this.pos = {
			x: 0,
			y: 0
		};
		this.setVelocity(0, 0);
		this.life = 0;
		this.orientation = 0;
	};

	Particle.prototype = {
		setVelocity: function(angle, speed) {
			this.vel = {
				x: Math.cos(Util.toRad(angle)) * speed,
				y: -Math.sin(Util.toRad(angle)) * speed
			};
		}
	};

	return Particle;
});


