/***********
 * flatSmoothShading.js
 * M. Laszlo
 * January 2015
 ***********/

var camera, scene, renderer;
var cameraControls;
var clock = new THREE.Clock();
var sun;
var matLambert, matPhong, mesh, geom, sphereMesh, sphereGeom;


function createScene() {
    matPhong = new THREE.MeshPhongMaterial({color: 0x0000FF});
    matPhongSphere = new THREE.MeshPhongMaterial({color: 0xFF0000});
    matPhong.shininess = 60; 
    matPhongSphere.shininess = 80; 
    matLambert = new THREE.MeshLambertMaterial({color: 0x0000FF});
    matLambertSphere = new THREE.MeshLambertMaterial({color: 0xFF0000});
    matLambert.shading = THREE.FlatShading;
    matLambertSphere.shading = THREE.FlatShading;
    //  mesh
    geom = new THREE.TorusGeometry(10, 4, 16, 16);
    mesh = new THREE.Mesh(geom, matLambert);
    sphereGeom = new THREE.SphereGeometry(3.5, 12, 12);
    sphereMesh = new THREE.Mesh(sphereGeom, matLambertSphere);
    updateShading(controls.shading);



    // light
    var sunMat = new THREE.MeshBasicMaterial({color: 'yellow'});
    var sunGeom = new THREE.SphereGeometry(0.5, 12, 12);
    sun = new THREE.Mesh(sunGeom, sunMat);
    var light = new THREE.PointLight(0xFFFFFF, 1, 1000 );
    light.position.set(0, 0, 0);
    sun.add(light);
    sun.translateZ(10);
    var ambientLight = new THREE.AmbientLight(0x222222);

    scene.add(sun);
    scene.add(ambientLight);
    scene.add(mesh);
    scene.add(sphereMesh);
}

var controls = new function() {
    this.transx = 0.0;
    this.transy = 0.0;
    this.transz = 10.0;
    this.shading = 'flat';
}


function animate() {
	window.requestAnimationFrame(animate);
	render();
}


function render() {
    var delta = clock.getDelta();
    sun.position.x = controls.transx;
    sun.position.y = controls.transy;
    sun.position.z = controls.transz;
    cameraControls.update(delta);
	renderer.render(scene, camera);
}


function init() {
	var canvasWidth = window.innerWidth;
	var canvasHeight = window.innerHeight;
	var canvasRatio = canvasWidth / canvasHeight;

	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer({antialias : true});
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.setSize(canvasWidth, canvasHeight);
  document.body.appendChild( renderer.domElement );
	renderer.setClearColor(0x000000, 1.0);

	camera = new THREE.PerspectiveCamera( 40, canvasRatio, 1, 1000);
	camera.position.set(0, 0, 40);
	camera.lookAt(new THREE.Vector3(0, 0, 0));

	cameraControls = new THREE.OrbitControls(camera, renderer.domElement);

    var gui = new dat.GUI();
    gui.add(controls, 'transx', -20.0, 20.0).step(0.5);
    gui.add(controls, 'transy', -20.0, 20.0).step(0.5);
    gui.add(controls, 'transz', 0.0, 20.0).step(0.5);
    var shadingTypes =  ['flat', 'smooth', 'Phong'];
    var shadetype = gui.add(controls, 'shading', shadingTypes);
    shadetype.onChange(updateShading);
}

function updateShading(shadingType) {
    switch (shadingType) {
        case 'flat':
            matLambert.shading = THREE.FlatShading;
            matLambertSphere.shading = THREE.FlatShading;
            mesh.material = matLambert;
            sphereMesh.material = matLambertSphere;             
            break;
        case 'smooth':        
            matLambert.shading = THREE.SmoothShading;
            matLambertSphere.shading = THREE.SmoothShading;
            mesh.material = matLambert; 
            sphereMesh.material = matLambertSphere;
            break;
        case 'Phong':
            matPhong.needsUpdate = true;            
            mesh.material = matPhong;
            sphereMesh.material = matPhongSphere;
            break;
    }
    geom.normalsNeedUpdate = true;
    sphereGeom.normalsNeedUpdate = true;
}


function startit() {
init();	
createScene();
render();
animate();
}
