// Hello Scene: axis + camera dat.GUI controls + stats

function draw_scene() {

  // CANVAS
  //Create the Three.js WebGL renderer
  var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth-20, window.innerHeight-20);
    document.body.appendChild( renderer.domElement );
    renderer.setClearColor(0xC3B7B7); //0xEEEEEE


  // SCENE
  var scene = new THREE.Scene();


  // CAMERA (PERSPECTIVE projection)
  var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1200);


  // dat.GUI variables
  var controls = new function() {

	  this.camerax = 200;
	  this.cameray = 200;
	  this.cameraz = 400;

  }


  // Object GEOMETRY


  // Object MATERIAL


  // OBJECT = geometry + material

  // LIGHT

  // HELPERS
  var axisHelper = new THREE.AxisHelper( 200 );
  scene.add(axisHelper);

  // CONTROLS
  // dat.GUI controls
  var gui = new dat.GUI();
    var f1 = gui.addFolder('Camera');
    f1.add(controls, 'camerax', -900,900).onChange(render);
    f1.add(controls, 'cameray', -900,900).onChange(render);
    f1.add(controls, 'cameraz', -900,900).onChange(render);


  // MouseControl

  // STATS
  stats = new Stats();
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    stats.domElement.style.zIndex = 100;
    document.body.appendChild( stats.domElement );


  // Render function
  function render() {

    camera.position.set(controls.camerax, controls.cameray, controls.cameraz);
    camera.lookAt(scene.position);

    stats.update();

    renderer.render( scene, camera );
  }

 render();

}
