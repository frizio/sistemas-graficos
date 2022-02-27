// File Skybox.js
 function draw_scene(){
	 // Init the stats
	 
	/*stats = new Stats();
	stats.setMode(0);
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	stats.domElement.style.zIndex = 100;
	document.body.appendChild( stats.domElement );*/
	
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
  
  var width = window.innerWidth || 2;
				var height = window.innerHeight || 2;

				var effect = new THREE.AnaglyphEffect( renderer );
				effect.setSize( width, height );
  
  
  
  
  var controls = new function(){
	  this.visibleamb = true;
	  this.coloramb = 0xffffff;
	  this.camerax = -60;
	  this.cameray = 0;
	  this.cameraz = 25;
		this.camerax_prev = -60;
		this.cameray_prev = 0;
		this.cameraz_prev = 25;
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
         ambientLicht.color.setHex(e);
	  }
	  this.visibleAmbient = function (e){
		  ambientLicht.visible = e;
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
   

 				
  
  
  var geometry = new THREE.BoxGeometry (1000, 1000, 1000);
  
  //var geometry2 = new THREE.SphereGeometry(20,30,30);
  var geometry2 = new THREE.CylinderGeometry(0, 20, 40, 4, 1, false);
  //var geometry2 = new THREE.BoxGeometry (10, 10, 10);
   
 
  var matcubo = new THREE.MeshPhongMaterial({ color: 0xffffff, envMap: textureCube } ); 
 
  
  var cubo = new THREE.Mesh( geometry, material ); 
  var cubo2 = new THREE.Mesh( geometry2, matcubo ); 
  scene.add( cubo );
  scene.add(cubo2);
  
  
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
  
 
  
  var ambientLicht = new THREE.AmbientLight(controls.coloramb);
  scene.add(ambientLicht);
  
  
 
 
  camera.position.set(controls.camerax,controls.cameray,controls.cameraz);
  
  
  
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
  //stats.update();
  camera.lookAt(cameraTarget.position);
  effect.render( scene, camera );
  //renderer.render( scene, camera ); 
  } 
  
  render();
  }