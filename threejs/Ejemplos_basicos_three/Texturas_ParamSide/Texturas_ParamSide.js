// File Texturas_ParamSide.js

 function draw_scene() {

  //Create the Three.js WebGL renderer
  var renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  renderer.setClearColor(0xEEEEEE);

  // Create the Three.js scene
  var scene = new THREE.Scene();


  // Create a camera and set it into world space
  // This camera will provide a perspective projection
  // Arguments are (fov, aspect, near_plane, far_plane)
  var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 3000);


  var axes = new THREE.AxisHelper( 500 );
  scene.add(axes);


  var mouseControls = new THREE.TrackballControls(camera, renderer.domElement);
  mouseControls.staticMoving = true;
  mouseControls.dynamicDampingFactor = 0.3;


  var controls = new function() {

	  this.camerax = 20;
	  this.cameray = 20;
	  this.cameraz = 20;

		this.camerax_prev = 20;
		this.cameray_prev = 20;
		this.cameraz_prev = 20;

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

  /////////////
  // TEXTURE //
  /////////////
  // Loading the texture
  var mapUrl = "UV_Grid_Sm.jpg";
  var maptext = THREE.ImageUtils.loadTexture(mapUrl);

  // This defines how the texture is wrapped HORIZONTALLY and corresponds to U in UV mapping.
  // The default is THREE.ClampToEdgeWrapping, where the edge is clamped to the outer edge texels.
  // The other two choices are THREE.RepeatWrapping and THREE.MirroredRepeatWrapping
  //maptext.wrapS = THREE.ClampToEdgeWrapping;
  //maptext.wrapS = THREE.RepeatWrapping;
  maptext.wrapS = THREE.MirroredRepeatWrapping;

  // This defines how the texture is wrapped VERTICALLY and corresponds to V in UV mapping.
  //maptext.wrapT = THREE.RepeatWrapping;
  maptext.wrapT = THREE.MirroredRepeatWrapping;

  //maptext.repeat.set( 1, 1 );
  maptext.repeat.set( 3, 3 );

  //var geometry2 = new THREE.SphereGeometry(20,30,30);
  var geometry2 = new THREE.BoxGeometry (20, 20, 20);

  var matcubo = new THREE.MeshBasicMaterial( { map: maptext } );

  //matcubo.side = THREE.BackSide;
  //matcubo.side = THREE.DoubleSide;

  var cubo2 = new THREE.Mesh( geometry2, matcubo );
  scene.add(cubo2);

  // Rescalado per vedere interno cubo speculare
  //cubo2.scale.x = -1


  var cameraTarget = new THREE.Mesh( new THREE.SphereGeometry(2),
                                     new THREE.MeshBasicMaterial( { color: 0xff0000 } ));
  scene.add(cameraTarget);


  var gui = new dat.GUI();
    var f5 = gui.addFolder('Camera');
    var controlx = f5.add(controls, 'camerax', -200,200).onChange(controls.updateCamx);
    var controly = f5.add(controls, 'cameray', -200,200).onChange(controls.updateCamy);
    var controlz = f5.add(controls, 'cameraz', -200,200).onChange(controls.updateCamz);
    var controltargetx = f5.add(controls, 'cameratargetx', -200,200).onChange(controls.updateCamtargetx);
    var controltargety = f5.add(controls, 'cameratargety', -200,200).onChange(controls.updateCamtargety);
    var controltargetz = f5.add(controls, 'cameratargetz', -200,200).onChange(controls.updateCamtargetz);
    f5.open();

  // Set camera position (here!!!!!!)
  camera.position.set(controls.camerax, controls.cameray, controls.cameraz);

  function render() {

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

    camera.lookAt(cameraTarget.position);
    renderer.render( scene, camera );

  }

  render();

}
