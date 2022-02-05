// File texture_video.js
// Author: Maurizio La Rocca

function draw_scene() {

  // CANVAS
  var renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth-20, window.innerHeight-20 );
    document.body.appendChild( renderer.domElement );
    renderer.setClearColor(0xEEEEEE);


  // SCENE
  var scene = new THREE.Scene();


  // CAMERA (PERSPECTIVE projection)
  var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 2500);


  // dat.GUI VARIABLES
  var controls = new function() {
	  this.visibleamb = true;
	  this.coloramb = 0xffffff;
	  this.camerax = 200;
	  this.cameray = 200;
	  this.cameraz = 250;
		this.camerax_prev = 200;
		this.cameray_prev = 200;
		this.cameraz_prev = 250;
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


  // SKYCUBE

  // Textures for skycube with starmap background
  //var urls = ["starsmap.png", "starsmap.png", "starsmap.png", "starsmap.png", "starsmap.png", "starsmap.png"];
  var urls = ["nissi/posx.jpg", "nissi/negx.jpg", "nissi/posy.jpg", "nissi/negy.jpg", "nissi/posz.jpg", "nissi/negz.jpg"];
  var textureSkycube = THREE.ImageUtils.loadTextureCube( urls );

  // Material for skycube
  var shader = THREE.ShaderLib[ "cube" ];
  shader.uniforms[ "tCube" ].value = textureSkycube;

  var material = new THREE.ShaderMaterial( {
					fragmentShader: shader.fragmentShader,
					vertexShader: shader.vertexShader,
					uniforms: shader.uniforms,
					depthWrite: false,
					side: THREE.BackSide
				} );

  // Geometry: Big Cube for starmap background
  //var skycubeGeometry = new THREE.BoxGeometry (1000, 1000, 1000);
  var skycubeGeometry = new THREE.SphereGeometry(1000, 32, 32);

  // Skycube Mesh object
  var skycube = new THREE.Mesh( skycubeGeometry, material );
    scene.add(skycube);


  // VIDEO
  // html5 video element
  var video = document.createElement('video');
      //video.src = "poi_test.ogv";
      video.src = "sintel.ogv";
      video.load();
      video.play();
      video.loop = true;
      video.muted = false;

  //make your video canvas
  var videocanvas = document.createElement('canvas');
  var videocanvascontext = videocanvas.getContext('2d');
  //set its size
  videocanvas.width = 480;  //640
  videocanvas.height = 204;
  //draw a black rectangle so that your spheres don't start out transparent
  videocanvascontext.fillStyle = "#ff0000";
  videocanvascontext.fillRect(0, 0, 204, 480);


  //add canvas to new texture
  var videoTexture = new THREE.Texture(videocanvas);
    videoTexture.wrapS = THREE.ClampToEdgeWrapping;
    videoTexture.wrapT = THREE.ClampToEdgeWrapping;
    videoTexture.repeat.set( 1, 1 );

  // FACES

  var geometry1 = new THREE.PlaneGeometry( 200, 100, 8, 8 );
  var geometry2 = new THREE.PlaneGeometry( 200, 100, 8, 8 );
  geometry2.applyMatrix( new THREE.Matrix4().makeRotationY( Math.PI ) );
  geometry1.verticesNeedUpdate = true;
  geometry2.verticesNeedUpdate = true;
  geometry1.computeFaceNormals();
  geometry2.computeFaceNormals();

  // Textures for faces cube
  //var facesUrls = ["faces1.jpg", "faces2.jpg", "faces3.jpg", "faces4.jpg", "faces5.jpg", "faces6.jpg"];
  var facesUrls = ["faces3.jpg", "faces6.jpg"];
  // Material for facecube.
  /*
  var facesTextures = [THREE.ImageUtils.loadTexture(facesUrls[0]),
                      THREE.ImageUtils.loadTexture(facesUrls[1]),
                      THREE.ImageUtils.loadTexture(facesUrls[2]),
                      THREE.ImageUtils.loadTexture(facesUrls[3]),
                      THREE.ImageUtils.loadTexture(facesUrls[4]),
                      THREE.ImageUtils.loadTexture(facesUrls[5])];
  */
  var facesTextures = [THREE.ImageUtils.loadTexture(facesUrls[0]),
                      THREE.ImageUtils.loadTexture(facesUrls[1])];

  // Material
  var material1 = new THREE.MeshPhongMaterial( { color: 0xffffff, map: videoTexture, overdraw: 0.5 } );
  var material2 = new THREE.MeshPhongMaterial( { color: 0xffffff, map: facesTextures[0] } );


  // CARD (Group Object)
  card = new THREE.Object3D();
    card.position.set(50, 50, 0);
    scene.add( card );

    // Mesh
    mesh1 = new THREE.Mesh( geometry1, material1 );
    card.add( mesh1 );
    mesh2 = new THREE.Mesh( geometry2, material2 );
    card.add( mesh2 );


  // LIGHT(s)
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
    var f5 = gui.addFolder('Camera');
      var controlx = f5.add(controls, 'camerax', -500,500).onChange(controls.updateCamx);
      var controly = f5.add(controls, 'cameray', -500,500).onChange(controls.updateCamy);
      var controlz = f5.add(controls, 'cameraz', -500,500).onChange(controls.updateCamz);
      var controltargetx = f5.add(controls, 'cameratargetx', -500,500).onChange(controls.updateCamtargetx);
      var controltargety = f5.add(controls, 'cameratargety', -500,500).onChange(controls.updateCamtargety);
      var controltargetz = f5.add(controls, 'cameratargetz', -500,500).onChange(controls.updateCamtargetz);
      f5.open();
    var f6 = gui.addFolder('Ambient Light');
      f6.addColor(controls, 'coloramb').onChange(controls.updateLightambcolor);
      f6.add(controls, 'visibleamb').onChange(controls.visibleAmbient);
      f6.open();

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
  camera.position.set(controls.camerax,controls.cameray,controls.cameraz);

  var angle = 0;

  function render() {

    if(video.readyState === video.HAVE_ENOUGH_DATA){
      //draw video to canvas starting from upper left corner
      videocanvascontext.drawImage(video, 0, 0);
      //tell texture object it needs to be updated
      videoTexture.needsUpdate = true;
    }

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

    card.rotation.x += 0.02;
    card.rotation.y += 0.02;
    card.rotation.z += 0.02;

    angle += Math.PI/1000;
    card.position.x = 200 * Math.cos(angle);
    card.position.z = 200 * Math.sin(angle);

    // CAMERA SETTING (2)
    camera.lookAt(cameraTarget.position);

    stats.update();

    renderer.render( scene, camera );

    // Animation loop
    requestAnimationFrame( render );

  } // end render()

  render();

} // end draw_scene()
