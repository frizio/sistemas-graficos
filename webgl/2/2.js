// 2.js

// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 point_position; \n' + // Gets vertex coordinates
  'attribute vec4 point_color; \n' +    // Gets vertex color
  'varying vec4 frag_color; \n' +       // Pass color to fragment shader
  'void main() {\n' +
  '  gl_Position = point_position;\n' + // Set the vertex coordinates of the point
  '  frag_color = point_color;\n' +     // Color fed from buffer goes to fragment shader
  '  gl_PointSize = 10.0;\n' +          // Set the point size
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float; \n' +
  'varying vec4 frag_color; \n' +
  'void main() {\n' +
  '  gl_FragColor = frag_color; \n' + // Sets the point color
  '}\n';


var numbuffer = 1;

// Chooses first of the two buffer sets
// The origin (0,0) is on the center of the canvas.
var buffer1_position = new Float32Array ([-0.9,0.9,  0.0,0.2,  0.9,0.9,
                                          -0.9,-0.9, 0.0,-0.2, 0.9,-0.9]);

var buffer1_color = new Float32Array ([1.0,0.0,0.0, 0.0,0.0,1.0, 0.0,1.0,0.0,
                                       0.0,1.0,0.0, 0.0,0.0,1.0, 1.0,0.0,0.0]);

var buffer2 = new Float32Array ([-0.9,0.9,1.0,0.0,0.0,  -0.7,0.0,0.0,1.0,0.0, -0.9,-0.9,0.0,0.0,1.0,
                                  0.9,0.9,1.0,0.0,0.0,   0.7,0.0,0.0,1.0,0.0,  0.9,-0.9,0.0,0.0,1.0]);


function draw_triangles() {

  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL (see cuon-utils.js)
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

  var cuantosVertices = 6;

  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
	  console.log("Error creating buffer");
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

  if (numbuffer == 1) {
	  gl.bufferData(gl.ARRAY_BUFFER, buffer1_position, gl.STATIC_DRAW);
    gl.vertexAttribPointer(js_position, 2, gl.FLOAT, false, 0, 0);
	  gl.enableVertexAttribArray(js_position);
	  var colorBuffer = gl.createBuffer();
	  if (!colorBuffer) {
		  console.log("Error creating color buffer");
	  }
	  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	  gl.bufferData(gl.ARRAY_BUFFER, buffer1_color, gl.STATIC_DRAW);
	  gl.vertexAttribPointer(js_color, 3, gl.FLOAT, false, 0, 0);
	  gl.enableVertexAttribArray(js_color);
  }
  else {
	  gl.bufferData(gl.ARRAY_BUFFER, buffer2, gl.STATIC_DRAW);
	  var FSIZE = buffer2.BYTES_PER_ELEMENT;
	  gl.vertexAttribPointer(js_position, 2, gl.FLOAT, false, FSIZE * 5, 0);
	  gl.enableVertexAttribArray(js_position);
	  gl.vertexAttribPointer(js_color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);
	  gl.enableVertexAttribArray(js_color);
  }

  // gl.viewport(400,400,400,400);
  // Specify the color for clearing <canvas>
  gl.clearColor(0.9, 1.0, 1.0, 1.0);
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw the primitives
  gl.drawArrays(gl.POINTS, 0, cuantosVertices);

  //gl.drawArrays(gl.LINES, 0, cuantosVertices);
  //gl.drawArrays(gl.LINE_STRIP, 0, cuantosVertices);
  //gl.drawArrays(gl.LINE_LOOP, 0, cuantosVertices);

  //gl.drawArrays(gl.TRIANGLES, 0, cuantosVertices);
  //gl.drawArrays(gl.TRIANGLE_STRIP, 0, cuantosVertices);
  //gl.drawArrays(gl.TRIANGLE_FAN, 0, cuantosVertices);

  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.deleteBuffer(vertexBuffer);
  if (numbuffer == 1)
    gl.deleteBuffer(colorBuffer);

} // end draw_triangles()


function switch_set() {

	if (numbuffer == 1)
	  numbuffer = 2;
  else
	  numbuffer = 1;
  draw_triangles();

}
