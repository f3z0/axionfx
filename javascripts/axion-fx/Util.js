define(function() {
	var bufferCache = {};
	var _htmlRenderModes = {
		'add': 'lighter',
		'subtract': 'darker'
	}
	return {
		isIE: navigator.userAgent.indexOf('MSIE') > - 1,

		toRad: function(deg) {
			return Math.PI * deg / 180;
		},
		isArray: function(v) {
			return Object.prototype.toString.call(v) === '[object Array]';
		},
		isNumber: function(i) {
			return typeof i === 'number';
		},

		isInteger: function(num) {
			return num === (num | 0);
		},
		catmullEstArcLen: function(P0, P1, P2, P3) {
			var len = 0;
			var intervals = 30;
			for(var i = 1; i <= intervals; i++) {
				var ptA = {x: this.catmull((i-1)/intervals, P0.x, P1.x, P2.x, P3.x), y: this.catmull((i-1)/intervals, P0.y, P1.y, P2.y, P3.y)};
				var ptB =  {x: this.catmull(i/intervals, P0.x, P1.x, P2.x, P3.x), y: this.catmull(i/intervals, P0.y, P1.y, P2.y, P3.y)};
				len += Math.sqrt(Math.pow(ptA.x - ptB.x,2)+Math.pow(ptA.y - ptB.y,2));
			}
			return len;
		},

		catmull: function(t, P0, P1, P2, P3){
			var tau = 0.5;    
			var t2 = t*t;
			var t3 = t2 * t;
		    	return ( (1 * P1) +
		    	(-tau*P0 + tau*P2) * t +
		    	(2*tau*P0 + (tau-3)*P1 + (3-2*tau)*P2 - tau*P3) * t2 +
		    	(-tau*P0 + (2-tau)*P1 + (tau-2)*P2 + tau*P3) * t3);
		},

		catmulld: function(t, P0, P1, P2, P3){
			var tau = 0.5;
			var t2 = 2 * t;
			var t3 = 3 * t * t;
			t = 1;
		    	return ( 
		    	(-tau*P0 + tau*P2) * t +
		    	(2*tau*P0 + (tau-3)*P1 + (3-2*tau)*P2 - tau*P3) * t2 +
		    	(-tau*P0 + (2-tau)*P1 + (tau-2)*P2 + tau*P3) * t3);
		},
		
		random11: function() {
			return Math.random()*2-1
		},

		extend: function(obj, config) {
			for (var prop in config) {
				if (config.hasOwnProperty(prop)) {
					obj[prop] = config[prop];
				}
			}
		},

		recursiveExtend: function(obj, config, exceptions) {
			exceptions = exceptions || [];
			for (var prop in config) {
				if (config.hasOwnProperty(prop)) {
					if (exceptions.indexOf(prop) > - 1) {
						obj[prop] = config[prop];
					} else {
						if (typeof config[prop] === 'object') {
							if(obj[prop] === null || typeof obj[prop] === 'undefined') {
								if(obj[prop] instanceof Array) {
									obj[prop] = []
								} else {
									obj[prop] = {}
								}
							}
							this.recursiveExtend(obj[prop], config[prop], exceptions);
						} else {
							obj[prop] = config[prop];
						}
					}
				}
			}
		},

		clone: function(obj) {
			var clone = {};
			this.extend(clone, obj);
			return clone;
		},

		deepClone: function(obj, exceptions) {
			exceptions = exceptions || [];
			if (typeof obj !== 'object') {
				return obj;
			}
			if (Array.isArray(obj)) {
				var cloneArray = [];
				for (var i = 0; i < obj.length; ++i) {
					cloneArray.push(this.deepClone(obj[i], exceptions));
				}
				return cloneArray;
			}

			var clone = {};
			for (var prop in obj) {
				if (exceptions.indexOf(prop) > - 1) {
					clone[prop] = obj[prop];
				} else {
					clone[prop] = this.deepClone(obj[prop], exceptions);
				}
			}
			return clone;
		},
		/*
		 * Given a vector of any length, returns a vector
		 * pointing in the same direction but with a magnitude of 1
		 */
		normalize: function(vector) {
			var length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
			vector.x /= length;
			vector.y /= length;
		},

		/*
		 * Given an array with four channels (r, g, b and a),
		 * returns a css rgba string compatible with Canvas.
		 * Optionally provide an override alpha value that will be used
		 * in place of the actual alpha (useful for texture rendering)
		 */
		colorArrayToString: function(array, overrideAlpha) {
			var r = array[0] | 0;
			var g = array[1] | 0;
			var b = array[2] | 0;
			var a = overrideAlpha || array[3];

			return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
		},
		/*
		 * Utility method to create a canvas the same size as the passed in texture (which is
		 * an Image element). Used for _renderParticleTexture
		 */
		getBuffer: function(texture) {
			var size = '' + texture.width + 'x' + texture.height;

			var canvas = bufferCache[size];

			if(!canvas) {
				canvas = document.createElement('canvas');
				canvas.width = texture.width;
				canvas.height = texture.height;
				bufferCache[size] = canvas;
			}

			return canvas;
		},
		htmlRenderMode: function(renderMode) {
			return _htmlRenderModes[renderMode] || renderMode;
		}
	};
});

