// 5.js

// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 point_position; \n' +     // Gets vertex coordinates
  'attribute vec4 point_color; \n' +        // Gets vertex color
  'varying vec4 frag_color; \n' +           // Pass color to fragment shader
  'uniform mat4 trasformation_matrix; \n' +
  'void main() {\n' +
  '  gl_Position = trasformation_matrix * point_position;\n' +  // Set the vertex coordinates of the point
  '  frag_color = point_color;\n' +                             // Color fed from buffer goes to fragment shader
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float; \n' +
  'varying vec4 frag_color; \n' +
  'void main() {\n' +
  '  gl_FragColor = frag_color; \n' +                 // Sets the point color
  '}\n';

var axis = new Float32Array (
  [-1.0,0.0,0.0,1.0,0.0,0.0, 0.0,0.0,0.0,1.0,0.0,0.0, 0.0,0.0,0.0,0.0,0.0,0.0, 1.0,0.0,0.0,0.0,0.0,0.0,
	 0.0,-1.0,0.0,0.0,1.0,0.0, 0.0,0.0,0.0,0.0,1.0,0.0, 0.0,0.0,0.0,0.0,0.0,0.0, 0.0,1.0,0.0,0.0,0.0,0.0,
	 0.0,0.0,-1.0,0.0,0.0,1.0, 0.0,0.0,0.0,0.0,0.0,1.0, 0.0,0.0,0.0,0.0,0.0,0.0, 0.0,0.0,1.0,0.0,0.0,0.0,

	 -0.5,-0.05,0.0,0.0,0.0,0.0, -0.5,0.05,0.0,0.0,0.0,0.0, 0.5,-0.05,0.0,0.0,0.0,0.0, 0.5,0.05,0.0,0.0,0.0,0.0,
	 -0.05,-0.5,0.0,0.0,0.0,0.0, 0.05,-0.5,0.0,0.0,0.0,0.0, -0.05,0.5,0.0,0.0,0.0,0.0, 0.05,0.5,0.0,0.0,0.0,0.0,
	 0.0,-0.05,-0.5,0.0,0.0,0.0, 0.0,0.05,-0.5,0.0,0.0,0.0, 0.0,-0.05,0.5,0.0,0.0,0.0, 0.0,0.05,0.5,0.0,0.0,0.0,]
 );

var buffer1 = new Float32Array ([-0.3,0.0,-0.6,1.0,0.0,0.0,  0.3,0.0,-0.6,0.0,1.0,0.0, 0.0,0.3,-0.6,0.0,0.0,1.0]);


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
  var js_trasformation_matrix = gl.getUniformLocation(gl.program, 'trasformation_matrix');


  var numberOfVertices = 3;

  var FSIZE = buffer1.BYTES_PER_ELEMENT;

  var FSIZE_AXIS = axis.BYTES_PER_ELEMENT;


  // BUFFER Definitions

  var axisBuffer = gl.createBuffer();
  if (!axisBuffer) {
    console.log("Error creating axisBuffer");
  }

  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
	  console.log("Error creating vertexBuffer");
  }


  // Compose the requested transforms and get the resultant matrix
  // See the cuon-matrix library in lib/ folder
  var matriz  = new Matrix4();

  matriz.setIdentity();

  // Multiply (from the right) the ORTHOGRAFIC PROJECTION matrix.
  // parameters (left, right, bottom, top, near, far)
  //matriz.ortho(-1, 1, -1, 1, 0.0, 6);

  // Multiply (from the right) the PERSPECTIVE PROJECTION matrix by fovy and aspect
  // parameters       (fovy, aspect, near, far)
  //matriz.perspective(60, 1, 0.1, 10);

  // Multiply (from the right) the PERSPECTIVE PROJECTION matrix
  // parameters (left, right, bottom, top, near, far)
  matriz.frustum(-1, 1, -1, 1, 0.5, 6);

  // Multiply (from the right) the VIEWING matrix
  // parameters(position of eye point, position of reference point, direction of the up vector)
  //           (eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ)
  matriz.lookAt(0.5, 0.5, 1, 0, 0, -1,  0, 1, 0);

  // Multiply (from the right) a ROTATION matrix
  // parameters (rotation angle, coordinates of vector of rotation axis)
  //                (angle, x, y, z )
  //matriz.setRotate(45, 0, 0, 1); // Rota triángulos 45 grados

  gl.uniformMatrix4fv(js_trasformation_matrix, false, matriz.elements);


  // Specify the color for clearing <canvas> html element
  gl.clearColor(0.5, 1.0, 1.0, 1.0);
  // Clear <canvas>
  gl.enable(gl.DEPTH_TEST);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  //gl.clear(gl.COLOR_BUFFER_BIT);

  // Set axisBuffer
  gl.bindBuffer(gl.ARRAY_BUFFER, axisBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, axis, gl.STATIC_DRAW);
  gl.vertexAttribPointer(js_position, 3, gl.FLOAT, false, FSIZE_AXIS * 6, 0);
  gl.enableVertexAttribArray(js_position);
  gl.vertexAttribPointer(js_color, 3, gl.FLOAT, false, FSIZE_AXIS * 6, FSIZE_AXIS * 3);
  gl.enableVertexAttribArray(js_color);

  // Draws cartesian axis
  gl.drawArrays(gl.LINES, 0, 24);

  // Set vertexBuffer
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, buffer1, gl.STATIC_DRAW);
  gl.vertexAttribPointer(js_position, 3, gl.FLOAT, false, FSIZE * 6, 0);
  gl.enableVertexAttribArray(js_position);
  gl.vertexAttribPointer(js_color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
  gl.enableVertexAttribArray(js_color);

  // Draw primitive
  gl.drawArrays(gl.TRIANGLES, 0, numberOfVertices);
  //gl.drawArrays(gl.POINTS, 0, numberOfVertices);


  // Cleanup before exiting
  gl.disableVertexAttribArray(js_position);
  gl.disableVertexAttribArray(js_color);

  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.deleteBuffer(vertexBuffer);
  gl.deleteBuffer(axisBuffer);
}
