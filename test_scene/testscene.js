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
  var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 2000);


  // dat.GUI VARIABLES
  var controls = new function() {

    // f1 camera position and target
	  this.camerax = 200;
	  this.cameray = 200;
	  this.cameraz = 300;

		this.camerax_prev = 200;
		this.cameray_prev = 200;
		this.cameraz_prev = 300;

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

    this.wireframe = true;

  }


  // Object GEOMETRY
  //var geometry = new THREE.BoxGeometry( 200, 400, 200, 10, 10, 10); // tower
  //var geometry = new THREE.BoxGeometry( 200, 200, 200, 10, 10, 10); // cube
  var geometry = new THREE.SphereGeometry( 200, 32, 32); // cube

  // Object MATERIAL
  //var material = new THREE.MeshBasicMaterial( {color: 0x878787 } );
  //var material = new THREE.MeshLambertMaterial( {color: 0x878787 } );
  var material = new THREE.MeshPhongMaterial( {color: 0x878787 } );

  // OBJECT = geometry + material
  var box = new THREE.Mesh(geometry, material);
  box.position.set(0, 100, 0);
  scene.add(box);

  // LIGHT
  var ambientLight = new THREE.AmbientLight(controls.coloramb);
    scene.add(ambientLight);


  // Camera target object
  var cameraTarget = new THREE.Mesh( new THREE.SphereGeometry(2, 8, 8),
                                     new THREE.MeshBasicMaterial( { color: 0xff00ff } ));
    scene.add(cameraTarget);

  // HELPERS
  var axisHelper = new THREE.AxisHelper( 1000 );
  scene.add(axisHelper);

  var gridHelper = new THREE.GridHelper( 500, 50, 0x444444, 0x888888 );
  scene.add( gridHelper );

  // CONTROLS
  // dat.GUI controls
  var gui = new dat.GUI();
    var f1 = gui.addFolder('Camera: position and target');
    var controlx = f1.add(controls, 'camerax', -400,400).onChange(controls.updateCamx);
    var controly = f1.add(controls, 'cameray', -400,400).onChange(controls.updateCamy);
    var controlz = f1.add(controls, 'cameraz', -400,400).onChange(controls.updateCamz);
    var controltargetx = f1.add(controls, 'cameratargetx', -400,400).onChange(controls.updateCamtargetx);
    var controltargety = f1.add(controls, 'cameratargety', -400,400).onChange(controls.updateCamtargety);
    var controltargetz = f1.add(controls, 'cameratargetz', -400,400).onChange(controls.updateCamtargetz);
    f1.open();
    var f2 = gui.addFolder('Show Mesh (Grid | Malla | Maglia)');
    f2.add(controls, 'wireframe').onChange(render);
    f2.open();

  // Mouse trackball camera controls
  var mouseControls = new THREE.TrackballControls(camera, renderer.domElement);
    mouseControls.staticMoving = true;
    mouseControls.dynamicDampingFactor = 0.3;

  // STATISTICS
  stats = new Stats();
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    stats.domElement.style.zIndex = 100;
    document.body.appendChild( stats.domElement );

  // CAMERA SETTINGS (1)
  camera.position.set(controls.camerax, controls.cameray, controls.cameraz);

  // Render function
  function render() {

    mouseControls.update();

    // Feedback of GUI with camera position set by TrackballControls
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

    material.wireframe = controls.wireframe;

    box.rotation.y += 0.005;

    // CAMERA SETTINGS (2)
    camera.lookAt(cameraTarget.position); // scene.position

    stats.update();

    renderer.render( scene, camera );
  }

 render();

}
