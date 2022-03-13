 // File 2.js Object Geometries and materials

 function draw_scene() {

  // CANVAS
  //Create the Three.js WebGL renderer
  var renderer = new THREE.WebGLRenderer();
    renderer.setSize(640, 480); //( 1024, 768 );
    document.body.appendChild( renderer.domElement );
    renderer.setClearColor(0xEEEEEE);


  // SCENE
  // Create the Three.js scene
  var scene = new THREE.Scene();


  // CAMERA
  // Create a camera and set it into world space
  // This camera will provide a perspective projection
  // Arguments are (fov, aspect, near_plane, far_plane)
  var camera = new THREE.PerspectiveCamera(75, 1024/768, 0.1, 1000);


  // CONTROLS
  // Initialization of GUI variables
  var controls = new function() {

	  this.camerax = 200;
	  this.cameray = 200;
	  this.cameraz = 400;

	  this.color0 = 0xff0000;
	  this.color1 = 0x00ff00;
	  this.color2 = 0x0000ff;

    this.wireframe = true;
  }


  // Object GEOMETRY
  // 3D
  // BoxGeometry is the quadrilateral primitive geometry class.
  // BoxGeometry(width, height, depth, widthSegments, heightSegments, depthSegments)
  //var geometry = new THREE.BoxGeometry( 200, 200, 200 );
  //var geometry = new THREE.BoxGeometry( 50, 50, 50, 1, 1, 1 ); // Default
  //var geometry = new THREE.BoxGeometry( 250, 250, 250, 2, 2, 2 );
  //var geometry = new THREE.BoxGeometry( 250, 250, 250, 10, 10, 10);
  //var geometry = new THREE.BoxGeometry( 200, 400, 200, 10, 10, 10);

  // CylinderGeometry
  // (radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded, thetaStart, thetaLength)
  //var geometry = new THREE.CylinderGeometry( 100, 100, 300, 8, 2);
  //var geometry = new THREE.CylinderGeometry( 100, 100, 300, 32, 1);
  //var geometry = new THREE.CylinderGeometry( 100, 100, 300, 32, 10);
  //var geometry = new THREE.CylinderGeometry( 0, 100, 300, 32, 1);   // This is a cone

  // SphereGeometry
  // SphereGeometry
  // (radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength)
  //var geometry = new THREE.SphereGeometry(200, 3, 2);
  //var geometry = new THREE.SphereGeometry(200, 8, 6);
  var geometry = new THREE.SphereGeometry(200, 32, 32);

  // 2D
  // PlaneGeometry(width, height, widthSegments, heightSegments)
  //var geometry = new THREE.PlaneGeometry( 150, 250, 1, 1 );
  //var geometry = new THREE.PlaneGeometry( 150, 250, 2, 4 );

  // CircleGeometry(radius, segments, thetaStart, thetaLength)
  //var geometry = new THREE.CircleGeometry( 200, 16 );

  // RingGeometry(innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart, thetaLength)
  //var geometry = new THREE.RingGeometry( 100, 200, 32 );


  // Object MATERIAL
  //var material = new THREE.MeshBasicMaterial( {color: controls.color0, side: THREE.DoubleSide} );
  var material = new THREE.MeshBasicMaterial( { color: controls.color0 } );
  //var material = new THREE.MeshLambertMaterial( {color: controls.color0} );
  //var material = new THREE.MeshPhongMaterial( {color: controls.color0} );
  //material.ambient = new THREE.Color(0xff0000);


  // OBJECT = geometry + material
  var caja = new THREE.Mesh(geometry, material);
  // 6.final Add the object to the scene
  scene.add(caja);

  // LIGHT
  //var lightPoint = new THREE.PointLight(controls.colorlight, 1);
  //lightPoint.position.set(200, 200, 200);
  //scene.add(lightPoint);

  // luce ambiente
  //var lightAmbient = THREE.AmbientLight(0x404040);
  //scene.add(lightAmbient);

  // HELPERS
  var axes = new THREE.AxisHelper( 500 );
  scene.add(axes);


  // GUI controls
  var gui = new dat.GUI();

    var f1 = gui.addFolder('The Camera');
    f1.add(controls, 'camerax', -900,900).onChange(render);
    f1.add(controls, 'cameray', -900,900).onChange(render);
    f1.add(controls, 'cameraz', -900,900).onChange(render);

    var f2 = gui.addFolder('The Material Color');
    f2.addColor(controls, 'color0').onChange(render);

    var f3 = gui.addFolder('Show Mesh (Grid | Malla | Maglia)');
    f3.add(controls, 'wireframe').onChange(render);

    f1.open();
    f2.open();
    f3.open();

  // Render function
  function render() {

	  material.color = new THREE.Color(controls.color0);
    material.wireframe = controls.wireframe;

    camera.position.set(controls.camerax, controls.cameray, controls.cameraz);
    camera.lookAt(scene.position);

    renderer.render( scene, camera );
  }

  render();

}
