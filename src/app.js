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
    var simplify=function(number,base){
      if (base===undefined){
          var base=15;
      }
      return Math.floor(number/base)*base;  
    };
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
  for (var i=0;i<imgData.data.length;i+=4){
    if (imgData.data[i+3]>0){
      var color="rgb("+simplify(imgData.data[i])+","+simplify(imgData.data[i+1])+","+simplify(imgData.data[i+2])+")"; 
      colorMap[color] ? colorMap[color]++ : colorMap[color]=1;
    }
  }
  
  app.v.initScene();
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
      $("body").html(app.t.coloroordinates());
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

        camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.z = 1000;
        camera.position.y = 600;
        camera.position.x = 800;

        controls = new THREE.OrbitControls( camera );
        controls.addEventListener( 'change', render );

				scene = new THREE.Scene();

				var PI2 = Math.PI * 2;
				var program = function ( context ) {

					context.beginPath();
					context.arc( 0, 0, 0.5, 0, PI2, true );
					context.fill();

				}

				group = new THREE.Group();
				scene.add( group );


				var geometry = new THREE.BoxGeometry( 545, 545, 545 );

				var material = new THREE.MeshBasicMaterial({wireframe:true} );

				mesh = new THREE.Mesh( geometry, material );
				mesh.translateZ(250);							
				mesh.translateY(250);
				mesh.translateX(250);

				scene.add( mesh );


        //return to here
				for (var key in app.m.colorMap) {
          var colorNumberString=key.substring(4);
          var colors=colorNumberString.split(",");
          var red=parseInt(colors[0],10);
          var green=parseInt(colors[1],10);
          var blue=parseInt(colors[2],10);
					var material = new THREE.SpriteCanvasMaterial( {
						//color: Math.random() * 0x808008 + 0x808080,
						color: key,
						program: program
					} );

					particle = new THREE.Sprite( material );
					particle.position.x =2*red;
					particle.position.y =2*green;
					particle.position.z =2*blue;
					particle.scale.x = particle.scale.y = 30;
					group.add( particle );
				}

				renderer = new THREE.CanvasRenderer();
				renderer.setSize( window.innerWidth, window.innerHeight );
				container.appendChild( renderer.domElement );

        /*
				document.addEventListener( 'mousemove', onDocumentMouseMove, false );
				document.addEventListener( 'touchstart', onDocumentTouchStart, false );
				document.addEventListener( 'touchmove', onDocumentTouchMove, false );
        */
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

				//camera.position.x += ( mouseX - camera.position.x ) * 0.5;
				//camera.position.z += ( - mouseY - camera.position.z ) * 0.05;
				camera.lookAt(new THREE.Vector3(256,256,256));

				//group.rotation.x += 0.01;
				//group.rotation.y += 0.02;

				renderer.render( scene, camera );

			}


    delete app.m.colorMap;
    
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
  
  $("body").on("change","input[type=file]",function(){
    
       var preview = document.querySelector('img'); //selects the query named img
       var file    = document.querySelector('input[type=file]').files[0]; //sames as here
       var reader  = new FileReader();

       reader.onloadend = function () {
        preview.src = reader.result;
        app.c.getImageData();

       }

       if (file) {
          reader.readAsDataURL(file); //reads the data as a URL
       } else {
           preview.src = "";
       }
       
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
  d+="<p>upload an image to see it's colors displayed in 3-space. The x, y, and z axes are the red, green, and blue values of the image's constituent pixels.</p>";
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
        "text-align":"center",
        "font-family":"sans-serif",
        "color":"#fff",
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
      },
      "input[type=file]":{
        "cursor":"pointer",
        "margin":"30px",
        "margin-top":"120px",
        "font-size":"3em",
        "background-color":"#f37"
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