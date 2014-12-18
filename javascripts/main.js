
require([
	'axion-fx/SystemsManager', 
	'axion-fx/System', 
	'axion-fx/Emitter', 
	'axion-fx/Body', 
	'axion-fx/Path',
	'axion-fx/Renderer', 
	'axion-fx/Util',
	'builder/Builder',
	'builder/EmitterPropertyMap' ,
	'builder/BodyPropertyMap' ,
	'builder/PathPropertyMap' ,
	'builder/BodyConfig',
	'builder/PathConfig',
	'builder/EmitterConfig',
	'lib/third/dat.gui'
],
function(SystemsManager, System, Emitter, Body, Path, Renderer, Util, Builder, emitterPropertyMap, bodyPropertyMap, pathPropertyMap, BodyConfig, PathConfig, EmitterConfig, datgui) {
	var paused = true;
	var lastTimestamp = 0;

	var emitters;
	var bodies;
	var paths;
	var renderer;

	var guid = (function() {
	  function s4() {
	    return Math.floor((1 + Math.random()) * 0x10000)
	               .toString(16)
	               .substring(1);
	  }
	  return function() {
	    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
	           s4() + '-' + s4() + s4() + s4();
	  };
	})();

	window.splineChanged = function(systemName, splineData){
		var splineChanged = false;
		for(var i = 0; i < paths.length; i++) {
			if(paths[i].systemName == systemName) {
				paths[i].splineAnchorPts = JSON.parse(splineData);
				splineChanged = true;
			}
		}
		if(splineChanged) window.dispatchEvent(new Event('splineChange'));
	}

	function getUrlParam(name) {
		name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
		var regexS = "[\\?&]" + name + "=([^&#]*)";
		var regex = new RegExp(regexS);
		var results = regex.exec(window.location.href);

		return (results && results[1]) || '';
	}

	ignorePropList = ['system', 'texture', 'vectorfield'];

	var controller = {
		getEmitterNames: function(){
			var arr = [];
			for(var i = 0; i < emitters.length; i++) {
				var emitter = emitters[i];
				arr.push(emitter.predefinedSystem);
			}
			return arr;
		},
		getBodyNames: function(){
			var arr = [];
			for(var i = 0; i < bodies.length; i++) {
				var body = bodies[i];
				arr.push(body.systemName	);
			}
			return arr;
		},
		flashConfig: function(reload){
			if(typeof reload === 'undefined') reload = false;
			var systemConfig = {emitters: [], bodies: [], paths: []}
			for(var i = 0; i < emitters.length; i++) {
				var emitter = emitters[i];
				if(reload) emitter.addRenderer(renderer);
				var emitterConfig = {}
				for(var k in emitterPropertyMap){
					if(typeof emitter.system[k] !== 'undefined' && ignorePropList.indexOf(k) === -1) emitterConfig[k] = emitter.system[k];
				}
				emitterConfig.systemName = emitter.predefinedSystem;
				systemConfig.emitters.push(emitterConfig)
			}
			for(var b = 0; b < bodies.length; b++) {
				var body = bodies[b];
				if(reload) body.addRenderer(renderer);
				var bodyConfig = {}
				for(var k in bodyPropertyMap){
					if(typeof body[k] !== 'undefined' && ignorePropList.indexOf(k) === -1) bodyConfig[k] = body[k];
				}
				bodyConfig.systemName = body.systemName;
				systemConfig.bodies.push(bodyConfig)
			}
			for(var p = 0; p < paths.length; p++) {
				var path = paths[p];
				if(reload) path.addRenderer(renderer);
				var pathConfig = {}
				for(var k in pathPropertyMap){
					if(typeof path[k] !== 'undefined' && ignorePropList.indexOf(k) === -1) pathConfig[k] = path[k];
				}
				pathConfig.systemName = path.systemName;
				systemConfig.paths.push(pathConfig);
			}
			document.getElementById('flashemitter').config(JSON.stringify(systemConfig), reload);
			document.getElementById('flashemitter').updateSpline();
			
		},
		dumpConfig: function() {
			var systemConfig = {emitters: [], bodies: [], paths: []}
			for(var i = 0; i < emitters.length; i++) {
				var emitter = emitters[i];
				var emitterConfig = {}
				for(var k in emitterPropertyMap){
					if(typeof emitter.system[k] !== 'undefined' && ignorePropList.indexOf(k) === -1) emitterConfig[k] = emitter.system[k];
				}
				emitterConfig.systemName = emitter.predefinedSystem;
				systemConfig.emitters.push(emitterConfig)
			}
			for(var b = 0; b < bodies.length; b++) {
				var body = bodies[b];
				var bodyConfig = {}
				for(var k in bodyPropertyMap){
					if(typeof body[k] !== 'undefined' && ignorePropList.indexOf(k) === -1) bodyConfig[k] = body[k];
				}
				bodyConfig.systemName = body.systemName;
				systemConfig.bodies.push(bodyConfig)
			}
			for(var p = 0; p < paths.length; p++) {
				var path = paths[p];
				var pathConfig = {}
				for(var k in pathPropertyMap){
					if(typeof path[k] !== 'undefined' && ignorePropList.indexOf(k) === -1) pathConfig[k] = path[k];
				}
				pathConfig.systemName = path.systemName;
				systemConfig.paths.push(pathConfig);
			}
			var cd = new dat.dom.CenteredDiv();
			cd.domElement.innerHTML = "<div id=\"dg-save\" class=\"dg dialogue\">\n\n  Particle Configuration:\n\n  <textarea id=\"dg-new-constructor\"></textarea>\n\n </div>";	
			cd.show();
			var newConstructorTextArea = cd.domElement.querySelector('#dg-new-constructor');
			newConstructorTextArea.innerHTML =  JSON.stringify(systemConfig, null, 4);
			cd.show();
			newConstructorTextArea.focus();
			newConstructorTextArea.select();
		},
		loadConfig: function(config) {
			$('#canvasContainer canvas').remove();
			emitters.length = 0;
			bodies.length = 0;
			paths.length = 0;
			 
			var system = JSON.parse(config||"{}");
			if(!system.emitters) return;
			for(var x = 0; x < system.emitters.length; x++){
				SystemsManager.getInstance().addSystem(system.emitters[x].systemName, 'EMITTER', system.emitters[x]);	
				var sys = new System(system.emitters[x]);
				var emitter = new Emitter(sys);
				emitter.addRenderer(renderer);
				emitters.push(emitter);
			}
			
			for(var b = 0; b < system.bodies.length; b++){
				SystemsManager.getInstance().addSystem(system.bodies[b].systemName, 'BODY', system.bodies[b]);
				var bodySys = new System(system.bodies[b]);
				var body = new Body(bodySys);
				body.addRenderer(renderer);
				bodies.push(body);
			}

			for(var p = 0; p < system.paths.length; p++){
				SystemsManager.getInstance().addSystem(system.paths[p].systemName, 'PATH', system.paths[p]);
				var pathSys = new System(system.paths[p]);
				var path = new Path(pathSys);
				path.addRenderer(renderer);
				paths.push(path);
			}

			this.flashConfig(true);
		},
		loadConfigDialog: function(){
			controller.loadConfigDialogEle.dialog( "open" );
		},
		isPaused: function() {
			return paused;
		},
		togglePause: function() {
			paused = ! paused;
			if (!paused) {
				lastTimestamp = 0;
        				var me = this;
	

				this.flashConfig();
				document.getElementById('flashemitter').play();
				renderer.play();
			} else {
				document.getElementById('flashemitter').pause();
				renderer.pause();
			}
		},
		addEmitter: function(template) {
			var systemName = guid();

			var divId = 'gui-container-emitters-' + (emitters.length);
			var heading = document.createElement('h3');
			heading.setAttribute('id', 'heading'+(emitters.length))

			var def = Util.deepClone(SystemsManager.getInstance().getSystem(template), ['texture']);
			def.systemName = systemName;

			heading.setAttribute('data-idx', emitters.length)
			heading.innerHTML = systemName;
			document.getElementById('emitters-tab').appendChild(heading);
			var div = document.createElement('div');
			div.setAttribute('id', divId);


			
			def.textureSource = def._textureSource;
			var emitter = new Emitter(def);
			emitter.addRenderer(renderer);

			emitters.push(emitter);
			var that = this;
			function afterInsert(e) {
				setTimeout(function(){
					div.removeEventListener("DOMNodeInserted", afterInsert);
					new Builder(divId, emitter.system, window.flashWidth, window.flashHeight, controller, EmitterConfig, emitterPropertyMap)
					.add(controller, 'removeEmitter').name('Remove Emitter');

					$(document.getElementById('emitters-tab')).accordion( "refresh" );
					controller.flashConfig(true);
					$(window).trigger( "EmitterAdded", [ ] );

					$(document.getElementById('emitters-tab')).accordion({
					  active: emitters.length-1
					});
					document.getElementById('flashemitter').setActiveActor(emitters.length-1, 'emitter');
				},100);
				


			}

			div.addEventListener("DOMNodeInserted", afterInsert, false);

			document.getElementById('emitters-tab').appendChild(div);

			return emitter;
		},
		addBody: function() {
			var divId = 'gui-container-bodies-' + (bodies.length);
			var heading = document.createElement('h3');
			var systemName = guid();
			heading.setAttribute('id', 'heading'+(bodies.length))

			heading.setAttribute('data-idx', bodies.length)
			heading.innerHTML = systemName;
			document.getElementById('bodies-tab').appendChild(heading);
			var div = document.createElement('div');
			div.setAttribute('id', divId)

			var body = new Body({systemName: systemName, actsOn: [], pos: {x:25, y: 25}, mass: 250, force: 250});
			body.addRenderer(renderer);

			bodies.push(body);
			var that = this;
			function afterInsert(e) {
				setTimeout(function(){
					div.removeEventListener("DOMNodeInserted", afterInsert);
					new Builder(divId, body, window.flashWidth, window.flashHeight, controller, BodyConfig, bodyPropertyMap)
					.add(controller, 'removeBody').name('Remove Body');

					$(document.getElementById('bodies-tab')).accordion( "refresh" );
					controller.flashConfig(true);
					$(window).trigger( "BodyAdded", [ ] );

					$(document.getElementById('bodies-tab')).accordion({
					  active: bodies.length-1
					});
					document.getElementById('flashemitter').setActiveActor(bodies.length-1, 'body');
				}, 100);

			}

			div.addEventListener("DOMNodeInserted", afterInsert, false);

			document.getElementById('bodies-tab').appendChild(div);

			return body;
		},
		addPath: function() {
			var divId = 'gui-container-paths-' + (paths.length);
			var systemName = guid();

			var heading = document.createElement('h3');
			heading.setAttribute('id', 'heading'+(paths.length))

			heading.setAttribute('data-idx', paths.length)
			heading.innerHTML = systemName;
			document.getElementById('paths-tab').appendChild(heading);
			var div = document.createElement('div');
			div.setAttribute('id', divId)

			var path = new Path({
				systemName: systemName,
				actsOn: [], 
				splineAnchorPts: [{
					"x": 10,
					"y": 10
				},
				{
					"x": 50,
					"y": 10
				},
				{
					"x": 50,
					"y": 75
				},
				{
					"x": 10,
					"y": 75
				}],
				splineSpeed: 50,
				splineIsPath: true,
				splineClockwise: true,
				splineRelForceOn: false
			});
			path.addRenderer(renderer);
			paths.push(path);
			var that = this;
			function afterInsert(e) {
				setTimeout(function(){
					div.removeEventListener("DOMNodeInserted", afterInsert);
					new Builder(divId, path, window.flashWidth, window.flashHeight, controller, PathConfig, pathPropertyMap)
					.add(controller, 'removePath').name('Remove Path');

					$(document.getElementById('paths-tab')).accordion( "refresh" );
					controller.flashConfig(true);
					$(window).trigger( "PathAdded", [ ] );

					$(document.getElementById('paths-tab')).accordion({
					  active: paths.length-1
					});
					document.getElementById('flashemitter').setActiveActor(paths.length-1, 'path');
				}, 100);

			}

			div.addEventListener("DOMNodeInserted", afterInsert, false);
			document.getElementById('paths-tab').appendChild(div);

			return path;
		},
		removeEmitter: function(){
			var idx = parseInt($('#emitters-tab .ui-accordion-header-active:first').attr('data-idx'));	
			document.getElementById('emitters-tab').removeChild($('#emitters-tab #heading'+idx).get(0));
			document.getElementById('emitters-tab').removeChild($('#emitters-tab #gui-container-emitters-'+idx).get(0));

			emitters.splice(idx, 1);

			for(var i = idx; i < emitters.length; i++) {
				document.getElementById('emitters-tab').querySelector('#heading'+(i+1)).setAttribute('data-idx', i);
				document.getElementById('emitters-tab').querySelector('#heading'+(i+1)).innerHTML = "Emitter " + (i+1);
				document.getElementById('emitters-tab').querySelector('#heading'+(i+1)).setAttribute('id', 'heading'+(i));
				document.getElementById('emitters-tab').querySelector('#gui-container-emitters-'+(i+1)).setAttribute('id', 'gui-container-emitters-'+(i));
			}

			document.getElementById('flashemitter').setActiveActor(-1);
			controller.flashConfig(true);

		},
		removeBody: function(){
			var idx = parseInt($('#bodies-tab .ui-accordion-header-active:first').attr('data-idx'));				
			document.getElementById('bodies-tab').removeChild($('#bodies-tab #heading'+idx).get(0));
			document.getElementById('bodies-tab').removeChild($('#bodies-tab #gui-container-bodies-'+idx).get(0));

			bodies.splice(idx, 1);

			for(var i = idx; i < bodies.length; i++) {
				document.getElementById('bodies-tab').querySelector('#heading'+(i+1)).setAttribute('data-idx', i);
				document.getElementById('bodies-tab').querySelector('#heading'+(i+1)).innerHTML = "Body " + (i+1);
				document.getElementById('bodies-tab').querySelector('#heading'+(i+1)).setAttribute('id', 'heading'+(i));
				document.getElementById('bodies-tab').querySelector('#gui-container-bodies-'+(i+1)).setAttribute('id', 'gui-container-bodies-'+(i));
			}

			document.getElementById('flashemitter').setActiveActor(-1);
			controller.flashConfig(true);

		},
		removePath: function(){
			var idx = parseInt($('#paths-tab .ui-accordion-header-active:first').attr('data-idx'));				
			document.getElementById('paths-tab').removeChild($('#paths-tab #heading'+idx).get(0));
			document.getElementById('paths-tab').removeChild($('#paths-tab #gui-container-paths-'+idx).get(0));

			paths.splice(idx, 1);

			for(var i = idx; i < paths.length; i++) {
				document.getElementById('paths-tab').querySelector('#heading'+(i+1)).setAttribute('data-idx', i);
				document.getElementById('paths-tab').querySelector('#heading'+(i+1)).innerHTML = "Path " + (i+1);
				document.getElementById('paths-tab').querySelector('#heading'+(i+1)).setAttribute('id', 'heading'+(i));
				document.getElementById('paths-tab').querySelector('#gui-container-paths-'+(i+1)).setAttribute('id', 'gui-container-paths-'+(i));
			}

			document.getElementById('flashemitter').setActiveActor(-1);
			controller.flashConfig(true);

		}
	};

	window.flashHeight = 500;
	window.flashWidth = 500;

	var to;
	Object.defineProperty(controller, 'canvasWidth', {
		get: function() {
			return window.flashWidth;
		}, 
		set: function(width) {
			window.flashWidth = width;
			document.getElementById('flashemitter-bg').style.width = (window.flashWidth*window.flashZoom) + 'px';
			document.getElementById('flashemitter').width = window.flashWidth*window.flashZoom;
			document.getElementById('flashemitter').externSize(window.flashWidth, window.flashHeight);
			clearTimeout(to);
			to = setTimeout(this.flashConfig, 250);
			adjustSize();
		}
	});

	Object.defineProperty(controller, 'canvasHeight', {
		get: function() {
			return window.flashHeight;
		}, 
		set: function(height) {
			window.flashHeight = height;
			document.getElementById('flashemitter-bg').style.height = (window.flashHeight*window.flashZoom) + 'px';
			document.getElementById('flashemitter').height = window.flashHeight*window.flashZoom;
			document.getElementById('flashemitter').externSize(window.flashWidth, window.flashHeight);
			clearTimeout(to);
			to = setTimeout(this.flashConfig, 250);
			adjustSize();
		}
	});

	Object.defineProperty(controller, 'previewMode', {
		get: function() {
			return (typeof document.getElementById('flashemitter').externGetPreviewMode === 'undefined') ? false : document.getElementById('flashemitter').externGetPreviewMode();
		}, 
		set: function(previewMode) {
			if(typeof document.getElementById('flashemitter').externSetPreviewMode !== 'undefined') document.getElementById('flashemitter').externSetPreviewMode(previewMode);
		}
	});

	Object.defineProperty(controller, 'html5Mode', {
		get: function() {
			return $('#canvasContainer').css('display') === 'block';
		}, 
		set: function(html5Mode) {
			if(html5Mode){
				$('#canvasContainer').css('display', 'block');
				$('#flashemitter-bg').css('visibility', 'hidden');

			} else {
				$('#canvasContainer').css('display', 'none');
				$('#flashemitter-bg').css('visibility', 'visible');

			}
		}
	});

	var controls = {
		_addCanvasSize: function(gui) {
			var w = window,
			    d = document,
			    e = d.documentElement,
			    g = d.getElementsByTagName('body')[0],
			    x = w.innerWidth || e.clientWidth || g.clientWidth,
			    y = w.innerHeight|| e.clientHeight|| g.clientHeight;

			//var folder = gui.addFolder('Canvas');
			gui.add(controller, 'canvasWidth').min(10).max(Math.min(x,y));
			gui.add(controller, 'canvasHeight').min(10).max(Math.min(x,y));
			gui.add(controller, 'previewMode').name('Preview Mode');
			gui.add(controller, 'html5Mode').name('HTML5 Mode');
			
		},

		_addPlayButton: function(gui) {
			var c = gui.add(controller, 'togglePause').name(controller.isPaused() ? 'Play': 'Pause');
			c.__onChange = function() {
				// opposite, because togglePause hasnt been called yet
				c.name(controller.isPaused() ? 'Pause': 'Play');
			};

			var c2 = gui.add(controller, 'dumpConfig').name('Dump Config');

			var c2 = gui.add(controller, 'loadConfigDialog').name('Load Config');

		},

		_addResetButton: function(gui) {
			var c = gui.add(this.particleSystem, 'reset').name('Reset');
			var me = this;
			c.onChange(function() {
				setTimeout(function() {
					me._updateDisplays(me.rootGui);
				}, 0);
			});
		}

		
	}

	function launch() {
			renderer = new Renderer('canvasContainer', window.flashWidth, window.flashHeight, true);
			SystemsManager.getInstance().positionSystems({width: window.flashWidth, height: window.flashHeight});

			emitters = [];
			bodies = [];
			paths = [];

			var emitter = controller.addEmitter('rainbowroad');
			var body = controller.addBody();
			body.system.pos.x = 100;
			body.system.pos.y = 100;

			body.system.actsOn.push(emitter.systemName);
			var path = controller.addPath();
			path.system.actsOn.push(emitter.systemName);
			
			var guiCanvas = new dat.GUI({ resizable: false, width: 331,  autoPlace: false });

			controls._addPlayButton(guiCanvas);
			document.getElementById('addEmitter').addEventListener('click', function() {
				$('#template').empty();
				for(var i = 0; i < SystemsManager.getInstance().systems.length; i++){
					if(SystemsManager.getInstance().systems[i].actorType === 'EMITTER'){
						$('#template').append($('<option>' + SystemsManager.getInstance().systems[i].systemName + '</option>'));
					}
				}
				dialog.dialog( "open" );
			});
			document.getElementById('addBody').addEventListener('click', controller.addBody);
			document.getElementById('addPath').addEventListener('click', controller.addPath);

			var dialog = $( "#dialog-add-emitter" ).dialog({
			     autoOpen: false,
			     height: 150,
			     width: 300,
			     modal: true,
			     buttons: {
			       "Add Emitter": function(){
			       	dialog.dialog( "close" );
			       	controller.addEmitter($('#template').val());
			       },
			       Cancel: function() {
			         dialog.dialog( "close" );
			       }
			     },
			     close: function() {
			     }
			   });

			controller.loadConfigDialogEle = $( "#dialog-load-config" ).dialog({
			     autoOpen: false,
			     height: 500,
			     width: 400,
			     modal: true,
			     buttons: {
			       "Load Config": function(){
			       	dialog.dialog( "close" );
			       	controller.loadConfig($('#config-json').val());
			       },
			       Cancel: function() {
			         dialog.dialog( "close" );
			       }
			     },
			     close: function() {
			     }
			   });


			controls._addCanvasSize(guiCanvas);
			document.getElementById('guiContainer-canvas').appendChild(guiCanvas.domElement);

			bcTO = -1;
			window.bodiesChanged = function(bodiesData) {
				clearTimeout(bcTO);
				bcTO = setTimeout(function(){
					var updatedBodies = JSON.parse(bodiesData);
					for(var i = 0; i < bodies.length; i++) {
						bodies[i].config(updatedBodies[i]);
					}
				}, 200);
			}

			ecTO = -1;
			window.emittersChanged = function(emittersData) {
				clearTimeout(ecTO);
				ecTO = setTimeout(function(){
					var updatedEmitters = JSON.parse(emittersData);
					for(var i = 0; i < emitters.length; i++) {
						emitters[i].pos.x = updatedEmitters[i].pos.x;
						emitters[i].pos.y = updatedEmitters[i].pos.y;
					}
				}, 200);
			}

			setTimeout(function(){
				controller.flashConfig(true)

			}, 500);

	}

	launch();
});

