
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
	 * A particle authoring environment for creation and experimentation.
	 *
	 * @author      Gregory Ray <gregory@everadventure.com>
	 * @version     0.1
	 * @since       2014-11-03
	 */
	public class ParticleBuilder extends MovieClip {
		private var devLayerMC:MovieClip = null;
		private var lineDrawing:MovieClip = null;
		private var markers:MovieClip = null;
		private var bodiesMC:MovieClip = null;
		private var emittersMC:MovieClip = null;

		private var activeActor:Actor;
		private var bodies:Array = new Array();
		private var paths:Array = new Array();

		private var emitters:Array = new Array();
		private var renderer:Renderer = null;
		private var zoom:Number = 1;
		//private var particle:Sprite;
		//private var particleBD:BitmapData;
		private var splinePaths:Array = new Array();
		private var bodyIndicators:Array = new Array();
		private var emitterIndicators:Array = new Array();
		private var splineLineColor:uint = 0x00ff00;

		public function ParticleBuilder() {
			stage.align = StageAlign.TOP_LEFT;
			Security.allowDomain("*");
			Security.allowInsecureDomain("*");
			//particle = new ParticleBitmap();
			//particleBD = new BitmapData(particle.width, particle.height, true, 0);
			//particleBD.draw(particle);
			devLayerMC = new MovieClip();
			addChild(devLayerMC);
			if (ExternalInterface.available) {
				ExternalInterface.addCallback("updateSpline", externUpdateSpline);
				ExternalInterface.addCallback("externZoom", externZoom);
				ExternalInterface.addCallback("externSize", externSize);
				ExternalInterface.addCallback("config", externalConfig);
				ExternalInterface.addCallback("setActiveActor", setActiveActor);
				ExternalInterface.addCallback("externSetPreviewMode", externSetPreviewMode);
				ExternalInterface.addCallback("externGetPreviewMode", externGetPreviewMode);
			}
		}

		private function externSetPreviewMode(previewMode:Boolean):void {
			devLayerMC.visible = !previewMode;
		}

		private function externGetPreviewMode():Boolean {
			return !devLayerMC.visible;
		}

		private function externUpdateSpline():void {
			if(renderer) renderer.addEventListener(DirectorEvent.updatePhaseEndEventType, updateSpline);
		}

		private function drawSpline():void{	
			markers = new MovieClip();
			devLayerMC.addChild(markers);
			//markers.scaleX = zoom;
		//	markers.scaleY = zoom;

			if(lineDrawing != null) {
				lineDrawing.removeEventListener(BuilderEvent.SPLINE_DIRTIED, updateSplinePaths);
				devLayerMC.removeChild(lineDrawing);
				lineDrawing = null;
			}

			lineDrawing = new MovieClip();
			devLayerMC.addChild(lineDrawing);
		//	lineDrawing.scaleX = zoom;
		//	lineDrawing.scaleY = zoom;

			for(var i = 0; i < paths.length; i++){
				var path:Path = paths[i];
				splinePaths.push(new SplinePath(path, markers, lineDrawing, splineLineColor, path == activeActor));
			}

			lineDrawing.addEventListener(BuilderEvent.SPLINE_DIRTIED, updateSplinePaths);


		}

		private function updateSplinePaths(e:Event){
			lineDrawing.graphics.clear();
			for(var i = 0; i < splinePaths.length; i++){
				var splinePath:SplinePath = splinePaths[i];
				splinePath.draw();
			}
		}

		private function drawBodies():void{	
			bodiesMC = new MovieClip();
		    	devLayerMC.addChild(bodiesMC);
			//bodiesMC.scaleX = zoom;
			//bodiesMC.scaleY = zoom;
			
			for(var i:int = 0; i < bodies.length; i++){
				var body:BodyIndicator = new BodyIndicator();
				body.x = bodies[i].pos.x;
				body.y = bodies[i].pos.y;
				if(bodies[i].force < 0) body.positive.alpha = 0;
				body.id = i;
				body.addEventListener(MouseEvent.MOUSE_DOWN,startDraggingBody);
				body.addEventListener(MouseEvent.MOUSE_UP,stopDraggingBody);
				if(activeActor !== bodies[i]) body.alpha = 0.5;
				bodyIndicators.push(body);
				bodiesMC.addChild(body);

				(function(bodyUI,bodyModel){

					return function(){
						bodyModel.addEventListener(DirectorEvent.actorAttrChangeEventType, function(e:Event){
							bodyUI.x = e.target.pos.x;
							bodyUI.y = e.target.pos.y;
						})
					}

				})(body, bodies[i])()

				
			}    
		}
		
		private function drawEmitters():void{	
			emittersMC = new MovieClip();
		    	devLayerMC.addChild(emittersMC);
			//emittersMC.scaleX = zoom;
			//emittersMC.scaleY = zoom;
			
			for(var i:int = 0; i < emitters.length; i++){
				var emitter:EmitterIndicator = new EmitterIndicator();
				emitter.x = emitters[i].pos.x;
				emitter.y = emitters[i].pos.y;
				emitter.id = i;
				emitter.addEventListener(MouseEvent.MOUSE_DOWN,startDraggingEmitter);
				emitter.addEventListener(MouseEvent.MOUSE_UP,stopDraggingEmitter);
				if(activeActor !== emitters[i]) emitter.alpha = 0.25;
				emitterIndicators.push(emitter);
				emittersMC.addChild(emitter);

				(function(emitterUI,emitterModel){

					return function(){
						emitterModel.addEventListener(DirectorEvent.actorAttrChangeEventType, function(e:Event){
							emitterUI.x = e.target.pos.x;
							emitterUI.y = e.target.pos.y;
						})
					}

				})(emitter, emitters[i])()

				
			}    
		}

		private function startDraggingBody(event:MouseEvent):void{
			event.currentTarget.addEventListener(MouseEvent.MOUSE_MOVE, updateDraggingBody);
			event.currentTarget.startDrag();
		}

		private function stopDraggingBody(event:MouseEvent):void{
			event.currentTarget.removeEventListener(MouseEvent.MOUSE_MOVE, updateDraggingBody);
			event.currentTarget.stopDrag();

			//for(var i = 0; i < emitters.length; i++) emitters[i].system.bodies = bodies;
			
			if (ExternalInterface.available) {
				ExternalInterface.call('bodiesChanged', JSON.stringify(bodies));
			}

			
		}

		private function updateDraggingBody(event:MouseEvent):void{
			bodies[event.currentTarget.id].pos  = new Point(event.currentTarget.x,  event.currentTarget.y);
		}

		private function startDraggingEmitter(event:MouseEvent):void{
			event.currentTarget.addEventListener(MouseEvent.MOUSE_MOVE, updateDraggingEmitter);
			event.currentTarget.startDrag();
		}

		private function stopDraggingEmitter(event:MouseEvent):void{
			event.currentTarget.removeEventListener(MouseEvent.MOUSE_MOVE, updateDraggingEmitter);
			event.currentTarget.stopDrag();

			//for(var i = 0; i < emitters.length; i++) emitters[i].system.bodies = bodies;
			
			if (ExternalInterface.available) {
				ExternalInterface.call('emittersChanged', JSON.stringify(emitters));
			}

			
		}

		private function updateDraggingEmitter(event:MouseEvent):void{
			emitters[event.currentTarget.id].pos  = new Point(event.currentTarget.x,  event.currentTarget.y);
		}

		private function setActiveActor(i:int, actorType:String = ''):void {
			for(var bodyIndicatorIdx = 0; bodyIndicatorIdx< bodyIndicators.length;bodyIndicatorIdx++) bodyIndicators[bodyIndicatorIdx].alpha = 0.5;
			for(var emitterIndicatorIdx = 0; emitterIndicatorIdx< emitterIndicators.length;emitterIndicatorIdx++) emitterIndicators[emitterIndicatorIdx].alpha = 0.25;

			if(i == -1){
				activeActor = null;
				if(markers != null) {
					devLayerMC.removeChild(markers);
					markers = null;
				}
				
			} else {
				var actorList:Array;
				if(actorType == 'emitter') {
					actorList = emitters;
					if(emitterIndicators[i]) emitterIndicators[i].alpha = 1.0;
				} else if (actorType == 'body') {
					actorList = bodies;
					if(bodyIndicators[i]) bodyIndicators[i].alpha = 1.0;
				} else if (actorType == 'path') {
					actorList = paths;
				}
				if(activeActor == actorList[i]) return;
				if(actorList[i]) activeActor = actorList[i];
				if(renderer) renderer.addEventListener(DirectorEvent.updatePhaseEndEventType, updateSpline);
			}


		}

		private function setActiveBody(i:int):void {
			if(i == -1){
				activeActor = null;
				if(markers != null) {
					devLayerMC.removeChild(markers);
					markers = null;
				}
				if(lineDrawing != null) {
					devLayerMC.removeChild(lineDrawing);
					lineDrawing = null;
				}
				
			} else {
				if(activeActor == bodies[i]) return;
				activeActor = bodies[i];
				if(renderer) renderer.addEventListener(DirectorEvent.updatePhaseEndEventType, updateSpline);
			}
		}

		private function externalConfig(configJSON:String, reload:Boolean = false):void {
			 if(reload){

				if(renderer) removeChild(renderer);
				renderer = new Renderer(stage.stageWidth, stage.stageHeight, true);
				addChild(renderer);
				setChildIndex(devLayerMC, (this.numChildren-1));

					
				emitters.length = 0;
				bodies.length = 0;
				bodyIndicators.length = 0;
				emitterIndicators.length = 0;
				paths.length = 0;
				splinePaths.length = 0;
			 }
			 
			var system = JSON.parse(configJSON);
			for(var x = 0; x < system.emitters.length; x++){
				SystemsManager.getInstance().addSystem(system.emitters[x].systemName, 'EMITTER', system.emitters[x]);	
				if(reload){
					var sys:com.axionfx.System = new com.axionfx.System(system.emitters[x]);
					var emitter:Emitter = new Emitter(sys);
					emitter.addRenderer(renderer);
					emitters.push(emitter);
				}
			}
			
			for(var b = 0; b < system.bodies.length; b++){
				SystemsManager.getInstance().addSystem(system.bodies[b].systemName, 'BODY', system.bodies[b]);

				if(reload){
					var bodySys:com.axionfx.System = new com.axionfx.System(system.bodies[b]);
					var body:com.axionfx.Body = new com.axionfx.Body(bodySys);
					body.addRenderer(renderer);
					bodies.push(body);
				}
			}

			for(var p = 0; p < system.paths.length; p++){
				SystemsManager.getInstance().addSystem(system.paths[p].systemName, 'PATH', system.paths[p]);

				if(reload){
					var pathSys:com.axionfx.System = new com.axionfx.System(system.paths[p]);
					var path:com.axionfx.Path = new com.axionfx.Path(pathSys);
					path.addRenderer(renderer);
					paths.push(path);
				}
			}
			
			if(!reload) renderer.refreshSystems();
			if(renderer) renderer.addEventListener(DirectorEvent.updatePhaseEndEventType, updateSpline);
		}

		private function externZoom(_zoom:Number):void {
			zoom = _zoom;
			renderer.scaleX = zoom;
			renderer.scaleY = zoom;
			devLayerMC.scaleX = zoom;
			devLayerMC.scaleY = zoom;
		}

		private function externSize(width:int, height:int):void {
			renderer.scaleX = zoom;
			renderer.scaleY = zoom;
			renderer.updateSize(width, height);
		}

		private function updateSpline(e:Event = null):void{
			renderer.removeEventListener(DirectorEvent.updatePhaseEndEventType, updateSpline);

			if(markers != null) {
				devLayerMC.removeChild(markers);
				markers = null;
			}

			if(lineDrawing != null) {
				devLayerMC.removeChild(lineDrawing);
				lineDrawing = null;
			}
		
			if(paths.length > 0) drawSpline();
			if(bodiesMC != null) {
				devLayerMC.removeChild(bodiesMC);
				bodiesMC = null;
			}
			if(emittersMC != null) {
				devLayerMC.removeChild(emittersMC);
				emittersMC = null;
			}
			drawBodies();
			drawEmitters();

		}

	}
}







