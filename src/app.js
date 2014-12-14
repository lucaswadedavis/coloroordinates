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
app.m.appName="Coloroordinates";

///////////////////////////////////////////////////////
///////////////////////////////////////////////////////begin controllers

app.c.init=function(){
  app.v.init();  
  app.v.listeners();
};

///////////////////////////////////////////////////////end controllers
///////////////////////////////////////////////////////begin views

app.v.init=function(){
    app.m.bounds=app.v.initBounds();
    zi.css();
    $("body").html(app.t.layout() );
    app.v.initScene();
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
			//if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

			var container;

			var camera, scene, renderer;

			var mesh, group1, group2, group3, light;

			var mouseX = 0, mouseY = 0;

			var windowHalfX = window.innerWidth / 2;
			var windowHalfY = window.innerHeight / 2;

			init();
			animate();

			function init() {

				container = document.getElementById( 'container' );

				camera = new THREE.PerspectiveCamera( 20, window.innerWidth / window.innerHeight, 1, 10000 );
				camera.position.z = 1800;

				scene = new THREE.Scene();

				light = new THREE.DirectionalLight( 0xffffff );
				light.position.set( 0, 0, 1 );
				scene.add( light );

				// shadow

				var canvas = document.createElement( 'canvas' );
				canvas.width = 128;
				canvas.height = 128;

				var context = canvas.getContext( '2d' );
				var gradient = context.createRadialGradient( canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2 );
				gradient.addColorStop( 0.1, 'rgba(210,210,210,1)' );
				gradient.addColorStop( 1, 'rgba(255,255,255,1)' );

				context.fillStyle = gradient;
				context.fillRect( 0, 0, canvas.width, canvas.height );

				var shadowTexture = new THREE.Texture( canvas );
				shadowTexture.needsUpdate = true;

				var shadowMaterial = new THREE.MeshBasicMaterial( { map: shadowTexture } );
				var shadowGeo = new THREE.PlaneBufferGeometry( 300, 300, 1, 1 );

				mesh = new THREE.Mesh( shadowGeo, shadowMaterial );
				mesh.position.y = - 250;
				mesh.rotation.x = - Math.PI / 2;
				scene.add( mesh );

				mesh = new THREE.Mesh( shadowGeo, shadowMaterial );
				mesh.position.y = - 250;
				mesh.position.x = - 400;
				mesh.rotation.x = - Math.PI / 2;
				scene.add( mesh );

				mesh = new THREE.Mesh( shadowGeo, shadowMaterial );
				mesh.position.y = - 250;
				mesh.position.x = 400;
				mesh.rotation.x = - Math.PI / 2;
				scene.add( mesh );

				var faceIndices = [ 'a', 'b', 'c', 'd' ];

				var color, f, f2, f3, p, n, vertexIndex,

					radius = 200,

					geometry  = new THREE.IcosahedronGeometry( radius, 1 ),
					geometry2 = new THREE.IcosahedronGeometry( radius, 1 ),
					geometry3 = new THREE.IcosahedronGeometry( radius, 1 );

				for ( var i = 0; i < geometry.faces.length; i ++ ) {

					f  = geometry.faces[ i ];
					f2 = geometry2.faces[ i ];
					f3 = geometry3.faces[ i ];

					n = ( f instanceof THREE.Face3 ) ? 3 : 4;

					for( var j = 0; j < n; j++ ) {

						vertexIndex = f[ faceIndices[ j ] ];

						p = geometry.vertices[ vertexIndex ];

						color = new THREE.Color( 0xffffff );
						color.setHSL( ( p.y / radius + 1 ) / 2, 1.0, 0.5 );

						f.vertexColors[ j ] = color;

						color = new THREE.Color( 0xffffff );
						color.setHSL( 0.0, ( p.y / radius + 1 ) / 2, 0.5 );

						f2.vertexColors[ j ] = color;

						color = new THREE.Color( 0xffffff );
						color.setHSL( 0.125 * vertexIndex/geometry.vertices.length, 1.0, 0.5 );

						f3.vertexColors[ j ] = color;

					}

				}


				var materials = [

					new THREE.MeshLambertMaterial( { color: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors } ),
					new THREE.MeshBasicMaterial( { color: 0x000000, shading: THREE.FlatShading, wireframe: true, transparent: true } )

				];

				group1 = THREE.SceneUtils.createMultiMaterialObject( geometry, materials );
				group1.position.x = -400;
				group1.rotation.x = -1.87;
				scene.add( group1 );

				group2 = THREE.SceneUtils.createMultiMaterialObject( geometry2, materials );
				group2.position.x = 400;
				group2.rotation.x = 0;
				scene.add( group2 );

				group3 = THREE.SceneUtils.createMultiMaterialObject( geometry3, materials );
				group3.position.x = 0;
				group3.rotation.x = 0;
				scene.add( group3 );

				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setClearColor( 0xffffff );
				renderer.setSize( window.innerWidth, window.innerHeight );

				container.appendChild( renderer.domElement );

				document.addEventListener( 'mousemove', onDocumentMouseMove, false );

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

			function onDocumentMouseMove( event ) {

				mouseX = ( event.clientX - windowHalfX );
				mouseY = ( event.clientY - windowHalfY );

			}

			//

			function animate() {

				requestAnimationFrame( animate );

				render();
			}

			function render() {

				camera.position.x += ( mouseX - camera.position.x ) * 0.05;
				camera.position.y += ( - mouseY - camera.position.y ) * 0.05;

				camera.lookAt( scene.position );

				renderer.render( scene, camera );

			}
};

app.v.listeners=function(){
};

///////////////////////////////////////////////////////end views
///////////////////////////////////////////////////////begin templates

app.t.layout=function(){
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
        "margin":"0",
        "padding":"0",
        "border":"0",
        "position":"fixed"
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