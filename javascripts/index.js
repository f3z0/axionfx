 window.flashZoom = 1.0;
   $(function() {

   	function updateActiveState(idx, tabName) {
   		var actorType;
   		if(typeof idx === 'undefined') idx = -1;
   		if(tabName === 'emitters-tab') actorType = 'emitter';
   		if(tabName === 'bodies-tab') actorType = 'body';
   		if(tabName === 'paths-tab') actorType = 'path';
   		if(actorType) document.getElementById('flashemitter').setActiveActor(idx, actorType);
   	}

   	$( "button" )
   	      .button();
   	
   	$( ".accordion" ).accordion({
   		animate: false,
		collapsible: true,
		heightStyle: "content",
		afterActivate: function(event, ui) {
			updateActiveState(ui.newHeader.attr('data-idx'), this.id);
		}
   	});

   	$( "#tabs" ).tabs({
   		activate: function(event, ui) {
   			updateActiveState(ui.newPanel.find('.ui-accordion-header-active').attr('data-idx'), ui.newPanel.get(0).id.replace('-container', ''));
   		}
   	});

     $( "#slider-vertical" ).slider({
       orientation: "vertical",
       range: "min",
       min: 1,
       max: 4,
       value: 1,
       step: 0.25,
       slide: function( event, ui ) {
       	window.flashZoom = parseFloat(ui.value);
       	$('#zoom-level span').html(window.flashZoom);
       	document.getElementById('flashemitter').externZoom(flashZoom);

       	document.getElementById('canvasContainer').width = flashZoom*parseInt(window.flashWidth);
       	document.getElementById('canvasContainer').height = flashZoom*parseInt(window.flashHeight);

       	document.getElementById('flashemitter').width = flashZoom*parseInt(window.flashWidth);
       	document.getElementById('flashemitter').height = flashZoom*parseInt(window.flashHeight);
       	document.getElementById('flashemitter-bg').style.width  = document.getElementById('flashemitter').width + 'px';
       	document.getElementById('flashemitter-bg').style.height  = document.getElementById('flashemitter').height + 'px';

       	
       	document.getElementById('captureevents').style.height  = document.getElementById('flashemitter').height + 'px';
       	document.getElementById('captureevents').style.width  = document.getElementById('flashemitter').width + 'px';

       	adjustSize();
       }
     });
   });

 $(function(){

  $(document).on('click', '.folder', function(){
    $( ".accordion" ).accordion( "refresh" );
  })
  var dragTimer;
  $("#captureevents").hide();
  $(document).on('dragover', function(e) {
      var dt = e.originalEvent.dataTransfer;
      if(dt.types != null && (dt.types.indexOf ? dt.types.indexOf('Files') != -1 : dt.types.contains('application/x-moz-file'))) {
          $("#captureevents").show();
          window.clearTimeout(dragTimer);
      }
  });
  $(document).on('dragleave', function(e) {
      dragTimer = window.setTimeout(function() {
          $("#captureevents").hide();
      }, 25);
  });

  var holder = document.getElementById('captureevents');
  var bgdiv = document.getElementById('flashemitter-bg');

  if (typeof window.FileReader === 'undefined') {
    alert('File reader unavailable, please upgrade browser.')
  } 
   
  holder.addEventListener("dragover", function(event) {
    event.preventDefault();
  }, true);
  holder.addEventListener("dragend", function(event) {
    event.preventDefault();
    // Ready to do something with the dropped object
  }, true);

  holder.addEventListener("drop", function(event) {
    event.preventDefault();
    $("#captureevents").hide();
    var file = event.dataTransfer.files[0]
    var objectURL = window.URL.createObjectURL(file);
    if(file.type === 'application/x-shockwave-flash') {
      var i = document.createElement('iframe')
      i.src = objectURL;
      i.id = 'flashemitter-iframe';
      i.width = $('#flashemitter').width();
      i.height =  $('#flashemitter').height();
      i.style.pointerEvents = 'none';
      bgdiv.appendChild(i)

    } else {
    bgdiv.style.backgroundImage = ' url(' + objectURL + ')';
    if(document.getElementById('flashemitter-iframe')) bgdiv.removeChild(document.getElementById('flashemitter-iframe'));

    }
  });
  

 });

 function adjustSize(){
  var w = window,
      d = document,
      e = d.documentElement,
      g = d.getElementsByTagName('body')[0],
      x = w.innerWidth || e.clientWidth || g.clientWidth,
      y = w.innerHeight|| e.clientHeight|| g.clientHeight;
      y = Math.max(700, y);
      var sideLen = Math.min(x-370, y);

  document.getElementById('flashContent').style.height=sideLen+'px';
  document.getElementById('flashContent').style.width=sideLen+'px';
  document.getElementById('flashContent').style.marginLeft=Math.max(0,x-sideLen-370)+'px';

  document.getElementById('side').style.left=Math.max(0,x-sideLen-370)-120+'px';
  document.getElementById('side2').style.left=Math.max(0,x-sideLen-370)-120+'px';

  document.getElementById('flashemitter-bg').style.marginTop=((sideLen-document.getElementById('flashemitter').height)/2) + 'px';
  document.getElementById('flashemitter-bg').style.marginLeft=((sideLen-document.getElementById('flashemitter').width)/2) + 'px';

  document.getElementById('canvasContainer').style.marginTop=((sideLen-document.getElementById('flashemitter').height)/2) + 'px';
  document.getElementById('canvasContainer').style.marginLeft=((sideLen-document.getElementById('flashemitter').width)/2) + 'px';

  document.getElementById('captureevents').style.left = document.getElementById('flashemitter-bg').style.marginLeft;
  document.getElementById('captureevents').style.top = document.getElementById('flashemitter-bg').style.marginTop;

  $('#scroll').height($(window).height()-40)

 }