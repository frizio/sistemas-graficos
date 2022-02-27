// 2.js
// Vertex shader program
var VSHADER_SOURCE = 
  'attribute vec4 point_position; \n' + // Gets vertex coordinates
  'attribute vec4 point_color; \n' + // Gets vertex color
  'varying vec4 frag_color; \n' + // Pass color to fragment shader
  'uniform mat4 mat_transfo; \n' +
  'uniform int point_ejes; \n' +
  'void main() {\n' +
  'if (point_ejes == 1) { \n' +
  '  gl_Position = point_position; \n' +
  '  frag_color = vec4(0.0, 0.0, 0.0, 1.0); \n' +
  ' } else { \n' +
  '  gl_Position = mat_transfo * point_position;\n' + // Set the vertex coordinates of the point
  '  frag_color = point_color;\n' + // Color fed from buffer goes to fragment shader
  ' } \n' +
  
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float; \n' +
  'varying vec4 frag_color; \n' +
  'void main() {\n' +
  '  gl_FragColor = frag_color; \n' + // Sets the point color
  '}\n';

var ejes = new Float32Array ([-1.0,0.0, 1.0,0.0, 0.0,-1.0, 0.0, 1.0]);
var buffer1 = new Float32Array ([-0.3,0.3,1.0,0.0,0.0,  -0.3,0.1,0.0,1.0,0.0, 0.0,0.3,0.0,0.0,1.0]);
var angulo = 0;  // Accumulated angle to rotate
var add_translate = 0;  // Accumulated length to translate
var add_scale = 1; // Accumulated scale factor



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
  var js_ejes = gl.getUniformLocation(gl.program, 'point_ejes');

  
  
  var cuantosVertices = 3;
  var FSIZE = buffer1.BYTES_PER_ELEMENT;
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
	  console.log("Error creating vertexBuffer");
  }
  var ejesBuffer = gl.createBuffer();
  if (!ejesBuffer) {
	  console.log("Error creating ejesBuffer");
  }
  
  // First, print the cartesian coordinate axis
  
  gl.bindBuffer(gl.ARRAY_BUFFER, ejesBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, ejes, gl.STATIC_DRAW);
  gl.vertexAttribPointer(js_position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(js_position);
  gl.uniform1i(js_ejes, 1);
  
  gl.clearColor(0.9, 1.0, 1.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.LINES, 0, 4); //Draws cartesian axis
  
  
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, buffer1, gl.STATIC_DRAW);
  gl.vertexAttribPointer(js_position, 2, gl.FLOAT, false, FSIZE * 5, 0);
  gl.enableVertexAttribArray(js_position);
  gl.vertexAttribPointer(js_color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);
  gl.enableVertexAttribArray(js_color);
  gl.uniform1i(js_ejes, 0);

  // Now, compose the requested transforms and get the resultant matrix
  
  var matriz  = new Matrix4();
  // We don't know which transform is requested, so we start with identity matrix
  matriz.setIdentity();
  // Order (fixed) will be scale, then translate, then rotate
  if (angulo > 0) matriz.rotate(angulo,0,0,1);
  if (add_translate > 0) matriz.translate(add_translate, add_translate, 0);
  if (add_scale > 1) matriz.scale(add_scale,add_scale,1);
  
  gl.uniformMatrix4fv(js_mat_transfo, false, matriz.elements);
  
  // Specify the color for clearing <canvas>
 
  gl.drawArrays(gl.TRIANGLES, 0, cuantosVertices);
  
  // Cleanup before exiting
  
  gl.disableVertexAttribArray(js_position);
  gl.disableVertexAttribArray(js_color);

  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.deleteBuffer(vertexBuffer);
  gl.deleteBuffer(ejesBuffer);
  

    
}

function rotate() {
  angulo = angulo + 5;
  draw_triangles();		
}

function translate() {
  add_translate += 0.05;
  draw_triangles();		
}
function scale() {
  add_scale += 0.05
  draw_triangles();		
}
function alltogether() {
  angulo = angulo + 5;
  add_translate += 0.05;
  add_scale += 0.05;
  draw_triangles();		
}


