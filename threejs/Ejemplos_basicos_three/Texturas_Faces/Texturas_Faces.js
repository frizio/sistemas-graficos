// File Texturas_Faces.js

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

  // Create the controller to move camera with mouse
  var mouseControls = new THREE.TrackballControls(camera, renderer.domElement);
    mouseControls.staticMoving = true;
    mouseControls.dynamicDampingFactor = 0.3;

  // Initialization of GUI variables
  var controls = new function() {
	  this.visibleamb = true;
	  this.coloramb = 0xffffff;
	  this.camerax = 40;
	  this.cameray = 0;
	  this.cameraz = 0;
		this.camerax_prev = 40;
		this.cameray_prev = 0;
		this.cameraz_prev = 0;
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
	  this.updateLightambcolor = function (e) {
      ambientLight.color.setHex(e);
	  }
	  this.visibleAmbient = function (e){
		  ambientLight.visible = e;
	  }
  }

  // Textures for faces cube
  // my
  var urls = ["faces1.jpg", "faces2.jpg", "faces3.jpg", "faces4.jpg", "faces5.jpg", "faces6.jpg"];

  // Textures for skycube with starmap background
  var urls2 = ["starsmap.png", "starsmap.png", "starsmap.png", "starsmap.png", "starsmap.png", "starsmap.png"];

  var textureCube2 = THREE.ImageUtils.loadTextureCube( urls2 );

  // Material for skycube
  var shader = THREE.ShaderLib[ "cube" ];
  shader.uniforms[ "tCube" ].value = textureCube2;

  var material = new THREE.ShaderMaterial( {
					fragmentShader: shader.fragmentShader,
					vertexShader: shader.vertexShader,
					uniforms: shader.uniforms,
					depthWrite: false,
					side: THREE.BackSide
				} );

  // Individual materials for faces of small cube. Each cube face contains a human face.
  var material1 = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('faces1.jpg') } );
  var material2 = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('faces2.jpg') } );
  var material3 = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('faces3.jpg') } );
  var material4 = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('faces4.jpg') } );
  var material5 = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('faces5.jpg') } );
  var material6 = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('faces6.jpg') } );

  var materials = [material1, material2, material3, material4, material5, material6];

  var meshFaceMaterial = new THREE.MeshFaceMaterial( materials );

   // Big Cube for starmap background
  var geometry = new THREE.BoxGeometry (1000, 1000, 1000);

  // Small cube for faces
  var geometry2 = new THREE.BoxGeometry (20, 20, 20);

  // Create cubes, and add them to scene
  var cubo = new THREE.Mesh( geometry, material );
  var cubo2 = new THREE.Mesh( geometry2, meshFaceMaterial );
  scene.add(cubo);
  scene.add(cubo2);

  // Small red sphere locating point to look at from camera
  var cameraTarget = new THREE.Mesh( new THREE.SphereGeometry(2), new THREE.MeshBasicMaterial( { color: 0xff0000 } ));
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

    var f6 = gui.addFolder('Ambient Light');
      f6.addColor(controls, 'coloramb').onChange(controls.updateLightambcolor);
      f6.add(controls, 'visibleamb').onChange(controls.visibleAmbient);
      f6.open();

  var ambientLight = new THREE.AmbientLight(controls.coloramb);
  scene.add(ambientLight);

  camera.position.set(controls.camerax,controls.cameray,controls.cameraz);

  function render() {

    mouseControls.update();

    // Feedback of GUI with camera position set by TrackballControls
    if (controls.camerax_prev != camera.position.x){
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
  	if (controls.cameraz_prev != camera.position.z) {
  		controls.cameraz = camera.position.z;
  		controls.cameraz_prev = camera.position.z;
  		controltargetz.updateDisplay();
    }

    // Animation loop
    requestAnimationFrame( render );
    camera.lookAt(cameraTarget.position);
    renderer.render( scene, camera );

  } // end render()

  render();

} // end draw_scene()
