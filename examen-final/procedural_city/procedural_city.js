 // File procedural_city.js
 // Author: Maurizio La Rocca

function draw_scene(){

  // Create the Three.js WebGL renderer
  var renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth-20, window.innerHeight-20 );
    document.body.appendChild( renderer.domElement );
    renderer.setClearColor(0xEEEEEE);


  // Create the Three.js scene
  var scene = new THREE.Scene();


  // Create a camera and set it into world space

  var far_plane_value = 20000;

  /* Camera that uses PERSPECTIVE PROJECTION.
  // This projection mode is designed to mimic the way the human eye sees.
  // It is the most common projection mode used for rendering a 3D scene. */
  var perspectiveCamera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, far_plane_value);
  // Arguments are (fov, aspect, near_plane, far_plane)
  /* Together these define the camera's viewing frustum.
  // fov —    Camera frustum vertical field of view.
  // aspect — Camera frustum aspect ratio.
  // near —   Camera frustum near plane.
  // far —    Camera frustum far plane. */

  /* Instead, this camera will provide a ORTHOGRAPHIC PROJECTION.
  // In this projection mode,
  // an object's size in the rendered image stays constant regardless of its distance from the camera.
  // This can be useful for rendering 2D scenes and UI elements, amongst other things. */
  var orthographicCamera = new THREE.OrthographicCamera( -window.innerWidth/2 ,  window.innerWidth/2,
                                                          window.innerHeight/2, -window.innerHeight/2,
                                                          0.1,                   far_plane_value );
  // Arguments are the camera frustum planes( left, right, top, bottom, near, far )


  // dat.GUI VARIABLES
  var controls = new function() {

    this.wireframe = false;

    this.projection = 0;  // {Perspective: 0, Ortographic: 1}

	  this.camerax = 4000;
	  this.cameray = 3800;
	  this.cameraz = 5000;
		this.camerax_prev = 4000;
	  this.cameray_prev = 3800;
	  this.cameraz_prev = 5000;

    this.cameratargetx = 0;
	  this.cameratargety = 500;
	  this.cameratargetz = 0;
    this.cameratargetx_prev = 0;
	  this.cameratargety_prev = 500;
	  this.cameratargetz_prev = 0;

    // Point Light 1
    this.pointlight1visible = true;
    this.pointlight1color = 0xffffff;
    this.pointlight1x = 2000;
    this.pointlight1y = 4000;
    this.pointlight1z = 5000;


    // Directional Light 1
    this.directlight1visible = true;
    this.directlight1color = 0xffffff;
    this.directlight1x = -2000;
    this.directlight1y = 3000;
    this.directlight1z = 3000;

    // Ambient Light
    this.ambientlightvisible = true;
    this.ambientlightcolor = 0x484848;

    this.axis = true;
    this.grid = true;
    this.target = true;

		this.updateCamx = function (e){
	    perspectiveCamera.position.x = e;
			orthographicCamera.position.x = e;
	  }
	  this.updateCamy = function (e){
	    perspectiveCamera.position.y = e;
			orthographicCamera.position.y = e;
	  }
	  this.updateCamz = function (e){
	    perspectiveCamera.position.z = e;
      orthographicCamera.position.z = e;
	  }

    this.updateCamtargetx = function (e){
	    cameraTarget.position.x = e;
	  }
    this.updateCamtargety = function (e){
	    cameraTarget.position.y = e;
	  }
    this.updateCamtargetz = function (e){
	    cameraTarget.position.z = e;
	  }


    this.updateVisibility_PL1 = function (e) {
      pointLight1.visible = e;
    }
    this.updateColor_PL1 = function (e) {
      // pointLight1.color = new THREE.Color(e);
       pointLight1.color.setHex(e);
    }
    this.updatePositionX_PL1 = function (e) {
         pointLight1.position.x = e;
         floorGeometry.colorsNeedUpdate = true;
         geometryBuilding.colorsNeedUpdate = true;
         baseGeometryBuilding.colorsNeedUpdate = true;
    }
    this.updatePositionY_PL1 = function (e) {
         pointLight1.position.y = e;
         floorGeometry.colorsNeedUpdate = true;
         geometryBuilding.colorsNeedUpdate = true;
         baseGeometryBuilding.colorsNeedUpdate = true;
    }
    this.updatePositionZ_PL1 = function (e) {
         pointLight1.position.z = e;
         floorGeometry.colorsNeedUpdate = true;
         geometryBuilding.colorsNeedUpdate = true;
         baseGeometryBuilding.colorsNeedUpdate = true;
    }

    this.updateVisibility_DL1 = function (e) {
      directionalLight1.visible = e;
    }
    this.updateColor_DL1 = function (e) {
       directionalLight1.color.setHex(e);
    }
    this.updatePositionX_DL1 = function (e) {
         directionalLight1.position.x = e;
         floorGeometry.colorsNeedUpdate = true;
         geometryBuilding.colorsNeedUpdate = true;
         baseGeometryBuilding.colorsNeedUpdate = true;
    }
    this.updatePositionY_DL1 = function (e) {
         directionalLight1.position.y = e;
         floorGeometry.colorsNeedUpdate = true;
         geometryBuilding.colorsNeedUpdate = true;
         baseGeometryBuilding.colorsNeedUpdate = true;
    }
    this.updatePositionZ_DL1 = function (e) {
         directionalLight1.position.z = e;
         floorGeometry.colorsNeedUpdate = true;
         geometryBuilding.colorsNeedUpdate = true;
         baseGeometryBuilding.colorsNeedUpdate = true;
    }

    this.updateVisibility_AL = function (e) {
      ambienteLight.visible = e;
    }
    this.updateColor_AL = function (e) {
       ambienteLight.color.setHex(e);
    }

  }


  // SKYCUBE

  // Textures for skycube
  var urls = ["landscape/posx.bmp", "landscape/negx.bmp", "landscape/posy.bmp",
              "landscape/negy.bmp", "landscape/posz.bmp", "landscape/negz.bmp"];
  var textureSkycube = THREE.ImageUtils.loadTextureCube( urls );

  // Material for skycube
  var shader = THREE.ShaderLib[ "cube" ];
    shader.uniforms[ "tCube" ].value = textureSkycube;
  var material = new THREE.ShaderMaterial( {
					fragmentShader: shader.fragmentShader,
					vertexShader: shader.vertexShader,
					uniforms: shader.uniforms,
					depthWrite: false,
					side: THREE.BackSide
				} );

  // Geometry for skycube
  //var skycubeGeometry = new THREE.BoxGeometry (8000, 8000, 8000);
  var skycubeGeometry = new THREE.SphereGeometry(8000, 64, 64);

  // Skycube Mesh object;
  var skycube = new THREE.Mesh( skycubeGeometry, material );
    skycube.position.set(0, 3900, 0);
    scene.add(skycube);

  // FLOOR
  //var floorGeometry = new THREE.BoxGeometry(8000, 8000, 10, 8, 8, 8);
  var floorGeometry = new THREE.CircleGeometry( 7000, 64 );
    floorGeometry.computeFaceNormals();
    //floorGeometry.computeVertexNormals();
    var textureFloor = THREE.ImageUtils.loadTexture("landscape/negy.bmp");
    textureFloor.wrapS = THREE.RepeatWrapping;
    textureFloor.wrapT = THREE.RepeatWrapping;
    textureFloor.repeat.set( 4, 4 );
    var floorMaterial = new THREE.MeshLambertMaterial({ambient: controls.ambientlightcolor,
                                                     map: textureFloor,
                                                     side: THREE.DoubleSide});
    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -0.5*Math.PI;
    floor.position.set(0,0,0);
    scene.add(floor);


  // CITY

  // Generate the texture procedurally
  var basicTexture = new THREE.Texture( generateTexture() );
    basicTexture.anisotropy = renderer.getMaxAnisotropy();
    basicTexture.needsUpdate    = true;
  // Material
  var materialBuilding = new THREE.MeshPhongMaterial( {color: 0x878787, map: basicTexture, side: THREE.DoubleSide} );

  for (var i = -3; i <= 3; i++){
    for (var j = -3; j <= 3; j++) {
        // Geometry
        //var geometryBuilding = baseGeometryBuilding.clone();
        var height = Math.floor( Math.random() * 900 ) + 1800;
        var geometryBuilding = new THREE.BoxGeometry( 400, height, 400, 4, 8, 4 )
        geometryBuilding.computeFaceNormals;
        // Mesh
        var meshBuilding = new THREE.Mesh(geometryBuilding, materialBuilding);
        meshBuilding.position.set(j*1000, Math.floor(height/2), i*1000);
        scene.add(meshBuilding);
    }
  }


  // BUILDING 1

  var baseGeometryBuilding = new THREE.BoxGeometry( 400, 3000, 400, 4, 8, 4 );
    baseGeometryBuilding.computeFaceNormals();

  var url1 = "buildings/13_old building texture.jpg";
    var texture1 = THREE.ImageUtils.loadTexture(url1);
    texture1.wrapS = THREE.RepeatWrapping;
    texture1.wrapT = THREE.RepeatWrapping;
    texture1.repeat.set( 1, 6 );
    var url1n = "buildings/13_old building texture_normalmap.png";
    var texture1n = THREE.ImageUtils.loadTexture(url1n);
    texture1n.wrapS = THREE.RepeatWrapping;
    texture1n.wrapT = THREE.RepeatWrapping;
    texture1n.repeat.set( 1, 6 );

    var materialBuilding1 = new THREE.MeshPhongMaterial( {color: 0x878787, map: texture1, normalMap: texture1n} );
    materialBuilding1.bumpScale = 0.6;

    var meshBuilding1 = new THREE.Mesh(baseGeometryBuilding, materialBuilding1);
    meshBuilding1.position.set(-3000, 1500, 4000);
    scene.add(meshBuilding1);

  // BUILDING 2
  var url2 = "buildings/35_old building texture.jpg";
    var texture2 = THREE.ImageUtils.loadTexture(url2);
    texture2.wrapS = THREE.RepeatWrapping;
    texture2.wrapT = THREE.RepeatWrapping;
    texture2.repeat.set( 1, 4 );
    var url2n = "buildings/35_old building texture_normalmap.jpg";
    var texture2n = THREE.ImageUtils.loadTexture(url2n);
    texture2n.wrapS = THREE.RepeatWrapping;
    texture2n.wrapT = THREE.RepeatWrapping;
    texture2n.repeat.set( 1, 4 );

    var materialBuilding2 = new THREE.MeshPhongMaterial( {color: 0x878787, map: texture2, normalMap: texture2n} );
    materialBuilding2.bumpScale = 0.6;

    var meshBuilding2 = new THREE.Mesh(baseGeometryBuilding, materialBuilding2);
    meshBuilding2.position.set(0, 1500, 4000);
    scene.add(meshBuilding2);

  // BUILDING 3
  var url3 = "buildings/texture_residential_building2.jpg";
    var texture3 = THREE.ImageUtils.loadTexture(url3);
    texture3.wrapS = THREE.RepeatWrapping;
    texture3.wrapT = THREE.RepeatWrapping;
    texture3.repeat.set( 1, 4 );
    var url3n = "buildings/texture_residential_building2_normalmap.jpg";
    var texture3n = THREE.ImageUtils.loadTexture(url3n);
    texture1n.wrapS = THREE.RepeatWrapping;
    texture1n.wrapT = THREE.RepeatWrapping;
    texture1n.repeat.set( 1, 4 );

    //var materialBuilding3 = new THREE.MeshPhongMaterial( {color: 0x878787, map: basicTexture} );
    var materialBuilding3 = new THREE.MeshPhongMaterial( {color: 0x878787, map: texture3, normalMap: texture3n} );
    materialBuilding3.bumpScale = 0.9;

    var meshBuilding3 = new THREE.Mesh(baseGeometryBuilding, materialBuilding3);
    meshBuilding3.position.set(4000, 1500, 0);
    scene.add(meshBuilding3);


  // LIGHT(s)
  var pointLight1 = new THREE.PointLight(controls.pointlight1color, 1);
    pointLight1.position.set(controls.pointlight1x, controls.pointlight1y, controls.pointlight1z);
    scene.add(pointLight1);

  var pointLight2 = new THREE.PointLight(0xffffff, 1);
    //pointLight2.position.set(controls.pointlight1x, controls.pointlight1y, controls.pointlight1z);
    pointLight2.position.set(0, 4000, -4000);
    scene.add(pointLight2);

  var directionalLight1 = new THREE.DirectionalLight(controls.directlight1color, 1);
    //directionalLight1.position.set(controls.lightx, controls.lighty, controls.lightz);
    directionalLight1.position.set(controls.directlight1x, controls.directlight1y, controls.directlight1z);
    scene.add(directionalLight1);

  var ambientLight = new THREE.AmbientLight(controls.ambientlightcolor);
    //ambientLight.visible = controls.ambientlightvisible;
    scene.add(ambientLight);


  // HELPERS
  var axisHelper = new THREE.AxisHelper( 4000 );
    axisHelper.visible = controls.axis;
    scene.add(axisHelper);

  var gridHelper = new THREE.GridHelper( 4000, 80, 0x444444, 0x888888 );
    gridHelper.visible = controls.grid;
    scene.add( gridHelper );

  var pointLightHelper1 = new THREE.PointLightHelper(pointLight1, 5);
    scene.add(pointLightHelper1);

  var pointLightHelper2 = new THREE.PointLightHelper(pointLight2, 5);
    scene.add(pointLightHelper2);

  var directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight1, 5);
    scene.add(directionalLightHelper);

  // Camera target object
  var cameraTarget = new THREE.Mesh( new THREE.SphereGeometry(50, 32, 32),
                                     new THREE.MeshBasicMaterial( { color: 0x0000ff } ));
    cameraTarget.visible = controls.target;
    scene.add(cameraTarget);


  // CONTROLS

  // dat.GUI controls
  var gui = new dat.GUI();

    var f1 = gui.addFolder('Camera');
      f1.add(controls, 'projection', {Perspective: 0, Ortographic: 1});
      var controlx = f1.add(controls, 'camerax', -7000,7000).onChange(controls.updateCamx);
      var controly = f1.add(controls, 'cameray', -7000,7000).onChange(controls.updateCamy);
      var controlz = f1.add(controls, 'cameraz', -7000,7000).onChange(controls.updateCamz);
      var controltargetx = f1.add(controls, 'cameratargetx', -3000,3000).onChange(controls.updateCamtargetx);
      var controltargety = f1.add(controls, 'cameratargety', -3000,3000).onChange(controls.updateCamtargety);
      var controltargetz = f1.add(controls, 'cameratargetz', -3000,3000).onChange(controls.updateCamtargetz);
      //f1.open();

    var f4 = gui.addFolder('Point Light 1');
      f4.add(controls, 'pointlight1visible').onChange(controls.updateVisiblity_PL1);
      f4.add(controls, 'pointlight1x', -7000,7000).onChange(controls.updatePositionX_PL1);
      f4.add(controls, 'pointlight1y', -7000,7000).onChange(controls.updatePositionY_PL1);
      f4.add(controls, 'pointlight1z', -7000,7000).onChange(controls.updatePositionZ_PL1);;
      f4.addColor(controls, 'pointlight1color').onChange(controls.updateColor_PL1);
      f4.open();

    var f6 = gui.addFolder('Directional Light');
      f6.add(controls, 'directlight1visible').onChange(controls.updateVisiblity_DL1);
      f6.add(controls, 'directlight1x', -7000,7000).onChange(controls.updatePositionX_DL1);
      f6.add(controls, 'directlight1y', -7000,7000).onChange(controls.updatePositionY_DL1);
      f6.add(controls, 'directlight1z', -7000,7000).onChange(controls.updatePositionZ_DL1);;
      f6.addColor(controls, 'directlight1color').onChange(controls.updateColor_DL1);
      f6.open();

    var f7 = gui.addFolder('Ambient Light');
      f7.add(controls, 'ambientlightvisible').onChange(controls.updateVisibility_AL);
      //f7.addColor(controls, 'ambientlightcolor').onChange(controls.updateColor_AL);
      f7.open();

    var f8 = gui.addFolder('Show Helpers');
      f8.add(controls, 'wireframe').onChange(render);
      f8.add(controls, 'axis').onChange(render);
      f8.add(controls, 'grid').onChange(render);
      f8.add(controls, 'target').onChange(render);
      f8.open();


  // Mouse trackball camera controls
  var mouseControlsPC = new THREE.TrackballControls(perspectiveCamera, renderer.domElement);
    mouseControlsPC.staticMoving = true;
    mouseControlsPC.dynamicDampingFactor = 0.3;

  var mouseControlsOC = new THREE.TrackballControls(orthographicCamera, renderer.domElement);
    mouseControlsOC.staticMoving = true;
    mouseControlsOC.dynamicDampingFactor = 0.3;


  // STATISTICS
  stats = new Stats();
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    stats.domElement.style.zIndex = 100;
    document.body.appendChild( stats.domElement );


  // CAMERA SETTINGS (1)
  perspectiveCamera.position.set(controls.camerax, controls.cameray, controls.cameraz);
	orthographicCamera.position.set(controls.camerax, controls.cameray, controls.cameraz);


  function render() {

    stats.update();

    materialBuilding.wireframe = controls.wireframe;
    floorMaterial.wireframe = controls.wireframe;
    materialBuilding1.wireframe = controls.wireframe;
    materialBuilding2.wireframe = controls.wireframe;
    materialBuilding3.wireframe = controls.wireframe;


    axisHelper.visible = controls.axis;
    gridHelper.visible = controls.grid;
    cameraTarget.visible = controls.target;

    pointLight1.visible = controls.pointlight1visible;

    directionalLight1.visible = controls.directlight1visible;

    ambientLight.visible = controls.ambientlightvisible;

    mouseControlsPC.update();
    mouseControlsOC.update();

    // Feedback of GUI with camera position set by TrackballControls
    if (controls.camerax_prev != perspectiveCamera.position.x){
    		controls.camerax = perspectiveCamera.position.x;
    		controls.camerax_prev = perspectiveCamera.position.x;
    		controlx.updateDisplay();
    	}
    	if (controls.cameray_prev != perspectiveCamera.position.y){
    		controls.cameray = perspectiveCamera.position.y;
    		controls.cameray_prev = perspectiveCamera.position.y;
    		controly.updateDisplay();
    	}
    	if (controls.cameraz_prev != perspectiveCamera.position.z){
    		controls.cameraz = perspectiveCamera.position.z;
    		controls.cameraz_prev = perspectiveCamera.position.z;
    		controlz.updateDisplay();
    	}

    if (controls.camerax_prev != orthographicCamera.position.x){
    		controls.camerax = orthographicCamera.position.x;
    		controls.camerax_prev = orthographicCamera.position.x;
    		controlx.updateDisplay();
    	}
    	if (controls.cameray_prev != orthographicCamera.position.y){
    		controls.cameray = orthographicCamera.position.y;
    		controls.cameray_prev = orthographicCamera.position.y;
    		controly.updateDisplay();
    	}
    	if (controls.cameraz_prev != orthographicCamera.position.z){
    		controls.cameraz = orthographicCamera.position.z;
    		controls.cameraz_prev = orthographicCamera.position.z;
    		controlz.updateDisplay();
    	}

    // CAMERA SETTINGS (2)
    if (controls.projection == 0){
        perspectiveCamera.lookAt(cameraTarget.position);
        renderer.render( scene, perspectiveCamera );
      }
      else {
        orthographicCamera.lookAt(cameraTarget.position);
        renderer.render( scene, orthographicCamera );
      }

    // Animation loop
    requestAnimationFrame( render );

  }

  render();
}

function generateTexture() {
  // build a small canvas 32x64 and paint it in white
  var canvas  = document.createElement( 'canvas' );
  canvas.width = 32;
  canvas.height    = 64;
  var context = canvas.getContext( '2d' );
  // plain it in white
  context.fillStyle    = '#ffffff';
  context.fillRect( 0, 0, 32, 64 );
  // draw the window rows - with a small noise to simulate light variations in each room
  for( var y = 2; y < 64; y += 2 ){
      for( var x = 0; x < 32; x += 2 ){
          var value   = Math.floor( Math.random() * 64 );
          context.fillStyle = 'rgb(' + [value, value, value].join( ',' )  + ')';
          context.fillRect( x, y, 2, 1 );
      }
  }

  // build a bigger canvas and copy the small one in it
  // This is a trick to upscale the texture without filtering
  var canvas2 = document.createElement( 'canvas' );
  canvas2.width    = 512;
  canvas2.height   = 1024;
  var context = canvas2.getContext( '2d' );
  // disable smoothing
  context.imageSmoothingEnabled        = false;
  context.webkitImageSmoothingEnabled  = false;
  context.mozImageSmoothingEnabled = false;
  // then draw the image
  context.drawImage( canvas, 0, 0, canvas2.width, canvas2.height );
  // return the just built canvas2
  return canvas2;
}
