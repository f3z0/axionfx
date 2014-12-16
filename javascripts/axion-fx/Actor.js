
define([
	'axion-fx/System',
	'axion-fx/SystemsManager',
	'axion-fx/DirectorEvent',
	'axion-fx/Util'
], function(System, SystemsManager, DirectorEvent, Util) {

    /**
     * Actor.js
     * Something that moves around and acts/reacts with environment either directly or indirectly.
     *
     * @author      Gregory Ray <gregory@everadventure.com>
     * @version     0.1
     * @since       2014-11-03
     */
    var Actor = function() {};

    Actor.prototype = {
        _renderIdx: -1,
        _traversalDuration: 0,
        _splineSegmentArcLens: null,
        _splineLenTotal: 0,
        _system: null,
        _predefinedSystemName: '',
        _renderer: null,
        addEventListener: function(type, cb){
            if(!this._eventCBs[type]) this._eventCBs[type] = [];
            if(this._eventCBs[type].indexOf(cb) === -1) this._eventCBs[type].push(cb);
        },
        dispatchEvent: function(event){
            var that = this;
            setTimeout(function(){
                if(that._eventCBs[event.type]) {
                    for(var i = 0; i < that._eventCBs[event.type].length; i++){
                        that._eventCBs[event.type][i](event);
                    }
                }
            }, 0);
        },
    	actorType: 'GENERIC',
    	renderable: false,
        init: function(system){
            this._eventCBs = {};
            this._relForce = {};
            this._afterUpdate = [];
            this._afterRender = [];
    		if(typeof system === 'object') {
                console.log('1 ' + system.systemName)
    			this._predefinedSystemName = system.systemName;
    			SystemsManager.getInstance().addSystem(this._predefinedSystemName, this.actorType, system);
                                this._system = SystemsManager.getInstance().getSystem(this._predefinedSystemName);
                                console.log('2 ' + this._system.systemName)

    		} else if (typeof system === 'string') {
    			this._predefinedSystemName = system;
    			this._system = SystemsManager.getInstance().getSystem(this._predefinedSystemName);
    		}
    	},
        handleEvent: function(e) {

        },
    	recalculateCurves: function(){
    		if(this._system.path && Util.isArray(this._system.path.splineAnchorPts) && this._system.path.splineAnchorPts.length >= 4 && this._system.path.splineIsPath) {
    			this._splineSegmentArcLens = new Array();
    			this._splineLenTotal = 0;
    			for(var k = 0; k < this._system.path.splineAnchorPts.length; k++){
    				var P0 = this._system.path.splineAnchorPts[k];
    				var P1 = this._system.path.splineAnchorPts[(1+k) % this._system.path.splineAnchorPts.length];
    				var P2 = this._system.path.splineAnchorPts[(2+k) % this._system.path.splineAnchorPts.length];
    				var P3 = this._system.path.splineAnchorPts[(3+k) % this._system.path.splineAnchorPts.length];
    				var segLen = Util.catmullEstArcLen(P0, P1, P2, P3);
    				this._splineLenTotal += segLen;
    				this._splineSegmentArcLens.push(segLen);
    			}
    			this._traversalDuration = this._splineLenTotal/this._system.path.splineSpeed;
    		}
    	},
    	restart: function(e) {
    		this._afterUpdate.push(function(){
    			//SystemsManager.getInstance().positionSystems(new Rectangle(0 ,0, _renderer.width, _renderer.height));
    			var bodies = null;
    			var path = null;
    			if(this._system) bodies = this._system.bodies;
    			if(this._system) path = this._system.path;
    			this._system = SystemsManager.getInstance().getSystem(this._predefinedSystemName);
    			if(bodies) this._system.bodies = bodies;
    			if(path) this._system.path = path;
    			this.recalculateCurves();
    		});
    	},
    	addRenderer: function(renderer) {
    		this._renderer = renderer;
    		this._renderIdx = renderer.addActor(this);
    		this.restart();
    		renderer.addEventListener(DirectorEvent.systemRefreshEventType, this.restart);
    	},
    	removeRenderer: function(renderer) {
    		if(this._renderIdx < 0) return;
    		renderer.removeActor(this._renderIdx);
    		this._renderIdx = -1;
    	},
    	update: function(elapsed, delta) {
    		if(!this._system) return;
    		elapsed -= (this._system.startDelay || 0)/1000;
    		if(this._system.path && Util.isArray(this._system.path.splineAnchorPts) && this._system.path.splineAnchorPts.length >= 4) {
                                var t = 0;
    			if(!this._system.path.splineIsPath) t = Math.random();
    			else t =  ((elapsed % this._traversalDuration) / this._traversalDuration);
    			if(this._system.path.splineClockwise) t = 1.0- t;
                
    			if(elapsed < 0) t = 0;

    			var k;
    			var travelled=0;
    			for(k = 0; k < this._splineSegmentArcLens.length; k++){
    				if( (travelled+this._splineSegmentArcLens[k]) / this._splineLenTotal > t) break;
    				travelled += this._splineSegmentArcLens[k];
    			}
    				
    			var P0 = this._system.path.splineAnchorPts[(0+k) % this._system.path.splineAnchorPts.length];
    			var P1 = this._system.path.splineAnchorPts[(1+k) % this._system.path.splineAnchorPts.length];
    			var P2 = this._system.path.splineAnchorPts[(2+k) % this._system.path.splineAnchorPts.length];
    			var P3 = this._system.path.splineAnchorPts[(3+k) % this._system.path.splineAnchorPts.length];

    			var segmentStartT =  travelled / this._splineLenTotal;
    			var segmentDeltaT =  this._splineSegmentArcLens[k] / this._splineLenTotal;
    			var segmentT = (t - segmentStartT) / segmentDeltaT;

    			var xTemp = this._system.pos.x;
    			var yTemp = this._system.pos.y;
    			
    			this._system.pos = {x: Util.catmull(segmentT, P0.x, P1.x, P2.x, P3.x), y: Util.catmull(segmentT, P0.y, P1.y, P2.y, P3.y)};
    			this._relForce = {x: Util.catmulld(segmentT, P0.x, P1.x, P2.x, P3.x), y: Util.catmulld(segmentT, P0.y, P1.y, P2.y, P3.y)};
    			Util.normalize(this._relForce)
    			if(this._system.pos.x != xTemp || this._system.pos.y != yTemp) this.dispatchEvent(new DirectorEvent(DirectorEvent.actorAttrChangeEventType)); 
    		}
    	},
    	afterUpdate: function(){
    		while(this._afterUpdate.length > 0){
    			this._afterUpdate.shift().call(this);
    		}
    	},
    	afterRender: function(){
    		while(this._afterUpdate.length > 0){
    			this._afterUpdate.shift().call(this);
    		}
    	}
    }

    Object.defineProperty(Actor.prototype, 'system', {
    	get: function() {
    		return this._system;
    	}
    });

    Object.defineProperty(Actor.prototype, 'systemName', {
    	get: function() {
    		return this._predefinedSystemName;
    	}
    });

    Object.defineProperty(Actor.prototype, 'predefinedSystem', {
    	get: function() {
    		return this._predefinedSystemName;
    	},
    	set: function(ps) {
    		if(this._predefinedSystemName != ps) {
    			this._predefinedSystemName = ps;
    			this._system = SystemsManager.getInstance().getSystem(ps);
    			this.restart();
    		}
    	}
    });

    Object.defineProperty(Actor.prototype, 'startDelay', {
    	get: function() {
    		return this._system.startDelay;
    	},
    	set: function(val) {
    		this._system.startDelay = val;

    	}
    });

    return Actor;

});
