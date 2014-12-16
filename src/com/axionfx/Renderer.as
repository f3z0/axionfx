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
	 * Renderer - Holds the rendering of pixels to screen.
	 *
	 * @author      Gregory Ray <gregory@everadventure.com>
	 * @version     0.1
	 * @since       2014-11-03
	 */
	public class Renderer extends Sprite {
		private var _bitmap:Bitmap;
		public var actors:Array;
		private var autoPlay:Boolean = false;
		private var _elapsed:Number = 0;
		private var _lastTimestamp:int;


		public function Renderer(_width:int, _height:int, _autoPlay:Boolean = false) {
			autoPlay = _autoPlay;

			var bd:BitmapData = new BitmapData(_width, _height, true, 0x00000000);

			_bitmap = new Bitmap(bd, 'auto', true);
			_bitmap.x = 0;
			_bitmap.y  = 0;
			_bitmap.addEventListener(Event.ADDED_TO_STAGE, setupStageListners);
			this.addChild(_bitmap);

			actors = new Array();
			_lastTimestamp = (new Date()).getTime();

			super();

		}

		public function addActor(actor:Actor):int {
			var directorEvent:DirectorEvent = new DirectorEvent(DirectorEvent.actorAddedEventType, actors.length);
			dispatchEvent(directorEvent);
			return actors.push(actor);
		}

		public function refreshSystems():void {
			var directorEvent:DirectorEvent = new DirectorEvent(DirectorEvent.systemRefreshEventType);
			dispatchEvent(directorEvent);
		}

		public function removeActor(actorIdx:int):void {
			actors.splice(actorIdx, 1);
		}

		public function updateSize(_width:int, _height:int) {
			this.removeChild(_bitmap);
			var bd:BitmapData = new BitmapData(_width, _height, true, 0x00000000);
			_bitmap = new Bitmap(bd, 'auto', true);
			_bitmap.x = 0;
			_bitmap.y  = 0;
			this.addChild(_bitmap);
			_elapsed = 0;
			_lastTimestamp = (new Date()).getTime();

			for(var i = 0; i < actors.length; i++) actors[i].restart();
		}

		private function setupStageListners(e:Event) {
			_bitmap.removeEventListener(Event.ADDED_TO_STAGE, setupStageListners);
			addEventListener(Event.REMOVED_FROM_STAGE, destroy);

			if (ExternalInterface.available) {
		                    ExternalInterface.addCallback("play", play);
		                    ExternalInterface.addCallback("pause", pause);
		           }

		           if(autoPlay) play();
		}

		private function destroy(e:Event):void {
			for(var i = 0; i < actors.length; i++) actors[i].destroy(e);
			removeEventListener(Event.ENTER_FRAME, render);
			removeEventListener(Event.REMOVED_FROM_STAGE, destroy);
		}

		public function play() {
			_lastTimestamp = (new Date()).getTime();
			addEventListener(Event.ENTER_FRAME, render);
		}

		public function pause() {
			removeEventListener(Event.ENTER_FRAME, render);
		}

		public function stop() {
			for(var i = 0; i < actors.length; i++) actors[i].restart();
			removeEventListener(Event.ENTER_FRAME, render);
		}


		private function render(e:Event):void {
			var timestamp:int = (new Date()).getTime();
			var delta = timestamp - (_lastTimestamp || timestamp);
			_lastTimestamp = timestamp;
			delta /= 1000;
			_elapsed += delta;
			_bitmap.bitmapData.fillRect(_bitmap.bitmapData.rect, 0);
			dispatchEvent(new DirectorEvent(DirectorEvent.updatePhaseStartEventType));
			for(var i = 0; i < actors.length; i++) {
				actors[i].update(_elapsed, delta);
				actors[i].afterUpdate();
			}
			dispatchEvent(new DirectorEvent(DirectorEvent.updatePhaseEndEventType));
			dispatchEvent(new DirectorEvent(DirectorEvent.renderPhaseStartEventType));
			for(i = 0; i < actors.length; i++) {
				if(actors[i].renderable) actors[i].render(_bitmap.bitmapData);
				if(actors[i].renderable) actors[i].afterRender();
			}
			dispatchEvent(new DirectorEvent(DirectorEvent.renderPhaseEndEventType));
		}

	}
}