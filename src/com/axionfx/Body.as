
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
	 * Body - Body of mass in spacetime.
	 *
	 * @author      Gregory Ray <gregory@everadventure.com>
	 * @version     0.1
	 * @since       2014-11-03
	 */
	public class Body extends Actor {

		public function Body(system:*) {
			actorType = 'BODY';
			renderable = false;
			super(system);
		}

		override public function addRenderer(renderer:Renderer):void {
			super.addRenderer(renderer);
			renderer.addEventListener('actorAdded', this._checkActor);
			_afterUpdate.push(function(){
				for(var i:int = 0; i < renderer.actors.length; i++){
					var actor:Actor = renderer.actors[i];
					if(_system.actsOn.indexOf(actor.predefinedSystem) != -1){
						if(!actor.system.bodies) actor.system.bodies = [];
						actor.system.bodies.push(this);
					}
				}
			});
		}

		public function get mass():Number {
			return _system.mass;
		}

		public function set mass(mass:Number):void {
			_system.mass = mass;
		}

		public function get force():Number {
			return _system.force;
		}

		public function set force(force:Number):void {
			_system.force = force;
		}


		public function get pos():Point {
			return _system.pos;
		}

		public function set pos(pt:Point):void {
			_system.pos = pt;
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
				if(!actor.system.bodies) actor.system.bodies = [];
				actor.system.bodies.push(this);
			}
		}

		override public function destroy(e:Event):void{
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
