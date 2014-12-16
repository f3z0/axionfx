
 define([
 	'axion-fx/Particle',
 	'axion-fx/SystemsManager',
 	'axion-fx/Actor',
 	'axion-fx/Util'
 ], 
 function(Particle, SystemsManager, Actor, Util) {

	Emitter.prototype = new Actor();
	Emitter.prototype.constructor=Emitter;

	/**
	 * Emitter is a subclass which draws particle effects as defined by the System
	 *  associated to the Emitter.
	 *
	 * @author      Gregory Ray <gregory@everadventure.com>
	 * @version     0.1
	 * @since       2014-11-03
	 */
	function Emitter(system) {
		Actor.prototype.init.apply(this, [system]);
		for (var i = 0; i < this.totalParticles; ++i) {
			this._particlePool.push(new Particle());
		}
	};

	/*
	 * renders a particle to the given context without using textures. Uses
	 * the particle's color to draw a circle at the particle's location
	 * and sized to the particle
	 */
	function _renderParticle(context, particle) {
		var color = Util.colorArrayToString(particle.color);

		context.fillStyle = color;
		context.beginPath();
		context.arc(particle.pos.x, particle.pos.y, particle.radius * particle.scale, 0, Math.PI*2, true);
		context.closePath();
		context.fill();
	}

	/*
	 * renders a particle using the particle's texture. The texture is typically a white
	 * image and so need to use a secondary buffer to "tint" this image based on the 
	 * particle's color.
	 */
	function _renderParticleTexture(context, particle) {
		particle.buffer = particle.buffer || Util.getBuffer(particle.texture);

		var bufferContext = particle.buffer.getContext('2d');

		// figure out what size to draw the texture at, based on the particle's
		// current scale
		var w = (particle.texture.width * particle.scale) | 0;
		var h = (particle.texture.height * particle.scale) | 0;

		// figure out the x and y locations to render at, to center the texture in the buffer
		var x = particle.pos.x - w / 2;
		var y = particle.pos.y - h / 2;
		bufferContext.clearRect(0, 0, particle.buffer.width, particle.buffer.height);

		bufferContext.save();
		bufferContext.translate( particle.texture.width/2 , particle.texture.height/2 );

		bufferContext.rotate(particle.orientation);

		bufferContext.translate( -particle.texture.width/2 , -particle.texture.height/2 );


		bufferContext.drawImage(particle.texture, 0, 0);

		bufferContext.restore();

		// now use source-atop to "tint" the white texture, here we want the particle's pure color,
		// not including alpha. As we already used the particle's alpha to render the texture above
		bufferContext.globalCompositeOperation = "source-atop";
		bufferContext.fillStyle = Util.colorArrayToString(particle.color,1);
		bufferContext.fillRect(0, 0, particle.buffer.width, particle.buffer.height);
		// reset the buffer's context for the next time we draw the particle
		bufferContext.globalAlpha = 1;

		bufferContext.globalCompositeOperation = "source-over";

		// finally, take the rendered and tinted texture and draw it into the main canvas, at the
		// particle's location
		context.globalAlpha = particle.color[3];

		context.globalCompositeOperation = Util.htmlRenderMode(particle.renderMode);
		//context.rotate(particle.orientation);

		context.drawImage(particle.buffer, 0, 0, particle.buffer.width, particle.buffer.height, x, y, w, h);
		context.globalCompositeOperation = "source-over";

		context.globalAlpha = 1;
	}

	/*
	 * Returns whether all the particles in the pool are currently active
	 */
	function _isFull() {
		return this._particleCount == this.system.totalParticles;
	}

	/*
	 * Takes a dormant particle out of the pool and makes it active.
	 * Does nothing if there is no free particle availabe
	 */
	function _addParticle() {
		if (_isFull.call(this)) {
			return false;
		}

		var p = this._particlePool[this._particleCount];
		_initParticle.apply(this, [p]);
		++this._particleCount;

		return true;
	}

	/*
	 * Initializes the particle based on the current settings
	 * of the particle system
	 */
	function _initParticle(particle) {
		particle.texture = this.system.texture;
		particle.textureEnabled = this.system.textureEnabled;
		particle.renderMode = this.system.renderMode;

		var _posVar = {x: this.system.posVar.x * Util.random11(), y: this.system.posVar.y * Util.random11()}; 
		particle.pos.x = this.system.pos.x + _posVar.x;
		particle.pos.y = this.system.pos.y + _posVar.y;

		var _angle = this.system.angle + this.system.angleVar * Util.random11();
		var _speed = this.system.speed + this.system.speedVar * Util.random11();
		particle.setVelocity(_angle, _speed);
		if(this.system.path && this.system.path.splineRelForceOn && Util.isArray(this.system.path.splineAnchorPts) && this.system.path.splineAnchorPts.length >= 4 && this.system.path.splineIsPath) {
			var _direction = this.system.splineClockwise ? 1 : -1;
			particle.vel = {x: particle.vel.x + (_direction*this._relForce.x*this.system.path.splineSpeed), y: particle.vel.y+(_direction*this._relForce.y*this.system.path.splineSpeed)};
		}

		if(this.system.path && Util.isArray(this.system.path.splineAnchorPts) && this.system.path.splineAnchorPts.length >= 4 && this.system.path.splineIsPath) {
			var _direction = this.system.splineClockwise ? -1 : 1;
			particle.orientation = Math.atan2(particle.pos.y - this._relForce.y, particle.pos.x - this._relForce.x ); //(_relForce is actually derivative of position on spline)
			particle.orientation *= _direction;
		}

		particle.radialAccel = this.system.radialAccel + this.system.radialAccelVar * Util.random11();
		particle.tangentialAccel = this.system.tangentialAccel + this.system.tangentialAccelVar * Util.random11();

		var _life = this.system.life + this.system.lifeVar * Util.random11();
		particle.life = Math.max(0, _life);

		particle.scale = Util.isNumber(this.system.startScale) ? this.system.startScale: 1;
		particle.deltaScale = Util.isNumber(this.system.endScale) ? (this.system.endScale - this.system.startScale) : 0;
		particle.deltaScale /= particle.life;

		particle.radius = Util.isNumber(this.system.radius) ? this.system.radius + (this.system.radiusVar || 0) * Util.random11() : 0;
		
		if (this.system.startColor) {
			var _startColor = [
				this.system.startColor[0] + this.system.startColorVar[0] * Util.random11(), this.system.startColor[1] + this.system.startColorVar[1] * Util.random11(), this.system.startColor[2] + this.system.startColorVar[2] * Util.random11(), this.system.startColor[3] + this.system.startColorVar[3] * Util.random11()
			];

			var _endColor = this.system.startColor;
			if (this.system.endColor) {
				_endColor = [
					this.system.endColor[0] + this.system.endColorVar[0] * Util.random11(), this.system.endColor[1] + this.system.endColorVar[1] * Util.random11(), this.system.endColor[2] + this.system.endColorVar[2] * Util.random11(), this.system.endColor[3] + this.system.endColorVar[3] * Util.random11()
				];
			}

			particle.color = _startColor;
			particle.deltaColor = [(_endColor[0] - _startColor[0]) / particle.life, (_endColor[1] - _startColor[1]) / particle.life, (_endColor[2] - _startColor[2]) / particle.life, (_endColor[3] - _startColor[3]) / particle.life];
		}
	}

	/*
	 * Updates a particle based on how much time has passed in delta
	 * Moves the particle using its velocity and all forces acting on it (gravity,
	 * radial and tangential acceleration), and updates all the properties of the
	 * particle like its size, color, etc
	 */
	function _updateParticle(p, delta, i) {
		if (p.life > 0) {
			p.forces = p.forces || {x: 0, y: 0};
			p.forces.x = 0;
			p.forces.y = 0;

			p.radial = p.radial || {x: 0, y: 0};
			p.radial.x = 0;
			p.radial.y = 0;

			// dont apply radial forces until moved away from the emitter
			if ((p.pos.x != this.system.pos.x || p.pos.y != this.system.pos.y) && (p.radialAccel || p.tangentialAccel)) {
				p.radial.x = p.pos.x - this.system.pos.x;
				p.radial.y = p.pos.y - this.system.pos.y;

				Util.normalize(p.radial);
			}

			p.tangential = p.tangential || {x: 0, y: 0};
			p.tangential.x = p.radial.x;
			p.tangential.y = p.radial.y;

			p.radial.x *= p.radialAccel;
			p.radial.y *= p.radialAccel;

			var newY = p.tangential.x;
			p.tangential.x = - p.tangential.y;
			p.tangential.y = newY;

			p.tangential.x *= p.tangentialAccel;
			p.tangential.y *= p.tangentialAccel;

			var gravity = {x: this.system.gravity.x, y: this.system.gravity.y};
			
			if(this.system.bodies && this.system.bodies.length > 0){
				for(var b=0; b < this.system.bodies.length; b++) {
					var body = this.system.bodies[b];
					var d = Math.sqrt(Math.pow(p.pos.y-body.pos.y, 2) + Math.pow(p.pos.x-body.pos.x, 2));
					var gForce = body.force * (p.scale * body.mass)/d;
					gravity.y += gForce*(body.pos.y-p.pos.y)/(Math.abs(body.pos.y-p.pos.y)+Math.abs(body.pos.x-p.pos.x));
					gravity.x += gForce*(body.pos.x-p.pos.x)/(Math.abs(body.pos.y-p.pos.y)+Math.abs(body.pos.x-p.pos.x));
				}
			}

			var forceField = {x:1,y:1};

			p.forces.x = (p.radial.x + p.tangential.x + gravity.x) + (p.vel.x * forceField.x);
			p.forces.y = (p.radial.y + p.tangential.y + gravity.y) + (p.vel.y * forceField.y);

			p.forces.x *= delta;
			p.forces.y *= delta;

			p.vel.x += p.forces.x;
			p.vel.y += p.forces.y;
			
			p.pos.x += p.vel.x * delta;
			p.pos.y += p.vel.y * delta;

			p.life -= delta;

			p.scale += p.deltaScale * delta;

			p.orientation += Util.toRad(this.system.rotationSpeed + (Util.random11()*this.system.rotationSpeedVar));

			if (p.color) {
				p.color[0] += p.deltaColor[0] * delta;
				p.color[1] += p.deltaColor[1] * delta;
				p.color[2] += p.deltaColor[2] * delta;
				p.color[3] += p.deltaColor[3] * delta;
			}
			p.color[0] = Math.min(p.color[0], 255);
			p.color[1] = Math.min(p.color[1], 255);
			p.color[2] = Math.min(p.color[2], 255);
			p.color[3] = Math.min(p.color[3], 1.0);

			p.color[0] = Math.max(p.color[0], 0);
			p.color[1] = Math.max(p.color[1], 0);
			p.color[2] = Math.max(p.color[2], 0);
			p.color[3] = Math.max(p.color[3], 0);

			++this._particleIndex;
		} else {
			// the particle has died, time to return it to the particle pool
			// take the particle at the current index
			var temp = this._particlePool[i];

			// and move it to the end of the active particles, keeping all alive particles pushed
			// up to the front of the pool
			this._particlePool[i] = this._particlePool[this._particleCount - 1];
			this._particlePool[this._particleCount - 1] = temp;

			// decrease the count to indicate that one less particle in the pool is active.
			--this._particleCount;
		}
	}

	Util.extend(Emitter.prototype, {
		_particleCount: 0,
		_particleIndex: 0,
		_emitCounter: 0,
		_particlePool: [],
		_resultBD: null,
		__file: null,
		_totalParticles: 0,
		actorType: 'EMITTER',
		renderable: true,
		render: function(context) {
			if(!this.system) return;

			for(var i = 0; i < this._particlePool.length; ++i) {
				var p = this._particlePool[i];
				if(p.life > 0 && p.color) {
					if(!p.texture || !p.textureEnabled) {
						_renderParticle.apply(this, [context, p]);
					} else {
						_renderParticleTexture.apply(this, [context, p]);
					}
				}
			}
		},
		/*
		 * flushes out the particle pool and starts the system over
		 * from the beginning. Replacing all the particles with new ones
		 * is a bit nuclear, but gets the job done
		 */
		restart: function() {
			Actor.prototype.restart.call(this)
			this._afterUpdate.push(function(){
				this._particlePool = [];

				for (var i = 0; i < this.totalParticles; ++i) {
					this._particlePool.push(new Particle());
				}

				this._particleCount = 0;
				this._particleIndex = 0;
				this._emitCounter = 0;
			});
		},
		update: function(elapsed, delta) {
			if(!this.system) return;
			Actor.prototype.update.apply(this, [elapsed, delta]);
			this.system.active = this.system.duration == 0 || this.system.duration == Infinity || elapsed < this.system.duration;
			if (!this.system.active) {
				return;
			}

			if (this.system.emissionRate) {
				// emit new particles based on how much time has passed and the emission rate
				var rate = 1.0 / this.system.emissionRate;
				this._emitCounter += Math.min(delta, 0.3);
				while (!_isFull.call(this) && this._emitCounter > rate) {
					_addParticle.call(this);
					this._emitCounter -= rate;
				}
			}

			this._particleIndex = 0;
			while (this._particleIndex < this._particleCount) {
				var p = this._particlePool[this._particleIndex];
				_updateParticle.apply(this, [p, delta, this._particleIndex]);
			}
		}
    	});


	Object.defineProperty(Emitter.prototype, 'emissionRate', {
		get: function() {
			return this.system.emissionRate;
		},
		set: function(v) {
			this.system.emissionRate = v;

		}
	});

	Object.defineProperty(Emitter.prototype, 'particles', {
		get: function() {
			return this._particlePool;
		}
	});

	Object.defineProperty(Emitter.prototype, 'totalParticles', {
		get: function() {
			return this.system.totalParticles;
		},
		set: function(tp) {
			tp = tp | 0;
			if(tp !== this.system.totalParticles) {
				this.system.totalParticles = tp;
				this.restart();
			}
		}
	});

	Object.defineProperty(Emitter.prototype, 'pos', {
		get: function() {
			return this.system.pos;
		},
		set: function(pt) {
			this.system.pos = pt;
		}
	});

	Object.defineProperty(Emitter.prototype, 'life', {
		get: function() {
			return this.system.life;
		},
		set: function(life) {
			this.system.life = life;
		}
	});

	Object.defineProperty(Emitter.prototype, 'lifeVar', {
		get: function() {
			return this.system.lifeVar;
		},
		set: function(lifeVar) {
			this.system.lifeVar = lifeVar;
		}
	});

	Object.defineProperty(Emitter.prototype, 'posVar', {
		get: function() {
			return this.system.posVar;
		},
		set: function(pt) {
			this.system.posVar = pt;
		}
	});

	return Emitter;
});
