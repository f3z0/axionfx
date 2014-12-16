package com.axionfxbuilder
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
	import com.axionfx.*;
	import flash.system.Security;
	import flash.display.MovieClip;
	import flash.events.MouseEvent;
	import flash.display.StageAlign;
	import flash.utils.setTimeout;
	
	/**
	 * Manages drawing the interactive spline path for an active actor.
	 *
	 * @author      Gregory Ray <gregory@everadventure.com>
	 * @version     0.1
	 * @since       2014-11-03
	 */
	public class SplinePath {
		private var _markersMC:MovieClip;
		private var _lineDrawingMC:MovieClip;
		private var _activeActor:Actor;
		private var _splinePoints:Array;
		private var _lineColor:uint = 0xFFFF00;
		private var _isActive:Boolean;

		public function SplinePath(activeActor:Actor, markersMC:MovieClip, lineDrawingMC:MovieClip, lineColor:uint, isActive:Boolean) {
			_lineColor = lineColor;
			_markersMC = markersMC;
			_lineDrawingMC = lineDrawingMC;
			_activeActor = activeActor;
			_isActive = isActive;

			if(isActive){
				for(var k:Number = 0; k < _activeActor.system.splineAnchorPts.length; k++){ //loop through all the interpolation points, and render anchors
					var marker:Ball = new Ball();
					marker.x = _activeActor.system.splineAnchorPts[k].x;
					marker.y = _activeActor.system.splineAnchorPts[k].y;
					marker.scaleX = 0.5;
					marker.scaleY = 0.5;
					marker.id = k;
					marker.addEventListener(MouseEvent.MOUSE_DOWN,startDragging);
					marker.addEventListener(MouseEvent.MOUSE_UP,stopDragging);
					_markersMC.addChild(marker);
				}
			}
			
			draw();
		}

		private function startDragging(event:MouseEvent):void{
			event.target.addEventListener(MouseEvent.MOUSE_MOVE, updateDragging);
			event.target.startDrag();
		}

		private function stopDragging(event:MouseEvent):void{
			event.target.removeEventListener(MouseEvent.MOUSE_MOVE, updateDragging);
			event.target.stopDrag();
			_activeActor.recalculateCurves();
			if (ExternalInterface.available) {
				ExternalInterface.call('splineChanged', _activeActor.system.systemName, JSON.stringify(_activeActor.system.splineAnchorPts));
			}
		}

		private function updateDragging(event:MouseEvent):void{
			_activeActor.system.splineAnchorPts[event.target.id].x = event.target.x;
			_activeActor.system.splineAnchorPts[event.target.id].y = event.target.y;
			_lineDrawingMC.dispatchEvent(new BuilderEvent(BuilderEvent.SPLINE_DIRTIED));
		}


		public function draw():void {
			if(!_lineDrawingMC.parent) return;
			_splinePoints = new Array();
			for(var k:Number = 0; k < _activeActor.system.splineAnchorPts.length-1; k++){ //loop through all the interpolation points, and build splines in between
				var point0:Point = _activeActor.system.splineAnchorPts[k];
				var point1:Point = _activeActor.system.splineAnchorPts[(k+1) % _activeActor.system.splineAnchorPts.length];
				var point2:Point = _activeActor.system.splineAnchorPts[(k+2) % _activeActor.system.splineAnchorPts.length];
				var point3:Point = _activeActor.system.splineAnchorPts[(k+3) % _activeActor.system.splineAnchorPts.length];

				for(var g:Number = 0.0; g < 1.0; g += 0.005){ //for each segment, calculate 200 spine points and store onto vector
					var spline_spot:Point = new Point(Util.catmull(g, point0.x, point1.x, point2.x, point3.x), Util.catmull(g, point0.y, point1.y, point2.y, point3.y));
					_splinePoints.push(spline_spot);
				}
			}
			
			_lineDrawingMC.graphics.lineStyle(1,_lineColor, _isActive ? 1.0 : 0.25 );
			_lineDrawingMC.graphics.moveTo(_splinePoints[0].x,_splinePoints[0].y); ///This is where we start drawing

			for(var iter:Number = 1; iter < _splinePoints.length; iter++){
				_lineDrawingMC.graphics.lineTo(_splinePoints[iter].x, _splinePoints[iter].y);
			}

			_lineDrawingMC.parent.setChildIndex(_lineDrawingMC, 1);    
		}
	}
}