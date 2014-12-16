package com.axionfx
{
	import flash.geom.Point;

	/**
	 * Util provides some helper methods for dealing with copy/extending Objects
	 * generating randoms between -1 and 1 and variable type handling.
	 *
	 * Ideally this class can go away.
	 *
	 * @author      Gregory Ray <gregory@everadventure.com>
	 * @version     0.1
	 * @since       2014-11-03
	 */
	public class Util {
		public static function toRad(deg:int):Number {
			return Math.PI * deg / 180;
		}

		public static function isNumber(i:*):Boolean {
			return typeof i == 'number';
		}

		public static function isInteger(num:Number):Boolean {
			return num == (num | 0);
		}

		public static function random11():Number {
			//return random(-1, 1, true); //removed random function for optimization purpose
			return Math.random()*2-1
		}

		public static function isObject(prop:*):Boolean {
			return (prop is Object && !(prop is Boolean) && !(prop is int) && !(prop is Number) && !(prop is String) && !(prop is uint));

		}

		public static function colorArrayToInt(array:Array):uint {
			var r:uint = Math.floor(array != null ? array[0] : 0);
			var g:uint = Math.floor(array != null ? array[1] : 0);
			var b:uint = Math.floor(array != null ? array[2] : 0);
			return ( ( r << 16 ) | ( g << 8 ) | b );
		}

		public static function colorArrayToString(array:Array, overrideAlpha:Number):String {
			var r:Number = array[0] | 0;
			var g:Number = array[1] | 0;
			var b:Number = array[2] | 0;
			var a:Number = overrideAlpha || array[3];

			return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
		}

		public static function catmullEstArcLen(P0:Point, P1:Point, P2:Point, P3:Point):Number {
			var len:Number = 0;
			var intervals:int = 30;
			for(var i:int = 1; i <= intervals; i++) {
				var ptA = new Point(catmull((i-1)/intervals, P0.x, P1.x, P2.x, P3.x), catmull((i-1)/intervals, P0.y, P1.y, P2.y, P3.y));
				var ptB =  new Point(catmull(i/intervals, P0.x, P1.x, P2.x, P3.x), catmull(i/intervals, P0.y, P1.y, P2.y, P3.y));
				len += Math.sqrt(Math.pow(ptA.x - ptB.x,2)+Math.pow(ptA.y - ptB.y,2));
			}
			return len;
		}

		public static function catmull(t:Number, P0:Number, P1:Number, P2:Number, P3:Number):Number{
			var tau = 0.5;    
			var t2:Number = t*t;
			var t3:Number = t2 * t;
		    	return ( (1 * P1) +
		    	(-tau*P0 + tau*P2) * t +
		    	(2*tau*P0 + (tau-3)*P1 + (3-2*tau)*P2 - tau*P3) * t2 +
		    	(-tau*P0 + (2-tau)*P1 + (tau-2)*P2 + tau*P3) * t3);
		}

		public static function catmulld(t:Number, P0:Number, P1:Number, P2:Number, P3:Number):Number{
			var tau = 0.5;
			var t2:Number = 2 * t;
			var t3:Number = 3 * t * t;
			t = 1;
		    	return ( 
		    	(-tau*P0 + tau*P2) * t +
		    	(2*tau*P0 + (tau-3)*P1 + (3-2*tau)*P2 - tau*P3) * t2 +
		    	(-tau*P0 + (2-tau)*P1 + (tau-2)*P2 + tau*P3) * t3);
		}

		/*
		 * Given a vector of any length, returns a vector
		 * pointing in the same direction but with a magnitude of 1
		 */
		public static function normalize(vector:Point):void {
			var length:Number = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
			vector.x /= length;
			vector.y /= length;
		}
	}
}

