 // File 3.js

function draw_scene(){

  // Create the Three.js WebGL renderer
  var renderer = new THREE.WebGLRenderer();
    renderer.setSize( 1024, 768 );
    document.body.appendChild( renderer.domElement );
    renderer.setClearColor(0xEEEEEE);


  // Create the Three.js scene
  var scene = new THREE.Scene();


  // Create a camera and set it into world space

  // Camera that uses PERSPECTIVE PROJECTION.
  var camera = new THREE.PerspectiveCamera(70, 1024/768, 0.1, 1200);
  // Arguments are (fov, aspect, near_plane, far_plane)

  // Camera will provide a ORTHOGRAPHIC PROJECTION.
  var camera2 = new THREE.OrthographicCamera(-1024/2 , 1024/2, 768/2, -768/2, 0.1, 1200);
  // Arguments are the camera frustum planes( left,     right, top,  bottom, near, far )


  // dat.GUI VARIABLES
	var controls = new function() {
	  this.camerax = 200;
	  this.cameray = 200;
	  this.cameraz = 600;
		this.camerax_prev = 200;
	  this.cameray_prev = 200;
	  this.cameraz_prev = 600;
	  this.colormesh = 0xff0000;
	  this.colorlight = 0xffffff;
	  this.color2 = 0x0000ff;
    this.poslight_x = 0;
    this.poslight_y = 200;
    this.poslight_z = 300;
    this.wireframe = false;
    this.cualcamera = 0;

		this.updateMat = function (e){
	    material.color = new THREE.Color(e);
			material.needsUpdate = true;
	  }
		this.updateLight = function (e){
	    light_point.color = new THREE.Color(e);
	  }
		this.updateCamx = function (e){
	    camera.position.x = e;
			camera2.position.x = e;
	  }
	  this.updateCamy = function (e){
	    camera.position.y = e;
			camera2.position.y = e;
	  }
	  this.updateCamz = function (e){
	    camera.position.z = e;
      camera2.position.z = e;
	  }

  }

  // GEOMETRY
  var geometry = new THREE.BoxGeometry( 40, 40, 40 );
  //geometry.computeFaceNormals();
  //geometry.computeVertexNormals();


  // MATERIAL
  var material = new THREE.MeshLambertMaterial( {color: controls.colormesh} );


  // MESH
	//var box = new THREE.Mesh(geometry, material);
  for (var i = -4; i < 5; i++){
    for (var j = -4; j < 5; j++) {
        var geom2 = geometry.clone();
        var mesh2 = new THREE.Mesh(geom2, material);
        mesh2.position.set(j*80, 0, i*80);
        scene.add(mesh2);
    }
  }

  // LIGHT(s)
  var light_point = new THREE.PointLight(controls.colorlight, 1);

    var sunMat = new THREE.MeshBasicMaterial({color: 'yellow'});
    var sunGeom = new THREE.SphereGeometry(10, 16, 8);
    sun = new THREE.Mesh(sunGeom, sunMat);
    sun.add(light_point);
    sun.position.set(controls.poslight_x, controls.poslight_y, controls.poslight_z);
    scene.add(sun);


  // HELPERS
  var axes = new THREE.AxisHelper( 500 );
    scene.add(axes);

  var gridHelper = new THREE.GridHelper( 500, 50, 0x444444, 0x888888 );
    scene.add( gridHelper );


  // CONTROLS
  // dat.GUI controls
  var gui = new dat.GUI();
    var f1 = gui.addFolder('Camera');
    var controlx = f1.add(controls, 'camerax', -900,900).onChange(controls.updateCamx);
    var controly = f1.add(controls, 'cameray', -900,900).onChange(controls.updateCamy);
    var controlz = f1.add(controls, 'cameraz', -900,900).onChange(controls.updateCamz);
    f1.add(controls, 'cualcamera', {Perspective: 0, Ortographic: 1});

    var f2 = gui.addFolder('Colors');
    f2.addColor(controls, 'colormesh').onChange(controls.updateMat);
    f2.addColor(controls, 'colorlight').onChange(controls.updateLight);;

    var f3 = gui.addFolder('Point Light position');
    f3.add(controls, 'poslight_x', -900,900);
    f3.add(controls, 'poslight_y', -900,900);
    f3.add(controls, 'poslight_z', -900,900);

    f1.open();
    f2.open();
    f3.open();

  // Mouse trackball camera controls
  var mouseControls = new THREE.TrackballControls(camera, renderer.domElement);
    mouseControls.staticMoving = true;
    mouseControls.dynamicDampingFactor = 0.3;

  var mouseControls2 = new THREE.TrackballControls(camera2, renderer.domElement);
    mouseControls.staticMoving = true;
    mouseControls.dynamicDampingFactor = 0.3;


  // CAMERA SETTINGS (1)
  camera.position.set(controls.camerax, controls.cameray, controls.cameraz);
	camera2.position.set(controls.camerax, controls.cameray, controls.cameraz);


  function render() {

    material.color = new THREE.Color(controls.colormesh);
    light_point.color = new THREE.Color(controls.colorlight);

    mouseControls.update();
    mouseControls2.update();

	  sun.position.set(controls.poslight_x, controls.poslight_y, controls.poslight_z);

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

    // CAMERA SETTINGS (2)
    if (controls.cualcamera == 0){
      camera.lookAt(scene.position);
      renderer.render( scene, camera );
    }
    else {
      camera2.lookAt(scene.position);
      renderer.render( scene, camera2 );
    }

    // Animation loop
		requestAnimationFrame( render );

  }

  render();

}
