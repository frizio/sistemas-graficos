 // File 4.js
 function draw_scene(){
	
 //Create the Three.js WebGL renderer
  
  var renderer = new THREE.WebGLRenderer();
  renderer.setSize( 800, 800 ); 
  document.body.appendChild( renderer.domElement );
  renderer.setClearColor(0xEEEEEE);
  
  // Create the Three.js scene
  var scene = new THREE.Scene();
  
  // Create a camera and set it into world space
  // This camera will provide a perspective projection
  // Arguments are (fov, aspect, near_plane, far_plane)
  
  var camera = new THREE.PerspectiveCamera(75, 800/800, 0.1, 1000);

  var axes = new THREE.AxisHelper( 500 );
  scene.add(axes);  
  
  var controls = new function(){
	  this.camerax = 200;
	  this.cameray = 200;
	  this.cameraz = 400;
	  this.colormesh = 0xff0000;
	  this.colorlight = 0xffffff;
	  this.color2 = 0x0000ff;
    this.poslight_x = -424;
    this.poslight_y = -424;
    this.poslight_z = 900;
    this.cual_shading = 1; // Smooth shading
    this.wireframe = false;
    this.shininess = 250;
  }
  
   //var geometry = new THREE.BoxGeometry( 250, 250, 250, 10, 10, 10);
   var geometry = new THREE.BoxGeometry( 250, 250, 250);
  //var geometry = new THREE.CylinderGeometry( 100, 100, 300, 32, 1);
  //var geometry = new THREE.CylinderGeometry( 0, 150, 300, 4, 1);
  //var geometry = new THREE.CylinderGeometry( 0, 150, 300, 4, 10);
  //geometry.computeFaceNormals();
  //geometry.computeVertexNormals();
  var material = new THREE.MeshPhongMaterial( {color: controls.colormesh} );
    
  var caja = new THREE.Mesh(geometry, material);
  scene.add(caja);
 
  var light_point = new THREE.PointLight(controls.colorlight, 1);
  light_point.position.set(controls.poslight_x, controls.poslight_y, controls.poslight_z);
  scene.add(light_point);
  
  
  var gui = new dat.GUI();
  var f1 = gui.addFolder('Camera');
  f1.add(controls, 'camerax', -900,900).onChange(render);
  f1.add(controls, 'cameray', -900,900).onChange(render);
  f1.add(controls, 'cameraz', -900,900).onChange(render);
  
  var f2 = gui.addFolder('Colors');
  f2.addColor(controls, 'colormesh').onChange(render);
  f2.addColor(controls, 'colorlight').onChange(render);
  
  
  var f3 = gui.addFolder('Point Light position');
  f3.add(controls, 'poslight_x', -900,900).onChange(render);
  f3.add(controls, 'poslight_y', -900,900).onChange(render);
  f3.add(controls, 'poslight_z', -900,900).onChange(render);
  
  var f4 = gui.addFolder('Shading');
  f4.add(controls, 'cual_shading', {Flat: 0, Smooth: 1}).onChange(render);
  f4.add(controls, 'shininess', 1.0, 300.0).onChange(render);
  f4.add(controls, 'wireframe').onChange(render);
  
  
  
  f1.open();
  f2.open();
  f3.open();
  f4.open();
  
  function render() { 
    
	  material.color = new THREE.Color(controls.colormesh);
    material.wireframe = controls.wireframe;
    if (controls.cual_shading == 1) {
        material.shading = THREE.SmoothShading;
    } else {
      material.shading = THREE.FlatShading;
    }
    material.shininess = controls.shininess;
    material.needsUpdate = true;
    geometry.verticesNeedUpdate = true;
		geometry.normalsNeedUpdate = true;
		geometry.colorsNeedUpdate = true;
    light_point.color = new THREE.Color(controls.colorlight);
    light_point.position.set(controls.poslight_x, controls.poslight_y, controls.poslight_z);
    camera.position.set(controls.camerax, controls.cameray, controls.cameraz);
    camera.lookAt(scene.position);
	
	
    renderer.render( scene, camera );
  } 
  render();
  }
 
 