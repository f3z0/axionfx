
package {
	import adobe.utils.MMExecute;
	import fl.events.ColorPickerEvent;
	import fl.events.SliderEvent;
	import fl.events.*;
	import flash.display.MovieClip;
	import fl.controls.Slider;
	import fl.controls.ColorPicker;
	import flash.events.Event;
	import flash.text.TextField;
	
	public class AxionControlPanel extends MovieClip {

		public var config:TextField;
		private const PARAMETER_CONFIG:String = "fl.getDocumentDOM().selection[0].parameters[0].value";
		
		public function AxionControlPanel() {
			config.text = MMExecute(PARAMETER_CONFIG);
			config.addEventListener(Event.CHANGE, configChanged, false, 0, true);
			addEventListener(Event.ENTER_FRAME, onFrameEnter, false, 0, true);
		}

		private function configChanged(e:Event = null):void {
			MMExecute(PARAMETER_CONFIG + "=" + JSON.stringify(config.text));
		}

		private function onFrameEnter(e:Event):void {
			MMExecute(PARAMETER_CONFIG + "=" + JSON.stringify(config.text));
			removeEventListener(Event.ENTER_FRAME, onFrameEnter);
		}

	}
}

