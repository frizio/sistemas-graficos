 // File 2.js
 function draw_scene(){
	
 //Create the Three.js WebGL renderer
  
  var renderer = new THREE.WebGLRenderer();
  renderer.setSize( 1024, 768 ); 
  document.body.appendChild( renderer.domElement );
  renderer.setClearColor(0xEEEEEE);
  
  // Create the Three.js scene
  var scene = new THREE.Scene();
  
  // Create a camera and set it into world space
  // This camera will provide a perspective projection
  // Arguments are (fov, aspect, near_plane, far_plane)
  
  var camera = new THREE.PerspectiveCamera(75, 1024/768, 0.1, 1000);

  var axes = new THREE.AxisHelper( 500 );
  scene.add(axes);  
  
  var controls = new function(){
	  this.camerax = 200;
	  this.cameray = 200;
	  this.cameraz = 400;
	  this.color0 = 0xff0000;
	  this.color1 = 0x00ff00;
	  this.color2 = 0x0000ff;
    this.wireframe = false;
  }
  
  var geometry = new THREE.BoxGeometry( 200, 200, 200 );
  var material = new THREE.MeshBasicMaterial( {color: controls.color0} );
    
  var caja = new THREE.Mesh(geometry, material);
  scene.add(caja);
 
  
  
  var gui = new dat.GUI();
  var f1 = gui.addFolder('Camera');
  f1.add(controls, 'camerax', -900,900).onChange(render);
  f1.add(controls, 'cameray', -900,900).onChange(render);
  f1.add(controls, 'cameraz', -900,900).onChange(render);
  
  var f2 = gui.addFolder('Colors');
  f2.addColor(controls, 'color0').onChange(render);
  f2.add(controls, 'wireframe').onChange(render);
  
  
  f1.open();
  f2.open();
  
  function render() { 
    
	  material.color = new THREE.Color(controls.color0);
    material.wireframe = controls.wireframe;
    camera.position.set(controls.camerax, controls.cameray, controls.cameraz);
    camera.lookAt(scene.position);
	
	
    renderer.render( scene, camera );
  } 
  render();
  }
 
 