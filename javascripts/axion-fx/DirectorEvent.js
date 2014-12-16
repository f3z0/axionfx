
define( function() {

	/**
	 * DirectorEvent.js
	 * An event wrapper for actors.
	 *
	 * @author      Gregory Ray <gregory@everadventure.com>
	 * @version     0.1
	 * @since       2014-11-03
	 */
	function DirectorEvent(type, actorIdx){
		return new CustomEvent(type, { 'detail': actorIdx })
	}
	DirectorEvent.actorAddedEventType = "DIRECTOR_EVENT";
	DirectorEvent.systemRefreshEventType = "SYSTEM_REFRESH";
	DirectorEvent.updatePhaseStartEventType = "UPDATE_PHASE_START_EVENT_TYPE";
	DirectorEvent.updatePhaseEndEventType = "UPDATE_PHASE_END_EVENT_TYPE";
	DirectorEvent.renderPhaseStartEventType = "RENDER_PHASE_START_EVENT_TYPE";
	DirectorEvent.renderPhaseEndEventType = "RENDER_PHASE_END_EVENT_TYPE";
	DirectorEvent.actorAttrChangeEventType = "ACTOR_ATTR_CHANGE_EVENT_TYPE";
	return DirectorEvent;
});