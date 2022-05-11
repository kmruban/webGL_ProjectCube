"use strict";

var canvas;
var gl;

var NumVertices  = 36;

var points = [];
var colors = [];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis = 0;
var bool = true;
var faces = false;
var fill = true;
var party = false;

var theta = [ 0, 30, 30 ];
var thetaLoc;

var modelViewMatrix;
var modelViewMatrixLoc; 

window.onload = function init()
{
  canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    colorCube();

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.8, 0.8, 0.8, 1.0 );

    gl.enable(gl.DEPTH_TEST);
    


    //
    //  Load shaders and initialize attribute buffers
    //
    
///////// CUBE 1
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
//cBuffer
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );
//vBuffer
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
	thetaLoc = gl.getUniformLocation(program, "theta"); 

	
	// Initialize event handlers
	document.getElementById("pause").onclick = function () {
        bool = !bool;
    };
    
    document.getElementById("faces").onclick = function () {
        faces = !faces;
    };
    
    document.getElementById("fill").onclick = function () {
        fill = !fill;
    };
    
    document.getElementById("party").onclick = function () {
        party = !party;
    };
    
	
	render();
}

function colorCube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}

function quad(a, b, c, d)
{
 	var vertices = [
        vec4( -0.2, -0.2,  0.2, 1.0 ),
        vec4( -0.2,  0.2,  0.2, 1.0 ),
        vec4(  0.2,  0.2,  0.2, 1.0 ),
        vec4(  0.2, -0.2,  0.2, 1.0 ),
        vec4( -0.2, -0.2, -0.2, 1.0 ),
        vec4( -0.2,  0.2, -0.2, 1.0 ),
        vec4(  0.2,  0.2, -0.2, 1.0 ),
        vec4(  0.2, -0.2, -0.2, 1.0 )
    ];
    
    
    var vertexColors = [
        [ 0.0414, 0.0508, 0.230, 1.0 ],  // black
        [ 0.262, 0.469, 0.690, 1.0 ],  // red
        [ 0.0388, 0.489, 0.970, 1.0 ],  // green
        [ 0.319, 0.348, 0.910, 1.0 ],  // blue
        [ 0.558, 0.738, 0.930, 1.0 ],  // red
        [ 0.0414, 0.0508, 0.230, 1.0 ],  // magenta
        [ 0.248, 0.606, 0.990, 1.0 ],  // yellow
        [ 0.0580, 0.310, 0.580, 1.0 ]   // white
    ];

    // We need to partition the quad into two triangles in order for
    // WebGL to be able to render it.  In this case, we create two
    // triangles from the quad indices

    var indices = [ a, b, c, a, c, d ];

	if (faces == true){
		for ( var i = 0; i < indices.length; ++i ) {
        points.push( vertices[indices[i]] );
        colors.push( vertexColors[indices[i]] );
        }
	} else if (faces == false) {
		for ( var i = 0; i < indices.length; ++i ) {
        points.push( vertices[indices[i]] );
        colors.push( vertexColors[a] );
        }
    }
    
	

}



function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if (bool == true){
    	theta[axis] += 1 ;
    } else {
    	theta[axis] += 0;
    }
    gl.uniform3fv(thetaLoc, theta);
    
    if (party == true){
    	// DRAWS 9 SQUARES
    	// TOP LEFT
		modelViewMatrix = mat4();
		modelViewMatrix = mult(modelViewMatrix, translate(-0.65,0.65,0));
		modelViewMatrix = mult(modelViewMatrix, rotate(theta[axis], 6.3, 0.5, 0.9));	
		modelViewMatrix = mult(modelViewMatrix, scalem(0.7,0.8,0.8));
		gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );

		if (fill == true){
			gl.drawArrays( gl.TRIANGLES, 0, NumVertices);
		} else {
			gl.drawArrays( gl.LINES, 0, NumVertices);
		}	
    
    	// MIDDLE LEFT
		modelViewMatrix = mat4();
		modelViewMatrix = mult(modelViewMatrix, translate(-0.65,0.0,0));
		modelViewMatrix = mult(modelViewMatrix, rotate(theta[axis], 1, 0.5, 1));	
		modelViewMatrix = mult(modelViewMatrix, scalem(0.22,0.22,0.5));
		gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );

		if (fill == true){
			gl.drawArrays( gl.TRIANGLES, 0, NumVertices);
		} else {
			gl.drawArrays( gl.LINES, 0, NumVertices);
		}
    
    	// BOTTOM LEFT
		modelViewMatrix = mat4();
		modelViewMatrix = mult(modelViewMatrix, translate(-0.65,-0.65,0));
		modelViewMatrix = mult(modelViewMatrix, rotate(theta[axis], 100, 1, 1));	
		modelViewMatrix = mult(modelViewMatrix, scalem(0.77,0.77,0.59));
		gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );

		if (fill == true){
			gl.drawArrays( gl.TRIANGLES, 0, NumVertices);
		} else {
			gl.drawArrays( gl.LINES, 0, NumVertices);
		}
    
    	// BOTTOM MIDDLE
		modelViewMatrix = mat4();
		modelViewMatrix = mult(modelViewMatrix, translate(0.0,-0.65,0));
		modelViewMatrix = mult(modelViewMatrix, rotate(theta[axis], 1, 0, 0.7));	
		modelViewMatrix = mult(modelViewMatrix, scalem(0.25,0.3,0.65));
		gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );

		if (fill == true){
			gl.drawArrays( gl.TRIANGLES, 0, NumVertices);
		} else {
			gl.drawArrays( gl.LINES, 0, NumVertices);
		}
    
    	// BOTTOM RIGHT
		modelViewMatrix = mat4();
		modelViewMatrix = mult(modelViewMatrix, translate(0.65,-0.65,0));
		modelViewMatrix = mult(modelViewMatrix, rotate(theta[axis], 1, 1, 0));	
		modelViewMatrix = mult(modelViewMatrix, scalem(0.85,0.85,0.55));
		gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );

		if (fill == true){
			gl.drawArrays( gl.TRIANGLES, 0, NumVertices);
		} else {
			gl.drawArrays( gl.LINES, 0, NumVertices);
		}
    	
    	// MIDDLE RIGHT
		modelViewMatrix = mat4();
		modelViewMatrix = mult(modelViewMatrix, translate(0.65,0.0,0));
		modelViewMatrix = mult(modelViewMatrix, rotate(theta[axis], 1, 1, 0));	
		modelViewMatrix = mult(modelViewMatrix, scalem(0.3,0.4,0.75));
		gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );

		if (fill == true){
			gl.drawArrays( gl.TRIANGLES, 0, NumVertices);
		} else {
			gl.drawArrays( gl.LINES, 0, NumVertices);
		}
    
    	// TOP RIGHT
		modelViewMatrix = mat4();
		modelViewMatrix = mult(modelViewMatrix, translate(0.65,0.65,0));
		modelViewMatrix = mult(modelViewMatrix, rotate(theta[axis], 30, 0, 1));	
		modelViewMatrix = mult(modelViewMatrix, scalem(0.75,0.75,0.75));
		gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );

		if (fill == true){
			gl.drawArrays( gl.TRIANGLES, 0, NumVertices);
		} else {
			gl.drawArrays( gl.LINES, 0, NumVertices);
		}


		// MIDDLE TOP
		modelViewMatrix = mat4();
		modelViewMatrix = mult(modelViewMatrix, translate(0.0,0.65,0));
		modelViewMatrix = mult(modelViewMatrix, rotate(theta[axis], 1, 0, 1));	
		modelViewMatrix = mult(modelViewMatrix, scalem(0.35,0.35,0.45));	
		gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );

		if (fill == true){
			gl.drawArrays( gl.TRIANGLES, 0, NumVertices);
		} else {
			gl.drawArrays( gl.LINES, 0, NumVertices);
		}

		// MIDDLE
		modelViewMatrix = mat4();
		modelViewMatrix = mult(modelViewMatrix, rotate(theta[axis], 100, 25, 50));
		gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );

		if (fill == true){
			gl.drawArrays( gl.TRIANGLES, 0, NumVertices);
		} else {
			gl.drawArrays( gl.LINES, 0, NumVertices);
		}
    } else {
    	//DRAWS 1 SQUARE
    	modelViewMatrix = mat4();
    	modelViewMatrix = mult(modelViewMatrix, scalem(2.5,2.5,2.5));
    	//rotate around x-axis
    	modelViewMatrix = mult(modelViewMatrix, rotate(theta[axis], 1, 0, 0));
		gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    	if (fill == true){
			gl.drawArrays( gl.TRIANGLES, 0, NumVertices);
		} else {
			gl.drawArrays( gl.LINE_STRIP, 0, NumVertices);
		}
    }
    gl.uniform3fv(thetaLoc, theta);
    
	

    requestAnimFrame( render );
    
    
    
    
}





