// 6.js
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 point_position; \n' +                 // Gets vertex coordinates
  'attribute vec4 point_color; \n' +                    // Gets vertex color
  'varying vec4 frag_color; \n' +                       // Pass color to fragment shader
  'uniform mat4 mat_transfo; \n' +
  'void main() {\n' +
  '  gl_Position = mat_transfo * point_position;\n' +   // Set the vertex coordinates of the point
  '  frag_color = point_color;\n' +                     // Color fed from buffer goes to fragment shader
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float; \n' +
  'varying vec4 frag_color; \n' +
  'void main() {\n' +
  '  gl_FragColor = frag_color; \n' +                   // Sets the point color
  '}\n';

var ejes = new Float32Array (
    [-4.0,0.0,0.0,1.0,0.0,0.0, 0.0,0.0,0.0,1.0,0.0,0.0, 0.0,0.0,0.0,0.0,0.0,0.0, 4.0,0.0,0.0,0.0,0.0,0.0,
	 0.0,-4.0,0.0,0.0,1.0,0.0, 0.0,0.0,0.0,0.0,1.0,0.0, 0.0,0.0,0.0,0.0,0.0,0.0, 0.0,4.0,0.0,0.0,0.0,0.0,
	 0.0,0.0,-4.0,0.0,0.0,1.0, 0.0,0.0,0.0,0.0,0.0,1.0, 0.0,0.0,0.0,0.0,0.0,0.0, 0.0,0.0,4.0,0.0,0.0,0.0,

	 -1.0,-0.05,0.0,0.0,0.0,0.0, -1.0,0.05,0.0,0.0,0.0,0.0, 1.0,-0.05,0.0,0.0,0.0,0.0, 1.0,0.05,0.0,0.0,0.0,0.0,
	 -2.0,-0.05,0.0,0.0,0.0,0.0, -2.0,0.05,0.0,0.0,0.0,0.0, 2.0,-0.05,0.0,0.0,0.0,0.0, 2.0,0.05,0.0,0.0,0.0,0.0,
	 -0.05,-1.0,0.0,0.0,0.0,0.0, 0.05,-1.0,0.0,0.0,0.0,0.0, -0.05,1.0,0.0,0.0,0.0,0.0, 0.05,1.0,0.0,0.0,0.0,0.0,
	 -0.05,-2.0,0.0,0.0,0.0,0.0, 0.05,-2.0,0.0,0.0,0.0,0.0, -0.05,2.0,0.0,0.0,0.0,0.0, 0.05,2.0,0.0,0.0,0.0,0.0,
	 0.0,-0.05,-1.0,0.0,0.0,0.0, 0.0,0.05,-1.0,0.0,0.0,0.0, 0.0,-0.05,1.0,0.0,0.0,0.0, 0.0,0.05,1.0,0.0,0.0,0.0,
	 0.0,-0.05,-2.0,0.0,0.0,0.0, 0.0,0.05,-2.0,0.0,0.0,0.0, 0.0,-0.05,2.0,0.0,0.0,0.0, 0.0,0.05,2.0,0.0,0.0,0.0]);

var buffer1 = new Float32Array (
    [0.0,1.986,1.026,1.0,0.0,0.0,   -1.732,-1.013,0.986,1.0,0.0,0.0,   1.732,-1.013,0.986,1.0,0.0,0.0,
     0.0,1.986,-1.026,0.0,1.0,0.0,  -1.732,-1.013,-0.986,0.0,1.0,0.0,  1.732,-1.013,-0.986,0.0,1.0,0.0]);

var vertex_index_array = new Uint8Array([0,1,2,  0,2,5,   0,5,3,   0,1,3,   1,4,3,   1,2,4,   2,5,4,   5,3,4]);

var controls = new function() {

    this.camerax = 0;
	  this.cameray = 0;
    this.cameraz = 10;

    this.cuantos = 8;
	  this.primero = 0;

    this.proj = 2;
    this.p_left = -1;
    this.p_right = 1;
    this.p_bottom = -1;
    this.p_top = 1;
    this.p_near = 0.1;
    this.p_far = 20;
    this.fov = 60;
    this.translatex = 0;
    this.translatey = 0;
    this.translatez = 0;
    this.angle = 0;
    this.rotx = 0;
    this.roty = 1;
    this.rotz = 0;
    this.dotranslate = false;
    this.dorotate = false;

	this.updateScreen = function (e) {
        draw_triangles();
	}

    this.updateProj = function (e) {
      switch (e) {
        case "0":
          f4.open();
          f5.close();
          f6.close();
          break;
        case "1":
          f4.close();
          f5.open();
          f6.close();
          break;
        case "2":
          f4.close();
          f5.close();
          f6.open();
      }
	}

} // end controls


var gui = new dat.GUI();

var f1 = gui.addFolder('Camera');
    f1.add(controls, 'camerax', -20,20).onChange(controls.updateScreen);
    f1.add(controls, 'cameray', -20,20).onChange(controls.updateScreen);
    f1.add(controls, 'cameraz', -20,20).onChange(controls.updateScreen);

var f2 = gui.addFolder('Triángulos');
    f2.add(controls, 'cuantos', 1,8).step(1).onChange(controls.updateScreen);
    f2.add(controls, 'primero', 0,7).step(1).onChange(controls.updateScreen);

var f3 = gui.addFolder('Projection');
    f3.add(controls, 'proj', {Ortho: 0, Frustrum: 1, Perspect: 2}).onChange(controls.updateProj);

var f4 = gui.addFolder('Orthogonal');
    f4.add(controls,'p_left',-4,4).onChange(controls.updateScreen);
    f4.add(controls,'p_right',-4,4).onChange(controls.updateScreen);
    f4.add(controls,'p_bottom',-4,4).onChange(controls.updateScreen);
    f4.add(controls,'p_top',-4,4).onChange(controls.updateScreen);
    f4.add(controls,'p_near',-1,4).onChange(controls.updateScreen);
    f4.add(controls,'p_far',0,100).onChange(controls.updateScreen);

var f5 = gui.addFolder('Frustrum');
    f5.add(controls,'p_left',-4,4).onChange(controls.updateScreen);
    f5.add(controls,'p_right',-4,4).onChange(controls.updateScreen);
    f5.add(controls,'p_bottom',-4,4).onChange(controls.updateScreen);
    f5.add(controls,'p_top',-4,4).onChange(controls.updateScreen);
    f5.add(controls,'p_near',0.1,4).onChange(controls.updateScreen);
    f5.add(controls,'p_far',0.1,100).onChange(controls.updateScreen);

var f6 = gui.addFolder('Perspective');
    f6.add(controls, 'fov', 20,120).onChange(controls.updateScreen);
    f6.add(controls,'p_near',0.1,4).onChange(controls.updateScreen);
    f6.add(controls, 'p_far', 0.1,100).onChange(controls.updateScreen);

var f7 = gui.addFolder('Translation');
    f7.add(controls, 'dotranslate');
    f7.add(controls, 'translatex', -20,20).onChange(controls.updateScreen);
    f7.add(controls, 'translatey', -20,20).onChange(controls.updateScreen);
    f7.add(controls, 'translatez', -20,20).onChange(controls.updateScreen);

var f8 = gui.addFolder('Rotation');
    f8.add(controls, 'dorotate');
    f8.add(controls, 'angle', -90,90).onChange(controls.updateScreen);
    f8.add(controls, 'rotx', -1,1).onChange(controls.updateScreen);
    f8.add(controls, 'roty', -1,1).onChange(controls.updateScreen);
    f8.add(controls, 'rotz', -1,1).onChange(controls.updateScreen);

//f1.open();
//f2.open();
//f3.open();
//f6.open();



function draw_triangles() {

  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  var js_position = gl.getAttribLocation(gl.program, 'point_position');
  var js_color = gl.getAttribLocation(gl.program, 'point_color');
  var js_mat_transfo = gl.getUniformLocation(gl.program, 'mat_transfo');

  var cuantostriangulos = controls.cuantos;
  // Comprobación de seguridad por si se pide un número incoherente de inicio y triángulos
  if ((controls.primero + controls.cuantos) > 8)
    cuantostriangulos = controls.cuantos - controls.primero;

  var cuantosVertices = cuantostriangulos * 3;  // Tres vértices por cada triángulo que se pida representar

  var FSIZE = buffer1.BYTES_PER_ELEMENT;
  var FSIZE_EJES = ejes.BYTES_PER_ELEMENT;

  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
	  console.log("Error creating vertexBuffer");
  }

  var ejesBuffer = gl.createBuffer();
  if (!ejesBuffer) {
	  console.log("Error creating ejesBuffer");
  }

  var indicesBuffer = gl.createBuffer();
  if (!indicesBuffer) {
	  console.log("Error creating indicesBuffer");
  }

  // Now, compose the requested transforms and get the resultant matrix

  var matriz  = new Matrix4();
  matriz.setIdentity();

  if (controls.proj == 0)
    matriz.ortho( controls.p_left,    controls.p_right,
                  controls.p_bottom,  controls.p_top,
                  controls.p_near,    controls.p_far );

  if (controls.proj == 1)
    matriz.frustum( controls.p_left,    controls.p_right,
                    controls.p_bottom,  controls.p_top,
                    controls.p_near,    controls.p_far );

  if (controls.proj == 2)
    matriz.perspective( controls.fov, 1,
                        controls.p_near, controls.p_far );

  matriz.lookAt( controls.camerax, controls.cameray, controls.cameraz,
                 0, 0, 0, 0, 1, 0 );

  if (controls.dotranslate)
    matriz.translate(controls.translatex, controls.translatey, controls.translatez);

  if (controls.dorotate)
    matriz.rotate(controls.angle, controls.rotx, controls.roty, controls.rotz);

  gl.uniformMatrix4fv(js_mat_transfo, false, matriz.elements);


  // First, print the cartesian coordinate axis
  gl.bindBuffer(gl.ARRAY_BUFFER, ejesBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, ejes, gl.STATIC_DRAW);
  gl.vertexAttribPointer(js_position, 3, gl.FLOAT, false, FSIZE_EJES * 6, 0);
  gl.enableVertexAttribArray(js_position);
  gl.vertexAttribPointer(js_color, 3, gl.FLOAT, false, FSIZE_EJES * 6, FSIZE_EJES * 3);
  gl.enableVertexAttribArray(js_color);

  gl.clearColor(0.9, 1.0, 1.0, 1.0);

  // Clear <canvas>
  gl.enable(gl.DEPTH_TEST);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  //gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.LINES, 0, 36); //Draws cartesian axis


  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, buffer1, gl.STATIC_DRAW);
  gl.vertexAttribPointer(js_position, 3, gl.FLOAT, false, FSIZE * 6, 0);
  gl.enableVertexAttribArray(js_position);
  gl.vertexAttribPointer(js_color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
  gl.enableVertexAttribArray(js_color);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, vertex_index_array, gl.STATIC_DRAW);

  gl.drawElements(gl.TRIANGLES, cuantosVertices, gl.UNSIGNED_BYTE, controls.primero * 3);

  // Cleanup before exiting

  gl.disableVertexAttribArray(js_position);
  gl.disableVertexAttribArray(js_color);

  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.deleteBuffer(vertexBuffer);
  gl.deleteBuffer(ejesBuffer);

}
