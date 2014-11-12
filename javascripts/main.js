
require([
	'particlesystem/PredefinedSystems', 
	'particlesystem/Emitter', 
	'particlesystem/Renderer', 
	'particlesystem/util',
	'ui/Builder',
	'third/stats.min',
	'ui/PropertyMap' ,
	'third/dat.gui.min'

],
function(predefinedSystems, Emitter, Renderer, util, Builder, wtf, propertyMap) {
	var paused = true;
	var lastTimestamp = 0;

	var emitter;
	var canvas;
	var context;
	//var stats;

	function setupRequestAnimationFrame() {
		this.requestAnimationFrame = window.requestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			window.oRequestAnimationFrame;

		if (!this.requestAnimationFrame) {
			// polyfill, primarily for IE9
			var lastTime = 0;
			this.requestAnimationFrame = function(callback, element) {
				var currTime = new Date().getTime();
				var timeToCall = Math.max(0, 16 - (currTime - lastTime));
				var id = window.setTimeout(function() {
					callback(currTime + timeToCall);
				},
				timeToCall);
				lastTime = currTime + timeToCall;
				return id;
			};
		}
	}

	function getUrlParam(name) {
		name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
		var regexS = "[\\?&]" + name + "=([^&#]*)";
		var regex = new RegExp(regexS);
		var results = regex.exec(window.location.href);

		return (results && results[1]) || '';
	}

	function getCanvasSize() {
		
		return {
			width: 600,
			height: 600
		};
	}


	/*function initStats(statsContainerId) {
		stats = new Stats();
		stats.setMode(0);

		stats.domElement.style.position = 'absolute';
		stats.domElement.style.top = 0;
		stats.domElement.style.left = 0;

		document.getElementById(statsContainerId).appendChild(stats.domElement);

		var graphs = ['fpsGraph', 'msGraph'];
		for (var i = 0; i < graphs.length; ++i) {
			var graphId = graphs[i];
			var graph = document.getElementById(graphId);
			graph.parentNode.removeChild(graph);
		}
	}*/

	function draw(timestamp) {
		if (paused) {
			return;
		}
		//stats.begin();

		var delta = timestamp - (lastTimestamp || timestamp);
		lastTimestamp = timestamp;

		delta /= 1000;
		emitter.update(delta);

		context.fillStyle = 'black';
		context.fillRect(0, 0, context.canvas.width, context.canvas.height);

		Renderer.render(context, emitter.particles);

		requestAnimationFrame(draw);
		//stats.end();
	}

	ignorePropList = ['texture'];

	var controller = {
		flashConfig: function(){
			var systemConfig = {}
			for(var k in propertyMap){
				if(typeof this.emitter[k] !== 'undefined' && ignorePropList.indexOf(k) === -1) systemConfig[k] = this.emitter[k];
			}
			systemConfig.systemName = this.emitter.predefinedSystem;
			document.getElementById('flashemitter').config(JSON.stringify(systemConfig));
			document.getElementById('flashemitter').updateSpline();
		},
		dumpConfig: function() {
			var systemConfig = {}
			for(var k in propertyMap){
				if(typeof this.emitter[k] !== 'undefined' && ignorePropList.indexOf(k) === -1) systemConfig[k] = this.emitter[k];
			}
			var cd = new dat.dom.CenteredDiv();
			cd.domElement.innerHTML = "<div id=\"dg-save\" class=\"dg dialogue\">\n\n  Particle Configuration:\n\n  <textarea id=\"dg-new-constructor\"></textarea>\n\n </div>";	
			cd.show();
			var newConstructorTextArea = document.getElementById('dg-new-constructor');
			newConstructorTextArea.innerHTML =  JSON.stringify(systemConfig, null, 4);
			cd.show();
			newConstructorTextArea.focus();
			newConstructorTextArea.select();
		},
		isPaused: function() {
			return paused;
		},
		togglePause: function() {
			paused = ! paused;

			if (!paused) {
				lastTimestamp = 0;

        				var me = this;
			           setTimeout(function() {
			           	me.emitter.reset();
			        	}, 200);
				draw(new Date().getTime());
				this.flashConfig();
				document.getElementById('flashemitter').play();

			} else {
				document.getElementById('flashemitter').pause();
			}
		}
	};

	window.flashHeight = 300;
	window.flashWidth = 300;

	var to;
	Object.defineProperty(controller, 'canvasWidth', {
		get: function() {
			return window.flashWidth;
		}, 
		set: function(width) {
			window.flashWidth = width;
			document.getElementById('flashemitter').width = window.flashWidth*window.flashZoom;
			document.getElementById('flashemitter').externSize(window.flashWidth, window.flashHeight);
			clearTimeout(to);
			var that = this;
			to = setTimeout(function(){
				var systemConfig = {};
				for(var k in propertyMap){
					if(typeof that.emitter[k] !== 'undefined' && ignorePropList.indexOf(k) === -1) systemConfig[k] = that.emitter[k];
				}
				document.getElementById('flashemitter').config(JSON.stringify(systemConfig));
				document.getElementById('flashemitter').updateSpline();
			}, 250);
			adjustSize();
		}
	});

	Object.defineProperty(controller, 'canvasHeight', {
		get: function() {
			return window.flashHeight;
		}, 
		set: function(height) {
			window.flashHeight = height;
			document.getElementById('flashemitter').height = window.flashHeight*window.flashZoom;
			document.getElementById('flashemitter').externSize(window.flashWidth, window.flashHeight);
			clearTimeout(to);
			var that = this;
			to = setTimeout(function(){
				var systemConfig = {};
			for(var k in propertyMap){
				if(typeof that.emitter[k] !== 'undefined' && ignorePropList.indexOf(k) === -1) systemConfig[k] = that.emitter[k];
			}			document.getElementById('flashemitter').config(JSON.stringify(systemConfig));
document.getElementById('flashemitter').updateSpline()}, 250, document.getElementById('flashemitter'));
			adjustSize();
		}
	});

	function launch() {
		setupRequestAnimationFrame();

		var defaultTexture = new Image();
		defaultTexture.src = 'particle.png';

		defaultTexture.onload = function() {
			canvas = document.createElement('canvas');

			var canvasSize = getCanvasSize();

			canvas.width = canvasSize.width;
			canvas.height = canvasSize.height;

			predefinedSystems.positionSystems(canvasSize);
			predefinedSystems.setTexture(defaultTexture);

			emitter = new Emitter(getUrlParam('system'), defaultTexture);
			controller.emitter = emitter;

			context = canvas.getContext('2d');

			var includeTransformFn = getUrlParam('transform') === 'true';

			if (!includeTransformFn) {
				predefinedSystems.deleteSystem('ringoffire');
			}

			new Builder('guiContainer', emitter, canvas, controller, getUrlParam('ui'), includeTransformFn);
			document.getElementById('canvasContainer').appendChild(canvas);
			//initStats('canvasContainer');

			var that = this;
			window.updateSplineJS = function(splineData){
				console.log('updateSplineJS ' + emitter.splineAnchorPts[0].x)
				emitter.overlay({'splineAnchorPts': splineData});
				console.log('updateSplineJS ' + emitter.splineAnchorPts[0].x)

			}


			draw(new Date().getTime());
		};
	}

	launch();
});

