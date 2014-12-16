
package com.axionfx
{
	import flash.display.Bitmap;
	import flash.display.BitmapData;
	import flash.display.DisplayObject;
	import flash.display.GradientType;
	import flash.display.Shape;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.geom.Matrix;
	import flash.geom.Point;
	import flash.geom.ColorTransform;
	import flash.geom.Rectangle;
	import flash.display.BitmapDataChannel;
	import flash.display.StageQuality;
	import flash.filters.ColorMatrixFilter;
	import flash.filters.BitmapFilter;
	import flash.external.ExternalInterface;

	/**
	 * Emitter is a Sprite subclass which draws particle effects as defined by the System
	 *  associated to the Emitter.
	 *
	 * @author      Gregory Ray <gregory@everadventure.com>
	 * @version     0.1
	 * @since       2014-11-03
	 */
	public class Emitter extends Actor {
		private var _particleCount:int;
		private var _particleIndex:int;
		private var _emitCounter:Number;
		private var _particlePool:Array;
		private var _resultBD:BitmapData;
		private var _renderTexMatrix:Matrix = new Matrix(); 
		private var _ct:ColorTransform = new ColorTransform();

		public function Emitter(system:*) {
			renderable = true;
			actorType = 'EMITTER';
			super(system);
		}

		public function get particles():Array {
			return _particlePool;
		}

		public function get totalParticles():int {
			return _system.totalParticles;
		}

		public function set totalParticles(tp:int):void {
			tp = tp | 0;
			if(tp != _system.totalParticles) {
				_system.totalParticles = tp;
				restart();
			}
		}

		public function get pos():Point {
			return _system.pos;
		}

		public function set pos(pt:Point):void {
			_system.pos = pt;
		}
		
		override public function destroy(e:Event):void{
			super.destroy(e);
		}

		/*
		 * renders a particle to the given graphics without using textures. Uses
		 * the particle's color to draw a circle at the particle's location
		 * and sized to the particle
		 */
		private function _renderParticle(emitterBD:BitmapData, particle:Particle, renderMode:String):void {

			particle.graphics.clear();
			particle.graphics.beginFill(Util.colorArrayToInt(particle.color), particle.color[3]);
			particle.graphics.drawCircle(particle.radius, particle.radius, particle.radius);
			particle.graphics.endFill();

			_renderTexMatrix.identity();
			_renderTexMatrix.scale(particle.scale, particle.scale);
			_renderTexMatrix.translate(particle.pos.x, particle.pos.y);
			emitterBD.draw(particle, _renderTexMatrix, null, renderMode, null, true);
		}

		/*
		 * renders a particle using the particle's texture. The texture is typically a white
		 * image and so need to use a secondary buffer to "tint" this image based on the 
		 * particle's color.
		 */
		private function _renderParticleTexture(emitterBD:BitmapData, particle:Particle, renderMode:String):void {
			if(!_system.texture) return;
			if(!_resultBD) _resultBD = _system.texture.clone();
			_resultBD.applyFilter(_system.texture, _resultBD.rect, new Point(), new ColorMatrixFilter([
				particle.color[0]/255, 0, 0, 0, 0,
				0, particle.color[1]/255, 0, 0, 0,
				0, 0, particle.color[2]/255, 0, 0,
				0, 0, 0, 1.0, 0
			]));

			_renderTexMatrix.identity();
			_renderTexMatrix.translate(-(_system.texture.width/2),  -(_system.texture.height/2));
			_renderTexMatrix.rotate(particle.orientation);
			_renderTexMatrix.scale(particle.scale, particle.scale);
			_renderTexMatrix.translate((particle.pos.x),  (particle.pos.y));
			_ct.alphaMultiplier = particle.color[3];
			emitterBD.drawWithQuality(_resultBD, _renderTexMatrix, _ct, renderMode, null, true, StageQuality.LOW);	
		}

		public function render(bitmapData:BitmapData):void {
			if(!_system) return;
			for(var i:int = 0; i < _particlePool.length; ++i) {
				var p:Particle = _particlePool[i];
				if(p.life > 0 && p.color) {
					if(!_system.texture || !p.textureEnabled) {
						_renderParticle(bitmapData, p, p.renderMode);
					} else {
						_renderParticleTexture(bitmapData, p, p.renderMode);
					}
				}
			}
		}
		
		override public function restart(e:Event = null):void {
			super.restart();
			 _afterUpdate.push(function(){
			 	if(_system.texture) _resultBD = _system.texture.clone();
			 	_particlePool = [];

			 	for (var i:int = 0; i < _system.totalParticles; ++i) {
			 		_particlePool.push(new Particle());
			 	}

			 	_particleCount = 0;
			 	_particleIndex = 0;
			 	_emitCounter = 0;

			});
		}

		/*
		 * Returns whether all the particles in the pool are currently active
		 */
		private function _isFull():Boolean {
			return _particleCount == _system.totalParticles;
		}

		/*
		 * Takes a dormant particle out of the pool and makes it active.
		 * Does nothing if there is no free particle availabe
		 */
		private function _addParticle():Boolean {
			if (_isFull()) {
				return false;
			}

			var p:Particle = _particlePool[_particleCount];
			_initParticle(p);
			++_particleCount;

			return true;
		}

		/*
		 * Initializes the particle based on the current settings
		 * of the particle system
		 */
		private function _initParticle(particle:Particle):void {
			particle.textureEnabled = _system.textureEnabled;
			particle.renderMode = _system.renderMode;

			var _posVar:Point = new Point(_system.posVar.x * Util.random11(), _system.posVar.y * Util.random11()); 
			particle.pos.x = _system.pos.x + _posVar.x;
			particle.pos.y = _system.pos.y + _posVar.y;

			var _angle:Number = _system.angle + _system.angleVar * Util.random11();
			var _speed:Number = _system.speed + _system.speedVar * Util.random11();
			particle.setVelocity(_angle, _speed);
			if(_system.path && _system.path.splineRelForceOn && _system.path.splineAnchorPts is Array && _system.path.splineAnchorPts.length >= 4 && _system.path.splineIsPath) {
				var _direction:Number = _system.splineClockwise ? 1 : -1;
				particle.vel = new Point(particle.vel.x + (_direction*_relForce.x*_system.path.splineSpeed), particle.vel.y+(_direction*_relForce.y*_system.path.splineSpeed));
			}

			if(_system.path  && _system.path.splineAnchorPts is Array && _system.path.splineAnchorPts.length >= 4 && _system.path.splineIsPath) {
				var _direction:Number = _system.splineClockwise ? -1 : 1;
				particle.orientation = Math.atan2(particle.pos.y - _relForce.y, particle.pos.x - _relForce.x ); //(_relForce is actually derivative of position on spline)
				particle.orientation *= _direction;
			}

			particle.radialAccel = _system.radialAccel + _system.radialAccelVar * Util.random11();
			particle.tangentialAccel = _system.tangentialAccel + _system.tangentialAccelVar * Util.random11();

			var _life:Number = _system.life + _system.lifeVar * Util.random11();
			particle.life = Math.max(0, _life);

			particle.scale = Util.isNumber(_system.startScale) ? _system.startScale: 1;
			particle.deltaScale = Util.isNumber(_system.endScale) ? (_system.endScale - _system.startScale) : 0;
			particle.deltaScale /= particle.life;

			particle.radius = Util.isNumber(_system.radius) ? _system.radius + (_system.radiusVar || 0) * Util.random11() : 0;
			
			if (_system.startColor) {
				var _startColor:Array = [
					_system.startColor[0] + _system.startColorVar[0] * Util.random11(), _system.startColor[1] + _system.startColorVar[1] * Util.random11(), _system.startColor[2] + _system.startColorVar[2] * Util.random11(), _system.startColor[3] + _system.startColorVar[3] * Util.random11()
				];

				var _endColor:Array = _system.startColor;
				if (_system.endColor) {
					_endColor = [
						_system.endColor[0] + _system.endColorVar[0] * Util.random11(), _system.endColor[1] + _system.endColorVar[1] * Util.random11(), _system.endColor[2] + _system.endColorVar[2] * Util.random11(), _system.endColor[3] + _system.endColorVar[3] * Util.random11()
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
		private function _updateParticle(p:Particle, delta:Number, i:int):void {
			if (p.life > 0) {
				p.forces = p.forces || new Point();
				p.forces.x = 0;
				p.forces.y = 0;
 
				p.radial = p.radial || new Point();
				p.radial.x = 0;
				p.radial.y = 0;

				// dont apply radial forces until moved away from the emitter
				if ((p.pos.x != _system.pos.x || p.pos.y != _system.pos.y) && (p.radialAccel || p.tangentialAccel)) {
					p.radial.x = p.pos.x - _system.pos.x;
					p.radial.y = p.pos.y - _system.pos.y;

					Util.normalize(p.radial);
				}

				p.tangential = p.tangential || new Point();
				p.tangential.x = p.radial.x;
				p.tangential.y = p.radial.y;

				p.radial.x *= p.radialAccel;
				p.radial.y *= p.radialAccel;

				var newY:Number = p.tangential.x;
				p.tangential.x = - p.tangential.y;
				p.tangential.y = newY;

				p.tangential.x *= p.tangentialAccel;
				p.tangential.y *= p.tangentialAccel;

				var gravity = new Point(_system.gravity.x, _system.gravity.y);
				
				if(_system.bodies && _system.bodies.length > 0){
					for(var b:int=0; b < _system.bodies.length; b++) {
						var body:Body = _system.bodies[b];
						var d = Math.sqrt(Math.pow(p.pos.y-body.pos.y, 2) + Math.pow(p.pos.x-body.pos.x, 2));
						var gForce = body.force * (p.scale * body.mass)/d;
						gravity.y += gForce*(body.pos.y-p.pos.y)/(Math.abs(body.pos.y-p.pos.y)+Math.abs(body.pos.x-p.pos.x));
						gravity.x += gForce*(body.pos.x-p.pos.x)/(Math.abs(body.pos.y-p.pos.y)+Math.abs(body.pos.x-p.pos.x));
					}
				}

				p.forces.x = p.radial.x + p.tangential.x + gravity.x;
				p.forces.y = p.radial.y + p.tangential.y + gravity.y;

				p.forces.x *= delta;
				p.forces.y *= delta;

				p.vel.x += p.forces.x;
				p.vel.y += p.forces.y;

				p.pos.x += p.vel.x * delta;
				p.pos.y += p.vel.y * delta;

				p.life -= delta;

				p.scale += p.deltaScale * delta;

				p.orientation += Util.toRad(_system.rotationSpeed + (Util.random11()*_system.rotationSpeedVar));

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

				++_particleIndex;
			} else {
				// the particle has died, time to return it to the particle pool
				// take the particle at the current index
				var temp:Particle = _particlePool[i];

				// and move it to the end of the active particles, keeping all alive particles pushed
				// up to the front of the pool
				_particlePool[i] = _particlePool[_particleCount - 1];
				_particlePool[_particleCount - 1] = temp;

				// decrease the count to indicate that one less particle in the pool is active.
				--_particleCount;
			}
		}


		override public function update(elapsed:Number, delta:Number):void {
			if(!_system) return;
			super.update(elapsed, delta);

			_system.active = _system.duration == 0 || _system.duration == Infinity || elapsed < _system.duration;

			if (!_system.active) {
				return;
			}

			if (_system.emissionRate) {
				// emit new particles based on how much time has passed and the emission rate
				var rate:Number = 1.0 / _system.emissionRate;
				_emitCounter += Math.min(delta, 0.3);

				while (!_isFull() && _emitCounter > rate) {
					_addParticle();
					_emitCounter -= rate;
				}
			}

			_particleIndex = 0;
			while (_particleIndex < _particleCount) {
				var p:Particle = _particlePool[_particleIndex];
				_updateParticle(p, delta, _particleIndex);
			}

		}
		
	}
}
