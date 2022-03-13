// Hello Scene: Scheleton (only canvas)

function draw_scene() {

  // Three.js WebGL renderer: the CANVAS
  var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth-20, window.innerHeight-20);
    document.body.appendChild( renderer.domElement );
    renderer.setClearColor(0xC3B7B7); //0xEEEEEE


  // SCENE
  var scene = new THREE.Scene();


  // CAMERA (PERSPECTIVE projection)
  var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1200);


  // dat.GUI variables


  // Object GEOMETRY


  // Object MATERIAL


  // OBJECT = geometry + material

  // LIGHT

  // HELPERS

  // CONTROLS
  // dat.GUI controls

  // MouseControl

  // Statistics

  // Camera settings (*)

  // Render function
  function render() {

    // Camera settings (*)

    renderer.render( scene, camera );
  }

  render();

}
