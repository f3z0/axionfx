
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
	import flash.events.EventDispatcher;

	/**
	 * Something that moves around and acts/reacts with environment either directly or indirectly.
	 *
	 * @author      Gregory Ray <gregory@everadventure.com>
	 * @version     0.1
	 * @since       2014-11-03
	 */
	public class Actor  extends EventDispatcher {
		protected var _splineLenTotal:Number = 0;
		protected var _splineSegmentArcLens:Array;
		protected var _relForce:Point;
		protected var _traversalDuration:Number;
		protected var  _system:System;
		protected var _predefinedSystemName:String;
		protected var _renderer:Renderer;
		protected var _renderIdx:int = -1;
		protected var _afterUpdate:Array = new Array();
		protected var _afterRender:Array = new Array();


		public var actorType:String = 'GENERIC';

		public var renderable:Boolean = false;

		public function Actor(system:*) {
			_relForce = new Point();
			if(system is System) {
				_predefinedSystemName = system.systemName;
				SystemsManager.getInstance().addSystem(_predefinedSystemName, actorType, system);
			} else if (system is String) {
				_predefinedSystemName = system;
			}
		}

		public function recalculateCurves(){
			if(_system.path && _system.path.splineAnchorPts is Array && _system.path.splineAnchorPts.length >= 4 && _system.path.splineIsPath) {
				_splineSegmentArcLens = new Array();
				_splineLenTotal = 0;
				for(var k:int = 0; k < _system.path.splineAnchorPts.length-1; k++){
					var P0:Point = _system.path.splineAnchorPts[k];
					var P1:Point = _system.path.splineAnchorPts[(1+k) % _system.path.splineAnchorPts.length];
					var P2:Point = _system.path.splineAnchorPts[(2+k) % _system.path.splineAnchorPts.length];
					var P3:Point = _system.path.splineAnchorPts[(3+k) % _system.path.splineAnchorPts.length];
					var segLen:Number = Util.catmullEstArcLen(P0, P1, P2, P3);
					_splineLenTotal += segLen;
					_splineSegmentArcLens.push(segLen);
				}
				_traversalDuration = _splineLenTotal/_system.path.splineSpeed;
			}
		}

		public function get system():System {
			return _system;
		}

		public function get predefinedSystem():String {
			return _predefinedSystemName;
		}

		public function set predefinedSystem(ps:String):void {
			if(_predefinedSystemName != ps) {
				_predefinedSystemName = ps;
				_system = SystemsManager.getInstance().getSystem(ps);
				restart();
			}
		}

		public function get systemName():String {
			return _predefinedSystemName;
		}

		public function get startDelay():Number {
			return _system.startDelay;
		}


		public function set startDelay(val:Number):void {
			_system.startDelay = val;
		}

		public function restart(e:Event = null):void {
			_afterUpdate.push(function(){
				//SystemsManager.getInstance().positionSystems(new Rectangle(0 ,0, _renderer.width, _renderer.height));
				var bodies:Array = null;
				var path:Path = null;
				if(_system) bodies = _system.bodies;
				if(_system) path = _system.path;
				_system = SystemsManager.getInstance().getSystem(_predefinedSystemName);
				if(bodies) _system.bodies = bodies;
				if(path) _system.path = path;
				recalculateCurves();
			});
			
		}

		public function addRenderer(renderer:Renderer):void {
			_renderer = renderer;
			_renderIdx = renderer.addActor(this);
			restart();
			renderer.addEventListener(DirectorEvent.systemRefreshEventType, restart);
		}

		public function removeRenderer(renderer:Renderer):void {
			if(_renderIdx < 0) return;
			renderer.removeActor(_renderIdx);
			_renderIdx = -1;
		}

		public function update(elapsed:Number, delta:Number):void {
			if(!_system) return;
			elapsed -= _system.startDelay/1000;
			if(_system.path && _system.path.splineAnchorPts is Array && _system.path.splineAnchorPts.length >= 4) {
				var t:Number = 0;
				if(!_system.path.splineIsPath) t = Math.random();
				else t =  ((elapsed % _traversalDuration) / _traversalDuration);

				if(_system.path.splineClockwise) t = 1.0- t;

				if(elapsed < 0) t = 0;

				var k:int;
				var travelled:Number=0;
				for(k = 0; k < _splineSegmentArcLens.length; k++){
					if( (travelled+_splineSegmentArcLens[k]) / _splineLenTotal > t) break;
					travelled += _splineSegmentArcLens[k];
				}
					
				var P0:Point = _system.path.splineAnchorPts[(0+k) % _system.path.splineAnchorPts.length];
				var P1:Point = _system.path.splineAnchorPts[(1+k) % _system.path.splineAnchorPts.length];
				var P2:Point = _system.path.splineAnchorPts[(2+k) % _system.path.splineAnchorPts.length];
				var P3:Point = _system.path.splineAnchorPts[(3+k) % _system.path.splineAnchorPts.length];

				var segmentStartT:Number =  travelled / _splineLenTotal;
				var segmentDeltaT:Number =  _splineSegmentArcLens[k] / _splineLenTotal;
				var segmentT:Number = (t - segmentStartT) / segmentDeltaT;

				var xTemp:Number = _system.pos.x;
				var yTemp:Number = _system.pos.y;
				
				_system.pos = new Point(Util.catmull(segmentT, P0.x, P1.x, P2.x, P3.x), Util.catmull(segmentT, P0.y, P1.y, P2.y, P3.y));
				_relForce = new Point(Util.catmulld(segmentT, P0.x, P1.x, P2.x, P3.x), Util.catmulld(segmentT, P0.y, P1.y, P2.y, P3.y));
				Util.normalize(_relForce)

				if(_system.pos.x != xTemp || _system.pos.y != yTemp) dispatchEvent(new DirectorEvent(DirectorEvent.actorAttrChangeEventType)); 
			}
		}

		public function afterUpdate():void {
			while(_afterUpdate.length > 0){
				_afterUpdate.shift().call(this);
			}
		}

		public function afterRender():void {
			while(_afterUpdate.length > 0){
				_afterUpdate.shift().call(this);
			}
		}

		public function destroy(e:Event):void{
		}
	}
}