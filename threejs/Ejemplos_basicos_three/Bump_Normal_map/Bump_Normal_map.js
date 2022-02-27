// File Bump_Normal_map.js

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

  // Create the Three.js scene
  var scene = new THREE.Scene();

  // Create a camera and set it into world space
  var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);


  // dat.GUI controls: Initialization of GUI variables
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
  	  this.color1 = 0xffffff;
  	  this.color2 = 0xffffff;
  	  this.color3 = 0xffffff;
  	  this.bumpscale = 0.2;

  	  this.updateLight1x = function (e) {
           light.position.x = e;
           geometry.colorsNeedUpdate = true;
  	  }
  	  this.updateLight1y = function (e) {
           light.position.y = e;
           geometry.colorsNeedUpdate = true;
  	  }
  	  this.updateLight1z = function (e) {
           light.position.z = e;
           geometry.colorsNeedUpdate = true;
  	  }
  	  this.updateLight1color = function (e) {
           light.color.setHex(e);
  	  }
  	  this.visibleLight1 = function (e) {
  	    light.visible = e;
  	  }

  	  this.updateLight2x = function (e) {
           light2.position.x = e;
           geometry.colorsNeedUpdate = true;
  	  }
  	  this.updateLight2y = function (e) {
           light2.position.y = e;
           geometry.colorsNeedUpdate = true;
  	  }
  	  this.updateLight2z = function (e) {
           light2.position.z = e;
           geometry.colorsNeedUpdate = true;
  	  }
  	  this.updateLight2color = function (e) {
           light2.color.setHex(e);
  	  }
  	  this.visibleLight2 = function (e) {
  	    light2.visible = e;
  	  }

  	  this.updateLight3x = function (e) {
           light3.position.x = e;
           geometry.colorsNeedUpdate = true;
  	  }
  	  this.updateLight3y = function (e) {
           light3.position.y = e;
           geometry.colorsNeedUpdate = true;
  	  }
  	  this.updateLight3z = function (e) {
           light3.position.z = e;
           geometry.colorsNeedUpdate = true;
  	  }
  	  this.updateLight3color = function (e) {
           light3.color.setHex(e);
  	  }
  	  this.visibleLight3 = function (e) {
  	    light3.visible = e;
  	  }
  	  this.updateBump = function (e){
  	   cube.material.normalScale.set(e,e);
  	   //cube.material.bumpScale = e;
  	   //cube.geometry.computeFaceNormals();
       //cube.geometry.computeVertexNormals();
  	  }
    }


  // Bump and Normal Maps
  //var mapUrl = "stone.jpg";
  var mapUrl = "wotig.png";

  var map = THREE.ImageUtils.loadTexture(mapUrl);
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.repeat.set( 4, 4 );

  //var mapUrl1 = "stone-bump.jpg";
  //var mapUrl1 = "wotig-normal.png";
  //var mapUrl1 = "wotig-bump.png";
  var mapUrl1 = "wotig-normal128.png";

  var map1 = THREE.ImageUtils.loadTexture(mapUrl1);
  map1.wrapS = THREE.RepeatWrapping;
  map1.wrapT = THREE.RepeatWrapping;
  map1.repeat.set( 4, 4 );

  // Material definition
  var material = new THREE.MeshPhongMaterial();
  material.map = map;
  //material.bumpMap = map1;
  material.normalMap = map1;
  //material.bumpScale = controls.bumpscale;

  // Geometry definition
  //var geometry = new THREE.CylinderGeometry(0, 200, 400, 4, 1, false);
  //var geometry = new THREE.BoxGeometry (200, 200, 200);
  //var geometry = new THREE.BoxGeometry (200, 400, 200);
  var geometry = new THREE.SphereGeometry(100, 32, 32);
  geometry.computeFaceNormals();
  geometry.computeVertexNormals();

  // Object = geometry + material
  var cube = new THREE.Mesh( geometry, material );
  scene.add( cube );

  // Lights
  var light = new THREE.DirectionalLight(controls.color1, 1);
  light.position.set(controls.lightx, controls.lighty, controls.lightz);
  scene.add(light);

  var light3 = new THREE.PointLight(controls.color3, 1);
  light3.position.set(controls.light3x, controls.light3y, controls.light3z);
  scene.add(light3);

  var light2 = new THREE.PointLight(controls.color2, 1);
  light2.position.set(controls.light2x, controls.light2y, controls.light2z);
  scene.add(light2);


  // Helpers
  var axisHelper = new THREE.AxisHelper( 500 );
  scene.add(axisHelper);

  var gridHelper = new THREE.GridHelper( 500, 50, 0x444444, 0x888888 );
  //scene.add( gridHelper );


  // Controls
  var gui = new dat.GUI();
    var f1 = gui.addFolder('Dir Light');
    f1.add(controls, 'lightx', -100,600).onChange(controls.updateLight1x);
    f1.add(controls, 'lighty', -100,600).onChange(controls.updateLight1y);
    f1.add(controls, 'lightz', -100,600).onChange(controls.updateLight1z);
    f1.addColor(controls, 'color1').onChange(controls.updateLight1color);
    f1.add(controls, 'visible1').onChange(controls.visibleLight1);

    var f2 = gui.addFolder('Point Light green');
    f2.add(controls, 'light3x', -100,400).onChange(controls.updateLight2x);
    f2.add(controls, 'light3y', -100,400).onChange(controls.updateLight2y);
    f2.add(controls, 'light3z', -100,400).onChange(controls.updateLight2z);
    f2.addColor(controls, 'color2').onChange(controls.updateLight2color);
    f2.add(controls, 'visible2').onChange(controls.visibleLight2);

    var f3 = gui.addFolder('Point Light red');
    f3.add(controls, 'light2x', -100,400).onChange(controls.updateLight3x);
    f3.add(controls, 'light2y', -100,400).onChange(controls.updateLight3y);
    f3.add(controls, 'light2z', -100,400).onChange(controls.updateLight3z);
    f3.addColor(controls, 'color3').onChange(controls.updateLight3color);
    f3.add(controls, 'visible3').onChange(controls.visibleLight3);

    //var f4 = gui.addFolder('BumpScale');
    //f4.add(controls, 'bumpscale', -4, 4).onChange(controls.updateBump);

    var f4 = gui.addFolder('NormalScale');
    f4.add(controls, 'bumpscale', -4, 4).onChange(controls.updateBump);

  var mouseControls = new THREE.TrackballControls(camera, renderer.domElement);
    mouseControls.staticMoving = true;
    mouseControls.dynamicDampingFactor = 0.3;


  // Camera settings (with animation here instead of render function internally)
  camera.position.set(200,200,400);
  camera.lookAt(scene.position);


  function render() {

    mouseControls.update();

    requestAnimationFrame( render );

    //cube.rotation.x += 0.01; //0.02;
    cube.rotation.y += 0.01; //0.02;
    //cube.rotation.z += 0.01; //0.02;

    stats.update();

    renderer.render( scene, camera );

  }

  render();

}
