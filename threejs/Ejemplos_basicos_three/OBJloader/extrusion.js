// File extrusion.js
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
  renderer.shadowMapEnabled = false;
  
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

  var controls = new function(){
	  this.lightx = 300;
	  this.lighty = 105;
	  this.lightz = 200;
	  this.light3x = 0;
	  this.light3y = 50;
	  this.light3z = 200;
	  this.light2x = 200;
	  this.light2y = 50;
	  this.light2z = 0;
	  this.visible1 = true;
	  this.visible2 = true;
	  this.visible3 = true;
	  this.visibleamb = true;
	  this.color1 = 0xffffff;
	  this.color2 = 0xffffff;
	  this.color3 = 0xffffff;
	  this.camerax = 200;
	  this.cameray = 200;
	  this.cameraz = 400;
	  
	  this.updateLight1x = function (e) {               
         light.position.x = e;
         wholeobject.colorsNeedUpdate = true;		 
	  }
	  this.updateLight1y = function (e) {               
         light.position.y = e;
         wholeobject.colorsNeedUpdate = true;		 
	  }
	  this.updateLight1z = function (e) {               
         light.position.z = e;
         wholeobject.colorsNeedUpdate = true;		 
	  }
	  this.updateLight1color = function (e) {               
         light.color.setHex(e);
	  } 
	  this.visibleLight1 = function (e) {
	    light.visible = e;	
	  }
	  
	  this.updateLight2x = function (e) {               
         light2.position.x = e;
         wholeobject.colorsNeedUpdate = true;		 
	  }
	  this.updateLight2y = function (e) {               
         light2.position.y = e;
         wholeobject.colorsNeedUpdate = true;		 
	  }
	  this.updateLight2z = function (e) {               
         light2.position.z = e;
         wholeobject.colorsNeedUpdate = true;		 
	  }
	  this.updateLight2color = function (e) {               
         light2.color.setHex(e);
	  } 
	  this.visibleLight2 = function (e) {
	    light2.visible = e;	
	  }
	  
	  this.updateLight3x = function (e) {               
         light3.position.x = e;
         wholeobject.colorsNeedUpdate = true;		 
	  }
	  this.updateLight3y = function (e) {               
         light3.position.y = e;
         wholeobject.colorsNeedUpdate = true;		 
	  }
	  this.updateLight3z = function (e) {               
         light3.position.z = e;
         wholeobject.colorsNeedUpdate = true;		 
	  }
	  this.updateLight3color = function (e) {               
         light3.color.setHex(e);
	  } 
	  this.visibleLight3 = function (e) {
	    light3.visible = e;	
	  }
	  this.updateCamx = function (e){
	    camera.position.x = e;
		camera.lookAt(scene.position);
	  }
	  this.updateCamy = function (e){
	    camera.position.y = e;
		camera.lookAt(scene.position);
	  }
	  this.updateCamz = function (e){
	    camera.position.z = e;
		camera.lookAt(scene.position);
	  }	  
    }
  

   
    var wholeobject;
    var plano, cubo;
	var matcube = new THREE.MeshPhongMaterial({color: 0xff0000});
	var matmesa = new THREE.MeshPhongMaterial({color: 0x00ff00});
    var loader = new THREE.OBJMTLLoader();
	
	loader.load( 'extrusion.obj', 'extrusion.mtl', function ( object ) {				
					wholeobject = object;
					wholeobject.position.y = 10;
					wholeobject.scale.set(40,40,40);
					scene.add( wholeobject );				
					});
  
  var gui = new dat.GUI();
  var f1 = gui.addFolder('Dir Light');
  f1.add(controls, 'lightx', -400,600).onChange(controls.updateLight1x);
  f1.add(controls, 'lighty', -400,600).onChange(controls.updateLight1y);
  f1.add(controls, 'lightz', -400,600).onChange(controls.updateLight1z);
  f1.addColor(controls, 'color1').onChange(controls.updateLight1color);
  f1.add(controls, 'visible1').onChange(controls.visibleLight1);
  
  var f2 = gui.addFolder('Point Light green');
  f2.add(controls, 'light3x', -400,400).onChange(controls.updateLight2x);
  f2.add(controls, 'light3y', -400,400).onChange(controls.updateLight2y);
  f2.add(controls, 'light3z', -400,400).onChange(controls.updateLight2z);
  f2.addColor(controls, 'color2').onChange(controls.updateLight2color);
  f2.add(controls, 'visible2').onChange(controls.visibleLight2);
  
  var f3 = gui.addFolder('Point Light red');
  f3.add(controls, 'light2x', -400,400).onChange(controls.updateLight3x);
  f3.add(controls, 'light2y', -400,400).onChange(controls.updateLight3y);
  f3.add(controls, 'light2z', -400,400).onChange(controls.updateLight3z);
  f3.addColor(controls, 'color3').onChange(controls.updateLight3color);
  f3.add(controls, 'visible3').onChange(controls.visibleLight3);
  
  
  var f5 = gui.addFolder('Camera');
  f5.add(controls, 'camerax', -800,800).onChange(controls.updateCamx);
  f5.add(controls, 'cameray', -800,800).onChange(controls.updateCamy);
  f5.add(controls, 'cameraz', -800,800).onChange(controls.updateCamz);
  
  
 var light = new THREE.DirectionalLight(controls.color1, 1);
  light.position.set(controls.lightx, controls.lighty, controls.lightz);
  scene.add(light);
  
  var light3 = new THREE.PointLight(controls.color3, 1);
  light3.position.set(controls.light3x, controls.light3y, controls.light3z);
  scene.add(light3);
  
    
  var light2 = new THREE.PointLight(controls.color2, 1);
  light2.position.set(controls.light2x, controls.light2y, controls.light2z);
  scene.add(light2);
  
  
  
  
  
 
  camera.position.set(controls.camerax,controls.cameray,controls.cameraz);
  
  
  camera.lookAt(scene.position);
  
  function render() { 
   mouseControls.update();
  requestAnimationFrame( render );
  stats.update();
  //wholeobject.rotation.x += 0.01;
  renderer.render( scene, camera ); 
  } 
  
  render();
  }