package com.axionfx
{
    import flash.geom.Point;
    import flash.geom.Rectangle;
    import flash.display.BitmapData;
    import flash.utils.ByteArray;
	import flash.events.Event;
	import flash.display.Loader;
	
    /**
     * System is a model object which represents the initial configuration for predefiend
     * actor configurations.
     *
     * @author      Gregory Ray <gregory@everadventure.com>
     * @version     0.1
     * @since       2014-11-03
     */
    public class System {
        public var totalParticles:int = 0;
        public var emissionRate:int = 0;
        public var posName:String = 'center';
        public var pos:Point = new Point(0,0);
        public var posVar:Point = new Point(0,0);
        public var gravity:Point = new Point(0,0);
        public var angle:Number =  90.0;
        public var angleVar:Number = 0.0;
        public var speed:Number = 1.0;
        public var speedVar:Number = 0.0;
        public var life:Number = 1.0;
        public var lifeVar:Number =  0.0;
        public var radialAccel:Number = 0.0;
        public var radialAccelVar:Number = 0.0;
        public var tangentialAccel:Number = 0.0;
        public var tangentialAccelVar:Number = 0.0;
        public var textureEnabled:Boolean = false;
        public var renderMode:String = 'normal';
        public var radius:Number = 1.0;
        public var radiusVar:Number = 0.0;
        public var startScale:Number = 1;
        public var startScaleVar:Number = 0.0;
        public var endScale:Number = 1;
        public var endScaleVar:Number = 0.0;
        public var startColor:Array = [255,255,255,1.0];
        public var startColorVar:Array = [0,0,0,0.0];
        public var endColor:Array = [255,255,255,1.0];
        public var endColorVar:Array = [0,0,0,0.0];
        public var active: Boolean = true;
        public var duration:Number = Infinity;
        public var systemName:String;
        public var texture:BitmapData;
        public var splineAnchorPts:Array = null;
        public var splineIsPath:Boolean = false;
        public var splineClockwise:Boolean = true;
        public var splineSpeed:Number = 1.0;
        public var splineRelForceOn:Boolean = true;
        public var bodies:Array = null;
        public var path:Path = null;
        public var mass:Number = 0;
        public var force:Number = 0;
        public var rotationSpeed:Number = 0;
		public var rotationSpeedVar:Number = 0;

        public var actsOn:Array;
        public var startDelay:Number = 0;
        private var _textureSource:String = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA9dpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NDkxMSwgMjAxMy8xMC8yOS0xMTo0NzoxNiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKE1hY2ludG9zaCkiIHhtcDpDcmVhdGVEYXRlPSIyMDE0LTAyLTEzVDIwOjE0OjAyWiIgeG1wOk1vZGlmeURhdGU9IjIwMTQtMTItMTJUMTQ6NTg6MTYiIHhtcDpNZXRhZGF0YURhdGU9IjIwMTQtMTItMTJUMTQ6NTg6MTYiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkU4MDM4MzBDN0EzMjExRTRCMTlEODVFMUIyNUI0QkUzIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkU4MDM4MzBEN0EzMjExRTRCMTlEODVFMUIyNUI0QkUzIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RTgwMzgzMEE3QTMyMTFFNEIxOUQ4NUUxQjI1QjRCRTMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RTgwMzgzMEI3QTMyMTFFNEIxOUQ4NUUxQjI1QjRCRTMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz630WD3AAACL0lEQVR42syXi46CMBBFESjPVf//N1cFynNLcsdcx4Ks2Y2Q3EQMnTntvOAwTVPwyevwBkDqFM5roQkanex/AcxOjVMMRR6AwamHuq0wrwASKKXfAhESwEjOW8jS77cAMlIOiJQgIgIYyLmFaqeG9CuAHCpIOWDSFQALZ7PzilRDmwAyOCydvqCSIOQUNEBLO5+d3pyu0A3/PZ1E7Im5AMyOT05HBZFRQgqAJF4DRwnlSUB5MuqceAVwBMQJ91sApGLE+agqZBFAkixXIWCAksJgCKCj44+Vc4FjWR+AoZLLPXlwVBAJHMmx1p6dd5QbDdaYJYCYADJVBQJyBkhBHVE6YEX2Rk9VcAk/hSClBpNQOLgPlHB+BkyGShjgxMAWd8LM0z9i3FsGCGEsViAG4rBIXhR4rsfuA0rEmtYmym5EYboDSF8XkEgBGRWeAqdh4DRArFMCZ4cRORZf950zwJpCdVIGYTFqZ+FGew8A0waNqqY7dLgO9wM9s8XeQwjYyUDi8crlVNH6ntqsTMCO1rK9cQlAd6ueDHWqxxuKOVfBlQaPpbWtsisgDwAWWa5HaqOyOqZs9/WBC8LCo9jSyfTUH54aUa+OWXacqvbaU1fTnfCmpl9FMAzhnQWdGqlcUrq91iuzwDeGa5UfXgALo9xEfIPFbhjHs/PvBQi7No5bGNEda1Tt9RWAnMKFkrPxvR9+/I1ol++Eu3gr3sV3wS6+jHbzbbirr+M/vX4EGACC0Ibk2gj0KAAAAABJRU5ErkJggg==";

        public function System(def:Object) {
            if(!texture && def.hasOwnProperty('renderMode')) {
                textureSource = def['textureSource'] || _textureSource;
            } 
            if(def.hasOwnProperty('systemName')) systemName = def['systemName'];
            if(def.hasOwnProperty('totalParticles')) totalParticles = def['totalParticles'];
            if(def.hasOwnProperty('emissionRate')) emissionRate = def['emissionRate'];
            if(def.hasOwnProperty('posName')) posName = def['posName'];
            if(def.hasOwnProperty('pos')) pos = new Point(def['pos'].x, def['pos'].y);
            if(def.hasOwnProperty('posVar')) posVar = new Point(def['posVar'].x, def['posVar'].y);
            if(def.hasOwnProperty('gravity')) gravity = new Point(def['gravity'].x, def['gravity'].y);
            if(def.hasOwnProperty('angle')) angle = def['angle'];
            if(def.hasOwnProperty('angleVar')) angleVar = def['angleVar'];
            if(def.hasOwnProperty('speed')) speed = def['speed'];
            if(def.hasOwnProperty('speedVar')) speedVar = def['speedVar'];
            if(def.hasOwnProperty('life')) life = def['life'];
            if(def.hasOwnProperty('lifeVar')) lifeVar = def['lifeVar'];
            if(def.hasOwnProperty('radialAccel')) radialAccel = def['radialAccel'];
            if(def.hasOwnProperty('radialAccelVar')) radialAccelVar = def['radialAccelVar'];
            if(def.hasOwnProperty('tangentialAccel')) tangentialAccel = def['tangentialAccel'];
            if(def.hasOwnProperty('tangentialAccelVar')) tangentialAccelVar = def['tangentialAccelVar'];
            if(def.hasOwnProperty('textureEnabled')) textureEnabled = def['textureEnabled'];
            if(def.hasOwnProperty('renderMode')) renderMode = def['renderMode'];
            if(def.hasOwnProperty('radius')) radius = def['radius'];
            if(def.hasOwnProperty('radiusVar')) radiusVar = def['radiusVar'];
            if(def.hasOwnProperty('startScale')) startScale = def['startScale'];
            if(def.hasOwnProperty('startScaleVar')) startScaleVar = def['startScaleVar'];
            if(def.hasOwnProperty('endScale')) endScale = def['endScale'];
            if(def.hasOwnProperty('endScaleVar')) endScaleVar = def['endScaleVar'];
            if(def.hasOwnProperty('startColor')) startColor = def['startColor'];
            if(def.hasOwnProperty('startColorVar')) startColorVar = def['startColorVar'];
            if(def.hasOwnProperty('endColor')) endColor = def['endColor'];
            if(def.hasOwnProperty('endColorVar')) endColorVar = def['endColorVar'];
            if(def.hasOwnProperty('active')) active = def['active'];
            if(def.hasOwnProperty('duration')) duration = def['duration'];
            if(def.hasOwnProperty('texture')) texture = def['texture'];
            if(def.hasOwnProperty('splineSpeed')) splineSpeed = def['splineSpeed'];
            if(def.hasOwnProperty('mass')) mass = def['mass'];
            if(def.hasOwnProperty('force')) force = def['force'];
            if(def.hasOwnProperty('actsOn')) actsOn = def['actsOn'];
            if(def.hasOwnProperty('startDelay')) startDelay = def['startDelay'];
            if(def.hasOwnProperty('rotationSpeed')) rotationSpeed = def['rotationSpeed'];
            if(def.hasOwnProperty('rotationSpeedVar')) rotationSpeedVar = def['rotationSpeedVar'];

            if(def.hasOwnProperty('splineAnchorPts') && def['splineAnchorPts'] is Object) {
                splineAnchorPts = new Array();
                for(var i = 0; i < def['splineAnchorPts'].length; i++){
                    splineAnchorPts.push(new Point(def['splineAnchorPts'][i].x, def['splineAnchorPts'][i].y));
                }
            }

            if(def.hasOwnProperty('bodies') && def['bodies'] is Object) {
                bodies = new Array();
                for(var b = 0; b < def['bodies'].length; b++){
                    bodies.push({x: def['bodies'][b].x, y:def['bodies'][b].y, m:def['bodies'][b].m, f:def['bodies'][b].f});
                }
            }

            if(def.hasOwnProperty('path') && def['path'] is Object) {
                path = new Path(def['path']);
            }

            if(def.hasOwnProperty('splineIsPath')) splineIsPath = def['splineIsPath'];
            if(def.hasOwnProperty('splineClockwise')) splineClockwise = def['splineClockwise'];
            if(def.hasOwnProperty('splineRelForceOn')) splineRelForceOn = def['splineRelForceOn'];

            super();
        }

        public function get textureSource():String {
            return _textureSource;
        }
        private function afterLoad(e:Event):void {
                        texture = new BitmapData(32,32,true,0x00000000);
                        //texture.draw(loader);    
        }
        public function set textureSource(textureSource:String):void {
            _textureSource = textureSource;
            var decoded:ByteArray = Base64.decodeToByteArray(_textureSource.split(',')[1]);

            var loader:Loader = new Loader();
            loader.contentLoaderInfo.addEventListener(Event.INIT, function(e:Event):void {
                        texture = new BitmapData(32,32,true,0x00000000);
                        texture.draw(loader);    
        });
            loader.loadBytes(decoded);

        }

    }
}
