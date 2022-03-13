// Hello Scene: axis + camera dat.GUI controls + stats + camera target + mouse controls

function draw_scene() {

  // CANVAS
  //Create the Three.js WebGL renderer
  var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth-20, window.innerHeight-20);
    document.body.appendChild( renderer.domElement );
    renderer.setClearColor(0xC3B7B7); //0xEEEEEE


  // SCENE
  var scene = new THREE.Scene();


  // CAMERA (PERSPECTIVE projection)
  var perspectiveCamera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1200);
  var orthographicCamera = new THREE.OrthographicCamera(-window.innerWidth/2 ,  window.innerWidth/2,
                                                         window.innerHeight/2, -window.innerHeight/2,
                                                         0.1,                   1200);

  var camera = perspectiveCamera;

  // dat.GUI variables
  var controls = new function() {

    // f1 camera position and target

    this.projection = 0;

	  this.camerax = 50;
	  this.cameray = 50;
	  this.cameraz = 100;

		this.camerax_prev = 50;
		this.cameray_prev = 50;
		this.cameraz_prev = 100;

    this.cameratargetx = 0;
	  this.cameratargety = 0;
	  this.cameratargetz = 0;

    this.cameratargetx_prev = 0;
	  this.cameratargety_prev = 0;
	  this.cameratargetz_prev = 0;

	  this.updateCamx = function (e){
	    camera.position.x = e;
	  }
	  this.updateCamy = function (e){
	    camera.position.y = e;
	  }
	  this.updateCamz = function (e){
	    camera.position.z = e;
	  }
    this.updateCamtargetx = function (e){
	    cameraTarget.position.x = e;
	  }
    this.updateCamtargety = function (e){
	    cameraTarget.position.y = e;
	  }
    this.updateCamtargetz = function (e){
	    cameraTarget.position.z = e;
	  }

  }


  // Object GEOMETRY


  // Object MATERIAL


  // OBJECT = geometry + material

  // LIGHT

  // Camera target object
  var cameraTarget = new THREE.Mesh( new THREE.SphereGeometry(2, 8, 8),
                                     new THREE.MeshBasicMaterial( { color: 0xff00ff } ));
  scene.add(cameraTarget);

  // HELPERS
  var axisHelper = new THREE.AxisHelper( 200 );
  scene.add(axisHelper);

  // CONTROLS
  // dat.GUI controls
  var gui = new dat.GUI();
    var f1 = gui.addFolder('Camera: position and target');
    f1.add(controls, 'projection', {Perspective: 0, Ortographic: 1}).onChange(render);
    var controlx = f1.add(controls, 'camerax', -200,200).onChange(controls.updateCamx);
    var controly = f1.add(controls, 'cameray', -200,200).onChange(controls.updateCamy);
    var controlz = f1.add(controls, 'cameraz', -200,200).onChange(controls.updateCamz);
    var controltargetx = f1.add(controls, 'cameratargetx', -200,200).onChange(controls.updateCamtargetx);
    var controltargety = f1.add(controls, 'cameratargety', -200,200).onChange(controls.updateCamtargety);
    var controltargetz = f1.add(controls, 'cameratargetz', -200,200).onChange(controls.updateCamtargetz);
    f1.open();


  // MouseControl
  var mouseControls = new THREE.TrackballControls(camera, renderer.domElement);
  mouseControls.staticMoving = true;
  mouseControls.dynamicDampingFactor = 0.3;

  // STATS
  stats = new Stats();
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    stats.domElement.style.zIndex = 100;
    document.body.appendChild( stats.domElement );

  // Render function
  function render() {

    if (controls.projection == 0){
      camera = perspectiveCamera;
    }
    else {
      camera = orthographicCamera;
    }
    camera.position.set(controls.camerax, controls.cameray, controls.cameraz);

    mouseControls.update();

    if (controls.camerax_prev != camera.position.x) {
		  controls.camerax = camera.position.x;
		  controls.camerax_prev = camera.position.x;
		  controlx.updateDisplay();
	  }
  	if (controls.cameray_prev != camera.position.y){
  		controls.cameray = camera.position.y;
  		controls.cameray_prev = camera.position.y;
  		controly.updateDisplay();
  	}
  	if (controls.cameraz_prev != camera.position.z){
  		controls.cameraz = camera.position.z;
  		controls.cameraz_prev = camera.position.z;
  		controlz.updateDisplay();
  	}
  	if (controls.cameratargetx_prev != cameraTarget.position.x){
  		controls.cameratargetx = cameraTarget.position.x;
  		controls.cameratargetx_prev = cameraTarget.position.x;
  		controltargetx.updateDisplay();
  	}
  	if (controls.cameray_prev != camera.position.y){
  		controls.cameray = camera.position.y;
  		controls.cameray_prev = camera.position.y;
  		controltargety.updateDisplay();
  	}
  	if (controls.cameraz_prev != camera.position.z){
  		controls.cameraz = camera.position.z;
  		controls.cameraz_prev = camera.position.z;
  		controltargetz.updateDisplay();
  	}
    requestAnimationFrame( render );

    camera.lookAt(cameraTarget.position); // scene.position

    stats.update();

    renderer.render( scene, camera );
  }

 render();

}
