// 4normales.js

// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 point_position; \n' + // Gets vertex coordinates
  'attribute vec4 point_color; \n' + // Gets vertex color
  'varying vec4 frag_color; \n' + // Pass color to fragment shader
  'uniform mat4 mat_transfo; \n' +
  'uniform int point_ejes; \n' +
  'void main() {\n' +
  'if (point_ejes == 0) { \n' +
  '  gl_Position = mat_transfo * point_position; \n' +  // Normals
  '  frag_color = vec4(0.0, 0.0, 0.0, 1.0); \n' +
  '} else if (point_ejes == 1) { \n' +
  '    gl_Position = point_position; \n' +
  '    frag_color = vec4(0.0, 0.0, 0.0, 1.0); \n' +
  '} else if (point_ejes == 2) { \n' +
  '    gl_Position = mat_transfo * point_position; \n' +
  '    frag_color = vec4(0.0, 1.0, 0.0, 1.0); \n' +  // Good normals
  '} else { \n' +
  '    gl_Position = mat_transfo * point_position;\n' + // Set the vertex coordinates of the point
  '    frag_color = point_color;\n' + // Color fed from buffer goes to fragment shader
  ' } \n' +

  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float; \n' +
  'varying vec4 frag_color; \n' +
  'void main() {\n' +
  '  gl_FragColor = frag_color; \n' + // Sets the point color
  '}\n';

var ejes = new Float32Array ([-1.0,0.0,1.0,0.0,   0.0,-1.0,0.0,1.0]);
var buffer1 = new Float32Array ([-0.3,0.3,1.0,0.0,0.0,  -0.3,0.1,0.0,1.0,0.0, 0.0,0.3,0.0,0.0,1.0]);
var normales = new Float32Array ([-0.35,0.2,-0.3,0.2,  -0.15,0.35,-0.15,0.3]);  // Normals
var angulo = 0;  // Accumulated angle to rotate
var add_translate = 0;  // Accumulated length to translate
var add_scale = 1; // Accumulated scale factor
var init_run = 0; //Signals if we are in initial run
var num_operaciones = 0;
var only_n_operations = 0;
var start_operation = 0;
var change_order = false;



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

  var normalesBuffer = gl.createBuffer();
  if (!normalesBuffer) {
	  console.log("Error creating normalesBuffer");
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

  gl.bindBuffer(gl.ARRAY_BUFFER, normalesBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, normales, gl.STATIC_DRAW);
  gl.vertexAttribPointer(js_position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(js_position);
  gl.uniform1i(js_ejes, 1);  // Do not use transformation matrix; draw using procedure for axis
  gl.drawArrays(gl.LINES, 0, 4); //Draws normals


  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, buffer1, gl.STATIC_DRAW);
  gl.vertexAttribPointer(js_position, 2, gl.FLOAT, false, FSIZE * 5, 0);
  gl.enableVertexAttribArray(js_position);
  gl.vertexAttribPointer(js_color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);
  gl.enableVertexAttribArray(js_color);
  gl.uniform1i(js_ejes, 3);

  // Now, compose the requested transforms and get the resultant matrix

  var matriz  = new Matrix4();
  var matrixnormals = new Matrix4();
  // We don't know which transform is requested, so we start with identity matrix
  matriz.setIdentity();
  var cadena_transformaciones = "";
  if (init_run == 1)
  {
	  // Transform matrix computed only in second run
		var num_orden_transfo = 1;
    var starting_operation = num_operaciones - start_operation;
		var ending_operation = starting_operation - only_n_operations + 1;
    // Value of only_n_operations has been set to the right number of operations in the button event handler
		if (!change_order){
			for (var i = starting_operation; i >=  ending_operation ; i--) {
				var operacion_requerida = secuencia_operaciones[i][0];
				switch (operacion_requerida) {
					case "t":
						// Translation
						var x_value = secuencia_operaciones[i][1]/100.0;
						var y_value = secuencia_operaciones[i][2]/100.0;
						matriz.translate(x_value, y_value, 0);
						cadena_transformaciones += "M" + num_orden_transfo.toString() + " =  t" + "  " + x_value.toString() + "  " + y_value.toString() + "<br><br>";
						break;
					case "s":
						// Scale
						var x_scale = secuencia_operaciones[i][3];
						var y_scale = secuencia_operaciones[i][4];
						matriz.scale(x_scale, y_scale,1);
						cadena_transformaciones += "M" + num_orden_transfo.toString() + " =  s" + "  " + x_scale.toString() + "  " + y_scale.toString() + "<br><br>";
						break;
					case "r":
						// Rotate
						var rot_angle = secuencia_operaciones[i][5];
						var rot_x_axis = secuencia_operaciones[i][6];
						var rot_y_axis = secuencia_operaciones[i][7];
						matriz.rotate(rot_angle, rot_x_axis, rot_y_axis,1);
						cadena_transformaciones += "M" + num_orden_transfo.toString() + " =  r" + "  " + rot_angle.toString() + "  " + rot_x_axis.toString() + "  " + rot_y_axis.toString() + "<br><br>";
						break;
					default:
					// Format error
						document.writeln("Wrong operation specifier, " + operacion_requerida);
						return;
				}
				num_orden_transfo += 1;
			}
		} else {
			for (var i = ending_operation; i <=  starting_operation ; i++) {
				var operacion_requerida = secuencia_operaciones[i][0];
				switch (operacion_requerida) {
					case "t":
						// Translation
						var x_value = secuencia_operaciones[i][1]/100.0;
						var y_value = secuencia_operaciones[i][2]/100.0;
						matriz.translate(x_value, y_value, 0);
						cadena_transformaciones += "M" + num_orden_transfo.toString() + " =  t" + "  " + x_value.toString() + "  " + y_value.toString() + "<br><br>";
						break;
					case "s":
						// Scale
						var x_scale = secuencia_operaciones[i][3];
						var y_scale = secuencia_operaciones[i][4];
						matriz.scale(x_scale, y_scale,1);
						cadena_transformaciones += "M" + num_orden_transfo.toString() + " =  s" + "  " + x_scale.toString() + "  " + y_scale.toString() + "<br><br>";
						break;
					case "r":
						// Rotate
						var rot_angle = secuencia_operaciones[i][5];
						var rot_x_axis = secuencia_operaciones[i][6];
						var rot_y_axis = secuencia_operaciones[i][7];
						matriz.rotate(rot_angle, rot_x_axis, rot_y_axis,1);
						cadena_transformaciones += "M" + num_orden_transfo.toString() + " =  r" + "  " + rot_angle.toString() + "  " + rot_x_axis.toString() + "  " + rot_y_axis.toString() + "<br><br>";
						break;
					default:
					// Format error
						document.writeln("Wrong operation specifier, " + operacion_requerida);
						return;
				}
				num_orden_transfo += 1;
			}
		}
  }
  else {
    // Initialize number of operations and start operation
    num_operaciones = secuencia_operaciones.length;
    document.getElementById("numops").value = num_operaciones.toString();
    document.getElementById("numstart").value = "1";
		for (var i = 0; i < num_operaciones; i++){
			cadena_transformaciones += "TR" + (num_operaciones - i).toString() + " = [" + secuencia_operaciones [i] + "]<br>";
		}
  }
  gl.uniformMatrix4fv(js_mat_transfo, false, matriz.elements);

  // Specify the color for clearing <canvas>

  gl.drawArrays(gl.TRIANGLES, 0, cuantosVertices);

  gl.disableVertexAttribArray(js_position);
  gl.disableVertexAttribArray(js_color);

  // Wrong normals are now drawn

  gl.bindBuffer(gl.ARRAY_BUFFER, normalesBuffer);
  gl.vertexAttribPointer(js_position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(js_position);
  gl.uniform1i(js_ejes, 0);  // Use transformation matrix also for normals
  gl.drawArrays(gl.LINES, 0, 4); //Draws transformed normals

  // Right normal transformation matrix is calculated

  matrixnormals.setInverseOf(matriz);
  matrixnormals.transpose();
  gl.uniformMatrix4fv(js_mat_transfo, false, matrixnormals.elements);

  // Now, right normals are drawn

  gl.uniform1i(js_ejes, 2);  // Use right normal transformation matrix
  gl.drawArrays(gl.LINES, 0, 4); //Draws rightly transformed normals

  var e = matriz.elements;
    cadena_transformaciones += "<table style=\"text-align: left;\" border=\"1\" cellpadding=\"2\" cellspacing=\"2\"><tbody><tr><td>" + replace_dot(e[0]) + "</td><td>" + replace_dot(e[4]) + "</td><td>" + replace_dot(e[8]) + "</td><td>" + replace_dot(e[12]) + "</td></tr><br><br>" +
        "<tr><td>"  + replace_dot(e[1]) + "</td><td>" + replace_dot(e[5]) + "</td><td>" + replace_dot(e[9]) + "</td><td>" + replace_dot(e[13]) + "</td></tr><br><br>" +
        "<tr><td>" + replace_dot(e[2]) + "</td><td>" + replace_dot(e[6]) + "</td><td>" + replace_dot(e[10]) + "</td><td>" + replace_dot(e[14]) + "</td></tr><br><br>" +
        "<tr><td>" + replace_dot(e[3]) + "</td><td>" + replace_dot(e[7]) + "</td><td>" + replace_dot(e[11]) + "</td><td>" + replace_dot(e[15]) + "</td></tr></tbody></table><br><br>";
  var e_n = matrixnormals.elements;
  cadena_transformaciones += "<br><table style=\"text-align: left;\" border=\"1\" cellpadding=\"2\" cellspacing=\"2\"><tbody><tr><td>" + replace_dot(e_n[0]) + "</td><td>" + replace_dot(e_n[4]) + "</td><td>" + replace_dot(e_n[8]) + "</td><td>" + replace_dot(e_n[12]) + "</td></tr><br><br>" +
        "<tr><td>"  + replace_dot(e_n[1]) + "</td><td>" + replace_dot(e_n[5]) + "</td><td>" + replace_dot(e_n[9]) + "</td><td>" + replace_dot(e_n[13]) + "</td></tr><br><br>" +
        "<tr><td>" + replace_dot(e_n[2]) + "</td><td>" + replace_dot(e_n[6]) + "</td><td>" + replace_dot(e_n[10]) + "</td><td>" + replace_dot(e_n[14]) + "</td></tr><br><br>" +
        "<tr><td>" + replace_dot(e_n[3]) + "</td><td>" + replace_dot(e_n[7]) + "</td><td>" + replace_dot(e_n[11]) + "</td><td>" + replace_dot(e_n[15]) + "</td></tr></tbody></table><br><br>";

  document.getElementById("mensajes").innerHTML = cadena_transformaciones;

  // Cleanup before exiting

  gl.disableVertexAttribArray(js_position);
  gl.disableVertexAttribArray(js_color);

  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.deleteBuffer(vertexBuffer);
  gl.deleteBuffer(ejesBuffer);
  gl.deleteBuffer(normalesBuffer);



}

function alltogether() {
init_run = 1;
only_n_operations = secuencia_operaciones.length; // Execute all operations required in array
start_operation = 1;  // Start from first operation in array
if (document.getElementById("inverse_order").checked) change_order = true;
  draw_triangles();
}

function partialexec() {
  init_run = 1;
  only_n_operations = parseInt(document.getElementById("numops").value); // Execute only the number of operations specified in input field
  if ((only_n_operations < 1) || (only_n_operations > num_operaciones)) {
      document.writeln("Invalid number of operations, " + only_n_operations.toString());
      return;
  }
  start_operation = parseInt(document.getElementById("numstart").value); // Start at operation specified in input field
  if (start_operation < 1){
      document.writeln("Invalid value for start operation, " + start_operation.toString());
      return;
    }
  else if ((start_operation + only_n_operations - 1) > secuencia_operaciones.length){
    document.writeln("Invalid combination of values  for start operation (" + (start_operation).toString() + ") and only_n_operations (" + only_n_operations.toString() + ")");
    return;
  }
if (document.getElementById("inverse_order").checked) change_order = true;
  draw_triangles();
}

function replace_dot(e) {
	return e.toString().replace('.',',');
}
