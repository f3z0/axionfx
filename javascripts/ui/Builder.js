define([
	'particlesystem/PredefinedSystems',
	'ui/FullConfig', 
	'ui/PropertyMap', 
	'ui/Parser',
	'third/dat.gui.min'
], 
function(predefinedSystems, fullConfig, propertyMap, Parser) {
	var circleFnSrc = 'var r = util.toRad(value.x);\n' + 'return {\n' + 'x: Math.cos(r) * 70,\n' + 'y: Math.sin(r) * 70\n' + '};';

	var Builder = function(containerId, particleSystem, canvas, controller, uiString, includeTransformFn) {
		this.containerId = containerId;
		this.particleSystem = particleSystem;
		this.canvas = canvas;
		this.controller = controller;
		this.uiConfig = uiString && Parser.parse(uiString) || fullConfig;
		this.includeTransformFn = includeTransformFn;

		this.build(includeTransformFn);
	};

	Builder.prototype = {
		build: function(includeTransformFn) {
			var gui = new dat.GUI({ resizable: false, width: 370,  autoPlace: false });

			this.rootGui = gui;

			this._addPlayButton(gui);
			this._addResetButton(gui);
			this._systempicker(gui);
			this._addCanvasSize(gui);

			var useFolders = this.uiConfig.length > 1;

			for (var i = 0; i < this.uiConfig.length; ++i) {
				var config = this.uiConfig[i];
				if (useFolders) {
					var folder = gui.addFolder(config.title || 'Section');
				} else {
					folder = gui;
				}
				for (var k = 0; k < config.items.length; ++k) {
					this._addItem(folder, config.items[k]);
				}
			}

			if (includeTransformFn) {
				this.particleSystem.transformFn = circleFnSrc;
				var transformFolder = gui.addFolder('posVar Transform');
				transformFolder.addTextArea(this.particleSystem, 'transformFn').name('function');
			}

			if(!useFolders) {
				this._openAllSubFolders();
			}

			document.getElementById('guiContainer').appendChild(gui.domElement);

		},

		_openAllSubFolders: function() {
			for(var folderName in this.rootGui.__folders) {
				if(this.rootGui.__folders.hasOwnProperty(folderName)) {

					var folder = this.rootGui.__folders[folderName];
					folder.closed = false;
				}
			}
		},

		_updateDisplays: function(gui) {
			for (var folderName in gui.__folders) {
				if (gui.__folders.hasOwnProperty(folderName)) {
					this._updateDisplays(gui.__folders[folderName]);
				}
			}
			for (var i = 0; i < gui.__controllers.length; ++i) {
				gui.__controllers[i].updateDisplay();
			}
		},

		_addCanvasSize: function(gui) {
			var w = window,
			    d = document,
			    e = d.documentElement,
			    g = d.getElementsByTagName('body')[0],
			    x = w.innerWidth || e.clientWidth || g.clientWidth,
			    y = w.innerHeight|| e.clientHeight|| g.clientHeight;

			var folder = gui.addFolder('Canvas');
			folder.add(this.controller, 'canvasWidth').min(10).max(Math.min(x,y));
			folder.add(this.controller, 'canvasHeight').min(10).max(Math.min(x,y));
		},

		_addPlayButton: function(gui) {
			var c = gui.add(this.controller, 'togglePause').name(this.controller.isPaused() ? 'Play': 'Pause');
			var me = this;
			c.__onChange = function() {
				// opposite, because togglePause hasnt been called yet
				c.name(me.controller.isPaused() ? 'Pause': 'Play');
			};

			var c2 = gui.add(this.controller, 'dumpConfig').name('Dump Config');
		},

		_addResetButton: function(gui) {
			var c = gui.add(this.particleSystem, 'reset').name('Reset');
			var me = this;
			c.onChange(function() {
				setTimeout(function() {
					if(me.includeTransformFn) {
						me.particleSystem.transformFn = circleFnSrc;
					}
					me._updateDisplays(me.rootGui);
				}, 0);
			});
		},


		_addItem: function(gui, item) {
			var type = propertyMap[item];
			this['_' + type](gui, item);
			_this = this;
			for (var i = 0; i < gui.__controllers.length; ++i) {
				gui.__controllers[i].onChange(function(){
					_this.controller.flashConfig();
				});
			}
		},

		_boolean: function(gui, property) {
			gui.add(this.particleSystem, property);
		},

		_color: function(gui, property) {
			var folder = gui.addFolder(property);
			folder.add(this.particleSystem[property], '0').min(0).max(255).name('red');
			folder.add(this.particleSystem[property], '1').min(0).max(255).name('green');
			folder.add(this.particleSystem[property], '2').min(0).max(255).name('blue');
			folder.add(this.particleSystem[property], '3').min(0).max(1).name('alpha');
		},

		_posvector: function(gui, property) {
			var folder = gui.addFolder(property);
			folder.add(this.particleSystem[property], 'x').min(0).max(this.canvas.width);
			folder.add(this.particleSystem[property], 'y').min(0).max(this.canvas.height);
		},

		_vector: function(gui, property) {
			var folder = gui.addFolder(property);
			folder.add(this.particleSystem[property], 'x').min(-500).max(500);
			folder.add(this.particleSystem[property], 'y').min(-500).max(500);
		},

		_pointlist: function(gui, property) {
			var folder = gui.addFolder(property);
			var c = folder.add(this.particleSystem, property);
			var _this = this;
			c.onChange(function(){
				_this.controller.flashConfig();
			})
			return folder;
		},


		_renderModePicker: function(gui, property) {
			return gui.add(this.particleSystem, property, ['add', 'multiply']);
		},


		_number: function(gui, property) {
			return gui.add(this.particleSystem, property).min(-500).max(500);
		},

		_unsignednumber: function(gui, property) {
			gui.add(this.particleSystem, property).min(0).max(1000);
		},

		_systempicker: function(gui) {
			var systems = [];
			for (var i = 0; i < predefinedSystems.systems.length; ++i) {
				var system = predefinedSystems.systems[i];
				systems.push(system.name);
			}

			var c = gui.add(this.particleSystem, 'predefinedSystem', systems);
			var me = this;
			c.onChange(function() {
				me._updateDisplays(me.rootGui);
				me.controller.flashConfig();
			});
		},

		_texture: function(gui) {
			//gui.addFile(this.particleSystem, 'textureFile');
			//gui.add(this.particleSystem, 'resetTexture');
		}
	};

	return Builder;
});

