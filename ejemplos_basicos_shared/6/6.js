// 2.js
// Vertex shader program
var VSHADER_SOURCE = 
  'attribute vec4 point_position; \n' + // Gets vertex coordinates
  'attribute vec4 point_color; \n' + // Gets vertex color
  'varying vec4 frag_color; \n' + // Pass color to fragment shader
  'uniform mat4 mat_transfo; \n' +
  'void main() {\n' +
  '  gl_Position = mat_transfo * point_position;\n' + // Set the vertex coordinates of the point
  '  frag_color = point_color;\n' + // Color fed from buffer goes to fragment shader
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float; \n' +
  'varying vec4 frag_color; \n' +
  'void main() {\n' +
  '  gl_FragColor = frag_color; \n' + // Sets the point color
  '}\n';

var ejes = new Float32Array ([-1.0,0.0,0.0,1.0,0.0,0.0, 0.0,0.0,0.0,1.0,0.0,0.0, 0.0,0.0,0.0,0.0,0.0,0.0, 1.0,0.0,0.0,0.0,0.0,0.0,
	0.0,-1.0,0.0,0.0,1.0,0.0, 0.0,0.0,0.0,0.0,1.0,0.0, 0.0,0.0,0.0,0.0,0.0,0.0, 0.0,1.0,0.0,0.0,0.0,0.0,
	0.0,0.0,-1.0,0.0,0.0,1.0, 0.0,0.0,0.0,0.0,0.0,1.0, 0.0,0.0,0.0,0.0,0.0,0.0, 0.0,0.0,1.0,0.0,0.0,0.0,
	
	-0.5,-0.05,0.0,0.0,0.0,0.0, -0.5,0.05,0.0,0.0,0.0,0.0, 0.5,-0.05,0.0,0.0,0.0,0.0, 0.5,0.05,0.0,0.0,0.0,0.0,
	-0.05,-0.5,0.0,0.0,0.0,0.0, 0.05,-0.5,0.0,0.0,0.0,0.0, -0.05,0.5,0.0,0.0,0.0,0.0, 0.05,0.5,0.0,0.0,0.0,0.0,
	0.0,-0.05,-0.5,0.0,0.0,0.0, 0.0,0.05,-0.5,0.0,0.0,0.0, 0.0,-0.05,0.5,0.0,0.0,0.0, 0.0,0.05,0.5,0.0,0.0,0.0,]);

var buffer1 = new Float32Array ([-0.3,0.0,-0.6,1.0,0.0,0.0,  0.3,0.0,-0.6,0.0,1.0,0.0, 0.0,0.3,-0.6,0.0,0.0,1.0, 
0.3,0.3,-0.3,1.0,0.0,0.0,  -0.3,-0.3,-0.3,0.0,1.0,0.0,  -0.3,0.3,-0.3,0.0,0.0,1.0]);

var vertex_index_array = new Uint8Array([0,1,2, 3,4,5]);


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
  

  
  
  var cuantosVertices = 6;
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
  //matriz.ortho(-1, 1, -1, 1, 0.0, 6);
  //matriz.perspective(60, 1, 0.1, 10);
  //matriz.frustum(-1, 1, -1, 1, 0.5, 6);
  //matriz.lookAt(0.5, 0.5, 1, 0, 0, -1, 0,1,0);
  //matriz.setRotate(45,0,0,1); // Rota triángulos 45 grados
  
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
  gl.drawArrays(gl.LINES, 0, 24); //Draws cartesian axis
 
  
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, buffer1, gl.STATIC_DRAW);
  gl.vertexAttribPointer(js_position, 3, gl.FLOAT, false, FSIZE * 6, 0);
  gl.enableVertexAttribArray(js_position);
  gl.vertexAttribPointer(js_color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
  gl.enableVertexAttribArray(js_color);
  
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, vertex_index_array, gl.STATIC_DRAW);
  
  
  gl.drawElements(gl.TRIANGLES, cuantosVertices, gl.UNSIGNED_BYTE, 0);
  
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
  add_translate += 0.1;
  draw_triangles();		
}
function scale() {
  add_scale += 0.1
  draw_triangles();		
}
function alltogether() {
  angulo = angulo + 5;
  add_translate += 0.01;
  add_scale += 0.05;
  draw_triangles();		
}


