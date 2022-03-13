 // File 1.js Hello world

 function draw_scene() {

  // 1. CANVAS
  //Create the Three.js WebGL renderer
  var renderer = new THREE.WebGLRenderer();
    //renderer.setSize( 1024, 768 );
    renderer.setSize( 640, 480 );
    //renderer.setSize( window.innerWidth-20, window.innerHeight-20 );
    document.body.appendChild( renderer.domElement );
    renderer.setClearColor(0xEEEEEE);

  // 2. SCENE
  // Create the Three.js scene
  var scene = new THREE.Scene();

  // 3. CAMERA
  // Create a camera and set it into world space
  // This camera will provide a perspective projection
  // Arguments are (fov, aspect, near_plane, far_plane)
  var camera = new THREE.PerspectiveCamera(75, 1024/768, 0.1, 1000);
  //var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 3000);


  // 4a. dat.GUI CONTROLS: Initialization of GUI variables
  var controls = new function() {

	  this.camerax = 200;
	  this.cameray = 200;
	  this.cameraz = 400;

	  this.color0 = 0xff0000;  // Red    - vertex 0
	  this.color1 = 0x00ff00;  // Green  - vertex 1
	  this.color2 = 0x0000ff;  // Blue   - vertex 2
  }


  // 5a. Object GEOMETRY
  //var geometry = new THREE.BoxGeometry( 1, 1, 1 );
  var geometry = new THREE.Geometry();
    /*
    geometry.vertices.push( new THREE.Vector3( -200,  200, 0 ), // 0
  	                        new THREE.Vector3( -200, -200, 0 ), // 1
  	                        new THREE.Vector3(  200, -200, 0 )  // 2
    );
    */
    geometry.vertices.push( new THREE.Vector3( 0, 0, 200 ),     // 0 red
                            new THREE.Vector3( 200, 0, 200 ),   // 1 green
                            new THREE.Vector3(  0, 200, 200 )   // 2 blue
    );

    geometry.faces.push( new THREE.Face3( 0, 1, 2 ) );

    geometry.computeFaceNormals();
    geometry.computeVertexNormals();

  // 5b. Object material
  var material = new THREE.MeshBasicMaterial( {color: 0xffffff, vertexColors: THREE.VertexColors } );
  material.wireframe = false;

  var face = geometry.faces[0];
    face.vertexColors[0] = new THREE.Color( controls.color0 );
    face.vertexColors[1] = new THREE.Color( controls.color1 );
    face.vertexColors[2] = new THREE.Color( controls.color2 );

  // 5a. OBJECT = geometry + material
  var triangle = new THREE.Mesh(geometry, material);

  // 5b. Add the object to the scene
  scene.add(triangle);


  // 7 HELPER Objects
  var helpers = 4;

    // AXIS Helper
    // Visualize the the 3 axes in a simple way.
    // The X axis is red. The Y axis is green. The Z axis is blue.
    var axisHelper = new THREE.AxisHelper( 500 );
    scene.add(axisHelper);

    // GRID Helper
    //GridHelper( size, divisions, colorCenterLine, colorGrid )
    var gridHelper = new THREE.GridHelper( 500, 50, 0x444444, 0x888888 );
    scene.add( gridHelper );

    // CAMERA Helper
    // Not work well
    /*
    var cameraHelper = new THREE.CameraHelper( camera );
    scene.add( cameraHelper );
    */

    // NORMAL Helper
    var faceNormalHelper = new THREE.FaceNormalsHelper(triangle, 30);
    scene.add(faceNormalHelper);
    var vertexNormalHelper = new THREE.VertexNormalsHelper( triangle, 20, 0x000000, 3 );
    scene.add(vertexNormalHelper);

  // 4b. GUI controls
  var gui = new dat.GUI();

    var f1 = gui.addFolder('Camera');
    f1.add(controls, 'camerax', -900,900).onChange(render);
    f1.add(controls, 'cameray', -900,900).onChange(render);
    f1.add(controls, 'cameraz', -900,900).onChange(render);

    var f2 = gui.addFolder('Colors');
    f2.addColor(controls, 'color0').onChange(render);
    f2.addColor(controls, 'color1').onChange(render);
    f2.addColor(controls, 'color2').onChange(render);

    f1.open();
    f2.open();


  // RENDER function
  function render() {

    geometry.faces[0].vertexColors[0].setHex(controls.color0);
	  geometry.faces[0].vertexColors[1].setHex(controls.color1);
	  geometry.faces[0].vertexColors[2].setHex(controls.color2);

    geometry.colorsNeedUpdate = true;

    camera.position.set(controls.camerax, controls.cameray, controls.cameraz);
    camera.lookAt(scene.position);

    renderer.render( scene, camera );

  } // end render()

  // Call to render() function inside draw_scene()
  render();

} // end draw_scene()
