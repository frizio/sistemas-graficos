// File 4.js
 function draw_scene(){
	 // Init the stats
	 
	stats = new Stats();
	stats.setMode(0);
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	stats.domElement.style.zIndex = 100;
	document.body.appendChild( stats.domElement );
	
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

  
  
  var mouseControls = new THREE.TrackballControls(camera, renderer.domElement);
  mouseControls.staticMoving = true;
  mouseControls.dynamicDampingFactor = 0.3;
  
  
  var controls = new function(){
	 
	  this.camerax = 350;
	  this.cameray = 250;
	  this.cameraz = -350;
		this.camerax_prev = 350;
		this.cameray_prev = 250;
		this.cameraz_prev = -350;
	  
	 
	  this.updateCamx = function (e){
	    camera.position.x = e;
		camera.lookAt(cubo.position);
	  }
	  this.updateCamy = function (e){
	    camera.position.y = e;
		camera.lookAt(cubo.position);
	  }
	  this.updateCamz = function (e){
	    camera.position.z = e;
		camera.lookAt(cubo.position);
	  }
	
    }
  
    
  
  var urls = ["nievepx.jpg", "nievenx.jpg", "nievepy.jpg", "nieveny.jpg", "nievepz.jpg", "nievenz.jpg"];
  //var urls = ["pisapx.png", "pisanx.png", "pisapy.png", "pisany.png", "pisapz.png", "pisanz.png"];
  var textureCube = THREE.ImageUtils.loadTextureCube( urls );
  var shader = THREE.ShaderLib[ "cube" ];
  shader.uniforms[ "tCube" ].value = textureCube;

  var material = new THREE.ShaderMaterial( {
					fragmentShader: shader.fragmentShader,
					vertexShader: shader.vertexShader,
					uniforms: shader.uniforms,
					depthWrite: false,
					side: THREE.BackSide
				} );

   skycube = new THREE.Mesh( new THREE.BoxGeometry( 1500, 1500, 1500 ), material );
				
   scene.add( skycube );
				
  
  var geometry = new THREE.CylinderGeometry(0, 200, 400, 4, 1, false);
  //var geometry = new THREE.BoxGeometry (50, 50, 50);
  var matcubo = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: textureCube } );
  cubo = new THREE.Mesh(geometry, matcubo);
  scene.add(cubo);

  
  var gui = new dat.GUI();
 
  
  var f5 = gui.addFolder('Camera');
  var controlx =  f5.add(controls, 'camerax', -2000,2000).onChange(controls.updateCamx);
  var controly = f5.add(controls, 'cameray', -2000,2000).onChange(controls.updateCamy);
  var controlz = f5.add(controls, 'cameraz', -2000,2000).onChange(controls.updateCamz);
  
  
 
 
  camera.position.set(controls.camerax,controls.cameray,controls.cameraz);
  
  
  camera.lookAt(cubo.position);
  
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