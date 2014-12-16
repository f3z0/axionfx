define([
	'axion-fx/SystemsManager',
	'builder/Parser',
	'lib/third/dat.gui'
], 
function(SystemsManager, Parser) {

	var Builder = function(containerId, particleSystem, width, height, controller, uiConfig, propertyMap) {
		this.containerId = containerId;
		this.particleSystem = particleSystem;
		this.maxWidth = width;
		this.maxHeight = height;

		this.controller = controller;
		this.uiConfig = uiConfig;
		this.propertyMap = propertyMap;

		return this.build();
	};

	Builder.prototype = {
		build: function() {
			var gui = new dat.GUI({ resizable: false, width: 331,  autoPlace: false, closed: false });

			this.rootGui = gui;

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

			if(!useFolders) {
				this._openAllSubFolders();
			}

			

			document.getElementById(this.containerId).appendChild(gui.domElement);
			return gui;
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

		_addItem: function(gui, item) {
			var prop = this.propertyMap[item];
			this['_' + prop.type](gui, item, prop.params);
			_this = this;
			for (var i = 0; i < gui.__controllers.length; ++i) {
				gui.__controllers[i].onChange(function(){
					_this.controller.flashConfig();
				});
			}
		},

		_actsOn: function(gui) {
			var folder = gui.addFolder('Acts On');

			var c = folder.add(this.particleSystem, 'actsOnStr').listen()
			var actsOnInput = $(c.domElement).find('input');
			$(c.domElement).parent().parent().addClass('tags')
			$(c.domElement).parent().parent().find('.property-name').hide() 
			$($(c.domElement).parent().parent().find('.c')).css('width', '100%') 

			var _this = this;
			var autoTextSource = this.controller.getEmitterNames();

			function refreshTokenSource() {
				autoTextSource = _this.controller.getEmitterNames();
				$(actsOnInput).data('bs.tokenfield').$input.autocomplete({source: autoTextSource});
			}

			$( window ).on( "EmitterAdded", refreshTokenSource);
			$( window ).on( "BodyAdded", refreshTokenSource);

			$(actsOnInput).tokenfield({
			  autocomplete: {
			    source: autoTextSource,
			    delay: 100
			  },
			  showAutocompleteOnFocus: true
			}).on('tokenfield:createtoken', function (e) {
			    var data = e.attrs.value.split('|')[0];
			    autoTextSource = _this.controller.getEmitterNames();
			    $(actsOnInput).data('bs.tokenfield').$input.autocomplete({source: autoTextSource});

			    return ( autoTextSource.indexOf(data) > -1);
			  }).on('tokenfield:createdtoken', function (e){
			  	var data = e.attrs.value.split('|')[0]
			  	var arr  = $(actsOnInput).val().split(',')
			  	arr.push(data);

			  	_this.particleSystem.actsOn = arr;

			  	autoTextSource = _this.controller.getEmitterNames();
			  	$(actsOnInput).data('bs.tokenfield').$input.autocomplete({source: autoTextSource});


			  	_this.controller.flashConfig(true);

			  	$(actsOnInput).val(arr.join(','));


			  }).on('tokenfield:removedtoken', function (e){
			  	var data = e.attrs.value.split('|')[0]

			  	var arr  = $(actsOnInput).val().split(',')
			  	arr.splice(arr.indexOf(data), 1);

			  	_this.particleSystem.actsOn = arr;

			  	autoTextSource = _this.controller.getEmitterNames();
			  	$(actsOnInput).data('bs.tokenfield').$input.autocomplete({source: autoTextSource});

			  	_this.controller.flashConfig(true);

			  	$(actsOnInput).val(arr.join(','));

			  })
		},


		_boolean: function(gui, property) {
			gui.add(this.particleSystem, property);
		},

		_posvector: function(gui, property) {
			var folder = gui.addFolder(property);
			folder.add(this.particleSystem[property], 'x').min(0).max(this.maxWidth).listen();
			folder.add(this.particleSystem[property], 'y').min(0).max(this.maxHeight).listen();
		},

		_vector: function(gui, property) {
			var folder = gui.addFolder(property);
			folder.add(this.particleSystem[property], 'x').min(-500).max(500);
			folder.add(this.particleSystem[property], 'y').min(-500).max(500);
		},

		_renderModePicker: function(gui, property) {
			return gui.add(this.particleSystem, property, ['add', 'alpha', 'darken', 'difference','hardlight','lighten', 'multiply', 'normal', 'overlay', 'screen']);
		},

		_color: function(gui, property) {
			var folder = gui.addFolder(property);
			var c = folder.add(this.particleSystem[property], '0').min(0).max(255).name('red');
			var _this = this;
			c.onChange(function(){
				_this.controller.flashConfig();
			})
			var c = folder.add(this.particleSystem[property], '1').min(0).max(255).name('green');
			c.onChange(function(){
				_this.controller.flashConfig();
			})
			var c = folder.add(this.particleSystem[property], '2').min(0).max(255).name('blue');
			c.onChange(function(){
				_this.controller.flashConfig();
			})

			var c = folder.add(this.particleSystem[property], '3', 0,1,0.1).name('alpha');
			c.onChange(function(){
				_this.controller.flashConfig();
			})
		},

		_pointlist: function(gui, property) {
			if(!this.particleSystem[property]) return;
			var folder = gui.addFolder(property);
			var c = folder.add(this.particleSystem, property);
			var _this = this;
			c.onChange(function(){
				_this.controller.flashConfig();
			})
			return folder;
		},

		_number: function(gui, property, params) {
			var p = [this.particleSystem, property];
			if(params) p = p.concat(params);
			else p = p.concat([-500,500]);
			return gui.add.apply(gui, p).listen();
		},

		_unsignednumber: function(gui, property, params) {
			var p = [this.particleSystem, property];
			if(params) p = p.concat(params);
			else p = p.concat([0,1000]);
			gui.add.apply(gui, p).listen();
		},

		_systempicker: function(gui) {
			var systems = [];
			for (var i = 0; i < SystemsManager.getInstance().systems.length; ++i) {
				var system = SystemsManager.getInstance().systems[i];
				systems.push(system.name);
			}

			var c = gui.add(this.particleSystem, 'predefinedSystem', systems);
			var _this = this;
			c.onChange(function() {
				_this._updateDisplays(_this.rootGui);
				_this.controller.flashConfig(true);
			});
		},

		_texture: function(gui) {
			var c = gui.add(this.particleSystem, 'textureSource');
			var _this = this;	
		}
	};

	return Builder;
});

