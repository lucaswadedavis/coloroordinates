$(document).ready(function(){
    app.c.init();
});

///////////////////////////////////////////////////////
///////////////////////////////////////////////////////

var app={};
app.m={};
app.v={};
app.c={};
app.t={};

///////////////////////////////////////////////////////
///////////////////////////////////////////////////////

app.m.bounds=false;
app.m.scene=false;
app.m.colorMap=false;
app.m.appName="Coloroordinates";

///////////////////////////////////////////////////////
///////////////////////////////////////////////////////begin controllers

app.c.init=function(){
  app.v.init();  
  app.v.listeners();
};

app.c.getImageData=function(){
  var c=document.getElementById("canvas");
  var ctx=c.getContext("2d");
  var img=document.getElementById("uploaded");
  var imageWidth=$("img").width();
  var imageHeight=$("img").height();
  $("canvas").attr({
    width:imageWidth,
    height:imageHeight
  });
  ctx.drawImage(img,0,0);
  var imgData=ctx.getImageData(0,0,imageWidth,imageHeight);
  var colorMap = app.m.colorMap={};
  for (var i=0;i<imgData.data.length;i++){
    var color="rgb("+imgData.data[i]+","+imgData.data[i+1]+","+imgData.data[i+2]+")"; 
    colorMap[color] ? colorMap[color]++ : colorMap[color]=1;
  }
  
};

///////////////////////////////////////////////////////end controllers
///////////////////////////////////////////////////////begin views

app.v.init=function(){
    app.m.bounds=app.v.initBounds();
    zi.css();
    $("body").html(app.t.layout() );
    //app.v.initScene();
};

app.v.initBounds=function(){
	var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight|| e.clientHeight|| g.clientHeight;
  var b={};
  b.right=x-20;
  b.left=0;
  b.top=0;
  b.bottom=y;
  b.centerX=b.right/2;
  b.centerY=b.bottom/2;
  b.width=b.right-b.left;
  b.height=b.bottom-b.top;

  return b;
};

app.v.initScene=function(){	
			var container;
			var camera, scene, renderer, group, particle;
			var mouseX = 0, mouseY = 0;

			var windowHalfX = window.innerWidth / 2;
			var windowHalfY = window.innerHeight / 2;

			init();
			animate();

			function init() {

				container = document.createElement( 'div' );
				document.body.appendChild( container );

				camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 3000 );
				camera.position.z = 1000;

				scene = new THREE.Scene();

				var PI2 = Math.PI * 2;
				var program = function ( context ) {

					context.beginPath();
					context.arc( 0, 0, 0.5, 0, PI2, true );
					context.fill();

				}

				group = new THREE.Group();
				scene.add( group );

				for ( var i = 0; i < 1000; i++ ) {

					var material = new THREE.SpriteCanvasMaterial( {
						//color: Math.random() * 0x808008 + 0x808080,
						color: chance.color(),
						program: program
					} );

					particle = new THREE.Sprite( material );
					particle.position.x =10*Math.sin(i);
					particle.position.y = -100;
					particle.position.z = i*10;
					particle.scale.x = particle.scale.y = Math.random() * 20 + 10;
					group.add( particle );
				}

				renderer = new THREE.CanvasRenderer();
				renderer.setSize( window.innerWidth, window.innerHeight );
				container.appendChild( renderer.domElement );

				document.addEventListener( 'mousemove', onDocumentMouseMove, false );
				document.addEventListener( 'touchstart', onDocumentTouchStart, false );
				document.addEventListener( 'touchmove', onDocumentTouchMove, false );

				//

				window.addEventListener( 'resize', onWindowResize, false );

			}

			function onWindowResize() {

				windowHalfX = window.innerWidth / 2;
				windowHalfY = window.innerHeight / 2;

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			//

			function onDocumentMouseMove( event ) {

				mouseX = event.clientX - windowHalfX;
				mouseY = event.clientY - windowHalfY;
			}

			function onDocumentTouchStart( event ) {

				if ( event.touches.length === 1 ) {

					event.preventDefault();

					mouseX = event.touches[ 0 ].pageX - windowHalfX;
					mouseY = event.touches[ 0 ].pageY - windowHalfY;

				}

			}

			function onDocumentTouchMove( event ) {

				if ( event.touches.length === 1 ) {

					event.preventDefault();

					mouseX = event.touches[ 0 ].pageX - windowHalfX;
					mouseY = event.touches[ 0 ].pageY - windowHalfY;

				}

			}

			//

			function animate() {

				requestAnimationFrame( animate );
				render();
			}

			function render() {

				camera.position.x += ( mouseX - camera.position.x ) * 0.5;
				//camera.position.y += ( - mouseY - camera.position.y ) * 0.05;
				camera.lookAt( scene.position );

				//group.rotation.x += 0.01;
				//group.rotation.y += 0.02;

				renderer.render( scene, camera );

			}
};

app.v.listeners=function(){
  
   function previewFile(){
       var preview = document.querySelector('img'); //selects the query named img
       var file    = document.querySelector('input[type=file]').files[0]; //sames as here
       var reader  = new FileReader();

       reader.onloadend = function () {
           preview.src = reader.result;
       }

       if (file) {
           reader.readAsDataURL(file); //reads the data as a URL
       } else {
           preview.src = "";
       }
  }
  
  $("body").on("click","input[type=file]",function(){
    previewFile();
  })

};

///////////////////////////////////////////////////////end views
///////////////////////////////////////////////////////begin templates

app.t.layout=function(){
  var d="";
  d+="<input type='file'></input>";
  d+="<br>";
  d+="<img src=''/ id='uploaded'>";
  d+="<canvas id='canvas'></canvas>";
  return d;
};

app.t.coloroordinates=function(){
  var d="";
  d+="<div id='container'></div>";
  return d;
};

///////////////////////////////////////////////////////end templates
///////////////////////////////////////////////////////begin css

zi={};
zi.config=function(){
    var css={
      "body":{
        "font-family":"sans-serif",
        "padding":"0",
        "margin":"0",
        "border":"0",
        "background":"#555"
      },
      "canvas":{
        
        /*
        "margin":"0",
        "padding":"0",
        "border":"0",
        "position":"fixed"
        */
      },
      "canvas#paper":{
        "z-index":"-1"
      },
      "div#yesterday":{
        "float":"left"
      },
      "div#tomorrow":{
        "float":"right"
      },
      "div#dateDisplay":{
        "padding":"30px",
        "color":"#ddd",
        "position":"fixed",
        "z-index":"0"
      }
    };
    return css;
};
zi.transform=function(css){
    var c="";
    for (var selector in css){
        c+=selector+"{";
        for (var property in css[selector]){
            c+=property+" : "+css[selector][property]+";";
        }
        c+="}";
    }
    return c;
};
zi.css=function(){
    if ($("head#zi").length<1){
        $("head").append("<style type='text/css' id='zi'></style>");
    }
    $("head style#zi").html( this.transform( this.config() ) );
};
/////////////////////////////////////////////////////// end css section
///////////////////////////////////////////////////////