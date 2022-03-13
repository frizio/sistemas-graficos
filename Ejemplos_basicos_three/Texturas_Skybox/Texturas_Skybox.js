// File Texturas_Skybox.js

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
  var controls = new function(){
	  this.visibleamb = true;
	  this.coloramb = 0xffffff;
	  this.bumpscale = 0.2;
	  this.camerax = -50;
	  this.cameray = 20;
	  this.cameraz = 20;
		this.camerax_prev = -50;
		this.cameray_prev = 20;
		this.cameraz_prev = 20;
    this.cameratargetx = 0;
	  this.cameratargety = 0;
	  this.cameratargetz = 0;
		this.cameratargetx_prev = 0;
	  this.cameratargety_prev = 0;
	  this.cameratargetz_prev = 0;

	  this.updateBump = function (e) {
	   cubo2.material.normalScale.set(e,e);
	   //cube.material.bumpScale = e;
	   //cube.geometry.computeFaceNormals();
     //cube.geometry.computeVertexNormals();
	  }
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
         ambientLicht.color.setHex(e);
	  }
	  this.visibleAmbient = function (e){
		  ambientLicht.visible = e;
	  }
  }

  var urls = ["UV_Grid_Sm.jpg", "UV_Grid_Sm.jpg", "UV_Grid_Sm.jpg", "UV_Grid_Sm.jpg", "UV_Grid_Sm.jpg", "UV_Grid_Sm.jpg"];

	// This version of textureCube provides specular reflection on surface of inner object.
  var textureCube = THREE.ImageUtils.loadTextureCube( urls );

  // Alternative version of textureCube to get transparent refractive inner object
  //var textureCube = THREE.ImageUtils.loadTextureCube( urls, THREE.CubeRefractionMapping );

	// Material for skycube.
  var shader = THREE.ShaderLib[ "cube" ];
  shader.uniforms[ "tCube" ].value = textureCube;

  var material = new THREE.ShaderMaterial(
        {
					fragmentShader: shader.fragmentShader,
					vertexShader: shader.vertexShader,
					uniforms: shader.uniforms,
					depthWrite: false,
					side: THREE.BackSide
				} );

  // Geometry for the skycube (big box surrounding the scene)
  var geometry = new THREE.BoxGeometry (1000, 1000, 1000);

  // Geometries for the reflective or refractive object within the skycube. Can be a cube or a sphere
  //var geometry2 = new THREE.SphereGeometry(10,30,30);
  var geometry2 = new THREE.BoxGeometry (10, 10, 10);


  // Uncomment the following two lines to load a normals map,
  // which lends a brick-like aspect to the inner object's surface
  //var mapUrl = "wotig-normal.png";
  //var map = THREE.ImageUtils.loadTexture(mapUrl);

  // Basic material can be used if no normal map is to be loaded
  //var matcubo = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: textureCube } );

  // Basic material to be used if we want a refractive object, instead of specular reflections
  // var matcubo = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: textureCube, refractionRatio: 0.8 } );

  // Phong material must be used if we want to use the normal map
  var matcubo = new THREE.MeshPhongMaterial({ color: 0xffffff, envMap: textureCube } );

  // Phong material to be used for refractive material
  //var matcubo = new THREE.MeshPhongMaterial({ color: 0xffffff, envMap: textureCube, refractionRatio: 0.8  } );

  // Uncomment to use the normal map previously loaded
  // matcubo.normalMap = map;

  // Skycube and inner object are created and added to the scene
  var cubo = new THREE.Mesh( geometry, material );
  var cubo2 = new THREE.Mesh( geometry2, matcubo );
  scene.add( cubo );
  scene.add(cubo2);

  // Small red sphere used to locate the point to which the camera will look at.
  var cameraTarget = new THREE.Mesh( new THREE.SphereGeometry(2), new THREE.MeshBasicMaterial( { color: 0xff0000 } ));
  scene.add(cameraTarget);

  var gui = new dat.GUI();

  //var f4 = gui.addFolder('BumpScale');
  //  f4.add(controls, 'bumpscale', -4, 4).onChange(controls.updateBump);

  var f4 = gui.addFolder('NormalScale');
    f4.add(controls, 'bumpscale', -4, 4).onChange(controls.updateBump);

  var f5 = gui.addFolder('Camera');
    var controlx = f5.add(controls, 'camerax', -200,200).onChange(controls.updateCamx);
    var controly = f5.add(controls, 'cameray', -200,200).onChange(controls.updateCamy);
    var controlz = f5.add(controls, 'cameraz', -200,200).onChange(controls.updateCamz);
    var controltargetx = f5.add(controls, 'cameratargetx', -1100,1100).onChange(controls.updateCamtargetx);
    var controltargety = f5.add(controls, 'cameratargety', -1100,1100).onChange(controls.updateCamtargety);
    var controltargetz = f5.add(controls, 'cameratargetz', -1100,1100).onChange(controls.updateCamtargetz);
    f5.open();

  var f6 = gui.addFolder('Ambient Light');
    f6.addColor(controls, 'coloramb').onChange(controls.updateLightambcolor);
    f6.add(controls, 'visibleamb').onChange(controls.visibleAmbient);
    f6.open();

  var ambientLicht = new THREE.AmbientLight(controls.coloramb);
  scene.add(ambientLicht);

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
  	if (controls.cameraz_prev != camera.position.z){
  		controls.cameraz = camera.position.z;
  		controls.cameraz_prev = camera.position.z;
  		controltargetz.updateDisplay();
  	}

    // Animation loop
    requestAnimationFrame( render );
    camera.lookAt(cameraTarget.position);
    renderer.render( scene, camera );
  }

  render();

}
