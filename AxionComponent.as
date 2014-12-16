package { 

	import adobe.utils.MMExecute;
	import flash.display.DisplayObject;
	import flash.display.MovieClip;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.geom.Rectangle;
	import flash.text.AntiAliasType;
	import flash.text.TextField;
	import flash.text.TextFormat;
	import com.axionfx.*;
	
	public class AxionComponent extends MovieClip	{ 
		
		// The name and variable of each parameter must match!
		// Keep these alphabetised!
		
		private var _tf:TextField;
		private var _width:Number;
		private var _height:Number;
		private var _background:Sprite;
		private var bodies:Array = new Array();
		private var paths:Array = new Array();

		private var emitters:Array = new Array();
		private var renderer:Renderer = null;
		
		
		// on-stage
		public var avatar:TextField;
		
		public function AxionComponent(w:Number = NaN, h:Number = NaN) {
			
			// Create children
			_background = new Sprite();
			_tf = new TextField();
			_tf.defaultTextFormat = avatar.defaultTextFormat;
			_tf.embedFonts = true;
			_tf.antiAliasType = AntiAliasType.ADVANCED;
			_tf.autoSize = "left";
			
			// Store our dimensions in our own variables
			// so that when we reset the scale, we still
			// know the correct size to draw.  If this instance
			// is being dropped onto the stage in the authoring
			// environment, then w and h will be NaN, and we'll
			// use the default dimensions--defined by the "avatar"
			// that's already on-stage.
			_width = isNaN(w) ? super.width : w;
			_height = isNaN(h) ? super.height : h;
			
			scaleX = scaleY = 1;
			setSize(_width, _height);
			
			// Replace the avatar with our shape
			removeChild(avatar);
			addChild(_background);
			addChild(_tf);
		} 
		
		//----------------------------------------------------------
		
		/**
		 * This method is called automatically by the authoring
		 * tool whenever the components dimensions are changed.
		 */
		public function setSize(w:Number, h:Number):void {
			_width = w;
			_height = h;
		} 
		
		private function draw():void { 
			_background.graphics.clear();
			_background.graphics.beginFill(0xFF0000, 1);
			_background.graphics.drawRoundRect(0, 0, _width, _height, 0, 0);
			_background.graphics.endFill(); 


						
		}
		
		//----------------------------------------------------------
		private var _config:String;
		[Inspectable (name = "config", variable = "config", type = "String", defaultValue = "{}")]
		public function get config():String { return _config; }
		public function set config(value:String):void {
			_config = value;
			if(renderer) removeChild(renderer);
			renderer = new Renderer(_width, _height, true);
			addChild(renderer);
				
			emitters.length = 0;
			bodies.length = 0;
			paths.length = 0;
			 
			var system = JSON.parse(_config||"{}");
			if(!system.emitters) return;
			for(var x = 0; x < system.emitters.length; x++){
				SystemsManager.getInstance().addSystem(system.emitters[x].systemName, 'EMITTER', system.emitters[x]);	
				var sys:com.axionfx.System = new com.axionfx.System(system.emitters[x]);
				var emitter:Emitter = new Emitter(sys);
				emitter.addRenderer(renderer);
				emitters.push(emitter);
			}
			
			for(var b = 0; b < system.bodies.length; b++){
				SystemsManager.getInstance().addSystem(system.bodies[b].systemName, 'BODY', system.bodies[b]);
				var bodySys:com.axionfx.System = new com.axionfx.System(system.bodies[b]);
				var body:com.axionfx.Body = new com.axionfx.Body(bodySys);
				body.addRenderer(renderer);
				bodies.push(body);
			}

			for(var p = 0; p < system.paths.length; p++){
				SystemsManager.getInstance().addSystem(system.paths[p].systemName, 'PATH', system.paths[p]);
				var pathSys:com.axionfx.System = new com.axionfx.System(system.paths[p]);
				var path:com.axionfx.Path = new com.axionfx.Path(pathSys);
				path.addRenderer(renderer);
				paths.push(path);
			}
		}

		//----------------------------------------------------------
		
		override public function get width():Number { return _width; }
		override public function set width(value:Number):void {
			_width = value;
		}
		
		override public function get height():Number { return _height; }
		override public function set height(value:Number):void {
			_height = value;
		}
		
		//----------------------------------------------------------
		
	}
}
