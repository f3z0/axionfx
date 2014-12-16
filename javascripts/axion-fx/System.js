
    define(function() {

            /**
             * System is a model object which represents the initial configuration for predefiend
             * actor configurations.
             *
             * @author      Gregory Ray <gregory@everadventure.com>
             * @version     0.1
             * @since       2014-11-03
             */
            function System(def){
                if(!this.texture && def.hasOwnProperty('renderMode')) {
                    this.textureSource = def['textureSource'] || this._textureSource;
                } 
                if(def.hasOwnProperty('systemName')) this.systemName = def['systemName'];
                if(def.hasOwnProperty('totalParticles')) this.totalParticles = def['totalParticles'];
                if(def.hasOwnProperty('emissionRate')) this.emissionRate = def['emissionRate'];
                if(def.hasOwnProperty('posName')) this.posName = def['posName'];
                if(def.hasOwnProperty('pos')) this.pos = {x: def['pos'].x, y: def['pos'].y};
                if(def.hasOwnProperty('posVar')) this.posVar = {x: def['posVar'].x, y: def['posVar'].y};
                if(def.hasOwnProperty('gravity')) this.gravity = {x: def['gravity'].x, y: def['gravity'].y};
                if(def.hasOwnProperty('angle')) this.angle = def['angle'];
                if(def.hasOwnProperty('angleVar')) this.angleVar = def['angleVar'];
                if(def.hasOwnProperty('speed')) this.speed = def['speed'];
                if(def.hasOwnProperty('speedVar')) this.speedVar = def['speedVar'];
                if(def.hasOwnProperty('life')) this.life = def['life'];
                if(def.hasOwnProperty('lifeVar')) this.lifeVar = def['lifeVar'];
                if(def.hasOwnProperty('radialAccel')) this.radialAccel = def['radialAccel'];
                if(def.hasOwnProperty('radialAccelVar')) this.radialAccelVar = def['radialAccelVar'];
                if(def.hasOwnProperty('tangentialAccel')) this.tangentialAccel = def['tangentialAccel'];
                if(def.hasOwnProperty('tangentialAccelVar')) this.tangentialAccelVar = def['tangentialAccelVar'];
                if(def.hasOwnProperty('textureEnabled')) this.textureEnabled = def['textureEnabled'];
                if(def.hasOwnProperty('renderMode')) this.renderMode = def['renderMode'];
                if(def.hasOwnProperty('radius')) this.radius = def['radius'];
                if(def.hasOwnProperty('radiusVar')) this.radiusVar = def['radiusVar'];
                if(def.hasOwnProperty('startScale')) this.startScale = def['startScale'];
                if(def.hasOwnProperty('startScaleVar')) this.startScaleVar = def['startScaleVar'];
                if(def.hasOwnProperty('endScale')) this.endScale = def['endScale'];
                if(def.hasOwnProperty('endScaleVar')) this.endScaleVar = def['endScaleVar'];
                if(def.hasOwnProperty('startColor')) this.startColor = def['startColor'];
                if(def.hasOwnProperty('startColorVar')) this.startColorVar = def['startColorVar'];
                if(def.hasOwnProperty('endColor')) this.endColor = def['endColor'];
                if(def.hasOwnProperty('endColorVar')) this.endColorVar = def['endColorVar'];
                if(def.hasOwnProperty('active')) this.active = def['active'];
                if(def.hasOwnProperty('duration')) this.duration = def['duration'];
                
                if(def.hasOwnProperty('splineSpeed')) this.splineSpeed = def['splineSpeed'];
                if(def.hasOwnProperty('mass')) this.mass = def['mass'];
                if(def.hasOwnProperty('force')) this.force = def['force'];
                if(def.hasOwnProperty('actsOn')) this.actsOn = def['actsOn'];
                if(def.hasOwnProperty('startDelay')) this.startDelay = def['startDelay'];
                if(def.hasOwnProperty('rotationSpeed')) this.rotationSpeed = def['rotationSpeed'];
                if(def.hasOwnProperty('rotationSpeedVar')) this.rotationSpeedVar = def['rotationSpeedVar'];

                if(def.hasOwnProperty('splineAnchorPts') && typeof def['splineAnchorPts'] === 'object') {
                    this.splineAnchorPts = new Array();
                    for(var i = 0; i < def['splineAnchorPts'].length; i++){
                        this.splineAnchorPts.push({x: def['splineAnchorPts'][i].x, y: def['splineAnchorPts'][i].y});
                    }
                }

                if(def.hasOwnProperty('bodies') && typeof def['bodies'] === 'object') {
                    this.bodies = new Array();
                    for(var b = 0; b < def['bodies'].length; b++){
                        this.bodies.push({x: def['bodies'][b].x, y:def['bodies'][b].y, m:def['bodies'][b].m, f:def['bodies'][b].f});
                    }
                }

                if(def.hasOwnProperty('path') && typeof def['path'] === 'object') {
                    this.path = def['path'];
                }

                if(def.hasOwnProperty('splineIsPath')) this.splineIsPath = def['splineIsPath'];
                if(def.hasOwnProperty('splineClockwise')) this.splineClockwise = def['splineClockwise'];
                if(def.hasOwnProperty('splineRelForceOn')) this.splineRelForceOn = def['splineRelForceOn'];
            }

            System.prototype = {
                totalParticles: 0,
                _textureSource: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA9dpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NDkxMSwgMjAxMy8xMC8yOS0xMTo0NzoxNiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKE1hY2ludG9zaCkiIHhtcDpDcmVhdGVEYXRlPSIyMDE0LTAyLTEzVDIwOjE0OjAyWiIgeG1wOk1vZGlmeURhdGU9IjIwMTQtMTItMTJUMTQ6NTg6MTYiIHhtcDpNZXRhZGF0YURhdGU9IjIwMTQtMTItMTJUMTQ6NTg6MTYiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkU4MDM4MzBDN0EzMjExRTRCMTlEODVFMUIyNUI0QkUzIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkU4MDM4MzBEN0EzMjExRTRCMTlEODVFMUIyNUI0QkUzIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RTgwMzgzMEE3QTMyMTFFNEIxOUQ4NUUxQjI1QjRCRTMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RTgwMzgzMEI3QTMyMTFFNEIxOUQ4NUUxQjI1QjRCRTMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz630WD3AAACL0lEQVR42syXi46CMBBFESjPVf//N1cFynNLcsdcx4Ks2Y2Q3EQMnTntvOAwTVPwyevwBkDqFM5roQkanex/AcxOjVMMRR6AwamHuq0wrwASKKXfAhESwEjOW8jS77cAMlIOiJQgIgIYyLmFaqeG9CuAHCpIOWDSFQALZ7PzilRDmwAyOCydvqCSIOQUNEBLO5+d3pyu0A3/PZ1E7Im5AMyOT05HBZFRQgqAJF4DRwnlSUB5MuqceAVwBMQJ91sApGLE+agqZBFAkixXIWCAksJgCKCj44+Vc4FjWR+AoZLLPXlwVBAJHMmx1p6dd5QbDdaYJYCYADJVBQJyBkhBHVE6YEX2Rk9VcAk/hSClBpNQOLgPlHB+BkyGShjgxMAWd8LM0z9i3FsGCGEsViAG4rBIXhR4rsfuA0rEmtYmym5EYboDSF8XkEgBGRWeAqdh4DRArFMCZ4cRORZf950zwJpCdVIGYTFqZ+FGew8A0waNqqY7dLgO9wM9s8XeQwjYyUDi8crlVNH6ntqsTMCO1rK9cQlAd6ueDHWqxxuKOVfBlQaPpbWtsisgDwAWWa5HaqOyOqZs9/WBC8LCo9jSyfTUH54aUa+OWXacqvbaU1fTnfCmpl9FMAzhnQWdGqlcUrq91iuzwDeGa5UfXgALo9xEfIPFbhjHs/PvBQi7No5bGNEda1Tt9RWAnMKFkrPxvR9+/I1ol++Eu3gr3sV3wS6+jHbzbbirr+M/vX4EGACC0Ibk2gj0KAAAAABJRU5ErkJggg==",
                emissionRate: 0,
                posName: 'center',
                pos: {x:0,y:0},
                posVar: {x:0,y:0},
                gravity: {x:0,y:0},
                angle:  90.0,
                angleVar: 0.0,
                speed: 1.0,
                speedVar: 0.0,
                life: 1.0,
                lifeVar:  0.0,
                radialAccel: 0.0,
                radialAccelVar: 0.0,
                tangentialAccel: 0.0,
                tangentialAccelVar: 0.0,
                textureEnabled: false,
                renderMode: 'normal',
                radius: 1.0,
                radiusVar: 0.0,
                startScale: 1,
                startScaleVar: 0.0,
                endScale: 1,
                endScaleVar: 0.0,
                startColor: [255,255,255,1.0],
                startColorVar: [0,0,0,0.0],
                endColor: [255,255,255,1.0],
                endColorVar: [0,0,0,0.0],
                active: true,
                duration: Infinity,
                systemName: '',
                splineAnchorPts: null,
                splineIsPath: false,
                splineClockwise: true,
                splineSpeed: 1.0,
                splineRelForceOn: true,
                bodies: null,
                path: null,
                mass: 0,
                force: 0,
                actsOn: [],
                startDelay: 0,
                rotationSpeed: 0,
                rotationSpeedVar: 0
            }

            Object.defineProperty(System.prototype, 'textureSource', {
                get: function() {
                    return this._textureSource;
                },
                set: function(textureSource) {
                    this._textureSource = textureSource;
                    this.texture = new Image();
                    this.texture.src = textureSource;
                    this.texture.onload = function() {}
                }
            });

            Object.defineProperty(System.prototype, 'actsOnStr', {
                get: function() {
                    return this.actsOn.join(',');
                },
                set: function(actsOn) {
                    this.actsOn = actsOn.split(',');
                }
            });

            return System;
        }
    );