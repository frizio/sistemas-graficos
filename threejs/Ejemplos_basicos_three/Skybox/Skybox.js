// File 4.js

 function draw_scene(){

  //Create the Three.js WebGL renderer
  var renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    renderer.setClearColor(0xEEEEEE);

  // Create the Three.js scene
  var scene = new THREE.Scene();

  // Create a camera and set it into world space
  // Arguments are (fov, aspect, near_plane, far_plane)
  var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 3000);

  // dat.GUI variables
  var controls = new function() {

	  this.camerax = 500;  // 350;
	  this.cameray = 500;  //250;
	  this.cameraz = 500;  //-350;

		this.camerax_prev = 500;  //350;
		this.cameray_prev = 500;  //250;
		this.cameraz_prev = 500;  //-350;

	  this.updateCamx = function (e){
	    camera.position.x = e;
		  camera.lookAt(innerObject.position);
	  }
	  this.updateCamy = function (e){
	    camera.position.y = e;
		  camera.lookAt(innerObject.position);
	  }
	  this.updateCamz = function (e){
	    camera.position.z = e;
		camera.lookAt(innerObject.position);
	  }

  }

  // TEXTURE(s)

  //var urls = ["pisapx.png", "pisanx.png", "pisapy.png", "pisany.png", "pisapz.png", "pisanz.png"];
  //var urls = ["nievepx.jpg", "nievenx.jpg", "nievepy.jpg", "nieveny.jpg", "nievepz.jpg", "nievenz.jpg"];
  var urls = ["nissi/posx.jpg", "nissi/negx.jpg", "nissi/posy.jpg", "nissi/negy.jpg", "nissi/posz.jpg", "nissi/negz.jpg"];

  var textureCube = THREE.ImageUtils.loadTextureCube( urls );

  var shader = THREE.ShaderLib[ "cube" ];
  shader.uniforms[ "tCube" ].value = textureCube;

  var skycubeMaterial = new THREE.ShaderMaterial( {
					fragmentShader: shader.fragmentShader,
					vertexShader: shader.vertexShader,
					uniforms: shader.uniforms,
					depthWrite: false,
					side: THREE.BackSide
				} );

  //var skycubeGeometry = new THREE.BoxGeometry( 1500, 1500, 1500 );
  var skycubeGeometry = new THREE.SphereGeometry(1500, 32, 32);

  var skycube = new THREE.Mesh(skycubeGeometry, skycubeMaterial );
  scene.add( skycube );


  //var innerObjectGeometry = new THREE.CylinderGeometry(0, 200, 400, 4, 1, false);
  //var innerObjectGeometry = new THREE.BoxGeometry (200, 200, 200);
  var innerObjectGeometry = new THREE.SphereGeometry(200, 32, 32);

  //var innerObjectMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: textureCube } );
  var innerObjectMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff,
    envMap: THREE.ImageUtils.loadTextureCube(
      ["nievepx.jpg", "nievenx.jpg", "nievepy.jpg", "nieveny.jpg", "nievepz.jpg", "nievenz.jpg"] ) } );

  var innerObject = new THREE.Mesh(innerObjectGeometry, innerObjectMaterial);
  scene.add(innerObject);

  // Helpers
  var axisHelper = new THREE.AxisHelper( 1000 );
    scene.add(axisHelper);

  // Controls
  // dat.GUI controls
  var gui = new dat.GUI();
    var f5 = gui.addFolder('Camera');
    var controlx =  f5.add(controls, 'camerax', -2000,2000).onChange(controls.updateCamx);
    var controly = f5.add(controls, 'cameray', -2000,2000).onChange(controls.updateCamy);
    var controlz = f5.add(controls, 'cameraz', -2000,2000).onChange(controls.updateCamz);

  // Mouse trackback control
  var mouseControls = new THREE.TrackballControls(camera, renderer.domElement);
    mouseControls.staticMoving = true;
    mouseControls.dynamicDampingFactor = 0.3;

  // Statistics
	stats = new Stats();
  	stats.setMode(0);
  	stats.domElement.style.position = 'absolute';
  	stats.domElement.style.top = '0px';
  	stats.domElement.style.zIndex = 100;
  	document.body.appendChild( stats.domElement );

  // Camera settings (*)
  camera.position.set(controls.camerax,controls.cameray,controls.cameraz);
  camera.lookAt(innerObject.position);


  function render() {

    mouseControls.update();

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

    requestAnimationFrame( render );

    stats.update();

    renderer.render( scene, camera );
  }

  render();

}
