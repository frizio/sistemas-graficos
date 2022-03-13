 // File 3.js
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
  
  var camera = new THREE.PerspectiveCamera(70, 1024/768, 0.1, 500);
  var camera2 = new THREE.OrthographicCamera(-1024/2 , 1024/2, 768/2, -768/2, 0.1, 1200);

  			var effect = new THREE.AnaglyphEffect( renderer );
				effect.setSize( 1024, 768 );
  
  
  var axes = new THREE.AxisHelper( 500 );
  scene.add(axes);  
  
  var controls = new function(){
	  this.camerax = 100;
	  this.cameray = 100;
	  this.cameraz = 100;
	  this.colormesh = 0x00ff00;
	  this.colorlight = 0xffffff;
	  this.color2 = 0x0000ff;
    this.poslight_x = 400;
    this.poslight_y = 400;
    this.poslight_z = 400;
    this.wireframe = false;
    this.cualcamera = 0;
  }
  
  var geometry = new THREE.BoxGeometry( 40, 40, 40 );
  //var geometry = new THREE.CylinderGeometry( 100, 100, 300, 32, 1);
  //geometry.computeFaceNormals();
  //geometry.computeVertexNormals();
  var material = new THREE.MeshLambertMaterial( {color: controls.colormesh} );
    
  var caja = new THREE.Mesh(geometry, material);
  
  
  for (var i = -2; i < 2; i++){
    for (var j = -2; j < 2; j++) {
        var geom2 = geometry.clone();
        var mesh2 = new THREE.Mesh(geom2, material);
        mesh2.position.set(j*80, 0, i*80);
        scene.add(mesh2);
    }
  }
 
  var light_point = new THREE.PointLight(controls.colorlight, 1);
  light_point.position.set(controls.poslight_x, controls.poslight_y, controls.poslight_z);
  scene.add(light_point);
  
  
  var gui = new dat.GUI();
  var f1 = gui.addFolder('Camera');
  f1.add(controls, 'camerax', -300,300).onChange(render);
  f1.add(controls, 'cameray', -300,300).onChange(render);
  f1.add(controls, 'cameraz', -300,300).onChange(render);
  f1.add(controls, 'cualcamera', {Perspective: 0, Ortographic: 1}).onChange(render);
  
  var f2 = gui.addFolder('Colors');
  f2.addColor(controls, 'colormesh').onChange(render);
  f2.addColor(controls, 'colorlight').onChange(render);
  
  var f3 = gui.addFolder('Point Light position');
  f3.add(controls, 'poslight_x', -900,900).onChange(render);
  f3.add(controls, 'poslight_y', -900,900).onChange(render);
  f3.add(controls, 'poslight_z', -900,900).onChange(render);
  
  
  
  
  f1.open();
  f2.open();
  f3.open();
  
  function render() { 
    
	  material.color = new THREE.Color(controls.colormesh);
    light_point.color = new THREE.Color(controls.colorlight);
    light_point.position.set(controls.poslight_x, controls.poslight_y, controls.poslight_z);
    camera.position.set(controls.camerax, controls.cameray, controls.cameraz);
    camera2.position.set(controls.camerax, controls.cameray, controls.cameraz);
    if (controls.cualcamera == 0){
      camera.lookAt(scene.position);
      //renderer.render( scene, camera );
      effect.render( scene, camera );
    }
    else {
      camera2.lookAt(scene.position);
      //renderer.render( scene, camera2 );
      effect.render( scene, camera );
    }
	
  } 
  render();
  }
 
 