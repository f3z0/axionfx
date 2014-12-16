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

	/**
	 * Particle is a Sprite subclass which is used to hold the state
	 * of an individual particle during emission. Note that this is never
	 * actually added to the display object list, instead its pixels are
	 * drawn to the Emitter's underlying BitmapData.
	 *
	 * @author      Gregory Ray <gregory@everadventure.com>
	 * @version     0.1
	 * @since       2014-11-03
	 */
	public class Particle extends Sprite {
		public var pos:Point = new Point(0,0);
		public var vel:Point = new Point(0,0);
		public var life:Number = 0;
		public var color:Array;
		public var scale:Number;
		public var orientation:Number = 0;
		public var radius:Number;
		public var textureEnabled:Boolean;
		public var renderMode:String;
		public var radialAccel:Number;
		public var tangentialAccel:Number;
		public var deltaScale:Number;
		public var deltaColor:Array;
		public var forces:Point;
		public var radial:Point;
		public var tangential:Point;

		public function Particle() {
			super();
		}

		public function setVelocity(angle:Number, speed:Number):void {
			this.vel = new Point(Math.cos(Util.toRad(angle)) * speed, -Math.sin(Util.toRad(angle)) * speed);
		}
	};
};


