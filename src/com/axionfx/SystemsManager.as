package com.axionfx
{
	import flash.display.Bitmap;
	import flash.geom.Point;
	import flash.geom.Rectangle;

	/**
	 * SystemsManager class provides basic access helpers
	 * to find predefined systems, add additional systems and
	 * to bulk update system traits.
	 *
	 * @author      Gregory Ray <gregory@everadventure.com>
	 * @version     0.1
	 * @since       2014-11-03
	 */
	public class SystemsManager
	{
		private var systems:Array = new Array();
		private static var INSTANCE:SystemsManager;

		public function SystemsManager() {
			addSystem('rainbowroad', 'EMITTER', {"pos": {
			                "x": 263,
			                "y": 253
			            },
			            "posVar": {
			                "x": 0,
			                "y": 0
			            },
			            "life": 1.3,
			            "lifeVar": 0,
			            "totalParticles": 207,
			            "emissionRate": 83,
			            "startColor": [
			                51,
			                96,
			                130,
			                0
			            ],
			            "startColorVar": [
			                109,
			                66,
			                111,
			                0.3
			            ],
			            "endColor": [
			                177,
			                102,
			                57,
			                1
			            ],
			            "endColorVar": [
			                119,
			                40,
			                162,
			                0
			            ],
			            "radius": 99,
			            "radiusVar": 2,
			            "textureSource": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA9dpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NDkxMSwgMjAxMy8xMC8yOS0xMTo0NzoxNiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKE1hY2ludG9zaCkiIHhtcDpDcmVhdGVEYXRlPSIyMDE0LTEyLTEyVDE0OjM3OjU5WiIgeG1wOk1vZGlmeURhdGU9IjIwMTQtMTItMTJUMTQ6NTg6NDgiIHhtcDpNZXRhZGF0YURhdGU9IjIwMTQtMTItMTJUMTQ6NTg6NDgiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkU4MDM4MzEwN0EzMjExRTRCMTlEODVFMUIyNUI0QkUzIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkU4MDM4MzExN0EzMjExRTRCMTlEODVFMUIyNUI0QkUzIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RTgwMzgzMEU3QTMyMTFFNEIxOUQ4NUUxQjI1QjRCRTMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RTgwMzgzMEY3QTMyMTFFNEIxOUQ4NUUxQjI1QjRCRTMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5FEin+AAAB0UlEQVR42tyXu0oDQRSGJ6urJBY2WkliBBEEI8Rba6OmMqCF6CMEHyBgl8ZHyAtYCqZXCNgokah4AS8IgmiljSkUE2L8B/7AGsyszt7AA19md2bnnD9nmLOzoUajIYK0TvlTq9V058+BENjTmWyapgjJDGgKkIHLbKfAp44Aw0H21sAESIJVXSe6GegGV2CI9/dgFHz4lYGMJbjgdcavDPSCO9DX0v8ChsGr1xnI/hBcsC/rdQYGwC2ItBl/AyPgyasM5BTBBcdybmXABGPcZpNsZ0CHjc86OAKn4Jjtpax3qkIUxv24ZV/LNgG6XKq4VXABTihItucQ8N4UkNfdRg4sDwHrTQEyrdtgyafgO2AFAuqGZd1kOS36ELzIMi5jftsFVWag5GHwEmNUmx2t27ACFsGNB8Gv6bti7fypDjzzPf/oYnDpa56+hZ0A5QQNU/4hwyZlaRcEpFVLaleKH1wQoPRhJ2DQBQGxoAXEnQiI/wcBjpYgZjN+RnzPwCGrWpLI6wMdAXZHMnnEClvud8Em2G/z/CzYAAstPnp0jmT9DC6/eApgGqQUwQXHUny2wLkR+vrzEkTBFk9Gy/wM+62VOSdBH1HlEgRphgjYvgQYAIkakBJEhtEhAAAAAElFTkSuQmCC",
			            "textureEnabled": true,
			            "renderMode": "add",
			            "speed": 82,
			            "speedVar": 41,
			            "angle": 5,
			            "angleVar": 24,
			            "gravity": {
			                "x": -30,
			                "y": 62
			            },
			            "radialAccel": 195,
			            "radialAccelVar": 0,
			            "tangentialAccel": -276,
			            "tangentialAccelVar": 0,
			            "startScale": 0.4,
			            "startScaleVar": 0,
			            "endScale": 4.5,
			            "endScaleVar": 6,
			            "splineAnchorPts": [
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
			            "splineIsPath": true,
			            "splineClockwise": true,
			            "splineSpeed": 50,
			            "splineRelForceOn": true,
			            "startDelay": 0,
			            "posName": 'center',
			            "rotationSpeed": 20,
			            "rotationSpeedVar": 5
			        });

			addSystem('meteor',  'EMITTER',  {
				totalParticles: 180,
				emissionRate: 45,
				posName: 'center',
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
				splineRelForceOn: true,
				textureSource: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA9dpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NDkxMSwgMjAxMy8xMC8yOS0xMTo0NzoxNiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKE1hY2ludG9zaCkiIHhtcDpDcmVhdGVEYXRlPSIyMDE0LTEyLTEyVDE0OjM3OjU5WiIgeG1wOk1vZGlmeURhdGU9IjIwMTQtMTItMTJUMTQ6NTg6NDgiIHhtcDpNZXRhZGF0YURhdGU9IjIwMTQtMTItMTJUMTQ6NTg6NDgiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkU4MDM4MzEwN0EzMjExRTRCMTlEODVFMUIyNUI0QkUzIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkU4MDM4MzExN0EzMjExRTRCMTlEODVFMUIyNUI0QkUzIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RTgwMzgzMEU3QTMyMTFFNEIxOUQ4NUUxQjI1QjRCRTMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RTgwMzgzMEY3QTMyMTFFNEIxOUQ4NUUxQjI1QjRCRTMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5FEin+AAAB0UlEQVR42tyXu0oDQRSGJ6urJBY2WkliBBEEI8Rba6OmMqCF6CMEHyBgl8ZHyAtYCqZXCNgokah4AS8IgmiljSkUE2L8B/7AGsyszt7AA19md2bnnD9nmLOzoUajIYK0TvlTq9V058+BENjTmWyapgjJDGgKkIHLbKfAp44Aw0H21sAESIJVXSe6GegGV2CI9/dgFHz4lYGMJbjgdcavDPSCO9DX0v8ChsGr1xnI/hBcsC/rdQYGwC2ItBl/AyPgyasM5BTBBcdybmXABGPcZpNsZ0CHjc86OAKn4Jjtpax3qkIUxv24ZV/LNgG6XKq4VXABTihItucQ8N4UkNfdRg4sDwHrTQEyrdtgyafgO2AFAuqGZd1kOS36ELzIMi5jftsFVWag5GHwEmNUmx2t27ACFsGNB8Gv6bti7fypDjzzPf/oYnDpa56+hZ0A5QQNU/4hwyZlaRcEpFVLaleKH1wQoPRhJ2DQBQGxoAXEnQiI/wcBjpYgZjN+RnzPwCGrWpLI6wMdAXZHMnnEClvud8Em2G/z/CzYAAstPnp0jmT9DC6/eApgGqQUwQXHUny2wLkR+vrzEkTBFk9Gy/wM+62VOSdBH1HlEgRphgjYvgQYAIkakBJEhtEhAAAAAElFTkSuQmCC'
			});

			addSystem('fireworks',  'EMITTER', {
				totalParticles: 1500,
				emissionRate: 1500 / 3.5,
				posName: 'centerBottom',
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
				]
			});

			addSystem('fire',  'EMITTER', {
				totalParticles: 250,
				emissionRate: 250 / 7,
				posName: 'centerBottom',
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
				duration: Infinity
			});

			addSystem('galaxy',  'EMITTER', {
				totalParticles: 200,
				emissionRate: 200 / 4,
				posName: 'center',
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
				duration: Infinity
			});

			addSystem('snow',  'EMITTER', {
				totalParticles: 700,
				emissionRate: 10,
				posName: 'centerAboveTop',
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
				duration: Infinity
			});

			addSystem('bubbles',  'EMITTER', {
				totalParticles: 500,
				emissionRate: 200,
				active: true,
				duration: Infinity,
				posName: 'centerOffBottom',
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
				speedVar: 50
			});

			addSystem('watergeyser',  'EMITTER', {
				totalParticles: 400,
				emissionRate: 100,
				active: true,
				duration: Infinity,
				posName: 'centerBottom',
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
				speedVar: 50
			});

			addSystem('ribbon',  'EMITTER', {
				totalParticles: 200,
				emissionRate: 40,
				active: true,
				duration: Infinity,
				posName: 'bottomLeft',
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
				speedVar: 50
			});

		}

		public function getSystem(name:String):System {
			var system:System = systems[0].system;
			for (var i:int = 0; i < systems.length; ++i) {
				var ps:Object = systems[i];
				if (ps.systemName == name) {
					system = ps.system;
					break;
				}
			}
			return system;
		}

		public function positionSystems(size:Rectangle):void {
			for (var i:int = 0; i < systems.length; ++i) {
				var posName:String = systems[i].system.posName;
				systems[i].system.pos = getPosition(posName, size);
			}
		}


		public function deleteSystem(systemName:String):void {
			var index:int;
			for (var i:int = 0; i < systems.length; ++i) {
				if (systems[i].systemName == systemName) {
					systems.splice(i, 1);
					return;
				}
			}
		}

		public function addSystem(name:String, actorType:String, def:Object):void {
			deleteSystem(name);
			var sys:System = new System(def);
			sys.systemName = name;
			systems.push({'systemName': name, 'actorType': actorType, 'system': sys});
		}

		private function getPosition(positionName:String, size:Rectangle):Point {
		    switch(positionName){
		        case "center":
		            return new Point((size.width / 2) | 0, (size.height / 2) | 0);
		            break; 
		        case "centerBottom":
		            return new Point((size.width / 2) | 0, (size.height * 2 / 3) | 0);
		            break;
		        case "centerOffBottom":
		            return new Point((size.width / 2) | 0, size.height + 20);
		            break;
		        case "centerAboveTop":
		            return new Point((size.width / 2) | 0,0);
		            break;
		        case "bottomLeft":
		            return new Point(0, size.height + 5);
		            break;
		        default:
		            //LOG.warning("Unknown position name: " + positionName);
		            return new Point(0,0);
		            break;
		    }
		}

		public static function getInstance():SystemsManager{
			if(INSTANCE == null){
				INSTANCE = new SystemsManager();
			}
			return INSTANCE;
		}
	};
};

