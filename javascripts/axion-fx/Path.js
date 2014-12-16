define([
	'axion-fx/System',
	'axion-fx/Actor',
	'axion-fx/Util'
], 
function(System, Actor, Util) {
	var _instance;

	Path.prototype = new Actor();
	Path.prototype.constructor=Path;

	/**
	 * Path - Used to generated translational coordinate instructions based on a curved cubic spline (catmul-rom) and user defined anchor points.
	 *
	 * @author      Gregory Ray <gregory@everadventure.com>
	 * @version     0.1
	 * @since       2014-11-03
	 */
	function Path(system) {
		_instance = this;
		
		//this.system = system;
		Actor.prototype.init.apply(this, [system]);

	}

	Util.extend(Path.prototype, {
		actorType: 'PATH',
		renderable: false,
		config: function(system) {
			this.system = system;
		},
		addRenderer: function(renderer) {
			Actor.prototype.addRenderer.apply(this, [renderer]);
			renderer.addEventListener('actorAdded', _checkActor);
			this._afterUpdate.push(function(){
				for(var i = 0; i < renderer.actors.length; i++){
					var actor = renderer.actors[i];
					if(this.system.actsOn.indexOf(actor.predefinedSystem) != -1){
						actor.system.path = this;
						actor.recalculateCurves();
					} else if (actor.system.path === this) {
						actor.system.path = null;
					}
				}
			});
		}
	});

	function _checkActor(e) {
		var actor = _instance._renderer.actors[e.detail];
		if(this.system.actsOn.indexOf(actor.predefinedSystem) !== -1){
			actor.system.path = this;
		}
	}

	Object.defineProperty(Path.prototype, 'systemName', {
		get: function() {
			return this._system.systemName;
		},
		set: function(name) {
			this._system.systemName = name;
		}
	});

	Object.defineProperty(Path.prototype, 'splineSpeed', {
		get: function() {
			return this.system.splineSpeed;
		},
		set: function(splineSpeed) {
			this.system.splineSpeed = splineSpeed;
		}
	});


	Object.defineProperty(Path.prototype, 'splineAnchorPts', {
		get: function() {
			return this.system.splineAnchorPts;
		},
		set: function(splineAnchorPts) {
			this.system.splineAnchorPts = splineAnchorPts;
		}
	});

	Object.defineProperty(Path.prototype, 'splineIsPath', {
		get: function() {
			return this.system.splineIsPath;
		},
		set: function(splineIsPath) {
			this.system.splineIsPath = splineIsPath;
		}
	});


	Object.defineProperty(Path.prototype, 'splineClockwise', {
		get: function() {
			return this.system.splineClockwise;
		},
		set: function(splineClockwise) {
			this.system.splineClockwise = splineClockwise;
		}
	});

	Object.defineProperty(Path.prototype, 'splineRelForceOn', {
		get: function() {
			return this.system.splineRelForceOn;
		},
		set: function(splineRelForceOn) {
			this.system.splineRelForceOn = splineRelForceOn;
		}
	});

	Object.defineProperty(Path.prototype, 'actsOn', {
		get: function() {
			return this.system.actsOn;
		},
		set: function(actsOn) {
			this.system.actsOn = actsOn;
		}
	});

	Object.defineProperty(Path.prototype, 'actsOnStr', {
		get: function() {
		    return this.system.actsOn.join(',');
		},
		set: function(actsOn) {
		    this.system.actsOn = actsOn.split(',');
		}
	});

	return Path;
});

