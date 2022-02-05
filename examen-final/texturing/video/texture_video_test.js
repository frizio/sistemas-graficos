// Hello Scene: axis + camera dat.GUI controls + stats

function draw_scene() {

  // CANVAS
  //Create the Three.js WebGL renderer
  var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth-20, window.innerHeight-20);
    document.body.appendChild( renderer.domElement );
    renderer.setClearColor(0xC3B7B7);


  // SCENE
  var scene = new THREE.Scene();


  // CAMERA (PERSPECTIVE projection)
  var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 10000);


  // dat.GUI variables
  var controls = new function() {

	  this.camerax = 0;
	  this.cameray = 0;
	  this.cameraz = 400;

  }

  var video = document.createElement('video');
      video.src = "poi_test.ogv";
      //video.src = "sintel.ogv";
      video.load();
      video.play();

  //make your video canvas
  var videocanvas = document.createElement('canvas');
  var videocanvascontext = videocanvas.getContext('2d');

  //set its size
  videocanvas.width = 640;  // 480
  videocanvas.height = 360; // 204

  //draw a black rectangle so that your spheres don't start out transparent
  videocanvascontext.fillStyle = "#ff0000";
  videocanvascontext.fillRect(0, 0, 360, 640);
  //480 208

  //add canvas to new texture
  var videoTexture = new THREE.Texture(videocanvas);
  videoTexture.wrapS = THREE.ClampToEdgeWrapping;
  videoTexture.wrapT = THREE.ClampToEdgeWrapping;
  videoTexture.repeat.set( 1, 1 );

  //add texture to material that will be wrapped around the sphere
  var material = new THREE.MeshBasicMaterial( { map: videoTexture, overdraw: 0.5 } );

  //Use whatever values you were using for the sizes of the spheres before
  var geometry = new THREE.PlaneGeometry( 1000, 500, 8, 8 );

  //make a mesh from the material and the geometry (the sphere)
  var object = new THREE.Mesh(geometry, material);
  scene.add(object);


  // LIGHT(s)
  var ambientLight = new THREE.AmbientLight(0x141414);
  scene.add(ambientLight);

  var light = new THREE.DirectionalLight();
  light.position.set(0, 30, 20);
  scene.add(light);

  // LIGHT

  // HELPERS
  var axisHelper = new THREE.AxisHelper( 1000 );
  scene.add(axisHelper);

  // CONTROLS
  // dat.GUI controls
  var gui = new dat.GUI();
    var f1 = gui.addFolder('Camera');
    f1.add(controls, 'camerax', -900,900).onChange(render);
    f1.add(controls, 'cameray', -900,900).onChange(render);
    f1.add(controls, 'cameraz', -900,900).onChange(render);


  // MouseControl


  // STATS
  stats = new Stats();
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    stats.domElement.style.zIndex = 100;
    document.body.appendChild( stats.domElement );


  // Render function
  function render() {

    stats.update();


    if(video.readyState === video.HAVE_ENOUGH_DATA){
      //draw video to canvas starting from upper left corner
      videocanvascontext.drawImage(video, 0, 0);
      //tell texture object it needs to be updated
      videoTexture.needsUpdate = true;
    }


    camera.position.set(controls.camerax, controls.cameray, controls.cameraz);
    camera.lookAt(scene.position);

    renderer.render( scene, camera );

    window.requestAnimationFrame(render); //When finished rendering, ask to render again on the next frame

  }

 render();

}
