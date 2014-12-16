
package com.axionfx
{
	import flash.display.Bitmap;
	import flash.display.BitmapData;
	import flash.display.DisplayObject;
	import flash.display.GradientType;
	import flash.display.Shape;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.geom.Matrix;
	import flash.geom.Point;
	import flash.geom.ColorTransform;
	import flash.geom.Rectangle;
	import flash.display.BitmapDataChannel;
	import flash.display.StageQuality;
	import flash.filters.ColorMatrixFilter;
	import flash.filters.BitmapFilter;
	import flash.external.ExternalInterface;

	/**
	 * Path - Used to generated translational coordinate instructions based on a curved cubic spline (catmul-rom) and user defined anchor points.
	 *
	 * @author      Gregory Ray <gregory@everadventure.com>
	 * @version     0.1
	 * @since       2014-11-03
	 */
	public class Path extends Actor {
		
		public function Path(system:*) {
			actorType = 'PATH';
			renderable = false;
			super(system);
		}

		override public function addRenderer(renderer:Renderer):void {
			super.addRenderer(renderer);
			renderer.addEventListener('actorAdded', _checkActor);
			_afterUpdate.push(function(){
				for(var i:int = 0; i < renderer.actors.length; i++){
					var actor:Actor = renderer.actors[i];

					if(_system.actsOn.indexOf(actor.predefinedSystem) != -1){
						actor.system.path = this;
						actor.recalculateCurves();
					}
				}
			});
		}


		public function get splineAnchorPts():Array {
			return _system.splineAnchorPts;
		}

		public function set splineAnchorPts(val:Array):void {
			_system.splineAnchorPts = val;
		}

		public function get splineIsPath():Boolean {
			return _system.splineIsPath;
		}

		public function set splineIsPath(val:Boolean):void {
			_system.splineIsPath = val;
		}

		public function get splineClockwise():Boolean {
			return _system.splineClockwise;
		}

		public function set splineClockwise(val:Boolean):void {
			_system.splineClockwise = val;
		}

		public function get splineSpeed():Number {
			return _system.splineSpeed;
		}

		public function set splineSpeed(val:Number):void {
			_system.splineSpeed = val;
		}

		public function get splineRelForceOn():Boolean {
			return _system.splineRelForceOn;
		}

		public function set splineRelForceOn(val:Boolean):void {
			_system.splineRelForceOn = val;
		}

		public function get actsOn():Array {
			return _system.actsOn;
		}

		public function set actsOn(val:Array):void {
			_system.actsOn = val;
		}

		private function _checkActor(e:Event):void{
			var actor:Actor = _renderer.actors[e.target];
			if(_system.actsOn.indexOf(actor.predefinedSystem) != -1){
				actor.system.path = this;
			}
		}

		override public function destroy(e:Event):void{
			_renderer.removeEventListener('actorAdded', _checkActor);
			super.destroy(e);
		}

		override public function restart(e:Event = null):void {
			super.restart();
		}

		override public function update(elapsed:Number, delta:Number):void {
			super.update(elapsed, delta);
			
		}
		
	}
}
