// 6.js
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 point_position; \n' + // Gets vertex coordinates
  'attribute vec4 point_color; \n' +    // Gets vertex color
  'varying vec4 frag_color; \n' +       // Pass color to fragment shader
  'uniform int point_axis; \n' +
  'uniform mat4 trasformation_matrix; \n' +
  'uniform mat4 axis_trasformation_matrix; \n' +
  'void main() {\n' +
  'if (point_axis == 1) { \n' +
  '  gl_Position = axis_trasformation_matrix * point_position; \n' +      // '  gl_Position = point_position; \n' +
  '  frag_color = point_color;\n' +                                       //'  frag_color = vec4(0.0, 0.0, 0.0, 1.0); \n' +
  ' } else { \n' +
  '  gl_Position = trasformation_matrix * point_position;\n' +   // Set the vertex coordinates of the point
  '  frag_color = point_color;\n' +                             // Color fed from buffer goes to fragment shader
  ' } \n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float; \n' +
  'varying vec4 frag_color; \n' +
  'void main() {\n' +
  '  gl_FragColor = frag_color; \n' +                   // Sets the point color
  '}\n';

var axis = new Float32Array (
    [-4.0,0.0,0.0,1.0,0.0,0.0, 0.0,0.0,0.0,1.0,0.0,0.0, 0.0,0.0,0.0,0.0,0.0,0.0, 4.0,0.0,0.0,0.0,0.0,0.0,
	    0.0,-4.0,0.0,0.0,1.0,0.0, 0.0,0.0,0.0,0.0,1.0,0.0, 0.0,0.0,0.0,0.0,0.0,0.0, 0.0,4.0,0.0,0.0,0.0,0.0,
	    0.0,0.0,-4.0,0.0,0.0,1.0, 0.0,0.0,0.0,0.0,0.0,1.0, 0.0,0.0,0.0,0.0,0.0,0.0, 0.0,0.0,4.0,0.0,0.0,0.0,

  	 -1.0,-0.05,0.0,0.0,0.0,0.0, -1.0,0.05,0.0,0.0,0.0,0.0, 1.0,-0.05,0.0,0.0,0.0,0.0, 1.0,0.05,0.0,0.0,0.0,0.0,
  	 -2.0,-0.05,0.0,0.0,0.0,0.0, -2.0,0.05,0.0,0.0,0.0,0.0, 2.0,-0.05,0.0,0.0,0.0,0.0, 2.0,0.05,0.0,0.0,0.0,0.0,
  	 -0.05,-1.0,0.0,0.0,0.0,0.0, 0.05,-1.0,0.0,0.0,0.0,0.0, -0.05,1.0,0.0,0.0,0.0,0.0, 0.05,1.0,0.0,0.0,0.0,0.0,
  	 -0.05,-2.0,0.0,0.0,0.0,0.0, 0.05,-2.0,0.0,0.0,0.0,0.0, -0.05,2.0,0.0,0.0,0.0,0.0, 0.05,2.0,0.0,0.0,0.0,0.0,
  	 0.0,-0.05,-1.0,0.0,0.0,0.0, 0.0,0.05,-1.0,0.0,0.0,0.0, 0.0,-0.05,1.0,0.0,0.0,0.0, 0.0,0.05,1.0,0.0,0.0,0.0,
  	 0.0,-0.05,-2.0,0.0,0.0,0.0, 0.0,0.05,-2.0,0.0,0.0,0.0, 0.0,-0.05,2.0,0.0,0.0,0.0, 0.0,0.05,2.0,0.0,0.0,0.0]);

var vertexArray = new Float32Array (
    [0.0,1.986,1.026,1.0,0.0,0.0,   -1.732,-1.013,0.986,1.0,0.0,0.0,   1.732,-1.013,0.986,1.0,0.0,0.0,
     0.0,1.986,-1.026,0.0,1.0,0.0,  -1.732,-1.013,-0.986,0.0,1.0,0.0,  1.732,-1.013,-0.986,0.0,1.0,0.0]);

var vertexIndexArray = new Uint8Array([0,1,2,  0,2,5,   0,5,3,   0,1,3,   1,4,3,   1,2,4,   2,5,4,   5,3,4]);

// Initial point of view (initially the same)
var initialPointOfView = new Float32Array ([5, 5, 10]);


var init_run = 0;           // Signals if we are in initial run

  var num_operaciones = 0;
  var only_n_operations = 0;
  var start_operation = 0;

  var change_order = false;

  var angulo = 0;             // Accumulated angle to rotate
  var add_translate = 0;      // Accumulated length to translate
  var add_scale = 1;          // Accumulated scale factor


var controls = new function() {

  // Camera
  this.camerax = initialPointOfView[0];
	this.cameray = initialPointOfView[1];
	this.cameraz = initialPointOfView[2];
  // Triangulo
  this.cuantos = 8;
	this.primero = 0;
  // Projection
  this.proj = 2;
  // Orthographic and Frustum
  this.p_left = -1;
  this.p_right = 1;
  this.p_bottom = -1;
  this.p_top = 1;
  this.p_near = 1; // 0.1
  this.p_far = 60;
  // Perspective
  this.fov = 40;  //
  // Translation
  this.dotranslate = false;
  this.translatex = 0;
  this.translatey = 0;
  this.translatez = 0;
  // Rotation
  this.dorotate = false;
  this.angle = 0;
  this.rotx = 0;
  this.roty = 1;
  this.rotz = 0;

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
      f3.add(controls, 'proj', {ortho: 0, frustum: 1, perspective: 2}).onChange(controls.updateProj);

  var f4 = gui.addFolder('Orthographic');
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

  f1.open();
  f2.open();
  f3.open();
  f6.open();



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

  // Javascript - Shareds communication variables
  var js_axis = gl.getUniformLocation(gl.program, 'point_axis');
  var js_position = gl.getAttribLocation(gl.program, 'point_position');
  var js_color = gl.getAttribLocation(gl.program, 'point_color');
  var js_axis_trasformation_matrix = gl.getUniformLocation(gl.program, 'axis_trasformation_matrix');
  var js_trasformation_matrix = gl.getUniformLocation(gl.program, 'trasformation_matrix');

  // Number of Primitives
  var cuantostriangulos = controls.cuantos;
  // Comprobación de seguridad por si se pide un número incoherente de inicio y triángulos
  if ((controls.primero + controls.cuantos) > 8)
    cuantostriangulos = controls.cuantos - controls.primero;
  var cuantosVertices = cuantostriangulos * 3;  // Tres vértices por cada triángulo que se pida representar

  // helper values useful to access vertexArray elements
  var FSIZE = vertexArray.BYTES_PER_ELEMENT;
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

  var indicesBuffer = gl.createBuffer();
  if (!indicesBuffer) {
	  console.log("Error creating indicesBuffer");
  }

  // Specify the color for clearing <canvas> html element
  gl.clearColor(0.8, 0.8, 0.8, 1.0);
  // Clear <canvas>
  gl.enable(gl.DEPTH_TEST);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Compose the requested transforms and get the resultant matrix
  var matriz  = new Matrix4();
  var matriz2  = new Matrix4(); // This can be named "world matrix" ?

  matriz.setIdentity();
  matriz2.setIdentity();

  if (controls.proj == 0) {
    matriz.ortho( controls.p_left, controls.p_right,
                  controls.p_bottom, controls.p_top,
                  controls.p_near, controls.p_far );
    matriz2.ortho( controls.p_left, controls.p_right,
                  controls.p_bottom, controls.p_top,
                  controls.p_near, controls.p_far );
  }

  if (controls.proj == 1) {
    matriz.frustum( controls.p_left, controls.p_right,
                    controls.p_bottom, controls.p_top,
                    controls.p_near, controls.p_far );
    matriz2.frustum( controls.p_left, controls.p_right,
                    controls.p_bottom, controls.p_top,
                    controls.p_near, controls.p_far );
  }

  if (controls.proj == 2) {
    matriz.perspective( controls.fov, 1,
                        controls.p_near, controls.p_far );
    matriz2.perspective( controls.fov, 1,
                        controls.p_near, controls.p_far );
  }


  matriz.lookAt( controls.camerax, controls.cameray, controls.cameraz,
                 0, 0, 0,
                 0, 1, 0 );
  matriz2.lookAt( initialPointOfView[0], initialPointOfView[1], initialPointOfView[2],
                 0, 0, 0,
                 0, 1, 0 );

  if (controls.dotranslate)
    matriz.translate(controls.translatex, controls.translatey, controls.translatez);

  if (controls.dorotate)
    matriz.rotate(controls.angle, controls.rotx, controls.roty, controls.rotz);

  //
  if (init_run == 1) {

    // Transform matrix computed only in second run
    var cadena_transformaciones = "";
    var num_orden_transfo = 1;

    var starting_operation = num_operaciones - start_operation;
    var ending_operation = starting_operation - only_n_operations + 1;

    // Value of only_n_operations has been set to the right number of operations in the button event handler
  	if (!change_order) {
  		for (var i = starting_operation; i >=  ending_operation ; i--) {
  			var operacion_requerida = secuencia_operaciones[i][0];
  			switch (operacion_requerida) {
  				case "t":
  					// Translation
  					var x_value = secuencia_operaciones[i][1] / 100.0;
  					var y_value = secuencia_operaciones[i][2] / 100.0;
            var z_value = secuencia_operaciones[i][3] / 100.0;
  					matriz.translate(x_value, y_value, z_value);
  					cadena_transformaciones += "M" + num_orden_transfo.toString() + " =  t " + "  " +
                    x_value.toString() + "  " + y_value.toString() + "  " + z_value.toString() + "<br><br>";
  					break;
  				case "s":
  					// Scale
  					var x_scale = secuencia_operaciones[i][4];
  					var y_scale = secuencia_operaciones[i][5];
            var z_scale = secuencia_operaciones[i][6];
  					matriz.scale(x_scale, y_scale, z_scale);
  					cadena_transformaciones += "M" + num_orden_transfo.toString() + " =  s " + "  " +
                    x_scale.toString() + "  " + y_scale.toString() + "  " + z_scale.toString() + "<br><br>";
  					break;
  				case "r":
  					// Rotate
  					var rot_angle = secuencia_operaciones[i][7];
  					var rot_x_axis = secuencia_operaciones[i][8];
  					var rot_y_axis = secuencia_operaciones[i][9];
            var rot_z_axis = secuencia_operaciones[i][10];
  					matriz.rotate(rot_angle, rot_x_axis, rot_y_axis, rot_z_axis);
  					cadena_transformaciones += "M" + num_orden_transfo.toString() + " =  r " + "  " +
                    rot_angle.toString() + "  " + rot_x_axis.toString() + "  " + rot_y_axis.toString() + "  " + rot_z_axis.toString() + "<br><br>";
  					break;
  				default:
  				// Format error
  					document.writeln("Wrong operation specifier, " + operacion_requerida);
  					return;
  			} // end switch
  			num_orden_transfo += 1;
  		} // end for

    } else { // else (!change_order)
      for (var i = ending_operation; i <=  starting_operation ; i++) {
        var operacion_requerida = secuencia_operaciones[i][0];
        switch (operacion_requerida) {
          case "t":
  					// Translation
  					var x_value = secuencia_operaciones[i][1] / 100.0;
  					var y_value = secuencia_operaciones[i][2] / 100.0;
            var z_value = secuencia_operaciones[i][3] / 100.0;
  					matriz.translate(x_value, y_value, z_value);
  					cadena_transformaciones += "M" + num_orden_transfo.toString() + " =  t " + "  " +
                    x_value.toString() + "  " + y_value.toString() + "  " + z_value.toString() + "<br><br>";
  					break;
  				case "s":
  					// Scale
  					var x_scale = secuencia_operaciones[i][4];
  					var y_scale = secuencia_operaciones[i][5];
            var z_scale = secuencia_operaciones[i][6];
  					matriz.scale(x_scale, y_scale, z_scale);
  					cadena_transformaciones += "M" + num_orden_transfo.toString() + " =  s " + "  " +
                    x_scale.toString() + "  " + y_scale.toString() + "  " + z_scale.toString() + "<br><br>";
  					break;
  				case "r":
  					// Rotate
  					var rot_angle = secuencia_operaciones[i][7];
  					var rot_x_axis = secuencia_operaciones[i][8];
  					var rot_y_axis = secuencia_operaciones[i][9];
            var rot_z_axis = secuencia_operaciones[i][10];
  					matriz.rotate(rot_angle, rot_x_axis, rot_y_axis, rot_z_axis);
  					cadena_transformaciones += "M" + num_orden_transfo.toString() + " =  r " + "  " +
                    rot_angle.toString() + "  " + rot_x_axis.toString() + "  " + rot_y_axis.toString() + "  " + rot_z_axis.toString() + "<br><br>";
  					break;
          default:
              // Format error
            document.writeln("Wrong operation specifier, " + operacion_requerida);
            return;
        } // end switch
        num_orden_transfo += 1;
      } // end for
    }
    //
    var e = matriz.elements;
    cadena_transformaciones +=
      "<table style=\"text-align: left;\" border=\"1\" cellpadding=\"2\" cellspacing=\"2\">"+
        "<tbody>"+
          "<tr><td>" + replace_dot(e[0]) + "</td><td>" + replace_dot(e[4]) + "</td><td>" + replace_dot(e[8]) + "</td><td>" + replace_dot(e[12]) + "</td></tr><br><br>" +
          "<tr><td>" + replace_dot(e[1]) + "</td><td>" + replace_dot(e[5]) + "</td><td>" + replace_dot(e[9]) + "</td><td>" + replace_dot(e[13]) + "</td></tr><br><br>" +
          "<tr><td>" + replace_dot(e[2]) + "</td><td>" + replace_dot(e[6]) + "</td><td>" + replace_dot(e[10]) + "</td><td>" + replace_dot(e[14]) + "</td></tr><br><br>" +
          "<tr><td>" + replace_dot(e[3]) + "</td><td>" + replace_dot(e[7]) + "</td><td>" + replace_dot(e[11]) + "</td><td>" + replace_dot(e[15]) + "</td></tr>"+
        "</tbody>"+
      "</table><br><br>";

    document.getElementById("mensajes").innerHTML = cadena_transformaciones;

  } else { // (init_run != 1)
    // Initialize number of operations and start operation
    num_operaciones = secuencia_operaciones.length;
    document.getElementById("numops").value = num_operaciones.toString();
    document.getElementById("numstart").value = "1";
		var cadena_secuencia = "";
		for (var i = 0; i < num_operaciones; i++){
			cadena_secuencia += "TR" + (num_operaciones - i).toString() +
                          " = [" + secuencia_operaciones [i] + "]<br>";
		}
		document.getElementById("mensajes").innerHTML = cadena_secuencia;
  }


  // Passing precalculated trasformation matrices to the vertex shader
  gl.uniformMatrix4fv(js_trasformation_matrix, false, matriz.elements);
  gl.uniformMatrix4fv(js_axis_trasformation_matrix, false, matriz2.elements);


  // Set axis buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, axisBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, axis, gl.STATIC_DRAW);
    gl.vertexAttribPointer(js_position, 3, gl.FLOAT, false, FSIZE_AXIS * 6, 0);
    gl.enableVertexAttribArray(js_position);
    gl.vertexAttribPointer(js_color, 3, gl.FLOAT, false, FSIZE_AXIS * 6, FSIZE_AXIS * 3);
    gl.enableVertexAttribArray(js_color);
    gl.uniform1i(js_axis, 1);

    // Draws cartesian axis
    gl.drawArrays(gl.LINES, 0, 36);
    gl.uniform1i(js_axis, 0);

    // Set vertex buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexArray, gl.STATIC_DRAW);
    gl.vertexAttribPointer(js_position, 3, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(js_position);
    gl.vertexAttribPointer(js_color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(js_color);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, vertexIndexArray, gl.STATIC_DRAW);

    // Draw Primitives
    gl.drawElements(gl.TRIANGLES, cuantosVertices, gl.UNSIGNED_BYTE, controls.primero * 3);


    // Cleanup before exiting
    gl.disableVertexAttribArray(js_position);
    gl.disableVertexAttribArray(js_color);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.deleteBuffer(vertexBuffer);
    gl.deleteBuffer(axisBuffer);

} // end function draw_triangle


function alltogether() {

    init_run = 1;
    only_n_operations = secuencia_operaciones.length; // Execute all operations specified in array
    start_operation = 1;  // Start from first operation in array
    if (document.getElementById("inverse_order").checked)
        change_order = true;
    draw_triangles();
}


function partialexec() {

  init_run = 1;

  // Execute only the number of operations specified in input field
  only_n_operations = parseInt(document.getElementById("numops").value);

  if ((only_n_operations < 1) || (only_n_operations > num_operaciones)) {
      document.writeln("Invalid number of operations, " + only_n_operations.toString());
      return;
  }

  // Start at operation specified in input field
  start_operation = parseInt(document.getElementById("numstart").value);

  if (start_operation < 1) {
    document.writeln("Invalid value for start operation, " + start_operation.toString());
    return;
  } else if ((start_operation + only_n_operations - 1) > secuencia_operaciones.length) {
      document.writeln("Invalid combination of values  for start operation (" +
                       (start_operation).toString() + ") and only_n_operations (" +
                       only_n_operations.toString() + ")");
      return;
  }
  if (document.getElementById("inverse_order").checked)
    change_order = true;

  draw_triangles();

}


function replace_dot(e) {

	//return e.toString().replace('.',',');
  return e.toString();

}
