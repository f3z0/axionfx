
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
	public class DirectorEvent extends Event {

		public var actorIdx:int = -1;
		public static var actorAddedEventType = "DIRECTOR_EVENT";
		public static var systemRefreshEventType = "SYSTEM_REFRESH";
		public static var updatePhaseStartEventType = "UPDATE_PHASE_START_EVENT_TYPE";
		public static var updatePhaseEndEventType = "UPDATE_PHASE_END_EVENT_TYPE";
		public static var renderPhaseStartEventType = "RENDER_PHASE_START_EVENT_TYPE";
		public static var renderPhaseEndEventType = "RENDER_PHASE_END_EVENT_TYPE";
		public static var actorAttrChangeEventType = "ACTOR_ATTR_CHANGE_EVENT_TYPE";

		public function DirectorEvent(type:String, _actorIdx:int = -1, bubbles:Boolean = false, cancelable:Boolean = false) {
			actorIdx = _actorIdx;
			super(type, bubbles, cancelable);
		}
	}
}