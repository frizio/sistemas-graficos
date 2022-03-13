 // File 3.js SHADING (Illiminazione) type of lights

 function draw_scene() {

  // Create the Three.js WebGL renderer
  var renderer = new THREE.WebGLRenderer();
    renderer.setSize(640, 480); // ( 800, 800 );
    document.body.appendChild( renderer.domElement );
    //renderer.setClearColor(0xEEEEEE);
    renderer.setClearColor(0xC3B7B7);

  // Create the Three.js scene
  var scene = new THREE.Scene();

  // Create a camera and set it into world space
  // Arguments are (fov, aspect, near_plane, far_plane) (75, 800/800, 0.1, 1000);
  var camera = new THREE.PerspectiveCamera(75, 640/480, 0.1, 1000);

  // Initialization of GUI variables
  var controls = new function(){

	  this.camerax = 300;
	  this.cameray = 300;
	  this.cameraz = 400;

	  this.colormesh = 0xff0000;
	  this.colorlight = 0xffffff;
	  //this.color2 = 0x0000ff;

    this.poslight_x = 260;
    this.poslight_y = 260;
    this.poslight_z = 260;

    this.cual_shading = 1; // Smooth shading

    this.wireframe = false;
  }

  // Geometry
  //var geometry = new THREE.BoxGeometry( 250, 250, 250, 10, 10, 10);
  var geometry = new THREE.BoxGeometry( 250, 250, 250, 2, 2, 2);
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();

  // Material

  /* MeshBasicMaterial
  A material for drawing geometries in a simple shaded (flat or wireframe) way.
  This material is not affected by lights.
  */

  /* MeshLambertMaterial
  A material for non-shiny surfaces, without specular highlights.

  The uses a non-physically based Lambertian model for calculating reflectance.
  This can simulate some surfaces (such as untreated wood or stone) well,
  but cannot simulate shiny surfaces with specular highlights (such as varnished wood).

  Shading is calculated using a Gouraud shading model.
  This calculates shading per vertex (i.e. in the vertex shader) and
  interpolates the results over the polygon's faces.

  Due to the simplicity of the reflectance and illumination models,
  performance will be greater when using this material
  over the MeshPhongMaterial, MeshStandardMaterial or MeshPhysicalMaterial,
  at the cost of some graphical accuracy.
  */

  /* MeshPhongMaterial
  A material for shiny surfaces with specular highlights.

  The uses a non-physically based Blinn-Phong model for calculating reflectance.
  Unlike the Lambertian model used in the MeshLambertMaterial
  this can simulate shiny surfaces with specular highlights (such as varnished wood).

  Shading is calculated using a Phong shading model.
  This calculates shading per pixel (i.e. in the fragment shader, AKA pixel shader)
  which gives more accurate results than the Gouraud model used by MeshLambertMaterial,
  at the cost of some performance.
  The MeshStandardMaterial and MeshPhysicalMaterial also use this shading model.

  Performance will generally be greater when using this material
  over the MeshStandardMaterial or MeshPhysicalMaterial,
  at the cost of some graphical accuracy.

  */

  //var material = new THREE.MeshBasicMaterial( {color: controls.colormesh} );
  var material = new THREE.MeshLambertMaterial( {color: controls.colormesh} );
  //var material = new THREE.MeshPhongMaterial( {color: controls.colormesh} );

  // Object
  var caja = new THREE.Mesh(geometry, material);
  scene.add(caja);


  // LIGHTS
  // PointLight( color, intensity, distance, decay )
  var pointLight = new THREE.PointLight(controls.colorlight, 1, 0, 1);
  pointLight.position.set(controls.poslight_x, controls.poslight_y, controls.poslight_z);
  scene.add(pointLight);

  // Add pointLight to a yellow sphere (like the sun)
  /*
  var sunMat = new THREE.MeshBasicMaterial({color: 'yellow'});
  var sunGeom = new THREE.SphereGeometry(10, 16, 8);
  var sun = new THREE.Mesh(sunGeom, sunMat);
  sun.add(pointLight);
	scene.add(sun);
  */


  // HELPERS
  // AxisHelper
  var axes = new THREE.AxisHelper( 500 );
  scene.add(axes);

  // NormalHelper
  var faceNormalHelper = new THREE.FaceNormalsHelper(caja, 10, 0xffff00, 5);
  scene.add(faceNormalHelper);
  var vertexNormalHelper = new THREE.VertexNormalsHelper( caja, 20, 0xffa500, 3 );
  scene.add(vertexNormalHelper);

  // PointLightHelper
  var pointLightHelper = new THREE.PointLightHelper(pointLight, 5);
  scene.add(pointLightHelper);


  // GUI controls
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
    f4.add(controls, 'wireframe').onChange(render);

    f1.open();
    f2.open();
    f3.open();
    f4.open();

  // Render function
  function render() {

	  material.color = new THREE.Color(controls.colormesh);
    material.wireframe = controls.wireframe;
    if (controls.cual_shading == 1) {
      material.shading = THREE.SmoothShading;
    } else {
      material.shading = THREE.FlatShading;
    }
    material.needsUpdate = true;

    geometry.verticesNeedUpdate = true;
		geometry.normalsNeedUpdate = true;
		geometry.colorsNeedUpdate = true;

    //sun.position.set(controls.poslight_x, controls.poslight_y, controls.poslight_z);
    pointLight.color = new THREE.Color(controls.colorlight);
    pointLight.position.set(controls.poslight_x, controls.poslight_y, controls.poslight_z);

    camera.position.set(controls.camerax, controls.cameray, controls.cameraz);
    camera.lookAt(scene.position);

    renderer.render( scene, camera );
  }

  render();

  }
