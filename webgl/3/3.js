// 2.js
// Vertex shader program
var VSHADER_SOURCE = 
  'attribute vec4 point_position; \n' + // Gets vertex coordinates
  'attribute vec4 point_color; \n' + // Gets vertex color
  'attribute float down_offset; \n' +
  'varying vec4 frag_color; \n' + // Pass color to fragment shader
  'void main() {\n' +
  '  gl_Position = point_position;\n' + // Set the vertex coordinates of the point
  '  if (gl_Position.x == 0.3) gl_Position.y -= down_offset; \n' + 
  '  frag_color = point_color;\n' + // Color fed from buffer goes to fragment shader
  '  gl_PointSize = 10.0;\n' +                    // Set the point size
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float; \n' +
  'varying vec4 frag_color; \n' +
  'void main() {\n' +
  '  gl_FragColor = frag_color; \n' + // Sets the point color
  '}\n';


var buffer1 = new Float32Array ([-0.9,0.9,1.0,0.0,0.0,  -0.9,0.7,0.0,1.0,0.0, 
-0.3,0.9,0.0,0.0,1.0, -0.3,0.7,1.0,0.0,0.0, 0.3,0.9,0.0,1.0,0.0, 0.3,0.7,0.0,0.0,1.0, 0.9,0.9,1.0,0.0,0.0, 0.9,0.7,0.0,1.0,0.0,]);

var cual_offset = 0.0;

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
  var js_offset = gl.getAttribLocation(gl.program, 'down_offset');
  
  var cuantosVertices = 8;
  var FSIZE = buffer1.BYTES_PER_ELEMENT;
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
	  console.log("Error creating buffer");
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, buffer1, gl.STATIC_DRAW);
  gl.vertexAttribPointer(js_position, 2, gl.FLOAT, false, FSIZE * 5, 0);
  gl.enableVertexAttribArray(js_position);
  gl.vertexAttribPointer(js_color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);
  gl.enableVertexAttribArray(js_color);
  gl.vertexAttrib1f(js_offset, cual_offset);
  
  // Specify the color for clearing <canvas>
  gl.clearColor(0.9, 1.0, 1.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, cuantosVertices);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.deleteBuffer(vertexBuffer);
    
}

function switch_set() {
  cual_offset += 0.1;
  draw_triangles();		
}
