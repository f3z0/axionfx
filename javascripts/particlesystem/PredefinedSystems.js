define(['particlesystem/util'], function(util) {
	var posFuncs = {
		center: function(size) {
			return {
				x: (size.width / 2) | 0,
				y: (size.height / 2) | 0
			};
		},
		centerBottom: function(size) {
			return {
				x: (size.width / 2) | 0,
				y: (size.height * 2 / 3) | 0
			};
		},
		centerOffBottom: function(size) {
			return {
				x: (size.width / 2) | 0,
				y: size.height + 20
			};
		},
		centerAboveTop: function(size) {
			return {
				x: (size.width / 2) | 0,
				y: 0
			};
		},
		bottomLeft: function(size){
			return {
				x: 0,
				y: size.height + 5
			};
		}
	};

	return {
		getSystem: function(name) {
			var system = this.systems[0];
			for (var i = 0; i < this.systems.length; ++i) {
				var ps = this.systems[i];
				if (ps.name === name) {
					system = ps;
					break;
				}
			}
			return util.deepClone(system, ['texture']);
		},

		positionSystems: function(size) {
			for (var i = 0; i < this.systems.length; ++i) {
				var pos = this.systems[i].system.pos;
				this.systems[i].system.pos = posFuncs[pos](size);
			}
		},

		setTexture: function(texture) {
			for (var i = 0; i < this.systems.length; ++i) {
				this.systems[i].system.texture = texture;
			}
		},

		deleteSystem: function(systemName) {
			var index;
			for (var i = 0; i < this.systems.length; ++i) {
				if (this.systems[i].name === systemName) {
					this.systems.splice(i, 1);
					return;
				}
			}
		},



		systems: [{
			name: 'meteor',
			system: {
				totalParticles: 180,
				emissionRate: 45,
				pos: 'center',
				gravity: {
					x: -20,
					y: 200
				},
				angle: 90,
				angleVar: 20,
				speed: 60,
				speedVar: 20,
				life: 2,
				lifeVar: 0,
				radialAccel: 45,
				radialAccelVar: 0,
				tangentialAccel: 45,
				tangentialAccelVar: 0,
				textureEnabled: true,
				renderMode: 'add',
				radius: 12,
				radiusVar: 2,
				startScale: 1,
				endScale: 1,
				startColor: [51, 102, 178.5, 1.0],
				startColorVar: [0, 0, 51, 0.1],
				endColor: [0, 0, 0, 0],
				endColorVar: [0, 0, 0, 0.0],

				active: true,
				duration: Infinity,
				splineAnchorPts: [
					{
					            "x": 149,
					            "y": 28
					        },
					        {
					            "x": 262,
					            "y": 250
					        },
					        {
					            "x": 196,
					            "y": 153
					        },
					        {
					            "x": 143,
					            "y": 124
					        },
					        {
					            "x": 94,
					            "y": 155
					        },
					        {
					            "x": 23,
					            "y": 248
					        }
				],
				splineIsPath: true,
				splineClockwise: true,
				splineSpeed: 50.0,
				splineRelForceOn: true
			}
		},
		{
			name: 'fireworks',
			system: {
				totalParticles: 1500,
				emissionRate: 1500 / 3.5,
				pos: 'centerBottom',
				angle: 90,
				angleVar: 20,
				gravity: {
					x: 0,
					y: - 90
				},
				speed: 180,
				speedVar: 50,
				life: 3.5,
				lifeVar: 1,
				radialAccel: 0,
				radialAccelVar: 0,
				tangentialAccel: 0,
				tangentialAccelVar: 0,
				radius: 8,
				radiusVar: 2,
				startScale: 1,
				endScale: 1,
				startColor: [127.5, 127.5, 127.5, 1],
				startColorVar: [127.5, 127.5, 127.5, 0],
				endColor: [25.5, 25.5, 25.5, 0.2],
				endColorVar: [25.5, 25.5, 25.5, 0.2],
				active: true,
				duration: Infinity,
				splineAnchorPts: [
					{x: 100, y: 40},
					{x: 100, y: 80},
					{x: 100, y: 100},
					{x: 100, y: 120}
				],
				splineSpeed: 20.0,
				splineRelForceOn: true
			}
		},
		{
			name: 'fire',
			system: {
				totalParticles: 250,
				emissionRate: 250 / 7,
				pos: 'centerBottom',
				posVar: {
					x: 40,
					y: 20
				},
				angle: 90,
				angleVar: 10,
				speed: 60,
				speedVar: 20,
				life: 7,
				lifeVar: 4,
				radialAccel: 0,
				radialAccelVar: 0,
				tangentialAccel: 0,
				tangentialAccelVar: 0,
				textureEnabled: true,
				renderMode: 'add',
				radius: 10,
				radiusVar: 1,
				startScale: 1,
				endScale: 1,
				startColor: [193.8, 63.75, 30.6, 1],
				endColor: [0, 0, 0, 0],
				active: true,
				duration: Infinity,
				splineAnchorPts:[]
			}
		},
		{
			name: 'galaxy',
			system: {
				totalParticles: 200,
				emissionRate: 200 / 4,
				pos: 'center',
				angle: 90,
				angleVar: 360,
				speed: 60,
				speedVar: 10,
				life: 4,
				lifeVar: 1,
				radialAccel: - 80,
				radialAccelVar: 0,
				tangentialAccel: 80,
				tangentialAccelVar: 0,
				textureEnabled: true,
				renderMode: 'add',
				radius: 10,
				radiusVar: 2,
				startScale: 1,
				endScale: 1,
				startColor: [30.6, 63.75, 193.8, 1],
				endColor: [0, 0, 0, 1],
				active: true,
				duration: Infinity,
				splineAnchorPts:[]
			}
		},
		{
			name: 'snow',
			system: {
				totalParticles: 700,
				emissionRate: 10,
				pos: 'centerAboveTop',
				posVar: {
					x: 175,
					y: 0
				},
				gravity: {
					x: 0,
					y: 8
				},
				angle: - 90,
				angleVar: 10,
				speed: 9,
				speedVar: 1,
				life: 45,
				lifeVar: 15,
				radialAccel: 0,
				radialAccelVar: 0,
				tangentialAccel: 0,
				tangentialAccelVar: 0,
				textureEnabled: false,
				renderMode: 'normal',
				radius: 3,
				radiusVar: 2,
				startScale: 1,
				endScale: 0.3,
				startColor: [255, 255, 255, 1],
				endColor: [255, 255, 255, 0],
				active: true,
				duration: Infinity,
				splineAnchorPts:[]
			}
		},
		{
			name: 'bubbles',
			system: {
				totalParticles: 500,
				emissionRate: 200,
				active: true,
				duration: Infinity,
				pos: 'centerOffBottom',
				posVar: {
					x: 150,
					y: 0
				},
				angle: 90,
				angleVar: 20,
				life: 3.5,
				lifeVar: 1,
				radius: 8,
				radiusVar: 2,
				textureEnabled: false,
				renderMode: 'add',
				startScale: 1,
				startScaleVar: 0,
				endScale: 1,
				endScaleVar: 0,
				startColor: [198.9, 198.9, 255, 1],
				startColorVar: [0, 0, 38, 0.1],
				endColor: [25.5, 25.5, 25.5, 0.2],
				endColorVar: [25.5, 25.5, 25.5, 0.2],
				gravity: {
					x: 0,
					y: - 90
				},
				radialAccel: 0,
				radialAccelVar: 0,
				tangentialAccel: 0,
				tangentialAccelVar: 0,
				speed: 180,
				speedVar: 50,
				splineAnchorPts:[]
			}
		},
		{
			name: 'watergeyser',
			system: {
				totalParticles: 400,
				emissionRate: 100,
				active: true,
				duration: Infinity,
				pos: 'centerBottom',
				posVar: {
					x: 0,
					y: 0
				},
				angle: 90,
				angleVar: 10,
				life: 2.5,
				lifeVar: 1,
				radius: 5,
				radiusVar: 3,
				textureEnabled: false,
				renderMode: 'normal',
				startScale: 1,
				startScaleVar: 0,
				endScale: 1,
				endScaleVar: 0,
				startColor: [19.89, 59.93, 255, 1],
				startColorVar: [0, 0, 48, 0.3],
				endColor: [198.9, 198.9, 255, 0],
				endColorVar: [0, 0, 0, 0],
				gravity: {
					x: 0,
					y: 150
				},
				radialAccel: 0,
				radialAccelVar: 0,
				tangentialAccel: 0,
				tangentialAccelVar: 0,
				speed: 180,
				speedVar: 50,
				splineAnchorPts:[]
			}
		},
		{
			name: 'ribbon',
			system: {
				totalParticles: 200,
				emissionRate: 40,
				active: true,
				duration: Infinity,
				pos: 'bottomLeft',
				posVar: {
					x: 30,
					y: 0
				},
				angle: 55,
				angleVar: 0,
				life: 2.5,
				lifeVar: 0,
				radius: 10,
				radiusVar: 5,
				textureEnabled: false,
				renderMode: 'normal',
				startScale: 1,
				startScaleVar: 0,
				endScale: 1,
				endScaleVar: 0,
				startColor: [255, 0, 0, 1],
				startColorVar: [0, 0, 0, 0],
				endColor: [0, 0, 255, 1],
				endColorVar: [0, 0, 0, 0],
				gravity: {
					x: 0,
					y: -45
				},
				radialAccel: 0,
				radialAccelVar: 0,
				tangentialAccel: 60,
				tangentialAccelVar: 0,
				speed: 180,
				speedVar: 50,
				splineAnchorPts:[]
			}
		},
		{
			name: 'romancandle',
			system: 
			{
			    "pos": 'center',
			    "posVar": {
			        "x": 0,
			        "y": 0
			    },
			    "life": 3,
			    "lifeVar": 1,
			    "totalParticles": 200,
			    "emissionRate": 50,
			    "startColor": [
			        89.01977969739957,
			        140.15880207675679,
			        208.34416524923304,
			        0.45308356792168325
			    ],
			    "startColorVar": [
			        127.5,
			        127.5,
			        127.5,
			        0.11141399211188932
			    ],
			    "endColor": [
			        81.44362823379109,
			        25.5,
			        25.5,
			        1
			    ],
			    "endColorVar": [
			        25.5,
			        25.5,
			        25.5,
			        0.2
			    ],
			    "radius": 8,
			    "radiusVar": 2,
			    "textureEnabled": false,
			    "renderMode": 'overlay',
			    "speed": 380.94731200951355,
			    "speedVar": 0,
			    "angle": 94.63943560642167,
			    "angleVar": 0,
			    "gravity": {
			        "x": -262.31681682796943,
			        "y": 198.1943505678397
			    },
			    "radialAccel": -367.85790319857296,
			    "radialAccelVar": 7.34122760007928,
			    "tangentialAccel": 109.32189080658031,
			    "tangentialAccelVar": 22.02368280023784,
			    "startScale": 1,
			    "endScale": 1,
			    "splineAnchorPts": null,
			    "splineIsPath": false,
			    "splineClockwise": true,
			    splineAnchorPts:[]
			}
		},
		{
			name: 'spectre',
			system: {
			    "pos": 'center',
			    "posVar": {
			        "x": 1,
			        "y": 1
			    },
			    "life": 2,
			    "lifeVar": 1,
			    "totalParticles": 183,
			    "emissionRate": 70,
			    "startColor": [
			        34.092681586238136,
			        28.410567988531778,
			        0,
			        1
			    ],
			    "startColorVar": [
			        123.1124612836377,
			        0,
			        0,
			        0
			    ],
			    "endColor": [
			        0,
			        107.96015835642076,
			        18.940378659021185,
			        0.7576151463608474
			    ],
			    "endColorVar": [
			        0,
			        39.77479518394449,
			        0,
			        0.47536636634406115
			    ],
			    "radius": 12,
			    "radiusVar": 2,
			    "textureEnabled": true,
			    "renderMode": 'add',
			    "speed": 153,
			    "speedVar": 5,
			    "angle": -456,
			    "angleVar": 0,
			    "gravity": {
			        "x": 35,
			        "y": 5,
			    },
			    "radialAccel": -177,
			    "radialAccelVar": 73,
			    "tangentialAccel": 29,
			    "tangentialAccelVar": 0,
			    "startScale": 1,
			    "endScale": 1,
			    splineAnchorPts: []
		}},
		{
		name: 'metatron',
		system: {
			"totalParticles": 194,
			"pos": 'center',
		    "posVar": {
		        "x": 0,
		        "y": 0
		    },
		    "life": 8,
		    "lifeVar": 1,
		    "emissionRate": 95.43595880103072,
		    "startColor": [
		        151.52302927216948,
		        51.1390223793572,
		        22.728454390825423,
		        1
		    ],
		    "startColorVar": [
		        0,
		        0,
		        0,
		        0.5496423610853207
		    ],
		    "endColor": [
		        20.834416524923302,
		        0,
		        0,
		        1
		    ],
		    "endColorVar": [
		        13.258265061314829,
		        0,
		        0,
		        0
		    ],
		    "radius": 12,
		    "radiusVar": 2,
		    "textureEnabled": true,
		    "renderMode": 'add',
		    "speed": 43.25084240586716,
		    "speedVar": 7.341227600079287,
		    "angle": -110.91493719579779,
		    "angleVar": 58.72982080063429,
		    "gravity": {
		        "x": -210.3236205090878,
		        "y": -202.8960210349618
		    },
		    "radialAccel": -302,
		    "radialAccelVar": 10,
		    "tangentialAccel": 0,
		    "tangentialAccelVar": 168.8482348018236,
		    "startScale": 1,
		    "endScale": 1,
		    splineAnchorPts: []
		}}]
	};
});

