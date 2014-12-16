
package com.axionfx
{
	import flash.events.Event;
	

	/**
	 * Emitter is a Sprite subclass which draws particle effects as defined by the System
	 *  associated to the Emitter.
	 *
	 * @author      Gregory Ray <gregory@everadventure.com>
	 * @version     0.1
	 * @since       2014-11-03
	 */
	public class BuilderEvent extends Event {
		public static var SPLINE_DIRTIED = "BUILDER_EVENT_SPLINE_DIRTIED";

		public function BuilderEvent(type:String, bubbles:Boolean = false, cancelable:Boolean = false) {
			super(type, bubbles, cancelable);
		}
	}
}