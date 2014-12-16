define([
	'axion-fx/SystemsManager',
	'axion-fx/Actor',
	'axion-fx/Util'
], 
function(SystemsManager, Actor, Util) {

	Body.prototype = new Actor();
	Body.prototype.constructor=Body;

	/**
	 * Body - Body of mass in spacetime.
	 *
	 * @author      Gregory Ray <gregory@everadventure.com>
	 * @version     0.1
	 * @since       2014-11-03
	 */
	function Body(system) {
		Actor.prototype.init.apply(this, [system]);
	};

	Util.extend(Body.prototype, {
		actorType: 'BODY',
		renderable: false,
		addRenderer: function(renderer) {
			Actor.prototype.addRenderer.apply(this, [renderer]);
			renderer.addEventListener('actorAdded', _checkActor);
			this._afterUpdate.push(function(){
				for(var i = 0; i < renderer.actors.length; i++){
					var actor = renderer.actors[i];
					if(this.system.actsOn.indexOf(actor.predefinedSystem) != -1){
						if(!actor.system.bodies) actor.system.bodies = [];
						actor.system.bodies.push(this);
					} else if (actor.system.bodies && actor.system.bodies.indexOf(this) !== -1) {
						actor.system.bodies.splice(actor.system.bodies.indexOf, 1)
					}
				}
			});
		},
		config: function(system) {
			this._system = system;
		}
	});

	function _checkActor(e) {
		var actor = _instance._renderer.actors[e.detail];
		if(this.system.actsOn.indexOf(actor.predefinedSystem) !== -1){
			if(!actor.system.bodies) actor.system.bodies = [];
			actor.system.path = this;
		}
	}

	Object.defineProperty(Body.prototype, 'systemName', {
		get: function() {
			return this._system.systemName;
		},
		set: function(name) {
			this._system.systemName = name;
		}
	});

	Object.defineProperty(Body.prototype, 'posX', {
		get: function() {
			return this._system.pos.x;
		},
		set: function(x) {
			this._system.pos.x = x;
		}
	});

	Object.defineProperty(Body.prototype, 'posY', {
		get: function() {
			return this._system.pos.y;
		},
		set: function(y) {
			this._system.pos.y = y;
		}
	});

	Object.defineProperty(Body.prototype, 'pos', {
		get: function() {
			return this._system.pos;
		},
		set: function(pos) {
			this._system.pos = pos;
		}
	});

	Object.defineProperty(Body.prototype, 'life', {
		get: function() {
			return this._system.life;
		},
		set: function(life) {
			this._system.life = life;
		}
	});

	Object.defineProperty(Body.prototype, 'mass', {
		get: function() {
			return this._system.mass;
		},
		set: function(mass) {
			this._system.mass = mass;
		}
	});

	Object.defineProperty(Body.prototype, 'force', {
		get: function() {
			return this._system.force;
		},
		set: function(force) {
			this._system.force = force;
		}
	});

	Object.defineProperty(Body.prototype, 'splineSpeed', {
		get: function() {
			return this._system.splineSpeed || 0;
		},
		set: function(splineSpeed) {
			this._system.splineSpeed = splineSpeed;
		}
	});

	Object.defineProperty(Body.prototype, 'actsOn', {
		get: function() {
			return this._system.actsOn;
		},
		set: function(actsOn) {
			this._system.actsOn = actsOn;
		}
	});

	Object.defineProperty(Body.prototype, 'actsOnStr', {
		get: function() {
			return this._system.actsOn.join(',');
		},
		set: function(actsOn) {
			this._system.actsOn = actsOn.split(',');
		}
	});


	Object.defineProperty(Body.prototype, 'startDelay', {
		get: function() {
			return this._system.startDelay || 0;
		},
		set: function(startDelay) {
			this._system.startDelay = startDelay;
		}
	});

	return Body;
});