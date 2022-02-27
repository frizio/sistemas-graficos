// Prueba1.js
// One variable to store both position and color information

// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 point_position; \n' + // Gets vertex coordinates
  'attribute vec4 point_color; \n' +    // Gets vertex color
  'varying vec4 frag_color; \n' +       // Pass color to fragment shader
  'uniform int point_axis; \n' +
  'void main() {\n' +
  'if (point_axis == 1) { \n' +
  '  gl_Position = point_position; \n' +
  '  frag_color = vec4(0.0, 0.0, 0.0, 1.0); \n' +
  ' } else { \n' +
  '  gl_Position = point_position;\n' + // Set the vertex coordinates of the point
  '  frag_color = point_color;\n' +     // Color fed from buffer goes to fragment shader
  '  gl_PointSize = 5.0;\n' +          // Set the point size
  ' } \n' +
  '}\n';


// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float; \n' +
  'varying vec4 frag_color; \n' +
  'void main() {\n' +
  '  gl_FragColor = frag_color; \n' + // Sets the point color
  '}\n';


// Local Javascript variables contains the initial informations

// Axis
var axis = new Float32Array ([-1.0,0.0, 1.0,0.0, 0.0,-1.0, 0.0,1.0]);

// Remember, in this case: single buffer for position (first 2 elements) and color (last 3 elements)
// One point
var numberOfVertices = 1;
var vertexArray = new Float32Array ([-0.9, 0.9,  0.0, 0.2, 0.8]);

//
var FSIZE = vertexArray.BYTES_PER_ELEMENT;


function main() {

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

  // Javascript - Shareds communication variables
  var js_axis = gl.getUniformLocation(gl.program, 'point_axis');
  var js_position = gl.getAttribLocation(gl.program, 'point_position');
  var js_color = gl.getAttribLocation(gl.program, 'point_color');

  // BUFFER Definitions

  // Axis Buffer
  var axisBuffer = gl.createBuffer();
  if (!axisBuffer) {
	  console.log("Error creating axisBuffer");
  }

  // Vertex Buffer
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
	  console.log("Error creating buffer");
  }


  // Specify the color for clearing <canvas> html element
  gl.clearColor(0.9, 0.9, 0.9, 1.0);
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Set axisBuffer
  gl.bindBuffer(gl.ARRAY_BUFFER, axisBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, axis, gl.STATIC_DRAW);
  gl.vertexAttribPointer(js_position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(js_position);
  gl.uniform1i(js_axis, 1);

  //Draws cartesian axis
  gl.drawArrays(gl.LINES, 0, 4);

  gl.uniform1i(js_axis, 0);


  // Set vertexBuffer
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertexArray, gl.STATIC_DRAW);
  // Copy position (first 2 element)
  gl.vertexAttribPointer(js_position, 2, gl.FLOAT, false, FSIZE * 5, 0);
  gl.enableVertexAttribArray(js_position);
  // Copy color (3 elements, start from element 2)
  gl.vertexAttribPointer(js_color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);
  gl.enableVertexAttribArray(js_color);

  // Draw the point
  gl.drawArrays(gl.POINTS, 0, numberOfVertices);
  //gl.drawArrays(gl.TRIANGLES, 0, numberOfVertices);

  // Cleanup before exiting
  gl.disableVertexAttribArray(js_axis);
  gl.disableVertexAttribArray(js_position);
  gl.disableVertexAttribArray(js_color);

  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  gl.deleteBuffer(vertexBuffer);
  gl.deleteBuffer(colorBuffer);
  gl.deleteBuffer(axisBuffer);

}
