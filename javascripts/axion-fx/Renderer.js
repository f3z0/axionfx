define(['axion-fx/DirectorEvent'],function(DirectorEvent) {
	var _autoPlay = false;
	var _elapsed = 0;
	var _lastTimestamp;
	var canvas;
	var context;
	var _isPlaying = false;
	var _actors = [];
	var _rendererInstance;
	var lastTime;
	var fps = 24/1000;

	/**
	 * Renderer - Holds the rendering of pixels to screen.
	 *
	 * @author      Gregory Ray <gregory@everadventure.com>
	 * @version     0.1
	 * @since       2014-11-03
	 */
	var Renderer = function(containerId, width, height, autoPlay) {
		_autoPlay = autoPlay;
		_lastTimestamp = (new Date()).getTime();
		_setupRequestAnimationFrame();
		_rendererInstance = this;

		canvas = document.createElement('canvas');
		canvas.id = "canvas-context";
		canvas.width = width;
		canvas.height = height;
		context = canvas.getContext('2d');
		function afterInsert(e) {
			canvas.removeEventListener("DOMNodeInserted", afterInsert);
			if(_autoPlay) _rendererInstance.play();
		}
		canvas.addEventListener("DOMNodeInserted", afterInsert, false);
		document.getElementById(containerId).appendChild(canvas);
	};

	Renderer.prototype = {
		addActor: function(actor) {
			if(_actors.indexOf(actor) !== -1) return;
			var directorEvent = new DirectorEvent(DirectorEvent.actorAddedEventType, _actors.length);
			this.dispatchEvent(directorEvent);
			return _actors.push(actor);
		},
		removeActor: function(actorIdx){
			_actors.splice(actorIdx, 1);
		},
		refreshSystems: function(){
			var directorEvent = new DirectorEvent(DirectorEvent.systemRefreshEventType);
			this.dispatchEvent(directorEvent);
		},
		updateSize: function(width, height) {
			canvas.width = width;
			canvas.height = height;
		},
		play: function() {
			if(_isPlaying) return;
			_lastTimestamp = (new Date()).getTime();
			_isPlaying = true;
			_render();
		},
		pause: function(){
			if(!_isPlaying) return;
			_isPlaying = false;
		},
		stop: function(){
			for(var i = 0; i < _actors.length; i++) _actors[i].restart();
			_isPlaying = false;
		},
		dispatchEvent: function(){
			canvas.dispatchEvent.apply(canvas, arguments);
		},
		addEventListener: function(){
			canvas.addEventListener.apply(canvas, arguments);
		}
	}

	function _render() {
		var timestamp = (new Date()).getTime();
		var delta = timestamp - (_lastTimestamp || timestamp);
		if(delta < fps){
			setTimeout(_render, 1000*(fps-delta));
			return;
		}
		_lastTimestamp = timestamp;
		delta /= 1000;
		_elapsed += delta;
		context.fillStyle = '';
		context.fillRect(0, 0, context.canvas.width, context.canvas.height);

		_rendererInstance.dispatchEvent(new DirectorEvent(DirectorEvent.updatePhaseStartEventType));
		for(var i = 0; i < _actors.length; i++) {
			_actors[i].update(_elapsed, (delta));
			_actors[i].afterUpdate();
		}
		_rendererInstance.dispatchEvent(new DirectorEvent(DirectorEvent.updatePhaseEndEventType));
		_rendererInstance.dispatchEvent(new DirectorEvent(DirectorEvent.renderPhaseStartEventType));
		for(i = 0; i < _actors.length; i++) {

			var c = document.getElementById('canvas-context');
			var ctx=c.getContext("2d");
			ctx.save();
			ctx.scale(window.flashZoom,window.flashZoom);
			if(_actors[i].renderable) _actors[i].render(context);
			if(_actors[i].renderable) _actors[i].afterRender();
			ctx.restore();
		}
		_rendererInstance.dispatchEvent(new DirectorEvent(DirectorEvent.renderPhaseEndEventType));
		requestAnimationFrame(_render);
	}

	function _setupRequestAnimationFrame(){
		// shim layer with setTimeout fallback
		window.requestAnimFrame = (function(){
		  return  window.requestAnimationFrame       ||
		          window.webkitRequestAnimationFrame ||
		          window.mozRequestAnimationFrame    ||
		          function( callback ){
		          	var to = fps-((new Date()).getTime()-(lastTime||(new Date()).getTime()));
		            window.setTimeout(callback, to);
		            lastTime = (new Date()).getTime();
		          };
		})();
		/*window.requestAnimationFrame = window.requestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			window.oRequestAnimationFrame;

		if (!window.requestAnimationFrame) {
			var lastTime = 0;
			window.requestAnimationFrame = function(callback) {
				var currTime = new Date().getTime();
				//var timeToCall = Math.max(0, 16 - (currTime - lastTime));
				var timeToCall = 1000/30;
				var id = window.setTimeout(function() {
					callback(currTime + timeToCall);
				},
				timeToCall);
				lastTime = currTime + timeToCall;
				return id;
			};

		}*/
	}

	Object.defineProperty(Renderer.prototype, 'actors', {
		get: function() {
			return _actors;
		},
		set: function(actors) {
			_actors = actors;
		}
	});

	Object.defineProperty(Renderer.prototype, 'canvasSize', {
		get: function() {
			return {width: canvas.width, height: canvas.height};
		}
	});

	return Renderer;
});

